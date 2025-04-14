<?php
/**
 * Api status settings.
 *
 * @package Progress_Planner
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>

<div class="prpl-column">
	<div class="prpl-widget-wrapper">
		<h2 class="prpl-settings-section-title prpl-settings-section-api-status">
			<span class="icon">
				<?php \progress_planner()->the_asset( 'images/icon_server.svg' ); ?>
			</span>
			<span>
				<?php \esc_html_e( 'Check API status', 'progress-planner' ); ?>
			</span>
		</h2>
		<div class="prpl-api-status-wrapper">
			<label for="prpl-setting-api-status">
				<?php \esc_html_e( 'Ping our server and check the status API status.', 'progress-planner' ); ?>
			</label>
			<div class="prpl-api-status-controls">
				<input
					id="prpl-setting-api-status"
					class="prpl-button-secondary"
					name="prpl-api-status"
					type="button"
					value="<?php \esc_attr_e( 'Ping API', 'progress-planner' ); ?>"
				/>
				<span class="prpl-api-status-response-wrapper">
					<span class="prpl-api-status-icon-spinner" title="<?php esc_attr_e( 'Checking...', 'progress-planner' ); ?>">
						<img src="<?php echo \esc_url( \admin_url( 'images/spinner.gif' ) ); ?>" alt="<?php esc_attr_e( 'Checking...', 'progress-planner' ); ?>" />
					</span>
					<span class="prpl-api-status-icon-ok" title="<?php esc_attr_e( 'Accessible', 'progress-planner' ); ?>">
						<?php \progress_planner()->the_asset( 'images/icon_check_circle.svg' ); ?>
					</span>
					<span class="prpl-api-status-icon-error" title="<?php esc_attr_e( 'Not accessible', 'progress-planner' ); ?>">
						<?php \progress_planner()->the_asset( 'images/icon_exclamation_circle.svg' ); ?>
					</span>
					<span class="prpl-api-status-text">
						<?php \esc_html_e( 'API is accessible', 'progress-planner' ); ?>
					</span>
				</span>
			</div>
		</div>
	</div>
</div>
