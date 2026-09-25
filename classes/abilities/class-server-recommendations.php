<?php
/**
 * Complete a recommendation that states a goal rather than a procedure.
 *
 * The other completion ability applies a recommendation the plugin knows how to
 * satisfy: it looks the provider up in a table, writes the option named there
 * and reports what changed. A goal-shaped recommendation has no such entry,
 * because the way to satisfy it depends on which plugins the site runs. The
 * caller works that out, does the work, and calls this to say so.
 *
 * Completion is the same event either way. This does not write its own activity
 * row or invent a status: it calls the method the email link calls, so points,
 * badges, streaks and the score move exactly as they do when a person clicks
 * the button in wp-admin.
 *
 * WHAT THIS TRUSTS, AND WHAT IT DOES NOT
 *
 * A recommendation verifiable from the site's own state is taken on trust: the
 * caller can fetch the URL or read the option, and so can anyone checking
 * afterwards. One that only a person can confirm is not. Those carry
 * `verified_by: owner_confirmation` precisely because the answer lives
 * somewhere the caller cannot reach -- whether an email actually arrived is the
 * case that prompted it -- so this refuses unless the caller states the site
 * owner confirmed it.
 *
 * That asymmetry is the whole of the trust model. It is deliberately not an
 * audit log: what an agent did belongs at the layer every tool call passes
 * through, not in each plugin that offers one.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Abilities;

/**
 * Server_Recommendations class.
 */
class Server_Recommendations {

	/**
	 * Mark a goal-shaped recommendation as completed.
	 *
	 * @param array<string, mixed> $input The ability input.
	 *
	 * @return array<string, mixed>|\WP_Error
	 */
	public function complete( $input ) {
		$task_id = isset( $input['id'] ) ? (string) $input['id'] : '';

		if ( '' === $task_id ) {
			return new \WP_Error(
				'progress_planner_missing_id',
				\__( 'No recommendation ID was given.', 'progress-planner' ),
				[ 'status' => 400 ]
			);
		}

		$task = \progress_planner()->get_suggested_tasks_db()->get_post( $task_id );

		if ( ! $task ) {
			return new \WP_Error(
				'progress_planner_not_found',
				\__( 'There is no recommendation with that ID.', 'progress-planner' ),
				[ 'status' => 404 ]
			);
		}

		$provider = \progress_planner()->get_suggested_tasks()->get_tasks_manager()->get_task_provider( $task->get_provider_id() );

		// A recommendation the plugin knows how to apply has its own ability,
		// which changes the setting and reports what it changed. Completing it
		// here would mark it done without doing it.
		if ( ! $provider instanceof \Progress_Planner\Suggested_Tasks\Providers\Markdown_Rule ) {
			return new \WP_Error(
				'progress_planner_not_a_goal',
				\__( 'That recommendation is not goal-shaped. Use complete-recommendation to apply it.', 'progress-planner' ),
				[ 'status' => 400 ]
			);
		}

		// The same gate the listing applies before offering the recommendation
		// at all, checked again because nothing guarantees the two calls came
		// from the same user.
		if ( ! $provider->capability_required() ) {
			return new \WP_Error(
				'progress_planner_forbidden',
				\__( 'You are not allowed to complete this recommendation.', 'progress-planner' ),
				[ 'status' => 403 ]
			);
		}

		// Completing twice would score twice. The stored post status is read
		// rather than the task object's copy of it: the object is rebuilt from
		// a cache this update does not invalidate, so within one request it can
		// still report the status the task had before it was completed.
		$stored_status = \get_post_status( $task->ID );

		if ( \in_array( $stored_status, [ 'trash', 'pending' ], true ) ) {
			return [
				'completed' => false,
				'status'    => 'already_completed',
				'message'   => \__( 'That recommendation was already completed.', 'progress-planner' ),
				'points'    => 0,
			];
		}

		$rule = $provider->get_rule();

		if ( 'owner_confirmation' === ( $rule['verified_by'] ?? 'site_state' ) && true !== ( $input['owner_confirmed'] ?? false ) ) {
			return new \WP_Error(
				'progress_planner_needs_owner_confirmation',
				\__( 'This recommendation can only be confirmed by the site owner, because the result is not visible from the site itself. Ask them to confirm, then call again with owner_confirmed set to true.', 'progress-planner' ),
				[ 'status' => 400 ]
			);
		}

		// 'pending' is what completion means for a recommendation, and what the
		// email link sets. Not 'trash': a trashed task cannot be read back, so
		// was_task_completed() stops recognising it and a second call reports
		// the recommendation missing rather than already done.
		\progress_planner()->get_suggested_tasks_db()->update_recommendation( $task->ID, [ 'post_status' => 'pending' ] );

		// update_recommendation() does not flush the task cache, so without this
		// a second call in the same request reads the status from before the
		// update and completes the recommendation again.
		\wp_cache_flush_group( \Progress_Planner\Suggested_Tasks_DB::GET_TASKS_CACHE_GROUP );

		\progress_planner()->get_suggested_tasks()->insert_activity( $task_id );

		return [
			'completed' => true,
			'status'    => 'completed',
			'message'   => \__( 'The recommendation is marked as completed.', 'progress-planner' ),
			'points'    => (int) $provider->get_points(),
		];
	}
}
