<?php
/**
 * Phase 2 shadow boot: instantiate the extracted wp-admin-ui kit on a
 * throwaway admin page so we can verify the package autoloads cleanly and
 * renders in the host context, without touching any existing behavior.
 *
 * Behind the PROGRESS_PLANNER_USE_ADMIN_UI_PKG constant — off by default.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Admin;

use ProgressPlanner\AdminUI\AdminUI;
use ProgressPlanner\AdminUI\Config;
use ProgressPlanner\AdminUI\Widgets\Widget;

/**
 * Wires up a shadow admin page that boots the kit alongside the real
 * progress-planner page.
 */
final class Admin_UI_Pkg_Shadow {

	public static function boot(): void {
		$package_root = PROGRESS_PLANNER_DIR . '/vendor/progressplanner/wp-admin-ui';

		// Hand off the SaaS-resolved branding VO from progress-planner to
		// the kit — verifies the Phase 3B branding bridge works end-to-end.
		$branding = \progress_planner()->get_ui__branding()->to_kit_branding();

		$config = new Config(
			'progress-planner',
			'progress-planner-adminui',
			'prplpkg',
			'progress_planner',
			'progress-planner/v1',
			'PRPL (kit shadow)',
			'Dashboard (kit shadow)',
			$branding,
			$package_root . '/assets',
			\plugin_dir_url( PROGRESS_PLANNER_FILE ) . 'vendor/progressplanner/wp-admin-ui/assets',
			// For Phase 2 we deliberately point host_assets_path at a non-
			// existent directory so the kit resolves every asset against the
			// package only. Progress-planner's own assets/ dir has files
			// with legacy `progress-planner/` prefixed Dependencies headers
			// that the kit's enqueuer can't resolve — that gets fixed in
			// Phase 3 when we refactor those headers.
			PROGRESS_PLANNER_DIR . '/_no_host_assets_phase2',
			\constant( 'PROGRESS_PLANNER_URL' ) . '/_no_host_assets_phase2',
			$package_root . '/views'
		);

		$ui = AdminUI::boot( $config );
		$ui->add_widget( new Admin_UI_Pkg_Shadow_Widget( $ui ) );
	}
}

/**
 * Trivial smoke-test widget. Confirms the kit's Widget base + AssetEnqueuer
 * work when loaded inside progress-planner's PHP + asset environment.
 */
final class Admin_UI_Pkg_Shadow_Widget extends Widget {

	protected $id = 'kit-shadow';

	public function enqueue_styles(): void {
		// No widget-specific CSS — kit defaults only.
	}

	public function enqueue_scripts(): void {
		$this->ui->enqueuer()->enqueue_script( 'web-components/prpl-gauge' );
	}

	public function render(): void {
		$this->enqueue_scripts();
		?>
		<div class="prpl-widget-wrapper prpl-<?php echo \esc_attr( $this->id ); ?> prpl-widget-width-1">
			<div class="widget-inner-container">
				<h2 class="prpl-widget-title">Kit shadow smoke test</h2>
				<p>If you can see a gauge below, <code>progressplanner/wp-admin-ui</code> autoloaded and rendered inside progress-planner's PHP environment.</p>
				<div style="max-width:220px;margin:0 auto;">
					<prpl-gauge data-max="100" data-value="67" background="#ededed" color="#38296d"></prpl-gauge>
				</div>
			</div>
		</div>
		<?php
	}
}
