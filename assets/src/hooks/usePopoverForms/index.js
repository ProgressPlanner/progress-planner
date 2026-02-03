/**
 * Popover Forms Hook.
 *
 * Handles form submission logic for interactive task popovers.
 * Replaces the vanilla JS prplInteractiveTaskFormListener.
 */

import apiFetch from '@wordpress/api-fetch';
import { __ } from '@wordpress/i18n';

/**
 * Show loading state on a form.
 *
 * @param {HTMLFormElement} formElement The form element.
 */
function showLoading( formElement ) {
	let submitButton = formElement.querySelector( 'button[type="submit"]' );

	if ( ! submitButton ) {
		submitButton = formElement.querySelector(
			'button[data-action="completeTask"]'
		);
	}

	if ( submitButton ) {
		submitButton.disabled = true;

		// Add spinner.
		const spinner = document.createElement( 'span' );
		spinner.classList.add( 'prpl-spinner' );
		spinner.innerHTML =
			'<span class="spinner" style="visibility: visible;"></span>';
		submitButton.after( spinner );
	}
}

/**
 * Hide loading state on a form.
 *
 * @param {HTMLFormElement} formElement The form element.
 */
function hideLoading( formElement ) {
	let submitButton = formElement.querySelector( 'button[type="submit"]' );

	if ( ! submitButton ) {
		submitButton = formElement.querySelector(
			'button[data-action="completeTask"]'
		);
	}

	if ( submitButton ) {
		submitButton.disabled = false;
	}

	const spinner = formElement.querySelector( 'span.prpl-spinner' );
	if ( spinner ) {
		spinner.remove();
	}
}

/**
 * Show error message on a form.
 *
 * @param {string} popoverId The popover ID.
 */
function showError( popoverId ) {
	const formElement = document.querySelector( `#${ popoverId } form` );

	if ( ! formElement ) {
		return;
	}

	// Check if there's already an error message
	const existingError = formElement.parentNode.querySelector(
		'p.prpl-interactive-task-error-message'
	);

	if ( ! existingError ) {
		const errorParagraph = document.createElement( 'p' );
		errorParagraph.classList.add(
			'prpl-note',
			'prpl-note-error',
			'prpl-interactive-task-error-message'
		);
		errorParagraph.textContent = __(
			'Something went wrong. Please try again.',
			'progress-planner'
		);
		formElement.insertAdjacentElement( 'afterend', errorParagraph );
	}
}

/**
 * Clear error message from a form.
 *
 * @param {string} popoverId The popover ID.
 */
function clearError( popoverId ) {
	const formElement = document.querySelector( `#${ popoverId } form` );
	if ( ! formElement ) {
		return;
	}

	const existingError = formElement.parentNode.querySelector(
		'p.prpl-interactive-task-error-message'
	);
	if ( existingError ) {
		existingError.remove();
	}
}

/**
 * Submit site settings via WordPress REST API.
 *
 * @param {Object}   options                      Options object.
 * @param {string}   options.settingAPIKey        The API key for the setting.
 * @param {string}   options.setting              The form field name.
 * @param {string}   options.popoverId            The popover ID (for error display).
 * @param {Function} options.settingCallbackValue Optional callback to transform the value.
 * @param {*}        options.value                The form value (if provided, skips DOM query).
 * @return {Promise} Promise resolving to the response.
 */
export async function submitSiteSettings( {
	settingAPIKey,
	setting,
	popoverId,
	settingCallbackValue = ( val ) => val,
	value: providedValue = null,
} ) {
	const formElement = document.querySelector( `#${ popoverId } form` );
	if ( ! formElement && providedValue === null ) {
		throw new Error( 'Form not found and no value provided' );
	}

	if ( formElement ) {
		showLoading( formElement );
	}
	clearError( popoverId );

	try {
		const formValue =
			providedValue !== null
				? providedValue
				: new FormData( formElement ).get( setting );
		const settingValue = settingCallbackValue( formValue );

		const response = await apiFetch( {
			path: '/wp/v2/settings',
			method: 'POST',
			data: { [ settingAPIKey ]: settingValue },
		} );

		if ( formElement ) {
			hideLoading( formElement );
		}
		return response;
	} catch ( error ) {
		if ( formElement ) {
			hideLoading( formElement );
		}
		showError( popoverId );
		throw error;
	}
}

