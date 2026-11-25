<?php
/**
 * A widget class.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Admin\Widgets;

/**
 * Badge_Streak class.
 */
abstract class Badge_Streak extends Widget {

	/**
	 * The widget ID.
	 *
	 * @var string
	 */
	protected $id = 'badge-streak';

	/**
	 * Enqueue styles.
	 *
	 * @return void
	 */
	public function enqueue_styles() {
		\progress_planner()->get_admin__enqueue()->enqueue_style( 'progress-planner/page-widgets/badge-streak' );
	}

	/**
	 * The number each badge is earned at: weeks in a row, or new posts/pages.
	 *
	 * Content Curator can also be earned with 20 existing posts/pages; the
	 * track uses its new-content target.
	 *
	 * @var array<string, int>
	 */
	const BADGE_TARGETS = [
		'progress-padawan'      => 6,
		'maintenance-maniac'    => 26,
		'super-site-specialist' => 52,
		'content-curator'       => 10,
		'revision-ranger'       => 30,
		'purposeful-publisher'  => 50,
	];

	/**
	 * Everything the widget and the popover show about a group of badges.
	 *
	 * @param string $context The badges context (maintenance|content).
	 *
	 * @return array{
	 *     value: int,
	 *     streak: int,
	 *     freeze_used: bool,
	 *     freeze_week: int|null,
	 *     earned: int,
	 *     next: array{badge: \Progress_Planner\Badges\Badge, target: int, earned: bool, remaining: int}|null,
	 *     badges: array<int, array{badge: \Progress_Planner\Badges\Badge, target: int, earned: bool, remaining: int}>
	 * }
	 */
	public function get_track( $context ) {
		$track = [
			'value'       => 0,
			'streak'      => 0,
			'freeze_used' => false,
			'freeze_week' => null,
			'earned'      => 0,
			'next'        => null,
			'badges'      => [],
		];

		foreach ( \progress_planner()->get_badges()->get_badges( $context ) as $badge ) {
			if ( ! isset( self::BADGE_TARGETS[ $badge->get_id() ] ) ) {
				continue;
			}

			$progress = $badge->get_progress();
			$item     = [
				'badge'     => $badge,
				'target'    => self::BADGE_TARGETS[ $badge->get_id() ],
				'earned'    => 100 <= (int) $progress['progress'],
				'remaining' => (int) $progress['remaining'],
			];

			$track['badges'][] = $item;
			if ( $item['earned'] ) {
				++$track['earned'];
			} elseif ( null === $track['next'] ) {
				$track['next'] = $item;
			}
		}

		if ( 'maintenance' === $context && ! empty( $track['badges'] ) ) {
			$streak               = $track['badges'][0]['badge']->get_goal()->get_streak(); // @phpstan-ignore-line method.notFound
			$track['value']       = (int) $streak['max_streak'];
			$track['streak']      = (int) $streak['current_streak'];
			$track['freeze_used'] = (bool) $streak['freeze_used'];
			$track['freeze_week'] = $streak['freeze_week'];
		} elseif ( 'content' === $context ) {
			$track['value'] = \count(
				\progress_planner()->get_activities__query()->query_activities(
					[
						'category'   => 'content',
						'type'       => 'publish',
						'start_date' => \progress_planner()->get_activation_date(),
					]
				)
			);
		}

		return $track;
	}

	/**
	 * Get the badge.
	 *
	 * @param string $context The context of the badges (content|maintenance|monthly).
	 *
	 * @return \Progress_Planner\Badges\Badge|false
	 */
	public function get_details( $context ) {
		static $result = [];
		if ( isset( $result[ $context ] ) && ! empty( $result[ $context ] ) ) {
			return $result[ $context ];
		}

		$badges = \progress_planner()->get_badges()->get_badges( $context );

		// Get the badge to display.
		foreach ( $badges as $badge ) {
			$progress = $badge->get_progress();
			if ( 100 >= $progress['progress'] ) {
				$result[ $context ] = $badge;
				break;
			}
		}

		return isset( $result[ $context ] ) ? $result[ $context ] : false;
	}
}
