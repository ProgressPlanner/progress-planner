/* global prplDocumentReady */
/*
 * Populate prplSuggestedTasksTerms with the terms for the taxonomies we use.
 *
 * Dependencies: wp-api, progress-planner/document-ready
 */

const prplSuggestedTasksTerms = {};

const prplTerms = {
	category: 'prpl_recommendations_category',
	provider: 'prpl_recommendations_provider',

	/**
	 * Get the terms for a given taxonomy.
	 *
	 * @param {string} taxonomy The taxonomy.
	 * @return {Object} The terms.
	 */
	// eslint-disable-next-line no-unused-vars
	get: ( taxonomy ) => {
		if ( 'category' === taxonomy ) {
			taxonomy = prplTerms.category;
		} else if ( 'provider' === taxonomy ) {
			taxonomy = prplTerms.provider;
		}
		return prplSuggestedTasksTerms[ taxonomy ] || {};
	},

	/**
	 * Get a promise for the terms collection for a given taxonomy.
	 *
	 * @param {string} taxonomy The taxonomy.
	 * @return {Promise} A promise for the terms collection.
	 */
	getCollectionPromise: ( taxonomy ) => {
		return new Promise( ( resolve ) => {
			if ( prplSuggestedTasksTerms[ taxonomy ] ) {
				console.info(
					`Terms already fetched for taxonomy: ${ taxonomy }`
				);
				resolve( prplSuggestedTasksTerms[ taxonomy ] );
			}
			wp.api.loadPromise.done( () => {
				console.info( `Fetching terms for taxonomy: ${ taxonomy }...` );

				const typeName = taxonomy.replace( 'prpl_', 'Prpl_' );
				prplSuggestedTasksTerms[ taxonomy ] =
					prplSuggestedTasksTerms[ taxonomy ] || {};
				const TermsCollection = new wp.api.collections[ typeName ]();
				TermsCollection.fetch( { data: { per_page: 100 } } ).done(
					( data ) => {
						// 100 is the maximum number of terms that can be fetched in one request.
						data.forEach( ( term ) => {
							prplSuggestedTasksTerms[ taxonomy ][ term.slug ] =
								term;
						} );

						// If the `user` term doesn't exist, create it.
						const UserTermsCollection = new wp.api.collections[
							typeName
						]();
						UserTermsCollection.fetch( {
							data: { slug: 'user' },
						} )
							.then( ( userTerms ) => {
								if ( 0 === userTerms.length ) {
									const newTermModel = new wp.api.models[
										typeName
									]( {
										slug: 'user',
										name: 'user',
									} );
									return newTermModel
										.save()
										.then( ( response ) => {
											prplSuggestedTasksTerms[
												taxonomy
											].user = response;
											return prplSuggestedTasksTerms[
												taxonomy
											];
										} );
								}
								return prplSuggestedTasksTerms[ taxonomy ];
							} )
							.then( resolve ); // Resolve the promise after all requests are complete.
					}
				);
			} );
		} );
	},

	/**
	 * Get promises for the terms collections for the taxonomies we use.
	 *
	 * @return {Promise} A promise for the terms collections.
	 */
	getCollectionsPromises: () => {
		return new Promise( ( resolve ) => {
			prplDocumentReady( () => {
				Promise.all( [
					prplTerms.getCollectionPromise( prplTerms.category ),
					prplTerms.getCollectionPromise( prplTerms.provider ),
				] ).then( () => {
					resolve( prplSuggestedTasksTerms );
				} );
			} );
		} );
	},

	/**
	 * Get a term object from the terms array.
	 *
	 * @param {number} termId   The term ID.
	 * @param {string} taxonomy The taxonomy.
	 * @return {Object} The term object.
	 */
	getTerm: ( termId, taxonomy ) => {
		let termObject = {};
		Object.values( prplSuggestedTasksTerms[ taxonomy ] ).forEach(
			( term ) => {
				if ( parseInt( term.id ) === parseInt( termId ) ) {
					termObject = term;
				}
			}
		);
		return termObject;
	},
};
