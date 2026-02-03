/**
 * Task ID Resolver Utility.
 *
 * Resolves the task ID from various sources with consistent fallback logic.
 * Provides a single source of truth for task ID resolution across the application.
 *
 * @module utils/taskIdResolver
 */

/**
 * Resolve task ID from task object or popover ID.
 *
 * Attempts to find the task ID from multiple sources in order of preference:
 * 1. task.slug - Direct slug property on task
 * 2. task.prpl_provider.slug - Slug from provider object
 * 3. popoverId - Fallback to provided popover ID
 *
 * @param {Object|null} task      The task object containing task information.
 * @param {string|null} popoverId The popover ID to use as fallback (optional).
 * @return {string|null} The resolved task ID or null if not found.
 *
 * @example
 * const taskId = resolveTaskId(task, 'prpl-popover-hello-world');
 * // Returns: 'hello-world' (from task.slug or task.prpl_provider.slug)
 */
export function resolveTaskId( task, popoverId = null ) {
	if ( ! task && ! popoverId ) {
		return null;
	}

	if ( task?.slug ) {
		return task.slug;
	}

	if ( task?.prpl_provider?.slug ) {
		return task.prpl_provider.slug;
	}

	return popoverId || null;
}
