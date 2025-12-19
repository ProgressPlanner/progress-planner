/**
 * Locale Popover Component.
 *
 * Allows users to select the site locale.
 *
 * @param {Object}   props          Component props.
 * @param {Object}   props.task     The task object.
 * @param {Function} props.onSubmit Callback when form is submitted.
 * @param {Function} props.onClose  Callback when popover is closed.
 * @return {JSX.Element} The popover component.
 */

import { useState, useEffect, useCallback, useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import InteractiveTaskPopover from './InteractiveTaskPopover';
import { submitSiteSettings } from '../../hooks/usePopoverForms';

export default function LocalePopover( { task, onSubmit, onClose } ) {
	const [ value, setValue ] = useState( '' );
	const localeSelectRef = useRef( null );
	const [ isLoading, setIsLoading ] = useState( false );
	const [ isFetchingOptions, setIsFetchingOptions ] = useState( true );
	const [ error, setError ] = useState( null );

	/**
	 * Load current locale and options on mount.
	 */
	useEffect( () => {
		// Fetch current settings
		apiFetch( { path: '/wp/v2/settings' } )
			.then( ( settings ) => {
				const locale = settings.WPLANG || '';
				setValue( locale );
			} )
			.catch( () => {
				// Ignore errors
			} );

		// Fetch locale options HTML via AJAX
		const ajaxUrl =
			window.progressPlanner?.ajaxUrl || '/wp-admin/admin-ajax.php';
		const nonce = window.progressPlanner?.nonce || '';

		fetch(
			`${ ajaxUrl }?action=prpl_get_locale_options&_ajax_nonce=${ nonce }`,
			{ credentials: 'same-origin' }
		)
			.then( ( response ) => response.json() )
			.then( ( data ) => {
				if ( data.success && data.data && localeSelectRef.current ) {
					localeSelectRef.current.innerHTML = data.data;
					// Set the value after options are loaded
					if ( value ) {
						localeSelectRef.current.value = value;
					}
				}
			} )
			.catch( () => {
				// Fallback
				if ( localeSelectRef.current ) {
					localeSelectRef.current.innerHTML =
						'<option value="">' +
						__( 'Select locale', 'progress-planner' ) +
						'</option>';
				}
			} )
			.finally( () => {
				setIsFetchingOptions( false );
			} );
	}, [ value ] );

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
					settingAPIKey: 'WPLANG',
					setting: 'WPLANG',
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

	const taskTitle = task.title?.rendered || task.title;

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
						'Select your site locale to ensure your site is displayed correctly in the correct language',
						'progress-planner'
					) }
				</p>
			</div>
			<div className="prpl-column">
				<form onSubmit={ handleSubmit }>
					<label htmlFor="language">
						<select
							id="language"
							name="language"
							ref={ localeSelectRef }
							value={ value }
							onChange={ ( e ) => setValue( e.target.value ) }
							disabled={ isLoading || isFetchingOptions }
						>
							{ isFetchingOptions && (
								<option value="">
									{ __( 'Loading…', 'progress-planner' ) }
								</option>
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
								__( 'Select locale', 'progress-planner' )
							) }
						</button>
					</div>
				</form>
			</div>
		</InteractiveTaskPopover>
	);
}
