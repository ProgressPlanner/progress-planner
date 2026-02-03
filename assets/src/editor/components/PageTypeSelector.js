/**
 * Render a dropdown to select the page-type.
 *
 * @param {Object} props                 Component props.
 * @param {Array}  props.pageTypes       Array of page type objects.
 * @param {number} props.defaultPageType Default page type ID.
 * @return {JSX.Element} Element to render.
 */
import { SelectControl } from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

const TAXONOMY = 'progress_planner_page_types';

export default function PageTypeSelector( { pageTypes, defaultPageType } ) {
	// Hooks must be called before any early returns.
	const currentPageType = useSelect(
		( select ) => {
			const pageTypeArr =
				select( 'core/editor' ).getEditedPostAttribute( TAXONOMY );
			return pageTypeArr && 0 < pageTypeArr.length
				? parseInt( pageTypeArr[ 0 ] )
				: parseInt( defaultPageType );
		},
		[ defaultPageType ]
	);

	const { editPost } = useDispatch( 'core/editor' );

	// Bail early if the page types are not set.
	if ( ! pageTypes || 0 === pageTypes.length ) {
		return <div></div>;
	}

	// Build the page types array, to be used in the dropdown.
	const pageTypeOptions = pageTypes.map( ( term ) => ( {
		label: term.title,
		value: term.id,
	} ) );

	const handleChange = ( value ) => {
		// Update the TAXONOMY term value.
		const data = {};
		data[ TAXONOMY ] = value;
		editPost( data );
	};

	return (
		<SelectControl
			label={ __( 'Page type', 'progress-planner' ) }
			value={ currentPageType }
			options={ pageTypeOptions }
			onChange={ handleChange }
		/>
	);
}
