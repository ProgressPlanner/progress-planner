/* global progressPlannerDraggable */

const prplHandleDrag = ( event ) => {
	const selectedItem = event.target;
	let swapItem =
		document.elementFromPoint( event.clientX, event.clientY ) === null
			? selectedItem
			: document.elementFromPoint( event.clientX, event.clientY );

	if ( selectedItem.parentNode === swapItem.parentNode ) {
		swapItem =
			swapItem !== selectedItem.nextSibling
				? swapItem
				: swapItem.nextSibling;
		selectedItem.parentNode.insertBefore( selectedItem, swapItem );
	}
};

const prplHandleDrop = () => {
	const widgetIds = [];
	document
		.querySelector( '.prpl-widgets-container' )
		.querySelectorAll( '.prpl-widget-wrapper' )
		.forEach( ( child ) => {
			if ( child.dataset.id ) {
				widgetIds.push( child.dataset.id );
			}
		} );

	const dispatchGridEvent = new Event( 'prplResizeAllGridItemsEvent' );
	document.dispatchEvent( dispatchGridEvent );

	const request = wp.ajax.post( 'progress_planner_save_widgets_order', {
		_ajax_nonce: progressPlannerDraggable.nonce,
		widgets: widgetIds.join( ',' ),
	} );
	request.done( ( response ) => {
		console.log( response.message ); // eslint-disable-line no-console
	} );
};

( () => {
	document.querySelector( '.prpl-info-icon.prpl-draggable-icon' ).addEventListener( 'click', ( event ) => {
		event.preventDefault();
		event.target.classList.toggle( 'active' );
		document.querySelector( '.prpl-widgets-container' ).classList.toggle( 'prpl-draggable' );
		document.querySelectorAll( '.prpl-widget-wrapper' ).forEach( ( item ) => {
			item.draggable = ! item.draggable;
		} );
	} );
	document.querySelectorAll( '.prpl-widget-wrapper' ).forEach( ( item ) => {
		item.ondrag = prplHandleDrag;
		item.ondragend = prplHandleDrop;
	} );
} )();
