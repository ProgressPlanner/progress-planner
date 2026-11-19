<?php
/**
 * Tests for the TranslationsPress language packs.
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Translations;

/**
 * Test that language packs are offered to WordPress as translation updates.
 */
class Translations_Test extends \WP_UnitTestCase {

	/**
	 * The feed URL.
	 *
	 * @var string
	 */
	const FEED_URL = Translations::PACKAGES_BASE_URL . 'packages.json';

	/**
	 * The number of requests made to the feed.
	 *
	 * @var int
	 */
	private $requests = 0;

	/**
	 * The mocked feed response.
	 *
	 * @var array<string, mixed>|\WP_Error
	 */
	private $response;

	/**
	 * Set up.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();
		$this->requests = 0;
		$this->response = $this->feed_response(
			[
				$this->pack( 'nl_NL' ),
				$this->pack( 'de_DE' ),
			]
		);
		\delete_site_transient( Translations::CACHE_KEY );
		\add_filter( 'pre_http_request', [ $this, 'mock_feed' ], 10, 3 );
		\add_filter( 'get_available_languages', [ $this, 'available_languages' ] );
	}

	/**
	 * Tear down.
	 *
	 * @return void
	 */
	public function tearDown(): void {
		\remove_filter( 'pre_http_request', [ $this, 'mock_feed' ], 10 );
		\remove_filter( 'get_available_languages', [ $this, 'available_languages' ] );
		\delete_site_transient( Translations::CACHE_KEY );
		parent::tearDown();
	}

	/**
	 * Mock the feed request.
	 *
	 * @param mixed                $preempt The preempted response.
	 * @param array<string, mixed> $args    The request arguments.
	 * @param string               $url     The request URL.
	 *
	 * @return mixed
	 */
	public function mock_feed( $preempt, $args, $url ) {
		if ( self::FEED_URL !== $url ) {
			return $preempt;
		}
		++$this->requests;
		return $this->response;
	}

	/**
	 * Pretend Dutch is the only extra language installed on the site.
	 *
	 * @return string[]
	 */
	public function available_languages() {
		return [ 'nl_NL' ];
	}

	/**
	 * Build a language pack entry as the feed returns it.
	 *
	 * @param string $locale  The locale.
	 * @param string $package The package URL. Defaults to a valid one.
	 *
	 * @return array<string, mixed>
	 */
	private function pack( $locale, $package = '' ) {
		return [
			'language' => $locale,
			'version'  => '1.9.1',
			'updated'  => '2026-02-20T09:28:05+00:00',
			'package'  => '' !== $package ? $package : Translations::PACKAGES_BASE_URL . 'progress-planner-' . $locale . '.zip',
		];
	}

	/**
	 * Build a successful feed response.
	 *
	 * @param array<int, mixed> $translations The language packs.
	 *
	 * @return array<string, mixed>
	 */
	private function feed_response( $translations ) {
		return [
			'response' => [ 'code' => 200 ],
			'body'     => \wp_json_encode( [ 'translations' => $translations ] ),
		];
	}

	/**
	 * Get an instance that reports the given installed translation date.
	 *
	 * @param string $installed_date The installed revision date, or '' for none.
	 *
	 * @return Translations
	 */
	private function instance( $installed_date = '' ) {
		return new class( $installed_date ) extends Translations {

			/**
			 * The installed revision date.
			 *
			 * @var string
			 */
			private $installed_date;

			/**
			 * Constructor. Skips the hooks.
			 *
			 * @param string $installed_date The installed revision date.
			 */
			public function __construct( $installed_date ) {
				$this->installed_date = $installed_date;
			}

			/**
			 * Get the installed revision date.
			 *
			 * @param string $locale The locale.
			 *
			 * @return string
			 */
			protected function get_installed_date( $locale ) { // phpcs:ignore Generic.CodeAnalysis.UnusedFunctionParameter.Found
				return $this->installed_date;
			}
		};
	}

	/**
	 * Get our translation updates from a transient value.
	 *
	 * @param object $transient The transient value.
	 *
	 * @return array<int, array<string, mixed>>
	 */
	private function our_updates( $transient ) {
		return \array_values(
			\array_filter(
				(array) ( $transient->translations ?? [] ),
				static function ( $translation ) {
					return Translations::SLUG === ( (array) $translation )['slug'];
				}
			)
		);
	}

	/**
	 * The plugin registers the filter when it boots.
	 *
	 * @return void
	 */
	public function test_filter_is_registered() {
		$this->assertNotFalse(
			\has_filter( 'pre_set_site_transient_update_plugins', [ \progress_planner()->get_translations(), 'add_translation_updates' ] )
		);
	}

