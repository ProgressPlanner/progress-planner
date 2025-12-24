<?php
/**
 * Add tasks for content updates.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Providers;

use Progress_Planner\Suggested_Tasks\Providers\Traits\Dismissable_Task;
use Progress_Planner\Page_Types;

/**
 * Add tasks for content updates.
 */
class Content_Review extends Tasks {
	use Dismissable_Task;

	/**
	 * The note prefix used to identify Progress Planner notes.
	 *
	 * @var string
	 */
	public const NOTE_PREFIX = '[PRPL]';

	/**
	 * The capability required to perform the task.
	 *
	 * @var string
	 */
	protected const CAPABILITY = 'edit_others_posts';

	/**
	 * The provider ID.
	 *
	 * @var string
	 */
	protected const PROVIDER_ID = 'review-post';

	/**
	 * The external link URL.
	 *
	 * @var string
	 */
	protected const EXTERNAL_LINK_URL = 'https://prpl.fyi/review-post';

	/**
	 * Whether the task is repetitive.
	 *
	 * @var bool
	 */
	protected $is_repetitive = true;

	/**
	 * The task URL target.
	 *
	 * @var string
	 */
	protected $url_target = '_blank';

	/**
	 * The task priority.
	 *
	 * @var int
	 */
	protected $priority = 10;

	/**
	 * Whether the task is dismissable.
	 *
	 * @var bool
	 */
	protected $is_dismissable = true;

	/**
	 * The number of items to inject.
	 *
	 * @var int
	 */
	protected const ITEMS_TO_INJECT = 10;

	/**
	 * The snoozed post IDs.
	 *
	 * @var array
	 */
	protected $snoozed_post_ids = [];

	/**
	 * The dismissed post IDs.
	 *
	 * @var array
	 */
	protected $dismissed_post_ids = [];

	/**
	 * The post to update IDs.
	 *
	 * @var array
	 */
	protected $task_post_mappings = [];

	/**
	 * The include post types.
	 *
	 * @var string[]
	 */
	protected $include_post_types = [];

	/**
	 * Initialize the task provider.
	 *
	 * @return void
	 */
	public function init() {
		$this->include_post_types = \progress_planner()->get_settings()->get_post_types_names(); // Wait for the post types to be initialized.

		\add_filter( 'progress_planner_update_posts_tasks_args', [ $this, 'filter_update_posts_args' ] );

		// Add the Yoast cornerstone pages to the important page IDs.
		if ( \function_exists( 'YoastSEO' ) ) {
			\add_filter( 'progress_planner_update_posts_important_page_ids', [ $this, 'add_yoast_cornerstone_pages' ] );
		}

		$this->init_dismissable_task();

		// Handle note injection and avatar customization.
		if ( $this->supports_notes() ) {
			\add_action( 'load-post.php', [ $this, 'maybe_inject_notes' ] );
			\add_filter( 'pre_get_avatar_data', [ $this, 'filter_note_avatar' ], 10, 2 );
			\add_action( 'admin_head', [ $this, 'add_note_avatar_styles' ] );
		}
	}

	/**
	 * Maybe inject notes when editing a post.
	 *
	 * @return void
	 */
	public function maybe_inject_notes() {
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- No action taken, just injecting notes.
		if ( ! isset( $_GET['prpl_inject_notes'] ) ) {
			return;
		}

		// phpcs:ignore WordPress.Security.NonceVerification.Recommended
		$post_id = isset( $_GET['post'] ) ? (int) $_GET['post'] : 0;
		if ( ! $post_id || ! \current_user_can( 'edit_post', $post_id ) ) {
			return;
		}

		// Inject all note types.
		$this->inject_image_review_notes( $post_id );
		$this->inject_link_review_notes( $post_id );
	}

	/**
	 * Get the task title.
	 *
	 * @param array $task_data The task data.
	 *
	 * @return string
	 */
	protected function get_title_with_data( $task_data = [] ) {
		if ( ! isset( $task_data['target_post_id'] ) ) {
			return '';
		}

		$post = \get_post( $task_data['target_post_id'] );

		if ( ! $post ) {
			return '';
		}

		return \sprintf(
				// translators: %1$s: The post type, %2$s: The post title.
			\esc_html__( 'Review %1$s "%2$s"', 'progress-planner' ),
			\strtolower( \get_post_type_object( \esc_html( $post->post_type ) )->labels->singular_name ), // @phpstan-ignore-line property.nonObject
			\esc_html( $post->post_title ) // @phpstan-ignore-line property.nonObject
		);
	}

