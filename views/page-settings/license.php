<?php
/**
 * License settings.
 *
 * @package Progress_Planner
 */

// Exit if accessed directly.
if ( ! \defined( 'ABSPATH' ) ) {
	exit;
}

$prpl_pro_license        = \get_option( 'progress_planner_pro_license_key', '' );
$prpl_pro_license_status = \get_option( 'progress_planner_pro_license_status', '' );

?>

<div class="prpl-column prpl-column-license">
	<h2 class="prpl-settings-section-title prpl-settings-section-license">
		<span class="icon">
			<?php \progress_planner()->the_asset( 'images/icon_key.svg' ); ?>
		</span>
		<span>
			<?php \esc_html_e( 'License', 'progress-planner' ); ?>
		</span>
	</h2>
	<div class="prpl-settings-section-wrapper">
		<div class="prpl-license-keys-wrapper">
			<?php if ( empty( $prpl_pro_license ) || 'valid' !== $prpl_pro_license_status ) : ?>
				<p>
					<?php
					\printf(
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
							<span class="prpl-license-status-valid" title="<?php \esc_attr_e( 'Valid', 'progress-planner' ); ?>">
								<?php \progress_planner()->the_asset( 'images/icon_check_circle.svg' ); ?>
							</span>
						<?php else : ?>
							<span class="prpl-license-status-invalid" title="<?php \esc_attr_e( 'Invalid', 'progress-planner' ); ?>">
								<?php \progress_planner()->the_asset( 'images/icon_exclamation_circle.svg' ); ?>
							</span>
						<?php endif; ?>
					</span>
				<?php endif; ?>
			</div>
		</div>
	</div>
</div>
