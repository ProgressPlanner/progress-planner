/**
 * AIOSEO Task Registration.
 *
 * Import all AIOSEO task providers.
 * Tasks self-register via registerTask() when imported.
 *
 * Note: These tasks are only active when AIOSEO is installed and active.
 * The shouldAddTask() method in each task checks for AIOSEO options availability.
 */

// Organization logo task.
import './AIOSEOOrganizationLogoTask';

// Archive tasks - noindex various archive types.
import './AIOSEOArchiveAuthorTask';
import './AIOSEOArchiveDateTask';

// Media pages task - redirect attachment pages.
import './AIOSEOMediaPagesTask';

// Crawl optimization tasks - disable RSS feeds.
import './AIOSEOCrawlFeedAuthorsTask';
import './AIOSEOCrawlFeedCommentsTask';
