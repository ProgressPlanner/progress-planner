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
	 * Post IDs injected this request, pending verification on shutdown that
	 * they still exist. Used to keep the throttle counter honest when an
	 * injected task is removed in the same request (e.g. by an immediate
	 * evaluate_tasks() pass that fires after a cache refresh).
	 *
	 * @var array<int, int>
	 */
	protected $pending_release_ids = [];

	/**
	 * The cron hook that refreshes the audit cache + injects tasks.
	 *
	 * @var string
	 */
	public const CRON_HOOK = 'progress_planner_spec_audit_run';

	/**
	 * Initialize the task provider.
	 *
	 * @return void
	 */
	public function init() {
		\add_action( 'wp_ajax_progress_planner_run_spec_audit', [ $this, 'ajax_run_audit' ] );
		\add_action( 'shutdown', [ $this, 'finalize_throttle_on_shutdown' ] );

		// The audit's outbound HTTP must NEVER block a user-facing request.
		// A dedicated cron hook is the only context (besides explicit CLI/AJAX
		// triggers) where the audit may run; system-cron-driven WP cron keeps it
		// off the web FPM pool entirely.
		\add_action(
			self::CRON_HOOK,
			function () {
				$this->run_audit_now();
			}
		);
		if ( ! \wp_next_scheduled( self::CRON_HOOK ) ) {
			\wp_schedule_event( \time() + DAY_IN_SECONDS, 'daily', self::CRON_HOOK );
		}
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
	 * This method does NO outbound HTTP — it reads findings from the cache
	 * populated by run_audit_now() (which only runs from CLI/AJAX/cron, never
	 * from admin_init). The throttle counter is incremented at shutdown after
	 * verifying each created task survived (handles the case where an
	 * evaluate_tasks() pass in the same request removed it).
	 *
	 * @return array<int, int> Created post IDs (provisional — final count is
	 *                         taken on shutdown).
	 */
	public function get_tasks_to_inject() {
		if ( true === $this->is_task_snoozed() ) {
			return [];
		}

		$limit = $this->get_max_per_window();
		// Count both finalized (counter) and in-flight (pending shutdown
		// verification) releases against the cap, so two calls within the same
		// request can't both blow past the limit.
		$used = $this->get_released_this_window() + \count( $this->pending_release_ids );
		if ( $used >= $limit ) {
			return [];
		}

		$pending = $this->get_pending_findings();
		if ( empty( $pending ) ) {
			return [];
		}

		$to_release = \array_slice( $pending, 0, $limit - $used );

		$created = [];
		foreach ( $to_release as $finding ) {
			$task_data = $this->build_task_data( $finding );

			if ( \progress_planner()->get_suggested_tasks_db()->get_post( $task_data['task_id'] ) ) {
				continue;
			}

			$post_id = \progress_planner()->get_suggested_tasks_db()->add( $task_data );
			if ( $post_id ) {
				$created[]                   = $post_id;
				$this->pending_release_ids[] = $post_id;
			}
		}

		return $created;
	}

	/**
	 * Finalize the per-window throttle counter on shutdown.
	 *
	 * Counts only the tasks injected this request that actually survived (i.e.
	 * were not deleted/trashed by a same-request evaluate_tasks() pass), so the
	 * counter reflects real user-visible throttling rather than transient creates.
	 *
	 * @return void
	 */
	public function finalize_throttle_on_shutdown() {
		if ( empty( $this->pending_release_ids ) ) {
			return;
		}

		$surviving = 0;
		foreach ( $this->pending_release_ids as $post_id ) {
			$post = \get_post( $post_id );
			// A 'publish' task that's still around is the only kind that should
			// consume a window slot; trashed/auto-completed tasks shouldn't.
			if ( $post && 'publish' === $post->post_status ) {
				++$surviving;
			}
		}

		$this->pending_release_ids = [];

		if ( $surviving > 0 ) {
			$this->record_released( $surviving );
		}
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

		$collector = $this->get_audit_collector();
		$findings  = $collector->collect();

		// No cached audit at all -> we don't know; leave the task alone rather
		// than declare it complete (which would happen if we treated the
		// missing finding as "rule no longer reported as failing").
		if ( empty( $findings ) ) {
			return false;
		}

		$finding = $collector->get_finding( $rule_id );

		// Rule no longer reported in a populated audit -> the user fixed it.
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
	 * The audit's outbound HTTP can take seconds, and running it inline would
	 * keep the user's FPM worker busy the whole time. Instead the response is
	 * flushed immediately ("queued") and the audit is run after the worker
	 * detaches from the client (via fastcgi_finish_request() when available),
	 * on the `shutdown` action.
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

		// Defer the actual audit to shutdown so the user's worker can be released
		// back to the FPM pool before the outbound HTTP starts.
		\add_action( 'shutdown', [ $this, 'shutdown_run_audit' ], 5 );

		\wp_send_json_success(
			[
				'queued'         => true,
				'failing_count'  => \count( $this->get_audit_collector()->get_failing_findings() ),
				'injected_count' => 0,
			]
		);
	}

	/**
	 * Run the audit at end-of-request, after the response is flushed.
	 *
	 * Uses fastcgi_finish_request() where available so the FPM worker is freed
	 * back to the pool immediately and the outbound HTTP doesn't hold up the
	 * user's request. Also raises set_time_limit() since the audit may take a
	 * few seconds.
	 *
	 * @return void
	 */
	public function shutdown_run_audit() {
		if ( \function_exists( 'fastcgi_finish_request' ) ) {
			\fastcgi_finish_request();
		}
		// We are now detached from the client; allow more wall-clock time.
		if ( \function_exists( 'set_time_limit' ) ) {
			@\set_time_limit( 60 ); // phpcs:ignore WordPress.PHP.NoSilencedErrors.Discouraged
		}

		$this->run_audit_now();
	}

	/**
	 * Refresh the audit cache and inject any newly surfaced tasks.
	 *
	 * Outbound HTTP runs here. Allowed callers: the WP-CLI command (separate
	 * php process), the cron hook ({@see CRON_HOOK}), and the AJAX shutdown
	 * handler ({@see shutdown_run_audit()}). Never called from `admin_init`,
	 * which would amplify into FPM pool starvation.
	 *
	 * @return array<int, int> Created post IDs.
	 */
	public function run_audit_now(): array {
		$collector = $this->get_audit_collector();
		Spec_Audit_Data_Collector::with_explicit_refresh(
			static function () use ( $collector ) {
				$collector->update_cache();
			}
		);
		return $this->get_tasks_to_inject();
	}
}