	/**
	 * Get the task URL.
	 *
	 * @param array $task_data The task data.
	 *
	 * @return string
	 */
	protected function get_url_with_data( $task_data = [] ) {
		if ( ! isset( $task_data['target_post_id'] ) ) {
			return '';
		}

		$post = \get_post( $task_data['target_post_id'] );

		if ( ! $post ) {
			return '';
		}

		// We don't use the edit_post_link() function because we need to bypass it's current_user_can() check.
		return \esc_url(
			\add_query_arg(
				[
					'post'   => $post->ID,
					'action' => 'edit',
				],
				\admin_url( 'post.php' )
			)
		);
	}

	/**
	 * Check if the task should be added.
	 *
	 * @return bool
	 */
	public function should_add_task() {
		if ( ! empty( $this->task_post_mappings ) ) {
			return true;
		}

		$last_updated_posts = [];

		// Check if there are any important pages to update.
		$important_page_ids = [];
		foreach ( \progress_planner()->get_admin__page_settings()->get_settings() as $important_page ) {
			if ( 0 !== (int) $important_page['value'] ) {
				$important_page_ids[] = (int) $important_page['value'];
			}
		}

		// Add the privacy policy page ID if it exists. Not 'publish' page will not be fetched by get_posts().
		$privacy_policy_page_id = \get_option( 'wp_page_for_privacy_policy' );
		if ( $privacy_policy_page_id ) {
			$important_page_ids[] = (int) $privacy_policy_page_id;
		}

		/**
		 * Filters the pages we deem more important for content updates.
		 *
		 * @param int[] $important_page_ids Post & page IDs of the important pages.
		 */
		$important_page_ids = \apply_filters( 'progress_planner_update_posts_important_page_ids', $important_page_ids );

		if ( ! empty( $important_page_ids ) ) {
			$last_updated_posts = $this->get_old_posts(
				[
					'post__in'   => $important_page_ids,
					'post_type'  => 'any',
					'date_query' => [
						[
							'column' => 'post_modified',
							'before' => '-6 months', // Important pages are updated more often.
						],
					],
				]
			);
		}

		// Lets check for other posts to update.
		if ( 0 < static::ITEMS_TO_INJECT - \count( $last_updated_posts ) ) {
			// Get the post that was updated last.
			$last_updated_posts = \array_merge(
				$last_updated_posts,
				$this->get_old_posts(
					[
						'post__not_in' => $important_page_ids, // This can be an empty array.
						'post_type'    => $this->include_post_types,
					]
				)
			);
		}

		if ( ! $last_updated_posts ) {
			return false;
		}

		foreach ( $last_updated_posts as $post ) {
			// Skip if the task has been dismissed.
			if ( $this->is_task_dismissed(
				[
					'target_post_id' => $post->ID,
					'provider_id'    => $this->get_provider_id(),
				]
			) ) {
				continue;
			}

			$task_id = $this->get_task_id( [ 'target_post_id' => $post->ID ] );

			// Don't add the task if it was completed.
			if ( true === \progress_planner()->get_suggested_tasks()->was_task_completed( $task_id ) ) {
				continue;
			}

			$this->task_post_mappings[ $task_id ] = [
				'task_id'          => $task_id,
				'target_post_id'   => $post->ID,
				'target_post_type' => $post->post_type,
			];
		}

		return ! empty( $this->task_post_mappings );
	}

