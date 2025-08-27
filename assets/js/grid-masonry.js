/* global prplDocumentReady */
/*
 * Grid Masonry
 *
 * A script to allow a grid to behave like a masonry layout.
 * Inspired by https://medium.com/@andybarefoot/a-masonry-style-layout-using-css-grid-8c663d355ebb
 *
 * Dependencies: progress-planner/document-ready
 */

/**
 * Trigger a resize event on the grid.
 */
const prplTriggerGridResize = () => {
	setTimeout( () => {
		window.dispatchEvent( new CustomEvent( 'prpl/grid/resize' ) );
	} );
};

prplDocumentReady( () => {
	prplTriggerGridResize();
	setTimeout( prplTriggerGridResize, 1000 );
} );

window.addEventListener( 'resize', prplTriggerGridResize );

// Fire event after all images are loaded.
window.addEventListener( 'load', prplTriggerGridResize );

/**
 * Update the grid masonry item.
 *
 * @param {HTMLElement} item The item to update.
 */
const prplUpdateGridMasonryItem = ( item ) => {
	if ( ! item || item.classList.contains( 'in-popover' ) ) {
		return;
	}
	const innerContainer = item.querySelector( '.widget-inner-container' );
	if ( ! innerContainer ) {
		return;
	}
	const rowSpan = Math.ceil(
		( innerContainer.getBoundingClientRect().height +
			parseInt(
				window
					.getComputedStyle( item )
					.getPropertyValue( 'padding-top' )
			) +
			parseInt(
				window
					.getComputedStyle( item )
					.getPropertyValue( 'padding-bottom' )
			) ) /
			parseInt(
				window
					.getComputedStyle(
						document.querySelector( '.prpl-widgets-container' )
					)
					.getPropertyValue( 'grid-auto-rows' )
			)
	);
	item.style.gridRowEnd = 'span ' + ( rowSpan + 1 );
};

window.addEventListener(
	'prpl/grid/resize',
	() => {
		document
			.querySelectorAll( '.prpl-widget-wrapper' )
			.forEach( ( item ) => {
				prplPopulateOriginalGridOrderData( item );
				prplPopulateGridColumnsX( item );
			} );

		document
			.querySelectorAll( '.prpl-widget-wrapper' )
			.forEach( ( item ) => {
				prplPopulateGridColumnsXItem( item );
				prplMaybeForceItemToLastColumn( item );
			} );

		document
			.querySelectorAll( '.prpl-widget-wrapper' )
			.forEach( ( item ) => {
				prplUpdateGridMasonryItem( item );
			} );
	},
	false
);

/**
 * Populate the original grid order data. Adds a data attribute to the item
 * that contains the original order of the item.
 *
 * @param {HTMLElement} item The item to populate.
 */
const prplPopulateOriginalGridOrderData = ( item ) => {
	if (
		! item ||
		item.classList.contains( 'in-popover' ) ||
		! item.querySelector( '.widget-inner-container' )
	) {
		return;
	}

	if ( 'undefined' === typeof window.prplGridOrderLastItem ) {
		window.prplGridOrderLastItem = 0;
	} else {
		window.prplGridOrderLastItem++;
	}

	if ( ! item.dataset.order ) {
		item.dataset.order = window.prplGridOrderLastItem;
	}
};

/**
 * Populate the grid columns X data in window.prplGridColumnsX.
 *
 * @param {HTMLElement} item The item to populate.
 */
const prplPopulateGridColumnsX = ( item ) => {
	if (
		! item ||
		item.classList.contains( 'in-popover' ) ||
		! item.querySelector( '.widget-inner-container' )
	) {
		return;
	}

	window.prplGridColumnsX = window.prplGridColumnsX || [];

	// Get the item's X position.
	const itemX = parseInt( item.getBoundingClientRect().left );

	// Check if the item is already in the array.
	if ( ! window.prplGridColumnsX.includes( itemX ) ) {
		window.prplGridColumnsX.push( itemX );
	}

	// Sort the array.
	window.prplGridColumnsX.sort( ( a, b ) => a - b );
};

/**
 * Populate the grid columns X data for an item. Adds a data attribute to the
 * item that contains the column index of the item in the array.
 *
 * @param {HTMLElement} item The item to populate.
 */
const prplPopulateGridColumnsXItem = ( item ) => {
	if (
		! item ||
		item.classList.contains( 'in-popover' ) ||
		! item.querySelector( '.widget-inner-container' )
	) {
		return;
	}

	const innerContainer = item.querySelector( '.widget-inner-container' );
	if ( ! innerContainer ) {
		return;
	}

	// Get the item's X position.
	const itemX = parseInt( item.getBoundingClientRect().left );

	// Get the index of the item in the array.
	item.dataset.gridColumn = window.prplGridColumnsX.indexOf( itemX );
};

/**
 * Force item to be in the last column.
 *
 * @param {HTMLElement} item The item to force.
 */
const prplMaybeForceItemToLastColumn = ( item ) => {
	if (
		! item ||
		item.classList.contains( 'in-popover' ) ||
		! item.querySelector( '.widget-inner-container' )
	) {
		return;
	}
	const forceLastColumn = item.dataset.forceLastColumn;
	if ( '1' === forceLastColumn ) {
		item.style.gridColumnStart = window.prplGridColumnsX.length;
	}
};
