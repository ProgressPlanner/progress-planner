<?php
/**
 * Add tasks for PHP version.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Providers;

/**
 * Add tasks for PHP version.
 */
class Php_Version extends Tasks {

	/**
	 * Whether the task is an onboarding task.
	 *
	 * @var bool
	 */
	protected const IS_ONBOARDING_TASK = true;

	/**
	 * The provider ID.
	 *
	 * @var string
	 */
	protected const PROVIDER_ID = 'php-version';

	/**
	 * The minimum PHP version.
	 *
	 * @var string
	 */
	protected const RECOMMENDED_PHP_VERSION = '8.2';

	/**
	 * The external link URL.
	 *
	 * @var string
	 */
	protected const EXTERNAL_LINK_URL = 'https://prpl.fyi/update-php-version';

	/**
	 * Get the title.
	 *
	 * @return string
	 */
	protected function get_title() {
		return \esc_html__( 'Update PHP version', 'progress-planner' );
	}

	/**
	 * Get the description.
	 *
	 * @param array $task_data Optional data to include in the task.
	 * @return string
	 */
	protected function get_description( $task_data = [] ) {
		return \sprintf(
			/* translators: %1$s: php version, %2$s: minimum PHP version recommended. */
			\esc_html__( 'Your site is running on PHP version %1$s. We recommend updating to PHP version %2$s or higher.', 'progress-planner' ),
			\phpversion(),
			\esc_html( self::RECOMMENDED_PHP_VERSION )
		);
	}

	/**
	 * Check if the task should be added.
	 *
	 * @return bool
	 */
	public function should_add_task() {
		return \version_compare( \phpversion(), self::RECOMMENDED_PHP_VERSION, '<' );
	}
}
