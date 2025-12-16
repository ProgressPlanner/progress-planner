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

	/**
	 * Get task actions HTML buttons/links for display in the UI.
	 *
	 * Generates an array of HTML action buttons that users can interact with for each task.
	 * Actions are ordered by priority (lower numbers appear first).
	 *
	 * Standard actions include:
	 * - Complete button (priority 20): Marks task as complete and awards points
	 * - Snooze button (priority 30): Postpones task for specified duration (1 week to forever)
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
	 * @return {Array<string>} Array of HTML strings for action buttons/links, ordered by priority.
	 */
	getTaskActions( taskData = {} ) {
		const actions = [];
		const StaticClass = this.constructor;

		// Safety check: if taskData is invalid, use empty object
		if ( ! taskData || typeof taskData !== 'object' ) {
			taskData = {};
		}

		const providerId = this.getProviderId();

		// Debug logging (can be removed in production)
		if ( typeof window !== 'undefined' && window.prplDebug ) {
			console.log( 'getTaskActions called:', {
				providerId,
				config: this.config,
				taskData: {
					id: taskData.id,
					slug: taskData.slug,
					title: taskData.title,
					prpl_provider: taskData.prpl_provider,
				},
			} );
		}

		// Add "Mark as complete" button for dismissable tasks (except user-created tasks).
		if (
			this.capabilityRequired() &&
			this.config.isDismissable &&
			providerId !== 'user'
		) {
			const taskId = taskData.slug || taskData.id || '';
			const taskTitle =
				taskData.title?.rendered ||
				taskData.title ||
				taskData.post_title ||
				'';
			const postId = taskData.id || taskData.post_id || '';

			actions.push( {
				priority: 20,
				html: `<button type="button" class="prpl-suggested-task-button" data-task-id="${ this.escapeHtml(
					taskId
				) }" data-task-title="${ this.escapeHtml(
					taskTitle
				) }" data-action="complete" data-target="complete" title="Mark as complete"><span class="prpl-tooltip-action-text">Mark as complete</span><span class="screen-reader-text">Mark as complete</span></button>`,
				postId, // Store postId for event handler attachment
			} );
		}

		// Add "Snooze" button with duration options for snoozable tasks.
		if ( this.capabilityRequired() && this.config.isSnoozable ) {
			const taskId = taskData.slug || taskData.id || '';
			const taskTitle =
				taskData.title?.rendered ||
				taskData.title ||
				taskData.post_title ||
				'';
			const postId = taskData.id || taskData.post_id || '';

			const snoozeDurations = [
				{ key: '1-week', label: '1 week' },
				{ key: '1-month', label: '1 month' },
				{ key: '3-months', label: '3 months' },
				{ key: '6-months', label: '6 months' },
				{ key: '1-year', label: '1 year' },
				{ key: 'forever', label: 'forever' },
			];

			let snoozeHtml = `<prpl-tooltip class="prpl-suggested-task-snooze"><slot name="open"><button type="button" class="prpl-suggested-task-button" data-task-id="${ this.escapeHtml(
				taskId
			) }" data-task-title="${ this.escapeHtml(
				taskTitle
			) }" data-action="snooze" data-target="snooze" title="Snooze"><span class="prpl-tooltip-action-text">Snooze</span><span class="screen-reader-text">Snooze</span></button></slot><slot name="content">`;
			snoozeHtml += `<fieldset><legend><span>Snooze this task?</span><button type="button" class="prpl-toggle-radio-group" onclick="this.closest('.prpl-suggested-task-snooze').classList.toggle('prpl-toggle-radio-group-open');"><span class="prpl-toggle-radio-group-text">How long?</span><span class="prpl-toggle-radio-group-arrow">&rsaquo;</span></button></legend><div class="prpl-snooze-duration-radio-group">`;

			// Generate radio buttons for snooze duration options.
			snoozeDurations.forEach( ( duration ) => {
				snoozeHtml += `<label><input type="radio" name="snooze-duration-${ this.escapeHtml(
					taskId
				) }" value="${ this.escapeHtml(
					duration.key
				) }">${ this.escapeHtml( duration.label ) }</label>`;
			} );

			snoozeHtml += `</div></fieldset></slot></prpl-tooltip>`;

			actions.push( {
				priority: 30,
				html: snoozeHtml,
				postId, // Store postId for event handler attachment
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
				priority: 40,
				html: `<a class="prpl-tooltip-action-text" href="${ this.escapeHtml(
					this.config.externalLinkUrl
				) }" target="_blank">Why is this important?</a>`,
			} );
		} else if (
			! isInteractiveTask &&
			taskData.content?.rendered &&
			taskData.content.rendered !== ''
		) {
			const taskId = taskData.slug || taskData.id || '';
			const taskTitle =
				taskData.title?.rendered ||
				taskData.title ||
				taskData.post_title ||
				'';
			const content = taskData.content.rendered;

			actions.push( {
				priority: 40,
				html: `<prpl-tooltip><slot name="open"><button type="button" class="prpl-suggested-task-button" data-task-id="${ this.escapeHtml(
					taskId
				) }" data-task-title="${ this.escapeHtml(
					taskTitle
				) }" data-action="info" data-target="info" title="Info"><span class="prpl-tooltip-action-text">Info</span><span class="screen-reader-text">Info</span></button></slot><slot name="content">${ content }</slot></prpl-tooltip>`,
			} );
		}

		// Allow child classes to add custom actions (e.g., "Edit Post" for content tasks).
		if ( this.capabilityRequired() ) {
			const modifiedActions = this.addTaskActions( taskData, actions );

			// Ensure all actions have priority set and filter out empty actions.
			const validActions = modifiedActions
				.map( ( action ) => {
					// Ensure priority is set
					if ( ! action.priority ) {
						action.priority = 1000;
					}
					return action;
				} )
				.filter( ( action ) => {
					// Remove empty actions
					return action.html && action.html !== '';
				} );

			// Sort actions by priority (ascending: lower priority values appear first).
			validActions.sort( ( a, b ) => a.priority - b.priority );

			// Extract just the HTML strings (discard priority metadata).
			return validActions.map( ( action ) => action.html );
		}

		// Sort actions by priority (ascending: lower priority values appear first).
		actions.sort( ( a, b ) => a.priority - b.priority );

		// Extract just the HTML strings (discard priority metadata).
		return actions.map( ( action ) => action.html );
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

	/**
	 * Escape HTML to prevent XSS.
	 *
	 * @param {string} text The text to escape.
	 * @return {string} The escaped text.
	 */
	escapeHtml( text ) {
		if ( typeof text !== 'string' ) {
			return '';
		}
		const div = document.createElement( 'div' );
		div.textContent = text;
		return div.innerHTML;
	}
}
