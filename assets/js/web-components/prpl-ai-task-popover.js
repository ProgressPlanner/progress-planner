/* global prplSuggestedTask, customElements, PrplInteractiveTask */

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
		 * Runs when the popover is opening.
		 * Use this to set up task-specific data.
		 */
		popoverOpening() {
			super.popoverOpening();

			console.log( 'AI Task: Popover opening' );

			// Get task data from the trigger button
			const popoverId = this.getAttribute( 'popover-id' );
			const popover = document.getElementById( popoverId );

			// Find the trigger button that was just clicked
			// When a button with popovertarget is clicked, it becomes the activeElement
			let triggerButton = document.activeElement;

			// Verify it's the correct button (has the matching popovertarget)
			if ( ! triggerButton || triggerButton.getAttribute( 'popovertarget' ) !== popoverId ) {
				// Fallback: search for the button within the closest task element if we can find one
				console.warn( 'AI Task: Could not determine which trigger button was clicked via activeElement' );
				triggerButton = document.querySelector(
					`button[popovertarget="${ popoverId }"]`
				);
			}

			if ( ! triggerButton ) {
				console.warn( 'AI Task: Could not find trigger button' );
				return;
			}

			console.log( 'AI Task: Found trigger button:', triggerButton );

			// Get task data from button attributes
			const taskId = triggerButton.dataset.taskId;
			const taskPrompt = triggerButton.dataset.taskPrompt;

			// Get the task element and its slug for completion
			const taskElement = triggerButton.closest( '.prpl-suggested-task' );
			const taskSlug = taskElement ? taskElement.dataset.taskId : null;

			console.log( 'AI Task: Task ID:', taskId );
			console.log( 'AI Task: Task slug:', taskSlug );
			console.log( 'AI Task: Task prompt:', taskPrompt );

			// Store task data on web component
			this.setAttribute( 'data-task-id', taskId );
			this.setAttribute( 'current-task-id', taskSlug );

			// Display task prompt if available
			const promptEl = popover.querySelector( '.prpl-ai-task-prompt' );
			const promptTextEl = popover.querySelector(
				'.prpl-ai-task-prompt-text'
			);
			if ( taskPrompt && promptTextEl ) {
				promptTextEl.textContent = taskPrompt;
				promptEl.style.display = 'block';
			} else if ( promptEl ) {
				promptEl.style.display = 'none';
			}

			// Reset popover state
			const instructionsEl = popover.querySelector(
				'.prpl-ai-task-instructions'
			);
			const loadingEl = popover.querySelector( '.prpl-ai-task-loading' );
			const resultEl = popover.querySelector( '.prpl-ai-task-result' );
			const errorEl = popover.querySelector( '.prpl-ai-task-error' );
			const executeButton = popover.querySelector(
				'.prpl-ai-task-execute'
			);
			const retryButton = popover.querySelector( '.prpl-ai-task-retry' );
			const completeButton = popover.querySelector(
				'.prpl-ai-task-complete'
			);

			if ( instructionsEl ) {
				instructionsEl.style.display = 'block';
			}
			if ( loadingEl ) {
				loadingEl.style.display = 'none';
			}
			if ( resultEl ) {
				resultEl.style.display = 'none';
			}
			if ( errorEl ) {
				errorEl.style.display = 'none';
			}
			if ( executeButton ) {
				executeButton.style.display = 'inline-block';
				executeButton.dataset.taskId = taskId;
			}
			if ( retryButton ) {
				retryButton.style.display = 'none';
				retryButton.dataset.taskId = taskId;
			}
			if ( completeButton ) {
				completeButton.style.display = 'none';
			}
		}

		/**
		 * Attach button event listeners.
		 * Overrides parent to prevent duplicate listeners.
		 */
		attachDefaultEventListeners() {
			// Prevent attaching listeners multiple times
			if ( this.listenersAttached ) {
				console.log(
					'AI Task: Event listeners already attached, skipping'
				);
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
				console.warn(
					'AI Task: Already completing, ignoring duplicate call'
				);
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

			console.log(
				'AI Task: Found',
				tasks.length,
				'task elements in list'
			);

			let foundMatch = false;

			tasks.forEach( ( taskElement ) => {
				console.log(
					'AI Task: Checking task element with ID:',
					taskElement.dataset.taskId
				);
				if ( taskElement.dataset.taskId === currentTaskId ) {
					console.log( 'AI Task: Found matching task element' );

					if ( foundMatch ) {
						console.warn(
							'AI Task: Found duplicate matching task element! This should not happen.'
						);
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
						console.log(
							'AI Task: Calling maybeComplete with post ID:',
							postId
						);
						prplSuggestedTask.maybeComplete( postId );

						// Reset flag after a delay
						setTimeout( () => {
							this.isCompleting = false;
						}, 1000 );
					} else {
						console.error(
							'AI Task: No post ID found on task element'
						);
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
