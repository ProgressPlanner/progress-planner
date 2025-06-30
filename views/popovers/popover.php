<?php
/**
 * Popover.
 *
 * @package Progress_Planner
 */

// Exit if accessed directly.
if ( ! \defined( 'ABSPATH' ) ) {
	exit;
}
?>

<div id="prpl-popover-<?php echo \esc_attr( $prpl_popover_id ); ?>" class="prpl-popover" popover>
	<!-- The content. -->
	<?php \progress_planner()->the_view( 'popovers/' . $prpl_popover_id . '.php' ); ?>

	<!-- The close button. -->
	<button
		class="prpl-popover-close"
		popovertarget="prpl-popover-<?php echo \esc_attr( $prpl_popover_id ); ?>"
		popovertargetaction="hide"
	>
		<span class="dashicons dashicons-no-alt"></span>
		<span class="screen-reader-text"><?php \esc_html_e( 'Close', 'progress-planner' ); ?>
	</button>
</div>
