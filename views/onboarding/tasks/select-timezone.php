<?php
/**
 * Onboarding task, set site timezone.
 *
 * @package Progress_Planner
 *
 * @var array $task
 */

// Exit if accessed directly.
if ( ! \defined( 'ABSPATH' ) ) {
	exit;
}

$prpl_current_offset = \get_option( 'gmt_offset' );
$prpl_tzstring       = \get_option( 'timezone_string' );
?>

<div class="prpl-onboarding-task">
	<h3 class="prpl-onboarding-task-title">
		<?php echo \esc_html( $task['title'] ); ?>
	</h3>
	<p>
		<?php \esc_html_e( 'Setting your timezone ensures that scheduled posts and automated updates happen exactly when you expect them to. It keeps your site\'s clock synced with your local time. Pick your city or offset now!', 'progress-planner' ); ?>
	</p>
	<form class="prpl-onboarding-task-form" onsubmit="return false;">
		<select id="timezone" name="timezone" data-validate="required">
			<?php echo \wp_timezone_choice( $prpl_tzstring, \get_user_locale() ); ?>
		</select>
		<button type="button" data-task-id="<?php echo \esc_attr( $task['task_id'] ); ?>" class="prpl-complete-task-btn prpl-btn prpl-btn-secondary">
			<?php \esc_html_e( 'Set the timezone', 'progress-planner' ); ?>
			<?php if ( ! empty( $show_chevron ) ) : ?>
				<span class="dashicons dashicons-arrow-right-alt2"></span>
			<?php endif; ?>
		</button>
	</form>
</div>
