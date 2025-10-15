<?php
/**
 * The Settings screen.
 *
 * @package Progress_Planner
 */

// Exit if accessed directly.
if ( ! \defined( 'ABSPATH' ) ) {
	exit;
}
?>

<div class="wrap prpl-wrap prpl-settings-wrap">
	<div class="prpl-header">
		<div class="prpl-header-logo">
			<?php \progress_planner()->get_ui__branding()->the_logo(); ?>
		</div>
	</div>

	<div class="prpl-settings-form-wrap">
		<h1>
			<span>
				<?php \esc_html_e( 'Your Progress Planner settings', 'progress-planner' ); ?>
			</span>
		</h1>

		<form id="prpl-settings">
			<?php \progress_planner()->the_view( 'page-settings/pages.php' ); ?>

			<div id="prpl-grid-column-wrapper">
				<?php \progress_planner()->the_view( 'page-settings/post-types.php' ); ?>
				<?php \progress_planner()->the_view( 'page-settings/settings.php' ); ?>
			</div>

			<?php \progress_planner()->the_view( 'page-settings/api-status.php' ); ?>

			<?php \wp_nonce_field( 'progress_planner' ); ?>

			<button
				id="prpl-settings-submit"
				class="prpl-button-primary"
				type="button"
				style="display:block;width:min-content;"
			>
				<?php \esc_attr_e( 'Save', 'progress-planner' ); ?>
			</button>
		</form>
	</div>
</div>
