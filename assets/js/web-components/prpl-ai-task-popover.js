/* global prplSuggestedTask, customElements, PrplInteractiveTask */

/**
 * AI Task Popover Web Component
 *
 * Extends PrplInteractiveTask to handle AI task completion.
 */
customElements.define(
	'prpl-ai-task-popover',
	class extends PrplInteractiveTask {
		/**
		 * Complete the task.
		 * Overrides parent to use current-task-id attribute instead of provider-id.
		 */
		completeTask() {
			// Prevent multiple completions.
			if ( this.isCompleting ) {
				return;
			}

			this.isCompleting = true;

			// Get the current task ID that was set when the popover opened.
			const currentTaskId = this.getAttribute( 'current-task-id' );

			if ( ! currentTaskId ) {
				console.error( 'No current-task-id set on AI task popover' );
				this.isCompleting = false;
				return;
			}

			const tasks = document.querySelectorAll(
				'#prpl-suggested-tasks-list .prpl-suggested-task'
			);

			let foundMatch = false;

			tasks.forEach( ( taskElement ) => {
				if ( taskElement.dataset.taskId === currentTaskId ) {
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
						prplSuggestedTask.maybeComplete( postId );

						// Reset flag after a delay.
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
