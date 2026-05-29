<?php
/**
 * Check that the homepage declares an HTML5 doctype.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Audit\Checks;

/**
 * Doctype check.
 */
class Doctype_Check implements Check {

	/**
	 * {@inheritDoc}
	 *
	 * @return string
	 */
	public function get_rule_id(): string {
		return 'html-doctype';
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
		// Can't determine from an empty body — don't emit a false failure.
		if ( '' === \trim( $html ) ) {
			return [];
		}

		// Allow an optional UTF-8 BOM and leading whitespace before the doctype.
		$pass = (bool) \preg_match( '/^(\xEF\xBB\xBF)?\s*<!doctype\s+html/i', \ltrim( $html ) );

		return [
			'rule_id'     => $this->get_rule_id(),
			'category'    => 'basics',
			'title'       => \__( 'Add an HTML5 doctype to your homepage', 'progress-planner' ),
			'description' => \__( 'Every page should start with <!doctype html> so browsers render it in standards mode. Without it, browsers fall back to quirks mode, which can break your layout.', 'progress-planner' ),
			'severity'    => 'high',
			'status'      => $pass ? 'pass' : 'fail',
			'doc_url'     => 'https://specification.website/',
			'source'      => 'php-check',
		];
	}
}
