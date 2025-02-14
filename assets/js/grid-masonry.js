/* global prplDocumentReady */
/*
 * Grid Masonry
 *
 * A script to allow a grid to behave like a masonry layout.
 * Inspired by https://medium.com/@andybarefoot/a-masonry-style-layout-using-css-grid-8c663d355ebb
 *
 * Dependencies: progress-planner-document-ready
 */

/**
 * Resize a grid item to fit the content.
 *
 * @param {Element} item
 */
const prplResizeGridItem = ( item ) => {
	if ( ! item || item.classList.contains( 'in-popover' ) ) {
		return;
	}
	const innerContainer = item.querySelector( '.widget-inner-container' );
	if ( ! innerContainer ) {
		return;
	}
	const grid = document.querySelector( '.prpl-widgets-container' );
	const rowHeight = parseInt(
		window.getComputedStyle( grid ).getPropertyValue( 'grid-auto-rows' )
	);
	const paddingTop = parseInt(
		window.getComputedStyle( item ).getPropertyValue( 'padding-top' )
	);
	const paddingBottom = parseInt(
		window.getComputedStyle( item ).getPropertyValue( 'padding-bottom' )
	);
	const elHeight = innerContainer.getBoundingClientRect().height;
	const rowSpan = Math.ceil(
		( elHeight + paddingTop + paddingBottom ) / rowHeight
	);
	item.style.gridRowEnd = 'span ' + ( rowSpan + 1 );
};

/**
 * Resize all grid items.
 */
const prplResizeAllGridItems = () => {
	document.querySelectorAll( '.prpl-widget-wrapper' ).forEach( ( item ) => {
		prplResizeGridItem( item );
	} );
};

prplDocumentReady( () => {
	prplResizeAllGridItems();
	setTimeout( prplResizeAllGridItems, 1000 );
} );

window.addEventListener( 'resize', prplResizeAllGridItems );

// Fire event after all images are loaded.
window.addEventListener( 'load', prplResizeAllGridItems );

const prplResizeAllGridItemsEvent = new Event( 'prplResizeAllGridItemsEvent' ); // eslint-disable-line no-unused-vars

// Listen for the event.
document.addEventListener(
	'prplResizeAllGridItemsEvent',
	() => {
		prplResizeAllGridItems();
	},
	false
);
