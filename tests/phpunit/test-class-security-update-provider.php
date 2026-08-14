<?php
/**
 * Class Security_Update_Provider_Test
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

/**
 * Security update task provider test case.
 */
class Security_Update_Provider_Test extends \WP_UnitTestCase {

	use Task_Provider_Test_Trait {
		set_up as protected trait_set_up;
	}

	/**
	 * The task provider ID.
	 *
	 * @var string
	 */
	protected $task_provider_id = 'security-update';

	/**
	 * Setup the test case.
	 *
	 * @return void
	 */
	public function set_up() {
		$this->set_security_offer();
		$this->trait_set_up();

		// The current user is reset between tests; capability checks need the admin.
		\wp_set_current_user( 1 );
	}

	/**
	 * Complete the task.
	 *
	 * @return void
	 */
	protected function complete_task() {
		// Simulate the update being installed: the refreshed transient reports the
		// new version as installed and no longer offers an upgrade.
		\set_site_transient(
			'update_core',
			(object) [
				'updates'         => [],
				'version_checked' => $this->get_offered_version(),
			]
		);
	}

	/**
	 * Test that the task ID carries the offered version.
	 */
	public function test_task_id_is_versioned() {
		$expected = 'security-update-' . \str_replace( '.', '-', $this->get_offered_version() );
		$this->assertSame( $expected, $this->task_provider->get_task_id() );
	}

	/**
	 * Test that the task is neither dismissable nor snoozable and has top priority.
	 */
	public function test_task_is_locked_to_highest_urgency() {
		$this->assertFalse( $this->task_provider->is_dismissable() );
		$this->assertFalse( $this->task_provider->is_snoozable() );
		$this->assertSame( 0, $this->task_provider->get_priority() );
	}

	/**
	 * Test that a superseded offer replaces the published task.
	 */
	public function test_superseded_offer_replaces_task() {
		$this->task_provider->get_tasks_to_inject();
		$first_task_id = $this->task_provider->get_task_id();

		// A newer patch release supersedes the first one.
		$this->set_security_offer( 2 );
		$this->task_provider->get_tasks_to_inject();

		$tasks = (array) \progress_planner()->get_suggested_tasks_db()->get_tasks_by(
			[
				'post_status' => 'publish',
				'provider'    => $this->task_provider_id,
			]
		);

		$this->assertCount( 1, $tasks );
		$this->assertSame( $this->task_provider->get_task_id(), $tasks[0]->post_name );
		$this->assertNotSame( $first_task_id, $tasks[0]->post_name );
	}

	/**
	 * Test that a withdrawn offer deletes the published task without celebration.
	 */
	public function test_withdrawn_offer_deletes_task() {
		$this->task_provider->get_tasks_to_inject();

		// The offer is withdrawn; the installed version did not change.
		\set_site_transient( 'update_core', (object) [ 'updates' => [] ] );

		$completed = \progress_planner()->get_suggested_tasks()->get_tasks_manager()->evaluate_tasks();

		$this->assertSame( [], $completed );
		$this->assertSame(
			[],
			(array) \progress_planner()->get_suggested_tasks_db()->get_tasks_by(
				[
					'post_status' => 'publish',
					'provider'    => $this->task_provider_id,
				]
			)
		);
	}

	/**
	 * Test that a new security release is injected even after an older one was completed.
	 */
	public function test_new_release_injected_after_previous_completion() {
		$this->task_provider->get_tasks_to_inject();

		// Complete the first task.
		$tasks = (array) \progress_planner()->get_suggested_tasks_db()->get_tasks_by(
			[
				'post_status' => 'publish',
				'provider'    => $this->task_provider_id,
			]
		);
		\progress_planner()->get_suggested_tasks_db()->update_recommendation( $tasks[0]->ID, [ 'post_status' => 'trash' ] );

		// A newer security release appears.
		$this->set_security_offer( 2 );
		$this->task_provider->get_tasks_to_inject();

		$tasks = (array) \progress_planner()->get_suggested_tasks_db()->get_tasks_by(
			[
				'post_status' => 'publish',
				'provider'    => $this->task_provider_id,
			]
		);

		$this->assertCount( 1, $tasks );
		$this->assertSame( $this->task_provider->get_task_id(), $tasks[0]->post_name );
	}