	/**
	 * Get an array of tasks to inject.
	 *
	 * @return array
	 */
	public function get_tasks_to_inject() {
		if ( ! $this->should_add_task() ) {
			return [];
		}

		$task_to_inject = [];
		foreach ( $this->task_post_mappings as $task_data ) {
			if ( true === \progress_planner()->get_suggested_tasks()->was_task_completed( $task_data['task_id'] ) ) {
				continue;
			}

			$task_to_inject[] = [
				'task_id'           => $this->get_task_id( [ 'target_post_id' => $task_data['target_post_id'] ] ),
				'provider_id'       => $this->get_provider_id(),
				'target_post_id'    => $task_data['target_post_id'],
				'target_post_type'  => $task_data['target_post_type'],
				'date'              => \gmdate( 'YW' ),
				'post_title'        => $this->get_title_with_data( $task_data ),
				'url'               => $this->get_url_with_data( $task_data ),
				'url_target'        => $this->get_url_target(),
				'dismissable'       => $this->is_dismissable(),
				'priority'          => $this->get_priority(),
				'points'            => $this->get_points(),
				'external_link_url' => $this->get_external_link_url(),
			];
		}

		$added_tasks = [];

		foreach ( $task_to_inject as $task_data ) {
			// Skip the task if it was already injected.
			if ( \progress_planner()->get_suggested_tasks_db()->get_post( $task_data['task_id'] ) ) {
				continue;
			}

			$added_tasks[] = \progress_planner()->get_suggested_tasks_db()->add( $task_data );
		}

		return $added_tasks;
	}

	/**
	 * This method is added just to override the parent method.
	 * For this task provider we can't check if it is snoozed like for other as we snooze the task for specific post.
	 * Check for that is included in the should_add_task method.
	 *
	 * @return bool
	 */
	public function is_task_snoozed() {
		return false;
	}

	/**
	 * Get the old posts.
	 *
	 * @param array $args The args.
	 *
	 * @return \WP_Post[]
	 */
	public function get_old_posts( $args = [] ) {
		$posts = [];

		// Parse default args.
		$args = \wp_parse_args(
			$args,
			[
				'posts_per_page'      => static::ITEMS_TO_INJECT,
				'post_status'         => 'publish',
				'orderby'             => 'modified',
				'order'               => 'ASC',
				'ignore_sticky_posts' => true,
				'date_query'          => [
					[
						'column' => 'post_modified',
						'before' => '-12 months',
					],
				],
			]
		);

		/**
		 * Filters the args for the posts & pages we want user to review.
		 *
		 * @param array $args The get_posts args.
		 */
		$args = \apply_filters( 'progress_planner_update_posts_tasks_args', $args );

		// Get the post that was updated last.
		$posts = \get_posts( $args );

		return $posts ? $posts : [];
	}

	/**
	 * Filter the review posts tasks args.
	 *
	 * @param array $args The args.
	 *
	 * @return array
	 */
	public function filter_update_posts_args( $args ) {
		$args['post__not_in'] = isset( $args['post__not_in'] )
			? $args['post__not_in']
			: [];

		$args['post__not_in'] = \array_merge(
			$args['post__not_in'],
			// Add the snoozed post IDs to the post__not_in array.
			$this->get_snoozed_post_ids(),
		);

		if ( ! empty( $this->get_dismissed_post_ids() ) ) {
			$args['post__not_in'] = \array_merge( $args['post__not_in'], $this->get_dismissed_post_ids() );
		}

		if ( \function_exists( 'YoastSEO' ) ) {
			// Handle the case when the meta key doesn't exist.
			$args['meta_query'] = [ // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_query
				'relation' => 'OR',
				[
					'key'     => '_yoast_wpseo_content_score',
					'compare' => 'EXISTS',
				],
				[
					'key'     => '_yoast_wpseo_content_score',
					'compare' => 'NOT EXISTS',
				],
			];

			$args['orderby'] = 'meta_value_num';
			$args['order']   = 'ASC';
		}

		return $args;
	}

	/**
	 * Get the snoozed post IDs.
	 *
	 * @return array
	 */
	protected function get_snoozed_post_ids() {
		if ( ! empty( $this->snoozed_post_ids ) ) {
			return $this->snoozed_post_ids;
		}

		$snoozed = \progress_planner()->get_suggested_tasks_db()->get_tasks_by( [ 'post_status' => 'future' ] );

		foreach ( $snoozed as $task ) {
			/**
			 * The task object.
			 *
			 * @var \Progress_Planner\Suggested_Tasks\Task $task
			 */
			if ( isset( $task->provider->slug ) && 'review-post' === $task->provider->slug ) {
				$this->snoozed_post_ids[] = $task->target_post_id;
			}
		}

		return $this->snoozed_post_ids;
	}

