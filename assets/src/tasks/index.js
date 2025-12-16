/**
 * Task Registration.
 *
 * Import and register all React task providers here.
 * This is the entry point for task registration.
 */

import { registerTaskProvider } from '../services/taskRegistry';
import helloWorldTask from './HelloWorldTask';
import samplePageTask from './SamplePageTask';
import blogDescriptionTask from './BlogDescriptionTask';

// Register all task providers.
registerTaskProvider( helloWorldTask );
registerTaskProvider( samplePageTask );
registerTaskProvider( blogDescriptionTask );
