<?php
/**
 * Reading and applying recommendations on behalf of an agent.
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
	 * Apply a recommendation.
	 *
	 * @param array<string, mixed> $input The ability input.
	 *
	 * @return array<string, mixed>|\WP_Error
	 */
	public function complete( $input = [] ) {
		$provider_id = isset( $input['provider_id'] ) ? (string) $input['provider_id'] : '';
		$value       = isset( $input['value'] ) ? (string) $input['value'] : null;

		if ( '' === $provider_id ) {
			$provider_id = $this->get_next_fixable_provider_id();

			if ( '' === $provider_id ) {
				return [
					'applied'   => false,
					'status'    => 'nothing_to_do',
					'message'   => \__( 'There is no pending recommendation that can be applied automatically.', 'progress-planner' ),
					'task'      => null,
					'admin_url' => '',
				];
			}
		}

		$task = $this->find_pending_task( $provider_id );

		if ( null === $task ) {
			return new \WP_Error(
				'progress_planner_no_such_recommendation',
				\__( 'There is no pending recommendation for that provider.', 'progress-planner' ),
				[ 'status' => 404 ]
			);
		}

		$provider = $this->get_provider( $provider_id );

		// The provider's own capability check, the same one the popover runs.
		if ( ! $provider || ! $provider->capability_required() ) {
			return new \WP_Error(
				'progress_planner_cannot_complete',
				\__( 'You do not have permission to complete this recommendation.', 'progress-planner' ),
				[ 'status' => 403 ]
			);
		}

		// Anything outside the fixable list is reported, never half-applied.
		if ( ! Recommendation_Fixes::has_fix( $provider_id ) ) {
			return $this->result(
				false,
				'manual',
				\__( 'This recommendation needs a person: it involves content, a deletion, or a choice that should not be made automatically. Open the link to handle it.', 'progress-planner' ),
				$task
			);
		}

		$applied = Recommendation_Fixes::apply( $provider_id, $value );

		if ( \is_wp_error( $applied ) ) {
			return $applied;
		}

		// Completion is observed, never asserted: the provider decides whether
		// the site now satisfies the task. Saying otherwise would award points
		// for work that did not happen.
		$completed = $this->is_satisfied( $provider, $task );

		return $this->result(
			true,
			$completed ? 'completed' : 'applied_not_yet_complete',
			$completed
				? \__( 'The setting was changed and the recommendation is now satisfied.', 'progress-planner' )
				: \__( 'The setting was changed, but the recommendation is not reported as satisfied yet.', 'progress-planner' ),
			$task
		);
	}

	/**
	 * Build a complete() result.
	 *
	 * @param bool                                   $applied Whether a setting changed.
	 * @param string                                 $status  The outcome status.
	 * @param string                                 $message The human-readable outcome.
	 * @param \Progress_Planner\Suggested_Tasks\Task $task    The task acted on.
	 *
	 * @return array<string, mixed>
	 */
	private function result( $applied, $status, $message, $task ) {
		return [
			'applied'   => $applied,
			'status'    => $status,
			'message'   => $message,
			'task'      => $this->prepare( $task ),
			'admin_url' => (string) $task->url,
		];
	}

	/**
	 * Whether a provider reports its task as already satisfied.
	 *
	 * @param \Progress_Planner\Suggested_Tasks\Tasks_Interface $provider The provider.
	 * @param \Progress_Planner\Suggested_Tasks\Task            $task     The task.
	 *
	 * @return bool
	 */
	private function is_satisfied( $provider, $task ) {
		return \method_exists( $provider, 'is_task_completed' )
			&& (bool) $provider->is_task_completed( $task->get_task_id() );
	}

	/**
	 * Find the highest-priority pending recommendation that can be fixed.
	 *
	 * Tasks come back ordered by menu_order, which is the order the dashboard
	 * shows them in, so "next" means the same thing to an agent as to a person.
	 *
	 * @return string The provider ID, or an empty string when there is none.
	 */
	private function get_next_fixable_provider_id() {
		$tasks = \progress_planner()->get_suggested_tasks_db()->get_tasks_by(
			[
				'post_status'    => 'publish',
				'posts_per_page' => -1,
			]
		);

		foreach ( $tasks as $task ) {
			$provider_id = $task->get_provider_id();

			// A fix needing a value cannot be chosen unattended: there is no
			// correct tagline to invent on the site owner's behalf.
			if ( ! Recommendation_Fixes::has_fix( $provider_id ) || Recommendation_Fixes::needs_value( $provider_id ) ) {
				continue;
			}

			$provider = $this->get_provider( $provider_id );

			if ( ! $provider || ! $provider->capability_required() ) {
				continue;
			}

			// Task evaluation runs on admin_init, so a task fixed a moment ago is
			// still 'publish' here. Skipping the already-satisfied ones stops a
			// repeated run from picking the same task and reporting it as new work.
			if ( $this->is_satisfied( $provider, $task ) ) {
				continue;
			}

			return $provider_id;
		}

		return '';
	}

	/**
	 * Find a pending task for a provider.
	 *
	 * @param string $provider_id The provider ID.
	 *
	 * @return \Progress_Planner\Suggested_Tasks\Task|null
	 */
	private function find_pending_task( $provider_id ) {
		$tasks = \progress_planner()->get_suggested_tasks_db()->get_tasks_by(
			[
				'post_status'    => 'publish',
				'provider'       => $provider_id,
				'posts_per_page' => 1,
			]
		);

		return $tasks ? $tasks[0] : null;
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

		$prepared = [
			'id'          => (string) \progress_planner()->get_suggested_tasks()->get_task_id_from_slug( $task->post_name ),
			'title'       => (string) $task->post_title,
			'description' => (string) $task->description,
			'provider_id' => (string) $provider_id,
			'url'         => (string) $task->url,
			// User-created tasks carry no points of their own; the provider is
			// the reliable source, with the stored value preferred when set.
			'points'      => (int) ( $task->points ?? $provider->get_points() ),
			// Lets a caller plan a run without discovering by trial which
			// recommendations it is allowed to apply.
			'fixable'     => Recommendation_Fixes::has_fix( $provider_id ),
			'needs_value' => Recommendation_Fixes::needs_value( $provider_id ),
		];

		$goal = $this->goal_for( $provider );

		if ( $goal ) {
			$prepared['goal'] = $goal;
		}

		return $prepared;
	}

	/**
	 * Get the goal a recommendation states, when it states one.
	 *
	 * Most recommendations are a title and a sentence, because the plugin knows
	 * how to satisfy them and the caller only has to say go. A recommendation
	 * defined in markdown is the opposite: it describes an outcome and leaves
	 * the method open, because the method depends on which plugins the site
	 * runs and what its settings already say.
	 *
	 * Without this the two are indistinguishable over the wire -- a goal-shaped
	 * recommendation would arrive as a one-line summary with its goal, its
	 * verification and its bounds left behind, which is the whole of what makes
	 * it worth expressing that way.
	 *
	 * Only fields a caller acts on are included. The raw frontmatter is left
	 * out: it duplicates what is already here and exposes how the file happens
	 * to be parsed.
	 *
	 * @param \Progress_Planner\Suggested_Tasks\Tasks_Interface $provider The provider.
	 *
	 * @return array<string, mixed>|null
	 */
	private function goal_for( $provider ) {
		if ( ! $provider instanceof \Progress_Planner\Suggested_Tasks\Providers\Markdown_Rule ) {
			return null;
		}

		$rule = $provider->get_rule();

		$goal = [
			// The goal, how to verify it, the hints and the bounds, as prose.
			'instructions' => (string) ( $rule['instructions'] ?? '' ),
		];

		// Whether the site can answer this on its own, or whether it takes a
		// person to confirm. A caller that assumes the former for a task like
		// "check email arrives" would mark it done having proved nothing.
		foreach ( [ 'verified_by', 'reversible', 'needs_confirmation' ] as $key ) {
			if ( isset( $rule[ $key ] ) ) {
				$goal[ $key ] = (string) $rule[ $key ];
			}
		}

		return $goal;
	}
}
