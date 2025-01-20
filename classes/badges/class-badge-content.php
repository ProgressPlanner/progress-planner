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
	 * The background color for the badge.
	 *
	 * @var string
	 */
	protected $background = 'var(--prpl-background-blue)';
}
