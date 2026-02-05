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
import Icon from '../Icon';

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
						<Icon name="warning" />
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
