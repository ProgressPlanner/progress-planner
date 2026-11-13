<?php
/**
 * Private page-type vocabulary for the editor.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Rest;

/**
 * Restrict reads while retaining WordPress term and assignment permissions.
 */
class Page_Types_Controller extends \WP_REST_Terms_Controller {

	/**
	 * Check collection read access.
	 *
	 * @param \WP_REST_Request $request REST request.
	 * @return true|\WP_Error
	 */
	public function get_items_permissions_check( $request ) {
		if ( ! \current_user_can( 'edit_posts' ) ) {
			return new \WP_Error( 'rest_forbidden', \__( 'You cannot access page types.', 'progress-planner' ), [ 'status' => \rest_authorization_required_code() ] );
		}
		return parent::get_items_permissions_check( $request );
	}

	/**
	 * Check single-term read access.
	 *
	 * @param \WP_REST_Request $request REST request.
	 * @return true|\WP_Error
	 */
	public function get_item_permissions_check( $request ) {
		if ( ! \current_user_can( 'edit_posts' ) ) {
			return new \WP_Error( 'rest_forbidden', \__( 'You cannot access page types.', 'progress-planner' ), [ 'status' => \rest_authorization_required_code() ] );
		}
		return parent::get_item_permissions_check( $request );
	}
}
