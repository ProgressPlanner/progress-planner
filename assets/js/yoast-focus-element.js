/* global progressPlannerYoastFocusElement, MutationObserver */
/**
 * yoast-focus-element script.
 *
 */

/**
 * Check if the value of the element matches the value specified in the task.
 *
 * @param {Element} element The element to check.
 * @param {Object}  task    The task to check.
 * @return {boolean} True if the value matches, false otherwise.
 */
function checkTaskValue( element, task ) {
	if ( ! task.valueElement ) {
		return true;
	}

	const attributeName = task.valueElement.attributeName || 'value';
	const attributeValue = task.valueElement.attributeValue;
	const operator = task.valueElement.operator || '=';
	const currentValue = element.getAttribute( attributeName ) || '';

	switch ( operator ) {
		case '!=':
			return currentValue !== attributeValue;
		case '=':
		default:
			return currentValue === attributeValue;
	}
}

/**
 * Observe the Yoast sidebar clicks.
 */
function observeYoastSidebarClicks() {
	const container = document.querySelector( '#yoast-seo-settings' );

	if ( ! container ) return;

	const waitForNav = new MutationObserver( ( mutationsList, observer ) => {
		const nav = container.querySelector(
			'nav.yst-sidebar-navigation__sidebar'
		);
		if ( nav ) {
			// Sidebar nav loaded.
			observer.disconnect();

			nav.addEventListener( 'click', ( e ) => {
				const link = e.target.closest( 'a' );
				if ( link ) {
					// Sidebar link clicked.
					waitForMainAndObserveContent(); // re-run logic after clicking
				}
			} );
		}
	} );

	waitForNav.observe( container, {
		childList: true,
		subtree: true,
	} );
}

/**
 * Wait for the main content to load and observe the content.
 */
function waitForMainAndObserveContent() {
	const container = document.querySelector( '#yoast-seo-settings' );
	if ( ! container ) return;

	const waitForMain = new MutationObserver( ( mutationsList, observer ) => {
		const main = container.querySelector( 'main.yst-paper' );
		if ( main ) {
			// Main loaded.
			observer.disconnect();

			const childObserver = new MutationObserver( ( mutations ) => {
				for ( const mutation of mutations ) {
					if (
						mutation.type === 'attributes' &&
						mutation.attributeName === 'class'
					) {
						const el = mutation.target;
						if (
							el.parentElement === main &&
							el.classList.contains( 'yst-opacity-100' )
						) {
							// Fully loaded content.
							childObserver.disconnect();

							// Loop through the tasks and add the focus element.
							for ( const task of progressPlannerYoastFocusElement.tasks ) {
								// Try to find the toggleButton.
								const valueElement = el.querySelector(
									task.valueElement.elementSelector
								);
								if ( valueElement ) {
									// We usually add icon to the option header.
									let addIconElement = valueElement.closest(
										task.iconElement
									);

									// Exception is the upload input field.
									if (
										! addIconElement &&
										valueElement.type === 'hidden'
									) {
										addIconElement = valueElement
											.closest( 'fieldset' )
											.querySelector( task.iconElement );
									}

									// Upload input field.
									if ( ! addIconElement ) {
										continue;
									}

									// Append next to the valueElemen, only if it's not already there.
									if (
										! addIconElement.querySelector(
											'.prpl-form-row-ravi'
										)
									) {
										addIconElement.style.position =
											'relative';

										// Create a new span with the class prpl-form-row-ravi.
										const raviIconWrapper =
											document.createElement( 'span' );
										raviIconWrapper.classList.add(
											'prpl-form-row-ravi'
										);
										raviIconWrapper.style.position =
											'absolute';
										raviIconWrapper.style.right = '-1.5rem';
										raviIconWrapper.style.top = '0';

										// Check for value if specified in task.
										const valueMatches = checkTaskValue(
											valueElement,
											task
										);

										raviIconWrapper.appendChild(
											document.createElement( 'span' )
										);

										// Create an icon image.
										const iconImg =
											document.createElement( 'img' );
										iconImg.src =
											progressPlannerYoastFocusElement.base_url +
											'/assets/images/icon_progress_planner.svg';
										iconImg.alt = 'Ravi';
										iconImg.width = 16;
										iconImg.height = 16;

										// Apply grayscale if state doesn't match
										iconImg.style.filter = ! valueMatches
											? 'grayscale(100%)'
											: 'none';

										// Append the icon image to the raviIconWrapper.
										raviIconWrapper
											.querySelector( 'span' )
											.appendChild( iconImg );

										// Watch for changes in aria-checked to update the icon dynamically
										const valueElementObserver =
											new MutationObserver( () => {
												// Check value again if specified
												const currentValueMatches =
													checkTaskValue(
														valueElement,
														task
													);
												iconImg.style.filter =
													! currentValueMatches
														? 'grayscale(100%)'
														: 'none';
											} );

										valueElementObserver.observe(
											valueElement,
											{
												attributes: true,
												attributeFilter: [
													task.valueElement
														.attributeName,
												],
											}
										);

										// Finally add the raviIconWrapper to the DOM.
										addIconElement.appendChild(
											raviIconWrapper
										);
									}
								}
							}
						}
					}
				}
			} );

			// Watch direct children of main.yst-paper
			main.querySelectorAll( ':scope > *' ).forEach( ( child ) => {
				childObserver.observe( child, {
					attributes: true,
					attributeFilter: [ 'class' ],
				} );
			} );
		}
	} );

	waitForMain.observe( container, {
		childList: true,
		subtree: true,
	} );
}

// Run once on initial page load.
waitForMainAndObserveContent();
observeYoastSidebarClicks();
