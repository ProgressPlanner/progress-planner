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

import { useState, useEffect, useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { decodeEntities } from '@wordpress/html-entities';
import InteractiveTaskPopover from './InteractiveTaskPopover';
import FormErrorMessage from './FormErrorMessage';
import SubmitButton from './SubmitButton';
import { usePopoverSubmit } from '../../hooks/usePopoverSubmit';
import { useWpSettings } from '../../hooks/useWpSettings';
import { getAjaxUrl, getNonce } from '../../config/dashboardConfig';
import { submitSiteSettings } from '../../hooks/usePopoverForms';

export default function LocalePopover( { task, onSubmit, onClose } ) {
	const [ value, setValue ] = useState( '' );
	const localeSelectRef = useRef( null );
	const [ isFetchingOptions, setIsFetchingOptions ] = useState( true );
	const { settings } = useWpSettings( [ 'WPLANG' ] );

	// Seed local state from fetched settings.
	useEffect( () => {
		if ( settings.WPLANG !== undefined ) {
			setValue( settings.WPLANG );
		}
	}, [ settings.WPLANG ] );

	// Fetch locale options HTML via AJAX.
	useEffect( () => {
		const ajaxUrl = getAjaxUrl();
		const nonce = getNonce();

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

	const { isLoading, error, handleSubmit } = usePopoverSubmit( async () => {
		if ( ! value ) {
			return;
		}

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
					<FormErrorMessage error={ error } />
					<div className="prpl-steps-nav-wrapper prpl-steps-nav-wrapper-align-left">
						<SubmitButton
							isLoading={ isLoading }
							disabled={ ! value || isFetchingOptions }
							label={ __( 'Select locale', 'progress-planner' ) }
						/>
					</div>
				</form>
			</div>
		</InteractiveTaskPopover>
	);
}
