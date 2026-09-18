<?php
/**
 * Register Progress Planner abilities with the WordPress Abilities API.
 *
 * Abilities are how an AI agent reads this plugin. Registration is unconditional
 * on the API being present: any MCP bridge that discovers WordPress abilities
 * picks these up without this plugin knowing the bridge exists.
 *
 * Nothing downstream re-checks these abilities. A bridge that offers a
 * third-party ability serves it on its own permission callback, so the callbacks
 * declared here are the only gate that runs. They are written to stand alone.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Abilities;

/**
 * Abilities class.
 */
class Abilities {

	/**
	 * The ability category slug, and the namespace every ability name uses.
	 *
	 * @var string
	 */
	const CATEGORY = 'progress-planner';

	/**
	 * The capability required to read plugin data.
	 *
	 * Matches the capability the admin pages are gated on, so an ability can
	 * never surface data the user could not open in wp-admin.
	 *
	 * @var string
	 */
	const READ_CAPABILITY = 'edit_others_posts';

	/**
	 * Constructor.
	 */
	public function __construct() {
		// Categories register on an earlier hook than abilities: core rejects an
		// ability naming a category that does not exist yet.
		\add_action( 'wp_abilities_api_categories_init', [ $this, 'register_categories' ] );
		\add_action( 'wp_abilities_api_init', [ $this, 'register_abilities' ] );
	}

	/**
	 * Register the ability category.
	 *
	 * @return void
	 */
	public function register_categories() {
		if ( ! \function_exists( 'wp_register_ability_category' ) ) {
			return;
		}

		// Registering twice is incorrect usage. Guarding here rather than relying
		// on the hook firing once keeps a second instance of this class harmless.
		// is_registered() is the notice-free probe: wp_get_ability_category()
		// reports a miss as incorrect usage in its own right.
		if ( $this->is_category_registered() ) {
			return;
		}

		\wp_register_ability_category(
			self::CATEGORY,
			[
				'label'       => \__( 'Progress Planner', 'progress-planner' ),
				'description' => \__( 'Website maintenance progress, scores and recommendations provided by Progress Planner.', 'progress-planner' ),
			]
		);
	}

	/**
	 * Register the abilities.
	 *
	 * @return void
	 */
	public function register_abilities() {
		if ( ! \function_exists( 'wp_register_ability' ) ) {
			return;
		}

		// As above: re-registering is incorrect usage, so the registry is asked
		// first rather than assuming this runs exactly once.
		if ( $this->is_ability_registered( self::CATEGORY . '/get-site-score' ) ) {
			return;
		}

		$this->register_get_site_score();
		$this->register_list_recommendations();
		$this->register_complete_recommendation();
	}

	/**
	 * Whether the ability category is already registered.
	 *
	 * @return bool
	 */
	private function is_category_registered() {
		if ( ! \class_exists( '\WP_Ability_Categories_Registry' ) ) {
			return false;
		}

		$registry = \WP_Ability_Categories_Registry::get_instance();

		return $registry && $registry->is_registered( self::CATEGORY );
	}

	/**
	 * Whether an ability is already registered.
	 *
	 * @param string $name The fully-qualified ability name.
	 *
	 * @return bool
	 */
	private function is_ability_registered( $name ) {
		if ( ! \class_exists( '\WP_Abilities_Registry' ) ) {
			return false;
		}

		$registry = \WP_Abilities_Registry::get_instance();

		return $registry && $registry->is_registered( $name );
	}

	/**
	 * Whether the current user may read Progress Planner data.
	 *
	 * @return bool
	 */
	public function can_read() {
		return \current_user_can( self::READ_CAPABILITY );
	}

	/**
	 * Register the get-site-score ability.
	 *
	 * @return void
	 */
	private function register_get_site_score() {
		\wp_register_ability(
			self::CATEGORY . '/get-site-score',
			[
				'label'               => \__( 'Get site score', 'progress-planner' ),
				'description'         => \__( 'Get the Progress Planner activity score for this site, the weekly maintenance checklist, earned badges and the six-month score history.', 'progress-planner' ),
				'category'            => self::CATEGORY,
				'input_schema'        => [
					'type'                 => 'object',
					'additionalProperties' => false,
					'properties'           => [],
				],
				'output_schema'       => $this->get_site_score_schema(),
				'permission_callback' => [ $this, 'can_read' ],
				'execute_callback'    => [ $this, 'get_site_score' ],
				'meta'                => [
					'show_in_rest' => true,
					'annotations'  => [
						'readonly'    => true,
						'destructive' => false,
						'idempotent'  => true,
					],
				],
			]
		);
	}

