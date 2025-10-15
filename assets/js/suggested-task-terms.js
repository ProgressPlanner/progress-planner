/* global prplDocumentReady */
/*
 * Populate prplSuggestedTasksTerms with the terms for the taxonomies we use.
 *
 * Dependencies: wp-api-fetch, progress-planner/document-ready
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
				return;
			}

			console.info( `Fetching terms for taxonomy: ${ taxonomy }...` );

			prplSuggestedTasksTerms[ taxonomy ] =
				prplSuggestedTasksTerms[ taxonomy ] || {};

			// Fetch terms using wp.apiFetch.
			wp.apiFetch( {
				path: `/wp/v2/${ taxonomy }?per_page=100`,
			} )
				.then( ( data ) => {
					let userTermFound = false;
					// 100 is the maximum number of terms that can be fetched in one request.
					data.forEach( ( term ) => {
						prplSuggestedTasksTerms[ taxonomy ][ term.slug ] = term;
						if ( 'user' === term.slug ) {
							userTermFound = true;
						}
					} );

					if ( userTermFound ) {
						resolve( prplSuggestedTasksTerms[ taxonomy ] );
					} else {
						// If the `user` term doesn't exist, create it.
						wp.apiFetch( {
							path: `/wp/v2/${ taxonomy }`,
							method: 'POST',
							data: {
								slug: 'user',
								name: 'user',
							},
						} )
							.then( ( response ) => {
								prplSuggestedTasksTerms[ taxonomy ].user =
									response;
								resolve( prplSuggestedTasksTerms[ taxonomy ] );
							} )
							.catch( ( error ) => {
								console.error(
									`Error creating user term for taxonomy: ${ taxonomy }`,
									error
								);
								// Resolve anyway even if creation fails.
								resolve( prplSuggestedTasksTerms[ taxonomy ] );
							} );
					}
				} )
				.catch( ( error ) => {
					console.error(
						`Error fetching terms for taxonomy: ${ taxonomy }`,
						error
					);
					// Resolve with empty object on error.
					resolve( prplSuggestedTasksTerms[ taxonomy ] );
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
				] ).then( () => resolve( prplSuggestedTasksTerms ) );
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
