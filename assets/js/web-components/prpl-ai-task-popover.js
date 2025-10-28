/* global HTMLElement, prplSuggestedTask, customElements, PrplInteractiveTask */

/**
 * AI Task Popover Web Component
 *
 * Extends PrplInteractiveTask to handle AI task completion.
 */
customElements.define(
	'prpl-ai-task-popover',
	class extends PrplInteractiveTask {
		constructor() {
			super();
			this.listenersAttached = false;
		}

		/**
		 * Attach button event listeners.
		 * Overrides parent to prevent duplicate listeners.
		 */
		attachDefaultEventListeners() {
			// Prevent attaching listeners multiple times
			if ( this.listenersAttached ) {
				console.log( 'AI Task: Event listeners already attached, skipping' );
				return;
			}

			console.log( 'AI Task: Attaching event listeners' );

			// Add event listeners.
			this.querySelectorAll( 'button' ).forEach( ( buttonElement ) => {
				buttonElement.addEventListener( 'click', ( e ) => {
					const button = e.target.closest( 'button' );
					const action = button?.dataset.action;
					if ( action && typeof this[ action ] === 'function' ) {
						this[ action ]();
					}
				} );
			} );

			this.listenersAttached = true;
		}

		/**
		 * Complete the task.
		 * Overrides parent to use current-task-id attribute instead of provider-id.
		 */
		completeTask() {
			console.log( '=== AI Task completeTask called ===' );
			console.trace( 'Stack trace' );

			// Prevent multiple completions
			if ( this.isCompleting ) {
				console.warn( 'AI Task: Already completing, ignoring duplicate call' );
				return;
			}

			this.isCompleting = true;

			// Get the current task ID that was set when the popover opened
			const currentTaskId = this.getAttribute( 'current-task-id' );

			if ( ! currentTaskId ) {
				console.error( 'No current-task-id set on AI task popover' );
				this.isCompleting = false;
				return;
			}

			console.log( 'AI Task: Completing task with ID:', currentTaskId );

			const tasks = document.querySelectorAll(
				'#prpl-suggested-tasks-list .prpl-suggested-task'
			);

			console.log( 'AI Task: Found', tasks.length, 'task elements in list' );

			let foundMatch = false;

			tasks.forEach( ( taskElement ) => {
				console.log( 'AI Task: Checking task element with ID:', taskElement.dataset.taskId );
				if ( taskElement.dataset.taskId === currentTaskId ) {
					console.log( 'AI Task: Found matching task element' );

					if ( foundMatch ) {
						console.warn( 'AI Task: Found duplicate matching task element! This should not happen.' );
						return;
					}

					foundMatch = true;

					// Close popover.
					const popoverId = this.getAttribute( 'popover-id' );
					const popover = document.getElementById( popoverId );
					if ( popover ) {
						popover.hidePopover();
					}

					const postId = parseInt( taskElement.dataset.postId );

					if ( postId ) {
						console.log( 'AI Task: Calling maybeComplete with post ID:', postId );
						prplSuggestedTask.maybeComplete( postId );

						// Reset flag after a delay
						setTimeout( () => {
							this.isCompleting = false;
						}, 1000 );
					} else {
						console.error( 'AI Task: No post ID found on task element' );
						this.isCompleting = false;
					}
				}
			} );

			if ( ! foundMatch ) {
				console.error( 'AI Task: No matching task element found' );
				this.isCompleting = false;
			}
		}
	}
);
