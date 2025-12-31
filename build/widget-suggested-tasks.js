"use strict";
(globalThis["webpackChunkprogress_planner"] = globalThis["webpackChunkprogress_planner"] || []).push([["widget-suggested-tasks"],{

/***/ "./assets/src/components/Popovers/PopoverLoadingState.js":
/*!***************************************************************!*\
  !*** ./assets/src/components/Popovers/PopoverLoadingState.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PopoverLoadingState)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);
/**
 * Popover Loading State Component.
 *
 * Displays a loading state while popover components are being lazy-loaded.
 *
 * @return {JSX.Element} The loading state component.
 */



function PopoverLoadingState() {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
    className: "prpl-popover-loading",
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      minHeight: '200px'
    },
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("span", {
      className: "spinner is-active",
      style: {
        float: 'none',
        margin: '0 0 1rem 0'
      }
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("p", {
      style: {
        margin: 0,
        color: '#666'
      },
      children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Loading…', 'progress-planner')
    })]
  });
}

/***/ }),

/***/ "./assets/src/components/Popovers/popoverRegistry.js":
/*!***********************************************************!*\
  !*** ./assets/src/components/Popovers/popoverRegistry.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   POPOVER_REGISTRY: () => (/* binding */ POPOVER_REGISTRY),
/* harmony export */   getPopoverComponent: () => (/* binding */ getPopoverComponent)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/**
 * Popover Registry.
 *
 * Maps task IDs to their React popover components.
 * Uses React.lazy() for code splitting - each popover is loaded on-demand.
 */



// Lazy-load all popover components for code splitting
// webpackChunkName comments ensure descriptive filenames for chunks
const BlogDescriptionPopover = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.lazy)(() => __webpack_require__.e(/*! import() | BlogDescriptionPopover */ "BlogDescriptionPopover").then(__webpack_require__.bind(__webpack_require__, /*! ./BlogDescriptionPopover */ "./assets/src/components/Popovers/BlogDescriptionPopover.js")));
const DateFormatPopover = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.lazy)(() => __webpack_require__.e(/*! import() | DateFormatPopover */ "DateFormatPopover").then(__webpack_require__.bind(__webpack_require__, /*! ./DateFormatPopover */ "./assets/src/components/Popovers/DateFormatPopover.js")));
const TimezonePopover = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.lazy)(() => __webpack_require__.e(/*! import() | TimezonePopover */ "TimezonePopover").then(__webpack_require__.bind(__webpack_require__, /*! ./TimezonePopover */ "./assets/src/components/Popovers/TimezonePopover.js")));
const PermalinkStructurePopover = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.lazy)(() => __webpack_require__.e(/*! import() | PermalinkStructurePopover */ "PermalinkStructurePopover").then(__webpack_require__.bind(__webpack_require__, /*! ./PermalinkStructurePopover */ "./assets/src/components/Popovers/PermalinkStructurePopover.js")));
const SiteIconPopover = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.lazy)(() => __webpack_require__.e(/*! import() | SiteIconPopover */ "SiteIconPopover").then(__webpack_require__.bind(__webpack_require__, /*! ./SiteIconPopover */ "./assets/src/components/Popovers/SiteIconPopover.js")));
const LocalePopover = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.lazy)(() => __webpack_require__.e(/*! import() | LocalePopover */ "LocalePopover").then(__webpack_require__.bind(__webpack_require__, /*! ./LocalePopover */ "./assets/src/components/Popovers/LocalePopover.js")));
const DisableCommentsPopover = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.lazy)(() => __webpack_require__.e(/*! import() | DisableCommentsPopover */ "DisableCommentsPopover").then(__webpack_require__.bind(__webpack_require__, /*! ./DisableCommentsPopover */ "./assets/src/components/Popovers/DisableCommentsPopover.js")));
const YoastPopover = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.lazy)(() => __webpack_require__.e(/*! import() | YoastPopover */ "YoastPopover").then(__webpack_require__.bind(__webpack_require__, /*! ./YoastPopover */ "./assets/src/components/Popovers/YoastPopover.js")));
const AIOSEOPopover = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.lazy)(() => __webpack_require__.e(/*! import() | AIOSEOPopover */ "AIOSEOPopover").then(__webpack_require__.bind(__webpack_require__, /*! ./AIOSEOPopover */ "./assets/src/components/Popovers/AIOSEOPopover.js")));
const CustomPopover = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.lazy)(() => __webpack_require__.e(/*! import() | CustomPopover */ "CustomPopover").then(__webpack_require__.bind(__webpack_require__, /*! ./CustomPopover */ "./assets/src/components/Popovers/CustomPopover.js")));
const EmailSendingPopover = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.lazy)(() => __webpack_require__.e(/*! import() | EmailSendingPopover */ "EmailSendingPopover").then(__webpack_require__.bind(__webpack_require__, /*! ./EmailSendingPopover */ "./assets/src/components/Popovers/EmailSendingPopover.js")));
const ImprovePdfHandlingPopover = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.lazy)(() => __webpack_require__.e(/*! import() | ImprovePdfHandlingPopover */ "ImprovePdfHandlingPopover").then(__webpack_require__.bind(__webpack_require__, /*! ./ImprovePdfHandlingPopover */ "./assets/src/components/Popovers/ImprovePdfHandlingPopover.js")));
const BadgeStreakPopover = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.lazy)(() => __webpack_require__.e(/*! import() | BadgeStreakPopover */ "BadgeStreakPopover").then(__webpack_require__.bind(__webpack_require__, /*! ./BadgeStreakPopover */ "./assets/src/components/Popovers/BadgeStreakPopover.js")));
const SubscribeFormPopover = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.lazy)(() => __webpack_require__.e(/*! import() | SubscribeFormPopover */ "SubscribeFormPopover").then(__webpack_require__.bind(__webpack_require__, /*! ./SubscribeFormPopover */ "./assets/src/components/Popovers/SubscribeFormPopover.js")));
const UpgradeTasksPopover = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.lazy)(() => __webpack_require__.e(/*! import() | UpgradeTasksPopover */ "UpgradeTasksPopover").then(__webpack_require__.bind(__webpack_require__, /*! ./UpgradeTasksPopover */ "./assets/src/components/Popovers/UpgradeTasksPopover.js")));
const MonthlyBadgesPopover = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.lazy)(() => __webpack_require__.e(/*! import() | MonthlyBadgesPopover */ "MonthlyBadgesPopover").then(__webpack_require__.bind(__webpack_require__, /*! ./MonthlyBadgesPopover */ "./assets/src/components/Popovers/MonthlyBadgesPopover.js")));

/**
 * Registry mapping task IDs to popover components.
 *
 * @type {Object<string, import('react').LazyExoticComponent>}
 */
const POPOVER_REGISTRY = {
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
  'monthly-badges': MonthlyBadgesPopover
};

/**
 * Get popover component for a task ID.
 *
 * @param {string} taskId The task ID.
 * @return {import('react').LazyExoticComponent|null} The popover component or null if not found.
 */
function getPopoverComponent(taskId) {
  return POPOVER_REGISTRY[taskId] || null;
}

/***/ }),

/***/ "./assets/src/components/Skeleton/index.js":
/*!*************************************************!*\
  !*** ./assets/src/components/Skeleton/index.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SkeletonBar: () => (/* binding */ SkeletonBar),
/* harmony export */   SkeletonCircle: () => (/* binding */ SkeletonCircle),
/* harmony export */   SkeletonRect: () => (/* binding */ SkeletonRect),
/* harmony export */   SkeletonText: () => (/* binding */ SkeletonText)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);
/**
 * Skeleton Loading Components
 *
 * Primitive components for building skeleton loading states.
 * Use these to compose widget-specific loading skeletons.
 */



/**
 * Keyframes CSS for the shimmer animation.
 * Injected once into the document head.
 */

const SHIMMER_KEYFRAMES = `
@keyframes prpl-shimmer {
	0% { background-position: 200% 0; }
	100% { background-position: -200% 0; }
}
`;

/**
 * Track if keyframes have been injected.
 */
let keyframesInjected = false;

/**
 * Inject the shimmer keyframes into the document head (once).
 */
function injectKeyframes() {
  if (keyframesInjected || typeof document === 'undefined') {
    return;
  }
  const styleEl = document.createElement('style');
  styleEl.id = 'prpl-skeleton-keyframes';
  styleEl.textContent = SHIMMER_KEYFRAMES;
  document.head.appendChild(styleEl);
  keyframesInjected = true;
}

/**
 * Base skeleton styles.
 */
const baseSkeletonStyle = {
  background: `linear-gradient(
		90deg,
		var(--prpl-color-gauge-remain, #f0f0f0) 25%,
		var(--prpl-color-border, #e0e0e0) 50%,
		var(--prpl-color-gauge-remain, #f0f0f0) 75%
	)`,
  backgroundSize: '200% 100%',
  animation: 'prpl-shimmer 1.5s ease-in-out infinite',
  borderRadius: 'var(--prpl-border-radius, 8px)'
};

/**
 * SkeletonRect component - a rectangular skeleton element.
 *
 * @param {Object} props           - Component props.
 * @param {string} props.width     - Width (CSS value).
 * @param {string} props.height    - Height (CSS value).
 * @param {string} props.className - Additional CSS class.
 * @param {Object} props.style     - Additional inline styles.
 * @return {JSX.Element} The skeleton rect element.
 */
function SkeletonRect({
  width = '100%',
  height = '1em',
  className = '',
  style = {}
}) {
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    injectKeyframes();
  }, []);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
    className: className || undefined,
    style: {
      ...baseSkeletonStyle,
      width,
      height,
      ...style
    }
  });
}

/**
 * SkeletonCircle component - a circular skeleton element.
 *
 * @param {Object} props           - Component props.
 * @param {string} props.size      - Diameter (CSS value).
 * @param {string} props.className - Additional CSS class.
 * @param {Object} props.style     - Additional inline styles.
 * @return {JSX.Element} The skeleton circle element.
 */
function SkeletonCircle({
  size = '40px',
  className = '',
  style = {}
}) {
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    injectKeyframes();
  }, []);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
    className: className || undefined,
    style: {
      ...baseSkeletonStyle,
      width: size,
      height: size,
      borderRadius: '50%',
      ...style
    }
  });
}

/**
 * SkeletonText component - one or more lines of skeleton text.
 *
 * @param {Object}  props           - Component props.
 * @param {string}  props.width     - Width of each line (CSS value).
 * @param {number}  props.lines     - Number of lines.
 * @param {string}  props.className - Additional CSS class.
 * @param {Object}  props.style     - Additional inline styles.
 * @param {boolean} props.lastShort - Whether the last line should be shorter.
 * @return {JSX.Element} The skeleton text element(s).
 */
function SkeletonText({
  width = '100%',
  lines = 1,
  className = '',
  style = {},
  lastShort = true
}) {
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    injectKeyframes();
  }, []);
  if (lines === 1) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(SkeletonRect, {
      width: width,
      height: "1em",
      className: className,
      style: style
    });
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      ...style
    },
    children: Array.from({
      length: lines
    }).map((_, i) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(SkeletonRect, {
      width: lastShort && i === lines - 1 ? '70%' : width,
      height: "1em",
      className: className,
      style: {
        marginBottom: i < lines - 1 ? '0.5em' : 0
      }
    }, i))
  });
}

/**
 * SkeletonBar component - a progress bar skeleton.
 *
 * @param {Object} props           - Component props.
 * @param {string} props.width     - Width (CSS value).
 * @param {string} props.height    - Height (CSS value).
 * @param {string} props.className - Additional CSS class.
 * @param {Object} props.style     - Additional inline styles.
 * @return {JSX.Element} The skeleton bar element.
 */
function SkeletonBar({
  width = '100%',
  height = '8px',
  className = '',
  style = {}
}) {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(SkeletonRect, {
    width: width,
    height: height,
    className: className,
    style: {
      borderRadius: '999px',
      ...style
    }
  });
}

/***/ }),

/***/ "./assets/src/components/TaskItem/TaskActionComplete.js":
/*!**************************************************************!*\
  !*** ./assets/src/components/TaskItem/TaskActionComplete.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TaskActionComplete)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);
/**
 * Task Complete Action Component.
 *
 * Renders the "Mark as complete" button for dismissable tasks.
 */



/**
 * Button styles.
 */

const STYLES = {
  button: {
    textDecoration: 'none',
    padding: 0,
    lineHeight: 1,
    background: 'none',
    border: 'none',
    cursor: 'pointer'
  },
  actionText: {
    lineHeight: 1,
    fontSize: 'var(--prpl-font-size-small)',
    color: 'var(--prpl-color-link)'
  }
};

/**
 * Task Complete Action component.
 *
 * @param {Object}   props           Component props.
 * @param {string}   props.taskId    The task ID (slug or post ID).
 * @param {string}   props.taskTitle The task title for accessibility.
 * @param {Function} props.onClick   Click handler.
 * @return {JSX.Element} The complete action button.
 */
function TaskActionComplete({
  taskId,
  taskTitle,
  onClick
}) {
  const handleClick = e => {
    e.preventDefault();
    onClick?.();
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("button", {
    type: "button",
    className: "prpl-suggested-task-button",
    style: STYLES.button,
    "data-task-id": taskId,
    "data-task-title": taskTitle,
    "data-action": "complete",
    "data-target": "complete",
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Mark as complete', 'progress-planner'),
    onClick: handleClick,
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("span", {
      className: "prpl-tooltip-action-text",
      style: STYLES.actionText,
      children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Mark as complete', 'progress-planner')
    })
  });
}

/***/ }),

/***/ "./assets/src/components/TaskItem/TaskActionDelete.js":
/*!************************************************************!*\
  !*** ./assets/src/components/TaskItem/TaskActionDelete.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TaskActionDelete)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);
/**
 * Task Delete Action Component.
 *
 * Renders the delete button for user-created tasks.
 */



/**
 * Button styles.
 */

const STYLES = {
  button: {
    textDecoration: 'none',
    padding: 0,
    lineHeight: 1,
    background: 'none',
    border: 'none',
    cursor: 'pointer'
  },
  actionText: {
    lineHeight: 1,
    fontSize: 'var(--prpl-font-size-small)',
    color: 'var(--prpl-color-link)'
  }
};

/**
 * Task Delete Action component.
 *
 * @param {Object}   props           Component props.
 * @param {number}   props.postId    The task post ID.
 * @param {string}   props.taskTitle The task title for accessibility.
 * @param {Function} props.onClick   Click handler.
 * @return {JSX.Element} The delete action button.
 */
function TaskActionDelete({
  postId,
  taskTitle,
  onClick
}) {
  const handleClick = e => {
    e.preventDefault();
    onClick?.();
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("button", {
    type: "button",
    className: "prpl-suggested-task-button trash",
    style: STYLES.button,
    "data-post-id": postId,
    title: `${(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Delete', 'progress-planner')}: ${taskTitle}`,
    onClick: handleClick,
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("span", {
      className: "prpl-tooltip-action-text",
      style: STYLES.actionText,
      children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Delete', 'progress-planner')
    })
  });
}

/***/ }),

/***/ "./assets/src/components/TaskItem/TaskActionInfo.js":
/*!**********************************************************!*\
  !*** ./assets/src/components/TaskItem/TaskActionInfo.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TaskActionInfo)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);
/**
 * Task Info Action Component.
 *
 * Renders either an external link or an info tooltip with content.
 */



/**
 * Button styles.
 */

const STYLES = {
  button: {
    textDecoration: 'none',
    padding: 0,
    lineHeight: 1,
    background: 'none',
    border: 'none',
    cursor: 'pointer'
  },
  actionText: {
    lineHeight: 1,
    fontSize: 'var(--prpl-font-size-small)',
    color: 'var(--prpl-color-link)'
  },
  link: {
    textDecoration: 'none'
  }
};

/**
 * Task Info Action component.
 *
 * @param {Object} props             Component props.
 * @param {string} props.taskId      The task ID.
 * @param {string} props.taskTitle   The task title for accessibility.
 * @param {string} props.externalUrl External link URL (if provided, renders as link).
 * @param {string} props.content     HTML content for tooltip (if no external URL).
 * @return {JSX.Element|null} The info action (link or tooltip) or null if no content.
 */
function TaskActionInfo({
  taskId,
  taskTitle,
  externalUrl,
  content
}) {
  // Render external link if URL provided.
  if (externalUrl) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("a", {
      className: "prpl-tooltip-action-text",
      style: {
        ...STYLES.actionText,
        ...STYLES.link
      },
      href: externalUrl,
      target: "_blank",
      rel: "noopener noreferrer",
      children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Why is this important?', 'progress-planner')
    });
  }

  // Render info tooltip if content provided.
  if (content) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("prpl-tooltip", {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("slot", {
        name: "open",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("button", {
          type: "button",
          className: "prpl-suggested-task-button",
          style: STYLES.button,
          "data-task-id": taskId,
          "data-task-title": taskTitle,
          "data-action": "info",
          "data-target": "info",
          title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Info', 'progress-planner'),
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("span", {
            className: "prpl-tooltip-action-text",
            style: STYLES.actionText,
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Info', 'progress-planner')
          })
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("slot", {
        name: "content",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
          dangerouslySetInnerHTML: {
            __html: content
          }
        })
      })]
    });
  }
  return null;
}

/***/ }),

/***/ "./assets/src/components/TaskItem/TaskActionLink.js":
/*!**********************************************************!*\
  !*** ./assets/src/components/TaskItem/TaskActionLink.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TaskActionLink)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);

/**
 * Task Link Action Component.
 *
 * Renders a generic link action (Edit, Review, etc.).
 */

/**
 * Link styles.
 */
const STYLES = {
  link: {
    textDecoration: 'none',
    lineHeight: 1,
    fontSize: 'var(--prpl-font-size-small)',
    color: 'var(--prpl-color-link)'
  }
};

/**
 * Task Link Action component.
 *
 * @param {Object}   props           Component props.
 * @param {string}   props.href      The link URL.
 * @param {string}   props.label     The link text.
 * @param {string}   props.target    Link target (_self, _blank). Defaults to _self.
 * @param {Function} props.onClick   Optional click handler (for inline actions).
 * @param {string}   props.className Additional CSS classes.
 * @return {JSX.Element} The link action.
 */
function TaskActionLink({
  href,
  label,
  target = '_self',
  onClick,
  className = ''
}) {
  const handleClick = e => {
    if (onClick) {
      e.preventDefault();
      onClick(e);
    }
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("a", {
    className: `prpl-tooltip-action-text${className ? ` ${className}` : ''}`,
    style: STYLES.link,
    href: href || '#',
    target: target,
    rel: target === '_blank' ? 'noopener noreferrer' : undefined,
    onClick: onClick ? handleClick : undefined,
    children: label
  });
}

/***/ }),

/***/ "./assets/src/components/TaskItem/TaskActionPopover.js":
/*!*************************************************************!*\
  !*** ./assets/src/components/TaskItem/TaskActionPopover.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TaskActionPopover)
/* harmony export */ });
/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/hooks */ "@wordpress/hooks");
/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_hooks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);
/**
 * Task Popover Action Component.
 *
 * Renders a button that opens a popover for interactive tasks.
 */



/**
 * Link styles.
 */

const STYLES = {
  link: {
    textDecoration: 'none',
    lineHeight: 1,
    fontSize: 'var(--prpl-font-size-small)',
    color: 'var(--prpl-color-link)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0
  }
};

/**
 * Task Popover Action component.
 *
 * @param {Object} props             Component props.
 * @param {string} props.popoverId   The popover element ID (with prpl-popover- prefix).
 * @param {string} props.label       The action label text.
 * @param {Object} props.task        The task object (for action hook).
 * @param {Object} props.taskContext Optional context data for custom events.
 * @param {string} props.eventName   Optional custom event name to dispatch.
 * @return {JSX.Element} The popover trigger action.
 */
function TaskActionPopover({
  popoverId,
  label,
  task,
  taskContext,
  eventName
}) {
  const handleClick = e => {
    e.preventDefault();

    // Open the popover element.
    const popoverElement = document.getElementById(popoverId);
    if (popoverElement?.showPopover) {
      popoverElement.showPopover();
    }

    // Fire WordPress action hook for React handlers.
    if (task) {
      (0,_wordpress_hooks__WEBPACK_IMPORTED_MODULE_0__.doAction)('prpl.popover.open', popoverId, task);
    }

    // Dispatch custom event if specified (for task-specific handlers).
    if (eventName && taskContext) {
      const event = new CustomEvent(eventName, {
        bubbles: true,
        detail: taskContext
      });
      e.target.dispatchEvent(event);
    }
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("button", {
    type: "button",
    className: "prpl-tooltip-action-text",
    style: STYLES.link,
    onClick: handleClick,
    children: label
  });
}

/***/ }),

/***/ "./assets/src/components/TaskItem/TaskActionSnooze.js":
/*!************************************************************!*\
  !*** ./assets/src/components/TaskItem/TaskActionSnooze.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TaskActionSnooze)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__);
/**
 * Task Snooze Action Component.
 *
 * Renders the snooze button with duration picker tooltip.
 */




/**
 * Button styles.
 */

const STYLES = {
  button: {
    textDecoration: 'none',
    padding: 0,
    lineHeight: 1,
    background: 'none',
    border: 'none',
    cursor: 'pointer'
  },
  actionText: {
    lineHeight: 1,
    fontSize: 'var(--prpl-font-size-small)',
    color: 'var(--prpl-color-link)'
  }
};

/**
 * Snooze duration options.
 */
const SNOOZE_DURATIONS = [{
  key: '1-week',
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('1 week', 'progress-planner')
}, {
  key: '1-month',
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('1 month', 'progress-planner')
}, {
  key: '3-months',
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('3 months', 'progress-planner')
}, {
  key: '6-months',
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('6 months', 'progress-planner')
}, {
  key: '1-year',
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('1 year', 'progress-planner')
}, {
  key: 'forever',
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('forever', 'progress-planner')
}];

/**
 * Task Snooze Action component.
 *
 * @param {Object}   props           Component props.
 * @param {string}   props.taskId    The task ID.
 * @param {string}   props.taskTitle The task title for accessibility.
 * @param {Function} props.onSnooze  Snooze handler (receives duration key).
 * @return {JSX.Element} The snooze action with tooltip.
 */
function TaskActionSnooze({
  taskId,
  taskTitle,
  onSnooze
}) {
  const [isExpanded, setIsExpanded] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const handleDurationChange = e => {
    const duration = e.target.value;
    onSnooze?.(duration);
  };
  const toggleExpanded = e => {
    e.preventDefault();
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("prpl-tooltip", {
    className: `prpl-suggested-task-snooze${isExpanded ? ' prpl-toggle-radio-group-open' : ''}`,
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("slot", {
      name: "open",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("button", {
        type: "button",
        className: "prpl-suggested-task-button",
        style: STYLES.button,
        "data-task-id": taskId,
        "data-task-title": taskTitle,
        "data-action": "snooze",
        "data-target": "snooze",
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Snooze', 'progress-planner'),
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("span", {
          className: "prpl-tooltip-action-text",
          style: STYLES.actionText,
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Snooze', 'progress-planner')
        })
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("slot", {
      name: "content",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("fieldset", {
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("legend", {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("span", {
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Snooze this task?', 'progress-planner')
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("button", {
            type: "button",
            className: "prpl-toggle-radio-group",
            onClick: toggleExpanded,
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("span", {
              className: "prpl-toggle-radio-group-text",
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('How long?', 'progress-planner')
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("span", {
              className: "prpl-toggle-radio-group-arrow",
              children: "\u203A"
            })]
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
          className: "prpl-snooze-duration-radio-group",
          children: SNOOZE_DURATIONS.map(duration => {
            const inputId = `snooze-${taskId}-${duration.key}`;
            return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("label", {
              htmlFor: inputId,
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("input", {
                type: "radio",
                id: inputId,
                name: `snooze-duration-${taskId}`,
                value: duration.key,
                onChange: handleDurationChange
              }), duration.label]
            }, duration.key);
          })
        })]
      })
    })]
  });
}

/***/ }),

/***/ "./assets/src/components/TaskItem/TaskActions.js":
/*!*******************************************************!*\
  !*** ./assets/src/components/TaskItem/TaskActions.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TaskActions)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/hooks */ "@wordpress/hooks");
/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_hooks__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _services_taskRegistry__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../services/taskRegistry */ "./assets/src/services/taskRegistry.js");
/* harmony import */ var _TaskActionComplete__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./TaskActionComplete */ "./assets/src/components/TaskItem/TaskActionComplete.js");
/* harmony import */ var _TaskActionSnooze__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./TaskActionSnooze */ "./assets/src/components/TaskItem/TaskActionSnooze.js");
/* harmony import */ var _TaskActionInfo__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./TaskActionInfo */ "./assets/src/components/TaskItem/TaskActionInfo.js");
/* harmony import */ var _TaskActionLink__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./TaskActionLink */ "./assets/src/components/TaskItem/TaskActionLink.js");
/* harmony import */ var _TaskActionPopover__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./TaskActionPopover */ "./assets/src/components/TaskItem/TaskActionPopover.js");
/* harmony import */ var _TaskActionDelete__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./TaskActionDelete */ "./assets/src/components/TaskItem/TaskActionDelete.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__);
/**
 * Task Actions Component.
 *
 * Renders action buttons for a task (complete, snooze, info, etc.).
 * Supports both:
 * - Config objects from React task providers (rendered as React components)
 * - HTML strings from PHP (rendered with dangerouslySetInnerHTML for backward compatibility)
 */











/**
 * Style constants - extracted to prevent recreation on each render.
 */

const STYLES = {
  actions: {
    paddingTop: '2px',
    gap: '0.4rem',
    alignItems: 'baseline'
  },
  action: {
    display: 'inline-flex',
    position: 'relative',
    textDecoration: 'none'
  }
};

/**
 * Render a single action based on its type.
 *
 * @param {Object}   action     The action config object.
 * @param {Object}   task       The task object.
 * @param {Function} onComplete Complete handler.
 * @param {Function} onSnooze   Snooze handler.
 * @param {Function} onDelete   Delete handler.
 * @return {JSX.Element|null} The rendered action component.
 */
function renderAction(action, task, onComplete, onSnooze, onDelete) {
  const taskTitle = task.title?.rendered || task.title || '';
  switch (action.type) {
    case 'complete':
      return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_TaskActionComplete__WEBPACK_IMPORTED_MODULE_3__["default"], {
        taskId: action.taskId,
        taskTitle: action.taskTitle || taskTitle,
        onClick: () => onComplete(task.id, task)
      });
    case 'snooze':
      return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_TaskActionSnooze__WEBPACK_IMPORTED_MODULE_4__["default"], {
        taskId: action.taskId,
        taskTitle: action.taskTitle || taskTitle,
        onSnooze: duration => onSnooze(task.id, duration)
      });
    case 'info':
      return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_TaskActionInfo__WEBPACK_IMPORTED_MODULE_5__["default"], {
        taskId: action.taskId,
        taskTitle: action.taskTitle || taskTitle,
        externalUrl: action.externalUrl,
        content: action.content
      });
    case 'link':
      // Handle special inline edit action for user tasks.
      if (action.inlineEdit) {
        return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_TaskActionLink__WEBPACK_IMPORTED_MODULE_6__["default"], {
          href: "#",
          label: action.label,
          onClick: e => {
            e.preventDefault();
            // Find the task title span and focus it for inline editing.
            const taskElement = e.target.closest('li.prpl-suggested-task');
            const titleSpan = taskElement?.querySelector('.prpl-task-title span');
            titleSpan?.focus();
          }
        });
      }
      return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_TaskActionLink__WEBPACK_IMPORTED_MODULE_6__["default"], {
        href: action.href,
        label: action.label,
        target: action.target,
        className: action.className
      });
    case 'popover':
      return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_TaskActionPopover__WEBPACK_IMPORTED_MODULE_7__["default"], {
        popoverId: action.popoverId,
        label: action.label,
        task: task,
        taskContext: action.taskContext,
        eventName: action.eventName
      });
    case 'delete':
      return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_TaskActionDelete__WEBPACK_IMPORTED_MODULE_8__["default"], {
        postId: task.id,
        taskTitle: taskTitle,
        onClick: () => onDelete(task.id)
      });
    default:
      return null;
  }
}

/**
 * Task Actions component.
 *
 * @param {Object}   props            Component props.
 * @param {Object}   props.task       The task object.
 * @param {boolean}  props.isUserTask Whether this is a user task.
 * @param {Function} props.onComplete Callback for completing a task.
 * @param {Function} props.onSnooze   Callback for snoozing a task.
 * @param {Function} props.onDelete   Callback for deleting a task.
 * @return {JSX.Element} The task actions component.
 */
function TaskActions({
  task,
  isUserTask,
  onComplete,
  onSnooze,
  onDelete
}) {
  const actionsRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  // Store references to event handlers for proper cleanup (for HTML actions).
  const handlersRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)([]);

  /**
   * Create memoized event handler factories for HTML-based actions.
   */
  const createCompleteHandler = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)((taskId, taskObj) => e => {
    e.preventDefault();
    onComplete(taskId, taskObj);
  }, [onComplete]);
  const createSnoozeHandler = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(taskId => e => {
    onSnooze(taskId, e.target.value);
  }, [onSnooze]);
  const createPopoverHandler = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)((taskId, taskObj) => e => {
    e.preventDefault();
    (0,_wordpress_hooks__WEBPACK_IMPORTED_MODULE_1__.doAction)('prpl.popover.open', taskId, taskObj);
  }, []);
  const createDeleteHandler = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(taskId => e => {
    e.preventDefault();
    onDelete(taskId);
  }, [onDelete]);

  // Get task actions from API response, or generate from task provider.
  const taskActions = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    // If actions are already provided from the API and not empty, use them.
    // PHP-generated actions are HTML strings, React-generated are objects.
    if (task.prpl_task_actions && Array.isArray(task.prpl_task_actions) && task.prpl_task_actions.length > 0) {
      // Mark these as HTML strings for rendering.
      return task.prpl_task_actions.map(action => typeof action === 'string' ? {
        type: 'html',
        html: action
      } : action);
    }

    // Otherwise, try to generate actions from the task provider.
    let providerId = task.prpl_provider?.slug || task.provider_id || task.meta?.provider_id || '';

    // Fallback: Use task slug as provider ID.
    if (!providerId && task.slug) {
      providerId = task.slug;
    }

    // Fallback: Try to get provider from embedded taxonomy terms.
    if (!providerId && task.prpl_recommendations_provider && Array.isArray(task.prpl_recommendations_provider)) {
      const firstItem = task.prpl_recommendations_provider[0];
      if (firstItem && typeof firstItem === 'object' && firstItem.slug) {
        providerId = firstItem.slug;
      } else if (typeof firstItem === 'number' && task._embedded?.['wp:term']?.[0]) {
        const embeddedTerms = task._embedded['wp:term'].flat();
        const term = embeddedTerms.find(t => t?.taxonomy === 'prpl_recommendations_provider' && t.id === firstItem);
        if (term?.slug) {
          providerId = term.slug;
        }
      }
    }
    if (!providerId) {
      return [];
    }
    const providerInstance = (0,_services_taskRegistry__WEBPACK_IMPORTED_MODULE_2__.getTaskProviderInstance)(providerId);
    if (!providerInstance?.getTaskActions) {
      return [];
    }
    try {
      return providerInstance.getTaskActions(task) || [];
    } catch (error) {
      console.error(`Error generating actions for task provider "${providerId}":`, error);
      return [];
    }
  }, [task]);

  /**
   * Set up event handlers for HTML-based actions (backward compatibility).
   */
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!actionsRef.current) {
      return;
    }
    const container = actionsRef.current;
    handlersRef.current = [];

    // Only set up handlers for HTML-based actions.
    const hasHtmlActions = taskActions.some(a => a.type === 'html');
    if (!hasHtmlActions) {
      return;
    }

    // Handle complete button clicks.
    const completeButtons = container.querySelectorAll('[data-action="complete"]');
    completeButtons.forEach(button => {
      const handler = createCompleteHandler(task.id, task);
      button.addEventListener('click', handler);
      handlersRef.current.push({
        element: button,
        type: 'click',
        handler
      });
    });

    // Handle snooze radio changes.
    const snoozeRadios = container.querySelectorAll('.prpl-snooze-duration-radio-group input[type="radio"]');
    snoozeRadios.forEach(radio => {
      const handler = createSnoozeHandler(task.id);
      radio.addEventListener('change', handler);
      handlersRef.current.push({
        element: radio,
        type: 'change',
        handler
      });
    });

    // Handle popover triggers.
    const popoverLinks = container.querySelectorAll('a[onclick*="showPopover"]');
    popoverLinks.forEach(link => {
      const onclickAttr = link.getAttribute('onclick');
      const match = onclickAttr?.match(/getElementById\(['"]([^'"]+)['"]\)/);
      if (match) {
        const popoverId = match[1];
        const taskId = popoverId.replace('prpl-popover-', '');
        link.removeAttribute('onclick');
        const handler = createPopoverHandler(taskId, task);
        link.addEventListener('click', handler);
        handlersRef.current.push({
          element: link,
          type: 'click',
          handler
        });
      }
    });

    // Handle delete buttons.
    const deleteButtons = container.querySelectorAll('.prpl-suggested-task-button.trash');
    deleteButtons.forEach(button => {
      const handler = createDeleteHandler(task.id);
      button.addEventListener('click', handler);
      handlersRef.current.push({
        element: button,
        type: 'click',
        handler
      });
    });

    // Cleanup event listeners.
    return () => {
      handlersRef.current.forEach(({
        element,
        type,
        handler
      }) => {
        element.removeEventListener(type, handler);
      });
      handlersRef.current = [];
    };
  }, [task, taskActions, createCompleteHandler, createSnoozeHandler, createPopoverHandler, createDeleteHandler]);

  // If no actions and not a user task, return empty container.
  if (taskActions.length === 0 && !isUserTask) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("div", {
      className: "tooltip-actions",
      style: STYLES.actions
    });
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("div", {
    className: "tooltip-actions",
    style: STYLES.actions,
    ref: actionsRef,
    children: [taskActions.map((action, index) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("span", {
      className: "tooltip-action",
      style: STYLES.action,
      children: action.type === 'html' ?
      /*#__PURE__*/
      // Render HTML string (backward compatibility with PHP).
      (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("span", {
        dangerouslySetInnerHTML: {
          __html: action.html
        }
      }) :
      // Render React component based on action type.
      renderAction(action, task, onComplete, onSnooze, onDelete)
    }, index)), isUserTask && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("span", {
      className: "tooltip-action",
      style: STYLES.action,
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_TaskActionDelete__WEBPACK_IMPORTED_MODULE_8__["default"], {
        postId: task.id,
        taskTitle: task.title?.rendered || task.title,
        onClick: () => onDelete(task.id)
      })
    })]
  });
}

/***/ }),

/***/ "./assets/src/components/TaskItem/TaskCheckbox.js":
/*!********************************************************!*\
  !*** ./assets/src/components/TaskItem/TaskCheckbox.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TaskCheckbox)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _icons_ArrowIcon__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./icons/ArrowIcon */ "./assets/src/components/TaskItem/icons/ArrowIcon.js");
/* harmony import */ var _styles__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./styles */ "./assets/src/components/TaskItem/styles.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);
/**
 * Task Checkbox Component.
 *
 * Renders either a checkbox (for user tasks) or an arrow icon (for suggested tasks).
 *
 * @param {Object}   props                 Component props.
 * @param {boolean}  props.isUserTask      Whether this is a user task.
 * @param {boolean}  props.taskIsCompleted Whether the task is completed.
 * @param {boolean}  props.isCelebrating   Whether the task is being celebrated.
 * @param {Object}   props.task            The task object.
 * @param {Function} props.onChange        Callback for checkbox change.
 * @return {JSX.Element} The checkbox component.
 */





function TaskCheckbox({
  isUserTask,
  taskIsCompleted,
  isCelebrating,
  task,
  onChange
}) {
  if (isUserTask) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
      className: "prpl-suggested-task-checkbox-wrapper",
      style: _styles__WEBPACK_IMPORTED_MODULE_2__.checkboxWrapperStyle,
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("label", {
        style: _styles__WEBPACK_IMPORTED_MODULE_2__.checkboxWrapperStyle,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("input", {
          type: "checkbox",
          className: "prpl-suggested-task-checkbox",
          onChange: onChange,
          style: _styles__WEBPACK_IMPORTED_MODULE_2__.checkboxInputStyle,
          checked: taskIsCompleted,
          disabled: isCelebrating
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("span", {
          className: "screen-reader-text",
          children: [task.title?.rendered || task.title, ":", ' ', (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Mark as complete', 'progress-planner')]
        })]
      })
    });
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
    className: "prpl-suggested-task-checkbox-wrapper",
    style: _styles__WEBPACK_IMPORTED_MODULE_2__.checkboxWrapperStyle,
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_icons_ArrowIcon__WEBPACK_IMPORTED_MODULE_1__["default"], {})
  });
}

/***/ }),

/***/ "./assets/src/components/TaskItem/TaskItemSkeleton.js":
/*!************************************************************!*\
  !*** ./assets/src/components/TaskItem/TaskItemSkeleton.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TaskListSkeleton: () => (/* binding */ TaskListSkeleton),
/* harmony export */   "default": () => (/* binding */ TaskItemSkeleton)
/* harmony export */ });
/* harmony import */ var _Skeleton__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Skeleton */ "./assets/src/components/Skeleton/index.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);
/**
 * TaskItem Skeleton Component
 *
 * Skeleton loading state for the TaskItem component.
 */



/**
 * TaskItemSkeleton component.
 *
 * @param {Object}  props             - Component props.
 * @param {number}  props.index       - Index for alternating background.
 * @param {boolean} props.showActions - Whether to show actions placeholder.
 * @return {JSX.Element} The TaskItemSkeleton component.
 */

function TaskItemSkeleton({
  index = 0,
  showActions = true
}) {
  const containerStyle = {
    margin: 0,
    padding: '0.75rem 0.5rem 0.625rem 0.5rem',
    display: 'grid',
    gridTemplateColumns: '1.5rem 1fr 3.5rem',
    gap: '0.25rem 0.5rem',
    position: 'relative',
    lineHeight: 1,
    backgroundColor: index % 2 === 0 ? 'var(--prpl-background-table)' : 'transparent'
  };
  const checkboxWrapperStyle = {
    display: 'flex',
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  };
  const titleWrapperStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  };
  const pointsWrapperStyle = {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gridRowEnd: 'span 2'
  };
  const actionsWrapperStyle = {
    gridColumn: '2 / span 1',
    display: 'flex',
    gap: '0.5rem',
    paddingTop: '0.25rem'
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("li", {
    style: containerStyle,
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
      style: checkboxWrapperStyle,
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_Skeleton__WEBPACK_IMPORTED_MODULE_0__.SkeletonRect, {
        width: "1rem",
        height: "1rem",
        style: {
          borderRadius: '3px'
        }
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
      style: titleWrapperStyle,
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_Skeleton__WEBPACK_IMPORTED_MODULE_0__.SkeletonRect, {
        width: `${60 + Math.random() * 30}%`,
        height: "1rem"
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
      style: pointsWrapperStyle,
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_Skeleton__WEBPACK_IMPORTED_MODULE_0__.SkeletonCircle, {
        size: "1.5rem"
      })
    }), showActions && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
      style: actionsWrapperStyle,
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_Skeleton__WEBPACK_IMPORTED_MODULE_0__.SkeletonRect, {
        width: "4rem",
        height: "1.5rem"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_Skeleton__WEBPACK_IMPORTED_MODULE_0__.SkeletonRect, {
        width: "4rem",
        height: "1.5rem"
      })]
    })]
  });
}

/**
 * TaskListSkeleton component - renders multiple task item skeletons.
 *
 * @param {Object} props       - Component props.
 * @param {number} props.count - Number of skeleton items to render.
 * @return {JSX.Element} The TaskListSkeleton component.
 */
function TaskListSkeleton({
  count = 4
}) {
  const listStyle = {
    listStyle: 'none',
    padding: 0,
    margin: 0
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("ul", {
    style: listStyle,
    children: Array.from({
      length: count
    }).map((_, i) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(TaskItemSkeleton, {
      index: i
    }, i))
  });
}

/***/ }),

/***/ "./assets/src/components/TaskItem/TaskMoveButtons.js":
/*!***********************************************************!*\
  !*** ./assets/src/components/TaskItem/TaskMoveButtons.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TaskMoveButtons)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _styles__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./styles */ "./assets/src/components/TaskItem/styles.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__);
/**
 * Task Move Buttons Component.
 *
 * Renders move up/down buttons for user tasks.
 *
 * @param {Object}   props            Component props.
 * @param {Object}   props.task       The task object.
 * @param {string}   props.taskId     The task ID for data attributes.
 * @param {Function} props.onMoveUp   Callback for moving up.
 * @param {Function} props.onMoveDown Callback for moving down.
 * @return {JSX.Element} The move buttons component.
 */



function TaskMoveButtons({
  task,
  taskId,
  onMoveUp,
  onMoveDown
}) {
  const taskTitle = task.title?.rendered || task.title;
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
    className: "tooltip-actions prpl-move-buttons-wrapper",
    style: _styles__WEBPACK_IMPORTED_MODULE_1__.moveButtonsWrapperStyle,
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("span", {
      className: "prpl-move-buttons",
      style: _styles__WEBPACK_IMPORTED_MODULE_1__.moveButtonsStyle,
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("button", {
        type: "button",
        className: "prpl-suggested-task-button move-up",
        style: _styles__WEBPACK_IMPORTED_MODULE_1__.moveButtonStyle,
        "data-task-id": taskId,
        "data-task-title": taskTitle,
        "data-action": "move-up",
        "data-target": "move-up",
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Move up', 'progress-planner'),
        onClick: onMoveUp,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("span", {
          className: "dashicons dashicons-arrow-up-alt2"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("span", {
          className: "screen-reader-text",
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Move up', 'progress-planner')
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("button", {
        type: "button",
        className: "prpl-suggested-task-button move-down",
        style: _styles__WEBPACK_IMPORTED_MODULE_1__.moveButtonStyle,
        "data-task-id": taskId,
        "data-task-title": taskTitle,
        "data-action": "move-down",
        "data-target": "move-down",
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Move down', 'progress-planner'),
        onClick: onMoveDown,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("span", {
          className: "dashicons dashicons-arrow-down-alt2"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("span", {
          className: "screen-reader-text",
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Move down', 'progress-planner')
        })]
      })]
    })
  });
}

/***/ }),

/***/ "./assets/src/components/TaskItem/TaskPoints.js":
/*!******************************************************!*\
  !*** ./assets/src/components/TaskItem/TaskPoints.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TaskPoints)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _icons_TrashIcon__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./icons/TrashIcon */ "./assets/src/components/TaskItem/icons/TrashIcon.js");
/* harmony import */ var _styles__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./styles */ "./assets/src/components/TaskItem/styles.js");
/* harmony import */ var _utils_taskUtils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../utils/taskUtils */ "./assets/src/utils/taskUtils/index.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__);
/**
 * Task Points Component.
 *
 * Renders the points badge and trash button (for user tasks).
 *
 * @param {Object}   props            Component props.
 * @param {Object}   props.task       The task object.
 * @param {boolean}  props.isUserTask Whether this is a user task.
 * @param {Function} props.onDelete   Callback for deleting a task.
 * @return {JSX.Element} The points component.
 */





function TaskPoints({
  task,
  isUserTask,
  onDelete
}) {
  const points = (0,_utils_taskUtils__WEBPACK_IMPORTED_MODULE_3__.getTaskPoints)(task);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
    className: "prpl-suggested-task-points-wrapper",
    style: _styles__WEBPACK_IMPORTED_MODULE_2__.pointsWrapperStyle,
    children: [points > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("span", {
      className: "prpl-suggested-task-points",
      style: _styles__WEBPACK_IMPORTED_MODULE_2__.pointsBadgeStyle,
      children: ["+", points]
    }), isUserTask && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("button", {
      type: "button",
      className: "prpl-suggested-task-button trash",
      style: _styles__WEBPACK_IMPORTED_MODULE_2__.trashButtonStyle,
      "data-post-id": task.id,
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Delete', 'progress-planner'),
      onClick: onDelete,
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_icons_TrashIcon__WEBPACK_IMPORTED_MODULE_1__["default"], {}), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("span", {
        className: "screen-reader-text",
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Delete', 'progress-planner')
      })]
    })]
  });
}

/***/ }),

/***/ "./assets/src/components/TaskItem/TaskTitle.js":
/*!*****************************************************!*\
  !*** ./assets/src/components/TaskItem/TaskTitle.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TaskTitle)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _styles__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./styles */ "./assets/src/components/TaskItem/styles.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__);
/**
 * Task Title Component.
 *
 * Renders the task title, either as editable (for user tasks) or read-only.
 *
 * @param {Object}   props               Component props.
 * @param {Object}   props.task          The task object.
 * @param {boolean}  props.isUserTask    Whether this is a user task.
 * @param {boolean}  props.isCompleted   Whether the task is completed.
 * @param {boolean}  props.isCelebrating Whether the task is being celebrated.
 * @param {Object}   props.titleRef      Ref for the title element.
 * @param {Function} props.onKeyDown     Callback for keydown events.
 * @param {Function} props.onInput       Callback for input events.
 * @return {JSX.Element} The title component.
 */



function TaskTitle({
  task,
  isUserTask,
  isCompleted,
  isCelebrating,
  titleRef,
  onKeyDown,
  onInput
}) {
  const titleText = task.title?.rendered || task.title;
  const titleSpanStyle = (0,_styles__WEBPACK_IMPORTED_MODULE_1__.getTitleSpanStyle)(isCelebrating);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
    className: "prpl-suggested-task-title-wrapper",
    style: _styles__WEBPACK_IMPORTED_MODULE_1__.titleWrapperStyle,
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("h3", {
      className: "prpl-task-title",
      style: (0,_styles__WEBPACK_IMPORTED_MODULE_1__.getTitleStyle)(isCompleted),
      children: isUserTask && !isCompleted ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("span", {
        ref: titleRef,
        contentEditable: "plaintext-only",
        role: "textbox",
        tabIndex: 0,
        "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Edit task title', 'progress-planner'),
        "aria-multiline": "false",
        onKeyDown: onKeyDown,
        onInput: onInput,
        suppressContentEditableWarning: true,
        style: titleSpanStyle,
        dangerouslySetInnerHTML: {
          __html: titleText
        }
      }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("span", {
        style: titleSpanStyle,
        dangerouslySetInnerHTML: {
          __html: titleText
        }
      })
    })
  });
}

/***/ }),

/***/ "./assets/src/components/TaskItem/icons/ArrowIcon.js":
/*!***********************************************************!*\
  !*** ./assets/src/components/TaskItem/icons/ArrowIcon.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ArrowIcon)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);

/**
 * Arrow icon SVG for non-user tasks.
 *
 * @return {JSX.Element} The arrow SVG.
 */
function ArrowIcon() {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", {
    style: {
      width: '0.75rem',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("svg", {
      role: "img",
      "aria-hidden": "true",
      focusable: "false",
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 20 17",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", {
        fill: "#6b7280",
        d: "M19.92 8.12c-.05-.12-.12-.23-.22-.33L12.21.29A.996.996 0 1 0 10.8 1.7l5.79 5.79H1c-.55 0-1 .45-1 1s.45 1 1 1h15.59l-5.79 5.79a.996.996 0 0 0 .71 1.7c.26 0 .51-.1.71-.29l7.5-7.5c.1-.1.17-.21.22-.33.05-.12.07-.24.08-.38 0-.14-.03-.27-.08-.38Z"
      })
    })
  });
}

/***/ }),

/***/ "./assets/src/components/TaskItem/icons/TrashIcon.js":
/*!***********************************************************!*\
  !*** ./assets/src/components/TaskItem/icons/TrashIcon.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TrashIcon)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);

/**
 * Trash icon SVG.
 *
 * @return {JSX.Element} The trash SVG.
 */
function TrashIcon() {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("svg", {
    role: "img",
    "aria-hidden": "true",
    focusable: "false",
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 48 48",
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", {
      fill: "#9ca3af",
      d: "M32.99 47.88H15.01c-3.46 0-6.38-2.7-6.64-6.15L6.04 11.49l-.72.12c-.82.14-1.59-.41-1.73-1.22-.14-.82.41-1.59 1.22-1.73.79-.14 1.57-.26 2.37-.38h.02c2.21-.33 4.46-.6 6.69-.81v-.72c0-3.56 2.74-6.44 6.25-6.55 2.56-.08 5.15-.08 7.71 0 3.5.11 6.25 2.99 6.25 6.55v.72c2.24.2 4.48.47 6.7.81.79.12 1.59.25 2.38.39.82.14 1.36.92 1.22 1.73-.14.82-.92 1.36-1.73 1.22l-.72-.12-2.33 30.24c-.27 3.45-3.18 6.15-6.64 6.15Zm-17.98-3h17.97c1.9 0 3.51-1.48 3.65-3.38l2.34-30.46c-2.15-.3-4.33-.53-6.48-.7h-.03c-5.62-.43-11.32-.43-16.95 0h-.03c-2.15.17-4.33.4-6.48.7l2.34 30.46c.15 1.9 1.75 3.38 3.65 3.38ZM24 7.01c2.37 0 4.74.07 7.11.22v-.49c0-1.93-1.47-3.49-3.34-3.55-2.5-.08-5.03-.08-7.52 0-1.88.06-3.34 1.62-3.34 3.55v.49c2.36-.15 4.73-.22 7.11-.22Zm5.49 32.26h-.06c-.83-.03-1.47-.73-1.44-1.56l.79-20.65c.03-.83.75-1.45 1.56-1.44.83.03 1.47.73 1.44 1.56l-.79 20.65c-.03.81-.7 1.44-1.5 1.44Zm-10.98 0c-.8 0-1.47-.63-1.5-1.44l-.79-20.65c-.03-.83.61-1.52 1.44-1.56.84 0 1.52.61 1.56 1.44l.79 20.65c.03.83-.61 1.52-1.44 1.56h-.06Z"
    })
  });
}

/***/ }),

/***/ "./assets/src/components/TaskItem/index.js":
/*!*************************************************!*\
  !*** ./assets/src/components/TaskItem/index.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TaskItem)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _TaskActions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./TaskActions */ "./assets/src/components/TaskItem/TaskActions.js");
/* harmony import */ var _TaskCheckbox__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./TaskCheckbox */ "./assets/src/components/TaskItem/TaskCheckbox.js");
/* harmony import */ var _TaskTitle__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./TaskTitle */ "./assets/src/components/TaskItem/TaskTitle.js");
/* harmony import */ var _TaskPoints__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./TaskPoints */ "./assets/src/components/TaskItem/TaskPoints.js");
/* harmony import */ var _TaskMoveButtons__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./TaskMoveButtons */ "./assets/src/components/TaskItem/TaskMoveButtons.js");
/* harmony import */ var _styles__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./styles */ "./assets/src/components/TaskItem/styles.js");
/* harmony import */ var _utils_taskUtils__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../utils/taskUtils */ "./assets/src/utils/taskUtils/index.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__);
/**
 * Task Item Component.
 *
 * Renders a single task item with its controls.
 * Shared between SuggestedTasks and TodoWidget.
 */










/**
 * Task Item component.
 *
 * @param {Object}   props                 Component props.
 * @param {Object}   props.task            The task object.
 * @param {boolean}  props.isUserTask      Whether this is a user task.
 * @param {boolean}  props.isCelebrating   Whether the task is being celebrated.
 * @param {boolean}  props.isCompleted     Whether the task is completed (for TodoWidget).
 * @param {number}   props.index           The index of the task in the list.
 * @param {boolean}  props.showMoveButtons Whether to show move up/down buttons.
 * @param {boolean}  props.showActions     Whether to show task actions row.
 * @param {Function} props.onComplete      Callback for completing a task.
 * @param {Function} props.onSnooze        Callback for snoozing a task.
 * @param {Function} props.onDelete        Callback for deleting a task.
 * @param {Function} props.onMove          Callback for moving a task.
 * @param {Function} props.onTitleChange   Callback for changing the title.
 * @return {JSX.Element} The task item component.
 */

function TaskItem({
  task,
  isUserTask,
  isCelebrating,
  isCompleted = false,
  index = 0,
  showMoveButtons = true,
  showActions = true,
  onComplete,
  onSnooze,
  onDelete,
  onMove,
  onTitleChange
}) {
  const titleRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const debounceTimeoutRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);

  /**
   * Determine task action based on status.
   *
   * @return {string} The task action.
   */
  const getTaskAction = () => {
    if (task.status === 'pending') {
      return 'celebrate';
    }
    if (isCelebrating) {
      return 'celebrate';
    }
    if (isCompleted) {
      return 'completed';
    }
    return '';
  };

  /**
   * Check if task is completed (for user tasks).
   */
  const taskIsCompleted = isCompleted || task.status === 'trash' || task.status === 'pending';

  /**
   * Handle checkbox change for user tasks.
   */
  const handleCheckboxChange = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    onComplete(task.id, task);
  }, [task, onComplete]);

  /**
   * Handle title keydown to prevent enter key.
   *
   * @param {KeyboardEvent} event The keyboard event.
   */
  const handleTitleKeyDown = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(event => {
    if (event.key === 'Enter') {
      event.preventDefault();
      event.stopPropagation();
      event.target.blur();
      return false;
    }
  }, []);

  /**
   * Handle title input with debounce.
   */
  const handleTitleInput = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    clearTimeout(debounceTimeoutRef.current);
    debounceTimeoutRef.current = setTimeout(() => {
      if (titleRef.current) {
        const newTitle = titleRef.current.textContent.replace(/\n/g, '');
        onTitleChange(task.id, newTitle);
      }
    }, 300);
  }, [task.id, onTitleChange]);

  /**
   * Cleanup debounce timeout on unmount.
   */
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  /**
   * Handle move up.
   */
  const handleMoveUp = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    onMove(task.id, 'up');
  }, [task.id, onMove]);

  /**
   * Handle move down.
   */
  const handleMoveDown = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    onMove(task.id, 'down');
  }, [task.id, onMove]);

  /**
   * Handle trash click for user tasks.
   */
  const handleTrash = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    onDelete(task.id);
  }, [task.id, onDelete]);

  // Get the task ID for the data attribute.
  const taskId = task.slug || task.id;

  // Get the provider slug.
  const providerSlug = task.prpl_provider?.slug || (isUserTask ? 'user' : '');

  // Build the class name.
  const className = ['prpl-suggested-task', isCelebrating ? 'prpl-suggested-task-celebrated' : ''].filter(Boolean).join(' ');
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("li", {
    className: className,
    style: (0,_styles__WEBPACK_IMPORTED_MODULE_6__.getTaskItemStyle)(index),
    "data-task-id": taskId,
    "data-post-id": task.id,
    "data-task-action": getTaskAction(),
    "data-task-provider-id": providerSlug,
    "data-task-points": (0,_utils_taskUtils__WEBPACK_IMPORTED_MODULE_7__.getTaskPoints)(task),
    "data-task-order": task.menu_order || 0,
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_TaskCheckbox__WEBPACK_IMPORTED_MODULE_2__["default"], {
      isUserTask: isUserTask,
      taskIsCompleted: taskIsCompleted,
      isCelebrating: isCelebrating,
      task: task,
      onChange: handleCheckboxChange
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_TaskTitle__WEBPACK_IMPORTED_MODULE_3__["default"], {
      task: task,
      isUserTask: isUserTask,
      isCompleted: isCompleted,
      isCelebrating: isCelebrating,
      titleRef: titleRef,
      onKeyDown: handleTitleKeyDown,
      onInput: handleTitleInput
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_TaskPoints__WEBPACK_IMPORTED_MODULE_4__["default"], {
      task: task,
      isUserTask: isUserTask,
      onDelete: handleTrash
    }), isUserTask && showMoveButtons && !isCompleted && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_TaskMoveButtons__WEBPACK_IMPORTED_MODULE_5__["default"], {
      task: task,
      taskId: taskId,
      onMoveUp: handleMoveUp,
      onMoveDown: handleMoveDown
    }), showActions && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("div", {
      className: "prpl-suggested-task-actions-wrapper",
      style: _styles__WEBPACK_IMPORTED_MODULE_6__.actionsWrapperStyle,
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_TaskActions__WEBPACK_IMPORTED_MODULE_1__["default"], {
        task: task,
        isUserTask: isUserTask,
        onComplete: onComplete,
        onSnooze: onSnooze,
        onDelete: onDelete
      })
    })]
  });
}

/***/ }),

/***/ "./assets/src/components/TaskItem/styles.js":
/*!**************************************************!*\
  !*** ./assets/src/components/TaskItem/styles.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   actionsWrapperStyle: () => (/* binding */ actionsWrapperStyle),
/* harmony export */   buttonStyle: () => (/* binding */ buttonStyle),
/* harmony export */   checkboxInputStyle: () => (/* binding */ checkboxInputStyle),
/* harmony export */   checkboxWrapperStyle: () => (/* binding */ checkboxWrapperStyle),
/* harmony export */   getTaskItemStyle: () => (/* binding */ getTaskItemStyle),
/* harmony export */   getTitleSpanStyle: () => (/* binding */ getTitleSpanStyle),
/* harmony export */   getTitleStyle: () => (/* binding */ getTitleStyle),
/* harmony export */   moveButtonStyle: () => (/* binding */ moveButtonStyle),
/* harmony export */   moveButtonsStyle: () => (/* binding */ moveButtonsStyle),
/* harmony export */   moveButtonsWrapperStyle: () => (/* binding */ moveButtonsWrapperStyle),
/* harmony export */   pointsBadgeStyle: () => (/* binding */ pointsBadgeStyle),
/* harmony export */   pointsWrapperStyle: () => (/* binding */ pointsWrapperStyle),
/* harmony export */   titleWrapperStyle: () => (/* binding */ titleWrapperStyle),
/* harmony export */   trashButtonStyle: () => (/* binding */ trashButtonStyle)
/* harmony export */ });
/**
 * Style objects and functions for TaskItem component.
 */

/**
 * Get the task item container style.
 *
 * @param {number} index The index of the task in the list.
 * @return {Object} Style object.
 */
function getTaskItemStyle(index) {
  return {
    margin: 0,
    padding: '0.75rem 0.5rem 0.625rem 0.5rem',
    display: 'grid',
    gridTemplateColumns: '1.5rem 1fr 3.5rem',
    gap: '0.25rem 0.5rem',
    position: 'relative',
    lineHeight: 1,
    // nth-child(odd) background - using index prop
    backgroundColor: index % 2 === 0 ? 'var(--prpl-background-table)' : 'transparent'
  };
}

/**
 * Checkbox wrapper style.
 */
const checkboxWrapperStyle = {
  display: 'flex',
  width: '100%',
  gap: 0,
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center'
};

/**
 * Title wrapper style.
 */
const titleWrapperStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  justifyContent: 'space-between'
};

/**
 * Get the title style.
 *
 * @param {boolean} isCompleted Whether the task is completed.
 * @return {Object} Style object.
 */
function getTitleStyle(isCompleted) {
  return {
    width: '100%',
    color: 'var(--prpl-color-text)',
    fontSize: '1rem',
    margin: 0,
    fontWeight: 500,
    ...(isCompleted ? {
      textDecoration: 'line-through'
    } : {})
  };
}

/**
 * Get the title span style.
 *
 * @param {boolean} isCelebrating Whether the task is being celebrated.
 * @return {Object} Style object.
 */
function getTitleSpanStyle(isCelebrating) {
  return {
    textDecoration: 'none',
    backgroundImage: 'linear-gradient(#000, #000)',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center left',
    backgroundSize: isCelebrating ? '100% 1px' : '0% 1px',
    transition: 'background-size 500ms ease-in-out'
  };
}

/**
 * Points wrapper style.
 */
const pointsWrapperStyle = {
  display: 'flex',
  gap: '0.5rem',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gridRowEnd: 'span 2'
};

/**
 * Points badge style.
 */
const pointsBadgeStyle = {
  fontSize: 'var(--prpl-font-size-xs)',
  fontWeight: 700,
  color: 'var(--prpl-text-point)',
  backgroundColor: 'var(--prpl-background-point)',
  width: '1.5rem',
  height: '1.5rem',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

/**
 * Base button style.
 */
const buttonStyle = {
  padding: '0.1rem',
  lineHeight: 0,
  margin: 0,
  background: 'none',
  border: 'none',
  cursor: 'pointer'
};

/**
 * Trash button style.
 */
const trashButtonStyle = {
  ...buttonStyle,
  padding: 0,
  color: 'var(--prpl-color-ui-icon)',
  boxShadow: 'none',
  marginTop: '1px'
};

/**
 * Move buttons wrapper style.
 */
const moveButtonsWrapperStyle = {
  position: 'absolute',
  left: 'calc(-8px - 0.5rem)',
  top: '50%',
  transform: 'translateY(-50%)',
  padding: '10px 10px 10px 0'
};

/**
 * Move buttons container style.
 */
const moveButtonsStyle = {
  display: 'flex',
  width: '100%',
  gap: 0,
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center'
};

/**
 * Move button style.
 */
const moveButtonStyle = {
  ...buttonStyle,
  padding: 0,
  height: '0.75rem',
  color: 'var(--prpl-color-ui-icon)',
  boxShadow: 'none',
  marginTop: '1px'
};

/**
 * Actions wrapper style.
 */
const actionsWrapperStyle = {
  gridColumn: '2 / span 1',
  display: 'flex'
};

/**
 * Checkbox input style.
 */
const checkboxInputStyle = {
  margin: 0,
  flexShrink: 0
};

/***/ }),

/***/ "./assets/src/components/WidgetHeader/index.js":
/*!*****************************************************!*\
  !*** ./assets/src/components/WidgetHeader/index.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ WidgetHeader)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);
/**
 * WidgetHeader Component
 *
 * Renders a widget title with optional info tooltip.
 */



/**
 * WidgetHeader component.
 *
 * @param {Object} props                - Component props.
 * @param {string} props.title          - Widget title.
 * @param {string} props.infoIconSvg    - SVG markup for the info icon.
 * @param {string} props.tooltipContent - Content to display in the tooltip.
 * @param {string} props.className      - Optional additional CSS class.
 * @return {JSX.Element} The widget header.
 */

function WidgetHeader({
  title,
  infoIconSvg = '',
  tooltipContent = '',
  className = ''
}) {
  const hasTooltip = infoIconSvg && tooltipContent;
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("h2", {
    className: `prpl-widget-title${className ? ` ${className}` : ''}`,
    children: [title, hasTooltip && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
      className: "tooltip-actions",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("prpl-tooltip", {
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("slot", {
          name: "open-icon",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("span", {
            className: "icon prpl-info-icon",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("span", {
              dangerouslySetInnerHTML: {
                __html: infoIconSvg
              }
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("span", {
              className: "screen-reader-text",
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('More info', 'progress-planner')
            })]
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("slot", {
          name: "content",
          children: tooltipContent
        })]
      })
    })]
  });
}

/***/ }),

/***/ "./assets/src/hooks/useCelebration/index.js":
/*!**************************************************!*\
  !*** ./assets/src/hooks/useCelebration/index.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   useCelebration: () => (/* binding */ useCelebration)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var canvas_confetti__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! canvas-confetti */ "./node_modules/canvas-confetti/dist/confetti.module.mjs");
/* harmony import */ var _utils_gridResize__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../utils/gridResize */ "./assets/src/utils/gridResize/index.js");
/**
 * Celebration Hook.
 *
 * Provides functions for triggering task completion celebrations.
 */





/**
 * Custom hook for task celebration functionality.
 *
 * @return {Object} Object containing celebration functions.
 */
function useCelebration() {
  /**
   * Trigger celebration for a completed task.
   *
   * Renders confetti animation using canvas-confetti library.
   *
   * @param {HTMLElement} element The task element to celebrate.
   */
  const celebrate = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(element => {
    // Get container element
    const containerEl = element?.closest('.prpl-suggested-tasks-list') || document.querySelector('.prpl-widget-wrapper.prpl-suggested-tasks .prpl-suggested-tasks-list');

    // Calculate origin (normalized 0-1)
    const origin = containerEl ? {
      x: (containerEl.getBoundingClientRect().left + containerEl.offsetWidth / 2) / window.innerWidth,
      y: (containerEl.getBoundingClientRect().top + 50) / window.innerHeight
    } : {
      x: 0.5,
      y: 0.3
    };

    // Get config from window.prplCelebrate (localized from PHP)
    const config = window.prplCelebrate || {};

    // Default confetti options
    const defaults = {
      spread: 360,
      ticks: 50,
      gravity: 1,
      decay: 0.94,
      startVelocity: 30,
      shapes: ['star'],
      colors: ['FFE400', 'FFBD00', 'E89400', 'FFCA6C', 'FDFFB8']
    };

    // Get confetti options (from PHP or default)
    let confettiOptions = [{
      particleCount: 30,
      scalar: 4,
      shapes: ['image'],
      shapeOptions: {
        image: [{
          src: config.raviIconUrl
        }, {
          src: config.raviIconUrl
        }, {
          src: config.raviIconUrl
        }, {
          src: config.monthIconUrl
        }, {
          src: config.contentIconUrl
        }, {
          src: config.maintenanceIconUrl
        }]
      }
    }];

    // Triple check if the confetti options are an array and not undefined.
    if (typeof config.confettiOptions !== 'undefined' && Array.isArray(config.confettiOptions) && config.confettiOptions.length > 0) {
      confettiOptions = config.confettiOptions;
    }

    // Render confetti with delays (0ms, 100ms, 200ms)
    [0, 100, 200].forEach(delay => {
      setTimeout(() => {
        confettiOptions.forEach(option => {
          (0,canvas_confetti__WEBPACK_IMPORTED_MODULE_1__["default"])({
            ...defaults,
            ...option,
            origin
          });
        });
      }, delay);
    });

    // Remove admin menu points badge
    const points = document.querySelectorAll('#adminmenu #toplevel_page_progress-planner .update-plugins');
    points.forEach(point => point.remove());
  }, []);

  /**
   * Trigger grid resize event.
   *
   * This dispatches the 'prpl/grid/resize' event which is handled
   * by the grid masonry layout to recalculate item positions.
   */
  const triggerGridResize = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    (0,_utils_gridResize__WEBPACK_IMPORTED_MODULE_2__.dispatchGridResize)();
  }, []);
  return {
    celebrate,
    triggerGridResize
  };
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (useCelebration);

/***/ }),

/***/ "./assets/src/hooks/useCustomSubmitHandlers/index.js":
/*!***********************************************************!*\
  !*** ./assets/src/hooks/useCustomSubmitHandlers/index.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useCustomSubmitHandlers: () => (/* binding */ useCustomSubmitHandlers)
/* harmony export */ });
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/api-fetch */ "@wordpress/api-fetch");
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _usePopoverForms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../usePopoverForms */ "./assets/src/hooks/usePopoverForms/index.js");
/**
 * Custom Submit Handlers Hook.
 *
 * Provides a registry of custom submit handlers for specific task types.
 * Handlers accept task data as parameters instead of reading from global window objects.
 * Falls back to window objects for backward compatibility during migration.
 *
 * @module hooks/useCustomSubmitHandlers
 */




/**
 * Handle hello-world task submission.
 *
 * Deletes the "Hello World!" post created by WordPress on installation.
 * Attempts to get post ID from task data, falling back to window object for compatibility.
 *
 * @param {Object} task                         The task object containing post ID information.
 * @param {number} [task.prpl_task_data.postId] Post ID from task data.
 * @param {number} [task.postId]                Post ID from task object.
 * @return {Promise<{success: boolean}>} Promise resolving to success response.
 */
async function handleHelloWorld(task) {
  const postId = task.prpl_task_data?.postId || task.postId || window.helloWorldData?.postId;
  if (postId) {
    await (0,_usePopoverForms__WEBPACK_IMPORTED_MODULE_1__.deletePost)(postId, 'posts');
  }
  return {
    success: true
  };
}

/**
 * Handle sample-page task submission.
 *
 * Deletes the "Sample Page" created by WordPress on installation.
 * Attempts to get page ID from task data, falling back to window object for compatibility.
 *
 * @param {Object} task                         The task object containing page ID information.
 * @param {number} [task.prpl_task_data.pageId] Page ID from task data.
 * @param {number} [task.pageId]                Page ID from task object.
 * @return {Promise<{success: boolean}>} Promise resolving to success response.
 */
async function handleSamplePage(task) {
  const pageId = task.prpl_task_data?.pageId || task.pageId || window.samplePageData?.postId;
  if (pageId) {
    await (0,_usePopoverForms__WEBPACK_IMPORTED_MODULE_1__.deletePost)(pageId, 'pages');
  }
  return {
    success: true
  };
}

/**
 * Handle remove-terms-without-posts task submission.
 *
 * Deletes taxonomy terms that have no associated posts.
 * Attempts to get term IDs and taxonomy from task data, falling back to window object.
 *
 * @param {Object}   task                           The task object containing term information.
 * @param {number[]} [task.prpl_task_data.termIds]  Array of term IDs from task data.
 * @param {number[]} [task.termIds]                 Array of term IDs from task object.
 * @param {string}   [task.prpl_task_data.taxonomy] Taxonomy name from task data.
 * @param {string}   [task.taxonomy]                Taxonomy name from task object.
 * @return {Promise<{success: boolean}>} Promise resolving to success response.
 */
async function handleRemoveTermsWithoutPosts(task) {
  const termIds = task.prpl_task_data?.termIds || task.termIds || window.removeTermsWithoutPostsData?.termIds || [];
  const taxonomy = task.prpl_task_data?.taxonomy || task.taxonomy || window.removeTermsWithoutPostsData?.taxonomy || 'category';
  if (termIds.length === 0) {
    return {
      success: true
    };
  }
  const taxonomyEndpoint = taxonomy === 'category' ? 'categories' : taxonomy;

  // Delete each term
  await Promise.all(termIds.map(termId => _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_0___default()({
    path: `/wp/v2/${taxonomyEndpoint}/${termId}?force=true`,
    method: 'DELETE'
  })));
  return {
    success: true
  };
}

/**
 * Registry of custom submit handlers by task ID.
 *
 * @type {Object<string, Function>}
 */
const CUSTOM_SUBMIT_HANDLERS = {
  'hello-world': handleHelloWorld,
  'sample-page': handleSamplePage,
  'remove-terms-without-posts': handleRemoveTermsWithoutPosts,
  // These tasks are handled by their respective popover components:
  'rename-uncategorized-category': async () => ({
    success: true
  }),
  'core-siteicon': async () => ({
    success: true
  }),
  'yoast-organization-logo': async () => ({
    success: true
  }),
  'update-term-description': async () => ({
    success: true
  })
};

/**
 * Get custom submit handler for a task ID.
 *
 * @param {string} taskId The task ID.
 * @return {Function|null} The handler function or null if not found.
 */
function getCustomSubmitHandler(taskId) {
  return CUSTOM_SUBMIT_HANDLERS[taskId] || null;
}

/**
 * Custom hook to get a custom submit handler function.
 *
 * Returns a function that can handle custom submit logic for various task types.
 * The returned function looks up the appropriate handler from the registry.
 *
 * @param {Object|null} task The task object containing task data, or null if no task is open.
 * @return {Function} A function that handles custom submit for a given task ID.
 *                    Signature: (taskId: string, popoverId?: string) => Promise<{success: boolean}>
 */
function useCustomSubmitHandlers(task) {
  /**
   * Handle custom submit for a task.
   *
   * @param {string} taskId The task ID to handle.
   * @return {Promise<{success: boolean}>} Promise resolving to success response.
   */
  return async taskId => {
    if (!taskId) {
      // eslint-disable-next-line no-console
      console.warn('useCustomSubmitHandlers: No taskId provided');
      return {
        success: false
      };
    }
    const handler = getCustomSubmitHandler(taskId);
    if (handler) {
      // Pass task (may be null) to handler - handlers should handle null gracefully
      return handler(task || {});
    }

    // Default: return success for unknown tasks
    return {
      success: true
    };
  };
}

/***/ }),

/***/ "./assets/src/hooks/useGridMasonry/index.js":
/*!**************************************************!*\
  !*** ./assets/src/hooks/useGridMasonry/index.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useGridMasonry: () => (/* binding */ useGridMasonry)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/**
 * useGridMasonry Hook
 *
 * Handles CSS grid masonry layout for dashboard widgets.
 * Listens for 'prpl/grid/resize' events and calculates grid-row-end spans.
 */



/**
 * Hook to handle grid masonry layout for widgets.
 *
 * This hook sets up event listeners for:
 * - 'prpl/grid/resize' custom event (dispatched by widgets when content changes)
 * - 'resize' window event (for responsive layout)
 * - 'load' window event (for initial layout after all resources load)
 */
function useGridMasonry() {
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    /**
     * Handle grid resize by calculating row spans for each widget.
     */
    const handleGridResize = () => {
      document.querySelectorAll('.prpl-widget-wrapper').forEach(item => {
        if (!item || item.classList.contains('in-popover')) {
          return;
        }
        const innerContainer = item.querySelector('.widget-inner-container');
        if (!innerContainer) {
          return;
        }
        const container = document.querySelector('.prpl-widgets-container');
        if (!container) {
          return;
        }
        const rowHeight = parseInt(window.getComputedStyle(container).getPropertyValue('grid-auto-rows'));
        const paddingTop = parseInt(window.getComputedStyle(item).getPropertyValue('padding-top'));
        const paddingBottom = parseInt(window.getComputedStyle(item).getPropertyValue('padding-bottom'));
        const rowSpan = Math.ceil((innerContainer.getBoundingClientRect().height + paddingTop + paddingBottom) / rowHeight);
        item.style.gridRowEnd = 'span ' + (rowSpan + 1);
      });
    };

    /**
     * Trigger resize with a small delay.
     */
    const triggerResize = () => {
      setTimeout(handleGridResize, 0);
    };

    // Listen for custom event from widgets.
    window.addEventListener('prpl/grid/resize', handleGridResize);
    window.addEventListener('resize', triggerResize);
    window.addEventListener('load', triggerResize);

    // Initial calls.
    triggerResize();
    setTimeout(triggerResize, 1000);

    // Cleanup on unmount.
    return () => {
      window.removeEventListener('prpl/grid/resize', handleGridResize);
      window.removeEventListener('resize', triggerResize);
      window.removeEventListener('load', triggerResize);
    };
  }, []);
}

/***/ }),

/***/ "./assets/src/hooks/usePopoverForms/index.js":
/*!***************************************************!*\
  !*** ./assets/src/hooks/usePopoverForms/index.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   closePopover: () => (/* binding */ closePopover),
/* harmony export */   deletePost: () => (/* binding */ deletePost),
/* harmony export */   submitCustom: () => (/* binding */ submitCustom),
/* harmony export */   submitPluginSettings: () => (/* binding */ submitPluginSettings),
/* harmony export */   submitSiteSettings: () => (/* binding */ submitSiteSettings),
/* harmony export */   submitSubscribeForm: () => (/* binding */ submitSubscribeForm)
/* harmony export */ });
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/api-fetch */ "@wordpress/api-fetch");
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/**
 * Popover Forms Hook.
 *
 * Handles form submission logic for interactive task popovers.
 * Replaces the vanilla JS prplInteractiveTaskFormListener.
 */




/**
 * Show loading state on a form.
 *
 * @param {HTMLFormElement} formElement The form element.
 */
function showLoading(formElement) {
  let submitButton = formElement.querySelector('button[type="submit"]');
  if (!submitButton) {
    submitButton = formElement.querySelector('button[data-action="completeTask"]');
  }
  if (submitButton) {
    submitButton.disabled = true;

    // Add spinner.
    const spinner = document.createElement('span');
    spinner.classList.add('prpl-spinner');
    spinner.innerHTML = '<span class="spinner" style="visibility: visible;"></span>';
    submitButton.after(spinner);
  }
}

/**
 * Hide loading state on a form.
 *
 * @param {HTMLFormElement} formElement The form element.
 */
function hideLoading(formElement) {
  let submitButton = formElement.querySelector('button[type="submit"]');
  if (!submitButton) {
    submitButton = formElement.querySelector('button[data-action="completeTask"]');
  }
  if (submitButton) {
    submitButton.disabled = false;
  }
  const spinner = formElement.querySelector('span.prpl-spinner');
  if (spinner) {
    spinner.remove();
  }
}

/**
 * Show error message on a form.
 *
 * @param {string} popoverId The popover ID.
 */
function showError(popoverId) {
  const formElement = document.querySelector(`#${popoverId} form`);
  if (!formElement) {
    return;
  }

  // Check if there's already an error message
  const existingError = formElement.parentNode.querySelector('p.prpl-interactive-task-error-message');
  if (!existingError) {
    const errorParagraph = document.createElement('p');
    errorParagraph.classList.add('prpl-note', 'prpl-note-error', 'prpl-interactive-task-error-message');
    errorParagraph.textContent = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Something went wrong. Please try again.', 'progress-planner');
    formElement.insertAdjacentElement('afterend', errorParagraph);
  }
}

/**
 * Clear error message from a form.
 *
 * @param {string} popoverId The popover ID.
 */
function clearError(popoverId) {
  const formElement = document.querySelector(`#${popoverId} form`);
  if (!formElement) {
    return;
  }
  const existingError = formElement.parentNode.querySelector('p.prpl-interactive-task-error-message');
  if (existingError) {
    existingError.remove();
  }
}

/**
 * Submit site settings via WordPress REST API.
 *
 * @param {Object}   options                      Options object.
 * @param {string}   options.settingAPIKey        The API key for the setting.
 * @param {string}   options.setting              The form field name.
 * @param {string}   options.popoverId            The popover ID (for error display).
 * @param {Function} options.settingCallbackValue Optional callback to transform the value.
 * @param {*}        options.value                The form value (if provided, skips DOM query).
 * @return {Promise} Promise resolving to the response.
 */
async function submitSiteSettings({
  settingAPIKey,
  setting,
  popoverId,
  settingCallbackValue = val => val,
  value: providedValue = null
}) {
  const formElement = document.querySelector(`#${popoverId} form`);
  if (!formElement && providedValue === null) {
    throw new Error('Form not found and no value provided');
  }
  if (formElement) {
    showLoading(formElement);
  }
  clearError(popoverId);
  try {
    const formValue = providedValue !== null ? providedValue : new FormData(formElement).get(setting);
    const settingValue = settingCallbackValue(formValue);
    const response = await _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_0___default()({
      path: '/wp/v2/settings',
      method: 'POST',
      data: {
        [settingAPIKey]: settingValue
      }
    });
    if (formElement) {
      hideLoading(formElement);
    }
    return response;
  } catch (error) {
    if (formElement) {
      hideLoading(formElement);
    }
    showError(popoverId);
    throw error;
  }
}

/**
 * Submit plugin settings via REST API.
 *
 * @param {Object}   options                      Options object.
 * @param {string}   options.setting              The setting name.
 * @param {string}   options.settingPath          The setting path (JSON string).
 * @param {string}   options.popoverId            The popover ID (for error display).
 * @param {Function} options.settingCallbackValue Optional callback to transform the value.
 * @param {*}        options.value                The form value (if provided, skips DOM query).
 * @return {Promise} Promise resolving to the response.
 */
async function submitPluginSettings({
  setting,
  settingPath = false,
  popoverId,
  settingCallbackValue = val => val,
  value: providedValue = null
}) {
  const formElement = document.querySelector(`#${popoverId} form`);
  if (!formElement && providedValue === null) {
    throw new Error('Form not found and no value provided');
  }
  if (formElement) {
    showLoading(formElement);
  }
  clearError(popoverId);
  try {
    const formValue = providedValue !== null ? providedValue : new FormData(formElement).get(setting);
    const settingValue = settingCallbackValue(formValue);

    // Use REST API instead of AJAX
    // Convert settingPath to JSON string if it's an array or already a string
    let settingPathValue = '';
    if (settingPath) {
      if (Array.isArray(settingPath)) {
        settingPathValue = JSON.stringify(settingPath);
      } else if (typeof settingPath === 'string') {
        // If it's already a JSON string, use it as-is
        settingPathValue = settingPath;
      }
    }
    const response = await _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_0___default()({
      path: '/progress-planner/v1/popover/submit',
      method: 'POST',
      data: {
        setting,
        value: settingValue,
        setting_path: settingPathValue
      }
    });
    if (formElement) {
      hideLoading(formElement);
    }
    if (response.success !== true) {
      showError(popoverId);
      throw new Error('Settings update failed');
    }
    return response;
  } catch (error) {
    if (formElement) {
      hideLoading(formElement);
    }
    showError(popoverId);
    throw error;
  }
}

/**
 * Submit custom callback.
 *
 * @param {Object}   options           Options object.
 * @param {string}   options.popoverId The popover ID.
 * @param {Function} options.callback  The callback function returning a Promise.
 * @return {Promise} Promise resolving to the response.
 */
async function submitCustom({
  popoverId,
  callback
}) {
  const formElement = document.querySelector(`#${popoverId} form`);
  if (!formElement) {
    throw new Error('Form not found');
  }
  showLoading(formElement);
  clearError(popoverId);
  try {
    const response = await callback();
    hideLoading(formElement);
    if (response.success !== true) {
      showError(popoverId);
      throw new Error('Custom submit failed');
    }
    return response;
  } catch (error) {
    hideLoading(formElement);
    showError(popoverId);
    throw error;
  }
}

/**
 * Delete a WordPress post.
 *
 * @param {number} postId   The post ID.
 * @param {string} postType The post type (default: 'posts').
 * @return {Promise} Promise resolving to the response.
 */
async function deletePost(postId, postType = 'posts') {
  return _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_0___default()({
    path: `/wp/v2/${postType}/${postId}?force=true`,
    method: 'DELETE'
  });
}

/**
 * Close a popover by ID.
 *
 * @param {string} popoverId The popover ID.
 */
function closePopover(popoverId) {
  const popover = document.getElementById(popoverId);
  if (popover && typeof popover.hidePopover === 'function') {
    popover.hidePopover();
  }
}

/**
 * Submit subscribe form via REST API.
 *
 * @param {Object} options           Options object.
 * @param {string} options.name      The user's name.
 * @param {string} options.email     The user's email.
 * @param {string} options.popoverId The popover ID (for error display).
 * @return {Promise} Promise resolving to the response.
 */
async function submitSubscribeForm({
  name,
  email,
  popoverId
}) {
  const formElement = document.querySelector(`#${popoverId} form`);
  if (!formElement) {
    throw new Error('Form not found');
  }
  showLoading(formElement);
  clearError(popoverId);
  try {
    const siteUrl = window.location.origin;
    const timezoneOffset = new Date().getTimezoneOffset() / -60;
    const response = await _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_0___default()({
      path: '/progress-planner/v1/popover/subscribe',
      method: 'POST',
      data: {
        name: name.trim(),
        email: email.trim(),
        site: siteUrl,
        timezone_offset: timezoneOffset,
        with_email: 'yes'
      }
    });
    hideLoading(formElement);
    if (response.success !== true) {
      showError(popoverId);
      throw new Error('Subscription failed');
    }
    return response;
  } catch (error) {
    hideLoading(formElement);
    showError(popoverId);
    throw error;
  }
}

/***/ }),

/***/ "./assets/src/hooks/usePopoverHooks/index.js":
/*!***************************************************!*\
  !*** ./assets/src/hooks/usePopoverHooks/index.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   usePopoverHooks: () => (/* binding */ usePopoverHooks)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/hooks */ "@wordpress/hooks");
/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_hooks__WEBPACK_IMPORTED_MODULE_1__);
/**
 * Popover Hooks Custom Hook.
 *
 * Manages WordPress hook registration and cleanup for popover open/close events.
 * Prevents stale closures by using refs to store the latest callbacks.
 * Handles errors during hook registration/cleanup gracefully.
 *
 * @module hooks/usePopoverHooks
 */




/**
 * Custom hook to manage popover hooks.
 *
 * Registers WordPress actions for 'prpl.popover.open' and 'prpl.popover.close'.
 * Uses refs to prevent stale closures when callbacks change.
 * Automatically cleans up hooks on unmount.
 *
 * @param {Function} onPopoverOpen  Callback when popover opens.
 *                                  Signature: (taskId: string, task: Object) => void
 * @param {Function} onPopoverClose Callback when popover closes.
 *                                  Signature: (taskId: string) => void
 * @return {void}
 */
function usePopoverHooks(onPopoverOpen, onPopoverClose) {
  const hookNamespace = 'prpl/popover-manager';
  const openAction = 'prpl.popover.open';
  const closeAction = 'prpl.popover.close';

  // Use refs to store the latest callbacks to avoid stale closures
  const onOpenRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(onPopoverOpen);
  const onCloseRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(onPopoverClose);

  // Update refs when callbacks change
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    onOpenRef.current = onPopoverOpen;
    onCloseRef.current = onPopoverClose;
  }, [onPopoverOpen, onPopoverClose]);

  // Wrapper functions that use refs to get latest callbacks
  const handleOpen = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)((taskId, task) => {
    onOpenRef.current(taskId, task);
  }, []);
  const handleClose = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(taskId => {
    onCloseRef.current(taskId);
  }, []);

  // Register hooks
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    try {
      (0,_wordpress_hooks__WEBPACK_IMPORTED_MODULE_1__.addAction)(openAction, hookNamespace, handleOpen);
      (0,_wordpress_hooks__WEBPACK_IMPORTED_MODULE_1__.addAction)(closeAction, hookNamespace, handleClose);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to register popover hooks:', error);
    }
    return () => {
      try {
        (0,_wordpress_hooks__WEBPACK_IMPORTED_MODULE_1__.removeAction)(openAction, hookNamespace);
        (0,_wordpress_hooks__WEBPACK_IMPORTED_MODULE_1__.removeAction)(closeAction, hookNamespace);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to remove popover hooks:', error);
      }
    };
  }, [handleOpen, handleClose]);
}

/***/ }),

/***/ "./assets/src/hooks/useTasksApi/index.js":
/*!***********************************************!*\
  !*** ./assets/src/hooks/useTasksApi/index.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   completeTask: () => (/* binding */ completeTask),
/* harmony export */   createTask: () => (/* binding */ createTask),
/* harmony export */   createTaskPost: () => (/* binding */ createTaskPost),
/* harmony export */   createTasksBatch: () => (/* binding */ createTasksBatch),
/* harmony export */   deleteTask: () => (/* binding */ deleteTask),
/* harmony export */   fetchDataCollector: () => (/* binding */ fetchDataCollector),
/* harmony export */   fetchTasks: () => (/* binding */ fetchTasks),
/* harmony export */   sendTaskAction: () => (/* binding */ sendTaskAction),
/* harmony export */   snoozeTask: () => (/* binding */ snoozeTask),
/* harmony export */   submitInteractiveTask: () => (/* binding */ submitInteractiveTask),
/* harmony export */   updateSiteSettings: () => (/* binding */ updateSiteSettings),
/* harmony export */   updateTask: () => (/* binding */ updateTask)
/* harmony export */ });
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/api-fetch */ "@wordpress/api-fetch");
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _services_apiFetchCache__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../services/apiFetchCache */ "./assets/src/services/apiFetchCache.js");
/**
 * Tasks API Hook.
 *
 * Provides functions for interacting with the tasks REST API.
 * Used by both SuggestedTasks and TodoWidget.
 */




/**
 * Snooze duration map (duration key to days).
 */
const SNOOZE_DURATION_DAYS = {
  '1-week': 7,
  '2-weeks': 14,
  '1-month': 30,
  '3-months': 90,
  '6-months': 180,
  '1-year': 365,
  forever: 3650
};

/**
 * Build query string from parameters object.
 *
 * @param {Object} params The parameters object.
 * @return {string} The query string.
 */
function buildQueryString(params) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach(v => searchParams.append(key, v));
    } else if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, value);
    }
  });
  return searchParams.toString();
}

/**
 * Fetch tasks from the API.
 *
 * @param {Object}   options                 Fetch options.
 * @param {string}   options.status          Task status (publish, pending, future, trash).
 * @param {number}   options.perPage         Number of tasks to fetch.
 * @param {number}   options.page            Page number (1-based, defaults to 1).
 * @param {string}   options.excludeProvider Provider to exclude (e.g., 'user').
 * @param {string}   options.provider        Provider to include.
 * @param {number[]} options.excludeIds      Array of post IDs to exclude.
 * @param {boolean}  options.needsPagination Whether pagination info is needed (default true).
 *                                           Set to false to enable preloading support.
 * @return {Promise<Object>} Promise resolving to object with tasks array and pagination metadata.
 */
async function fetchTasks({
  status = 'publish',
  perPage = 5,
  page = 1,
  excludeProvider,
  provider,
  excludeIds = [],
  needsPagination = true
} = {}) {
  const params = {
    status,
    per_page: perPage,
    page,
    _embed: true,
    'filter[orderby]': 'menu_order',
    'filter[order]': 'ASC'
  };
  if (excludeProvider) {
    params.exclude_provider = excludeProvider;
  }
  if (provider) {
    params.provider = provider;
  }
  if (excludeIds.length > 0) {
    params.exclude = excludeIds.join(',');
  }
  const query = buildQueryString(params);
  try {
    // If pagination not needed, use simple fetch (supports preloading)
    if (!needsPagination) {
      const tasks = await _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_0___default()({
        path: `/wp/v2/prpl_recommendations?${query}`
      });
      return {
        tasks: tasks || [],
        totalPages: 1,
        hasMore: false
      };
    }

    // Use apiFetch with custom parse to access response headers
    const response = await _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_0___default()({
      path: `/wp/v2/prpl_recommendations?${query}`,
      parse: false // Don't parse JSON automatically, we need the response object
    });

    // apiFetch with parse: false returns the Response object
    const tasks = await response.json();
    const totalPages = parseInt(response.headers.get('X-WP-TotalPages') || '1', 10);
    return {
      tasks: tasks || [],
      totalPages,
      hasMore: page < totalPages
    };
  } catch (error) {
    console.error('Error fetching tasks:', error);
    // Return empty result with no more pages on error
    return {
      tasks: [],
      totalPages: 1,
      hasMore: false
    };
  }
}

/**
 * Create a new task.
 *
 * @param {Object} options            Create options.
 * @param {string} options.title      Task title.
 * @param {number} options.menuOrder  Menu order for sorting.
 * @param {number} options.providerId Provider taxonomy term ID.
 * @param {number} options.points     Points value (default 0).
 * @return {Promise<Object>} Promise resolving to the created task.
 */
async function createTask({
  title,
  menuOrder = 0,
  providerId,
  points = 0
}) {
  return _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_0___default()({
    path: '/wp/v2/prpl_recommendations',
    method: 'POST',
    data: {
      title,
      status: 'publish',
      menu_order: menuOrder,
      prpl_recommendations_provider: providerId,
      prpl_points: points
    }
  });
}

/**
 * Complete a task (change status to trash).
 *
 * @param {number} postId The post ID.
 * @return {Promise<Object>} Promise resolving to the updated task.
 */
async function completeTask(postId) {
  return _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_0___default()({
    path: `/wp/v2/prpl_recommendations/${postId}`,
    method: 'POST',
    data: {
      status: 'trash'
    }
  });
}

/**
 * Snooze a task (change status to future with scheduled date).
 *
 * @param {number} postId   The post ID.
 * @param {string} duration The snooze duration key.
 * @return {Promise<Object>} Promise resolving to the updated task.
 */
async function snoozeTask(postId, duration) {
  const durationDays = SNOOZE_DURATION_DAYS[duration] || 7;

  // Calculate the future date.
  const futureDate = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000);
  const dateString = futureDate.toISOString().split('.')[0];
  return _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_0___default()({
    path: `/wp/v2/prpl_recommendations/${postId}`,
    method: 'POST',
    data: {
      status: 'future',
      date: dateString,
      date_gmt: dateString
    }
  });
}

/**
 * Delete a task permanently.
 *
 * @param {number} postId The post ID.
 * @return {Promise<Object>} Promise resolving to the deleted task.
 */
async function deleteTask(postId) {
  return _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_0___default()({
    path: `/wp/v2/prpl_recommendations/${postId}?force=true`,
    method: 'DELETE'
  });
}

/**
 * Update a task.
 *
 * @param {number} postId The post ID.
 * @param {Object} data   The data to update.
 * @return {Promise<Object>} Promise resolving to the updated task.
 */
async function updateTask(postId, data) {
  return _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_0___default()({
    path: `/wp/v2/prpl_recommendations/${postId}`,
    method: 'POST',
    data
  });
}

/**
 * Send a task action for analytics.
 *
 * @param {number} postId     The post ID.
 * @param {string} actionType The action type (complete, delete, pending).
 * @return {Promise<Object>} Promise resolving to the response.
 */
async function sendTaskAction(postId, actionType) {
  const nonce = window.prplDashboardConfig?.nonce || '';
  const ajaxUrl = window.prplDashboardConfig?.ajaxUrl || '/wp-admin/admin-ajax.php';
  const formData = new FormData();
  formData.append('action', 'progress_planner_suggested_task_action');
  formData.append('post_id', postId);
  formData.append('action_type', actionType);
  formData.append('nonce', nonce);
  try {
    const response = await fetch(ajaxUrl, {
      method: 'POST',
      body: formData,
      credentials: 'same-origin'
    });
    return response.json();
  } catch (error) {
    console.error('Error sending task action:', error);
    return null;
  }
}

/**
 * Submit an interactive task form.
 *
 * @param {Object} options             Submit options.
 * @param {string} options.setting     The setting name.
 * @param {string} options.value       The value to set.
 * @param {Array}  options.settingPath The path to the setting (for nested values).
 * @return {Promise<Object>} Promise resolving to the response.
 */
async function submitInteractiveTask({
  setting,
  value,
  settingPath = []
}) {
  try {
    // Use REST API endpoint instead of AJAX.
    // Convert settingPath to JSON string if it's an array
    let settingPathValue = '';
    if (settingPath && Array.isArray(settingPath)) {
      settingPathValue = JSON.stringify(settingPath);
    } else if (typeof settingPath === 'string') {
      settingPathValue = settingPath;
    }
    const response = await _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_0___default()({
      path: '/progress-planner/v1/popover/submit',
      method: 'POST',
      data: {
        setting,
        value,
        setting_path: settingPathValue
      }
    });
    return response;
  } catch (error) {
    console.error('Error submitting interactive task:', error);
    throw error;
  }
}

/**
 * Update WordPress site settings via REST API.
 *
 * @param {Object} settings Key-value pairs of settings to update.
 * @return {Promise<Object>} Promise resolving to the updated settings.
 */
async function updateSiteSettings(settings) {
  return _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_0___default()({
    path: '/wp/v2/settings',
    method: 'POST',
    data: settings
  });
}

/**
 * Create a task post via task evaluation endpoint.
 *
 * @param {Object} taskDetails The task details object.
 * @return {Promise<Object>} Promise resolving to the created task response (includes full task data).
 */
async function createTaskPost(taskDetails) {
  return _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_0___default()({
    path: '/progress-planner/v1/tasks/evaluate',
    method: 'POST',
    data: {
      task_details: taskDetails
    }
  });
}

/**
 * Create multiple task posts in a batch.
 *
 * @param {Array<Object>} tasksDetails Array of task details objects.
 * @return {Promise<Object>} Promise resolving to batch response with tasks array.
 */
async function createTasksBatch(tasksDetails) {
  return _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_0___default()({
    path: '/progress-planner/v1/tasks/evaluate-batch',
    method: 'POST',
    data: {
      tasks: tasksDetails
    }
  });
}

/**
 * Fetch data from a data collector.
 * Uses cachedApiFetch to leverage preloaded data and response caching.
 *
 * @param {string} collectorId The data collector ID (DATA_KEY).
 * @return {Promise<*>} Promise resolving to the collected data.
 */
async function fetchDataCollector(collectorId) {
  const response = await (0,_services_apiFetchCache__WEBPACK_IMPORTED_MODULE_1__.cachedApiFetch)({
    path: `/progress-planner/v1/data-collectors/${collectorId}`
  });
  return response.data;
}

/***/ }),

/***/ "./assets/src/services/InteractiveTaskProvider.js":
/*!********************************************************!*\
  !*** ./assets/src/services/InteractiveTaskProvider.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   InteractiveTaskProvider: () => (/* binding */ InteractiveTaskProvider)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _TaskProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./TaskProvider */ "./assets/src/services/TaskProvider.js");
/**
 * Interactive Task Provider base class.
 *
 * Extends TaskProvider to provide functionality specific to interactive tasks.
 * Interactive tasks have popovers that allow users to complete tasks through forms.
 */




/**
 * Interactive Task Provider class.
 *
 * Extends TaskProvider with interactive task-specific functionality.
 * Interactive tasks use popovers for user interaction.
 */
class InteractiveTaskProvider extends _TaskProvider__WEBPACK_IMPORTED_MODULE_1__.TaskProvider {
  /**
   * Constructor.
   *
   * @param {Object} config Optional task provider configuration (for backward compatibility).
   */
  constructor(config = {}) {
    super(config);
  }

  /**
   * Get the popover ID.
   *
   * @return {string} The popover ID (with prpl-popover- prefix).
   */
  getPopoverId() {
    const StaticClass = this.constructor;
    const popoverId = StaticClass.popoverId || this.config.popoverId || '';
    return popoverId ? `prpl-popover-${popoverId}` : '';
  }

  /**
   * Get task details with popover ID included.
   *
   * Note: This method should be implemented by child classes to provide
   * task-specific details. The popover_id should be added to the returned details.
   *
   * @param {Object} taskData Optional task-specific data.
   * @return {Promise<Object>} Promise resolving to task details object.
   */
  // eslint-disable-next-line no-unused-vars
  async getTaskDetails(taskData = {}) {
    // Child classes must implement this method.
    // They should call super.getTaskDetails() if needed, but typically
    // they'll implement their own version that includes popover_id.
    throw new Error('getTaskDetails() must be implemented by interactive task provider');
  }

  /**
   * Add popover ID to task details.
   *
   * Helper method for child classes to add popover_id to their task details.
   *
   * @param {Object} taskDetails The task details object.
   * @return {Object} Task details with popover_id added.
   */
  addPopoverIdToTaskDetails(taskDetails) {
    const StaticClass = this.constructor;
    const popoverId = StaticClass.popoverId || this.config.popoverId || '';
    if (popoverId) {
      taskDetails.popover_id = this.getPopoverId();
    }
    return taskDetails;
  }

  /**
   * Get allowed interactive options.
   *
   * This should be implemented by child classes if they need to
   * specify which WordPress options can be updated.
   * The default list is handled server-side via the REST API.
   *
   * @return {Array<string>} Array of allowed option names.
   */
  getAllowedInteractiveOptions() {
    // Default list is maintained server-side in class-popover-actions.php
    // Child classes can override to add more options.
    return [];
  }

  /**
   * Add custom task actions for interactive tasks.
   *
   * Interactive tasks add a popover trigger action (priority 10).
   * Child classes can override this to add additional actions.
   *
   * @param {Object} taskData The task data.
   * @param {Array}  actions  The existing actions array.
   *
   * @return {Array} The modified actions array.
   */
  addTaskActions(taskData = [], actions = []) {
    const StaticClass = this.constructor;
    const popoverId = StaticClass.popoverId || this.config.popoverId || '';
    if (popoverId) {
      // Add popover trigger action with high priority (10).
      // This matches the PHP implementation where interactive tasks
      // add popover actions with priority 10.
      actions.push({
        type: 'popover',
        priority: 10,
        popoverId: this.getPopoverId(),
        label: this.getPopoverActionLabel()
      });
    }

    // Call parent implementation to allow further customization.
    return super.addTaskActions(taskData, actions);
  }

  /**
   * Get the label for the popover action.
   *
   * Child classes can override this to customize the action label.
   *
   * @return {string} The action label.
   */
  getPopoverActionLabel() {
    // Default label - child classes can override for specific labels.
    // For example, UpdateTermDescriptionTask uses "Write description".
    return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Complete', 'progress-planner');
  }
}

/***/ }),

/***/ "./assets/src/services/TaskProvider.js":
/*!*********************************************!*\
  !*** ./assets/src/services/TaskProvider.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TaskProvider: () => (/* binding */ TaskProvider)
/* harmony export */ });
/**
 * Base Task Provider class.
 *
 * Provides common functionality and interface for task providers.
 * React task providers should extend or implement this interface.
 */

/**
 * Base Task Provider.
 *
 * This class provides a standard interface for task providers.
 * Task providers should implement the required methods.
 */
class TaskProvider {
  /**
   * Constructor.
   *
   * @param {Object} config Optional task provider configuration (for backward compatibility).
   */
  constructor(config = {}) {
    // Build config from static properties, with fallback to constructor params for backward compatibility
    const StaticClass = this.constructor;

    // Calculate isSnoozable separately to avoid nested ternary
    let isSnoozable = true; // Default value
    if (StaticClass.isSnoozable !== undefined) {
      isSnoozable = StaticClass.isSnoozable;
    } else if (config.isSnoozable !== undefined) {
      isSnoozable = config.isSnoozable;
    }
    this.config = {
      providerId: StaticClass.providerId || config.providerId || '',
      capability: StaticClass.capability || config.capability || 'manage_options',
      isOnboardingTask: StaticClass.isOnboardingTask !== undefined ? StaticClass.isOnboardingTask : config.isOnboardingTask || false,
      priority: StaticClass.priority !== undefined ? StaticClass.priority : config.priority || 50,
      points: StaticClass.points !== undefined ? StaticClass.points : config.points || 1,
      parent: StaticClass.parent !== undefined ? StaticClass.parent : config.parent || 0,
      isDismissable: StaticClass.isDismissable !== undefined ? StaticClass.isDismissable : config.isDismissable || false,
      isSnoozable,
      isRepetitive: StaticClass.isRepetitive !== undefined ? StaticClass.isRepetitive : config.isRepetitive || false,
      dependencies: StaticClass.dependencies || config.dependencies || [],
      externalLinkUrl: StaticClass.externalLinkUrl || config.externalLinkUrl || '',
      popoverId: StaticClass.popoverId || config.popoverId || '',
      isMultiTask: StaticClass.isMultiTask !== undefined ? StaticClass.isMultiTask : config.isMultiTask || false,
      ...config
    };
  }

  /**
   * Get static config from the class.
   *
   * @return {Object} Configuration object from static properties.
   */
  static getStaticConfig() {
    return {
      providerId: this.providerId || '',
      capability: this.capability || 'manage_options',
      isOnboardingTask: this.isOnboardingTask || false,
      priority: this.priority !== undefined ? this.priority : 50,
      points: this.points !== undefined ? this.points : 1,
      parent: this.parent || 0,
      isDismissable: this.isDismissable || false,
      isSnoozable: this.isSnoozable !== undefined ? this.isSnoozable : true,
      isRepetitive: this.isRepetitive || false,
      dependencies: this.dependencies || [],
      externalLinkUrl: this.externalLinkUrl || '',
      popoverId: this.popoverId || '',
      isMultiTask: this.isMultiTask || false
    };
  }

  /**
   * Get the provider ID.
   *
   * @return {string} The provider ID.
   */
  getProviderId() {
    const StaticClass = this.constructor;
    return StaticClass.providerId || this.config.providerId || '';
  }

  /**
   * Get the task priority.
   *
   * @return {number} The priority (lower = higher priority).
   */
  getPriority() {
    const StaticClass = this.constructor;
    return StaticClass.priority !== undefined ? StaticClass.priority : this.config.priority || 50;
  }

  /**
   * Get the task points.
   *
   * @return {number} The points value.
   */
  getPoints() {
    const StaticClass = this.constructor;
    return StaticClass.points !== undefined ? StaticClass.points : this.config.points || 1;
  }

  /**
   * Build an admin URL with optional path and query parameters.
   *
   * Centralizes URL building logic to reduce code duplication across task providers.
   * Handles trailing slash normalization and query parameter encoding.
   *
   * @param {string} path   The path relative to wp-admin (e.g., 'post.php', 'edit-tags.php').
   * @param {Object} params Query parameters as key-value pairs.
   * @return {string} The complete admin URL.
   */
  buildAdminUrl(path = '', params = {}) {
    const adminUrl = window.prplDashboardConfig?.adminUrl || '/wp-admin/';
    const separator = adminUrl.endsWith('/') ? '' : '/';
    let url = path ? `${adminUrl}${separator}${path}` : adminUrl;

    // Add query parameters if any.
    const queryParams = Object.entries(params).filter(([, value]) => value !== undefined && value !== null).map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join('&');
    if (queryParams) {
      url += (url.includes('?') ? '&' : '?') + queryParams;
    }
    return url;
  }

  /**
   * Build standard task details object with common fields.
   *
   * Centralizes task details building logic to reduce code duplication.
   * Uses static class properties and config as defaults, with overrides for custom values.
   *
   * @param {Object} taskData  Task-specific data used for ID generation.
   * @param {Object} overrides Custom fields to override or add to the standard details.
   * @return {Object} Complete task details object.
   */
  buildTaskDetails(taskData = {}, overrides = {}) {
    const StaticClass = this.constructor;
    return {
      task_id: this.getTaskId(taskData),
      provider_id: this.getProviderId(),
      post_title: '',
      // Should be overridden
      description: '',
      priority: this.getPriority(),
      points: this.getPoints(),
      parent: StaticClass.parent || 0,
      url: '',
      url_target: '_self',
      dismissable: StaticClass.isDismissable !== undefined ? StaticClass.isDismissable : this.config.isDismissable,
      external_link_url: StaticClass.externalLinkUrl || this.config.externalLinkUrl,
      ...overrides
    };
  }

  /**
   * Check if the user has the required capability.
   *
   * @return {boolean} True if user has capability.
   */
  capabilityRequired() {
    // Capability checking should be done server-side via REST API.
    // This is a placeholder for client-side checks if needed.
    return true;
  }

  /**
   * Check if the task should be added.
   *
   * This method must be implemented by child classes.
   * It should use data collectors to determine if the task condition is met.
   *
   * @param {Object} taskData Optional task-specific data.
   * @return {Promise<boolean>} Promise resolving to true if task should be added.
   */
  // eslint-disable-next-line no-unused-vars
  async shouldAddTask(taskData = {}) {
    // Must be implemented by child classes.
    throw new Error('shouldAddTask() must be implemented by task provider');
  }

  /**
   * Get task details.
   *
   * This method must be implemented by child classes.
   * It returns the task metadata needed to create a task post.
   *
   * @param {Object} taskData Optional task-specific data.
   * @return {Promise<Object>} Promise resolving to task details object.
   */
  // eslint-disable-next-line no-unused-vars
  async getTaskDetails(taskData = {}) {
    // Must be implemented by child classes.
    throw new Error('getTaskDetails() must be implemented by task provider');
  }

  /**
   * Generate task ID.
   *
   * Generates a unique task ID based on provider ID and optional task data.
   *
   * @param {Object} taskData Optional task-specific data.
   * @return {string} The task ID.
   */
  getTaskId(taskData = {}) {
    const StaticClass = this.constructor;
    const providerId = StaticClass.providerId || this.config.providerId || '';
    const parts = [providerId];

    // Add optional parts in order (important for consistency).
    // Support both camelCase and snake_case formats.
    if (taskData.targetPostId) {
      parts.push(taskData.targetPostId);
    }
    if (taskData.targetTermId) {
      parts.push(taskData.targetTermId);
    }
    if (taskData.targetTaxonomy) {
      parts.push(taskData.targetTaxonomy);
    }
    if (taskData.target_post_id) {
      parts.push(taskData.target_post_id);
    }
    if (taskData.target_term_id) {
      parts.push(taskData.target_term_id);
    }
    if (taskData.target_taxonomy) {
      parts.push(taskData.target_taxonomy);
    }
    const isRepetitive = StaticClass.isRepetitive !== undefined ? StaticClass.isRepetitive : this.config.isRepetitive || false;
    if (isRepetitive) {
      // Add year-week format for repetitive tasks.
      const now = new Date();
      const year = now.getFullYear();
      const week = this.getWeekNumber(now);
      parts.push(`${year}${week.toString().padStart(2, '0')}`);
    }
    return parts.join('-');
  }

  /**
   * Get ISO week number for a date.
   *
   * @param {Date} date The date.
   * @return {number} The week number (1-53).
   */
  getWeekNumber(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  }

  /**
   * Check if task dependencies are satisfied.
   *
   * @param {Function} getTaskStatus Function to get task status by task ID.
   * @return {Promise<boolean>} Promise resolving to true if dependencies are satisfied.
   */
  async areDependenciesSatisfied(getTaskStatus) {
    const StaticClass = this.constructor;
    const dependencies = StaticClass.dependencies || this.config.dependencies || [];
    if (!dependencies || dependencies.length === 0) {
      return true;
    }

    // Check each dependency.
    for (const dependency of dependencies) {
      const taskId = typeof dependency === 'string' ? dependency : dependency.taskId;
      const requiredStatus = typeof dependency === 'object' ? dependency.status : 'completed';
      const status = await getTaskStatus(taskId);
      if (status !== requiredStatus) {
        return false;
      }
    }
    return true;
  }

  /**
   * Get task actions as configuration objects for React rendering.
   *
   * Returns an array of action config objects that TaskActions component
   * uses to render the appropriate React components.
   *
   * Standard actions include:
   * - Complete button (priority 20): Marks task as complete and awards points
   * - Snooze button (priority 30): Postpones task for specified duration
   * - Info/External link (priority 40): Educational content about the task
   * - Custom actions: Child classes can add via addTaskActions()
   *
   * Priority system (0-100, lower = higher priority):
   * - 0-19: Reserved for critical actions
   * - 20: Complete action
   * - 30: Snooze action
   * - 40: Information/educational links
   * - 50+: Custom provider-specific actions
   * - 1000: Default for actions without explicit priority
   *
   * @param {Object} taskData The task data from the REST API response.
   * @return {Array<Object>} Array of action config objects, ordered by priority.
   */
  getTaskActions(taskData = {}) {
    const actions = [];
    const StaticClass = this.constructor;

    // Safety check: if taskData is invalid, use empty object.
    if (!taskData || typeof taskData !== 'object') {
      taskData = {};
    }
    const providerId = this.getProviderId();
    const taskId = taskData.slug || taskData.id || '';
    const taskTitle = taskData.title?.rendered || taskData.title || taskData.post_title || '';

    // Add "Mark as complete" button for dismissable tasks (except user-created tasks).
    if (this.capabilityRequired() && this.config.isDismissable && providerId !== 'user') {
      actions.push({
        type: 'complete',
        priority: 20,
        taskId,
        taskTitle
      });
    }

    // Add "Snooze" button for snoozable tasks.
    if (this.capabilityRequired() && this.config.isSnoozable) {
      actions.push({
        type: 'snooze',
        priority: 30,
        taskId,
        taskTitle
      });
    }

    // Add educational/informational links.
    // Prefer external links if provided, otherwise show task description in tooltip.
    // Note: Interactive tasks (those with popoverId) don't show info tooltip.
    const isInteractiveTask = !!(this.config.popoverId || StaticClass.popoverId);
    if (this.config.externalLinkUrl) {
      actions.push({
        type: 'info',
        priority: 40,
        externalUrl: this.config.externalLinkUrl
      });
    } else if (!isInteractiveTask && taskData.content?.rendered && taskData.content.rendered !== '') {
      actions.push({
        type: 'info',
        priority: 40,
        taskId,
        taskTitle,
        content: taskData.content.rendered
      });
    }

    // Allow child classes to add custom actions (e.g., "Edit Post" for content tasks).
    if (this.capabilityRequired()) {
      const modifiedActions = this.addTaskActions(taskData, actions);

      // Ensure all actions have priority set and filter out empty/invalid actions.
      const validActions = modifiedActions.map(action => {
        // Ensure priority is set.
        if (!action.priority) {
          action.priority = 1000;
        }
        return action;
      }).filter(action => {
        // Remove empty actions - must have type or html (for backward compat).
        return action.type || action.html && action.html !== '';
      });

      // Sort actions by priority (ascending: lower priority values appear first).
      validActions.sort((a, b) => a.priority - b.priority);
      return validActions;
    }

    // Sort actions by priority (ascending: lower priority values appear first).
    actions.sort((a, b) => a.priority - b.priority);
    return actions;
  }

  /**
   * Add custom task actions.
   *
   * Child classes can override this method to add custom actions.
   * This is similar to PHP's add_task_actions() method.
   *
   * @param {Object} taskData The task data.
   * @param {Array}  actions  The existing actions array.
   * @return {Array} The modified actions array.
   */
  addTaskActions(taskData, actions) {
    // Default implementation returns actions unchanged.
    // Child classes should override this to add custom actions.
    // eslint-disable-next-line no-unused-vars
    const _taskData = taskData;
    return actions;
  }
}

/***/ }),

/***/ "./assets/src/services/apiFetchCache.js":
/*!**********************************************!*\
  !*** ./assets/src/services/apiFetchCache.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   cachedApiFetch: () => (/* binding */ cachedApiFetch),
/* harmony export */   clearCache: () => (/* binding */ clearCache),
/* harmony export */   clearCacheFor: () => (/* binding */ clearCacheFor),
/* harmony export */   getCacheStats: () => (/* binding */ getCacheStats),
/* harmony export */   setCacheFor: () => (/* binding */ setCacheFor)
/* harmony export */ });
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/api-fetch */ "@wordpress/api-fetch");
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_0__);
/**
 * API Fetch Cache Service
 *
 * Provides a caching proxy for @wordpress/api-fetch with:
 * - Request deduplication: Simultaneous identical requests share one network call
 * - Response caching: Stores responses with TTL, serves from cache when valid
 *
 * Only GET requests are cached. POST/PUT/DELETE always execute immediately.
 */



/**
 * In-flight request tracking.
 * Maps cache key -> Promise (the pending request).
 * Used for request deduplication.
 */
const inFlightRequests = new Map();

/**
 * Response cache storage.
 * Maps cache key -> { data, timestamp }.
 */
const responseCache = new Map();

/**
 * Default cache TTL: 5 minutes (matches existing implementations).
 */
const DEFAULT_CACHE_TTL = 5 * 60 * 1000;

/**
 * Generate a cache key from request options.
 *
 * Only GET requests are cacheable. Returns null for non-cacheable requests.
 *
 * @param {Object} options - The apiFetch options object.
 * @return {string|null} Cache key or null if not cacheable.
 */
function generateCacheKey(options) {
  const method = (options.method || 'GET').toUpperCase();

  // Only cache GET requests.
  if (method !== 'GET') {
    return null;
  }

  // Handle both { path } and { url } options.
  let fullPath = options.path || options.url || '';

  // Append data as query params for GET requests if provided.
  if (options.data && typeof options.data === 'object') {
    const params = new URLSearchParams(options.data).toString();
    if (params) {
      fullPath += (fullPath.includes('?') ? '&' : '?') + params;
    }
  }
  return `GET:${fullPath}`;
}

/**
 * Cached API fetch with request deduplication.
 *
 * @param {Object}  options                - Same options as @wordpress/api-fetch.
 * @param {Object}  cacheOptions           - Additional cache control options.
 * @param {boolean} cacheOptions.skipCache - Bypass cache, make fresh request.
 * @param {number}  cacheOptions.ttl       - Custom TTL for this request (ms).
 * @return {Promise} Response promise.
 */
async function cachedApiFetch(options, cacheOptions = {}) {
  const {
    skipCache = false,
    ttl = DEFAULT_CACHE_TTL
  } = cacheOptions;
  const cacheKey = generateCacheKey(options);

  // Non-cacheable request (POST, PUT, DELETE, etc.).
  if (!cacheKey) {
    return _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_0___default()(options);
  }

  // Check in-flight requests first (deduplication).
  if (!skipCache && inFlightRequests.has(cacheKey)) {
    return inFlightRequests.get(cacheKey);
  }

  // Check response cache.
  if (!skipCache) {
    const cached = responseCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < ttl) {
      return Promise.resolve(cached.data);
    }
  }

  // Make the actual request.
  const requestPromise = _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_0___default()(options).then(response => {
    // Store in cache.
    responseCache.set(cacheKey, {
      data: response,
      timestamp: Date.now()
    });

    // Remove from in-flight.
    inFlightRequests.delete(cacheKey);
    return response;
  }).catch(error => {
    // Remove from in-flight on error.
    inFlightRequests.delete(cacheKey);
    throw error;
  });

  // Track as in-flight.
  inFlightRequests.set(cacheKey, requestPromise);
  return requestPromise;
}

/**
 * Clear the entire response cache and in-flight requests.
 *
 * Clears both the response cache and any pending in-flight requests.
 * Useful for cache invalidation and test isolation.
 */
function clearCache() {
  responseCache.clear();
  inFlightRequests.clear();
}

/**
 * Clear cache for a specific path or pattern.
 *
 * @param {string|RegExp} pathOrPattern - Path string or regex pattern.
 */
function clearCacheFor(pathOrPattern) {
  if (typeof pathOrPattern === 'string') {
    // Clear exact match.
    const key = `GET:${pathOrPattern}`;
    responseCache.delete(key);

    // Also try clearing with trailing variations.
    for (const cacheKey of responseCache.keys()) {
      if (cacheKey.startsWith(`GET:${pathOrPattern}`)) {
        responseCache.delete(cacheKey);
      }
    }
  } else if (pathOrPattern instanceof RegExp) {
    // Clear matching pattern.
    for (const key of responseCache.keys()) {
      if (pathOrPattern.test(key)) {
        responseCache.delete(key);
      }
    }
  }
}

/**
 * Set cache entry for a specific path (write-through caching).
 *
 * Useful for updating cache after a POST/PUT operation returns
 * data that should be cached for subsequent GET requests.
 *
 * @param {string} path - The API path to cache.
 * @param {*}      data - The data to cache.
 */
function setCacheFor(path, data) {
  const key = `GET:${path}`;
  responseCache.set(key, {
    data,
    timestamp: Date.now()
  });
}

/**
 * Get cache statistics (useful for debugging).
 *
 * @return {Object} Cache statistics.
 */
function getCacheStats() {
  return {
    cachedResponses: responseCache.size,
    inFlightRequests: inFlightRequests.size
  };
}

/***/ }),

/***/ "./assets/src/services/taskRegistry.js":
/*!*********************************************!*\
  !*** ./assets/src/services/taskRegistry.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   evaluateTasksUntil: () => (/* binding */ evaluateTasksUntil),
/* harmony export */   getBufferSize: () => (/* binding */ getBufferSize),
/* harmony export */   getEvaluationProgress: () => (/* binding */ getEvaluationProgress),
/* harmony export */   getTaskProviderClass: () => (/* binding */ getTaskProviderClass),
/* harmony export */   getTaskProviderInstance: () => (/* binding */ getTaskProviderInstance),
/* harmony export */   hasMoreTasksToEvaluate: () => (/* binding */ hasMoreTasksToEvaluate),
/* harmony export */   registerTask: () => (/* binding */ registerTask),
/* harmony export */   resetEvaluationState: () => (/* binding */ resetEvaluationState)
/* harmony export */ });
/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/hooks */ "@wordpress/hooks");
/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_hooks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/api-fetch */ "@wordpress/api-fetch");
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _hooks_useTasksApi__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../hooks/useTasksApi */ "./assets/src/hooks/useTasksApi/index.js");
/**
 * Task Registry Service.
 *
 * Central registry for React task providers with batched evaluation.
 * Tasks register via `registerTask()` but are only evaluated on-demand.
 * Uses batch API calls for task creation to improve performance.
 */





/**
 * All data collector IDs used by task providers.
 * Pre-fetching these in parallel ensures shouldAddTask() calls are instant.
 */
const DATA_COLLECTOR_IDS = ['hello_world_post_id', 'sample_page_id', 'inactive_plugins_count', 'uncategorized_category_id', 'post_author_count', 'last_published_post_id', 'archive_format_count', 'terms_without_posts', 'terms_without_description', 'post_tag_count', 'published_post_count', 'unpublished_content', 'seo_plugin_installed', 'php_version', 'wp_debug_status', 'old_posts_for_review'];

/**
 * Registry storage for task provider classes.
 * Populated during import, before any evaluation.
 *
 * @type {Map<string, Function>}
 */
const taskProviders = new Map();

/**
 * Pre-fetched existing task slugs from the database (all statuses).
 * Used to avoid per-task existence checks and skip completed/snoozed tasks.
 *
 * @type {Map<string, Object>}
 */
let existingTasksCache = new Map();

/**
 * Sorted array of task classes by priority.
 * Computed once after all tasks are registered.
 *
 * @type {Array<{TaskClass: Function, priority: number, providerId: string}>}
 */
let sortedTaskClasses = [];

/**
 * Evaluation state tracking.
 */
const evaluationState = {
  isPreFetchComplete: false,
  isEvaluating: false,
  currentIndex: 0
};

/**
 * Buffer size for pre-evaluated tasks.
 */
const BUFFER_SIZE = 3;

/**
 * Batch size for task creation requests.
 */
const BATCH_SIZE = 5;

/**
 * Register a task class for lazy evaluation.
 * This collects the task class without triggering any evaluation.
 *
 * @param {Function} TaskClass The task class to register.
 */
function registerTask(TaskClass) {
  const providerId = TaskClass.providerId;
  if (!providerId) {
    console.warn('Task class missing providerId, skipping:', TaskClass);
    return;
  }
  const priority = TaskClass.priority || 50;
  (0,_wordpress_hooks__WEBPACK_IMPORTED_MODULE_0__.addFilter)('prpl.tasks.classes', `prpl/task/${providerId}`, taskClasses => {
    if (!taskClasses.has(providerId)) {
      taskClasses.set(providerId, {
        TaskClass,
        priority
      });
    }
    return taskClasses;
  }, priority);

  // Also store in taskProviders for getTaskProviderClass/Instance
  taskProviders.set(providerId, TaskClass);
}

/**
 * Pre-fetch all existing task recommendations from the database.
 * Fetches ALL statuses (publish, trash, future) to know what's completed/snoozed.
 *
 * @return {Promise<Map<string, Object>>} Map of slug -> task data with status info.
 */
async function preFetchExistingTasks() {
  try {
    const response = await _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1___default()({
      // Fetch all statuses to know completed/snoozed tasks too
      path: '/wp/v2/prpl_recommendations?status=publish,trash,future&per_page=100&_embed=true'
    });
    const tasksMap = new Map();
    if (Array.isArray(response)) {
      response.forEach(task => {
        if (task.slug) {
          tasksMap.set(task.slug, {
            ...task,
            _existsInDb: true,
            _isActive: task.status === 'publish'
          });
        }
      });
    }
    return tasksMap;
  } catch (error) {
    console.error('Error pre-fetching existing tasks:', error);
    return new Map();
  }
}

/**
 * Initialize the sorted task classes array.
 * Called once after all tasks have registered.
 */
function initializeSortedTaskClasses() {
  const registered = (0,_wordpress_hooks__WEBPACK_IMPORTED_MODULE_0__.applyFilters)('prpl.tasks.classes', new Map());
  sortedTaskClasses = Array.from(registered.entries()).map(([providerId, {
    TaskClass,
    priority
  }]) => ({
    TaskClass,
    priority,
    providerId
  })).sort((a, b) => a.priority - b.priority);
}

/**
 * Evaluate tasks with batched creation for improved performance.
 *
 * Flow:
 * 1. Pre-fetch ALL existing tasks (all statuses)
 * 2. Evaluate each task provider (skip completed/snoozed)
 * 3. Immediately render existing active tasks
 * 4. Batch create new tasks (5 at a time), render as batches complete
 *
 * @param {number}   targetCount Number of tasks needed (visible + buffer).
 * @param {Function} onTaskReady Callback when a task is ready: (taskData, priority) => void.
 * @return {Promise<{complete: boolean, tasksAdded: number}>} Evaluation result.
 */
async function evaluateTasksUntil(targetCount, onTaskReady) {
  // Phase 0: Pre-fetch ALL existing tasks and data collectors (all in parallel)
  if (!evaluationState.isPreFetchComplete) {
    // Fetch existing tasks and all data collectors in parallel
    // Data collectors are preloaded, but this ensures they're in cachedApiFetch cache
    const [existingTasks] = await Promise.all([preFetchExistingTasks(),
    // Pre-fetch all data collectors in parallel - populates cache for shouldAddTask() calls
    ...DATA_COLLECTOR_IDS.map(id => (0,_hooks_useTasksApi__WEBPACK_IMPORTED_MODULE_2__.fetchDataCollector)(id).catch(() => null))]);
    existingTasksCache = existingTasks;
    evaluationState.isPreFetchComplete = true;
    initializeSortedTaskClasses();
  }

  // Prevent concurrent evaluation
  if (evaluationState.isEvaluating) {
    return {
      complete: false,
      tasksAdded: 0
    };
  }
  evaluationState.isEvaluating = true;
  let tasksAdded = 0;
  try {
    // Phase 1: Evaluate tasks - collect existing and tasks to create
    const existingTasks = []; // Already in DB with status=publish
    const tasksToCreate = []; // Need to be created

    while (evaluationState.currentIndex < sortedTaskClasses.length) {
      const {
        TaskClass,
        priority
      } = sortedTaskClasses[evaluationState.currentIndex];
      evaluationState.currentIndex++;
      const result = await evaluateForCollection(TaskClass, priority);
      if (result.existing) {
        existingTasks.push(result.existing);
      }
      if (result.toCreate) {
        tasksToCreate.push(result.toCreate);
      }
    }

    // Sort by priority (high priority = lower number = first)
    existingTasks.sort((a, b) => a.priority - b.priority);
    tasksToCreate.sort((a, b) => a.priority - b.priority);

    // Phase 2: Immediately render existing tasks (no API calls needed!)
    for (const {
      task,
      priority
    } of existingTasks) {
      onTaskReady(task, priority);
      tasksAdded++;
    }

    // Phase 3: Batch create new tasks, render as batches complete
    for (let i = 0; i < tasksToCreate.length; i += BATCH_SIZE) {
      const batch = tasksToCreate.slice(i, i + BATCH_SIZE);
      const taskDetails = batch.map(b => b.taskDetails);
      try {
        // Create batch (returns full task data)
        const response = await (0,_hooks_useTasksApi__WEBPACK_IMPORTED_MODULE_2__.createTasksBatch)(taskDetails);
        if (response.success && response.tasks) {
          response.tasks.forEach((result, idx) => {
            if (result.success && result.task) {
              const {
                priority,
                taskId
              } = batch[idx];
              // Ensure priority is set
              if (result.task.prpl_priority === undefined) {
                result.task.prpl_priority = priority;
              }
              existingTasksCache.set(taskId, result.task);
              onTaskReady(result.task, priority);
              tasksAdded++;
            }
          });
        }
      } catch (error) {
        // Suppress 409 Conflict errors - these are expected when multiple
        // widgets try to create tasks simultaneously. The locking mechanism
        // is working correctly.
        if (error?.data?.status !== 409) {
          // eslint-disable-next-line no-console
          console.error('Error creating task batch:', error);
        }
      }
    }
  } finally {
    evaluationState.isEvaluating = false;
  }
  return {
    complete: evaluationState.currentIndex >= sortedTaskClasses.length,
    tasksAdded
  };
}

/**
 * Evaluate a task class and determine if it exists or needs creation.
 *
 * IMPORTANT: shouldAddTask() still runs full server-side evaluation
 * (via data-collectors). The only "quick skip" is for tasks we KNOW
 * are completed/snoozed from the all-statuses prefetch.
 *
 * @param {Function} TaskClass The task class to evaluate.
 * @param {number}   priority  The task priority.
 * @return {Promise<Object>} Result with 'existing' or 'toCreate' property.
 */
async function evaluateForCollection(TaskClass, priority) {
  const providerId = TaskClass.providerId;
  try {
    const taskInstance = new TaskClass();

    // Handle multi-task providers
    const isMultiTask = TaskClass.isMultiTask || false;
    const hasGetTasksToInject = taskInstance.getTasksToInject && typeof taskInstance.getTasksToInject === 'function';
    if (isMultiTask || hasGetTasksToInject) {
      // Multi-task providers need special handling
      return await evaluateMultiTaskProvider(taskInstance, TaskClass, priority);
    }

    // Single-task provider
    const taskId = taskInstance.getTaskId?.() || providerId;

    // Check cache first - skip evaluation for tasks we already know about
    const cached = existingTasksCache.get(taskId);

    // QUICK SKIP: Task was completed (trash) or snoozed (future) - skip entirely
    if (cached && !cached._isActive) {
      return {};
    }

    // QUICK RETURN: Active task already exists - return immediately (NO evaluation needed!)
    if (cached && cached._isActive) {
      if (cached.prpl_priority === undefined) {
        cached.prpl_priority = priority;
      }
      return {
        existing: {
          task: cached,
          priority
        }
      };
    }

    // Task doesn't exist in cache - run full evaluation
    if (!taskInstance.shouldAddTask) {
      return {};
    }
    const shouldAdd = await taskInstance.shouldAddTask();
    if (!shouldAdd) {
      return {};
    }

    // Task doesn't exist - collect details for batch creation
    if (!taskInstance.getTaskDetails) {
      return {};
    }
    const taskDetails = await taskInstance.getTaskDetails();
    if (!taskDetails) {
      return {};
    }

    // Ensure required fields
    taskDetails.task_id = taskDetails.task_id || taskId;
    taskDetails.provider_id = taskDetails.provider_id || providerId;
    return {
      toCreate: {
        taskDetails,
        priority,
        taskId
      }
    };
  } catch (error) {
    console.error(`Error evaluating task "${providerId}":`, error);
    return {};
  }
}

/**
 * Evaluate a multi-task provider (one that injects multiple tasks).
 *
 * @param {Object}   taskInstance The task instance.
 * @param {Function} TaskClass    The task class.
 * @param {number}   priority     The task priority.
 * @return {Promise<Object>} Result with existing tasks and tasks to create.
 */
async function evaluateMultiTaskProvider(taskInstance, TaskClass, priority) {
  const providerId = TaskClass.providerId;
  const existing = [];
  const toCreate = [];
  try {
    // Check if any tasks should be added
    if (taskInstance.shouldAddTask) {
      const shouldAdd = await taskInstance.shouldAddTask();
      if (!shouldAdd) {
        return {};
      }
    }
    const tasksToInject = await taskInstance.getTasksToInject();
    if (!Array.isArray(tasksToInject)) {
      return {};
    }
    for (const taskData of tasksToInject) {
      const taskId = taskInstance.getTaskId?.(taskData) || providerId;

      // Check cache
      const cached = existingTasksCache.get(taskId);
      if (cached) {
        if (cached._isActive) {
          if (cached.prpl_priority === undefined) {
            cached.prpl_priority = priority;
          }
          existing.push({
            task: cached,
            priority
          });
        }
        // Skip completed/snoozed
        continue;
      }

      // Need to create - get details
      if (taskInstance.getTaskDetails) {
        const taskDetails = await taskInstance.getTaskDetails(taskData);
        if (taskDetails) {
          taskDetails.task_id = taskDetails.task_id || taskId;
          taskDetails.provider_id = taskDetails.provider_id || providerId;
          toCreate.push({
            taskDetails,
            priority,
            taskId
          });
        }
      }
    }

    // Return combined results
    if (existing.length === 1 && toCreate.length === 0) {
      return {
        existing: existing[0]
      };
    }
    if (existing.length === 0 && toCreate.length === 1) {
      return {
        toCreate: toCreate[0]
      };
    }

    // For multiple results, we need to handle them specially
    // Return first existing if any, otherwise first to create
    if (existing.length > 0) {
      return {
        existing: existing[0]
      };
    }
    if (toCreate.length > 0) {
      return {
        toCreate: toCreate[0]
      };
    }
    return {};
  } catch (error) {
    console.error(`Error evaluating multi-task provider "${providerId}":`, error);
    return {};
  }
}

/**
 * Reset evaluation state (useful for testing).
 */
function resetEvaluationState() {
  evaluationState.isPreFetchComplete = false;
  evaluationState.isEvaluating = false;
  evaluationState.currentIndex = 0;
  existingTasksCache = new Map();
  sortedTaskClasses = [];
}

/**
 * Get evaluation progress information.
 *
 * @return {Object} Progress info: { current, total, complete }.
 */
function getEvaluationProgress() {
  return {
    current: evaluationState.currentIndex,
    total: sortedTaskClasses.length,
    complete: evaluationState.currentIndex >= sortedTaskClasses.length,
    isEvaluating: evaluationState.isEvaluating
  };
}

/**
 * Check if there are more tasks to evaluate.
 *
 * @return {boolean} True if more tasks can be evaluated.
 */
function hasMoreTasksToEvaluate() {
  // If not initialized yet, assume there are more
  if (!evaluationState.isPreFetchComplete) {
    return true;
  }
  return evaluationState.currentIndex < sortedTaskClasses.length;
}

/**
 * Get a task provider class by provider ID.
 *
 * @param {string} providerId The provider ID.
 * @return {Function|null} The task provider class, or null if not found.
 */
function getTaskProviderClass(providerId) {
  if (!providerId) {
    return null;
  }
  return taskProviders.get(providerId) || null;
}

/**
 * Get a task provider instance by provider ID.
 *
 * @param {string} providerId The provider ID.
 * @return {Object|null} The task provider instance, or null if not found.
 */
function getTaskProviderInstance(providerId) {
  if (!providerId) {
    return null;
  }
  const TaskClass = getTaskProviderClass(providerId);
  if (!TaskClass) {
    return null;
  }
  try {
    return new TaskClass();
  } catch (error) {
    console.error(`Error creating instance of task provider "${providerId}":`, error);
    return null;
  }
}

/**
 * Get the buffer size constant.
 *
 * @return {number} Buffer size.
 */
function getBufferSize() {
  return BUFFER_SIZE;
}

/***/ }),

/***/ "./assets/src/stores/dashboardStore.js":
/*!*********************************************!*\
  !*** ./assets/src/stores/dashboardStore.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   useActivityScore: () => (/* binding */ useActivityScore),
/* harmony export */   useBadgeProgressStore: () => (/* binding */ useBadgeProgressStore),
/* harmony export */   useDashboardStore: () => (/* binding */ useDashboardStore),
/* harmony export */   useTaskCompletions: () => (/* binding */ useTaskCompletions)
/* harmony export */ });
/* harmony import */ var zustand__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! zustand */ "./node_modules/zustand/esm/react.mjs");
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/api-fetch */ "@wordpress/api-fetch");
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _services_apiFetchCache__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../services/apiFetchCache */ "./assets/src/services/apiFetchCache.js");
/**
 * Dashboard Store (Zustand)
 *
 * Provides shared state and actions for dashboard widgets.
 * Uses Zustand for cross-widget state management that works
 * across separate React roots (webpack entry points).
 */





/**
 * Dashboard store.
 *
 * State is automatically shared across all React roots because
 * Zustand stores are global singletons.
 */
const useDashboardStore = (0,zustand__WEBPACK_IMPORTED_MODULE_0__.create)((set, get) => ({
  // State

  /**
   * Points earned in the current session.
   */
  sessionPoints: 0,
  /**
   * Total points for current period (from API).
   */
  totalPoints: 0,
  /**
   * Timestamp of last task completion (for animations).
   */
  lastCompletionTime: null,
  /**
   * Last completed task info (for celebrations).
   */
  lastCompletedTask: null,
  /**
   * Activity score data.
   */
  activityScore: {
    current: 0,
    target: 100
  },
  /**
   * Badge progress data (keyed by badge type).
   */
  badgeProgress: {},
  /**
   * Cache invalidation timestamp (widgets can watch this to refetch).
   */
  cacheInvalidatedAt: null,
  /**
   * Flag to indicate if the onboarding wizard should auto-start.
   */
  shouldAutoStartWizard: false,
  /**
   * Provider taxonomy terms (keyed by slug).
   * Used to get term IDs for task creation.
   */
  providerTerms: {},
  /**
   * Whether provider terms are being loaded.
   */
  termsLoading: false,
  /**
   * Whether provider terms have been loaded.
   */
  termsLoaded: false,
  // Actions

  /**
   * Called when a task is completed.
   *
   * @param {Object} task   - The completed task.
   * @param {number} points - Points earned.
   */
  onTaskCompleted: (task, points = 0) => set(state => ({
    sessionPoints: state.sessionPoints + points,
    lastCompletionTime: Date.now(),
    lastCompletedTask: task
  })),
  /**
   * Called when a task is marked incomplete (unchecked).
   *
   * @param {Object} task   - The task.
   * @param {number} points - Points to subtract.
   */
  onTaskUncompleted: (task, points = 0) => set(state => ({
    sessionPoints: Math.max(0, state.sessionPoints - points)
  })),
  /**
   * Update activity score.
   *
   * @param {Object} scoreData - Score data to update.
   */
  updateActivityScore: scoreData => set(state => ({
    activityScore: {
      ...state.activityScore,
      ...scoreData
    }
  })),
  /**
   * Update badge progress.
   *
   * @param {string} badgeType - Badge type identifier.
   * @param {Object} progress  - Progress data.
   */
  updateBadgeProgress: (badgeType, progress) => set(state => ({
    badgeProgress: {
      ...state.badgeProgress,
      [badgeType]: progress
    }
  })),
  /**
   * Invalidate cache to trigger widget refetch.
   * Clears the centralized API cache.
   */
  invalidateCache: () => {
    (0,_services_apiFetchCache__WEBPACK_IMPORTED_MODULE_2__.clearCache)();
    set({
      cacheInvalidatedAt: Date.now()
    });
  },
  /**
   * Set whether the onboarding wizard should auto-start.
   *
   * @param {boolean} value - Whether to auto-start the wizard.
   */
  setShouldAutoStartWizard: value => {
    set({
      shouldAutoStartWizard: value
    });
  },
  /**
   * Get provider term ID by slug.
   *
   * @param {string} slug - The term slug (e.g., 'user').
   * @return {number|null} The term ID, or null if not found.
   */
  getProviderTermId: slug => {
    const state = get();
    return state.providerTerms[slug]?.id || null;
  },
  /**
   * Fetch provider taxonomy terms from REST API.
   * Creates 'user' term if it doesn't exist (matches develop branch behavior).
   *
   * @return {Promise<Object>} Promise resolving to terms object.
   */
  fetchProviderTerms: async () => {
    const state = get();
    if (state.termsLoaded || state.termsLoading) {
      return state.providerTerms;
    }
    set({
      termsLoading: true
    });
    try {
      const data = await _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1___default()({
        path: '/wp/v2/prpl_recommendations_provider?per_page=100'
      });
      const terms = {};
      let userTermFound = false;
      data.forEach(term => {
        terms[term.slug] = term;
        if (term.slug === 'user') {
          userTermFound = true;
        }
      });

      // If 'user' term doesn't exist, create it (matches develop branch)
      if (!userTermFound) {
        try {
          const newTerm = await _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1___default()({
            path: '/wp/v2/prpl_recommendations_provider',
            method: 'POST',
            data: {
              slug: 'user',
              name: 'user'
            }
          });
          terms.user = newTerm;
        } catch (createError) {
          // Handle term_exists gracefully - fetch the existing term
          if (createError.code === 'term_exists' && createError.data?.term_id) {
            try {
              const existingTerm = await _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1___default()({
                path: `/wp/v2/prpl_recommendations_provider/${createError.data.term_id}`
              });
              terms.user = existingTerm;
            } catch (fetchError) {
              // eslint-disable-next-line no-console
              console.error('Error fetching existing user term:', fetchError);
            }
          } else {
            // eslint-disable-next-line no-console
            console.error('Error creating user term:', createError);
          }
        }
      }
      set({
        providerTerms: terms,
        termsLoading: false,
        termsLoaded: true
      });
      return terms;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching provider terms:', error);
      set({
        termsLoading: false
      });
      return {};
    }
  }
}));

/**
 * Hook to subscribe to task completions.
 * Convenience hook for widgets that only need completion events.
 *
 * Uses Zustand's selector pattern for optimal re-renders.
 *
 * @return {Object} Task completion state.
 */
function useTaskCompletions() {
  return useDashboardStore(state => ({
    sessionPoints: state.sessionPoints,
    lastCompletionTime: state.lastCompletionTime,
    lastCompletedTask: state.lastCompletedTask
  }));
}

/**
 * Hook to subscribe to activity score.
 *
 * @return {Object} Activity score state and updater.
 */
function useActivityScore() {
  const activityScore = useDashboardStore(state => state.activityScore);
  const updateActivityScore = useDashboardStore(state => state.updateActivityScore);
  return {
    activityScore,
    updateActivityScore
  };
}

/**
 * Hook to subscribe to badge progress.
 *
 * @param {string} badgeType - Optional badge type to filter.
 * @return {Object} Badge progress state and updater.
 */
function useBadgeProgressStore(badgeType = null) {
  const badgeProgress = useDashboardStore(state => state.badgeProgress);
  const updateBadgeProgress = useDashboardStore(state => state.updateBadgeProgress);
  const progress = badgeType ? badgeProgress[badgeType] : badgeProgress;
  return {
    progress,
    updateBadgeProgress
  };
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (useDashboardStore);

/***/ }),

/***/ "./assets/src/tasks/BlogDescriptionTask.js":
/*!*************************************************!*\
  !*** ./assets/src/tasks/BlogDescriptionTask.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _services_InteractiveTaskProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../services/InteractiveTaskProvider */ "./assets/src/services/InteractiveTaskProvider.js");
/* harmony import */ var _services_taskRegistry__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../services/taskRegistry */ "./assets/src/services/taskRegistry.js");
/* harmony import */ var _services_apiFetchCache__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../services/apiFetchCache */ "./assets/src/services/apiFetchCache.js");
/**
 * Blog Description Task Provider.
 *
 * React implementation of the Blog Description (tagline) task.
 * Migrated from classes/suggested-tasks/providers/class-blog-description.php
 */






/**
 * Blog Description Task Provider class.
 */
class BlogDescriptionTask extends _services_InteractiveTaskProvider__WEBPACK_IMPORTED_MODULE_1__.InteractiveTaskProvider {
  static providerId = 'core-blogdescription';
  static capability = 'manage_options';
  static isOnboardingTask = true;
  static priority = 2;
  static points = 1;
  static isDismissable = false;
  static isSnoozable = true;
  static externalLinkUrl = 'https://prpl.fyi/set-tagline';
  static popoverId = 'core-blogdescription';

  /**
   * Check if the task should be added.
   *
   * @param {Object} taskData Optional task-specific data.
   * @return {Promise<boolean>} Promise resolving to true if task should be added.
   */
  // eslint-disable-next-line no-unused-vars
  async shouldAddTask(taskData = {}) {
    try {
      // Fetch WordPress settings to check if blog description is empty.
      const settings = await (0,_services_apiFetchCache__WEBPACK_IMPORTED_MODULE_3__.cachedApiFetch)({
        path: '/wp/v2/settings'
      });

      // Task should be added if description (tagline) is empty.
      return !settings?.description || settings.description === '';
    } catch (error) {
      console.error('Error checking Blog Description task condition:', error);
      return false;
    }
  }

  /**
   * Get task details.
   *
   * @param {Object} taskData Optional task-specific data.
   * @return {Promise<Object>} Promise resolving to task details object.
   */
  // eslint-disable-next-line no-unused-vars
  async getTaskDetails(taskData = {}) {
    const taskDetails = this.buildTaskDetails(taskData, {
      post_title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Set tagline', 'progress-planner'),
      description: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Set the tagline to make your website look more professional.', 'progress-planner'),
      url: this.buildAdminUrl('options-general.php')
    });

    // Add popover ID for interactive tasks.
    return this.addPopoverIdToTaskDetails(taskDetails);
  }

  /**
   * Get the label for the popover action.
   *
   * @return {string} The action label.
   */
  getPopoverActionLabel() {
    return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Set tagline', 'progress-planner');
  }
}

// Self-register this task provider
(0,_services_taskRegistry__WEBPACK_IMPORTED_MODULE_2__.registerTask)(BlogDescriptionTask);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (BlogDescriptionTask);

/***/ }),

/***/ "./assets/src/tasks/ContentCreateTask.js":
/*!***********************************************!*\
  !*** ./assets/src/tasks/ContentCreateTask.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _services_TaskProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../services/TaskProvider */ "./assets/src/services/TaskProvider.js");
/* harmony import */ var _services_taskRegistry__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../services/taskRegistry */ "./assets/src/services/taskRegistry.js");
/* harmony import */ var _hooks_useTasksApi__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../hooks/useTasksApi */ "./assets/src/hooks/useTasksApi/index.js");
/**
 * Content Create Task Provider.
 *
 * React implementation of the Content Create task.
 * Migrated from classes/suggested-tasks/providers/class-content-create.php
 */






/**
 * Content Create Task Provider class.
 */
class ContentCreateTask extends _services_TaskProvider__WEBPACK_IMPORTED_MODULE_1__.TaskProvider {
  static providerId = 'create-post';
  static capability = 'edit_others_posts';
  static isOnboardingTask = false;
  static priority = 50;
  static points = 1;
  static isDismissable = false;
  static isSnoozable = true;
  static isRepetitive = true;
  static externalLinkUrl = 'https://prpl.fyi/valuable-content';

  /**
   * Check if the task should be added.
   *
   * @param {Object} taskData Optional task-specific data.
   * @return {Promise<boolean>} Promise resolving to true if task should be added.
   */
  // eslint-disable-next-line no-unused-vars
  async shouldAddTask(taskData = {}) {
    try {
      // Check when the last post was published.
      // The PHP version checks if last published post is older than 30 days.
      // For React, we'll fetch the last published post data.
      const lastPublishedPost = await (0,_hooks_useTasksApi__WEBPACK_IMPORTED_MODULE_3__.fetchDataCollector)('last_published_post_id');
      if (!lastPublishedPost || !lastPublishedPost.post_id) {
        // No posts published, should show task.
        return true;
      }

      // Check if post is older than 30 days.
      // The data collector might return the post date, but for now we'll return true.
      // This can be refined when we have the full data structure.
      return true;
    } catch (error) {
      console.error('Error checking Content Create task condition:', error);
      return false;
    }
  }

  /**
   * Get task details.
   *
   * @param {Object} taskData Optional task-specific data.
   * @return {Promise<Object>} Promise resolving to task details object.
   */
  // eslint-disable-next-line no-unused-vars
  async getTaskDetails(taskData = {}) {
    // Get last published post data if available.
    const lastPublishedPost = await (0,_hooks_useTasksApi__WEBPACK_IMPORTED_MODULE_3__.fetchDataCollector)('last_published_post_id');
    const targetPostId = lastPublishedPost?.post_id || null;
    return this.buildTaskDetails(taskData, {
      post_title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Create valuable content', 'progress-planner'),
      url: 'https://prpl.fyi/valuable-content',
      url_target: '_blank',
      target_post_id: targetPostId
    });
  }

  /**
   * Add task actions for this task.
   *
   * @param {Object} taskData Task data object.
   * @param {Array}  actions  Existing actions array.
   * @return {Array} Modified actions array.
   */
  addTaskActions(taskData, actions) {
    actions.push({
      type: 'link',
      priority: 10,
      href: this.buildAdminUrl('post-new.php'),
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Create new post', 'progress-planner'),
      target: '_self'
    });
    return actions;
  }
}

// Self-register this task provider
(0,_services_taskRegistry__WEBPACK_IMPORTED_MODULE_2__.registerTask)(ContentCreateTask);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ContentCreateTask);

/***/ }),

/***/ "./assets/src/tasks/ContentReviewTask.js":
/*!***********************************************!*\
  !*** ./assets/src/tasks/ContentReviewTask.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _services_TaskProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../services/TaskProvider */ "./assets/src/services/TaskProvider.js");
/* harmony import */ var _services_taskRegistry__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../services/taskRegistry */ "./assets/src/services/taskRegistry.js");
/* harmony import */ var _hooks_useTasksApi__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../hooks/useTasksApi */ "./assets/src/hooks/useTasksApi/index.js");
/**
 * Content Review Task Provider.
 *
 * React implementation of the Content Review task.
 * Migrated from classes/suggested-tasks/providers/class-content-review.php
 *
 * Multi-task provider that creates tasks for posts that need review.
 * Important pages are checked after 6 months, regular posts after 12 months.
 */






/**
 * Content Review Task Provider class.
 */
class ContentReviewTask extends _services_TaskProvider__WEBPACK_IMPORTED_MODULE_1__.TaskProvider {
  static providerId = 'review-post';
  static capability = 'edit_others_posts';
  static isOnboardingTask = false;
  static priority = 10;
  static points = 1;
  static isDismissable = true;
  static isSnoozable = true;
  static isRepetitive = true;
  static externalLinkUrl = 'https://prpl.fyi/review-post';
  static isMultiTask = true;

  /**
   * Check if the task should be added.
   *
   * @param {Object} taskData Optional task-specific data.
   * @return {Promise<boolean>} Promise resolving to true if task should be added.
   */
  // eslint-disable-next-line no-unused-vars
  async shouldAddTask(taskData = {}) {
    // Check if there are any posts that need review.
    // The getTasksToInject() method will return the actual list of posts.
    try {
      const tasksToInject = await this.getTasksToInject();
      return tasksToInject && tasksToInject.length > 0;
    } catch (error) {
      console.error('Error checking Content Review task condition:', error);
      return false;
    }
  }

  /**
   * Get tasks to inject.
   *
   * Returns an array of taskData items, one for each post that needs review.
   *
   * @return {Promise<Array>} Promise resolving to array of taskData objects.
   */
  async getTasksToInject() {
    try {
      const postsForReview = await (0,_hooks_useTasksApi__WEBPACK_IMPORTED_MODULE_3__.fetchDataCollector)('old_posts_for_review');
      if (!postsForReview || postsForReview.length === 0) {
        return [];
      }

      // Map posts to taskData objects for multi-task injection.
      return postsForReview.map(post => ({
        target_post_id: post.ID,
        target_post_title: post.post_title,
        target_post_type: post.post_type
      }));
    } catch (error) {
      console.error('Error getting posts for review:', error);
      return [];
    }
  }

  /**
   * Get task details.
   *
   * @param {Object} taskData Optional task-specific data.
   * @return {Promise<Object>} Promise resolving to task details object.
   */
  // eslint-disable-next-line no-unused-vars
  async getTaskDetails(taskData = {}) {
    const targetPostId = taskData?.target_post_id || null;
    const targetPostTitle = taskData?.target_post_title || null;
    if (!targetPostId) {
      throw new Error('ContentReviewTask requires target_post_id in taskData');
    }

    // Use post title if available, otherwise fall back to generic title.
    const postTitle = targetPostTitle ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.sprintf)(/* translators: %s: post title */
    (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Review: %s', 'progress-planner'), targetPostTitle) : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.sprintf)(/* translators: %d: post ID */
    (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Review post #%d', 'progress-planner'), targetPostId);
    return this.buildTaskDetails(taskData, {
      post_title: postTitle,
      url: this.buildAdminUrl('post.php', {
        post: targetPostId,
        action: 'edit'
      }),
      url_target: '_blank',
      target_post_id: targetPostId
    });
  }

  /**
   * Add custom task actions for Content Review task.
   *
   * Adds a "Review" action that links to the post edit page.
   *
   * @param {Object} taskData The task data.
   * @param {Array}  actions  The existing actions array.
   *
   * @return {Array} The modified actions array.
   */
  addTaskActions(taskData = [], actions = []) {
    const targetPostId = taskData.target_post_id || taskData.meta?.target_post_id || null;
    if (targetPostId) {
      actions.push({
        type: 'link',
        priority: 10,
        href: this.buildAdminUrl('post.php', {
          action: 'edit',
          post: targetPostId
        }),
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Review', 'progress-planner'),
        target: '_self'
      });
    }
    return actions;
  }
}

// Self-register this task provider
(0,_services_taskRegistry__WEBPACK_IMPORTED_MODULE_2__.registerTask)(ContentReviewTask);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ContentReviewTask);

/***/ }),

/***/ "./assets/src/tasks/CoreUpdateTask.js":
/*!********************************************!*\
  !*** ./assets/src/tasks/CoreUpdateTask.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _services_TaskProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../services/TaskProvider */ "./assets/src/services/TaskProvider.js");
/* harmony import */ var _services_taskRegistry__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../services/taskRegistry */ "./assets/src/services/taskRegistry.js");
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/api-fetch */ "@wordpress/api-fetch");
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_3__);
/**
 * Core Update Task Provider.
 *
 * React implementation of the Core Update task.
 * Migrated from classes/suggested-tasks/providers/class-core-update.php
 */






/**
 * Core Update Task Provider class.
 */
class CoreUpdateTask extends _services_TaskProvider__WEBPACK_IMPORTED_MODULE_1__.TaskProvider {
  static providerId = 'update-core';
  static capability = 'update_core';
  static isOnboardingTask = false;
  static priority = 20;
  static points = 1;
  static isDismissable = false;
  static isSnoozable = true;
  static isRepetitive = true;
  static externalLinkUrl = 'https://prpl.fyi/perform-all-updates';

  /**
   * Check if the task should be added.
   *
   * @param {Object} taskData Optional task-specific data.
   * @return {Promise<boolean>} Promise resolving to true if task should be added.
   */
  // eslint-disable-next-line no-unused-vars
  async shouldAddTask(taskData = {}) {
    try {
      // Check for available updates via WordPress REST API.
      // The PHP version uses wp_get_update_data() which checks for core, plugin, and theme updates.
      // For React, we can check the updates endpoint if available, or use a data collector.
      // For now, we'll use a simple check - if updates are available, show the task.
      // This might need a data collector for proper implementation.
      const updates = await _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_3___default()({
        path: '/wp/v2/updates'
      }).catch(() => null);
      if (updates) {
        // Check if there are any updates available.
        return updates.core && updates.core.length > 0 || updates.plugins && updates.plugins.length > 0 || updates.themes && updates.themes.length > 0;
      }

      // Fallback: return true to show task (can be refined with proper endpoint).
      return true;
    } catch (error) {
      console.error('Error checking Core Update task condition:', error);
      return false;
    }
  }

  /**
   * Get task details.
   *
   * @param {Object} taskData Optional task-specific data.
   * @return {Promise<Object>} Promise resolving to task details object.
   */
  // eslint-disable-next-line no-unused-vars
  async getTaskDetails(taskData = {}) {
    return this.buildTaskDetails(taskData, {
      post_title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Perform all updates', 'progress-planner'),
      url: this.buildAdminUrl('update-core.php')
    });
  }

  /**
   * Add task actions for this task.
   *
   * @param {Object} taskData Task data object.
   * @param {Array}  actions  Existing actions array.
   * @return {Array} Modified actions array.
   */
  addTaskActions(taskData, actions) {
    actions.push({
      type: 'link',
      priority: 10,
      href: this.buildAdminUrl('update-core.php'),
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Go to the Updates page', 'progress-planner'),
      target: '_self'
    });
    return actions;
  }
}

// Self-register this task provider
(0,_services_taskRegistry__WEBPACK_IMPORTED_MODULE_2__.registerTask)(CoreUpdateTask);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (CoreUpdateTask);

/***/ }),

/***/ "./assets/src/tasks/DebugDisplayTask.js":
/*!**********************************************!*\
  !*** ./assets/src/tasks/DebugDisplayTask.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _services_TaskProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../services/TaskProvider */ "./assets/src/services/TaskProvider.js");
/* harmony import */ var _services_taskRegistry__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../services/taskRegistry */ "./assets/src/services/taskRegistry.js");
/* harmony import */ var _hooks_useTasksApi__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../hooks/useTasksApi */ "./assets/src/hooks/useTasksApi/index.js");
/**
 * Debug Display Task Provider.
 *
 * React implementation of the Debug Display task.
 * Migrated from classes/suggested-tasks/providers/class-debug-display.php
 *
 * Checks if WP_DEBUG and WP_DEBUG_DISPLAY are both enabled (security concern).
 */






/**
 * Debug Display Task Provider class.
 */
class DebugDisplayTask extends _services_TaskProvider__WEBPACK_IMPORTED_MODULE_1__.TaskProvider {
  static providerId = 'wp-debug-display';
  static capability = 'manage_options';
  static isOnboardingTask = true;
  static priority = 10;
  static points = 1;
  static isDismissable = false;
  static isSnoozable = true;
  static externalLinkUrl = 'https://prpl.fyi/set-wp-debug';

  /**
   * Check if the task should be added.
   *
   * Task should be added if both WP_DEBUG and WP_DEBUG_DISPLAY are enabled.
   *
   * @param {Object} taskData Optional task-specific data.
   * @return {Promise<boolean>} Promise resolving to true if task should be added.
   */
  // eslint-disable-next-line no-unused-vars
  async shouldAddTask(taskData = {}) {
    try {
      const debugStatus = await (0,_hooks_useTasksApi__WEBPACK_IMPORTED_MODULE_3__.fetchDataCollector)('wp_debug_status');
      if (!debugStatus) {
        return false;
      }

      // Task should be shown if debug display is publicly visible.
      return debugStatus.should_fix === true;
    } catch (error) {
      console.error('Error checking Debug Display task condition:', error);
      return false;
    }
  }

  /**
   * Get task details.
   *
   * @param {Object} taskData Optional task-specific data.
   * @return {Promise<Object>} Promise resolving to task details object.
   */
  // eslint-disable-next-line no-unused-vars
  async getTaskDetails(taskData = {}) {
    return this.buildTaskDetails(taskData, {
      post_title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Disable public display of PHP errors', 'progress-planner')
    });
  }
}

// Self-register this task provider
(0,_services_taskRegistry__WEBPACK_IMPORTED_MODULE_2__.registerTask)(DebugDisplayTask);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (DebugDisplayTask);

/***/ }),

/***/ "./assets/src/tasks/DisableCommentPaginationTask.js":
/*!**********************************************************!*\
  !*** ./assets/src/tasks/DisableCommentPaginationTask.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _services_InteractiveTaskProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../services/InteractiveTaskProvider */ "./assets/src/services/InteractiveTaskProvider.js");
/* harmony import */ var _services_taskRegistry__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../services/taskRegistry */ "./assets/src/services/taskRegistry.js");
/* harmony import */ var _services_apiFetchCache__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../services/apiFetchCache */ "./assets/src/services/apiFetchCache.js");
/**
 * Disable Comment Pagination Task Provider.
 *
 * React implementation of the Disable Comment Pagination task.
 * Migrated from classes/suggested-tasks/providers/class-disable-comment-pagination.php
 */






/**
 * Disable Comment Pagination Task Provider class.
 */
class DisableCommentPaginationTask extends _services_InteractiveTaskProvider__WEBPACK_IMPORTED_MODULE_1__.InteractiveTaskProvider {
  static providerId = 'disable-comment-pagination';
  static capability = 'manage_options';
  static isOnboardingTask = true;
  static priority = 10;
  static points = 1;
  static isDismissable = false;
  static isSnoozable = true;
  static externalLinkUrl = 'https://prpl.fyi/disable-comment-pagination';
  static popoverId = 'disable-comment-pagination';

  /**
   * Check if the task should be added.
   *
   * @param {Object} taskData Optional task-specific data.
   * @return {Promise<boolean>} Promise resolving to true if task should be added.
   */
  // eslint-disable-next-line no-unused-vars
  async shouldAddTask(taskData = {}) {
    try {
      // Check if dependencies are satisfied (disable-comments task must be completed).
      // For now, we'll check if page_comments is enabled, which is the condition.
      // The dependency check would require checking task completion status via REST API.
      const settings = await (0,_services_apiFetchCache__WEBPACK_IMPORTED_MODULE_3__.cachedApiFetch)({
        path: '/wp/v2/settings'
      });

      // Task should be added if page_comments option is enabled (true).
      // Note: The PHP version checks dependencies via are_dependencies_satisfied(),
      // but for React we'll rely on the simple condition check.
      return settings?.page_comments === true;
    } catch (error) {
      console.error('Error checking Disable Comment Pagination task condition:', error);
      return false;
    }
  }

  /**
   * Get task details.
   *
   * @param {Object} taskData Optional task-specific data.
   * @return {Promise<Object>} Promise resolving to task details object.
   */
  // eslint-disable-next-line no-unused-vars
  async getTaskDetails(taskData = {}) {
    const taskDetails = this.buildTaskDetails(taskData, {
      post_title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Disable comment pagination', 'progress-planner'),
      url: this.buildAdminUrl('options-discussion.php'),
      link_setting: {
        hook: 'options-discussion.php',
        iconEl: 'label[for="page_comments"]'
      }
    });

    // Add popover ID for interactive tasks.
    return this.addPopoverIdToTaskDetails(taskDetails);
  }

  /**
   * Get the label for the popover action.
   *
   * @return {string} The action label.
   */
  getPopoverActionLabel() {
    return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Disable pagination', 'progress-planner');
  }
}

// Self-register this task provider
(0,_services_taskRegistry__WEBPACK_IMPORTED_MODULE_2__.registerTask)(DisableCommentPaginationTask);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (DisableCommentPaginationTask);

/***/ }),

/***/ "./assets/src/tasks/DisableCommentsTask.js":
/*!*************************************************!*\
  !*** ./assets/src/tasks/DisableCommentsTask.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _services_InteractiveTaskProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../services/InteractiveTaskProvider */ "./assets/src/services/InteractiveTaskProvider.js");
/* harmony import */ var _services_taskRegistry__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../services/taskRegistry */ "./assets/src/services/taskRegistry.js");
/* harmony import */ var _services_apiFetchCache__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../services/apiFetchCache */ "./assets/src/services/apiFetchCache.js");
/**
 * Disable Comments Task Provider.
 *
 * React implementation of the Disable Comments task.
 * Migrated from classes/suggested-tasks/providers/class-disable-comments.php
 */






/**
 * Disable Comments Task Provider class.
 */
class DisableCommentsTask extends _services_InteractiveTaskProvider__WEBPACK_IMPORTED_MODULE_1__.InteractiveTaskProvider {
  static providerId = 'disable-comments';
  static capability = 'manage_options';
  static isOnboardingTask = true;
  static priority = 9;
  static points = 1;
  static isDismissable = false;
  static isSnoozable = true;
  static externalLinkUrl = 'https://prpl.fyi/disable-comments';
  static popoverId = 'disable-comments';

  /**
   * Check if the task should be added.
   *
   * @param {Object} taskData Optional task-specific data.
   * @return {Promise<boolean>} Promise resolving to true if task should be added.
   */
  // eslint-disable-next-line no-unused-vars
  async shouldAddTask(taskData = {}) {
    try {
      // The PHP version checks:
      // - !is_plugin_activated('comment-free-zone')
      // - wp_count_comments()->approved < 10
      // - get_default_comment_status() === 'open'
      // For React, we'll check comment status via REST API.
      // Plugin check and comment count would need data collector or REST endpoint.
      const settings = await (0,_services_apiFetchCache__WEBPACK_IMPORTED_MODULE_3__.cachedApiFetch)({
        path: '/wp/v2/settings'
      });

      // Check if default comment status is 'open'.
      const defaultCommentStatus = settings?.default_comment_status || 'open';
      return defaultCommentStatus === 'open';
    } catch (error) {
      console.error('Error checking Disable Comments task condition:', error);
      return false;
    }
  }

  /**
   * Get task details.
   *
   * @param {Object} taskData Optional task-specific data.
   * @return {Promise<Object>} Promise resolving to task details object.
   */
  // eslint-disable-next-line no-unused-vars
  async getTaskDetails(taskData = {}) {
    const taskDetails = this.buildTaskDetails(taskData, {
      post_title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Disable comments', 'progress-planner'),
      url: this.buildAdminUrl('options-discussion.php'),
      link_setting: {
        hook: 'options-discussion.php',
        iconEl: 'label[for="default_comment_status"]'
      }
    });
    return this.addPopoverIdToTaskDetails(taskDetails);
  }

  /**
   * Get the label for the popover action.
   *
   * @return {string} The action label.
   */
  getPopoverActionLabel() {
    return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Disable comments', 'progress-planner');
  }
}

// Self-register this task provider
(0,_services_taskRegistry__WEBPACK_IMPORTED_MODULE_2__.registerTask)(DisableCommentsTask);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (DisableCommentsTask);

/***/ }),

/***/ "./assets/src/tasks/EmailSendingTask.js":
/*!**********************************************!*\
  !*** ./assets/src/tasks/EmailSendingTask.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _services_InteractiveTaskProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../services/InteractiveTaskProvider */ "./assets/src/services/InteractiveTaskProvider.js");
/* harmony import */ var _services_taskRegistry__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../services/taskRegistry */ "./assets/src/services/taskRegistry.js");
/**
 * Email Sending Task Provider.
 *
 * React implementation of the Email Sending task.
 * Migrated from classes/suggested-tasks/providers/class-email-sending.php
 */





/**
 * Email Sending Task Provider class.
 */
class EmailSendingTask extends _services_InteractiveTaskProvider__WEBPACK_IMPORTED_MODULE_1__.InteractiveTaskProvider {
  static providerId = 'sending-email';
  static capability = 'manage_options';
  static isOnboardingTask = false;
  static priority = 4;
  static points = 1;
  static isDismissable = true;
  static isSnoozable = true;
  static externalLinkUrl = 'https://prpl.fyi/check-if-your-websites-email-system-works';
  static popoverId = 'sending-email';

  /**
   * Check if the task should be added.
   *
   * @param {Object} taskData Optional task-specific data.
   * @return {Promise<boolean>} Promise resolving to true if task should be added.
   */
  // eslint-disable-next-line no-unused-vars
  async shouldAddTask(taskData = {}) {
    // The PHP version checks if wp_mail is filtered/overridden and if task was completed.
    // This requires server-side checking. For React, we'll return true.
    // This can be refined with proper data collector or REST API endpoint.
    return true;
  }

  /**
   * Get task details.
   *
   * @param {Object} taskData Optional task-specific data.
   * @return {Promise<Object>} Promise resolving to task details object.
   */
  // eslint-disable-next-line no-unused-vars
  async getTaskDetails(taskData = {}) {
    const taskDetails = this.buildTaskDetails(taskData, {
      post_title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("Check if your website's email system works", 'progress-planner'),
      url: this.buildAdminUrl('admin.php', {
        page: 'progress-planner'
      })
    });
    return this.addPopoverIdToTaskDetails(taskDetails);
  }

  /**
   * Get the label for the popover action.
   *
   * @return {string} The action label.
   */
  getPopoverActionLabel() {
    return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Test email sending', 'progress-planner');
  }
}

// Self-register this task provider
(0,_services_taskRegistry__WEBPACK_IMPORTED_MODULE_2__.registerTask)(EmailSendingTask);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (EmailSendingTask);

/***/ }),

/***/ "./assets/src/tasks/FewerTagsTask.js":
/*!*******************************************!*\
  !*** ./assets/src/tasks/FewerTagsTask.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _services_InteractiveTaskProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../services/InteractiveTaskProvider */ "./assets/src/services/InteractiveTaskProvider.js");
/* harmony import */ var _services_taskRegistry__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../services/taskRegistry */ "./assets/src/services/taskRegistry.js");
/* harmony import */ var _hooks_useTasksApi__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../hooks/useTasksApi */ "./assets/src/hooks/useTasksApi/index.js");
/**
 * Fewer Tags Task Provider.
 *
 * React implementation of the Fewer Tags task.
 * Migrated from classes/suggested-tasks/providers/class-fewer-tags.php
 */






/**
 * Fewer Tags Task Provider class.
 */
class FewerTagsTask extends _services_InteractiveTaskProvider__WEBPACK_IMPORTED_MODULE_1__.InteractiveTaskProvider {
  static providerId = 'fewer-tags';
  static capability = 'manage_options';
  static isOnboardingTask = true;
  static priority = 32;
  static points = 1;
  static isDismissable = true;
  static isSnoozable = true;
  static externalLinkUrl = 'https://prpl.fyi/install-fewer-tags';
  static popoverId = 'fewer-tags';

  /**
   * Check if the task should be added.
   *
   * @param {Object} taskData Optional task-specific data.
   * @return {Promise<boolean>} Promise resolving to true if task should be added.
   */
  // eslint-disable-next-line no-unused-vars
  async shouldAddTask(taskData = {}) {
    try {
      // The PHP version checks:
      // - !is_plugin_active('fewer-tags/fewer-tags.php')
      // - post_tag_count > published_post_count
      // For React, we'll fetch data collectors.
      const postTagCount = await (0,_hooks_useTasksApi__WEBPACK_IMPORTED_MODULE_3__.fetchDataCollector)('post_tag_count');
      const publishedPostCount = await (0,_hooks_useTasksApi__WEBPACK_IMPORTED_MODULE_3__.fetchDataCollector)('published_post_count');
      if (postTagCount !== null && publishedPostCount !== null && postTagCount > publishedPostCount) {
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error checking Fewer Tags task condition:', error);
      return false;
    }
  }

  /**
   * Get task details.
   *
   * @param {Object} taskData Optional task-specific data.
   * @return {Promise<Object>} Promise resolving to task details object.
   */
  // eslint-disable-next-line no-unused-vars
  async getTaskDetails(taskData = {}) {
    const taskDetails = this.buildTaskDetails(taskData, {
      post_title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Install Fewer Tags and clean up your tags', 'progress-planner'),
      url: this.buildAdminUrl('plugin-install.php', {
        tab: 'search',
        s: 'fewer tags'
      })
    });
    return this.addPopoverIdToTaskDetails(taskDetails);
  }

  /**
   * Get the label for the popover action.
   *
   * @return {string} The action label.
   */
  getPopoverActionLabel() {
    return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Install plugin', 'progress-planner');
  }
}

// Self-register this task provider
(0,_services_taskRegistry__WEBPACK_IMPORTED_MODULE_2__.registerTask)(FewerTagsTask);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (FewerTagsTask);

/***/ }),

/***/ "./assets/src/tasks/HelloWorldTask.js":
/*!********************************************!*\
  !*** ./assets/src/tasks/HelloWorldTask.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _services_InteractiveTaskProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../services/InteractiveTaskProvider */ "./assets/src/services/InteractiveTaskProvider.js");
/* harmony import */ var _services_taskRegistry__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../services/taskRegistry */ "./assets/src/services/taskRegistry.js");
/* harmony import */ var _hooks_useTasksApi__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../hooks/useTasksApi */ "./assets/src/hooks/useTasksApi/index.js");
/**
 * Hello World Task Provider.
 *
 * React implementation of the Hello World task.
 * Migrated from classes/suggested-tasks/providers/class-hello-world.php
 */






/**
 * Hello World Task Provider class.
 */
class HelloWorldTask extends _services_InteractiveTaskProvider__WEBPACK_IMPORTED_MODULE_1__.InteractiveTaskProvider {
  static providerId = 'hello-world';
  static capability = 'edit_posts';
  static isOnboardingTask = true;
  static priority = 15;
  static points = 1;
  static isDismissable = false;
  static isSnoozable = true;
  static externalLinkUrl = 'https://prpl.fyi/delete-hello-world-post';
  static popoverId = 'hello-world';

  /**
   * Check if the task should be added.
   *
   * @param {Object} taskData Optional task-specific data.
   * @return {Promise<boolean>} Promise resolving to true if task should be added.
   */
  // eslint-disable-next-line no-unused-vars
  async shouldAddTask(taskData = {}) {
    try {
      const helloWorldPostId = await (0,_hooks_useTasksApi__WEBPACK_IMPORTED_MODULE_3__.fetchDataCollector)('hello_world_post_id');
      return helloWorldPostId !== 0 && helloWorldPostId !== null;
    } catch (error) {
      console.error('Error checking Hello World task condition:', error);
      return false;
    }
  }

  /**
   * Get task details.
   *
   * @param {Object} taskData Optional task-specific data.
   * @return {Promise<Object>} Promise resolving to task details object.
   */
  async getTaskDetails(taskData = {}) {
    const helloWorldPostId = await (0,_hooks_useTasksApi__WEBPACK_IMPORTED_MODULE_3__.fetchDataCollector)('hello_world_post_id');

    // Build URL if we have a post ID.
    const url = helloWorldPostId && helloWorldPostId !== 0 ? this.buildAdminUrl('post.php', {
      post: helloWorldPostId,
      action: 'edit'
    }) : '';

    // Build description.
    const description = helloWorldPostId && helloWorldPostId !== 0 ? '<p>' + (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('On install, WordPress creates a "Hello World!" post. This post does not add value to your website and solely exists to show what a post can look like. Therefore, "Hello World!" is not needed and should be deleted.', 'progress-planner') + '</p>' : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('On install, WordPress creates a "Hello World!" post. This post is not needed and should be deleted.', 'progress-planner');
    const taskDetails = this.buildTaskDetails(taskData, {
      post_title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Delete the "Hello World!" post.', 'progress-planner'),
      description,
      url
    });

    // Add popover ID for interactive tasks.
    return this.addPopoverIdToTaskDetails(taskDetails);
  }

  /**
   * Get the label for the popover action.
   *
   * @return {string} The action label.
   */
  getPopoverActionLabel() {
    return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Delete', 'progress-planner');
  }
}

// Self-register this task provider
(0,_services_taskRegistry__WEBPACK_IMPORTED_MODULE_2__.registerTask)(HelloWorldTask);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (HelloWorldTask);

/***/ }),

/***/ "./assets/src/tasks/ImprovePdfHandlingTask.js":
/*!****************************************************!*\
  !*** ./assets/src/tasks/ImprovePdfHandlingTask.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _services_InteractiveTaskProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../services/InteractiveTaskProvider */ "./assets/src/services/InteractiveTaskProvider.js");
/* harmony import */ var _services_taskRegistry__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../services/taskRegistry */ "./assets/src/services/taskRegistry.js");
/**
 * Improve PDF Handling Task Provider.
 *
 * React implementation of the Improve PDF Handling task.
 * Migrated from classes/suggested-tasks/providers/class-improve-pdf-handling.php
 */





/**
 * Improve PDF Handling Task Provider class.
 */
class ImprovePdfHandlingTask extends _services_InteractiveTaskProvider__WEBPACK_IMPORTED_MODULE_1__.InteractiveTaskProvider {
  static providerId = 'improve-pdf-handling';
  static capability = 'manage_options';
  static isOnboardingTask = false;
  static priority = 1;
  static points = 1;
  static isDismissable = true;
  static isSnoozable = true;
  static externalLinkUrl = 'https://prpl.fyi/improve-pdf-handling';
  static popoverId = 'improve-pdf-handling';

  /**
   * Check if the task should be added.
   *
   * @param {Object} taskData Optional task-specific data.
   * @return {Promise<boolean>} Promise resolving to true if task should be added.
   */
  // eslint-disable-next-line no-unused-vars
  async shouldAddTask(taskData = {}) {
    // The PHP version checks if there are more than 10 PDF files.
    // This requires querying attachments with mime type 'application/pdf'.
    // For React, we'll return true to show the task.
    // This can be refined with proper data collector or REST API endpoint.
    return true;
  }

  /**
   * Get task details.
   *
   * @param {Object} taskData Optional task-specific data.
   * @return {Promise<Object>} Promise resolving to task details object.
   */
  // eslint-disable-next-line no-unused-vars
  async getTaskDetails(taskData = {}) {
    const taskDetails = this.buildTaskDetails(taskData, {
      post_title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Improve PDF handling', 'progress-planner'),
      url: this.buildAdminUrl('admin.php', {
        page: 'progress-planner'
      })
    });
    return this.addPopoverIdToTaskDetails(taskDetails);
  }

  /**
   * Get the label for the popover action.
   *
   * @return {string} The action label.
   */
  getPopoverActionLabel() {
    return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Improve PDF handling', 'progress-planner');
  }
}

// Self-register this task provider
(0,_services_taskRegistry__WEBPACK_IMPORTED_MODULE_2__.registerTask)(ImprovePdfHandlingTask);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ImprovePdfHandlingTask);

/***/ }),

/***/ "./assets/src/tasks/PermalinkStructureTask.js":
/*!****************************************************!*\
  !*** ./assets/src/tasks/PermalinkStructureTask.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _services_InteractiveTaskProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../services/InteractiveTaskProvider */ "./assets/src/services/InteractiveTaskProvider.js");
/* harmony import */ var _services_taskRegistry__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../services/taskRegistry */ "./assets/src/services/taskRegistry.js");
/* harmony import */ var _services_apiFetchCache__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../services/apiFetchCache */ "./assets/src/services/apiFetchCache.js");
/**
 * Permalink Structure Task Provider.
 *
 * React implementation of the Permalink Structure task.
 * Migrated from classes/suggested-tasks/providers/class-permalink-structure.php
 */






/**
 * Permalink Structure Task Provider class.
 */
class PermalinkStructureTask extends _services_InteractiveTaskProvider__WEBPACK_IMPORTED_MODULE_1__.InteractiveTaskProvider {
  static providerId = 'core-permalink-structure';
  static capability = 'manage_options';
  static isOnboardingTask = true;
  static priority = 3;
  static points = 1;
  static isDismissable = false;
  static isSnoozable = true;
  static externalLinkUrl = 'https://prpl.fyi/change-default-permalink-structure';
  static popoverId = 'core-permalink-structure';

  /**
   * Check if the task should be added.
   *
   * @param {Object} taskData Optional task-specific data.
   * @return {Promise<boolean>} Promise resolving to true if task should be added.
   */
  // eslint-disable-next-line no-unused-vars
  async shouldAddTask(taskData = {}) {
    try {
      // Fetch WordPress settings to check permalink structure.
      const settings = await (0,_services_apiFetchCache__WEBPACK_IMPORTED_MODULE_3__.cachedApiFetch)({
        path: '/wp/v2/settings'
      });
      const permalinkStructure = settings?.permalink_structure || '';

      // Task should be added if permalink structure is the default day-based one.
      return permalinkStructure === '/%year%/%monthnum%/%day%/%postname%/' || permalinkStructure === '/index.php/%year%/%monthnum%/%day%/%postname%/';
    } catch (error) {
      console.error('Error checking Permalink Structure task condition:', error);
      return false;
    }
  }

  /**
   * Get task details.
   *
   * @param {Object} taskData Optional task-specific data.
   * @return {Promise<Object>} Promise resolving to task details object.
   */
  // eslint-disable-next-line no-unused-vars
  async getTaskDetails(taskData = {}) {
    const taskDetails = this.buildTaskDetails(taskData, {
      post_title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Set permalink structure', 'progress-planner'),
      url: this.buildAdminUrl('options-permalink.php'),
      link_setting: {
        hook: 'options-permalink.php',
        iconEl: 'label[for="permalink-input-month-name"], label[for="permalink-input-post-name"]'
      }
    });

    // Add popover ID for interactive tasks.
    return this.addPopoverIdToTaskDetails(taskDetails);
  }

  /**
   * Get the label for the popover action.
   *
   * @return {string} The action label.
   */
  getPopoverActionLabel() {
    return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Select permalink structure', 'progress-planner');
  }
}

// Self-register this task provider
(0,_services_taskRegistry__WEBPACK_IMPORTED_MODULE_2__.registerTask)(PermalinkStructureTask);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (PermalinkStructureTask);

/***/ }),

/***/ "./assets/src/tasks/PhpVersionTask.js":
/*!********************************************!*\
  !*** ./assets/src/tasks/PhpVersionTask.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _services_TaskProvider__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../services/TaskProvider */ "./assets/src/services/TaskProvider.js");
/* harmony import */ var _services_taskRegistry__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../services/taskRegistry */ "./assets/src/services/taskRegistry.js");
/* harmony import */ var _hooks_useTasksApi__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../hooks/useTasksApi */ "./assets/src/hooks/useTasksApi/index.js");
/**
 * PHP Version Task Provider.
 *
 * React implementation of the PHP Version task.
 * Migrated from classes/suggested-tasks/providers/class-php-version.php
 *
 * Checks if the PHP version is below 8.2 and suggests updating.
 */





/**
 * Recommended minimum PHP version.
 */
const RECOMMENDED_PHP_VERSION = '8.2';

/**
 * PHP Version Task Provider class.
 */
class PhpVersionTask extends _services_TaskProvider__WEBPACK_IMPORTED_MODULE_0__.TaskProvider {
  static providerId = 'php-version';
  static capability = 'manage_options';
  static isOnboardingTask = true;
  static priority = 25;
  static points = 1;
  static isDismissable = false;
  static isSnoozable = true;
  static externalLinkUrl = 'https://prpl.fyi/update-php-version';

  /**
   * Check if the task should be added.
   *
   * Task should be added if PHP version is below 8.2.
   *
   * @param {Object} taskData Optional task-specific data.
   * @return {Promise<boolean>} Promise resolving to true if task should be added.
   */
  // eslint-disable-next-line no-unused-vars
  async shouldAddTask(taskData = {}) {
    try {
      const phpVersion = await (0,_hooks_useTasksApi__WEBPACK_IMPORTED_MODULE_2__.fetchDataCollector)('php_version');
      if (!phpVersion) {
        return false;
      }

      // Compare versions: return true if current version is less than recommended.
      return this.versionCompare(phpVersion, RECOMMENDED_PHP_VERSION, '<');
    } catch (error) {
      console.error('Error checking PHP version task condition:', error);
      return false;
    }
  }

  /**
   * Compare two version strings.
   *
   * @param {string} v1       First version.
   * @param {string} v2       Second version.
   * @param {string} operator Comparison operator ('<', '<=', '>', '>=', '==').
   * @return {boolean} Result of comparison.
   */
  versionCompare(v1, v2, operator) {
    const v1Parts = v1.split('.').map(Number);
    const v2Parts = v2.split('.').map(Number);

    // Pad shorter array with zeros.
    while (v1Parts.length < v2Parts.length) {
      v1Parts.push(0);
    }
    while (v2Parts.length < v1Parts.length) {
      v2Parts.push(0);
    }
    let compare = 0;
    for (let i = 0; i < v1Parts.length; i++) {
      if (v1Parts[i] < v2Parts[i]) {
        compare = -1;
        break;
      }
      if (v1Parts[i] > v2Parts[i]) {
        compare = 1;
        break;
      }
    }
    switch (operator) {
      case '<':
        return compare < 0;
      case '<=':
        return compare <= 0;
      case '>':
        return compare > 0;
      case '>=':
        return compare >= 0;
      case '==':
        return compare === 0;
      default:
        return false;
    }
  }

  /**
   * Get task details.
   *
   * @param {Object} taskData Optional task-specific data.
   * @return {Promise<Object>} Promise resolving to task details object.
   */
  // eslint-disable-next-line no-unused-vars
  async getTaskDetails(taskData = {}) {
    return this.buildTaskDetails(taskData, {
      post_title: 'Update PHP version'
    });
  }
}

// Self-register this task provider
(0,_services_taskRegistry__WEBPACK_IMPORTED_MODULE_1__.registerTask)(PhpVersionTask);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (PhpVersionTask);

/***/ }),

/***/ "./assets/src/tasks/ReduceAutoloadedOptionsTask.js":
/*!*********************************************************!*\
  !*** ./assets/src/tasks/ReduceAutoloadedOptionsTask.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _services_InteractiveTaskProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../services/InteractiveTaskProvider */ "./assets/src/services/InteractiveTaskProvider.js");
/* harmony import */ var _services_taskRegistry__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../services/taskRegistry */ "./assets/src/services/taskRegistry.js");
/**
 * Reduce Autoloaded Options Task Provider.
 *
 * React implementation of the Reduce Autoloaded Options task.
 * Migrated from classes/suggested-tasks/providers/class-reduce-autoloaded-options.php
 */





/**
 * Reduce Autoloaded Options Task Provider class.
 */
class ReduceAutoloadedOptionsTask extends _services_InteractiveTaskProvider__WEBPACK_IMPORTED_MODULE_1__.InteractiveTaskProvider {
  static providerId = 'reduce-autoloaded-options';
  static capability = 'manage_options';
  static isOnboardingTask = false;
  static priority = 50;
  static points = 1;
  static isDismissable = true;
  static isSnoozable = true;
  static popoverId = 'reduce-autoloaded-options';

  /**
   * Check if the task should be added.
   *
   * @param {Object} taskData Optional task-specific data.
   * @return {Promise<boolean>} Promise resolving to true if task should be added.
   */
  // eslint-disable-next-line no-unused-vars
  async shouldAddTask(taskData = {}) {
    // The PHP version checks:
    // - !is_plugin_active('aaa-option-optimizer/aaa-option-optimizer.php')
    // - get_autoloaded_options_count() > 500
    // This requires server-side checking (database query and plugin check).
    // TODO: Create data collector or REST API endpoint.
    // For now, return false (task won't show) until data collector is implemented.
    return false;
  }

  /**
   * Get task details.
   *
   * @param {Object} taskData Optional task-specific data.
   * @return {Promise<Object>} Promise resolving to task details object.
   */
  // eslint-disable-next-line no-unused-vars
  async getTaskDetails(taskData = {}) {
    const taskDetails = this.buildTaskDetails(taskData, {
      post_title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Reduce number of autoloaded options', 'progress-planner'),
      url: this.buildAdminUrl('plugin-install.php', {
        tab: 'search',
        s: 'aaa option optimizer'
      })
    });
    return this.addPopoverIdToTaskDetails(taskDetails);
  }

  /**
   * Get the label for the popover action.
   *
   * @return {string} The action label.
   */
  getPopoverActionLabel() {
    return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Reduce', 'progress-planner');
  }
}

// Self-register this task provider
(0,_services_taskRegistry__WEBPACK_IMPORTED_MODULE_2__.registerTask)(ReduceAutoloadedOptionsTask);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ReduceAutoloadedOptionsTask);

/***/ }),

/***/ "./assets/src/tasks/RemoveInactivePluginsTask.js":
/*!*******************************************************!*\
  !*** ./assets/src/tasks/RemoveInactivePluginsTask.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _services_TaskProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../services/TaskProvider */ "./assets/src/services/TaskProvider.js");
/* harmony import */ var _services_taskRegistry__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../services/taskRegistry */ "./assets/src/services/taskRegistry.js");
/* harmony import */ var _hooks_useTasksApi__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../hooks/useTasksApi */ "./assets/src/hooks/useTasksApi/index.js");
/**
 * Remove Inactive Plugins Task Provider.
 *
 * React implementation of the Remove Inactive Plugins task.
 * Migrated from classes/suggested-tasks/providers/class-remove-inactive-plugins.php
 */






/**
 * Remove Inactive Plugins Task Provider class.
 */
class RemoveInactivePluginsTask extends _services_TaskProvider__WEBPACK_IMPORTED_MODULE_1__.TaskProvider {
  static providerId = 'remove-inactive-plugins';
  static capability = 'manage_options';
  static isOnboardingTask = false;
  static priority = 60;
  static points = 1;
  static isDismissable = false;
  static isSnoozable = true;
  static externalLinkUrl = 'https://prpl.fyi/remove-inactive-plugins';

  /**
   * Check if the task should be added.
   *
   * @param {Object} taskData Optional task-specific data.
   * @return {Promise<boolean>} Promise resolving to true if task should be added.
   */
  // eslint-disable-next-line no-unused-vars
  async shouldAddTask(taskData = {}) {
    try {
      const inactivePluginsCount = await (0,_hooks_useTasksApi__WEBPACK_IMPORTED_MODULE_3__.fetchDataCollector)('inactive_plugins_count');
      return inactivePluginsCount > 0;
    } catch (error) {
      console.error('Error checking Remove Inactive Plugins task condition:', error);
      return false;
    }
  }

  /**
   * Get task details.
   *
   * @param {Object} taskData Optional task-specific data.
   * @return {Promise<Object>} Promise resolving to task details object.
   */
  // eslint-disable-next-line no-unused-vars
  async getTaskDetails(taskData = {}) {
    return this.buildTaskDetails(taskData, {
      post_title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Remove inactive plugins', 'progress-planner'),
      url: this.buildAdminUrl('plugins.php', {
        plugin_status: 'inactive'
      })
    });
  }

  /**
   * Add task actions for this task.
   *
   * @param {Object} taskData Task data object.
   * @param {Array}  actions  Existing actions array.
   * @return {Array} Modified actions array.
   */
  addTaskActions(taskData, actions) {
    actions.push({
      type: 'link',
      priority: 10,
      href: this.buildAdminUrl('plugins.php', {
        plugin_status: 'inactive'
      }),
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Go to the "Plugins" page', 'progress-planner'),
      target: '_self'
    });
    return actions;
  }
}

// Self-register this task provider
(0,_services_taskRegistry__WEBPACK_IMPORTED_MODULE_2__.registerTask)(RemoveInactivePluginsTask);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (RemoveInactivePluginsTask);

/***/ }),

/***/ "./assets/src/tasks/RemoveTermsWithoutPostsTask.js":
/*!*********************************************************!*\
  !*** ./assets/src/tasks/RemoveTermsWithoutPostsTask.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _services_InteractiveTaskProvider__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../services/InteractiveTaskProvider */ "./assets/src/services/InteractiveTaskProvider.js");
/* harmony import */ var _services_taskRegistry__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../services/taskRegistry */ "./assets/src/services/taskRegistry.js");
/* harmony import */ var _hooks_useTasksApi__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../hooks/useTasksApi */ "./assets/src/hooks/useTasksApi/index.js");
/**
 * Remove Terms Without Posts Task Provider.
 *
 * React implementation of the Remove Terms Without Posts task.
 * Migrated from classes/suggested-tasks/providers/class-remove-terms-without-posts.php
 *
 * Note: This is a multi-task provider that creates multiple tasks.
 * Basic implementation - can be refined with proper data collection.
 */





/**
 * Remove Terms Without Posts Task Provider class.
 */
class RemoveTermsWithoutPostsTask extends _services_InteractiveTaskProvider__WEBPACK_IMPORTED_MODULE_0__.InteractiveTaskProvider {
  static providerId = 'remove-terms-without-posts';
  static capability = 'edit_others_posts';
  static isOnboardingTask = false;
  static priority = 60;
  static points = 1;
  static isDismissable = true;
  static isSnoozable = true;
  static externalLinkUrl = 'https://prpl.fyi/remove-empty-taxonomy';
  static popoverId = 'remove-terms-without-posts';
  static isMultiTask = true;

  /**
   * Check if the task should be added.
   *
   * @param {Object} taskData Optional task-specific data.
   * @return {Promise<boolean>} Promise resolving to true if task should be added.
   */
  // eslint-disable-next-line no-unused-vars
  async shouldAddTask(taskData = {}) {
    try {
      const tasksToInject = await this.getTasksToInject();
      return tasksToInject && tasksToInject.length > 0;
    } catch (error) {
      console.error('Error checking Remove Terms Without Posts task condition:', error);
      return false;
    }
  }

  /**
   * Get tasks to inject.
   *
   * Returns an array of taskData items, one for each term without posts.
   *
   * @return {Promise<Array>} Promise resolving to array of taskData objects.
   */
  async getTasksToInject() {
    try {
      const termsWithoutPosts = await (0,_hooks_useTasksApi__WEBPACK_IMPORTED_MODULE_2__.fetchDataCollector)('terms_without_posts');
      if (!termsWithoutPosts) {
        return [];
      }

      // Normalize to array - data collector returns single object, not array
      const termsArray = Array.isArray(termsWithoutPosts) ? termsWithoutPosts : [termsWithoutPosts];
      if (termsArray.length === 0) {
        return [];
      }

      // Return array of taskData objects, one per term
      return termsArray.map(term => ({
        target_term_id: term.term_id,
        target_taxonomy: term.taxonomy
      }));
    } catch (error) {
      console.error('Error getting tasks to inject for Remove Terms Without Posts:', error);
      return [];
    }
  }

  /**
   * Get task details.
   *
   * @param {Object} taskData Optional task-specific data.
   * @return {Promise<Object>} Promise resolving to task details object.
   */
  // eslint-disable-next-line no-unused-vars
  async getTaskDetails(taskData = {}) {
    const targetTermId = taskData?.target_term_id || null;
    const targetTaxonomy = taskData?.target_taxonomy || null;
    if (!targetTermId || !targetTaxonomy) {
      throw new Error('RemoveTermsWithoutPostsTask requires target_term_id and target_taxonomy in taskData');
    }
    const taskDetails = this.buildTaskDetails(taskData, {
      post_title: `Remove term #${targetTermId}`,
      url: this.buildAdminUrl('edit-tags.php', {
        taxonomy: targetTaxonomy
      }),
      url_target: '_blank',
      target_term_id: targetTermId,
      target_taxonomy: targetTaxonomy
    });
    return this.addPopoverIdToTaskDetails(taskDetails);
  }
}

// Self-register this task provider
(0,_services_taskRegistry__WEBPACK_IMPORTED_MODULE_1__.registerTask)(RemoveTermsWithoutPostsTask);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (RemoveTermsWithoutPostsTask);

/***/ }),

/***/ "./assets/src/tasks/RenameUncategorizedCategoryTask.js":
/*!*************************************************************!*\
  !*** ./assets/src/tasks/RenameUncategorizedCategoryTask.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _services_InteractiveTaskProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../services/InteractiveTaskProvider */ "./assets/src/services/InteractiveTaskProvider.js");
/* harmony import */ var _services_taskRegistry__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../services/taskRegistry */ "./assets/src/services/taskRegistry.js");
/* harmony import */ var _hooks_useTasksApi__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../hooks/useTasksApi */ "./assets/src/hooks/useTasksApi/index.js");
/**
 * Rename Uncategorized Category Task Provider.
 *
 * React implementation of the Rename Uncategorized Category task.
 * Migrated from classes/suggested-tasks/providers/class-rename-uncategorized-category.php
 */






/**
 * Rename Uncategorized Category Task Provider class.
 */
class RenameUncategorizedCategoryTask extends _services_InteractiveTaskProvider__WEBPACK_IMPORTED_MODULE_1__.InteractiveTaskProvider {
  static providerId = 'rename-uncategorized-category';
  static capability = 'manage_categories';
  static isOnboardingTask = true;
  static priority = 60;
  static points = 1;
  static isDismissable = false;
  static isSnoozable = true;
  static externalLinkUrl = 'https://prpl.fyi/rename-uncategorized-category';
  static popoverId = 'rename-uncategorized-category';

  /**
   * Check if the task should be added.
   *
   * @param {Object} taskData Optional task-specific data.
   * @return {Promise<boolean>} Promise resolving to true if task should be added.
   */
  // eslint-disable-next-line no-unused-vars
  async shouldAddTask(taskData = {}) {
    try {
      const uncategorizedCategoryId = await (0,_hooks_useTasksApi__WEBPACK_IMPORTED_MODULE_3__.fetchDataCollector)('uncategorized_category_id');
      return uncategorizedCategoryId !== 0 && uncategorizedCategoryId !== null;
    } catch (error) {
      console.error('Error checking Rename Uncategorized Category task condition:', error);
      return false;
    }
  }

  /**
   * Get task details.
   *
   * @param {Object} taskData Optional task-specific data.
   * @return {Promise<Object>} Promise resolving to task details object.
   */
  // eslint-disable-next-line no-unused-vars
  async getTaskDetails(taskData = {}) {
    const uncategorizedCategoryId = await (0,_hooks_useTasksApi__WEBPACK_IMPORTED_MODULE_3__.fetchDataCollector)('uncategorized_category_id');
    const taskDetails = this.buildTaskDetails(taskData, {
      post_title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Rename Uncategorized category', 'progress-planner'),
      url: this.buildAdminUrl('term.php', {
        taxonomy: 'category',
        tag_ID: uncategorizedCategoryId
      })
    });

    // Add popover ID for interactive tasks.
    return this.addPopoverIdToTaskDetails(taskDetails);
  }

  /**
   * Get the label for the popover action.
   *
   * @return {string} The action label.
   */
  getPopoverActionLabel() {
    return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Rename', 'progress-planner');
  }
}

// Self-register this task provider
(0,_services_taskRegistry__WEBPACK_IMPORTED_MODULE_2__.registerTask)(RenameUncategorizedCategoryTask);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (RenameUncategorizedCategoryTask);

/***/ }),

/***/ "./assets/src/tasks/SEOPluginTask.js":
/*!*******************************************!*\
  !*** ./assets/src/tasks/SEOPluginTask.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _services_InteractiveTaskProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../services/InteractiveTaskProvider */ "./assets/src/services/InteractiveTaskProvider.js");
/* harmony import */ var _services_taskRegistry__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../services/taskRegistry */ "./assets/src/services/taskRegistry.js");
/* harmony import */ var _hooks_useTasksApi__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../hooks/useTasksApi */ "./assets/src/hooks/useTasksApi/index.js");
/**
 * SEO Plugin Task Provider.
 *
 * React implementation of the SEO Plugin task.
 * Migrated from classes/suggested-tasks/providers/class-seo-plugin.php
 */






/**
 * SEO Plugin Task Provider class.
 */
class SEOPluginTask extends _services_InteractiveTaskProvider__WEBPACK_IMPORTED_MODULE_1__.InteractiveTaskProvider {
  static providerId = 'seo-plugin';
  static capability = 'manage_options';
  static isOnboardingTask = true;
  static priority = 20;
  static points = 1;
  static isDismissable = false;
  static isSnoozable = true;
  static externalLinkUrl = 'https://prpl.fyi/install-seo-plugin';
  static popoverId = 'seo-plugin';

  /**
   * Check if the task should be added.
   *
   * @param {Object} taskData Optional task-specific data.
   * @return {Promise<boolean>} Promise resolving to true if task should be added.
   */
  // eslint-disable-next-line no-unused-vars
  async shouldAddTask(taskData = {}) {
    try {
      // Check if SEO plugin is installed via data collector.
      const seoPluginInstalled = await (0,_hooks_useTasksApi__WEBPACK_IMPORTED_MODULE_3__.fetchDataCollector)('seo_plugin_installed');
      // Task should be added if no SEO plugin is detected.
      return !seoPluginInstalled;
    } catch (error) {
      console.error('Error checking SEO Plugin task condition:', error);
      return false;
    }
  }

  /**
   * Get task details.
   *
   * @param {Object} taskData Optional task-specific data.
   * @return {Promise<Object>} Promise resolving to task details object.
   */
  // eslint-disable-next-line no-unused-vars
  async getTaskDetails(taskData = {}) {
    const taskDetails = this.buildTaskDetails(taskData, {
      post_title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Install an SEO plugin', 'progress-planner'),
      url: this.buildAdminUrl('plugins.php')
    });

    // Add popover ID for interactive tasks.
    return this.addPopoverIdToTaskDetails(taskDetails);
  }

  /**
   * Get the label for the popover action.
   *
   * @return {string} The action label.
   */
  getPopoverActionLabel() {
    return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Install plugin', 'progress-planner');
  }
}

// Self-register this task provider
(0,_services_taskRegistry__WEBPACK_IMPORTED_MODULE_2__.registerTask)(SEOPluginTask);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SEOPluginTask);

/***/ }),

/***/ "./assets/src/tasks/SamplePageTask.js":
/*!********************************************!*\
  !*** ./assets/src/tasks/SamplePageTask.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _services_InteractiveTaskProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../services/InteractiveTaskProvider */ "./assets/src/services/InteractiveTaskProvider.js");
/* harmony import */ var _services_taskRegistry__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../services/taskRegistry */ "./assets/src/services/taskRegistry.js");
/* harmony import */ var _hooks_useTasksApi__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../hooks/useTasksApi */ "./assets/src/hooks/useTasksApi/index.js");
/**
 * Sample Page Task Provider.
 *
 * React implementation of the Sample Page task.
 * Migrated from classes/suggested-tasks/providers/class-sample-page.php
 */






/**
 * Sample Page Task Provider class.
 */
class SamplePageTask extends _services_InteractiveTaskProvider__WEBPACK_IMPORTED_MODULE_1__.InteractiveTaskProvider {
  static providerId = 'sample-page';
  static capability = 'edit_pages';
  static isOnboardingTask = true;
  static priority = 14;
  static points = 1;
  static isDismissable = false;
  static isSnoozable = true;
  static externalLinkUrl = 'https://prpl.fyi/delete-sample-page';
  static popoverId = 'sample-page';

  /**
   * Check if the task should be added.
   *
   * @param {Object} taskData Optional task-specific data.
   * @return {Promise<boolean>} Promise resolving to true if task should be added.
   */
  // eslint-disable-next-line no-unused-vars
  async shouldAddTask(taskData = {}) {
    try {
      const samplePageId = await (0,_hooks_useTasksApi__WEBPACK_IMPORTED_MODULE_3__.fetchDataCollector)('sample_page_id');
      return samplePageId !== 0 && samplePageId !== null;
    } catch (error) {
      console.error('Error checking Sample Page task condition:', error);
      return false;
    }
  }

  /**
   * Get task details.
   *
   * @param {Object} taskData Optional task-specific data.
   * @return {Promise<Object>} Promise resolving to task details object.
   */
  // eslint-disable-next-line no-unused-vars
  async getTaskDetails(taskData = {}) {
    const samplePageId = await (0,_hooks_useTasksApi__WEBPACK_IMPORTED_MODULE_3__.fetchDataCollector)('sample_page_id');

    // Build URL if we have a page ID.
    const url = samplePageId && samplePageId !== 0 ? this.buildAdminUrl('post.php', {
      post: samplePageId,
      action: 'edit'
    }) : '';

    // Build description.
    const description = samplePageId && samplePageId !== 0 ? '<p>' + (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('On install, WordPress creates a "Sample Page" page. This page does not add value to your website and solely exists to show what a page can look like. Therefore, "Sample Page" is not needed and should be deleted.', 'progress-planner') + '</p>' : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('On install, WordPress creates a "Sample Page" page. This page does not add value to your website and solely exists to show what a page can look like. Therefore, "Sample Page" is not needed and should be deleted.', 'progress-planner');
    const taskDetails = this.buildTaskDetails(taskData, {
      post_title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Delete "Sample Page"', 'progress-planner'),
      description,
      url
    });

    // Add popover ID for interactive tasks.
    return this.addPopoverIdToTaskDetails(taskDetails);
  }

  /**
   * Get the label for the popover action.
   *
   * @return {string} The action label.
   */
  getPopoverActionLabel() {
    return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Delete', 'progress-planner');
  }
}

// Self-register this task provider
(0,_services_taskRegistry__WEBPACK_IMPORTED_MODULE_2__.registerTask)(SamplePageTask);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SamplePageTask);

/***/ }),

/***/ "./assets/src/tasks/SearchEngineVisibilityTask.js":
/*!********************************************************!*\
  !*** ./assets/src/tasks/SearchEngineVisibilityTask.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _services_InteractiveTaskProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../services/InteractiveTaskProvider */ "./assets/src/services/InteractiveTaskProvider.js");
/* harmony import */ var _services_taskRegistry__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../services/taskRegistry */ "./assets/src/services/taskRegistry.js");
/* harmony import */ var _services_apiFetchCache__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../services/apiFetchCache */ "./assets/src/services/apiFetchCache.js");
/**
 * Search Engine Visibility Task Provider.
 *
 * React implementation of the Search Engine Visibility task.
 * Migrated from classes/suggested-tasks/providers/class-search-engine-visibility.php
 */






/**
 * Search Engine Visibility Task Provider class.
 */
class SearchEngineVisibilityTask extends _services_InteractiveTaskProvider__WEBPACK_IMPORTED_MODULE_1__.InteractiveTaskProvider {
  static providerId = 'search-engine-visibility';
  static capability = 'manage_options';
  static isOnboardingTask = true;
  static priority = 5;
  static points = 1;
  static isDismissable = false;
  static isSnoozable = true;
  static externalLinkUrl = 'https://prpl.fyi/blog-indexing-settings';
  static popoverId = 'search-engine-visibility';

  /**
   * Check if the task should be added.
   *
   * @param {Object} taskData Optional task-specific data.
   * @return {Promise<boolean>} Promise resolving to true if task should be added.
   */
  // eslint-disable-next-line no-unused-vars
  async shouldAddTask(taskData = {}) {
    try {
      // Fetch WordPress settings to check if blog_public is 0 (discouraged).
      const settings = await (0,_services_apiFetchCache__WEBPACK_IMPORTED_MODULE_3__.cachedApiFetch)({
        path: '/wp/v2/settings'
      });

      // Task should be added if blog_public is 0 (search engines discouraged).
      return settings?.blog_public === 0 || settings?.blog_public === '0';
    } catch (error) {
      console.error('Error checking Search Engine Visibility task condition:', error);
      return false;
    }
  }

  /**
   * Get task details.
   *
   * @param {Object} taskData Optional task-specific data.
   * @return {Promise<Object>} Promise resolving to task details object.
   */
  // eslint-disable-next-line no-unused-vars
  async getTaskDetails(taskData = {}) {
    const taskDetails = this.buildTaskDetails(taskData, {
      post_title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Allow your site to be indexed by search engines', 'progress-planner'),
      url: this.buildAdminUrl('options-reading.php'),
      link_setting: {
        hook: 'options-reading.php',
        iconEl: 'label[for="blog_public"]'
      }
    });

    // Add popover ID for interactive tasks.
    return this.addPopoverIdToTaskDetails(taskDetails);
  }

  /**
   * Get the label for the popover action.
   *
   * @return {string} The action label.
   */
  getPopoverActionLabel() {
    return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Allow', 'progress-planner');
  }
}

// Self-register this task provider
(0,_services_taskRegistry__WEBPACK_IMPORTED_MODULE_2__.registerTask)(SearchEngineVisibilityTask);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SearchEngineVisibilityTask);

/***/ }),

/***/ "./assets/src/tasks/SelectLocaleTask.js":
/*!**********************************************!*\
  !*** ./assets/src/tasks/SelectLocaleTask.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _services_InteractiveTaskProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../services/InteractiveTaskProvider */ "./assets/src/services/InteractiveTaskProvider.js");
/* harmony import */ var _services_taskRegistry__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../services/taskRegistry */ "./assets/src/services/taskRegistry.js");
/* harmony import */ var _services_apiFetchCache__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../services/apiFetchCache */ "./assets/src/services/apiFetchCache.js");
/**
 * Select Locale Task Provider.
 *
 * React implementation of the Select Locale task.
 * Migrated from classes/suggested-tasks/providers/class-select-locale.php
 */






/**
 * Select Locale Task Provider class.
 */
class SelectLocaleTask extends _services_InteractiveTaskProvider__WEBPACK_IMPORTED_MODULE_1__.InteractiveTaskProvider {
  static providerId = 'select-locale';
  static capability = 'install_languages';
  static isOnboardingTask = false;
  static priority = 8;
  static points = 1;
  static isDismissable = true;
  static isSnoozable = true;
  static externalLinkUrl = 'https://prpl.fyi/set-locale';
  static popoverId = 'select-locale';

  /**
   * Check if the task should be added.
   *
   * @param {Object} taskData Optional task-specific data.
   * @return {Promise<boolean>} Promise resolving to true if task should be added.
   */
  // eslint-disable-next-line no-unused-vars
  async shouldAddTask(taskData = {}) {
    try {
      // The PHP version checks:
      // - get_browser_locale() (browser language)
      // - get_locale() (WordPress locale)
      // - If browser locale doesn't match WordPress locale
      // For React, we can get browser locale from navigator.language.
      // WordPress locale would need REST API endpoint or data collector.
      const browserLocale = typeof window !== 'undefined' && window.navigator?.language ? window.navigator.language.split('-')[0] : null;
      const settings = await (0,_services_apiFetchCache__WEBPACK_IMPORTED_MODULE_3__.cachedApiFetch)({
        path: '/wp/v2/settings'
      });
      const wpLocale = settings?.language || 'en';
      return browserLocale && !wpLocale.startsWith(browserLocale);
    } catch (error) {
      console.error('Error checking Select Locale task condition:', error);
      return false;
    }
  }

  /**
   * Get task details.
   *
   * @param {Object} taskData Optional task-specific data.
   * @return {Promise<Object>} Promise resolving to task details object.
   */
  // eslint-disable-next-line no-unused-vars
  async getTaskDetails(taskData = {}) {
    const taskDetails = this.buildTaskDetails(taskData, {
      post_title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Select your site locale', 'progress-planner'),
      url: this.buildAdminUrl('options-general.php'),
      link_setting: {
        hook: 'options-general.php',
        iconEl: 'label[for="WPLANG"]'
      }
    });
    return this.addPopoverIdToTaskDetails(taskDetails);
  }

  /**
   * Get the label for the popover action.
   *
   * @return {string} The action label.
   */
  getPopoverActionLabel() {
    return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Select locale', 'progress-planner');
  }
}

// Self-register this task provider
(0,_services_taskRegistry__WEBPACK_IMPORTED_MODULE_2__.registerTask)(SelectLocaleTask);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SelectLocaleTask);

/***/ }),

/***/ "./assets/src/tasks/SelectTimezoneTask.js":
/*!************************************************!*\
  !*** ./assets/src/tasks/SelectTimezoneTask.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _services_InteractiveTaskProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../services/InteractiveTaskProvider */ "./assets/src/services/InteractiveTaskProvider.js");
/* harmony import */ var _services_taskRegistry__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../services/taskRegistry */ "./assets/src/services/taskRegistry.js");
/* harmony import */ var _services_apiFetchCache__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../services/apiFetchCache */ "./assets/src/services/apiFetchCache.js");
/**
 * Select Timezone Task Provider.
 *
 * React implementation of the Select Timezone task.
 * Migrated from classes/suggested-tasks/providers/class-select-timezone.php
 */






/**
 * Select Timezone Task Provider class.
 */
class SelectTimezoneTask extends _services_InteractiveTaskProvider__WEBPACK_IMPORTED_MODULE_1__.InteractiveTaskProvider {
  static providerId = 'select-timezone';
  static capability = 'manage_options';
  static isOnboardingTask = false;
  static priority = 6;
  static points = 1;
  static isDismissable = true;
  static isSnoozable = true;
  static externalLinkUrl = 'https://prpl.fyi/set-timezone';
  static popoverId = 'select-timezone';

  /**
   * Check if the task should be added.
   *
   * @param {Object} taskData Optional task-specific data.
   * @return {Promise<boolean>} Promise resolving to true if task should be added.
   */
  // eslint-disable-next-line no-unused-vars
  async shouldAddTask(taskData = {}) {
    try {
      // The PHP version checks activities:
      // query_activities(['category' => 'suggested_task', 'data_id' => 'select-timezone'])
      // If activity doesn't exist, task should be added.
      // TODO: Check activities via REST API or data collector.
      // For now, check if timezone is set to UTC (default).
      const settings = await (0,_services_apiFetchCache__WEBPACK_IMPORTED_MODULE_3__.cachedApiFetch)({
        path: '/wp/v2/settings'
      });
      const timezoneString = settings?.timezone_string || '';
      // If timezone_string is empty or UTC, show task.
      return !timezoneString || timezoneString === 'UTC';
    } catch (error) {
      console.error('Error checking Select Timezone task condition:', error);
      return false;
    }
  }

  /**
   * Get task details.
   *
   * @param {Object} taskData Optional task-specific data.
   * @return {Promise<Object>} Promise resolving to task details object.
   */
  // eslint-disable-next-line no-unused-vars
  async getTaskDetails(taskData = {}) {
    const taskDetails = this.buildTaskDetails(taskData, {
      post_title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Set site timezone', 'progress-planner'),
      url: this.buildAdminUrl('options-general.php')
    });
    return this.addPopoverIdToTaskDetails(taskDetails);
  }

  /**
   * Get the label for the popover action.
   *
   * @return {string} The action label.
   */
  getPopoverActionLabel() {
    return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Select timezone', 'progress-planner');
  }
}

// Self-register this task provider
(0,_services_taskRegistry__WEBPACK_IMPORTED_MODULE_2__.registerTask)(SelectTimezoneTask);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SelectTimezoneTask);

/***/ }),

/***/ "./assets/src/tasks/SetDateFormatTask.js":
/*!***********************************************!*\
  !*** ./assets/src/tasks/SetDateFormatTask.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _services_InteractiveTaskProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../services/InteractiveTaskProvider */ "./assets/src/services/InteractiveTaskProvider.js");
/* harmony import */ var _services_taskRegistry__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../services/taskRegistry */ "./assets/src/services/taskRegistry.js");
/* harmony import */ var _services_apiFetchCache__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../services/apiFetchCache */ "./assets/src/services/apiFetchCache.js");
/**
 * Set Date Format Task Provider.
 *
 * React implementation of the Set Date Format task.
 * Migrated from classes/suggested-tasks/providers/class-set-date-format.php
 */






/**
 * Set Date Format Task Provider class.
 */
class SetDateFormatTask extends _services_InteractiveTaskProvider__WEBPACK_IMPORTED_MODULE_1__.InteractiveTaskProvider {
  static providerId = 'set-date-format';
  static capability = 'manage_options';
  static isOnboardingTask = false;
  static priority = 7;
  static points = 1;
  static isDismissable = true;
  static isSnoozable = true;
  static popoverId = 'set-date-format';

  /**
   * Check if the task should be added.
   *
   * @param {Object} taskData Optional task-specific data.
   * @return {Promise<boolean>} Promise resolving to true if task should be added.
   */
  // eslint-disable-next-line no-unused-vars
  async shouldAddTask(taskData = {}) {
    try {
      // The PHP version checks activities:
      // query_activities(['category' => 'suggested_task', 'data_id' => 'set-date-format'])
      // If activity doesn't exist, task should be added.
      // Also checks if date_format is 'wp_default' (default value).
      // TODO: Check activities via REST API or data collector.
      const settings = await (0,_services_apiFetchCache__WEBPACK_IMPORTED_MODULE_3__.cachedApiFetch)({
        path: '/wp/v2/settings'
      });
      const dateFormat = settings?.date_format || '';
      // If date_format is empty or default, show task.
      return !dateFormat || dateFormat === 'wp_default';
    } catch (error) {
      console.error('Error checking Set Date Format task condition:', error);
      return false;
    }
  }

  /**
   * Get task details.
   *
   * @param {Object} taskData Optional task-specific data.
   * @return {Promise<Object>} Promise resolving to task details object.
   */
  // eslint-disable-next-line no-unused-vars
  async getTaskDetails(taskData = {}) {
    const taskDetails = this.buildTaskDetails(taskData, {
      post_title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Set site date format', 'progress-planner'),
      description: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Setting the date format correctly on your site is valuable. By setting the correct date format, you ensure the dates are displayed correctly in the admin area and the front end.', 'progress-planner'),
      url: this.buildAdminUrl('options-general.php')
    });
    return this.addPopoverIdToTaskDetails(taskDetails);
  }

  /**
   * Get the label for the popover action.
   *
   * @return {string} The action label.
   */
  getPopoverActionLabel() {
    return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Set date format', 'progress-planner');
  }
}

// Self-register this task provider
(0,_services_taskRegistry__WEBPACK_IMPORTED_MODULE_2__.registerTask)(SetDateFormatTask);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SetDateFormatTask);

/***/ }),

/***/ "./assets/src/tasks/SetPageAboutTask.js":
/*!**********************************************!*\
  !*** ./assets/src/tasks/SetPageAboutTask.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _services_InteractiveTaskProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../services/InteractiveTaskProvider */ "./assets/src/services/InteractiveTaskProvider.js");
/* harmony import */ var _services_taskRegistry__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../services/taskRegistry */ "./assets/src/services/taskRegistry.js");
/* harmony import */ var _services_apiFetchCache__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../services/apiFetchCache */ "./assets/src/services/apiFetchCache.js");
/**
 * Set Page About Task Provider.
 *
 * React implementation of the Set Page About task.
 * Migrated from classes/suggested-tasks/providers/class-set-page-about.php
 */






/**
 * Set Page About Task Provider class.
 */
class SetPageAboutTask extends _services_InteractiveTaskProvider__WEBPACK_IMPORTED_MODULE_1__.InteractiveTaskProvider {
  static providerId = 'set-page-about';
  static capability = 'manage_options';
  static isOnboardingTask = false;
  static priority = 50;
  static points = 1;
  static isDismissable = false;
  static isSnoozable = true;
  static popoverId = 'set-page-about';

  /**
   * Check if the task should be added.
   *
   * @param {Object} taskData Optional task-specific data.
   * @return {Promise<boolean>} Promise resolving to true if task should be added.
   */
  // eslint-disable-next-line no-unused-vars
  async shouldAddTask(taskData = {}) {
    try {
      // Check page settings via Progress Planner REST API.
      // The PHP version uses progress_planner()->get_admin__page_settings()->get_settings()
      // which checks if pages[PAGE_NAME]['isset'] === 'no'
      // For now, we'll need to create a data collector or REST endpoint for this.
      // As a temporary solution, we'll check via a custom endpoint if available.
      // TODO: Create data collector or REST endpoint for page settings.
      const response = await (0,_services_apiFetchCache__WEBPACK_IMPORTED_MODULE_3__.cachedApiFetch)({
        path: '/progress-planner/v1/page-settings'
      }).catch(() => null);
      if (response && response.about) {
        return response.about.isset === 'no';
      }

      // If API fails or about not in response, don't show the task.
      return false;
    } catch (error) {
      console.error('Error checking Set Page About task condition:', error);
      return false;
    }
  }

  /**
   * Get task details.
   *
   * @param {Object} taskData Optional task-specific data.
   * @return {Promise<Object>} Promise resolving to task details object.
   */
  // eslint-disable-next-line no-unused-vars
  async getTaskDetails(taskData = {}) {
    const taskDetails = this.buildTaskDetails(taskData, {
      post_title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Set the About page', 'progress-planner'),
      url: this.buildAdminUrl('edit.php', {
        post_type: 'page'
      })
    });

    // Add popover ID for interactive tasks.
    return this.addPopoverIdToTaskDetails(taskDetails);
  }

  /**
   * Get the label for the popover action.
   *
   * @return {string} The action label.
   */
  getPopoverActionLabel() {
    return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Set', 'progress-planner');
  }
}

// Self-register this task provider
(0,_services_taskRegistry__WEBPACK_IMPORTED_MODULE_2__.registerTask)(SetPageAboutTask);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SetPageAboutTask);

/***/ }),

/***/ "./assets/src/tasks/SetPageContactTask.js":
/*!************************************************!*\
  !*** ./assets/src/tasks/SetPageContactTask.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _services_InteractiveTaskProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../services/InteractiveTaskProvider */ "./assets/src/services/InteractiveTaskProvider.js");
/* harmony import */ var _services_taskRegistry__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../services/taskRegistry */ "./assets/src/services/taskRegistry.js");
/* harmony import */ var _services_apiFetchCache__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../services/apiFetchCache */ "./assets/src/services/apiFetchCache.js");
/**
 * Set Page Contact Task Provider.
 *
 * React implementation of the Set Page Contact task.
 * Migrated from classes/suggested-tasks/providers/class-set-page-contact.php
 */






/**
 * Set Page Contact Task Provider class.
 */
class SetPageContactTask extends _services_InteractiveTaskProvider__WEBPACK_IMPORTED_MODULE_1__.InteractiveTaskProvider {
  static providerId = 'set-page-contact';
  static capability = 'manage_options';
  static isOnboardingTask = false;
  static priority = 50;
  static points = 1;
  static isDismissable = false;
  static isSnoozable = true;
  static popoverId = 'set-page-contact';

  /**
   * Check if the task should be added.
   *
   * @param {Object} taskData Optional task-specific data.
   * @return {Promise<boolean>} Promise resolving to true if task should be added.
   */
  // eslint-disable-next-line no-unused-vars
  async shouldAddTask(taskData = {}) {
    try {
      const response = await (0,_services_apiFetchCache__WEBPACK_IMPORTED_MODULE_3__.cachedApiFetch)({
        path: '/progress-planner/v1/page-settings'
      }).catch(() => null);
      if (response && response.contact) {
        return response.contact.isset === 'no';
      }
      return true;
    } catch (error) {
      console.error('Error checking Set Page Contact task condition:', error);
      return false;
    }
  }

  /**
   * Get task details.
   *
   * @param {Object} taskData Optional task-specific data.
   * @return {Promise<Object>} Promise resolving to task details object.
   */
  // eslint-disable-next-line no-unused-vars
  async getTaskDetails(taskData = {}) {
    const taskDetails = this.buildTaskDetails(taskData, {
      post_title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Set the Contact page', 'progress-planner'),
      url: this.buildAdminUrl('edit.php', {
        post_type: 'page'
      })
    });
    return this.addPopoverIdToTaskDetails(taskDetails);
  }

  /**
   * Get the label for the popover action.
   *
   * @return {string} The action label.
   */
  getPopoverActionLabel() {
    return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Set', 'progress-planner');
  }
}

// Self-register this task provider
(0,_services_taskRegistry__WEBPACK_IMPORTED_MODULE_2__.registerTask)(SetPageContactTask);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SetPageContactTask);

/***/ }),

/***/ "./assets/src/tasks/SetPageFAQTask.js":
/*!********************************************!*\
  !*** ./assets/src/tasks/SetPageFAQTask.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _services_InteractiveTaskProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../services/InteractiveTaskProvider */ "./assets/src/services/InteractiveTaskProvider.js");
/* harmony import */ var _services_taskRegistry__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../services/taskRegistry */ "./assets/src/services/taskRegistry.js");
/* harmony import */ var _services_apiFetchCache__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../services/apiFetchCache */ "./assets/src/services/apiFetchCache.js");
/**
 * Set Page FAQ Task Provider.
 *
 * React implementation of the Set Page FAQ task.
 * Migrated from classes/suggested-tasks/providers/class-set-page-faq.php
 */






/**
 * Set Page FAQ Task Provider class.
 */
class SetPageFAQTask extends _services_InteractiveTaskProvider__WEBPACK_IMPORTED_MODULE_1__.InteractiveTaskProvider {
  static providerId = 'set-page-faq';
  static capability = 'manage_options';
  static isOnboardingTask = false;
  static priority = 50;
  static points = 1;
  static isDismissable = false;
  static isSnoozable = true;
  static popoverId = 'set-page-faq';

  /**
   * Check if the task should be added.
   *
   * @param {Object} taskData Optional task-specific data.
   * @return {Promise<boolean>} Promise resolving to true if task should be added.
   */
  // eslint-disable-next-line no-unused-vars
  async shouldAddTask(taskData = {}) {
    try {
      // Check page settings via Progress Planner REST API.
      const response = await (0,_services_apiFetchCache__WEBPACK_IMPORTED_MODULE_3__.cachedApiFetch)({
        path: '/progress-planner/v1/page-settings'
      }).catch(() => null);
      if (response && response.faq) {
        return response.faq.isset === 'no';
      }

      // Fallback: return true to show task.
      return true;
    } catch (error) {
      console.error('Error checking Set Page FAQ task condition:', error);
      return false;
    }
  }

  /**
   * Get task details.
   *
   * @param {Object} taskData Optional task-specific data.
   * @return {Promise<Object>} Promise resolving to task details object.
   */
  // eslint-disable-next-line no-unused-vars
  async getTaskDetails(taskData = {}) {
    const taskDetails = this.buildTaskDetails(taskData, {
      post_title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Set the FAQ page', 'progress-planner'),
      url: this.buildAdminUrl('edit.php', {
        post_type: 'page'
      })
    });
    return this.addPopoverIdToTaskDetails(taskDetails);
  }

  /**
   * Get the label for the popover action.
   *
   * @return {string} The action label.
   */
  getPopoverActionLabel() {
    return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Set', 'progress-planner');
  }
}

// Self-register this task provider
(0,_services_taskRegistry__WEBPACK_IMPORTED_MODULE_2__.registerTask)(SetPageFAQTask);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SetPageFAQTask);

/***/ }),

/***/ "./assets/src/tasks/SetValuablePostTypesTask.js":
/*!******************************************************!*\
  !*** ./assets/src/tasks/SetValuablePostTypesTask.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _services_InteractiveTaskProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../services/InteractiveTaskProvider */ "./assets/src/services/InteractiveTaskProvider.js");
/* harmony import */ var _services_taskRegistry__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../services/taskRegistry */ "./assets/src/services/taskRegistry.js");
/**
 * Set Valuable Post Types Task Provider.
 *
 * React implementation of the Set Valuable Post Types task.
 * Migrated from classes/suggested-tasks/providers/class-set-valuable-post-types.php
 */





/**
 * Set Valuable Post Types Task Provider class.
 */
class SetValuablePostTypesTask extends _services_InteractiveTaskProvider__WEBPACK_IMPORTED_MODULE_1__.InteractiveTaskProvider {
  static providerId = 'set-valuable-post-types';
  static capability = 'manage_options';
  static isOnboardingTask = false;
  static priority = 70;
  static points = 1;
  static isDismissable = false;
  static isSnoozable = true;
  static externalLinkUrl = 'https://prpl.fyi/valuable-content';
  static popoverId = 'set-valuable-post-types';

  /**
   * Check if the task should be added.
   *
   * @param {Object} taskData Optional task-specific data.
   * @return {Promise<boolean>} Promise resolving to true if task should be added.
   */
  // eslint-disable-next-line no-unused-vars
  async shouldAddTask(taskData = {}) {
    // The PHP version checks if public post types have changed.
    // This is complex logic that monitors post type changes.
    // For React, we'll return true to show the task.
    // This can be refined with proper REST API endpoint or data collector.
    return true;
  }

  /**
   * Get task details.
   *
   * @param {Object} taskData Optional task-specific data.
   * @return {Promise<Object>} Promise resolving to task details object.
   */
  // eslint-disable-next-line no-unused-vars
  async getTaskDetails(taskData = {}) {
    const taskDetails = this.buildTaskDetails(taskData, {
      post_title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Set valuable content types', 'progress-planner'),
      url: this.buildAdminUrl('admin.php', {
        page: 'progress-planner'
      })
    });
    return this.addPopoverIdToTaskDetails(taskDetails);
  }

  /**
   * Get the label for the popover action.
   *
   * @return {string} The action label.
   */
  getPopoverActionLabel() {
    return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Set', 'progress-planner');
  }
}

// Self-register this task provider
(0,_services_taskRegistry__WEBPACK_IMPORTED_MODULE_2__.registerTask)(SetValuablePostTypesTask);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SetValuablePostTypesTask);

/***/ }),

/***/ "./assets/src/tasks/SiteIconTask.js":
/*!******************************************!*\
  !*** ./assets/src/tasks/SiteIconTask.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _services_InteractiveTaskProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../services/InteractiveTaskProvider */ "./assets/src/services/InteractiveTaskProvider.js");
/* harmony import */ var _services_taskRegistry__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../services/taskRegistry */ "./assets/src/services/taskRegistry.js");
/* harmony import */ var _services_apiFetchCache__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../services/apiFetchCache */ "./assets/src/services/apiFetchCache.js");
/**
 * Site Icon Task Provider.
 *
 * React implementation of the Site Icon task.
 * Migrated from classes/suggested-tasks/providers/class-site-icon.php
 */






/**
 * Site Icon Task Provider class.
 */
class SiteIconTask extends _services_InteractiveTaskProvider__WEBPACK_IMPORTED_MODULE_1__.InteractiveTaskProvider {
  static providerId = 'core-siteicon';
  static capability = 'manage_options';
  static isOnboardingTask = true;
  static priority = 1;
  static points = 1;
  static isDismissable = false;
  static isSnoozable = true;
  static externalLinkUrl = 'https://prpl.fyi/set-site-icon';
  static popoverId = 'core-siteicon';

  /**
   * Check if the task should be added.
   *
   * @param {Object} taskData Optional task-specific data.
   * @return {Promise<boolean>} Promise resolving to true if task should be added.
   */
  // eslint-disable-next-line no-unused-vars
  async shouldAddTask(taskData = {}) {
    try {
      // Fetch WordPress settings to check if site_icon is set.
      const settings = await (0,_services_apiFetchCache__WEBPACK_IMPORTED_MODULE_3__.cachedApiFetch)({
        path: '/wp/v2/settings'
      });

      // Task should be added if site_icon is empty or 0.
      const siteIcon = settings?.site_icon;
      return !siteIcon || siteIcon === '' || siteIcon === '0';
    } catch (error) {
      console.error('Error checking Site Icon task condition:', error);
      return false;
    }
  }

  /**
   * Get task details.
   *
   * @param {Object} taskData Optional task-specific data.
   * @return {Promise<Object>} Promise resolving to task details object.
   */
  // eslint-disable-next-line no-unused-vars
  async getTaskDetails(taskData = {}) {
    const taskDetails = this.buildTaskDetails(taskData, {
      post_title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Set site icon', 'progress-planner'),
      url: this.buildAdminUrl('options-general.php')
    });

    // Add popover ID for interactive tasks.
    return this.addPopoverIdToTaskDetails(taskDetails);
  }

  /**
   * Get the label for the popover action.
   *
   * @return {string} The action label.
   */
  getPopoverActionLabel() {
    return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Set site icon', 'progress-planner');
  }
}

// Self-register this task provider
(0,_services_taskRegistry__WEBPACK_IMPORTED_MODULE_2__.registerTask)(SiteIconTask);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SiteIconTask);

/***/ }),

/***/ "./assets/src/tasks/UnpublishedContentTask.js":
/*!****************************************************!*\
  !*** ./assets/src/tasks/UnpublishedContentTask.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _services_TaskProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../services/TaskProvider */ "./assets/src/services/TaskProvider.js");
/* harmony import */ var _services_taskRegistry__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../services/taskRegistry */ "./assets/src/services/taskRegistry.js");
/* harmony import */ var _hooks_useTasksApi__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../hooks/useTasksApi */ "./assets/src/hooks/useTasksApi/index.js");
/**
 * Unpublished Content Task Provider.
 *
 * React implementation of the Unpublished Content task.
 * Migrated from classes/suggested-tasks/providers/class-unpublished-content.php
 */






/**
 * Unpublished Content Task Provider class.
 */
class UnpublishedContentTask extends _services_TaskProvider__WEBPACK_IMPORTED_MODULE_1__.TaskProvider {
  static providerId = 'unpublished-content';
  static capability = 'edit_others_posts';
  static isOnboardingTask = false;
  static priority = 55;
  static points = 1;
  static isDismissable = true;
  static isSnoozable = true;
  static isRepetitive = false;
  static externalLinkUrl = 'https://prpl.fyi/check-unpublished-content';

  /**
   * Check if the task should be added.
   *
   * @param {Object} taskData Optional task-specific data.
   * @return {Promise<boolean>} Promise resolving to true if task should be added.
   */
  // eslint-disable-next-line no-unused-vars
  async shouldAddTask(taskData = {}) {
    try {
      // Check for unpublished content via data collector.
      const unpublishedContent = await (0,_hooks_useTasksApi__WEBPACK_IMPORTED_MODULE_3__.fetchDataCollector)('unpublished_content');
      // Task should be added if there's unpublished content.
      return unpublishedContent && Array.isArray(unpublishedContent) && unpublishedContent.length > 0;
    } catch (error) {
      console.error('Error checking Unpublished Content task condition:', error);
      return false;
    }
  }

  /**
   * Get task details.
   *
   * @param {Object} taskData Optional task-specific data.
   * @return {Promise<Object>} Promise resolving to task details object.
   */
  // eslint-disable-next-line no-unused-vars
  async getTaskDetails(taskData = {}) {
    const unpublishedContent = await (0,_hooks_useTasksApi__WEBPACK_IMPORTED_MODULE_3__.fetchDataCollector)('unpublished_content');

    // Get count of unpublished items for description.
    const count = unpublishedContent && Array.isArray(unpublishedContent) ? unpublishedContent.length : 0;
    const description = count > 0 ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.sprintf)(/* translators: %d: number of unpublished items */
    (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__._n)('You have %d unpublished item that might need attention.', 'You have %d unpublished items that might need attention.', count, 'progress-planner'), count) : '';
    return this.buildTaskDetails(taskData, {
      post_title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Review unpublished content', 'progress-planner'),
      description,
      url: this.buildAdminUrl('edit.php', {
        post_status: 'draft',
        post_type: 'post'
      })
    });
  }

  /**
   * Add custom task actions for Unpublished Content task.
   *
   * Adds an "Edit" action that links to the task URL (draft posts list).
   *
   * @param {Object} taskData The task data.
   * @param {Array}  actions  The existing actions array.
   *
   * @return {Array} The modified actions array.
   */
  addTaskActions(taskData = [], actions = []) {
    // Check for URL in meta or task data.
    const url = taskData.meta?.prpl_url || taskData.url || null;
    if (url) {
      actions.push({
        type: 'link',
        priority: 10,
        href: url,
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Edit', 'progress-planner'),
        target: '_self'
      });
    }
    return actions;
  }
}

// Self-register this task provider
(0,_services_taskRegistry__WEBPACK_IMPORTED_MODULE_2__.registerTask)(UnpublishedContentTask);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (UnpublishedContentTask);

/***/ }),

/***/ "./assets/src/tasks/UpdateTermDescriptionTask.js":
/*!*******************************************************!*\
  !*** ./assets/src/tasks/UpdateTermDescriptionTask.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _services_InteractiveTaskProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../services/InteractiveTaskProvider */ "./assets/src/services/InteractiveTaskProvider.js");
/* harmony import */ var _services_taskRegistry__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../services/taskRegistry */ "./assets/src/services/taskRegistry.js");
/* harmony import */ var _hooks_useTasksApi__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../hooks/useTasksApi */ "./assets/src/hooks/useTasksApi/index.js");
/**
 * Update Term Description Task Provider.
 *
 * React implementation of the Update Term Description task.
 * Migrated from classes/suggested-tasks/providers/class-update-term-description.php
 *
 * Note: This is a multi-task provider that creates multiple tasks.
 * Basic implementation - can be refined with proper data collection.
 */






/**
 * Update Term Description Task Provider class.
 */
class UpdateTermDescriptionTask extends _services_InteractiveTaskProvider__WEBPACK_IMPORTED_MODULE_1__.InteractiveTaskProvider {
  static providerId = 'update-term-description';
  static capability = 'edit_others_posts';
  static isOnboardingTask = false;
  static priority = 80;
  static points = 1;
  static isDismissable = true;
  static isSnoozable = true;
  static externalLinkUrl = 'https://prpl.fyi/taxonomy-terms-description';
  static popoverId = 'update-term-description';
  static isMultiTask = true;

  /**
   * Check if the task should be added.
   *
   * @param {Object} taskData Optional task-specific data.
   * @return {Promise<boolean>} Promise resolving to true if task should be added.
   */
  // eslint-disable-next-line no-unused-vars
  async shouldAddTask(taskData = {}) {
    try {
      const tasksToInject = await this.getTasksToInject();
      return tasksToInject && tasksToInject.length > 0;
    } catch (error) {
      console.error('Error checking Update Term Description task condition:', error);
      return false;
    }
  }

  /**
   * Get tasks to inject.
   *
   * Returns an array of taskData items, one for each term without a description.
   *
   * @return {Promise<Array>} Promise resolving to array of taskData objects.
   */
  async getTasksToInject() {
    try {
      const termsWithoutDescription = await (0,_hooks_useTasksApi__WEBPACK_IMPORTED_MODULE_3__.fetchDataCollector)('terms_without_description');
      if (!termsWithoutDescription) {
        return [];
      }

      // Normalize to array - data collector returns single object, not array
      const termsArray = Array.isArray(termsWithoutDescription) ? termsWithoutDescription : [termsWithoutDescription];
      if (termsArray.length === 0) {
        return [];
      }

      // Return array of taskData objects, one per term
      return termsArray.map(term => ({
        target_term_id: term.term_id,
        target_taxonomy: term.taxonomy
      }));
    } catch (error) {
      console.error('Error getting tasks to inject for Update Term Description:', error);
      return [];
    }
  }

  /**
   * Get task details.
   *
   * @param {Object} taskData Optional task-specific data.
   * @return {Promise<Object>} Promise resolving to task details object.
   */
  // eslint-disable-next-line no-unused-vars
  async getTaskDetails(taskData = {}) {
    const targetTermId = taskData?.target_term_id || null;
    const targetTaxonomy = taskData?.target_taxonomy || null;
    if (!targetTermId || !targetTaxonomy) {
      throw new Error('UpdateTermDescriptionTask requires target_term_id and target_taxonomy in taskData');
    }
    const taskDetails = this.buildTaskDetails(taskData, {
      post_title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.sprintf)(/* translators: %d: term ID */
      (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Write description for term #%d', 'progress-planner'), targetTermId),
      url: this.buildAdminUrl('term.php', {
        taxonomy: targetTaxonomy,
        tag_ID: targetTermId
      }),
      url_target: '_blank',
      target_term_id: targetTermId,
      target_taxonomy: targetTaxonomy
    });
    return this.addPopoverIdToTaskDetails(taskDetails);
  }

  /**
   * Add custom task actions for Update Term Description task.
   *
   * Adds a "Write description" action that opens the popover and dispatches
   * a custom event with task context data.
   * Note: Does not call super to avoid duplicate popover actions.
   * Standard actions (complete, snooze) are already in the actions array.
   *
   * @param {Object} taskData The task data.
   * @param {Array}  actions  The existing actions array (already contains complete, snooze, etc.).
   *
   * @return {Array} The modified actions array.
   */
  addTaskActions(taskData = [], actions = []) {
    const targetTermId = taskData.target_term_id || taskData.meta?.target_term_id || null;
    const targetTaxonomy = taskData.target_taxonomy || taskData.meta?.target_taxonomy || null;
    if (!targetTermId || !targetTaxonomy) {
      // If we don't have term data, use default popover action from parent.
      return super.addTaskActions(taskData, actions);
    }

    // Build task context data for the custom event.
    const taskContext = {
      post_title: taskData.title?.rendered || taskData.post_title || '',
      target_term_id: targetTermId,
      target_taxonomy: targetTaxonomy,
      target_term_name: taskData.meta?.target_term_name || '',
      target_taxonomy_name: taskData.meta?.target_taxonomy_name || ''
    };

    // Add custom "Write description" popover action with priority 10.
    // This replaces the default popover action from InteractiveTaskProvider.
    actions.push({
      type: 'popover',
      priority: 10,
      popoverId: this.getPopoverId(),
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Write description', 'progress-planner'),
      taskContext,
      eventName: 'prpl-interactive-task-action-update-term-description'
    });

    // Return actions without calling super to avoid duplicate popover action.
    // Standard actions (complete, snooze, info) are already in the array.
    return actions;
  }

  /**
   * Get the label for the popover action.
   *
   * @return {string} The action label.
   */
  getPopoverActionLabel() {
    return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Write description', 'progress-planner');
  }
}

// Self-register this task provider
(0,_services_taskRegistry__WEBPACK_IMPORTED_MODULE_2__.registerTask)(UpdateTermDescriptionTask);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (UpdateTermDescriptionTask);

/***/ }),

/***/ "./assets/src/tasks/UserTask.js":
/*!**************************************!*\
  !*** ./assets/src/tasks/UserTask.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _services_taskRegistry__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../services/taskRegistry */ "./assets/src/services/taskRegistry.js");
/* harmony import */ var _services_TaskProvider__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../services/TaskProvider */ "./assets/src/services/TaskProvider.js");
/**
 * User Task Provider.
 *
 * Handles user-created todo items. Unlike other providers,
 * this does NOT inject tasks - users create them manually via the TodoWidget.
 *
 * Points calculation:
 * - Golden tasks (first task, marked with 'GOLDEN' in excerpt) get 1 point
 * - Regular user tasks get 0 points
 */





/**
 * User Task Provider class.
 */
class UserTask extends _services_TaskProvider__WEBPACK_IMPORTED_MODULE_2__.TaskProvider {
  // Static configuration
  static providerId = 'user';
  static capability = 'edit_posts';
  static isOnboardingTask = false;
  static priority = 999; // Low priority (user tasks come last)
  static points = 0; // Default points; golden tasks override via getPoints()
  static isDismissable = true;
  static isSnoozable = false; // User tasks cannot be snoozed
  static isRepetitive = false;
  static externalLinkUrl = '';

  /**
   * User tasks are never auto-injected.
   * Users create them manually via the TodoWidget form.
   *
   * @param {Object} taskData Optional task-specific data.
   * @return {Promise<boolean>} Always returns false.
   */
  // eslint-disable-next-line no-unused-vars
  async shouldAddTask(taskData = {}) {
    return false;
  }

  /**
   * Get task details from REST API response data.
   *
   * @param {Object} taskData Task data from REST API.
   * @return {Promise<Object>} Promise resolving to task details object.
   */
  // eslint-disable-next-line no-unused-vars
  async getTaskDetails(taskData = {}) {
    return this.buildTaskDetails(taskData, {
      post_title: taskData.title?.rendered || taskData.title || '',
      description: taskData.content?.rendered || '',
      points: this.getPoints(taskData)
    });
  }

  /**
   * Get points for this task.
   *
   * Golden tasks (marked with 'GOLDEN' in excerpt) get 1 point.
   * Regular user tasks get 0 points.
   *
   * @param {Object} taskData Task data containing excerpt.
   * @return {number} Points value (0 or 1).
   */
  getPoints(taskData = {}) {
    // Check for GOLDEN marker in excerpt
    const excerpt = taskData.excerpt?.rendered || taskData.excerpt || '';
    return excerpt.includes('GOLDEN') ? 1 : 0;
  }

  /**
   * Add Edit action for inline title editing.
   *
   * @param {Object} taskData Task data.
   * @param {Array}  actions  Existing actions array.
   * @return {Array} Actions array with Edit action added.
   */
  // eslint-disable-next-line no-unused-vars
  addTaskActions(taskData = {}, actions = []) {
    actions.push({
      type: 'link',
      priority: 10,
      href: '#',
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Edit', 'progress-planner'),
      // Special flag for inline edit - handled by TaskActions component.
      inlineEdit: true
    });
    return actions;
  }
}

// Self-register this task provider
(0,_services_taskRegistry__WEBPACK_IMPORTED_MODULE_1__.registerTask)(UserTask);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (UserTask);

/***/ }),

/***/ "./assets/src/tasks/aioseo/AIOSEOArchiveAuthorTask.js":
/*!************************************************************!*\
  !*** ./assets/src/tasks/aioseo/AIOSEOArchiveAuthorTask.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _services_InteractiveTaskProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../services/InteractiveTaskProvider */ "./assets/src/services/InteractiveTaskProvider.js");
/* harmony import */ var _services_taskRegistry__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../services/taskRegistry */ "./assets/src/services/taskRegistry.js");
/* harmony import */ var _hooks_useTasksApi__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../hooks/useTasksApi */ "./assets/src/hooks/useTasksApi/index.js");
/**
 * AIOSEO Archive Author Task Provider.
 *
 * React implementation of the AIOSEO noindex author archive task.
 * Migrated from classes/suggested-tasks/providers/integrations/aioseo/class-archive-author.php
 */






/**
 * AIOSEO Archive Author Task Provider class.
 */
class AIOSEOArchiveAuthorTask extends _services_InteractiveTaskProvider__WEBPACK_IMPORTED_MODULE_1__.InteractiveTaskProvider {
  static providerId = 'aioseo-author-archive';
  static capability = 'manage_options';
  static isOnboardingTask = false;
  static priority = 20;
  static points = 1;
  static isDismissable = false;
  static isSnoozable = true;
  static externalLinkUrl = 'https://prpl.fyi/aioseo-author-archive';
  static popoverId = 'aioseo-author-archive';

  /**
   * Minimum number of authors with posts to show the task.
   */
  static MINIMUM_AUTHOR_WITH_POSTS = 1;

  /**
   * Check if the task should be added.
   *
   * @param {Object} taskData Optional task-specific data.
   * @return {Promise<boolean>} Promise resolving to true if task should be added.
   */
  // eslint-disable-next-line no-unused-vars
  async shouldAddTask(taskData = {}) {
    try {
      const aioseoOptions = await (0,_hooks_useTasksApi__WEBPACK_IMPORTED_MODULE_3__.fetchDataCollector)('aioseo_options');

      // If AIOSEO is not active, don't add the task.
      if (!aioseoOptions) {
        return false;
      }

      // Check if task is relevant (single author site).
      const authorCount = await (0,_hooks_useTasksApi__WEBPACK_IMPORTED_MODULE_3__.fetchDataCollector)('post_author_count');
      if (authorCount > AIOSEOArchiveAuthorTask.MINIMUM_AUTHOR_WITH_POSTS) {
        return false;
      }

      // Show task if author archive show is true (not disabled).
      return aioseoOptions.archives?.author?.show === true;
    } catch (error) {
      console.error('Error checking AIOSEO Archive Author task condition:', error);
      return false;
    }
  }

  /**
   * Get task details.
   *
   * @param {Object} taskData Optional task-specific data.
   * @return {Promise<Object>} Promise resolving to task details object.
   */
  // eslint-disable-next-line no-unused-vars
  async getTaskDetails(taskData = {}) {
    const taskDetails = this.buildTaskDetails(taskData, {
      post_title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('All in One SEO: noindex the author archive', 'progress-planner'),
      url: this.buildAdminUrl('admin.php?page=aioseo-search-appearance#/archives')
    });
    return this.addPopoverIdToTaskDetails(taskDetails);
  }

  /**
   * Get the label for the popover action.
   *
   * @return {string} The action label.
   */
  getPopoverActionLabel() {
    return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Noindex', 'progress-planner');
  }
}

// Self-register this task provider.
(0,_services_taskRegistry__WEBPACK_IMPORTED_MODULE_2__.registerTask)(AIOSEOArchiveAuthorTask);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (AIOSEOArchiveAuthorTask);

/***/ }),

/***/ "./assets/src/tasks/aioseo/AIOSEOArchiveDateTask.js":
/*!**********************************************************!*\
  !*** ./assets/src/tasks/aioseo/AIOSEOArchiveDateTask.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _services_InteractiveTaskProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../services/InteractiveTaskProvider */ "./assets/src/services/InteractiveTaskProvider.js");
/* harmony import */ var _services_taskRegistry__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../services/taskRegistry */ "./assets/src/services/taskRegistry.js");
/* harmony import */ var _hooks_useTasksApi__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../hooks/useTasksApi */ "./assets/src/hooks/useTasksApi/index.js");
/**
 * AIOSEO Archive Date Task Provider.
 *
 * React implementation of the AIOSEO noindex date archive task.
 * Migrated from classes/suggested-tasks/providers/integrations/aioseo/class-archive-date.php
 */






/**
 * AIOSEO Archive Date Task Provider class.
 */
class AIOSEOArchiveDateTask extends _services_InteractiveTaskProvider__WEBPACK_IMPORTED_MODULE_1__.InteractiveTaskProvider {
  static providerId = 'aioseo-date-archive';
  static capability = 'manage_options';
  static isOnboardingTask = false;
  static priority = 20;
  static points = 1;
  static isDismissable = false;
  static isSnoozable = true;
  static externalLinkUrl = 'https://prpl.fyi/aioseo-date-archive';
  static popoverId = 'aioseo-date-archive';

  /**
   * Check if the task should be added.
   *
   * @param {Object} taskData Optional task-specific data.
   * @return {Promise<boolean>} Promise resolving to true if task should be added.
   */
  // eslint-disable-next-line no-unused-vars
  async shouldAddTask(taskData = {}) {
    try {
      const aioseoOptions = await (0,_hooks_useTasksApi__WEBPACK_IMPORTED_MODULE_3__.fetchDataCollector)('aioseo_options');

      // If AIOSEO is not active, don't add the task.
      if (!aioseoOptions) {
        return false;
      }

      // Check if task is relevant (permalink doesn't have date tokens).
      const permalinkHasDate = await (0,_hooks_useTasksApi__WEBPACK_IMPORTED_MODULE_3__.fetchDataCollector)('permalink_has_date');
      if (permalinkHasDate) {
        return false;
      }

      // Show task if date archive show is true (not disabled).
      return aioseoOptions.archives?.date?.show === true;
    } catch (error) {
      console.error('Error checking AIOSEO Archive Date task condition:', error);
      return false;
    }
  }

  /**
   * Get task details.
   *
   * @param {Object} taskData Optional task-specific data.
   * @return {Promise<Object>} Promise resolving to task details object.
   */
  // eslint-disable-next-line no-unused-vars
  async getTaskDetails(taskData = {}) {
    const taskDetails = this.buildTaskDetails(taskData, {
      post_title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('All in One SEO: noindex the date archive', 'progress-planner'),
      url: this.buildAdminUrl('admin.php?page=aioseo-search-appearance#/archives')
    });
    return this.addPopoverIdToTaskDetails(taskDetails);
  }

  /**
   * Get the label for the popover action.
   *
   * @return {string} The action label.
   */
  getPopoverActionLabel() {
    return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Noindex', 'progress-planner');
  }
}

// Self-register this task provider.
(0,_services_taskRegistry__WEBPACK_IMPORTED_MODULE_2__.registerTask)(AIOSEOArchiveDateTask);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (AIOSEOArchiveDateTask);

/***/ }),

/***/ "./assets/src/tasks/aioseo/AIOSEOCrawlFeedAuthorsTask.js":
/*!***************************************************************!*\
  !*** ./assets/src/tasks/aioseo/AIOSEOCrawlFeedAuthorsTask.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _services_InteractiveTaskProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../services/InteractiveTaskProvider */ "./assets/src/services/InteractiveTaskProvider.js");
/* harmony import */ var _services_taskRegistry__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../services/taskRegistry */ "./assets/src/services/taskRegistry.js");
/* harmony import */ var _hooks_useTasksApi__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../hooks/useTasksApi */ "./assets/src/hooks/useTasksApi/index.js");
/**
 * AIOSEO Crawl Feed Authors Task Provider.
 *
 * React implementation of the AIOSEO disable author RSS feeds task.
 * Migrated from classes/suggested-tasks/providers/integrations/aioseo/class-crawl-settings-feed-authors.php
 */






/**
 * AIOSEO Crawl Feed Authors Task Provider class.
 */
class AIOSEOCrawlFeedAuthorsTask extends _services_InteractiveTaskProvider__WEBPACK_IMPORTED_MODULE_1__.InteractiveTaskProvider {
  static providerId = 'aioseo-crawl-settings-feed-authors';
  static capability = 'manage_options';
  static isOnboardingTask = false;
  static priority = 20;
  static points = 1;
  static isDismissable = false;
  static isSnoozable = true;
  static externalLinkUrl = 'https://prpl.fyi/aioseo-crawl-optimization-feed-authors';
  static popoverId = 'aioseo-crawl-settings-feed-authors';

  /**
   * Minimum number of authors with posts to show the task.
   */
  static MINIMUM_AUTHOR_WITH_POSTS = 1;

  /**
   * Check if the task should be added.
   *
   * @param {Object} taskData Optional task-specific data.
   * @return {Promise<boolean>} Promise resolving to true if task should be added.
   */
  // eslint-disable-next-line no-unused-vars
  async shouldAddTask(taskData = {}) {
    try {
      const aioseoOptions = await (0,_hooks_useTasksApi__WEBPACK_IMPORTED_MODULE_3__.fetchDataCollector)('aioseo_options');

      // If AIOSEO is not active, don't add the task.
      if (!aioseoOptions) {
        return false;
      }

      // Check if task is relevant (single author site).
      const authorCount = await (0,_hooks_useTasksApi__WEBPACK_IMPORTED_MODULE_3__.fetchDataCollector)('post_author_count');
      if (authorCount > AIOSEOCrawlFeedAuthorsTask.MINIMUM_AUTHOR_WITH_POSTS) {
        return false;
      }

      // Show task if author feeds are not disabled (authors !== false).
      return aioseoOptions.crawlCleanup?.feeds?.authors !== false;
    } catch (error) {
      console.error('Error checking AIOSEO Crawl Feed Authors task condition:', error);
      return false;
    }
  }

  /**
   * Get task details.
   *
   * @param {Object} taskData Optional task-specific data.
   * @return {Promise<Object>} Promise resolving to task details object.
   */
  // eslint-disable-next-line no-unused-vars
  async getTaskDetails(taskData = {}) {
    const taskDetails = this.buildTaskDetails(taskData, {
      post_title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('All in One SEO: disable author RSS feeds', 'progress-planner'),
      url: this.buildAdminUrl('admin.php?page=aioseo-search-appearance#/advanced')
    });
    return this.addPopoverIdToTaskDetails(taskDetails);
  }

  /**
   * Get the label for the popover action.
   *
   * @return {string} The action label.
   */
  getPopoverActionLabel() {
    return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Disable', 'progress-planner');
  }
}

// Self-register this task provider.
(0,_services_taskRegistry__WEBPACK_IMPORTED_MODULE_2__.registerTask)(AIOSEOCrawlFeedAuthorsTask);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (AIOSEOCrawlFeedAuthorsTask);

/***/ }),

/***/ "./assets/src/tasks/aioseo/AIOSEOCrawlFeedCommentsTask.js":
/*!****************************************************************!*\
  !*** ./assets/src/tasks/aioseo/AIOSEOCrawlFeedCommentsTask.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _services_InteractiveTaskProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../services/InteractiveTaskProvider */ "./assets/src/services/InteractiveTaskProvider.js");
/* harmony import */ var _services_taskRegistry__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../services/taskRegistry */ "./assets/src/services/taskRegistry.js");
/* harmony import */ var _hooks_useTasksApi__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../hooks/useTasksApi */ "./assets/src/hooks/useTasksApi/index.js");
/**
 * AIOSEO Crawl Feed Comments Task Provider.
 *
 * React implementation of the AIOSEO disable comment RSS feeds task.
 * Migrated from classes/suggested-tasks/providers/integrations/aioseo/class-crawl-settings-feed-comments.php
 */






/**
 * AIOSEO Crawl Feed Comments Task Provider class.
 */
class AIOSEOCrawlFeedCommentsTask extends _services_InteractiveTaskProvider__WEBPACK_IMPORTED_MODULE_1__.InteractiveTaskProvider {
  static providerId = 'aioseo-crawl-settings-feed-comments';
  static capability = 'manage_options';
  static isOnboardingTask = false;
  static priority = 20;
  static points = 1;
  static isDismissable = false;
  static isSnoozable = true;
  static externalLinkUrl = 'https://prpl.fyi/aioseo-crawl-optimization-feed-comments';
  static popoverId = 'aioseo-crawl-settings-feed-comments';

  /**
   * Check if the task should be added.
   *
   * @param {Object} taskData Optional task-specific data.
   * @return {Promise<boolean>} Promise resolving to true if task should be added.
   */
  // eslint-disable-next-line no-unused-vars
  async shouldAddTask(taskData = {}) {
    try {
      const aioseoOptions = await (0,_hooks_useTasksApi__WEBPACK_IMPORTED_MODULE_3__.fetchDataCollector)('aioseo_options');

      // If AIOSEO is not active, don't add the task.
      if (!aioseoOptions) {
        return false;
      }

      // Show task if either globalComments or postComments feeds are enabled.
      const globalComments = aioseoOptions.crawlCleanup?.feeds?.globalComments;
      const postComments = aioseoOptions.crawlCleanup?.feeds?.postComments;

      // If both are false (disabled), task is complete.
      if (globalComments === false && postComments === false) {
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error checking AIOSEO Crawl Feed Comments task condition:', error);
      return false;
    }
  }

  /**
   * Get task details.
   *
   * @param {Object} taskData Optional task-specific data.
   * @return {Promise<Object>} Promise resolving to task details object.
   */
  // eslint-disable-next-line no-unused-vars
  async getTaskDetails(taskData = {}) {
    const taskDetails = this.buildTaskDetails(taskData, {
      post_title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('All in One SEO: disable comment RSS feeds', 'progress-planner'),
      url: this.buildAdminUrl('admin.php?page=aioseo-search-appearance#/advanced')
    });
    return this.addPopoverIdToTaskDetails(taskDetails);
  }

  /**
   * Get the label for the popover action.
   *
   * @return {string} The action label.
   */
  getPopoverActionLabel() {
    return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Disable', 'progress-planner');
  }
}

// Self-register this task provider.
(0,_services_taskRegistry__WEBPACK_IMPORTED_MODULE_2__.registerTask)(AIOSEOCrawlFeedCommentsTask);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (AIOSEOCrawlFeedCommentsTask);

/***/ }),

/***/ "./assets/src/tasks/aioseo/AIOSEOMediaPagesTask.js":
/*!*********************************************************!*\
  !*** ./assets/src/tasks/aioseo/AIOSEOMediaPagesTask.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _services_InteractiveTaskProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../services/InteractiveTaskProvider */ "./assets/src/services/InteractiveTaskProvider.js");
/* harmony import */ var _services_taskRegistry__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../services/taskRegistry */ "./assets/src/services/taskRegistry.js");
/* harmony import */ var _hooks_useTasksApi__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../hooks/useTasksApi */ "./assets/src/hooks/useTasksApi/index.js");
/**
 * AIOSEO Media Pages Task Provider.
 *
 * React implementation of the AIOSEO redirect media/attachment pages task.
 * Migrated from classes/suggested-tasks/providers/integrations/aioseo/class-media-pages.php
 */






/**
 * AIOSEO Media Pages Task Provider class.
 */
class AIOSEOMediaPagesTask extends _services_InteractiveTaskProvider__WEBPACK_IMPORTED_MODULE_1__.InteractiveTaskProvider {
  static providerId = 'aioseo-media-pages';
  static capability = 'manage_options';
  static isOnboardingTask = false;
  static priority = 20;
  static points = 1;
  static isDismissable = false;
  static isSnoozable = true;
  static externalLinkUrl = 'https://prpl.fyi/aioseo-media-pages';
  static popoverId = 'aioseo-media-pages';

  /**
   * Check if the task should be added.
   *
   * @param {Object} taskData Optional task-specific data.
   * @return {Promise<boolean>} Promise resolving to true if task should be added.
   */
  // eslint-disable-next-line no-unused-vars
  async shouldAddTask(taskData = {}) {
    try {
      const aioseoOptions = await (0,_hooks_useTasksApi__WEBPACK_IMPORTED_MODULE_3__.fetchDataCollector)('aioseo_options');

      // If AIOSEO is not active, don't add the task.
      if (!aioseoOptions) {
        return false;
      }

      // Show task if redirect attachment URLs is not set to 'attachment'.
      return aioseoOptions.attachment?.redirectAttachmentUrls !== 'attachment';
    } catch (error) {
      console.error('Error checking AIOSEO Media Pages task condition:', error);
      return false;
    }
  }

  /**
   * Get task details.
   *
   * @param {Object} taskData Optional task-specific data.
   * @return {Promise<Object>} Promise resolving to task details object.
   */
  // eslint-disable-next-line no-unused-vars
  async getTaskDetails(taskData = {}) {
    const taskDetails = this.buildTaskDetails(taskData, {
      post_title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('All in One SEO: redirect media/attachment pages to attachment', 'progress-planner'),
      url: this.buildAdminUrl('admin.php?page=aioseo-search-appearance#/media')
    });
    return this.addPopoverIdToTaskDetails(taskDetails);
  }

  /**
   * Get the label for the popover action.
   *
   * @return {string} The action label.
   */
  getPopoverActionLabel() {
    return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Redirect', 'progress-planner');
  }
}

// Self-register this task provider.
(0,_services_taskRegistry__WEBPACK_IMPORTED_MODULE_2__.registerTask)(AIOSEOMediaPagesTask);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (AIOSEOMediaPagesTask);

/***/ }),

/***/ "./assets/src/tasks/aioseo/AIOSEOOrganizationLogoTask.js":
/*!***************************************************************!*\
  !*** ./assets/src/tasks/aioseo/AIOSEOOrganizationLogoTask.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _services_TaskProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../services/TaskProvider */ "./assets/src/services/TaskProvider.js");
/* harmony import */ var _services_taskRegistry__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../services/taskRegistry */ "./assets/src/services/taskRegistry.js");
/* harmony import */ var _hooks_useTasksApi__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../hooks/useTasksApi */ "./assets/src/hooks/useTasksApi/index.js");
/**
 * AIOSEO Organization Logo Task Provider.
 *
 * React implementation of the AIOSEO set organization logo task.
 * Migrated from classes/suggested-tasks/providers/integrations/aioseo/class-organization-logo.php
 */






/**
 * AIOSEO Organization Logo Task Provider class.
 */
class AIOSEOOrganizationLogoTask extends _services_TaskProvider__WEBPACK_IMPORTED_MODULE_1__.TaskProvider {
  static providerId = 'aioseo-organization-logo';
  static capability = 'manage_options';
  static isOnboardingTask = false;
  static priority = 20;
  static points = 1;
  static isDismissable = false;
  static isSnoozable = true;
  static externalLinkUrl = 'https://prpl.fyi/aioseo-organization-logo';

  /**
   * Check if the task should be added.
   *
   * @param {Object} taskData Optional task-specific data.
   * @return {Promise<boolean>} Promise resolving to true if task should be added.
   */
  // eslint-disable-next-line no-unused-vars
  async shouldAddTask(taskData = {}) {
    try {
      const aioseoOptions = await (0,_hooks_useTasksApi__WEBPACK_IMPORTED_MODULE_3__.fetchDataCollector)('aioseo_options');

      // If AIOSEO is not active, don't add the task.
      if (!aioseoOptions) {
        return false;
      }

      // Only show task for organization sites, not person sites.
      if (aioseoOptions.schema?.siteRepresents === 'person') {
        return false;
      }

      // Show task if organization logo is not set.
      return aioseoOptions.schema?.organizationLogo === '';
    } catch (error) {
      console.error('Error checking AIOSEO Organization Logo task condition:', error);
      return false;
    }
  }

  /**
   * Get task details.
   *
   * @param {Object} taskData Optional task-specific data.
   * @return {Promise<Object>} Promise resolving to task details object.
   */
  // eslint-disable-next-line no-unused-vars
  async getTaskDetails(taskData = {}) {
    return this.buildTaskDetails(taskData, {
      post_title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('All in One SEO: set your organization logo', 'progress-planner'),
      url: this.buildAdminUrl('admin.php?page=aioseo-search-appearance#/')
    });
  }

  /**
   * Add custom task actions.
   *
   * @param {Object} taskData The task data.
   * @param {Array}  actions  The existing actions array.
   * @return {Array} The modified actions array.
   */
  addTaskActions(taskData, actions) {
    actions.push({
      type: 'link',
      priority: 10,
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Set logo', 'progress-planner'),
      url: this.buildAdminUrl('admin.php?page=aioseo-search-appearance#/'),
      target: '_self'
    });
    return actions;
  }
}

// Self-register this task provider.
(0,_services_taskRegistry__WEBPACK_IMPORTED_MODULE_2__.registerTask)(AIOSEOOrganizationLogoTask);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (AIOSEOOrganizationLogoTask);

/***/ }),

/***/ "./assets/src/tasks/aioseo/index.js":
/*!******************************************!*\
  !*** ./assets/src/tasks/aioseo/index.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _AIOSEOOrganizationLogoTask__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AIOSEOOrganizationLogoTask */ "./assets/src/tasks/aioseo/AIOSEOOrganizationLogoTask.js");
/* harmony import */ var _AIOSEOArchiveAuthorTask__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./AIOSEOArchiveAuthorTask */ "./assets/src/tasks/aioseo/AIOSEOArchiveAuthorTask.js");
/* harmony import */ var _AIOSEOArchiveDateTask__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./AIOSEOArchiveDateTask */ "./assets/src/tasks/aioseo/AIOSEOArchiveDateTask.js");
/* harmony import */ var _AIOSEOMediaPagesTask__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./AIOSEOMediaPagesTask */ "./assets/src/tasks/aioseo/AIOSEOMediaPagesTask.js");
/* harmony import */ var _AIOSEOCrawlFeedAuthorsTask__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./AIOSEOCrawlFeedAuthorsTask */ "./assets/src/tasks/aioseo/AIOSEOCrawlFeedAuthorsTask.js");
/* harmony import */ var _AIOSEOCrawlFeedCommentsTask__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./AIOSEOCrawlFeedCommentsTask */ "./assets/src/tasks/aioseo/AIOSEOCrawlFeedCommentsTask.js");
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


// Archive tasks - noindex various archive types.



// Media pages task - redirect attachment pages.


// Crawl optimization tasks - disable RSS feeds.



/***/ }),

/***/ "./assets/src/tasks/index.js":
/*!***********************************!*\
  !*** ./assets/src/tasks/index.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _HelloWorldTask__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./HelloWorldTask */ "./assets/src/tasks/HelloWorldTask.js");
/* harmony import */ var _SamplePageTask__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./SamplePageTask */ "./assets/src/tasks/SamplePageTask.js");
/* harmony import */ var _BlogDescriptionTask__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./BlogDescriptionTask */ "./assets/src/tasks/BlogDescriptionTask.js");
/* harmony import */ var _SiteIconTask__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./SiteIconTask */ "./assets/src/tasks/SiteIconTask.js");
/* harmony import */ var _PermalinkStructureTask__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./PermalinkStructureTask */ "./assets/src/tasks/PermalinkStructureTask.js");
/* harmony import */ var _SelectLocaleTask__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./SelectLocaleTask */ "./assets/src/tasks/SelectLocaleTask.js");
/* harmony import */ var _SelectTimezoneTask__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./SelectTimezoneTask */ "./assets/src/tasks/SelectTimezoneTask.js");
/* harmony import */ var _SetDateFormatTask__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./SetDateFormatTask */ "./assets/src/tasks/SetDateFormatTask.js");
/* harmony import */ var _SearchEngineVisibilityTask__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./SearchEngineVisibilityTask */ "./assets/src/tasks/SearchEngineVisibilityTask.js");
/* harmony import */ var _ContentCreateTask__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./ContentCreateTask */ "./assets/src/tasks/ContentCreateTask.js");
/* harmony import */ var _ContentReviewTask__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./ContentReviewTask */ "./assets/src/tasks/ContentReviewTask.js");
/* harmony import */ var _UnpublishedContentTask__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./UnpublishedContentTask */ "./assets/src/tasks/UnpublishedContentTask.js");
/* harmony import */ var _SetPageAboutTask__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./SetPageAboutTask */ "./assets/src/tasks/SetPageAboutTask.js");
/* harmony import */ var _SetPageFAQTask__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./SetPageFAQTask */ "./assets/src/tasks/SetPageFAQTask.js");
/* harmony import */ var _SetPageContactTask__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./SetPageContactTask */ "./assets/src/tasks/SetPageContactTask.js");
/* harmony import */ var _SetValuablePostTypesTask__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./SetValuablePostTypesTask */ "./assets/src/tasks/SetValuablePostTypesTask.js");
/* harmony import */ var _RenameUncategorizedCategoryTask__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./RenameUncategorizedCategoryTask */ "./assets/src/tasks/RenameUncategorizedCategoryTask.js");
/* harmony import */ var _FewerTagsTask__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./FewerTagsTask */ "./assets/src/tasks/FewerTagsTask.js");
/* harmony import */ var _RemoveTermsWithoutPostsTask__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./RemoveTermsWithoutPostsTask */ "./assets/src/tasks/RemoveTermsWithoutPostsTask.js");
/* harmony import */ var _UpdateTermDescriptionTask__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./UpdateTermDescriptionTask */ "./assets/src/tasks/UpdateTermDescriptionTask.js");
/* harmony import */ var _SEOPluginTask__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./SEOPluginTask */ "./assets/src/tasks/SEOPluginTask.js");
/* harmony import */ var _CoreUpdateTask__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./CoreUpdateTask */ "./assets/src/tasks/CoreUpdateTask.js");
/* harmony import */ var _RemoveInactivePluginsTask__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./RemoveInactivePluginsTask */ "./assets/src/tasks/RemoveInactivePluginsTask.js");
/* harmony import */ var _DebugDisplayTask__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ./DebugDisplayTask */ "./assets/src/tasks/DebugDisplayTask.js");
/* harmony import */ var _PhpVersionTask__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ./PhpVersionTask */ "./assets/src/tasks/PhpVersionTask.js");
/* harmony import */ var _EmailSendingTask__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! ./EmailSendingTask */ "./assets/src/tasks/EmailSendingTask.js");
/* harmony import */ var _DisableCommentsTask__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! ./DisableCommentsTask */ "./assets/src/tasks/DisableCommentsTask.js");
/* harmony import */ var _DisableCommentPaginationTask__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! ./DisableCommentPaginationTask */ "./assets/src/tasks/DisableCommentPaginationTask.js");
/* harmony import */ var _ImprovePdfHandlingTask__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(/*! ./ImprovePdfHandlingTask */ "./assets/src/tasks/ImprovePdfHandlingTask.js");
/* harmony import */ var _ReduceAutoloadedOptionsTask__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(/*! ./ReduceAutoloadedOptionsTask */ "./assets/src/tasks/ReduceAutoloadedOptionsTask.js");
/* harmony import */ var _UserTask__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__(/*! ./UserTask */ "./assets/src/tasks/UserTask.js");
/* harmony import */ var _yoast__WEBPACK_IMPORTED_MODULE_31__ = __webpack_require__(/*! ./yoast */ "./assets/src/tasks/yoast/index.js");
/* harmony import */ var _aioseo__WEBPACK_IMPORTED_MODULE_32__ = __webpack_require__(/*! ./aioseo */ "./assets/src/tasks/aioseo/index.js");
/**
 * Task Registration.
 *
 * Import all React task providers.
 * Tasks self-register via registerTask() when imported.
 */

// Core tasks - basic WordPress setup and configuration










// Content tasks - content creation, management, and SEO













// Maintenance tasks - WordPress updates and housekeeping








// Performance tasks - optimization related



// User tasks - user-created todo items


// Yoast SEO integration tasks


// AIOSEO integration tasks


/***/ }),

/***/ "./assets/src/tasks/yoast/YoastArchiveAuthorTask.js":
/*!**********************************************************!*\
  !*** ./assets/src/tasks/yoast/YoastArchiveAuthorTask.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _services_InteractiveTaskProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../services/InteractiveTaskProvider */ "./assets/src/services/InteractiveTaskProvider.js");
/* harmony import */ var _services_taskRegistry__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../services/taskRegistry */ "./assets/src/services/taskRegistry.js");
/* harmony import */ var _hooks_useTasksApi__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../hooks/useTasksApi */ "./assets/src/hooks/useTasksApi/index.js");
/**
 * Yoast Archive Author Task Provider.
 *
 * React implementation of the Yoast SEO disable author archive task.
 * Migrated from classes/suggested-tasks/providers/integrations/yoast/class-archive-author.php
 */






/**
 * Yoast Archive Author Task Provider class.
 */
class YoastArchiveAuthorTask extends _services_InteractiveTaskProvider__WEBPACK_IMPORTED_MODULE_1__.InteractiveTaskProvider {
  static providerId = 'yoast-author-archive';
  static capability = 'manage_options';
  static isOnboardingTask = false;
  static priority = 50;
  static points = 1;
  static isDismissable = false;
  static isSnoozable = true;
  static externalLinkUrl = 'https://prpl.fyi/yoast-author-archive';
  static popoverId = 'yoast-author-archive';

  /**
   * Minimum number of authors with posts to show the task.
   */
  static MINIMUM_AUTHOR_WITH_POSTS = 1;

  /**
   * Check if the task should be added.
   *
   * @param {Object} taskData Optional task-specific data.
   * @return {Promise<boolean>} Promise resolving to true if task should be added.
   */
  // eslint-disable-next-line no-unused-vars
  async shouldAddTask(taskData = {}) {
    try {
      const yoastOptions = await (0,_hooks_useTasksApi__WEBPACK_IMPORTED_MODULE_3__.fetchDataCollector)('yoast_options');

      // If Yoast is not active, don't add the task.
      if (!yoastOptions) {
        return false;
      }

      // Check if task is relevant (single author site).
      const authorCount = await (0,_hooks_useTasksApi__WEBPACK_IMPORTED_MODULE_3__.fetchDataCollector)('post_author_count');
      if (authorCount > YoastArchiveAuthorTask.MINIMUM_AUTHOR_WITH_POSTS) {
        return false;
      }

      // Show task if disable-author is not true.
      return yoastOptions.wpseo_titles?.['disable-author'] !== true;
    } catch (error) {
      console.error('Error checking Yoast Archive Author task condition:', error);
      return false;
    }
  }

  /**
   * Get task details.
   *
   * @param {Object} taskData Optional task-specific data.
   * @return {Promise<Object>} Promise resolving to task details object.
   */
  // eslint-disable-next-line no-unused-vars
  async getTaskDetails(taskData = {}) {
    const taskDetails = this.buildTaskDetails(taskData, {
      post_title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Yoast SEO: disable the author archive', 'progress-planner'),
      url: this.buildAdminUrl('admin.php?page=wpseo_page_settings#/author-archives')
    });
    return this.addPopoverIdToTaskDetails(taskDetails);
  }

  /**
   * Get the label for the popover action.
   *
   * @return {string} The action label.
   */
  getPopoverActionLabel() {
    return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Disable', 'progress-planner');
  }

  /**
   * Get focus tasks configuration.
   *
   * @return {Array} Array of focus task configurations.
   */
  getFocusTasks() {
    return [{
      iconElement: '.yst-toggle-field__header',
      valueElement: {
        elementSelector: 'button[data-id="input-wpseo_titles-disable-author"]',
        attributeName: 'aria-checked',
        attributeValue: 'false',
        operator: '='
      }
    }];
  }
}

// Self-register this task provider.
(0,_services_taskRegistry__WEBPACK_IMPORTED_MODULE_2__.registerTask)(YoastArchiveAuthorTask);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (YoastArchiveAuthorTask);

/***/ }),

/***/ "./assets/src/tasks/yoast/YoastArchiveDateTask.js":
/*!********************************************************!*\
  !*** ./assets/src/tasks/yoast/YoastArchiveDateTask.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _services_InteractiveTaskProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../services/InteractiveTaskProvider */ "./assets/src/services/InteractiveTaskProvider.js");
/* harmony import */ var _services_taskRegistry__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../services/taskRegistry */ "./assets/src/services/taskRegistry.js");
/* harmony import */ var _hooks_useTasksApi__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../hooks/useTasksApi */ "./assets/src/hooks/useTasksApi/index.js");
/**
 * Yoast Archive Date Task Provider.
 *
 * React implementation of the Yoast SEO disable date archive task.
 * Migrated from classes/suggested-tasks/providers/integrations/yoast/class-archive-date.php
 */






/**
 * Yoast Archive Date Task Provider class.
 */
class YoastArchiveDateTask extends _services_InteractiveTaskProvider__WEBPACK_IMPORTED_MODULE_1__.InteractiveTaskProvider {
  static providerId = 'yoast-date-archive';
  static capability = 'manage_options';
  static isOnboardingTask = false;
  static priority = 50;
  static points = 1;
  static isDismissable = false;
  static isSnoozable = true;
  static externalLinkUrl = 'https://prpl.fyi/yoast-date-archive';
  static popoverId = 'yoast-date-archive';

  /**
   * Check if the task should be added.
   *
   * @param {Object} taskData Optional task-specific data.
   * @return {Promise<boolean>} Promise resolving to true if task should be added.
   */
  // eslint-disable-next-line no-unused-vars
  async shouldAddTask(taskData = {}) {
    try {
      const yoastOptions = await (0,_hooks_useTasksApi__WEBPACK_IMPORTED_MODULE_3__.fetchDataCollector)('yoast_options');

      // If Yoast is not active, don't add the task.
      if (!yoastOptions) {
        return false;
      }

      // Check if task is relevant (permalink doesn't have date tokens).
      const permalinkHasDate = await (0,_hooks_useTasksApi__WEBPACK_IMPORTED_MODULE_3__.fetchDataCollector)('permalink_has_date');
      if (permalinkHasDate) {
        return false;
      }

      // Show task if disable-date is not true.
      return yoastOptions.wpseo_titles?.['disable-date'] !== true;
    } catch (error) {
      console.error('Error checking Yoast Archive Date task condition:', error);
      return false;
    }
  }

  /**
   * Get task details.
   *
   * @param {Object} taskData Optional task-specific data.
   * @return {Promise<Object>} Promise resolving to task details object.
   */
  // eslint-disable-next-line no-unused-vars
  async getTaskDetails(taskData = {}) {
    const taskDetails = this.buildTaskDetails(taskData, {
      post_title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Yoast SEO: disable the date archive', 'progress-planner'),
      url: this.buildAdminUrl('admin.php?page=wpseo_page_settings#/date-archives')
    });
    return this.addPopoverIdToTaskDetails(taskDetails);
  }

  /**
   * Get the label for the popover action.
   *
   * @return {string} The action label.
   */
  getPopoverActionLabel() {
    return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Disable', 'progress-planner');
  }

  /**
   * Get focus tasks configuration.
   *
   * @return {Array} Array of focus task configurations.
   */
  getFocusTasks() {
    return [{
      iconElement: '.yst-toggle-field__header',
      valueElement: {
        elementSelector: 'button[data-id="input-wpseo_titles-disable-date"]',
        attributeName: 'aria-checked',
        attributeValue: 'false',
        operator: '='
      }
    }];
  }
}

// Self-register this task provider.
(0,_services_taskRegistry__WEBPACK_IMPORTED_MODULE_2__.registerTask)(YoastArchiveDateTask);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (YoastArchiveDateTask);

/***/ }),

/***/ "./assets/src/tasks/yoast/YoastArchiveFormatTask.js":
/*!**********************************************************!*\
  !*** ./assets/src/tasks/yoast/YoastArchiveFormatTask.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _services_InteractiveTaskProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../services/InteractiveTaskProvider */ "./assets/src/services/InteractiveTaskProvider.js");
/* harmony import */ var _services_taskRegistry__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../services/taskRegistry */ "./assets/src/services/taskRegistry.js");
/* harmony import */ var _hooks_useTasksApi__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../hooks/useTasksApi */ "./assets/src/hooks/useTasksApi/index.js");
/**
 * Yoast Archive Format Task Provider.
 *
 * React implementation of the Yoast SEO disable format archives task.
 * Migrated from classes/suggested-tasks/providers/integrations/yoast/class-archive-format.php
 */






/**
 * Yoast Archive Format Task Provider class.
 */
class YoastArchiveFormatTask extends _services_InteractiveTaskProvider__WEBPACK_IMPORTED_MODULE_1__.InteractiveTaskProvider {
  static providerId = 'yoast-format-archive';
  static capability = 'manage_options';
  static isOnboardingTask = false;
  static priority = 50;
  static points = 1;
  static isDismissable = false;
  static isSnoozable = true;
  static externalLinkUrl = 'https://prpl.fyi/yoast-format-archive';
  static popoverId = 'yoast-format-archive';

  /**
   * Minimum number of posts with format to show the task.
   */
  static MINIMUM_POSTS_WITH_FORMAT = 3;

  /**
   * Check if the task should be added.
   *
   * @param {Object} taskData Optional task-specific data.
   * @return {Promise<boolean>} Promise resolving to true if task should be added.
   */
  // eslint-disable-next-line no-unused-vars
  async shouldAddTask(taskData = {}) {
    try {
      const yoastOptions = await (0,_hooks_useTasksApi__WEBPACK_IMPORTED_MODULE_3__.fetchDataCollector)('yoast_options');

      // If Yoast is not active, don't add the task.
      if (!yoastOptions) {
        return false;
      }

      // Check if task is relevant (few posts with format).
      const formatCount = await (0,_hooks_useTasksApi__WEBPACK_IMPORTED_MODULE_3__.fetchDataCollector)('archive_format_count');
      if (formatCount > YoastArchiveFormatTask.MINIMUM_POSTS_WITH_FORMAT) {
        return false;
      }

      // Show task if disable-post_format is not true.
      return yoastOptions.wpseo_titles?.['disable-post_format'] !== true;
    } catch (error) {
      console.error('Error checking Yoast Archive Format task condition:', error);
      return false;
    }
  }

  /**
   * Get task details.
   *
   * @param {Object} taskData Optional task-specific data.
   * @return {Promise<Object>} Promise resolving to task details object.
   */
  // eslint-disable-next-line no-unused-vars
  async getTaskDetails(taskData = {}) {
    const taskDetails = this.buildTaskDetails(taskData, {
      post_title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Yoast SEO: disable the format archives', 'progress-planner'),
      url: this.buildAdminUrl('admin.php?page=wpseo_page_settings#/format-archives')
    });
    return this.addPopoverIdToTaskDetails(taskDetails);
  }

  /**
   * Get the label for the popover action.
   *
   * @return {string} The action label.
   */
  getPopoverActionLabel() {
    return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Disable', 'progress-planner');
  }

  /**
   * Get focus tasks configuration.
   *
   * @return {Array} Array of focus task configurations.
   */
  getFocusTasks() {
    return [{
      iconElement: '.yst-toggle-field__header',
      valueElement: {
        elementSelector: 'button[data-id="input-wpseo_titles-disable-post_format"]',
        attributeName: 'aria-checked',
        attributeValue: 'false',
        operator: '='
      }
    }];
  }
}

// Self-register this task provider.
(0,_services_taskRegistry__WEBPACK_IMPORTED_MODULE_2__.registerTask)(YoastArchiveFormatTask);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (YoastArchiveFormatTask);

/***/ }),

/***/ "./assets/src/tasks/yoast/YoastCornerstoneWorkoutTask.js":
/*!***************************************************************!*\
  !*** ./assets/src/tasks/yoast/YoastCornerstoneWorkoutTask.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _services_TaskProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../services/TaskProvider */ "./assets/src/services/TaskProvider.js");
/* harmony import */ var _services_taskRegistry__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../services/taskRegistry */ "./assets/src/services/taskRegistry.js");
/* harmony import */ var _hooks_useTasksApi__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../hooks/useTasksApi */ "./assets/src/hooks/useTasksApi/index.js");
/**
 * Yoast Cornerstone Workout Task Provider.
 *
 * React implementation of the Yoast SEO Cornerstone Content Workout task.
 * Migrated from classes/suggested-tasks/providers/integrations/yoast/class-cornerstone-workout.php
 *
 * Note: This is a Premium-only task that requires Yoast SEO Premium.
 * The task auto-dismissal when workout is completed is handled server-side
 * via the update_option_wpseo_premium hook in PHP.
 */






/**
 * Yoast Cornerstone Workout Task Provider class.
 */
class YoastCornerstoneWorkoutTask extends _services_TaskProvider__WEBPACK_IMPORTED_MODULE_1__.TaskProvider {
  static providerId = 'yoast-cornerstone-workout';
  static capability = 'edit_others_posts';
  static isOnboardingTask = false;
  static priority = 20;
  static points = 3;
  static isDismissable = true;
  static isSnoozable = true;
  static isRepetitive = true;
  static externalLinkUrl = 'https://prpl.fyi/run-cornerstone-content-workout';

  /**
   * Check if the task should be added.
   *
   * @param {Object} taskData Optional task-specific data.
   * @return {Promise<boolean>} Promise resolving to true if task should be added.
   */
  // eslint-disable-next-line no-unused-vars
  async shouldAddTask(taskData = {}) {
    try {
      const premiumStatus = await (0,_hooks_useTasksApi__WEBPACK_IMPORTED_MODULE_3__.fetchDataCollector)('yoast_premium_status');

      // Only show task if Yoast Premium is active.
      if (!premiumStatus?.active) {
        return false;
      }

      // Task dismissal is handled by the TaskProvider infrastructure.
      // The PHP side handles auto-dismissal when workout is completed.
      return true;
    } catch (error) {
      console.error('Error checking Yoast Cornerstone Workout task condition:', error);
      return false;
    }
  }

  /**
   * Get task details.
   *
   * @param {Object} taskData Optional task-specific data.
   * @return {Promise<Object>} Promise resolving to task details object.
   */
  // eslint-disable-next-line no-unused-vars
  async getTaskDetails(taskData = {}) {
    return this.buildTaskDetails(taskData, {
      post_title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("Yoast SEO: do Yoast SEO's Cornerstone Content Workout", 'progress-planner'),
      url: this.buildAdminUrl('admin.php?page=wpseo_workouts#cornerstone')
    });
  }

  /**
   * Add custom task actions.
   *
   * @param {Object} taskData The task data.
   * @param {Array}  actions  The existing actions array.
   * @return {Array} The modified actions array.
   */
  addTaskActions(taskData, actions) {
    // Add "Run workout" link action with high priority.
    actions.push({
      type: 'link',
      priority: 10,
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Run workout', 'progress-planner'),
      url: this.buildAdminUrl('admin.php?page=wpseo_workouts#cornerstone'),
      target: '_self'
    });
    return actions;
  }
}

// Self-register this task provider.
(0,_services_taskRegistry__WEBPACK_IMPORTED_MODULE_2__.registerTask)(YoastCornerstoneWorkoutTask);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (YoastCornerstoneWorkoutTask);

/***/ }),

/***/ "./assets/src/tasks/yoast/YoastCrawlEmojiScriptsTask.js":
/*!**************************************************************!*\
  !*** ./assets/src/tasks/yoast/YoastCrawlEmojiScriptsTask.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _services_InteractiveTaskProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../services/InteractiveTaskProvider */ "./assets/src/services/InteractiveTaskProvider.js");
/* harmony import */ var _services_taskRegistry__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../services/taskRegistry */ "./assets/src/services/taskRegistry.js");
/* harmony import */ var _hooks_useTasksApi__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../hooks/useTasksApi */ "./assets/src/hooks/useTasksApi/index.js");
/**
 * Yoast Crawl Emoji Scripts Task Provider.
 *
 * React implementation of the Yoast SEO remove emoji scripts task.
 * Migrated from classes/suggested-tasks/providers/integrations/yoast/class-crawl-settings-emoji-scripts.php
 */






/**
 * Yoast Crawl Emoji Scripts Task Provider class.
 */
class YoastCrawlEmojiScriptsTask extends _services_InteractiveTaskProvider__WEBPACK_IMPORTED_MODULE_1__.InteractiveTaskProvider {
  static providerId = 'yoast-crawl-settings-emoji-scripts';
  static capability = 'manage_options';
  static isOnboardingTask = false;
  static priority = 50;
  static points = 1;
  static isDismissable = false;
  static isSnoozable = true;
  static externalLinkUrl = 'https://prpl.fyi/yoast-crawl-optimization-emoji-scripts';
  static popoverId = 'yoast-crawl-settings-emoji-scripts';

  /**
   * Check if the task should be added.
   *
   * @param {Object} taskData Optional task-specific data.
   * @return {Promise<boolean>} Promise resolving to true if task should be added.
   */
  // eslint-disable-next-line no-unused-vars
  async shouldAddTask(taskData = {}) {
    try {
      const yoastOptions = await (0,_hooks_useTasksApi__WEBPACK_IMPORTED_MODULE_3__.fetchDataCollector)('yoast_options');

      // If Yoast is not active, don't add the task.
      if (!yoastOptions) {
        return false;
      }

      // Show task if remove_emoji_scripts is not enabled.
      return !yoastOptions.wpseo?.remove_emoji_scripts;
    } catch (error) {
      console.error('Error checking Yoast Crawl Emoji Scripts task condition:', error);
      return false;
    }
  }

  /**
   * Get task details.
   *
   * @param {Object} taskData Optional task-specific data.
   * @return {Promise<Object>} Promise resolving to task details object.
   */
  // eslint-disable-next-line no-unused-vars
  async getTaskDetails(taskData = {}) {
    const taskDetails = this.buildTaskDetails(taskData, {
      post_title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Yoast SEO: remove emoji scripts', 'progress-planner'),
      url: this.buildAdminUrl('admin.php?page=wpseo_page_settings#/crawl-optimization#input-wpseo-remove_emoji_scripts')
    });
    return this.addPopoverIdToTaskDetails(taskDetails);
  }

  /**
   * Get the label for the popover action.
   *
   * @return {string} The action label.
   */
  getPopoverActionLabel() {
    return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Remove', 'progress-planner');
  }

  /**
   * Get focus tasks configuration.
   *
   * @return {Array} Array of focus task configurations.
   */
  getFocusTasks() {
    return [{
      iconElement: '.yst-toggle-field__header',
      valueElement: {
        elementSelector: 'button[data-id="input-wpseo-remove_emoji_scripts"]',
        attributeName: 'aria-checked',
        attributeValue: 'true',
        operator: '='
      }
    }];
  }
}

// Self-register this task provider.
(0,_services_taskRegistry__WEBPACK_IMPORTED_MODULE_2__.registerTask)(YoastCrawlEmojiScriptsTask);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (YoastCrawlEmojiScriptsTask);

/***/ }),

/***/ "./assets/src/tasks/yoast/YoastCrawlFeedAuthorsTask.js":
/*!*************************************************************!*\
  !*** ./assets/src/tasks/yoast/YoastCrawlFeedAuthorsTask.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _services_InteractiveTaskProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../services/InteractiveTaskProvider */ "./assets/src/services/InteractiveTaskProvider.js");
/* harmony import */ var _services_taskRegistry__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../services/taskRegistry */ "./assets/src/services/taskRegistry.js");
/* harmony import */ var _hooks_useTasksApi__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../hooks/useTasksApi */ "./assets/src/hooks/useTasksApi/index.js");
/**
 * Yoast Crawl Feed Authors Task Provider.
 *
 * React implementation of the Yoast SEO remove post authors feeds task.
 * Migrated from classes/suggested-tasks/providers/integrations/yoast/class-crawl-settings-feed-authors.php
 */






/**
 * Yoast Crawl Feed Authors Task Provider class.
 */
class YoastCrawlFeedAuthorsTask extends _services_InteractiveTaskProvider__WEBPACK_IMPORTED_MODULE_1__.InteractiveTaskProvider {
  static providerId = 'yoast-crawl-settings-feed-authors';
  static capability = 'manage_options';
  static isOnboardingTask = false;
  static priority = 50;
  static points = 1;
  static isDismissable = false;
  static isSnoozable = true;
  static externalLinkUrl = 'https://prpl.fyi/yoast-crawl-optimization-feed-authors';
  static popoverId = 'yoast-crawl-settings-feed-authors';

  /**
   * Minimum number of authors with posts to show the task.
   */
  static MINIMUM_AUTHOR_WITH_POSTS = 1;

  /**
   * Check if the task should be added.
   *
   * @param {Object} taskData Optional task-specific data.
   * @return {Promise<boolean>} Promise resolving to true if task should be added.
   */
  // eslint-disable-next-line no-unused-vars
  async shouldAddTask(taskData = {}) {
    try {
      const yoastOptions = await (0,_hooks_useTasksApi__WEBPACK_IMPORTED_MODULE_3__.fetchDataCollector)('yoast_options');

      // If Yoast is not active, don't add the task.
      if (!yoastOptions) {
        return false;
      }

      // Check if task is relevant (single author site).
      const authorCount = await (0,_hooks_useTasksApi__WEBPACK_IMPORTED_MODULE_3__.fetchDataCollector)('post_author_count');
      if (authorCount > YoastCrawlFeedAuthorsTask.MINIMUM_AUTHOR_WITH_POSTS) {
        return false;
      }

      // Show task if remove_feed_authors is not enabled.
      return !yoastOptions.wpseo?.remove_feed_authors;
    } catch (error) {
      console.error('Error checking Yoast Crawl Feed Authors task condition:', error);
      return false;
    }
  }

  /**
   * Get task details.
   *
   * @param {Object} taskData Optional task-specific data.
   * @return {Promise<Object>} Promise resolving to task details object.
   */
  // eslint-disable-next-line no-unused-vars
  async getTaskDetails(taskData = {}) {
    const taskDetails = this.buildTaskDetails(taskData, {
      post_title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Yoast SEO: remove post authors feeds', 'progress-planner'),
      url: this.buildAdminUrl('admin.php?page=wpseo_page_settings#/crawl-optimization#input-wpseo-remove_feed_authors')
    });
    return this.addPopoverIdToTaskDetails(taskDetails);
  }

  /**
   * Get the label for the popover action.
   *
   * @return {string} The action label.
   */
  getPopoverActionLabel() {
    return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Remove', 'progress-planner');
  }

  /**
   * Get focus tasks configuration.
   *
   * @return {Array} Array of focus task configurations.
   */
  getFocusTasks() {
    return [{
      iconElement: '.yst-toggle-field__header',
      valueElement: {
        elementSelector: 'button[data-id="input-wpseo-remove_feed_authors"]',
        attributeName: 'aria-checked',
        attributeValue: 'true',
        operator: '='
      }
    }];
  }
}

// Self-register this task provider.
(0,_services_taskRegistry__WEBPACK_IMPORTED_MODULE_2__.registerTask)(YoastCrawlFeedAuthorsTask);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (YoastCrawlFeedAuthorsTask);

/***/ }),

/***/ "./assets/src/tasks/yoast/YoastCrawlFeedCommentsTask.js":
/*!**************************************************************!*\
  !*** ./assets/src/tasks/yoast/YoastCrawlFeedCommentsTask.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _services_InteractiveTaskProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../services/InteractiveTaskProvider */ "./assets/src/services/InteractiveTaskProvider.js");
/* harmony import */ var _services_taskRegistry__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../services/taskRegistry */ "./assets/src/services/taskRegistry.js");
/* harmony import */ var _hooks_useTasksApi__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../hooks/useTasksApi */ "./assets/src/hooks/useTasksApi/index.js");
/**
 * Yoast Crawl Feed Global Comments Task Provider.
 *
 * React implementation of the Yoast SEO remove global comment feeds task.
 * Migrated from classes/suggested-tasks/providers/integrations/yoast/class-crawl-settings-feed-global-comments.php
 */






/**
 * Yoast Crawl Feed Global Comments Task Provider class.
 */
class YoastCrawlFeedCommentsTask extends _services_InteractiveTaskProvider__WEBPACK_IMPORTED_MODULE_1__.InteractiveTaskProvider {
  static providerId = 'yoast-crawl-settings-feed-global-comments';
  static capability = 'manage_options';
  static isOnboardingTask = false;
  static priority = 50;
  static points = 1;
  static isDismissable = false;
  static isSnoozable = true;
  static externalLinkUrl = 'https://prpl.fyi/yoast-crawl-optimization-feed-global-comments';
  static popoverId = 'yoast-crawl-settings-feed-global-comments';

  /**
   * Check if the task should be added.
   *
   * @param {Object} taskData Optional task-specific data.
   * @return {Promise<boolean>} Promise resolving to true if task should be added.
   */
  // eslint-disable-next-line no-unused-vars
  async shouldAddTask(taskData = {}) {
    try {
      const yoastOptions = await (0,_hooks_useTasksApi__WEBPACK_IMPORTED_MODULE_3__.fetchDataCollector)('yoast_options');

      // If Yoast is not active, don't add the task.
      if (!yoastOptions) {
        return false;
      }

      // Show task if remove_feed_global_comments is not enabled.
      return !yoastOptions.wpseo?.remove_feed_global_comments;
    } catch (error) {
      console.error('Error checking Yoast Crawl Feed Comments task condition:', error);
      return false;
    }
  }

  /**
   * Get task details.
   *
   * @param {Object} taskData Optional task-specific data.
   * @return {Promise<Object>} Promise resolving to task details object.
   */
  // eslint-disable-next-line no-unused-vars
  async getTaskDetails(taskData = {}) {
    const taskDetails = this.buildTaskDetails(taskData, {
      post_title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Yoast SEO: remove global comment feeds', 'progress-planner'),
      url: this.buildAdminUrl('admin.php?page=wpseo_page_settings#/crawl-optimization#input-wpseo-remove_feed_global_comments')
    });
    return this.addPopoverIdToTaskDetails(taskDetails);
  }

  /**
   * Get the label for the popover action.
   *
   * @return {string} The action label.
   */
  getPopoverActionLabel() {
    return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Remove', 'progress-planner');
  }

  /**
   * Get focus tasks configuration.
   *
   * @return {Array} Array of focus task configurations.
   */
  getFocusTasks() {
    return [{
      iconElement: '.yst-toggle-field__header',
      valueElement: {
        elementSelector: 'button[data-id="input-wpseo-remove_feed_global_comments"]',
        attributeName: 'aria-checked',
        attributeValue: 'true',
        operator: '='
      }
    }];
  }
}

// Self-register this task provider.
(0,_services_taskRegistry__WEBPACK_IMPORTED_MODULE_2__.registerTask)(YoastCrawlFeedCommentsTask);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (YoastCrawlFeedCommentsTask);

/***/ }),

/***/ "./assets/src/tasks/yoast/YoastFixOrphanedContentTask.js":
/*!***************************************************************!*\
  !*** ./assets/src/tasks/yoast/YoastFixOrphanedContentTask.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _services_TaskProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../services/TaskProvider */ "./assets/src/services/TaskProvider.js");
/* harmony import */ var _services_taskRegistry__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../services/taskRegistry */ "./assets/src/services/taskRegistry.js");
/* harmony import */ var _hooks_useTasksApi__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../hooks/useTasksApi */ "./assets/src/hooks/useTasksApi/index.js");
/**
 * Yoast Fix Orphaned Content Task Provider.
 *
 * React implementation of the Yoast SEO fix orphaned content task.
 * Migrated from classes/suggested-tasks/providers/integrations/yoast/class-fix-orphaned-content.php
 *
 * Note: This is a multi-task provider that creates one task per orphaned post.
 * Orphaned posts are posts without internal links pointing to them.
 */






/**
 * Yoast Fix Orphaned Content Task Provider class.
 */
class YoastFixOrphanedContentTask extends _services_TaskProvider__WEBPACK_IMPORTED_MODULE_1__.TaskProvider {
  static providerId = 'yoast-fix-orphaned-content';
  static capability = 'edit_others_posts';
  static isOnboardingTask = false;
  static priority = 50;
  static points = 1;
  static isDismissable = true;
  static isSnoozable = true;
  static externalLinkUrl = 'https://prpl.fyi/fix-orphaned-content';
  static isMultiTask = true;

  /**
   * Check if the task should be added.
   *
   * @param {Object} taskData Optional task-specific data.
   * @return {Promise<boolean>} Promise resolving to true if task should be added.
   */
  // eslint-disable-next-line no-unused-vars
  async shouldAddTask(taskData = {}) {
    try {
      const tasksToInject = await this.getTasksToInject();
      return tasksToInject && tasksToInject.length > 0;
    } catch (error) {
      console.error('Error checking Yoast Fix Orphaned Content task condition:', error);
      return false;
    }
  }

  /**
   * Get tasks to inject.
   *
   * Returns an array of taskData items, one for each orphaned post.
   *
   * @return {Promise<Array>} Promise resolving to array of taskData objects.
   */
  async getTasksToInject() {
    try {
      const orphanedContent = await (0,_hooks_useTasksApi__WEBPACK_IMPORTED_MODULE_3__.fetchDataCollector)('yoast_orphaned_content');
      if (!orphanedContent) {
        return [];
      }

      // Normalize to array.
      const orphanedArray = Array.isArray(orphanedContent) ? orphanedContent : [orphanedContent];
      if (orphanedArray.length === 0) {
        return [];
      }

      // Return array of taskData objects, one per orphaned post.
      return orphanedArray.map(post => ({
        target_post_id: post.ID || post.id || post.post_id,
        target_post_title: post.post_title || post.title || ''
      }));
    } catch (error) {
      console.error('Error getting tasks to inject for Yoast Fix Orphaned Content:', error);
      return [];
    }
  }

  /**
   * Get task details.
   *
   * @param {Object} taskData Optional task-specific data.
   * @return {Promise<Object>} Promise resolving to task details object.
   */
  // eslint-disable-next-line no-unused-vars
  async getTaskDetails(taskData = {}) {
    const targetPostId = taskData?.target_post_id || null;
    const targetPostTitle = taskData?.target_post_title || '';
    if (!targetPostId) {
      throw new Error('YoastFixOrphanedContentTask requires target_post_id in taskData');
    }
    return this.buildTaskDetails(taskData, {
      post_title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.sprintf)(/* translators: %s: Post title. */
      (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Yoast SEO: add internal links to article "%s"!', 'progress-planner'), targetPostTitle),
      url: this.buildAdminUrl('post.php', {
        post: targetPostId,
        action: 'edit'
      }),
      url_target: '_blank',
      target_post_id: targetPostId,
      target_post_title: targetPostTitle
    });
  }

  /**
   * Add custom task actions.
   *
   * @param {Object} taskData The task data.
   * @param {Array}  actions  The existing actions array.
   * @return {Array} The modified actions array.
   */
  addTaskActions(taskData, actions) {
    // Add "Learn more" link action.
    actions.push({
      type: 'link',
      priority: 10,
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Learn more about internal linking', 'progress-planner'),
      url: 'https://prpl.fyi/fix-orphaned-content',
      target: '_blank'
    });
    return actions;
  }
}

// Self-register this task provider.
(0,_services_taskRegistry__WEBPACK_IMPORTED_MODULE_2__.registerTask)(YoastFixOrphanedContentTask);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (YoastFixOrphanedContentTask);

/***/ }),

/***/ "./assets/src/tasks/yoast/YoastMediaPagesTask.js":
/*!*******************************************************!*\
  !*** ./assets/src/tasks/yoast/YoastMediaPagesTask.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _services_InteractiveTaskProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../services/InteractiveTaskProvider */ "./assets/src/services/InteractiveTaskProvider.js");
/* harmony import */ var _services_taskRegistry__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../services/taskRegistry */ "./assets/src/services/taskRegistry.js");
/* harmony import */ var _hooks_useTasksApi__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../hooks/useTasksApi */ "./assets/src/hooks/useTasksApi/index.js");
/**
 * Yoast Media Pages Task Provider.
 *
 * React implementation of the Yoast SEO disable media pages task.
 * Migrated from classes/suggested-tasks/providers/integrations/yoast/class-media-pages.php
 */






/**
 * Yoast Media Pages Task Provider class.
 */
class YoastMediaPagesTask extends _services_InteractiveTaskProvider__WEBPACK_IMPORTED_MODULE_1__.InteractiveTaskProvider {
  static providerId = 'yoast-media-pages';
  static capability = 'manage_options';
  static isOnboardingTask = false;
  static priority = 50;
  static points = 1;
  static isDismissable = false;
  static isSnoozable = true;
  static externalLinkUrl = 'https://prpl.fyi/yoast-media-pages';
  static popoverId = 'yoast-media-pages';

  /**
   * Check if the task should be added.
   *
   * @param {Object} taskData Optional task-specific data.
   * @return {Promise<boolean>} Promise resolving to true if task should be added.
   */
  // eslint-disable-next-line no-unused-vars
  async shouldAddTask(taskData = {}) {
    try {
      const yoastOptions = await (0,_hooks_useTasksApi__WEBPACK_IMPORTED_MODULE_3__.fetchDataCollector)('yoast_options');

      // If Yoast is not active, don't add the task.
      if (!yoastOptions) {
        return false;
      }

      // Show task if disable-attachment is not true.
      return yoastOptions.wpseo_titles?.['disable-attachment'] !== true;
    } catch (error) {
      console.error('Error checking Yoast Media Pages task condition:', error);
      return false;
    }
  }

  /**
   * Get task details.
   *
   * @param {Object} taskData Optional task-specific data.
   * @return {Promise<Object>} Promise resolving to task details object.
   */
  // eslint-disable-next-line no-unused-vars
  async getTaskDetails(taskData = {}) {
    const taskDetails = this.buildTaskDetails(taskData, {
      post_title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Yoast SEO: disable the media pages', 'progress-planner'),
      url: this.buildAdminUrl('admin.php?page=wpseo_page_settings#/media-pages')
    });
    return this.addPopoverIdToTaskDetails(taskDetails);
  }

  /**
   * Get the label for the popover action.
   *
   * @return {string} The action label.
   */
  getPopoverActionLabel() {
    return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Disable', 'progress-planner');
  }

  /**
   * Get focus tasks configuration.
   *
   * @return {Array} Array of focus task configurations.
   */
  getFocusTasks() {
    return [{
      iconElement: '.yst-toggle-field__header',
      valueElement: {
        elementSelector: 'button[data-id="input-wpseo_titles-disable-attachment"]',
        attributeName: 'aria-checked',
        attributeValue: 'false',
        operator: '='
      }
    }];
  }
}

// Self-register this task provider.
(0,_services_taskRegistry__WEBPACK_IMPORTED_MODULE_2__.registerTask)(YoastMediaPagesTask);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (YoastMediaPagesTask);

/***/ }),

/***/ "./assets/src/tasks/yoast/YoastOrganizationLogoTask.js":
/*!*************************************************************!*\
  !*** ./assets/src/tasks/yoast/YoastOrganizationLogoTask.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _services_InteractiveTaskProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../services/InteractiveTaskProvider */ "./assets/src/services/InteractiveTaskProvider.js");
/* harmony import */ var _services_taskRegistry__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../services/taskRegistry */ "./assets/src/services/taskRegistry.js");
/* harmony import */ var _hooks_useTasksApi__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../hooks/useTasksApi */ "./assets/src/hooks/useTasksApi/index.js");
/**
 * Yoast Organization Logo Task Provider.
 *
 * React implementation of the Yoast SEO set organization/person logo task.
 * Migrated from classes/suggested-tasks/providers/integrations/yoast/class-organization-logo.php
 */






/**
 * Yoast Organization Logo Task Provider class.
 */
class YoastOrganizationLogoTask extends _services_InteractiveTaskProvider__WEBPACK_IMPORTED_MODULE_1__.InteractiveTaskProvider {
  static providerId = 'yoast-organization-logo';
  static capability = 'manage_options';
  static isOnboardingTask = false;
  static priority = 50;
  static points = 1;
  static isDismissable = false;
  static isSnoozable = true;
  static externalLinkUrl = 'https://prpl.fyi/yoast-organization-logo';
  static popoverId = 'yoast-organization-logo';

  /**
   * Whether the site is in person mode.
   */
  isPersonMode = false;

  /**
   * Check if the site is in person mode.
   *
   * @param {Object} yoastOptions The Yoast options.
   * @return {boolean} True if in person mode.
   */
  checkIsPersonMode(yoastOptions) {
    return yoastOptions?.wpseo_titles?.company_or_person === 'person' || yoastOptions?.wpseo?.company_or_person === 'person';
  }

  /**
   * Check if the task should be added.
   *
   * @param {Object} taskData Optional task-specific data.
   * @return {Promise<boolean>} Promise resolving to true if task should be added.
   */
  // eslint-disable-next-line no-unused-vars
  async shouldAddTask(taskData = {}) {
    try {
      const yoastOptions = await (0,_hooks_useTasksApi__WEBPACK_IMPORTED_MODULE_3__.fetchDataCollector)('yoast_options');

      // If Yoast is not active, don't add the task.
      if (!yoastOptions) {
        return false;
      }

      // Check if site logo is set (Yoast uses it as fallback).
      if (yoastOptions.site_logo) {
        return false;
      }

      // Store the mode for later use.
      this.isPersonMode = this.checkIsPersonMode(yoastOptions);

      // Check if Yoast-specific logo is already set.
      if (this.isPersonMode && yoastOptions.wpseo_titles?.person_logo) {
        // Person mode - logo is already set.
        return false;
      } else if (!this.isPersonMode && yoastOptions.wpseo_titles?.company_logo) {
        // Company mode - logo is already set.
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error checking Yoast Organization Logo task condition:', error);
      return false;
    }
  }

  /**
   * Get task details.
   *
   * @param {Object} taskData Optional task-specific data.
   * @return {Promise<Object>} Promise resolving to task details object.
   */
  // eslint-disable-next-line no-unused-vars
  async getTaskDetails(taskData = {}) {
    // Refresh the mode check.
    const yoastOptions = await (0,_hooks_useTasksApi__WEBPACK_IMPORTED_MODULE_3__.fetchDataCollector)('yoast_options');
    this.isPersonMode = this.checkIsPersonMode(yoastOptions);
    const title = this.isPersonMode ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Yoast SEO: set your person logo', 'progress-planner') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Yoast SEO: set your organization logo', 'progress-planner');
    const taskDetails = this.buildTaskDetails(taskData, {
      post_title: title,
      url: this.buildAdminUrl('admin.php?page=wpseo_page_settings#/site-representation')
    });
    return this.addPopoverIdToTaskDetails(taskDetails);
  }

  /**
   * Get external link URL.
   *
   * @return {string} The external link URL.
   */
  getExternalLinkUrl() {
    return this.isPersonMode ? 'https://prpl.fyi/yoast-person-logo' : 'https://prpl.fyi/yoast-organization-logo';
  }

  /**
   * Get the label for the popover action.
   *
   * @return {string} The action label.
   */
  getPopoverActionLabel() {
    return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Set logo', 'progress-planner');
  }

  /**
   * Get focus tasks configuration.
   *
   * @return {Array} Array of focus task configurations.
   */
  getFocusTasks() {
    return [{
      iconElement: 'legend.yst-label',
      valueElement: {
        elementSelector: 'input[name="wpseo_titles.company_logo"]',
        attributeName: 'value',
        attributeValue: '',
        operator: '!='
      }
    }, {
      iconElement: 'legend.yst-label',
      valueElement: {
        elementSelector: 'input[name="wpseo_titles.person_logo"]',
        attributeName: 'value',
        attributeValue: '',
        operator: '!='
      }
    }];
  }
}

// Self-register this task provider.
(0,_services_taskRegistry__WEBPACK_IMPORTED_MODULE_2__.registerTask)(YoastOrganizationLogoTask);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (YoastOrganizationLogoTask);

/***/ }),

/***/ "./assets/src/tasks/yoast/YoastOrphanedContentWorkoutTask.js":
/*!*******************************************************************!*\
  !*** ./assets/src/tasks/yoast/YoastOrphanedContentWorkoutTask.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _services_TaskProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../services/TaskProvider */ "./assets/src/services/TaskProvider.js");
/* harmony import */ var _services_taskRegistry__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../services/taskRegistry */ "./assets/src/services/taskRegistry.js");
/* harmony import */ var _hooks_useTasksApi__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../hooks/useTasksApi */ "./assets/src/hooks/useTasksApi/index.js");
/**
 * Yoast Orphaned Content Workout Task Provider.
 *
 * React implementation of the Yoast SEO Orphaned Content Workout task.
 * Migrated from classes/suggested-tasks/providers/integrations/yoast/class-orphaned-content-workout.php
 *
 * Note: This is a Premium-only task that requires Yoast SEO Premium.
 * The task auto-dismissal when workout is completed is handled server-side
 * via the update_option_wpseo_premium hook in PHP.
 */






/**
 * Yoast Orphaned Content Workout Task Provider class.
 */
class YoastOrphanedContentWorkoutTask extends _services_TaskProvider__WEBPACK_IMPORTED_MODULE_1__.TaskProvider {
  static providerId = 'yoast-orphaned-content-workout';
  static capability = 'edit_others_posts';
  static isOnboardingTask = false;
  static priority = 20;
  static points = 3;
  static isDismissable = true;
  static isSnoozable = true;
  static isRepetitive = true;
  static externalLinkUrl = 'https://prpl.fyi/run-orphaned-content-workout';

  /**
   * Check if the task should be added.
   *
   * @param {Object} taskData Optional task-specific data.
   * @return {Promise<boolean>} Promise resolving to true if task should be added.
   */
  // eslint-disable-next-line no-unused-vars
  async shouldAddTask(taskData = {}) {
    try {
      const premiumStatus = await (0,_hooks_useTasksApi__WEBPACK_IMPORTED_MODULE_3__.fetchDataCollector)('yoast_premium_status');

      // Only show task if Yoast Premium is active.
      if (!premiumStatus?.active) {
        return false;
      }

      // Task dismissal is handled by the TaskProvider infrastructure.
      // The PHP side handles auto-dismissal when workout is completed.
      return true;
    } catch (error) {
      console.error('Error checking Yoast Orphaned Content Workout task condition:', error);
      return false;
    }
  }

  /**
   * Get task details.
   *
   * @param {Object} taskData Optional task-specific data.
   * @return {Promise<Object>} Promise resolving to task details object.
   */
  // eslint-disable-next-line no-unused-vars
  async getTaskDetails(taskData = {}) {
    return this.buildTaskDetails(taskData, {
      post_title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("Yoast SEO: do Yoast SEO's Orphaned Content Workout", 'progress-planner'),
      url: this.buildAdminUrl('admin.php?page=wpseo_workouts#orphaned')
    });
  }

  /**
   * Add custom task actions.
   *
   * @param {Object} taskData The task data.
   * @param {Array}  actions  The existing actions array.
   * @return {Array} The modified actions array.
   */
  addTaskActions(taskData, actions) {
    // Add "Run workout" link action with high priority.
    actions.push({
      type: 'link',
      priority: 10,
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Run workout', 'progress-planner'),
      url: this.buildAdminUrl('admin.php?page=wpseo_workouts#orphaned'),
      target: '_self'
    });
    return actions;
  }
}

// Self-register this task provider.
(0,_services_taskRegistry__WEBPACK_IMPORTED_MODULE_2__.registerTask)(YoastOrphanedContentWorkoutTask);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (YoastOrphanedContentWorkoutTask);

/***/ }),

/***/ "./assets/src/tasks/yoast/index.js":
/*!*****************************************!*\
  !*** ./assets/src/tasks/yoast/index.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _YoastArchiveAuthorTask__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./YoastArchiveAuthorTask */ "./assets/src/tasks/yoast/YoastArchiveAuthorTask.js");
/* harmony import */ var _YoastArchiveDateTask__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./YoastArchiveDateTask */ "./assets/src/tasks/yoast/YoastArchiveDateTask.js");
/* harmony import */ var _YoastArchiveFormatTask__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./YoastArchiveFormatTask */ "./assets/src/tasks/yoast/YoastArchiveFormatTask.js");
/* harmony import */ var _YoastMediaPagesTask__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./YoastMediaPagesTask */ "./assets/src/tasks/yoast/YoastMediaPagesTask.js");
/* harmony import */ var _YoastCrawlEmojiScriptsTask__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./YoastCrawlEmojiScriptsTask */ "./assets/src/tasks/yoast/YoastCrawlEmojiScriptsTask.js");
/* harmony import */ var _YoastCrawlFeedAuthorsTask__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./YoastCrawlFeedAuthorsTask */ "./assets/src/tasks/yoast/YoastCrawlFeedAuthorsTask.js");
/* harmony import */ var _YoastCrawlFeedCommentsTask__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./YoastCrawlFeedCommentsTask */ "./assets/src/tasks/yoast/YoastCrawlFeedCommentsTask.js");
/* harmony import */ var _YoastOrganizationLogoTask__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./YoastOrganizationLogoTask */ "./assets/src/tasks/yoast/YoastOrganizationLogoTask.js");
/* harmony import */ var _YoastCornerstoneWorkoutTask__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./YoastCornerstoneWorkoutTask */ "./assets/src/tasks/yoast/YoastCornerstoneWorkoutTask.js");
/* harmony import */ var _YoastOrphanedContentWorkoutTask__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./YoastOrphanedContentWorkoutTask */ "./assets/src/tasks/yoast/YoastOrphanedContentWorkoutTask.js");
/* harmony import */ var _YoastFixOrphanedContentTask__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./YoastFixOrphanedContentTask */ "./assets/src/tasks/yoast/YoastFixOrphanedContentTask.js");
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




// Media pages task.


// Crawl optimization tasks.




// Organization logo task.


// Premium workout tasks (Yoast SEO Premium only).



// Fix orphaned content task (creates tasks per orphaned post).


/***/ }),

/***/ "./assets/src/utils/gridResize/index.js":
/*!**********************************************!*\
  !*** ./assets/src/utils/gridResize/index.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   dispatchGridResize: () => (/* binding */ dispatchGridResize)
/* harmony export */ });
/**
 * Grid Resize Utility
 *
 * Dispatches the 'prpl/grid/resize' custom event to trigger masonry grid recalculation.
 * This event is listened to by useGridMasonry hook.
 */

/**
 * Dispatch a grid resize event.
 *
 * @param {number} delay - Optional delay in milliseconds before dispatching.
 */
function dispatchGridResize(delay = 0) {
  if (delay > 0) {
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('prpl/grid/resize'));
    }, delay);
  } else {
    window.dispatchEvent(new CustomEvent('prpl/grid/resize'));
  }
}

/***/ }),

/***/ "./assets/src/utils/taskIdResolver/index.js":
/*!**************************************************!*\
  !*** ./assets/src/utils/taskIdResolver/index.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   resolveTaskId: () => (/* binding */ resolveTaskId)
/* harmony export */ });
/**
 * Task ID Resolver Utility.
 *
 * Resolves the task ID from various sources with consistent fallback logic.
 * Provides a single source of truth for task ID resolution across the application.
 *
 * @module utils/taskIdResolver
 */

/**
 * Resolve task ID from task object or popover ID.
 *
 * Attempts to find the task ID from multiple sources in order of preference:
 * 1. task.slug - Direct slug property on task
 * 2. task.prpl_provider.slug - Slug from provider object
 * 3. popoverId - Fallback to provided popover ID
 *
 * @param {Object|null} task      The task object containing task information.
 * @param {string|null} popoverId The popover ID to use as fallback (optional).
 * @return {string|null} The resolved task ID or null if not found.
 *
 * @example
 * const taskId = resolveTaskId(task, 'prpl-popover-hello-world');
 * // Returns: 'hello-world' (from task.slug or task.prpl_provider.slug)
 */
function resolveTaskId(task, popoverId = null) {
  if (!task && !popoverId) {
    return null;
  }
  if (task?.slug) {
    return task.slug;
  }
  if (task?.prpl_provider?.slug) {
    return task.prpl_provider.slug;
  }
  return popoverId || null;
}

/***/ }),

/***/ "./assets/src/utils/taskUtils/index.js":
/*!*********************************************!*\
  !*** ./assets/src/utils/taskUtils/index.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getTaskPoints: () => (/* binding */ getTaskPoints)
/* harmony export */ });
/* harmony import */ var _services_taskRegistry__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../services/taskRegistry */ "./assets/src/services/taskRegistry.js");
/**
 * Task utility functions.
 */



/**
 * Get points for a task.
 *
 * Points are retrieved in this order:
 * 1. From prpl_points in REST response (PHP providers set this)
 * 2. From provider instance's getPoints() method (for dynamic calculation)
 * 3. From static points property on React provider class
 * 4. Default to 1 point
 *
 * @param {Object} task The task object.
 * @return {number} The points value.
 */
function getTaskPoints(task) {
  // 1. Use prpl_points from REST if available (PHP provider)
  if (task.prpl_points !== undefined && task.prpl_points !== null) {
    return parseInt(task.prpl_points, 10) || 0;
  }

  // 2. Get from React provider class via registry
  const providerId = task.prpl_provider?.slug;
  if (providerId) {
    const TaskClass = (0,_services_taskRegistry__WEBPACK_IMPORTED_MODULE_0__.getTaskProviderClass)(providerId);
    if (TaskClass) {
      // Try provider instance's getPoints() method for dynamic calculation
      const instance = (0,_services_taskRegistry__WEBPACK_IMPORTED_MODULE_0__.getTaskProviderInstance)(providerId);
      if (instance && typeof instance.getPoints === 'function') {
        return instance.getPoints(task);
      }

      // Fall back to static points property
      if (TaskClass.points !== undefined) {
        return TaskClass.points;
      }
    }
  }

  // 3. Default to 1 point for unknown tasks
  return 1;
}

/***/ }),

/***/ "./assets/src/widgets/SuggestedTasks/LoadMoreButton.js":
/*!*************************************************************!*\
  !*** ./assets/src/widgets/SuggestedTasks/LoadMoreButton.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ LoadMoreButton)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _styles__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./styles */ "./assets/src/widgets/SuggestedTasks/styles.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__);
/**
 * LoadMoreButton Component
 *
 * Button to load more tasks or collapse back to initial view.
 */




/**
 * LoadMoreButton component.
 *
 * Shows "Load more tasks" when there are more tasks to show,
 * or "Show top 5" when at the end of the list and expanded.
 *
 * @param {Object}   props             - Component props.
 * @param {boolean}  props.hasMore     - Whether there are more tasks to show.
 * @param {boolean}  props.canCollapse - Whether the list can be collapsed.
 * @param {Function} props.onLoadMore  - Handler to load more tasks.
 * @param {Function} props.onCollapse  - Handler to collapse the list.
 * @return {JSX.Element|null} The LoadMoreButton component or null.
 */

function LoadMoreButton({
  hasMore,
  canCollapse,
  onLoadMore,
  onCollapse
}) {
  if (hasMore) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("p", {
      className: "prpl-show-all-tasks",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("button", {
        type: "button",
        id: "prpl-load-more-recommendations",
        className: "prpl-toggle-all-recommendations-button",
        style: _styles__WEBPACK_IMPORTED_MODULE_1__.STYLES.toggleButton,
        onClick: onLoadMore,
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Load more tasks', 'progress-planner')
      })
    });
  }
  if (canCollapse) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("p", {
      className: "prpl-show-all-tasks",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("button", {
        type: "button",
        id: "prpl-collapse-recommendations",
        className: "prpl-toggle-all-recommendations-button",
        style: _styles__WEBPACK_IMPORTED_MODULE_1__.STYLES.toggleButton,
        onClick: onCollapse,
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Show top 5', 'progress-planner')
      })
    });
  }
  return null;
}

/***/ }),

/***/ "./assets/src/widgets/SuggestedTasks/PopoverManager.js":
/*!*************************************************************!*\
  !*** ./assets/src/widgets/SuggestedTasks/PopoverManager.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PopoverManager)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _hooks_usePopoverHooks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../hooks/usePopoverHooks */ "./assets/src/hooks/usePopoverHooks/index.js");
/* harmony import */ var _hooks_useCustomSubmitHandlers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../hooks/useCustomSubmitHandlers */ "./assets/src/hooks/useCustomSubmitHandlers/index.js");
/* harmony import */ var _utils_taskIdResolver__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../utils/taskIdResolver */ "./assets/src/utils/taskIdResolver/index.js");
/* harmony import */ var _components_Popovers_popoverRegistry__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../components/Popovers/popoverRegistry */ "./assets/src/components/Popovers/popoverRegistry.js");
/* harmony import */ var _components_Popovers_PopoverLoadingState__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../components/Popovers/PopoverLoadingState */ "./assets/src/components/Popovers/PopoverLoadingState.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__);
/**
 * Popover Manager Component.
 *
 * Manages React popover components using @wordpress/hooks for communication.
 * Listens for popover open/close events and renders the appropriate React component.
 *
 * @param {Object}   props            Component props.
 * @param {Function} props.onComplete Callback for completing a task.
 * @param {Object}   props.config     Widget configuration.
 * @return {JSX.Element} The popover manager component.
 */








function PopoverManager({
  onComplete,
  config = {}
}) {
  const [openPopoverId, setOpenPopoverId] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [openTask, setOpenTask] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);

  /**
   * Handle popover open event.
   *
   * @param {string} taskId The task ID.
   * @param {Object} task   The task object.
   */
  const handlePopoverOpen = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)((taskId, task) => {
    if (!taskId || !task) {
      // eslint-disable-next-line no-console
      console.warn('PopoverManager: Invalid popover open event - missing taskId or task');
      return;
    }
    setOpenPopoverId(taskId);
    setOpenTask(task);
  }, []);

  /**
   * Handle popover close event.
   *
   * @param {string} taskId The task ID to close.
   */
  const handlePopoverClose = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(taskId => {
    // Only close if the task ID matches the currently open popover
    if (taskId === openPopoverId || !taskId) {
      setOpenPopoverId(null);
      setOpenTask(null);
    }
  }, [openPopoverId]);

  // Set up WordPress hooks for popover communication
  (0,_hooks_usePopoverHooks__WEBPACK_IMPORTED_MODULE_1__.usePopoverHooks)(handlePopoverOpen, handlePopoverClose);

  /**
   * Handle popover form submission completion.
   *
   * @param {string|number} taskId The task ID.
   * @param {Object}        task   The task object.
   */
  const handlePopoverSubmit = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(async (taskId, task) => {
    if (!onComplete) {
      // eslint-disable-next-line no-console
      console.warn('PopoverManager: onComplete callback not provided');
      return;
    }
    try {
      const finalTaskId = task?.id || taskId;
      if (!finalTaskId) {
        throw new Error('Invalid task ID for submission');
      }
      await onComplete(finalTaskId, task);
      setOpenPopoverId(null);
      setOpenTask(null);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('PopoverManager: Error submitting popover form:', error);
      // Don't close popover on error - let user retry
    }
  }, [onComplete]);

  // Get custom submit handler for the current task
  const handleCustomSubmit = (0,_hooks_useCustomSubmitHandlers__WEBPACK_IMPORTED_MODULE_2__.useCustomSubmitHandlers)(openTask);

  // Resolve task ID for popover lookup
  const taskIdForLookup = (0,_utils_taskIdResolver__WEBPACK_IMPORTED_MODULE_3__.resolveTaskId)(openTask, openPopoverId);

  // Get the popover component for the open popover
  const PopoverComponent = taskIdForLookup ? (0,_components_Popovers_popoverRegistry__WEBPACK_IMPORTED_MODULE_4__.getPopoverComponent)(taskIdForLookup) : null;

  // Error handling: If we have a task but no component, log a warning
  if (openTask && !PopoverComponent) {
    // eslint-disable-next-line no-console
    console.warn('PopoverManager: No popover component found for task ID:', taskIdForLookup);
    return null;
  }

  // Render the popover if one is open and component is found
  if (!PopoverComponent || !openTask) {
    return null;
  }

  // Wrap in Suspense for lazy-loaded popover components
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Suspense, {
    fallback: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_components_Popovers_PopoverLoadingState__WEBPACK_IMPORTED_MODULE_5__["default"], {}),
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(PopoverComponent, {
      task: openTask,
      onSubmit: handlePopoverSubmit,
      onClose: () => handlePopoverClose(openPopoverId),
      onCustomSubmit: handleCustomSubmit,
      config: config
    })
  });
}

/***/ }),

/***/ "./assets/src/widgets/SuggestedTasks/SuggestedTasksSkeleton.js":
/*!*********************************************************************!*\
  !*** ./assets/src/widgets/SuggestedTasks/SuggestedTasksSkeleton.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ SuggestedTasksSkeleton)
/* harmony export */ });
/* harmony import */ var _components_TaskItem_TaskItemSkeleton__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../components/TaskItem/TaskItemSkeleton */ "./assets/src/components/TaskItem/TaskItemSkeleton.js");
/* harmony import */ var _components_Skeleton__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../components/Skeleton */ "./assets/src/components/Skeleton/index.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__);
/**
 * SuggestedTasks Skeleton Component
 *
 * Skeleton loading state for the SuggestedTasks widget.
 * Composes: TaskListSkeleton
 */




/**
 * SuggestedTasksSkeleton component.
 *
 * @param {Object} props       - Component props.
 * @param {number} props.count - Number of task skeletons to show.
 * @return {JSX.Element} The SuggestedTasksSkeleton component.
 */

function SuggestedTasksSkeleton({
  count = 4
}) {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
      style: {
        marginBottom: '1rem'
      },
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_components_Skeleton__WEBPACK_IMPORTED_MODULE_1__.SkeletonText, {
        lines: 2
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_components_TaskItem_TaskItemSkeleton__WEBPACK_IMPORTED_MODULE_0__.TaskListSkeleton, {
      count: count
    })]
  });
}

/***/ }),

/***/ "./assets/src/widgets/SuggestedTasks/TaskList.js":
/*!*******************************************************!*\
  !*** ./assets/src/widgets/SuggestedTasks/TaskList.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _components_TaskItem__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../components/TaskItem */ "./assets/src/components/TaskItem/index.js");
/* harmony import */ var _components_TaskItem_TaskItemSkeleton__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../components/TaskItem/TaskItemSkeleton */ "./assets/src/components/TaskItem/TaskItemSkeleton.js");
/* harmony import */ var _styles__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./styles */ "./assets/src/widgets/SuggestedTasks/styles.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__);
/**
 * TaskList Component
 *
 * Renders the list of suggested tasks with support for celebration animations
 * and skeleton placeholders for progressive loading.
 */






/**
 * TaskList component.
 *
 * @param {Object}   props                    - Component props.
 * @param {Array}    props.tasks              - Array of task objects.
 * @param {Set}      props.celebratingTaskIds - Set of task IDs currently celebrating.
 * @param {number}   props.skeletonCount      - Number of skeleton placeholders to show.
 * @param {Function} props.onComplete         - Handler for task completion.
 * @param {Function} props.onSnooze           - Handler for task snooze.
 * @param {Function} props.onDelete           - Handler for task deletion.
 * @param {Function} props.onMove             - Handler for task reordering.
 * @param {Function} props.onTitleChange      - Handler for task title change.
 * @param {Object}   ref                      - Forwarded ref for the list element.
 * @return {JSX.Element} The TaskList component.
 */

const TaskList = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.forwardRef)(function TaskList({
  tasks,
  celebratingTaskIds,
  skeletonCount = 0,
  onComplete,
  onSnooze,
  onDelete,
  onMove,
  onTitleChange
}, ref) {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("ul", {
    id: "prpl-suggested-tasks-list",
    className: "prpl-suggested-tasks-list",
    style: _styles__WEBPACK_IMPORTED_MODULE_3__.STYLES.list,
    ref: ref,
    children: [tasks.map((task, index) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components_TaskItem__WEBPACK_IMPORTED_MODULE_1__["default"], {
      task: task,
      index: index,
      isUserTask: task.prpl_provider?.slug === 'user',
      isCelebrating: celebratingTaskIds.has(task.id),
      onComplete: onComplete,
      onSnooze: onSnooze,
      onDelete: onDelete,
      onMove: onMove,
      onTitleChange: onTitleChange
    }, task.id)), skeletonCount > 0 && Array(skeletonCount).fill(0).map((_, i) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components_TaskItem_TaskItemSkeleton__WEBPACK_IMPORTED_MODULE_2__["default"], {
      index: tasks.length + i
    }, `skeleton-${i}`))]
  });
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (TaskList);

/***/ }),

/***/ "./assets/src/widgets/SuggestedTasks/index.js":
/*!****************************************************!*\
  !*** ./assets/src/widgets/SuggestedTasks/index.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/hooks */ "@wordpress/hooks");
/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_hooks__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _PopoverManager__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./PopoverManager */ "./assets/src/widgets/SuggestedTasks/PopoverManager.js");
/* harmony import */ var _TaskList__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./TaskList */ "./assets/src/widgets/SuggestedTasks/TaskList.js");
/* harmony import */ var _LoadMoreButton__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./LoadMoreButton */ "./assets/src/widgets/SuggestedTasks/LoadMoreButton.js");
/* harmony import */ var _styles__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./styles */ "./assets/src/widgets/SuggestedTasks/styles.js");
/* harmony import */ var _hooks_useTasksApi__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../hooks/useTasksApi */ "./assets/src/hooks/useTasksApi/index.js");
/* harmony import */ var _hooks_useGridMasonry__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../hooks/useGridMasonry */ "./assets/src/hooks/useGridMasonry/index.js");
/* harmony import */ var _hooks_useCelebration__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../hooks/useCelebration */ "./assets/src/hooks/useCelebration/index.js");
/* harmony import */ var _utils_gridResize__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../utils/gridResize */ "./assets/src/utils/gridResize/index.js");
/* harmony import */ var _utils_taskUtils__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../utils/taskUtils */ "./assets/src/utils/taskUtils/index.js");
/* harmony import */ var _components_WidgetHeader__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../components/WidgetHeader */ "./assets/src/components/WidgetHeader/index.js");
/* harmony import */ var _SuggestedTasksSkeleton__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./SuggestedTasksSkeleton */ "./assets/src/widgets/SuggestedTasks/SuggestedTasksSkeleton.js");
/* harmony import */ var _services_taskRegistry__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../services/taskRegistry */ "./assets/src/services/taskRegistry.js");
/* harmony import */ var _stores_dashboardStore__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../../stores/dashboardStore */ "./assets/src/stores/dashboardStore.js");
/* harmony import */ var _tasks__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../../tasks */ "./assets/src/tasks/index.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_17___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__);
/**
 * Suggested Tasks Widget Component.
 *
 * Displays a list of suggested tasks (recommendations) for improving the site.
 * Uses lazy evaluation to load tasks on-demand for better performance.
 */


















// Import task registrations (tasks will self-register on import).


// Configuration constants for task limiting

const TASKS_INITIAL_LIMIT = 5;
const TASKS_LOAD_INCREMENT = 5;

/**
 * Suggested Tasks widget component.
 *
 * @param {Object} props        - Component props.
 * @param {Object} props.config - Widget configuration.
 * @return {JSX.Element} The widget component.
 */
function SuggestedTasks({
  config = {}
}) {
  const [tasks, setTasks] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const [isLoading, setIsLoading] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(true);
  const [visibleTaskLimit, setVisibleTaskLimit] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(TASKS_INITIAL_LIMIT);
  const [celebratingTaskIds, setCelebratingTaskIds] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(new Set());
  const [hasMoreToEvaluate, setHasMoreToEvaluate] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(true);
  const listRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const tasksMapRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(new Map()); // Map of task ID to task object for quick lookup
  const evaluatedCountRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(0); // Track how many tasks we've evaluated and added

  // Derive visible tasks and button states
  const visibleTasks = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    return tasks.slice(0, visibleTaskLimit);
  }, [tasks, visibleTaskLimit]);

  // Calculate skeleton count for progressive loading
  // Show skeletons only when we have tasks but haven't filled the initial limit yet
  const skeletonCount = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    if (isLoading || !hasMoreToEvaluate) {
      return 0;
    }
    return Math.max(0, TASKS_INITIAL_LIMIT - visibleTasks.length);
  }, [isLoading, hasMoreToEvaluate, visibleTasks.length]);
  const hasMoreTasks = hasMoreToEvaluate || tasks.length > visibleTaskLimit;
  const isShowingAll = visibleTaskLimit >= tasks.length && !hasMoreToEvaluate;
  const canCollapse = visibleTaskLimit > TASKS_INITIAL_LIMIT && isShowingAll && tasks.length > TASKS_INITIAL_LIMIT;

  // Initialize grid masonry layout.
  (0,_hooks_useGridMasonry__WEBPACK_IMPORTED_MODULE_8__.useGridMasonry)();

  // Get celebration functions.
  const {
    celebrate
  } = (0,_hooks_useCelebration__WEBPACK_IMPORTED_MODULE_9__.useCelebration)();

  // Get onTaskCompleted from Zustand store for cross-widget communication.
  const onTaskCompleted = (0,_stores_dashboardStore__WEBPACK_IMPORTED_MODULE_15__.useDashboardStore)(state => state.onTaskCompleted);

  /**
   * Insert task in sorted position by priority.
   *
   * @param {Array}  currentTasks Current tasks array.
   * @param {Object} newTask      New task to insert.
   * @param {number} priority     Task priority (lower = higher priority).
   * @return {Array} New tasks array with task inserted in sorted position.
   */
  const insertTaskSorted = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)((currentTasks, newTask, priority) => {
    // Skip if task already exists
    if (tasksMapRef.current.has(newTask.id)) {
      return currentTasks;
    }

    // Add to map
    tasksMapRef.current.set(newTask.id, newTask);

    // Find insertion point (tasks are sorted by priority ascending)
    let insertIndex = currentTasks.length;
    for (let i = 0; i < currentTasks.length; i++) {
      const taskPriority = currentTasks[i].prpl_priority !== undefined ? currentTasks[i].prpl_priority : 50;
      if (priority < taskPriority) {
        insertIndex = i;
        break;
      }
    }

    // Insert task
    const newTasks = [...currentTasks];
    newTasks.splice(insertIndex, 0, newTask);
    return newTasks;
  }, []);

  /**
   * Generate task actions if missing.
   *
   * @param {Object} taskData Task data from the API.
   * @return {Object} Task data with actions populated if missing.
   */
  const ensureTaskActions = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(taskData => {
    // If actions are already provided, return as-is.
    if (taskData.prpl_task_actions && taskData.prpl_task_actions.length > 0) {
      return taskData;
    }

    // Try to generate actions from the task provider.
    let providerId = taskData.prpl_provider?.slug || taskData.provider_id || taskData.meta?.provider_id || '';

    // Fallback: Use task slug as provider ID
    if (!providerId && taskData.slug) {
      providerId = taskData.slug;
    }

    // Fallback: Try to get provider from embedded taxonomy terms
    if (!providerId && taskData.prpl_recommendations_provider && Array.isArray(taskData.prpl_recommendations_provider)) {
      const firstItem = taskData.prpl_recommendations_provider[0];
      if (firstItem && typeof firstItem === 'object' && firstItem.slug) {
        providerId = firstItem.slug;
      } else if (typeof firstItem === 'number' && taskData._embedded && taskData._embedded['wp:term'] && taskData._embedded['wp:term'][0]) {
        const embeddedTerms = taskData._embedded['wp:term'].flat();
        const term = embeddedTerms.find(t => t && t.taxonomy === 'prpl_recommendations_provider' && t.id === firstItem);
        if (term && term.slug) {
          providerId = term.slug;
        }
      }
    }
    if (!providerId) {
      return taskData;
    }
    const providerInstance = (0,_services_taskRegistry__WEBPACK_IMPORTED_MODULE_14__.getTaskProviderInstance)(providerId);
    if (!providerInstance || !providerInstance.getTaskActions) {
      return taskData;
    }
    try {
      const actions = providerInstance.getTaskActions(taskData);
      if (actions && actions.length > 0) {
        return {
          ...taskData,
          prpl_task_actions: actions
        };
      }
    } catch (error) {
      console.error(`Error generating actions for task provider "${providerId}":`, error);
    }
    return taskData;
  }, []);

  /**
   * Add a task to the state.
   *
   * @param {Object} taskData Task data.
   * @param {number} priority Task priority.
   */
  const addTask = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)((taskData, priority) => {
    // Skip if already in state
    if (tasksMapRef.current.has(taskData.id)) {
      return;
    }

    // Add priority to task data if not present
    if (taskData.prpl_priority === undefined) {
      taskData.prpl_priority = priority;
    }

    // Ensure task actions are generated
    const taskWithActions = ensureTaskActions(taskData);

    // Insert in sorted position
    setTasks(prev => insertTaskSorted(prev, taskWithActions, priority));
    evaluatedCountRef.current++;
  }, [ensureTaskActions, insertTaskSorted]);

  /**
   * Evaluate more tasks until we have enough.
   *
   * @param {number} targetCount Target number of tasks needed.
   * @return {Promise<void>}
   */
  const evaluateMoreTasks = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(async targetCount => {
    if (!(0,_services_taskRegistry__WEBPACK_IMPORTED_MODULE_14__.hasMoreTasksToEvaluate)()) {
      setHasMoreToEvaluate(false);
      return;
    }
    const needed = targetCount - evaluatedCountRef.current;
    if (needed <= 0) {
      return;
    }
    const result = await (0,_services_taskRegistry__WEBPACK_IMPORTED_MODULE_14__.evaluateTasksUntil)(needed, addTask);
    setHasMoreToEvaluate(!result.complete);
  }, [addTask]);

  /**
   * Fetch a replacement task after completing/snoozing/deleting.
   * Uses lazy evaluation to get the next task if available.
   *
   * @return {Promise<void>}
   */
  const fetchAndInsertReplacementTask = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(async () => {
    // First, check if we have buffered tasks ready
    const bufferSize = (0,_services_taskRegistry__WEBPACK_IMPORTED_MODULE_14__.getBufferSize)();
    const currentBuffer = tasks.length - visibleTaskLimit;

    // If buffer is depleted and more tasks are available, evaluate more
    if (currentBuffer <= 0 && hasMoreToEvaluate) {
      await evaluateMoreTasks(evaluatedCountRef.current + bufferSize + 1);
    }
  }, [tasks.length, visibleTaskLimit, hasMoreToEvaluate, evaluateMoreTasks]);

  /**
   * Initialize tasks with lazy evaluation.
   */
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    let mounted = true;
    async function initializeTasks() {
      setIsLoading(true);

      // Handle pending celebration tasks first
      if (!config?.delayCelebration) {
        try {
          const pendingResult = await (0,_hooks_useTasksApi__WEBPACK_IMPORTED_MODULE_7__.fetchTasks)({
            status: 'pending',
            perPage: 100,
            excludeProvider: 'user',
            needsPagination: false
          });
          if (pendingResult.tasks.length > 0 && mounted) {
            // Add pending tasks to the list
            pendingResult.tasks.forEach(task => {
              addTask(task, task.prpl_priority || 50);
            });

            // Trash the pending tasks in the background
            pendingResult.tasks.forEach(task => {
              (0,_hooks_useTasksApi__WEBPACK_IMPORTED_MODULE_7__.completeTask)(task.id).catch(() => {});
            });

            // Trigger celebration after 3 seconds
            setTimeout(() => {
              if (!mounted) {
                return;
              }
              const pendingIds = new Set(pendingResult.tasks.map(t => t.id));
              setCelebratingTaskIds(pendingIds);
              celebrate(listRef.current);

              // Remove celebrated tasks after animation
              setTimeout(() => {
                if (!mounted) {
                  return;
                }
                setTasks(prev => prev.filter(t => !pendingIds.has(t.id)));
                pendingIds.forEach(id => {
                  tasksMapRef.current.delete(id);
                  evaluatedCountRef.current--;
                });
                setCelebratingTaskIds(new Set());
                (0,_utils_gridResize__WEBPACK_IMPORTED_MODULE_10__.dispatchGridResize)();
              }, 2000);
            }, 3000);
          }
        } catch {
          // Continue with evaluation even if pending fetch fails
        }
      }

      // Evaluate tasks lazily until we have initial + buffer
      const targetCount = TASKS_INITIAL_LIMIT + (0,_services_taskRegistry__WEBPACK_IMPORTED_MODULE_14__.getBufferSize)();
      let firstTaskShown = false;
      const result = await (0,_services_taskRegistry__WEBPACK_IMPORTED_MODULE_14__.evaluateTasksUntil)(targetCount, (taskData, priority) => {
        if (mounted) {
          addTask(taskData, priority);

          // Show widget after first task instead of waiting for all
          if (!firstTaskShown) {
            firstTaskShown = true;
            setIsLoading(false);
            (0,_utils_gridResize__WEBPACK_IMPORTED_MODULE_10__.dispatchGridResize)(100);
          }
        }
      });
      if (mounted) {
        setHasMoreToEvaluate(!result.complete);
        // Only set loading false here if no tasks were found at all
        if (!firstTaskShown) {
          setIsLoading(false);
          (0,_utils_gridResize__WEBPACK_IMPORTED_MODULE_10__.dispatchGridResize)(100);
        }
      }
    }
    initializeTasks();
    return () => {
      mounted = false;
    };
  }, [config, celebrate, addTask]);

  /**
   * Handle task completion.
   *
   * @param {number} postId The post ID.
   * @param {Object} task   The task object.
   */
  const handleComplete = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(async (postId, task) => {
    try {
      // Add to celebrating set.
      setCelebratingTaskIds(prev => new Set([...prev, postId]));

      // Update task status via API.
      await (0,_hooks_useTasksApi__WEBPACK_IMPORTED_MODULE_7__.completeTask)(postId);

      // Send analytics action.
      (0,_hooks_useTasksApi__WEBPACK_IMPORTED_MODULE_7__.sendTaskAction)(postId, 'complete');

      // Get task points.
      const eventPoints = (0,_utils_taskUtils__WEBPACK_IMPORTED_MODULE_11__.getTaskPoints)(task);

      // Notify context about task completion (for cross-widget updates).
      if (eventPoints > 0) {
        onTaskCompleted(task, eventPoints);
      }

      // Trigger celebration confetti.
      if (eventPoints > 0 && listRef.current) {
        const taskElement = listRef.current.querySelector(`[data-post-id="${postId}"]`);
        celebrate(taskElement);
      }

      // Remove task after animation delay.
      setTimeout(async () => {
        setTasks(prev => prev.filter(t => t.id !== postId));
        tasksMapRef.current.delete(postId);
        setCelebratingTaskIds(prev => {
          const next = new Set(prev);
          next.delete(postId);
          return next;
        });

        // Evaluate more tasks to refill buffer.
        await fetchAndInsertReplacementTask();

        // Trigger grid resize.
        (0,_utils_gridResize__WEBPACK_IMPORTED_MODULE_10__.dispatchGridResize)();
      }, 2000);
    } catch {
      // Remove from celebrating on error.
      setCelebratingTaskIds(prev => {
        const next = new Set(prev);
        next.delete(postId);
        return next;
      });
    }
  }, [celebrate, fetchAndInsertReplacementTask, onTaskCompleted]);

  /**
   * Handle task snooze.
   *
   * @param {number} postId   The post ID.
   * @param {string} duration The snooze duration.
   */
  const handleSnooze = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(async (postId, duration) => {
    try {
      await (0,_hooks_useTasksApi__WEBPACK_IMPORTED_MODULE_7__.snoozeTask)(postId, duration);

      // Remove task from list.
      setTasks(prev => prev.filter(t => t.id !== postId));
      tasksMapRef.current.delete(postId);

      // Evaluate more tasks to refill buffer.
      await fetchAndInsertReplacementTask();

      // Trigger grid resize.
      (0,_utils_gridResize__WEBPACK_IMPORTED_MODULE_10__.dispatchGridResize)();
    } catch {
      // Error handled silently.
    }
  }, [fetchAndInsertReplacementTask]);

  /**
   * Handle task deletion.
   *
   * @param {number} postId The post ID.
   */
  const handleDelete = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(async postId => {
    try {
      await (0,_hooks_useTasksApi__WEBPACK_IMPORTED_MODULE_7__.deleteTask)(postId);

      // Send analytics action.
      (0,_hooks_useTasksApi__WEBPACK_IMPORTED_MODULE_7__.sendTaskAction)(postId, 'delete');

      // Remove task from list.
      setTasks(prev => prev.filter(t => t.id !== postId));
      tasksMapRef.current.delete(postId);

      // Evaluate more tasks to refill buffer.
      await fetchAndInsertReplacementTask();

      // Trigger grid resize.
      (0,_utils_gridResize__WEBPACK_IMPORTED_MODULE_10__.dispatchGridResize)(500);
    } catch {
      // Error handled silently.
    }
  }, [fetchAndInsertReplacementTask]);

  /**
   * Handle task title change (for user tasks).
   *
   * @param {number} postId   The post ID.
   * @param {string} newTitle The new title.
   */
  const handleTitleChange = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(async (postId, newTitle) => {
    try {
      await (0,_hooks_useTasksApi__WEBPACK_IMPORTED_MODULE_7__.updateTask)(postId, {
        title: newTitle
      });
    } catch {
      // Error handled silently.
    }
  }, []);

  /**
   * Handle task move (for user tasks).
   *
   * @param {number} postId    The post ID.
   * @param {string} direction The direction ('up' or 'down').
   */
  const handleMove = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(async (postId, direction) => {
    const currentIndex = tasks.findIndex(t => t.id === postId);
    if (currentIndex === -1) {
      return;
    }
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= tasks.length) {
      return;
    }

    // Reorder tasks in state.
    const newTasks = [...tasks];
    const [movedTask] = newTasks.splice(currentIndex, 1);
    newTasks.splice(newIndex, 0, movedTask);
    setTasks(newTasks);

    // Update menu_order for all affected tasks.
    newTasks.forEach((task, index) => {
      (0,_hooks_useTasksApi__WEBPACK_IMPORTED_MODULE_7__.updateTask)(task.id, {
        menu_order: index
      }).catch(() => {});
    });
  }, [tasks]);

  /**
   * Handle load more button click.
   * Shows more tasks and evaluates more if needed.
   */
  const handleLoadMore = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(async () => {
    const newLimit = visibleTaskLimit + TASKS_LOAD_INCREMENT;
    setVisibleTaskLimit(newLimit);

    // Evaluate more tasks if needed to fill buffer
    const bufferSize = (0,_services_taskRegistry__WEBPACK_IMPORTED_MODULE_14__.getBufferSize)();
    const targetCount = newLimit + bufferSize;
    if (evaluatedCountRef.current < targetCount && hasMoreToEvaluate) {
      await evaluateMoreTasks(targetCount);
    }

    // Trigger grid resize after showing more tasks
    (0,_utils_gridResize__WEBPACK_IMPORTED_MODULE_10__.dispatchGridResize)(100);
  }, [visibleTaskLimit, hasMoreToEvaluate, evaluateMoreTasks]);

  /**
   * Handle collapse button click.
   * Resets the visible task limit to show only the initial tasks.
   */
  const handleCollapse = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    setVisibleTaskLimit(TASKS_INITIAL_LIMIT);
    // Trigger grid resize after collapsing
    (0,_utils_gridResize__WEBPACK_IMPORTED_MODULE_10__.dispatchGridResize)(100);
  }, []);

  /**
   * Decode HTML entities in a string.
   *
   * @param {string} str The string to decode.
   * @return {string} The decoded string.
   */
  const decodeHtmlEntities = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(str => {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = str;
    return textarea.value;
  }, []);

  // Get title and description from config or use defaults.
  const widgetTitle = decodeHtmlEntities(config?.title || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.sprintf)(/* translators: %s: Ravi's name. */
  (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("%s's Recommendations", 'progress-planner'), config?.raviName || 'Ravi'));
  const widgetDescription = decodeHtmlEntities(config?.description || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.sprintf)(/* translators: %s: Ravi's name. */
  (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Complete a task from %s's Recommendations to improve your site and earn points toward this month's badge!", 'progress-planner'), config?.raviName || 'Ravi'));

  // Show loading state.
  if (isLoading) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__.Fragment, {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__.jsx)(_components_WidgetHeader__WEBPACK_IMPORTED_MODULE_12__["default"], {
        title: widgetTitle
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__.jsx)(_SuggestedTasksSkeleton__WEBPACK_IMPORTED_MODULE_13__["default"], {
        count: 4
      })]
    });
  }

  // Show empty state.
  if (tasks.length === 0 && !hasMoreToEvaluate) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__.Fragment, {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__.jsx)(_components_WidgetHeader__WEBPACK_IMPORTED_MODULE_12__["default"], {
        title: widgetTitle
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__.jsx)("p", {
        className: "prpl-suggested-tasks-widget-description",
        children: widgetDescription
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__.jsx)("ul", {
        id: "prpl-suggested-tasks-list",
        className: "prpl-suggested-tasks-list",
        style: _styles__WEBPACK_IMPORTED_MODULE_6__.STYLES.list,
        ref: listRef
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxs)("p", {
        className: "prpl-no-suggested-tasks",
        style: _styles__WEBPACK_IMPORTED_MODULE_6__.STYLES.empty,
        children: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('You have completed all recommended tasks.', 'progress-planner'), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__.jsx)("br", {}), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Check back later for new tasks!', 'progress-planner')]
      })]
    });
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__.jsx)(_components_WidgetHeader__WEBPACK_IMPORTED_MODULE_12__["default"], {
      title: widgetTitle
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__.jsx)("p", {
      className: "prpl-suggested-tasks-widget-description",
      children: widgetDescription
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__.jsx)(_PopoverManager__WEBPACK_IMPORTED_MODULE_3__["default"], {
      onComplete: handleComplete,
      config: config
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__.jsx)("ul", {
      style: _styles__WEBPACK_IMPORTED_MODULE_6__.STYLES.hiddenList
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__.jsx)(_TaskList__WEBPACK_IMPORTED_MODULE_4__["default"], {
      ref: listRef,
      tasks: visibleTasks,
      celebratingTaskIds: celebratingTaskIds,
      skeletonCount: skeletonCount,
      onComplete: handleComplete,
      onSnooze: handleSnooze,
      onDelete: handleDelete,
      onMove: handleMove,
      onTitleChange: handleTitleChange
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__.jsx)(_LoadMoreButton__WEBPACK_IMPORTED_MODULE_5__["default"], {
      hasMore: hasMoreTasks,
      canCollapse: canCollapse,
      onLoadMore: handleLoadMore,
      onCollapse: handleCollapse
    })]
  });
}

// Register widget via hook with metadata
(0,_wordpress_hooks__WEBPACK_IMPORTED_MODULE_2__.doAction)('prpl.dashboard.registerWidget', {
  id: 'suggested-tasks',
  component: SuggestedTasks,
  priority: 1,
  width: 2,
  forceLastColumn: false,
  title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Ravi's Recommendations", 'progress-planner'),
  infoIconSvg: ''
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SuggestedTasks);

/***/ }),

/***/ "./assets/src/widgets/SuggestedTasks/styles.js":
/*!*****************************************************!*\
  !*** ./assets/src/widgets/SuggestedTasks/styles.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   STYLES: () => (/* binding */ STYLES)
/* harmony export */ });
/**
 * Suggested Tasks Widget Styles
 *
 * Extracted style constants to prevent recreation on each render.
 */

const STYLES = {
  list: {
    listStyle: 'none',
    padding: 0,
    margin: '0 0 var(--prpl-padding) 0'
  },
  loading: {
    display: 'block',
    backgroundColor: 'var(--prpl-background-activity)',
    padding: 'calc(var(--prpl-padding) / 2)'
  },
  empty: {
    display: 'block',
    backgroundColor: 'var(--prpl-background-activity)',
    padding: 'calc(var(--prpl-padding) / 2)'
  },
  toggleButton: {
    background: 'none',
    border: 'none',
    padding: 0,
    color: 'var(--prpl-color-link)',
    textDecoration: 'underline',
    cursor: 'pointer',
    fontSize: 'inherit',
    fontFamily: 'inherit'
  },
  hiddenList: {
    display: 'none'
  }
};

/***/ }),

/***/ "./node_modules/canvas-confetti/dist/confetti.module.mjs":
/*!***************************************************************!*\
  !*** ./node_modules/canvas-confetti/dist/confetti.module.mjs ***!
  \***************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   create: () => (/* binding */ create),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// canvas-confetti v1.9.4 built on 2025-10-25T05:14:56.640Z
var module = {};

// source content
/* globals Map */

(function main(global, module, isWorker, workerSize) {
  var canUseWorker = !!(
    global.Worker &&
    global.Blob &&
    global.Promise &&
    global.OffscreenCanvas &&
    global.OffscreenCanvasRenderingContext2D &&
    global.HTMLCanvasElement &&
    global.HTMLCanvasElement.prototype.transferControlToOffscreen &&
    global.URL &&
    global.URL.createObjectURL);

  var canUsePaths = typeof Path2D === 'function' && typeof DOMMatrix === 'function';
  var canDrawBitmap = (function () {
    // this mostly supports ssr
    if (!global.OffscreenCanvas) {
      return false;
    }

    try {
      var canvas = new OffscreenCanvas(1, 1);
      var ctx = canvas.getContext('2d');
      ctx.fillRect(0, 0, 1, 1);
      var bitmap = canvas.transferToImageBitmap();
      ctx.createPattern(bitmap, 'no-repeat');
    } catch (e) {
      return false;
    }

    return true;
  })();

  function noop() {}

  // create a promise if it exists, otherwise, just
  // call the function directly
  function promise(func) {
    var ModulePromise = module.exports.Promise;
    var Prom = ModulePromise !== void 0 ? ModulePromise : global.Promise;

    if (typeof Prom === 'function') {
      return new Prom(func);
    }

    func(noop, noop);

    return null;
  }

  var bitmapMapper = (function (skipTransform, map) {
    // see https://github.com/catdad/canvas-confetti/issues/209
    // creating canvases is actually pretty expensive, so we should create a
    // 1:1 map for bitmap:canvas, so that we can animate the confetti in
    // a performant manner, but also not store them forever so that we don't
    // have a memory leak
    return {
      transform: function(bitmap) {
        if (skipTransform) {
          return bitmap;
        }

        if (map.has(bitmap)) {
          return map.get(bitmap);
        }

        var canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
        var ctx = canvas.getContext('2d');
        ctx.drawImage(bitmap, 0, 0);

        map.set(bitmap, canvas);

        return canvas;
      },
      clear: function () {
        map.clear();
      }
    };
  })(canDrawBitmap, new Map());

  var raf = (function () {
    var TIME = Math.floor(1000 / 60);
    var frame, cancel;
    var frames = {};
    var lastFrameTime = 0;

    if (typeof requestAnimationFrame === 'function' && typeof cancelAnimationFrame === 'function') {
      frame = function (cb) {
        var id = Math.random();

        frames[id] = requestAnimationFrame(function onFrame(time) {
          if (lastFrameTime === time || lastFrameTime + TIME - 1 < time) {
            lastFrameTime = time;
            delete frames[id];

            cb();
          } else {
            frames[id] = requestAnimationFrame(onFrame);
          }
        });

        return id;
      };
      cancel = function (id) {
        if (frames[id]) {
          cancelAnimationFrame(frames[id]);
        }
      };
    } else {
      frame = function (cb) {
        return setTimeout(cb, TIME);
      };
      cancel = function (timer) {
        return clearTimeout(timer);
      };
    }

    return { frame: frame, cancel: cancel };
  }());

  var getWorker = (function () {
    var worker;
    var prom;
    var resolves = {};

    function decorate(worker) {
      function execute(options, callback) {
        worker.postMessage({ options: options || {}, callback: callback });
      }
      worker.init = function initWorker(canvas) {
        var offscreen = canvas.transferControlToOffscreen();
        worker.postMessage({ canvas: offscreen }, [offscreen]);
      };

      worker.fire = function fireWorker(options, size, done) {
        if (prom) {
          execute(options, null);
          return prom;
        }

        var id = Math.random().toString(36).slice(2);

        prom = promise(function (resolve) {
          function workerDone(msg) {
            if (msg.data.callback !== id) {
              return;
            }

            delete resolves[id];
            worker.removeEventListener('message', workerDone);

            prom = null;

            bitmapMapper.clear();

            done();
            resolve();
          }

          worker.addEventListener('message', workerDone);
          execute(options, id);

          resolves[id] = workerDone.bind(null, { data: { callback: id }});
        });

        return prom;
      };

      worker.reset = function resetWorker() {
        worker.postMessage({ reset: true });

        for (var id in resolves) {
          resolves[id]();
          delete resolves[id];
        }
      };
    }

    return function () {
      if (worker) {
        return worker;
      }

      if (!isWorker && canUseWorker) {
        var code = [
          'var CONFETTI, SIZE = {}, module = {};',
          '(' + main.toString() + ')(this, module, true, SIZE);',
          'onmessage = function(msg) {',
          '  if (msg.data.options) {',
          '    CONFETTI(msg.data.options).then(function () {',
          '      if (msg.data.callback) {',
          '        postMessage({ callback: msg.data.callback });',
          '      }',
          '    });',
          '  } else if (msg.data.reset) {',
          '    CONFETTI && CONFETTI.reset();',
          '  } else if (msg.data.resize) {',
          '    SIZE.width = msg.data.resize.width;',
          '    SIZE.height = msg.data.resize.height;',
          '  } else if (msg.data.canvas) {',
          '    SIZE.width = msg.data.canvas.width;',
          '    SIZE.height = msg.data.canvas.height;',
          '    CONFETTI = module.exports.create(msg.data.canvas);',
          '  }',
          '}',
        ].join('\n');
        try {
          worker = new Worker(URL.createObjectURL(new Blob([code])));
        } catch (e) {
          // eslint-disable-next-line no-console
          typeof console !== 'undefined' && typeof console.warn === 'function' ? console.warn('🎊 Could not load worker', e) : null;

          return null;
        }

        decorate(worker);
      }

      return worker;
    };
  })();

  var defaults = {
    particleCount: 50,
    angle: 90,
    spread: 45,
    startVelocity: 45,
    decay: 0.9,
    gravity: 1,
    drift: 0,
    ticks: 200,
    x: 0.5,
    y: 0.5,
    shapes: ['square', 'circle'],
    zIndex: 100,
    colors: [
      '#26ccff',
      '#a25afd',
      '#ff5e7e',
      '#88ff5a',
      '#fcff42',
      '#ffa62d',
      '#ff36ff'
    ],
    // probably should be true, but back-compat
    disableForReducedMotion: false,
    scalar: 1
  };

  function convert(val, transform) {
    return transform ? transform(val) : val;
  }

  function isOk(val) {
    return !(val === null || val === undefined);
  }

  function prop(options, name, transform) {
    return convert(
      options && isOk(options[name]) ? options[name] : defaults[name],
      transform
    );
  }

  function onlyPositiveInt(number){
    return number < 0 ? 0 : Math.floor(number);
  }

  function randomInt(min, max) {
    // [min, max)
    return Math.floor(Math.random() * (max - min)) + min;
  }

  function toDecimal(str) {
    return parseInt(str, 16);
  }

  function colorsToRgb(colors) {
    return colors.map(hexToRgb);
  }

  function hexToRgb(str) {
    var val = String(str).replace(/[^0-9a-f]/gi, '');

    if (val.length < 6) {
        val = val[0]+val[0]+val[1]+val[1]+val[2]+val[2];
    }

    return {
      r: toDecimal(val.substring(0,2)),
      g: toDecimal(val.substring(2,4)),
      b: toDecimal(val.substring(4,6))
    };
  }

  function getOrigin(options) {
    var origin = prop(options, 'origin', Object);
    origin.x = prop(origin, 'x', Number);
    origin.y = prop(origin, 'y', Number);

    return origin;
  }

  function setCanvasWindowSize(canvas) {
    canvas.width = document.documentElement.clientWidth;
    canvas.height = document.documentElement.clientHeight;
  }

  function setCanvasRectSize(canvas) {
    var rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
  }

  function getCanvas(zIndex) {
    var canvas = document.createElement('canvas');

    canvas.style.position = 'fixed';
    canvas.style.top = '0px';
    canvas.style.left = '0px';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = zIndex;

    return canvas;
  }

  function ellipse(context, x, y, radiusX, radiusY, rotation, startAngle, endAngle, antiClockwise) {
    context.save();
    context.translate(x, y);
    context.rotate(rotation);
    context.scale(radiusX, radiusY);
    context.arc(0, 0, 1, startAngle, endAngle, antiClockwise);
    context.restore();
  }

  function randomPhysics(opts) {
    var radAngle = opts.angle * (Math.PI / 180);
    var radSpread = opts.spread * (Math.PI / 180);

    return {
      x: opts.x,
      y: opts.y,
      wobble: Math.random() * 10,
      wobbleSpeed: Math.min(0.11, Math.random() * 0.1 + 0.05),
      velocity: (opts.startVelocity * 0.5) + (Math.random() * opts.startVelocity),
      angle2D: -radAngle + ((0.5 * radSpread) - (Math.random() * radSpread)),
      tiltAngle: (Math.random() * (0.75 - 0.25) + 0.25) * Math.PI,
      color: opts.color,
      shape: opts.shape,
      tick: 0,
      totalTicks: opts.ticks,
      decay: opts.decay,
      drift: opts.drift,
      random: Math.random() + 2,
      tiltSin: 0,
      tiltCos: 0,
      wobbleX: 0,
      wobbleY: 0,
      gravity: opts.gravity * 3,
      ovalScalar: 0.6,
      scalar: opts.scalar,
      flat: opts.flat
    };
  }

  function updateFetti(context, fetti) {
    fetti.x += Math.cos(fetti.angle2D) * fetti.velocity + fetti.drift;
    fetti.y += Math.sin(fetti.angle2D) * fetti.velocity + fetti.gravity;
    fetti.velocity *= fetti.decay;

    if (fetti.flat) {
      fetti.wobble = 0;
      fetti.wobbleX = fetti.x + (10 * fetti.scalar);
      fetti.wobbleY = fetti.y + (10 * fetti.scalar);

      fetti.tiltSin = 0;
      fetti.tiltCos = 0;
      fetti.random = 1;
    } else {
      fetti.wobble += fetti.wobbleSpeed;
      fetti.wobbleX = fetti.x + ((10 * fetti.scalar) * Math.cos(fetti.wobble));
      fetti.wobbleY = fetti.y + ((10 * fetti.scalar) * Math.sin(fetti.wobble));

      fetti.tiltAngle += 0.1;
      fetti.tiltSin = Math.sin(fetti.tiltAngle);
      fetti.tiltCos = Math.cos(fetti.tiltAngle);
      fetti.random = Math.random() + 2;
    }

    var progress = (fetti.tick++) / fetti.totalTicks;

    var x1 = fetti.x + (fetti.random * fetti.tiltCos);
    var y1 = fetti.y + (fetti.random * fetti.tiltSin);
    var x2 = fetti.wobbleX + (fetti.random * fetti.tiltCos);
    var y2 = fetti.wobbleY + (fetti.random * fetti.tiltSin);

    context.fillStyle = 'rgba(' + fetti.color.r + ', ' + fetti.color.g + ', ' + fetti.color.b + ', ' + (1 - progress) + ')';

    context.beginPath();

    if (canUsePaths && fetti.shape.type === 'path' && typeof fetti.shape.path === 'string' && Array.isArray(fetti.shape.matrix)) {
      context.fill(transformPath2D(
        fetti.shape.path,
        fetti.shape.matrix,
        fetti.x,
        fetti.y,
        Math.abs(x2 - x1) * 0.1,
        Math.abs(y2 - y1) * 0.1,
        Math.PI / 10 * fetti.wobble
      ));
    } else if (fetti.shape.type === 'bitmap') {
      var rotation = Math.PI / 10 * fetti.wobble;
      var scaleX = Math.abs(x2 - x1) * 0.1;
      var scaleY = Math.abs(y2 - y1) * 0.1;
      var width = fetti.shape.bitmap.width * fetti.scalar;
      var height = fetti.shape.bitmap.height * fetti.scalar;

      var matrix = new DOMMatrix([
        Math.cos(rotation) * scaleX,
        Math.sin(rotation) * scaleX,
        -Math.sin(rotation) * scaleY,
        Math.cos(rotation) * scaleY,
        fetti.x,
        fetti.y
      ]);

      // apply the transform matrix from the confetti shape
      matrix.multiplySelf(new DOMMatrix(fetti.shape.matrix));

      var pattern = context.createPattern(bitmapMapper.transform(fetti.shape.bitmap), 'no-repeat');
      pattern.setTransform(matrix);

      context.globalAlpha = (1 - progress);
      context.fillStyle = pattern;
      context.fillRect(
        fetti.x - (width / 2),
        fetti.y - (height / 2),
        width,
        height
      );
      context.globalAlpha = 1;
    } else if (fetti.shape === 'circle') {
      context.ellipse ?
        context.ellipse(fetti.x, fetti.y, Math.abs(x2 - x1) * fetti.ovalScalar, Math.abs(y2 - y1) * fetti.ovalScalar, Math.PI / 10 * fetti.wobble, 0, 2 * Math.PI) :
        ellipse(context, fetti.x, fetti.y, Math.abs(x2 - x1) * fetti.ovalScalar, Math.abs(y2 - y1) * fetti.ovalScalar, Math.PI / 10 * fetti.wobble, 0, 2 * Math.PI);
    } else if (fetti.shape === 'star') {
      var rot = Math.PI / 2 * 3;
      var innerRadius = 4 * fetti.scalar;
      var outerRadius = 8 * fetti.scalar;
      var x = fetti.x;
      var y = fetti.y;
      var spikes = 5;
      var step = Math.PI / spikes;

      while (spikes--) {
        x = fetti.x + Math.cos(rot) * outerRadius;
        y = fetti.y + Math.sin(rot) * outerRadius;
        context.lineTo(x, y);
        rot += step;

        x = fetti.x + Math.cos(rot) * innerRadius;
        y = fetti.y + Math.sin(rot) * innerRadius;
        context.lineTo(x, y);
        rot += step;
      }
    } else {
      context.moveTo(Math.floor(fetti.x), Math.floor(fetti.y));
      context.lineTo(Math.floor(fetti.wobbleX), Math.floor(y1));
      context.lineTo(Math.floor(x2), Math.floor(y2));
      context.lineTo(Math.floor(x1), Math.floor(fetti.wobbleY));
    }

    context.closePath();
    context.fill();

    return fetti.tick < fetti.totalTicks;
  }

  function animate(canvas, fettis, resizer, size, done) {
    var animatingFettis = fettis.slice();
    var context = canvas.getContext('2d');
    var animationFrame;
    var destroy;

    var prom = promise(function (resolve) {
      function onDone() {
        animationFrame = destroy = null;

        context.clearRect(0, 0, size.width, size.height);
        bitmapMapper.clear();

        done();
        resolve();
      }

      function update() {
        if (isWorker && !(size.width === workerSize.width && size.height === workerSize.height)) {
          size.width = canvas.width = workerSize.width;
          size.height = canvas.height = workerSize.height;
        }

        if (!size.width && !size.height) {
          resizer(canvas);
          size.width = canvas.width;
          size.height = canvas.height;
        }

        context.clearRect(0, 0, size.width, size.height);

        animatingFettis = animatingFettis.filter(function (fetti) {
          return updateFetti(context, fetti);
        });

        if (animatingFettis.length) {
          animationFrame = raf.frame(update);
        } else {
          onDone();
        }
      }

      animationFrame = raf.frame(update);
      destroy = onDone;
    });

    return {
      addFettis: function (fettis) {
        animatingFettis = animatingFettis.concat(fettis);

        return prom;
      },
      canvas: canvas,
      promise: prom,
      reset: function () {
        if (animationFrame) {
          raf.cancel(animationFrame);
        }

        if (destroy) {
          destroy();
        }
      }
    };
  }

  function confettiCannon(canvas, globalOpts) {
    var isLibCanvas = !canvas;
    var allowResize = !!prop(globalOpts || {}, 'resize');
    var hasResizeEventRegistered = false;
    var globalDisableForReducedMotion = prop(globalOpts, 'disableForReducedMotion', Boolean);
    var shouldUseWorker = canUseWorker && !!prop(globalOpts || {}, 'useWorker');
    var worker = shouldUseWorker ? getWorker() : null;
    var resizer = isLibCanvas ? setCanvasWindowSize : setCanvasRectSize;
    var initialized = (canvas && worker) ? !!canvas.__confetti_initialized : false;
    var preferLessMotion = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion)').matches;
    var animationObj;

    function fireLocal(options, size, done) {
      var particleCount = prop(options, 'particleCount', onlyPositiveInt);
      var angle = prop(options, 'angle', Number);
      var spread = prop(options, 'spread', Number);
      var startVelocity = prop(options, 'startVelocity', Number);
      var decay = prop(options, 'decay', Number);
      var gravity = prop(options, 'gravity', Number);
      var drift = prop(options, 'drift', Number);
      var colors = prop(options, 'colors', colorsToRgb);
      var ticks = prop(options, 'ticks', Number);
      var shapes = prop(options, 'shapes');
      var scalar = prop(options, 'scalar');
      var flat = !!prop(options, 'flat');
      var origin = getOrigin(options);

      var temp = particleCount;
      var fettis = [];

      var startX = canvas.width * origin.x;
      var startY = canvas.height * origin.y;

      while (temp--) {
        fettis.push(
          randomPhysics({
            x: startX,
            y: startY,
            angle: angle,
            spread: spread,
            startVelocity: startVelocity,
            color: colors[temp % colors.length],
            shape: shapes[randomInt(0, shapes.length)],
            ticks: ticks,
            decay: decay,
            gravity: gravity,
            drift: drift,
            scalar: scalar,
            flat: flat
          })
        );
      }

      // if we have a previous canvas already animating,
      // add to it
      if (animationObj) {
        return animationObj.addFettis(fettis);
      }

      animationObj = animate(canvas, fettis, resizer, size , done);

      return animationObj.promise;
    }

    function fire(options) {
      var disableForReducedMotion = globalDisableForReducedMotion || prop(options, 'disableForReducedMotion', Boolean);
      var zIndex = prop(options, 'zIndex', Number);

      if (disableForReducedMotion && preferLessMotion) {
        return promise(function (resolve) {
          resolve();
        });
      }

      if (isLibCanvas && animationObj) {
        // use existing canvas from in-progress animation
        canvas = animationObj.canvas;
      } else if (isLibCanvas && !canvas) {
        // create and initialize a new canvas
        canvas = getCanvas(zIndex);
        document.body.appendChild(canvas);
      }

      if (allowResize && !initialized) {
        // initialize the size of a user-supplied canvas
        resizer(canvas);
      }

      var size = {
        width: canvas.width,
        height: canvas.height
      };

      if (worker && !initialized) {
        worker.init(canvas);
      }

      initialized = true;

      if (worker) {
        canvas.__confetti_initialized = true;
      }

      function onResize() {
        if (worker) {
          // TODO this really shouldn't be immediate, because it is expensive
          var obj = {
            getBoundingClientRect: function () {
              if (!isLibCanvas) {
                return canvas.getBoundingClientRect();
              }
            }
          };

          resizer(obj);

          worker.postMessage({
            resize: {
              width: obj.width,
              height: obj.height
            }
          });
          return;
        }

        // don't actually query the size here, since this
        // can execute frequently and rapidly
        size.width = size.height = null;
      }

      function done() {
        animationObj = null;

        if (allowResize) {
          hasResizeEventRegistered = false;
          global.removeEventListener('resize', onResize);
        }

        if (isLibCanvas && canvas) {
          if (document.body.contains(canvas)) {
            document.body.removeChild(canvas);
          }
          canvas = null;
          initialized = false;
        }
      }

      if (allowResize && !hasResizeEventRegistered) {
        hasResizeEventRegistered = true;
        global.addEventListener('resize', onResize, false);
      }

      if (worker) {
        return worker.fire(options, size, done);
      }

      return fireLocal(options, size, done);
    }

    fire.reset = function () {
      if (worker) {
        worker.reset();
      }

      if (animationObj) {
        animationObj.reset();
      }
    };

    return fire;
  }

  // Make default export lazy to defer worker creation until called.
  var defaultFire;
  function getDefaultFire() {
    if (!defaultFire) {
      defaultFire = confettiCannon(null, { useWorker: true, resize: true });
    }
    return defaultFire;
  }

  function transformPath2D(pathString, pathMatrix, x, y, scaleX, scaleY, rotation) {
    var path2d = new Path2D(pathString);

    var t1 = new Path2D();
    t1.addPath(path2d, new DOMMatrix(pathMatrix));

    var t2 = new Path2D();
    // see https://developer.mozilla.org/en-US/docs/Web/API/DOMMatrix/DOMMatrix
    t2.addPath(t1, new DOMMatrix([
      Math.cos(rotation) * scaleX,
      Math.sin(rotation) * scaleX,
      -Math.sin(rotation) * scaleY,
      Math.cos(rotation) * scaleY,
      x,
      y
    ]));

    return t2;
  }

  function shapeFromPath(pathData) {
    if (!canUsePaths) {
      throw new Error('path confetti are not supported in this browser');
    }

    var path, matrix;

    if (typeof pathData === 'string') {
      path = pathData;
    } else {
      path = pathData.path;
      matrix = pathData.matrix;
    }

    var path2d = new Path2D(path);
    var tempCanvas = document.createElement('canvas');
    var tempCtx = tempCanvas.getContext('2d');

    if (!matrix) {
      // attempt to figure out the width of the path, up to 1000x1000
      var maxSize = 1000;
      var minX = maxSize;
      var minY = maxSize;
      var maxX = 0;
      var maxY = 0;
      var width, height;

      // do some line skipping... this is faster than checking
      // every pixel and will be mostly still correct
      for (var x = 0; x < maxSize; x += 2) {
        for (var y = 0; y < maxSize; y += 2) {
          if (tempCtx.isPointInPath(path2d, x, y, 'nonzero')) {
            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
            maxX = Math.max(maxX, x);
            maxY = Math.max(maxY, y);
          }
        }
      }

      width = maxX - minX;
      height = maxY - minY;

      var maxDesiredSize = 10;
      var scale = Math.min(maxDesiredSize/width, maxDesiredSize/height);

      matrix = [
        scale, 0, 0, scale,
        -Math.round((width/2) + minX) * scale,
        -Math.round((height/2) + minY) * scale
      ];
    }

    return {
      type: 'path',
      path: path,
      matrix: matrix
    };
  }

  function shapeFromText(textData) {
    var text,
        scalar = 1,
        color = '#000000',
        // see https://nolanlawson.com/2022/04/08/the-struggle-of-using-native-emoji-on-the-web/
        fontFamily = '"Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", "EmojiOne Color", "Android Emoji", "Twemoji Mozilla", "system emoji", sans-serif';

    if (typeof textData === 'string') {
      text = textData;
    } else {
      text = textData.text;
      scalar = 'scalar' in textData ? textData.scalar : scalar;
      fontFamily = 'fontFamily' in textData ? textData.fontFamily : fontFamily;
      color = 'color' in textData ? textData.color : color;
    }

    // all other confetti are 10 pixels,
    // so this pixel size is the de-facto 100% scale confetti
    var fontSize = 10 * scalar;
    var font = '' + fontSize + 'px ' + fontFamily;

    var canvas = new OffscreenCanvas(fontSize, fontSize);
    var ctx = canvas.getContext('2d');

    ctx.font = font;
    var size = ctx.measureText(text);
    var width = Math.ceil(size.actualBoundingBoxRight + size.actualBoundingBoxLeft);
    var height = Math.ceil(size.actualBoundingBoxAscent + size.actualBoundingBoxDescent);

    var padding = 2;
    var x = size.actualBoundingBoxLeft + padding;
    var y = size.actualBoundingBoxAscent + padding;
    width += padding + padding;
    height += padding + padding;

    canvas = new OffscreenCanvas(width, height);
    ctx = canvas.getContext('2d');
    ctx.font = font;
    ctx.fillStyle = color;

    ctx.fillText(text, x, y);

    var scale = 1 / scalar;

    return {
      type: 'bitmap',
      // TODO these probably need to be transfered for workers
      bitmap: canvas.transferToImageBitmap(),
      matrix: [scale, 0, 0, scale, -width * scale / 2, -height * scale / 2]
    };
  }

  module.exports = function() {
    return getDefaultFire().apply(this, arguments);
  };
  module.exports.reset = function() {
    getDefaultFire().reset();
  };
  module.exports.create = confettiCannon;
  module.exports.shapeFromPath = shapeFromPath;
  module.exports.shapeFromText = shapeFromText;
}((function () {
  if (typeof window !== 'undefined') {
    return window;
  }

  if (typeof self !== 'undefined') {
    return self;
  }

  return this || {};
})(), module, false));

// end source content

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (module.exports);
var create = module.exports.create;


/***/ }),

/***/ "./node_modules/zustand/esm/react.mjs":
/*!********************************************!*\
  !*** ./node_modules/zustand/esm/react.mjs ***!
  \********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   create: () => (/* binding */ create),
/* harmony export */   useStore: () => (/* binding */ useStore)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var zustand_vanilla__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! zustand/vanilla */ "./node_modules/zustand/esm/vanilla.mjs");



const identity = (arg) => arg;
function useStore(api, selector = identity) {
  const slice = react__WEBPACK_IMPORTED_MODULE_0__.useSyncExternalStore(
    api.subscribe,
    react__WEBPACK_IMPORTED_MODULE_0__.useCallback(() => selector(api.getState()), [api, selector]),
    react__WEBPACK_IMPORTED_MODULE_0__.useCallback(() => selector(api.getInitialState()), [api, selector])
  );
  react__WEBPACK_IMPORTED_MODULE_0__.useDebugValue(slice);
  return slice;
}
const createImpl = (createState) => {
  const api = (0,zustand_vanilla__WEBPACK_IMPORTED_MODULE_1__.createStore)(createState);
  const useBoundStore = (selector) => useStore(api, selector);
  Object.assign(useBoundStore, api);
  return useBoundStore;
};
const create = ((createState) => createState ? createImpl(createState) : createImpl);




/***/ }),

/***/ "./node_modules/zustand/esm/vanilla.mjs":
/*!**********************************************!*\
  !*** ./node_modules/zustand/esm/vanilla.mjs ***!
  \**********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createStore: () => (/* binding */ createStore)
/* harmony export */ });
const createStoreImpl = (createState) => {
  let state;
  const listeners = /* @__PURE__ */ new Set();
  const setState = (partial, replace) => {
    const nextState = typeof partial === "function" ? partial(state) : partial;
    if (!Object.is(nextState, state)) {
      const previousState = state;
      state = (replace != null ? replace : typeof nextState !== "object" || nextState === null) ? nextState : Object.assign({}, state, nextState);
      listeners.forEach((listener) => listener(state, previousState));
    }
  };
  const getState = () => state;
  const getInitialState = () => initialState;
  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };
  const api = { setState, getState, getInitialState, subscribe };
  const initialState = state = createState(setState, getState, api);
  return api;
};
const createStore = ((createState) => createState ? createStoreImpl(createState) : createStoreImpl);




/***/ }),

/***/ "@wordpress/api-fetch":
/*!**********************************!*\
  !*** external ["wp","apiFetch"] ***!
  \**********************************/
/***/ ((module) => {

module.exports = window["wp"]["apiFetch"];

/***/ }),

/***/ "@wordpress/element":
/*!*********************************!*\
  !*** external ["wp","element"] ***!
  \*********************************/
/***/ ((module) => {

module.exports = window["wp"]["element"];

/***/ }),

/***/ "@wordpress/hooks":
/*!*******************************!*\
  !*** external ["wp","hooks"] ***!
  \*******************************/
/***/ ((module) => {

module.exports = window["wp"]["hooks"];

/***/ }),

/***/ "@wordpress/i18n":
/*!******************************!*\
  !*** external ["wp","i18n"] ***!
  \******************************/
/***/ ((module) => {

module.exports = window["wp"]["i18n"];

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "React" ***!
  \************************/
/***/ ((module) => {

module.exports = window["React"];

/***/ }),

/***/ "react/jsx-runtime":
/*!**********************************!*\
  !*** external "ReactJSXRuntime" ***!
  \**********************************/
/***/ ((module) => {

module.exports = window["ReactJSXRuntime"];

/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ var __webpack_exports__ = (__webpack_exec__("./assets/src/widgets/SuggestedTasks/index.js"));
/******/ }
]);
//# sourceMappingURL=widget-suggested-tasks.js.map