	/**
	 * Register the list-recommendations ability.
	 *
	 * @return void
	 */
	private function register_list_recommendations() {
		\wp_register_ability(
			self::CATEGORY . '/list-recommendations',
			[
				'label'               => \__( 'List recommendations', 'progress-planner' ),
				'description'         => \__( 'List the website maintenance tasks Progress Planner currently recommends, newest first. Returns only tasks the current user is allowed to act on.', 'progress-planner' ),
				'category'            => self::CATEGORY,
				'input_schema'        => [
					'type'                 => 'object',
					'additionalProperties' => false,
					'properties'           => [
						'status'   => [
							'type'        => 'string',
							'description' => \__( 'Which recommendations to return. "pending" is the default and means tasks still to be done; "completed" returns recently completed tasks; "snoozed" returns tasks postponed to a later date.', 'progress-planner' ),
							'enum'        => [ 'pending', 'completed', 'snoozed' ],
							'default'     => 'pending',
						],
						'provider' => [
							'type'        => 'string',
							'description' => \__( 'Return only recommendations from this provider ID, for example "core-blogdescription".', 'progress-planner' ),
						],
						'limit'    => [
							'type'        => 'integer',
							'description' => \__( 'Maximum number of recommendations to return. Defaults to 20.', 'progress-planner' ),
							'minimum'     => 1,
							'maximum'     => 100,
							'default'     => 20,
						],
					],
				],
				'output_schema'       => $this->get_recommendations_schema(),
				'permission_callback' => [ $this, 'can_read' ],
				'execute_callback'    => [ $this, 'list_recommendations' ],
				'meta'                => [
					'show_in_rest' => true,
					'annotations'  => [
						'readonly'    => true,
						'destructive' => false,
						'idempotent'  => true,
					],
				],
			]
		);
	}

	/**
	 * Register the complete-recommendation ability.
	 *
	 * @return void
	 */
	private function register_complete_recommendation() {
		\wp_register_ability(
			self::CATEGORY . '/complete-recommendation',
			[
				'label'               => \__( 'Complete recommendation', 'progress-planner' ),
				'description'         => \__( 'Apply a Progress Planner recommendation that consists of a single site setting, such as the tagline, timezone or date format. Only a fixed list of settings can be changed this way; anything needing judgement, content or deletion is reported back with a link instead of being applied.', 'progress-planner' ),
				'category'            => self::CATEGORY,
				'input_schema'        => [
					'type'                 => 'object',
					'additionalProperties' => false,
					'properties'           => [
						'provider_id' => [
							'type'        => 'string',
							'description' => \__( 'The provider ID of the recommendation to apply, for example "core-blogdescription". Omit to apply the highest-priority recommendation that can be applied automatically.', 'progress-planner' ),
						],
						'value'       => [
							'type'        => 'string',
							'description' => \__( 'The value to set, for recommendations that need one: the tagline text, a timezone identifier such as "Europe/Amsterdam", or a date format string. Recommendations with only one correct outcome ignore this.', 'progress-planner' ),
						],
					],
				],
				'output_schema'       => $this->get_complete_recommendation_schema(),
				'permission_callback' => [ $this, 'can_fix' ],
				'execute_callback'    => [ $this, 'complete_recommendation' ],
				'meta'                => [
					'show_in_rest' => true,
					'annotations'  => [
						'readonly'    => false,
						'destructive' => false,
						'idempotent'  => true,
					],
				],
			]
		);
	}

	/**
	 * Whether the current user may apply a fix.
	 *
	 * This is the capability the interactive tasks check before writing a
	 * setting, kept the same here so an ability can never do what the popover
	 * would refuse. There is no nonce: an authenticated agent call is not a
	 * forged cross-origin form post, so the capability and the fixed list of
	 * settings in Recommendation_Fixes are what bound this.
	 *
	 * @return bool
	 */
	public function can_fix() {
		return \current_user_can( 'manage_options' );
	}

