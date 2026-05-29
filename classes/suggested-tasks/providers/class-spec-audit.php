<?php
/**
 * Task provider for specification.website audit findings.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Providers;

use Progress_Planner\Suggested_Tasks\Data_Collector\Spec_Audit as Spec_Audit_Data_Collector;
use Progress_Planner\Suggested_Tasks\Audit\Audit_Runner;

/**
 * Turns failing audit findings into suggested tasks.
 *
 * Behaves like a queue: the data collector holds every failing rule, and this
 * provider releases at most N of them per window (default 1/day, filterable) so
 * the user isn't flooded. Each failing rule maps to one durable task keyed by
 * the rule ID; completion is re-checked per rule by re-reading the audit.
 */
class Spec_Audit extends Tasks {

	/**
	 * The provider ID.
	 *
	 * @var string
	 */
	protected const PROVIDER_ID = 'spec-audit';

	/**
	 * The data collector class name.
	 *
	 * @var string
	 */
	protected const DATA_COLLECTOR_CLASS = Spec_Audit_Data_Collector::class;

	/**
	 * Whether the task is dismissable.
	 *
	 * @var bool
	 */
	protected $is_dismissable = true;

	/**
	 * The settings key holding throttle bookkeeping.
	 *
	 * @var string
	 */
	protected const SETTINGS_KEY = 'spec_audit';

	/**
	 * The external link URL for the finding currently being injected.
	 *
	 * @var string
	 */
	protected $external_link_url = '';

	/**
	 * Initialize the task provider.
	 *
	 * @return void
	 */
	public function init() {
		\add_action( 'wp_ajax_progress_planner_run_spec_audit', [ $this, 'ajax_run_audit' ] );
	}

	/**
	 * Get the data collector, typed for this provider.
	 *
	 * @return Spec_Audit_Data_Collector
	 */
	protected function get_audit_collector(): Spec_Audit_Data_Collector {
		$collector = $this->get_data_collector();
		return $collector; // @phpstan-ignore-line return.type
	}

	/**
	 * The maximum number of audit tasks to release per window (filterable).
	 *
	 * @return int
	 */
	protected function get_max_per_window(): int {
		/**
		 * Filter the maximum number of audit tasks released per window.
		 *
		 * Default 1. Raise it locally (e.g. via a mu-plugin) to surface findings
		 * faster during testing.
		 *
		 * @param int $max The maximum number of tasks per window.
		 */
		return \max( 1, (int) \apply_filters( 'progress_planner_spec_audit_max_tasks_per_window', 1 ) );
	}

	/**
	 * The current throttle window key (filterable: 'day' or 'week').
	 *
	 * @return string
	 */
	protected function get_window_key(): string {
		/**
		 * Filter the throttle window granularity.
		 *
		 * @param string $window Either 'day' or 'week'.
		 */
		$window = \apply_filters( 'progress_planner_spec_audit_window', 'day' );

		return 'week' === $window ? \gmdate( 'oW' ) : \gmdate( 'Ymd' );
	}

	/**
	 * Get the number of tasks already released in the current window.
	 *
	 * @return int
	 */
	protected function get_released_this_window(): int {
		$injections = \progress_planner()->get_settings()->get( [ self::SETTINGS_KEY, 'injections' ], [] );
		$window_key = $this->get_window_key();
		return isset( $injections[ $window_key ] ) ? (int) $injections[ $window_key ] : 0;
	}

	/**
	 * Record that a number of tasks were released this window, pruning old windows.
	 *
	 * @param int $count How many tasks were just released.
	 *
	 * @return void
	 */
	protected function record_released( int $count ) {
		if ( $count < 1 ) {
			return;
		}
		$window_key = $this->get_window_key();
		$injections = [
			$window_key => $this->get_released_this_window() + $count,
		];
		\progress_planner()->get_settings()->set( [ self::SETTINGS_KEY, 'injections' ], $injections );
	}

	/**
	 * Get the task ID for a finding.
	 *
	 * @param array $task_data The task data (expects 'rule_id').
	 *
	 * @return string
	 */
	public function get_task_id( $task_data = [] ) {
		return isset( $task_data['rule_id'] ) && '' !== $task_data['rule_id']
			? $this->get_provider_id() . '-' . $task_data['rule_id']
			: $this->get_provider_id();
	}

	/**
	 * Get the title for a finding.
	 *
	 * @param array $task_data The task data.
	 *
	 * @return string
	 */
	protected function get_title_with_data( $task_data = [] ) {
		return isset( $task_data['title'] ) ? (string) $task_data['title'] : '';
	}

	/**
	 * Get the description for a finding.
	 *
	 * @param array $task_data The task data.
	 *
	 * @return string
	 */
	protected function get_description_with_data( $task_data = [] ) {
		return isset( $task_data['description'] ) ? (string) $task_data['description'] : '';
	}

	/**
	 * Get the external "why is this important?" link for a finding.
	 *
	 * @return string
	 */
	public function get_external_link_url() {
		return $this->external_link_url;
	}

