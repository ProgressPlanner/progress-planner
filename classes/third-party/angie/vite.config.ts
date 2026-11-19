import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig( {
	build: {
		lib: {
			entry: resolve( __dirname, 'src/progress-planner-mcp-server.ts' ),
			name: 'ProgressPlannerAngie',
			fileName: 'progress-planner-mcp-server',
			formats: [ 'es' ],
		},
		outDir: 'dist',
		rollupOptions: {
			output: {
				format: 'es',
				entryFileNames: 'progress-planner-mcp-server.js',
			},
		},
	},
	resolve: {
		alias: {
			'@': resolve( __dirname, 'src' ),
		},
	},
} );
