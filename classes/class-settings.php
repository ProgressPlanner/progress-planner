<?php
/**
 * Handle plugin settings.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner;

/**
 * Settings class.
 */
class Settings {

	/**
	 * The name of the settings option.
	 *
	 * @var string
	 */
	const OPTION_NAME = 'progress_planner_settings';

	/**
	 * The settings.
	 *
	 * @var array
	 */
	private static $settings = [];

	/**
	 * Get the value of a setting.
	 *
	 * @param string|array $setting       The setting.
	 *                                    If a string, the name of the setting.
	 *                                    If an array, get value recursively from the settings.
	 *                                    See _wp_array_get() for more information.
	 * @param mixed        $default_value The default value.
	 *
	 * @return mixed The value of the setting.
	 */
	public function get( $setting, $default_value = null ) {
		$this->load_settings();

		if ( is_array( $setting ) ) {
			return \_wp_array_get( self::$settings, $setting, $default_value );
		}
		return self::$settings[ $setting ] ?? $default_value;
	}

	/**
	 * Set the value of a setting.
	 *
	 * @param string|array $setting The setting.
	 *                              If a string, the name of the setting.
	 *                              If an array, set value recursively in the settings.
	 *                              See _wp_array_set() for more information.
	 * @param mixed        $value   The value.
	 *
	 * @return bool
	 */
	public function set( $setting, $value ) {
		$this->load_settings();
		if ( is_array( $setting ) ) {
			\_wp_array_set( self::$settings, $setting, $value );
		} else {
			self::$settings[ $setting ] = $value;
		}
		return $this->save_settings();
	}

	/**
	 * Load the settings.
	 *
	 * @return void
	 */
	private function load_settings() {
		if ( ! empty( self::$settings ) ) {
			return;
		}
		self::$settings = \get_option( self::OPTION_NAME, [] );
	}

	/**
	 * Save the settings.
	 *
	 * @return bool
	 */
	private function save_settings() {
		return \update_option( self::OPTION_NAME, self::$settings, false );
	}

	/**
	 * Delete a setting.
	 *
	 * @param string $setting The setting.
	 *
	 * @return bool
	 */
	public function delete( $setting ) {
		$this->load_settings();
		unset( self::$settings[ $setting ] );
		return $this->save_settings();
	}

	/**
	 * Delete all settings.
	 *
	 * @return bool
	 */
	public function delete_all() {
		self::$settings = [];
		return $this->save_settings();
	}

	/**
	 * Get an array of post-types names for the stats.
	 *
	 * @return string[]
	 */
	public function get_post_types_names() {
		static $include_post_types;

		if ( ! doing_action( 'init' ) && ! did_action( 'init' ) ) {
			\trigger_error( // phpcs:ignore
				sprintf(
					'%1$s was called too early. Wait for init hook to be called to have access to the post types.',
					\esc_html( get_class() . '::' . __FUNCTION__ )
				),
				E_USER_WARNING
			);
		}

		// Since we're working with CPTs, dont cache until init.
		if ( isset( $include_post_types ) && ! empty( $include_post_types ) ) {
			return $include_post_types;
		}

		$public_post_types = \progress_planner()->get_settings()->get_public_post_types();

		// Post or pages can be deregistered.
		$default = array_intersect( [ 'post', 'page' ], $public_post_types );

		// Edge case:Check if both post and page are deregistered, to prevent empty array (since this is passed to WP_Query).
		if ( empty( $default ) ) {
			$default = [ 'post', 'page' ];
		}

		// Filter the saved post types.
		$include_post_types = array_intersect( \progress_planner()->get_settings()->get( [ 'include_post_types' ], $default ), $public_post_types );

		return empty( $include_post_types ) ? $default : \array_values( $include_post_types );
	}

	/**
	 * Get the public post types.
	 *
	 * @return string[]
	 */
	public function get_public_post_types() {
		$public_post_types = \array_filter( \get_post_types( [ 'public' => true ] ), 'is_post_type_viewable' );

		unset( $public_post_types['attachment'] );
		unset( $public_post_types['elementor_library'] ); // Elementor templates are not a post type we want to track.

		/**
		 * Filter the public post types.
		 *
		 * @param string[] $public_post_types The public post types.
		 *
		 * @return string[]
		 */
		return \apply_filters( 'progress_planner_public_post_types', $public_post_types );
	}
}
