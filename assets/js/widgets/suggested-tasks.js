/* global customElements, prplSuggestedTasks, prplDocumentReady */
/*
 * Widget: Suggested Tasks
 *
 * A widget that displays a list of suggested tasks.
 *
 * Dependencies: wp-api, progress-planner/web-components/prpl-suggested-task, progress-planner/celebrate, progress-planner/grid-masonry, progress-planner/web-components/prpl-suggested-task, progress-planner/document-ready, progress-planner/web-components/prpl-tooltip, progress-planner/suggested-task-terms
 */
/* eslint-disable camelcase */

const prplSuggestedTasksToggleUIitems = () => {
	document.querySelector( '.prpl-suggested-tasks-loading' )?.remove();
	const items = document.querySelectorAll(
		'.prpl-suggested-tasks-list .prpl-suggested-task'
	);

	if ( 0 === items.length ) {
		document.querySelector( '.prpl-no-suggested-tasks' ).style.display =
			'block';
	}
};

/**
 * Inject items from a category.
 */
document.addEventListener(
	'prpl/suggestedTask/injectCategoryItems',
	( event ) => {
		// If window.progressPlannerSuggestedTasksTerms is not loaded, try again after 100ms, for up to 10 times.
		if (
			! window?.progressPlannerSuggestedTasksTerms
				?.prpl_recommendations_category[ event.detail.category ]?.id
		) {
			window.prplSuggestedTasksInjectCategoryItemsAttempts =
				window.prplSuggestedTasksInjectCategoryItemsAttempts || 0;
			if ( window.prplSuggestedTasksInjectCategoryItemsAttempts > 10 ) {
				return;
			}
			setTimeout( () => {
				document.dispatchEvent( event );
			}, 100 );
			return;
		}
		console.info(
			`Attempting to fetch recommendations for category: ${ event.detail.category }`
		);
		wp.api.loadPromise.done( () => {
			const postsCollection =
				new wp.api.collections.Prpl_recommendations();
			const excludeIds = [];
			document
				.querySelectorAll( '.prpl-suggested-task' )
				.forEach( ( item ) => {
					excludeIds.push( item.getAttribute( 'data-post-id' ) );
				} );

			postsCollection
				.fetch( {
					data: {
						status: [ 'publish' ],
						per_page: Math.max(
							Math.min(
								prplSuggestedTasks.maxItemsPerCategory[
									event.detail.category
								],
								100
							),
							1
						),
						_embed: true,
						exclude_provider: 'user',
						exclude: excludeIds,
						prpl_recommendations_category:
							window.progressPlannerSuggestedTasksTerms
								.prpl_recommendations_category[
								event.detail.category
							].id,
						filter: {
							orderby: 'menu_order',
							order: 'ASC',
						},
					},
				} )
				.done( ( data ) => {
					console.info(
						`Fetched ${ data.length } recommendations for category: ${ event.detail.category }`
					);
					console.info( data );
					data.forEach( ( item ) => {
						document.dispatchEvent(
							new CustomEvent( 'prpl/suggestedTask/injectItem', {
								detail: item,
							} )
						);
					} );
					prplSuggestedTasksToggleUIitems();
				} );
		} );
	}
);

/**
 * Inject a todo item.
 */
document.addEventListener( 'prpl/suggestedTask/injectItem', ( event ) => {
	const Item = customElements.get( 'prpl-suggested-task' );
	const item = new Item( {
		...event.detail,
		allowReorder: false,
	} );

	/**
	 * @todo Implement the parent task functionality.
	 * Use this code: `const parent = event.detail.parent && '' !== event.detail.parent ? event.detail.parent : null;
	 */
	const parent = false;

	if ( ! parent ) {
		// Inject the item into the list.
		document
			.querySelector( '.prpl-suggested-tasks-list' )
			.insertAdjacentElement( 'beforeend', item );

		return;
	}

	// If we could not find the parent item, try again after 500ms.
	window.prplRenderAttempts = window.prplRenderAttempts || 0;
	if ( window.prplRenderAttempts > 500 ) {
		return;
	}
	const parentItem = document.querySelector(
		`.prpl-suggested-task[data-task-id="${ parent }"]`
	);
	if ( ! parentItem ) {
		setTimeout( () => {
			document.dispatchEvent(
				new CustomEvent( 'prpl/suggestedTask/injectItem', {
					detail: event.detail,
				} )
			);
			window.prplRenderAttempts++;
		}, 10 );
		return;
	}

	// If the child list does not exist, create it.
	if ( ! parentItem.querySelector( '.prpl-suggested-task-children' ) ) {
		const childListElement = document.createElement( 'ul' );
		childListElement.classList.add( 'prpl-suggested-task-children' );
		parentItem.appendChild( childListElement );
	}

	// Inject the item into the child list.
	parentItem
		.querySelector( '.prpl-suggested-task-children' )
		.insertAdjacentElement( 'beforeend', item );
} );

