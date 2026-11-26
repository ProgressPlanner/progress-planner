<?php
/**
 * Unit tests for the Audit_Runner normalization + the source contract.
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Suggested_Tasks\Audit\Audit_Runner;
use Progress_Planner\Suggested_Tasks\Audit\Audit_Source;
use Progress_Planner\Suggested_Tasks\Audit\Local_Audit_Source;
use Progress_Planner\Suggested_Tasks\Audit\Remote_Audit_Source;
use Progress_Planner\Suggested_Tasks\Audit\Checks\Checks_Registry;
use Progress_Planner\Suggested_Tasks\Audit\Spec_Mcp_Client;

/**
 * Class Spec_Audit_Runner_Test.
 */
class Spec_Audit_Runner_Test extends \WP_UnitTestCase {

	/**
	 * Test that normalize() enforces the schema.
	 *
	 * @return void
	 */
	public function test_normalize_enforces_schema() {
		$runner = new Audit_Runner();

		$raw = [
			// Valid, full finding.
			[
				'rule_id'  => 'Html-Lang-Attribute',
				'category' => 'accessibility',
				'title'    => 'Declare your language',
				'severity' => 'high',
				'status'   => 'fail',
				'doc_url'  => 'https://specification.website/',
			],
			// Missing rule_id -> dropped.
			[
				'title'  => 'No rule id',
				'status' => 'fail',
			],
			// Unknown severity/status -> clamped to defaults.
			[
				'rule_id'  => 'charset-meta',
				'severity' => 'critical',
				'status'   => 'unknown',
			],
			// Not an array -> dropped.
			'garbage',
		];

		$normalized = $runner->normalize( $raw );

		$this->assertCount( 2, $normalized, 'Findings without a rule_id or non-arrays are dropped.' );

		// rule_id is slugified.
		$this->assertSame( 'html-lang-attribute', $normalized[0]['rule_id'] );
		$this->assertSame( 'high', $normalized[0]['severity'] );
		$this->assertSame( 'fail', $normalized[0]['status'] );

		// Unknown severity/status clamp to defaults.
		$this->assertSame( 'medium', $normalized[1]['severity'] );
		$this->assertSame( 'fail', $normalized[1]['status'] );

		// Every normalized finding has the full key set.
		foreach ( $normalized as $finding ) {
			$this->assertSame(
				[ 'rule_id', 'category', 'title', 'description', 'severity', 'status', 'doc_url', 'fix_url', 'source' ],
				\array_keys( $finding )
			);
		}
	}

	/**
	 * Test that duplicate rule_ids keep only the first occurrence.
	 *
	 * @return void
	 */
	public function test_normalize_dedupes_by_rule_id() {
		$runner = new Audit_Runner();

		$normalized = $runner->normalize(
			[
				[
					'rule_id' => 'robots-txt',
					'title'   => 'First',
					'status'  => 'fail',
				],
				[
					'rule_id' => 'robots-txt',
					'title'   => 'Second',
					'status'  => 'pass',
				],
			]
		);

		$this->assertCount( 1, $normalized );
		$this->assertSame( 'First', $normalized[0]['title'] );
	}

	/**
	 * Test the failing() helper filters out passing findings.
	 *
	 * @return void
	 */
	public function test_failing_filters_passing() {
		$findings = [
			[
				'rule_id' => 'a',
				'status'  => 'fail',
			],
			[
				'rule_id' => 'b',
				'status'  => 'pass',
			],
			[
				'rule_id' => 'c',
				'status'  => 'fail',
			],
		];

		$failing = Audit_Runner::failing( $findings );
		$this->assertCount( 2, $failing );
		$this->assertSame( 'a', $failing[0]['rule_id'] );
		$this->assertSame( 'c', $failing[1]['rule_id'] );
	}

	/**
	 * Test that the local source returns PHP-only findings when the AI layer is unavailable.
	 *
	 * @return void
	 */
	public function test_local_source_degrades_to_php_when_ai_unavailable() {
		// A checks registry that returns one deterministic finding without HTTP.
		$registry = new class() extends Checks_Registry {
			/**
			 * Return a fixed finding.
			 *
			 * @param string $url The URL.
			 * @return array<int, array<string, mixed>>
			 */
			public function run( string $url ): array {
				return [
					[
						'rule_id' => 'html-doctype',
						'status'  => 'fail',
						'title'   => 'Add a doctype',
						'source'  => 'php-check',
					],
				];
			}
		};

		// An MCP client that reports itself unavailable.
		$mcp = new class() extends Spec_Mcp_Client {
			/**
			 * Always unavailable.
			 *
			 * @return bool
			 */
			public function is_available(): bool {
				return false;
			}
		};

		$source   = new Local_Audit_Source( $registry, $mcp );
		$findings = $source->get_findings( 'https://example.com' );

		$this->assertCount( 1, $findings );
		$this->assertSame( 'html-doctype', $findings[0]['rule_id'] );
		$this->assertSame( 'php-check', $findings[0]['source'] );
	}

