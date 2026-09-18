<?php
/**
 * Check that the <html> tag declares a lang attribute.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Audit\Checks;

/**
 * Lang attribute check.
 */
class Lang_Attribute_Check implements Check {

	/**
	 * {@inheritDoc}
	 *
	 * @return string
	 */
	public function get_rule_id(): string {
		return 'html-lang';
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

		$pass = (bool) \preg_match( '/<html\b[^>]*\blang\s*=\s*["\']?\s*[a-z]{2,3}\b/i', $html );

		return [
			'rule_id'     => $this->get_rule_id(),
			'category'    => 'foundations',
			'title'       => \__( "Declare your site's language", 'progress-planner' ),
			'description' => \__( 'Add a lang attribute to the <html> tag (for example lang="en"). It helps screen readers pronounce content correctly and search engines serve the right language.', 'progress-planner' ),
			'severity'    => 'medium',
			'status'      => $pass ? 'pass' : 'fail',
			'doc_url'     => 'https://specification.website/spec/foundations/html-lang/',
			'source'      => 'php-check',
		];
	}
}
