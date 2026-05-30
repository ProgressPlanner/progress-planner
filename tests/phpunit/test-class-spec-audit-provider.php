<?php
/**
 * Unit tests for the Spec_Audit task provider throttle and completion logic.
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Suggested_Tasks\Providers\Spec_Audit;
use Progress_Planner\Suggested_Tasks\Data_Collector\Spec_Audit as Spec_Audit_Data_Collector;
use Progress_Planner\Suggested_Tasks\Audit\Checks\Check;

/**
 * Class Spec_Audit_Provider_Test.
 */
class Spec_Audit_Provider_Test extends \WP_UnitTestCase {

	/**
	 * The provider instance.
	 *
	 * @var Spec_Audit
	 */
	private $provider;

	/**
	 * Set the current user to admin before the class runs.
	 *
	 * @return void
	 */
	public static function setUpBeforeClass(): void { // phpcs:ignore WordPress.NamingConventions.ValidFunctionName.MethodNameInvalid
		\wp_set_current_user( 1 );
	}

	/**
	 * Reset the current user after the class runs.
	 *
	 * @return void
	 */
	public static function tearDownAfterClass(): void { // phpcs:ignore WordPress.NamingConventions.ValidFunctionName.MethodNameInvalid
		\wp_set_current_user( 0 );
	}

