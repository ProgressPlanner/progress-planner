<?php
/**
 * Handle user badges.
 *
 * @package ProgressPlanner
 */

namespace ProgressPlanner;

use ProgressPlanner\Goals\Goal_Recurring;
use ProgressPlanner\Goals\Goal_Posts;
use ProgressPlanner\Base;

/**
 * Badges class.
 */
class Badges {

	/**
	 * The name of the badges option.
	 *
	 * @var string
	 */
	const OPTION_NAME = 'progress_planner_badges';

	/**
	 * Registered badges.
	 *
	 * @var array
	 */
	private $badges = [];

	/**
	 * Badges progress.
	 *
	 * @var array
	 */
	private $badges_progress = [];

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->badges_progress = \get_option( self::OPTION_NAME, [] );
		$this->register_badges();
	}

	/**
	 * Register a badge.
	 *
	 * @param string $badge_id The badge ID.
	 * @param array  $args     The badge arguments.
	 *
	 * @return void
	 */
	public function register_badge( $badge_id, $args ) {
		$args['id']                = $badge_id;
		$this->badges[ $badge_id ] = $args;
	}

	/**
	 * Get a badge by ID.
	 *
	 * @param string $badge_id The badge ID.
	 *
	 * @return array
	 */
	public function get_badge( $badge_id ) {
		return isset( $this->badges[ $badge_id ] ) ? $this->badges[ $badge_id ] : [];
	}

	/**
	 * Get all badges.
	 *
	 * @return array
	 */
	public function get_badges() {
		return $this->badges;
	}

	/**
	 * Get the progress for a badge.
	 *
	 * @param string $badge_id The badge ID.
	 *
	 * @return int
	 */
	public function get_badge_progress( $badge_id ) {
		$badge = $this->get_badge( $badge_id );
		if ( empty( $badge ) ) {
			return 0;
		}

		$progress = [];

		if ( ! isset( $badge['steps'] ) ) {
			return $badge['progress_callback']();
		}

		foreach ( $badge['steps'] as $step ) {
			$progress[] = [
				'name'     => $step['name'],
				'icons'    => $step['icons-svg'],
				'progress' => $badge['progress_callback']( $step['target'] ),
			];
		}

		return $progress;
	}

	/**
	 * Register Core badges.
	 *
	 * @return void
	 */
	private function register_badges() {
		// Badges for number of posts.
		$this->register_badge(
			'content_writing',
			[
				'public'            => true,
				'steps'             => [
					[
						'target'    => 'wonderful-writer',
						'name'      => __( 'Wonderful Writer', 'progress-planner' ),
						'icons-svg' => [
							\PROGRESS_PLANNER_DIR . '/assets/images/badges/writing_badge1_gray.svg',
							\PROGRESS_PLANNER_DIR . '/assets/images/badges/writing_badge1.svg',
						],
					],
					[
						'target'    => 'awesome-author',
						'name'      => __( 'Awesome Author', 'progress-planner' ),
						'icons-svg' => [
							\PROGRESS_PLANNER_DIR . '/assets/images/badges/writing_badge2_gray.svg',
							\PROGRESS_PLANNER_DIR . '/assets/images/badges/writing_badge2.svg',
						],
					],
					[
						'target'    => 'notorious-novelist',
						'name'      => __( 'Notorious Novelist', 'progress-planner' ),
						'icons-svg' => [
							\PROGRESS_PLANNER_DIR . '/assets/images/badges/writing_badge3_gray.svg',
							\PROGRESS_PLANNER_DIR . '/assets/images/badges/writing_badge3.svg',
						],
					],
				],
				'progress_callback' => function ( $target ) {
					// Evaluation for the "Wonderful writer" badge.
					if ( 'wonderful-writer' === $target ) {
						$existing_count = count(
							\progress_planner()->get_query()->query_activities(
								[
									'category' => 'content',
									'type'     => 'publish',
								]
							)
						);
						// Targeting 200 existing posts.
						$existing_progress = max( 100, floor( $existing_count / 2 ) );
						if ( 100 <= $existing_progress ) {
							return 100;
						}
						$new_count = count(
							\progress_planner()->get_query()->query_activities(
								[
									'category'   => 'content',
									'type'       => 'publish',
									'start_date' => Base::get_activation_date(),
								],
							)
						);
						// Targeting 10 new posts.
						$new_progress = max( 100, floor( $new_count * 10 ) );

						return max( $existing_progress, $new_progress );
					}

					// Evaluation for the "Awesome author" badge.
					if ( 'awesome-author' === $target ) {
						$new_count = count(
							\progress_planner()->get_query()->query_activities(
								[
									'category'   => 'content',
									'type'       => 'publish',
									'start_date' => Base::get_activation_date(),
								],
							)
						);
						// Targeting 30 new posts.
						return min( 100, floor( 100 * $new_count / 30 ) );
					}

					// Evaluation for the "Notorious novelist" badge.
					if ( 'notorious-novelist' === $target ) {
						$new_count = count(
							\progress_planner()->get_query()->query_activities(
								[
									'category'   => 'content',
									'type'       => 'publish',
									'start_date' => Base::get_activation_date(),
								],
							)
						);
						// Targeting 50 new posts.
						return min( 100, floor( 50 * $new_count / 100 ) );
					}
				},
			]
		);

		// Write a post for 10 consecutive weeks.
		$this->register_badge(
			'streak_any_task',
			[
				'public'            => true,
				'steps'             => [
					[
						'target'    => 6,
						'name'      => __( 'Progress Professional', 'progress-planner' ),
						'icons-svg' => [
							\PROGRESS_PLANNER_DIR . '/assets/images/badges/streak_badge1_gray.svg',
							\PROGRESS_PLANNER_DIR . '/assets/images/badges/streak_badge1.svg',
						],
					],
					[
						'target'    => 26,
						'name'      => __( 'Maintenance Maniac', 'progress-planner' ),
						'icons-svg' => [
							\PROGRESS_PLANNER_DIR . '/assets/images/badges/streak_badge2_gray.svg',
							\PROGRESS_PLANNER_DIR . '/assets/images/badges/streak_badge2.svg',
						],
					],
					[
						'target'    => 52,
						'name'      => __( 'Super Site Specialist', 'progress-planner' ),
						'icons-svg' => [
							\PROGRESS_PLANNER_DIR . '/assets/images/badges/streak_badge3_gray.svg',
							\PROGRESS_PLANNER_DIR . '/assets/images/badges/streak_badge3.svg',
						],
					],
				],
				'progress_callback' => function ( $target ) {
					$goal = new Goal_Recurring(
						new Goal_Posts(
							[
								'id'          => 'weekly_post',
								'title'       => \esc_html__( 'Write a weekly blog post', 'progress-planner' ),
								'description' => \esc_html__( 'Streak: The number of weeks this goal has been accomplished consistently.', 'progress-planner' ),
								'status'      => 'active',
								'priority'    => 'low',
								'evaluate'    => function ( $goal_object ) {
									return (bool) count(
										\progress_planner()->get_query()->query_activities(
											[
												'category' => 'content',
												'type'     => 'publish',
												'start_date' => $goal_object->get_details()['start_date'],
												'end_date' => $goal_object->get_details()['end_date'],
											]
										)
									);
								},
							]
						),
						'weekly',
						Base::get_activation_date(),
						new \DateTime(), // Today.
						1 // Allow break in the streak for 1 week.
					);

					return min( floor( 100 * $goal->get_streak()['max_streak'] / $target ), 100 );
				},
			]
		);

		// Write a post for 10 consecutive weeks.
		$this->register_badge(
			'personal_record_content',
			[
				'public'            => false,
				'progress_callback' => function () {
					$goal = new Goal_Recurring(
						new Goal_Posts(
							[
								'id'          => 'weekly_post',
								'title'       => \esc_html__( 'Write a weekly blog post', 'progress-planner' ),
								'description' => \esc_html__( 'Streak: The number of weeks this goal has been accomplished consistently.', 'progress-planner' ),
								'status'      => 'active',
								'priority'    => 'low',
								'evaluate'    => function ( $goal_object ) {
									return (bool) count(
										\progress_planner()->get_query()->query_activities(
											[
												'category' => 'content',
												'type'     => 'publish',
												'start_date' => $goal_object->get_details()['start_date'],
												'end_date' => $goal_object->get_details()['end_date'],
											]
										)
									);
								},
							]
						),
						'weekly',
						new \DateTime( '-2 years' ), // 2 years ago.
						new \DateTime(), // Today.
						0 // Do not allow breaks in the streak.
					);

					return $goal->get_streak()['max_streak'];
				},
			]
		);
	}
}
