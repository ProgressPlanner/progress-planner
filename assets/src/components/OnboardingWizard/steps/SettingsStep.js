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

const SUB_STEPS = [
	'homepage',
	'about',
	'contact',
	'faq',
	'post-types',
	'login-destination',
];

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
		return (
			wizardState.data.settings || {
				homepage: { hasPage: true, pageId: null },
				about: { hasPage: true, pageId: null },
				contact: { hasPage: true, pageId: null },
				faq: { hasPage: true, pageId: null },
				'post-types': { selectedTypes: [] },
				'login-destination': { redirectOnLogin: false },
			}
		);
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
					'prpl-redirect-on-login': settings[ 'login-destination' ]
						?.redirectOnLogin
						? '1'
						: '',
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
									<div className="prpl-select-page">
										<select
											name={ `pages[${ subStepName }][id]` }
											value={ subStepData.pageId || '' }
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
										<label htmlFor={ `prpl-no-${ subStepName }-page` }>
											<input
												type="checkbox"
												id={ `prpl-no-${ subStepName }-page` }
												checked={
													! subStepData.hasPage
												}
												onChange={ ( e ) =>
													setSettings( ( prev ) => ( {
														...prev,
														[ subStepName ]: {
															...prev[
																subStepName
															],
															hasPage:
																! e.target
																	.checked,
														},
													} ) )
												}
											/>
											{ sprintf(
												/* translators: %s: page type title */
												__(
													"I don't have a %s yet",
													'progress-planner'
												),
												pageTitle
											) }
										</label>
									</div>
								</div>
							</div>
						</div>
					</div>
				);
			}

			case 'post-types':
				return (
					<div className="prpl-setting-item" data-page="post-types">
						<h3>
							{ __( 'Post Types', 'progress-planner' ) }
							<span className="prpl-settings-progress">
								{ currentSubStep + 1 }/{ SUB_STEPS.length }
							</span>
						</h3>
						<p>
							{ __(
								'Select which post types to include in your activity tracking.',
								'progress-planner'
							) }
						</p>
						<div className="prpl-post-types-selection">
							{ postTypes.map( ( postType ) => (
								<label
									key={ postType.id }
									htmlFor={ `prpl-post-type-${ postType.id }` }
									style={ {
										display: 'block',
										marginBottom: '0.5rem',
									} }
								>
									<input
										type="checkbox"
										id={ `prpl-post-type-${ postType.id }` }
										value={ postType.id }
										checked={
											subStepData.selectedTypes?.includes(
												postType.id
											) || false
										}
										onChange={ ( e ) => {
											const isChecked = e.target.checked;
											setSettings( ( prev ) => ( {
												...prev,
												'post-types': {
													selectedTypes: isChecked
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
																( id ) =>
																	id !==
																	postType.id
														  ),
												},
											} ) );
										} }
									/>{ ' ' }
									{ postType.title }
								</label>
							) ) }
						</div>
					</div>
				);

			case 'login-destination':
				return (
					<div
						className="prpl-setting-item"
						data-page="login-destination"
					>
						<h3>
							{ __( 'Login Destination', 'progress-planner' ) }
							<span className="prpl-settings-progress">
								{ currentSubStep + 1 }/{ SUB_STEPS.length }
							</span>
						</h3>
						<label htmlFor="prpl-redirect-on-login">
							<input
								type="checkbox"
								id="prpl-redirect-on-login"
								checked={ subStepData.redirectOnLogin || false }
								onChange={ ( e ) =>
									setSettings( ( prev ) => ( {
										...prev,
										'login-destination': {
											redirectOnLogin: e.target.checked,
										},
									} ) )
								}
							/>
							{ __(
								'Redirect to Progress Planner on login',
								'progress-planner'
							) }
						</label>
					</div>
				);

			default:
				return null;
		}
	};

	return (
		<OnboardingStep { ...props } canProceed={ () => true }>
			<div className="tour-content">
				{ renderSubStep() }
				{ currentSubStep < SUB_STEPS.length - 1 && (
					<button
						type="button"
						className="prpl-btn prpl-btn-primary"
						onClick={ handleNextSubStep }
						disabled={ isSaving }
					>
						{ isSaving
							? __( 'Saving…', 'progress-planner' )
							: __( 'Save & Continue', 'progress-planner' ) }
					</button>
				) }
			</div>
		</OnboardingStep>
	);
}
