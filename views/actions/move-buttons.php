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
<div class="tooltip-actions">
	<span class="prpl-move-buttons">
		<button type="button" class="prpl-suggested-task-button move-up" data-task-id="<?php echo \esc_attr( $prpl_data['meta']['prpl_task_id'] ); ?>" data-task-title="<?php echo \esc_attr( $prpl_data['title']['rendered'] ); ?>" data-action="move-up" data-target="move-up" title="<?php \esc_html_e( 'Move up', 'progress-planner' ); ?>" onclick="prplSuggestedTask.runButtonAction( this );">
			<span class="dashicons dashicons-arrow-up-alt2"></span>
			<span class="screen-reader-text"><?php \esc_html_e( 'Move up', 'progress-planner' ); ?></span>
		</button>
		<button type="button" class="prpl-suggested-task-button move-down" data-task-id="<?php echo \esc_attr( $prpl_data['meta']['prpl_task_id'] ); ?>" data-task-title="<?php echo \esc_attr( $prpl_data['title']['rendered'] ); ?>" data-action="move-down" data-target="move-down" title="<?php \esc_html_e( 'Move down', 'progress-planner' ); ?>" onclick="prplSuggestedTask.runButtonAction( this );">
			<span class="dashicons dashicons-arrow-down-alt2"></span>
			<span class="screen-reader-text"><?php \esc_html_e( 'Move down', 'progress-planner' ); ?></span>
		</button>
	</span>
</div>
