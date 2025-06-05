/* global customElements, prplSuggestedTask, prplDocumentReady */
/*
 * Widget: Suggested Tasks
 *
 * A widget that displays a list of suggested tasks.
 *
 * Dependencies: wp-api, progress-planner/suggested-task, progress-planner/celebrate, progress-planner/grid-masonry, progress-planner/document-ready, progress-planner/web-components/prpl-tooltip, progress-planner/suggested-task-terms
 */
/* eslint-disable camelcase */

const prplSuggestedTasksToggleUIitems = () => {
	const el = document.querySelector( '.prpl-suggested-tasks-loading' );
	if ( el ) {
		el.remove();
	}
	setTimeout( () => {
		const items = document.querySelectorAll(
			'.prpl-suggested-tasks-list .prpl-suggested-task'
		);

		if ( 0 === items.length ) {
			document.querySelector( '.prpl-no-suggested-tasks' ).style.display =
				'block';
		}
		window.dispatchEvent( new CustomEvent( 'prpl/grid/resize' ) );
	}, 2000 );
};

// Populate the list on load.
prplDocumentReady( () => {
	// Do nothing if the list does not exist.
	if ( ! document.querySelector( '.prpl-suggested-tasks-list' ) ) {
		return;
	}

	// Loop through each provider and inject items.
	for ( const category in prplSuggestedTask.maxItemsPerCategory ) {
		if ( 'user' === category ) {
			continue;
		}

		prplSuggestedTask.injectItems( {
			category,
			status: 'publish',
			injectTrigger: 'prpl/suggestedTask/injectItem',
			injectTriggerArgsCallback: ( todoItem ) => {
				return {
					item: todoItem,
					listId: 'prpl-suggested-tasks-list',
					insertPosition: 'beforeend',
				};
			},
			afterRequestComplete: prplSuggestedTasksToggleUIitems,
		} );

		prplSuggestedTask.injectItems( {
			category,
			status: 'pending_celebration',
			injectTrigger: 'prpl/suggestedTask/injectItem',
			injectTriggerArgsCallback: ( todoItem ) => {
				return {
					item: todoItem,
					listId: 'prpl-suggested-tasks-list',
					insertPosition: 'beforeend',
				};
			},
			afterRequestComplete: prplSuggestedTasksToggleUIitems,
		} );

		setTimeout( () => {
			// Trigger the celebration event.
			document.dispatchEvent( new CustomEvent( 'prpl/celebrateTasks' ) );
		}, 3000 );
	}
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
		prplSuggestedTask.injectItems( {
			category: e.detail.category,
			injectTrigger: 'prpl/suggestedTask/maybeInjectItem',
			afterRequestComplete: prplSuggestedTasksToggleUIitems,
		} );
		window.dispatchEvent( new CustomEvent( 'prpl/grid/resize' ) );
	},
	false
);

/* eslint-enable camelcase */
