<?php
/**
 * Recommendations class.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner;

use Progress_Planner\Activities\Suggested_Task as Suggested_Task_Activity;
use Progress_Planner\Suggested_Tasks\Tasks_Manager;
use Progress_Planner\Suggested_Tasks\Providers\Content_Review;

/**
 * Recommendations class.
 *
 * @package Progress_Planner
 */
class Suggested_Tasks {

	/**
	 * Status map for task statuses.
	 * This is mostly used for backwards compatibility.
	 *
	 * @var array<string, string>
	 */
	const STATUS_MAP = [
		'completed'           => 'trash',
		'pending_celebration' => 'pending',
		'pending'             => 'publish',
		'snoozed'             => 'future',
	];

	/**
	 * An object containing tasks.
	 *
	 * @var \Progress_Planner\Suggested_Tasks\Tasks_Manager
	 */
	private Tasks_Manager $tasks_manager;

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->tasks_manager = new Tasks_Manager();

		if ( \is_admin() ) {
			\add_action( 'admin_init', [ $this, 'init' ], 20 ); // Wait for the post types to be initialized and transients to be set.

			// Check GET parameter and maybe set task as pending.
			\add_action( 'init', [ $this, 'maybe_complete_task' ] );
		}
		\add_action( 'wp_ajax_progress_planner_suggested_task_action', [ $this, 'suggested_task_action' ] );

		// Add the automatic updates complete action.
		\add_action( 'automatic_updates_complete', [ $this, 'on_automatic_updates_complete' ] );

		// Register the custom post type.
		\add_action( 'init', [ $this, 'register_post_type' ], 0 );

		// Register the custom taxonomies.
		\add_action( 'init', [ $this, 'register_taxonomy' ], 0 );

		// Filter the REST API tax query.
		\add_filter( 'rest_prpl_recommendations_query', [ $this, 'rest_api_tax_query' ], 10, 2 );

		// Filter the REST API response.
		\add_filter( 'rest_prepare_prpl_recommendations', [ $this, 'rest_prepare_recommendation' ], 10, 2 );

		// Sanitize the recommendation title on insert/update via the REST API, to prevent stored XSS.
		\add_filter( 'rest_pre_insert_prpl_recommendations', [ $this, 'rest_sanitize_recommendation' ], 10, 2 );

