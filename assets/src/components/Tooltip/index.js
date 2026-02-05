/**
 * Tooltip Component
 *
 * Replaces the prpl-tooltip web component with a React-based tooltip.
 */

import { useState, useEffect, useRef, useId } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import './tooltip.css';

/**
 * Tooltip component.
 *
 * @param {Object}      props                - Component props.
 * @param {JSX.Element} props.triggerContent - Content for the trigger button.
 * @param {JSX.Element} props.children       - Tooltip body content.
 * @param {string}      props.className      - Optional wrapper class name.
 * @return {JSX.Element} The tooltip.
 */
export default function Tooltip( {
	triggerContent,
	children,
	className = '',
} ) {
	const [ isVisible, setIsVisible ] = useState( false );
	const tooltipRef = useRef( null );
	const tooltipId = useId();

	useEffect( () => {
		if ( ! isVisible ) {
			return;
		}

		const handleKeyDown = ( e ) => {
			if ( e.key === 'Escape' ) {
				setIsVisible( false );
			}
		};

		document.addEventListener( 'keydown', handleKeyDown );
		return () => document.removeEventListener( 'keydown', handleKeyDown );
	}, [ isVisible ] );

	const wrapperClass = `prpl-tooltip-wrapper${
		className ? ` ${ className }` : ''
	}`;

	return (
		<span className={ wrapperClass }>
			<button
				type="button"
				className="prpl-info-icon"
				aria-describedby={ tooltipId }
				onClick={ () => setIsVisible( true ) }
			>
				{ triggerContent }
			</button>
			{ isVisible && (
				<span
					className="prpl-overlay"
					role="presentation"
					onClick={ () => setIsVisible( false ) }
				/>
			) }
			<span
				ref={ tooltipRef }
				id={ tooltipId }
				className={ `prpl-tooltip${
					isVisible ? ' prpl-tooltip-visible' : ''
				}` }
				role="tooltip"
				aria-hidden={ ! isVisible }
			>
				{ children }
				<button
					type="button"
					className="prpl-tooltip-close"
					onClick={ () => setIsVisible( false ) }
				>
					<span className="dashicons dashicons-no-alt"></span>
					<span className="screen-reader-text">
						{ __( 'Close', 'progress-planner' ) }
					</span>
				</button>
			</span>
		</span>
	);
}
