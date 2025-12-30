import { test as base } from '@playwright/test';
import { spawn, ChildProcess } from 'child_process';

/**
 * WP Playground fixture for completely isolated WordPress instances.
 *
 * Each test file gets its own WordPress instance with no shared state.
 * Perfect for tests that modify global settings or need a clean slate.
 *
 * Usage:
 * ```ts
 * import { test, expect } from '../fixtures/playground.fixture';
 *
 * test('my isolated test', async ({ page, wpUrl }) => {
 *   await page.goto(wpUrl + '/wp-admin/');
 *   // ...
 * });
 * ```
 */

type PlaygroundFixtures = {
	/**
	 * URL of the WordPress instance.
	 */
	wpUrl: string;

	/**
	 * Whether the Playground server is ready.
	 */
	playgroundReady: boolean;
};

type PlaygroundWorkerFixtures = {
	/**
	 * The Playground server process (shared per worker).
	 */
	playgroundServer: { url: string; process: ChildProcess };
};

export const test = base.extend< PlaygroundFixtures, PlaygroundWorkerFixtures >(
	{
		// Worker-scoped: one Playground server per test worker
		playgroundServer: [
			async ( {}, use, workerInfo ) => {
				const port = 9400 + workerInfo.workerIndex;
				const url = `http://127.0.0.1:${ port }`;

				console.log(
					`[Worker ${ workerInfo.workerIndex }] Starting Playground on port ${ port }...`
				);

				// Start Playground server
				const serverProcess = spawn(
					'npx',
					[
						'@wp-playground/cli@latest',
						'server',
						`--port=${ port }`,
						'--login',
						'--wp=latest',
						'--php=8.3',
						// Mount plugin if in the right directory
						'--auto-mount',
					],
					{
						stdio: [ 'ignore', 'pipe', 'pipe' ],
						shell: true,
					}
				);

				// Wait for server to be ready
				await new Promise< void >( ( resolve, reject ) => {
					const timeout = setTimeout( () => {
						reject(
							new Error(
								'Playground server failed to start within 60s'
							)
						);
					}, 60000 );

					serverProcess.stdout?.on( 'data', ( data: Buffer ) => {
						const output = data.toString();
						console.log( `[Playground] ${ output }` );

						if (
							output.includes( 'WordPress is running' ) ||
							output.includes( url )
						) {
							clearTimeout( timeout );
							resolve();
						}
					} );

					serverProcess.stderr?.on( 'data', ( data: Buffer ) => {
						console.error(
							`[Playground Error] ${ data.toString() }`
						);
					} );

					serverProcess.on( 'error', ( err ) => {
						clearTimeout( timeout );
						reject( err );
					} );

					serverProcess.on( 'exit', ( code ) => {
						if ( code !== 0 && code !== null ) {
							clearTimeout( timeout );
							reject(
								new Error(
									`Playground exited with code ${ code }`
								)
							);
						}
					} );
				} );

				console.log(
					`[Worker ${ workerInfo.workerIndex }] Playground ready at ${ url }`
				);

				await use( { url, process: serverProcess } );

				// Cleanup: stop the server
				console.log(
					`[Worker ${ workerInfo.workerIndex }] Stopping Playground...`
				);
				serverProcess.kill( 'SIGTERM' );
			},
			{ scope: 'worker', timeout: 120000 },
		],

		// Test-scoped: provide the URL to each test
		wpUrl: async ( { playgroundServer }, use ) => {
			await use( playgroundServer.url );
		},

		playgroundReady: async ( { playgroundServer }, use ) => {
			// Just ensure playgroundServer is initialized
			void playgroundServer;
			await use( true );
		},
	}
);

export { expect } from '@playwright/test';
