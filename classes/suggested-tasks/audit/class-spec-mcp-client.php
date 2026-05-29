<?php
/**
 * AI bridge to the website specification (phase C).
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Audit;

/**
 * Audits a URL against the website specification using WordPress 7.0's core AI client.
 *
 * ---------------------------------------------------------------------------
 * IMPORTANT — read before changing this class:
 *
 * The class name says "MCP" because the original design pointed the WordPress
 * AI client at the specification.website MCP server. Research against the
 * shipped WP 7.0 API showed that **core's AI client cannot act as an MCP
 * client** — it only supports locally-registered PHP function declarations /
 * Abilities, not external MCP servers. (WordPress's MCP story is the MCP
 * *Adapter*, which makes WP an MCP *server*, the opposite direction.)
 *
 * So instead of an MCP transport we:
 *   1. Fetch the specification's checklist over plain HTTP (it is published as
 *      Markdown / JSON), and
 *   2. Hand that checklist + the homepage HTML to `wp_ai_client_prompt()` with a
 *      JSON-schema-constrained response, asking the model to return per-rule
 *      pass/fail in our finding schema.
 *
 * This uses the *verified* WP 7.0 AI API surface and avoids a hand-rolled MCP
 * JSON-RPC client.
 *
 * EVERYTHING that touches the WP 7.0 API is guarded by function/method-existence
 * checks, so this class is a safe no-op on WordPress < 7.0 or when no AI
 * connector is configured — {@see is_available()} returns false and the local
 * source falls back to deterministic PHP checks only.
 *
 * UNVERIFIED (could not be exercised without a running WP 7.0 + configured
 * connector). Items marked `TODO(wp7-verify)` need confirmation against a real
 * 7.0 install:
 *   - exact `wp_ai_client_prompt()` builder method chain & return type,
 *   - `is_supported_for_text_generation()` as the availability gate,
 *   - `as_json_response( $schema )` behavior and whether `generate_text()`
 *     returns a JSON string vs a structured object,
 *   - the specification checklist endpoint shape.
 * ---------------------------------------------------------------------------
 */
class Spec_Mcp_Client {

	/**
	 * The specification checklist endpoint (published Markdown/JSON source).
	 *
	 * @var string
	 */
	protected const SPEC_CHECKLIST_URL = 'https://specification.website/mcp/';

	/**
	 * Whether the AI client is available and a provider is configured.
	 *
	 * @return bool
	 */
	public function is_available(): bool {
		/**
		 * Allow forcibly disabling the AI audit layer (e.g. to save tokens).
		 *
		 * @param bool $enabled Whether the AI audit layer is enabled.
		 */
		if ( ! \apply_filters( 'progress_planner_spec_audit_ai_enabled', true ) ) {
			return false;
		}

		// WP 7.0 core AI client entry point. Absent on older WP / when the
		// feature is not loaded.
		if ( ! \function_exists( 'wp_ai_client_prompt' ) ) {
			return false;
		}

		// TODO(wp7-verify): confirm builder exposes is_supported_for_text_generation().
		try {
			$prompt = \wp_ai_client_prompt( 'ping' ); // @phpstan-ignore-line function.notFound
			if ( \is_object( $prompt ) && \method_exists( $prompt, 'is_supported_for_text_generation' ) ) {
				return (bool) $prompt->is_supported_for_text_generation();
			}
		} catch ( \Throwable $e ) {
			return false;
		}

		// Entry point exists but we couldn't confirm a configured provider.
		return false;
	}

	/**
	 * Audit a URL against the specification using the AI client.
	 *
	 * Returns raw (un-normalized) findings; {@see Audit_Runner::normalize()}
	 * enforces the schema. Returns an empty array on any failure, so callers can
	 * safely treat the AI layer as best-effort.
	 *
	 * @param string $url The URL to audit.
	 *
	 * @return array<int, array<string, mixed>>
	 */
	public function audit_url( string $url ): array {
		if ( ! $this->is_available() ) {
			return [];
		}

		$checklist = $this->get_checklist();
		$html      = $this->fetch_html( $url );

		if ( '' === $html ) {
			return [];
		}

		try {
			$json = $this->run_prompt( $url, $checklist, $html );
		} catch ( \Throwable $e ) {
			return [];
		}

		$decoded = \is_string( $json ) ? \json_decode( $json, true ) : $json;
		if ( ! \is_array( $decoded ) ) {
			return [];
		}

		// Accept either a bare list or a { "findings": [...] } envelope.
		$items = isset( $decoded['findings'] ) && \is_array( $decoded['findings'] ) ? $decoded['findings'] : $decoded;

		$findings = [];
		foreach ( $items as $item ) {
			if ( \is_array( $item ) && ! empty( $item['rule_id'] ) ) {
				$item['source'] = 'mcp-llm';
				$findings[]     = $item;
			}
		}

		return $findings;
	}

