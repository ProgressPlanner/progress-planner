/**
 * Tooltip Component
 *
 * Replaces the prpl-tooltip web component with a React-based tooltip.
 */

import {
	useState,
	useEffect,
	useRef,
	useId,
	useCallback,
} from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import './tooltip.css';

/**
 * Default arrow styles (replaces the CSS ::after pseudo-element).
 */
const DEFAULT_ARROW_STYLE = {
	position: 'absolute',
	top: 0,
	right: 0,
	transform: 'translate(-10px, -10px) rotate(90deg)',
	width: 0,
	height: 0,
	borderStyle: 'solid',
	borderWidth: '7.5px 10px 7.5px 0',
	borderColor:
		'transparent var(--prpl-background-activity) transparent transparent',
};

/**
 * Base trigger button styles.
 */
const TRIGGER_STYLE = {
	padding: 0,
	lineHeight: 1,
	background: 'none',
	border: 'none',
	cursor: 'pointer',
	fontSize: 'var(--prpl-font-size-small)',
	color: 'var(--prpl-color-link)',
};

/**
 * Tooltip component.
 *
 * @param {Object}      props                - Component props.
 * @param {JSX.Element} props.triggerContent - Content for the trigger button.
 * @param {JSX.Element} props.children       - Tooltip body content.
 * @param {string}      props.className      - Optional wrapper class name.
 * @param {Object}      props.tooltipStyle   - Optional styles spread onto tooltip panel.
 * @param {Object}      props.arrowStyle     - Optional styles spread onto arrow span.
 * @param {Function}    props.onClose        - Optional callback fired when the tooltip closes.
 * @return {JSX.Element} The tooltip.
 */
export default function Tooltip( {
	triggerContent,
	children,
	className = '',
	tooltipStyle,
	arrowStyle,
	onClose,
} ) {
	const [ isVisible, setIsVisible ] = useState( false );
	const [ isTriggerHovered, setIsTriggerHovered ] = useState( false );
	const tooltipRef = useRef( null );
	const tooltipId = useId();

	const close = useCallback( () => {
		setIsVisible( false );
		onClose?.();
	}, [ onClose ] );

	useEffect( () => {
		if ( ! isVisible ) {
			return;
		}

		const handleKeyDown = ( e ) => {
			if ( e.key === 'Escape' ) {
				close();
			}
		};

		document.addEventListener( 'keydown', handleKeyDown );
		return () => document.removeEventListener( 'keydown', handleKeyDown );
	}, [ isVisible, close ] );

	const wrapperClass = `prpl-tooltip-wrapper${
		className ? ` ${ className }` : ''
	}`;

	const triggerStyle = {
		...TRIGGER_STYLE,
		textDecoration: isTriggerHovered ? 'underline' : 'none',
	};

	return (
		<span className={ wrapperClass }>
			<button
				type="button"
				className="prpl-info-icon"
				aria-describedby={ tooltipId }
				onClick={ () => setIsVisible( true ) }
				style={ triggerStyle }
				onMouseEnter={ () => setIsTriggerHovered( true ) }
				onMouseLeave={ () => setIsTriggerHovered( false ) }
			>
				{ triggerContent }
			</button>
			{ isVisible && (
				<span
					className="prpl-overlay"
					role="presentation"
					onClick={ close }
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
				style={ tooltipStyle }
			>
				<span
					className="prpl-tooltip-arrow"
					style={ { ...DEFAULT_ARROW_STYLE, ...arrowStyle } }
				/>
				{ children }
				<button
					type="button"
					className="prpl-tooltip-close"
					onClick={ close }
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