	/**
	 * Get the dismissed post IDs.
	 *
	 * @return array
	 */
	protected function get_dismissed_post_ids() {
		if ( ! empty( $this->dismissed_post_ids ) ) {
			return $this->dismissed_post_ids;
		}

		$dismissed = $this->get_dismissed_tasks();

		if ( ! empty( $dismissed ) ) {
			$this->dismissed_post_ids = \array_values( \wp_list_pluck( $dismissed, 'post_id' ) );
		}

		return $this->dismissed_post_ids;
	}

	/**
	 * Get the task identifier for storing dismissal data.
	 * Override this method in the implementing class to provide task-specific identification.
	 *
	 * @param array $task_data The task data.
	 *
	 * @return string|false The task identifier or false if not applicable.
	 */
	protected function get_task_identifier( $task_data ) {
		return $this->get_provider_id() . '-' . $task_data['target_post_id'];
	}

	/**
	 * Get the saved page-types.
	 *
	 * @return int[]
	 */
	protected function get_saved_page_types() {
		$ids = [];
		// Add the saved page-types to the post__not_in array.
		$page_types = \progress_planner()->get_admin__page_settings()->get_settings();
		foreach ( $page_types as $page_type ) {
			if ( isset( $page_type['value'] ) && 0 !== (int) $page_type['value'] ) {
				$ids[] = (int) $page_type['value'];
			}
		}
		return $ids;
	}

	/**
	 * Check if a specific task is completed.
	 *
	 * @param string $task_id The task ID to check.
	 * @return bool
	 */
	protected function is_specific_task_completed( $task_id ) {
		$task = \progress_planner()->get_suggested_tasks_db()->get_post( $task_id );

		if ( ! $task ) {
			return false;
		}

		$data = $task->get_data();

		if ( ! $data || ! isset( $data['target_post_id'] ) ) {
			return false;
		}

		$target_post_id = (int) $data['target_post_id'];

		// Check if notes-based completion is applicable (WP 6.9+ and notes exist).
		if ( $this->supports_notes() ) {
			$notes_resolved = $this->all_notes_resolved( $target_post_id );

			// If notes exist and all are resolved, task is complete.
			if ( true === $notes_resolved ) {
				return true;
			}

			// If notes exist but some are open, task is not complete.
			if ( false === $notes_resolved ) {
				return false;
			}

			// If no notes exist (null), fall back to modification time check.
		}

		// Original completion check: post was modified within the last 12 months.
		return (int) \get_post_modified_time( 'U', false, $target_post_id ) > \strtotime( '-12 months' );
	}

	/**
	 * Add the Yoast cornerstone pages to the important page IDs.
	 *
	 * @param int[] $important_page_ids The important page IDs.
	 * @return int[]
	 */
	public function add_yoast_cornerstone_pages( $important_page_ids ) {
		if ( ! \function_exists( 'YoastSEO' ) ) {
			return $important_page_ids;
		}
		$cornerstone_page_ids = \get_posts(
			[
				'post_type'  => 'any',
				'meta_key'   => '_yoast_wpseo_is_cornerstone', // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_key
				'meta_value' => '1', // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_value
				'fields'     => 'ids',
			]
		);
		if ( ! empty( $cornerstone_page_ids ) ) {
			$important_page_ids = \array_merge( $important_page_ids, $cornerstone_page_ids );
		}
		return $important_page_ids;
	}

	/**
	 * Get the expiration period in seconds.
	 *
	 * @param array $dismissal_data The dismissal data.
	 *
	 * @return int The expiration period in seconds.
	 */
	protected function get_expiration_period( $dismissal_data ) {
		if ( ! isset( $dismissal_data['post_id'] ) ) {
			return 6 * MONTH_IN_SECONDS;
		}

		// Important pages have term from 'progress_planner_page_types' taxonomy assigned.
		$has_term = \has_term( '', Page_Types::TAXONOMY_NAME, $dismissal_data['post_id'] );
		if ( $has_term ) {
			return 6 * MONTH_IN_SECONDS;
		}

		// Check if it his cornerstone content.
		if ( \function_exists( 'YoastSEO' ) ) {
			$is_cornerstone = \get_post_meta( $dismissal_data['post_id'], '_yoast_wpseo_is_cornerstone', true );
			if ( '1' === $is_cornerstone ) {
				return 6 * MONTH_IN_SECONDS;
			}
		}

		return 12 * MONTH_IN_SECONDS;
	}

