<?php
/**
 * Timezone Options REST API controller.
 *
 * Returns timezone options for use in select dropdowns.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Rest;

/**
 * Timezone Options REST API controller.
 */
class Timezone_Options extends Base {

	/**
	 * Register REST endpoint.
	 *
	 * @return void
	 */
	public function register_rest_endpoint() {
		\register_rest_route(
			'progress-planner/v1',
			'/timezone-options',
			[
				[
					'methods'             => 'GET',
					'callback'            => [ $this, 'get_timezone_options' ],
					'permission_callback' => [ $this, 'check_permissions' ],
				],
			]
		);
	}

	/**
	 * Check if the current user has permission to access this endpoint.
	 *
	 * @return bool
	 */
	public function check_permissions() {
		return \current_user_can( 'manage_options' );
	}

	/**
	 * Get timezone options.
	 *
	 * @return \WP_REST_Response
	 */
	public function get_timezone_options() {
		$options = $this->build_timezone_options();

		return new \WP_REST_Response( $options, 200 );
	}

	/**
	 * Build timezone options array.
	 *
	 * Uses WordPress's wp_timezone_choice() function and extracts options from the HTML.
	 * This ensures we stay in sync with WordPress core behavior.
	 *
	 * @return array Array of timezone option objects with 'value' and 'label' properties.
	 */
	private function build_timezone_options() {
		// Get HTML output from WordPress core function.
		$html = \wp_timezone_choice( '', \get_user_locale() );

		// Parse HTML to extract option elements.
		$options = $this->parse_timezone_html( $html );

		return $options;
	}

	/**
	 * Parse HTML from wp_timezone_choice() to extract timezone options.
	 *
	 * Uses WP_HTML_Tag_Processor to find option tags and extract both value attributes
	 * and text content using next_token() and get_modifiable_text().
	 *
	 * @param string $html The HTML output from wp_timezone_choice().
	 * @return array Array of timezone option objects with 'value' and 'label' properties.
	 */
	private function parse_timezone_html( $html ) {
		$options = [];

		// Use WP_HTML_Tag_Processor to find option tags and extract data.
		$processor = new \WP_HTML_Tag_Processor( $html );
		while ( $processor->next_tag( 'option' ) ) {
			$value = $processor->get_attribute( 'value' );

			// Extract text content by moving through tokens after the opening tag.
			// Collect all text nodes until we hit the closing </option> tag.
			$label = '';
			while ( $processor->next_token() ) {
				$token_name = $processor->get_token_name();

				// If we hit the closing option tag, we're done collecting text.
				if ( 'OPTION' === $token_name && $processor->is_tag_closer() ) {
					break;
				}

				// Collect text from text nodes (decoded automatically by get_modifiable_text).
				if ( '#text' === $token_name ) {
					$label .= $processor->get_modifiable_text();
				}
			}

			$label = \trim( $label );

			// Skip empty options (like the "Select a city" placeholder).
			if ( ( null === $value || '' === $value ) && '' === $label ) {
				continue;
			}

			$options[] = [
				'value' => $value ?? '',
				'label' => $label,
			];
		}

		return $options;
	}
}
