<?php
/**
 * Sunset notice class.
 *
 * Displays a notice that support for the plugin is ending, on the
 * Progress Planner dashboard and on the plugins overview page.
 * The notice is hidden when the pp-hosts companion plugin is present.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Admin;

/**
 * Sunset notice class.
 */
class Sunset_Notice {

	/**
	 * The admin-post action for the certificate page.
	 *
	 * @var string
	 */
	const CERTIFICATE_ACTION = 'prpl_sunset_certificate';

	/**
	 * Constructor.
	 */
	public function __construct() {
		if ( ! $this->should_show() ) {
			return;
		}

		\add_action( 'progress_planner_admin_page_header_before', [ $this, 'the_dashboard_notice' ] );
		\add_action( 'after_plugin_row_' . \plugin_basename( \PROGRESS_PLANNER_FILE ), [ $this, 'the_plugin_row_notice' ] );
		\add_action( 'admin_post_' . self::CERTIFICATE_ACTION, [ $this, 'render_certificate' ] );
	}

	/**
	 * Whether the sunset notice should be shown.
	 *
	 * The notice only applies to installs coming from wordpress.org or FAIR.
	 * It is hidden when the pp-hosts companion plugin is active (constants or
	 * class detection), when a host defines a branding ID, or when pp-hosts
	 * is installed but not (yet) activated.
	 *
	 * @return bool
	 */
	public function should_show() {
		$show = ! (
			\defined( 'PP_HOSTS_FILE' )
			|| \defined( 'PROGRESS_PLANNER_BRANDING_ID' )
			|| \class_exists( 'PP_Hosts\Updater' )
			|| \progress_planner()->get_plugin_installer()->is_plugin_installed( 'pp-hosts' )
		);

		/**
		 * Filter whether the sunset notice should be shown.
		 *
		 * @param bool $show Whether the notice should be shown.
		 */
		return (bool) \apply_filters( 'progress_planner_show_sunset_notice', $show );
	}

	/**
	 * Get the notice message, shared by both surfaces.
	 *
	 * @return string
	 */
	public function get_message() {
		return \esc_html__( 'Support and updates for the free Progress Planner plugin have ended. We are incredibly grateful for your support over the years — thank you for improving your website with us!', 'progress-planner' );
	}

	/**
	 * Get the certificate invitation sentence.
	 *
	 * Contains an anchor tag, so it should be escaped with `wp_kses_post` on output.
	 *
	 * @return string
	 */
	public function get_certificate_message() {
		return \sprintf(
			/* translators: %1$s: opening <a> tag, %2$s: closing </a> tag. */
			\esc_html__( 'As a keepsake, you can %1$sdownload a certificate%2$s with your site\'s achievements.', 'progress-planner' ),
			'<a href="' . \esc_url( $this->get_certificate_url() ) . '" target="_blank" rel="noopener">',
			'</a>'
		);
	}

	/**
	 * Get the URL of the certificate page.
	 *
	 * @return string
	 */
	public function get_certificate_url() {
		return \admin_url( 'admin-post.php?action=' . self::CERTIFICATE_ACTION );
	}

	/**
	 * Get all completed badges, across all badge contexts.
	 *
	 * @return \Progress_Planner\Badges\Badge[]
	 */
	public function get_completed_badges() {
		$completed = [];
		foreach ( [ 'content', 'maintenance', 'monthly_flat' ] as $context ) {
			foreach ( \progress_planner()->get_badges()->get_badges( $context ) as $badge ) {
				$progress = $badge->get_progress();
				if ( isset( $progress['progress'] ) && 100 === (int) $progress['progress'] ) {
					$completed[] = $badge;
				}
			}
		}
		return $completed;
	}

	/**
	 * Render the standalone certificate page and exit.
	 *
	 * Hooked to admin-post, so this renders outside the WP admin chrome.
	 *
	 * @return void
	 */
	public function render_certificate() {
		if ( ! \current_user_can( 'edit_others_posts' ) ) {
			\wp_die( \esc_html__( 'You do not have permission to view this page.', 'progress-planner' ) );
		}
		$this->the_certificate();
		exit;
	}

	/**
	 * Print the certificate page markup.
	 *
	 * @return void
	 */
	public function the_certificate() {
		\progress_planner()->the_view( 'sunset-certificate.php' );
	}

	/**
	 * Print the notice banner on the Progress Planner dashboard.
	 *
	 * @return void
	 */
	public function the_dashboard_notice() {
		\progress_planner()->the_view( 'sunset-notice.php' );
	}

	/**
	 * Print a notice row below the plugin's row on the plugins overview page.
	 *
	 * @param string $plugin_file Path to the plugin file relative to the plugins directory.
	 *
	 * @return void
	 */
	public function the_plugin_row_notice( $plugin_file ) {
		if ( ! \current_user_can( 'activate_plugins' ) ) {
			return;
		}

		$prpl_colspan = 4;
		if ( \function_exists( '_get_list_table' ) ) {
			$prpl_colspan = \_get_list_table( 'WP_Plugins_List_Table', [ 'screen' => 'plugins' ] )->get_column_count();
		}

		$prpl_is_active = \function_exists( 'is_plugin_active' ) && \is_plugin_active( $plugin_file );
		?>
		<tr class="plugin-update-tr <?php echo \esc_attr( $prpl_is_active ? 'active' : 'inactive' ); ?>" id="prpl-sunset-notice-row" data-slug="progress-planner" data-plugin="<?php echo \esc_attr( $plugin_file ); ?>">
			<td colspan="<?php echo (int) $prpl_colspan; ?>" class="plugin-update colspanchange">
				<div class="notice inline notice-warning notice-alt prpl-sunset-row-notice">
					<p><?php echo \wp_kses_post( $this->get_message() . ' ' . $this->get_certificate_message() ); ?></p>
				</div>
			</td>
		</tr>
		<style>
			/* Opt out of core's red "update available" dashicon, which this notice is not. */
			#prpl-sunset-notice-row .prpl-sunset-row-notice p:before {
				content: "\f534";
				display: inline-block;
				font: normal 20px/1 dashicons;
				color: #b26200;
				margin: -3px 5px 0 -2px;
				vertical-align: middle;
				-webkit-font-smoothing: antialiased;
				-moz-osx-font-smoothing: grayscale;
			}
		</style>
		<?php
	}
}
