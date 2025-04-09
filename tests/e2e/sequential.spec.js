const { test } = require( '@playwright/test' );
const onboardingTests = require( './onboarding.spec' );
const taglineTests = require( './task-tagline.spec' );

test.describe.serial( 'Sequential Onboarding Flow', () => {
	onboardingTests( test );
	taglineTests( test );
} );
