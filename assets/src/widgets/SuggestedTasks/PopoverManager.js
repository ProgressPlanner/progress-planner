/**
 * Popover Manager Component.
 *
 * Sets up form submission handlers for all interactive task popovers.
 * This replaces the vanilla JS files in assets/js/recommendations/.
 */

import { useEffect, useCallback } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import {
	submitSiteSettings,
	submitPluginSettings,
	deletePost,
	closePopover,
} from '../../hooks/usePopoverForms';

/**
 * Popover configuration for each task type.
 * This maps task IDs to their form submission configuration.
 */
const POPOVER_CONFIG = {
	// Core WordPress settings (siteSettings pattern)
	'core-blogdescription': {
		type: 'siteSettings',
		settingAPIKey: 'description',
		setting: 'blogdescription',
	},
	'disable-comments': {
		type: 'siteSettings',
		settingAPIKey: 'default_comment_status',
		setting: 'default_comment_status',
		settingCallbackValue: () => 'closed',
	},
	'disable-comment-pagination': {
		type: 'siteSettings',
		settingAPIKey: 'page_comments',
		setting: 'page_comments',
		settingCallbackValue: () => false,
	},
	'select-locale': {
		type: 'siteSettings',
		settingAPIKey: 'WPLANG',
		setting: 'WPLANG',
	},
	'select-timezone': {
		type: 'siteSettings',
		settingAPIKey: 'timezone_string',
		setting: 'timezone_string',
	},
	'search-engine-visibility': {
		type: 'pluginSettings',
		setting: 'blog_public',
		action: 'prpl_interactive_task_submit',
		settingCallbackValue: () => '1',
	},
	'set-date-format': {
		type: 'siteSettings',
		settingAPIKey: 'date_format',
		setting: 'date_format',
	},
	'core-permalink-structure': {
		type: 'siteSettings',
		settingAPIKey: 'permalink_structure',
		setting: 'permalink_structure',
	},
	'rename-uncategorized-category': {
		type: 'customSubmit',
		// Custom handling needed - updates term name
	},

	// Custom submit patterns (delete posts/pages)
	'hello-world': {
		type: 'customSubmit',
		// Custom handling - delete post
	},
	'sample-page': {
		type: 'customSubmit',
		// Custom handling - delete page
	},

	// Yoast settings
	'yoast-author-archive': {
		type: 'pluginSettings',
		setting: 'wpseo_titles',
		settingPath: JSON.stringify( [ 'disable-author' ] ),
		settingCallbackValue: () => true,
	},
	'yoast-date-archive': {
		type: 'pluginSettings',
		setting: 'wpseo_titles',
		settingPath: JSON.stringify( [ 'disable-date' ] ),
		settingCallbackValue: () => true,
	},
	'yoast-format-archive': {
		type: 'pluginSettings',
		setting: 'wpseo_titles',
		settingPath: JSON.stringify( [ 'disable-post_format' ] ),
		settingCallbackValue: () => true,
	},
	'yoast-media-pages': {
		type: 'pluginSettings',
		setting: 'wpseo_titles',
		settingPath: JSON.stringify( [ 'disable-attachment' ] ),
		settingCallbackValue: () => true,
	},
	'yoast-crawl-settings-emoji-scripts': {
		type: 'pluginSettings',
		setting: 'wpseo',
		settingPath: JSON.stringify( [ 'remove_emoji_scripts' ] ),
		settingCallbackValue: () => true,
	},
	'yoast-crawl-settings-feed-authors': {
		type: 'pluginSettings',
		setting: 'wpseo',
		settingPath: JSON.stringify( [ 'remove_feed_authors' ] ),
		settingCallbackValue: () => true,
	},
	'yoast-crawl-settings-feed-global-comments': {
		type: 'pluginSettings',
		setting: 'wpseo',
		settingPath: JSON.stringify( [ 'remove_feed_global_comments' ] ),
		settingCallbackValue: () => true,
	},
	'yoast-organization-logo': {
		type: 'customSubmit',
		// Custom handling - media upload
	},

	// AIOSEO settings
	'aioseo-author-archive': {
		type: 'pluginSettings',
		setting: 'aioseo_options_search_appearance',
		settingPath: JSON.stringify( [ 'archives', 'author', 'show' ] ),
		settingCallbackValue: () => false,
	},
	'aioseo-date-archive': {
		type: 'pluginSettings',
		setting: 'aioseo_options_search_appearance',
		settingPath: JSON.stringify( [ 'archives', 'date', 'show' ] ),
		settingCallbackValue: () => false,
	},
	'aioseo-media-pages': {
		type: 'pluginSettings',
		setting: 'aioseo_options_search_appearance',
		settingPath: JSON.stringify( [ 'postTypes', 'attachment', 'show' ] ),
		settingCallbackValue: () => false,
	},
	'aioseo-crawl-settings-feed-authors': {
		type: 'pluginSettings',
		setting: 'aioseo_options_rss_content',
		settingPath: JSON.stringify( [ 'authorFeed' ] ),
		settingCallbackValue: () => false,
	},
	'aioseo-crawl-settings-feed-comments': {
		type: 'pluginSettings',
		setting: 'aioseo_options_rss_content',
		settingPath: JSON.stringify( [ 'commentFeed' ] ),
		settingCallbackValue: () => false,
	},

	// Complex custom handlers
	'core-siteicon': {
		type: 'customSubmit',
		// Custom handling - media upload for site icon
	},
	'update-term-description': {
		type: 'customSubmit',
		// Custom handling - dynamic term
	},
	'remove-terms-without-posts': {
		type: 'customSubmit',
		// Custom handling - multiple terms
	},
};

