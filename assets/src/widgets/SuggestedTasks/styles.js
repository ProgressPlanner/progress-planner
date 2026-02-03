/**
 * Suggested Tasks Widget Styles
 *
 * Extracted style constants to prevent recreation on each render.
 */

export const STYLES = {
	list: {
		listStyle: 'none',
		padding: 0,
		margin: '0 0 var(--prpl-padding) 0',
	},
	loading: {
		display: 'block',
		backgroundColor: 'var(--prpl-background-activity)',
		padding: 'calc(var(--prpl-padding) / 2)',
	},
	empty: {
		display: 'block',
		backgroundColor: 'var(--prpl-background-activity)',
		padding: 'calc(var(--prpl-padding) / 2)',
	},
	toggleButton: {
		background: 'none',
		border: 'none',
		padding: 0,
		color: 'var(--prpl-color-link)',
		textDecoration: 'underline',
		cursor: 'pointer',
		fontSize: 'inherit',
		fontFamily: 'inherit',
	},
	hiddenList: {
		display: 'none',
	},
};
