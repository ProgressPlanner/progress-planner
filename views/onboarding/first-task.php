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
<script type="text/template" id="onboarding-step-first-task">
	<div class="tour-content">
		<div class="prpl-columns-wrapper-flex">
			<div class="prpl-column">
				<div class="prpl-background-content">
					<h3>
						<?php \esc_html_e( 'Ready for your first task and your first point?', 'progress-planner' ); ?>
					</h3>
					<p>
						<?php
						/* translators: %s: Progress Planner name. */
						\printf( \esc_html__( 'This is an example of a recommendation in %s. It\'s a task that helps improve your website. Most recommendations can be completed in under five minutes. Once you\'ve completed a recommendation, we\'ll celebrate your success together and provide you with a new recommendation.', 'progress-planner' ), \esc_html( \progress_planner()->get_ui__branding()->get_admin_menu_name() ) );
						?>
					</p>
					<p><?php \esc_html_e( 'Let\'s give it a try!', 'progress-planner' ); ?></p>
				</div>
			</div>
			<div class="prpl-column">
				<?php if ( isset( $task ) ) : ?>
					<?php
					\progress_planner()->the_view(
						'onboarding/tasks/' . $task['task_id'] . '.php',
						[
							'task'         => $task,
							'show_chevron' => true,
						]
					);
					?>
				<?php endif; ?>
			</div>
		</div>
	</div>
</script>
