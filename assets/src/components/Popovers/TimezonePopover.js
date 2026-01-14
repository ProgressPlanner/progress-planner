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

import { useState, useEffect, useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { decodeEntities } from '@wordpress/html-entities';
import apiFetch from '@wordpress/api-fetch';
import InteractiveTaskPopover from './InteractiveTaskPopover';
import { submitSiteSettings } from '../../hooks/usePopoverForms';

export default function TimezonePopover( { task, onSubmit, onClose } ) {
	const [ value, setValue ] = useState( '' );
	const [ timezoneOptions, setTimezoneOptions ] = useState( [] );
	const [ isLoading, setIsLoading ] = useState( false );
	const [ isFetchingOptions, setIsFetchingOptions ] = useState( true );
	const [ error, setError ] = useState( null );

	/**
	 * Load current timezone and options on mount.
	 */
	useEffect( () => {
		// Fetch current settings
		apiFetch( { path: '/wp/v2/settings' } )
			.then( ( settings ) => {
				const tzstring = settings.timezone_string || '';
				setValue( tzstring );
			} )
			.catch( () => {
				// Ignore errors
			} );

		// Fetch timezone options via REST API
		apiFetch( { path: '/progress-planner/v1/timezone-options' } )
			.then( ( options ) => {
				if ( Array.isArray( options ) ) {
					setTimezoneOptions( options );
				}
			} )
			.catch( () => {
				// On error, set empty array (will show empty select)
				setTimezoneOptions( [] );
			} )
			.finally( () => {
				setIsFetchingOptions( false );
			} );
	}, [] );

	/**
	 * Handle form submission.
	 */
	const handleSubmit = useCallback(
		async ( e ) => {
			e.preventDefault();

			if ( ! value ) {
				return;
			}

			setIsLoading( true );
			setError( null );

			try {
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
								timezoneOptions.map( ( option ) => (
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
					{ error && (
						<p className="prpl-note prpl-note-error prpl-interactive-task-error-message">
							{ error }
						</p>
					) }
					<div className="prpl-steps-nav-wrapper prpl-steps-nav-wrapper-align-left">
						<button
							type="submit"
							className="prpl-button prpl-button-primary"
							disabled={
								isLoading || ! value || isFetchingOptions
							}
						>
							{ isLoading ? (
								<span
									className="spinner"
									style={ { visibility: 'visible' } }
								></span>
							) : (
								__( 'Set site timezone', 'progress-planner' )
							) }
						</button>
					</div>
				</form>
			</div>
		</InteractiveTaskPopover>
	);
}
