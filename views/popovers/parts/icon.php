<?php
/**
 * Icon.
 *
 * @package Progress_Planner
 */

if ( ! \defined( 'ABSPATH' ) ) {
	exit;
}

?>
<!-- The triggering button. -->
<button
	class="prpl-info-icon"
	popovertarget="prpl-popover-<?php echo \esc_attr( $prpl_popover_id ); ?>"
	id="prpl-popover-<?php echo \esc_attr( $prpl_popover_id ); ?>-trigger"
>
	<?php if ( '' !== $prpl_popover_trigger_icon ) : ?>
		<span class="dashicons dashicons-<?php echo \esc_attr( $prpl_popover_trigger_icon ); ?>"></span>
	<?php endif; ?>
	<?php echo $prpl_popover_trigger_content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
</button>