	/**
	 * Add task actions specific to this task.
	 *
	 * @param array $data    The task data.
	 * @param array $actions The existing actions.
	 *
	 * @return array
	 */
	public function add_task_actions( $data = [], $actions = [] ) {
		$task_post = \progress_planner()->get_suggested_tasks_db()->get_post( $data['id'] );
		if ( ! $task_post ) {
			return $actions;
		}

		$task_data = $task_post->get_data();

		if ( isset( $task_data['target_post_id'] ) ) {
			$actions[] = [
				'priority' => 10,
				'html'     => '<a class="prpl-tooltip-action-text" href="' . \admin_url( 'post.php?action=edit&post=' . $task_data['target_post_id'] ) . '" target="_self">' . \esc_html__( 'Review', 'progress-planner' ) . '</a>',
			];

			// Add "Review with Notes" action for WordPress 6.9+.
			if ( $this->supports_notes() ) {
				$actions[] = [
					'priority' => 11,
					'html'     => '<a class="prpl-tooltip-action-text" href="' . \admin_url( 'post.php?action=edit&post=' . $task_data['target_post_id'] . '&prpl_inject_notes=1' ) . '" target="_self">' . \esc_html__( 'Review with Notes', 'progress-planner' ) . '</a>',
				];
			}
		}

		return $actions;
	}

	/**
	 * Check if WordPress supports the Notes feature (6.9+).
	 *
	 * @return bool
	 */
	public function supports_notes() {
		global $wp_version;
		return \version_compare( $wp_version, '6.9', '>=' );
	}

	/**
	 * Filter avatar data for PRPL notes to show Progress Planner logo.
	 *
	 * @param array $args        Arguments passed to get_avatar_data().
	 * @param mixed $id_or_email User ID, email, WP_User, WP_Post, or WP_Comment.
	 *
	 * @return array Modified arguments.
	 */
	public function filter_note_avatar( $args, $id_or_email ) {
		// Only process WP_Comment objects.
		if ( ! $id_or_email instanceof \WP_Comment ) {
			return $args;
		}

		// Check if this is a note with our prefix.
		if ( 'note' !== $id_or_email->comment_type ) {
			return $args;
		}

		if ( false === \strpos( $id_or_email->comment_content, static::NOTE_PREFIX ) ) {
			return $args;
		}

		// Use Progress Planner logo as avatar.
		$args['url']          = \constant( 'PROGRESS_PLANNER_URL' ) . '/assets/images/icon_progress_planner.svg';
		$args['found_avatar'] = true;

		return $args;
	}

	/**
	 * Add CSS styles for PRPL note avatars in the editor.
	 *
	 * @return void
	 */
	public function add_note_avatar_styles() {
		$screen = \get_current_screen();
		if ( ! $screen || 'post' !== $screen->base ) {
			return;
		}

		$logo_url = \constant( 'PROGRESS_PLANNER_URL' ) . '/assets/images/icon_progress_planner.svg';
		?>
		<style>
			/* Fix Progress Planner note avatars to be perfect circles */
			img[src="<?php echo \esc_url( $logo_url ); ?>"] {
				width: 32px !important;
				height: 32px !important;
				object-fit: contain !important;
				background: #f0f0f1 !important;
				padding: 4px !important;
				box-sizing: border-box !important;
				border-radius: 50% !important;
			}
		</style>
		<?php
	}

	/**
	 * Create a note on a specific post.
	 *
	 * @param int    $post_id   The post ID to attach the note to.
	 * @param string $content   The note content.
	 * @param int    $parent_id Parent note ID for threading (0 for top-level).
	 *
	 * @return int|false The note (comment) ID or false on failure.
	 */
	public function create_note( $post_id, $content, $parent_id = 0 ) {
		$note_data = [
			'comment_post_ID'  => $post_id,
			'comment_content'  => $content,
			'comment_type'     => 'note',
			'comment_approved' => 0, // 0 = open, 1 = resolved.
			'comment_parent'   => $parent_id,
			'user_id'          => \get_current_user_id(),
		];

		// Bypass filters that might interfere with note creation.
		\add_filter( 'duplicate_comment_id', '__return_false' );
		\add_filter( 'comment_flood_filter', '__return_false' );

		$note_id = \wp_insert_comment( $note_data );

		\remove_filter( 'duplicate_comment_id', '__return_false' );
		\remove_filter( 'comment_flood_filter', '__return_false' );

		return $note_id;
	}

