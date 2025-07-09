<?php
/**
 * Popover for the email-sending task.
 *
 * @package Progress_Planner
 */

// Exit if accessed directly.
if ( ! \defined( 'ABSPATH' ) ) {
	exit;
}

?>

<prpl-interactive-task-popover
	popover-id="<?php echo \esc_attr( 'prpl-popover-' . $prpl_popover_id ); ?>"
	provider-id="<?php echo \esc_attr( $prpl_provider_id ); ?>"
>
	<div class="prpl-columns-wrapper-flex">
		<div class="prpl-column prpl-column-content">
			<h2><?php echo \wp_kses_post( $prpl_task_details['post_title'] ); ?></h2>
			<p><?php echo \wp_kses_post( $prpl_popover_instructions ); ?></p>
		</div>
		<div class="prpl-column">
			<form onsubmit="return false;">
				<label>
					<?php $prpl_task_object->print_popover_input_field(); ?>
					<p><?php echo \wp_kses_post( $prpl_task_details['description'] ); ?></p>
				</label>

				<button type="submit" class="prpl-button prpl-button-primary" style="color: #fff;"><?php \esc_html_e( 'Save', 'progress-planner' ); ?></button>
			</form>
		</div>
	</div>

	<button class="prpl-popover-close" data-action="closePopover">
		<span class="dashicons dashicons-no-alt"></span>
		<span class="screen-reader-text"><?php \esc_html_e( 'Close', 'progress-planner' ); ?></span>
	</button>
</prpl-interactive-task-popover>