// Populate the list on load.
prplDocumentReady( () => {
	// Do nothing if the list does not exist.
	if ( ! document.querySelector( '.prpl-suggested-tasks-list' ) ) {
		return;
	}

	// Loop through each provider and inject items.
	for ( const category in prplSuggestedTasks.maxItemsPerCategory ) {
		document.dispatchEvent(
			new CustomEvent( 'prpl/suggestedTask/injectCategoryItems', {
				detail: { category },
			} )
		);
	}

	wp.api.loadPromise.done( () => {
		console.info(
			'Attempting to fetch recommendations pending celebration...'
		);
		const postsCollection = new wp.api.collections.Prpl_recommendations();
		postsCollection
			.fetch( {
				data: {
					status: [ 'pending_celebration' ],
					per_page: 100,
					_embed: true,
					exclude_provider: 'user',
				},
			} )
			.done( ( data ) => {
				console.info( 'Fetch successful:', data );

				// Inject ALL pending celebration tasks.
				prplSuggestedTasks.tasks.forEach( ( task ) => {
					document.dispatchEvent(
						new CustomEvent( 'prpl/suggestedTask/injectItem', {
							detail: task,
						} )
					);
				} );

				window.dispatchEvent( new CustomEvent( 'prpl/grid/resize' ) );

				// Trigger the celebration event if needed.
				if (
					! prplSuggestedTasks.delayCelebration &&
					prplSuggestedTasks.tasks.filter(
						( task ) => 'pending_celebration' === task.status
					).length
				) {
					setTimeout( () => {
						// Trigger the celebration event.
						document.dispatchEvent(
							new CustomEvent( 'prpl/celebrateTasks' )
						);
					}, 3000 );
				}
			} )
			.fail( ( jqXHR, textStatus, errorThrown ) => {
				console.error( 'Fetch failed:', {
					status: jqXHR.status,
					statusText: jqXHR.statusText,
					responseText: jqXHR.responseText,
					textStatus,
					errorThrown,
				} );
			} );
	} );
} );

/**
 * Update the Ravi gauge.
 */
document.addEventListener(
	'prpl/updateRaviGauge',
	( e ) => {
		if ( ! e.detail.pointsDiff ) {
			return;
		}

		const gaugeElement = document.getElementById( 'prpl-gauge-ravi' );
		if ( ! gaugeElement ) {
			return;
		}

		const gaugeProps = {
			id: gaugeElement.id,
			background: gaugeElement.getAttribute( 'background' ),
			color: gaugeElement.getAttribute( 'color' ),
			max: gaugeElement.getAttribute( 'data-max' ),
			value: gaugeElement.getAttribute( 'data-value' ),
			badgeId: gaugeElement.getAttribute( 'data-badge-id' ),
		};

		if ( ! gaugeProps ) {
			return;
		}

		let newValue = parseInt( gaugeProps.value ) + e.detail.pointsDiff;
		newValue = Math.round( newValue );
		newValue = Math.max( 0, newValue );
		newValue = Math.min( newValue, parseInt( gaugeProps.max ) );

		const Gauge = customElements.get( 'prpl-gauge' );
		const gauge = new Gauge(
			{
				max: parseInt( gaugeProps.max ),
				value: parseFloat( newValue / parseInt( gaugeProps.max ) ),
				background: gaugeProps.background,
				color: gaugeProps.color,
				maxDeg: '180deg',
				start: '270deg',
				cutout: '57%',
				contentFontSize: 'var(--prpl-font-size-6xl)',
				contentPadding:
					'var(--prpl-padding) var(--prpl-padding) calc(var(--prpl-padding) * 2) var(--prpl-padding)',
				marginBottom: 'var(--prpl-padding)',
			},
			`<prpl-badge complete="true" badge-id="${ gaugeProps.badgeId }"></prpl-badge>`
		);
		gauge.id = gaugeProps.id;
		gauge.setAttribute( 'background', gaugeProps.background );
		gauge.setAttribute( 'color', gaugeProps.color );
		gauge.setAttribute( 'data-max', gaugeProps.max );
		gauge.setAttribute( 'data-value', newValue );
		gauge.setAttribute( 'data-badge-id', gaugeProps.badgeId );

		// Replace the old gauge with the new one.
		const oldGauge = document.getElementById( gaugeProps.id );
		if ( oldGauge ) {
			oldGauge.replaceWith( gauge );
		}

		const oldCounter = document.getElementById(
			'prpl-widget-content-ravi-points-number'
		);
		if ( oldCounter ) {
			oldCounter.textContent = newValue + 'pt';
		}

		// Mark badge as completed, in the a Monthly badges widgets, if we reached the max points.
		if ( newValue >= parseInt( gaugeProps.max ) ) {
			// We have multiple badges, one in widget and the other in the popover.
			const badges = document.querySelectorAll(
				'.prpl-badge-row-wrapper-inner .prpl-badge prpl-badge[complete="false"][badge-id="' +
					gaugeProps.badgeId +
					'"]'
			);

			if ( badges ) {
				badges.forEach( ( badge ) => {
					badge.setAttribute( 'complete', 'true' );
				} );
			}
		}
	},
	false
);

// Listen for the event.
document.addEventListener(
	'prpl/suggestedTask/maybeInjectItem',
	( e ) => {
		// TODO: Something seems off here, take a look at this.
		const category = e.detail.category;
		document.dispatchEvent(
			new CustomEvent( 'prpl/suggestedTask/injectCategoryItems', {
				detail: { category },
			} )
		);

		window.dispatchEvent( new CustomEvent( 'prpl/grid/resize' ) );
	},
	false
);

/* eslint-enable camelcase */
