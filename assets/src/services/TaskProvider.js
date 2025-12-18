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
	 * Build an admin URL with optional path and query parameters.
	 *
	 * Centralizes URL building logic to reduce code duplication across task providers.
	 * Handles trailing slash normalization and query parameter encoding.
	 *
	 * @param {string} path   The path relative to wp-admin (e.g., 'post.php', 'edit-tags.php').
	 * @param {Object} params Query parameters as key-value pairs.
	 * @return {string} The complete admin URL.
	 */
	buildAdminUrl( path = '', params = {} ) {
		const adminUrl =
			window.prplSuggestedTasksConfig?.adminUrl || '/wp-admin/';
		const separator = adminUrl.endsWith( '/' ) ? '' : '/';
		let url = path ? `${ adminUrl }${ separator }${ path }` : adminUrl;

		// Add query parameters if any.
		const queryParams = Object.entries( params )
			.filter( ( [ , value ] ) => value !== undefined && value !== null )
			.map(
				( [ key, value ] ) =>
					`${ encodeURIComponent( key ) }=${ encodeURIComponent(
						value
					) }`
			)
			.join( '&' );

		if ( queryParams ) {
			url += ( url.includes( '?' ) ? '&' : '?' ) + queryParams;
		}

		return url;
	}

	/**
	 * Build standard task details object with common fields.
	 *
	 * Centralizes task details building logic to reduce code duplication.
	 * Uses static class properties and config as defaults, with overrides for custom values.
	 *
	 * @param {Object} taskData  Task-specific data used for ID generation.
	 * @param {Object} overrides Custom fields to override or add to the standard details.
	 * @return {Object} Complete task details object.
	 */
	buildTaskDetails( taskData = {}, overrides = {} ) {
		const StaticClass = this.constructor;
		return {
			task_id: this.getTaskId( taskData ),
			provider_id: this.getProviderId(),
			post_title: '', // Should be overridden
			description: '',
			priority: this.getPriority(),
			points: this.getPoints(),
			parent: StaticClass.parent || 0,
			url: '',
			url_target: '_self',
			dismissable:
				StaticClass.isDismissable !== undefined
					? StaticClass.isDismissable
					: this.config.isDismissable,
			external_link_url:
				StaticClass.externalLinkUrl || this.config.externalLinkUrl,
			...overrides,
		};
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

	/**
	 * Get task actions as configuration objects for React rendering.
	 *
	 * Returns an array of action config objects that TaskActions component
	 * uses to render the appropriate React components.
	 *
	 * Standard actions include:
	 * - Complete button (priority 20): Marks task as complete and awards points
	 * - Snooze button (priority 30): Postpones task for specified duration
	 * - Info/External link (priority 40): Educational content about the task
	 * - Custom actions: Child classes can add via addTaskActions()
	 *
	 * Priority system (0-100, lower = higher priority):
	 * - 0-19: Reserved for critical actions
	 * - 20: Complete action
	 * - 30: Snooze action
	 * - 40: Information/educational links
	 * - 50+: Custom provider-specific actions
	 * - 1000: Default for actions without explicit priority
	 *
	 * @param {Object} taskData The task data from the REST API response.
	 * @return {Array<Object>} Array of action config objects, ordered by priority.
	 */
	getTaskActions( taskData = {} ) {
		const actions = [];
		const StaticClass = this.constructor;

		// Safety check: if taskData is invalid, use empty object.
		if ( ! taskData || typeof taskData !== 'object' ) {
			taskData = {};
		}

		const providerId = this.getProviderId();
		const taskId = taskData.slug || taskData.id || '';
		const taskTitle =
			taskData.title?.rendered ||
			taskData.title ||
			taskData.post_title ||
			'';

		// Add "Mark as complete" button for dismissable tasks (except user-created tasks).
		if (
			this.capabilityRequired() &&
			this.config.isDismissable &&
			providerId !== 'user'
		) {
			actions.push( {
				type: 'complete',
				priority: 20,
				taskId,
				taskTitle,
			} );
		}

		// Add "Snooze" button for snoozable tasks.
		if ( this.capabilityRequired() && this.config.isSnoozable ) {
			actions.push( {
				type: 'snooze',
				priority: 30,
				taskId,
				taskTitle,
			} );
		}

		// Add educational/informational links.
		// Prefer external links if provided, otherwise show task description in tooltip.
		// Note: Interactive tasks (those with popoverId) don't show info tooltip.
		const isInteractiveTask = !! (
			this.config.popoverId || StaticClass.popoverId
		);
		if ( this.config.externalLinkUrl ) {
			actions.push( {
				type: 'info',
				priority: 40,
				externalUrl: this.config.externalLinkUrl,
			} );
		} else if (
			! isInteractiveTask &&
			taskData.content?.rendered &&
			taskData.content.rendered !== ''
		) {
			actions.push( {
				type: 'info',
				priority: 40,
				taskId,
				taskTitle,
				content: taskData.content.rendered,
			} );
		}

		// Allow child classes to add custom actions (e.g., "Edit Post" for content tasks).
		if ( this.capabilityRequired() ) {
			const modifiedActions = this.addTaskActions( taskData, actions );

			// Ensure all actions have priority set and filter out empty/invalid actions.
			const validActions = modifiedActions
				.map( ( action ) => {
					// Ensure priority is set.
					if ( ! action.priority ) {
						action.priority = 1000;
					}
					return action;
				} )
				.filter( ( action ) => {
					// Remove empty actions - must have type or html (for backward compat).
					return action.type || ( action.html && action.html !== '' );
				} );

			// Sort actions by priority (ascending: lower priority values appear first).
			validActions.sort( ( a, b ) => a.priority - b.priority );

			return validActions;
		}

		// Sort actions by priority (ascending: lower priority values appear first).
		actions.sort( ( a, b ) => a.priority - b.priority );

		return actions;
	}

	/**
	 * Add custom task actions.
	 *
	 * Child classes can override this method to add custom actions.
	 * This is similar to PHP's add_task_actions() method.
	 *
	 * @param {Object} taskData The task data.
	 * @param {Array}  actions  The existing actions array.
	 * @return {Array} The modified actions array.
	 */
	addTaskActions( taskData, actions ) {
		// Default implementation returns actions unchanged.
		// Child classes should override this to add custom actions.
		// eslint-disable-next-line no-unused-vars
		const _taskData = taskData;
		return actions;
	}
}
