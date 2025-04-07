/* global progressPlannerYoastFocusElement, MutationObserver */
/**
 * yoast-focus-element script.
 *
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
								const toggleButton = el.querySelector(
									task.element
								);
								if ( toggleButton ) {
									// Get option header.
									const optionHeader = toggleButton.closest(
										'.yst-toggle-field__header'
									);

									// Append next to the toggleButton, only if it's not already there.
									if (
										! optionHeader.querySelector(
											'.prpl-form-row-ravi'
										)
									) {
										optionHeader.style.position =
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

										// Check if the toggleButton is checked or not.
										const isChecked =
											toggleButton.getAttribute(
												'aria-checked'
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
										iconImg.style.filter =
											isChecked !== task.checked
												? 'grayscale(100%)'
												: 'none';

										// Append the icon image to the raviIconWrapper.
										raviIconWrapper
											.querySelector( 'span' )
											.appendChild( iconImg );

										// Watch for changes in aria-checked to update the icon dynamically
										const toggleObserver =
											new MutationObserver( () => {
												const currentState =
													toggleButton.getAttribute(
														'aria-checked'
													);
												iconImg.style.filter =
													currentState !==
													task.checked
														? 'grayscale(100%)'
														: 'none';
											} );

										toggleObserver.observe( toggleButton, {
											attributes: true,
											attributeFilter: [ 'aria-checked' ],
										} );

										// Finally add the raviIconWrapper to the DOM.
										optionHeader.appendChild(
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

// Run once on initial page load
waitForMainAndObserveContent();
observeYoastSidebarClicks();
