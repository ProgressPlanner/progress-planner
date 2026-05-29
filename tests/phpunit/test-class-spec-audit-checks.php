<?php
/**
 * Unit tests for the deterministic spec-audit checks.
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Suggested_Tasks\Audit\Checks\Doctype_Check;
use Progress_Planner\Suggested_Tasks\Audit\Checks\Lang_Attribute_Check;
use Progress_Planner\Suggested_Tasks\Audit\Checks\Charset_Check;

/**
 * Class Spec_Audit_Checks_Test.
 */
class Spec_Audit_Checks_Test extends \WP_UnitTestCase {

	/**
	 * A well-formed HTML document that should pass the HTML-content checks.
	 *
	 * @var string
	 */
	private const GOOD_HTML = '<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Test</title></head><body>Hi</body></html>';

	/**
	 * Test the doctype check passes on a valid doctype and fails without one.
	 *
	 * @return void
	 */
	public function test_doctype_check() {
		$check = new Doctype_Check();

		$pass = $check->run( 'https://example.com', self::GOOD_HTML, [] );
		$this->assertSame( 'html-doctype', $pass['rule_id'] );
		$this->assertSame( 'pass', $pass['status'] );

		$fail = $check->run( 'https://example.com', '<html><head></head><body>No doctype</body></html>', [] );
		$this->assertSame( 'fail', $fail['status'] );
	}

	/**
	 * Test that an empty body yields no finding (can't determine).
	 *
	 * @return void
	 */
	public function test_doctype_check_empty_html_returns_no_finding() {
		$check = new Doctype_Check();
		$this->assertSame( [], $check->run( 'https://example.com', '', [] ) );
	}

	/**
	 * Test the lang-attribute check.
	 *
	 * @return void
	 */
	public function test_lang_attribute_check() {
		$check = new Lang_Attribute_Check();

		$pass = $check->run( 'https://example.com', self::GOOD_HTML, [] );
		$this->assertSame( 'pass', $pass['status'] );

		$fail = $check->run( 'https://example.com', '<!doctype html><html><head></head><body></body></html>', [] );
		$this->assertSame( 'fail', $fail['status'] );
	}

	/**
	 * Test the charset check passes via meta tag and via header.
	 *
	 * @return void
	 */
	public function test_charset_check() {
		$check = new Charset_Check();

		// Passes via meta tag.
		$pass = $check->run( 'https://example.com', self::GOOD_HTML, [] );
		$this->assertSame( 'pass', $pass['status'] );

		// Fails when neither meta tag nor header declares utf-8.
		$fail = $check->run( 'https://example.com', '<!doctype html><html lang="en"><head></head><body></body></html>', [ 'headers' => [] ] );
		$this->assertSame( 'fail', $fail['status'] );

		// Passes via Content-Type header even when no meta tag is present.
		$header_pass = $check->run(
			'https://example.com',
			'<!doctype html><html lang="en"><head></head><body></body></html>',
			[ 'headers' => [ 'content-type' => 'text/html; charset=UTF-8' ] ]
		);
		$this->assertSame( 'pass', $header_pass['status'] );
	}
}
