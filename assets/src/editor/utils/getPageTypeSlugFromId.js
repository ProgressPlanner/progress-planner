/**
 * Get the page type slug from the page type ID.
 *
 * @param {number|string|Array} id              The page type ID.
 * @param {Array}               pageTypes       Array of page type objects.
 * @param {number}              defaultPageType Default page type ID.
 * @return {string|undefined} The page type slug.
 */
export function getPageTypeSlugFromId( id, pageTypes, defaultPageType ) {
	// Check if `id` is an array.
	if ( Array.isArray( id ) ) {
		id = id.length > 0 ? id[ 0 ] : 0;
	} else if ( ! id ) {
		id = 0;
	} else if ( typeof id === 'string' ) {
		id = parseInt( id );
	} else if ( typeof id !== 'number' ) {
		id = 0;
	}

	if ( ! id ) {
		id = parseInt( defaultPageType );
	}

	return pageTypes.find(
		( pageTypeItem ) => parseInt( pageTypeItem.id ) === parseInt( id )
	)?.slug;
}