	/**
	 * Apply a recommendation.
	 *
	 * @param array<string, mixed> $input The ability input.
	 *
	 * @return array<string, mixed>|\WP_Error
	 */
	public function complete_recommendation( $input = [] ) {
		$provider_id = isset( $input['provider_id'] ) ? (string) $input['provider_id'] : '';
		$value       = isset( $input['value'] ) ? (string) $input['value'] : null;

		if ( '' === $provider_id ) {
			$provider_id = $this->get_next_fixable_provider_id();

			if ( '' === $provider_id ) {
				return [
					'applied'   => false,
					'status'    => 'nothing_to_do',
					'message'   => \__( 'There is no pending recommendation that can be applied automatically.', 'progress-planner' ),
					'task'      => null,
					'admin_url' => '',
				];
			}
		}

		$task = $this->find_pending_task( $provider_id );

		if ( null === $task ) {
			return new \WP_Error(
				'progress_planner_no_such_recommendation',
				\__( 'There is no pending recommendation for that provider.', 'progress-planner' ),
				[ 'status' => 404 ]
			);
		}

		$provider = \progress_planner()->get_suggested_tasks()->get_tasks_manager()->get_task_provider( $provider_id );

		// The provider's own capability check, the same one the popover runs.
		if ( ! $provider || ! $provider->capability_required() ) {
			return new \WP_Error(
				'progress_planner_cannot_complete',
				\__( 'You do not have permission to complete this recommendation.', 'progress-planner' ),
				[ 'status' => 403 ]
			);
		}

		// Anything outside the fixable list is reported, never half-applied.
		if ( ! Recommendation_Fixes::has_fix( $provider_id ) ) {
			return [
				'applied'   => false,
				'status'    => 'manual',
				'message'   => \__( 'This recommendation needs a person: it involves content, a deletion, or a choice that should not be made automatically. Open the link to handle it.', 'progress-planner' ),
				'task'      => $this->prepare_recommendation( $task ),
				'admin_url' => (string) $task->url,
			];
		}

		$applied = Recommendation_Fixes::apply( $provider_id, $value );

		if ( \is_wp_error( $applied ) ) {
			return $applied;
		}

		// Completion is observed, never asserted: the provider decides whether
		// the site now satisfies the task. Saying otherwise would award points
		// for work that did not happen.
		$completed = \method_exists( $provider, 'is_task_completed' )
			? (bool) $provider->is_task_completed( $task->get_task_id() )
			: false;

		return [
			'applied'   => true,
			'status'    => $completed ? 'completed' : 'applied_not_yet_complete',
			'message'   => $completed
				? \__( 'The setting was changed and the recommendation is now satisfied.', 'progress-planner' )
				: \__( 'The setting was changed, but the recommendation is not reported as satisfied yet.', 'progress-planner' ),
			'task'      => $this->prepare_recommendation( $task ),
			'admin_url' => (string) $task->url,
		];
	}

	/**
	 * Find the highest-priority pending recommendation that can be fixed.
	 *
	 * Tasks come back ordered by menu_order, which is the order the dashboard
	 * shows them in, so "next" means the same thing to an agent as to a person.
	 *
	 * @return string The provider ID, or an empty string when there is none.
	 */
	private function get_next_fixable_provider_id() {
		$tasks = \progress_planner()->get_suggested_tasks_db()->get_tasks_by(
			[
				'post_status'    => 'publish',
				'posts_per_page' => -1,
			]
		);

		foreach ( $tasks as $task ) {
			$provider_id = $task->get_provider_id();

			if ( ! Recommendation_Fixes::has_fix( $provider_id ) ) {
				continue;
			}

			// A fix needing a value cannot be chosen unattended: there is no
			// correct tagline to invent on the site owner's behalf.
			if ( Recommendation_Fixes::needs_value( $provider_id ) ) {
				continue;
			}

			$provider = \progress_planner()->get_suggested_tasks()->get_tasks_manager()->get_task_provider( $provider_id );

			if ( ! $provider || ! $provider->capability_required() ) {
				continue;
			}

			// Task evaluation runs on admin_init, so a task fixed a moment ago is
			// still 'publish' here. Skipping the already-satisfied ones stops a
			// repeated run from picking the same task and reporting it as new work.
			if ( \method_exists( $provider, 'is_task_completed' ) && $provider->is_task_completed( $task->get_task_id() ) ) {
				continue;
			}

			return $provider_id;
		}

		return '';
	}

