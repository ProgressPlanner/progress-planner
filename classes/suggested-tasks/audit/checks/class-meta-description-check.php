<?php
/**
 * Check that the homepage declares a non-empty meta description.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Audit\Checks;

/**
 * Meta description check.
 *
 * Operates on the already-fetched homepage HTML — makes no extra HTTP requests.
 */
class Meta_Description_Check implements Check {

	/**
	 * {@inheritDoc}
	 *
	 * @return string
	 */
	public function get_rule_id(): string {
		return 'meta-description';
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

		$pass = false;

		// Look for a <meta name="description" content="..."> with a non-empty
		// content attribute. Case-insensitive, tolerates attribute reordering.
		if ( \preg_match( '/<meta\b[^>]*\bname\s*=\s*["\']?description["\']?[^>]*\bcontent\s*=\s*"([^"]*)"/i', $html, $m )
			|| \preg_match( '/<meta\b[^>]*\bname\s*=\s*["\']?description["\']?[^>]*\bcontent\s*=\s*\'([^\']*)\'/i', $html, $m )
			|| \preg_match( '/<meta\b[^>]*\bcontent\s*=\s*"([^"]*)"[^>]*\bname\s*=\s*["\']?description["\']?/i', $html, $m )
			|| \preg_match( '/<meta\b[^>]*\bcontent\s*=\s*\'([^\']*)\'[^>]*\bname\s*=\s*["\']?description["\']?/i', $html, $m )
		) {
			$pass = '' !== \trim( $m[1] );
		}

		return [
			'rule_id'     => $this->get_rule_id(),
			'category'    => 'seo',
			'title'       => \__( 'Add a meta description to your homepage', 'progress-planner' ),
			'description' => \__( 'A meta description is the snippet search engines show under your page title in search results. Without one, search engines auto-generate a snippet which is often less compelling and less accurate. Install an SEO plugin like Yoast SEO or set a description in your theme to control how your site is summarized.', 'progress-planner' ),
			'severity'    => 'medium',
			'status'      => $pass ? 'pass' : 'fail',
			'doc_url'     => 'https://specification.website/',
			'source'      => 'php-check',
		];
	}
}
