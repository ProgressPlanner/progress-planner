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
	<?php if ( isset( $prpl_data['meta']['prpl_popover_id'] ) && $prpl_data['meta']['prpl_popover_id'] ) : ?>
		<a href="#" class="prpl-tooltip-action-text" role="button" onclick="document.getElementById('<?php echo \esc_attr( $prpl_data['meta']['prpl_popover_id'] ); ?>')?.showPopover()">
			<?php echo \esc_html( $prpl_data['task_action_text'] ); ?>
		</a>
	<?php elseif ( isset( $prpl_data['meta']['prpl_url'] ) ) : ?>
		<a class="prpl-tooltip-action-text" href="<?php echo \esc_attr( $prpl_data['meta']['prpl_url'] ); ?>" target="<?php echo \esc_attr( $prpl_data['meta']['prpl_url_target'] ); ?>">
			<?php echo \esc_html( $prpl_data['task_action_text'] ); ?>
		</a>
	<?php endif; ?>
</span>
