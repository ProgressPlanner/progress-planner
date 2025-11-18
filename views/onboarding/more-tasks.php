<?php
/**
 * Tour step view.
 *
 * @package Progress_Planner
 *
 * @var array $tasks
 */

// Exit if accessed directly.
if ( ! \defined( 'ABSPATH' ) ) {
	exit;
}
?>

<!-- Tour step more tasks -->
<script type="text/template" id="tour-step-more-tasks">
	<div class="tour-header">
		<h2 class="tour-title">
			<?php \esc_html_e( 'Complete more tasks', 'progress-planner' ); ?>
		</h2>
	</div>
	<div class="tour-content">
		<div class="prpl-columns-wrapper-flex">
			<div class="prpl-column prpl-column-content">
				<p>
					<?php
					/* translators: %1$s: Progress Planner name. %2$s: Ravi name. */
					\printf( \esc_html__( 'You now master the basics of %1$s! We\'ve got a few more recommendations lined up for you. Are you ready to take them on now, or should we show you where you can find %2$s\'s Recommendations from now on?', 'progress-planner' ), \esc_html( \progress_planner()->get_ui__branding()->get_admin_menu_name() ), \esc_html( \progress_planner()->get_ui__branding()->get_ravi_name() ) );
					?>
					</p>
			</div>
			<div class="prpl-column">
				<ul class="prpl-task-list">
					<?php foreach ( $tasks as $prpl_task ) : ?>
					<li class="prpl-complete-task-item">
						<span class="task-title" style="flex-shrink: 0;">
							<?php echo esc_html( $prpl_task['title'] ); ?>
						</span>

						<div class="prpl-task-item" data-popover="task" data-task-id="<?php echo esc_attr( $prpl_task['task_id'] ); ?>">
							<button class="prpl-complete-task-btn" prpl-open-task-popover><?php \esc_html_e( 'Start', 'progress-planner' ); ?></button>

							<template style="display: none;">
								<?php \progress_planner()->the_view( 'onboarding/tasks/' . $prpl_task['task_id'] . '.php', [ 'task' => $prpl_task ] ); ?>
							</template>
						</div>
					</li>
					<?php endforeach; ?>
			</ul>
			</div>
		</div>
	</div>
</script>
