const { test } = require( '@playwright/test' );

/**
 * Makes an authenticated request to WordPress REST API
 * @param {import('@playwright/test').Page}              page     - The Playwright page object
 * @param {import('@playwright/test').APIRequestContext} request  - The Playwright request context
 * @param {string}                                       endpoint - The API endpoint to call
 * @param {Object}                                       options  - Additional request options
 * @return {Promise<Response>} The API response
 */
async function makeAuthenticatedRequest(
	page,
	request,
	endpoint,
	options = {}
) {
	const cookies = await page.context().cookies();

	return request.get( endpoint, {
		...options,
		headers: {
			...options.headers,
		},
		cookies,
		params: {
			token: process.env.PRPL_TEST_TOKEN,
		},
	} );
}

// Add timing utility
const startTime = Date.now();
const getElapsedTime = () => {
	const elapsed = Date.now() - startTime;
	return `${ ( elapsed / 1000 ).toFixed( 2 ) }s`;
};

// Log test start/end with timing
test.beforeEach( async ( {}, testInfo ) => {
	console.log( `[${ getElapsedTime() }] Starting test: ${ testInfo.title }` );
} );

test.afterEach( async ( {}, testInfo ) => {
	console.log( `[${ getElapsedTime() }] Finished test: ${ testInfo.title }` );
} );

module.exports = {
	makeAuthenticatedRequest,
};
