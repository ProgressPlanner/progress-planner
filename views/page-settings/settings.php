<?php
/**
 * Settings.
 *
 * @package Progress_Planner
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$prpl_redirect_on_login = \get_user_meta( \get_current_user_id(), 'prpl_redirect_on_login', true );
?>

<div class="prpl-column prpl-column-login-destination">
	<div class="prpl-widget-wrapper">
		<h2 class="prpl-settings-section-title">
			<span class="icon">
				<?php \progress_planner()->the_asset( 'images/icon_user.svg' ); ?>
			</span>
			<span>
				<?php \esc_html_e( 'Default login destination', 'progress-planner' ); ?>
			</span>
		</h2>
		<div class="prpl-settings-wrapper">
			<label for="prpl-setting-redirect-on-login">
				<input
					id="prpl-setting-redirect-on-login"
					name="prpl-redirect-on-login"
					type="checkbox"
					<?php checked( $prpl_redirect_on_login ); ?>
				/>
				<span><?php \esc_html_e( 'Show the Progress Planner dashboard after login.', 'progress-planner' ); ?></span>
			</label>
		</div>
	</div>
</div>
