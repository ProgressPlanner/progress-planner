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
	 * @param {Object} config Optional task provider configuration (for backward compatibility).
	 */
	constructor( config = {} ) {
		// Build config from static properties, with fallback to constructor params for backward compatibility
		const StaticClass = this.constructor;

		// Calculate isSnoozable separately to avoid nested ternary
		let isSnoozable = true; // Default value
		if ( StaticClass.isSnoozable !== undefined ) {
			isSnoozable = StaticClass.isSnoozable;
		} else if ( config.isSnoozable !== undefined ) {
			isSnoozable = config.isSnoozable;
		}

		this.config = {
			providerId: StaticClass.providerId || config.providerId || '',
			capability:
				StaticClass.capability || config.capability || 'manage_options',
			isOnboardingTask:
				StaticClass.isOnboardingTask !== undefined
					? StaticClass.isOnboardingTask
					: config.isOnboardingTask || false,
			priority:
				StaticClass.priority !== undefined
					? StaticClass.priority
					: config.priority || 50,
			points:
				StaticClass.points !== undefined
					? StaticClass.points
					: config.points || 1,
			parent:
				StaticClass.parent !== undefined
					? StaticClass.parent
					: config.parent || 0,
			isDismissable:
				StaticClass.isDismissable !== undefined
					? StaticClass.isDismissable
					: config.isDismissable || false,
			isSnoozable,
			isRepetitive:
				StaticClass.isRepetitive !== undefined
					? StaticClass.isRepetitive
					: config.isRepetitive || false,
			dependencies: StaticClass.dependencies || config.dependencies || [],
			externalLinkUrl:
				StaticClass.externalLinkUrl || config.externalLinkUrl || '',
			popoverId: StaticClass.popoverId || config.popoverId || '',
			isMultiTask:
				StaticClass.isMultiTask !== undefined
					? StaticClass.isMultiTask
					: config.isMultiTask || false,
			...config,
		};
	}

	/**
	 * Get static config from the class.
	 *
	 * @return {Object} Configuration object from static properties.
	 */
	static getStaticConfig() {
		return {
			providerId: this.providerId || '',
			capability: this.capability || 'manage_options',
			isOnboardingTask: this.isOnboardingTask || false,
			priority: this.priority !== undefined ? this.priority : 50,
			points: this.points !== undefined ? this.points : 1,
			parent: this.parent || 0,
			isDismissable: this.isDismissable || false,
			isSnoozable:
				this.isSnoozable !== undefined ? this.isSnoozable : true,
			isRepetitive: this.isRepetitive || false,
			dependencies: this.dependencies || [],
			externalLinkUrl: this.externalLinkUrl || '',
			popoverId: this.popoverId || '',
			isMultiTask: this.isMultiTask || false,
		};
	}

	/**
	 * Get the provider ID.
	 *
	 * @return {string} The provider ID.
	 */
	getProviderId() {
		const StaticClass = this.constructor;
		return StaticClass.providerId || this.config.providerId || '';
	}

	/**
	 * Get the task priority.
	 *
	 * @return {number} The priority (lower = higher priority).
	 */
	getPriority() {
		const StaticClass = this.constructor;
		return StaticClass.priority !== undefined
			? StaticClass.priority
			: this.config.priority || 50;
	}

	/**
	 * Get the task points.
	 *
	 * @return {number} The points value.
	 */
	getPoints() {
		const StaticClass = this.constructor;
		return StaticClass.points !== undefined
			? StaticClass.points
			: this.config.points || 1;
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
		const StaticClass = this.constructor;
		const providerId =
			StaticClass.providerId || this.config.providerId || '';
		const parts = [ providerId ];

		// Add optional parts in order (important for consistency).
		// Support both camelCase and snake_case formats.
		if ( taskData.targetPostId ) {
			parts.push( taskData.targetPostId );
		}
		if ( taskData.targetTermId ) {
			parts.push( taskData.targetTermId );
		}
		if ( taskData.targetTaxonomy ) {
			parts.push( taskData.targetTaxonomy );
		}
		if ( taskData.target_post_id ) {
			parts.push( taskData.target_post_id );
		}
		if ( taskData.target_term_id ) {
			parts.push( taskData.target_term_id );
		}
		if ( taskData.target_taxonomy ) {
			parts.push( taskData.target_taxonomy );
		}
		const isRepetitive =
			StaticClass.isRepetitive !== undefined
				? StaticClass.isRepetitive
				: this.config.isRepetitive || false;
		if ( isRepetitive ) {
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
		const StaticClass = this.constructor;
		const dependencies =
			StaticClass.dependencies || this.config.dependencies || [];
		if ( ! dependencies || dependencies.length === 0 ) {
			return true;
		}

		// Check each dependency.
		for ( const dependency of dependencies ) {
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
