/**
 * Popover Loading State Component.
 *
 * Displays a loading state while popover components are being lazy-loaded.
 *
 * @return {JSX.Element} The loading state component.
 */

import { __ } from '@wordpress/i18n';

export default function PopoverLoadingState() {
	return (
		<div
			className="prpl-popover-loading"
			style={ {
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				padding: '2rem',
				minHeight: '200px',
			} }
		>
			<span
				className="spinner is-active"
				style={ {
					float: 'none',
					margin: '0 0 1rem 0',
				} }
			></span>
			<p style={ { margin: 0, color: '#666' } }>
				{ __( 'Loading…', 'progress-planner' ) }
			</p>
		</div>
	);
}