	/**
	 * Find a pending task for a provider.
	 *
	 * @param string $provider_id The provider ID.
	 *
	 * @return \Progress_Planner\Suggested_Tasks\Task|null
	 */
	private function find_pending_task( $provider_id ) {
		$tasks = \progress_planner()->get_suggested_tasks_db()->get_tasks_by(
			[
				'post_status'    => 'publish',
				'provider'       => $provider_id,
				'posts_per_page' => 1,
			]
		);

		return $tasks ? $tasks[0] : null;
	}

	/**
	 * Get the site score.
	 *
	 * Deliberately narrower than the SaaS status payload: the active-plugin
	 * inventory, site URL and branding ID that endpoint reports are telemetry for
	 * progressplanner.com, not something an agent needs to answer a question
	 * about site maintenance.
	 *
	 * @return array<string, mixed>
	 */
	public function get_site_score() {
		$activity_scores = \progress_planner()->get_admin__widgets__activity_scores();

		return [
			'score'           => (int) $activity_scores->get_score(),
			'checklist'       => $this->get_checklist(),
			'pending_updates' => (int) \wp_get_update_data()['counts']['total'],
			'badges'          => $this->get_badges(),
			'latest_badge'    => $this->get_latest_badge(),
			'monthly_scores'  => $this->get_monthly_scores(),
		];
	}

	/**
	 * List the recommendations.
	 *
	 * @param array<string, mixed> $input The ability input.
	 *
	 * @return array<string, mixed>
	 */
	public function list_recommendations( $input = [] ) {
		$status   = isset( $input['status'] ) ? (string) $input['status'] : 'pending';
		$limit    = isset( $input['limit'] ) ? (int) $input['limit'] : 20;
		$provider = isset( $input['provider'] ) ? (string) $input['provider'] : '';

		$query_args = [
			'post_status'    => $this->get_post_status_for( $status ),
			'posts_per_page' => $limit,
		];

		if ( '' !== $provider ) {
			$query_args['provider'] = $provider;
		}

		$tasks = \progress_planner()->get_suggested_tasks_db()->get_tasks_by( $query_args );

		// Task evaluation runs on admin_init, so an ability reports stored state
		// rather than re-running it: an agent request is not an admin request, and
		// evaluating here would mean a read silently writes.
		$recommendations = [];
		foreach ( $tasks as $task ) {
			$recommendation = $this->prepare_recommendation( $task );

			if ( null !== $recommendation ) {
				$recommendations[] = $recommendation;
			}
		}

		return [
			'recommendations' => $recommendations,
			'count'           => \count( $recommendations ),
		];
	}

	/**
	 * Map an ability status to the post status that encodes it.
	 *
	 * @param string $status The ability status.
	 *
	 * @return string
	 */
	private function get_post_status_for( $status ) {
		switch ( $status ) {
			case 'completed':
				return 'trash';

			case 'snoozed':
				return 'future';

			default:
				return 'publish';
		}
	}

	/**
	 * Prepare one recommendation for output.
	 *
	 * Returns null when the provider that owns the task is not available to the
	 * current user, so the list never advertises work they cannot do.
	 *
	 * @param \Progress_Planner\Suggested_Tasks\Task $task The task.
	 *
	 * @return array<string, mixed>|null
	 */
	private function prepare_recommendation( $task ) {
		$provider_id = $task->get_provider_id();
		$provider    = \progress_planner()->get_suggested_tasks()->get_tasks_manager()->get_task_provider( $provider_id );

		// A task whose provider is gone (a deactivated integration) has no
		// capability to check and no action to offer, so it is omitted.
		if ( ! $provider || ! $provider->capability_required() ) {
			return null;
		}

		return [
			'id'          => (string) \progress_planner()->get_suggested_tasks()->get_task_id_from_slug( $task->post_name ),
			'title'       => (string) $task->post_title,
			'description' => (string) $task->description,
			'provider_id' => (string) $provider_id,
			'url'         => (string) $task->url,
			// User-created tasks carry no points of their own; the provider is
			// the reliable source, with the stored value preferred when set.
			'points'      => (int) ( $task->points ?? $provider->get_points() ),
			// Lets a caller plan a run without discovering by trial which
			// recommendations it is allowed to apply.
			'fixable'     => Recommendation_Fixes::has_fix( $provider_id ),
			'needs_value' => Recommendation_Fixes::needs_value( $provider_id ),
		];
	}

