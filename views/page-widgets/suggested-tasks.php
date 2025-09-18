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
			\esc_html__( 'Ravi\'s Recommendations', 'progress-planner' )
		);
		?>
	</h2>
	<p class="prpl-suggested-tasks-widget-description">
		<?php \esc_html_e( 'Complete a task from Ravi’s Recommendations to improve your site and earn points toward this month’s badge!', 'progress-planner' ); ?>
	</p>

	<ul style="display:none"></ul>
	<ul id="prpl-suggested-tasks-list" class="prpl-suggested-tasks-list"></ul>
	<p class="prpl-suggested-tasks-loading">
		<?php \esc_html_e( 'Loading tasks...', 'progress-planner' ); ?>
	</p>
	<p class="prpl-no-suggested-tasks">
		<?php \esc_html_e( 'You have completed all recommended tasks.', 'progress-planner' ); ?>
		<br>
		<?php \esc_html_e( 'Check back later for new tasks!', 'progress-planner' ); ?>
	</p>
	<hr>
</div>
