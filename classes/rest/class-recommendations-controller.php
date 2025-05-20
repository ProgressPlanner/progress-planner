<?php
/**
 * Progress_Planner Recommendations REST-API.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Rest;

/**
 * Recommendations REST-API.
 */
class Recommendations_Controller extends \WP_REST_Posts_Controller {

	/**
	 * Get the item schema.
	 * We need to add the "trash" status to the allowed enum list for status.
	 *
	 * @return array The item schema.
	 */
	public function get_item_schema() {
		$schema = parent::get_item_schema();

		// Add "trash" to the allowed enum list for status.
		if ( isset( $schema['properties']['status']['enum'] ) ) {
			$schema['properties']['status']['enum'][] = 'trash';
		}

		return $schema;
	}

	/**
	 * Prepare the items query.
	 * We only need to add the filter to the query.
	 *
	 * @param array            $prepared_args The prepared arguments.
	 * @param \WP_REST_Request $request The request.
	 * @return array The prepared arguments.
	 */
	protected function prepare_items_query( $prepared_args = [], $request = null ) {
		$prepared_args = parent::prepare_items_query( $prepared_args, $request );

		// Reapply the original filter so your existing filters still run.
		return \apply_filters( 'rest_prpl_recommendations_query', $prepared_args, $request ); // phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound
	}
}
