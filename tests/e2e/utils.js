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

module.exports = {
	makeAuthenticatedRequest,
};
