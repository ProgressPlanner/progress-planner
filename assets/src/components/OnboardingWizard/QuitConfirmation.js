/**
 * QuitConfirmation Component
 *
 * Confirmation dialog when user tries to close the wizard.
 *
 * @package
 */

import { __ } from '@wordpress/i18n';

/**
 * QuitConfirmation component.
 *
 * @param {Object} props          - Component props.
 * @param {Function} props.onConfirm - Callback when user confirms quit.
 * @param {Function} props.onCancel  - Callback when user cancels quit.
 * @return {JSX.Element} Quit confirmation dialog.
 */
export default function QuitConfirmation( { onConfirm, onCancel } ) {
	return (
		<div
			className="prpl-quit-confirmation-overlay"
			style={ {
				position: 'fixed',
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				backgroundColor: 'rgba(0, 0, 0, 0.5)',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				zIndex: 100000,
			} }
			onClick={ onCancel }
		>
			<div
				className="prpl-quit-confirmation-dialog"
				style={ {
					backgroundColor: 'var(--prpl-background-paper)',
					padding: '2rem',
					borderRadius: '8px',
					maxWidth: '400px',
					boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
				} }
				onClick={ ( e ) => e.stopPropagation() }
			>
				<h3>{ __( 'Quit onboarding?', 'progress-planner' ) }</h3>
				<p>
					{ __(
						'Your progress will be saved. You can continue later.',
						'progress-planner'
					) }
				</p>
				<div style={ { display: 'flex', gap: '1rem', marginTop: '1.5rem' } }>
					<button
						type="button"
						className="prpl-btn prpl-btn-secondary"
						onClick={ onCancel }
					>
						{ __( 'Cancel', 'progress-planner' ) }
					</button>
					<button
						type="button"
						className="prpl-btn prpl-btn-primary"
						onClick={ onConfirm }
					>
						{ __( 'Quit', 'progress-planner' ) }
					</button>
				</div>
			</div>
		</div>
	);
}

