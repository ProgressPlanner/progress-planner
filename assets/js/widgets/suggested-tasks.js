/* global customElements, progressPlannerSuggestedTasks, confetti, prplDocumentReady */

/**
 * Count the number of items in the list.
 *
 * @param {string} type The type of items to count.
 * @return {number} The number of items in the list.
 */
const progressPlannerCountItems = ( type ) => {
	// We want to display all pending celebration tasks on page load.
	if ( 'pending_celebration' === type ) {
		return 0;
	}

	const items = document.querySelectorAll(
		`.prpl-suggested-task[data-task-type="${ type }"]`
	);
	return items.length;
};

/**
 * Get the next item to inject.
 *
 * @param {string} type The type of items to get the next item from.
 * @return {Object} The next item to inject.
 */
const progressPlannerGetNextItemFromType = ( type ) => {
	// If the are no items of this type, return null.
	if (
		'undefined' ===
		typeof progressPlannerSuggestedTasks.tasks.details[ type ]
	) {
		return null;
	}

	// Remove completed and snoozed items.
	const tasks = progressPlannerSuggestedTasks.tasks;
	let items = tasks.details[ type ];
	const completed = tasks.completed;
	const snoozed = tasks.snoozed;

	// Create an array of items that are in the list.
	const inList = [];
	document
		.querySelectorAll( '.prpl-suggested-task' )
		.forEach( function ( item ) {
			inList.push( item.getAttribute( 'data-task-id' ).toString() );
		} );

	// Remove items which are completed or already in the list.
	items = items.filter( function ( item ) {
		return (
			! completed.includes( item.task_id.toString() ) &&
			! inList.includes( item.task_id.toString() )
		);
	} );

	// Remove items which are snoozed.
	items = items.filter( function ( item ) {
		for ( let i = 0; i < snoozed.length; i++ ) {
			if ( item.task_id.toString() === snoozed[ i ].id.toString() ) {
				return false;
			}
		}
		return true;
	} );

	// Do nothing if there are no items left.
	if ( 0 === items.length ) {
		return null;
	}

	// Get items with a priority set to `high`.
	const highPriorityItems = items.filter( function ( item ) {
		return 'high' === item.priority;
	} );

	// If there are high priority items, return the first one.
	if ( highPriorityItems.length ) {
		return highPriorityItems[ 0 ];
	}

	// Get items with a priority set to `medium`.
	const mediumPriorityItems = items.filter( function ( item ) {
		return 'medium' === item.priority;
	} );

	// If there are medium priority items, return the first one.
	if ( mediumPriorityItems.length ) {
		return mediumPriorityItems[ 0 ];
	}

	// Return the first item.
	return items[ 0 ];
};

/**
 * Inject the next item.
 * @param {string} type The type of items to inject the next item from.
 */
const progressPlannerInjectNextItem = ( type ) => {
	const nextItem = progressPlannerGetNextItemFromType( type );
	if ( ! nextItem ) {
		return;
	}
	console.log( nextItem );
	progressPlannerInjectSuggestedTodoItem( nextItem );
};

/**
 * Inject a todo item.
 *
 * @param {Object} details The details of the todo item.
 */
