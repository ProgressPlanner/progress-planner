# Angie AI Integration for Progress Planner

This document describes the Angie AI integration for Progress Planner, which provides REST API endpoints and an MCP (Model Context Protocol) server that allow the Angie AI assistant to interact with task recommendations in Progress Planner.

## Overview

The integration enables Angie to:
- List all active tasks (recommendations with `post_status` = `publish`)
- List all completed tasks (recommendations with `post_status` = `trash`)
- Complete tasks, including the "Set blog description" task

## Architecture

The integration consists of two main components:

1. **PHP REST API** (`class-angie-api.php`): WordPress REST API endpoints for task management
2. **MCP Server** (`src/progress-planner-mcp-server.ts`): TypeScript-based MCP server that bridges Angie AI with the REST API, bundled with Vite for browser compatibility

## Installation

### Prerequisites

1. WordPress site with Progress Planner plugin installed
2. Angie plugin installed from the WordPress plugin repository: https://wordpress.org/plugins/angie/
3. User must be logged in with `manage_options` capability (typically Administrator role)
4. Node.js 20+ and npm for building the MCP server

### Setup

1. **Install Dependencies:**
   ```bash
   cd classes/third-party/angie
   npm install
   ```

2. **Build the MCP Server:**
   ```bash
   npm run build
   ```

   This will:
   - Compile TypeScript to JavaScript (`tsc`)
   - Bundle all dependencies with Vite into a single ES module
   - Generate `dist/progress-planner-mcp-server.js` (bundled, ~442KB)

3. **Development Mode:**
   For active development, use watch mode:
   ```bash
   npm run watch  # TypeScript watch mode
   npm run dev    # Vite dev server (for testing)
   ```

The integration is automatically enabled when Progress Planner is active. The MCP server script will be automatically enqueued when the Angie plugin is detected.

## API Endpoints

All endpoints are prefixed with: `/wp-json/progress-planner/v1/angie`

### 1. Get Active Tasks

**Endpoint:** `GET /wp-json/progress-planner/v1/angie/tasks`

**Description:** Returns all active (published) task recommendations.

**Authentication:** Requires logged-in user with `manage_options` capability.

**Response Example:**
```json
{
  "success": true,
  "count": 3,
  "tasks": [
    {
      "id": "core-blogdescription",
      "title": "Set tagline",
      "description": "Set the tagline to make your website look more professional.",
      "url": "https://example.com/wp-admin/options-general.php?pp-focus-el=core-blogdescription",
      "priority": 2,
      "status": "active"
    },
    {
      "id": "content-create",
      "title": "Create new content",
      "description": "Create new content to improve your site.",
      "url": "https://example.com/wp-admin/post-new.php",
      "priority": 1,
      "status": "active"
    }
  ]
}
```

**cURL Example:**
```bash
curl -X GET \
  -H "Cookie: wordpress_logged_in_xxxxx=..." \
  "https://example.com/wp-json/progress-planner/v1/angie/tasks"
```

### 2. Get Completed Tasks

**Endpoint:** `GET /wp-json/progress-planner/v1/angie/tasks/completed`

**Description:** Returns all completed (trashed) task recommendations.

**Authentication:** Requires logged-in user with `manage_options` capability.

**Response Example:**
```json
{
  "success": true,
  "count": 5,
  "tasks": [
    {
      "id": "core-blogdescription",
      "title": "Set tagline",
      "description": "Set the tagline to make your website look more professional.",
      "url": "https://example.com/wp-admin/options-general.php?pp-focus-el=core-blogdescription",
      "priority": 2,
      "status": "completed"
    }
  ]
}
```

**cURL Example:**
```bash
curl -X GET \
  -H "Cookie: wordpress_logged_in_xxxxx=..." \
  "https://example.com/wp-json/progress-planner/v1/angie/tasks/completed"
```

### 3. Complete a Task

**Endpoint:** `POST /wp-json/progress-planner/v1/angie/tasks/complete`

**Description:** Marks a task as completed. For the "Set blog description" task, it also updates the WordPress tagline.

**Authentication:** Requires logged-in user with `manage_options` capability.

**Parameters:**
- `task_id` (string, required): The ID of the task to complete (e.g., "core-blogdescription")
- `value` (string, optional): For tasks that require a value (like blog description), provide the value here

**Response Example (Blog Description):**
```json
{
  "success": true,
  "message": "Blog description has been set successfully and the task has been marked as completed.",
  "task_id": "core-blogdescription",
  "blog_description": "Your new tagline here"
}
```

**Response Example (Generic Task):**
```json
{
  "success": true,
  "message": "Task \"Create new content\" has been marked as completed.",
  "task_id": "content-create"
}
```

**cURL Example:**
```bash
# Complete the blog description task
curl -X POST \
  -H "Cookie: wordpress_logged_in_xxxxx=..." \
  -H "Content-Type: application/json" \
  -d '{"task_id": "core-blogdescription", "value": "My awesome WordPress site"}' \
  "https://example.com/wp-json/progress-planner/v1/angie/tasks/complete"

# Complete a generic task
curl -X POST \
  -H "Cookie: wordpress_logged_in_xxxxx=..." \
  -H "Content-Type: application/json" \
  -d '{"task_id": "content-create"}' \
  "https://example.com/wp-json/progress-planner/v1/angie/tasks/complete"
```

## Error Responses

### 403 Forbidden
```json
{
  "code": "rest_forbidden",
  "message": "You do not have permission to access this endpoint.",
  "data": {
    "status": 403
  }
}
```

