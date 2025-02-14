// Get the focus element from the URL.
const prplFocusElementFromUrl = window.location.href
	.split( 'pp-focus-el=' )[ 1 ]
	.replace( new RegExp( '---', 'g' ), ' ' ) // Replace spaces in the URL with 3 dashes.
	.replace( new RegExp( '%28', 'g' ), '(' )
	.replace( new RegExp( '%29', 'g' ), ')' )
	.replace( new RegExp( '%3A', 'g' ), ':' )
	.replace( new RegExp( '%2F', 'g' ), '/' )
	.replace( new RegExp( '%2C', 'g' ), ',' )
	.replace( new RegExp( '%20', 'g' ), ' ' );

if ( prplFocusElementFromUrl ) {
	const prplFocusElement = document.querySelector( prplFocusElementFromUrl );

	if ( prplFocusElement ) {
		prplFocusElement.focus();
		prplFocusElement.scrollIntoView( { behavior: 'smooth' } );
		prplFocusElement.style.border = '2px solid #000';
	}
}