const progressPlannerInjectSuggestedTodoItem = ( details ) => {
	// Clone the template element.
	const Item = customElements.get( 'prpl-suggested-task' );
	const item = new Item(
		details.task_id,
		details.title,
		details.description,
		details.points ?? 1,
		details.action ?? '',
		details.url ?? '',
		details.dismissable ?? false,
		details.type ?? ''
	);

	/**
	 * @todo Implement the parent task functionality.
	 * Use this code: `const parent = details.parent && '' !== details.parent ? details.parent : null;
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
	window.progressPlannerRenderAttempts =
		window.progressPlannerRenderAttempts || 0;
	if ( window.progressPlannerRenderAttempts > 500 ) {
		return;
	}
	const parentItem = document.querySelector(
		`.prpl-suggested-task[data-task-id="${ parent }"]`
	);
	if ( ! parentItem ) {
		setTimeout( () => {
			progressPlannerInjectSuggestedTodoItem( details );
			window.progressPlannerRenderAttempts++;
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
};

const prplTriggerConfetti = () => {
	const prplConfettiDefaults = {
		spread: 360,
		ticks: 50,
		gravity: 0,
		decay: 0.94,
		startVelocity: 30,
		shapes: [ 'star' ],
		colors: [ 'FFE400', 'FFBD00', 'E89400', 'FFCA6C', 'FDFFB8' ],
	};

	const progressPlannerRenderAttemptshoot = () => {
		let confettiOptions = [
			{
				particleCount: 40,
				scalar: 1.2,
				shapes: [ 'star' ],
			},
			{
				particleCount: 10,
				scalar: 0.75,
				shapes: [ 'circle' ],
			},
		];

		// Tripple check if the confetti options are an array and not undefined.
		if (
			'undefined' !==
				typeof progressPlannerSuggestedTasks.confettiOptions &&
			true ===
				Array.isArray(
					progressPlannerSuggestedTasks.confettiOptions
				) &&
			progressPlannerSuggestedTasks.confettiOptions.length
		) {
			confettiOptions = progressPlannerSuggestedTasks.confettiOptions;
		}

		for ( const value of confettiOptions ) {
			confetti( {
				...prplConfettiDefaults,
				...value,
			} );
		}
	};

	setTimeout( progressPlannerRenderAttemptshoot, 0 );
	setTimeout( progressPlannerRenderAttemptshoot, 100 );
	setTimeout( progressPlannerRenderAttemptshoot, 200 );
};

/**
 * Strike completed tasks.
 */
const prplStrikeCompletedTasks = () => {
	document
		.querySelectorAll(
			'.prpl-suggested-task[data-task-action="celebrate"]'
		)
		.forEach( ( item ) => {
			item.classList.add( 'prpl-suggested-task-celebrated' );
		} );

	// Remove celebrated tasks and add them to the completed tasks.
	setTimeout( () => {
		document
			.querySelectorAll( '.prpl-suggested-task-celebrated' )
			.forEach( ( item ) => {
				const taskId = item.getAttribute( 'data-task-id' ),
					type = item.getAttribute( 'data-task-type' );
				const el = document.querySelector(
					`.prpl-suggested-task[data-task-id="${ taskId }"]`
				);

				if ( el ) {
					el.parentElement.remove();
				}

				// Remove the task from the pending celebration.
				window.progressPlannerSuggestedTasks.tasks.pending_celebration =
					window.progressPlannerSuggestedTasks.tasks.pending_celebration.filter(
						( id ) => id !== taskId
					);

				// Add the task to the completed tasks.
				if (
					window.progressPlannerSuggestedTasks.tasks.completed.indexOf(
						taskId
					) === -1
				) {
					window.progressPlannerSuggestedTasks.tasks.completed.push(
						taskId
					);
				}

				// Refresh the list.
				const event = new CustomEvent(
					'prplMaybeInjectSuggestedTaskEvent',
					{
						detail: {
							taskId,
							type,
						},
					}
				);
				document.dispatchEvent( event );
			} );
	}, 2000 );
};

const prplPendingCelebration =
	progressPlannerSuggestedTasks.tasks.pending_celebration;
if (
	! progressPlannerSuggestedTasks.delayCelebration &&
	prplPendingCelebration &&
	prplPendingCelebration.length
) {
	setTimeout( () => {
		// Trigger the celebration event.
		document.dispatchEvent( new Event( 'prplCelebrateTasks' ) );
	}, 3000 );
}

// Create a new custom event to trigger the celebration.
document.addEventListener( 'prplCelebrateTasks', () => {
	prplTriggerConfetti();
	prplStrikeCompletedTasks();
} );

const prplCreateUserSuggestedTask = ( content ) => {
	return {
		description: '',
		parent: 0,
		points: 0,
		priority: "medium",
		task_id: 'user|' + crypto.randomUUID(),
		title: content,
		type: "user",
		url: "",
		dismissable: true,
	}
}

const prplSubmitUserSuggestedTask = ( task ) => {
	wp.ajax.post( 'progress_planner_save_user_suggested_task', {
		task,
		nonce: progressPlannerSuggestedTasks.nonce,
	} );
};

// When the '#create-suggested-item' form is submitted,
// add a new todo item to the list
document
	.getElementById( 'create-suggested-item' )
	.addEventListener( 'submit', ( event ) => {
		event.preventDefault();
		const userTask = prplCreateUserSuggestedTask(
			document.getElementById( 'new-suggested-item-content' ).value
		);
		progressPlannerInjectSuggestedTodoItem( userTask );
		prplSubmitUserSuggestedTask( userTask );

		document.getElementById( 'new-suggested-item-content' ).value = '';

		// Focus the new task input element.
		document.getElementById( 'new-suggested-item-content' ).focus();
	} );

// Populate the list on load.
document.addEventListener( 'DOMContentLoaded', () => {
	// Do nothing if the list does not exist.
	if ( ! document.querySelector( '.prpl-suggested-tasks-list' ) ) {
		return;
	}

	// Loop through each type and inject items.
	for ( const type in progressPlannerSuggestedTasks.tasks.details ) {
		// Inject items, until we reach the maximum number of channel items.
		while (
			progressPlannerCountItems( type ) <
				parseInt(
					progressPlannerSuggestedTasks.maxItemsPerType[ type ]
				) &&
			progressPlannerGetNextItemFromType( type )
		) {
			progressPlannerInjectNextItem( type );
		}
	}

	const event = new CustomEvent( 'prplResizeAllGridItemsEvent' );
	document.dispatchEvent( event );
} );

// Handle the monthly badges scrolling.
class BadgeScroller {
	constructor( element ) {
		this.element = element;

		this.badgeButtonUp = this.element.querySelector(
			'.prpl-badge-row-button-up'
		);
		this.badgeButtonDown = this.element.querySelector(
			'.prpl-badge-row-button-down'
		);
		this.badgeRowWrapper = this.element.querySelector(
			'.prpl-badge-row-wrapper'
		);
		this.badgeRowWrapperInner = this.element.querySelector(
			'.prpl-badge-row-wrapper-inner'
		);
		this.badges =
			this.badgeRowWrapperInner.querySelectorAll( '.prpl-badge' );
		this.totalRows = this.badges.length / 3;

		this.init();
	}

	init() {
		this.addEventListeners();

		// On page load, when all images are loaded.
		const images = [ ...this.element.querySelectorAll( 'img' ) ];
		if ( images.length ) {
			Promise.all(
				images.map(
					( im ) =>
						new Promise( ( resolve ) => ( im.onload = resolve ) )
				)
			).then( () => {
				this.setWrapperHeight();
			} );
		}

		// When popover is opened.
		document
			.querySelector( '#prpl-popover-monthly-badges' )
			.addEventListener( 'toggle', ( event ) => {
				if ( 'open' === event.newState ) {
					this.setWrapperHeight();
				}
			} );

		// Handle window resize.
		window.addEventListener( 'resize', () => {
			this.setWrapperHeight();
		} );
	}

	setWrapperHeight() {
		const computedStyle = window.getComputedStyle(
			this.badgeRowWrapperInner
		);
		const gridGap = parseInt( computedStyle.gap );

		// Set CSS variables for the transform calculation.
		this.badgeRowWrapper.style.setProperty(
			'--row-height',
			`${ this.badges[ 0 ].offsetHeight }px`
		);
		this.badgeRowWrapper.style.setProperty(
			'--grid-gap',
			`${ gridGap }px`
		);

		// Set wrapper height to show 2 rows.
		const twoRowsHeight = this.badges[ 0 ].offsetHeight * 2 + gridGap;
		this.badgeRowWrapperInner.style.height = twoRowsHeight + 'px';
	}

	addEventListeners() {
		this.badgeButtonUp.addEventListener( 'click', () =>
			this.handleUpClick()
		);
		this.badgeButtonDown.addEventListener( 'click', () =>
			this.handleDownClick()
		);
	}

	handleUpClick() {
		const computedStyle = window.getComputedStyle(
			this.badgeRowWrapperInner
		);
		const currentRow =
			computedStyle.getPropertyValue( '--prpl-current-row' );
		const nextRow = parseInt( currentRow ) - 1;

		this.badgeButtonDown
			.closest( '.prpl-badge-row-button-wrapper' )
			.classList.remove( 'prpl-badge-row-button-disabled' );

		this.badgeRowWrapperInner.style.setProperty(
			'--prpl-current-row',
			nextRow
		);

		if ( nextRow <= 1 ) {
			this.badgeButtonUp
				.closest( '.prpl-badge-row-button-wrapper' )
				.classList.add( 'prpl-badge-row-button-disabled' );
		}
	}

	handleDownClick() {
		const computedStyle = window.getComputedStyle(
			this.badgeRowWrapperInner
		);
		const currentRow =
			computedStyle.getPropertyValue( '--prpl-current-row' );
		const nextRow = parseInt( currentRow ) + 1;

		this.badgeButtonUp
			.closest( '.prpl-badge-row-button-wrapper' )
			.classList.remove( 'prpl-badge-row-button-disabled' );

		this.badgeRowWrapperInner.style.setProperty(
			'--prpl-current-row',
			nextRow
		);

		if ( nextRow >= this.totalRows - 1 ) {
			this.badgeButtonDown
				.closest( '.prpl-badge-row-button-wrapper' )
				.classList.add( 'prpl-badge-row-button-disabled' );
		}
	}
}

// Initialize on DOM load
prplDocumentReady( () => {
	document
		.querySelectorAll(
			'.prpl-widget-wrapper:not(.in-popover) > .badge-group-monthly'
		)
		.forEach( ( element ) => {
			new BadgeScroller( element );
		} );
} );

const prplMaybeInjectSuggestedTaskEvent = new Event( // eslint-disable-line no-unused-vars
	'prplMaybeInjectSuggestedTaskEvent'
);

const prplGetRaviGaugeProps = () => {
	const gauge = document.getElementById( 'prpl-gauge-ravi' );
	if ( ! gauge ) {
		return;
	}

	return {
		id: gauge.id,
		background: gauge.getAttribute( 'background' ),
		color: gauge.getAttribute( 'color' ),
		max: gauge.getAttribute( 'data-max' ),
		value: gauge.getAttribute( 'data-value' ),
		badgeId: gauge.getAttribute( 'data-badge-id' ),
	};
};

const prplUpdateRaviGauge = ( pointsDiff = 0 ) => {
	if ( ! pointsDiff ) {
		return;
	}

	const gaugeProps = prplGetRaviGaugeProps();

	if ( ! gaugeProps ) {
		return;
	}

	let newValue = parseInt( gaugeProps.value ) + pointsDiff;
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
};

// Listen for the event.
document.addEventListener(
	'prplUpdateRaviGaugeEvent',
	( e ) => {
		prplUpdateRaviGauge( e.detail.pointsDiff );
	},
	false
);

// Listen for the event.
document.addEventListener(
	'prplMaybeInjectSuggestedTaskEvent',
	( e ) => {
		const type = e.detail.type;

		if ( 'pending_celebration' === type ) {
			return;
		}

		while (
			progressPlannerCountItems( type ) <
				parseInt(
					progressPlannerSuggestedTasks.maxItemsPerType[ type ]
				) &&
			progressPlannerGetNextItemFromType( type )
		) {
			progressPlannerInjectNextItem( type );
		}

		const event = new Event( 'prplResizeAllGridItemsEvent' );
		document.dispatchEvent( event );
	},
	false
);
