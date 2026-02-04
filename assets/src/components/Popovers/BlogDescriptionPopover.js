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

import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { decodeEntities } from '@wordpress/html-entities';
import InteractiveTaskPopover from './InteractiveTaskPopover';
import FormErrorMessage from './FormErrorMessage';
import SubmitButton from './SubmitButton';
import { usePopoverSubmit } from '../../hooks/usePopoverSubmit';
import { useWpSettings } from '../../hooks/useWpSettings';
import { submitSiteSettings } from '../../hooks/usePopoverForms';

export default function BlogDescriptionPopover( { task, onSubmit, onClose } ) {
	const [ value, setValue ] = useState( '' );
	const { settings } = useWpSettings( [ 'description' ] );

	// Seed local state from fetched settings.
	useEffect( () => {
		if ( settings.description ) {
			setValue( settings.description );
		}
	}, [ settings.description ] );

	const { isLoading, error, handleSubmit } = usePopoverSubmit( async () => {
		if ( ! value.trim() ) {
			return;
		}

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
	}, [ value, task, onSubmit ] );

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
					<FormErrorMessage error={ error } />
					<div className="prpl-steps-nav-wrapper">
						<SubmitButton
							isLoading={ isLoading }
							disabled={ ! value.trim() }
							label={ __( 'Save', 'progress-planner' ) }
						/>
					</div>
				</form>
			</div>
		</InteractiveTaskPopover>
	);
}
