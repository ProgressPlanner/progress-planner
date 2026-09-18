<?php
/**
 * The set of recommendations an agent may apply on its own.
 *
 * Membership here is deliberate, not derived. An earlier pass inferred the set
 * from "everything extending Tasks_Interactive", which was wrong: that class
 * also covers sending a test email, deleting terms, and flushing rewrite rules.
 * Each entry below was read individually and is listed because it writes one
 * known option and nothing else.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Abilities;

/**
 * Recommendation_Fixes class.
 */
class Recommendation_Fixes {

	/**
	 * Fixes an agent may apply unattended.
	 *
	 * Keys are provider IDs. Each entry declares:
	 * - option:  the single option written.
	 * - value:   the fixed value, when the task has only one correct outcome.
	 * - input:   the input property name, when the caller supplies the value.
	 * - type:    'string' or 'boolean-ish', used to validate before writing.
	 * - summary: what the caller is agreeing to, in plain words.
	 *
	 * @var array<string, array<string, mixed>>
	 */
	private const FIXES = [
		'core-blogdescription'                      => [
			'option'  => 'blogdescription',
			'input'   => 'value',
			'type'    => 'string',
			'summary' => 'Set the site tagline.',
		],
		'select-timezone'                           => [
			'option'  => 'timezone_string',
			'input'   => 'value',
			'type'    => 'timezone',
			'summary' => 'Set the site timezone.',
		],
		'set-date-format'                           => [
			'option'  => 'date_format',
			'input'   => 'value',
			'type'    => 'string',
			'summary' => 'Set the date format.',
		],
		'search-engine-visibility'                  => [
			'option'  => 'blog_public',
			'value'   => '1',
			'type'    => 'string',
			'summary' => 'Allow search engines to index the site.',
		],
		'disable-comments'                          => [
			'option'  => 'default_comment_status',
			'value'   => 'closed',
			'type'    => 'string',
			'summary' => 'Close comments on new content by default.',
		],
		'disable-comment-pagination'                => [
			'option'  => 'page_comments',
			'value'   => '',
			'type'    => 'string',
			'summary' => 'Turn off comment pagination.',
		],

		/*
		 * SEO-plugin settings. These do not go through update_option: each plugin
		 * owns its own settings store and validates on write, so the value is set
		 * through the plugin's own API. The task only exists when its plugin is
		 * active, so an entry here is unreachable otherwise.
		 *
		 * Yoast's tasks were built before AIOSEO's and only ever got a UI path --
		 * the popover deep-links into Yoast's settings screen and highlights the
		 * field. That affordance is for a person; the underlying setting is a
		 * plain boolean, so an agent can set it directly.
		 */
		'yoast-author-archive'                      => [
			'seo'     => 'yoast',
			'setting' => 'disable-author',
			'value'   => true,
			'summary' => 'Disable author archives in Yoast SEO.',
		],
		'yoast-date-archive'                        => [
			'seo'     => 'yoast',
			'setting' => 'disable-date',
			'value'   => true,
			'summary' => 'Disable date archives in Yoast SEO.',
		],
		'yoast-format-archive'                      => [
			'seo'     => 'yoast',
			'setting' => 'disable-post_format',
			'value'   => true,
			'summary' => 'Disable post-format archives in Yoast SEO.',
		],
		'yoast-media-pages'                         => [
			'seo'     => 'yoast',
			'setting' => 'disable-attachment',
			'value'   => true,
			'summary' => 'Redirect attachment pages in Yoast SEO.',
		],
		'yoast-crawl-settings-emoji-scripts'        => [
			'seo'     => 'yoast',
			'setting' => 'remove_emoji_scripts',
			'value'   => true,
			'summary' => 'Remove emoji scripts via Yoast SEO.',
		],
		'yoast-crawl-settings-feed-authors'         => [
			'seo'     => 'yoast',
			'setting' => 'remove_feed_authors',
			'value'   => true,
			'summary' => 'Disable author feeds via Yoast SEO.',
		],
		'yoast-crawl-settings-feed-global-comments' => [
			'seo'     => 'yoast',
			'setting' => 'remove_feed_global_comments',
			'value'   => true,
			'summary' => 'Disable the global comment feed via Yoast SEO.',
		],

		/*
		 * AIOSEO stores its settings as a nested object. The path below is walked
		 * on the live options object, matching what each provider's own submit
		 * handler does.
		 */
		'aioseo-author-archive'                     => [
			'seo'     => 'aioseo',
			'root'    => 'options',
			'path'    => [ 'searchAppearance', 'archives', 'author', 'show' ],
			'value'   => false,
			'summary' => 'Noindex author archives in All in One SEO.',
		],
		'aioseo-date-archive'                       => [
			'seo'     => 'aioseo',
			'root'    => 'options',
			'path'    => [ 'searchAppearance', 'archives', 'date', 'show' ],
			'value'   => false,
			'summary' => 'Noindex date archives in All in One SEO.',
		],
		'aioseo-crawl-settings-feed-authors'        => [
			'seo'     => 'aioseo',
			'root'    => 'options',
			'path'    => [ 'searchAppearance', 'advanced', 'crawlCleanup', 'feeds', 'authors' ],
			'value'   => false,
			'summary' => 'Disable author feeds in All in One SEO.',
		],

		/*
		 * Telling the plugin which existing page serves a given role.
		 *
		 * These do not create anything. The recommendation asks whether the site
		 * has an About page; this records the answer and, when the answer is
		 * yes, which page it is.
		 *
		 * The plugin deliberately does not try to find the page itself. Deciding
		 * that "About Emilia" at /about-us/ is the About page -- and that
		 * "Job opening" is not -- is a judgement about titles, slugs, navigation
		 * and content in whatever language the site is written in. A caller that
		 * can read the site's pages is far better at that than a title match
		 * would be, and a wrong guess made in PHP would be silent.
		 *
		 * So the division is: the caller identifies the page, and this verifies
		 * the ID names a real published page of an allowed type before writing.
		 */
		'set-page-about'                            => [
			'page_type' => 'about',
			'input'     => 'value',
			'summary'   => 'Record which existing page is the About page.',
		],
		'set-page-contact'                          => [
			'page_type' => 'contact',
			'input'     => 'value',
			'summary'   => 'Record which existing page is the Contact page.',
		],
		'set-page-faq'                              => [
			'page_type' => 'faq',
			'input'     => 'value',
			'summary'   => 'Record which existing page is the FAQ page.',
		],

		/*
		 * Deleting WordPress's own placeholder content.
		 *
		 * These are the only entries that remove something rather than change a
		 * setting, so they are the only ones annotated destructive. Two things
		 * make them defensible anyway: the target is not ambiguous -- the data
		 * collector resolves the specific post WordPress ships, by slug with a
		 * title fallback -- and the recommendation exists precisely because the
		 * site owner is being asked to delete it.
		 *
		 * They are trashed, not force-deleted. The dashboard's own JavaScript
		 * passes force=true and removes the post outright; an agent acting
		 * unattended should leave a way back, and the task's completion check
		 * passes either way because it looks for a published post.
		 *
		 * confirm_only keeps them out of next-mode, so a daily unattended run
		 * never deletes anything: they can only be applied by naming the
		 * provider explicitly.
		 */
		'hello-world'                               => [
			'delete'       => 'post',
			'confirm_only' => true,
			'summary'      => 'Move the default "Hello world!" post to the trash.',
		],
		'sample-page'                               => [
			'delete'       => 'page',
			'confirm_only' => true,
			'summary'      => 'Move the default "Sample Page" to the trash.',
		],

		'aioseo-media-pages'                        => [
			'seo'     => 'aioseo',
			// Attachment redirection lives under dynamicOptions, not options, and
			// takes the destination as a string rather than a boolean.
			'root'    => 'dynamicOptions',
			'path'    => [ 'searchAppearance', 'postTypes', 'attachment', 'redirectAttachmentUrls' ],
			'value'   => 'attachment',
			'summary' => 'Redirect attachment URLs in All in One SEO.',
		],
	];