/**
 * PopoverManager component.
 *
 * @param {Object}   props            Component props.
 * @param {Array}    props.tasks      The list of tasks.
 * @param {Function} props.onComplete Callback for completing a task.
 * @param {Object}   props.config     Widget configuration.
 * @return {null} This component renders nothing.
 */
export default function PopoverManager( { tasks, onComplete, config = {} } ) {
	/**
	 * Handle custom submit types.
	 */
	const handleCustomSubmit = useCallback( async ( taskId, popoverId ) => {
		switch ( taskId ) {
			case 'hello-world': {
				const postId = window.helloWorldData?.postId;
				if ( postId ) {
					await deletePost( postId, 'posts' );
				}
				return { success: true };
			}

			case 'sample-page': {
				const pageId = window.samplePageData?.postId;
				if ( pageId ) {
					await deletePost( pageId, 'pages' );
				}
				return { success: true };
			}

			case 'rename-uncategorized-category': {
				const formElement = document.querySelector(
					`#${ popoverId } form`
				);
				if ( formElement ) {
					const formData = new FormData( formElement );
					const newName = formData.get( 'category_name' );
					const termId =
						window.renameUncategorizedCategoryData?.termId;

					if ( termId && newName ) {
						await apiFetch( {
							path: `/wp/v2/categories/${ termId }`,
							method: 'POST',
							data: { name: newName },
						} );
					}
				}
				return { success: true };
			}

			case 'core-siteicon': {
				// Site icon is handled via media uploader
				// The hidden field is populated by the media uploader
				const formElement = document.querySelector(
					`#${ popoverId } form`
				);
				if ( formElement ) {
					const formData = new FormData( formElement );
					const iconId = formData.get( 'site_icon' );

					if ( iconId ) {
						await apiFetch( {
							path: '/wp/v2/settings',
							method: 'POST',
							data: { site_icon: parseInt( iconId ) },
						} );
					}
				}
				return { success: true };
			}

			case 'yoast-organization-logo': {
				// Organization logo is handled via media uploader
				const formElement = document.querySelector(
					`#${ popoverId } form`
				);
				if ( formElement ) {
					const formData = new FormData( formElement );
					const logoId = formData.get( 'company_logo_id' );

					if ( logoId ) {
						await submitPluginSettings( {
							setting: 'wpseo',
							settingPath: JSON.stringify( [
								'company_logo_id',
							] ),
							popoverId,
							settingCallbackValue: () => parseInt( logoId ),
						} );
					}
				}
				return { success: true };
			}

			case 'update-term-description': {
				const formElement = document.querySelector(
					`#${ popoverId } form`
				);
				if ( formElement ) {
					const formData = new FormData( formElement );
					const description = formData.get( 'description' );
					const termId = window.updateTermDescriptionData?.termId;
					const taxonomy =
						window.updateTermDescriptionData?.taxonomy ||
						'category';

					if ( termId && description ) {
						const taxonomyEndpoint =
							taxonomy === 'category' ? 'categories' : taxonomy;
						await apiFetch( {
							path: `/wp/v2/${ taxonomyEndpoint }/${ termId }`,
							method: 'POST',
							data: { description },
						} );
					}
				}
				return { success: true };
			}

			case 'remove-terms-without-posts': {
				const formElement = document.querySelector(
					`#${ popoverId } form`
				);
				if ( formElement ) {
					const termIds =
						window.removeTermsWithoutPostsData?.termIds || [];
					const taxonomy =
						window.removeTermsWithoutPostsData?.taxonomy ||
						'category';

					const taxonomyEndpoint =
						taxonomy === 'category' ? 'categories' : taxonomy;

					// Delete each term
					await Promise.all(
						termIds.map( ( termId ) =>
							apiFetch( {
								path: `/wp/v2/${ taxonomyEndpoint }/${ termId }?force=true`,
								method: 'DELETE',
							} )
						)
					);
				}
				return { success: true };
			}

			default:
				return { success: true };
		}
	}, [] );

	/**
	 * Handle form submission for a task.
	 */
	const handleFormSubmit = useCallback(
		async ( taskId, popoverId, popoverConfig ) => {
			try {
				// Find the task
				const task = tasks.find(
					( t ) =>
						t.slug === taskId ||
						t.prpl_provider?.slug === taskId ||
						`${ t.id }` === taskId
				);

				if ( ! task ) {
					return;
				}

				let submitPromise;

				switch ( popoverConfig.type ) {
					case 'siteSettings':
						submitPromise = submitSiteSettings( {
							settingAPIKey: popoverConfig.settingAPIKey,
							setting: popoverConfig.setting,
							popoverId,
							settingCallbackValue:
								popoverConfig.settingCallbackValue,
						} );
						break;

					case 'pluginSettings':
						submitPromise = submitPluginSettings( {
							setting: popoverConfig.setting,
							settingPath: popoverConfig.settingPath,
							popoverId,
							action:
								popoverConfig.action ||
								'prpl_interactive_task_submit',
							settingCallbackValue:
								popoverConfig.settingCallbackValue,
						} );
						break;

					case 'customSubmit':
						// Handle specific custom submits
						submitPromise = handleCustomSubmit( taskId, popoverId );
						break;

					default:
						return;
				}

				await submitPromise;

				// Trigger task completion
				await onComplete( task.id, task );

				// Close the popover
				closePopover( popoverId );
			} catch ( error ) {
				// Error already shown by submit functions
				// eslint-disable-next-line no-console
				console.error( 'Popover form submission error:', error );
			}
		},
		[ tasks, onComplete, handleCustomSubmit ]
	);

	/**
	 * Set up form listeners for all popovers.
	 */
	useEffect( () => {
		const formHandlers = new Map();

		// Set up listeners for each configured popover
		Object.entries( POPOVER_CONFIG ).forEach(
			( [ taskId, popoverConfig ] ) => {
				const popoverId = `prpl-popover-${ taskId }`;
				const formElement = document.querySelector(
					`#${ popoverId } form`
				);

				if ( ! formElement ) {
					return;
				}

				const handler = ( event ) => {
					event.preventDefault();
					handleFormSubmit( taskId, popoverId, popoverConfig );
				};

				formElement.addEventListener( 'submit', handler );
				formHandlers.set( popoverId, { formElement, handler } );
			}
		);

		// Set up input validation for blogdescription
		const blogdescriptionInput = document.querySelector(
			'input#blogdescription'
		);
		if ( blogdescriptionInput ) {
			const submitButton = document.querySelector(
				'#prpl-popover-core-blogdescription button[type="submit"]'
			);
			if ( submitButton ) {
				const inputHandler = ( e ) => {
					submitButton.disabled = e.target.value.length === 0;
				};
				blogdescriptionInput.addEventListener( 'input', inputHandler );
			}
		}

		// Set up date format preview
		setupDateFormatPreview( config );

		// Set up permalink structure preview
		setupPermalinkPreview();

		// Set up media uploaders
		setupMediaUploaders();

		// Cleanup
		return () => {
			formHandlers.forEach( ( { formElement, handler } ) => {
				formElement.removeEventListener( 'submit', handler );
			} );
		};
	}, [ tasks, handleFormSubmit, config ] );

	// This component doesn't render anything
	return null;
}

