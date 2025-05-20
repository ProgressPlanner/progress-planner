/*
 * Populate window.progressPlannerSuggestedTasksTerms with the terms for the taxonomies we use.
 *
 * Dependencies: wp-api
 */
window.progressPlannerSuggestedTasksTerms = {};
wp.api.loadPromise.done( () => {
	[
		'prpl_recommendations_category',
		'prpl_recommendations_provider',
	].forEach( ( type ) => {
		const typeName = type.replace( 'prpl_', 'Prpl_' );
		window.progressPlannerSuggestedTasksTerms[ type ] = {};
		const TermsCollection = new wp.api.collections[ typeName ]();
		TermsCollection.fetch( { data: { per_page: 100 } } ).done( ( data ) => {
			// 100 is the maximum number of terms that can be fetched in one request.
			data.forEach( ( term ) => {
				window.progressPlannerSuggestedTasksTerms[ type ][ term.slug ] =
					term;
			} );
		} );

		// If the `user` term doesn't exist, create it.
		const UserTermsCollection = new wp.api.collections[ typeName ]();
		UserTermsCollection.fetch( { data: { slug: 'user' } } ).done(
			( data ) => {
				if ( 0 === data.length ) {
					const newTermModel = new wp.api.models[ typeName ]( {
						slug: 'user',
						name: 'user',
					} );
					newTermModel.save().then( ( response ) => {
						window.progressPlannerSuggestedTasksTerms[ type ].user =
							response;
					} );
				}
			}
		);
	} );
} );
