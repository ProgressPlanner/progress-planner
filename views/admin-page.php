<?php
/**
 * The admin page
 *
 * @package Progress_Planner
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$prpl_privacy_policy_accepted = \progress_planner()->is_privacy_policy_accepted();
$prpl_wrapper_class           = '';

if ( ! $prpl_privacy_policy_accepted ) {
	$prpl_wrapper_class = 'prpl-pp-not-accepted';
}
?>

<div class="wrap prpl-wrap <?php echo esc_attr( $prpl_wrapper_class ); ?>">
	<?php if ( true === $prpl_privacy_policy_accepted ) : ?>
		<h1 class="screen-reader-text"><?php \esc_html_e( 'Progress Planner', 'progress-planner' ); ?></h1>
		<?php \progress_planner()->the_view( 'admin-page-header.php' ); ?>
		<div class="prpl-widgets-container">
			<?php foreach ( \progress_planner()->get_admin__page()->get_widgets_filtered() as $prpl_admin_widget ) : ?>
				<?php $prpl_admin_widget->render(); ?>
			<?php endforeach; ?>
		</div>
	<?php else : ?>
		<?php \progress_planner()->the_view( 'welcome.php' ); ?>
	<?php endif; ?>
</div>
