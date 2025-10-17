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
			\esc_html__( 'Complete a task from %s’s Recommendations to improve your site and earn points toward this month’s badge!', 'progress-planner' ),
			\esc_html( \progress_planner()->get_ui__branding()->get_ravi_name() )
		);
		?>
	</p>

	<ul style="display:none"></ul>
	<ul id="prpl-suggested-tasks-list" class="prpl-suggested-tasks-list"></ul>
	<p class="prpl-suggested-tasks-loading">
		<?php \esc_html_e( 'Loading tasks...', 'progress-planner' ); ?>
	</p>
	<?php // Check if the request URI contains the parameter 'prpl_show_all_recommendations'. ?>
	<?php $prpl_request_uri = isset( $_SERVER['REQUEST_URI'] ) ? \sanitize_text_field( \wp_unslash( $_SERVER['REQUEST_URI'] ) ) : ''; ?>
	<p class="prpl-show-all-tasks">
		<?php if ( false === \strpos( $prpl_request_uri, 'prpl_show_all_recommendations' ) ) : ?>
			<a href="<?php echo \esc_url( \add_query_arg( 'prpl_show_all_recommendations', '', \admin_url( 'admin.php?page=progress-planner&prpl_show_all_recommendations' ) ) ); ?>">
				<?php \esc_html_e( 'Show all recommendations', 'progress-planner' ); ?>
			</a>
		<?php else : ?>
			<a href="<?php echo \esc_url( \remove_query_arg( 'prpl_show_all_recommendations', \admin_url( 'admin.php?page=progress-planner' ) ) ); ?>">
				<?php \esc_html_e( 'Show fewer recommendations', 'progress-planner' ); ?>
			</a>
		<?php endif; ?>
	</p>
	<p class="prpl-no-suggested-tasks">
		<?php \esc_html_e( 'You have completed all recommended tasks.', 'progress-planner' ); ?>
		<br>
		<?php \esc_html_e( 'Check back later for new tasks!', 'progress-planner' ); ?>
	</p>
</div>
<prpl-popover-post-content post-id="3771" button-content="Read more"></prpl-popover-post-content>
