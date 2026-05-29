<?php
/**
 * Check that the site exposes an XML sitemap.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Audit\Checks;

/**
 * XML sitemap check.
 */
class Sitemap_Check implements Check {

	/**
	 * {@inheritDoc}
	 *
	 * @return string
	 */
	public function get_rule_id(): string {
		return 'xml-sitemap';
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
		// Core sitemaps enabled is a definitive pass without an HTTP request.
		if ( \function_exists( 'wp_sitemaps_get_server' ) ) {
			if ( \wp_sitemaps_get_server()->sitemaps_enabled() ) {
				return $this->finding( 'pass' );
			}
		}

		// Otherwise probe the common sitemap locations (SEO plugins, custom sitemaps).
		foreach ( [ '/sitemap.xml', '/sitemap_index.xml', '/wp-sitemap.xml' ] as $path ) {
			$response = \wp_remote_get(
				\home_url( $path ),
				[
					'timeout'    => 10,
					'user-agent' => 'Progress Planner Spec Audit',
				]
			);

			if ( \is_wp_error( $response ) ) {
				continue;
			}

			if ( 200 === (int) \wp_remote_retrieve_response_code( $response ) ) {
				return $this->finding( 'pass' );
			}
		}

		return $this->finding( 'fail' );
	}

	/**
	 * Build the finding for a given status.
	 *
	 * @param string $status 'pass' or 'fail'.
	 *
	 * @return array<string, mixed>
	 */
	protected function finding( string $status ): array {
		return [
			'rule_id'     => $this->get_rule_id(),
			'category'    => 'seo',
			'title'       => \__( 'Publish an XML sitemap', 'progress-planner' ),
			'description' => \__( 'An XML sitemap lists your important URLs so search engines can discover and index them efficiently. WordPress can generate one automatically, or an SEO plugin can provide it.', 'progress-planner' ),
			'severity'    => 'medium',
			'status'      => $status,
			'doc_url'     => 'https://specification.website/',
			'source'      => 'php-check',
		];
	}
}
