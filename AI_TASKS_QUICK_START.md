# AI Tasks - Quick Start Guide

## What Was Implemented

The Progress Planner client plugin now supports AI-powered tasks from the SaaS server. Users can execute AI analysis tasks that provide intelligent insights about their website.

## Files Created

1. **PHP Classes:**
   - `/code/classes/class-ai-tasks.php` - API client for SaaS server communication
   - `/code/classes/suggested-tasks/providers/class-ai-task.php` - Base class for AI tasks
   - `/code/classes/suggested-tasks/providers/class-ai-tasks-from-server.php` - Main AI task provider

2. **JavaScript:**
   - `/code/assets/js/recommendations/ai-task.js` - Client-side AI task execution handler

3. **CSS:**
   - `/code/assets/css/ai-task.css` - Styles for AI task UI components

4. **Documentation:**
   - `/code/AI_TASKS_IMPLEMENTATION.md` - Detailed implementation documentation
   - `/code/AI_TASKS_QUICK_START.md` - This quick start guide

## Files Modified

1. **Task Manager Registration:**
   - `/code/classes/suggested-tasks/class-tasks-manager.php`
   - Added AI_Tasks_From_Server provider to the task providers list

2. **Base Class:**
   - `/code/classes/class-base.php`
   - Added `@method` annotation for `get_ai_tasks()`

3. **REST API Metadata:**
   - `/code/classes/class-suggested-tasks.php`
   - Registered AI task metadata fields for REST API

## How It Works

### 1. Task Discovery
When the plugin loads, the AI_Tasks_From_Server provider:
- Fetches AI tasks from the SaaS server endpoint
- Injects them into the local task database
- Tasks appear in the Progress Planner dashboard

### 2. Task Execution
When a user executes an AI task:
- Clicks "Analyze" button on the task
- Popover opens with task details
- JavaScript sends AJAX request to execute the task
- Server makes API call to SaaS server
- AI response is displayed to the user

### 3. Caching
- AI responses are cached for 1 week
- Subsequent executions return cached results
- Reduces API calls and costs

## Server Requirements

The SaaS server must provide these endpoints:

1. **GET** `/wp-json/progress-planner-saas/v1/suggested-todo`
   - Returns list of AI tasks
   - Accepts `site`, `license_key`, and optional `branding` parameters

2. **POST** `/wp-json/progress-planner-saas/v1/execute-ai-task`
   - Executes an AI task
   - Requires `task_id`, `site_url`, and `license_key`
   - Returns AI-generated response

## Testing the Implementation

### Basic Test Flow

1. **Enable Debug Mode** (optional):
   ```php
   define('WP_DEBUG', true);
   define('WP_DEBUG_LOG', true);
   ```

2. **Verify License Key**:
   - Ensure the site has a valid Progress Planner license key
   - Check: Settings > Progress Planner > License

3. **Check Task Appearance**:
   - Navigate to Progress Planner dashboard
   - AI tasks should appear with "Analyze" button
   - Look for tasks with purple accent color

4. **Test Task Execution**:
   - Click "Analyze" on an AI task
   - Popover should open
   - Click "Analyze" in popover
   - Loading spinner should appear (10-30 seconds)
   - AI response should display

5. **Test Caching**:
   - Execute the same task again
   - Should return instantly
   - Look for "(Cached result)" indicator

6. **Test Error Handling**:
   - Temporarily disconnect from internet
   - Try to execute a task
   - Should show error message with retry button

### Debug Checklist

If tasks don't appear:
- [ ] Check if license key is set
- [ ] Verify SaaS server is accessible
- [ ] Check browser console for JavaScript errors
- [ ] Review WordPress debug.log for PHP errors
- [ ] Ensure user has `manage_options` capability

If execution fails:
- [ ] Check network tab in browser dev tools
- [ ] Verify AJAX endpoint returns 200 status
- [ ] Check nonce is being sent correctly
- [ ] Review server-side API response
- [ ] Ensure AI task exists on server

## Key Features

### 1. Automatic Task Discovery
- Tasks are fetched from SaaS server automatically
- No manual configuration needed
- Tasks sync on plugin initialization

### 2. Real-time AI Analysis
- Executes AI prompts in real-time
- Analyzes user's actual website
- Provides actionable insights

### 3. Smart Caching
- Caches responses to avoid redundant API calls
- Configurable cache duration
- Per-task cache management

### 4. Error Handling
- Graceful degradation on errors
- User-friendly error messages
- Retry functionality

### 5. Security
- Capability checks (manage_options required)
- Nonce verification on all AJAX calls
- Input sanitization
- No sensitive data exposed

## Architecture Highlights

### Plugin Integration
The implementation follows the existing Progress Planner architecture:
- Uses the Task Provider system
- Integrates with the existing task UI
- Follows WordPress coding standards
- Uses the plugin's enqueue system

### API Communication
- Uses WordPress HTTP API (`wp_remote_get`, `wp_remote_post`)
- Implements proper error handling
- Uses WordPress transients for caching
- Follows REST API conventions

### Frontend
- Vanilla JavaScript (no external dependencies)
- Uses existing Progress Planner utilities
- Responsive design
- Progressive enhancement

## Customization

### Adjusting Cache Duration

In `/code/classes/class-ai-tasks.php`, modify:

```php
public function cache_response( $task_id, $response, $expiry = WEEK_IN_SECONDS ) {
    // Change WEEK_IN_SECONDS to desired duration
}
```

### Changing Task Priority

In `/code/classes/suggested-tasks/providers/class-ai-tasks-from-server.php`, modify:

```php
protected $priority = 30; // Lower = higher priority
```

### Adding Custom Styling

Edit `/code/assets/css/ai-task.css` to customize:
- Colors
- Spacing
- Typography
- Animations

### Customizing AI Response Format

Edit `/code/assets/js/recommendations/ai-task.js`, function `formatAIResponse()` to change how responses are displayed.

## Next Steps

1. **Test with Real Data**
   - Create AI tasks on the SaaS server
   - Test with various prompts and scenarios
   - Verify responses are helpful and accurate

2. **Monitor Performance**
   - Track API response times
   - Monitor cache hit rates
   - Check for any errors in production

3. **Gather User Feedback**
   - How useful are the AI insights?
   - Are the responses clear and actionable?
   - Do users understand how to use the feature?

4. **Iterate and Improve**
   - Refine AI prompts based on feedback
   - Add more task types
   - Enhance the UI/UX
   - Consider adding analytics

## Support

For issues or questions:
1. Check `/code/AI_TASKS_IMPLEMENTATION.md` for detailed docs
2. Review WordPress debug.log for errors
3. Check browser console for JavaScript errors
4. Verify SaaS server is responding correctly

## Version Information

- **Implementation Date**: 2025-10-28
- **Client Plugin**: Progress Planner
- **Server Integration**: Progress Planner SaaS
- **Dependencies**: WordPress 5.0+, Progress Planner license

---

**Implementation Status**: ✅ Complete

All core functionality has been implemented and is ready for testing.
