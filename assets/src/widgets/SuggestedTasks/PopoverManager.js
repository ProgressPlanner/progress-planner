/**
 * Popover Manager Component.
 *
 * Manages React popover components using @wordpress/hooks for communication.
 * Listens for popover open/close events and renders the appropriate React component.
 */

import { useState, useEffect, useCallback } from '@wordpress/element';
import { addAction, removeAction } from '@wordpress/hooks';
import apiFetch from '@wordpress/api-fetch';
import { deletePost } from '../../hooks/usePopoverForms';
import { getPopoverComponent } from '../../components/Popovers/popoverRegistry';

/**
 * PopoverManager component.
 *
 * @param {Object}   props            Component props.
 * @param {Function} props.onComplete Callback for completing a task.
 * @param {Object}   props.config     Widget configuration.
 * @return {JSX.Element} The popover manager component.
 */
export default function PopoverManager( { onComplete, config = {} } ) {
	const [ openPopoverId, setOpenPopoverId ] = useState( null );
	const [ openTask, setOpenTask ] = useState( null );
	/**
	 * Handle popover open event.
	 */
	const handlePopoverOpen = useCallback( ( taskId, task ) => {
		setOpenPopoverId( taskId );
		setOpenTask( task );
	}, [] );

	/**
	 * Handle popover close event.
	 */
	const handlePopoverClose = useCallback(
		( taskId ) => {
			if ( taskId === openPopoverId ) {
				setOpenPopoverId( null );
				setOpenTask( null );
			}
		},
		[ openPopoverId ]
	);

	/**
	 * Set up hook listeners.
	 */
	useEffect( () => {
		addAction(
			'prpl.popover.open',
			'prpl/popover-manager',
			handlePopoverOpen
		);
		addAction(
			'prpl.popover.close',
			'prpl/popover-manager',
			handlePopoverClose
		);

		return () => {
			removeAction( 'prpl.popover.open', 'prpl/popover-manager' );
			removeAction( 'prpl.popover.close', 'prpl/popover-manager' );
		};
	}, [ handlePopoverOpen, handlePopoverClose ] );

	/**
	 * Handle popover form submission completion.
	 */
	const handlePopoverSubmit = useCallback(
		async ( taskId, task ) => {
			await onComplete( task.id || taskId, task );
			setOpenPopoverId( null );
			setOpenTask( null );
		},
		[ onComplete ]
	);

	/**
	 * Handle custom submit types.
	 */
	const handleCustomSubmit = useCallback( async ( taskId ) => {
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
				// This will be handled by CustomPopover component
				// Form data should be passed from the component
				return { success: true };
			}

			case 'core-siteicon': {
				// This is handled by SiteIconPopover component
				return { success: true };
			}

			case 'yoast-organization-logo': {
				// This is handled by SiteIconPopover component
				return { success: true };
			}

			case 'update-term-description': {
				// This will be handled by CustomPopover component
				// Form data should be passed from the component
				return { success: true };
			}

			case 'remove-terms-without-posts': {
				const termIds =
					window.removeTermsWithoutPostsData?.termIds || [];
				const taxonomy =
					window.removeTermsWithoutPostsData?.taxonomy || 'category';

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
				return { success: true };
			}

			default:
				return { success: true };
		}
	}, [] );

	// Get the popover component for the open popover
	// Try to find task ID from task object
	const taskIdForLookup =
		openTask?.slug || openTask?.prpl_provider?.slug || openPopoverId;

	const PopoverComponent = taskIdForLookup
		? getPopoverComponent( taskIdForLookup )
		: null;

	// Render the popover if one is open
	if ( ! PopoverComponent || ! openTask ) {
		return null;
	}

	return (
		<PopoverComponent
			task={ openTask }
			onSubmit={ handlePopoverSubmit }
			onClose={ () => handlePopoverClose( openPopoverId ) }
			onCustomSubmit={ handleCustomSubmit }
			config={ config }
		/>
	);
}
