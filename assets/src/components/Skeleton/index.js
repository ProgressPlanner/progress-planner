/**
 * Skeleton Loading Components
 *
 * Primitive components for building skeleton loading states.
 * Use these to compose widget-specific loading skeletons.
 */

import { useEffect } from '@wordpress/element';

/**
 * Keyframes CSS for the shimmer animation.
 * Injected once into the document head.
 */
const SHIMMER_KEYFRAMES = `
@keyframes prpl-shimmer {
	0% { background-position: 200% 0; }
	100% { background-position: -200% 0; }
}
`;

/**
 * Track if keyframes have been injected.
 */
let keyframesInjected = false;

/**
 * Inject the shimmer keyframes into the document head (once).
 */
function injectKeyframes() {
	if ( keyframesInjected || typeof document === 'undefined' ) {
		return;
	}

	const styleEl = document.createElement( 'style' );
	styleEl.id = 'prpl-skeleton-keyframes';
	styleEl.textContent = SHIMMER_KEYFRAMES;
	document.head.appendChild( styleEl );
	keyframesInjected = true;
}

/**
 * Base skeleton styles.
 */
const baseSkeletonStyle = {
	background: `linear-gradient(
		90deg,
		var(--prpl-color-gauge-remain, #f0f0f0) 25%,
		var(--prpl-color-border, #e0e0e0) 50%,
		var(--prpl-color-gauge-remain, #f0f0f0) 75%
	)`,
	backgroundSize: '200% 100%',
	animation: 'prpl-shimmer 1.5s ease-in-out infinite',
	borderRadius: 'var(--prpl-border-radius, 8px)',
};

/**
 * SkeletonRect component - a rectangular skeleton element.
 *
 * @param {Object} props           - Component props.
 * @param {string} props.width     - Width (CSS value).
 * @param {string} props.height    - Height (CSS value).
 * @param {string} props.className - Additional CSS class.
 * @param {Object} props.style     - Additional inline styles.
 * @return {JSX.Element} The skeleton rect element.
 */
export function SkeletonRect( {
	width = '100%',
	height = '1em',
	className = '',
	style = {},
} ) {
	useEffect( () => {
		injectKeyframes();
	}, [] );

	return (
		<div
			className={ className || undefined }
			style={ {
				...baseSkeletonStyle,
				width,
				height,
				...style,
			} }
		/>
	);
}

/**
 * SkeletonCircle component - a circular skeleton element.
 *
 * @param {Object} props           - Component props.
 * @param {string} props.size      - Diameter (CSS value).
 * @param {string} props.className - Additional CSS class.
 * @param {Object} props.style     - Additional inline styles.
 * @return {JSX.Element} The skeleton circle element.
 */
export function SkeletonCircle( {
	size = '40px',
	className = '',
	style = {},
} ) {
	useEffect( () => {
		injectKeyframes();
	}, [] );

	return (
		<div
			className={ className || undefined }
			style={ {
				...baseSkeletonStyle,
				width: size,
				height: size,
				borderRadius: '50%',
				...style,
			} }
		/>
	);
}

/**
 * SkeletonText component - one or more lines of skeleton text.
 *
 * @param {Object}  props           - Component props.
 * @param {string}  props.width     - Width of each line (CSS value).
 * @param {number}  props.lines     - Number of lines.
 * @param {string}  props.className - Additional CSS class.
 * @param {Object}  props.style     - Additional inline styles.
 * @param {boolean} props.lastShort - Whether the last line should be shorter.
 * @return {JSX.Element} The skeleton text element(s).
 */
export function SkeletonText( {
	width = '100%',
	lines = 1,
	className = '',
	style = {},
	lastShort = true,
} ) {
	useEffect( () => {
		injectKeyframes();
	}, [] );

	if ( lines === 1 ) {
		return (
			<SkeletonRect
				width={ width }
				height="1em"
				className={ className }
				style={ style }
			/>
		);
	}

	return (
		<div style={ { display: 'flex', flexDirection: 'column', ...style } }>
			{ Array.from( { length: lines } ).map( ( _, i ) => (
				<SkeletonRect
					key={ i }
					width={ lastShort && i === lines - 1 ? '70%' : width }
					height="1em"
					className={ className }
					style={ { marginBottom: i < lines - 1 ? '0.5em' : 0 } }
				/>
			) ) }
		</div>
	);
}

/**
 * SkeletonBar component - a progress bar skeleton.
 *
 * @param {Object} props           - Component props.
 * @param {string} props.width     - Width (CSS value).
 * @param {string} props.height    - Height (CSS value).
 * @param {string} props.className - Additional CSS class.
 * @param {Object} props.style     - Additional inline styles.
 * @return {JSX.Element} The skeleton bar element.
 */
export function SkeletonBar( {
	width = '100%',
	height = '8px',
	className = '',
	style = {},
} ) {
	return (
		<SkeletonRect
			width={ width }
			height={ height }
			className={ className }
			style={ { borderRadius: '999px', ...style } }
		/>
	);
}
