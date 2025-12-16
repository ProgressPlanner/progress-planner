# Task Migration Guide

This guide explains how to migrate task providers from PHP to React.

## Overview

Tasks are now registered in React using the task registry system. PHP classes are being gradually migrated to React modules.

## Migration Process

### 1. Create React Task File

Create a new file in `assets/src/tasks/` named `YourTaskNameTask.js` (e.g., `SamplePageTask.js`).

### 2. Choose Base Class

- Extend `TaskProvider` for standard tasks
- Extend `InteractiveTaskProvider` for tasks with popovers/forms

### 3. Map PHP Properties to React Config

| PHP Constant/Property | React Config Property | Notes |
|----------------------|----------------------|-------|
| `PROVIDER_ID` | `providerId` | Required, must match PHP |
| `CAPABILITY` | `capability` | Default: 'manage_options' |
| `IS_ONBOARDING_TASK` | `isOnboardingTask` | Boolean |
| `$priority` | `priority` | Default: 50 |
| `$points` | `points` | Default: 1 |
| `$parent` | `parent` | Default: 0 |
| `$is_dismissable` | `isDismissable` | Boolean |
| `$is_snoozable` | `isSnoozable` | Default: true |
| `$is_repetitive` | `isRepetitive` | Boolean |
| `DEPENDENCIES` | `dependencies` | Array of dependency configs |
| `EXTERNAL_LINK_URL` | `externalLinkUrl` | String URL |
| `POPOVER_ID` | `popoverId` | For interactive tasks only |

### 4. Implement Required Methods

#### `shouldAddTask(taskData = {})`

Converts PHP `should_add_task()` method.

**Before (PHP):**
```php
public function should_add_task() {
    return 0 !== $this->get_data_collector()->collect();
}
```

**After (React):**
```js
async shouldAddTask(taskData = {}) {
    const data = await fetchDataCollector('data_collector_key');
    return data !== 0 && data !== null;
}
```

#### `getTaskDetails(taskData = {})`

Converts PHP `get_task_details()` method. Combines logic from:
- `get_title()` / `get_title_with_data()`
- `get_description()` / `get_description_with_data()`
- `get_url()` / `get_url_with_data()`

**Before (PHP):**
```php
public function get_task_details($task_data = []) {
    return [
        'task_id' => $this->get_task_id($task_data),
        'provider_id' => $this->get_provider_id(),
        'post_title' => $this->get_title_with_data($task_data),
        // ...
    ];
}
```

**After (React):**
```js
async getTaskDetails(taskData = {}) {
    const taskId = this.getTaskId(taskData);
    const data = await fetchDataCollector('data_collector_key');
    
    return {
        task_id: taskId,
        provider_id: this.getProviderId(),
        post_title: 'Task Title',
        description: 'Task description',
        priority: this.getPriority(),
        points: this.getPoints(),
        // ... other fields
    };
}
```

### 5. Register Task

Add to `assets/src/tasks/index.js`:

```js
import yourTask from './YourTaskNameTask';
registerTaskProvider(yourTask);
```

### 6. Remove from PHP

In `classes/suggested-tasks/class-tasks-manager.php`, comment out or remove:

```php
// new Your_Task_Class(), // Migrated to React, registered in assets/src/tasks/index.js
```

### 7. Test

- Verify task appears in UI
- Verify task evaluation works correctly
- Verify task actions (complete, snooze) work
- Verify popover/form works (for interactive tasks)

## Data Collectors

Use `fetchDataCollector(collectorId)` to get data from PHP data collectors.

Available collector IDs (matching DATA_KEY constants):
- `hello_world_post_id`
- `sample_page_id`
- `inactive_plugins_count`
- `uncategorized_category_id`
- And more...

See `assets/src/utils/taskMigrationHelper.js` for full list.

## Example Migration

See `assets/src/tasks/HelloWorldTask.js` for a complete example of a migrated task.

## Interactive Tasks

Interactive tasks that use popovers should:

1. Extend `InteractiveTaskProvider` instead of `TaskProvider`
2. Set `popoverId` in config
3. Call `this.addPopoverIdToTaskDetails(taskDetails)` in `getTaskDetails()`
4. Ensure popover component exists in `assets/src/components/Popovers/popoverRegistry.js`

## Dependencies

If a task has dependencies, use the `dependencies` config array:

```js
dependencies: [
    { taskId: 'dependency-task-id', status: 'completed' }
]
```

The `areDependenciesSatisfied()` method will check these automatically.

