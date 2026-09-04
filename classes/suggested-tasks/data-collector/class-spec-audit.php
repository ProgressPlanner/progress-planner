<?php
/**
 * Spec-audit data collector.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Data_Collector;

use Progress_Planner\Suggested_Tasks\Audit\Audit_Runner;

/**
 * Caches the result of running the website audit against the specification.
 *
 * The audit makes outbound HTTP requests (and, when configured, LLM calls), so
 * a stray cache refresh on `admin_init` can starve the FPM pool via loopback.
 * Two guards prevent that:
 *  1. {@see collect()} NEVER falls through to {@see calculate_data()} — a missing
 *     cache returns an empty array, not a live audit.
 *  2. {@see update_cache()} only runs when an explicit caller (the provider's
 *     CLI / cron / AJAX-shutdown path) has set {@see $explicit_refresh} to true.
 *     The Data_Collector_Manager's sweep on `admin_init` therefore can't trigger
 *     the audit.
 */
class Spec_Audit extends Base_Data_Collector {

	/**
	 * The data key.
	 *
	 * @var string
	 */
	protected const DATA_KEY = 'spec_audit_findings';

	/**
	 * Whether the current call to update_cache() came from a sanctioned caller
	 * (CLI, AJAX shutdown handler, or the dedicated cron hook).
	 *
	 * Static so the data collector loop in Data_Collector_Manager — which
	 * instantiates its own copy — cannot bypass it.
	 *
	 * @var bool
	 */
	protected static $explicit_refresh = false;

	/**
	 * The audit runner.
	 *
	 * @var Audit_Runner|null
	 */
	protected $runner = null;

	/**
	 * Allow the next call to update_cache() to actually perform the audit.
	 *
	 * Sanctioned callers (CLI command, cron hook handler, AJAX shutdown handler)
	 * wrap their refresh call in this flag so the audit doesn't run from the
	 * data-collector-manager's `admin_init` sweep.
	 *
	 * @param callable $callback Invoked while the flag is set. The flag is
	 *                           always cleared on return.
	 *
	 * @return mixed The callback's return value.
	 */
	public static function with_explicit_refresh( callable $callback ) {
		self::$explicit_refresh = true;
		try {
			return $callback();
		} finally {
			self::$explicit_refresh = false;
		}
	}

	/**
	 * Get the audit runner.
	 *
	 * @return Audit_Runner
	 */
	protected function get_runner(): Audit_Runner {
		if ( null === $this->runner ) {
			$this->runner = new Audit_Runner();
		}
		return $this->runner;
	}

	/**
	 * Calculate the data: run the audit and return normalized findings.
	 *
	 * @return array<int, array<string, mixed>>
	 */
	protected function calculate_data() {
		return $this->get_runner()->run();
	}

	/**
	 * Read the cached audit findings; NEVER trigger a live audit.
	 *
	 * The base implementation falls back to calculate_data() on cache miss,
	 * which would make outbound HTTP from any request that happens to hit a
	 * cold cache (e.g. after object-cache flush). Override to short-circuit.
	 *
	 * @return array<int, array<string, mixed>>
	 */
	public function collect() {
		$cached = $this->get_cached_data( $this->get_data_key() );
		return \is_array( $cached ) ? $cached : [];
	}

	/**
	 * Refresh the cache only when an explicit caller has opted in.
	 *
	 * @return void
	 */
	public function update_cache() {
		if ( ! self::$explicit_refresh ) {
			return;
		}
		parent::update_cache();
	}

	/**
	 * Get only the failing findings from the cached audit.
	 *
	 * @return array<int, array<string, mixed>>
	 */
	public function get_failing_findings(): array {
		return Audit_Runner::failing( $this->collect() );
	}

	/**
	 * Get the cached finding for a single rule, if any.
	 *
	 * @param string $rule_id The rule ID.
	 *
	 * @return array<string, mixed>|null
	 */
	public function get_finding( string $rule_id ): ?array {
		$findings = $this->collect();
		foreach ( $findings as $finding ) {
			if ( isset( $finding['rule_id'] ) && $finding['rule_id'] === $rule_id ) {
				return $finding;
			}
		}
		return null;
	}
}