	/**
	 * Test that a published security task hides all other tasks from the REST-format list.
	 */
	public function test_lockdown_limits_rest_format_to_security_task() {
		$this->add_other_task();

		// Without a published security task, the other task is listed.
		$tasks = \progress_planner()->get_suggested_tasks()->get_tasks_in_rest_format( [ 'post_status' => 'publish' ] );
		$this->assertCount( 1, $tasks );

		$this->task_provider->get_tasks_to_inject();
		\wp_cache_flush();

		$tasks = \progress_planner()->get_suggested_tasks()->get_tasks_in_rest_format( [ 'post_status' => 'publish' ] );

		$this->assertCount( 1, $tasks );
		$this->assertSame( $this->task_provider->get_task_id(), $tasks[0]['slug'] );
	}

	/**
	 * Test that the lockdown leaves non-publish statuses (celebrations, user tasks) alone.
	 */
	public function test_lockdown_does_not_affect_pending_celebration_tasks() {
		// Celebration tasks transition publish → pending in production, keeping their slug.
		$other_task_id = \progress_planner()->get_suggested_tasks_db()->add(
			[
				'task_id'     => 'core-blogdescription',
				'provider_id' => 'core-blogdescription',
				'post_title'  => 'Celebrate me',
				'post_status' => 'publish',
				'url'         => \admin_url( 'options-general.php' ),
			]
		);
		\progress_planner()->get_suggested_tasks_db()->update_recommendation( $other_task_id, [ 'post_status' => 'pending' ] );
		$this->task_provider->get_tasks_to_inject();
		\wp_cache_flush();

		$tasks = \progress_planner()->get_suggested_tasks()->get_tasks_in_rest_format( [ 'post_status' => 'pending' ] );

		$this->assertCount( 1, $tasks );
		$this->assertSame( 'core-blogdescription', $tasks[0]['slug'] );
	}

	/**
	 * Test that the REST collection query is constrained to the security provider under lockdown.
	 */
	public function test_lockdown_forces_rest_tax_query_to_security_provider() {
		$this->task_provider->get_tasks_to_inject();

		$request = new \WP_REST_Request( 'GET', '/wp/v2/prpl_recommendations' );
		$args    = \progress_planner()->get_suggested_tasks()->rest_api_tax_query( [], $request );

		$this->assertSame( [ 'security-update' ], $this->get_tax_query_include_terms( $args ) );
	}

	/**
	 * Test that users who cannot install updates keep their normal task list.
	 */
	public function test_lockdown_skips_users_without_update_capability() {
		$this->task_provider->get_tasks_to_inject();

		$editor_id = self::factory()->user->create( [ 'role' => 'editor' ] );
		\wp_set_current_user( $editor_id );

		$request = new \WP_REST_Request( 'GET', '/wp/v2/prpl_recommendations' );
		$args    = \progress_planner()->get_suggested_tasks()->rest_api_tax_query( [], $request );
		$terms   = $this->get_tax_query_include_terms( $args );

		\wp_set_current_user( 1 );

		$this->assertNotSame( [ 'security-update' ], $terms );
		$this->assertNotEmpty( $terms );
	}

	/**
	 * Test that automatic core updates complete the security task without celebration.
	 */
	public function test_automatic_update_completes_security_task() {
		$this->task_provider->get_tasks_to_inject();

		$tasks = (array) \progress_planner()->get_suggested_tasks_db()->get_tasks_by(
			[
				'post_status' => 'publish',
				'provider'    => $this->task_provider_id,
			]
		);
		$this->assertCount( 1, $tasks );

		\progress_planner()->get_suggested_tasks()->on_automatic_updates_complete();

		$this->assertSame( 'trash', \get_post_status( $tasks[0]->ID ) );
	}