	/**
	 * A language pack is offered for an installed language that has no translation yet.
	 *
	 * @return void
	 */
	public function test_offers_pack_for_installed_language() {
		$updates = $this->our_updates( $this->instance()->add_translation_updates( new \stdClass() ) );

		$this->assertCount( 1, $updates, 'Only the installed language gets a pack; de_DE is not installed.' );
		$this->assertSame(
			[
				'type'       => 'plugin',
				'slug'       => 'progress-planner',
				'language'   => 'nl_NL',
				'version'    => '1.9.1',
				'updated'    => '2026-02-20T09:28:05+00:00',
				'package'    => Translations::PACKAGES_BASE_URL . 'progress-planner-nl_NL.zip',
				'autoupdate' => true,
			],
			$updates[0]
		);
	}

	/**
	 * A pack is only offered when it is newer than the installed translation.
	 *
	 * @dataProvider installed_dates
	 *
	 * @param string $installed_date The installed revision date.
	 * @param int    $expected       The expected number of updates.
	 *
	 * @return void
	 */
	public function test_compares_with_installed_translation( $installed_date, $expected ) {
		$this->assertCount(
			$expected,
			$this->our_updates( $this->instance( $installed_date )->add_translation_updates( new \stdClass() ) )
		);
	}

	/**
	 * Installed revision dates, in the format of a PO file header.
	 *
	 * @return array<string, array{string, int}>
	 */
	public function installed_dates() {
		return [
			'older'      => [ '2025-11-01 10:00:00+0000', 1 ],
			'same'       => [ '2026-02-20 09:28:05+0000', 0 ],
			'newer'      => [ '2026-03-01 10:00:00+0000', 0 ],
			'unparsable' => [ 'not a date', 1 ],
		];
	}

	/**
	 * Other translation updates are kept, and running twice adds no duplicate.
	 *
	 * @return void
	 */
	public function test_keeps_other_updates_and_replaces_its_own() {
		$transient               = new \stdClass();
		$transient->translations = [
			[
				'type'     => 'plugin',
				'slug'     => 'akismet',
				'language' => 'nl_NL',
				'package'  => 'https://downloads.wordpress.org/translation/plugin/akismet/5.0/nl_NL.zip',
			],
			[
				'type'     => 'plugin',
				'slug'     => 'progress-planner',
				'language' => 'nl_NL',
				'package'  => 'https://downloads.wordpress.org/translation/plugin/progress-planner/1.8.0/nl_NL.zip',
			],
		];

		$instance  = $this->instance();
		$transient = $instance->add_translation_updates( $instance->add_translation_updates( $transient ) );

		$this->assertCount( 2, $transient->translations );
		$this->assertSame( 'akismet', $transient->translations[0]['slug'] );

		$ours = $this->our_updates( $transient );
		$this->assertCount( 1, $ours );
		$this->assertSame( Translations::PACKAGES_BASE_URL . 'progress-planner-nl_NL.zip', $ours[0]['package'] );
	}

	/**
	 * Packs hosted anywhere but our TranslationsPress project are ignored.
	 *
	 * @return void
	 */
	public function test_ignores_packages_from_other_hosts() {
		$this->response = $this->feed_response(
			[
				$this->pack( 'nl_NL', 'https://example.org/progress-planner-nl_NL.zip' ),
				'not an array',
				[ 'language' => 'nl_NL' ],
			]
		);

		$this->assertSame( [], $this->instance()->get_packs() );
		$this->assertSame( [], $this->our_updates( $this->instance()->add_translation_updates( new \stdClass() ) ) );
	}

	/**
	 * The feed is cached, and so is a failure.
	 *
	 * @dataProvider responses
	 *
	 * @param string $type     The response type.
	 * @param int    $expected The expected number of packs.
	 *
	 * @return void
	 */
	public function test_feed_is_cached( $type, $expected ) {
		if ( 'transport' === $type ) {
			$this->response = new \WP_Error( 'http_request_failed', 'Connection timed out.' );
		} elseif ( 'http' === $type ) {
			$this->response = [
				'response' => [ 'code' => 503 ],
				'body'     => 'Service unavailable',
			];
		} elseif ( 'garbage' === $type ) {
			$this->response = [
				'response' => [ 'code' => 200 ],
				'body'     => '<html>',
			];
		}

		$instance = $this->instance();
		$this->assertCount( $expected, $instance->get_packs() );
		$this->assertCount( $expected, $instance->get_packs() );
		$this->assertSame( 1, $this->requests );
	}

	/**
	 * Feed response types.
	 *
	 * @return array<string, array{string, int}>
	 */
	public function responses() {
		return [
			'success'         => [ 'success', 2 ],
			'transport error' => [ 'transport', 0 ],
			'http error'      => [ 'http', 0 ],
			'invalid body'    => [ 'garbage', 0 ],
		];
	}

	/**
	 * A value that is not update data is returned untouched, without a request.
	 *
	 * @return void
	 */
	public function test_ignores_non_object_transient() {
		$this->assertFalse( $this->instance()->add_translation_updates( false ) );
		$this->assertSame( 0, $this->requests );
	}
}
