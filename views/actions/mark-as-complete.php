<?php
/**
 * View for an action.
 *
 * @package Progress_Planner
 */

if ( ! \defined( 'ABSPATH' ) ) {
	exit;
}
?>
<span class="tooltip-action">
	<button type="button" class="prpl-suggested-task-button" data-task-id="<?php echo \esc_attr( $prpl_data['meta']['prpl_task_id'] ); ?>" data-task-title="<?php echo \esc_attr( $prpl_data['title']['rendered'] ); ?>" data-action="complete" data-target="complete" title="<?php \esc_html_e( 'Mark as complete', 'progress-planner' ); ?>" onclick="prplSuggestedTask.maybeComplete( <?php echo (int) $prpl_data['id']; ?> );">
		<span class="prpl-tooltip-action-text"><?php \esc_html_e( 'Mark as complete', 'progress-planner' ); ?></span>
		<span class="screen-reader-text"><?php \esc_html_e( 'Mark as complete', 'progress-planner' ); ?></span>
	</button>
</span>