	/**
	 * Get the weekly checklist as named booleans.
	 *
	 * @return array<string, bool>
	 */
	private function get_checklist() {
		// get_checklist_results() keys its results by translated label, which is
		// not a stable schema key. The items themselves are in a fixed order, so
		// the callbacks are invoked positionally and given names that are not.
		$items = \progress_planner()->get_admin__widgets__activity_scores()->get_checklist();
		$keys  = [ 'published_content', 'updated_content', 'no_pending_updates' ];

		$checklist = [];
		foreach ( $keys as $index => $key ) {
			$checklist[ $key ] = isset( $items[ $index ]['callback'] ) && \is_callable( $items[ $index ]['callback'] )
				? (bool) $items[ $index ]['callback']()
				: false;
		}

		return $checklist;
	}

	/**
	 * Get the badges and their progress.
	 *
	 * @return array<int, array<string, mixed>>
	 */
	private function get_badges() {
		$badges = \array_merge(
			\progress_planner()->get_badges()->get_badges( 'content' ),
			\progress_planner()->get_badges()->get_badges( 'maintenance' )
		);

		$output = [];
		foreach ( $badges as $badge ) {
			$progress = $badge->get_progress();

			$output[] = [
				'id'       => (string) $badge->get_id(),
				'name'     => (string) $badge->get_name(),
				'progress' => (int) ( $progress['progress'] ?? 0 ),
				'complete' => 100 === (int) ( $progress['progress'] ?? 0 ),
			];
		}

		return $output;
	}

	/**
	 * Get the most recently completed badge.
	 *
	 * @return array<string, string>|null
	 */
	private function get_latest_badge() {
		$badge = \progress_planner()->get_badges()->get_latest_completed_badge();

		if ( ! $badge ) {
			return null;
		}

		return [
			'id'   => (string) $badge->get_id(),
			'name' => (string) $badge->get_name(),
		];
	}

	/**
	 * Get the normalized monthly score history.
	 *
	 * @return array<int, array<string, mixed>>
	 */
	private function get_monthly_scores() {
		$scores = \progress_planner()->get_ui__chart()->get_chart_data(
			[
				'items_callback' => fn( $start_date, $end_date ) => \progress_planner()->get_activities__query()->query_activities(
					[
						'start_date' => $start_date,
						'end_date'   => $end_date,
					]
				),
				'dates_params'   => [
					'start_date' => \DateTime::createFromFormat( 'Y-m-d', \gmdate( 'Y-m-01' ) )->modify( '-6 months' ),
					'end_date'   => new \DateTime(),
					'frequency'  => 'monthly',
					'format'     => 'M',
				],
				'count_callback' => fn( $activities, $date ) =>
					\array_sum( \array_map( fn( $activity ) => $activity->get_points( $date ), $activities ) ) * 100 / \Progress_Planner\Base::SCORE_TARGET,
				'normalized'     => true,
				'max'            => 100,
			]
		);

		$output = [];
		foreach ( $scores as $item ) {
			$output[] = [
				'month' => (string) $item['label'],
				'score' => (int) \round( (float) $item['score'] ),
			];
		}

		return $output;
	}