	/**
	 * Run the AI prompt and return the (JSON) response.
	 *
	 * Isolated so the exact WP 7.0 builder chain lives in one place.
	 *
	 * @param string $url       The audited URL.
	 * @param string $checklist The specification checklist text.
	 * @param string $html      The homepage HTML.
	 *
	 * @return string|array<mixed>|null
	 */
	protected function run_prompt( string $url, string $checklist, string $html ) {
		$schema = [
			'type'       => 'object',
			'properties' => [
				'findings' => [
					'type'  => 'array',
					'items' => [
						'type'       => 'object',
						'properties' => [
							'rule_id'     => [ 'type' => 'string' ],
							'category'    => [ 'type' => 'string' ],
							'title'       => [ 'type' => 'string' ],
							'description' => [ 'type' => 'string' ],
							'severity'    => [
								'type' => 'string',
								'enum' => [ 'high', 'medium', 'low' ],
							],
							'status'      => [
								'type' => 'string',
								'enum' => [ 'pass', 'fail' ],
							],
							'doc_url'     => [ 'type' => 'string' ],
						],
						'required'   => [ 'rule_id', 'status', 'title' ],
					],
				],
			],
			'required'   => [ 'findings' ],
		];

		// Keep the HTML payload bounded so we don't blow the context / token budget.
		$html_excerpt = \substr( $html, 0, 20000 );

		$instruction = \sprintf(
			"You are auditing a website against the Website Specification.\n\nURL: %s\n\nSpecification checklist:\n%s\n\nFor each BASIC checklist rule you can evaluate from the HTML below, return a finding with a stable rule_id slug, the category, a short human title and description of the fix, a severity, and status 'pass' or 'fail'. Only include rules you can actually evaluate from the provided HTML. Do not invent rules.\n\nHTML:\n%s",
			$url,
			$checklist,
			$html_excerpt
		);

		// TODO(wp7-verify): confirm method names using_max_tokens / as_json_response /
		// generate_text and that generate_text() returns a JSON string for a JSON response.
		$builder = \wp_ai_client_prompt( $instruction ); // @phpstan-ignore-line function.notFound

		if ( \method_exists( $builder, 'using_max_tokens' ) ) {
			$builder = $builder->using_max_tokens( 2000 );
		}
		if ( \method_exists( $builder, 'as_json_response' ) ) {
			$builder = $builder->as_json_response( $schema );
		}

		$result = $builder->generate_text();

		// generate_text() returns WP_Error on failure in the wrapper.
		if ( \is_wp_error( $result ) ) {
			return null;
		}

		return $result;
	}

	/**
	 * Fetch the specification checklist text.
	 *
	 * Cached for a week; failures fall back to an empty string (the model then
	 * audits from general knowledge of the spec, still useful but less precise).
	 *
	 * @return string
	 */
	protected function get_checklist(): string {
		$cache_key = 'spec_audit_checklist';
		$cached    = \progress_planner()->get_utils__cache()->get( $cache_key );
		if ( \is_string( $cached ) ) {
			return $cached;
		}

		$response = \wp_remote_get(
			self::SPEC_CHECKLIST_URL,
			[
				'timeout' => 15,
				'headers' => [ 'Accept' => 'text/markdown, text/plain, */*' ],
			]
		);

		if ( \is_wp_error( $response ) || 200 !== (int) \wp_remote_retrieve_response_code( $response ) ) {
			\progress_planner()->get_utils__cache()->set( $cache_key, '', 5 * MINUTE_IN_SECONDS );
			return '';
		}

		$body = (string) \wp_remote_retrieve_body( $response );
		\progress_planner()->get_utils__cache()->set( $cache_key, $body, WEEK_IN_SECONDS );

		return $body;
	}

	/**
	 * Fetch the HTML for a URL.
	 *
	 * @param string $url The URL.
	 *
	 * @return string
	 */
	protected function fetch_html( string $url ): string {
		$response = \wp_remote_get(
			$url,
			[
				'timeout'    => 10,
				'user-agent' => 'Progress Planner Spec Audit',
			]
		);

		if ( \is_wp_error( $response ) || 200 !== (int) \wp_remote_retrieve_response_code( $response ) ) {
			return '';
		}

		return (string) \wp_remote_retrieve_body( $response );
	}
}
