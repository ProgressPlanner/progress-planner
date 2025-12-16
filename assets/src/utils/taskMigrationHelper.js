/**
 * Task Migration Helper Utilities.
 *
 * Helper functions and patterns for migrating PHP task providers to React.
 * This provides common patterns and templates for task migration.
 */

/**
 * Common task configuration patterns.
 *
 * These patterns can be used as starting points when migrating tasks.
 */
export const TaskPatterns = {
	/**
	 * Basic task pattern - simple tasks that only check a condition.
	 *
	 * @example
	 * ```js
	 * class MyTask extends TaskProvider {
	 *   constructor() {
	 *     super({
	 *       providerId: 'my-task',
	 *       priority: 50,
	 *       ...TaskPatterns.BASIC,
	 *     });
	 *   }
	 * }
	 * ```
	 */
	BASIC: {
		isDismissable: true,
		isSnoozable: true,
		isRepetitive: false,
		points: 1,
		capability: 'manage_options',
	},

	/**
	 * Interactive task pattern - tasks with popovers.
	 *
	 * @example
	 * ```js
	 * class MyInteractiveTask extends InteractiveTaskProvider {
	 *   constructor() {
	 *     super({
	 *       providerId: 'my-interactive-task',
	 *       popoverId: 'my-interactive-task',
	 *       ...TaskPatterns.INTERACTIVE,
	 *     });
	 *   }
	 * }
	 * ```
	 */
	INTERACTIVE: {
		isDismissable: true,
		isSnoozable: true,
		isRepetitive: false,
		points: 1,
		capability: 'manage_options',
	},

	/**
	 * Onboarding task pattern - tasks shown during onboarding.
	 */
	ONBOARDING: {
		isOnboardingTask: true,
		isDismissable: true,
		isSnoozable: true,
		points: 1,
	},
};

/**
 * Migration checklist for converting PHP tasks to React.
 *
 * Use this checklist when migrating a task:
 *
 * 1. Create React task file in assets/src/tasks/
 * 2. Extend TaskProvider or InteractiveTaskProvider
 * 3. Set providerId (should match PHP PROVIDER_ID)
 * 4. Map PHP constants to config object:
 *    - PROVIDER_ID → providerId
 *    - CAPABILITY → capability
 *    - IS_ONBOARDING_TASK → isOnboardingTask
 *    - POPOVER_ID → popoverId (for interactive tasks)
 *    - PRIORITY → priority (from $priority property)
 *    - POINTS → points (from $points property)
 *    - DEPENDENCIES → dependencies (array format)
 *    - EXTERNAL_LINK_URL → externalLinkUrl
 * 5. Convert should_add_task() → shouldAddTask()
 *    - Use fetchDataCollector() for data collection
 *    - Return Promise<boolean>
 * 6. Convert get_task_details() → getTaskDetails()
 *    - Use fetchDataCollector() for dynamic data
 *    - Return Promise<Object> with task details
 * 7. Convert get_url() / get_url_with_data() → include in getTaskDetails()
 * 8. Convert get_title() / get_title_with_data() → include in getTaskDetails()
 * 9. Convert get_description() / get_description_with_data() → include in getTaskDetails()
 * 10. Register task in assets/src/tasks/index.js
 * 11. Remove from PHP Tasks_Manager instantiation list
 * 12. Test task appears in UI
 * 13. Test task evaluation works
 * 14. Test task actions (complete, snooze) work
 */

/**
 * Common data collector IDs.
 *
 * Maps to DATA_KEY constants from PHP data collectors.
 */
export const DataCollectorIds = {
	HELLO_WORLD_POST_ID: 'hello_world_post_id',
	SAMPLE_PAGE_ID: 'sample_page_id',
	INACTIVE_PLUGINS_COUNT: 'inactive_plugins_count',
	UNCATEGORIZED_CATEGORY_ID: 'uncategorized_category_id',
	POST_AUTHOR_COUNT: 'post_author_count',
	LAST_PUBLISHED_POST_ID: 'last_published_post_id',
	ARCHIVE_FORMAT_COUNT: 'archive_format_count',
	TERMS_WITHOUT_POSTS: 'terms_without_posts',
	TERMS_WITHOUT_DESCRIPTION: 'terms_without_description',
	POST_TAG_COUNT: 'post_tag_count',
	PUBLISHED_POST_COUNT: 'published_post_count',
	UNPUBLISHED_CONTENT: 'unpublished_content',
	SEO_PLUGIN_INSTALLED: 'seo_plugin_installed',
};

/**
 * Get task configuration from PHP class structure.
 *
 * Helper to map PHP task class properties to React config.
 * This is a reference guide, not an automated converter.
 *
 * @param {Object} phpTask PHP task class structure (for reference).
 * @return {Object} React task configuration object.
 */
export function getTaskConfigFromPHP( phpTask ) {
	// This is a reference function showing the mapping.
	// In practice, you'll manually convert each task.
	return {
		providerId: phpTask.PROVIDER_ID,
		capability: phpTask.CAPABILITY || 'manage_options',
		isOnboardingTask: phpTask.IS_ONBOARDING_TASK || false,
		priority: phpTask.priority || 50,
		points: phpTask.points || 1,
		parent: phpTask.parent || 0,
		isDismissable: phpTask.is_dismissable || false,
		isSnoozable:
			phpTask.is_snoozable !== undefined ? phpTask.is_snoozable : true,
		isRepetitive: phpTask.is_repetitive || false,
		dependencies: phpTask.DEPENDENCIES || [],
		externalLinkUrl: phpTask.EXTERNAL_LINK_URL || '',
		popoverId: phpTask.POPOVER_ID || '',
	};
}
