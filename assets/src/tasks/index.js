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
import searchEngineVisibilityTask from './SearchEngineVisibilityTask';
import siteIconTask from './SiteIconTask';
import seoPluginTask from './SEOPluginTask';
import removeInactivePluginsTask from './RemoveInactivePluginsTask';
import permalinkStructureTask from './PermalinkStructureTask';
import renameUncategorizedCategoryTask from './RenameUncategorizedCategoryTask';
import disableCommentPaginationTask from './DisableCommentPaginationTask';
import setPageAboutTask from './SetPageAboutTask';
import setPageFAQTask from './SetPageFAQTask';
import setPageContactTask from './SetPageContactTask';

// Register all task providers.
registerTaskProvider( helloWorldTask );
registerTaskProvider( samplePageTask );
registerTaskProvider( blogDescriptionTask );
registerTaskProvider( searchEngineVisibilityTask );
registerTaskProvider( siteIconTask );
registerTaskProvider( seoPluginTask );
registerTaskProvider( removeInactivePluginsTask );
registerTaskProvider( permalinkStructureTask );
registerTaskProvider( renameUncategorizedCategoryTask );
registerTaskProvider( disableCommentPaginationTask );
registerTaskProvider( setPageAboutTask );
registerTaskProvider( setPageFAQTask );
registerTaskProvider( setPageContactTask );
