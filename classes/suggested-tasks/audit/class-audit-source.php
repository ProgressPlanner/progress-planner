<?php
/**
 * Interface for a website-audit source.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Audit;

/**
 * An audit source produces a list of findings for a given URL.
 *
 * This is the boundary that lets the audit engine be swapped without touching
 * the code that maps findings to tasks. The local source runs PHP checks (and,
 * where available, the WP core AI client); the remote source will later fetch
 * findings from the Progress Planner SaaS. Both return the same normalized
 * finding shape, so the consumer ({@see Audit_Runner}) never branches on source.
 */
interface Audit_Source {

	/**
	 * Get the findings for a URL.
	 *
	 * Findings are NOT required to be normalized — {@see Audit_Runner::normalize()}
	 * enforces the schema. A source may include passing rules ('status' => 'pass');
	 * only failing rules become tasks.
	 *
	 * @param string $url  The public URL to audit.
	 * @param array  $args Optional source-specific arguments.
	 *
	 * @return array<int, array<string, mixed>> List of findings.
	 */
	public function get_findings( string $url, array $args = [] ): array;

	/**
	 * Get the stable identifier for this source (e.g. 'local-connector', 'remote-saas').
	 *
	 * @return string
	 */
	public function get_id(): string;

	/**
	 * Whether this source can run right now.
	 *
	 * The local source is always available (it can always run PHP checks). The
	 * remote source requires a license key; the AI layer requires a configured
	 * WP core connector.
	 *
	 * @return bool
	 */
	public function is_available(): bool;
}
