<?php
/**
 * A task provider defined by a markdown rule rather than by PHP.
 *
 * One instance per rule file. Everything the interface asks for comes from the
 * rule's frontmatter, so a rule becomes a first-class provider: the dashboard
 * renders it, points and badges count it, capability filtering applies to it,
 * and the abilities layer sees it without knowing it is any different.
 *
 * That is the point of doing it this way. The alternative -- writing tasks
 * straight into the database with no provider behind them -- leaves every
 * consumer needing a special case for "a task whose provider does not exist".
 *
 * The provider deliberately cannot evaluate its own rule. A goal like
 * "attachment URLs must not be indexable" is satisfied by a redirect on one
 * site and a header on another, which is exactly why the rule is prose for a
 * model rather than a condition for PHP. So evaluate_task() always returns
 * false and completion arrives from outside.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Providers;

/**
 * Markdown_Rule class.
 */
class Markdown_Rule extends Tasks {

	/**
	 * The prefix every provider ID from a rule carries.
	 *
	 * A hyphen, not a colon: the provider ID becomes a taxonomy term slug, and
	 * sanitize_title() silently drops a colon, which turns md:foo into mdfoo
	 * and breaks every prefix check that follows.
	 *
	 * @var string
	 */
	const PREFIX = 'md-';

	/**
	 * The rule this provider was built from.
	 *
	 * @var array<string, mixed>
	 */
	protected $rule;

	/**
	 * Constructor.
	 *
	 * @param array<string, mixed> $rule The parsed rule.
	 */
	public function __construct( array $rule ) {
		$this->rule     = $rule;
		$this->priority = isset( $rule['priority'] ) ? (int) $rule['priority'] : 50;
	}

	/**
	 * Get the provider ID.
	 *
	 * @return string
	 */
	public function get_provider_id() {
		return self::PREFIX . ( $this->rule['id'] ?? '' );
	}

	/**
	 * Get the rule behind this provider.
	 *
	 * This is what a model reads: the goal, how to verify it, the hints and the
	 * bounds. It is not shown in the dashboard, which gets the summary instead.
	 *
	 * @return array<string, mixed>
	 */
	public function get_rule() {
		return $this->rule;
	}

	/**
	 * Whether the current user may act on this.
	 *
	 * @return bool
	 */
	public function capability_required() {
		$capability = $this->rule['capability'] ?? 'manage_options';

		return \current_user_can( (string) $capability );
	}

	/**
	 * Get the points awarded for completing this.
	 *
	 * @return int
	 */
	public function get_points() {
		return isset( $this->rule['points'] ) ? (int) $this->rule['points'] : 1;
	}

	/**
	 * Whether this recurs.
	 *
	 * @return bool
	 */
	public function is_repetitive() {
		return 'weekly' === ( $this->rule['repeats'] ?? 'never' );
	}

	/**
	 * Get the task title.
	 *
	 * @return string
	 */
	protected function get_title() {
		return (string) ( $this->rule['title'] ?? '' );
	}

	/**
	 * Get the task description.
	 *
	 * The first paragraph of "Why it matters", which is written to stand on its
	 * own. The rest of the rule is for the model, not the dashboard.
	 *
	 * @param array $task_data Optional data to include in the task.
	 *
	 * @return string
	 */
	protected function get_description( $task_data = [] ) {
		$instructions = (string) ( $this->rule['instructions'] ?? '' );

		// The paragraph wraps, so this matches consecutive non-blank lines
		// rather than stopping at the first newline.
		if ( ! \preg_match( '/^## Why it matters\R+((?:.+\R)+)/m', $instructions, $matches ) ) {
			return '';
		}

		return \trim( (string) \preg_replace( '/\s+/', ' ', $matches[1] ) );
	}

	/**
	 * Whether the task should be added.
	 *
	 * A rule that survived the loader's plugin check is offered. Whether it is
	 * actually relevant to this site is a judgement the rule's own text asks a
	 * model to make, not something to decide here.
	 *
	 * Per-item rules are held back: they describe how to find targets, and
	 * until something has found them there is no single task to add.
	 *
	 * @return bool
	 */
	public function should_add_task() {
		return 'true' !== ( $this->rule['per_item'] ?? 'false' );
	}

	/**
	 * Whether the task is completed.
	 *
	 * Always false. The site cannot evaluate a goal expressed for a model --
	 * that is what makes it a goal rather than a setting check -- so completion
	 * comes from outside and is never inferred here.
	 *
	 * @param string $task_id The task ID.
	 *
	 * @return bool
	 */
	public function is_task_completed( $task_id = '' ) {
		return false;
	}

	/**
	 * Evaluate the task.
	 *
	 * @param string $task_id The task ID.
	 *
	 * @return \Progress_Planner\Suggested_Tasks\Task|false
	 */
	public function evaluate_task( $task_id ) {
		return false;
	}
}
