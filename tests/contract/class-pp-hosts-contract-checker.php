<?php
/**
 * Checks Progress Planner against the API surface pp-hosts depends on.
 *
 * The contract (pp-hosts-contract.json) is generated in the pp-hosts repo by
 * bin/build-pp-contract.php. It lists every hook, class, service getter,
 * constant, meta box and asset pp-hosts uses from Progress Planner. This class
 * verifies that the current Progress Planner code still provides all of them.
 *
 * It needs no WordPress and no database: classes are inspected via reflection
 * and hooks/assets via the source tree. Used by the PHPUnit test
 * tests/phpunit/test-pp-hosts-contract.php and the CLI script
 * tests/contract/check-pp-hosts-contract.php.
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

/**
 * PP_Hosts_Contract_Checker class.
 */
class PP_Hosts_Contract_Checker {

	/**
	 * Progress Planner root directory.
	 *
	 * @var string
	 */
	private $pp_dir;

	/**
	 * The decoded contract.
	 *
	 * @var array
	 */
	private $contract;

	/**
	 * Concatenated Progress Planner PHP source, used for string lookups.
	 *
	 * @var string|null
	 */
	private $source = null;

	/**
	 * Constructor.
	 *
	 * @param string $pp_dir        Progress Planner root directory.
	 * @param string $contract_file Path to the contract JSON file.
	 *
	 * @throws \RuntimeException If the contract can't be read.
	 */
	public function __construct( $pp_dir, $contract_file ) {
		$this->pp_dir = \rtrim( $pp_dir, '/' );

		// phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents -- Local file.
		$contract = \json_decode( (string) \file_get_contents( $contract_file ), true );
		if ( ! \is_array( $contract ) ) {
			throw new \RuntimeException( "Could not read contract file: {$contract_file}" ); // phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped -- CLI/test output.
		}
		$this->contract = $contract;
	}

	/**
	 * Failures matching an entry in the contract's known_issues.
	 *
	 * @var array<string, string> Failure message => reason.
	 */
	private $known = [];

	/**
	 * Run all checks.
	 *
	 * Failures that mention a key from the contract's `known_issues` map are
	 * not returned; they are available via get_known() instead, so already
	 * tracked breakage doesn't fail the build but stays visible.
	 *
	 * @return array<string, string[]> Failures grouped by section; empty sections are omitted.
	 */
	public function check() {
		$failures = [
			'hooks'      => $this->check_hooks(),
			'classes'    => $this->check_classes(),
			'services'   => $this->check_services(),
			'constants'  => $this->check_constants(),
			'meta_boxes' => $this->check_meta_boxes(),
			'assets'     => $this->check_assets(),
		];

		$this->known = [];
		$known       = $this->contract['known_issues'] ?? [];
		foreach ( $failures as $section => $messages ) {
			foreach ( $messages as $index => $message ) {
				foreach ( $known as $key => $reason ) {
					if ( false !== \strpos( $message, (string) $key ) ) {
						$this->known[ $message ] = $reason;
						unset( $failures[ $section ][ $index ] );
						break;
					}
				}
			}
			$failures[ $section ] = \array_values( $failures[ $section ] );
		}

		return \array_filter( $failures );
	}

	/**
	 * Known issues hit by the last check() run.
	 *
	 * @return array<string, string> Failure message => reason.
	 */
	public function get_known() {
		return $this->known;
	}

	/**
	 * Hooks pp-hosts listens to must still be fired by Progress Planner.
	 *
	 * @return string[]
	 */
	private function check_hooks() {
		$failures = [];
		foreach ( $this->contract['hooks']['listens'] ?? [] as $hook ) {
			$pattern = '/\b(?:do_action|do_action_ref_array|apply_filters|apply_filters_ref_array)\(\s*[\'"]' . \preg_quote( $hook, '/' ) . '[\'"]/';
			if ( ! \preg_match( $pattern, $this->get_source() ) ) {
				$failures[] = "Hook '{$hook}' is no longer fired (no do_action/apply_filters found).";
			}
		}
		return $failures;
	}

