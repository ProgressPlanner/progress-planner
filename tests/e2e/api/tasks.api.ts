import { Page, APIRequestContext } from '@playwright/test';

export interface Task {
  ID: number;
  post_name: string;
  post_status: 'publish' | 'pending' | 'future' | 'trash';
  post_title: string;
  post_date: string;
}

/**
 * REST API client for Progress Planner tasks.
 * Uses the authenticated session from the page context.
 */
export class TasksApi {
  private readonly page: Page;
  private readonly request: APIRequestContext;
  private readonly baseUrl: string;

  constructor(page: Page, request: APIRequestContext) {
    this.page = page;
    this.request = request;
    this.baseUrl = process.env.WORDPRESS_URL || 'http://localhost:8080';
  }

  /**
   * Get cookies from the page context for authenticated requests.
   */
  private async getAuthCookies(): Promise<Array<{ name: string; value: string }>> {
    return await this.page.context().cookies();
  }

  /**
   * Make an authenticated GET request to the REST API.
   */
  private async get<T>(endpoint: string): Promise<T> {
    // Suppress unused variable warning - cookies kept for future auth needs
    void this.getAuthCookies();

    const params: Record<string, string> = {};
    if (process.env.PRPL_TEST_TOKEN) {
      params.token = process.env.PRPL_TEST_TOKEN;
    }

    const response = await this.request.get(
      `${this.baseUrl}/?rest_route=${endpoint}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        params,
      }
    );

    if (!response.ok()) {
      throw new Error(`API request failed: ${response.status()} ${await response.text()}`);
    }

    return await response.json();
  }

  /**
   * Get all tasks.
   */
  async getAllTasks(): Promise<Task[]> {
    return await this.get<Task[]>('/progress-planner/v1/tasks');
  }

  /**
   * Get a task by its slug/post_name.
   */
  async getTask(taskId: string): Promise<Task | undefined> {
    const tasks = await this.getAllTasks();
    return tasks.find((task) => task.post_name === taskId);
  }

  /**
   * Get tasks by status.
   */
  async getTasksByStatus(status: Task['post_status']): Promise<Task[]> {
    const tasks = await this.getAllTasks();
    return tasks.filter((task) => task.post_status === status);
  }

  /**
   * Assert that a task has a specific status.
   */
  async expectTaskStatus(taskId: string, expectedStatus: Task['post_status']): Promise<void> {
    const task = await this.getTask(taskId);

    if (!task) {
      throw new Error(`Task "${taskId}" not found`);
    }

    if (task.post_status !== expectedStatus) {
      throw new Error(
        `Task "${taskId}" has status "${task.post_status}", expected "${expectedStatus}"`
      );
    }
  }

  /**
   * Wait for a task to reach a specific status.
   * Polls the API until the status matches or timeout.
   */
  async waitForTaskStatus(
    taskId: string,
    expectedStatus: Task['post_status'],
    options: { timeout?: number; interval?: number } = {}
  ): Promise<Task> {
    const timeout = options.timeout ?? 10000;
    const interval = options.interval ?? 500;
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
      const task = await this.getTask(taskId);

      if (task?.post_status === expectedStatus) {
        return task;
      }

      await new Promise((resolve) => setTimeout(resolve, interval));
    }

    throw new Error(
      `Timeout waiting for task "${taskId}" to have status "${expectedStatus}"`
    );
  }
}
