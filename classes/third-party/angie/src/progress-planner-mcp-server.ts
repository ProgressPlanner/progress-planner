/**
 * Progress Planner MCP Server for Angie AI Integration
 *
 * This MCP (Model Context Protocol) server enables Angie AI to interact with Progress Planner tasks.
 * It provides tools for listing active tasks, completed tasks, and completing tasks.
 */

import { AngieMcpSdk } from '@elementor/angie-sdk';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

// TypeScript interfaces for window globals
interface WpApiSettings {
	root: string;
	nonce?: string;
}

interface ProgressPlannerAngie {
	restUrl: string;
	nonce: string;
	siteUrl: string;
	pluginUrl: string;
}

declare global {
	interface Window {
		wpApiSettings?: WpApiSettings;
		progressPlannerAngie?: ProgressPlannerAngie;
	}
}

// Get WordPress site configuration from localized script data
declare const progressPlannerAngie: ProgressPlannerAngie;

interface Task {
	id: string;
	title: string;
	description: string;
	url: string;
	priority: number;
	status: string;
}

interface TasksResponse {
	success: boolean;
	count: number;
	tasks: Task[];
}

interface CompleteTaskResponse {
	success: boolean;
	message: string;
	task_id: string;
	new_value?: string;
}

interface ToolDefinition {
	name: string;
	description: string;
	endpoint: string;
	method: 'GET' | 'POST';
	responseFormatter?: string;
	inputSchema: {
		type: string;
		properties?: Record<
			string,
			{
				type: string;
				description?: string;
			}
		>;
		required?: string[];
	};
}

interface ToolsResponse {
	success: boolean;
	tools: ToolDefinition[];
}

export type ApiResponse = Record< string, unknown >;

/**
 * Make API request to WordPress REST API with authentication
 *
 * @param endpoint The REST API endpoint (without base URL)
 * @param data     The data to send (for POST requests)
 */
async function makeApiRequest(
	endpoint: string,
	data?: Record< string, unknown >
): Promise< ApiResponse > {
	const url = progressPlannerAngie.restUrl + endpoint;

	const options: RequestInit = {
		method: data ? 'POST' : 'GET',
		headers: {
			'Content-Type': 'application/json',
			'X-WP-Nonce': progressPlannerAngie.nonce || '',
		},
	};

	if ( data ) {
		options.body = JSON.stringify( data );
	}

	const response = await fetch( url, options );

	if ( ! response.ok ) {
		throw new Error( `HTTP error! status: ${ response.status }` );
	}

	return await response.json();
}

/**
 * Convert JSON Schema properties to Zod schema object
 *
 * @param properties The JSON Schema properties to convert
 * @param required   Array of required property names
 * @return Zod schema object
 */
function jsonSchemaToZod(
	properties: Record< string, { type: string; description?: string } >,
	required: string[] = []
): Record< string, z.ZodTypeAny > {
	const zodSchema: Record< string, z.ZodTypeAny > = {};

	for ( const [ key, prop ] of Object.entries( properties ) ) {
		let zodType: z.ZodTypeAny;

		switch ( prop.type ) {
			case 'string':
				zodType = z.string();
				break;
			case 'number':
				zodType = z.number();
				break;
			case 'boolean':
				zodType = z.boolean();
				break;
			case 'array':
				zodType = z.array( z.unknown() );
				break;
			case 'object':
				zodType = z.record( z.unknown() );
				break;
			default:
				zodType = z.unknown();
		}

		// Add description if provided
		if ( prop.description ) {
			zodType = zodType.describe( prop.description );
		}

		// Make optional if not in required array
		if ( ! required.includes( key ) ) {
			zodType = zodType.optional();
		}

		zodSchema[ key ] = zodType;
	}

	return zodSchema;
}

/**
 * Format response based on formatter type from PHP
 *
 * @param response  The API response data
 * @param formatter The formatter type from tool definition
 * @return Formatted text string
 */
