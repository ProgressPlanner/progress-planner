/**
 * Popover Registry.
 *
 * Maps task IDs to their React popover components.
 * This centralizes popover component configuration.
 */

import BlogDescriptionPopover from './BlogDescriptionPopover';
import DateFormatPopover from './DateFormatPopover';
import TimezonePopover from './TimezonePopover';
import PermalinkStructurePopover from './PermalinkStructurePopover';
import SiteIconPopover from './SiteIconPopover';
import LocalePopover from './LocalePopover';
import DisableCommentsPopover from './DisableCommentsPopover';
import YoastPopover from './YoastPopover';
import AIOSEOPopover from './AIOSEOPopover';
import CustomPopover from './CustomPopover';
import EmailSendingPopover from './EmailSendingPopover';
import ImprovePdfHandlingPopover from './ImprovePdfHandlingPopover';

/**
 * Registry mapping task IDs to popover components.
 *
 * @type {Object<string, import('react').ComponentType>}
 */
export const POPOVER_REGISTRY = {
	'core-blogdescription': BlogDescriptionPopover,
	'set-date-format': DateFormatPopover,
	'select-timezone': TimezonePopover,
	'core-permalink-structure': PermalinkStructurePopover,
	'core-siteicon': SiteIconPopover,
	'select-locale': LocalePopover,
	'disable-comments': DisableCommentsPopover,
	'disable-comment-pagination': DisableCommentsPopover,
	'search-engine-visibility': DisableCommentsPopover,
	'yoast-author-archive': YoastPopover,
	'yoast-date-archive': YoastPopover,
	'yoast-format-archive': YoastPopover,
	'yoast-media-pages': YoastPopover,
	'yoast-crawl-settings-emoji-scripts': YoastPopover,
	'yoast-crawl-settings-feed-authors': YoastPopover,
	'yoast-crawl-settings-feed-global-comments': YoastPopover,
	'yoast-organization-logo': SiteIconPopover,
	'aioseo-author-archive': AIOSEOPopover,
	'aioseo-date-archive': AIOSEOPopover,
	'aioseo-media-pages': AIOSEOPopover,
	'aioseo-crawl-settings-feed-authors': AIOSEOPopover,
	'aioseo-crawl-settings-feed-comments': AIOSEOPopover,
	'rename-uncategorized-category': CustomPopover,
	'hello-world': CustomPopover,
	'sample-page': CustomPopover,
	'update-term-description': CustomPopover,
	'remove-terms-without-posts': CustomPopover,
	'improve-pdf-handling': ImprovePdfHandlingPopover,
	'sending-email': EmailSendingPopover,
	'fewer-tags': CustomPopover,
	'seo-plugin': CustomPopover,
};

/**
 * Get popover component for a task ID.
 *
 * @param {string} taskId The task ID.
 * @return {import('react').ComponentType|null} The popover component or null if not found.
 */
export function getPopoverComponent( taskId ) {
	return POPOVER_REGISTRY[ taskId ] || null;
}

