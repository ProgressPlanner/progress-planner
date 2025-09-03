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
	<a class="prpl-tooltip-action-text" href="<?php echo \esc_attr( $prpl_external_url ); ?>" target="_blank">
		<?php \esc_html_e( 'Why is this important?', 'progress-planner' ); ?>
	</a>
</span>