	/**
	 * Whether a provider has a fix an agent may apply.
	 *
	 * @param string $provider_id The provider ID.
	 *
	 * @return bool
	 */
	public static function has_fix( $provider_id ) {
		return isset( self::FIXES[ $provider_id ] );
	}

	/**
	 * Get the provider IDs that can be fixed.
	 *
	 * @return array<int, string>
	 */
	public static function fixable_providers() {
		return \array_keys( self::FIXES );
	}

	/**
	 * Get the fix definition for a provider.
	 *
	 * @param string $provider_id The provider ID.
	 *
	 * @return array<string, mixed>|null
	 */
	public static function get( $provider_id ) {
		return self::FIXES[ $provider_id ] ?? null;
	}

	/**
	 * Whether the fix needs a value from the caller.
	 *
	 * @param string $provider_id The provider ID.
	 *
	 * @return bool
	 */
	public static function needs_value( $provider_id ) {
		$fix = self::get( $provider_id );

		return null !== $fix && isset( $fix['input'] );
	}

	/**
	 * Apply a fix.
	 *
	 * Writes exactly one option. The option name comes from the table above and
	 * never from caller input, so there is no path from an ability argument to an
	 * arbitrary option name.
	 *
	 * @param string $provider_id The provider ID.
	 * @param mixed  $value       The value supplied by the caller, if any.
	 *
	 * @return true|\WP_Error
	 */
	public static function apply( $provider_id, $value = null ) {
		$fix = self::get( $provider_id );

		if ( null === $fix ) {
			return new \WP_Error(
				'progress_planner_not_fixable',
				\__( 'This recommendation cannot be applied automatically.', 'progress-planner' )
			);
		}

		if ( isset( $fix['page_type'] ) ) {
			return self::apply_page_type( $fix, $value );
		}

		if ( isset( $fix['delete'] ) ) {
			return self::apply_deletion( $provider_id );
		}

		if ( isset( $fix['seo'] ) ) {
			return self::apply_seo_setting( $fix );
		}

		if ( isset( $fix['input'] ) ) {
			$validated = self::validate( $fix['type'], $value );

			if ( \is_wp_error( $validated ) ) {
				return $validated;
			}

			$new_value = $validated;
		} else {
			$new_value = $fix['value'];
		}

		\update_option( $fix['option'], $new_value );

		return true;
	}

