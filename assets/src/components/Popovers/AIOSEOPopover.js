/**
 * AIOSEO Popover Component.
 *
 * Generic popover for AIOSEO settings.
 *
 * @param {Object}   props          Component props.
 * @param {Object}   props.task     The task object.
 * @param {Function} props.onSubmit Callback when form is submitted.
 * @param {Function} props.onClose  Callback when popover is closed.
 * @return {JSX.Element} The popover component.
 */

import { __ } from '@wordpress/i18n';
import { decodeEntities } from '@wordpress/html-entities';
import InteractiveTaskPopover from './InteractiveTaskPopover';
import FormErrorMessage from './FormErrorMessage';
import SubmitButton from './SubmitButton';
import { usePopoverSubmit } from '../../hooks/usePopoverSubmit';
import { submitPluginSettings } from '../../hooks/usePopoverForms';

export default function AIOSEOPopover( { task, onSubmit, onClose } ) {
	const { isLoading, error, handleSubmit } = usePopoverSubmit( async () => {
		const popoverId = `prpl-popover-${ task.slug || task.id }`;
		const taskId = task.slug || task.prpl_provider?.slug || task.id;

		// Get config from POPOVER_CONFIG
		const configs = {
			'aioseo-author-archive': {
				setting: 'aioseo_options',
				settingPath: JSON.stringify( [
					'searchAppearance',
					'archives',
					'author',
					'show',
				] ),
				settingCallbackValue: () => false,
			},
			'aioseo-date-archive': {
				setting: 'aioseo_options',
				settingPath: JSON.stringify( [
					'searchAppearance',
					'archives',
					'date',
					'show',
				] ),
				settingCallbackValue: () => false,
			},
			'aioseo-media-pages': {
				setting: 'aioseo_options_dynamic',
				settingPath: JSON.stringify( [
					'searchAppearance',
					'postTypes',
					'attachment',
					'redirectAttachmentUrls',
				] ),
				settingCallbackValue: () => 'attachment',
			},
			'aioseo-crawl-settings-feed-authors': {
				setting: 'aioseo_options',
				settingPath: JSON.stringify( [
					'searchAppearance',
					'advanced',
					'crawlCleanup',
					'feeds',
					'authors',
				] ),
				settingCallbackValue: () => false,
			},
			'aioseo-crawl-settings-feed-comments': {
				// This task needs to update TWO settings.
				multiUpdate: true,
				updates: [
					{
						setting: 'aioseo_options',
						settingPath: JSON.stringify( [
							'searchAppearance',
							'advanced',
							'crawlCleanup',
							'feeds',
							'globalComments',
						] ),
						value: false,
					},
					{
						setting: 'aioseo_options',
						settingPath: JSON.stringify( [
							'searchAppearance',
							'advanced',
							'crawlCleanup',
							'feeds',
							'postComments',
						] ),
						value: false,
					},
				],
			},
		};

		const config = configs[ taskId ];
		if ( config ) {
			if ( config.multiUpdate && config.updates ) {
				// Handle multi-update case (e.g., Feed Comments).
				for ( const update of config.updates ) {
					await submitPluginSettings( {
						setting: update.setting,
						settingPath: update.settingPath,
						popoverId,
						value: update.value,
					} );
				}
			} else {
				await submitPluginSettings( {
					setting: config.setting,
					settingPath: config.settingPath,
					popoverId,
					settingCallbackValue: config.settingCallbackValue,
					value: config.settingCallbackValue(),
				} );
			}
		}

		if ( onSubmit ) {
			await onSubmit( task.id, task );
		}
	}, [ task, onSubmit ] );

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
				{ taskDescription && <p>{ taskDescription }</p> }
			</div>
			<div className="prpl-column">
				<form onSubmit={ handleSubmit }>
					<FormErrorMessage error={ error } />
					<div className="prpl-steps-nav-wrapper prpl-steps-nav-wrapper-align-left">
						<SubmitButton
							isLoading={ isLoading }
							label={ __( 'Submit', 'progress-planner' ) }
						/>
					</div>
				</form>
			</div>
		</InteractiveTaskPopover>
	);
}
