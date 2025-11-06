/**
 * Progress Planner MCP Server for Angie AI Integration
 *
 * This MCP (Model Context Protocol) server enables Angie AI to interact with Progress Planner tasks.
 * It provides tools for listing active tasks, completed tasks, and completing tasks.
 *
 * @package Progress_Planner
 */

import { AngieMcpSdk } from '@elementor/angie-sdk';
import {
  McpServer,
  ListToolsRequestSchema,
  CallToolRequestSchema,
} from '@elementor/angie-sdk';

// Get WordPress site configuration from localized script data
declare const progressPlannerAngie: {
  restUrl: string;
  nonce: string;
  siteUrl: string;
  pluginUrl: string;
};

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

/**
 * Fetch data from WordPress REST API with authentication
 */
async function fetchFromWordPress(
  endpoint: string,
  options: RequestInit = {}
): Promise<any> {
  const url = `${progressPlannerAngie.restUrl}${endpoint}`;

  const defaultOptions: RequestInit = {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-WP-Nonce': progressPlannerAngie.nonce,
    },
  };

  const response = await fetch(url, { ...defaultOptions, ...options });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: 'Failed to fetch from WordPress',
    }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

/**
 * Initialize MCP Server for Progress Planner
 */
async function initializeServer() {
  // Create MCP server instance
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

  // Register available tools
  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [
      {
        name: 'list-active-tasks',
        description:
          'Lists all active Progress Planner tasks that the user needs to complete. ' +
          'These are recommendations with status "publish" that are currently visible to the user. ' +
          'Use this to see what tasks are pending or to help the user understand their to-do list.',
        inputSchema: {
          type: 'object',
          properties: {},
          required: [],
        },
      },
      {
        name: 'list-completed-tasks',
        description:
          'Lists all completed Progress Planner tasks. ' +
          'These are recommendations that have been marked as done (status "trash"). ' +
          'Use this to see what the user has already accomplished or to review their progress history.',
        inputSchema: {
          type: 'object',
          properties: {},
          required: [],
        },
      },
      {
        name: 'complete-task',
        description:
          'Completes a specific Progress Planner task. ' +
          'For the "Set blog description" task (core-blogdescription), you must provide the tagline text in the "value" parameter. ' +
          'For other tasks, only the task_id is required. ' +
          'This will mark the task as completed and may perform associated actions (like updating settings).',
        inputSchema: {
          type: 'object',
          properties: {
            task_id: {
              type: 'string',
              description:
                'The unique identifier of the task to complete (e.g., "core-blogdescription", "content-create"). ' +
                'Use list-active-tasks to see available task IDs.',
            },
            value: {
              type: 'string',
              description:
                'The value to set for tasks that require input. ' +
                'For example, when completing the "Set blog description" task, provide the tagline text here.',
            },
          },
          required: ['task_id'],
        },
      },
    ],
  }));

  // Handle tool execution
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
      switch (name) {
        case 'list-active-tasks': {
          const data: TasksResponse = await fetchFromWordPress('/tasks');

          return {
            content: [
              {
                type: 'text',
                text: formatTasksList(data.tasks, 'Active'),
              },
            ],
          };
        }

        case 'list-completed-tasks': {
          const data: TasksResponse = await fetchFromWordPress(
            '/tasks/completed'
          );

          return {
            content: [
              {
                type: 'text',
                text: formatTasksList(data.tasks, 'Completed'),
              },
            ],
          };
        }

        case 'complete-task': {
          const taskId = args.task_id as string;
          const value = args.value as string | undefined;

          if (!taskId) {
            throw new Error('task_id parameter is required');
          }

          const requestBody: any = { task_id: taskId };
          if (value) {
            requestBody.value = value;
          }

          const data: CompleteTaskResponse = await fetchFromWordPress(
            '/tasks/complete',
            {
              method: 'POST',
              body: JSON.stringify(requestBody),
            }
          );

          let message = data.message;
          if (data.blog_description) {
            message += `\n\nNew tagline: "${data.blog_description}"`;
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

        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error: ${
              error instanceof Error ? error.message : 'Unknown error occurred'
            }`,
          },
        ],
        isError: true,
      };
    }
  });

  // Register server with Angie SDK
  const sdk = new AngieMcpSdk();
  await sdk.registerServer({
    name: 'progress-planner',
    version: '1.0.0',
    description:
      'Manage Progress Planner tasks, including viewing active and completed tasks, and completing tasks through AI assistance.',
    server,
  });

  console.log('Progress Planner MCP Server initialized successfully');
}

/**
 * Format tasks list for display
 */
function formatTasksList(tasks: Task[], listType: string): string {
  if (!tasks || tasks.length === 0) {
    return `No ${listType.toLowerCase()} tasks found.`;
  }

  let output = `## ${listType} Tasks (${tasks.length})\n\n`;

  tasks.forEach((task, index) => {
    output += `### ${index + 1}. ${task.title}\n`;
    output += `- **ID**: ${task.id}\n`;
    output += `- **Description**: ${task.description}\n`;
    output += `- **Priority**: ${task.priority}\n`;
    output += `- **Status**: ${task.status}\n`;
    if (task.url) {
      output += `- **Action URL**: ${task.url}\n`;
    }
    output += '\n';
  });

  return output;
}

// Initialize the server when the script loads
if (typeof window !== 'undefined' && progressPlannerAngie) {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initializeServer().catch((error) => {
        console.error('Failed to initialize Progress Planner MCP Server:', error);
      });
    });
  } else {
    initializeServer().catch((error) => {
      console.error('Failed to initialize Progress Planner MCP Server:', error);
    });
  }
}

export { initializeServer };
