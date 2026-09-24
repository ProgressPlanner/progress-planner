<?php
/**
 * Class Server_Recommendations_Test
 *
 * Covers completing a recommendation that states a goal. The interesting cases
 * are the refusals: this ability takes the caller's word that the goal was met,
 * so the checks around that word are the whole of its safety.
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

/**
 * Server_Recommendations test case.
 */
class Server_Recommendations_Test extends \WP_UnitTestCase {

	/**
	 * The completer under test.
	 *
	 * @var \Progress_Planner\Abilities\Server_Recommendations
	 */
	private $completer;

	/**
	 * The provider registered for the current test, if any.
	 *
	 * @var \Progress_Planner\Suggested_Tasks\Providers\Markdown_Rule|null
	 */
	private $registered;

	/**
	 * Whether the provider filter was added.
	 *
	 * @var bool
	 */
	private $filter_added = false;

	/**
	 * Add the test's provider to the manager's list.
	 *
	 * @param array<int, mixed> $providers The existing providers.
	 *
	 * @return array<int, mixed>
	 */
	public function add_test_provider( $providers ) {
		if ( $this->registered ) {
			$providers[] = $this->registered;
		}

		return $providers;
	}

	/**
	 * The rule used to build a provider.
	 *
	 * @var array<string, mixed>
	 */
	private const RULE = [
		'id'           => 'test-goal',
		'title'        => 'A goal-shaped recommendation',
		'points'       => 2,
		'capability'   => 'manage_options',
		'verified_by'  => 'site_state',
		'instructions' => "## Why it matters\n\nBecause.\n",
	];

	/**
	 * Set up test.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();

		$this->completer = new \Progress_Planner\Abilities\Server_Recommendations();

		\wp_set_current_user( self::factory()->user->create( [ 'role' => 'administrator' ] ) );
	}

	/**
	 * Clean up.
	 *
	 * The activities table is custom, so WP_UnitTestCase's transaction does not
	 * roll it back and a completion would leak into the next test.
	 *
	 * @return void
	 */
	public function tearDown(): void {
		global $wpdb;

		$wpdb->query( "TRUNCATE TABLE {$wpdb->prefix}progress_planner_activities" ); // phpcs:ignore WordPress.DB.DirectDatabaseQuery, WordPress.DB.PreparedSQL.InterpolatedNotPrepared

		// The manager holds whatever the filter last returned, so the provider
		// has to be withdrawn and the list rebuilt or it survives into the next
		// test as a provider whose task no longer exists.
		if ( $this->filter_added ) {
			\remove_filter( 'progress_planner_suggested_tasks_providers', [ $this, 'add_test_provider' ] );

			$this->registered   = null;
			$this->filter_added = false;

			\progress_planner()->get_suggested_tasks()->get_tasks_manager()->init();
		}

		parent::tearDown();
	}

	/**
	 * Register a markdown provider and create its task.
	 *
	 * @param array<string, mixed> $overrides Rule fields to override.
	 *
	 * @return string The task ID.
	 */
	private function given_a_goal( array $overrides = [] ) {
		// Post slugs are not rolled back between tests in a run, so a fixed rule
		// ID would have the second test reuse the first test's completed task.
		static $counter = 0;
		++$counter;

		$rule     = \array_merge( self::RULE, [ 'id' => 'test-goal-' . $counter ], $overrides );
		$provider = new \Progress_Planner\Suggested_Tasks\Providers\Markdown_Rule( $rule );

		// Providers reach the manager through this filter and no other way, so
		// the test registers the way the loader does rather than reaching into
		// the manager's private list.
		$this->registered   = $provider;
		$this->filter_added = true;

		\add_filter( 'progress_planner_suggested_tasks_providers', [ $this, 'add_test_provider' ] );
		\progress_planner()->get_suggested_tasks()->get_tasks_manager()->init();

		$task_id = $provider->get_provider_id();

		\progress_planner()->get_suggested_tasks_db()->add(
			[
				'post_title'  => $task_id,
				'task_id'     => $task_id,
				'provider_id' => $task_id,
				'category'    => 'configuration',
			]
		);

		return $task_id;
	}