	/**
	 * Whether there is at least one failing rule not yet represented by a task.
	 *
	 * @return bool
	 */
	public function should_add_task() {
		return ! empty( $this->get_pending_findings() );
	}

	/**
	 * Get failing findings that are not yet represented by a (non-completed) task.
	 *
	 * Sorted by severity (high first) so the most important issues surface first.
	 *
	 * @return array<int, array<string, mixed>>
	 */
	protected function get_pending_findings(): array {
		$findings = $this->get_audit_collector()->get_failing_findings();

		$pending = [];
		foreach ( $findings as $finding ) {
			$task_id = $this->get_task_id( $finding );

			if ( \progress_planner()->get_suggested_tasks_db()->get_post( $task_id ) ) {
				continue; // Already injected (any status).
			}
			if ( true === \progress_planner()->get_suggested_tasks()->was_task_completed( $task_id ) ) {
				continue; // User already fixed/dismissed it.
			}
			$pending[] = $finding;
		}

		\usort(
			$pending,
			static function ( $a, $b ) {
				return Audit_Runner::severity_to_priority( $a['severity'] ?? 'medium' )
					<=> Audit_Runner::severity_to_priority( $b['severity'] ?? 'medium' );
			}
		);

		return $pending;
	}

	/**
	 * Build task data from a finding.
	 *
	 * @param array $finding The normalized finding.
	 *
	 * @return array<string, mixed>
	 */
	protected function build_task_data( array $finding ): array {
		$this->external_link_url = $finding['doc_url'] ?? '';
		$this->priority          = Audit_Runner::severity_to_priority( $finding['severity'] ?? 'medium' );
		$this->url               = ! empty( $finding['fix_url'] ) ? $finding['fix_url'] : '';
		$this->url_target        = '_blank';

		$task_data             = $this->get_task_details( $finding );
		$task_data['rule_id']  = $finding['rule_id'];
		$task_data['category'] = $finding['category'] ?? 'basics';
		$task_data['severity'] = $finding['severity'] ?? 'medium';

		return $task_data;
	}

	/**
	 * Inject up to the per-window limit of pending findings as tasks.
	 *
	 * @return array<int, int> Created post IDs.
	 */
	public function get_tasks_to_inject() {
		if ( true === $this->is_task_snoozed() ) {
			return [];
		}

		$limit    = $this->get_max_per_window();
		$released = $this->get_released_this_window();
		if ( $released >= $limit ) {
			return [];
		}

		$pending = $this->get_pending_findings();
		if ( empty( $pending ) ) {
			return [];
		}

		$to_release = \array_slice( $pending, 0, $limit - $released );

		$created = [];
		foreach ( $to_release as $finding ) {
			$task_data = $this->build_task_data( $finding );

			if ( \progress_planner()->get_suggested_tasks_db()->get_post( $task_data['task_id'] ) ) {
				continue;
			}

			$post_id = \progress_planner()->get_suggested_tasks_db()->add( $task_data );
			if ( $post_id ) {
				$created[] = $post_id;
			}
		}

		$this->record_released( \count( $created ) );

		return $created;
	}

	/**
	 * A spec-audit task is complete when its rule now passes (or is gone).
	 *
	 * @param string $task_id The task ID to check.
	 *
	 * @return bool
	 */
	protected function is_specific_task_completed( $task_id ) {
		$rule_id = $this->get_rule_id_from_task_id( $task_id );
		if ( '' === $rule_id ) {
			return false;
		}

		$finding = $this->get_audit_collector()->get_finding( $rule_id );

		// Rule no longer reported as failing -> the user fixed it.
		if ( null === $finding ) {
			return true;
		}

		return isset( $finding['status'] ) && 'pass' === $finding['status'];
	}

	/**
	 * Extract the rule ID from a task ID.
	 *
	 * @param string $task_id The task ID.
	 *
	 * @return string
	 */
	protected function get_rule_id_from_task_id( string $task_id ): string {
		$prefix = $this->get_provider_id() . '-';
		return 0 === \strpos( $task_id, $prefix ) ? \substr( $task_id, \strlen( $prefix ) ) : '';
	}

	/**
	 * AJAX handler for the manual "run audit now" trigger.
	 *
	 * @return void
	 */
	public function ajax_run_audit() {
		if ( ! \current_user_can( static::CAPABILITY ) ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'You do not have permission to run the audit.', 'progress-planner' ) ] );
		}

		if ( ! \check_ajax_referer( 'progress_planner', 'nonce', false ) ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'Invalid nonce.', 'progress-planner' ) ] );
		}

		$injected = $this->run_audit_now();

		\wp_send_json_success(
			[
				'failing_count'  => \count( $this->get_audit_collector()->get_failing_findings() ),
				'injected_count' => \count( $injected ),
			]
		);
	}

	/**
	 * Refresh the audit cache and inject any newly surfaced tasks.
	 *
	 * Shared by the AJAX handler and the WP-CLI command.
	 *
	 * @return array<int, int> Created post IDs.
	 */
	public function run_audit_now(): array {
		$this->get_audit_collector()->update_cache();
		return $this->get_tasks_to_inject();
	}
}
