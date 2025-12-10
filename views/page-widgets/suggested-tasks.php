<?php
/**
 * Widget view.
 *
 * @package Progress_Planner
 */

if ( ! \defined( 'ABSPATH' ) ) {
	exit;
}
?>

<div class="prpl-dashboard-widget-suggested-tasks">
	<h2 class="prpl-widget-title">
		<?php
		echo \progress_planner()->get_ui__branding()->get_widget_title( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			'suggested-tasks',
			\sprintf(
				/* translators: %s: Ravi's name. */
				\esc_html__( '%s\'s Recommendations', 'progress-planner' ),
				\esc_html( \progress_planner()->get_ui__branding()->get_ravi_name() )
			)
		);
		?>
	</h2>
	<p class="prpl-suggested-tasks-widget-description">
		<?php
		\printf(
			/* translators: %s: Ravi's name. */
			\esc_html__( 'Complete a task from %s\'s Recommendations to improve your site and earn points toward this month\'s badge!', 'progress-planner' ),
			\esc_html( \progress_planner()->get_ui__branding()->get_ravi_name() )
		);
		?>
	</p>

	<div id="prpl-suggested-tasks-root"></div>
</div>
