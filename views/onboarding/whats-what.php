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
<script type="text/template" id="onboarding-step-whats-what">
	<div class="tour-content">
		<div class="prpl-columns-wrapper-flex">
			<div class="prpl-column">
				<div class="prpl-background-content">
					<h3>
						<?php \esc_html_e( 'Recommendations', 'progress-planner' ); ?>
					</h3>
					<p>
						<?php
						\printf( \esc_html__( 'Tasks that show you what to work on next.', 'progress-planner' ) );
						?>
					</p>
					<p>
						<?php \esc_html_e( 'These actions help you improve your site step by step, without having to guess where to start.', 'progress-planner' ); ?>
					</p>
				</div>
			</div>
			<div class="prpl-column">
				<div class="prpl-background-content">
					<h3>
						<?php \esc_html_e( 'Badges', 'progress-planner' ); ?>
					</h3>
					<p>
						<span class="prpl-suggested-task-points">
							+1
						</span>
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
	</div>
	<div class="tour-footer">
		<div class="prpl-tour-next-wrapper">
			<button class="prpl-tour-next prpl-btn prpl-btn-primary"><?php \esc_html_e( 'Next', 'progress-planner' ); ?></button>
		</div>
	</div>
</script>
