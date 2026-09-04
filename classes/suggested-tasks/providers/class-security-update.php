<?php
/**
 * Add a high-priority task for pending WordPress core security updates.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Providers;

use Progress_Planner\Utils\Security_Update_Monitor;

/**
 * Add a task for a pending WordPress core security release.
 *
 * While this task is published it locks down the recommendations UI:
 * it is the only task shown until the security update is installed.
 */
class Security_Update extends Tasks {

	/**
	 * The provider ID.
	 *
	 * @var string
	 */
	protected const PROVIDER_ID = 'security-update';

	/**
	 * The capability required to perform the task.
	 *
	 * @var string
	 */
	protected const CAPABILITY = 'update_core';

	/**
	 * Whether the task is repetitive.
	 *
	 * The task persists until the security update is installed.
	 *
	 * @var bool
	 */
	protected $is_repetitive = false;

	/**
	 * Whether the task is dismissable.
	 *
	 * @var bool
	 */
	protected $is_dismissable = false;

	/**
	 * Whether the task is snoozable.
	 *
	 * @var bool
	 */
	protected $is_snoozable = false;

	/**
	 * The task priority. 0 is the highest priority.
	 *
	 * @var int
	 */
	protected $priority = 0;

	/**
	 * The task points.
	 *
	 * @var int
	 */
	protected $points = 2;

	/**
	 * Get the task ID, versioned by the offered security release.
	 *
	 * Each security release gets its own task (e.g. security-update-6-8-2), so a
	 * new release creates a fresh task even after an older one was completed.
	 *
	 * @param array $task_data Optional data to include in the task ID.
	 *
	 * @return string
	 */
	public function get_task_id( $task_data = [] ) {
		$pending = Security_Update_Monitor::get_pending_security_update();

		return null === $pending
			? static::PROVIDER_ID
			: static::PROVIDER_ID . '-' . \str_replace( '.', '-', $pending['offered'] );
	}

	/**
	 * Get the task URL.
	 *
	 * @return string
	 */
	protected function get_url() {
		return \admin_url( 'update-core.php' );
	}

	/**
	 * Get the task title.
	 *
	 * @return string
	 */
	protected function get_title() {
		$pending = Security_Update_Monitor::get_pending_security_update();

		return null === $pending
			? \esc_html__( 'Install the WordPress security update', 'progress-planner' )
			: \sprintf(
				/* translators: %s: The offered WordPress version. */
				\esc_html__( 'Install the WordPress %s security update', 'progress-planner' ),
				$pending['offered']
			);
	}

	/**
	 * Get the task description.
	 *
	 * @return string
	 */
	protected function get_description() {
		return \esc_html__( 'A WordPress security release is available. Security issues are typically exploited within hours of a release, so install this update as soon as possible. If you have a backup solution, make a fresh backup first — but do not postpone the update if you have none.', 'progress-planner' );
	}

	/**
	 * Check if the task should be added.
	 *
	 * @return bool
	 */
	public function should_add_task() {
		return null !== Security_Update_Monitor::get_pending_security_update();
	}

	/**
	 * Check if a specific task is completed.
	 *
	 * @param string $task_id The task ID to check.
	 *
	 * @return bool
	 */
	protected function is_specific_task_completed( $task_id ) {
		$version = $this->get_version_from_task_id( $task_id );

		return '' === $version
			? ! $this->should_add_task()
			: \version_compare( Security_Update_Monitor::get_installed_version(), $version, '>=' );
	}

	/**
	 * Check if the published task is still relevant.
	 *
	 * A task stays relevant while its version is still offered, or once it has been
	 * installed (so evaluation can celebrate it). A withdrawn offer makes the task
	 * irrelevant and it is deleted without celebration.
	 *
	 * @return bool
	 */
	public function is_task_relevant() {
		$tasks = (array) \progress_planner()->get_suggested_tasks_db()->get_tasks_by(
			[
				'post_status' => 'publish',
				'provider_id' => static::PROVIDER_ID,
			]
		);

		if ( empty( $tasks ) ) {
			return true;
		}

		$version = $this->get_version_from_task_id( (string) $tasks[0]->post_name );
		if ( '' === $version ) {
			return false;
		}

		// Already installed: keep the task so evaluation can celebrate it.
		if ( \version_compare( Security_Update_Monitor::get_installed_version(), $version, '>=' ) ) {
			return true;
		}

		// Otherwise the task is only relevant while its version is still offered.
		$pending = Security_Update_Monitor::get_pending_security_update();

		return null !== $pending && $pending['offered'] === $version;
	}

