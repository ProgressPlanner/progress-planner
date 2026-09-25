<?php
/**
 * Local audit source: deterministic PHP checks + optional WP core AI client.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Audit;

use Progress_Planner\Suggested_Tasks\Audit\Checks\Checks_Registry;

/**
 * Local audit source (phase C).
 *
 * Runs the deterministic PHP checks, then — if a WP core AI connector is
 * configured — asks the LLM to audit the remaining spec rules via the
 * specification.website MCP server. Deterministic findings always win on
 * overlapping rule IDs: they are exact and free, so there is no reason to spend
 * tokens re-deciding them.
 *
 * If the AI layer is unavailable (no WP 7.0, no connector, MCP unreachable),
 * this source still returns the full set of deterministic findings, so the
 * feature degrades gracefully to a no-AI audit.
 */
class Local_Audit_Source implements Audit_Source {

	/**
	 * The deterministic checks registry.
	 *
	 * @var Checks_Registry
	 */
	protected $checks_registry;

	/**
	 * The (optional) AI/MCP client.
	 *
	 * @var Spec_Mcp_Client
	 */
	protected $mcp_client;

	/**
	 * Constructor.
	 *
	 * @param Checks_Registry|null $checks_registry The checks registry.
	 * @param Spec_Mcp_Client|null $mcp_client      The AI/MCP client.
	 */
	public function __construct( ?Checks_Registry $checks_registry = null, ?Spec_Mcp_Client $mcp_client = null ) {
		$this->checks_registry = $checks_registry ?? new Checks_Registry();
		$this->mcp_client      = $mcp_client ?? new Spec_Mcp_Client();
	}

	/**
	 * {@inheritDoc}
	 *
	 * @return string
	 */
	public function get_id(): string {
		return 'local-connector';
	}

	/**
	 * The local source can always run (deterministic checks need no connector).
	 *
	 * @return bool
	 */
	public function is_available(): bool {
		return true;
	}

	/**
	 * {@inheritDoc}
	 *
	 * @param string $url  The URL to audit.
	 * @param array  $args Optional arguments.
	 *
	 * @return array<int, array<string, mixed>>
	 */
	public function get_findings( string $url, array $args = [] ): array {
		$php_findings = $this->checks_registry->run( $url );

		// Index deterministic findings by rule so they pre-empt any LLM finding.
		$by_rule = [];
		foreach ( $php_findings as $finding ) {
			if ( ! empty( $finding['rule_id'] ) ) {
				$by_rule[ (string) $finding['rule_id'] ] = $finding;
			}
		}

		// Layer in the AI findings only when a connector is configured.
		if ( $this->mcp_client->is_available() ) {
			foreach ( $this->mcp_client->audit_url( $url ) as $finding ) {
				$rule_id = empty( $finding['rule_id'] ) ? '' : (string) $finding['rule_id'];
				if ( '' === $rule_id || isset( $by_rule[ $rule_id ] ) ) {
					continue; // Deterministic check already covers this rule.
				}
				$by_rule[ $rule_id ] = $finding;
			}
		}

		return \array_values( $by_rule );
	}
}
