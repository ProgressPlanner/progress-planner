/**
 * Reusable Icon component with SVG path registry.
 *
 * @param {Object} props      - Component props.
 * @param {string} props.name - Icon name from the registry.
 * @return {JSX.Element|null} The SVG icon or null for unknown names.
 */

const ICONS = {
	arrow: {
		viewBox: '0 0 20 17',
		paths: [
			{
				d: 'M19.92 8.12c-.05-.12-.12-.23-.22-.33L12.21.29A.996.996 0 1 0 10.8 1.7l5.79 5.79H1c-.55 0-1 .45-1 1s.45 1 1 1h15.59l-5.79 5.79a.996.996 0 0 0 .71 1.7c.26 0 .51-.1.71-.29l7.5-7.5c.1-.1.17-.21.22-.33.05-.12.07-.24.08-.38 0-.14-.03-.27-.08-.38Z',
			},
		],
	},
	trash: {
		viewBox: '0 0 48 48',
		paths: [
			{
				d: 'M32.99 47.88H15.01c-3.46 0-6.38-2.7-6.64-6.15L6.04 11.49l-.72.12c-.82.14-1.59-.41-1.73-1.22-.14-.82.41-1.59 1.22-1.73.79-.14 1.57-.26 2.37-.38h.02c2.21-.33 4.46-.6 6.69-.81v-.72c0-3.56 2.74-6.44 6.25-6.55 2.56-.08 5.15-.08 7.71 0 3.5.11 6.25 2.99 6.25 6.55v.72c2.24.2 4.48.47 6.7.81.79.12 1.59.25 2.38.39.82.14 1.36.92 1.22 1.73-.14.82-.92 1.36-1.73 1.22l-.72-.12-2.33 30.24c-.27 3.45-3.18 6.15-6.64 6.15Zm-17.98-3h17.97c1.9 0 3.51-1.48 3.65-3.38l2.34-30.46c-2.15-.3-4.33-.53-6.48-.7h-.03c-5.62-.43-11.32-.43-16.95 0h-.03c-2.15.17-4.33.4-6.48.7l2.34 30.46c.15 1.9 1.75 3.38 3.65 3.38ZM24 7.01c2.37 0 4.74.07 7.11.22v-.49c0-1.93-1.47-3.49-3.34-3.55-2.5-.08-5.03-.08-7.52 0-1.88.06-3.34 1.62-3.34 3.55v.49c2.36-.15 4.73-.22 7.11-.22Zm5.49 32.26h-.06c-.83-.03-1.47-.73-1.44-1.56l.79-20.65c.03-.83.75-1.45 1.56-1.44.83.03 1.47.73 1.44 1.56l-.79 20.65c-.03.81-.7 1.44-1.5 1.44Zm-10.98 0c-.8 0-1.47-.63-1.5-1.44l-.79-20.65c-.03-.83.61-1.52 1.44-1.56.84 0 1.52.61 1.56 1.44l.79 20.65c.03.83-.61 1.52-1.44 1.56h-.06Z',
			},
		],
	},
	check: {
		viewBox: '0 0 20 20',
		paths: [
			{
				d: 'M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z',
				fillRule: 'evenodd',
				clipRule: 'evenodd',
			},
		],
	},
	close: {
		viewBox: '0 0 20 20',
		paths: [
			{
				d: 'M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z',
				fillRule: 'evenodd',
				clipRule: 'evenodd',
			},
		],
	},
	chevronDown: {
		viewBox: '0 0 24 24',
		stroke: true,
		paths: [
			{
				d: 'm19.5 8.25-7.5 7.5-7.5-7.5',
				strokeLinecap: 'round',
				strokeLinejoin: 'round',
			},
		],
	},
	warning: {
		viewBox: '0 0 24 24',
		paths: [
			{
				d: 'M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z',
				fillRule: 'evenodd',
				clipRule: 'evenodd',
			},
		],
	},
};

export default function Icon( { name, ...props } ) {
	const icon = ICONS[ name ];
	if ( ! icon ) {
		return null;
	}

	const isStroke = icon.stroke;

	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox={ icon.viewBox }
			fill={ isStroke ? 'none' : 'currentColor' }
			stroke={ isStroke ? 'currentColor' : undefined }
			strokeWidth={ isStroke ? '1.5' : undefined }
			aria-hidden="true"
			focusable="false"
			{ ...props }
		>
			{ icon.paths.map( ( pathProps, i ) => (
				<path key={ i } { ...pathProps } />
			) ) }
		</svg>
	);
}
