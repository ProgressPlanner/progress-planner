/**
 * Permalink Structure Popover Component.
 *
 * Allows users to select a permalink structure.
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

export default function PermalinkStructurePopover( {
	task,
	onSubmit,
	onClose,
} ) {
	const [ selectedStructure, setSelectedStructure ] = useState( '' );
	const [ customStructure, setCustomStructure ] = useState( '' );
	const [ structures, setStructures ] = useState( [] );
	const [ isLoading, setIsLoading ] = useState( false );
	const [ isFetchingStructures, setIsFetchingStructures ] = useState( true );
	const [ error, setError ] = useState( null );

	/**
	 * Load current permalink structure and available structures on mount.
	 */
	useEffect( () => {
		// Fetch current settings
		apiFetch( { path: '/wp/v2/settings' } )
			.then( ( settings ) => {
				const currentStructure = settings.permalink_structure || '';
				setSelectedStructure( currentStructure );
				setCustomStructure( currentStructure );
			} )
			.catch( () => {
				// Ignore errors
			} );

		// Fetch structures via AJAX
		const ajaxUrl =
			window.progressPlanner?.ajaxUrl || '/wp-admin/admin-ajax.php';
		const nonce = window.progressPlanner?.nonce || '';

		fetch(
			`${ ajaxUrl }?action=prpl_get_permalink_structures&_ajax_nonce=${ nonce }`,
			{ credentials: 'same-origin' }
		)
			.then( ( response ) => response.json() )
			.then( ( data ) => {
				if ( data.success && data.data ) {
					setStructures( data.data );
				}
			} )
			.catch( () => {
				// Fallback structures
				setStructures( [] );
			} )
			.finally( () => {
				setIsFetchingStructures( false );
			} );
	}, [] );

	/**
	 * Handle radio button change.
	 */
	const handleRadioChange = useCallback( ( structure ) => {
		if ( structure === 'custom' ) {
			setSelectedStructure( 'custom' );
		} else {
			setSelectedStructure( structure );
		}
	}, [] );

	/**
	 * Handle form submission.
	 */
	const handleSubmit = useCallback(
		async ( e ) => {
			e.preventDefault();

			const structureToSubmit =
				selectedStructure === 'custom'
					? customStructure
					: selectedStructure;

			if ( ! structureToSubmit ) {
				return;
			}

			setIsLoading( true );
			setError( null );

			try {
				const popoverId = `prpl-popover-${ task.slug || task.id }`;
				await submitSiteSettings( {
					settingAPIKey: 'permalink_structure',
					setting: 'permalink_structure',
					popoverId,
					settingCallbackValue: () => structureToSubmit,
					value: structureToSubmit,
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
		[ selectedStructure, customStructure, task, onSubmit ]
	);

	const taskTitle = decodeEntities( task.title?.rendered || task.title );
	const defaultStructures =
		structures.length > 0
			? structures
			: [
					{
						id: 'day-name',
						value: '/%year%/%monthnum%/%day%/%postname%/',
						label: __( 'Day and name', 'progress-planner' ),
					},
					{
						id: 'month-name',
						value: '/%year%/%monthnum%/%postname%/',
						label: __( 'Month and name', 'progress-planner' ),
					},
					{
						id: 'numeric',
						value: '/archives/%post_id%',
						label: __( 'Numeric', 'progress-planner' ),
					},
					{
						id: 'post-name',
						value: '/%postname%/',
						label: __( 'Post name', 'progress-planner' ),
					},
			  ];

	return (
		<InteractiveTaskPopover
			isOpen={ true }
			taskId={ task.slug || task.id }
			task={ task }
			onClose={ onClose }
		>
			<div className="prpl-column prpl-column-content">
				<h2 className="prpl-popover-title">{ taskTitle }</h2>
			</div>
			<div className="prpl-column">
				<form onSubmit={ handleSubmit }>
					<div className="radios">
						<fieldset className="prpl-structure-selection">
							{ isFetchingStructures ? (
								<p>
									{ __(
										'Loading structures…',
										'progress-planner'
									) }
								</p>
							) : (
								<>
									{ defaultStructures.map( ( structure ) => {
										const isChecked =
											selectedStructure ===
											structure.value;
										return (
											<div
												key={ structure.id }
												className="prpl-radio-wrapper"
											>
												<label
													className="prpl-custom-radio"
													htmlFor={ `prpl-permalink-input-${ structure.id }` }
													aria-label={
														structure.label
													}
												>
													<input
														id={ `prpl-permalink-input-${ structure.id }` }
														name="prpl_permalink_structure"
														type="radio"
														value={
															structure.value
														}
														checked={ isChecked }
														onChange={ () =>
															handleRadioChange(
																structure.value
															)
														}
														disabled={ isLoading }
													/>
													<span className="prpl-custom-control"></span>
													<div>
														<span>
															{ structure.label }
														</span>
														<code
															style={ {
																display:
																	'block',
															} }
														>
															{ structure.value }
														</code>
													</div>
												</label>
											</div>
										);
									} ) }

									{ /* Custom permalink structure */ }
									<div className="prpl-radio-wrapper">
										<label
											className="prpl-custom-radio"
											htmlFor="prpl_permalink_structure_custom_radio"
										>
											<input
												id="prpl_permalink_structure_custom_radio"
												name="prpl_permalink_structure"
												type="radio"
												value="custom"
												checked={
													selectedStructure ===
													'custom'
												}
												onChange={ () =>
													handleRadioChange(
														'custom'
													)
												}
												disabled={ isLoading }
											/>
											<span className="prpl-custom-control"></span>
											<span>
												{ __(
													'Custom:',
													'progress-planner'
												) }{ ' ' }
												<span className="screen-reader-text">
													{ __(
														'enter a custom permalink structure in the following field',
														'progress-planner'
													) }
												</span>
											</span>
										</label>
									</div>
									<label htmlFor="prpl_custom_permalink_structure">
										<span className="screen-reader-text">
											{ __(
												'Custom permalink structure:',
												'progress-planner'
											) }
										</span>
										<div
											style={ {
												display: 'flex',
												gap: '0.5rem',
												alignItems: 'center',
											} }
										>
											<code
												style={ {
													display: 'flex',
													alignItems: 'center',
													height: '1.25rem',
												} }
											>
												{ window.location.origin }
											</code>
											<input
												type="text"
												name="prpl_custom_permalink_structure"
												id="prpl_custom_permalink_structure"
												value={ customStructure }
												onChange={ ( e ) =>
													setCustomStructure(
														e.target.value
													)
												}
												className="small-text"
												disabled={
													isLoading ||
													selectedStructure !==
														'custom'
												}
											/>
										</div>
									</label>
								</>
							) }
						</fieldset>
					</div>
					{ error && (
						<p className="prpl-note prpl-note-error prpl-interactive-task-error-message">
							{ error }
						</p>
					) }
					<div className="prpl-steps-nav-wrapper prpl-steps-nav-wrapper-align-left">
						<button
							type="submit"
							className="prpl-button prpl-button-primary"
							disabled={ isLoading || ! selectedStructure }
						>
							{ isLoading ? (
								<span
									className="spinner"
									style={ { visibility: 'visible' } }
								></span>
							) : (
								__(
									'Set permalink structure',
									'progress-planner'
								)
							) }
						</button>
					</div>
				</form>
			</div>
		</InteractiveTaskPopover>
	);
}
