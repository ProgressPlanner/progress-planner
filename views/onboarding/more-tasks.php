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
<script type="text/template" id="onboarding-step-more-tasks">
	<div class="tour-content">
		<!-- Substep 1: Info screen -->
		<div class="prpl-more-tasks-substep" data-substep="more-tasks-intro">
			<div class="prpl-columns-wrapper-flex prpl-columns-2-1">
				<div class="prpl-column">
					<div class="prpl-background-content">
						<p>
							<strong><?php \esc_html_e( 'Well done! Great work so far!', 'progress-planner' ); ?></strong>
						</p>
						<p>
							<?php \esc_html_e( 'You can take on a few more recommendations if you feel like it, or jump straight to your dashboard.', 'progress-planner' ); ?>
						</p>
					</div>
					<div class="prpl-more-tasks-intro-buttons">
						<a href="<?php echo \esc_url( \admin_url( 'admin.php?page=progress-planner' ) ); ?>" class="prpl-finish-onboarding"><?php \esc_html_e( 'Take me to the dashboard', 'progress-planner' ); ?></a>
						<button class="prpl-btn prpl-btn-secondary prpl-more-tasks-continue"><?php \esc_html_e( 'Yes! Let\'s tackle more tasks', 'progress-planner' ); ?> &rsaquo;</button>
					</div>
				</div>
				<div class="prpl-column prpl-hide-on-mobile">
					<div id="prpl-success-graphic">
						<?php \progress_planner()->the_file( 'assets/images/onboarding/success_ravi.svg' ); ?>
					</div>
				</div>
			</div>
		</div>

		<!-- Substep 2: Task list -->
		<div class="prpl-more-tasks-substep prpl-columns-wrapper-flex" data-substep="more-tasks-tasks" style="display: none;">
			<div class="prpl-column">
				<ul class="prpl-task-list">
					<?php foreach ( $tasks as $prpl_task ) : ?>
					<li class="prpl-complete-task-item">
						<span class="task-title" style="flex-shrink: 0;">
							<span class="prpl-task-arrow">&rarr;</span>
							<?php echo esc_html( $prpl_task['title'] ); ?>
						</span>

						<div class="prpl-task-item" data-popover="task" data-task-id="<?php echo \esc_attr( $prpl_task['task_id'] ); ?>">
							<div class="prpl-task-item-button-wrapper">
								<button class="prpl-complete-task-btn" prpl-open-task><?php echo \esc_html_e( 'Start', 'progress-planner' ); ?></button>
								<span class="prpl-suggested-task-points">
									+1
								</span>
							</div>

							<span class="prpl-task-completed-icon">&check;</span>

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
	<div class="tour-footer">
		<div class="prpl-tour-next-wrapper">
			<button class="prpl-tour-next prpl-btn prpl-btn-secondary"><?php \esc_html_e( 'Take me to the dashboard', 'progress-planner' ); ?> &rsaquo;</button>
		</div>
	</div>
</script>
