/**
 * BigCounter Component
 *
 * Displays a large counter with a label, with responsive text sizing.
 */

import { useEffect, useRef, useCallback } from '@wordpress/element';

/**
 * BigCounter component.
 *
 * @param {Object} props                 - Component props.
 * @param {string} props.number          - The number to display.
 * @param {string} props.label           - The label text below the number.
 * @param {string} props.backgroundColor - Background color (CSS value).
 * @return {JSX.Element} The BigCounter component.
 */
export default function BigCounter( {
	number,
	label,
	backgroundColor = 'var(--prpl-background-content)',
} ) {
	const containerRef = useRef( null );
	const labelRef = useRef( null );

	const resizeFont = useCallback( () => {
		const labelElement = labelRef.current;
		const containerElement = containerRef.current;

		if ( ! labelElement || ! containerElement ) {
			return;
		}

		// Reset to 100% first
		labelElement.style.fontSize = '100%';
		labelElement.style.width = 'max-content';

		const containerWidth = containerElement.clientWidth;
		let size = 100;

		// Shrink the font until it fits or reaches minimum size
		while ( labelElement.clientWidth > containerWidth && size > 80 ) {
			size -= 1;
			labelElement.style.fontSize = size + '%';
		}

		// If we hit minimum size, set width to 100% for wrapping
		if ( size <= 80 ) {
			labelElement.style.fontSize = '80%';
			labelElement.style.width = '100%';
		}
	}, [] );

	useEffect( () => {
		resizeFont();
		window.addEventListener( 'resize', resizeFont );

		return () => {
			window.removeEventListener( 'resize', resizeFont );
		};
	}, [ resizeFont, label ] );

	const containerStyle = {
		backgroundColor,
		padding: 'var(--prpl-padding)',
		borderRadius: 'var(--prpl-border-radius-big)',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		textAlign: 'center',
		alignContent: 'center',
		justifyContent: 'center',
		height: 'calc(var(--prpl-font-size-5xl) + var(--prpl-font-size-2xl) + var(--prpl-padding) * 2)',
		marginBottom: 'var(--prpl-padding)',
	};

	const numberStyle = {
		fontSize: 'var(--prpl-font-size-5xl)',
		lineHeight: 1,
		fontWeight: 600,
	};

	const labelWrapperStyle = {
		fontSize: 'var(--prpl-font-size-2xl)',
	};

	const labelStyle = {
		fontSize: '100%',
		display: 'inline-block',
		width: 'max-content',
	};

	return (
		<div className="prpl-big-counter" style={ containerStyle }>
			<div
				className="prpl-big-counter__width-reference"
				ref={ containerRef }
				style={ { width: '100%' } }
			/>
			<span className="prpl-big-counter__number" style={ numberStyle }>
				{ number }
			</span>
			<span
				className="prpl-big-counter__label-wrapper"
				style={ labelWrapperStyle }
			>
				<span
					className="prpl-big-counter__label"
					ref={ labelRef }
					style={ labelStyle }
				>
					{ label }
				</span>
			</span>
		</div>
	);
}
