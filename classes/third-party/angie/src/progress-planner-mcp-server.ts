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
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		console?: Console;
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

/**
 * JSON Schema property definition with support for enum, default values, and nested schemas
 */
interface JsonSchemaProperty {
	type: string;
	description?: string;
	enum?: unknown[];
	default?: unknown;
	items?:
		| JsonSchemaProperty
		| {
				type: string;
				properties?: Record< string, JsonSchemaProperty >;
				required?: string[];
		  };
	properties?: Record< string, JsonSchemaProperty >;
	required?: string[];
}

interface ToolDefinition {
	name: string;
	description: string;
	endpoint: string;
	method: 'GET' | 'POST';
	responseFormatter?: string;
	inputSchema: {
		type: string;
		properties?: Record< string, JsonSchemaProperty >;
		required?: string[];
	};
	outputSchema?: {
		type: string;
		properties?: Record< string, JsonSchemaProperty >;
		required?: string[];
	};
}

interface ToolsResponse {
	success: boolean;
	tools: ToolDefinition[];
}

export type ApiResponse = Record< string, unknown >;

/**
 * Debug logging utility that works in iframe context
 * Attempts to log to parent window if accessible, otherwise logs to current window
 *
 * @param message The debug message to log
 * @param data    Optional data to include in the log
 */
function debugLog( message: string, data?: unknown ): void {
	if ( typeof window === 'undefined' ) {
		return;
	}

	const timestamp = new Date().toISOString();
	const logMessage = `[Progress Planner MCP ${ timestamp }] ${ message }`;
	const logData = data ? { message, data } : { message };

	// Try to log to parent window first (if in iframe)
	try {
		if ( window.parent && window.parent !== window ) {
			// Check if parent window is accessible (same-origin)
			const parentWindow = window.parent as unknown as Window & {
				console?: Console;
				__progressPlannerDebug?: unknown[];
			};
			// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
			if ( parentWindow.console ) {
				parentWindow.console.log( logMessage, data || '' );
				// Also store in parent window for inspection
				if ( ! parentWindow.__progressPlannerDebug ) {
					parentWindow.__progressPlannerDebug = [];
				}
				parentWindow.__progressPlannerDebug.push( {
					timestamp,
					...logData,
				} );
				return; // Successfully logged to parent, exit early
			}
		}
	} catch ( error ) {
		// Cross-origin restriction - parent window not accessible
		// Fall through to log in current window
	}

	// Fallback: log to current window
	const currentWindow = window as unknown as Window & {
		console?: Console;
		__progressPlannerDebug?: unknown[];
	};
	if ( currentWindow.console ) {
		currentWindow.console.log( logMessage, data || '' );
	}

	// Store in current window for inspection
	if ( ! currentWindow.__progressPlannerDebug ) {
		currentWindow.__progressPlannerDebug = [];
	}
	currentWindow.__progressPlannerDebug.push( {
		timestamp,
		...logData,
	} );
}

/**
 * Get parent window if accessible, otherwise return current window
 * This function is available for future use if needed to interact with parent window
 *
 * @return The parent window or current window
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getParentWindow(): Window {
	if ( typeof window === 'undefined' ) {
		throw new Error( 'Window object is not available' );
	}

	try {
		if ( window.parent && window.parent !== window ) {
			// Try to access parent window (will throw if cross-origin)
			// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
			const parentDoc = window.parent.document;
			if ( parentDoc ) {
				return window.parent;
			}
		}
	} catch ( error ) {
		// Cross-origin restriction - fall through to return current window
	}

	return window;
}

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
 * Convert a simple JSON Schema type to a Zod type
 *
 * @param type The JSON Schema type
 * @return Zod type
 */
function convertSimpleTypeToZod( type: string ): z.ZodTypeAny {
	switch ( type ) {
		case 'string':
			return z.string();
		case 'number':
			return z.number();
		case 'boolean':
			return z.boolean();
		default:
			return z.unknown();
	}
}

/**
 * Convert JSON Schema properties to Zod schema object
 *
 * @param properties The JSON Schema properties to convert
 * @param required   Array of required property names
 * @return Zod schema object
 */
