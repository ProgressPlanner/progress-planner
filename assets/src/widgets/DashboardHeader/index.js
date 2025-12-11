/**
 * Dashboard Header Component.
 *
 * Displays the header with logo, tour button, subscribe button, and filter selectors.
 */

import { useState, useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Get config from window object.
 *
 * @return {Object} The config object.
 */
function getConfig() {
	return window.prplDashboardHeaderConfig || {};
}

/**
 * Dashboard Header component.
 *
 * @return {JSX.Element} The dashboard header component.
 */
export default function DashboardHeader() {
	const config = getConfig();

	const [ range, setRange ] = useState( config.currentRange || '-6 months' );
	const [ frequency, setFrequency ] = useState(
		config.currentFrequency || 'monthly'
	);

	/**
	 * Handle range change.
	 *
	 * @param {Event} e The change event.
	 */
	const handleRangeChange = useCallback( ( e ) => {
		const newRange = e.target.value;
		setRange( newRange );

		// Update URL and reload page.
		const url = new URL( window.location.href );
		url.searchParams.set( 'range', newRange );
		window.location.href = url.href;
	}, [] );

	/**
	 * Handle frequency change.
	 *
	 * @param {Event} e The change event.
	 */
	const handleFrequencyChange = useCallback( ( e ) => {
		const newFrequency = e.target.value;
		setFrequency( newFrequency );

		// Update URL and reload page.
		const url = new URL( window.location.href );
		url.searchParams.set( 'frequency', newFrequency );
		window.location.href = url.href;
	}, [] );

	/**
	 * Handle tour button click.
	 */
	const handleTourClick = useCallback( () => {
		// Dispatch custom event for tour start.
		document.dispatchEvent( new CustomEvent( 'prpl/startTour' ) );
	}, [] );

	/**
	 * Handle subscribe button click.
	 */
	const handleSubscribeClick = useCallback( () => {
		// Open the subscribe popover.
		const popover = document.getElementById(
			'prpl-popover-subscribe-form'
		);
		if ( popover && typeof popover.showPopover === 'function' ) {
			popover.showPopover();
		}
	}, [] );

	// Styles
	const headerStyle = {
		marginBottom: '2rem',
		display: 'flex',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
		alignItems: 'center',
	};

	const logoStyle = {
		display: 'flex',
		alignItems: 'center',
	};

	const rightStyle = {
		display: 'flex',
		gap: 'var(--prpl-padding)',
		alignItems: 'center',
	};

	const iconButtonStyle = {
		width: '2rem',
		height: '2rem',
		display: 'inline-flex',
		alignItems: 'center',
		justifyContent: 'center',
		padding: '0.4em',
		backgroundColor: '#fff',
		border: '1px solid var(--prpl-color-ui-icon)',
		borderRadius: 'var(--prpl-border-radius)',
		cursor: 'pointer',
		color: 'inherit',
	};

	const selectRangeStyle = {
		display: 'flex',
		gap: '0.5rem',
		alignItems: 'center',
	};

	return (
		<div className="prpl-header" style={ headerStyle }>
			<div
				className="prpl-header-logo"
				style={ logoStyle }
				dangerouslySetInnerHTML={ { __html: config.logoHtml || '' } }
			/>

			<div className="prpl-header-right" style={ rightStyle }>
				<button
					className="prpl-info-icon"
					id="prpl-start-tour-icon-button"
					style={ iconButtonStyle }
					onClick={ handleTourClick }
					type="button"
				>
					<span
						dangerouslySetInnerHTML={ {
							__html: config.tourIconSvg || '',
						} }
					/>
					<span className="screen-reader-text">
						{ config.l10n?.startTour ||
							__( 'Start tour', 'progress-planner' ) }
					</span>
				</button>

				{ config.showSubscribeButton && (
					<button
						className="prpl-info-icon"
						style={ iconButtonStyle }
						onClick={ handleSubscribeClick }
						type="button"
						aria-haspopup="dialog"
					>
						<span
							dangerouslySetInnerHTML={ {
								__html: config.subscribeIconSvg || '',
							} }
						/>
						<span className="screen-reader-text">
							{ config.l10n?.subscribe ||
								__( 'Subscribe', 'progress-planner' ) }
						</span>
					</button>
				) }

				<div
					className="prpl-header-select-range"
					style={ selectRangeStyle }
				>
					<label
						htmlFor="prpl-select-range"
						className="screen-reader-text"
					>
						{ config.l10n?.selectRange ||
							__( 'Select range:', 'progress-planner' ) }
					</label>
					<select
						id="prpl-select-range"
						value={ range }
						onChange={ handleRangeChange }
					>
						{ ( config.rangeOptions || [] ).map( ( option ) => (
							<option key={ option.value } value={ option.value }>
								{ option.label }
							</option>
						) ) }
					</select>

					<label
						htmlFor="prpl-select-frequency"
						className="screen-reader-text"
					>
						{ config.l10n?.selectFrequency ||
							__( 'Select frequency:', 'progress-planner' ) }
					</label>
					<select
						id="prpl-select-frequency"
						value={ frequency }
						onChange={ handleFrequencyChange }
					>
						{ ( config.frequencyOptions || [] ).map( ( option ) => (
							<option key={ option.value } value={ option.value }>
								{ option.label }
							</option>
						) ) }
					</select>
				</div>
			</div>
		</div>
	);
}
