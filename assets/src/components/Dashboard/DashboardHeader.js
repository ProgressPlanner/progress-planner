/**
 * DashboardHeader Component
 *
 * Header component with logo, tour button, subscribe form, and range/frequency selectors.
 */

import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * DashboardHeader component.
 *
 * @param {Object} props        - Component props.
 * @param {Object} props.config - Dashboard configuration.
 * @return {JSX.Element} The DashboardHeader component.
 */
export default function DashboardHeader( { config } ) {
	const {
		licenseKey,
		branding = {},
		rangeOptions = [],
		frequencyOptions = [],
	} = config;
	const [ range, setRange ] = useState( config.currentRange || '-6 months' );
	const [ frequency, setFrequency ] = useState(
		config.currentFrequency || 'monthly'
	);

	/**
	 * Handle range selector change.
	 * @param {Event} e - Change event.
	 */
	const handleRangeChange = ( e ) => {
		const newRange = e.target.value;
		setRange( newRange );
		const url = new URL( window.location.href );
		url.searchParams.set( 'range', newRange );
		window.location.href = url.href;
	};

	/**
	 * Handle frequency selector change.
	 * @param {Event} e - Change event.
	 */
	const handleFrequencyChange = ( e ) => {
		const newFrequency = e.target.value;
		setFrequency( newFrequency );
		const url = new URL( window.location.href );
		url.searchParams.set( 'frequency', newFrequency );
		window.location.href = url.href;
	};

	// Tour button click is handled by tour.js script which is enqueued separately.
	// The button just needs to exist in the DOM with the correct ID.

	return (
		<div
			className="prpl-header"
			style={ {
				marginBottom: '2rem',
				display: 'flex',
				flexWrap: 'wrap',
				justifyContent: 'space-between',
				alignItems: 'center',
			} }
		>
			<div className="prpl-header-logo">
				{ branding.logoHtml && (
					<div
						dangerouslySetInnerHTML={ {
							__html: branding.logoHtml,
						} }
					/>
				) }
			</div>

			<div
				className="prpl-header-right"
				style={ {
					display: 'flex',
					gap: 'var(--prpl-padding)',
					alignItems: 'center',
				} }
			>
				<button
					className="prpl-info-icon"
					id="prpl-start-tour-icon-button"
					type="button"
					style={ {
						width: '2rem',
						height: '2rem',
						display: 'inline-flex',
						alignItems: 'center',
						justifyContent: 'center',
						padding: '0.4em',
						color: 'var(--prpl-color-ui-icon)',
						cursor: 'pointer',
						backgroundColor: '#fff',
						border: '1px solid var(--prpl-color-ui-icon)',
						borderRadius: 'var(--prpl-border-radius)',
					} }
					onMouseEnter={ ( e ) => {
						e.target.style.color =
							'var(--prpl-color-ui-icon-hover)';
						e.target.style.borderColor =
							'var(--prpl-color-ui-icon-hover)';
						e.target.style.backgroundColor =
							'var(--prpl-color-ui-icon-hover-fill)';
					} }
					onMouseLeave={ ( e ) => {
						e.target.style.color = 'var(--prpl-color-ui-icon)';
						e.target.style.borderColor =
							'var(--prpl-color-ui-icon)';
						e.target.style.backgroundColor = '#fff';
					} }
				>
					{ branding.tourIconHtml && (
						<span
							dangerouslySetInnerHTML={ {
								__html: branding.tourIconHtml,
							} }
						/>
					) }
					<span className="screen-reader-text">
						{ __( 'Start tour', 'progress-planner' ) }
					</span>
				</button>

				{ licenseKey === 'no-license' && (
					<>
						{ /* Subscribe form button - triggers popover via showPopover() */ }
						<button
							className="prpl-info-icon"
							type="button"
							style={ {
								width: '2rem',
								height: '2rem',
								display: 'inline-flex',
								alignItems: 'center',
								justifyContent: 'center',
								padding: '0.4em',
								color: 'var(--prpl-color-ui-icon)',
								cursor: 'pointer',
								backgroundColor: '#fff',
								border: '1px solid var(--prpl-color-ui-icon)',
								borderRadius: 'var(--prpl-border-radius)',
							} }
							onMouseEnter={ ( e ) => {
								e.target.style.color =
									'var(--prpl-color-ui-icon-hover)';
								e.target.style.borderColor =
									'var(--prpl-color-ui-icon-hover)';
								e.target.style.backgroundColor =
									'var(--prpl-color-ui-icon-hover-fill)';
							} }
							onMouseLeave={ ( e ) => {
								e.target.style.color =
									'var(--prpl-color-ui-icon)';
								e.target.style.borderColor =
									'var(--prpl-color-ui-icon)';
								e.target.style.backgroundColor = '#fff';
							} }
							onClick={ () => {
								// Trigger React popover via WordPress hook.
								if (
									typeof wp !== 'undefined' &&
									wp.hooks &&
									wp.hooks.doAction
								) {
									const task = {
										id: 'subscribe-form',
										slug: 'subscribe-form',
										title: __(
											'Subscribe to weekly emails',
											'progress-planner'
										),
									};
									wp.hooks.doAction(
										'prpl.popover.open',
										'subscribe-form',
										task
									);
								} else {
									// Fallback: try to show popover if it exists in DOM.
									const popover = document.getElementById(
										'prpl-popover-subscribe-form'
									);
									if (
										popover &&
										typeof popover.showPopover ===
											'function'
									) {
										popover.showPopover();
									}
								}
							} }
						>
							{ branding.registerIconHtml && (
								<span
									dangerouslySetInnerHTML={ {
										__html: branding.registerIconHtml,
									} }
								/>
							) }
							<span className="screen-reader-text">
								{ __( 'Subscribe', 'progress-planner' ) }
							</span>
						</button>
					</>
				) }

				<div className="prpl-header-select-range">
					<label
						htmlFor="prpl-select-range"
						className="screen-reader-text"
					>
						{ __( 'Select range:', 'progress-planner' ) }
					</label>
					<select
						id="prpl-select-range"
						value={ range }
						onChange={ handleRangeChange }
					>
						{ rangeOptions.map( ( option ) => (
							<option key={ option.value } value={ option.value }>
								{ option.label }
							</option>
						) ) }
					</select>
					<label
						htmlFor="prpl-select-frequency"
						className="screen-reader-text"
					>
						{ __( 'Select frequency:', 'progress-planner' ) }
					</label>
					<select
						id="prpl-select-frequency"
						value={ frequency }
						onChange={ handleFrequencyChange }
					>
						{ frequencyOptions.map( ( option ) => (
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