function formatResponse( response: ApiResponse, formatter?: string ): string {
	if ( ! formatter ) {
		// Default: JSON format
		return JSON.stringify( response, null, 2 );
	}

	switch ( formatter ) {
		case 'format_recommendations_list': {
			const data = response as unknown as TasksResponse;
			return formatTasksList( data.tasks, 'Tasks' );
		}

		case 'format_complete_recommendation': {
			const data = response as unknown as CompleteTaskResponse;
			let message = data.message;
			if ( data.new_value ) {
				message += `\n\nNew value: "${ data.new_value }"`;
			}
			return message;
		}

		default:
			// Fallback to JSON
			return JSON.stringify( response, null, 2 );
	}
}

/**
 * Create a generic tool handler that uses the endpoint from tool definition
 *
 * @param tool The tool definition containing endpoint and method
 * @return The tool handler function
 */
function createToolHandler( tool: ToolDefinition ) {
	return async (
		args: Record< string, unknown >,
		_extra?: unknown
	): Promise< { content: Array< { type: 'text'; text: string } > } > => {
		// Prepare request body for POST requests
		const requestBody =
			tool.method === 'POST'
				? ( args as Record< string, unknown > )
				: undefined;

		// Make API request
		const response = await makeApiRequest( tool.endpoint, requestBody );

		// Format response using formatter from tool definition
		const text = formatResponse( response, tool.responseFormatter );

		return {
			content: [
				{
					type: 'text' as const,
					text,
				},
			],
		};
	};
}

/**
 * Create Progress Planner MCP Server
 */
async function createProgressPlannerMcpServer() {
	const server = new McpServer(
		{
			name: 'progress-planner',
			version: '1.0.0',
		},
		{
			capabilities: {
				tools: {},
			},
		}
	);

	// Fetch tool definitions from the API
	const toolsResponse = await makeApiRequest( '/tools' );
	const toolsData = toolsResponse as unknown as ToolsResponse;

	if ( ! toolsData.success || ! toolsData.tools ) {
		throw new Error( 'Failed to fetch tool definitions from API' );
	}

	// Register each tool dynamically
	for ( const tool of toolsData.tools ) {
		const zodSchema = tool.inputSchema.properties
			? jsonSchemaToZod(
					tool.inputSchema.properties,
					tool.inputSchema.required || []
			  )
			: {};

		const handler = createToolHandler( tool );

		// Register tool with dynamic schema and handler
		server.tool( tool.name, tool.description, zodSchema, handler );
	}

	return server;
}

/**
 * Initialize MCP Server for Progress Planner
 */
const init = async () => {
	try {
		const server = await createProgressPlannerMcpServer();
		const sdk = new AngieMcpSdk();

		await sdk.registerServer( {
			name: 'progress-planner',
			version: '1.0.0',
			description:
				'Manage Progress Planner tasks, including viewing active and completed tasks, and completing tasks through AI assistance.',
			server,
		} );

		console.log(
			'Progress Planner MCP Server registered with Angie successfully'
		);
	} catch ( error ) {
		console.error(
			'Failed to register Progress Planner MCP Server with Angie:',
			error
		);
	}
};

/**
 * Format tasks list for display
 *
 * @param tasks    Array of tasks to format
 * @param listType Type label for the list (e.g., "Tasks", "Active Tasks")
 * @return Formatted markdown string
 */
function formatTasksList( tasks: Task[], listType: string ): string {
	if ( ! tasks || tasks.length === 0 ) {
		return `No ${ listType.toLowerCase() } found.`;
	}

	let output = `## ${ listType } (${ tasks.length })\n\n`;

	tasks.forEach( ( task, index ) => {
		output += `### ${ index + 1 }. ${ task.title }\n`;
		output += `- **ID**: ${ task.id }\n`;
		output += `- **Description**: ${ task.description }\n`;
		output += `- **Priority**: ${ task.priority }\n`;
		output += `- **Status**: ${ task.status }\n`;
		if ( task.url ) {
			output += `- **Action URL**: ${ task.url }\n`;
		}
		output += '\n';
	} );

	return output;
}

// Initialize the server when the script loads
if ( typeof window !== 'undefined' && progressPlannerAngie ) {
	// Wait for DOM to be ready
	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', () => {
			init().catch( ( error ) => {
				console.error(
					'Failed to initialize Progress Planner MCP Server:',
					error
				);
			} );
		} );
	} else {
		init().catch( ( error ) => {
			console.error(
				'Failed to initialize Progress Planner MCP Server:',
				error
			);
		} );
	}
}

export { init as initializeServer };
