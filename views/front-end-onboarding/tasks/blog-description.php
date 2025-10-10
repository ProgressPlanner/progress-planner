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
			<?php \esc_html_e( 'In a few words, explain what this site is about. This information is used in your website\'s schema and RSS feeds, and can be displayed on your site. The tagline typically is your site\'s mission statement.', 'progress-planner' ); ?>
		</p>
	</div>
	<form class="prpl-onboarding-task-form" onsubmit="return false;">
		<input type="text" name="blogdescription" value="<?php echo esc_attr( $task['site_description'] ); ?>" />
		<button type="button" id="first-task-btn" data-task-id="<?php echo esc_attr( $task['task_id'] ); ?>" class="prpl-complete-task-btn prpl-btn prpl-btn-primary">
			<?php if ( isset( $task['site_description'] ) && '' !== $task['site_description'] ) : ?>
				<?php \esc_html_e( 'Verify tagline', 'progress-planner' ); ?>
			<?php else : ?>
				<?php \esc_html_e( 'Set tagline', 'progress-planner' ); ?>
			<?php endif; ?>
		</button>
	</form>
</div>
