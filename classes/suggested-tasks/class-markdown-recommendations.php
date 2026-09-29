<?php
/**
 * Load recommendations defined as markdown files.
 *
 * A test harness for the goal-shaped recommendation format. Rules live in
 * /recommendations as markdown, and a rule plays one of two roles.
 *
 * A rule with `replaces:` describes recommendations the plugin already has in
 * PHP, and only adds its goal to them. The PHP provider keeps deciding when the
 * task is shown and when it is done -- that detection already exists and is
 * tested, and a second copy of the task would show the same work twice. The
 * list is explicit because one goal often stands for several providers: "date
 * archives are not indexed" is one Yoast task and one AIOSEO task.
 *
 * A rule without it becomes a task provider of its own, registered through the
 * filter the plugin already offers third parties. That is the long-term shape
 * of the format -- a recommendation defined entirely in markdown -- and the
 * `replaces:` role is the step on the way there, while the PHP providers still
 * own detection.
 *
 * Registering providers rather than writing tasks directly is what keeps the
 * rest of the plugin from needing to know these exist: the dashboard renders
 * them, points and badges count them, and the abilities layer lists them
 * without a special case for "a task whose provider is missing".
 *
 * The eventual source is the Progress Planner server. Nothing here knows that,
 * so swapping the source later means replacing get_rules() and nothing else.
 *
 * WHAT THIS DELIBERATELY DOES NOT DO
 *
 * It does not interpret the rule. `applies_when` and `target.find` are read by
 * the model, not by PHP -- that is the point of the format, and building an
 * interpreter here would recreate the coupling the format exists to remove.
 *
 * The one exception is `any_plugin_active`, which is checked before a task is
 * created. Without it a bare site collects every SEO rule it can never satisfy,
 * and the model spends a call discovering that. It is mechanical, it is cheap,
 * and the plugin already knows how to answer it.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks;

/**
 * Markdown_Recommendations class.
 */
class Markdown_Recommendations {

	/**
	 * Parsed rules, keyed by the directory they were read from.
	 *
	 * @var array<string, array<string, array<string, mixed>>>
	 */
	private static $rules = [];

	/**
	 * Whether loading markdown rules is enabled.
	 *
	 * Off unless a site opts in. This is a harness, not a feature.
	 *
	 * @return bool
	 */
	public static function is_enabled() {
		if ( \defined( 'PROGRESS_PLANNER_MARKDOWN_RECOMMENDATIONS' ) && \constant( 'PROGRESS_PLANNER_MARKDOWN_RECOMMENDATIONS' ) ) {
			return true;
		}

		/**
		 * Filter whether recommendations defined in markdown are loaded.
		 *
		 * @param bool $enabled Whether to load them.
		 */
		return (bool) \apply_filters( 'progress_planner_markdown_recommendations', false );
	}

	/**
	 * Get the directory the rules are read from.
	 *
	 * @return string
	 */
	public static function get_directory() {
		/**
		 * Filter the directory markdown recommendations are read from.
		 *
		 * @param string $directory Absolute path, no trailing slash.
		 */
		return (string) \apply_filters(
			'progress_planner_markdown_recommendations_dir',
			\rtrim( \PROGRESS_PLANNER_DIR, '/' ) . '/recommendations'
		);
	}

	/**
	 * Read every rule from disk.
	 *
	 * @return array<string, array<string, mixed>> Keyed by rule ID.
	 */
	public function get_rules() {
		$directory = self::get_directory();

		// Every listed recommendation asks for its goal, so without this one
		// listing would read and parse every file once per task.
		if ( isset( self::$rules[ $directory ] ) ) {
			return self::$rules[ $directory ];
		}

		self::$rules[ $directory ] = [];

		if ( ! \is_dir( $directory ) ) {
			return [];
		}

		$files = \glob( $directory . '/*.md' );

		if ( ! $files ) {
			return [];
		}

		$rules = [];

		foreach ( $files as $file ) {
			$rule = $this->parse( $file );

			if ( $rule ) {
				$rules[ (string) $rule['id'] ] = $rule;
			}
		}

		self::$rules[ $directory ] = $rules;

		return $rules;
	}

	/**
	 * Parse one rule file.
	 *
	 * Only the flat scalars are read. Nested blocks are left as raw text and
	 * handed to the model with the rest of the rule.
	 *
	 * @param string $file The file path.
	 *
	 * @return array<string, mixed>|null
	 */
	public function parse( $file ) {
		$raw = (string) \file_get_contents( $file ); // phpcs:ignore WordPress.WP.AlternativeFunctions -- Reading a bundled file, not a remote one.

		if ( 0 !== \strpos( $raw, "---\n" ) ) {
			return null;
		}

		$parts = \explode( "\n---\n", \substr( $raw, 4 ), 2 );

		if ( 2 !== \count( $parts ) ) {
			return null;
		}

		[ $frontmatter, $body ] = $parts;

		$rule = [
			'id'           => \basename( $file, '.md' ),
			'frontmatter'  => $frontmatter,
			'instructions' => \trim( $body ),
		];

		foreach ( \explode( "\n", $frontmatter ) as $line ) {
			if ( '' === $line || ' ' === $line[0] || "\t" === $line[0] || '#' === $line[0] ) {
				continue;
			}

			if ( \preg_match( '/^([a-z_]+):\s*(.*)$/', $line, $matches ) ) {
				$rule[ $matches[1] ] = \trim( $matches[2] );
			}
		}

		if ( empty( $rule['title'] ) ) {
			return null;
		}

		$rule['required_plugins'] = $this->get_inline_list( $frontmatter, 'any_plugin_active' );
		$rule['replaces']         = $this->get_inline_list( $frontmatter, 'replaces' );

		return $rule;
	}

