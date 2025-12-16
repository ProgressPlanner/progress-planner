/**
 * Task Registry Service.
 *
 * Central registry for React task providers. All tasks must be registered here.
 * This replaces the PHP-based task registration system.
 */

/**
 * Registry storage for task providers.
 *
 * @type {Map<string, Object>}
 */
const taskProviders = new Map();

/**
 * Register a task provider.
 *
 * @param {Object}   providerConfig                The task provider configuration.
 * @param {string}   providerConfig.providerId     Unique identifier for the provider.
 * @param {Function} providerConfig.shouldAddTask  Function that evaluates if task should be added.
 * @param {Function} providerConfig.getTaskDetails Function that returns task details.
 * @param {Object}   providerConfig.config         Task configuration (priority, points, etc.).
 * @return {void}
 */
export function registerTaskProvider( providerConfig ) {
	// Support both plain objects with providerId and class instances with getProviderId()
	const providerId =
		providerConfig.providerId ||
		( providerConfig.getProviderId &&
		typeof providerConfig.getProviderId === 'function'
			? providerConfig.getProviderId()
			: null );

	if ( ! providerId ) {
		console.error(
			'Task provider registration failed: providerId is required',
			providerConfig
		);
		return;
	}

	if ( taskProviders.has( providerId ) ) {
		console.warn(
			`Task provider "${ providerId }" is already registered. Overwriting.`
		);
	}

	taskProviders.set( providerId, providerConfig );
}

/**
 * Get a registered task provider.
 *
 * @param {string} providerId The provider ID.
 * @return {Object|undefined} The task provider configuration or undefined.
 */
export function getTaskProvider( providerId ) {
	return taskProviders.get( providerId );
}

/**
 * Get all registered task providers.
 *
 * @return {Array<Object>} Array of task provider configurations.
 */
export function getAllTaskProviders() {
	return Array.from( taskProviders.values() );
}

/**
 * Check if a task provider is registered.
 *
 * @param {string} providerId The provider ID.
 * @return {boolean} True if registered, false otherwise.
 */
export function isTaskProviderRegistered( providerId ) {
	return taskProviders.has( providerId );
}
