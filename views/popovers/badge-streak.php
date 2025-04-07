<?php
/**
 * Popover for the badge streak.
 *
 * @package Progress_Planner
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
<h2><?php \esc_html_e( 'You are on the right track!', 'progress-planner' ); ?></h2>
<p><?php \esc_html_e( 'Find out which badges to unlock next and become a Progress Planner Professional!', 'progress-planner' ); ?></p>

<div class="prpl-widgets-container in-popover">
	<div class="prpl-widget-wrapper in-popover">
		<h3><?php \esc_html_e( 'Don’t break your streak and stay active every week!', 'progress-planner' ); ?></h3>
		<p><?php \esc_html_e( 'Execute at least one website maintenance task every week. That could be publishing content, adding content, updating a post, or updating a plugin.', 'progress-planner' ); ?></p>
		<p><?php \esc_html_e( 'Not able to work on your site for a week? Use your streak freeze!', 'progress-planner' ); ?></p>
		<div id="popover-badge-streak-content">
			<?php \progress_planner()->the_view( 'popovers/parts/badge-streak-badge.php', [ 'prpl_category' => 'maintenance' ] ); ?>
		</div>
		<?php \progress_planner()->the_view( 'popovers/parts/badge-streak-progressbar.php', [ 'prpl_context' => 'maintenance' ] ); ?>
	</div>
</div>
<div class="footer">
	<div class="string-freeze-explain">
		<h2><?php \esc_html_e( 'Streak freeze', 'progress-planner' ); ?></h2>
		<p><?php \esc_html_e( 'Going on a holiday? Or don\'t have any time this week? You can skip your website maintenance for a maximum of one week. Your streak will continue afterward.', 'progress-planner' ); ?></p>
	</div>
</div>