/**
 * Set up date format preview functionality.
 *
 * @param {Object} widgetConfig Widget configuration object.
 */
function setupDateFormatPreview( widgetConfig = {} ) {
	const radios = document.querySelectorAll(
		'#prpl-popover-set-date-format input[name="date_format"]'
	);
	const customInput = document.querySelector(
		'#prpl-popover-set-date-format input[name="date_format_custom"]'
	);

	if ( ! radios.length || ! customInput ) {
		return;
	}

	// Handle radio change
	radios.forEach( ( radio ) => {
		radio.addEventListener( 'change', () => {
			if ( radio.value === 'custom' ) {
				customInput.disabled = false;
				customInput.focus();
			} else {
				customInput.disabled = true;
			}
		} );
	} );

	// Handle custom input - update preview via AJAX
	let debounceTimeout;
	customInput.addEventListener( 'input', () => {
		clearTimeout( debounceTimeout );
		debounceTimeout = setTimeout( async () => {
			const format = customInput.value;
			if ( ! format ) {
				return;
			}

			try {
				const ajaxUrl =
					widgetConfig?.ajaxUrl ||
					window.progressPlanner?.ajaxUrl ||
					'/wp-admin/admin-ajax.php';
				const nonce =
					widgetConfig?.nonce || window.progressPlanner?.nonce || '';
				const response = await fetch(
					`${ ajaxUrl }?action=prpl_date_format_preview&format=${ encodeURIComponent(
						format
					) }&_ajax_nonce=${ nonce }`,
					{ credentials: 'same-origin' }
				);
				const data = await response.json();
				if ( data.success && data.data ) {
					// Update the custom preview
					const customPreview = customInput
						.closest( '.prpl-radio-wrapper' )
						?.querySelector( '.date-time-text' );
					if ( customPreview ) {
						customPreview.textContent = data.data;
					}
				}
			} catch {
				// Preview update failed, ignore
			}
		}, 300 );
	} );
}

