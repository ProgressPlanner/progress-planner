<?php
/**
 * Color Customizer admin page.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Utils;

/**
 * Color Customizer class.
 */
class Color_Customizer {

	/**
	 * Option name for storing color settings.
	 */
	const OPTION_NAME = 'progress_planner_color_customizer';

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->register_hooks();
	}

	/**
	 * Register the hooks.
	 *
	 * @return void
	 */
	private function register_hooks() {
		\add_action( 'admin_menu', [ $this, 'add_page' ] );
		\add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_assets' ] );
		\add_action( 'admin_init', [ $this, 'handle_form_submission' ] );
		\add_action( 'admin_head', [ $this, 'add_inline_css' ] );
	}

	/**
	 * Add the admin page (hidden from menu).
	 *
	 * @return void
	 */
	public function add_page() {
		// Add the page but don't show it in the menu.
		\add_submenu_page(
			'progress-planner',
			'Color Customizer',
			'Color Customizer',
			'manage_options',
			'progress-planner-color-customizer',
			[ $this, 'render_page' ]
		);
	}


	/**
	 * Enqueue scripts and styles.
	 *
	 * @param string $hook The current admin page.
	 *
	 * @return void
	 */
	public function enqueue_assets( $hook ) {
		if ( 'progress-planner_page_progress-planner-color-customizer' !== $hook ) {
			return;
		}

		// Enqueue the variables-color.css first.
		\progress_planner()->get_admin__enqueue()->enqueue_style( 'progress-planner/variables-color' );
		\progress_planner()->get_admin__enqueue()->enqueue_style( 'progress-planner/admin' );

		// Enqueue the color customizer JavaScript.
		\progress_planner()->get_admin__enqueue()->enqueue_script( 'color-customizer' );

		// Add custom CSS for the color picker page.
		\wp_add_inline_style( 'progress-planner/admin', $this->get_customizer_css() );
	}

	/**
	 * Handle form submission.
	 *
	 * @return void
	 */
	public function handle_form_submission() {
		if ( ! isset( $_POST['progress_planner_color_customizer_nonce'] ) ) { // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.MissingUnslash, WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
			return;
		}

		$nonce = \sanitize_text_field( \wp_unslash( $_POST['progress_planner_color_customizer_nonce'] ) );
		if ( ! \wp_verify_nonce( \sanitize_text_field( \wp_unslash( $nonce ) ), 'progress_planner_color_customizer' ) ) {
			return;
		}

		if ( ! \current_user_can( 'manage_options' ) ) {
			return;
		}

		$action = \sanitize_text_field( \wp_unslash( $_POST['action'] ?? '' ) );

		switch ( $action ) {
			case 'save_colors':
				$this->save_colors();
				break;
			case 'reset_colors':
				$this->reset_colors();
				break;
			case 'export_colors':
				$this->export_colors();
				break;
			case 'import_colors':
				$this->import_colors();
				break;
		}
	}

	/**
	 * Save color settings.
	 *
	 * @return void
	 */
	private function save_colors() {
		$colors          = [];
		$color_variables = $this->get_color_variables();

		foreach ( $color_variables as $section => $variables ) {
			foreach ( $variables as $variable => $default_value ) {
				$key = "color_{$variable}";
				if ( isset( $_POST[ $key ] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Missing
					$post_value  = isset( $_POST[ $key ] ) ? \sanitize_text_field( \wp_unslash( $_POST[ $key ] ) ) : ''; // phpcs:ignore WordPress.Security.NonceVerification.Missing
					$color_value = \sanitize_text_field( \wp_unslash( $post_value ) );
					if ( ! empty( $color_value ) ) {
						$colors[ $variable ] = $color_value;
					}
				}
			}
		}

		\update_option( self::OPTION_NAME, $colors );
		\add_action(
			'admin_notices',
			function () {
				echo '<div class="notice notice-success is-dismissible"><p>Colors saved successfully!</p></div>';
			}
		);
	}

	/**
	 * Reset color settings.
	 *
	 * @return void
	 */
	private function reset_colors() {
		\delete_option( self::OPTION_NAME );
		\add_action(
			'admin_notices',
			function () {
				echo '<div class="notice notice-success is-dismissible"><p>Colors reset to defaults!</p></div>';
			}
		);
	}

	/**
	 * Export color settings.
	 *
	 * @return void
	 */
	private function export_colors() {
		$colors      = \get_option( self::OPTION_NAME, [] );
		$export_data = [
			'version'     => '1.0',
			'colors'      => $colors,
			'exported_at' => \current_time( 'mysql' ),
		];

		\header( 'Content-Type: application/json' );
		\header( 'Content-Disposition: attachment; filename="progress-planner-colors.json"' );
		echo \wp_json_encode( $export_data, JSON_PRETTY_PRINT );
		exit;
	}

	/**
	 * Import color settings.
	 *
	 * @return void
	 */
	private function import_colors() {
		if ( ! isset( $_FILES['color_file'] ) || $_FILES['color_file']['error'] !== UPLOAD_ERR_OK ) { // phpcs:ignore WordPress.Security.NonceVerification.Missing, WordPress.Security.ValidatedSanitizedInput.InputNotValidated
			\add_action(
				'admin_notices',
				function () {
					echo '<div class="notice notice-error is-dismissible"><p>Error uploading file!</p></div>';
				}
			);
			return;
		}

		$file_content = \file_get_contents( $_FILES['color_file']['tmp_name'] ); // phpcs:ignore WordPress.Security.NonceVerification.Missing, WordPress.Security.ValidatedSanitizedInput.InputNotValidated, WordPress.Security.ValidatedSanitizedInput.InputNotSanitized, WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents
		$import_data  = \json_decode( $file_content, true );

		if ( ! $import_data || ! isset( $import_data['colors'] ) ) {
			\add_action(
				'admin_notices',
				function () {
					echo '<div class="notice notice-error is-dismissible"><p>Invalid file format!</p></div>';
				}
			);
			return;
		}

		\update_option( self::OPTION_NAME, $import_data['colors'] );
		\add_action(
			'admin_notices',
			function () {
				echo '<div class="notice notice-success is-dismissible"><p>Colors imported successfully!</p></div>';
			}
		);
	}

	/**
	 * Add inline CSS to override default colors.
	 *
	 * @return void
	 */
	public function add_inline_css() {
		// Hide menu item on all pages.
		echo '<style type="text/css">
			#toplevel_page_progress-planner li:has(a[href="admin.php?page=progress-planner-color-customizer"]) {
				display: none;
			}
		</style>';

		// Only add inline CSS on the PP pages.
		$current_screen = \get_current_screen();
		if ( ! $current_screen ||
			( 'toplevel_page_progress-planner' !== $current_screen->id && 'progress-planner_page_progress-planner-settings' !== $current_screen->id )
		) {
			return;
		}

		$colors = \get_option( self::OPTION_NAME, [] );
		if ( empty( $colors ) ) {
			return;
		}

		$css = ':root {';
		foreach ( $colors as $variable => $value ) {
			$css .= "\n\t--prpl-{$variable}: {$value};";
		}
		$css .= "\n}";

		echo '<style type="text/css">' . \esc_html( $css ) . '</style>';
	}

	/**
	 * Render the admin page.
	 *
	 * @return void
	 */
	public function render_page() {
		$colors          = \get_option( self::OPTION_NAME, [] );
		$color_variables = $this->get_color_variables();

		?>
		<div class="wrap">
			<h1>Progress Planner Color Customizer</h1>
			<p>Customize the colors used throughout the Progress Planner interface. Changes will be applied after you save.</p>

			<form method="post" action="" enctype="multipart/form-data">
				<?php \wp_nonce_field( 'progress_planner_color_customizer', 'progress_planner_color_customizer_nonce' ); ?>

				<?php foreach ( $color_variables as $section_name => $variables ) : ?>
					<?php
					if ( ! $section_name || ! is_array( $variables ) ) {
						continue;}
					?>
					<div class="color-section">
						<h2><?php echo \esc_html( $section_name ); ?></h2>
						<div class="color-grid">
							<?php foreach ( $variables as $variable => $default_value ) : ?>
								<?php
								if ( ! $variable ) {
									continue;}
								?>
								<div class="color-field">
									<label for="color_<?php echo \esc_attr( $variable ); ?>">
										<strong><?php echo \esc_html( $variable ); ?></strong>
										<span class="default-value">Default: <?php echo \esc_html( $default_value ? $default_value : '#000000' ); ?></span>
									</label>
									<?php
									$current_value = $colors[ $variable ] ?? $default_value;
									$current_value = $current_value ? $current_value : '#000000';
									$default_value = $default_value ? $default_value : '#000000';
									?>
									<input
										type="color"
										id="color_<?php echo \esc_attr( $variable ); ?>"
										name="color_<?php echo \esc_attr( $variable ); ?>"
										value="<?php echo \esc_attr( $this->normalize_color_value( $current_value ) ); ?>"
										class="color-picker"
									>
									<input
										type="text"
										value="<?php echo \esc_attr( $current_value ); ?>"
										class="color-text-input"
										placeholder="<?php echo \esc_attr( $default_value ); ?>"
									>
								</div>
							<?php endforeach; ?>
						</div>
					</div>
				<?php endforeach; ?>

				<div class="form-actions">
					<input type="hidden" name="action" value="save_colors">
					<?php \submit_button( 'Save Colors', 'primary', 'save_colors', false ); ?>
					<?php \submit_button( 'Reset to Defaults', 'secondary', 'reset_colors', false, [ 'onclick' => 'this.form.action.value = "reset_colors"; return confirm("Are you sure you want to reset all colors to defaults?");' ] ); ?>
				</div>
			</form>

			<div class="import-export-section">
				<h2>Import / Export</h2>
				<div class="import-export-actions">
					<form method="post" action="" style="display: inline-block;">
						<?php \wp_nonce_field( 'progress_planner_color_customizer', 'progress_planner_color_customizer_nonce' ); ?>
						<input type="hidden" name="action" value="export_colors">
						<?php \submit_button( 'Export Colors', 'secondary', 'export_colors', false ); ?>
					</form>

					<form method="post" action="" enctype="multipart/form-data" style="display: inline-block; margin-left: 10px;">
						<?php \wp_nonce_field( 'progress_planner_color_customizer', 'progress_planner_color_customizer_nonce' ); ?>
						<input type="hidden" name="action" value="import_colors">
						<input type="file" name="color_file" accept=".json" required>
						<?php \submit_button( 'Import Colors', 'secondary', 'import_colors', false ); ?>
					</form>
				</div>
			</div>
		</div>
		<?php
	}

	/**
	 * Get color variables organized by sections.
	 *
	 * @return array
	 */
	private function get_color_variables() {
		return [
			'Background'           => [
				'background'        => '#f6f7f9',
				'background-banner' => '#f9b23c',
			],
			'Paper'                => [
				'background-paper'   => '#fff',
				'color-border'       => '#d1d5db',
				'color-divider'      => '#d1d5db',
				'color-shadow-paper' => '#000',
			],
			'Graph'                => [
				'color-gauge-main' => '#e1e3e7',
				'graph-color-1'    => '#f43f5e',
				'graph-color-2'    => '#faa310',
				'graph-color-3'    => '#14b8a6',
				'graph-color-4'    => '#534786',
			],
			'Table'                => [
				'background-table'                  => '#f6f7f9',
				'background-top-task'               => '#fff9f0',
				'color-border-top-task'             => '#faa310',
				'color-border-next-top-task'        => '#534786',
				'color-selection-controls-inactive' => '#9ca3af',
				'color-selection-controls'          => '#9ca3af',
				'color-ui-icon'                     => '#6b7280',
				'color-ui-icon-hover'               => '#1e40af',
				'color-ui-icon-hover-fill'          => '#effbfe',
				'color-ui-icon-hover-delete'        => '#e73136',
				'background-point'                  => '#f9b23c',
				'text-point'                        => '#38296d',
				'background-point-inactive'         => '#d1d5db',
				'text-point-inactive'               => '#38296d',
			],
			'Text'                 => [
				'color-text'         => '#4b5563',
				'color-text-hover'   => '#1e40af',
				'color-headings'     => '#38296d',
				'color-subheadings'  => '#38296d',
				'color-link'         => '#1e40af',
				'color-link-hover'   => '#4b5563',
				'color-link-visited' => '#534786',
			],
			'Topics'               => [
				'color-monthly'            => '#faa310',
				'color-streak'             => '#faa310',
				'color-content-badge'      => '#faa310',
				'background-monthly'       => '#fff9f0',
				'background-content'       => '#f6f5fb',
				'background-activity'      => '#f2faf9',
				'background-streak'        => '#fff6f7',
				'background-content-badge' => '#effbfe',
			],
			'Alert Success'        => [
				'color-alert-success'      => '#16a34a',
				'color-alert-success-text' => '#14532d',
				'background-alert-success' => '#f0fdf4',
			],
			'Alert Error'          => [
				'color-alert-error'      => '#e73136',
				'color-alert-error-text' => '#7f1d1d',
				'background-alert-error' => '#fdeded',
			],
			'Alert Warning'        => [
				'color-alert-warning'      => '#eab308',
				'color-alert-warning-text' => '#713f12',
				'background-alert-warning' => '#fefce8',
			],
			'Alert Info'           => [
				'color-alert-info'      => '#2563eb',
				'color-alert-info-text' => '#1e3a8a',
				'background-alert-info' => '#eff6ff',
			],
			'Button'               => [
				'color-button-primary'        => '#dd324f',
				'color-button-primary-hover'  => '#cf2441',
				'color-button-primary-shadow' => '#000',
				'color-button-primary-border' => 'none',
				'color-button-primary-text'   => '#fff',
			],
			'Settings Page'        => [
				'color-setting-pages-icon' => '#faa310',
				'color-setting-posts-icon' => '#534786',
				'color-setting-login-icon' => '#14b8a6',
				'background-setting-pages' => '#fff9f0',
				'background-setting-posts' => '#f6f5fb',
				'background-setting-login' => '#f2faf9',
				'color-border-settings'    => '#d1d5db',
			],
			'Input Field Dropdown' => [
				'color-field-border'     => '#d1d5db',
				'color-text-placeholder' => '#6b7280',
				'color-text-dropdown'    => '#4b5563',
				'color-field-shadow'     => '#000',
			],
		];
	}

	/**
	 * Normalize color value to 6-digit hex format.
	 *
	 * @param string $color_value The color value to normalize.
	 *
	 * @return string
	 */
	private function normalize_color_value( $color_value ) {
		// Handle null or empty values.
		if ( empty( $color_value ) ) {
			return '#000000';
		}

		// Handle special cases.
		if ( 'none' === $color_value ) {
			return '#000000';
		}

		// If it's already a 6-digit hex, return as is.
		if ( preg_match( '/^#[0-9A-Fa-f]{6}$/', $color_value ) ) {
			return strtolower( $color_value );
		}

		// Convert 3-digit hex to 6-digit.
		if ( preg_match( '/^#[0-9A-Fa-f]{3}$/', $color_value ) ) {
			$hex = substr( $color_value, 1 );
			return '#' . strtolower( $hex[0] . $hex[0] . $hex[1] . $hex[1] . $hex[2] . $hex[2] );
		}

		// If it's not a valid hex color, return black as fallback.
		return '#000000';
	}

	/**
	 * Get custom CSS for the color customizer page.
	 *
	 * @return string
	 */
	private function get_customizer_css() {
		return '
			.color-section {
				margin-bottom: 30px;
				padding: 20px;
				background: #fff;
				border: 1px solid #ddd;
				border-radius: 4px;
			}

			.color-section h2 {
				margin-top: 0;
				color: var(--prpl-color-headings);
				border-bottom: 2px solid var(--prpl-color-border);
				padding-bottom: 10px;
			}

			.color-grid {
				display: grid;
				grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
				gap: 20px;
				margin-top: 20px;
			}

			.color-field {
				display: flex;
				flex-direction: column;
				gap: 8px;
			}

			.color-field label {
				font-weight: 600;
				color: var(--prpl-color-headings);
			}

			.default-value {
				font-weight: normal;
				font-size: 12px;
				color: var(--prpl-color-ui-icon);
				display: block;
			}

			.color-picker {
				width: 60px;
				height: 40px;
				border: 1px solid var(--prpl-color-border);
				border-radius: 4px;
				cursor: pointer;
			}

			.color-text-input {
				padding: 8px;
				border: 1px solid var(--prpl-color-border);
				border-radius: 4px;
				font-family: monospace;
				font-size: 12px;
			}

			.form-actions {
				margin: 30px 0;
				padding: 20px;
				background: #fff;
				border: 1px solid #ddd;
				border-radius: 4px;
			}

			.import-export-section {
				margin-top: 30px;
				padding: 20px;
				background: #fff;
				border: 1px solid #ddd;
				border-radius: 4px;
			}

			.import-export-section h2 {
				margin-top: 0;
				color: var(--prpl-color-headings);
			}

			.import-export-actions {
				display: flex;
				align-items: center;
				gap: 20px;
			}

			.import-export-actions input[type="file"] {
				margin-right: 10px;
			}
		';
	}
}
