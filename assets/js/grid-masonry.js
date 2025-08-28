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

window.addEventListener(
	'prpl/grid/resize',
	() => {
		window.prplGridColumnsX = [];
		/**
		 * Populate the grid columns X data in window.prplGridColumnsX.
		 */
		document
			.querySelectorAll( '.prpl-widget-wrapper' )
			.forEach( ( item ) => {
				if (
					! item ||
					item.classList.contains( 'in-popover' ) ||
					! item.querySelector( '.widget-inner-container' )
				) {
					return;
				}

				// Get the item's X position.
				const itemX = parseInt( item.getBoundingClientRect().left );

				// Check if the item is already in the array.
				if ( ! window.prplGridColumnsX.includes( itemX ) ) {
					window.prplGridColumnsX.push( itemX );
				}

				// Sort the array.
				window.prplGridColumnsX.sort( ( a, b ) => a - b );
			} );

		/**
		 * Unforce all items.
		 */
		document
			.querySelectorAll( '.prpl-widget-wrapper' )
			.forEach( ( item ) => {
				if ( '1' === item.dataset.forceLastColumn ) {
					item.style.gridColumnStart = '';
				}
			} );

		setTimeout( () => {
			/**
			 * Reorder items to the grid columns if forceLastColumn is set.
			 */
			document
				.querySelectorAll( '.prpl-widget-wrapper' )
				.forEach( ( item ) => {
					if (
						! item ||
						item.classList.contains( 'in-popover' ) ||
						! item.querySelector( '.widget-inner-container' )
					) {
						return;
					}
					if ( '1' === item.dataset.forceLastColumn ) {
						item.style.gridColumnStart =
							window.prplGridColumnsX.length;
					}
				} );

			/**
			 * Update the grid masonry items.
			 */
			document
				.querySelectorAll( '.prpl-widget-wrapper' )
				.forEach( ( item ) => {
					if ( ! item || item.classList.contains( 'in-popover' ) ) {
						return;
					}
					const innerContainer = item.querySelector(
						'.widget-inner-container'
					);
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
										document.querySelector(
											'.prpl-widgets-container'
										)
									)
									.getPropertyValue( 'grid-auto-rows' )
							)
					);
					item.style.gridRowEnd = 'span ' + ( rowSpan + 1 );
				} );
		}, 250 );
	},
	false
);
