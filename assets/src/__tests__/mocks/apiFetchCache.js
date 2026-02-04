const apiFetch = require( '@wordpress/api-fetch' );

module.exports = {
	cachedApiFetch: ( options ) => apiFetch( options ),
	clearCache: jest.fn(),
	clearCacheFor: jest.fn(),
};
