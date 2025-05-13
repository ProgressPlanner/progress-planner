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
		 * @return {void}
		 */
		parseItem( item ) {
			// Add taxonomies if they exist in the response
			if ( item._embedded && item._embedded[ 'wp:term' ] ) {
				item._embedded[ 'wp:term' ].forEach( ( terms ) => {
					if ( terms.length > 0 ) {
						// We only have 1 term per taxonomy.
						const taxonomyName = terms[ 0 ].taxonomy;
						item[
							taxonomyName.replace( 'prpl_recommendations_', '' )
						] = terms[ 0 ];
					}
				} );
			}

			// TODO: Temporary fixes.
			item.task_id = item.id;
			item.title = item.title.rendered;

			item.points = item.meta.prpl_points;
			item.url = item.meta.prpl_url;
			item.url_target = item.meta.prpl_url_target;
			item.dismissable = item.meta.prpl_dismissable;

			// Remove unwanted fields
			delete item.author;
			delete item.class_list;
			delete item.guid;
			delete item.progress_planner_page_types;
			delete item.template;
			delete item.yoast_head;
			delete item.yoast_head_json;
		},
	} );
} );
