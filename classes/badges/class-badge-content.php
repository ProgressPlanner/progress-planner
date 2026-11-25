<?php
/**
 * Badge object.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Badges;

/**
 * Badge class.
 */
abstract class Badge_Content extends Badge {

	/**
	 * The number needed to earn the badge; each badge sets its own.
	 *
	 * @var int
	 */
	const TARGET = 0;

	/**
	 * Get the number needed to earn the badge.
	 *
	 * @return int
	 */
	public function get_target() {
		return static::TARGET;
	}

	/**
	 * The background color for the badge.
	 *
	 * @var string
	 */
	protected $background = 'var(--prpl-background-content-badge)';
}