	/**
	 * Test that completing a goal records one activity.
	 *
	 * @return void
	 */
	public function test_complete_records_an_activity() {
		$task_id = $this->given_a_goal();

		$result = $this->completer->complete( [ 'id' => $task_id ] );

		$this->assertIsArray( $result );
		$this->assertTrue( $result['completed'] );
		$this->assertSame( 'completed', $result['status'] );
		$this->assertSame( 2, $result['points'] );

		$activities = \progress_planner()->get_activities__query()->query_activities(
			[
				'data_id' => $task_id,
				'type'    => 'completed',
			]
		);

		$this->assertCount( 1, $activities, 'Completing a goal records exactly one activity.' );
		$this->assertSame( 'suggested_task', $activities[0]->category );
	}

	/**
	 * Test that completing twice does not score twice.
	 *
	 * @return void
	 */
	public function test_completing_twice_scores_once() {
		$task_id = $this->given_a_goal();

		$this->completer->complete( [ 'id' => $task_id ] );

		// The task object is cached from the first call, so the second has to
		// read the stored status rather than the instance it already saw.
		\wp_cache_flush();

		$second = $this->completer->complete( [ 'id' => $task_id ] );

		$this->assertIsArray( $second );
		$this->assertFalse( $second['completed'] );
		$this->assertSame( 'already_completed', $second['status'] );
		$this->assertSame( 0, $second['points'] );

		$activities = \progress_planner()->get_activities__query()->query_activities(
			[
				'data_id' => $task_id,
				'type'    => 'completed',
			]
		);

		$this->assertCount( 1, $activities, 'A second call must not add a second activity.' );
	}

	/**
	 * Test that a goal only the owner can confirm is refused without confirmation.
	 *
	 * @return void
	 */
	public function test_owner_confirmation_is_required_when_the_rule_says_so() {
		$task_id = $this->given_a_goal( [ 'verified_by' => 'owner_confirmation' ] );

		$result = $this->completer->complete( [ 'id' => $task_id ] );

		$this->assertWPError( $result );
		$this->assertSame( 'progress_planner_needs_owner_confirmation', $result->get_error_code() );

		$activities = \progress_planner()->get_activities__query()->query_activities(
			[
				'data_id' => $task_id,
				'type'    => 'completed',
			]
		);

		$this->assertCount( 0, $activities, 'A refused completion records nothing.' );
	}

	/**
	 * Test that owner confirmation lets the same goal through.
	 *
	 * @return void
	 */
	public function test_owner_confirmation_allows_completion() {
		$task_id = $this->given_a_goal( [ 'verified_by' => 'owner_confirmation' ] );

		$result = $this->completer->complete(
			[
				'id'              => $task_id,
				'owner_confirmed' => true,
			]
		);

		$this->assertIsArray( $result );
		$this->assertTrue( $result['completed'] );
	}

	/**
	 * Test that a recommendation the plugin can apply itself is refused.
	 *
	 * Those have their own ability, which changes the setting. Completing one
	 * here would mark it done without doing it.
	 *
	 * @return void
	 */
	public function test_a_plugin_backed_recommendation_is_refused() {
		\progress_planner()->get_suggested_tasks_db()->add(
			[
				'post_title'  => 'core-siteicon-test',
				'task_id'     => 'core-siteicon-test',
				'provider_id' => 'core-siteicon',
				'category'    => 'configuration',
			]
		);

		$result = $this->completer->complete( [ 'id' => 'core-siteicon-test' ] );

		$this->assertWPError( $result );
		$this->assertSame( 'progress_planner_not_a_goal', $result->get_error_code() );
	}

	/**
	 * Test that an unknown ID is reported rather than silently ignored.
	 *
	 * @return void
	 */
	public function test_unknown_id_is_an_error() {
		$result = $this->completer->complete( [ 'id' => 'no-such-recommendation' ] );

		$this->assertWPError( $result );
		$this->assertSame( 'progress_planner_not_found', $result->get_error_code() );
	}

	/**
	 * Test that a missing ID is reported.
	 *
	 * @return void
	 */
	public function test_missing_id_is_an_error() {
		$result = $this->completer->complete( [] );

		$this->assertWPError( $result );
		$this->assertSame( 'progress_planner_missing_id', $result->get_error_code() );
	}

	/**
	 * Test that a user without the rule's capability cannot complete it.
	 *
	 * @return void
	 */
	public function test_insufficient_capability_is_refused() {
		$task_id = $this->given_a_goal();

		\wp_set_current_user( self::factory()->user->create( [ 'role' => 'subscriber' ] ) );

		$result = $this->completer->complete( [ 'id' => $task_id ] );

		$this->assertWPError( $result );
		$this->assertSame( 'progress_planner_forbidden', $result->get_error_code() );
	}
}
