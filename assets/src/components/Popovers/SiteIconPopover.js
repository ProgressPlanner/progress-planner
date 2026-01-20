/**
 * Site Icon Popover Component.
 *
 * Allows users to upload and set a site icon.
 *
 * @param {Object}   props          Component props.
 * @param {Object}   props.task     The task object.
 * @param {Function} props.onSubmit Callback when form is submitted.
 * @param {Function} props.onClose  Callback when popover is closed.
 * @return {JSX.Element} The popover component.
 */

import { useState, useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { decodeEntities } from '@wordpress/html-entities';
import apiFetch from '@wordpress/api-fetch';
import InteractiveTaskPopover from './InteractiveTaskPopover';

export default function SiteIconPopover( { task, onSubmit, onClose } ) {
	const [ iconId, setIconId ] = useState( null );
	const [ iconUrl, setIconUrl ] = useState( '' );
	const [ isLoading, setIsLoading ] = useState( false );
	const [ error, setError ] = useState( null );

	/**
	 * Handle media uploader.
	 */
	const handleMediaUpload = useCallback( () => {
		if ( ! window.wp?.media ) {
			return;
		}

		const uploader = window.wp.media( {
			title: __( 'Select Site Icon', 'progress-planner' ),
			button: {
				text: __( 'Use as site icon', 'progress-planner' ),
			},
			multiple: false,
			library: { type: 'image' },
		} );

		uploader.on( 'select', () => {
			const attachment = uploader
				.state()
				.get( 'selection' )
				.first()
				.toJSON();

			setIconId( attachment.id );
			setIconUrl( attachment.url );
		} );

		uploader.open();
	}, [] );

	/**
	 * Handle form submission.
	 */
	const handleSubmit = useCallback(
		async ( e ) => {
			e.preventDefault();

			if ( ! iconId ) {
				return;
			}

			setIsLoading( true );
			setError( null );

			try {
				await apiFetch( {
					path: '/wp/v2/settings',
					method: 'POST',
					data: { site_icon: parseInt( iconId ) },
				} );

				if ( onSubmit ) {
					await onSubmit( task.id, task );
				}
			} catch ( err ) {
				setError(
					__(
						'Something went wrong. Please try again.',
						'progress-planner'
					)
				);
			} finally {
				setIsLoading( false );
			}
		},
		[ iconId, task, onSubmit ]
	);

	const taskTitle = decodeEntities( task.title?.rendered || task.title );

	return (
		<InteractiveTaskPopover
			isOpen={ true }
			taskId={ task.slug || task.id }
			task={ task }
			onClose={ onClose }
		>
			<div className="prpl-column prpl-column-content">
				<h2 className="prpl-popover-title">{ taskTitle }</h2>
			</div>
			<div className="prpl-column">
				<form onSubmit={ handleSubmit }>
					{ iconUrl && (
						<div className="prpl-site-icon-preview">
							<img
								src={ iconUrl }
								alt={ __(
									'Site icon preview',
									'progress-planner'
								) }
							/>
						</div>
					) }
					<button
						type="button"
						className="prpl-upload-site-icon prpl-button"
						onClick={ handleMediaUpload }
						disabled={ isLoading }
					>
						{ __( 'Select Site Icon', 'progress-planner' ) }
					</button>
					<input
						type="hidden"
						name="site_icon"
						value={ iconId || '' }
					/>
					{ error && (
						<p className="prpl-note prpl-note-error prpl-interactive-task-error-message">
							{ error }
						</p>
					) }
					<div className="prpl-steps-nav-wrapper">
						<button
							type="submit"
							className="prpl-button prpl-button-primary"
							disabled={ isLoading || ! iconId }
						>
							{ isLoading ? (
								<span
									className="spinner"
									style={ { visibility: 'visible' } }
								></span>
							) : (
								__( 'Save', 'progress-planner' )
							) }
						</button>
					</div>
				</form>
			</div>
		</InteractiveTaskPopover>
	);
}
