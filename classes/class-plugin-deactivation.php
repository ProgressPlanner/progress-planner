<?php
/**
 * Plugin deactivation class.
 *
 * Adds a form to request the reason for deactivation.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner;

/**
 * Plugin deactivation class.
 */
class Plugin_Deactivation {

	/**
	 * The plugin slug.
	 *
	 * This is used to identify and catch the deactivation trigger.
	 *
	 * @var string
	 */
	const PLUGIN_SLUG = 'progress-planner';

	/**
	 * Constructor.
	 */
	public function __construct() {
		\add_action( 'admin_footer', [ $this, 'maybe_add_script' ] );
	}

	/**
	 * Maybe add the script to the admin footer.
	 *
	 * @return void
	 */
	public function maybe_add_script() {
		// Check if we're in the plugins page.
		if ( ! \function_exists( 'get_current_screen' ) || ! \get_current_screen() || 'plugins' !== \get_current_screen()->id ) {
			return;
		}

		$reasons = [
			[
				'id'                   => 'unexpected-behavior',
				'label'                => \__( 'The plugin did not work as expected', 'progress-planner' ),
				'feedback_placeholder' => \__( 'What did you expect?', 'progress-planner' ),
				'feedback_type'        => 'textarea',
			],
			[
				'id'                   => 'wrong-feature',
				'label'                => \__( "It's not what I was looking for", 'progress-planner' ),
				'feedback_placeholder' => \__( 'What were you looking for?', 'progress-planner' ),
				'feedback_type'        => 'textarea',
			],
			[
				'id'                   => 'not-working',
				'label'                => \__( 'The plugin is not working', 'progress-planner' ),
				'feedback_placeholder' => \__( 'Kindly share what didn\'t work so we can fix it for future users...', 'progress-planner' ),
				'feedback_type'        => 'textarea',
			],
			[
				'id'                   => 'found-better-plugin',
				'label'                => \__( 'I found a better plugin', 'progress-planner' ),
				'feedback_placeholder' => \__( 'What\'s the plugin\'s name?', 'progress-planner' ),
				'feedback_type'        => 'text',
			],
			[
				'id'                   => 'missing-feature',
				'label'                => \__( 'The plugin is great, but I need specific feature that you don\'t support', 'progress-planner' ),
				'feedback_placeholder' => \__( 'What feature?', 'progress-planner' ),
				'feedback_type'        => 'textarea',
			],
			[
				'id'                   => 'hard-to-understand',
				'label'                => \__( 'I couldn\'t understand how to make it work', 'progress-planner' ),
				'feedback_placeholder' => \__( 'What did you not understand?', 'progress-planner' ),
				'feedback_type'        => 'text',
			],
			[
				'id'                   => 'temporary-deactivation',
				'label'                => \__( 'It\'s a temporary deactivation - I\'m troubleshooting an issue', 'progress-planner' ),
				'feedback_type'        => false,
				'feedback_placeholder' => false,
			],
		];

		// Randomize the order of the reasons.
		\shuffle( $reasons );

		// Add the "other" reason at the end.
		$reasons[] = [
			'id'                   => 'other',
			'label'                => \__( 'Other', 'progress-planner' ),
			'feedback_placeholder' => false,
			'feedback_type'        => false,
		];

		// Enqueue the React script.
		$asset_file = \constant( 'PROGRESS_PLANNER_DIR' ) . '/build/plugin-deactivation.asset.php';
		$asset      = \file_exists( $asset_file ) ? require $asset_file : [ // @phpstan-ignore requireOnce.fileNotFound
			'dependencies' => [],
			'version'      => '1.0.0',
		];

		\wp_enqueue_script(
			'progress-planner/plugin-deactivation',
			\constant( 'PROGRESS_PLANNER_URL' ) . '/build/plugin-deactivation.js',
			$asset['dependencies'],
			$asset['version'],
			true
		);

		\wp_localize_script(
			'progress-planner/plugin-deactivation',
			'prplDeactivationConfig',
			[
				'reasons'         => $reasons,
				'remoteServerUrl' => \progress_planner()->get_remote_server_root_url(),
				'deactivateUrl'   => \wp_nonce_url( 'plugins.php?action=deactivate&plugin=' . \rawurlencode( \plugin_basename( \constant( 'PROGRESS_PLANNER_FILE' ) ) ), 'deactivate-plugin_' . \plugin_basename( \constant( 'PROGRESS_PLANNER_FILE' ) ) ),
				'pluginSlug'      => self::PLUGIN_SLUG,
				'siteUrl'         => \esc_attr( \get_site_url() ),
			]
		);

		// Render mount container.
		echo '<div id="prpl-deactivation-root"></div>';
	}
}
