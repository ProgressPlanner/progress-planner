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

<!-- Tour step connect -->
<script type="text/template" id="tour-step-first-task">
	<div class="tour-header">
		<h2 class="tour-title">
			<?php \esc_html_e( 'Complete your first task', 'progress-planner' ); ?>
		</h2>
	</div>
	<div class="tour-content">
		<div class="prpl-columns-wrapper-flex">
			<div class="prpl-column prpl-column-content">
				<p>
					<?php \esc_html_e( 'This is an example of a recommendation in Progress Planner. It\'s a task that helps improve your website. Most recommendations can be completed in under five minutes. Once you\'ve completed a recommendation, we\'ll celebrate your success together and provide you with a new recommendation.', 'progress-planner' ); ?>
				</p>
				<p><?php \esc_html_e( 'Let\'s give it a try!', 'progress-planner' ); ?></p>
			</div>
			<div class="prpl-column">
				<?php if ( isset( $task ) ) : ?>
					<?php \progress_planner()->the_view( 'front-end-onboarding/tasks/blog-description.php', [ 'task' => $task ] ); ?>
				<?php endif; ?>
			</div>
		</div>
	</div>
</script>
