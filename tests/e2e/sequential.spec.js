const { test } = require( '@playwright/test' );
const onboardingTests = require( './onboarding.spec' );
const taglineTests = require( './task-tagline.spec' );
const todoTests = require( './todo.spec' );
const todoReorderTests = require( './todo-reorder.spec' );
const todoCompleteTests = require( './todo-complete.spec' );

test.describe( 'Sequential Tests', () => {
	onboardingTests( test );
	taglineTests( test );
	todoTests( test );
	todoReorderTests( test );
	todoCompleteTests( test );
} );