/**
 * Set up permalink structure preview functionality.
 */
function setupPermalinkPreview() {
	const radios = document.querySelectorAll(
		'#prpl-popover-core-permalink-structure input[name="permalink_structure"]'
	);

	if ( ! radios.length ) {
		return;
	}

	const customInput = document.querySelector(
		'#prpl-popover-core-permalink-structure input[name="permalink_custom"]'
	);

	radios.forEach( ( radio ) => {
		radio.addEventListener( 'change', () => {
			if ( radio.value === 'custom' && customInput ) {
				customInput.disabled = false;
				customInput.focus();
			} else if ( customInput ) {
				customInput.disabled = true;
			}
		} );
	} );
}

/**
 * Set up media uploaders for site icon and organization logo.
 */
function setupMediaUploaders() {
	// Site icon uploader
	const siteIconButton = document.querySelector(
		'#prpl-popover-core-siteicon .prpl-upload-site-icon'
	);
	if ( siteIconButton && window.wp?.media ) {
		let siteIconUploader;

		siteIconButton.addEventListener( 'click', ( e ) => {
			e.preventDefault();

			if ( ! siteIconUploader ) {
				siteIconUploader = window.wp.media( {
					title: siteIconButton.dataset.title || 'Select Site Icon',
					button: {
						text:
							siteIconButton.dataset.button || 'Use as site icon',
					},
					multiple: false,
					library: { type: 'image' },
				} );

				siteIconUploader.on( 'select', () => {
					const attachment = siteIconUploader
						.state()
						.get( 'selection' )
						.first()
						.toJSON();

					// Update hidden field
					const hiddenInput = document.querySelector(
						'#prpl-popover-core-siteicon input[name="site_icon"]'
					);
					if ( hiddenInput ) {
						hiddenInput.value = attachment.id;
					}

					// Update preview
					const preview = document.querySelector(
						'#prpl-popover-core-siteicon .prpl-site-icon-preview img'
					);
					if ( preview ) {
						preview.src = attachment.url;
					}

					// Enable submit button
					const submitButton = document.querySelector(
						'#prpl-popover-core-siteicon button[type="submit"]'
					);
					if ( submitButton ) {
						submitButton.disabled = false;
					}
				} );
			}

			siteIconUploader.open();
		} );
	}

	// Yoast organization logo uploader
	const logoButton = document.querySelector(
		'#prpl-popover-yoast-organization-logo .prpl-upload-logo'
	);
	if ( logoButton && window.wp?.media ) {
		let logoUploader;

		logoButton.addEventListener( 'click', ( e ) => {
			e.preventDefault();

			if ( ! logoUploader ) {
				logoUploader = window.wp.media( {
					title: logoButton.dataset.title || 'Select Logo',
					button: {
						text: logoButton.dataset.button || 'Use as logo',
					},
					multiple: false,
					library: { type: 'image' },
				} );

				logoUploader.on( 'select', () => {
					const attachment = logoUploader
						.state()
						.get( 'selection' )
						.first()
						.toJSON();

					// Update hidden field
					const hiddenInput = document.querySelector(
						'#prpl-popover-yoast-organization-logo input[name="company_logo_id"]'
					);
					if ( hiddenInput ) {
						hiddenInput.value = attachment.id;
					}

					// Update preview
					const preview = document.querySelector(
						'#prpl-popover-yoast-organization-logo .prpl-logo-preview img'
					);
					if ( preview ) {
						preview.src = attachment.url;
					}

					// Enable submit button
					const submitButton = document.querySelector(
						'#prpl-popover-yoast-organization-logo button[type="submit"]'
					);
					if ( submitButton ) {
						submitButton.disabled = false;
					}
				} );
			}

			logoUploader.open();
		} );
	}
}
