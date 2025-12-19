/**
 * Yoast SEO Task Registration.
 *
 * Import all Yoast SEO task providers.
 * Tasks self-register via registerTask() when imported.
 *
 * Note: These tasks are only active when Yoast SEO is installed and active.
 * The shouldAddTask() method in each task checks for Yoast options availability.
 */

// Archive tasks - disable various archive types.
import './YoastArchiveAuthorTask';
import './YoastArchiveDateTask';
import './YoastArchiveFormatTask';

// Media pages task.
import './YoastMediaPagesTask';

// Crawl optimization tasks.
import './YoastCrawlEmojiScriptsTask';
import './YoastCrawlFeedAuthorsTask';
import './YoastCrawlFeedCommentsTask';

// Organization logo task.
import './YoastOrganizationLogoTask';

// Premium workout tasks (Yoast SEO Premium only).
import './YoastCornerstoneWorkoutTask';
import './YoastOrphanedContentWorkoutTask';

// Fix orphaned content task (creates tasks per orphaned post).
import './YoastFixOrphanedContentTask';
