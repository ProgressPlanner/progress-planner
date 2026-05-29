<?php
/**
 * Registry of deterministic spec checks.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Audit\Checks;

/**
 * Holds the deterministic checks and runs them against a single homepage fetch.
 */
class Checks_Registry {

	/**
	 * Get the registered checks.
	 *
	 * @return Check[]
	 */
	public function get_checks(): array {
		$checks = [
			new Doctype_Check(),
			new Lang_Attribute_Check(),
			new Charset_Check(),
			new Robots_Txt_Check(),
			new Sitemap_Check(),
		];

		/**
		 * Filter the deterministic spec checks.
		 *
		 * @param array $checks The registered checks.
		 */
		$checks = (array) \apply_filters( 'progress_planner_audit_checks', $checks );

		return \array_values(
			\array_filter( $checks, static fn( $check ) => $check instanceof Check )
		);
	}

	/**
	 * Run all checks against a URL and return their findings.
	 *
	 * The URL is fetched once; the HTML and response metadata are shared with
	 * every check.
	 *
	 * @param string $url The URL to audit.
	 *
	 * @return array<int, array<string, mixed>> Findings (one per check that returns one).
	 */
	public function run( string $url ): array {
		$context = $this->fetch( $url );

		$findings = [];
		foreach ( $this->get_checks() as $check ) {
			$finding = $check->run( $url, $context['html'], $context );
			if ( ! empty( $finding ) && ! empty( $finding['rule_id'] ) ) {
				$findings[] = $finding;
			}
		}

		return $findings;
	}

	/**
	 * Fetch the URL once and return shared context.
	 *
	 * @param string $url The URL to fetch.
	 *
	 * @return array{html: string, response_code: int, headers: array<string, string>}
	 */
	protected function fetch( string $url ): array {
		$response = \wp_remote_get(
			$url,
			[
				'timeout'    => 10,
				'user-agent' => 'Progress Planner Spec Audit',
			]
		);

		if ( \is_wp_error( $response ) ) {
			return [
				'html'          => '',
				'response_code' => 0,
				'headers'       => [],
			];
		}

		$raw_headers = \wp_remote_retrieve_headers( $response );
		$headers     = [];
		// wp_remote_retrieve_headers() returns a CaseInsensitiveDictionary; getAll() yields a plain array.
		$header_array = \is_object( $raw_headers ) ? $raw_headers->getAll() : (array) $raw_headers;
		foreach ( $header_array as $name => $value ) {
			$headers[ \strtolower( (string) $name ) ] = \is_array( $value ) ? \implode( ', ', $value ) : (string) $value;
		}

		return [
			'html'          => (string) \wp_remote_retrieve_body( $response ),
			'response_code' => (int) \wp_remote_retrieve_response_code( $response ),
			'headers'       => $headers,
		];
	}
}
