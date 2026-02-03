/**
 * ChartFilters Component
 *
 * Displays filter checkboxes for toggling chart series visibility.
 */

/**
 * ChartFilters component.
 *
 * @param {Object}   props               - Component props.
 * @param {Object}   props.dataArgs      - Data arguments with color and label per series.
 * @param {string[]} props.visibleSeries - Array of visible series keys.
 * @param {string}   props.filtersLabel  - Optional label to show before filters.
 * @param {Function} props.onToggle      - Callback when a series is toggled.
 * @return {JSX.Element} The ChartFilters component.
 */
export default function ChartFilters( {
	dataArgs,
	visibleSeries,
	filtersLabel,
	onToggle,
} ) {
	const containerStyle = {
		display: 'flex',
		gap: '1em',
		marginBottom: '1em',
		justifyContent: 'space-between',
		fontSize: '0.85rem',
	};

	const labelStyle = {
		display: 'flex',
		alignItems: 'center',
		gap: '0.25em',
		cursor: 'pointer',
	};

	const getCheckboxColorStyle = ( key ) => ( {
		backgroundColor: visibleSeries.includes( key )
			? dataArgs[ key ].color
			: 'transparent',
		width: '1em',
		height: '1em',
		borderRadius: '0.25em',
		outline: `1px solid ${ dataArgs[ key ].color }`,
		border: '1px solid #fff',
	} );

	const hiddenInputStyle = {
		display: 'none',
	};

	return (
		<div className="prpl-line-chart__filters" style={ containerStyle }>
			{ filtersLabel && (
				<span
					className="prpl-line-chart__filters-label"
					dangerouslySetInnerHTML={ { __html: filtersLabel } }
				/>
			) }
			{ Object.keys( dataArgs ).map( ( key ) => (
				<label
					key={ key }
					htmlFor={ `prpl-chart-filter-${ key }` }
					className={ `prpl-line-chart__filter prpl-line-chart__filter--${ key }` }
					style={ labelStyle }
				>
					<span
						className="prpl-line-chart__filter-color"
						style={ getCheckboxColorStyle( key ) }
					/>
					<input
						type="checkbox"
						id={ `prpl-chart-filter-${ key }` }
						name={ key }
						value={ key }
						checked={ visibleSeries.includes( key ) }
						onChange={ () => onToggle( key ) }
						style={ hiddenInputStyle }
					/>
					{ dataArgs[ key ].label }
				</label>
			) ) }
		</div>
	);
}
