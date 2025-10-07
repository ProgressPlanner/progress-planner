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
		<p><?php \esc_html_e( 'Check out more tasks to complete:', 'progress-planner' ); ?></p>
		<ul class="prpl-task-list">
			<?php foreach ( $tasks as $prpl_task ) : ?>
			<li class="prpl-complete-task-item">
				<span class="task-title" style="flex-shrink: 0;">
					<?php echo esc_html( $prpl_task['title'] ); ?>
				</span>

				<div class="prpl-task-item" data-popover="task" data-task-id="<?php echo esc_attr( $prpl_task['task_id'] ); ?>">
					<button class="prpl-complete-task-btn" prpl-open-task-popover>Complete Task</button>

					<template style="display: none;">
						<?php \progress_planner()->the_view( 'front-end-onboarding/tasks/' . $prpl_task['task_id'] . '.php', [ 'task' => $prpl_task ] ); ?>
					</template>
				</div>
			</li>
			<?php endforeach; ?>
		</ul>
	</div>
</script>
