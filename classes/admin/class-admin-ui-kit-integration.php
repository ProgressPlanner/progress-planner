<?php
/**
 * Integrates progress-planner's admin UI with the wp-admin-ui kit.
 *
 * {@see Admin_UI_Instance::get()} boots the kit with register_page=true,
 * so the kit's PageRegistrar owns the top-level admin menu. This class
 * adds progress-planner's widgets to the kit instance and wires the
 * plugin's UI bits (notification counter, welcome/privacy gate, tour
 * button, subscribe popover, JS templates, overlay script) into the
 * kit's action/filter hooks.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Admin;

use ProgressPlanner\AdminUI\AdminUI;

/**
 * Attaches progress-planner UI onto the kit's admin page.
 */
final class Admin_UI_Kit_Integration {

	/**
	 * Plugin bootstrap entry point (hooked from progress-planner.php on
	 * plugins_loaded).
	 */
	public static function boot(): void {
		$ui = Admin_UI_Instance::get();

		// Register all progress-planner widgets with the kit — the kit's
		// admin-page view iterates $ui->widgets() when rendering.
		foreach ( \progress_planner()->get_admin__page()->get_widgets() as $prpl_widget ) {
			$ui->add_widget( $prpl_widget );
		}

		$prefix = $ui->config()->asset_prefix; // 'progress-planner'.

		\add_filter( $prefix . '_admin_ui_menu_title_suffix', [ self::class, 'menu_title_suffix' ] );
		\add_action( $prefix . '_admin_ui_before_content', [ self::class, 'maybe_render_welcome' ] );
		\add_action( $prefix . '_admin_ui_header_right', [ self::class, 'render_header_right' ] );
		\add_action( $prefix . '_admin_ui_after_widgets', [ self::class, 'render_after_widgets' ] );
	}

	/**
	 * Append the pending-celebrations count bubble to the top-level menu title.
	 *
	 * @param string $suffix Existing suffix (other filter callbacks may have added to it).
	 */
	public static function menu_title_suffix( $suffix ): string {
		$count = (int) \wp_count_posts( 'prpl_recommendations' )->pending;
		if ( 0 === $count ) {
			return $suffix;
		}

		/* translators: Hidden accessibility text; %s: number of notifications. */
		$a11y = \sprintf( \_n( '%s pending celebration', '%s pending celebrations', $count, 'progress-planner' ), \number_format_i18n( $count ) );

		return $suffix . \sprintf(
			'<span class="update-plugins count-%1$d" style="background-color:var(--prpl-background-banner);color:#38296d;"><span class="plugin-count" aria-hidden="true">%1$d</span><span class="screen-reader-text">%2$s</span></span>',
			$count,
			$a11y
		);
	}

	/**
	 * Render the welcome/privacy-policy gate before the widgets container
	 * when the user hasn't accepted the privacy policy yet.
	 */
	public static function maybe_render_welcome(): void {
		if ( true === \progress_planner()->is_privacy_policy_accepted() ) {
			return;
		}
		\progress_planner()->the_view( 'welcome.php' );
	}

	/**
	 * Render the tour button + subscribe popover in the header's right column.
	 */
	public static function render_header_right(): void {
		if ( true !== \progress_planner()->is_privacy_policy_accepted() ) {
			return;
		}
		?>
		<button class="prpl-info-icon" id="prpl-start-tour-icon-button">
			<?php \progress_planner()->the_asset( 'images/icon_tour.svg' ); ?>
			<span class="screen-reader-text"><?php \esc_html_e( 'Start tour', 'progress-planner' ); ?></span>
		</button>
		<?php
		if ( 'no-license' === \progress_planner()->get_license_key() ) {
			\progress_planner()->get_ui__popover()->the_popover( 'subscribe-form' )->render_button(
				'',
				\progress_planner()->get_asset( 'images/register_icon.svg' ) . '<span class="screen-reader-text">' . \esc_html__( 'Subscribe', 'progress-planner' ) . '</span>'
			);
			\progress_planner()->get_ui__popover()->the_popover( 'subscribe-form' )->render();
		}
	}

	/**
	 * Render the tooltip-overlay click handler + JS templates after the
	 * widgets container.
	 */
	public static function render_after_widgets(): void {
		if ( true !== \progress_planner()->is_privacy_policy_accepted() ) {
			return;
		}
		?>
		<script>
		document.getElementById( 'prpl-overlay' )?.addEventListener( 'click', function() {
			const visibleTooltip = document.querySelector( '[data-tooltip-visible=true]' );
			if ( visibleTooltip ) {
				visibleTooltip.removeAttribute( 'data-tooltip-visible' );
			}
		} );
		</script>
		<?php
		\progress_planner()->the_view( 'js-templates/suggested-task.html' );

		/**
		 * Legacy action preserved for third-party integrations.
		 *
		 * @since 1.1.1
		 */
		\do_action( 'progress_planner_admin_page_after_widgets' );
	}
}
