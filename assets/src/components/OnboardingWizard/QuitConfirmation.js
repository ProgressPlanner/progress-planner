/**
 * QuitConfirmation Component
 *
 * Confirmation dialog when user tries to close the wizard.
 *
 * @package
 */

import { __, sprintf } from '@wordpress/i18n';

/**
 * QuitConfirmation component.
 *
 * @param {Object}   props           - Component props.
 * @param {Function} props.onConfirm - Callback when user confirms quit.
 * @param {Function} props.onCancel  - Callback when user cancels quit.
 * @param {Object}   props.config    - Wizard configuration.
 * @return {JSX.Element} Quit confirmation dialog.
 */
export default function QuitConfirmation( { onConfirm, onCancel, config } ) {
	const brandingName =
		config?.l10n?.brandingName ||
		__( 'Progress Planner', 'progress-planner' );

	return (
		<div className="prpl-columns-wrapper-flex prpl-columns-2-1">
			<div className="prpl-column">
				<div className="prpl-quit-confirmation">
					<div className="prpl-error-box">
						<span className="prpl-error-icon">
							<svg
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
									fill="currentColor"
								/>
							</svg>
						</span>
						<div>
							<h3 id="prpl-quit-confirmation-title">
								{ __(
									'Are you sure you want to quit?',
									'progress-planner'
								) }
							</h3>
							<p>
								{ sprintf(
									/* translators: %s: Progress Planner name */
									__(
										'You need to finish the onboarding before you can work with the %s and start improving your site.',
										'progress-planner'
									),
									brandingName
								) }
							</p>
						</div>
					</div>
					<div className="prpl-quit-actions">
						<button
							type="button"
							id="prpl-quit-yes"
							className="prpl-quit-link"
							onClick={ ( e ) => {
								e.preventDefault();
								if ( typeof onConfirm === 'function' ) {
									onConfirm();
								}
							} }
						>
							{ __(
								'Yes, quit the onboarding (for now)',
								'progress-planner'
							) }
						</button>
						<button
							type="button"
							id="prpl-quit-no"
							className="prpl-quit-link prpl-quit-link-primary"
							onClick={ ( e ) => {
								e.preventDefault();
								if ( typeof onCancel === 'function' ) {
									onCancel();
								}
							} }
						>
							{ __(
								"No, let's finish the onboarding!",
								'progress-planner'
							) }
						</button>
					</div>
				</div>
			</div>
			<div className="prpl-column prpl-hide-on-mobile">
				<div id="prpl-quit-confirmation-graphic">
					{ /* Graphic would be rendered here - neglected_site_ravi.svg */ }
					<div
						style={ {
							width: '100%',
							height: '200px',
							backgroundColor: '#f0f0f0',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							color: '#999',
						} }
					>
						{ __(
							'Graphic placeholder',
							'progress-planner'
						) }
					</div>
				</div>
			</div>
		</div>
	);
}
