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
<script type="text/template" id="tour-step-whats-next">
	<div class="tour-content">
		<div class="prpl-columns-wrapper-flex">
			<div class="prpl-column prpl-column-content">
				<h3>
					<?php \esc_html_e( 'Recommendations', 'progress-planner' ); ?>
				<p>
					<?php
					\printf( \esc_html__( 'Tasks that show you what to work on next.', 'progress-planner' ) );
					?>
				</p>
				<p>
					<?php \esc_html_e( 'These actions help you to improve your site step by step, withouth having to guess where to start.', 'progress-planner' ); ?>
				</p>
			</div>
			<div class="prpl-column prpl-column-content">
				<h3>
					<?php \esc_html_e( 'Badges', 'progress-planner' ); ?>
				<p>
					<?php
					\printf( \esc_html__( 'You earn points for every completed task.', 'progress-planner' ) );
					?>
				</p>
				<p>
					<?php \esc_html_e( 'Collect badges as you make progress, which keeps things fun and helps you stay motivated!', 'progress-planner' ); ?>
				</p>
			</div>
		</div>
	</div>
</script>
