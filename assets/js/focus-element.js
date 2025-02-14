// Get the focus element from the URL.
const prplFocusElementFromUrl = window.location.search
	.split( 'pp-focus-el=' )[ 1 ]
	.replace( new RegExp( '---', 'g' ), ' ' ); // Replace spaces in the URL with 3 dashes.

if ( prplFocusElementFromUrl ) {
	const prplFocusElement = document.querySelector( prplFocusElementFromUrl );

	if ( prplFocusElement ) {
		prplFocusElement.focus();
		prplFocusElement.scrollIntoView( { behavior: 'smooth' } );
		prplFocusElement.style.border = '2px solid #000';
	}
}
