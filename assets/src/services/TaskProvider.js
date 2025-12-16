/**
 * Base Task Provider class.
 *
 * Provides common functionality and interface for task providers.
 * React task providers should extend or implement this interface.
 */

/**
 * Base Task Provider.
 *
 * This class provides a standard interface for task providers.
 * Task providers should implement the required methods.
 */
export class TaskProvider {
	/**
	 * Constructor.
	 *
	 * @param {Object} config Task provider configuration.
	 */
	constructor( config ) {
		this.config = {
			providerId: config.providerId || '',
			capability: config.capability || 'manage_options',
			isOnboardingTask: config.isOnboardingTask || false,
			priority: config.priority || 50,
			points: config.points || 1,
			parent: config.parent || 0,
			isDismissable: config.isDismissable || false,
			isSnoozable:
				config.isSnoozable !== undefined ? config.isSnoozable : true,
			isRepetitive: config.isRepetitive || false,
			dependencies: config.dependencies || [],
			externalLinkUrl: config.externalLinkUrl || '',
			popoverId: config.popoverId || '',
			...config,
		};
	}

	/**
	 * Get the provider ID.
	 *
	 * @return {string} The provider ID.
	 */
	getProviderId() {
		return this.config.providerId;
	}

	/**
	 * Get the task priority.
	 *
	 * @return {number} The priority (lower = higher priority).
	 */
	getPriority() {
		return this.config.priority;
	}

	/**
	 * Get the task points.
	 *
	 * @return {number} The points value.
	 */
	getPoints() {
		return this.config.points;
	}

	/**
	 * Check if the user has the required capability.
	 *
	 * @return {boolean} True if user has capability.
	 */
	capabilityRequired() {
		// Capability checking should be done server-side via REST API.
		// This is a placeholder for client-side checks if needed.
		return true;
	}

	/**
	 * Check if the task should be added.
	 *
	 * This method must be implemented by child classes.
	 * It should use data collectors to determine if the task condition is met.
	 *
	 * @param {Object} taskData Optional task-specific data.
	 * @return {Promise<boolean>} Promise resolving to true if task should be added.
	 */
	// eslint-disable-next-line no-unused-vars
	async shouldAddTask( taskData = {} ) {
		// Must be implemented by child classes.
		throw new Error(
			'shouldAddTask() must be implemented by task provider'
		);
	}

	/**
	 * Get task details.
	 *
	 * This method must be implemented by child classes.
	 * It returns the task metadata needed to create a task post.
	 *
	 * @param {Object} taskData Optional task-specific data.
	 * @return {Promise<Object>} Promise resolving to task details object.
	 */
	// eslint-disable-next-line no-unused-vars
	async getTaskDetails( taskData = {} ) {
		// Must be implemented by child classes.
		throw new Error(
			'getTaskDetails() must be implemented by task provider'
		);
	}

	/**
	 * Generate task ID.
	 *
	 * Generates a unique task ID based on provider ID and optional task data.
	 *
	 * @param {Object} taskData Optional task-specific data.
	 * @return {string} The task ID.
	 */
	getTaskId( taskData = {} ) {
		const parts = [ this.config.providerId ];

		// Add optional parts in order (important for consistency).
		if ( taskData.targetPostId ) {
			parts.push( taskData.targetPostId );
		}
		if ( taskData.targetTermId ) {
			parts.push( taskData.targetTermId );
		}
		if ( taskData.targetTaxonomy ) {
			parts.push( taskData.targetTaxonomy );
		}
		if ( this.config.isRepetitive ) {
			// Add year-week format for repetitive tasks.
			const now = new Date();
			const year = now.getFullYear();
			const week = this.getWeekNumber( now );
			parts.push( `${ year }${ week.toString().padStart( 2, '0' ) }` );
		}

		return parts.join( '-' );
	}

	/**
	 * Get ISO week number for a date.
	 *
	 * @param {Date} date The date.
	 * @return {number} The week number (1-53).
	 */
	getWeekNumber( date ) {
		const d = new Date(
			Date.UTC( date.getFullYear(), date.getMonth(), date.getDate() )
		);
		const dayNum = d.getUTCDay() || 7;
		d.setUTCDate( d.getUTCDate() + 4 - dayNum );
		const yearStart = new Date( Date.UTC( d.getUTCFullYear(), 0, 1 ) );
		return Math.ceil( ( ( d - yearStart ) / 86400000 + 1 ) / 7 );
	}

	/**
	 * Check if task dependencies are satisfied.
	 *
	 * @param {Function} getTaskStatus Function to get task status by task ID.
	 * @return {Promise<boolean>} Promise resolving to true if dependencies are satisfied.
	 */
	async areDependenciesSatisfied( getTaskStatus ) {
		if (
			! this.config.dependencies ||
			this.config.dependencies.length === 0
		) {
			return true;
		}

		// Check each dependency.
		for ( const dependency of this.config.dependencies ) {
			const taskId =
				typeof dependency === 'string' ? dependency : dependency.taskId;
			const requiredStatus =
				typeof dependency === 'object'
					? dependency.status
					: 'completed';

			const status = await getTaskStatus( taskId );
			if ( status !== requiredStatus ) {
				return false;
			}
		}

		return true;
	}
}
