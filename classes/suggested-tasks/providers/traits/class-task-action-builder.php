<?php
/**
 * Trait for building task actions.
 *
 * Provides helper methods for creating task action arrays,
 * particularly for interactive tasks with popovers.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Providers\Traits;

/**
 * Task_Action_Builder trait.
 *
 * This trait eliminates code duplication across 40+ provider classes
 * by centralizing the logic for building task action arrays.
 */
trait Task_Action_Builder {

	/**
	 * Create a popover action for use in add_task_actions().
	 *
	 * Generates a standardized action array that opens a popover when clicked.
	 *
	 * @param string $label    The text to display for the action link.
	 * @param int    $priority The priority of the action (default: 10).
	 *
	 * @return array Action array with 'priority' and 'html' keys.
	 */
	protected function create_popover_action( $label, $priority = 10 ) {
		return [
			'priority' => $priority,
			'html'     => $this->generate_popover_button_html( $label ),
		];
	}

	/**
	 * Generate the HTML for a popover trigger button.
	 *
	 * @param string $label The text to display for the action link.
	 *
	 * @return string The HTML for the popover trigger button.
	 */
	protected function generate_popover_button_html( $label ) {
		return \sprintf(
			'<a class="prpl-tooltip-action-text" href="#" role="button" onclick="document.getElementById(\'prpl-popover-%1$s\')?.showPopover()">%2$s</a>',
			\esc_attr( static::POPOVER_ID ),
			\esc_html( $label )
		);
	}

	/**
	 * Add a popover action to the actions array.
	 *
	 * Convenience method that adds a popover action and returns the modified array.
	 *
	 * @param array  $actions  The existing actions array.
	 * @param string $label    The text to display for the action link.
	 * @param int    $priority The priority of the action (default: 10).
	 *
	 * @return array The modified actions array.
	 */
	protected function add_popover_action( $actions, $label, $priority = 10 ) {
		$actions[] = $this->create_popover_action( $label, $priority );
		return $actions;
	}
}