	/**
	 * Record which page serves a given role.
	 *
	 * The page type comes from the table; only the page ID comes from the
	 * caller, and it is checked before anything is written: it must name a post
	 * that exists, is published, and is of a post type the site treats as a
	 * page. An ID that does not pass is an error rather than a silent no-op,
	 * because "we recorded your About page" is worth being true.
	 *
	 * @param array<string, mixed> $fix   The fix definition.
	 * @param mixed                $value The page ID supplied by the caller.
	 *
	 * @return true|\WP_Error
	 */
	private static function apply_page_type( array $fix, $value ) {
		$page_id = \is_numeric( $value ) ? (int) $value : 0;

		if ( 1 > $page_id ) {
			return new \WP_Error(
				'progress_planner_missing_page_id',
				\__( 'This recommendation needs the ID of the page that serves this role.', 'progress-planner' )
			);
		}

		$page = \get_post( $page_id );

		if ( ! $page ) {
			return new \WP_Error(
				'progress_planner_no_such_page',
				\__( 'There is no page with that ID.', 'progress-planner' )
			);
		}

		if ( 'publish' !== $page->post_status ) {
			return new \WP_Error(
				'progress_planner_page_not_published',
				\__( 'That page is not published, so it cannot serve this role yet.', 'progress-planner' )
			);
		}

		if ( ! \in_array( $page->post_type, self::page_post_types(), true ) ) {
			return new \WP_Error(
				'progress_planner_not_a_page',
				\__( 'That post is not a page.', 'progress-planner' )
			);
		}

		\progress_planner()->get_admin__page_settings()->set_page_values(
			[
				(string) $fix['page_type'] => [
					'id'        => $page_id,
					'have_page' => 'yes',
				],
			]
		);

		return true;
	}

	/**
	 * The post types that can serve a page role.
	 *
	 * Hierarchical public post types, which is what WordPress means by a page,
	 * rather than a hardcoded 'page' -- a site may serve these roles from a
	 * custom post type.
	 *
	 * @return array<int, string>
	 */
	private static function page_post_types() {
		$types = \get_post_types(
			[
				'public'       => true,
				'hierarchical' => true,
			]
		);

		return \array_values( $types );
	}

