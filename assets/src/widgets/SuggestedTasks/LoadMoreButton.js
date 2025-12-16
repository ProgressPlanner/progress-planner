/**
 * LoadMoreButton Component
 *
 * Button to load more tasks with loading state.
 */

import { __ } from '@wordpress/i18n';
import { STYLES } from './styles';

/**
 * LoadMoreButton component.
 *
 * @param {Object}   props           - Component props.
 * @param {boolean}  props.isLoading - Whether more tasks are loading.
 * @param {Function} props.onClick   - Click handler.
 * @return {JSX.Element} The LoadMoreButton component.
 */
export default function LoadMoreButton( { isLoading, onClick } ) {
	return (
		<p className="prpl-show-all-tasks">
			<button
				type="button"
				id="prpl-load-more-recommendations"
				className="prpl-toggle-all-recommendations-button"
				style={ STYLES.toggleButton }
				onClick={ onClick }
				disabled={ isLoading }
			>
				{ isLoading
					? __( 'Loading…', 'progress-planner' )
					: __( 'Load more tasks', 'progress-planner' ) }
			</button>
		</p>
	);
}
