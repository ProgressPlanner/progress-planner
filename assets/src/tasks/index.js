/**
 * Task Registration.
 *
 * Import and register all React task providers here.
 * This is the entry point for task registration.
 */

import { registerTaskProvider } from '../services/taskRegistry';
import HelloWorldTask from './HelloWorldTask';
import SamplePageTask from './SamplePageTask';
import BlogDescriptionTask from './BlogDescriptionTask';
import SearchEngineVisibilityTask from './SearchEngineVisibilityTask';
import SiteIconTask from './SiteIconTask';
import SEOPluginTask from './SEOPluginTask';
import RemoveInactivePluginsTask from './RemoveInactivePluginsTask';
import PermalinkStructureTask from './PermalinkStructureTask';
import RenameUncategorizedCategoryTask from './RenameUncategorizedCategoryTask';
import DisableCommentPaginationTask from './DisableCommentPaginationTask';
import SetPageAboutTask from './SetPageAboutTask';
import SetPageFAQTask from './SetPageFAQTask';
import SetPageContactTask from './SetPageContactTask';
import UnpublishedContentTask from './UnpublishedContentTask';
import CoreUpdateTask from './CoreUpdateTask';
import ContentCreateTask from './ContentCreateTask';
import SetValuablePostTypesTask from './SetValuablePostTypesTask';
import EmailSendingTask from './EmailSendingTask';
import ImprovePdfHandlingTask from './ImprovePdfHandlingTask';
import DebugDisplayTask from './DebugDisplayTask';
import PhpVersionTask from './PhpVersionTask';
import DisableCommentsTask from './DisableCommentsTask';
import ReduceAutoloadedOptionsTask from './ReduceAutoloadedOptionsTask';
import SelectLocaleTask from './SelectLocaleTask';
import SelectTimezoneTask from './SelectTimezoneTask';
import SetDateFormatTask from './SetDateFormatTask';
import FewerTagsTask from './FewerTagsTask';
import ContentReviewTask from './ContentReviewTask';
import RemoveTermsWithoutPostsTask from './RemoveTermsWithoutPostsTask';
import UpdateTermDescriptionTask from './UpdateTermDescriptionTask';

// Register all task providers.
registerTaskProvider( HelloWorldTask );
registerTaskProvider( SamplePageTask );
registerTaskProvider( BlogDescriptionTask );
registerTaskProvider( SearchEngineVisibilityTask );
registerTaskProvider( SiteIconTask );
registerTaskProvider( SEOPluginTask );
registerTaskProvider( RemoveInactivePluginsTask );
registerTaskProvider( PermalinkStructureTask );
registerTaskProvider( RenameUncategorizedCategoryTask );
registerTaskProvider( DisableCommentPaginationTask );
registerTaskProvider( SetPageAboutTask );
registerTaskProvider( SetPageFAQTask );
registerTaskProvider( SetPageContactTask );
registerTaskProvider( UnpublishedContentTask );
registerTaskProvider( CoreUpdateTask );
registerTaskProvider( ContentCreateTask );
registerTaskProvider( SetValuablePostTypesTask );
registerTaskProvider( EmailSendingTask );
registerTaskProvider( ImprovePdfHandlingTask );
registerTaskProvider( DebugDisplayTask );
registerTaskProvider( PhpVersionTask );
registerTaskProvider( DisableCommentsTask );
registerTaskProvider( ReduceAutoloadedOptionsTask );
registerTaskProvider( SelectLocaleTask );
registerTaskProvider( SelectTimezoneTask );
registerTaskProvider( SetDateFormatTask );
registerTaskProvider( FewerTagsTask );
registerTaskProvider( ContentReviewTask );
registerTaskProvider( RemoveTermsWithoutPostsTask );
registerTaskProvider( UpdateTermDescriptionTask );
