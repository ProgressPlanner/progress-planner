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
					<?php \esc_html_e( 'As you progress and are more active on your website, you can earn badges. These badges are displayed here!', 'progress-planner' ); ?>
				</p>

				<p>
					Lorem ipsum dolor sit amet consectetur adipiscing, elit nullam hendrerit porttitor torquent, nec molestie hac parturient vehicula. Fames condimentum netus nisl tempus potenti curabitur iaculis nam velit, etiam sapien mollis dictum vitae eu bibendum per mus, hendrerit dis blandit parturient dictumst cum ridiculus libero.
				</p>
			</div>
			<div class="prpl-column">
				<img src="http://server.planner.test/wp-json/progress-planner-saas/v1/badge-svg/?badge_id=monthly-2025-m9&branding_id=0" alt="Badges">
			</div>
		</div>
	</div>
</script>
