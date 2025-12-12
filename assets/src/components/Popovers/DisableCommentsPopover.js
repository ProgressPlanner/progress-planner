/**
 * Disable Comments Popover Component.
 *
 * Simple popover with just a submit button (no form fields).
 * Used for tasks like disable-comments, disable-comment-pagination, etc.
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
import {
	submitSiteSettings,
	submitPluginSettings,
} from '../../hooks/usePopoverForms';

export default function DisableCommentsPopover( { task, onSubmit, onClose } ) {
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

				// Determine submission type based on task ID
				if ( taskId === 'disable-comments' ) {
					await submitSiteSettings( {
						settingAPIKey: 'default_comment_status',
						setting: 'default_comment_status',
						popoverId,
						settingCallbackValue: () => 'closed',
						value: 'closed',
					} );
				} else if ( taskId === 'disable-comment-pagination' ) {
					await submitSiteSettings( {
						settingAPIKey: 'page_comments',
						setting: 'page_comments',
						popoverId,
						settingCallbackValue: () => false,
						value: false,
					} );
				} else if ( taskId === 'search-engine-visibility' ) {
					await submitPluginSettings( {
						setting: 'blog_public',
						popoverId,
						action: 'prpl_interactive_task_submit',
						settingCallbackValue: () => '1',
						value: '1',
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