	/**
	 * Get all Progress Planner notes for a post.
	 *
	 * @param int    $post_id The post ID.
	 * @param string $status  'open' for unresolved, 'resolved' for resolved, 'all' for both.
	 *
	 * @return array Array of note comments.
	 */
	public function get_notes( $post_id, $status = 'all' ) {
		$args = [
			'post_id' => $post_id,
			'type'    => 'note',
			'search'  => static::NOTE_PREFIX, // Only get our notes.
		];

		if ( 'open' === $status ) {
			$args['status'] = 'hold'; // WordPress maps 0 to 'hold'.
		} elseif ( 'resolved' === $status ) {
			$args['status'] = 'approve'; // WordPress maps 1 to 'approve'.
		}

		return \get_comments( $args );
	}

	/**
	 * Check if all Progress Planner notes are resolved for a post.
	 *
	 * @param int $post_id The post ID.
	 *
	 * @return bool|null True if all resolved, false if open notes exist, null if no notes.
	 */
	public function all_notes_resolved( $post_id ) {
		$all_notes = $this->get_notes( $post_id, 'all' );

		if ( empty( $all_notes ) ) {
			return null; // No notes created yet.
		}

		$open_notes = $this->get_notes( $post_id, 'open' );

		return empty( $open_notes );
	}

	/**
	 * Find image blocks in a post.
	 *
	 * @param int $post_id The post ID.
	 *
	 * @return array Array of image block data.
	 */
	public function find_image_blocks( $post_id ) {
		$post = \get_post( $post_id );
		if ( ! $post || ! \has_blocks( $post->post_content ) ) {
			return [];
		}

		$blocks       = \parse_blocks( $post->post_content );
		$image_blocks = [];

		foreach ( $blocks as $index => $block ) {
			if ( 'core/image' === $block['blockName'] ) {
				$image_blocks[] = [
					'index' => $index,
					'block' => $block,
					'alt'   => $block['attrs']['alt'] ?? '',
					'id'    => $block['attrs']['id'] ?? 0,
				];
			}

			// Also check inner blocks (for groups, columns, etc.).
			if ( ! empty( $block['innerBlocks'] ) ) {
				$inner_images = $this->find_image_blocks_recursive( $block['innerBlocks'], $index );
				$image_blocks = \array_merge( $image_blocks, $inner_images );
			}
		}

		return $image_blocks;
	}

	/**
	 * Recursively find image blocks in inner blocks.
	 *
	 * @param array  $blocks       The blocks to search.
	 * @param string $parent_index The parent block index.
	 *
	 * @return array Array of image block data.
	 */
	protected function find_image_blocks_recursive( $blocks, $parent_index ) {
		$image_blocks = [];

		foreach ( $blocks as $index => $block ) {
			if ( 'core/image' === $block['blockName'] ) {
				$image_blocks[] = [
					'index' => "{$parent_index}.{$index}",
					'block' => $block,
					'alt'   => $block['attrs']['alt'] ?? '',
					'id'    => $block['attrs']['id'] ?? 0,
				];
			}

			if ( ! empty( $block['innerBlocks'] ) ) {
				$inner        = $this->find_image_blocks_recursive( $block['innerBlocks'], "{$parent_index}.{$index}" );
				$image_blocks = \array_merge( $image_blocks, $inner );
			}
		}

		return $image_blocks;
	}

