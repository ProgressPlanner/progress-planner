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
 * The audit (which may make HTTP requests and, when configured, LLM calls) is
 * expensive, so it runs only when the cache is refreshed — on the daily
 * data-collector cron and on the manual "run audit now" trigger — never on
 * every admin request via {@see collect()}.
 */
class Spec_Audit extends Base_Data_Collector {

	/**
	 * The data key.
	 *
	 * @var string
	 */
	protected const DATA_KEY = 'spec_audit_findings';

	/**
	 * The audit runner.
	 *
	 * @var Audit_Runner|null
	 */
	protected $runner = null;

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
	 * Get only the failing findings from the cached audit.
	 *
	 * @return array<int, array<string, mixed>>
	 */
	public function get_failing_findings(): array {
		$findings = $this->collect();
		return \is_array( $findings ) ? Audit_Runner::failing( $findings ) : [];
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
		if ( ! \is_array( $findings ) ) {
			return null;
		}
		foreach ( $findings as $finding ) {
			if ( isset( $finding['rule_id'] ) && $finding['rule_id'] === $rule_id ) {
				return $finding;
			}
		}
		return null;
	}
}
