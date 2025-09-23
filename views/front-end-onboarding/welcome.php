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

<!-- Tour step welcome -->
<script type="text/template" id="tour-step-welcome">
	<div class="tour-header">
		<h2 class="tour-title">
			<?php \esc_html_e( 'Welcome to the Progress Planner onboarding.', 'progress-planner' ); ?>
		</h2>
	</div>
	<div class="tour-content">
		<p><?php \esc_html_e( 'Welcome to the Progress Planner onboarding.', 'progress-planner' ); ?></p>
	</div>
</script>
