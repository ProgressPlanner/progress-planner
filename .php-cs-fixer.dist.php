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

$config = new PhpCsFixer\Config();

return $config->setRules(
	[
		'native_function_invocation' => [
			'include' => [ '@all' ],
		],
	]
)->setFinder( $finder );