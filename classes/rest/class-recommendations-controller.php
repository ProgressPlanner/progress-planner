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
	 * Get the item schema for recommendations (tasks) in the REST API.
	 *
	 * Extends the default WordPress post schema to support the 'trash' status,
	 * which WordPress REST API normally excludes from the allowed enum values.
	 *
	 * This is necessary because Progress Planner uses 'trash' status to indicate:
	 * - Completed tasks (when dismissed/marked complete)
	 * - Deleted tasks (when removed from the list)
	 *
	 * Without this modification, API clients couldn't set tasks to 'trash' status,
	 * preventing proper task completion tracking.
	 *
	 * @return array {
	 *     The complete item schema with Progress Planner customizations.
	 *     Inherits all WordPress post schema properties plus:
	 *
	 *     @type array $properties {
	 *         @type array $status {
	 *             @type array $enum Allowed status values, now includes 'trash'.
	 *         }
	 *     }
	 * }
	 */
	public function get_item_schema() {
		$schema = parent::get_item_schema();

		// Add "trash" to the allowed enum list for status.
		// This enables API clients to mark tasks as complete by setting status to 'trash'.
		if ( isset( $schema['properties']['status']['enum'] ) ) {
			$schema['properties']['status']['enum'][] = 'trash';
		}

		return $schema;
	}

	/**
	 * Prepare the WP_Query arguments before fetching tasks via REST API.
	 *
	 * This method allows other parts of the plugin (or external code) to modify
	 * the query parameters before tasks are fetched from the database.
	 *
	 * The `rest_prpl_recommendations_query` filter enables:
	 * - Filtering tasks by custom meta fields
	 * - Changing query order or pagination
	 * - Adding tax_query or meta_query clauses
	 * - Customizing which tasks appear in API responses
	 *
	 * @param array            $prepared_args {
	 *     WP_Query arguments prepared by WordPress REST API.
	 *     Common parameters include post_type, post_status, posts_per_page, etc.
	 * }.
	 * @param \WP_REST_Request $request       The REST API request object containing query parameters.
	 *
	 * @return array Modified WP_Query arguments ready for database query.
	 */
	protected function prepare_items_query( $prepared_args = [], $request = null ) {
		$prepared_args = parent::prepare_items_query( $prepared_args, $request );

		// Apply filter to allow customization of the query before execution.
		// This preserves backward compatibility with any existing filters on this hook.
		return \apply_filters( 'rest_prpl_recommendations_query', $prepared_args, $request ); // phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound
	}
}
