/* global prplDocumentReady */
/*
 * Populate window.prplSuggestedTasksTerms with the terms for the taxonomies we use.
 *
 * Dependencies: wp-api, progress-planner/document-ready
 */
window.prplSuggestedTasksTerms = window.prplSuggestedTasksTerms || {};

window.prplGetTermsCollectionPromise = ( taxonomy ) => {
	return new Promise( ( resolve ) => {
		if ( window.prplSuggestedTasksTerms[ taxonomy ]?.user ) {
			console.info( `Terms already fetched for taxonomy: ${ taxonomy }` );
			resolve( window.prplSuggestedTasksTerms[ taxonomy ] );
		}
		wp.api.loadPromise.done( () => {
			console.info( `Fetching terms for taxonomy: ${ taxonomy }...` );

			const typeName = taxonomy.replace( 'prpl_', 'Prpl_' );
			window.prplSuggestedTasksTerms[ taxonomy ] =
				window.prplSuggestedTasksTerms[ taxonomy ] || {};
			const TermsCollection = new wp.api.collections[ typeName ]();
			TermsCollection.fetch( { data: { per_page: 100 } } ).done(
				( data ) => {
					// 100 is the maximum number of terms that can be fetched in one request.
					data.forEach( ( term ) => {
						window.prplSuggestedTasksTerms[ taxonomy ][
							term.slug
						] = term;
					} );

					// If the `user` term doesn't exist, create it.
					const UserTermsCollection = new wp.api.collections[
						typeName
					]();
					UserTermsCollection.fetch( {
						data: { slug: 'user' },
					} ).done( ( userTerms ) => {
						if ( 0 === userTerms.length ) {
							const newTermModel = new wp.api.models[ typeName ](
								{
									slug: 'user',
									name: 'user',
								}
							);
							newTermModel.save().then( ( response ) => {
								window.prplSuggestedTasksTerms[
									taxonomy
								].user = response;
							} );
						}
						resolve( window.prplSuggestedTasksTerms[ taxonomy ] );
					} );
				}
			);
		} );
	} );
};

window.prplGetTermsCollectionsPromises = () => {
	return new Promise( ( resolve ) => {
		prplDocumentReady( () => {
			Promise.all( [
				window.prplGetTermsCollectionPromise(
					'prpl_recommendations_category'
				),
				window.prplGetTermsCollectionPromise(
					'prpl_recommendations_provider'
				),
			] ).then( () => {
				resolve( window.prplSuggestedTasksTerms );
			} );
		} );
	} );
};

/**
 * Get a term object from the terms array.
 *
 * @param {number} termId   The term ID.
 * @param {string} taxonomy The taxonomy.
 * @return {Object} The term object.
 */
window.prplGetTermObject = ( termId, taxonomy ) => {
	let termObject = {};
	Object.values( window.prplSuggestedTasksTerms[ taxonomy ] ).forEach(
		( term ) => {
			if ( term.id === termId ) {
				termObject = term;
			}
		}
	);
	return termObject;
};
