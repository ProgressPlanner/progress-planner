<?php
/**
 * Reading recommendations on behalf of an agent.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Abilities;

/**
 * Recommendations class.
 */
class Recommendations {

	/**
	 * Map an ability status onto the post status that encodes it.
	 *
	 * @param string $status The ability status.
	 *
	 * @return string
	 */
	private function get_post_status_for( $status ) {
		switch ( $status ) {
			case 'completed':
				return 'trash';

			case 'snoozed':
				return 'future';

			default:
				return 'publish';
		}
	}

	/**
	 * List the recommendations.
	 *
	 * Task evaluation runs on admin_init, so this reports stored state rather
	 * than re-running it: an agent request is not an admin request, and
	 * evaluating here would mean a read silently writes.
	 *
	 * @param array<string, mixed> $input The ability input.
	 *
	 * @return array<string, mixed>
	 */
	public function list( $input = [] ) {
		$query_args = [
			'post_status'    => $this->get_post_status_for( isset( $input['status'] ) ? (string) $input['status'] : 'pending' ),
			'posts_per_page' => isset( $input['limit'] ) ? (int) $input['limit'] : 20,
		];

		if ( ! empty( $input['provider'] ) ) {
			$query_args['provider'] = (string) $input['provider'];
		}

		$recommendations = [];
		foreach ( \progress_planner()->get_suggested_tasks_db()->get_tasks_by( $query_args ) as $task ) {
			$prepared = $this->prepare( $task );

			if ( null !== $prepared ) {
				$recommendations[] = $prepared;
			}
		}

		return [
			'recommendations' => $recommendations,
			'count'           => \count( $recommendations ),
		];
	}

	/**
	 * Get a task provider.
	 *
	 * @param string $provider_id The provider ID.
	 *
	 * @return \Progress_Planner\Suggested_Tasks\Tasks_Interface|null
	 */
	private function get_provider( $provider_id ) {
		return \progress_planner()->get_suggested_tasks()->get_tasks_manager()->get_task_provider( $provider_id );
	}

	/**
	 * Prepare one recommendation for output.
	 *
	 * Returns null when the provider that owns the task is not available to the
	 * current user, so the list never advertises work they cannot do.
	 *
	 * @param \Progress_Planner\Suggested_Tasks\Task $task The task.
	 *
	 * @return array<string, mixed>|null
	 */
	private function prepare( $task ) {
		$provider_id = $task->get_provider_id();
		$provider    = $this->get_provider( $provider_id );

		// A task whose provider is gone (a deactivated integration) has no
		// capability to check and no action to offer, so it is omitted.
		if ( ! $provider || ! $provider->capability_required() ) {
			return null;
		}

		return [
			'id'          => (string) \progress_planner()->get_suggested_tasks()->get_task_id_from_slug( $task->post_name ),
			'title'       => (string) $task->post_title,
			'description' => (string) $task->description,
			'provider_id' => (string) $provider_id,
			'url'         => (string) $task->url,
			// User-created tasks carry no points of their own; the provider is
			// the reliable source, with the stored value preferred when set.
			'points'      => (int) ( $task->points ?? $provider->get_points() ),
		];
	}
}
