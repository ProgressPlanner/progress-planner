<?php
/**
 * Autoload classes.
 *
 * @package Progress_Planner
 */

use Progress_Planner\Utils\Deprecations;

// Require the Deprecations class.
require_once __DIR__ . '/classes/utils/class-deprecations.php';

\spl_autoload_register(
	/**
	 * Autoload classes.
	 *
	 * @param string $class_name The class name to autoload.
	 */
	function ( $class_name ) {
		$prefix = 'Progress_Planner\\';

		if ( 0 !== \strpos( $class_name, $prefix ) ) {
			return;
		}

		// Deprecated classes.
		if ( isset( Deprecations::CLASSES[ $class_name ] ) ) {
			\trigger_error( // phpcs:ignore
				\sprintf(
					'Class %1$s is <strong>deprecated</strong> since version %2$s! Use %3$s instead.',
					\esc_html( $class_name ),
					\esc_html( Deprecations::CLASSES[ $class_name ][1] ),
					\esc_html( Deprecations::CLASSES[ $class_name ][0] )
				),
				E_USER_DEPRECATED
			);
			\class_alias( Deprecations::CLASSES[ $class_name ][0], $class_name );
		}

		$class_name = \str_replace( $prefix, '', $class_name );

		$parts = \explode( '\\', $class_name );
		$file  = PROGRESS_PLANNER_DIR . '/classes/';
		$last  = \array_pop( $parts );

		foreach ( $parts as $part ) {
			$file .= \str_replace( '_', '-', \strtolower( $part ) ) . '/';
		}
		$file .= 'class-' . \str_replace( '_', '-', \strtolower( $last ) ) . '.php';

		if ( \file_exists( $file ) ) {
			require_once $file;
		}
	}
);
