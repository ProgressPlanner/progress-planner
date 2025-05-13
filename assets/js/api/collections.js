/**
 * Register custom REST API collections.
 *
 * Dependencies: wp-api
 */
wp.api.loadPromise.done( () => {
	// Register the Prpl_recommendations collection.
	wp.api.collections.Prpl_recommendations = wp.api.collections.Posts.extend( {
		url: '/wp-json/wp/v2/prpl_recommendations/',

		/**
		 * Override the parse method to modify the response data.
		 *
		 * @param {Object} response The response from the server.
		 * @return {Object} The modified response.
		 */
		parse( response ) {
			// console.log( 'Collection parse response:', response );
			// If response is an array, map over it
			if ( Array.isArray( response ) ) {
				return response.map( this.parseItem );
			}
			// If response is a single item
			return this.parseItem( response );
		},

		/**
		 * Parse a single item from the response.
		 *
		 * @param {Object} item The item to parse.
		 * @return {Object} The modified item.
		 */
		parseItem( item ) {
			// Get taxonomies from the item
			const taxonomies = {};

			// Add taxonomies if they exist in the response
			if ( item._embedded && item._embedded[ 'wp:term' ] ) {
				item._embedded[ 'wp:term' ].forEach( ( terms ) => {
					if ( terms.length > 0 ) {
						// Get the taxonomy name from the first term
						const taxonomyName = terms[ 0 ].taxonomy;
						// Store the terms under their full taxonomy name
						taxonomies[ `prpl_recommendations_${ taxonomyName }` ] =
							terms;
					}
				} );
			}

			// TODO: Temporary fixes.
			item.task_id = item.id;
			item.title = item.title.rendered;

			return {
				...item,
				taxonomies,
			};
		},
	} );
} );
