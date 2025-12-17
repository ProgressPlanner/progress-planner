/**
 * Dashboard Component
 *
 * Main dashboard component that conditionally renders Welcome/Onboarding
 * or the main dashboard with header and widgets.
 */

import { Fragment, useRef, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { useDashboardStore } from '../../stores/dashboardStore';
import DashboardHeader from './DashboardHeader';
import DashboardWidgets from './DashboardWidgets';
import OnboardingWizard from '../OnboardingWizard';

/**
 * Style constants - extracted to prevent recreation on each render.
 */
const STYLES = {
	skipLink: {
		position: 'absolute',
		top: '-40px',
		left: 0,
		background: 'var(--prpl-color-button-primary)',
		color: 'var(--prpl-color-button-primary-text)',
		padding: '8px 16px',
		textDecoration: 'none',
		borderRadius: 'var(--prpl-border-radius)',
		zIndex: 100000,
	},
	widgetsContainer: {
		display: 'grid',
		gridTemplateColumns:
			'repeat(auto-fit, minmax(var(--prpl-column-min-width), 1fr))',
		columnGap: 'var(--prpl-gap)',
		gridAutoRows: 'var(--prpl-gap)',
		gridAutoFlow: 'dense',
	},
};

/**
 * Dashboard component.
 *
 * @param {Object} props        - Component props.
 * @param {Object} props.config - Dashboard configuration from PHP.
 * @return {JSX.Element} The Dashboard component.
 */
export default function Dashboard( { config } ) {
	const { privacyPolicyAccepted = false } = config;
	const wizardRef = useRef( null );
	const setShouldAutoStartWizard = useDashboardStore(
		( state ) => state.setShouldAutoStartWizard
	);

	// Set auto-start flag when privacy is not accepted (like develop branch)
	useEffect( () => {
		// Check if there's saved progress (resuming)
		const hasSavedProgress =
			config.onboardingWizard?.savedProgress &&
			Object.keys( config.onboardingWizard.savedProgress ).length > 0;

		// Auto-start if:
		// 1. Privacy not accepted (fresh install)
		// 2. There's saved progress (resuming)
		if ( ! privacyPolicyAccepted || hasSavedProgress ) {
			setShouldAutoStartWizard( true );
		}
	}, [ privacyPolicyAccepted, config.onboardingWizard?.savedProgress, setShouldAutoStartWizard ] );

	/**
	 * Handle start onboarding button click.
	 */
	const handleStartOnboarding = () => {
		if (
			wizardRef.current &&
			typeof wizardRef.current.startOnboarding === 'function'
		) {
			wizardRef.current.startOnboarding();
		}
	};

	// Show start button when privacy not accepted (like develop branch)
	if ( ! privacyPolicyAccepted ) {
		return (
			<Fragment>
				<div className="prpl-start-onboarding-container">
					<div className="prpl-start-onboarding-graphic">
						<img
							src={ `${
								config.baseUrl || ''
							}/assets/images/onboarding/thumbs_up_ravi_rtl.svg` }
							alt=""
							style={ {
								maxWidth: '100%',
								height: 'auto',
							} }
						/>
					</div>
					<button
						className="prpl-button-primary"
						id="prpl-start-onboarding-button"
						onClick={ handleStartOnboarding }
					>
						{ __(
							'Are you ready to work on your site?',
							'progress-planner'
						) }
					</button>
				</div>
				<OnboardingWizard config={ config } ref={ wizardRef } />
			</Fragment>
		);
	}

	// Show main dashboard (Zustand store provides cross-widget state)
	return (
		<Fragment>
			<a
				href="#prpl-main-content"
				className="screen-reader-text prpl-skip-link"
				style={ STYLES.skipLink }
				onFocus={ ( e ) => {
					e.target.style.top = '10px';
					e.target.style.left = '10px';
				} }
				onBlur={ ( e ) => {
					e.target.style.top = '-40px';
					e.target.style.left = '0';
				} }
			>
				{ __( 'Skip to main content', 'progress-planner' ) }
			</a>
			<h1 className="screen-reader-text">
				{ __( 'Progress Planner', 'progress-planner' ) }
			</h1>
			<DashboardHeader config={ config } />
			<div
				id="prpl-main-content"
				className="prpl-widgets-container"
				style={ STYLES.widgetsContainer }
			>
				<DashboardWidgets />
			</div>
			<OnboardingWizard config={ config } ref={ wizardRef } />
		</Fragment>
	);
}
