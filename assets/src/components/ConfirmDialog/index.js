/**
 * ConfirmDialog Component
 *
 * A reusable confirmation dialog with overlay backdrop.
 *
 * @param {Object}   props           - Component props.
 * @param {boolean}  props.isOpen    - Whether the dialog is visible.
 * @param {string}   props.message   - The confirmation message.
 * @param {string}   props.confirm   - Confirm button text.
 * @param {string}   props.cancel    - Cancel button text.
 * @param {Function} props.onConfirm - Callback when confirmed.
 * @param {Function} props.onCancel  - Callback when cancelled.
 * @return {JSX.Element|null} The dialog or null when closed.
 */

import { __ } from '@wordpress/i18n';

const STYLES = {
	dialog: {
		position: 'fixed',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		zIndex: 10000,
		background: 'white',
		padding: '20px',
		borderRadius: '8px',
		boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
	},
	buttons: {
		display: 'flex',
		gap: '2rem',
		marginTop: '15px',
	},
	overlay: {
		position: 'fixed',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		background: 'rgba(0,0,0,0.3)',
		zIndex: 9999,
	},
};

export default function ConfirmDialog( {
	isOpen,
	message,
	confirm,
	cancel,
	onConfirm,
	onCancel,
} ) {
	if ( ! isOpen ) {
		return null;
	}

	return (
		<>
			<div className="prpl-popover" style={ STYLES.dialog }>
				<div className="prpl-note">
					<span className="prpl-note-icon">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="currentColor"
						>
							<path
								fillRule="evenodd"
								d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
								clipRule="evenodd"
							/>
						</svg>
					</span>
					<span className="prpl-note-text">{ message }</span>
				</div>
				<div className="prpl-buttons-wrapper" style={ STYLES.buttons }>
					<button onClick={ onCancel }>{ cancel }</button>
					<button onClick={ onConfirm }>{ confirm }</button>
				</div>
			</div>
			<div
				role="button"
				tabIndex={ 0 }
				aria-label={ __( 'Close dialog', 'progress-planner' ) }
				style={ STYLES.overlay }
				onClick={ onCancel }
				onKeyDown={ ( e ) => {
					if ( e.key === 'Enter' || e.key === ' ' ) {
						onCancel();
					}
				} }
			/>
		</>
	);
}
