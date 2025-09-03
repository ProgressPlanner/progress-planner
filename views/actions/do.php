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
	<?php if ( isset( $prpl_details['popover_id'] ) ) : ?>
		<a href="#" role="button" onclick="document.getElementById('<?php echo \esc_attr( $prpl_data['popover_id'] ); ?>')?.showPopover()">
			<?php echo \esc_html( $prpl_data['task_action_text'] ); ?>
		</a>
	<?php elseif ( isset( $prpl_details['url'] ) ) : ?>
		<a class="prpl-tooltip-action-text" href="<?php echo \esc_attr( $prpl_data['url'] ); ?>" target="<?php echo \esc_attr( $prpl_data['url_target'] ); ?>">
			<?php echo \esc_html( $prpl_data['task_action_text'] ); ?>
		</a>
	<?php endif; ?>
</span>
