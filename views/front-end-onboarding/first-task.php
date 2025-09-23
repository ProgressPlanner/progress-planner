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

<!-- Tour step connect -->
<script type="text/template" id="tour-step-first-task">
	<div class="tour-header">
		<h2 class="tour-title">
			<?php \esc_html_e( 'Complete your first task', 'progress-planner' ); ?>
		</h2>
	</div>
	<div class="tour-content">
		<p>You have pending tasks to complete.</p>
		<?php if ( isset( $task ) ) : ?>
		<p class="prpl-complete-task-item">
			<?php echo esc_html( $task['title'] ); ?>
			<button id="first-task-btn" data-task-id="<?php echo esc_attr( $task['task_id'] ); ?>" class="prpl-complete-task-btn"><?php \esc_html_e( 'Complete first task', 'progress-planner' ); ?></button>
		</p>
		<div id="first-task-status"></div>
		<?php endif; ?>
	</div>
</script>