### 404 Not Found
```json
{
  "code": "task_not_found",
  "message": "Task with ID \"unknown-task\" not found or already completed.",
  "data": {
    "status": 404
  }
}
```

### 400 Bad Request
```json
{
  "code": "missing_value",
  "message": "The \"value\" parameter is required to complete the blog description task. Please provide a blog description.",
  "data": {
    "status": 400
  }
}
```

### 500 Internal Server Error
```json
{
  "code": "task_completion_error",
  "message": "Error message here",
  "data": {
    "status": 500
  }
}
```

## Task IDs

Common task IDs in Progress Planner include:

- `core-blogdescription` - Set the site tagline/blog description
- `content-create` - Create new content
- `content-review` - Review existing content
- `update-core` - Update WordPress core
- `settings-saved` - Configure site settings
- `debug-display` - Disable debug display

To get a complete list of available task IDs, use the "Get Active Tasks" endpoint.

## Implementation Details

### File Structure

- **Main Integration Class:** `classes/third-party/angie/class-integration.php`
- **REST API Class:** `classes/third-party/angie/class-angie-api.php`
- **MCP Server Source:** `classes/third-party/angie/src/progress-planner-mcp-server.ts`
- **MCP Server Bundle:** `classes/third-party/angie/dist/progress-planner-mcp-server.js`
- **Build Configuration:** `classes/third-party/angie/vite.config.ts`
- **Registration:** The integration is automatically instantiated in `classes/class-base.php`

### Build Process

The MCP server uses:
- **TypeScript** for type-safe development
- **Vite** for bundling dependencies (Angie SDK, MCP SDK, Zod) into a single ES module
- **ES Modules** for browser compatibility

The build process (`npm run build`) does the following:
1. Compiles TypeScript (`tsc`) - generates type definitions
2. Bundles with Vite - resolves all `import` statements and creates a single file
3. Outputs `dist/progress-planner-mcp-server.js` - ready for browser use

### How It Works

1. **Task Retrieval:** The integration queries the `prpl_recommendations` custom post type using the `Suggested_Tasks_DB` class.

2. **Task Completion:** When a task is completed:
   - For the blog description task: Updates the `blogdescription` WordPress option
   - For all tasks: Calls the task's `celebrate()` method, which transitions the post status to `pending` (celebration mode) and then to `trash` (completed)

3. **Authentication:** Uses WordPress's built-in authentication system. Requires users to have the `manage_options` capability.

### Task Status Flow

```
publish (active) → pending (celebrating) → trash (completed)
```

## Using with Angie

Once the Angie plugin is installed and activated, it can automatically discover and use these endpoints to help users manage their Progress Planner tasks through natural language interactions.

### Example Angie Interactions

**User:** "What tasks do I have in Progress Planner?"
**Angie:** *Calls GET /angie/tasks and lists active tasks*

**User:** "Set my site tagline to 'Building awesome websites'"
**Angie:** *Calls POST /angie/tasks/complete with task_id=core-blogdescription and value="Building awesome websites"*

**User:** "Show me my completed tasks"
**Angie:** *Calls GET /angie/tasks/completed and displays results*

## Development & Testing

### Testing Endpoints

You can test the endpoints using WordPress REST API testing tools or browser extensions like:
- WP REST API Testing (Chrome/Firefox extension)
- Postman
- Insomnia
- curl (command line)

### Authentication for Testing

To authenticate in testing tools:
1. Log in to WordPress admin in your browser
2. Copy the authentication cookies
3. Include them in your API requests

### Debug Mode

If you encounter issues, enable WordPress debug mode:

```php
// wp-config.php
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
```

Check the debug log at `/wp-content/debug.log` for error messages.

## Security Considerations

1. **Authentication Required:** All endpoints require WordPress authentication with `manage_options` capability
2. **Input Sanitization:** All input values are sanitized using WordPress sanitization functions
3. **Permission Checks:** Each request validates user permissions before processing
4. **No Token Authentication:** Unlike some other Progress Planner REST endpoints, the Angie integration relies on WordPress's native authentication for better security in the context of AI-assisted interactions

## Troubleshooting

### "You do not have permission to access this endpoint"

**Solution:** Ensure you're logged in as an Administrator or user with `manage_options` capability.

### "Task not found or already completed"

**Solution:** The task may already be completed or may not be active. Use the "Get Active Tasks" endpoint to see which tasks are currently available.

### "Failed to update the blog description"

**Solution:** This typically happens if the value hasn't changed. WordPress's `update_option()` returns false when the new value is the same as the old value.

### Module resolution errors in browser

**Solution:** Ensure you've run `npm run build` after making changes. The build process bundles all dependencies. Clear your browser cache (hard refresh: Cmd+Shift+R / Ctrl+Shift+F5) to load the new bundled file.

## Contributing

To extend this integration:

1. **Add new REST API endpoints:**
   - Add new methods to `classes/third-party/angie/class-angie-api.php`
   - Register new routes in the `register_rest_endpoint()` method

2. **Add new MCP tools:**
   - Edit `classes/third-party/angie/src/progress-planner-mcp-server.ts`
   - Use `server.tool()` to register new tools (see example code)
   - Rebuild with `npm run build`

3. **Development workflow:**
   - Edit TypeScript source files in `src/`
   - Run `npm run build` to rebuild
   - Clear browser cache to see changes
   - Follow WordPress REST API best practices
   - Update this documentation

## Support

For issues or questions:
- Progress Planner: https://prpl.fyi/
- Angie Plugin: https://wordpress.org/plugins/angie/

## License

This integration is part of the Progress Planner plugin and is licensed under GPL-3.0+.
