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

	/**
	 * Checks if a given request has access to create items.
	 *
	 * @param \WP_REST_Request $request Full details about the request.
	 * @return true|\WP_Error True if the request has access to create items, WP_Error object otherwise.
	 */
	public function create_item_permissions_check( $request ) {
		// Require edit_posts capability minimum for creating recommendations.
		if ( ! \current_user_can( 'edit_posts' ) ) {
			return new \WP_Error(
				'rest_cannot_create',
				\__( 'Sorry, you are not allowed to create recommendations.', 'progress-planner' ),
				[ 'status' => \rest_authorization_required_code() ]
			);
		}

		return parent::create_item_permissions_check( $request );
	}

	/**
	 * Checks if a given request has access to update a specific item.
	 *
	 * @param \WP_REST_Request $request Full details about the request.
	 * @return true|\WP_Error True if the request has access to update the item, WP_Error object otherwise.
	 */
	public function update_item_permissions_check( $request ) {
		// Require edit_posts capability minimum for updating recommendations.
		if ( ! \current_user_can( 'edit_posts' ) ) {
			return new \WP_Error(
				'rest_cannot_edit',
				\__( 'Sorry, you are not allowed to edit recommendations.', 'progress-planner' ),
				[ 'status' => \rest_authorization_required_code() ]
			);
		}

		return parent::update_item_permissions_check( $request );
	}

	/**
	 * Checks if a given request has access to delete a specific item.
	 *
	 * @param \WP_REST_Request $request Full details about the request.
	 * @return true|\WP_Error True if the request has access to delete the item, WP_Error object otherwise.
	 */
	public function delete_item_permissions_check( $request ) {
		// Require delete_posts capability minimum for deleting recommendations.
		if ( ! \current_user_can( 'delete_posts' ) ) {
			return new \WP_Error(
				'rest_cannot_delete',
				\__( 'Sorry, you are not allowed to delete recommendations.', 'progress-planner' ),
				[ 'status' => \rest_authorization_required_code() ]
			);
		}

		return parent::delete_item_permissions_check( $request );
	}
}