function jsonSchemaToZod(
	properties: Record< string, JsonSchemaProperty >,
	required: string[] = []
): Record< string, z.ZodTypeAny > {
	const zodSchema: Record< string, z.ZodTypeAny > = {};

	for ( const [ key, prop ] of Object.entries( properties ) ) {
		let zodType: z.ZodTypeAny;

		// Handle enum constraint if present
		if ( prop.enum && Array.isArray( prop.enum ) && prop.enum.length > 0 ) {
			// Create enum schema based on the first enum value type
			const firstValue = prop.enum[ 0 ];
			if ( typeof firstValue === 'string' ) {
				zodType = z.enum( prop.enum as [ string, ...string[] ] );
			} else {
				// For numbers, booleans, or mixed types, use union with literals
				const literals = prop.enum.map( ( val ) => {
					if (
						typeof val === 'string' ||
						typeof val === 'number' ||
						typeof val === 'boolean'
					) {
						return z.literal( val );
					}
					return z.literal( val as string | number | boolean );
				} ) as [
					z.ZodLiteral< string | number | boolean >,
					z.ZodLiteral< string | number | boolean >,
					...z.ZodLiteral< string | number | boolean >[],
				];
				zodType = z.union( literals );
			}
		} else {
			// Handle regular type-based schemas
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
					// Handle array with items schema
					if ( prop.items ) {
						if (
							typeof prop.items === 'object' &&
							'type' in prop.items
						) {
							if (
								prop.items.type === 'object' &&
								prop.items.properties
							) {
								// Recursively convert nested object schema
								const itemSchema = z.object(
									jsonSchemaToZod(
										prop.items.properties,
										prop.items.required || []
									)
								);
								zodType = z.array( itemSchema );
							} else {
								// Simple type in items
								const itemType = convertSimpleTypeToZod(
									prop.items.type
								);
								zodType = z.array( itemType );
							}
						} else {
							// Fallback for complex items
							zodType = z.array( z.unknown() );
						}
					} else {
						zodType = z.array( z.unknown() );
					}
					break;
				case 'object':
					// Handle object with properties schema
					if ( prop.properties ) {
						zodType = z.object(
							jsonSchemaToZod(
								prop.properties,
								prop.required || []
							)
						);
					} else {
						zodType = z.record( z.unknown() );
					}
					break;
				default:
					zodType = z.unknown();
			}
		}

		// Add description if provided
		if ( prop.description ) {
			zodType = zodType.describe( prop.description );
		}

		// Add default value if provided
		if ( prop.default !== undefined ) {
			zodType = zodType.default( prop.default );
		}

		// Make optional if not in required array (unless default is set, which makes it effectively optional)
		if ( ! required.includes( key ) && prop.default === undefined ) {
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
	): Promise<
		| { content: Array< { type: 'text'; text: string } > }
		| {
				content: Array< { type: 'text'; text: string } >;
				structuredContent: Record< string, unknown >;
		  }
	> => {
		// Prepare request body for POST requests
		const requestBody =
			tool.method === 'POST'
				? ( args as Record< string, unknown > )
				: undefined;

		// Make API request
		const response = await makeApiRequest( tool.endpoint, requestBody );

		// Format response using formatter from tool definition
		const text = formatResponse( response, tool.responseFormatter );

		// If outputSchema is defined, return structured content
		if ( tool.outputSchema ) {
			return {
				content: [
					{
						type: 'text' as const,
						text,
					},
				],
				structuredContent: response as Record< string, unknown >,
			};
		}

		// Otherwise, return only text content
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

		const outputZodSchema = tool.outputSchema?.properties
			? jsonSchemaToZod(
					tool.outputSchema.properties,
					tool.outputSchema.required || []
			  )
			: undefined;

		const handler = createToolHandler( tool );

		// Register tool with dynamic schema and handler
		// The MCP SDK's tool() method signature: tool(name, description, inputSchema, handler, options?)
		// We pass outputSchema in options if available
		if ( outputZodSchema ) {
			// @ts-expect-error - The MCP SDK may support outputSchema as 5th parameter or in options
			server.tool( tool.name, tool.description, zodSchema, handler, {
				outputSchema: outputZodSchema,
			} );
		} else {
			server.tool( tool.name, tool.description, zodSchema, handler );
		}
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
				'Manage Progress Planner recommendations, including viewing active and completed recommendations, and completing recommendations through AI assistance.',
			server,
		} );

		debugLog(
			'Progress Planner MCP Server registered with Angie successfully'
		);
	} catch ( error ) {
		debugLog( 'Failed to register Progress Planner MCP Server with Angie', {
			error,
		} );
		if ( typeof window !== 'undefined' && window.console ) {
			window.console.error(
				'Failed to register Progress Planner MCP Server with Angie:',
				error
			);
		}
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
