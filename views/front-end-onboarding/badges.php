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
		<p>
			<?php \esc_html_e( 'Every step you take makes your website better. Progress Planner tracks your progress, celebrating achievements with badges and streaks to keep you motivated and engaged.', 'progress-planner' ); ?>
		</p>
	</div>
</script>