	/**
	 * Classes pp-hosts extends must keep the members pp-hosts overrides or uses.
	 *
	 * @return string[]
	 */
	private function check_classes() {
		$failures = [];
		foreach ( $this->contract['classes'] ?? [] as $consumer => $spec ) {
			$parent_name = $spec['extends'];
			if ( ! \class_exists( $parent_name ) && ! \interface_exists( $parent_name ) ) {
				$failures[] = "{$consumer}: parent class {$parent_name} no longer exists.";
				continue;
			}
			$parent = new \ReflectionClass( $parent_name );

			if ( $parent->isFinal() ) {
				$failures[] = "{$consumer}: parent class {$parent_name} is now final.";
			}

			foreach ( $spec['overrides'] ?? [] as $method => $signature ) {
				$failures = \array_merge( $failures, $this->check_override( $consumer, $parent, $method, $signature ) );
			}

			foreach ( $spec['calls'] ?? [] as $method ) {
				if ( ! $parent->hasMethod( $method ) ) {
					$failures[] = "{$consumer}: calls {$parent_name}::{$method}(), which no longer exists.";
				} elseif ( $parent->getMethod( $method )->isPrivate() ) {
					$failures[] = "{$consumer}: calls {$parent_name}::{$method}(), which is now private.";
				}
			}

			foreach ( $spec['properties'] ?? [] as $property => $visibility ) {
				if ( ! $parent->hasProperty( $property ) ) {
					$failures[] = "{$consumer}: relies on {$parent_name}::\${$property}, which no longer exists.";
					continue;
				}
				$parent_property = $parent->getProperty( $property );
				if ( $parent_property->isPrivate() ) {
					$failures[] = "{$consumer}: relies on {$parent_name}::\${$property}, which is now private.";
				} elseif ( $parent_property->isPublic() && \in_array( $visibility, [ 'protected', 'private' ], true ) ) {
					$failures[] = "{$consumer}: redeclares public {$parent_name}::\${$property} as {$visibility} (fatal).";
				}
			}

			foreach ( $spec['constants'] ?? [] as $constant ) {
				if ( ! $parent->hasConstant( $constant ) ) {
					$failures[] = "{$consumer}: relies on {$parent_name}::{$constant}, which no longer exists.";
				}
			}

			// A new abstract method in the parent makes concrete pp-hosts subclasses fatal.
			if ( empty( $spec['abstract'] ) ) {
				foreach ( $parent->getMethods( \ReflectionMethod::IS_ABSTRACT ) as $abstract_method ) {
					if ( ! \in_array( $abstract_method->getName(), $spec['chain_methods'] ?? [], true ) ) {
						$failures[] = "{$consumer}: does not implement new abstract method {$abstract_method->class}::{$abstract_method->getName()}().";
					}
				}
			}
		}
		return $failures;
	}

	/**
	 * Check that an overridden method is still compatible with its parent.
	 *
	 * @param string           $consumer     The pp-hosts class.
	 * @param \ReflectionClass $parent_class The Progress Planner parent class.
	 * @param string           $method       The method name.
	 * @param array            $signature    The pp-hosts signature: params, has_return_type, static.
	 *
	 * @return string[]
	 */
	private function check_override( $consumer, $parent_class, $method, $signature ) {
		$label = "{$consumer}::{$method}() overrides {$parent_class->getName()}::{$method}()";

		if ( ! $parent_class->hasMethod( $method ) ) {
			return [ "{$label}, which no longer exists (the override is now dead code)." ];
		}

		$parent_method = $parent_class->getMethod( $method );
		$failures      = [];

		if ( $parent_method->isFinal() ) {
			$failures[] = "{$label}, which is now final (fatal).";
		}
		if ( $parent_method->isPrivate() ) {
			$failures[] = "{$label}, which is now private.";
		}
		if ( $parent_method->isStatic() !== (bool) ( $signature['static'] ?? false ) ) {
			$failures[] = "{$label}, but static-ness differs (fatal).";
		}
		if ( $parent_method->getNumberOfParameters() > (int) $signature['params'] ) {
			$failures[] = "{$label}, which now takes {$parent_method->getNumberOfParameters()} parameter(s); pp-hosts accepts {$signature['params']} (fatal).";
		}
		if ( $parent_method->hasReturnType() && empty( $signature['has_return_type'] ) ) {
			$failures[] = "{$label}, which now declares a return type; pp-hosts does not (fatal).";
		}

		return $failures;
	}

	/**
	 * Service getters on progress_planner() and the methods called on them.
	 *
	 * @return string[]
	 */
	private function check_services() {
		$failures = [];
		$base     = new \ReflectionClass( 'Progress_Planner\Base' );

		if ( ! \preg_match( '/function progress_planner\(\)/', $this->get_source() ) ) {
			$failures[] = 'The progress_planner() function is no longer defined.';
		}

		foreach ( $this->contract['services'] ?? [] as $getter => $methods ) {
			// Real methods on Base (e.g. the_asset, get_file_version).
			if ( $base->hasMethod( $getter ) ) {
				continue;
			}

			$class_name = self::getter_to_class( $getter );
			if ( null === $class_name ) {
				$failures[] = "progress_planner()->{$getter}() no longer resolves to a class.";
				continue;
			}

			foreach ( $methods as $method ) {
				if ( ! \method_exists( $class_name, $method ) ) {
					$failures[] = "progress_planner()->{$getter}()->{$method}(): {$class_name}::{$method}() no longer exists.";
				} elseif ( ! ( new \ReflectionMethod( $class_name, $method ) )->isPublic() ) {
					$failures[] = "progress_planner()->{$getter}()->{$method}(): {$class_name}::{$method}() is no longer public.";
				}
			}
		}
		return $failures;
	}