	/**
	 * Inject review notes for images on a post.
	 *
	 * @param int $post_id The post ID to inject notes on.
	 *
	 * @return array Array of created note IDs.
	 */
	public function inject_image_review_notes( $post_id ) {
		$post = \get_post( $post_id );
		if ( ! $post || ! \has_blocks( $post->post_content ) ) {
			return [];
		}

		$blocks        = \parse_blocks( $post->post_content );
		$created_notes = [];
		$image_num     = 0;
		$modified      = false;

		$blocks = $this->process_blocks_for_notes( $blocks, $post_id, $created_notes, $image_num, $modified );

		// Update post content with block metadata if we created notes.
		if ( $modified && ! empty( $created_notes ) ) {
			$new_content = \serialize_blocks( $blocks );

			\wp_update_post(
				[
					'ID'           => $post_id,
					'post_content' => $new_content,
				]
			);
		}

		return $created_notes;
	}

	/**
	 * Process blocks recursively to add notes to image blocks.
	 *
	 * @param array $blocks        The blocks to process.
	 * @param int   $post_id       The post ID.
	 * @param array $created_notes Array to collect created note IDs (passed by reference).
	 * @param int   $image_num     Image counter (passed by reference).
	 * @param bool  $modified      Whether any blocks were modified (passed by reference).
	 *
	 * @return array The processed blocks.
	 */
	protected function process_blocks_for_notes( $blocks, $post_id, &$created_notes, &$image_num, &$modified ) {
		foreach ( $blocks as $index => $block ) {
			if ( 'core/image' === $block['blockName'] ) {
				++$image_num;

				// Skip if block already has a valid note (exists in database).
				$existing_note_id = $block['attrs']['metadata']['noteId'] ?? 0;
				if ( $existing_note_id && \get_comment( $existing_note_id ) ) {
					continue;
				}

				$alt_text     = $block['attrs']['alt'] ?? '';
				$alt_text_str = $alt_text ? " (alt: \"{$alt_text}\")" : ' (no alt text)';
				$is_linked    = $this->image_block_has_link( $block );

				if ( $is_linked ) {
					$note_content = \sprintf(
						/* translators: %1$s: Note prefix, %2$d: Image number, %3$s: Alt text info. */
						\__( '%1$s Review Image %2$d%3$s: This image is linked. Check that both the image and link are still relevant and working.', 'progress-planner' ),
						static::NOTE_PREFIX,
						$image_num,
						$alt_text_str
					);
				} else {
					$note_content = \sprintf(
						/* translators: %1$s: Note prefix, %2$d: Image number, %3$s: Alt text info. */
						\__( '%1$s Review Image %2$d%3$s: Is this image still relevant and displaying correctly?', 'progress-planner' ),
						static::NOTE_PREFIX,
						$image_num,
						$alt_text_str
					);
				}

				$note_id = $this->create_note( $post_id, $note_content );

				if ( $note_id ) {
					$created_notes[] = $note_id;

					// Add note ID to block metadata.
					if ( ! isset( $blocks[ $index ]['attrs']['metadata'] ) ) {
						$blocks[ $index ]['attrs']['metadata'] = [];
					}
					$blocks[ $index ]['attrs']['metadata']['noteId'] = $note_id;

					$modified = true;
				}
			}

			// Process inner blocks recursively.
			if ( ! empty( $block['innerBlocks'] ) ) {
				$blocks[ $index ]['innerBlocks'] = $this->process_blocks_for_notes(
					$block['innerBlocks'],
					$post_id,
					$created_notes,
					$image_num,
					$modified
				);
			}
		}

		return $blocks;
	}

	/**
	 * Inject review notes for paragraphs with links on a post.
	 *
	 * @param int $post_id The post ID to inject notes on.
	 *
	 * @return array Array of created note IDs.
	 */
	public function inject_link_review_notes( $post_id ) {
		$post = \get_post( $post_id );
		if ( ! $post || ! \has_blocks( $post->post_content ) ) {
			return [];
		}

		$blocks        = \parse_blocks( $post->post_content );
		$created_notes = [];
		$paragraph_num = 0;
		$modified      = false;

		$blocks = $this->process_blocks_for_link_notes( $blocks, $post_id, $created_notes, $paragraph_num, $modified );

		// Update post content with block metadata if we created notes.
		if ( $modified && ! empty( $created_notes ) ) {
			$new_content = \serialize_blocks( $blocks );

			\wp_update_post(
				[
					'ID'           => $post_id,
					'post_content' => $new_content,
				]
			);
		}

		return $created_notes;
	}

