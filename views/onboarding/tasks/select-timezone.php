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
		<?php echo esc_html( $task['title'] ); ?>
	</h3>
	<p>
		Venenatis parturient suspendisse massa cursus litora dapibus auctor, et vestibulum blandit condimentum quis ultrices sagittis aliquam.
	</p>
	<form class="prpl-onboarding-task-form" onsubmit="return false;">
		<select id="timezone" name="timezone" data-validate="required">
			<?php echo \wp_timezone_choice( $prpl_tzstring, \get_user_locale() ); ?>
		</select>
		<button type="button" data-task-id="<?php echo esc_attr( $task['task_id'] ); ?>" class="prpl-complete-task-btn prpl-btn prpl-btn-primary">
			<?php \esc_html_e( 'Set the timezone', 'progress-planner' ); ?>
		</button>
	</form>
</div>
