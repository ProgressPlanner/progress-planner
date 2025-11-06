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
	blog_description?: string;
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
 * Create Progress Planner MCP Server
 */
function createProgressPlannerMcpServer() {
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

	// Register tool: List active tasks
	server.tool(
		'list-active-tasks',
		'Lists all active Progress Planner tasks that the user needs to complete. ' +
			'These are recommendations with status "publish" that are currently visible to the user. ' +
			'Use this to see what tasks are pending or to help the user understand their to-do list.',
		{},
		async () => {
			const response = await makeApiRequest( '/tasks' );
			const data = response as unknown as TasksResponse;
			return {
				content: [
					{
						type: 'text',
						text: formatTasksList( data.tasks, 'Active' ),
					},
				],
			};
		}
	);

	// Register tool: List completed tasks
	server.tool(
		'list-completed-tasks',
		'Lists all completed Progress Planner tasks. ' +
			'These are recommendations that have been marked as done (status "trash"). ' +
			'Use this to see what the user has already accomplished or to review their progress history.',
		{},
		async () => {
			const response = await makeApiRequest( '/tasks/completed' );
			const data = response as unknown as TasksResponse;
			return {
				content: [
					{
						type: 'text',
						text: formatTasksList( data.tasks, 'Completed' ),
					},
				],
			};
		}
	);

	// Register tool: Complete a task
	server.tool(
		'complete-task',
		'Completes a specific Progress Planner task. ' +
			'For the "Set blog description" task (core-blogdescription), you must provide the tagline text in the "value" parameter. ' +
			'For other tasks, only the task_id is required. ' +
			'This will mark the task as completed and may perform associated actions (like updating settings).',
		{
			task_id: z
				.string()
				.describe(
					'The unique identifier of the task to complete (e.g., "core-blogdescription", "content-create"). ' +
						'Use list-active-tasks to see available task IDs.'
				),
			value: z
				.string()
				.optional()
				.describe(
					'The value to set for tasks that require input. ' +
						'For example, when completing the "Set blog description" task, provide the tagline text here.'
				),
		},
		async ( { task_id, value }: { task_id: string; value?: string } ) => {
			const requestBody: Record< string, unknown > = { task_id };
			if ( value ) {
				requestBody.value = value;
			}

			const response = await makeApiRequest(
				'/tasks/complete',
				requestBody
			);
			const data = response as unknown as CompleteTaskResponse;

			let message = data.message;
			if ( data.blog_description ) {
				message += `\n\nNew tagline: "${ data.blog_description }"`;
			}

			return {
				content: [
					{
						type: 'text',
						text: message,
					},
				],
			};
		}
	);

	return server;
}

/**
 * Initialize MCP Server for Progress Planner
 */
const init = async () => {
	try {
		const server = createProgressPlannerMcpServer();
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
 * @param tasks
 * @param listType
 */
function formatTasksList( tasks: Task[], listType: string ): string {
	if ( ! tasks || tasks.length === 0 ) {
		return `No ${ listType.toLowerCase() } tasks found.`;
	}

	let output = `## ${ listType } Tasks (${ tasks.length })\n\n`;

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
