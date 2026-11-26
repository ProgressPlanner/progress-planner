<?php
/**
 * Runs the active audit source and normalizes its findings.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Audit;

/**
 * Audit runner.
 *
 * The single consumer of {@see Audit_Source}. It selects the active source,
 * runs it against the site's public URL, and normalizes every finding to the
 * canonical schema. This class is identical across the local (phase C) and
 * remote-SaaS (phase B) engines — only the chosen source differs.
 */
class Audit_Runner {

	/**
	 * Allowed severities, mapped to task priority (lower value = higher priority).
	 *
	 * @var array<string, int>
	 */
	public const SEVERITY_PRIORITY = [
		'high'   => 20,
		'medium' => 50,
		'low'    => 80,
	];

	/**
	 * Allowed finding statuses.
	 *
	 * @var array<int, string>
	 */
	public const STATUSES = [ 'fail', 'pass' ];

	/**
	 * Get the active audit source.
	 *
	 * Defaults to the local source. Filterable so phase B (or tests) can swap in
	 * the remote SaaS source without touching the consumer.
	 *
	 * @return Audit_Source
	 */
	public function get_source(): Audit_Source {
		$source = new Local_Audit_Source();

		/**
		 * Filter the active audit source.
		 *
		 * @param Audit_Source $source The default (local) audit source.
		 */
		$source = \apply_filters( 'progress_planner_audit_source', $source );

		// A third-party filter could return anything; fall back to the local source.
		return $source instanceof Audit_Source ? $source : new Local_Audit_Source(); // @phpstan-ignore-line instanceof.alwaysTrue
	}

	/**
	 * Get the URL to audit (the site's public home URL).
	 *
	 * @return string
	 */
	public function get_audit_url(): string {
		/**
		 * Filter the URL audited against the specification.
		 *
		 * @param string $url The site's public home URL.
		 */
		return (string) \apply_filters( 'progress_planner_audit_url', \home_url( '/' ) );
	}

	/**
	 * Run the audit and return normalized findings.
	 *
	 * @return array<int, array<string, mixed>> Normalized findings.
	 */
	public function run(): array {
		$source = $this->get_source();

		if ( ! $source->is_available() ) {
			return [];
		}

		$findings = $source->get_findings( $this->get_audit_url() );

		return $this->normalize( $findings );
	}

	/**
	 * Normalize a raw list of findings to the canonical schema.
	 *
	 * Drops findings without a rule_id, clamps severity/status to allowed values,
	 * and sanitizes user-facing strings. Duplicate rule_ids keep the first
	 * occurrence (sources should pre-empt by ordering deterministic checks first).
	 *
	 * @param array<int, mixed> $findings Raw findings.
	 *
	 * @return array<int, array<string, mixed>> Normalized findings.
	 */
	public function normalize( array $findings ): array {
		$normalized = [];
		$seen       = [];

		foreach ( $findings as $finding ) {
			if ( ! \is_array( $finding ) || empty( $finding['rule_id'] ) ) {
				continue;
			}

			$rule_id = \sanitize_title( (string) $finding['rule_id'] );
			if ( '' === $rule_id || isset( $seen[ $rule_id ] ) ) {
				continue;
			}
			$seen[ $rule_id ] = true;

			$raw_severity = isset( $finding['severity'] ) ? (string) $finding['severity'] : '';
			$severity     = isset( self::SEVERITY_PRIORITY[ $raw_severity ] ) ? $raw_severity : 'medium';

			$status = isset( $finding['status'] ) && \in_array( $finding['status'], self::STATUSES, true )
				? (string) $finding['status']
				: 'fail';

			$normalized[] = [
				'rule_id'     => $rule_id,
				'category'    => isset( $finding['category'] ) ? \sanitize_key( (string) $finding['category'] ) : 'basics',
				'title'       => isset( $finding['title'] ) ? \sanitize_text_field( (string) $finding['title'] ) : '',
				'description' => isset( $finding['description'] ) ? \wp_kses_post( (string) $finding['description'] ) : '',
				'severity'    => $severity,
				'status'      => $status,
				'doc_url'     => isset( $finding['doc_url'] ) ? \esc_url_raw( (string) $finding['doc_url'] ) : '',
				'fix_url'     => isset( $finding['fix_url'] ) ? \esc_url_raw( (string) $finding['fix_url'] ) : '',
				'source'      => isset( $finding['source'] ) ? \sanitize_key( (string) $finding['source'] ) : '',
			];
		}

		return $normalized;
	}

	/**
	 * Filter a normalized findings list down to failing findings only.
	 *
	 * @param array<int, array<string, mixed>> $findings Normalized findings.
	 *
	 * @return array<int, array<string, mixed>> Failing findings.
	 */
	public static function failing( array $findings ): array {
		return \array_values(
			\array_filter(
				$findings,
				static fn( $finding ) => isset( $finding['status'] ) && 'fail' === $finding['status']
			)
		);
	}

	/**
	 * Map a severity to a task priority value.
	 *
	 * @param string $severity The finding severity.
	 *
	 * @return int
	 */
	public static function severity_to_priority( string $severity ): int {
		return self::SEVERITY_PRIORITY[ $severity ] ?? self::SEVERITY_PRIORITY['medium'];
	}
}
