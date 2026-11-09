<?php
/**
 * Interface for a deterministic (non-AI) spec check.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Audit\Checks;

/**
 * A deterministic check verifies a single specification rule in PHP.
 *
 * Checks are mechanical — no LLM — so they are fast, free, and unit-testable.
 * The registry fetches the homepage HTML once and hands it to every check.
 */
interface Check {

	/**
	 * The stable rule ID this check reports on (e.g. 'html-lang-attribute').
	 *
	 * @return string
	 */
	public function get_rule_id(): string;

	/**
	 * Run the check.
	 *
	 * @param string $url     The audited URL.
	 * @param string $html    The fetched homepage HTML (may be empty if the fetch failed).
	 * @param array  $context {
	 *     Shared context, so checks don't each make their own request.
	 *
	 *     @type int      $response_code The HTTP status code of the homepage fetch.
	 *     @type string[] $headers       Lower-cased response headers from the homepage fetch.
	 * }
	 *
	 * @return array<string, mixed> A single finding (see Audit_Runner schema), with at least
	 *                              'rule_id' and 'status'.
	 */
	public function run( string $url, string $html, array $context ): array;
}
