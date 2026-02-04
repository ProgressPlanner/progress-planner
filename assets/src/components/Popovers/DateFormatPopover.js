/**
 * Date Format Popover Component.
 *
 * Allows users to select a date format with live preview.
 *
 * @param {Object}   props          Component props.
 * @param {Object}   props.task     The task object.
 * @param {Function} props.onSubmit Callback when form is submitted.
 * @param {Function} props.onClose  Callback when popover is closed.
 * @param {Object}   props.config   Widget configuration.
 * @return {JSX.Element} The popover component.
 */

import { useState, useEffect, useCallback, useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { decodeEntities } from '@wordpress/html-entities';
import InteractiveTaskPopover from './InteractiveTaskPopover';
import FormErrorMessage from './FormErrorMessage';
import SubmitButton from './SubmitButton';
import { usePopoverSubmit } from '../../hooks/usePopoverSubmit';
import { useWpSettings } from '../../hooks/useWpSettings';
import { getAjaxUrl, getNonce } from '../../config/dashboardConfig';
import { submitSiteSettings } from '../../hooks/usePopoverForms';

export default function DateFormatPopover( { task, onSubmit, onClose } ) {
	const [ selectedFormat, setSelectedFormat ] = useState( '' );
	const [ customFormat, setCustomFormat ] = useState( '' );
	const [ preview, setPreview ] = useState( '' );
	const [ dateFormats, setDateFormats ] = useState( [] );
	const [ isFetchingFormats, setIsFetchingFormats ] = useState( true );
	const debounceTimeoutRef = useRef( null );
	const { settings } = useWpSettings( [ 'date_format' ] );

	// Seed local state from fetched settings.
	useEffect( () => {
		if ( settings.date_format ) {
			const currentFormat = settings.date_format;
			setSelectedFormat( currentFormat );
			setCustomFormat( currentFormat );
			updatePreview( currentFormat );
		}
	}, [ settings.date_format, updatePreview ] );

	// Fetch date formats via AJAX on mount.
	useEffect( () => {
		const ajaxUrl = getAjaxUrl();
		const nonce = getNonce();

		fetch(
			`${ ajaxUrl }?action=prpl_get_date_formats&_ajax_nonce=${ nonce }`,
			{ credentials: 'same-origin' }
		)
			.then( ( response ) => response.json() )
			.then( ( data ) => {
				if ( data.success && data.data ) {
					setDateFormats( data.data );
				} else {
					// Fallback formats
					setDateFormats( [
						'F j, Y',
						'Y-m-d',
						'm/d/Y',
						'd/m/Y',
						'd.m.Y',
					] );
				}
			} )
			.catch( () => {
				// Fallback formats
				setDateFormats( [
					'F j, Y',
					'Y-m-d',
					'm/d/Y',
					'd/m/Y',
					'd.m.Y',
				] );
			} )
			.finally( () => {
				setIsFetchingFormats( false );
			} );
	}, [] );

	/**
	 * Update preview via AJAX.
	 */
	const updatePreview = useCallback( ( format ) => {
		if ( ! format ) {
			return;
		}

		clearTimeout( debounceTimeoutRef.current );

		debounceTimeoutRef.current = setTimeout( async () => {
			const ajaxUrl = getAjaxUrl();
			const nonce = getNonce();

			try {
				const response = await fetch(
					`${ ajaxUrl }?action=prpl_date_format_preview&format=${ encodeURIComponent(
						format
					) }&_ajax_nonce=${ nonce }`,
					{ credentials: 'same-origin' }
				);
				const data = await response.json();
				if ( data.success && data.data ) {
					setPreview( data.data );
				}
			} catch {
				// Preview update failed, ignore
			}
		}, 300 );
	}, [] );

	/**
	 * Handle radio button change.
	 */
	const handleRadioChange = useCallback(
		( format ) => {
			if ( format === 'custom' ) {
				setSelectedFormat( 'custom' );
			} else {
				setSelectedFormat( format );
				updatePreview( format );
			}
		},
		[ updatePreview ]
	);

	/**
	 * Handle custom input change.
	 */
	const handleCustomInputChange = useCallback(
		( e ) => {
			const value = e.target.value;
			setCustomFormat( value );
			if ( selectedFormat === 'custom' ) {
				updatePreview( value );
			}
		},
		[ selectedFormat, updatePreview ]
	);

	const { isLoading, error, handleSubmit } = usePopoverSubmit( async () => {
		const formatToSubmit =
			selectedFormat === 'custom' ? customFormat : selectedFormat;

		if ( ! formatToSubmit ) {
			return;
		}

		const popoverId = `prpl-popover-${ task.slug || task.id }`;
		await submitSiteSettings( {
			settingAPIKey: 'date_format',
			setting: 'date_format',
			popoverId,
			settingCallbackValue: () => formatToSubmit,
			value: formatToSubmit,
		} );

		if ( onSubmit ) {
			await onSubmit( task.id, task );
		}
	}, [ selectedFormat, customFormat, task, onSubmit ] );

	/**
	 * Cleanup debounce timeout.
	 */
	useEffect( () => {
		return () => {
			if ( debounceTimeoutRef.current ) {
				clearTimeout( debounceTimeoutRef.current );
			}
		};
	}, [] );

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
						'Choosing the right date format helps your visitors instantly understand when something was published without confusion or guessing. It also makes your site feel more familiar and trustworthy, especially if your audience is local.',
						'progress-planner'
					) }
				</p>
				<p>
					{ __(
						'By setting the correct format, you make sure dates show up clearly both in your dashboard and on your live site.',
						'progress-planner'
					) }
				</p>
				<p>
					{ __(
						'Tip: Pick the format that matches what your audience expects.',
						'progress-planner'
					) }
				</p>
			</div>
			<div className="prpl-column">
				<form onSubmit={ handleSubmit }>
					<div className="radios">
						<fieldset>
							{ isFetchingFormats ? (
								<p>
									{ __(
										'Loading formats…',
										'progress-planner'
									) }
								</p>
							) : (
								<>
									{ dateFormats.map( ( format ) => {
										const isChecked =
											selectedFormat === format;
										return (
											<div
												key={ format }
												className="prpl-radio-wrapper"
											>
												<label
													className="prpl-custom-radio"
													htmlFor={ `date_format_${ format }` }
												>
													<input
														type="radio"
														id={ `date_format_${ format }` }
														name="date_format"
														value={ format }
														checked={ isChecked }
														onChange={ () =>
															handleRadioChange(
																format
															)
														}
														disabled={ isLoading }
													/>
													<span className="prpl-custom-control"></span>
													<span className="date-time-text format-i18n">
														{ preview || format }
													</span>
													<code>{ format }</code>
												</label>
											</div>
										);
									} ) }

									{ /* Custom date format */ }
									<div className="prpl-radio-wrapper">
										<label
											className="prpl-custom-radio"
											htmlFor="date_format_custom_radio"
										>
											<input
												type="radio"
												name="date_format"
												id="date_format_custom_radio"
												value="custom"
												checked={
													selectedFormat === 'custom'
												}
												onChange={ () =>
													handleRadioChange(
														'custom'
													)
												}
												disabled={ isLoading }
											/>
											<span className="prpl-custom-control"></span>
											<span className="date-time-text date-time-custom-text">
												{ __(
													'Custom:',
													'progress-planner'
												) }{ ' ' }
												<span className="screen-reader-text">
													{ __(
														'enter a custom date format in the following field',
														'progress-planner'
													) }
												</span>
											</span>
										</label>
										<label
											htmlFor="date_format_custom"
											className="screen-reader-text"
										>
											{ __(
												'Custom date format:',
												'progress-planner'
											) }
										</label>
										<input
											type="text"
											name="date_format_custom"
											id="date_format_custom"
											value={ customFormat }
											onChange={ handleCustomInputChange }
											className="small-text"
											disabled={
												isLoading ||
												selectedFormat !== 'custom'
											}
										/>
									</div>
									<label htmlFor="date_format_custom">
										<span className="screen-reader-text">
											{ __(
												'Custom date format:',
												'progress-planner'
											) }
										</span>
										<input
											type="text"
											id="date_format_custom"
											name="date_format_custom"
											value={ customFormat }
											onChange={ handleCustomInputChange }
											className="small-text"
											disabled={
												isLoading ||
												selectedFormat !== 'custom'
											}
										/>
									</label>

									{ /* Preview */ }
									<p>
										<strong>
											{ __(
												'Preview:',
												'progress-planner'
											) }
										</strong>{ ' ' }
										<span className="example">
											{ preview }
										</span>
										{ isLoading && (
											<span className="spinner"></span>
										) }
									</p>
								</>
							) }
						</fieldset>
					</div>
					<FormErrorMessage error={ error } />
					<div className="prpl-steps-nav-wrapper prpl-steps-nav-wrapper-align-left">
						<SubmitButton
							isLoading={ isLoading }
							disabled={ ! selectedFormat }
							label={ __(
								'Set date format',
								'progress-planner'
							) }
						/>
					</div>
				</form>
			</div>
		</InteractiveTaskPopover>
	);
}
