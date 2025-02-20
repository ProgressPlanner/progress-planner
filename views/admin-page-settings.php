<?php
/**
 * The Settings screen.
 *
 * @package Progress_Planner
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>

<div class="wrap prpl-wrap prpl-settings-wrap">
	<div class="prpl-header">
		<div class="prpl-header-logo">
			<?php
			\progress_planner()->the_asset(
				\progress_planner()->is_pro_site()
					? 'images/logo_progress_planner_pro.svg'
					: 'images/logo_progress_planner.svg'
			);
			?>
		</div>
	</div>
	<h1>
		<span class="icon">
			<?php \progress_planner()->the_asset( 'images/icon_settings.svg' ); ?>
		</span>
		<span>
			<?php esc_html_e( 'Your Progress Planner settings', 'progress-planner' ); ?>
		</span>
	</h1>

	<form id="prpl-settings">
		<?php \progress_planner()->the_view( 'page-settings/pages.php' ); ?>
		<?php \progress_planner()->the_view( 'page-settings/settings.php' ); ?>
		<?php \progress_planner()->the_view( 'page-settings/license.php' ); ?>

		<?php wp_nonce_field( 'prpl-settings' ); ?>

		<button
			id="prpl-settings-submit"
			class="prpl-button-primary"
			type="button"
			style="display:block;width:min-content;"
		>
			<?php esc_attr_e( 'Save', 'progress-planner' ); ?>
		</button>
	</form>
</div>
