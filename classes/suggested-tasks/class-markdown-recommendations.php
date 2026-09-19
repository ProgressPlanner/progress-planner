<?php
/**
 * Load recommendations defined as markdown files.
 *
 * A test harness for the goal-shaped recommendation format. Rules live in
 * /recommendations as markdown, and this turns the ones that apply into tasks
 * so the whole loop can be exercised locally: drop a file in, see the task
 * appear, have a model act on it, complete it, watch the score move.
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
	 * The provider ID prefix for tasks created from a markdown rule.
	 *
	 * Tasks created here have no PHP provider class behind them, which is the
	 * whole idea. The prefix is what tells the rest of the plugin that, so a
	 * missing provider is recognised rather than looking like a broken task.
	 *
	 * A hyphen, not a colon: the provider ID becomes a taxonomy term slug and
	 * sanitize_title() silently drops a colon, which turns md:foo into mdfoo
	 * and breaks every prefix check that follows.
	 *
	 * @var string
	 */
	const PROVIDER_PREFIX = 'md-';

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

		$rule['required_plugins'] = $this->get_required_plugins( $frontmatter );

		return $rule;
	}

	/**
	 * Get the plugin slugs a rule needs, from its any_plugin_active condition.
	 *
	 * The only part of applies_when read here. Everything else is the model's
	 * to judge.
	 *
	 * @param string $frontmatter The raw frontmatter.
	 *
	 * @return array<int, string>
	 */
	private function get_required_plugins( $frontmatter ) {
		if ( ! \preg_match( '/any_plugin_active:\s*\[([^\]]*)\]/', $frontmatter, $matches ) ) {
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
	 * Create tasks for every rule that applies and does not have one yet.
	 *
	 * @return int The number of tasks created.
	 */
	public function inject_tasks() {
		if ( ! self::is_enabled() ) {
			return 0;
		}

		$created = 0;

		foreach ( $this->get_rules() as $rule ) {
			if ( ! $this->applies( $rule ) ) {
				continue;
			}

			// A rule that instantiates per target needs the model to find the
			// targets first, so there is no single task to create here.
			if ( isset( $rule['per_item'] ) && 'true' === $rule['per_item'] ) {
				continue;
			}

			$task_id = self::PROVIDER_PREFIX . $rule['id'];

			$existing = \progress_planner()->get_suggested_tasks_db()->get_tasks_by(
				[
					'task_id'     => $task_id,
					'post_status' => [ 'publish', 'pending', 'trash', 'future' ],
				]
			);

			if ( $existing ) {
				continue;
			}

			$added = \progress_planner()->get_suggested_tasks_db()->add(
				[
					'task_id'     => $task_id,
					'post_title'  => $rule['title'],
					'provider_id' => $task_id,
					'description' => $this->get_summary( $rule ),
					'priority'    => isset( $rule['priority'] ) ? (int) $rule['priority'] : 50,
				]
			);

			if ( $added ) {
				++$created;
			}
		}

		return $created;
	}

	/**
	 * Get a one-paragraph summary for the task list.
	 *
	 * The first paragraph of "Why it matters", which is written to be read on
	 * its own. The full instructions go to the model, not into the dashboard.
	 *
	 * @param array<string, mixed> $rule The rule.
	 *
	 * @return string
	 */
	private function get_summary( array $rule ) {
		// The first paragraph: everything up to a blank line. The pattern has to
		// allow the paragraph to wrap, which is why it matches line by line
		// rather than treating a newline as the end.
		if ( ! \preg_match( '/^## Why it matters\R+((?:.+\R)+)/m', (string) $rule['instructions'], $matches ) ) {
			return '';
		}

		return \trim( \preg_replace( '/\s+/', ' ', $matches[1] ) ?? '' );
	}

	/**
	 * Get one rule by the ID of a task created from it.
	 *
	 * @param string $task_id The task ID.
	 *
	 * @return array<string, mixed>|null
	 */
	public function get_rule_for_task( $task_id ) {
		if ( 0 !== \strpos( $task_id, self::PROVIDER_PREFIX ) ) {
			return null;
		}

		$rules = $this->get_rules();
		$id    = \substr( $task_id, \strlen( self::PROVIDER_PREFIX ) );

		return $rules[ $id ] ?? null;
	}
}
