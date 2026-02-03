<?php
/**
 * AIOSEO options data collector.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Data_Collector;

/**
 * AIOSEO options data collector class.
 *
 * Returns AIOSEO options for React task evaluation.
 */
class AIOSEO_Options extends Base_Data_Collector {

	/**
	 * The data key.
	 *
	 * @var string
	 */
	protected const DATA_KEY = 'aioseo_options';

	/**
	 * Initialize the data collector.
	 *
	 * @return void
	 */
	public function init() {
		// Update cache when AIOSEO options change.
		\add_action( 'update_option_aioseo_options', [ $this, 'update_cache' ] );
		\add_action( 'update_option_aioseo_options_dynamic', [ $this, 'update_cache' ] );
	}

	/**
	 * Calculate the AIOSEO options data.
	 *
	 * @return array<string, mixed>|null AIOSEO options or null if AIOSEO is not active.
	 */
	protected function calculate_data() {
		// Return null if AIOSEO is not active.
		if ( ! \function_exists( 'aioseo' ) ) {
			return null;
		}

		return [
			'schema'       => $this->get_schema_options(),
			'archives'     => $this->get_archives_options(),
			'attachment'   => $this->get_attachment_options(),
			'crawlCleanup' => $this->get_crawl_cleanup_options(),
		];
	}

	/**
	 * Get schema options.
	 *
	 * @return array Schema options.
	 */
	private function get_schema_options(): array {
		$schema = \aioseo()->options->searchAppearance->global->schema; // @phpstan-ignore-line

		// phpcs:disable WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase -- AIOSEO uses camelCase.
		return [
			'siteRepresents'   => $schema->siteRepresents ?? 'organization', // @phpstan-ignore-line
			'organizationLogo' => $schema->organizationLogo ?? '', // @phpstan-ignore-line
			'personLogo'       => $schema->personLogo ?? '', // @phpstan-ignore-line
		];
		// phpcs:enable
	}

	/**
	 * Get archives options.
	 *
	 * @return array Archives options.
	 */
	private function get_archives_options(): array {
		$archives = \aioseo()->options->searchAppearance->archives; // @phpstan-ignore-line

		return [
			'author' => [
				'show' => $archives->author->show ?? true, // @phpstan-ignore-line
			],
			'date'   => [
				'show' => $archives->date->show ?? true, // @phpstan-ignore-line
			],
		];
	}

	/**
	 * Get attachment/media options.
	 *
	 * @return array Attachment options.
	 */
	private function get_attachment_options(): array {
		$attachment = \aioseo()->dynamicOptions->searchAppearance->postTypes->attachment; // @phpstan-ignore-line

		// phpcs:disable WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase -- AIOSEO uses camelCase.
		return [
			'redirectAttachmentUrls' => $attachment->redirectAttachmentUrls ?? 'disabled', // @phpstan-ignore-line
		];
		// phpcs:enable
	}

	/**
	 * Get crawl cleanup options.
	 *
	 * @return array Crawl cleanup options.
	 */
	private function get_crawl_cleanup_options(): array {
		$feeds = \aioseo()->options->searchAppearance->advanced->crawlCleanup->feeds; // @phpstan-ignore-line

		// phpcs:disable WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase -- AIOSEO uses camelCase.
		return [
			'feeds' => [
				'authors'        => $feeds->authors ?? true, // @phpstan-ignore-line
				'globalComments' => $feeds->globalComments ?? true, // @phpstan-ignore-line
				'postComments'   => $feeds->postComments ?? true, // @phpstan-ignore-line
			],
		];
		// phpcs:enable
	}
}
