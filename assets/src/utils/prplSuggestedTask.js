/**
 * Global prplSuggestedTask object for backward compatibility.
 *
 * Provides methods that work with React components while maintaining
 * compatibility with inline onclick handlers in PHP-generated HTML.
 *
 * This object bridges the gap between legacy inline handlers and the
 * new React-based implementation.
 */

/**
 * Maybe complete a task.
 *
 * Finds the task element and triggers the complete button click,
 * which will be handled by React's event listener in TaskActions.js.
 *
 * @param {number} postId The post ID.
 * @return {Promise} A promise that resolves when the action is triggered.
 */
export function maybeComplete( postId ) {
	return new Promise( ( resolve, reject ) => {
		try {
			// Find the task element by post ID.
			const taskElement = document.querySelector(
				`.prpl-suggested-task[data-post-id="${ postId }"]`
			);

			if ( ! taskElement ) {
				console.warn(
					`prplSuggestedTask.maybeComplete: Task element not found for post ID ${ postId }`
				);
				reject( new Error( `Task element not found for post ID ${ postId }` ) );
				return;
			}

			// Find the complete button within this task element.
			const completeButton = taskElement.querySelector(
				'[data-action="complete"]'
			);

			if ( completeButton ) {
				// Remove the inline onclick handler to prevent infinite loop.
				const originalOnclick = completeButton.getAttribute( 'onclick' );
				completeButton.removeAttribute( 'onclick' );

				// Use setTimeout to ensure React's event listeners are set up
				// (they're added in useEffect which runs after render).
				setTimeout( () => {
					// Trigger a click event which will be handled by React's event listener.
					completeButton.click();
					// Restore onclick if it existed (though React's listener handles it now).
					if ( originalOnclick ) {
						completeButton.setAttribute( 'onclick', originalOnclick );
					}
					resolve( { postId } );
				}, 0 );
			} else {
				console.warn(
					`prplSuggestedTask.maybeComplete: Complete button not found for post ID ${ postId }`
				);
				reject(
					new Error( `Complete button not found for post ID ${ postId }` )
				);
			}
		} catch ( error ) {
			console.error(
				'prplSuggestedTask.maybeComplete: Error completing task',
				error
			);
			reject( error );
		}
	} );
}

/**
 * Snooze a task.
 *
 * Finds the task element and triggers the snooze radio button change,
 * which will be handled by React's event listener in TaskActions.js.
 *
 * @param {number} postId         The post ID.
 * @param {string} snoozeDuration The snooze duration key.
 * @return {Promise} A promise that resolves when the action is triggered.
 */
export function snooze( postId, snoozeDuration ) {
	return new Promise( ( resolve, reject ) => {
		try {
			// Find the task element by post ID.
			const taskElement = document.querySelector(
				`.prpl-suggested-task[data-post-id="${ postId }"]`
			);

			if ( ! taskElement ) {
				console.warn(
					`prplSuggestedTask.snooze: Task element not found for post ID ${ postId }`
				);
				reject( new Error( `Task element not found for post ID ${ postId }` ) );
				return;
			}

			// Find the snooze radio button with the matching duration value.
			const snoozeRadio = taskElement.querySelector(
				`.prpl-snooze-duration-radio-group input[type="radio"][value="${ snoozeDuration }"]`
			);

			if ( snoozeRadio ) {
				// Remove the inline onchange handler to prevent infinite loop.
				const originalOnchange = snoozeRadio.getAttribute( 'onchange' );
				snoozeRadio.removeAttribute( 'onchange' );

				// Use setTimeout to ensure React's event listeners are set up
				// (they're added in useEffect which runs after render).
				setTimeout( () => {
					// Set the value and trigger a change event which will be
					// handled by React's event listener.
					snoozeRadio.checked = true;
					snoozeRadio.dispatchEvent( new Event( 'change', { bubbles: true } ) );
					// Restore onchange if it existed (though React's listener handles it now).
					if ( originalOnchange ) {
						snoozeRadio.setAttribute( 'onchange', originalOnchange );
					}
					resolve( { postId, snoozeDuration } );
				}, 0 );
			} else {
				console.warn(
					`prplSuggestedTask.snooze: Snooze radio button not found for post ID ${ postId } with duration ${ snoozeDuration }`
				);
				reject(
					new Error(
						`Snooze radio button not found for post ID ${ postId } with duration ${ snoozeDuration }`
					)
				);
			}
		} catch ( error ) {
			console.error( 'prplSuggestedTask.snooze: Error snoozing task', error );
			reject( error );
		}
	} );
}

/**
 * Create the global prplSuggestedTask object.
 *
 * @return {Object} The prplSuggestedTask object.
 */
export default {
	maybeComplete,
	snooze,
};