	/**
	 * Test that deterministic findings pre-empt AI findings for the same rule.
	 *
	 * @return void
	 */
	public function test_local_source_php_preempts_ai_on_overlap() {
		$registry = new class() extends Checks_Registry {
			/**
			 * Return a fixed deterministic finding.
			 *
			 * @param string $url The URL.
			 * @return array<int, array<string, mixed>>
			 */
			public function run( string $url ): array {
				return [
					[
						'rule_id' => 'html-doctype',
						'status'  => 'fail',
						'source'  => 'php-check',
					],
				];
			}
		};

		// AI client that "covers" the same rule plus a new one.
		$mcp = new class() extends Spec_Mcp_Client {
			/**
			 * Always available.
			 *
			 * @return bool
			 */
			public function is_available(): bool {
				return true;
			}

			/**
			 * Return overlapping + new findings.
			 *
			 * @param string $url The URL.
			 * @return array<int, array<string, mixed>>
			 */
			public function audit_url( string $url ): array {
				return [
					[
						'rule_id' => 'html-doctype',
						'status'  => 'pass',
						'source'  => 'mcp-llm',
					],
					[
						'rule_id' => 'meta-description',
						'status'  => 'fail',
						'source'  => 'mcp-llm',
					],
				];
			}
		};

		$source   = new Local_Audit_Source( $registry, $mcp );
		$findings = $source->get_findings( 'https://example.com' );

		// Index by rule for clarity.
		$by_rule = [];
		foreach ( $findings as $finding ) {
			$by_rule[ $finding['rule_id'] ] = $finding;
		}

		$this->assertCount( 2, $findings );
		// PHP check wins for the overlapping rule.
		$this->assertSame( 'php-check', $by_rule['html-doctype']['source'] );
		$this->assertSame( 'fail', $by_rule['html-doctype']['status'] );
		// AI-only rule is included.
		$this->assertSame( 'mcp-llm', $by_rule['meta-description']['source'] );
	}

	/**
	 * Test the C/B contract: local and remote sources produce the same finding shape.
	 *
	 * This is the regression guard that keeps the two engines interchangeable.
	 *
	 * @return void
	 */
	public function test_local_and_remote_sources_produce_same_shape() {
		$runner = new Audit_Runner();

		// Local finding (deterministic), normalized.
		$registry = new class() extends Checks_Registry {
			/**
			 * Return a fixed finding.
			 *
			 * @param string $url The URL.
			 * @return array<int, array<string, mixed>>
			 */
			public function run( string $url ): array {
				return [
					[
						'rule_id' => 'html-doctype',
						'status'  => 'fail',
						'title'   => 'Doctype',
						'source'  => 'php-check',
					],
				];
			}
		};
		$mcp      = new class() extends Spec_Mcp_Client {
			/**
			 * Always unavailable.
			 *
			 * @return bool
			 */
			public function is_available(): bool {
				return false;
			}
		};

		$local_source = new Local_Audit_Source( $registry, $mcp );
		$local        = $runner->normalize( $local_source->get_findings( 'https://example.com' ) );

		// Remote finding mapped via the SaaS response shape, normalized.
		$remote_source = new class() extends Remote_Audit_Source {
			/**
			 * Map a canned SaaS response to findings.
			 *
			 * @param string $url  The URL.
			 * @param array  $args Args.
			 * @return array<int, array<string, mixed>>
			 */
			public function get_findings( string $url, array $args = [] ): array {
				return $this->map_response(
					[
						'findings' => [
							[
								'rule_id' => 'html-doctype',
								'status'  => 'fail',
								'title'   => 'Doctype',
							],
						],
					]
				);
			}
		};
		$remote        = $runner->normalize( $remote_source->get_findings( 'https://example.com' ) );

		// Both produce one finding with identical key sets.
		$this->assertCount( 1, $local );
		$this->assertCount( 1, $remote );
		$this->assertSame( \array_keys( $local[0] ), \array_keys( $remote[0] ), 'Local and remote findings must share the same shape.' );
		$this->assertSame( $local[0]['rule_id'], $remote[0]['rule_id'] );
	}

	/**
	 * Test that both sources implement the Audit_Source contract.
	 *
	 * @return void
	 */
	public function test_sources_implement_contract() {
		$this->assertInstanceOf( Audit_Source::class, new Local_Audit_Source() );
		$this->assertInstanceOf( Audit_Source::class, new Remote_Audit_Source() );
	}
}
