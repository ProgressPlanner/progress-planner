<?php
/**
 * Pages settings.
 *
 * @package Progress_Planner
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$prpl_pages = \progress_planner()->get_admin__page_settings()->get_settings();
?>

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

		<?php if ( ! empty( $prpl_pages ) ) : ?>
			<p>
				<?php esc_html_e( 'Let us know if you have following pages.', 'progress-planner' ); ?>
			</p>
			<div class="prpl-pages-list">
				<?php
				foreach ( $prpl_pages as $prpl_setting ) {
					\progress_planner()->the_view( "setting/{$prpl_setting['type']}.php", [ 'prpl_setting' => $prpl_setting ] );
				}
				?>
			</div>
		<?php else : ?>
			<p>
				<?php esc_html_e( 'There seems to be a problem with loading page types from our server. Please try again later or check the API status.', 'progress-planner' ); ?>
			</p>
		<?php endif; ?>
	</div>
</div>