	/**
	 * Get an array of tasks to inject.
	 *
	 * Removes published tasks for superseded or withdrawn releases before
	 * injecting the task for the currently offered release.
	 *
	 * @return array
	 */
	public function get_tasks_to_inject() {
		$current_task_id = $this->should_add_task() ? $this->get_task_id() : '';

		foreach ( (array) \progress_planner()->get_suggested_tasks_db()->get_tasks_by(
			[
				'post_status' => 'publish',
				'provider_id' => static::PROVIDER_ID,
			]
		) as $task ) {
			$task_id = \progress_planner()->get_suggested_tasks()->get_task_id_from_slug( (string) $task->post_name );
			$version = $this->get_version_from_task_id( $task_id );

			// Keep the task for the current offer, and completed-but-not-yet-celebrated tasks.
			if ( $task_id === $current_task_id
				|| ( '' !== $version && \version_compare( Security_Update_Monitor::get_installed_version(), $version, '>=' ) )
			) {
				continue;
			}

			\progress_planner()->get_suggested_tasks_db()->delete_recommendation( $task->ID );
		}

		return parent::get_tasks_to_inject();
	}

	/**
	 * Add the offered and installed versions to the injected task data.
	 *
	 * @param array $task_data The task data.
	 *
	 * @return array
	 */
	protected function modify_injection_task_data( $task_data ) {
		$pending = Security_Update_Monitor::get_pending_security_update();

		if ( null !== $pending ) {
			$task_data['offered_version']   = $pending['offered'];
			$task_data['installed_version'] = $pending['installed'];
		}

		return $task_data;
	}

	/**
	 * Add task actions specific to this task.
	 *
	 * The wp-admin Updates page only lists the latest release (get_core_updates()
	 * skips "autoupdate" offers), so a branch-behind site would only be offered the
	 * next major there. This form posts the exact branch version and locale to
	 * core's own do-core-upgrade handler, which accepts any offer in the transient.
	 *
	 * @param array $data    The task data.
	 * @param array $actions The existing actions.
	 *
	 * @return array
	 */
	public function add_task_actions( $data = [], $actions = [] ) {
		$offer = Security_Update_Monitor::get_pending_security_update_offer();

		if ( null !== $offer ) {
			$form_action = \is_multisite()
				? \network_admin_url( 'update-core.php?action=do-core-upgrade' )
				: \admin_url( 'update-core.php?action=do-core-upgrade' );
			$locale      = $offer->locale ?? 'en_US';

			$actions[] = [
				'priority' => 5,
				'html'     => '<form method="post" action="' . \esc_url( $form_action ) . '" class="prpl-security-update-form">'
					. \wp_nonce_field( 'upgrade-core', '_wpnonce', true, false )
					. '<input type="hidden" name="upgrade" value="1">'
					. '<input type="hidden" name="version" value="' . \esc_attr( $offer->current ) . '">'
					. '<input type="hidden" name="locale" value="' . \esc_attr( $locale ) . '">'
					. '<button type="submit" class="prpl-tooltip-action-text">'
					. \sprintf(
						/* translators: %s: The offered WordPress version. */
						\esc_html__( 'Update to WordPress %s now', 'progress-planner' ),
						\esc_html( $offer->current )
					)
					. '</button>'
					. '</form>',
			];
		}

		$actions[] = [
			'priority' => 10,
			'html'     => '<a class="prpl-tooltip-action-text" href="' . \admin_url( 'update-core.php' ) . '" target="_self">' . \esc_html__( 'Go to the Updates page', 'progress-planner' ) . '</a>',
		];

		return $actions;
	}

	/**
	 * Extract the version from a versioned task ID.
	 *
	 * @param string $task_id The task ID (e.g. security-update-6-8-2).
	 *
	 * @return string The version (e.g. 6.8.2), or an empty string.
	 */
	private function get_version_from_task_id( $task_id ) {
		if ( ! \preg_match( '/^' . static::PROVIDER_ID . '-(\d+(?:-\d+)*)$/', $task_id, $matches ) ) {
			return '';
		}

		return \str_replace( '-', '.', $matches[1] );
	}
}