/**
 * Submit plugin settings via REST API.
 *
 * @param {Object}   options                      Options object.
 * @param {string}   options.setting              The setting name.
 * @param {string}   options.settingPath          The setting path (JSON string).
 * @param {string}   options.popoverId            The popover ID (for error display).
 * @param {Function} options.settingCallbackValue Optional callback to transform the value.
 * @param {*}        options.value                The form value (if provided, skips DOM query).
 * @return {Promise} Promise resolving to the response.
 */
export async function submitPluginSettings( {
	setting,
	settingPath = false,
	popoverId,
	settingCallbackValue = ( val ) => val,
	value: providedValue = null,
} ) {
	const formElement = document.querySelector( `#${ popoverId } form` );
	if ( ! formElement && providedValue === null ) {
		throw new Error( 'Form not found and no value provided' );
	}

	if ( formElement ) {
		showLoading( formElement );
	}
	clearError( popoverId );

	try {
		const formValue =
			providedValue !== null
				? providedValue
				: new FormData( formElement ).get( setting );
		const settingValue = settingCallbackValue( formValue );

		// Use REST API instead of AJAX
		// Convert settingPath to JSON string if it's an array or already a string
		let settingPathValue = '';
		if ( settingPath ) {
			if ( Array.isArray( settingPath ) ) {
				settingPathValue = JSON.stringify( settingPath );
			} else if ( typeof settingPath === 'string' ) {
				// If it's already a JSON string, use it as-is
				settingPathValue = settingPath;
			}
		}

		const response = await apiFetch( {
			path: '/progress-planner/v1/popover/submit',
			method: 'POST',
			data: {
				setting,
				value: settingValue,
				setting_path: settingPathValue,
			},
		} );

		if ( formElement ) {
			hideLoading( formElement );
		}

		if ( response.success !== true ) {
			showError( popoverId );
			throw new Error( 'Settings update failed' );
		}

		return response;
	} catch ( error ) {
		if ( formElement ) {
			hideLoading( formElement );
		}
		showError( popoverId );
		throw error;
	}
}

/**
 * Submit custom callback.
 *
 * @param {Object}   options           Options object.
 * @param {string}   options.popoverId The popover ID.
 * @param {Function} options.callback  The callback function returning a Promise.
 * @return {Promise} Promise resolving to the response.
 */
export async function submitCustom( { popoverId, callback } ) {
	const formElement = document.querySelector( `#${ popoverId } form` );
	if ( ! formElement ) {
		throw new Error( 'Form not found' );
	}

	showLoading( formElement );
	clearError( popoverId );

	try {
		const response = await callback();
		hideLoading( formElement );

		if ( response.success !== true ) {
			showError( popoverId );
			throw new Error( 'Custom submit failed' );
		}

		return response;
	} catch ( error ) {
		hideLoading( formElement );
		showError( popoverId );
		throw error;
	}
}

/**
 * Delete a WordPress post.
 *
 * @param {number} postId   The post ID.
 * @param {string} postType The post type (default: 'posts').
 * @return {Promise} Promise resolving to the response.
 */
export async function deletePost( postId, postType = 'posts' ) {
	return apiFetch( {
		path: `/wp/v2/${ postType }/${ postId }?force=true`,
		method: 'DELETE',
	} );
}

/**
 * Close a popover by ID.
 *
 * @param {string} popoverId The popover ID.
 */
export function closePopover( popoverId ) {
	const popover = document.getElementById( popoverId );
	if ( popover && typeof popover.hidePopover === 'function' ) {
		popover.hidePopover();
	}
}

/**
 * Submit subscribe form via REST API.
 *
 * @param {Object} options           Options object.
 * @param {string} options.name      The user's name.
 * @param {string} options.email     The user's email.
 * @param {string} options.popoverId The popover ID (for error display).
 * @return {Promise} Promise resolving to the response.
 */
export async function submitSubscribeForm( { name, email, popoverId } ) {
	const formElement = document.querySelector( `#${ popoverId } form` );
	if ( ! formElement ) {
		throw new Error( 'Form not found' );
	}

	showLoading( formElement );
	clearError( popoverId );

	try {
		const siteUrl = window.location.origin;
		const timezoneOffset = new Date().getTimezoneOffset() / -60;

		const response = await apiFetch( {
			path: '/progress-planner/v1/popover/subscribe',
			method: 'POST',
			data: {
				name: name.trim(),
				email: email.trim(),
				site: siteUrl,
				timezone_offset: timezoneOffset,
				with_email: 'yes',
			},
		} );

		hideLoading( formElement );

		if ( response.success !== true ) {
			showError( popoverId );
			throw new Error( 'Subscription failed' );
		}

		return response;
	} catch ( error ) {
		hideLoading( formElement );
		showError( popoverId );
		throw error;
	}
}
