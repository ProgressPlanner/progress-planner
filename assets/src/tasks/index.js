/**
 * Task Registration.
 *
 * Import all React task providers.
 * Tasks self-register via registerTask() when imported.
 */

// Core tasks - basic WordPress setup and configuration
import './HelloWorldTask';
import './SamplePageTask';
import './BlogDescriptionTask';
import './SiteIconTask';
import './PermalinkStructureTask';
import './SelectLocaleTask';
import './SelectTimezoneTask';
import './SetDateFormatTask';
import './SearchEngineVisibilityTask';

// Content tasks - content creation, management, and SEO
import './ContentCreateTask';
import './ContentReviewTask';
import './UnpublishedContentTask';
import './SetPageAboutTask';
import './SetPageFAQTask';
import './SetPageContactTask';
import './SetValuablePostTypesTask';
import './RenameUncategorizedCategoryTask';
import './FewerTagsTask';
import './RemoveTermsWithoutPostsTask';
import './UpdateTermDescriptionTask';
import './SEOPluginTask';

// Maintenance tasks - WordPress updates and housekeeping
import './CoreUpdateTask';
import './RemoveInactivePluginsTask';
import './DebugDisplayTask';
import './PhpVersionTask';
import './EmailSendingTask';
import './DisableCommentsTask';
import './DisableCommentPaginationTask';

// Performance tasks - optimization related
import './ImprovePdfHandlingTask';
import './ReduceAutoloadedOptionsTask';

// User tasks - user-created todo items
import './UserTask';
