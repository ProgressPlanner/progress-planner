/*
 * Populate window.progressPlannerSuggestedTasksTerms with the terms for the taxonomies we use.
 *
 * Dependencies: wp-api
 */
window.progressPlannerSuggestedTasksTerms = {};

window.prplFetchSuggestedTaskTerms = () => {
	return new Promise( ( resolve ) => {
		const promises = [];
		[
			'prpl_recommendations_category',
			'prpl_recommendations_provider',
		].forEach( ( type ) => {
			const typeName = type.replace( 'prpl_', 'Prpl_' );
			window.progressPlannerSuggestedTasksTerms[ type ] = {};

			// Create promise for terms fetch
			const termsPromise = new Promise( ( resolveTerms ) => {
				const TermsCollection = new wp.api.collections[ typeName ]();
				TermsCollection.fetch( { data: { per_page: 100 } } ).done(
					( data ) => {
						data.forEach( ( term ) => {
							window.progressPlannerSuggestedTasksTerms[ type ][
								term.slug
							] = term;
						} );
						resolveTerms();
					}
				);
			} );
			promises.push( termsPromise );

			// Create promise for user term fetch and creation
			const userPromise = new Promise( ( resolveUser ) => {
				const UserTermsCollection = new wp.api.collections[
					typeName
				]();
				UserTermsCollection.fetch( { data: { slug: 'user' } } ).done(
					( data ) => {
						if ( 0 === data.length ) {
							const newTermModel = new wp.api.models[ typeName ](
								{
									slug: 'user',
									name: 'user',
								}
							);
							newTermModel.save().then( ( response ) => {
								window.progressPlannerSuggestedTasksTerms[
									type
								].user = response;
								resolveUser();
							} );
						} else {
							resolveUser();
						}
					}
				);
			} );
			promises.push( userPromise );
		} );

		// Wait for all promises to resolve
		Promise.all( promises ).then( () => {
			resolve();
		} );
	} );
};
