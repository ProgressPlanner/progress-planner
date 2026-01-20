/**
 * SettingsStep Component
 *
 * Step for configuring settings with 6 internal sub-steps:
 * homepage, about, contact, faq, post-types, login-destination
 *
 * @package
 */

import { useState, useEffect } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import { ajaxRequest } from '../../../utils/ajaxRequest';
import OnboardingStep from '../OnboardingStep';
import NextButton from '../NextButton';
import { CustomCheckbox, ToggleSwitch } from '../../FormInputs';

const SUB_STEPS = [ 'homepage', 'about', 'contact', 'faq', 'post-types' ];

/**
 * SettingsStep component.
 *
 * @param {Object} props - Component props.
 * @return {JSX.Element} Settings step component.
 */
export default function SettingsStep( props ) {
	const { wizardState, updateState, config } = props;
	const {
		ajaxUrl,
		nonce,
		pages = [],
		postTypes = [],
		pageTypes = {},
	} = config;

	const [ currentSubStep, setCurrentSubStep ] = useState( 0 );
	const [ settings, setSettings ] = useState( () => {
		// Default: hasPage: true means checkbox is unchecked (user has a page).
		// Default: all post types selected.
		const allPostTypeIds = postTypes.map( ( pt ) => pt.id );
		const defaults = {
			homepage: { hasPage: true, pageId: null },
			about: { hasPage: true, pageId: null },
			contact: { hasPage: true, pageId: null },
			faq: { hasPage: true, pageId: null },
			'post-types': { selectedTypes: allPostTypeIds },
		};
		// Merge with saved settings, but ensure hasPage defaults are respected.
		if ( wizardState.data.settings ) {
			return { ...defaults, ...wizardState.data.settings };
		}
		return defaults;
	} );

	const [ isSaving, setIsSaving ] = useState( false );

	// Update wizard state when settings change.
	useEffect( () => {
		updateState( {
			data: {
				...wizardState.data,
				settings,
			},
		} );
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ settings ] );

	/**
	 * Save current sub-step setting.
	 *
	 * @param {string} subStepName - Name of sub-step.
	 * @param {Object} subStepData - Data for sub-step.
	 */
	const saveSubStep = async ( subStepName, subStepData ) => {
		setIsSaving( true );
		try {
			// Save individual sub-step via AJAX if needed.
			// For now, we'll save all at once at the end.
			setSettings( ( prev ) => ( {
				...prev,
				[ subStepName ]: subStepData,
			} ) );
		} catch ( error ) {
			console.error( 'Failed to save setting:', error );
		} finally {
			setIsSaving( false );
		}
	};

	/**
	 * Save all settings at once.
	 */
	const saveAllSettings = async () => {
		setIsSaving( true );
		try {
			const pagesData = {};
			[ 'homepage', 'about', 'contact', 'faq' ].forEach( ( pageType ) => {
				if ( settings[ pageType ] ) {
					pagesData[ pageType ] = {
						id: settings[ pageType ].pageId || 0,
						have_page: settings[ pageType ].hasPage
							? 'yes'
							: 'not-applicable',
					};
				}
			} );

			await ajaxRequest( {
				url: ajaxUrl,
				data: {
					action: 'prpl_save_all_onboarding_settings',
					nonce,
					pages: JSON.stringify( pagesData ),
					'prpl-post-types-include':
						settings[ 'post-types' ]?.selectedTypes || [],
				},
			} );
		} catch ( error ) {
			console.error( 'Failed to save settings:', error );
		} finally {
			setIsSaving( false );
		}
	};

	/**
	 * Handle next sub-step.
	 */
	const handleNextSubStep = async () => {
		const subStepName = SUB_STEPS[ currentSubStep ];
		const subStepData = settings[ subStepName ];

		// Save current sub-step.
		await saveSubStep( subStepName, subStepData );

		// If last sub-step, save all settings and advance to next step.
		if ( currentSubStep === SUB_STEPS.length - 1 ) {
			await saveAllSettings();
			// Small delay to ensure settings are saved before advancing.
			setTimeout( () => {
				props.onNext();
			}, 100 );
		} else {
			setCurrentSubStep( currentSubStep + 1 );
		}
	};

	/**
	 * Render current sub-step.
	 *
	 * @return {JSX.Element} Current sub-step content.
	 */
	const renderSubStep = () => {
		const subStepName = SUB_STEPS[ currentSubStep ];
		const subStepData = settings[ subStepName ] || {};

		switch ( subStepName ) {
			case 'homepage':
			case 'about':
			case 'contact':
			case 'faq': {
				const pageType = pageTypes[ subStepName ] || {};
				let pageTitle = pageType.title;
				if ( ! pageTitle ) {
					if ( subStepName === 'homepage' ) {
						pageTitle = __( 'Home page', 'progress-planner' );
					} else if ( subStepName === 'about' ) {
						pageTitle = __( 'About page', 'progress-planner' );
					} else if ( subStepName === 'contact' ) {
						pageTitle = __( 'Contact page', 'progress-planner' );
					} else if ( subStepName === 'faq' ) {
						pageTitle = __( 'FAQ page', 'progress-planner' );
					} else {
						pageTitle = subStepName;
					}
				}
				const pageDescription =
					pageType.description ||
					__( 'Select a page', 'progress-planner' );

				return (
					<div
						className="prpl-setting-item"
						data-page={ subStepName }
					>
						<div className="prpl-columns-wrapper-flex prpl-columns-1-2">
							<div className="prpl-column">
								<div className="prpl-background-content">
									<p>{ pageDescription }</p>
								</div>
							</div>
							<div className="prpl-column">
								<div className="prpl-setting-header">
									<h3 className="prpl-setting-title">
										{ __(
											'Settings:',
											'progress-planner'
										) }{ ' ' }
										{ pageTitle }
										<span className="prpl-settings-progress">
											{ currentSubStep + 1 }/
											{ SUB_STEPS.length }
										</span>
									</h3>
								</div>
								<div className="prpl-setting-content">
									<div
										className={ `prpl-select-page${
											! subStepData.hasPage
												? ' prpl-disabled'
												: ''
										}` }
									>
										<select
											name={ `pages[${ subStepName }][id]` }
											value={ subStepData.pageId || '' }
											disabled={ ! subStepData.hasPage }
											onChange={ ( e ) =>
												setSettings( ( prev ) => ( {
													...prev,
													[ subStepName ]: {
														...prev[ subStepName ],
														pageId:
															parseInt(
																e.target.value,
																10
															) || null,
													},
												} ) )
											}
										>
											<option value="">
												{ __(
													'— Select page —',
													'progress-planner'
												) }
											</option>
											{ pages.map( ( page ) => (
												<option
													key={ page.id }
													value={ page.id }
												>
													{ page.title }
												</option>
											) ) }
										</select>
									</div>
									<div className="prpl-checkbox-wrapper">
										<CustomCheckbox
											id={ `prpl-no-${ subStepName }-page` }
											checked={ ! subStepData.hasPage }
											onChange={ ( e ) => {
												const noPage = e.target.checked;
												setSettings( ( prev ) => ( {
													...prev,
													[ subStepName ]: {
														...prev[ subStepName ],
														hasPage: ! noPage,
														// Reset pageId when checkbox is checked.
														pageId: noPage
															? null
															: prev[
																	subStepName
															  ]?.pageId,
													},
												} ) );
											} }
											label={ sprintf(
												/* translators: %s: page type title */
												__(
													"I don't have a %s yet",
													'progress-planner'
												),
												pageTitle
											) }
										/>
									</div>
								</div>
								<div className="prpl-setting-footer">
									{ /* Note shown when checkbox is checked */ }
									{ ! subStepData.hasPage &&
										pageType.note && (
											<div className="prpl-setting-note">
												<span className="prpl-setting-note-icon">
													<svg
														width="20"
														height="20"
														viewBox="0 0 20 20"
														fill="currentColor"
														xmlns="http://www.w3.org/2000/svg"
													>
														<path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm1 15H9v-6h2v6zm0-8H9V5h2v2z" />
													</svg>
												</span>
												<p>{ pageType.note }</p>
											</div>
										) }
									<button
										type="button"
										className={ `prpl-btn prpl-save-setting-btn${
											! canProceed()
												? ' prpl-btn-disabled'
												: ''
										}` }
										onClick={ handleNextSubStep }
										disabled={ ! canProceed() }
									>
										{ __(
											'Save setting',
											'progress-planner'
										) }
									</button>
								</div>
							</div>
						</div>
					</div>
				);
			}

			case 'post-types':
				return (
					<div className="prpl-setting-item" data-page="post-types">
						<div className="prpl-columns-wrapper-flex">
							<div className="prpl-column">
								<div className="prpl-background-content">
									<p>
										{ __(
											'Choose the post types you actively use for your content.',
											'progress-planner'
										) }
									</p>
								</div>
							</div>
							<div className="prpl-column">
								<div className="prpl-setting-header">
									<h3 className="prpl-setting-title">
										{ __(
											'Settings:',
											'progress-planner'
										) }{ ' ' }
										{ __(
											'Valuable post types',
											'progress-planner'
										) }
										<span className="prpl-settings-progress">
											{ currentSubStep + 1 }/
											{ SUB_STEPS.length }
										</span>
									</h3>
									<p>
										{ __(
											"We'll track and reward progress only on the ones you select.",
											'progress-planner'
										) }
									</p>
								</div>
								<div className="prpl-setting-content">
									<div className="prpl-settings-wrapper">
										<p>
											{ __(
												'Which post types do you want us to track?',
												'progress-planner'
											) }
										</p>
										<div id="prpl-post-types-include-wrapper">
											{ postTypes.map( ( postType ) => (
												<ToggleSwitch
													key={ postType.id }
													id={ `prpl-post-type-${ postType.id }` }
													name="prpl-post-types-include[]"
													value={ postType.id }
													checked={
														subStepData.selectedTypes?.includes(
															postType.id
														) || false
													}
													onChange={ ( e ) => {
														const isChecked =
															e.target.checked;
														setSettings(
															( prev ) => ( {
																...prev,
																'post-types': {
																	selectedTypes:
																		isChecked
																			? [
																					...( prev[
																						'post-types'
																					]
																						?.selectedTypes ||
																						[] ),
																					postType.id,
																			  ]
																			: (
																					prev[
																						'post-types'
																					]
																						?.selectedTypes ||
																					[]
																			  ).filter(
																					(
																						id
																					) =>
																						id !==
																						postType.id
																			  ),
																},
															} )
														);
													} }
													label={ postType.title }
												/>
											) ) }
										</div>
									</div>
								</div>
								<div className="prpl-setting-footer">
									<NextButton
										onNext={ handleNextSubStep }
										canProceed={ canProceed }
										wizardState={ wizardState }
										isLoading={ isSaving }
									/>
								</div>
							</div>
						</div>
					</div>
				);

			default:
				return null;
		}
	};

	/**
	 * Check if current sub-step can proceed.
	 * Page sub-steps require either a page selection OR checkbox checked.
	 * Post-types sub-step requires at least one post type selected.
	 *
	 * @return {boolean} True if can proceed.
	 */
	const canProceed = () => {
		if ( isSaving ) {
			return false;
		}

		const subStepName = SUB_STEPS[ currentSubStep ];
		const subStepData = settings[ subStepName ] || {};

		// For page selection sub-steps.
		if (
			[ 'homepage', 'about', 'contact', 'faq' ].includes( subStepName )
		) {
			// Can proceed if checkbox is checked (no page) OR a page is selected.
			return ! subStepData.hasPage || !! subStepData.pageId;
		}

		// For post-types, require at least one selected.
		if ( subStepName === 'post-types' ) {
			return (
				subStepData.selectedTypes &&
				subStepData.selectedTypes.length > 0
			);
		}

		return true;
	};

	return (
		<OnboardingStep { ...props } hideFooter>
			<div className="tour-content">{ renderSubStep() }</div>
		</OnboardingStep>
	);
}
