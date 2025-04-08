/* global progressPlannerYoastFocusElement, MutationObserver */
/**
 * yoast-focus-element script.
 *
 */

/**
 * Yoast Focus Element class.
 */
class YoastFocusElement {
	/**
	 * Constructor.
	 */
	constructor() {
		this.container = document.querySelector( '#yoast-seo-settings' );
		this.tasks = progressPlannerYoastFocusElement.tasks;
		this.baseUrl = progressPlannerYoastFocusElement.base_url;

		if ( this.container ) {
			this.init();
		}
	}

	/**
	 * Initialize the Yoast Focus Element.
	 */
	init() {
		this.waitForMainAndObserveContent();
		this.observeYoastSidebarClicks();
	}

	/**
	 * Check if the value of the element matches the value specified in the task.
	 *
	 * @param {Element} element The element to check.
	 * @param {Object}  task    The task to check.
	 * @return {boolean} True if the value matches, false otherwise.
	 */
	checkTaskValue( element, task ) {
		if ( ! task.valueElement ) {
			return true;
		}

		const attributeName = task.valueElement.attributeName || 'value';
		const attributeValue = task.valueElement.attributeValue;
		const operator = task.valueElement.operator || '=';
		const currentValue = element.getAttribute( attributeName ) || '';

		return '!=' === operator
			? currentValue !== attributeValue
			: currentValue === attributeValue;
	}

	/**
	 * Observe the Yoast sidebar clicks.
	 */
	observeYoastSidebarClicks() {
		const waitForNav = new MutationObserver(
			( mutationsList, observer ) => {
				const nav = this.container.querySelector(
					'nav.yst-sidebar-navigation__sidebar'
				);
				if ( nav ) {
					observer.disconnect();

					nav.addEventListener( 'click', ( e ) => {
						const link = e.target.closest( 'a' );
						if ( link ) {
							this.waitForMainAndObserveContent();
						}
					} );
				}
			}
		);

		waitForNav.observe( this.container, {
			childList: true,
			subtree: true,
		} );
	}

	/**
	 * Wait for the main content to load and observe the content.
	 */
	waitForMainAndObserveContent() {
		const waitForMain = new MutationObserver(
			( mutationsList, observer ) => {
				const main = this.container.querySelector( 'main.yst-paper' );
				if ( main ) {
					observer.disconnect();

					const childObserver = new MutationObserver(
						( mutations ) => {
							for ( const mutation of mutations ) {
								if (
									mutation.type === 'attributes' &&
									mutation.attributeName === 'class'
								) {
									const el = mutation.target;
									if (
										el.parentElement === main &&
										el.classList.contains(
											'yst-opacity-100'
										)
									) {
										this.processTasks( el );
									}
								}
							}
						}
					);

					main.querySelectorAll( ':scope > *' ).forEach(
						( child ) => {
							childObserver.observe( child, {
								attributes: true,
								attributeFilter: [ 'class' ],
							} );
						}
					);
				}
			}
		);

		waitForMain.observe( this.container, {
			childList: true,
			subtree: true,
		} );
	}

	/**
	 * Process all tasks for a given element.
	 *
	 * @param {Element} el The element to process tasks for.
	 */
	processTasks( el ) {
		for ( const task of this.tasks ) {
			const valueElement = el.querySelector(
				task.valueElement.elementSelector
			);
			const raviIconPositionAbsolute = true;

			if ( valueElement ) {
				this.processTask(
					valueElement,
					task,
					raviIconPositionAbsolute
				);
			}
		}
	}

	/**
	 * Process a single task.
	 *
	 * @param {Element} valueElement             The value element to process.
	 * @param {Object}  task                     The task to process.
	 * @param {boolean} raviIconPositionAbsolute Whether the icon should be absolutely positioned.
	 */
	processTask( valueElement, task, raviIconPositionAbsolute ) {
		let addIconElement = valueElement.closest( task.iconElement );

		// Exception is the upload input field.
		if ( ! addIconElement && valueElement.type === 'hidden' ) {
			addIconElement = valueElement
				.closest( 'fieldset' )
				.querySelector( task.iconElement );
			raviIconPositionAbsolute = false;
		}

		if ( ! addIconElement ) {
			return;
		}

		if (
			! addIconElement.querySelector( '[data-prpl-element="ravi-icon"]' )
		) {
			this.addIcon(
				valueElement,
				addIconElement,
				task,
				raviIconPositionAbsolute
			);
		}
	}

	/**
	 * Add icon to the element.
	 *
	 * @param {Element} valueElement             The value element.
	 * @param {Element} addIconElement           The element to add the icon to.
	 * @param {Object}  task                     The task.
	 * @param {boolean} raviIconPositionAbsolute Whether the icon should be absolutely positioned.
	 */
	addIcon( valueElement, addIconElement, task, raviIconPositionAbsolute ) {
		const valueMatches = this.checkTaskValue( valueElement, task );

		// Create a new span with the class prpl-form-row-ravi.
		const raviIconWrapper = document.createElement( 'span' );
		raviIconWrapper.classList.add(
			'prpl-element-awards-points-icon-wrapper'
		);
		raviIconWrapper.setAttribute( 'data-prpl-element', 'ravi-icon' );

		if ( valueMatches ) {
			raviIconWrapper.classList.add( 'complete' );
		}

		// Styling for absolute positioning.
		if ( raviIconPositionAbsolute ) {
			addIconElement.style.position = 'relative';

			raviIconWrapper.style.position = 'absolute';
			raviIconWrapper.style.right = '3.5rem';
			raviIconWrapper.style.top = '-7px';
		}

		raviIconWrapper.appendChild( document.createElement( 'span' ) );

		// Create an icon image.
		const iconImg = document.createElement( 'img' );
		iconImg.src = this.baseUrl + '/assets/images/icon_progress_planner.svg';
		iconImg.alt = 'Ravi';
		iconImg.width = 16;
		iconImg.height = 16;

		// Append the icon image to the raviIconWrapper.
		raviIconWrapper.querySelector( 'span' ).appendChild( iconImg );

		// Add the points to the raviIconWrapper.
		const pointsWrapper = document.createElement( 'span' );
		pointsWrapper.classList.add( 'prpl-form-row-points' );
		pointsWrapper.textContent = valueMatches ? '✓' : '+1';
		raviIconWrapper.appendChild( pointsWrapper );

		// Watch for changes in aria-checked to update the icon dynamically
		const valueElementObserver = new MutationObserver( () => {
			const currentValueMatches = this.checkTaskValue(
				valueElement,
				task
			);

			if ( currentValueMatches ) {
				raviIconWrapper.classList.add( 'complete' );
				pointsWrapper.textContent = '✓';
			} else {
				raviIconWrapper.classList.remove( 'complete' );
				pointsWrapper.textContent = '+1';
			}
		} );

		valueElementObserver.observe( valueElement, {
			attributes: true,
			attributeFilter: [ task.valueElement.attributeName ],
		} );

		// Finally add the raviIconWrapper to the DOM.
		addIconElement.appendChild( raviIconWrapper );
	}
}

// Initialize the Yoast Focus Element.
new YoastFocusElement();
