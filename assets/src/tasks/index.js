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
import unpublishedContentTask from './UnpublishedContentTask';
import coreUpdateTask from './CoreUpdateTask';
import contentCreateTask from './ContentCreateTask';
import setValuablePostTypesTask from './SetValuablePostTypesTask';
import emailSendingTask from './EmailSendingTask';
import improvePdfHandlingTask from './ImprovePdfHandlingTask';

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
registerTaskProvider( unpublishedContentTask );
registerTaskProvider( coreUpdateTask );
registerTaskProvider( contentCreateTask );
registerTaskProvider( setValuablePostTypesTask );
registerTaskProvider( emailSendingTask );
registerTaskProvider( improvePdfHandlingTask );
