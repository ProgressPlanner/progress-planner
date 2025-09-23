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

<!-- Tour step finish -->
<script type="text/template" id="tour-step-finish">
	<div class="tour-header">
		<h2 class="tour-title">
			<?php \esc_html_e( 'Setup complete', 'progress-planner' ); ?>
		</h2>
	</div>
	<div class="tour-content">
		<p><?php \esc_html_e( 'Congratulations, setup complete. 🎉', 'progress-planner' ); ?></p>
	</div>
</script>
