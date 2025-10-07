<?php
/**
 * Onboarding task, blog description.
 *
 * @package Progress_Planner
 *
 * @var array $task
 */

// Exit if accessed directly.
if ( ! \defined( 'ABSPATH' ) ) {
	exit;
}
?>

<div class="prpl-onboarding-task">
	<div>
		<h3 class="prpl-onboarding-task-title">
			<?php echo esc_html( $task['title'] ); ?>
		</h3>
		<p>
			Lorem ipsum dolor sit amet consectetur adipiscing elit, eget interdum nostra tortor vestibulum ultrices, quisque congue nibh ullamcorper sapien natoque.
		</p>

		<p>
			Venenatis parturient suspendisse massa cursus litora dapibus auctor, et vestibulum blandit condimentum quis ultrices sagittis aliquam.
		</p>
	</div>
	<form class="prpl-onboarding-task-form" onsubmit="return false;">
		<input type="text" name="prpl-test-input" value="<?php echo esc_attr( $task['site_description'] ); ?>" />
		<button type="button" id="first-task-btn" data-task-id="<?php echo esc_attr( $task['task_id'] ); ?>" class="prpl-complete-task-btn prpl-btn prpl-btn-primary">
			<?php if ( isset( $task['site_description'] ) && '' !== $task['site_description'] ) : ?>
				<?php \esc_html_e( 'Verify tagline', 'progress-planner' ); ?>
			<?php else : ?>
				<?php \esc_html_e( 'Complete first task', 'progress-planner' ); ?>
			<?php endif; ?>
		</button>
	</form>
</div>
