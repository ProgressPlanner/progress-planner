<?php
/**
 * Tour step view.
 *
 * @package Progress_Planner
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
				<?php foreach ( $tasks as $prpl_task ) : ?>
				<li class="prpl-complete-task-item">
					<span class="task-title" style="flex-shrink: 0;">
						<?php echo esc_html( $prpl_task['title'] ); ?>
					</span>


					<div style="max-width: 300px;">
						<details>
							<summary style="text-align: end;"><?php \esc_html_e( 'Complete task', 'progress-planner' ); ?></summary>

							<div>
								<?php \progress_planner()->the_view( 'front-end-onboarding/tasks/' . $prpl_task['task_id'] . '.php', [ 'task' => $prpl_task ] ); ?>
							</div>
						</details>
					</div>
					<!-- <button type="button" class="prpl-complete-task-btn" data-popover-id="prpl-popover-<?php echo esc_attr( $task['task_id'] ); ?>" onclick="const popover = document.getElementById('prpl-popover-<?php echo esc_attr( $task['task_id'] ); ?>'); if (popover && popover.showPopover) { popover.showPopover(); }"><?php \esc_html_e( 'Complete task', 'progress-planner' ); ?></button> -->
				</li>
			<?php endforeach; ?>
		</ul>
	</div>
</script>

<?php if ( isset( $tasks['select-timezone'] ) ) : ?>
	<!-- <div id="prpl-popover-select-timezone" class="prpl-popover prpl-popover-onboarding" popover="manual">
		<?php \progress_planner()->the_view( 'front-end-onboarding/tasks/timezone.php', [ 'task' => $tasks['select-timezone'] ] ); ?>

		<button
			class="prpl-popover-close"
			popovertarget="prpl-popover-select-timezone"
			popovertargetaction="hide"
		>
			<span class="dashicons dashicons-no-alt"></span>
			<span class="screen-reader-text"><?php \esc_html_e( 'Close', 'progress-planner' ); ?>
		</button>
	</div> -->
<?php endif; ?>
