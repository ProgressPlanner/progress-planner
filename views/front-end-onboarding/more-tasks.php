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
		<ul id="prpl-more-tasks-list">
			<?php
			for ( $prpl_i = 0; $prpl_i < 5; $prpl_i++ ) :
				if ( ! isset( $tasks[ $prpl_i ] ) ) {
					break; }
				?>
				<li class="prpl-complete-task-item">
					<?php echo esc_html( $tasks[ $prpl_i ]['title'] ); ?>
					<button id="more-tasks-btn-<?php echo esc_attr( $tasks[ $prpl_i ]['task_id'] ); ?>" data-task-id="<?php echo esc_attr( $tasks[ $prpl_i ]['task_id'] ); ?>" class="prpl-complete-task-btn"><?php \esc_html_e( 'Complete task', 'progress-planner' ); ?></button>
				</li>
			<?php endfor; ?>
		</ul>
	</div>
</script>
