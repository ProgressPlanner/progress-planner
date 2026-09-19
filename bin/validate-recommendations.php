<?php
/**
 * Validate recommendation files.
 *
 * These ship to customer sites and are read by a model, so a malformed one is
 * not a build error anyone sees -- it is a rule that quietly does nothing, or
 * worse, one whose Goal says something different from what its frontmatter
 * claims.
 *
 * Deliberately NOT checked: the vocabulary used in `applies_when` and
 * `target.find`. Those are read by the model, not by an interpreter, so a rule
 * is free to invent a key. Constraining them here would reintroduce exactly the
 * coupling the format exists to avoid.
 *
 * Usage: php bin/validate-recommendations.php [directory]
 *
 * @package Progress_Planner
 */

declare( strict_types = 1 );

// Namespaced so the constants and helpers below are not global: this is a CLI
// script, but it still lives in the plugin tree and is linted with everything else.
namespace Progress_Planner\Bin\Validate_Recommendations;

const SECTIONS = [ 'Why it matters', 'Goal', 'How to verify', 'Hints', 'Out of bounds' ];

const REQUIRED = [
	'id',
	'title',
	'category',
	'points',
	'capability',
	'repeats',
	'per_item',
	'reversible',
	'verified_by',
	'needs_confirmation',
];

const ENUMS = [
	'category'           => [ 'seo', 'content', 'configuration', 'maintenance' ],
	'repeats'            => [ 'never', 'weekly' ],
	'verified_by'        => [ 'site_state', 'owner_confirmation' ],
	'per_item'           => [ 'true', 'false' ],
	'reversible'         => [ 'true', 'false' ],
	'needs_confirmation' => [ 'true', 'false' ],
];

/**
 * Read the top-level `key: value` pairs, ignoring nested blocks and comments.
 *
 * Deliberately not a YAML parser: only the flat scalars are validated, and
 * pulling in a dependency to read ten keys would cost more than it returns.
 *
 * @param string $frontmatter The raw frontmatter.
 *
 * @return array<string, string>
 */
function scalars( string $frontmatter ): array {
	$out = [];

	foreach ( explode( "\n", $frontmatter ) as $line ) {
		if ( '' === $line || ' ' === $line[0] || "\t" === $line[0] || '#' === $line[0] ) {
			continue;
		}

		if ( preg_match( '/^([a-z_]+):\s*(.*)$/', $line, $m ) ) {
			$out[ $m[1] ] = trim( $m[2] );
		}
	}

	return $out;
}

/**
 * Check one file.
 *
 * @param string $path The file path.
 *
 * @return array<int, string> Problems found.
 */
function check( string $path ): array {
	$raw    = (string) file_get_contents( $path );
	$name   = basename( $path, '.md' );
	$errors = [];

	if ( 0 !== strpos( $raw, "---\n" ) ) {
		return [ 'no frontmatter' ];
	}

	$parts = explode( "\n---\n", substr( $raw, 4 ), 2 );

	if ( 2 !== count( $parts ) ) {
		return [ 'frontmatter is not closed' ];
	}

	[ $frontmatter, $body ] = $parts;

	$fm = scalars( $frontmatter );

	foreach ( REQUIRED as $key ) {
		if ( ! isset( $fm[ $key ] ) ) {
			$errors[] = "missing `{$key}`";
		}
	}

	foreach ( ENUMS as $key => $allowed ) {
		if ( isset( $fm[ $key ] ) && ! in_array( $fm[ $key ], $allowed, true ) ) {
			$errors[] = "`{$key}: {$fm[$key]}` is not one of " . implode( ', ', $allowed );
		}
	}

	// The id is the completion key, so a mismatch with the filename means a
	// rule completes under a name nothing else refers to.
	if ( isset( $fm['id'] ) && $fm['id'] !== $name ) {
		$errors[] = "id `{$fm['id']}` does not match filename `{$name}`";
	}

	preg_match_all( '/^## (.+)$/m', $body, $found );

	if ( $found[1] !== SECTIONS ) {
		$errors[] = 'sections are [' . implode( ', ', $found[1] ) . '], expected [' . implode( ', ', SECTIONS ) . ']';
	}

	foreach ( SECTIONS as $section ) {
		$pattern = '/^## ' . preg_quote( $section, '/' ) . '$\n(.*?)(?=^## |\z)/ms';

		if ( preg_match( $pattern, $body, $m ) && '' === trim( $m[1] ) ) {
			$errors[] = "`{$section}` is empty";
		}
	}

	// A per-item rule without a target produces no tasks at all; a target on a
	// rule that is not per-item means one of the two was edited alone.
	$per_item   = isset( $fm['per_item'] ) && 'true' === $fm['per_item'];
	$has_target = 1 === preg_match( '/^target:/m', $frontmatter );

	if ( $per_item && ! $has_target ) {
		$errors[] = 'per_item is true but there is no `target:` block';
	}

	if ( $has_target && ! $per_item ) {
		$errors[] = '`target:` block present but per_item is not true';
	}

	if ( $per_item && $has_target ) {
		if ( ! preg_match( '/^\s+identified_by:/m', $frontmatter ) ) {
			$errors[] = '`target:` has no `identified_by`';
		}

		// A template whose title does not vary produces identical rows.
		if ( false === strpos( $fm['title'] ?? '', '{' ) ) {
			$errors[] = 'per_item title has no {placeholder}';
		}
	}

	// A rule the site cannot verify must say so, rather than describing a check
	// that does not exist. This is the one place prose and frontmatter can
	// disagree silently, so it is worth asserting they agree.
	if ( isset( $fm['verified_by'] ) && 'owner_confirmation' === $fm['verified_by'] ) {
		preg_match( '/^## How to verify$\n(.*?)(?=^## )/ms', $body, $m );

		if ( false === strpos( $m[1] ?? '', 'cannot be verified' ) ) {
			$errors[] = 'verified_by is owner_confirmation but `How to verify` does not say the goal cannot be verified by inspection';
		}
	}

	if ( false !== strpos( $raw, "\xE2\x80\x94" ) ) {
		$errors[] = 'contains an em-dash; use -- instead';
	}

	return $errors;
}

/**
 * Run the validator.
 *
 * Wrapped in a function so the script declares no globals, which is what the
 * project's coding standard expects of anything in the plugin tree.
 *
 * @param array<int, string> $args The CLI arguments.
 *
 * @return int Exit code.
 */
function run( array $args ): int {
	$directory = $args[1] ?? __DIR__ . '/../recommendations';

	if ( ! is_dir( $directory ) ) {
		fwrite( STDERR, "not a directory: {$directory}\n" );
		return 1;
	}

	$files = glob( rtrim( $directory, '/' ) . '/*.md' );

	if ( ! $files ) {
		fwrite( STDERR, "no recommendation files in {$directory}\n" );
		return 1;
	}

	sort( $files );

	$failed = 0;

	foreach ( $files as $file ) {
		$errors = check( $file );

		if ( $errors ) {
			++$failed;
			echo "\n" . basename( $file ) . "\n";

			foreach ( $errors as $error ) {
				echo "  {$error}\n";
			}
		}
	}

	echo "\n" . count( $files ) . ' files, ' . $failed . " with problems\n";

	return $failed > 0 ? 1 : 0;
}

exit( run( $argv ) );