		\add_filter( 'wp_trash_post_days', [ $this, 'change_trashed_posts_lifetime' ], 10, 2 );
	}

	/**
	 * Run the tasks.
	 *
	 * @return void
	 */
	public function init(): void {
		// Check for completed tasks.
		$completed_tasks = $this->tasks_manager->evaluate_tasks();

		foreach ( $completed_tasks as $task ) {
			if ( ! $task->post_name && $task->ID ) {
				continue;
			}

			// Change the task status to pending.
			$task->celebrate();

			// Insert an activity.
			$this->insert_activity( \progress_planner()->get_suggested_tasks()->get_task_id_from_slug( $task->post_name ) );
		}
	}

	/**
	 * Insert an activity.
	 *
	 * @param string $task_id The task ID.
	 *
	 * @return void
	 */
	public function insert_activity( string $task_id ): void {
		/**
		 * Filter the activity category for a completed task.
		 *
		 * Allows customizing the category used when recording task completion activities.
		 * For example, onboarding tasks may use 'onboarding_task' instead of 'suggested_task'
		 * to exclude them from monthly badge calculations.
		 *
		 * @param string $category The activity category (default: 'suggested_task').
		 * @param string $task_id  The task ID being completed.
		 */
		$category = \apply_filters( 'progress_planner_task_activity_category', 'suggested_task', $task_id );

		// Insert an activity.
		$activity           = new Suggested_Task_Activity();
		$activity->category = $category;
		$activity->type     = 'completed';
		$activity->data_id  = (string) $task_id;
		$activity->date     = new \DateTime();
		$activity->user_id  = \get_current_user_id();
		$activity->save();

		// Allow other classes to react to the completion of a suggested task.
		\do_action( 'progress_planner_suggested_task_completed', $task_id );
	}

	/**
	 * Delete an activity.
	 *
	 * @param string $task_id The task ID.
	 *
	 * @return void
	 */
	public function delete_activity( string $task_id ): void {
		$activity = \progress_planner()->get_activities__query()->query_activities(
			[
				'data_id' => $task_id,
				'type'    => 'completed',
			]
		);

		if ( empty( $activity ) ) {
			return;
		}

		\progress_planner()->get_activities__query()->delete_activity( $activity[0] );
	}

	/**
	 * If done via automatic updates, the "core update" task should be marked as "trashed" (and skip "pending" status).
	 *
	 * @return void
	 */
	public function on_automatic_updates_complete(): void {
		$pending_tasks = \progress_planner()->get_suggested_tasks_db()->get(
			[
				'numberposts' => 1,
				'post_status' => 'publish',
				'provider_id' => 'update-core',
				'date_query'  => [ [ 'after' => 'this Monday' ] ],
			]
		);

		if ( empty( $pending_tasks ) ) {
			return;
		}

		\progress_planner()->get_suggested_tasks_db()->update_recommendation( $pending_tasks[0]->ID, [ 'post_status' => 'trash' ] );

		// Insert an activity.
		$this->insert_activity( \progress_planner()->get_suggested_tasks()->get_task_id_from_slug( $pending_tasks[0]->post_name ) );
	}

	/**
	 * Get the tasks manager.
	 *
	 * @return \Progress_Planner\Suggested_Tasks\Tasks_Manager
	 */
	public function get_tasks_manager(): Tasks_Manager {
		return $this->tasks_manager;
	}

	/**
	 * Check if a task was completed. Task is considered completed if it was trashed or pending.
	 *
	 * @param string|int $task_id The task ID.
	 *
	 * @return bool
	 */
	public function was_task_completed( $task_id ): bool {
		$task = \progress_planner()->get_suggested_tasks_db()->get_post( $task_id );
		return $task && $task->is_completed();
	}

	/**
	 * Maybe complete a task.
	 * Primarly this is used for deeplinking, ie user is testing if the emails are working
	 * He gets an email with a link which automatically completes the task.
	 *
	 * Verify token to prevent CSRF attacks.
	 * Tokens are one-time use and expire after 24 hours.
	 *
	 * @return void
	 */
	public function maybe_complete_task() {
		if ( ! \progress_planner()->is_on_progress_planner_dashboard_page() || ! isset( $_GET['prpl_complete_task'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended
			return;
		}

		$task_id = \sanitize_text_field( \wp_unslash( $_GET['prpl_complete_task'] ) ); // phpcs:ignore WordPress.Security.NonceVerification.Recommended
		if ( ! $task_id ) {
			return;
		}

		// Verify token to prevent CSRF attacks.
		if ( ! isset( $_GET['token'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended
			return;
		}

		$provided_token = \sanitize_text_field( \wp_unslash( $_GET['token'] ) ); // phpcs:ignore WordPress.Security.NonceVerification.Recommended
		$user_id        = \get_current_user_id();

		// Verify the token.
		if ( ! $this->verify_task_completion_token( $task_id, $user_id, $provided_token ) ) {
			return;
		}

		if ( ! $this->was_task_completed( $task_id ) ) {
			$task = \progress_planner()->get_suggested_tasks_db()->get_post( $task_id );

			if ( $task ) {
				\progress_planner()->get_suggested_tasks_db()->update_recommendation( $task->ID, [ 'post_status' => 'pending' ] );

				// Insert an activity.
				$this->insert_activity( $task_id );

				// Delete the token after successful use (one-time use).
				$this->delete_task_completion_token( $task_id, $user_id );
			}
		}
	}

	/**
	 * The alphabet used for confirmation codes.
	 *
	 * Excludes characters that are easily confused when read aloud or retyped:
	 * 0/O, 1/I/L, 5/S, 8/B. A code is only useful if a person relays it
	 * correctly on the first try.
	 *
	 * @var string
	 */
	const CONFIRMATION_CODE_ALPHABET = '234679ACDEFGHJKMNPQRTUVWXYZ';

	/**
	 * The length of a confirmation code.
	 *
	 * @var int
	 */
	const CONFIRMATION_CODE_LENGTH = 4;

	/**
	 * Generate a short confirmation code for a task.
	 *
	 * WHY THIS EXISTS, alongside the 32-character token below:
	 *
	 * Both prove the same thing -- that the email actually arrived, because
	 * the value only exists inside the delivered message. They differ in who
	 * can realistically relay them.
	 *
	 * The token is delivered as the href of a "Click here" link. A person
	 * cannot read it off the screen: they would have to right-click, copy the
	 * link address, and paste a 128-character URL. That is fine for clicking
	 * and useless for telling someone.
	 *
	 * This matters because email delivery is the one check a site cannot
	 * verify for itself, and it is increasingly answered through an AI
	 * assistant rather than the dashboard. An assistant with mailbox access
	 * reads the token and needs nothing from the user. An assistant without it
	 * has to ask, and "tell it the code from the email" only works if the code
	 * is short enough to say out loud.
	 *
	 * The code is deliberately weaker than the token: four characters from a
	 * 27-character alphabet is about 19 bits. What makes that acceptable is
	 * everything around it -- the code is single-use, expires in 24 hours, is
	 * scoped to one user and one task, is only accepted from a caller who
	 * already holds manage_options, and failed attempts are rate limited. An
	 * attacker who could satisfy all of that can complete the task by simply
	 * clicking a button in wp-admin, so the code is not the weak link.
	 *
	 * Codes are stored uppercase and compared case-insensitively, because a
	 * person retyping one should not have to think about it.
	 *
	 * @param string $task_id The task ID.
	 * @param int    $user_id The user ID.
	 *
	 * @return string The generated confirmation code.
	 */
	public function generate_task_confirmation_code( $task_id, $user_id ) {
		$alphabet = self::CONFIRMATION_CODE_ALPHABET;
		$max      = \strlen( $alphabet ) - 1;
		$code     = '';

		for ( $i = 0; $i < self::CONFIRMATION_CODE_LENGTH; $i++ ) {
			$code .= $alphabet[ \wp_rand( 0, $max ) ];
		}

		\set_transient(
			'prpl_confirm_' . $task_id . '_' . $user_id,
			$code,
			DAY_IN_SECONDS
		);

		return $code;
	}

	/**
	 * Verify a task confirmation code.
	 *
	 * @param string $task_id       The task ID.
	 * @param int    $user_id       The user ID.
	 * @param string $provided_code The code supplied by the caller.
	 *
	 * @return bool
	 */
	public function verify_task_confirmation_code( $task_id, $user_id, $provided_code ) {
		$stored_code = \get_transient( 'prpl_confirm_' . $task_id . '_' . $user_id );

		if ( ! $stored_code ) {
			return false; // Expired, already used, or never issued.
		}

		// hash_equals to keep the comparison constant-time; strtoupper because
		// the code is meant to be retyped by a person.
		return \hash_equals( (string) $stored_code, \strtoupper( \trim( $provided_code ) ) );
	}

	/**
	 * Delete a task confirmation code after use.
	 *
	 * @param string $task_id The task ID.
	 * @param int    $user_id The user ID.
	 *
	 * @return bool True if deleted, false otherwise.
	 */
	public function delete_task_confirmation_code( $task_id, $user_id ) {
		return \delete_transient( 'prpl_confirm_' . $task_id . '_' . $user_id );
	}

	/**
	 * Generate a secure token for task completion via email link.
	 *
	 * This token prevents CSRF attacks by ensuring only legitimate email
	 * links can mark tasks as complete.
	 *
	 * See generate_task_confirmation_code() above for why a second, shorter
	 * value exists next to this one.
	 *
	 * @param string $task_id The task ID.
	 * @param int    $user_id The user ID.
	 *
	 * @return string The generated token.
	 */
	public function generate_task_completion_token( $task_id, $user_id ) {
		// Generate a cryptographically secure random token.
		$random = \wp_generate_password( 32, false );
		$token  = \wp_hash( $task_id . $user_id . $random . \wp_salt( 'auth' ) );

		// Store the token in a transient (expires after 24 hours).
		\set_transient(
			'prpl_complete_' . $task_id . '_' . $user_id,
			$token,
			DAY_IN_SECONDS
		);

		return $token;
	}

	/**
	 * Verify a task completion token.
	 *
	 * @param string $task_id        The task ID.
	 * @param int    $user_id        The user ID.
	 * @param string $provided_token The token to verify.
	 *
	 * @return bool True if token is valid, false otherwise.
	 */
	protected function verify_task_completion_token( $task_id, $user_id, $provided_token ) {
		$stored_token = \get_transient( 'prpl_complete_' . $task_id . '_' . $user_id );

		if ( ! $stored_token ) {
			return false; // Token expired or doesn't exist.
		}

		// Use hash_equals to prevent timing attacks.
		return \hash_equals( $stored_token, $provided_token );
	}

	/**
	 * Delete a task completion token after use.
	 *
	 * @param string $task_id The task ID.
	 * @param int    $user_id The user ID.
	 *
	 * @return bool True if deleted, false otherwise.
	 */
	protected function delete_task_completion_token( $task_id, $user_id ) {
		return \delete_transient( 'prpl_complete_' . $task_id . '_' . $user_id );
	}

	/**
	 * Handle the suggested task action.
	 *
	 * @return void
	 */
	public function suggested_task_action() {
		// Check the nonce.
		if ( ! \check_ajax_referer( 'progress_planner', 'nonce', false ) ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'Invalid nonce.', 'progress-planner' ) ] );
		}

		if ( ! isset( $_POST['post_id'] ) || ! isset( $_POST['action_type'] ) ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'Missing data.', 'progress-planner' ) ] );
		}

		$action  = \sanitize_text_field( \wp_unslash( $_POST['action_type'] ) );
		$post_id = (string) \sanitize_text_field( \wp_unslash( $_POST['post_id'] ) );
		$task    = \progress_planner()->get_suggested_tasks_db()->get_post( $post_id );

		if ( ! $task ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'Task not found.', 'progress-planner' ) ] );
		}

		$provider = \progress_planner()->get_suggested_tasks()->get_tasks_manager()->get_task_provider( $task->get_provider_id() );

		if ( ! $provider ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'Provider not found.', 'progress-planner' ) ] );
		}

		if ( ! $provider->capability_required() ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'You do not have permission to complete this task.', 'progress-planner' ) ] );
		}

		$updated = false;

		switch ( $action ) {
			case 'complete':
				// Insert an activity.
				$this->insert_activity( \progress_planner()->get_suggested_tasks()->get_task_id_from_slug( $task->post_name ) );
				$updated = true;
				break;

			case 'pending': // User task was marked as pending.
			case 'delete':
				$this->delete_activity( \progress_planner()->get_suggested_tasks()->get_task_id_from_slug( $task->post_name ) );
				$updated = true;
				break;
		}

		/**
		 * Allow other classes to react to the completion of a suggested task.
		 *
		 * @param string $post_id The post ID.
		 * @param bool   $updated Whether the action was successful.
		 */
		\do_action( "progress_planner_ajax_task_{$action}", $post_id, $updated );

		if ( ! $updated ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'Not saved.', 'progress-planner' ) ] );
		}

		\wp_send_json_success( [ 'message' => \esc_html__( 'Saved.', 'progress-planner' ) ] );
	}

	/**
	 * Register a custom post type for suggested tasks.
	 *
	 * @return void
	 */
	public function register_post_type() {
		\register_post_type(
			'prpl_recommendations',
			[
				'label'                 => \__( 'Recommendations', 'progress-planner' ),
				'public'                => false,
				'show_ui'               => \apply_filters( 'progress_planner_tasks_show_ui', false ),
				'show_in_admin_bar'     => \apply_filters( 'progress_planner_tasks_show_ui', false ),
				'show_in_rest'          => true,
				'rest_controller_class' => \Progress_Planner\Rest\Recommendations_Controller::class,
				'supports'              => [ 'title', 'excerpt', 'editor', 'author', 'custom-fields', 'page-attributes' ],
				'rewrite'               => false,
				'menu_icon'             => 'dashicons-admin-tools',
				'menu_position'         => 5,
				'hierarchical'          => true,
				'exclude_from_search'   => true,
				// Map every meta-capability to the plugin's own gate. Without
				// this the CPT inherits the default `post` capabilities, so any
				// Contributor/Author (`edit_posts`) could create, edit, trash or
				// enumerate recommendations through paths that DO check caps —
				// the REST controller is guarded separately, but XML-RPC
				// (`wp.newPost`) and the block editor are not (1.10.0 audit S1).
				// Internal task injection is unaffected: `Suggested_Tasks_DB`
				// writes with raw `wp_insert_post()`/`wp_update_post()`, which do
				// not run capability checks.
				// With `map_meta_cap => true`, only the PRIMITIVE capabilities are
				// listed here; core derives the meta capabilities (edit_post,
				// read_post, delete_post) from them per-post. Listing the meta
				// caps too triggers a `_doing_it_wrong` notice in WP 6.1+.
				'capability_type'       => 'prpl_recommendation',
				'map_meta_cap'          => true,
				'capabilities'          => [
					'edit_posts'             => 'edit_others_posts',
					'edit_others_posts'      => 'edit_others_posts',
					'delete_posts'           => 'edit_others_posts',
					'delete_others_posts'    => 'edit_others_posts',
					'publish_posts'          => 'edit_others_posts',
					'read_private_posts'     => 'edit_others_posts',
					'create_posts'           => 'edit_others_posts',
					'delete_private_posts'   => 'edit_others_posts',
					'delete_published_posts' => 'edit_others_posts',
					'edit_private_posts'     => 'edit_others_posts',
					'edit_published_posts'   => 'edit_others_posts',
				],
			]
		);

		$rest_meta_fields = [
			'prpl_url'   => [
				'type'         => 'string',
				'single'       => true,
				'show_in_rest' => true,
			],
			'menu_order' => [
				'type'         => 'number',
				'single'       => true,
				'show_in_rest' => true,
				'default'      => 0,
			],
		];

		foreach ( $rest_meta_fields as $key => $field ) {
			\register_post_meta(
				'prpl_recommendations',
				$key,
				$field
			);
		}
	}

	/**
	 * Custom trash lifetime by post type.
	 *
	 * @param int      $days The number of days to keep in trash.
	 * @param \WP_Post $post The post.
	 *
	 * @return int
	 */
	public function change_trashed_posts_lifetime( $days, $post ) {
		return 'prpl_recommendations' === $post->post_type ? 60 : $days;
	}

	/**
	 * Register a custom taxonomies for suggested tasks.
	 *
	 * @return void
	 */
	public function register_taxonomy() {
		// Register only the provider taxonomy.
		\register_taxonomy(
			'prpl_recommendations_provider',
			[ 'prpl_recommendations' ],
			[
				'public'            => false,
				'hierarchical'      => false,
				'labels'            => [
					'name' => \__( 'Providers', 'progress-planner' ),
				],
				'show_ui'           => \apply_filters( 'progress_planner_tasks_show_ui', false ),
				'show_admin_column' => false,
				'query_var'         => true,
				'rewrite'           => [ 'slug' => 'prpl_recommendations_provider' ],
				'show_in_rest'      => true,
				'show_in_menu'      => \apply_filters( 'progress_planner_tasks_show_ui', false ),
				// Gate term writes to the same capability the plugin UI uses, so
				// a Contributor/Author (default `edit_posts`) cannot assign,
				// create or alter provider terms via core REST (audit S1).
				'capabilities'      => [
					'manage_terms' => 'edit_others_posts',
					'edit_terms'   => 'edit_others_posts',
					'delete_terms' => 'edit_others_posts',
					'assign_terms' => 'edit_others_posts',
				],
			]
		);
	}

	/**
	 * Filter the REST API tax query.
	 *
	 * @param array            $args The arguments.
	 * @param \WP_REST_Request $request The request.
	 *
	 * @return array
	 */
	public function rest_api_tax_query( $args, $request ) {
		$tax_query = [];

		// Exclude terms.
		if ( isset( $request['exclude_provider'] ) ) {
			$tax_query[] = [
				'taxonomy' => 'prpl_recommendations_provider',
				'field'    => 'slug',
				'terms'    => $this->parse_provider_param( $request['exclude_provider'] ),
				'operator' => 'NOT IN',
			];
		}

		$include_providers            = [];
		$providers_available_for_user = \progress_planner()->get_suggested_tasks()->get_tasks_manager()->get_task_providers_available_for_user();
		foreach ( $providers_available_for_user as $provider ) {
			$include_providers[] = $provider->get_provider_id();
		}

		// Include terms (matches any term in list).
		if ( isset( $request['provider'] ) ) {
			$request_providers = $this->parse_provider_param( $request['provider'] );
			$include_providers = \array_intersect( $include_providers, $request_providers );
		}

		$tax_query[] = [
			'taxonomy' => 'prpl_recommendations_provider',
			'field'    => 'slug',
			'terms'    => $include_providers,
			'operator' => 'IN',
		];

		$args['tax_query'] = $tax_query; // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_tax_query

		// Handle sorting parameters.
		if ( isset( $request['filter']['orderby'] ) ) {
			// @phpstan-ignore-next-line argument.templateType
			$orderby         = \sanitize_sql_orderby( $request['filter']['orderby'] ); // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared
			$args['orderby'] = $orderby !== false ? $orderby : 'date';
		}
		if ( isset( $request['filter']['order'] ) ) {
			$args['order'] = \in_array( \strtoupper( $request['filter']['order'] ), [ 'ASC', 'DESC' ], true )
				? \strtoupper( $request['filter']['order'] )
				: 'ASC';
		}

		return $args;
	}

	/**
	 * Normalise a `provider` / `exclude_provider` REST param to a list of slugs.
	 *
	 * The param may arrive as a comma-separated string (`?provider=a,b`) or as
	 * an array (`?provider[]=a&provider[]=b`). Passing an array straight to
	 * `explode()` throws a TypeError on PHP 8, so branch on the input type and
	 * sanitise each slug.
	 *
	 * @param mixed $value The raw request value.
	 *
	 * @return string[] The list of provider slugs.
	 */
	protected function parse_provider_param( $value ) {
		$providers = \is_string( $value )
			? \explode( ',', $value )
			: (array) $value;

		return \array_values( \array_filter( \array_map( 'sanitize_key', $providers ) ) );
	}

	/**
	 * Sanitize a recommendation before it is inserted or updated via the REST API.
	 *
	 * Recommendation titles are plain text (they are rendered unescaped in JS
	 * templates such as views/js-templates/suggested-task.html), so we strip any
	 * HTML tags here to prevent stored XSS. This runs regardless of the user's
	 * `unfiltered_html` capability, which WordPress would otherwise honor for the
	 * post title.
	 *
	 * @param \stdClass        $prepared_post An object representing a single post prepared for inserting or updating the database.
	 * @param \WP_REST_Request $request       The request object.
	 *
	 * @return \stdClass The sanitized post object.
	 */
	public function rest_sanitize_recommendation( $prepared_post, $request ) { // phpcs:ignore Generic.CodeAnalysis.UnusedFunctionParameter.FoundAfterLastUsed
		if ( isset( $prepared_post->post_title ) ) {
			$prepared_post->post_title = \sanitize_text_field( \wp_strip_all_tags( $prepared_post->post_title ) );
		}

		return $prepared_post;
	}

	/**
	 * Filter the REST API response.
	 *
	 * @param \WP_REST_Response $response The response.
	 * @param \WP_Post          $post The post.
	 *
	 * @return \WP_REST_Response
	 */
	public function rest_prepare_recommendation( $response, $post ) {
		$provider_term = \wp_get_object_terms( $post->ID, 'prpl_recommendations_provider' );
		if ( ! isset( $response->data['meta'] ) ) {
			$response->data['meta'] = [];
		}
		$provider = false;
		if ( $provider_term && ! \is_wp_error( $provider_term ) ) {
			$provider = \progress_planner()->get_suggested_tasks()->get_tasks_manager()->get_task_provider( $provider_term[0]->slug );
		}

		$response->data['slug'] = \progress_planner()->get_suggested_tasks()->get_task_id_from_slug( $response->data['slug'] );

		if ( $provider ) {
			$response->data['prpl_provider'] = $provider_term[0];
			// Link should be added during run time, since it is not added for users without required capability.
			$response->data['meta']['prpl_url'] = $response->data['meta']['prpl_url'] && $provider->capability_required()
				? \esc_url( (string) $response->data['meta']['prpl_url'] )
				: '';

			$response->data['prpl_popover_id'] = $provider->get_popover_id();
			$response->data['prpl_points']     = $provider->get_points();

			/*
			 * Check if task was completed before - for example, comments were disabled and then re-enabled, and remove points if so.
			 * Those are tasks which are completed by toggling an option, so non repetitive & not user tasks.
			 */
			if ( ! \has_term( 'user', 'prpl_recommendations_provider', $post->ID ) && ! $provider->is_repetitive() && $provider->task_has_activity( $response->data['slug'] ) ) {
				$response->data['prpl_points'] = 0;
			}

			// Assign point only to golden user task.
			if ( 'user' === $provider->get_provider_id() ) {
				$response->data['prpl_points'] = ( ! empty( $post->post_excerpt ) && \str_contains( $post->post_excerpt, 'GOLDEN' ) ) ? 1 : 0;
			}

			// This has to be the last item to be added because actions use data from previous items.
			$response->data['prpl_task_actions'] = $provider->get_task_actions( $response->data );
		}

		// Category taxonomy removed - no longer adding prpl_category to response.

		return $response;
	}

	/**
	 * Get the pending tasks in REST format.
	 *
	 * @param array $args The arguments.
	 *
	 * @return array
	 */
	public function get_tasks_in_rest_format( array $args = [] ) {
		$args = \wp_parse_args(
			$args,
			[
				'post_status'      => 'publish',
				'exclude_provider' => [],
				'include_provider' => [],
				'posts_per_page'   => -1,
			]
		);

		// Build query args for get_tasks_by.
		$query_args = [
			'post_status'    => $args['post_status'],
			'posts_per_page' => $args['posts_per_page'],
		];

		// Add provider filters if specified.
		if ( ! empty( $args['exclude_provider'] ) ) {
			// Note: Database filtering doesn't support exclude_provider directly,
			// so we'll fetch all tasks, filter, then limit.
			$original_limit               = $query_args['posts_per_page'];
			$query_args['posts_per_page'] = -1; // Fetch all tasks.
			$all_tasks                    = \progress_planner()->get_suggested_tasks_db()->get_tasks_by( $query_args );
			$all_tasks                    = \array_filter(
				$all_tasks,
				function ( $task ) use ( $args ) {
					return ! \in_array( $task->get_provider_id(), $args['exclude_provider'], true );
				}
			);
			// Now limit to the originally requested number.
			if ( -1 !== $original_limit ) {
				$all_tasks = \array_slice( $all_tasks, 0, $original_limit );
			}
		} elseif ( ! empty( $args['include_provider'] ) ) {
			$query_args['provider'] = $args['include_provider'];
			$all_tasks              = \progress_planner()->get_suggested_tasks_db()->get_tasks_by( $query_args );
		} else {
			$all_tasks = \progress_planner()->get_suggested_tasks_db()->get_tasks_by( $query_args );
		}

		// Convert tasks to REST format.
		$tasks = [];
		foreach ( $all_tasks as $task ) {
			$tasks[] = $task->get_rest_formatted_data();
		}

		/**
		 * Allow other classes to modify the tasks in REST format.
		 *
		 * @param array $tasks The tasks.
		 * @param array $args  The arguments.
		 *
		 * @return array
		 */
		return \apply_filters( 'progress_planner_suggested_tasks_in_rest_format', $tasks, $args );
	}

	/**
	 * Get the task ID from a slug.
	 *
	 * @param string $slug The slug.
	 * @return string
	 */
	public function get_task_id_from_slug( $slug ) {
		// Cast to string: callers may pass a null post_name/task_id, which would
		// trigger a deprecation notice from explode() on PHP 8.1+.
		return \explode( '__trashed', (string) $slug )[0];
	}
}
