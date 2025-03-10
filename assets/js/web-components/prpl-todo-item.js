/* global customElements, HTMLElement, progressPlannerTodoItem, progressPlannerInjectTodoItem, progressPlannerSaveTodoList */

/**
 * Register the custom web component.
 */
customElements.define(
	'prpl-todo-item',
	class extends HTMLElement {
		constructor( content = '', done = false ) {
			// Get parent class properties
			super();

			content = content
				.trim()
				.replace( /</g, '&lt;' )
				.replace( />/g, '&gt;' )
				.replace( '"', '&quot;' );

			const deleteTaskAriaLabel =
				progressPlannerTodoItem.i18n.taskDelete.replace(
					'%s',
					content
				);
			const moveUpTaskAriaLabel =
				progressPlannerTodoItem.i18n.taskMoveUp.replace(
					'%s',
					content
				);
			const moveDownTaskAriaLabel =
				progressPlannerTodoItem.i18n.taskMoveDown.replace(
					'%s',
					content
				);

			this.setAttribute( 'role', 'listitem' );

			this.innerHTML = `
				<span class="prpl-move-buttons">
					<button class="move-up" aria-label="${ moveUpTaskAriaLabel }"><span class="dashicons dashicons-arrow-up-alt2"></span></button>
					<button class="move-down" aria-label="${ moveDownTaskAriaLabel }"><span class="dashicons dashicons-arrow-down-alt2"></span></button>
				</span>
				<input type="checkbox" aria-label="${ content }" ${ done ? 'checked' : '' }>
				<span class="content" contenteditable="plaintext-only">${ content }</span>
				<button class="trash" aria-label="${ deleteTaskAriaLabel }">
					<svg role="img" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path fill="#9ca3af" d="M32.99 47.88H15.01c-3.46 0-6.38-2.7-6.64-6.15L6.04 11.49l-.72.12c-.82.14-1.59-.41-1.73-1.22-.14-.82.41-1.59 1.22-1.73.79-.14 1.57-.26 2.37-.38h.02c2.21-.33 4.46-.6 6.69-.81v-.72c0-3.56 2.74-6.44 6.25-6.55 2.56-.08 5.15-.08 7.71 0 3.5.11 6.25 2.99 6.25 6.55v.72c2.24.2 4.48.47 6.7.81.79.12 1.59.25 2.38.39.82.14 1.36.92 1.22 1.73-.14.82-.92 1.36-1.73 1.22l-.72-.12-2.33 30.24c-.27 3.45-3.18 6.15-6.64 6.15Zm-17.98-3h17.97c1.9 0 3.51-1.48 3.65-3.38l2.34-30.46c-2.15-.3-4.33-.53-6.48-.7h-.03c-5.62-.43-11.32-.43-16.95 0h-.03c-2.15.17-4.33.4-6.48.7l2.34 30.46c.15 1.9 1.75 3.38 3.65 3.38ZM24 7.01c2.37 0 4.74.07 7.11.22v-.49c0-1.93-1.47-3.49-3.34-3.55-2.5-.08-5.03-.08-7.52 0-1.88.06-3.34 1.62-3.34 3.55v.49c2.36-.15 4.73-.22 7.11-.22Zm5.49 32.26h-.06c-.83-.03-1.47-.73-1.44-1.56l.79-20.65c.03-.83.75-1.45 1.56-1.44.83.03 1.47.73 1.44 1.56l-.79 20.65c-.03.81-.7 1.44-1.5 1.44Zm-10.98 0c-.8 0-1.47-.63-1.5-1.44l-.79-20.65c-.03-.83.61-1.52 1.44-1.56.84 0 1.52.61 1.56 1.44l.79 20.65c.03.83-.61 1.52-1.44 1.56h-.06Z"/></svg>
				</button>
			`;

			const thisObject = this;

			// When an item is marked as done, move it to the end of the list.
			// When an item is marked as not done, move it to the start of the list.
			this.querySelector( 'input[type="checkbox"]' ).addEventListener(
				'change',
				() => {
					const todoItemDone = thisObject.querySelector(
						'input[type="checkbox"]'
					).checked;

					thisObject.remove();
					progressPlannerInjectTodoItem(
						thisObject.innerText,
						todoItemDone,
						! todoItemDone,
						true // Save.
					);

					// Announce the status change and move focus to the moved item
					const announcement = todoItemDone
						? progressPlannerTodoItem.i18n.taskCompleted.replace(
								'%s',
								thisObject.innerText
						  )
						: progressPlannerTodoItem.i18n.taskNotCompleted.replace(
								'%s',
								thisObject.innerText
						  );
					document.querySelector(
						'#todo-aria-live-region'
					).textContent = announcement;
				}
			);

			// When the move up button is clicked, move the todo item up the list
			this.querySelector( '.move-up' ).addEventListener( 'click', () => {
				thisObject.parentNode.insertBefore(
					thisObject,
					thisObject.previousElementSibling
				);
				progressPlannerSaveTodoList();
				wp.a11y.speak( progressPlannerTodoItem.i18n.taskMovedUp );
			} );

			// When the move down button is clicked, move the todo item down the list
			this.querySelector( '.move-down' ).addEventListener(
				'click',
				() => {
					thisObject.parentNode.insertBefore(
						thisObject.nextElementSibling,
						thisObject
					);
					progressPlannerSaveTodoList();
					wp.a11y.speak( progressPlannerTodoItem.i18n.taskMovedDown );
				}
			);

			// When the trash button is clicked, remove the todo item from the list
			this.querySelector( '.trash' ).addEventListener( 'click', () => {
				const nextItem = thisObject.nextElementSibling;
				const prevItem = thisObject.previousElementSibling;

				thisObject.remove();
				progressPlannerSaveTodoList();

				// Shift focus to the next item if available, otherwise to the previous item, otherwise to the input field
				if ( nextItem ) {
					nextItem.querySelector( 'input[type="checkbox"]' ).focus();
				} else if ( prevItem ) {
					prevItem.querySelector( 'input[type="checkbox"]' ).focus();
				} else {
					document.getElementById( 'new-todo-content' ).focus();
				}
			} );

			// When an item's contenteditable element is edited,
			// save the new content to the database
			this.querySelector( '.content' ).addEventListener( 'input', () => {
				progressPlannerSaveTodoList();
			} );
		}
	}
);
