/**
 * Timezone Popover Component.
 *
 * Allows users to select the site timezone.
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
import { useApiData } from '../../hooks/useApiData';
import { submitSiteSettings } from '../../hooks/usePopoverForms';

export default function TimezonePopover( { task, onSubmit, onClose } ) {
	const [ value, setValue ] = useState( '' );
	const { settings } = useWpSettings( [ 'timezone_string' ] );
	const { data: timezoneOptions, isLoading: isFetchingOptions } = useApiData(
		'/progress-planner/v1/timezone-options'
	);

	// Seed local state from fetched settings.
	useEffect( () => {
		if ( settings.timezone_string ) {
			setValue( settings.timezone_string );
		}
	}, [ settings.timezone_string ] );

	const { isLoading, error, handleSubmit } = usePopoverSubmit( async () => {
		if ( ! value ) {
			return;
		}

		const popoverId = `prpl-popover-${ task.slug || task.id }`;
		await submitSiteSettings( {
			settingAPIKey: 'timezone_string',
			setting: 'timezone_string',
			popoverId,
			settingCallbackValue: () => value,
			value,
		} );

		if ( onSubmit ) {
			await onSubmit( task.id, task );
		}
	}, [ value, task, onSubmit ] );

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
				<p>
					{ __(
						"Setting the time zone correctly on your site is valuable. By setting the correct time zone, you ensure scheduled tasks happen exactly when you want them to happen. To correctly account for daylight savings', we recommend you use the city-based time zone instead of the UTC offset (e.g. Amsterdam or London).",
						'progress-planner'
					) }
				</p>
			</div>
			<div className="prpl-column">
				<form onSubmit={ handleSubmit }>
					<label htmlFor="timezone">
						<select
							id="timezone"
							name="timezone"
							value={ value }
							onChange={ ( e ) => setValue( e.target.value ) }
							disabled={ isLoading || isFetchingOptions }
						>
							{ isFetchingOptions ? (
								<option value="">
									{ __( 'Loading…', 'progress-planner' ) }
								</option>
							) : (
								( Array.isArray( timezoneOptions )
									? timezoneOptions
									: []
								).map( ( option ) => (
									<option
										key={ option.value }
										value={ option.value }
									>
										{ option.label }
									</option>
								) )
							) }
						</select>
					</label>
					<FormErrorMessage error={ error } />
					<div className="prpl-steps-nav-wrapper prpl-steps-nav-wrapper-align-left">
						<SubmitButton
							isLoading={ isLoading }
							disabled={ ! value || isFetchingOptions }
							label={ __(
								'Set site timezone',
								'progress-planner'
							) }
						/>
					</div>
				</form>
			</div>
		</InteractiveTaskPopover>
	);
}