	/**
	 * Process blocks recursively to add notes to paragraphs with links.
	 *
	 * @param array $blocks         The blocks to process.
	 * @param int   $post_id        The post ID.
	 * @param array $created_notes  Array to collect created note IDs (passed by reference).
	 * @param int   $paragraph_num  Paragraph counter (passed by reference).
	 * @param bool  $modified       Whether any blocks were modified (passed by reference).
	 *
	 * @return array The processed blocks.
	 */
	protected function process_blocks_for_link_notes( $blocks, $post_id, &$created_notes, &$paragraph_num, &$modified ) {
		foreach ( $blocks as $index => $block ) {
			// Check if this is a paragraph block with links.
			if ( 'core/paragraph' === $block['blockName'] && $this->block_has_links( $block ) ) {
				++$paragraph_num;

				// Skip if block already has a valid note (exists in database).
				$existing_note_id = $block['attrs']['metadata']['noteId'] ?? 0;
				if ( $existing_note_id && \get_comment( $existing_note_id ) ) {
					continue;
				}

				$link_count = $this->count_links_in_block( $block );

				$note_content = \sprintf(
					/* translators: %1$s: Note prefix, %2$d: Paragraph number, %3$d: Number of links. */
					\_n(
						'%1$s Review Paragraph %2$d: Check the %3$d link - is it still working and relevant?',
						'%1$s Review Paragraph %2$d: Check the %3$d links - are they still working and relevant?',
						$link_count,
						'progress-planner'
					),
					static::NOTE_PREFIX,
					$paragraph_num,
					$link_count
				);

				$note_id = $this->create_note( $post_id, $note_content );

				if ( $note_id ) {
					$created_notes[] = $note_id;

					// Add note ID to block metadata.
					if ( ! isset( $blocks[ $index ]['attrs']['metadata'] ) ) {
						$blocks[ $index ]['attrs']['metadata'] = [];
					}
					$blocks[ $index ]['attrs']['metadata']['noteId'] = $note_id;

					$modified = true;
				}
			}

			// Process inner blocks recursively.
			if ( ! empty( $block['innerBlocks'] ) ) {
				$blocks[ $index ]['innerBlocks'] = $this->process_blocks_for_link_notes(
					$block['innerBlocks'],
					$post_id,
					$created_notes,
					$paragraph_num,
					$modified
				);
			}
		}

		return $blocks;
	}

	/**
	 * Check if a block contains links.
	 *
	 * @param array $block The block to check.
	 *
	 * @return bool True if block contains links.
	 */
	protected function block_has_links( $block ) {
		$inner_html = $block['innerHTML'] ?? '';
		return false !== \strpos( $inner_html, '<a ' ) || false !== \strpos( $inner_html, '<a>' );
	}

	/**
	 * Check if an image block is wrapped in a link.
	 *
	 * @param array $block The image block to check.
	 *
	 * @return bool True if image is linked.
	 */
	protected function image_block_has_link( $block ) {
		// Check block attributes for link destination.
		if ( ! empty( $block['attrs']['linkDestination'] ) && 'none' !== $block['attrs']['linkDestination'] ) {
			return true;
		}

		// Also check innerHTML for anchor tags.
		$inner_html = $block['innerHTML'] ?? '';
		return false !== \strpos( $inner_html, '<a ' );
	}

	/**
	 * Count the number of links in a block.
	 *
	 * @param array $block The block to check.
	 *
	 * @return int Number of links found.
	 */
	protected function count_links_in_block( $block ) {
		$inner_html = $block['innerHTML'] ?? '';
		return \preg_match_all( '/<a\s/', $inner_html );
	}

	/**
	 * Delete all Progress Planner notes for a post.
	 *
	 * @param int  $post_id      The post ID.
	 * @param bool $force_delete Whether to bypass trash.
	 *
	 * @return int Number of notes deleted.
	 */
	public function delete_notes( $post_id, $force_delete = true ) {
		$notes   = $this->get_notes( $post_id, 'all' );
		$deleted = 0;

		foreach ( $notes as $note ) {
			if ( $note instanceof \WP_Comment && \wp_delete_comment( $note->comment_ID, $force_delete ) ) {
				++$deleted;
			}
		}

		return $deleted;
	}
}
