<?php
/**
 * Remote audit source: findings produced by the Progress Planner SaaS.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Audit;

/**
 * Remote audit source (phase B).
 *
 * In phase B the AI agent lives on progressplanner.com: the plugin posts its
 * public URL and the SaaS returns findings. This keeps end users off WP 7.0 /
 * connector configuration and centralizes AI cost behind the license key.
 *
 * IMPORTANT: this is a phase-B STUB. The transport mirrors {@see \Progress_Planner\Lessons}
 * (license-key query arg + transient cache), and the response mapping produces
 * the same finding shape the local source produces — that shape-equality is the
 * contract that keeps the two engines interchangeable. The SaaS endpoint does
 * not exist yet, so without a license key this source is unavailable and the
 * runner falls back to the local source.
 */
class Remote_Audit_Source implements Audit_Source {

	/**
	 * {@inheritDoc}
	 *
	 * @return string
	 */
	public function get_id(): string {
		return 'remote-saas';
	}

	/**
	 * Available only when a license key is present (same gate as other SaaS features).
	 *
	 * @return bool
	 */
	public function is_available(): bool {
		return false !== \progress_planner()->get_license_key();
	}

	/**
	 * {@inheritDoc}
	 *
	 * @param string $url  The URL to audit.
	 * @param array  $args Optional arguments.
	 *
	 * @return array<int, array<string, mixed>>
	 */
	public function get_findings( string $url, array $args = [] ): array {
		$endpoint = \progress_planner()->get_remote_server_root_url() . '/wp-json/progress-planner-saas/v1/audit';
		$endpoint = \add_query_arg(
			[
				'site'        => \get_site_url(),
				'license_key' => \progress_planner()->get_license_key(),
				'url'         => $url,
				'locale'      => \get_locale(),
			],
			$endpoint
		);

		$cache_key = \md5( $endpoint );
		$cached    = \progress_planner()->get_utils__cache()->get( $cache_key );
		if ( \is_array( $cached ) ) {
			return $this->map_response( $cached );
		}

		$response = \wp_remote_get( $endpoint, [ 'timeout' => 30 ] );

		if ( \is_wp_error( $response ) || 200 !== (int) \wp_remote_retrieve_response_code( $response ) ) {
			\progress_planner()->get_utils__cache()->set( $cache_key, [], 5 * MINUTE_IN_SECONDS );
			return [];
		}

		$json = \json_decode( \wp_remote_retrieve_body( $response ), true );
		if ( ! \is_array( $json ) ) {
			\progress_planner()->get_utils__cache()->set( $cache_key, [], 5 * MINUTE_IN_SECONDS );
			return [];
		}

		\progress_planner()->get_utils__cache()->set( $cache_key, $json, DAY_IN_SECONDS );

		return $this->map_response( $json );
	}

	/**
	 * Map the SaaS response into the canonical finding shape.
	 *
	 * Kept deliberately simple: the SaaS is expected to return findings already
	 * shaped like the schema, but we map defensively so the contract is explicit
	 * and testable against the local source's output.
	 *
	 * @param array<int|string, mixed> $json The decoded SaaS response.
	 *
	 * @return array<int, array<string, mixed>>
	 */
	protected function map_response( array $json ): array {
		$items = isset( $json['findings'] ) && \is_array( $json['findings'] ) ? $json['findings'] : $json;

		$findings = [];
		foreach ( $items as $item ) {
			if ( ! \is_array( $item ) || empty( $item['rule_id'] ) ) {
				continue;
			}
			$findings[] = [
				'rule_id'     => $item['rule_id'],
				'category'    => $item['category'] ?? 'basics',
				'title'       => $item['title'] ?? '',
				'description' => $item['description'] ?? '',
				'severity'    => $item['severity'] ?? 'medium',
				'status'      => $item['status'] ?? 'fail',
				'doc_url'     => $item['doc_url'] ?? '',
				'fix_url'     => $item['fix_url'] ?? '',
				'source'      => 'saas',
			];
		}

		return $findings;
	}
}
