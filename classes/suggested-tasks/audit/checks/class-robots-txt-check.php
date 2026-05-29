<?php
/**
 * Check that the site exposes a non-empty robots.txt.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Audit\Checks;

/**
 * Robots.txt check.
 */
class Robots_Txt_Check implements Check {

	/**
	 * {@inheritDoc}
	 *
	 * @return string
	 */
	public function get_rule_id(): string {
		return 'robots-txt';
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
		$response = \wp_remote_get(
			\home_url( '/robots.txt' ),
			[
				'timeout'    => 10,
				'user-agent' => 'Progress Planner Spec Audit',
			]
		);

		// Network failure: we can't determine the state, so don't emit a finding.
		if ( \is_wp_error( $response ) ) {
			return [];
		}

		$code = (int) \wp_remote_retrieve_response_code( $response );
		$body = \trim( (string) \wp_remote_retrieve_body( $response ) );

		$pass = 200 === $code && '' !== $body;

		return [
			'rule_id'     => $this->get_rule_id(),
			'category'    => 'seo',
			'title'       => \__( 'Publish a robots.txt file', 'progress-planner' ),
			'description' => \__( 'A robots.txt file tells search engines and crawlers which parts of your site they may access. Serving a non-empty robots.txt is a baseline expectation for a well-built site.', 'progress-planner' ),
			'severity'    => 'low',
			'status'      => $pass ? 'pass' : 'fail',
			'doc_url'     => 'https://specification.website/',
			'source'      => 'php-check',
		];
	}
}
