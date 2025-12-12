/**
 * Yoast SEO Popover Component.
 *
 * Generic popover for Yoast SEO settings.
 *
 * @param {Object}   props          Component props.
 * @param {Object}   props.task     The task object.
 * @param {Function} props.onSubmit Callback when form is submitted.
 * @param {Function} props.onClose  Callback when popover is closed.
 * @return {JSX.Element} The popover component.
 */

import { useState, useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import InteractiveTaskPopover from './InteractiveTaskPopover';
import { submitPluginSettings } from '../../hooks/usePopoverForms';

export default function YoastPopover( { task, onSubmit, onClose } ) {
	const [ isLoading, setIsLoading ] = useState( false );
	const [ error, setError ] = useState( null );

	/**
	 * Handle form submission.
	 */
	const handleSubmit = useCallback(
		async ( e ) => {
			e.preventDefault();

			setIsLoading( true );
			setError( null );

			try {
				const popoverId = `prpl-popover-${ task.slug || task.id }`;
				const taskId = task.slug || task.prpl_provider?.slug || task.id;

				// Get config from POPOVER_CONFIG
				const configs = {
					'yoast-author-archive': {
						setting: 'wpseo_titles',
						settingPath: JSON.stringify( [ 'disable-author' ] ),
						settingCallbackValue: () => true,
					},
					'yoast-date-archive': {
						setting: 'wpseo_titles',
						settingPath: JSON.stringify( [ 'disable-date' ] ),
						settingCallbackValue: () => true,
					},
					'yoast-format-archive': {
						setting: 'wpseo_titles',
						settingPath: JSON.stringify( [
							'disable-post_format',
						] ),
						settingCallbackValue: () => true,
					},
					'yoast-media-pages': {
						setting: 'wpseo_titles',
						settingPath: JSON.stringify( [ 'disable-attachment' ] ),
						settingCallbackValue: () => true,
					},
					'yoast-crawl-settings-emoji-scripts': {
						setting: 'wpseo',
						settingPath: JSON.stringify( [
							'remove_emoji_scripts',
						] ),
						settingCallbackValue: () => true,
					},
					'yoast-crawl-settings-feed-authors': {
						setting: 'wpseo',
						settingPath: JSON.stringify( [
							'remove_feed_authors',
						] ),
						settingCallbackValue: () => true,
					},
					'yoast-crawl-settings-feed-global-comments': {
						setting: 'wpseo',
						settingPath: JSON.stringify( [
							'remove_feed_global_comments',
						] ),
						settingCallbackValue: () => true,
					},
				};

				const config = configs[ taskId ];
				if ( config ) {
					await submitPluginSettings( {
						setting: config.setting,
						settingPath: config.settingPath,
						popoverId,
						settingCallbackValue: config.settingCallbackValue,
						value: config.settingCallbackValue(),
					} );
				}

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
		[ task, onSubmit ]
	);

	const taskTitle = task.title?.rendered || task.title;
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
				{ taskDescription && <p>{ taskDescription }</p> }
			</div>
			<div className="prpl-column">
				<form onSubmit={ handleSubmit }>
					{ error && (
						<p className="prpl-note prpl-note-error prpl-interactive-task-error-message">
							{ error }
						</p>
					) }
					<div className="prpl-steps-nav-wrapper prpl-steps-nav-wrapper-align-left">
						<button
							type="submit"
							className="prpl-button prpl-button-primary"
							disabled={ isLoading }
						>
							{ isLoading ? (
								<span
									className="spinner"
									style={ { visibility: 'visible' } }
								></span>
							) : (
								__( 'Submit', 'progress-planner' )
							) }
						</button>
					</div>
				</form>
			</div>
		</InteractiveTaskPopover>
	);
}

