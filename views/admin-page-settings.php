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
			if ( \progress_planner()->is_pro_site() ) {
				\progress_planner()->the_asset( 'images/logo_progress_planner_pro.svg' );
			} else {
				\progress_planner()->the_asset( 'images/logo_progress_planner.svg' );
			}
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
		<div class="prpl-column">
			<div class="prpl-widget-wrapper">
				<h2 class="prpl-settings-section-title">
					<span class="icon">
						<?php \progress_planner()->the_asset( 'images/icon_pages.svg' ); ?>
					</span>
					<span>
						<?php esc_html_e( 'Your pages', 'progress-planner' ); ?>
					</span>
				</h2>
				<p>
					<?php esc_html_e( 'Let us know if you have following pages.', 'progress-planner' ); ?>
				</p>
				<div class="prpl-pages-list">
					<?php
					foreach ( \progress_planner()->get_admin__page_settings()->get_settings() as $prpl_setting ) {
						\progress_planner()->the_view( "setting/{$prpl_setting['type']}.php", [ 'prpl_setting' => $prpl_setting ] );
					}
					?>
				</div>
			</div>
		</div>

		<div class="prpl-column">
			<div class="prpl-widget-wrapper">
				<h2 class="prpl-settings-section-license">
					<span>
						<?php \esc_html_e( 'License', 'progress-planner' ); ?>
					</span>
				</h2>
				<div class="prpl-license-keys-wrapper">
					<?php
					$prpl_free_license_key = \get_option( 'progress_planner_license_key', '' );
					$prpl_free_license_key = ( 'no-license' === $prpl_free_license_key )
						? ''
						: $prpl_free_license_key;
					?>

					<?php if ( '' === $prpl_free_license_key ) : ?>
						<a href="<?php echo \esc_url( \admin_url( 'admin.php?page=progress-planner#prpl-popover-subscribe-form-trigger' ) ); ?>">
							<?php esc_html_e( 'Please complete the onboarding process, and register to weekly emails to allow registering for a PRO license.', 'progress-planner' ); ?>
						</a>
					<?php endif ?>

					<div style="<?php echo ( '' === $prpl_free_license_key ) ? 'display: none;' : ''; ?>">
						<?php
						$prpl_pro_license        = \get_option( 'progress_planner_pro_license_key', '' );
						$prpl_pro_license_status = \get_option( 'progress_planner_pro_license_status', '' );
						?>
						<?php if ( empty( $prpl_pro_license ) || 'valid' !== $prpl_pro_license_status ) : ?>
							<p>
								<?php
								printf(
									// translators: %s is a link to the Pro page, with the text "Progress Planner Pro".
									\esc_html__( 'Take part in interactive challenges to solve website problems like broken links and sharpen your skills with in-context mini courses. Upgrade to %s!', 'progress-planner' ),
									'<a href="https://progressplanner.com/pro/" target="_blank">Progress Planner Pro</a>'
								);
								?>
							</p>
						<?php endif; ?>
						<label for="prpl-setting-pro-license-key">
							<?php \esc_html_e( 'Progress Planner Pro license key', 'progress-planner' ); ?>
						</label>
						<div class="prpl-license-key-wrapper">
							<input
								id="prpl-setting-pro-license-key"
								name="prpl-pro-license-key"
								type="text"
								value="<?php echo \esc_attr( $prpl_pro_license ); ?>"
							/>
							<?php if ( ! empty( $prpl_pro_license ) ) : ?>
								<span class="prpl-license-status prpl-license-status-<?php echo ( 'valid' === $prpl_pro_license_status ) ? 'valid' : 'invalid'; ?>">
									<?php if ( 'valid' === $prpl_pro_license_status ) : ?>
										<span class="prpl-license-status-valid" title="<?php esc_attr_e( 'Valid', 'progress-planner' ); ?>">
											<?php \progress_planner()->the_asset( 'images/icon_check_circle.svg' ); ?>
										</span>
									<?php else : ?>
										<span class="prpl-license-status-invalid" title="<?php esc_attr_e( 'Invalid', 'progress-planner' ); ?>">
											<?php \progress_planner()->the_asset( 'images/icon_exclamation_circle.svg' ); ?>
										</span>
									<?php endif; ?>
								</span>
							<?php endif; ?>
						</div>
					</div>
				</div>
			</div>
		</div>

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
