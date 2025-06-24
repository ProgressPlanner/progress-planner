<?php
/**
 * Widget view.
 *
 * @package Progress_Planner
 */

if ( ! \defined( 'ABSPATH' ) ) {
	exit;
}

$prpl_challenge = \progress_planner()->get_admin__widgets__challenge()->get_challenge();
?>
<h2 class="prpl-widget-title">
	<?php if ( $prpl_challenge['icon'] ) : ?>
		<img src="<?php echo \esc_url( $prpl_challenge['icon'] ); ?>" alt="">
	<?php endif; ?>
	<?php echo \esc_html( $prpl_challenge['name'] ); ?>
</h2>

<div class="prpl-challenge-content">
	<?php echo \wp_kses_post( \str_replace( '{{admin_url}}', \admin_url(), $prpl_challenge['content'] ) ); ?>
</div>
