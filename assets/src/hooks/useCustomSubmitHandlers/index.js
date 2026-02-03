/**
 * Custom Submit Handlers Hook.
 *
 * Provides a registry of custom submit handlers for specific task types.
 * Handlers accept task data as parameters instead of reading from global window objects.
 * Falls back to window objects for backward compatibility during migration.
 *
 * @module hooks/useCustomSubmitHandlers
 */

import apiFetch from '@wordpress/api-fetch';
import { deletePost } from '../usePopoverForms';

/**
 * Handle hello-world task submission.
 *
 * Deletes the "Hello World!" post created by WordPress on installation.
 * Attempts to get post ID from task data, falling back to window object for compatibility.
 *
 * @param {Object} task                         The task object containing post ID information.
 * @param {number} [task.prpl_task_data.postId] Post ID from task data.
 * @param {number} [task.postId]                Post ID from task object.
 * @return {Promise<{success: boolean}>} Promise resolving to success response.
 */
async function handleHelloWorld( task ) {
	const postId =
		task.prpl_task_data?.postId ||
		task.postId ||
		window.helloWorldData?.postId;

	if ( postId ) {
		await deletePost( postId, 'posts' );
	}
	return { success: true };
}

/**
 * Handle sample-page task submission.
 *
 * Deletes the "Sample Page" created by WordPress on installation.
 * Attempts to get page ID from task data, falling back to window object for compatibility.
 *
 * @param {Object} task                         The task object containing page ID information.
 * @param {number} [task.prpl_task_data.pageId] Page ID from task data.
 * @param {number} [task.pageId]                Page ID from task object.
 * @return {Promise<{success: boolean}>} Promise resolving to success response.
 */
async function handleSamplePage( task ) {
	const pageId =
		task.prpl_task_data?.pageId ||
		task.pageId ||
		window.samplePageData?.postId;

	if ( pageId ) {
		await deletePost( pageId, 'pages' );
	}
	return { success: true };
}

/**
 * Handle remove-terms-without-posts task submission.
 *
 * Deletes taxonomy terms that have no associated posts.
 * Attempts to get term IDs and taxonomy from task data, falling back to window object.
 *
 * @param {Object}   task                           The task object containing term information.
 * @param {number[]} [task.prpl_task_data.termIds]  Array of term IDs from task data.
 * @param {number[]} [task.termIds]                 Array of term IDs from task object.
 * @param {string}   [task.prpl_task_data.taxonomy] Taxonomy name from task data.
 * @param {string}   [task.taxonomy]                Taxonomy name from task object.
 * @return {Promise<{success: boolean}>} Promise resolving to success response.
 */
async function handleRemoveTermsWithoutPosts( task ) {
	const termIds =
		task.prpl_task_data?.termIds ||
		task.termIds ||
		window.removeTermsWithoutPostsData?.termIds ||
		[];

	const taxonomy =
		task.prpl_task_data?.taxonomy ||
		task.taxonomy ||
		window.removeTermsWithoutPostsData?.taxonomy ||
		'category';

	if ( termIds.length === 0 ) {
		return { success: true };
	}

	const taxonomyEndpoint = taxonomy === 'category' ? 'categories' : taxonomy;

	// Delete each term
	await Promise.all(
		termIds.map( ( termId ) =>
			apiFetch( {
				path: `/wp/v2/${ taxonomyEndpoint }/${ termId }?force=true`,
				method: 'DELETE',
			} )
		)
	);

	return { success: true };
}

/**
 * Registry of custom submit handlers by task ID.
 *
 * @type {Object<string, Function>}
 */
const CUSTOM_SUBMIT_HANDLERS = {
	'hello-world': handleHelloWorld,
	'sample-page': handleSamplePage,
	'remove-terms-without-posts': handleRemoveTermsWithoutPosts,
	// These tasks are handled by their respective popover components:
	'rename-uncategorized-category': async () => ( { success: true } ),
	'core-siteicon': async () => ( { success: true } ),
	'yoast-organization-logo': async () => ( { success: true } ),
	'update-term-description': async () => ( { success: true } ),
};

/**
 * Get custom submit handler for a task ID.
 *
 * @param {string} taskId The task ID.
 * @return {Function|null} The handler function or null if not found.
 */
function getCustomSubmitHandler( taskId ) {
	return CUSTOM_SUBMIT_HANDLERS[ taskId ] || null;
}

/**
 * Custom hook to get a custom submit handler function.
 *
 * Returns a function that can handle custom submit logic for various task types.
 * The returned function looks up the appropriate handler from the registry.
 *
 * @param {Object|null} task The task object containing task data, or null if no task is open.
 * @return {Function} A function that handles custom submit for a given task ID.
 *                    Signature: (taskId: string, popoverId?: string) => Promise<{success: boolean}>
 */
export function useCustomSubmitHandlers( task ) {
	/**
	 * Handle custom submit for a task.
	 *
	 * @param {string} taskId The task ID to handle.
	 * @return {Promise<{success: boolean}>} Promise resolving to success response.
	 */
	return async ( taskId ) => {
		if ( ! taskId ) {
			// eslint-disable-next-line no-console
			console.warn( 'useCustomSubmitHandlers: No taskId provided' );
			return { success: false };
		}

		const handler = getCustomSubmitHandler( taskId );

		if ( handler ) {
			// Pass task (may be null) to handler - handlers should handle null gracefully
			return handler( task || {} );
		}

		// Default: return success for unknown tasks
		return { success: true };
	};
}
