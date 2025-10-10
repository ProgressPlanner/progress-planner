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

<!-- Tour step badges -->
<script type="text/template" id="tour-step-badges">
	<div class="tour-header">
		<h2 class="tour-title">
			<?php \esc_html_e( 'Our badges are waiting for you', 'progress-planner' ); ?>
		</h2>
	</div>
	<div class="tour-content">
		<div class="prpl-columns-wrapper-flex">
			<div class="prpl-column prpl-column-content">
				<p>
					<?php \esc_html_e( 'For every recommendation you complete, you earn points. When you earn at least 10 points each month, you\'ll unlock the special badge for that month. Can you collect them all?', 'progress-planner' ); ?>
				</p>
			</div>
			<div class="prpl-column">
				<img src="<?php echo esc_url( \constant( 'PROGRESS_PLANNER_URL' ) ); ?>/assets/front-end-onboarding/images/badge-gauge.png" alt="Badges">
			</div>
		</div>
	</div>
</script>
