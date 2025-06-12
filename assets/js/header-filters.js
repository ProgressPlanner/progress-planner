// Handle changes to the range dropdown.
document
	.getElementById( 'prpl-select-range' )
	.addEventListener( 'change', () => {
		const range = this.value;
		const url = new URL( window.location.href );
		url.searchParams.set( 'range', range );
		window.location.href = url.href;
	} );

// Handle changes to the frequency dropdown.
document
	.getElementById( 'prpl-select-frequency' )
	.addEventListener( 'change', () => {
		const frequency = this.value;
		const url = new URL( window.location.href );
		url.searchParams.set( 'frequency', frequency );
		window.location.href = url.href;
	} );
