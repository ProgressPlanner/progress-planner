/**
 * Makes an authenticated request to WordPress REST API
 * @param {import('@playwright/test').Page} page - The Playwright page object
 * @param {import('@playwright/test').APIRequestContext} request - The Playwright request context
 * @param {string} endpoint - The API endpoint to call
 * @param {Object} options - Additional request options
 * @returns {Promise<Response>} The API response
 */
async function makeAuthenticatedRequest(page, request, endpoint, options = {}) {
    const cookies = await page.context().cookies();
    const nonce = await page.evaluate(() => window.prplDebug.nonce);

    return request.get(endpoint, {
        ...options,
        headers: {
            'X-WP-Nonce': nonce,
            ...options.headers
        },
        cookies: cookies
    });
}

module.exports = {
    makeAuthenticatedRequest
};