	/**
	 * Read a list written inline, as `key: [a, b]`.
	 *
	 * Used for `replaces` and for `any_plugin_active`, the one part of
	 * applies_when read here. Everything else in applies_when is the model's to
	 * judge.
	 *
	 * @param string $frontmatter The raw frontmatter.
	 * @param string $key         The key.
	 *
	 * @return array<int, string>
	 */
	private function get_inline_list( $frontmatter, $key ) {
		if ( ! \preg_match( '/' . \preg_quote( $key, '/' ) . ':\s*\[([^\]]*)\]/', $frontmatter, $matches ) ) {
			return [];
		}

		$slugs = \array_map( 'trim', \explode( ',', $matches[1] ) );

		return \array_values( \array_filter( $slugs ) );
	}

	/**
	 * Whether a rule is worth showing on this site.
	 *
	 * Only the plugin condition is evaluated. A rule with no such condition
	 * always applies as far as this is concerned; whether it is *relevant* is
	 * for the model to work out from the rule's own text.
	 *
	 * @param array<string, mixed> $rule The rule.
	 *
	 * @return bool
	 */
	public function applies( array $rule ) {
		if ( empty( $rule['required_plugins'] ) ) {
			return true;
		}

		foreach ( $rule['required_plugins'] as $slug ) {
			if ( $this->is_plugin_active( $slug ) ) {
				return true;
			}
		}

		return false;
	}

	/**
	 * Whether a plugin is active, by the slug the rules use.
	 *
	 * Detection reuses the constants and classes the SEO data collector already
	 * knows about, so the two cannot disagree about what "Yoast is active"
	 * means.
	 *
	 * @param string $slug The plugin slug.
	 *
	 * @return bool
	 */
	private function is_plugin_active( $slug ) {
		$collector = new \Progress_Planner\Suggested_Tasks\Data_Collector\SEO_Plugin();
		$known     = $collector->get_seo_plugins();

		if ( isset( $known[ $slug ] ) ) {
			foreach ( (array) ( $known[ $slug ]['constants'] ?? [] ) as $constant ) {
				if ( \defined( $constant ) ) {
					return true;
				}
			}

			foreach ( (array) ( $known[ $slug ]['classes'] ?? [] ) as $class ) {
				if ( \class_exists( $class ) ) {
					return true;
				}
			}

			return false;
		}

		// Anything the collector does not know about falls back to the plugin
		// list, matched on the directory name.
		foreach ( (array) \get_option( 'active_plugins', [] ) as $plugin ) {
			if ( 0 === \strpos( (string) $plugin, $slug . '/' ) ) {
				return true;
			}
		}

		return false;
	}

	/**
	 * Build a provider for every rule that applies to this site.
	 *
	 * @return array<int, \Progress_Planner\Suggested_Tasks\Providers\Markdown_Rule>
	 */
	public function get_providers() {
		if ( ! self::is_enabled() ) {
			return [];
		}

		$providers = [];

		foreach ( $this->get_rules() as $rule ) {
			// Its goal is attached to the PHP providers it names instead.
			if ( ! empty( $rule['replaces'] ) ) {
				continue;
			}

			if ( ! $this->applies( $rule ) ) {
				continue;
			}

			$providers[] = new \Progress_Planner\Suggested_Tasks\Providers\Markdown_Rule( $rule );
		}

		return $providers;
	}

	/**
	 * Add the rule providers to the plugin's own list.
	 *
	 * @param array<int, mixed> $providers The existing providers.
	 *
	 * @return array<int, mixed>
	 */
	public function register_providers( $providers ) {
		return \array_merge( (array) $providers, $this->get_providers() );
	}

	/**
	 * Get the rule that states the goal for a provider, if one does.
	 *
	 * A rule's own provider carries it. Any other provider has one when a rule
	 * lists it under `replaces:`.
	 *
	 * @param \Progress_Planner\Suggested_Tasks\Tasks_Interface $provider The provider.
	 *
	 * @return array<string, mixed>|null
	 */
	public function get_rule_for_provider( $provider ) {
		if ( $provider instanceof \Progress_Planner\Suggested_Tasks\Providers\Markdown_Rule ) {
			return $provider->get_rule();
		}

		if ( ! self::is_enabled() ) {
			return null;
		}

		$provider_id = $provider->get_provider_id();

		foreach ( $this->get_rules() as $rule ) {
			if ( \in_array( $provider_id, (array) $rule['replaces'], true ) ) {
				return $rule;
			}
		}

		return null;
	}

	/**
	 * Get one rule by the ID of a task created from it.
	 *
	 * @param string $task_id The task ID.
	 *
	 * @return array<string, mixed>|null
	 */
	public function get_rule_for_task( $task_id ) {
		$prefix = \Progress_Planner\Suggested_Tasks\Providers\Markdown_Rule::PREFIX;

		if ( 0 !== \strpos( $task_id, $prefix ) ) {
			return null;
		}

		$rules = $this->get_rules();
		$id    = \substr( $task_id, \strlen( $prefix ) );

		return $rules[ $id ] ?? null;
	}
}
