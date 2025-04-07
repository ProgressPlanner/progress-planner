/* global progressPlannerYoastFocusElement, MutationObserver */
/**
 * yoast-focus-element script.
 *
 * Dependencies: progress-planner/l10n
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
								const toggleButton = el.querySelector(
									`button[data-id="${ task.element }"]`
								);
								if ( toggleButton ) {
									// Append next to the toggleButton, only if it's not already there.
									if (
										! toggleButton
											.closest(
												'.yst-toggle-field__header'
											)
											.querySelector(
												'.prpl-form-row__description'
											)
									) {
										toggleButton.closest(
											'.yst-toggle-field__header'
										).style.position = 'relative';
										// Create a new div with the class prpl-form-row__description.
										const next =
											document.createElement( 'span' );
										next.classList.add(
											'prpl-form-row-ravi'
										);
										next.style.position = 'absolute';
										next.style.right = '-1.5rem';
										next.style.top = '0';

										// Check if the toggleButton is checked or not.
										const isChecked =
											toggleButton.getAttribute(
												'aria-checked'
											);

										next.appendChild(
											document.createElement( 'span' )
										);

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

										next.querySelector(
											'span'
										).appendChild( iconImg );

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

										toggleButton
											.closest(
												'.yst-toggle-field__header'
											)
											.appendChild( next );
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
