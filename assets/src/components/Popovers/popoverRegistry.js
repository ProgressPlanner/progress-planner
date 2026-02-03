/**
 * Popover Registry.
 *
 * Maps task IDs to their React popover components.
 * Uses React.lazy() for code splitting - each popover is loaded on-demand.
 */

import { lazy } from '@wordpress/element';

// Lazy-load all popover components for code splitting
// webpackChunkName comments ensure descriptive filenames for chunks
const BlogDescriptionPopover = lazy( () =>
	import(
		/* webpackChunkName: "BlogDescriptionPopover" */ './BlogDescriptionPopover'
	)
);
const DateFormatPopover = lazy( () =>
	import( /* webpackChunkName: "DateFormatPopover" */ './DateFormatPopover' )
);
const TimezonePopover = lazy( () =>
	import( /* webpackChunkName: "TimezonePopover" */ './TimezonePopover' )
);
const PermalinkStructurePopover = lazy( () =>
	import(
		/* webpackChunkName: "PermalinkStructurePopover" */ './PermalinkStructurePopover'
	)
);
const SiteIconPopover = lazy( () =>
	import( /* webpackChunkName: "SiteIconPopover" */ './SiteIconPopover' )
);
const LocalePopover = lazy( () =>
	import( /* webpackChunkName: "LocalePopover" */ './LocalePopover' )
);
const DisableCommentsPopover = lazy( () =>
	import(
		/* webpackChunkName: "DisableCommentsPopover" */ './DisableCommentsPopover'
	)
);
const YoastPopover = lazy( () =>
	import( /* webpackChunkName: "YoastPopover" */ './YoastPopover' )
);
const AIOSEOPopover = lazy( () =>
	import( /* webpackChunkName: "AIOSEOPopover" */ './AIOSEOPopover' )
);
const CustomPopover = lazy( () =>
	import( /* webpackChunkName: "CustomPopover" */ './CustomPopover' )
);
const EmailSendingPopover = lazy( () =>
	import(
		/* webpackChunkName: "EmailSendingPopover" */ './EmailSendingPopover'
	)
);
const ImprovePdfHandlingPopover = lazy( () =>
	import(
		/* webpackChunkName: "ImprovePdfHandlingPopover" */ './ImprovePdfHandlingPopover'
	)
);
const BadgeStreakPopover = lazy( () =>
	import(
		/* webpackChunkName: "BadgeStreakPopover" */ './BadgeStreakPopover'
	)
);
const SubscribeFormPopover = lazy( () =>
	import(
		/* webpackChunkName: "SubscribeFormPopover" */ './SubscribeFormPopover'
	)
);
const UpgradeTasksPopover = lazy( () =>
	import(
		/* webpackChunkName: "UpgradeTasksPopover" */ './UpgradeTasksPopover'
	)
);
const MonthlyBadgesPopover = lazy( () =>
	import(
		/* webpackChunkName: "MonthlyBadgesPopover" */ './MonthlyBadgesPopover'
	)
);

/**
 * Registry mapping task IDs to popover components.
 *
 * @type {Object<string, import('react').LazyExoticComponent>}
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
	'badge-streak': BadgeStreakPopover,
	'subscribe-form': SubscribeFormPopover,
	'upgrade-tasks': UpgradeTasksPopover,
	'monthly-badges': MonthlyBadgesPopover,
};

/**
 * Get popover component for a task ID.
 *
 * @param {string} taskId The task ID.
 * @return {import('react').LazyExoticComponent|null} The popover component or null if not found.
 */
export function getPopoverComponent( taskId ) {
	return POPOVER_REGISTRY[ taskId ] || null;
}
