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
	 * The badges context this widget shows (maintenance|content).
	 *
	 * @var string
	 */
	protected $context = '';

	/**
	 * The track, once worked out for this request.
	 *
	 * @var array|null
	 */
	private $track = null;

	/**
	 * Everything the widget and its popover show about this group of badges.
	 *
	 * - value: weeks in a row (best streak) or new posts/pages since activation.
	 * - streak: the current streak (streak badges only).
	 * - badges: each badge with its target, whether it is earned and how much is left.
	 * - next: the first badge not earned yet, or null when all are earned.
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
	public function get_track() {
		if ( null !== $this->track ) {
			return $this->track;
		}

		$track = [
			'value'       => 0,
			'streak'      => 0,
			'freeze_used' => false,
			'freeze_week' => null,
			'earned'      => 0,
			'next'        => null,
			'badges'      => [],
		];

		// Only badges with a target can be placed on the track.
		$badges = \array_values(
			\array_filter(
				\progress_planner()->get_badges()->get_badges( $this->context ),
				fn( $badge ) => \method_exists( $badge, 'get_target' )
			)
		);

		if ( 'maintenance' === $this->context && ! empty( $badges ) ) {
			$streak               = $badges[0]->get_goal()->get_streak(); // @phpstan-ignore-line method.notFound
			$track['value']       = (int) $streak['max_streak'];
			$track['streak']      = (int) $streak['current_streak'];
			$track['freeze_used'] = (bool) $streak['freeze_used'];
			$track['freeze_week'] = $streak['freeze_week'];
		} elseif ( 'content' === $this->context ) {
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

		foreach ( $badges as $badge ) {
			$target   = (int) $badge->get_target(); // @phpstan-ignore-line method.notFound
			$progress = $badge->get_progress();
			$earned   = 100 <= (int) $progress['progress'];

			// Streak badges save their progress for up to two days; use the
			// streak worked out just now, so the numbers agree with the track.
			$remaining = 'maintenance' === $this->context
				? \max( 0, $target - $track['value'] )
				: (int) $progress['remaining'];
			$earned    = $earned || 0 === $remaining;

			$item              = [
				'badge'     => $badge,
				'target'    => $target,
				'earned'    => $earned,
				'remaining' => $earned ? 0 : $remaining,
			];
			$track['badges'][] = $item;

			if ( $earned ) {
				++$track['earned'];
			} elseif ( null === $track['next'] ) {
				$track['next'] = $item;
			}
		}

		$this->track = $track;
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
