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
 * Resize all grid items.
 */
const prplResizeAllGridItems = () => {
	document.querySelectorAll( '.prpl-widget-wrapper' ).forEach( ( item ) => {
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
	} );
};

prplDocumentReady( () => {
	prplResizeAllGridItems();
	setTimeout( prplResizeAllGridItems, 1000 );
} );

window.addEventListener( 'resize', prplResizeAllGridItems );

// Fire event after all images are loaded.
window.addEventListener( 'load', prplResizeAllGridItems );

// Listen for the event.
document.addEventListener(
	'prplResizeAllGridItemsEvent',
	() => {
		prplResizeAllGridItems();
	},
	false
);
