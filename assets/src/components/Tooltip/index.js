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

const WRAPPER_STYLE = {
	display: 'inline-flex',
	alignItems: 'center',
	position: 'relative',
};

const TOOLTIP_STYLE = {
	display: 'block',
	position: 'absolute',
	bottom: 0,
	left: '100%',
	transform: 'translate(-100%, calc(100% + 10px))',
	padding: '0.75rem 1.5rem 0.75rem 0.75rem',
	width: 150,
	background: 'var(--prpl-background-activity)',
	borderRadius: 'var(--prpl-border-radius)',
	zIndex: 2,
	visibility: 'hidden',
	fontSize: '1rem',
	fontWeight: 400,
	color: 'var(--prpl-color-text)',
};

const TOOLTIP_VISIBLE_STYLE = {
	visibility: 'visible',
	zIndex: 10,
};

const CLOSE_BUTTON_STYLE = {
	position: 'absolute',
	top: 0,
	right: 0,
	padding: '0.1rem',
	lineHeight: 0,
	margin: 0,
	background: 'none',
	border: 'none',
	cursor: 'pointer',
};

const OVERLAY_STYLE = {
	display: 'block',
	position: 'fixed',
	top: 0,
	left: 0,
	width: '100%',
	height: '100%',
	zIndex: 9,
	backgroundColor: 'rgba(0, 0, 0, 0.5)',
};

/**
 * Tooltip component.
 *
 * @param {Object}      props                - Component props.
 * @param {JSX.Element} props.triggerContent - Content for the trigger button.
 * @param {JSX.Element} props.children       - Tooltip body content.
 * @param {Object}      props.tooltipStyle   - Optional styles spread onto tooltip panel.
 * @param {Object}      props.arrowStyle     - Optional styles spread onto arrow span.
 * @param {Function}    props.onClose        - Optional callback fired when the tooltip closes.
 * @return {JSX.Element} The tooltip.
 */
export default function Tooltip( {
	triggerContent,
	children,
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

	const triggerStyle = {
		...TRIGGER_STYLE,
		textDecoration: isTriggerHovered ? 'underline' : 'none',
	};

	return (
		<span className="prpl-tooltip-wrapper" style={ WRAPPER_STYLE }>
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
					role="presentation"
					onClick={ close }
					style={ OVERLAY_STYLE }
				/>
			) }
			<span
				ref={ tooltipRef }
				id={ tooltipId }
				className="prpl-tooltip"
				role="tooltip"
				aria-hidden={ ! isVisible }
				style={ {
					...TOOLTIP_STYLE,
					...( isVisible ? TOOLTIP_VISIBLE_STYLE : {} ),
					...tooltipStyle,
				} }
			>
				<span
					data-testid="tooltip-arrow"
					style={ { ...DEFAULT_ARROW_STYLE, ...arrowStyle } }
				/>
				{ children }
				<button
					type="button"
					onClick={ close }
					style={ CLOSE_BUTTON_STYLE }
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
