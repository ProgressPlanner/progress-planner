/**
 * LoadMoreButton Component
 *
 * Button to load more tasks or collapse back to initial view.
 */

import { __ } from '@wordpress/i18n';
import { STYLES } from './styles';

/**
 * LoadMoreButton component.
 *
 * Shows "Load more tasks" when there are more tasks to show,
 * or "Show top 5" when at the end of the list and expanded.
 *
 * @param {Object}   props             - Component props.
 * @param {boolean}  props.hasMore     - Whether there are more tasks to show.
 * @param {boolean}  props.canCollapse - Whether the list can be collapsed.
 * @param {Function} props.onLoadMore  - Handler to load more tasks.
 * @param {Function} props.onCollapse  - Handler to collapse the list.
 * @return {JSX.Element|null} The LoadMoreButton component or null.
 */
export default function LoadMoreButton( {
	hasMore,
	canCollapse,
	onLoadMore,
	onCollapse,
} ) {
	if ( hasMore ) {
		return (
			<p className="prpl-show-all-tasks">
				<button
					type="button"
					id="prpl-load-more-recommendations"
					className="prpl-toggle-all-recommendations-button"
					style={ STYLES.toggleButton }
					onClick={ onLoadMore }
				>
					{ __( 'Load more tasks', 'progress-planner' ) }
				</button>
			</p>
		);
	}

	if ( canCollapse ) {
		return (
			<p className="prpl-show-all-tasks">
				<button
					type="button"
					id="prpl-collapse-recommendations"
					className="prpl-toggle-all-recommendations-button"
					style={ STYLES.toggleButton }
					onClick={ onCollapse }
				>
					{ __( 'Show top 5', 'progress-planner' ) }
				</button>
			</p>
		);
	}

	return null;
}