	/**
	 * The output schema for get-site-score.
	 *
	 * @return array<string, mixed>
	 */
	private function get_site_score_schema() {
		return [
			'type'       => 'object',
			'properties' => [
				'score'           => [
					'type'        => 'integer',
					'description' => \__( 'The website activity score, from 0 to 100.', 'progress-planner' ),
				],
				'checklist'       => [
					'type'        => 'object',
					'description' => \__( 'The weekly maintenance checklist.', 'progress-planner' ),
					'properties'  => [
						'published_content'  => [
							'type'        => 'boolean',
							'description' => \__( 'Whether content was published in the last seven days.', 'progress-planner' ),
						],
						'updated_content'    => [
							'type'        => 'boolean',
							'description' => \__( 'Whether content was updated in the last seven days.', 'progress-planner' ),
						],
						'no_pending_updates' => [
							'type'        => 'boolean',
							'description' => \__( 'Whether the site has no pending updates.', 'progress-planner' ),
						],
					],
				],
				'pending_updates' => [
					'type'        => 'integer',
					'description' => \__( 'The number of pending core, plugin and theme updates.', 'progress-planner' ),
				],
				'badges'          => [
					'type'        => 'array',
					'description' => \__( 'The content and maintenance badges, with progress towards each.', 'progress-planner' ),
					'items'       => [
						'type'       => 'object',
						'properties' => [
							'id'       => [ 'type' => 'string' ],
							'name'     => [ 'type' => 'string' ],
							'progress' => [
								'type'        => 'integer',
								'description' => \__( 'Progress towards the badge, as a percentage.', 'progress-planner' ),
							],
							'complete' => [ 'type' => 'boolean' ],
						],
					],
				],
				'latest_badge'    => [
					'type'        => [ 'object', 'null' ],
					'description' => \__( 'The most recently completed badge, or null if none has been completed.', 'progress-planner' ),
					'properties'  => [
						'id'   => [ 'type' => 'string' ],
						'name' => [ 'type' => 'string' ],
					],
				],
				'monthly_scores'  => [
					'type'        => 'array',
					'description' => \__( 'The score for each of the last six months, oldest first.', 'progress-planner' ),
					'items'       => [
						'type'       => 'object',
						'properties' => [
							'month' => [ 'type' => 'string' ],
							'score' => [ 'type' => 'integer' ],
						],
					],
				],
			],
		];
	}

	/**
	 * The output schema for complete-recommendation.
	 *
	 * @return array<string, mixed>
	 */
	private function get_complete_recommendation_schema() {
		return [
			'type'       => 'object',
			'properties' => [
				'applied'   => [
					'type'        => 'boolean',
					'description' => \__( 'Whether a setting was changed.', 'progress-planner' ),
				],
				'status'    => [
					'type'        => 'string',
					'description' => \__( 'What happened: "completed" when the recommendation is now satisfied, "applied_not_yet_complete" when the setting changed but the task is not satisfied, "manual" when it needs a person, "nothing_to_do" when no automatic recommendation was pending.', 'progress-planner' ),
					'enum'        => [ 'completed', 'applied_not_yet_complete', 'manual', 'nothing_to_do' ],
				],
				'message'   => [
					'type'        => 'string',
					'description' => \__( 'A sentence describing the outcome.', 'progress-planner' ),
				],
				'task'      => [
					'type'        => [ 'object', 'null' ],
					'description' => \__( 'The recommendation that was acted on, if any.', 'progress-planner' ),
				],
				'admin_url' => [
					'type'        => 'string',
					'description' => \__( 'Where a person can handle this recommendation themselves.', 'progress-planner' ),
				],
			],
		];
	}

	/**
	 * The output schema for list-recommendations.
	 *
	 * @return array<string, mixed>
	 */
	private function get_recommendations_schema() {
		return [
			'type'       => 'object',
			'properties' => [
				'recommendations' => [
					'type'  => 'array',
					'items' => [
						'type'       => 'object',
						'properties' => [
							'id'          => [
								'type'        => 'string',
								'description' => \__( 'The task ID.', 'progress-planner' ),
							],
							'title'       => [
								'type'        => 'string',
								'description' => \__( 'What the task asks the user to do.', 'progress-planner' ),
							],
							'description' => [
								'type'        => 'string',
								'description' => \__( 'Why the task matters.', 'progress-planner' ),
							],
							'provider_id' => [
								'type'        => 'string',
								'description' => \__( 'The ID of the provider that raised this task.', 'progress-planner' ),
							],
							'url'         => [
								'type'        => 'string',
								'description' => \__( 'The admin URL where the task can be completed.', 'progress-planner' ),
							],
							'points'      => [
								'type'        => 'integer',
								'description' => \__( 'Points awarded for completing the task.', 'progress-planner' ),
							],
							'fixable'     => [
								'type'        => 'boolean',
								'description' => \__( 'Whether complete-recommendation can apply this one.', 'progress-planner' ),
							],
							'needs_value' => [
								'type'        => 'boolean',
								'description' => \__( 'Whether applying it requires a value from the caller, such as the tagline text.', 'progress-planner' ),
							],
						],
					],
				],
				'count'           => [
					'type'        => 'integer',
					'description' => \__( 'The number of recommendations returned.', 'progress-planner' ),
				],
			],
		];
	}
}
