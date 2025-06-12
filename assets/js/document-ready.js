/* eslint-disable no-unused-vars */
/**
 * Vanilla JS version of jQuery( document ).ready().
 *
 * @param {Function} fn The function to run when the document is ready.
 */
const prplDocumentReady = function ( fn ) {
	if ( document.readyState !== 'loading' ) {
		fn();
		return;
	}
	document.addEventListener( 'DOMContentLoaded', fn );
};

/* eslint-enable no-unused-vars */
