<?php

$finder = ( new PhpCsFixer\Finder() )
	->in( __DIR__ )
	->exclude(
		[
			'tests/',
			'vendor/',
			'node_modules/',
		]
	);

return ( new PhpCsFixer\Config() )->setRules(
	[
		'native_function_invocation' => [
			'include' => [ '@all' ],
		],
	]
)->setFinder( $finder );