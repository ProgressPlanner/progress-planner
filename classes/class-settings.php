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
}
