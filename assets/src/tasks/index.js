/**
 * Task Registration.
 *
 * Import and register all React task providers here.
 * This is the entry point for task registration.
 */

import { registerTaskProvider } from '../services/taskRegistry';
import helloWorldTask from './HelloWorldTask';

// Register all task providers.
registerTaskProvider( helloWorldTask );
