/**
 * Blog Description Popover Component.
 *
 * Allows users to set the site tagline.
 *
 * @param {Object}   props          Component props.
 * @param {Object}   props.task     The task object.
 * @param {Function} props.onSubmit Callback when form is submitted.
 * @param {Function} props.onClose  Callback when popover is closed.
 * @return {JSX.Element} The popover component.
 */

import { useState, useEffect, useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { decodeEntities } from '@wordpress/html-entities';
import apiFetch from '@wordpress/api-fetch';
import InteractiveTaskPopover from './InteractiveTaskPopover';
import { submitSiteSettings } from '../../hooks/usePopoverForms';

export default function BlogDescriptionPopover( { task, onSubmit, onClose } ) {
	const [ value, setValue ] = useState( '' );
	const [ isLoading, setIsLoading ] = useState( false );
	const [ error, setError ] = useState( null );

	/**
	 * Load current blog description on mount.
	 */
	useEffect( () => {
		apiFetch( { path: '/wp/v2/settings' } )
			.then( ( settings ) => {
				setValue( settings.description || '' );
			} )
			.catch( () => {
				// Ignore errors, use empty string
			} );
	}, [] );

	/**
	 * Handle form submission.
	 */
	const handleSubmit = useCallback(
		async ( e ) => {
			e.preventDefault();

			if ( ! value.trim() ) {
				return;
			}

			setIsLoading( true );
			setError( null );

			try {
				const popoverId = `prpl-popover-${ task.slug || task.id }`;
				await submitSiteSettings( {
					settingAPIKey: 'description',
					setting: 'blogdescription',
					popoverId,
					settingCallbackValue: () => value.trim(),
					value: value.trim(),
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
		[ value, task, onSubmit ]
	);

	const taskTitle = decodeEntities( task.title?.rendered || task.title );
	const taskDescription =
		task.description?.rendered || task.description || '';

	return (
		<InteractiveTaskPopover
			isOpen={ true }
			taskId={ task.slug || task.id }
			task={ task }
			onClose={ onClose }
		>
			<div className="prpl-column prpl-column-content">
				<h2 className="prpl-popover-title">{ taskTitle }</h2>
				<p>
					{ __(
						"In a few words, explain what this site is about. This information is used in your website's schema and RSS feeds, and can be displayed on your site. The tagline typically is your site's mission statement.",
						'progress-planner'
					) }
				</p>
			</div>
			<div className="prpl-column">
				<form onSubmit={ handleSubmit }>
					{ taskDescription && <p>{ taskDescription }</p> }
					<label htmlFor="blogdescription">
						<span className="screen-reader-text">
							{ __( 'Blog Description', 'progress-planner' ) }
						</span>
						<input
							name="blogdescription"
							type="text"
							id="blogdescription"
							value={ value }
							onChange={ ( e ) => setValue( e.target.value ) }
							placeholder={ __(
								'A catchy phrase to describe your website',
								'progress-planner'
							) }
							disabled={ isLoading }
						/>
					</label>
					{ error && (
						<p className="prpl-note prpl-note-error prpl-interactive-task-error-message">
							{ error }
						</p>
					) }
					<div className="prpl-steps-nav-wrapper">
						<button
							type="submit"
							className="prpl-button prpl-button-primary"
							disabled={ isLoading || ! value.trim() }
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
