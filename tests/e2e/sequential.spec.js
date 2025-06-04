const { test } = require( '@playwright/test' );
const onboardingTests = require( './sequential/onboarding.spec' );
const taglineTests = require( './sequential/task-tagline.spec' );
const todoTests = require( './sequential/todo.spec' );
const todoReorderTests = require( './sequential/todo-reorder.spec' );
const todoCompleteTests = require( './sequential/todo-complete.spec' );

test.describe( 'Sequential Tests', () => {
	onboardingTests( test );
	taglineTests( test );
	todoTests( test );
	todoReorderTests( test );
	todoCompleteTests( test );
} );