	/**
	 * Set up the test.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();
		$this->provider = new Spec_Audit();

		// Guarantee isolation: Settings uses a static cache that survives across
		// tests in the same process, so explicitly reset the throttle state.
		\progress_planner()->get_settings()->set( 'spec_audit', [] );

		// Most tests use synthetic rule IDs (rule-a, rule-b, etc.) that aren't
		// in the real registry. The provider's retired-rule self-healing would
		// trip on those and mark every task complete. Register stub checks for
		// the synthetic IDs so the retired-rule path doesn't fire.
		\add_filter(
			'progress_planner_audit_checks',
			function ( $checks ) {
				foreach ( [ 'rule-a', 'rule-b', 'rule-c', 'low-rule', 'medium-rule', 'high-rule' ] as $rid ) {
					$checks[] = new class($rid) implements Check {
						/**
						 * The rule ID.
						 *
						 * @var string
						 */
						private $rid;
						/**
						 * Constructor.
						 *
						 * @param string $rid Rule ID.
						 */
						public function __construct( string $rid ) {
							$this->rid = $rid;
						}
						/**
						 * Rule ID.
						 *
						 * @return string
						 */
						public function get_rule_id(): string {
							return $this->rid;
						}
						/**
						 * No-op run.
						 *
						 * @param string $url     URL.
						 * @param string $html    HTML.
						 * @param array  $context Context.
						 * @return array<string, mixed>
						 */
						public function run( string $url, string $html, array $context ): array {
							return [];
						}
					};
				}
				return $checks;
			}
		);
	}

	/**
	 * Clean up after the test.
	 *
	 * @return void
	 */
	public function tearDown(): void {
		\progress_planner()->get_suggested_tasks_db()->delete_all_recommendations();
		\progress_planner()->get_settings()->set( 'spec_audit', [] );
		// Clear the seeded collector cache.
		$data = \progress_planner()->get_settings()->get( 'progress_planner_data_collector', [] );
		unset( $data['spec_audit_findings'] );
		\progress_planner()->get_settings()->set( 'progress_planner_data_collector', $data );

		\remove_all_filters( 'progress_planner_spec_audit_max_tasks_per_window' );
		\remove_all_filters( 'progress_planner_spec_audit_window' );
		\remove_all_filters( 'progress_planner_audit_checks' );

		parent::tearDown();
	}

	/**
	 * Seed the audit data-collector cache with the given findings.
	 *
	 * @param array<int, array<string, mixed>> $findings The findings to cache.
	 *
	 * @return void
	 */
	private function seed_findings( array $findings ) {
		$data                        = \progress_planner()->get_settings()->get( 'progress_planner_data_collector', [] );
		$data['spec_audit_findings'] = $findings;
		\progress_planner()->get_settings()->set( 'progress_planner_data_collector', $data );
	}

	/**
	 * Build a normalized-shape failing finding.
	 *
	 * @param string $rule_id  The rule ID.
	 * @param string $severity The severity.
	 *
	 * @return array<string, mixed>
	 */
	private function finding( string $rule_id, string $severity = 'medium' ): array {
		return [
			'rule_id'     => $rule_id,
			'category'    => 'basics',
			'title'       => 'Fix ' . $rule_id,
			'description' => 'Description for ' . $rule_id,
			'severity'    => $severity,
			'status'      => 'fail',
			'doc_url'     => 'https://specification.website/',
			'fix_url'     => '',
			'source'      => 'php-check',
		];
	}

	/**
	 * Test that only one task is released per window by default.
	 *
	 * @return void
	 */
	public function test_throttle_releases_one_per_window_by_default() {
		$this->seed_findings(
			[
				$this->finding( 'rule-a' ),
				$this->finding( 'rule-b' ),
				$this->finding( 'rule-c' ),
			]
		);

		// First injection: exactly one task.
		$created = $this->provider->get_tasks_to_inject();
		$this->assertCount( 1, $created, 'Default throttle releases exactly one task.' );

		// Second injection in the same window: nothing more.
		$created_again = $this->provider->get_tasks_to_inject();
		$this->assertCount( 0, $created_again, 'No further tasks released in the same window.' );
	}

	/**
	 * Test that the per-window limit filter raises the cap.
	 *
	 * @return void
	 */
	public function test_filter_raises_limit() {
		\add_filter( 'progress_planner_spec_audit_max_tasks_per_window', fn() => 3 );

		$this->seed_findings(
			[
				$this->finding( 'rule-a' ),
				$this->finding( 'rule-b' ),
				$this->finding( 'rule-c' ),
			]
		);

		$created = $this->provider->get_tasks_to_inject();
		$this->assertCount( 3, $created, 'Filter raises the per-window limit to 3.' );
	}

	/**
	 * Test that higher-severity findings are released first.
	 *
	 * @return void
	 */
	public function test_high_severity_released_first() {
		$this->seed_findings(
			[
				$this->finding( 'low-rule', 'low' ),
				$this->finding( 'high-rule', 'high' ),
				$this->finding( 'medium-rule', 'medium' ),
			]
		);

		$created = $this->provider->get_tasks_to_inject();
		$this->assertCount( 1, $created );

		$task = \get_post( $created[0] );
		$this->assertNotNull( $task );
		$this->assertStringContainsString( 'high-rule', (string) $task->post_name );
	}

	/**
	 * Test that an already-injected rule is not re-injected.
	 *
	 * @return void
	 */
	public function test_already_injected_rule_not_repeated() {
		\add_filter( 'progress_planner_spec_audit_max_tasks_per_window', fn() => 10 );

		$this->seed_findings( [ $this->finding( 'rule-a' ) ] );

		$first = $this->provider->get_tasks_to_inject();
		$this->assertCount( 1, $first );

		// Reset the window counter, but the task already exists in the DB.
		\progress_planner()->get_settings()->set( 'spec_audit', [] );

		$second = $this->provider->get_tasks_to_inject();
		$this->assertCount( 0, $second, 'A rule already represented by a task is not re-injected.' );
	}

	/**
	 * Test the task ID is stable and derived from the rule ID.
	 *
	 * @return void
	 */
	public function test_task_id_is_stable_per_rule() {
		$this->assertSame( 'spec-audit-html-doctype', $this->provider->get_task_id( [ 'rule_id' => 'html-doctype' ] ) );
		$this->assertSame( 'spec-audit', $this->provider->get_task_id( [] ) );
	}

	/**
	 * Test completion: a rule that now passes marks the task complete.
	 *
	 * @return void
	 */
	public function test_task_completed_when_rule_passes() {
		$this->seed_findings( [ $this->finding( 'rule-a' ) ] );
		$this->provider->get_tasks_to_inject();

		// While the rule still fails, the task is not complete.
		$this->assertFalse( $this->provider->is_task_completed( 'spec-audit-rule-a' ) );

		// Flip the rule to passing.
		$passing           = $this->finding( 'rule-a' );
		$passing['status'] = 'pass';
		$this->seed_findings( [ $passing ] );

		$this->assertTrue( $this->provider->is_task_completed( 'spec-audit-rule-a' ) );
	}

	/**
	 * Test completion: a rule that disappears from a NON-EMPTY audit marks the
	 * task complete.
	 *
	 * Note: an *empty* cache is NOT treated as "rule passed" — see
	 * test_task_not_completed_when_cache_is_empty — so this test seeds a
	 * non-empty cache that simply doesn't include rule-a.
	 *
	 * @return void
	 */
	public function test_task_completed_when_rule_gone() {
		$this->seed_findings( [ $this->finding( 'rule-a' ) ] );
		$this->provider->get_tasks_to_inject();

		// Audit ran again and the rule is no longer reported (but other rules are).
		$this->seed_findings( [ $this->finding( 'rule-b' ) ] );

		$this->assertTrue( $this->provider->is_task_completed( 'spec-audit-rule-a' ) );
	}

	/**
	 * Test that an empty/missing audit cache does NOT mark tasks as completed.
	 *
	 * If we treated a missing cache as "rule no longer reported", a single
	 * object-cache flush could mass-complete every audit task. Tasks must wait
	 * for a real audit before changing state.
	 *
	 * @return void
	 */
	public function test_task_not_completed_when_cache_is_empty() {
		$this->seed_findings( [ $this->finding( 'rule-a' ) ] );
		$this->provider->get_tasks_to_inject();

		// Simulate the cache being cleared (object cache flush, restart, etc.).
		$this->seed_findings( [] );

		$this->assertFalse(
			$this->provider->is_task_completed( 'spec-audit-rule-a' ),
			'An empty cache must not be treated as evidence the rule passes.'
		);
	}

	/**
	 * Test that the data collector's update_cache() is a no-op unless an
	 * explicit caller (CLI/cron/AJAX-shutdown) has opted in. This is the
	 * guard that keeps the audit's outbound HTTP off the admin_init path.
	 *
	 * @return void
	 */
	public function test_update_cache_is_noop_without_explicit_refresh() {
		$collector = new Spec_Audit_Data_Collector();

		// Pre-seed a sentinel so we can detect whether update_cache ran.
		$this->seed_findings( [ $this->finding( 'sentinel-rule' ) ] );

		// Call update_cache() outside the with_explicit_refresh() guard —
		// emulates the Data_Collector_Manager admin_init sweep.
		$collector->update_cache();

		$findings = $collector->collect();
		$this->assertSame(
			'sentinel-rule',
			$findings[0]['rule_id'] ?? null,
			'update_cache() without explicit refresh must NOT overwrite the cache (which would imply it tried to run a fresh audit and its outbound HTTP).'
		);
	}

	/**
	 * Test that the throttle counter is not consumed when an injected task
	 * is removed in the same request (the shutdown verification step skips it).
	 *
	 * @return void
	 */
	public function test_throttle_window_not_consumed_for_canceled_injection() {
		$this->seed_findings( [ $this->finding( 'rule-a' ) ] );

		$created = $this->provider->get_tasks_to_inject();
		$this->assertCount( 1, $created );

		// Simulate the same-request evaluate_tasks() removing the task because
		// the cache contradicted itself after injection.
		\wp_delete_post( $created[0], true );

		// shutdown action runs at request end; call it directly.
		$this->provider->finalize_throttle_on_shutdown();

		$injections = \progress_planner()->get_settings()->get( [ 'spec_audit', 'injections' ], [] );
		$this->assertSame( [], $injections, 'Canceled injection should not consume the per-window quota.' );
	}

	/**
	 * Test that a surviving injection DOES consume the window quota at shutdown.
	 *
	 * @return void
	 */
	public function test_throttle_window_consumed_for_surviving_injection() {
		$this->seed_findings( [ $this->finding( 'rule-a' ) ] );

		$created = $this->provider->get_tasks_to_inject();
		$this->assertCount( 1, $created );

		$this->provider->finalize_throttle_on_shutdown();

		$injections = \progress_planner()->get_settings()->get( [ 'spec_audit', 'injections' ], [] );
		$this->assertSame( 1, $injections[ \gmdate( 'Ymd' ) ] ?? 0 );
	}

	/**
	 * Test that a task for a PHP-check rule that no longer exists in the
	 * registry is auto-completed. This is the self-healing path for stale
	 * tasks left over from a previous plugin version where a rule was
	 * renamed or retired.
	 *
	 * @return void
	 */
	public function test_task_auto_completed_when_php_check_rule_retired() {
		// Register one controllable check while we inject the task, so the
		// rule_id exists at injection time.
		$stub_check = new class() implements Check {
			/**
			 * Rule ID.
			 *
			 * @return string
			 */
			public function get_rule_id(): string {
				return 'rule-a';
			}
			/**
			 * Reports failing so the test can inject.
			 *
			 * @param string $url     URL.
			 * @param string $html    HTML.
			 * @param array  $context Context.
			 * @return array<string, mixed>
			 */
			public function run( string $url, string $html, array $context ): array {
				return [
					'rule_id' => 'rule-a',
					'status'  => 'fail',
					'title'   => 'Stub',
					'source'  => 'php-check',
				];
			}
		};
		\add_filter(
			'progress_planner_audit_checks',
			static fn() => [ $stub_check ],
			10,
			0
		);

		$this->seed_findings( [ $this->finding( 'rule-a' ) ] );
		$created = $this->provider->get_tasks_to_inject();
		$this->assertCount( 1, $created, 'Sanity: task is injected while rule exists.' );

		// Now retire the rule by removing it from the registry. The task
		// remains in the DB but its rule_id is no longer known.
		\remove_all_filters( 'progress_planner_audit_checks' );

		// Even with the cache still populated and the rule still listed as
		// failing in it, the task should be reported complete because the
		// rule itself is gone from the registry.
		$this->assertTrue(
			$this->provider->is_task_completed( 'spec-audit-rule-a' ),
			'A PHP-check task whose rule was retired must auto-complete.'
		);
	}

	/**
	 * Backfill safety: a task with no stored source meta is treated as
	 * php-check and auto-completed when its rule_id is missing from the
	 * current registry.
	 *
	 * @return void
	 */
	public function test_legacy_task_without_source_meta_is_treated_as_php_check() {
		// Inject directly into the DB without a 'source' key — emulates a
		// task created by a previous plugin version that didn't store source.
		$post_id = \progress_planner()->get_suggested_tasks_db()->add(
			[
				'task_id'     => 'spec-audit-legacy-rule',
				'provider_id' => 'spec-audit',
				'post_title'  => 'Legacy task',
				'rule_id'     => 'legacy-rule',
			]
		);
		$this->assertGreaterThan( 0, $post_id );

		// 'legacy-rule' is not registered in any Check — the legacy task
		// should still auto-complete.
		$this->assertTrue(
			$this->provider->is_task_completed( 'spec-audit-legacy-rule' ),
			'A legacy task with no source meta must be treated as php-check and auto-complete when its rule is missing.'
		);
	}
}