	/**
	 * Resolve a magic getter name to a class, mirroring Base::__call().
	 *
	 * @param string $getter The getter, e.g. get_ui__branding.
	 *
	 * @return string|null
	 */
	public static function getter_to_class( $getter ) {
		$name       = \substr( $getter, 4 );
		$class_name = \implode( '\\', \explode( '__', $name ) );
		$class_name = 'Progress_Planner\\' . \implode( '_', \array_map( 'ucfirst', \explode( '_', $class_name ) ) );

		if ( \class_exists( $class_name ) ) {
			return ( new \ReflectionClass( $class_name ) )->getName();
		}

		$deprecations = \Progress_Planner\Utils\Deprecations::BASE_METHODS;
		if ( isset( $deprecations[ $getter ] ) ) {
			return self::getter_to_class( $deprecations[ $getter ][0] );
		}

		return null;
	}

	/**
	 * Constants pp-hosts reads must still be defined, and constants pp-hosts
	 * defines for Progress Planner must still be read by it.
	 *
	 * @return string[]
	 */
	private function check_constants() {
		$failures = [];
		foreach ( $this->contract['constants']['reads'] ?? [] as $constant ) {
			if ( ! \preg_match( '/define\(\s*[\'"]' . \preg_quote( $constant, '/' ) . '[\'"]/', $this->get_source() ) ) {
				$failures[] = "Constant {$constant} is no longer defined.";
			}
		}
		foreach ( $this->contract['constants']['provides'] ?? [] as $constant ) {
			if ( false === \strpos( $this->get_source(), $constant ) ) {
				$failures[] = "Constant {$constant} (set by pp-hosts) is no longer read by Progress Planner.";
			}
		}
		return $failures;
	}

	/**
	 * Dashboard widgets pp-hosts removes must still exist under the same ID.
	 *
	 * @return string[]
	 */
	private function check_meta_boxes() {
		$failures = [];
		foreach ( $this->contract['meta_boxes'] ?? [] as $id ) {
			if ( false !== \strpos( $this->get_source(), "'{$id}'" ) || $this->is_dashboard_widget( $id ) ) {
				continue;
			}
			$failures[] = "Dashboard widget '{$id}' no longer exists (pp-hosts removes it).";
		}
		return $failures;
	}

	/**
	 * Whether a widget ID is registered by Admin\Dashboard_Widget, which builds
	 * it as "progress_planner_dashboard_widget_{$this->id}".
	 *
	 * @param string $id The widget ID, e.g. progress_planner_dashboard_widget_score.
	 *
	 * @return bool
	 */
	private function is_dashboard_widget( $id ) {
		$prefix = 'progress_planner_dashboard_widget_';
		if ( 0 !== \strpos( $id, $prefix ) || false === \strpos( $this->get_source(), "\"{$prefix}{\$this->id}\"" ) ) {
			return false;
		}

		$suffix     = \substr( $id, \strlen( $prefix ) );
		$class_name = 'Progress_Planner\\Admin\\Dashboard_Widget_' . \implode( '_', \array_map( 'ucfirst', \explode( '_', $suffix ) ) );
		if ( ! \class_exists( $class_name ) ) {
			return false;
		}

		$defaults = ( new \ReflectionClass( $class_name ) )->getDefaultProperties();
		return isset( $defaults['id'] ) && $suffix === $defaults['id'];
	}

	/**
	 * Assets pp-hosts enqueues or prints from Progress Planner must still exist.
	 *
	 * @return string[]
	 */
	private function check_assets() {
		$failures = [];
		foreach ( $this->contract['assets'] ?? [] as $asset ) {
			if ( ! \file_exists( $this->pp_dir . '/' . \ltrim( $asset, '/' ) ) ) {
				$failures[] = "Asset {$asset} no longer exists.";
			}
		}
		return $failures;
	}

	/**
	 * Get all Progress Planner PHP source (excluding tests and dependencies).
	 *
	 * @return string
	 */
	private function get_source() {
		if ( null !== $this->source ) {
			return $this->source;
		}

		$this->source = '';
		$iterator     = new \RecursiveIteratorIterator(
			new \RecursiveCallbackFilterIterator(
				new \RecursiveDirectoryIterator( $this->pp_dir, \FilesystemIterator::SKIP_DOTS ),
				static function ( $file ) {
					return ! \in_array( $file->getFilename(), [ 'vendor', 'node_modules', 'tests', '.git' ], true );
				}
			)
		);
		foreach ( $iterator as $file ) {
			if ( 'php' === $file->getExtension() ) {
				// phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents -- Local file.
				$this->source .= \file_get_contents( $file->getPathname() ) . "\n";
			}
		}

		return $this->source;
	}
}
