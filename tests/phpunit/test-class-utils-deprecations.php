<?php
/**
 * Unit tests for Deprecations utility class.
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

use WP_UnitTestCase;
use Progress_Planner\Utils\Deprecations;

/**
 * Utils_Deprecations test case.
 *
 * Tests the Deprecations utility class that maintains mappings
 * of deprecated classes and methods to their new locations.
 */
class Utils_Deprecations_Test extends WP_UnitTestCase {

	/**
	 * Test CLASSES constant exists and is an array.
	 *
	 * @return void
	 */
	public function test_classes_constant_exists() {
		$this->assertTrue( \defined( 'Progress_Planner\Utils\Deprecations::CLASSES' ), 'CLASSES constant should exist' );
		$this->assertIsArray( Deprecations::CLASSES, 'CLASSES should be an array' );
	}

	/**
	 * Test BASE_METHODS constant exists and is an array.
	 *
	 * @return void
	 */
	public function test_base_methods_constant_exists() {
		$this->assertTrue( \defined( 'Progress_Planner\Utils\Deprecations::BASE_METHODS' ), 'BASE_METHODS constant should exist' );
		$this->assertIsArray( Deprecations::BASE_METHODS, 'BASE_METHODS should be an array' );
	}

	/**
	 * Test CLASSES deprecation mappings have correct structure.
	 *
	 * @return void
	 */
	public function test_classes_structure() {
		$this->assertNotEmpty( Deprecations::CLASSES, 'CLASSES should not be empty' );

		foreach ( Deprecations::CLASSES as $old_class => $mapping ) {
			$this->assertIsString( $old_class, 'Old class name should be a string' );
			$this->assertIsArray( $mapping, 'Mapping should be an array' );
			$this->assertCount( 2, $mapping, 'Mapping should have exactly 2 elements' );
			$this->assertIsString( $mapping[0], 'New class name should be a string' );
			$this->assertIsString( $mapping[1], 'Version should be a string' );
		}
	}

	/**
	 * Test BASE_METHODS deprecation mappings have correct structure.
	 *
	 * @return void
	 */
	public function test_base_methods_structure() {
		$this->assertNotEmpty( Deprecations::BASE_METHODS, 'BASE_METHODS should not be empty' );

		foreach ( Deprecations::BASE_METHODS as $old_method => $mapping ) {
			$this->assertIsString( $old_method, 'Old method name should be a string' );
			$this->assertIsArray( $mapping, 'Mapping should be an array' );
			$this->assertCount( 2, $mapping, 'Mapping should have exactly 2 elements' );
			$this->assertIsString( $mapping[0], 'New method name should be a string' );
			$this->assertIsString( $mapping[1], 'Version should be a string' );
		}
	}

	/**
	 * Test specific known deprecations exist.
	 *
	 * @return void
	 */
	public function test_specific_known_deprecations() {
		// Test a known class deprecation.
		$this->assertArrayHasKey( 'Progress_Planner\Cache', Deprecations::CLASSES, 'Progress_Planner\Cache should be deprecated' );
		$this->assertEquals( 'Progress_Planner\Utils\Cache', Deprecations::CLASSES['Progress_Planner\Cache'][0], 'Cache should map to Utils\Cache' );

		// Test a known method deprecation.
		$this->assertArrayHasKey( 'get_cache', Deprecations::BASE_METHODS, 'get_cache method should be deprecated' );
		$this->assertEquals( 'get_utils__cache', Deprecations::BASE_METHODS['get_cache'][0], 'get_cache should map to get_utils__cache' );
	}

	/**
	 * Test version numbers are valid.
	 *
	 * @return void
	 */
	public function test_version_numbers_valid() {
		foreach ( Deprecations::CLASSES as $old_class => $mapping ) {
			$version = $mapping[1];
			$this->assertMatchesRegularExpression( '/^\d+\.\d+\.\d+$/', $version, "Version $version for class $old_class should be in X.Y.Z format" );
		}

		foreach ( Deprecations::BASE_METHODS as $old_method => $mapping ) {
			$version = $mapping[1];
			$this->assertMatchesRegularExpression( '/^\d+\.\d+\.\d+$/', $version, "Version $version for method $old_method should be in X.Y.Z format" );
		}
	}

	/**
	 * Test no duplicate keys in mappings.
	 *
	 * @return void
	 */
	public function test_no_duplicate_keys() {
		$class_keys  = \array_keys( Deprecations::CLASSES );
		$method_keys = \array_keys( Deprecations::BASE_METHODS );

		$this->assertCount( \count( $class_keys ), \array_unique( $class_keys ), 'CLASSES should have no duplicate keys' );
		$this->assertCount( \count( $method_keys ), \array_unique( $method_keys ), 'BASE_METHODS should have no duplicate keys' );
	}

	/**
	 * Test new class names use proper namespaces.
	 *
	 * @return void
	 */
	public function test_new_classes_use_proper_namespaces() {
		foreach ( Deprecations::CLASSES as $old_class => $mapping ) {
			$new_class = $mapping[0];
			$this->assertStringStartsWith( 'Progress_Planner\\', $new_class, "New class $new_class should use Progress_Planner namespace" );
		}
	}
}
