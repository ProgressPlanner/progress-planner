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
		'core-blogdescription'       => [
			'option'  => 'blogdescription',
			'input'   => 'value',
			'type'    => 'string',
			'summary' => 'Set the site tagline.',
		],
		'select-timezone'            => [
			'option'  => 'timezone_string',
			'input'   => 'value',
			'type'    => 'timezone',
			'summary' => 'Set the site timezone.',
		],
		'set-date-format'            => [
			'option'  => 'date_format',
			'input'   => 'value',
			'type'    => 'string',
			'summary' => 'Set the date format.',
		],
		'search-engine-visibility'   => [
			'option'  => 'blog_public',
			'value'   => '1',
			'type'    => 'string',
			'summary' => 'Allow search engines to index the site.',
		],
		'disable-comments'           => [
			'option'  => 'default_comment_status',
			'value'   => 'closed',
			'type'    => 'string',
			'summary' => 'Close comments on new content by default.',
		],
		'disable-comment-pagination' => [
			'option'  => 'page_comments',
			'value'   => '',
			'type'    => 'string',
			'summary' => 'Turn off comment pagination.',
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
