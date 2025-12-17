/**
 * EmailFrequencyStep Component
 *
 * Step for configuring email frequency preferences.
 *
 * @package
 */

import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import OnboardingStep from '../OnboardingStep';

/**
 * EmailFrequencyStep component.
 *
 * @param {Object} props - Component props.
 * @return {JSX.Element} EmailFrequency step component.
 */
export default function EmailFrequencyStep( props ) {
	const { wizardState, updateState, config } = props;
	const { userFirstName = '', userEmail = '' } = config;

	const [ emailFrequency, setEmailFrequency ] = useState(
		wizardState.data.emailFrequency || {
			choice: 'weekly',
			name: userFirstName,
			email: userEmail,
		}
	);

	// Update wizard state when email frequency changes.
	useEffect( () => {
		updateState( {
			data: {
				...wizardState.data,
				emailFrequency,
			},
		} );
	}, [ emailFrequency ] );

	/**
	 * Check if can proceed.
	 *
	 * @return {boolean} True if can proceed.
	 */
	const canProceed = () => {
		if ( ! emailFrequency.choice ) {
			return false;
		}

		// If user chose "don't email", they can proceed immediately.
		if ( emailFrequency.choice === 'none' ) {
			return true;
		}

		// If user chose "weekly", check that name and email are filled.
		if ( emailFrequency.choice === 'weekly' ) {
			return !! ( emailFrequency.name && emailFrequency.email );
		}

		return false;
	};

	return (
		<OnboardingStep { ...props } canProceed={ canProceed }>
			<div className="tour-content">
				<h3 className="tour-title">
					{ __( 'Email Frequency', 'progress-planner' ) }
				</h3>
				<p>
					{ __(
						'Choose how often you\'d like to receive email updates.',
						'progress-planner'
					) }
				</p>

				<div className="prpl-email-frequency-options">
					<label
						htmlFor="prpl-email-weekly"
						style={ { display: 'block', marginBottom: '1rem' } }
					>
						<input
							id="prpl-email-weekly"
							type="radio"
							name="email-frequency"
							value="weekly"
							checked={ emailFrequency.choice === 'weekly' }
							onChange={ ( e ) =>
								setEmailFrequency( {
									...emailFrequency,
									choice: e.target.value,
								} )
							}
						/>
						<span>{ __( 'Email me weekly', 'progress-planner' ) }</span>
					</label>

					<label
						htmlFor="prpl-dont-email"
						style={ { display: 'block', marginBottom: '1rem' } }
					>
						<input
							id="prpl-dont-email"
							type="radio"
							name="email-frequency"
							value="none"
							checked={ emailFrequency.choice === 'none' }
							onChange={ ( e ) =>
								setEmailFrequency( {
									...emailFrequency,
									choice: e.target.value,
								} )
							}
						/>
						<span>
							{ __( 'Don\'t email me', 'progress-planner' ) }
						</span>
					</label>
				</div>

				{ emailFrequency.choice === 'weekly' && (
					<div id="prpl-email-form" style={ { marginTop: '1rem' } }>
						<label
							htmlFor="prpl-email-name"
							style={ {
								display: 'grid',
								gridTemplateColumns: '1fr 3fr',
								marginBottom: '0.5em',
								gap: 'var(--prpl-padding)',
							} }
						>
							<span>{ __( 'First name', 'progress-planner' ) }</span>
							<input
								id="prpl-email-name"
								type="text"
								value={ emailFrequency.name }
								onChange={ ( e ) =>
									setEmailFrequency( {
										...emailFrequency,
										name: e.target.value.trim(),
									} )
								}
							/>
						</label>
						<label
							htmlFor="prpl-email-address"
							style={ {
								display: 'grid',
								gridTemplateColumns: '1fr 3fr',
								marginBottom: '0.5em',
								gap: 'var(--prpl-padding)',
							} }
						>
							<span>{ __( 'Email', 'progress-planner' ) }</span>
							<input
								id="prpl-email-address"
								type="email"
								value={ emailFrequency.email }
								onChange={ ( e ) =>
									setEmailFrequency( {
										...emailFrequency,
										email: e.target.value.trim(),
									} )
								}
							/>
						</label>
					</div>
				) }
			</div>
		</OnboardingStep>
	);
}

