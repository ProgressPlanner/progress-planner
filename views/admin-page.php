<?php
/**
 * The admin page
 *
 * @package Progress_Planner
 */

// Exit if accessed directly.
if ( ! \defined( 'ABSPATH' ) ) {
	exit;
}

$prpl_privacy_policy_accepted = \progress_planner()->is_privacy_policy_accepted();
$prpl_wrapper_class           = '';

if ( 0 !== (int) \progress_planner()->get_ui__branding()->get_branding_id() ) {
	$prpl_license_key = \progress_planner()->get_utils__onboard()->make_remote_onboarding_request();
	if ( '' !== $prpl_license_key ) {
		\update_option( 'progress_planner_license_key', $prpl_license_key );
		$prpl_privacy_policy_accepted = true;
	}
}

if ( ! $prpl_privacy_policy_accepted ) {
	$prpl_wrapper_class = 'prpl-pp-not-accepted';
}
?>

<div class="wrap prpl-wrap <?php echo \esc_attr( $prpl_wrapper_class ); ?>">
	<?php if ( true === $prpl_privacy_policy_accepted ) : ?>
		<h1 class="screen-reader-text"><?php \esc_html_e( 'Progress Planner', 'progress-planner' ); ?></h1>
		<?php \progress_planner()->the_view( 'admin-page-header.php' ); ?>
		<div class="prpl-widgets-container">
			<?php foreach ( \progress_planner()->get_admin__page()->get_widgets() as $prpl_admin_widget ) : ?>
				<?php $prpl_admin_widget->render(); ?>
			<?php endforeach; ?>
		</div>

		<?php
			/**
			 * Fires after the widgets are rendered.
			 * Nice place to add custom content since our styling is in general applied inside .prpl-wrap .
			 *
			 * @since 1.1.1
			 */
			\do_action( 'progress_planner_admin_page_after_widgets' );
		?>
	<?php else : ?>
		<?php \progress_planner()->the_view( 'welcome.php' ); ?>
	<?php endif; ?>
</div>
<div class="prpl-overlay" style="display: none;" onclick="document.querySelector('[data-tooltip-visible=true]').removeAttribute('data-tooltip-visible')"></div>

<?php \progress_planner()->the_view( 'js-templates/suggested-task.html' ); ?>
