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
 * This class registers and delegates; the work lives in Site_Score and
 * Recommendations.
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
	 * The capability required to change a setting.
	 *
	 * The same capability the interactive tasks check before writing, so an
	 * ability can never do what the popover would refuse.
	 *
	 * @var string
	 */
	const WRITE_CAPABILITY = 'manage_options';

	/**
	 * The site-score reader.
	 *
	 * @var Site_Score
	 */
	private $site_score;

	/**
	 * The recommendations reader and applier.
	 *
	 * @var Recommendations
	 */
	private $recommendations;

	/**
	 * The completer for recommendations that state a goal.
	 *
	 * @var Server_Recommendations
	 */
	private $server_recommendations;

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->site_score             = new Site_Score();
		$this->recommendations        = new Recommendations();
		$this->server_recommendations = new Server_Recommendations();

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

		\wp_register_ability(
			self::CATEGORY . '/get-site-score',
			$this->ability_args(
				[
					'label'            => \__( 'Get site score', 'progress-planner' ),
					'description'      => \__( 'Get the Progress Planner activity score for this site, the weekly maintenance checklist, earned badges and the six-month score history.', 'progress-planner' ),
					'input_schema'     => Schemas::no_input(),
					'output_schema'    => Schemas::site_score(),
					'execute_callback' => [ $this->site_score, 'get' ],
				]
			)
		);

		\wp_register_ability(
			self::CATEGORY . '/list-recommendations',
			$this->ability_args(
				[
					'label'            => \__( 'List recommendations', 'progress-planner' ),
					'description'      => \__( 'List the website maintenance tasks Progress Planner currently recommends, newest first. Returns only tasks the current user is allowed to act on.', 'progress-planner' ),
					'input_schema'     => Schemas::list_recommendations_input(),
					'output_schema'    => Schemas::recommendations(),
					'execute_callback' => [ $this->recommendations, 'list' ],
				]
			)
		);

		\wp_register_ability(
			self::CATEGORY . '/complete-recommendation',
			$this->ability_args(
				[
					'label'               => \__( 'Complete recommendation', 'progress-planner' ),
					'description'         => \__( 'Apply a Progress Planner recommendation that consists of a single site setting, such as the tagline, timezone or an SEO plugin toggle. Only a fixed list of settings can be changed this way; anything needing judgement, content or deletion is reported back with a link instead of being applied.', 'progress-planner' ),
					'input_schema'        => Schemas::complete_recommendation_input(),
					'output_schema'       => Schemas::complete_recommendation(),
					'permission_callback' => [ $this, 'can_fix' ],
					'execute_callback'    => [ $this->recommendations, 'complete' ],
					'readonly'            => false,
				]
			)
		);

		\wp_register_ability(
			self::CATEGORY . '/complete-server-recommendation',
			$this->ability_args(
				[
					'label'               => \__( 'Complete a goal-shaped recommendation', 'progress-planner' ),
					'description'         => \__( 'Mark a recommendation that states a goal as completed, after you have satisfied it and verified the result yourself. Use this only for recommendations that carry a "goal" -- the ones the plugin cannot apply on its own. Verify before calling: the site does not re-check the goal, so a recommendation marked done without being done scores the site for work nobody did.', 'progress-planner' ),
					'input_schema'        => Schemas::complete_server_recommendation_input(),
					'output_schema'       => Schemas::complete_server_recommendation(),
					'permission_callback' => [ $this, 'can_fix' ],
					'execute_callback'    => [ $this->server_recommendations, 'complete' ],
					'readonly'            => false,
				]
			)
		);
	}

	/**
	 * Build the registration arguments for one ability.
	 *
	 * The shared parts are defined once so an ability cannot drift from the
	 * category, the permission model or the annotations the others declare.
	 *
	 * @param array<string, mixed> $args The ability-specific arguments.
	 *
	 * @return array<string, mixed>
	 */
	private function ability_args( array $args ) {
		$readonly = $args['readonly'] ?? true;
		unset( $args['readonly'] );

		return \array_merge(
			[
				'category'            => self::CATEGORY,
				'permission_callback' => [ $this, 'can_read' ],
				'meta'                => [
					'show_in_rest' => true,
					'annotations'  => [
						'readonly'    => $readonly,
						// Nothing registered here deletes or overwrites content:
						// the write ability changes settings from a fixed list.
						'destructive' => false,
						'idempotent'  => true,
					],
				],
			],
			$args
		);
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
	 * Whether the current user may apply a fix.
	 *
	 * There is no nonce: an authenticated agent call is not a forged
	 * cross-origin form post, so this capability and the fixed list of settings
	 * in Recommendation_Fixes are what bound the write surface.
	 *
	 * @return bool
	 */
	public function can_fix() {
		return \current_user_can( self::WRITE_CAPABILITY );
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
}
