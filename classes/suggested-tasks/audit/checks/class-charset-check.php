<?php
/**
 * Check that the homepage declares a UTF-8 charset.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Audit\Checks;

/**
 * Charset check.
 */
class Charset_Check implements Check {

	/**
	 * {@inheritDoc}
	 *
	 * @return string
	 */
	public function get_rule_id(): string {
		return 'charset-meta';
	}

	/**
	 * {@inheritDoc}
	 *
	 * @param string $url     The audited URL.
	 * @param string $html    The fetched homepage HTML.
	 * @param array  $context Shared fetch context.
	 *
	 * @return array<string, mixed>
	 */
	public function run( string $url, string $html, array $context ): array {
		if ( '' === \trim( $html ) ) {
			return [];
		}

		// Pass if declared either via <meta charset> or a Content-Type response header.
		$pass = (bool) \preg_match( '/<meta\b[^>]*charset\s*=\s*["\']?\s*utf-?8/i', $html );

		if ( ! $pass && isset( $context['headers']['content-type'] ) ) {
			$pass = false !== \stripos( (string) $context['headers']['content-type'], 'utf-8' );
		}

		return [
			'rule_id'     => $this->get_rule_id(),
			'category'    => 'basics',
			'title'       => \__( 'Declare a UTF-8 charset', 'progress-planner' ),
			'description' => \__( 'Add <meta charset="utf-8"> near the top of your <head>. Without an explicit charset, special characters and emoji can render as garbled text.', 'progress-planner' ),
			'severity'    => 'medium',
			'status'      => $pass ? 'pass' : 'fail',
			'doc_url'     => 'https://specification.website/',
			'source'      => 'php-check',
		];
	}
}
