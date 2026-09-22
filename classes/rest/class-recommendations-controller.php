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
	 * The capability required to read or write recommendations over REST.
	 *
	 * This mirrors the gate the rest of the plugin uses for its admin UI
	 * (see `Base::init()` and `Admin\Dashboard_Widget::$capability`), so the
	 * REST surface can never be reached by roles that cannot see the feature.
	 *
	 * Without these overrides the `prpl_recommendations` CPT inherits the
	 * default `post` capabilities: any Contributor/Author (`edit_posts`) could
	 * create, alter, trash and enumerate tasks, and any published task was
	 * readable anonymously. See the 1.10.0 release audit (S1/S2).
	 *
	 * @var string
	 */
	const REQUIRED_CAPABILITY = 'edit_others_posts';

	/**
	 * Whether the current user may access the recommendations REST surface.
	 *
	 * @return bool
	 */
	protected function current_user_can_access_recommendations() {
		return \current_user_can( self::REQUIRED_CAPABILITY );
	}

	/**
	 * Whether the current user may act on the specific task identified by the
	 * request, based on the task's own provider capability.
	 *
	 * This mirrors the per-task gate the AJAX handler applies
	 * (`Suggested_Tasks::suggested_task_action()`): e.g. an admin-only task such
	 * as `update-core` requires `update_core`, so an editor cannot read, trash
	 * or delete it over REST even though they clear the surface-level
	 * `edit_others_posts` gate (audit S1, review gap 2). Tasks whose provider
	 * cannot be resolved fall back to the surface gate.
	 *
	 * @param \WP_REST_Request $request The REST request.
	 *
	 * @return bool
	 */
	protected function current_user_can_manage_requested_task( $request ) {
		$post = $this->get_post( $request['id'] );
		if ( \is_wp_error( $post ) ) {
			return true;
		}

		$task = \progress_planner()->get_suggested_tasks_db()->get_post( $post->ID );
		if ( ! $task ) {
			return true;
		}

		$provider = \progress_planner()->get_suggested_tasks()->get_tasks_manager()->get_task_provider( $task->get_provider_id() );
		if ( ! $provider ) {
			return true;
		}

		return (bool) $provider->capability_required();
	}

	/**
	 * Build the shared "insufficient permissions" error.
	 *
	 * @return \WP_Error
	 */
	protected function forbidden_error() {
		return new \WP_Error(
			'rest_forbidden',
			\__( 'Sorry, you are not allowed to access Progress Planner recommendations.', 'progress-planner' ),
			[ 'status' => \rest_authorization_required_code() ]
		);
	}

	/**
	 * Check permissions for reading a collection of recommendations.
	 *
	 * @param \WP_REST_Request $request The REST request.
	 *
	 * @return true|\WP_Error
	 */
	public function get_items_permissions_check( $request ) {
		if ( ! $this->current_user_can_access_recommendations() ) {
			return $this->forbidden_error();
		}
		return parent::get_items_permissions_check( $request );
	}

	/**
	 * Check permissions for reading a single recommendation.
	 *
	 * Core's `WP_REST_Posts_Controller::check_read_permission()` allows any
	 * `publish` post to be read anonymously, so overriding this method is the
	 * only way to close anonymous single-item reads (audit S2).
	 *
	 * @param \WP_REST_Request $request The REST request.
	 *
	 * @return true|\WP_Error
	 */
	public function get_item_permissions_check( $request ) {
		if ( ! $this->current_user_can_access_recommendations()
			|| ! $this->current_user_can_manage_requested_task( $request )
		) {
			return $this->forbidden_error();
		}
		return parent::get_item_permissions_check( $request );
	}

	/**
	 * Check permissions for creating a recommendation.
	 *
	 * @param \WP_REST_Request $request The REST request.
	 *
	 * @return true|\WP_Error
	 */
	public function create_item_permissions_check( $request ) {
		if ( ! $this->current_user_can_access_recommendations() ) {
			return $this->forbidden_error();
		}
		return parent::create_item_permissions_check( $request );
	}

	/**
	 * Check permissions for updating a recommendation.
	 *
	 * @param \WP_REST_Request $request The REST request.
	 *
	 * @return true|\WP_Error
	 */
	public function update_item_permissions_check( $request ) {
		if ( ! $this->current_user_can_access_recommendations()
			|| ! $this->current_user_can_manage_requested_task( $request )
		) {
			return $this->forbidden_error();
		}
		return parent::update_item_permissions_check( $request );
	}

	/**
	 * Check permissions for deleting a recommendation.
	 *
	 * @param \WP_REST_Request $request The REST request.
	 *
	 * @return true|\WP_Error
	 */
	public function delete_item_permissions_check( $request ) {
		if ( ! $this->current_user_can_access_recommendations()
			|| ! $this->current_user_can_manage_requested_task( $request )
		) {
			return $this->forbidden_error();
		}
		return parent::delete_item_permissions_check( $request );
	}

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