	/**
	 * Move a placeholder post to the trash.
	 *
	 * The post ID comes from the provider's own data collector, which resolves
	 * WordPress's default content by slug. Nothing here takes an ID from the
	 * caller, so an ability argument cannot point this at arbitrary content.
	 *
	 * @param string $provider_id The provider ID.
	 *
	 * @return true|\WP_Error
	 */
	private static function apply_deletion( $provider_id ) {
		$provider = \progress_planner()->get_suggested_tasks()->get_tasks_manager()->get_task_provider( $provider_id );

		if ( ! $provider || ! \method_exists( $provider, 'get_data_collector' ) ) {
			return new \WP_Error(
				'progress_planner_no_target',
				\__( 'That recommendation is not available on this site.', 'progress-planner' )
			);
		}

		$post_id = (int) $provider->get_data_collector()->collect();

		if ( ! $post_id || ! \get_post( $post_id ) ) {
			return new \WP_Error(
				'progress_planner_no_target',
				\__( 'The default content this recommendation refers to is no longer there.', 'progress-planner' )
			);
		}

		if ( ! \wp_trash_post( $post_id ) ) {
			return new \WP_Error(
				'progress_planner_delete_failed',
				\__( 'The content could not be moved to the trash.', 'progress-planner' )
			);
		}

		return true;
	}

	/**
	 * Whether applying a fix removes content rather than changing a setting.
	 *
	 * Drives the destructive annotation, which is what a client shows a person
	 * before calling.
	 *
	 * @param string $provider_id The provider ID.
	 *
	 * @return bool
	 */
	public static function is_destructive( $provider_id ) {
		$fix = self::get( $provider_id );

		return null !== $fix && isset( $fix['delete'] );
	}

	/**
	 * Whether a fix may only be applied by naming its provider explicitly.
	 *
	 * Keeps anything that removes content out of an unattended run.
	 *
	 * @param string $provider_id The provider ID.
	 *
	 * @return bool
	 */
	public static function is_confirm_only( $provider_id ) {
		$fix = self::get( $provider_id );

		return null !== $fix && ! empty( $fix['confirm_only'] );
	}

	/**
	 * Apply a setting owned by an SEO plugin.
	 *
	 * The setting name and value both come from the table above, never from
	 * caller input, so the only thing an ability argument can influence is which
	 * vetted entry runs.
	 *
	 * @param array<string, mixed> $fix The fix definition.
	 *
	 * @return true|\WP_Error
	 */
	private static function apply_seo_setting( array $fix ) {
		if ( 'yoast' === $fix['seo'] ) {
			if ( ! \class_exists( '\WPSEO_Options' ) ) {
				return new \WP_Error(
					'progress_planner_seo_plugin_inactive',
					\__( 'Yoast SEO is not active on this site.', 'progress-planner' )
				);
			}

			\WPSEO_Options::set( $fix['setting'], $fix['value'] );

			return true;
		}

		if ( ! \function_exists( 'aioseo' ) ) {
			return new \WP_Error(
				'progress_planner_seo_plugin_inactive',
				\__( 'All in One SEO is not active on this site.', 'progress-planner' )
			);
		}

		$root = \aioseo()->{$fix['root']};
		$path = $fix['path'];
		$last = \array_pop( $path );

		foreach ( $path as $step ) {
			if ( ! isset( $root->$step ) ) {
				return new \WP_Error(
					'progress_planner_seo_setting_missing',
					\__( 'That All in One SEO setting is not available in this version.', 'progress-planner' )
				);
			}

			$root = $root->$step;
		}

		$root->$last = $fix['value'];

		\aioseo()->options->save(); // @phpstan-ignore-line property.nonObject

		return true;
	}

	/**
	 * Validate a caller-supplied value.
	 *
	 * @param string $type  The declared type.
	 * @param mixed  $value The value.
	 *
	 * @return string|\WP_Error
	 */
	private static function validate( $type, $value ) {
		if ( ! \is_string( $value ) || '' === \trim( $value ) ) {
			return new \WP_Error(
				'progress_planner_missing_value',
				\__( 'This recommendation needs a value.', 'progress-planner' )
			);
		}

		$value = \sanitize_text_field( $value );

		if ( 'timezone' === $type && ! \in_array( $value, \timezone_identifiers_list(), true ) ) {
			return new \WP_Error(
				'progress_planner_invalid_timezone',
				\__( 'That is not a valid timezone identifier, for example "Europe/Amsterdam".', 'progress-planner' )
			);
		}

		return $value;
	}
}