	/**
	 * Test that the task actions include a form that updates to the branch version directly.
	 *
	 * The wp-admin Updates page only shows the latest major (get_core_updates() skips
	 * "autoupdate" offers), so the task must offer the branch-pinned update itself.
	 */
	public function test_task_action_contains_branch_pinned_update_form() {
		$actions = $this->task_provider->add_task_actions( [], [] );
		$html    = \implode( ' ', \array_column( $actions, 'html' ) );

		$this->assertStringContainsString( 'update-core.php?action=do-core-upgrade', $html );
		$this->assertStringContainsString( 'name="version" value="' . $this->get_offered_version() . '"', $html );
		$this->assertStringContainsString( 'name="locale" value="en_US"', $html );
		$this->assertStringContainsString( 'name="upgrade"', $html );
		$this->assertStringContainsString( 'name="_wpnonce"', $html );
		// The fallback link to the Updates page remains.
		$this->assertStringContainsString( 'Go to the Updates page', $html );
	}

	/**
	 * Test that the update form uses the locale of the matched offer.
	 */
	public function test_task_action_form_uses_offer_locale() {
		\set_site_transient(
			'update_core',
			(object) [
				'updates' => [
					(object) [
						'response' => 'autoupdate',
						'current'  => $this->get_offered_version(),
						'locale'   => 'de_DE',
					],
				],
			]
		);

		$actions = $this->task_provider->add_task_actions( [], [] );
		$html    = \implode( ' ', \array_column( $actions, 'html' ) );

		$this->assertStringContainsString( 'name="locale" value="de_DE"', $html );
	}

	/**
	 * Test that no update form is rendered without a pending security update.
	 */
	public function test_task_action_form_absent_without_pending_update() {
		\set_site_transient( 'update_core', (object) [ 'updates' => [] ] );

		$actions = $this->task_provider->add_task_actions( [], [] );
		$html    = \implode( ' ', \array_column( $actions, 'html' ) );

		$this->assertStringNotContainsString( 'do-core-upgrade', $html );
		$this->assertStringContainsString( 'Go to the Updates page', $html );
	}

	/**
	 * Add a published task from another provider.
	 *
	 * @return void
	 */
	private function add_other_task() {
		\progress_planner()->get_suggested_tasks_db()->add(
			[
				'task_id'     => 'core-blogdescription',
				'provider_id' => 'core-blogdescription',
				'post_title'  => 'Set your tagline',
				'post_status' => 'publish',
				'url'         => \admin_url( 'options-general.php' ),
			]
		);
		\wp_cache_flush();
	}

	/**
	 * Extract the IN-operator provider terms from REST query args.
	 *
	 * @param array $args The query args returned by rest_api_tax_query().
	 *
	 * @return array
	 */
	private function get_tax_query_include_terms( $args ) {
		foreach ( (array) ( $args['tax_query'] ?? [] ) as $clause ) {
			if ( \is_array( $clause ) && isset( $clause['operator'] ) && 'IN' === $clause['operator'] ) {
				return \array_values( (array) $clause['terms'] );
			}
		}

		return [];
	}

	/**
	 * Get an offered patch version relative to the running WordPress version.
	 *
	 * @param int $bump How many patch versions to bump.
	 *
	 * @return string
	 */
	private function get_offered_version( $bump = 1 ) {
		$parts = \explode( '.', \wp_get_wp_version() );

		return $parts[0] . '.' . $parts[1] . '.' . ( isset( $parts[2] ) ? (int) $parts[2] + $bump : $bump );
	}

	/**
	 * Store an update_core transient offering a security release.
	 *
	 * @param int $bump How many patch versions to bump.
	 *
	 * @return void
	 */
	private function set_security_offer( $bump = 1 ) {
		\set_site_transient(
			'update_core',
			(object) [
				'updates' => [
					(object) [
						'response' => 'upgrade',
						'current'  => $this->get_offered_version( $bump ),
					],
				],
			]
		);
	}
}
