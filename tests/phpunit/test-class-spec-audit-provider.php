<?php
/**
 * Unit tests for the Spec_Audit task provider throttle and completion logic.
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Suggested_Tasks\Providers\Spec_Audit;

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
	 * Test completion: a rule that disappears from the audit marks the task complete.
	 *
	 * @return void
	 */
	public function test_task_completed_when_rule_gone() {
		$this->seed_findings( [ $this->finding( 'rule-a' ) ] );
		$this->provider->get_tasks_to_inject();

		// Rule no longer present in the audit at all.
		$this->seed_findings( [] );

		$this->assertTrue( $this->provider->is_task_completed( 'spec-audit-rule-a' ) );
	}
}
