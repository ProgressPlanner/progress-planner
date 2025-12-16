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
 * @param {Function|Object} providerConfig The task provider class or instance.
 * @return {void}
 */
export function registerTaskProvider( providerConfig ) {
	// Support classes (with static properties), instances, and plain objects
	let providerId = null;

	// Check if it's a class (constructor function) with static providerId
	if ( typeof providerConfig === 'function' && providerConfig.providerId ) {
		providerId = providerConfig.providerId;
	}
	// Check if it's an instance with getProviderId method
	else if (
		providerConfig.getProviderId &&
		typeof providerConfig.getProviderId === 'function'
	) {
		providerId = providerConfig.getProviderId();
	}
	// Check for direct providerId property (plain object or instance)
	else if ( providerConfig.providerId ) {
		providerId = providerConfig.providerId;
	}

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
