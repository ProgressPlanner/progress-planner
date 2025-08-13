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
<h2 class="prpl-widget-title">
	<span>
		<?php
		echo \progress_planner()->get_ui__branding()->get_widget_title( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			'todo',
			\esc_html__( 'My to-do list', 'progress-planner' )
		);
		?>
	</span>
</h2>

<p>
	<span class="prpl-todo-golden-task-description">
		<?php \esc_html_e( 'Write down all your tasks you want to get done on your website! You’ll earn points for your ‘golden task’. ', 'progress-planner' ); ?>
	</span>

	<span class="prpl-todo-silver-task-description">
		<?php \esc_html_e( 'Write down all your tasks you want to get done on your website! The top task will become your ‘golden task’ next week. ', 'progress-planner' ); ?>
	</span>

	<span class="tooltip-actions" style="display: inline-flex;vertical-align: text-top;">
		<prpl-tooltip>
			<slot name="open-icon">
				<span class="icon prpl-info-icon">
					<?php \progress_planner()->the_asset( 'images/icon_info.svg' ); ?>
					<span class="screen-reader-text"><?php \esc_html_e( 'More info', 'progress-planner' ); ?></span>
				</span>
			</slot>
			<slot name="content">
				<?php \esc_html_e( 'Every Monday, your top task becomes the golden task for the week. Complete it anytime this week to earn points toward your monthly total! Once done, the next task is highlighted to become your golden task next week.', 'progress-planner' ); ?>
			</slot>
		</prpl-tooltip>
	</span>
</p>

<?php \progress_planner()->get_admin__widgets__todo()->the_todo_list(); ?>
