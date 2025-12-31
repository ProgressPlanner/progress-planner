"use strict";
(globalThis["webpackChunkprogress_planner"] = globalThis["webpackChunkprogress_planner"] || []).push([["widget-todo"],{

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

/***/ "./assets/src/widgets/TodoWidget/TodoWidgetSkeleton.js":
/*!*************************************************************!*\
  !*** ./assets/src/widgets/TodoWidget/TodoWidgetSkeleton.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TodoWidgetSkeleton)
/* harmony export */ });
/* harmony import */ var _components_TaskItem_TaskItemSkeleton__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../components/TaskItem/TaskItemSkeleton */ "./assets/src/components/TaskItem/TaskItemSkeleton.js");
/* harmony import */ var _components_Skeleton__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../components/Skeleton */ "./assets/src/components/Skeleton/index.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__);
/**
 * TodoWidget Skeleton Component
 *
 * Skeleton loading state for the TodoWidget.
 * Composes: TaskListSkeleton
 */




/**
 * TodoWidgetSkeleton component.
 *
 * @param {Object} props       - Component props.
 * @param {number} props.count - Number of task skeletons to show.
 * @return {JSX.Element} The TodoWidgetSkeleton component.
 */

function TodoWidgetSkeleton({
  count = 3
}) {
  const formStyle = {
    display: 'flex',
    gap: '0.5rem',
    marginTop: 'var(--prpl-padding)'
  };
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
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
      style: formStyle,
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_components_Skeleton__WEBPACK_IMPORTED_MODULE_1__.SkeletonRect, {
        width: "100%",
        height: "40px",
        style: {
          flex: 1
        }
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_components_Skeleton__WEBPACK_IMPORTED_MODULE_1__.SkeletonRect, {
        width: "40px",
        height: "40px",
        style: {
          borderRadius: 'var(--prpl-border-radius)'
        }
      })]
    })]
  });
}

/***/ }),

/***/ "./assets/src/widgets/TodoWidget/index.js":
/*!************************************************!*\
  !*** ./assets/src/widgets/TodoWidget/index.js ***!
  \************************************************/
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
/* harmony import */ var _components_TaskItem__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../components/TaskItem */ "./assets/src/components/TaskItem/index.js");
/* harmony import */ var _hooks_useTasksApi__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../hooks/useTasksApi */ "./assets/src/hooks/useTasksApi/index.js");
/* harmony import */ var _hooks_useGridMasonry__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../hooks/useGridMasonry */ "./assets/src/hooks/useGridMasonry/index.js");
/* harmony import */ var _hooks_useCelebration__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../hooks/useCelebration */ "./assets/src/hooks/useCelebration/index.js");
/* harmony import */ var _utils_gridResize__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../utils/gridResize */ "./assets/src/utils/gridResize/index.js");
/* harmony import */ var _utils_taskUtils__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../utils/taskUtils */ "./assets/src/utils/taskUtils/index.js");
/* harmony import */ var _components_WidgetHeader__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../components/WidgetHeader */ "./assets/src/components/WidgetHeader/index.js");
/* harmony import */ var _TodoWidgetSkeleton__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./TodoWidgetSkeleton */ "./assets/src/widgets/TodoWidget/TodoWidgetSkeleton.js");
/* harmony import */ var _stores_dashboardStore__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../stores/dashboardStore */ "./assets/src/stores/dashboardStore.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__);
/**
 * Todo Widget Component.
 *
 * Displays a list of user-created todo tasks.
 */














/**
 * Style constants - extracted to prevent recreation on each render.
 */

const STYLES = {
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0
  },
  form: {
    display: 'flex',
    gap: '0.5rem',
    marginTop: 'var(--prpl-padding)'
  },
  input: {
    flex: 1,
    minWidth: 0
  },
  addButton: {
    padding: '0.5rem',
    background: 'var(--prpl-color-button-secondary-background)',
    border: '1px solid var(--prpl-color-button-secondary-border)',
    borderRadius: 'var(--prpl-border-radius)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  details: {
    marginTop: 'var(--prpl-padding)',
    borderTop: '1px solid var(--prpl-color-border)',
    paddingTop: 'var(--prpl-padding)'
  },
  summary: {
    cursor: 'pointer',
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.5rem 0'
  },
  summaryIcon: {
    marginLeft: '0.5rem',
    transition: 'transform 0.2s',
    width: '1rem',
    height: '1rem'
  },
  deleteAllWrapper: {
    marginTop: '0.5rem',
    marginBottom: '0.5rem',
    borderBottom: '1px solid var(--prpl-color-border)',
    paddingBottom: '0.5rem'
  },
  deleteAllButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--prpl-color-text)',
    fontSize: 'var(--prpl-font-size-small)'
  },
  deleteAllIcon: {
    display: 'inline-block',
    width: '18px',
    height: '18px'
  },
  tooltipActions: {
    display: 'inline-flex',
    verticalAlign: 'text-top'
  },
  srOnly: {
    position: 'absolute',
    left: '-9999px'
  },
  popover: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 10000,
    background: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
  },
  popoverButtons: {
    display: 'flex',
    gap: '2rem',
    marginTop: '15px'
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.3)',
    zIndex: 9999
  }
};

/**
 * Todo Widget main component.
 *
 * @param {Object} props        - Component props.
 * @param {Object} props.config - Widget configuration.
 * @return {JSX.Element} The widget component.
 */
function TodoWidget({
  config = {}
}) {
  const [pendingTasks, setPendingTasks] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const [completedTasks, setCompletedTasks] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const [isLoading, setIsLoading] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(true);
  const [newTaskTitle, setNewTaskTitle] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const [showDeletePopover, setShowDeletePopover] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [isCreatingTask, setIsCreatingTask] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const inputRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);

  // Initialize grid masonry layout.
  (0,_hooks_useGridMasonry__WEBPACK_IMPORTED_MODULE_5__.useGridMasonry)();

  // Get celebration functions.
  const {
    celebrate
  } = (0,_hooks_useCelebration__WEBPACK_IMPORTED_MODULE_6__.useCelebration)();

  // Get onTaskCompleted from Zustand store for cross-widget communication.
  const onTaskCompleted = (0,_stores_dashboardStore__WEBPACK_IMPORTED_MODULE_11__.useDashboardStore)(state => state.onTaskCompleted);

  // Get terms functionality from dashboardStore (mirrors develop branch's prplTerms).
  const userProviderId = (0,_stores_dashboardStore__WEBPACK_IMPORTED_MODULE_11__.useDashboardStore)(state => state.getProviderTermId('user'));
  const fetchProviderTerms = (0,_stores_dashboardStore__WEBPACK_IMPORTED_MODULE_11__.useDashboardStore)(state => state.fetchProviderTerms);

  /**
   * Sort tasks: golden tasks first, then by menu_order.
   *
   * @param {Array} tasks Array of task objects.
   * @return {Array} Sorted array of tasks.
   */
  const sortTasksWithGoldenFirst = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(tasks => {
    return [...tasks].sort((a, b) => {
      const aIsGolden = (0,_utils_taskUtils__WEBPACK_IMPORTED_MODULE_8__.getTaskPoints)(a) === 1;
      const bIsGolden = (0,_utils_taskUtils__WEBPACK_IMPORTED_MODULE_8__.getTaskPoints)(b) === 1;

      // Golden tasks come first
      if (aIsGolden && !bIsGolden) {
        return -1;
      }
      if (!aIsGolden && bIsGolden) {
        return 1;
      }
      // Both golden or both not golden - sort by menu_order
      return (a.menu_order || 0) - (b.menu_order || 0);
    });
  }, []);

  /**
   * Load tasks on mount.
   */
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const loadTasks = async () => {
      try {
        // Fetch pending user tasks
        const pendingResult = await (0,_hooks_useTasksApi__WEBPACK_IMPORTED_MODULE_4__.fetchTasks)({
          status: 'publish',
          provider: 'user',
          perPage: 100,
          needsPagination: false
        });

        // Fetch completed user tasks
        const completedResult = await (0,_hooks_useTasksApi__WEBPACK_IMPORTED_MODULE_4__.fetchTasks)({
          status: 'trash',
          provider: 'user',
          perPage: 100,
          needsPagination: false
        });

        // Sort pending tasks: golden tasks (prpl_points === 1) first, then by menu_order
        const sortedPending = sortTasksWithGoldenFirst(pendingResult.tasks);
        completedResult.tasks.sort((a, b) => (a.menu_order || 0) - (b.menu_order || 0));
        setPendingTasks(sortedPending);
        setCompletedTasks(completedResult.tasks);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error loading tasks:', error);
      } finally {
        setIsLoading(false);
        // Trigger grid resize
        (0,_utils_gridResize__WEBPACK_IMPORTED_MODULE_7__.dispatchGridResize)();
      }
    };
    loadTasks();
  }, [sortTasksWithGoldenFirst]);

  /**
   * Fetch provider terms on mount.
   * This ensures we have the 'user' term ID for creating tasks.
   */
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    fetchProviderTerms();
  }, [fetchProviderTerms]);

  /**
   * Create a new task.
   */
  const handleCreateTask = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(async e => {
    e.preventDefault();
    if (!newTaskTitle.trim()) {
      return;
    }
    setIsCreatingTask(true);
    try {
      const highestOrder = pendingTasks.reduce((max, t) => Math.max(max, t.menu_order || 0), 0);
      const newTask = await (0,_hooks_useTasksApi__WEBPACK_IMPORTED_MODULE_4__.createTask)({
        title: newTaskTitle,
        menuOrder: highestOrder + 1,
        providerId: userProviderId,
        points: 0
      });
      setPendingTasks(prev => sortTasksWithGoldenFirst([...prev, newTask]));
      setNewTaskTitle('');

      // Announce to screen readers
      if (window.wp?.a11y?.speak) {
        window.wp.a11y.speak((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Task added successfully', 'progress-planner'), 'polite');
      }

      // Focus input
      inputRef.current?.focus();

      // Trigger grid resize
      (0,_utils_gridResize__WEBPACK_IMPORTED_MODULE_7__.dispatchGridResize)();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error creating task:', error);
    } finally {
      setIsCreatingTask(false);
    }
  }, [newTaskTitle, pendingTasks, sortTasksWithGoldenFirst, userProviderId]);

  /**
   * Toggle task completion.
   */
  const handleToggle = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(async taskId => {
    const task = pendingTasks.find(t => t.id === taskId) || completedTasks.find(t => t.id === taskId);
    if (!task) {
      return;
    }
    const isCurrentlyCompleted = task.status === 'trash';
    const newStatus = isCurrentlyCompleted ? 'publish' : 'trash';
    try {
      await (0,_hooks_useTasksApi__WEBPACK_IMPORTED_MODULE_4__.updateTask)(taskId, {
        status: newStatus
      });
      if (isCurrentlyCompleted) {
        // Move from completed to pending
        setCompletedTasks(prev => prev.filter(t => t.id !== taskId));
        setPendingTasks(prev => sortTasksWithGoldenFirst([...prev, {
          ...task,
          status: 'publish'
        }]));
      } else {
        // Move from pending to completed
        setPendingTasks(prev => prev.filter(t => t.id !== taskId));
        setCompletedTasks(prev => [...prev, {
          ...task,
          status: 'trash'
        }]);

        // Trigger celebration if has points
        const points = (0,_utils_taskUtils__WEBPACK_IMPORTED_MODULE_8__.getTaskPoints)(task);
        if (points > 0) {
          // Notify context about task completion.
          onTaskCompleted(task, points);
          // Trigger celebration confetti.
          celebrate();
        }
      }

      // Trigger grid resize
      (0,_utils_gridResize__WEBPACK_IMPORTED_MODULE_7__.dispatchGridResize)();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error toggling task:', error);
    }
  }, [pendingTasks, completedTasks, sortTasksWithGoldenFirst, celebrate, onTaskCompleted]);

  /**
   * Delete a task.
   */
  const handleDelete = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(async taskId => {
    try {
      await (0,_hooks_useTasksApi__WEBPACK_IMPORTED_MODULE_4__.deleteTask)(taskId);
      setPendingTasks(prev => prev.filter(t => t.id !== taskId));
      setCompletedTasks(prev => prev.filter(t => t.id !== taskId));

      // Trigger grid resize
      (0,_utils_gridResize__WEBPACK_IMPORTED_MODULE_7__.dispatchGridResize)();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error deleting task:', error);
    }
  }, []);

  /**
   * Move a task up or down.
   */
  const handleMove = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(async (taskId, direction) => {
    const index = pendingTasks.findIndex(t => t.id === taskId);
    if (index === -1) {
      return;
    }
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= pendingTasks.length) {
      return;
    }

    // Swap tasks
    const newTasks = [...pendingTasks];
    [newTasks[index], newTasks[newIndex]] = [newTasks[newIndex], newTasks[index]];

    // Update menu_order for all tasks
    const updates = newTasks.map((t, i) => ({
      ...t,
      menu_order: i
    }));

    // Re-sort to maintain golden tasks first
    const sortedUpdates = sortTasksWithGoldenFirst(updates);
    setPendingTasks(sortedUpdates);

    // Save order changes to server
    try {
      await Promise.all(sortedUpdates.map(t => (0,_hooks_useTasksApi__WEBPACK_IMPORTED_MODULE_4__.updateTask)(t.id, {
        menu_order: t.menu_order
      })));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error saving task order:', error);
    }

    // Trigger grid resize
    (0,_utils_gridResize__WEBPACK_IMPORTED_MODULE_7__.dispatchGridResize)();
  }, [pendingTasks, sortTasksWithGoldenFirst]);

  /**
   * Update task title.
   */
  const handleTitleChange = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(async (taskId, newTitle) => {
    try {
      await (0,_hooks_useTasksApi__WEBPACK_IMPORTED_MODULE_4__.updateTask)(taskId, {
        title: newTitle
      });

      // Update local state
      setPendingTasks(prev => prev.map(t => t.id === taskId ? {
        ...t,
        title: {
          rendered: newTitle
        }
      } : t));
      setCompletedTasks(prev => prev.map(t => t.id === taskId ? {
        ...t,
        title: {
          rendered: newTitle
        }
      } : t));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error updating task title:', error);
    }
  }, []);

  /**
   * Delete all completed tasks.
   */
  const handleDeleteAllCompleted = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(async () => {
    try {
      await Promise.all(completedTasks.map(t => (0,_hooks_useTasksApi__WEBPACK_IMPORTED_MODULE_4__.deleteTask)(t.id)));
      setCompletedTasks([]);
      setShowDeletePopover(false);

      // Announce to screen readers
      if (window.wp?.a11y?.speak) {
        window.wp.a11y.speak((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('All completed tasks deleted', 'progress-planner'), 'assertive');
      }

      // Trigger grid resize
      (0,_utils_gridResize__WEBPACK_IMPORTED_MODULE_7__.dispatchGridResize)();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error deleting completed tasks:', error);
    }
  }, [completedTasks]);

  // Get title - defined early for use in loading state.
  const widgetTitle = config?.title || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('My to-do list', 'progress-planner');
  if (isLoading) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.Fragment, {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)(_components_WidgetHeader__WEBPACK_IMPORTED_MODULE_9__["default"], {
        title: widgetTitle
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)(_TodoWidgetSkeleton__WEBPACK_IMPORTED_MODULE_10__["default"], {
        count: 3
      })]
    });
  }
  const goldenTaskDescription = config?.goldenTaskDescription || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Write down all your tasks you want to get done on your website! You'll earn points for your 'golden task'.", 'progress-planner');
  const silverTaskDescription = config?.silverTaskDescription || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Write down all your tasks you want to get done on your website! The top task will become your 'golden task' next week.", 'progress-planner');
  const infoIconSvg = config?.infoIconSvg;
  const tooltipContent = config?.tooltipContent || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Every Monday, your top task becomes the golden task for the week. Complete it anytime this week to earn points toward your monthly total! Once done, the next task is highlighted to become your golden task next week.', 'progress-planner');
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)(_components_WidgetHeader__WEBPACK_IMPORTED_MODULE_9__["default"], {
      title: widgetTitle
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsxs)("p", {
      className: "prpl-widget-description",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("span", {
        className: "prpl-todo-golden-task-description",
        children: goldenTaskDescription
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("span", {
        className: "prpl-todo-silver-task-description",
        children: silverTaskDescription
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("span", {
        className: "tooltip-actions",
        style: STYLES.tooltipActions,
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsxs)("prpl-tooltip", {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("slot", {
            name: "open-icon",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsxs)("span", {
              className: "icon prpl-info-icon",
              children: [infoIconSvg && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("span", {
                dangerouslySetInnerHTML: {
                  __html: infoIconSvg
                }
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("span", {
                className: "screen-reader-text",
                children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('More info', 'progress-planner')
              })]
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("slot", {
            name: "content",
            children: tooltipContent
          })]
        })
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("div", {
      id: "todo-aria-live-region",
      "aria-live": "polite",
      style: STYLES.srOnly
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsxs)("ul", {
      id: "todo-list",
      className: "prpl-todo-list prpl-suggested-tasks-list",
      style: STYLES.list,
      children: [pendingTasks.map((task, index) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)(_components_TaskItem__WEBPACK_IMPORTED_MODULE_3__["default"], {
        task: task,
        index: index,
        isUserTask: true,
        isCelebrating: false,
        isCompleted: false,
        showMoveButtons: true,
        showActions: false,
        onComplete: handleToggle,
        onDelete: handleDelete,
        onMove: handleMove,
        onTitleChange: handleTitleChange
      }, task.id)), isCreatingTask && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("li", {
        className: "prpl-loader",
        role: "status",
        "aria-live": "polite",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("span", {
          className: "screen-reader-text",
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Loading tasks…', 'progress-planner')
        })
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsxs)("form", {
      id: "create-todo-item",
      style: STYLES.form,
      onSubmit: handleCreateTask,
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("input", {
        ref: inputRef,
        type: "text",
        id: "new-todo-content",
        style: STYLES.input,
        placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Add a new task', 'progress-planner'),
        "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Add a new task', 'progress-planner'),
        required: true,
        value: newTaskTitle,
        onChange: e => setNewTaskTitle(e.target.value)
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsxs)("button", {
        type: "submit",
        style: STYLES.addButton,
        "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Add task', 'progress-planner'),
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("span", {
          className: "dashicons dashicons-plus-alt2",
          "aria-hidden": "true"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("span", {
          className: "screen-reader-text",
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Add task', 'progress-planner')
        })]
      })]
    }), completedTasks.length > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsxs)("details", {
      id: "todo-list-completed-details",
      style: STYLES.details,
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsxs)("summary", {
        style: STYLES.summary,
        children: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Completed tasks', 'progress-planner'), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("span", {
          className: "prpl-todo-list-completed-summary-icon",
          style: STYLES.summaryIcon,
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            fill: "none",
            viewBox: "0 0 24 24",
            strokeWidth: "1.5",
            stroke: "currentColor",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("path", {
              strokeLinecap: "round",
              strokeLinejoin: "round",
              d: "m19.5 8.25-7.5 7.5-7.5-7.5"
            })
          })
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("div", {
        id: "todo-list-completed-delete-all-wrapper",
        style: STYLES.deleteAllWrapper,
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsxs)("button", {
          id: "todo-list-completed-delete-all",
          style: STYLES.deleteAllButton,
          onClick: () => setShowDeletePopover(true),
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("span", {
            style: STYLES.deleteAllIcon,
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("svg", {
              role: "img",
              "aria-hidden": "true",
              xmlns: "http://www.w3.org/2000/svg",
              viewBox: "0 0 48 48",
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("path", {
                fill: "#9ca3af",
                d: "M32.99 47.88H15.01c-3.46 0-6.38-2.7-6.64-6.15L6.04 11.49l-.72.12c-.82.14-1.59-.41-1.73-1.22-.14-.82.41-1.59 1.22-1.73.79-.14 1.57-.26 2.37-.38h.02c2.21-.33 4.46-.6 6.69-.81v-.72c0-3.56 2.74-6.44 6.25-6.55 2.56-.08 5.15-.08 7.71 0 3.5.11 6.25 2.99 6.25 6.55v.72c2.24.2 4.48.47 6.7.81.79.12 1.59.25 2.38.39.82.14 1.36.92 1.22 1.73-.14.82-.92 1.36-1.73 1.22l-.72-.12-2.33 30.24c-.27 3.45-3.18 6.15-6.64 6.15Z"
              })
            })
          }), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Delete all completed tasks', 'progress-planner')]
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("ul", {
        id: "todo-list-completed",
        className: "prpl-todo-list prpl-suggested-tasks-list",
        style: STYLES.list,
        children: completedTasks.map((task, index) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)(_components_TaskItem__WEBPACK_IMPORTED_MODULE_3__["default"], {
          task: task,
          index: index,
          isUserTask: true,
          isCelebrating: false,
          isCompleted: true,
          showMoveButtons: false,
          showActions: false,
          onComplete: handleToggle,
          onDelete: handleDelete,
          onMove: handleMove,
          onTitleChange: handleTitleChange
        }, task.id))
      })]
    }), showDeletePopover && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsxs)("div", {
      id: "todo-list-completed-delete-all-popover",
      className: "prpl-popover",
      style: STYLES.popover,
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsxs)("div", {
        className: "prpl-note",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("span", {
          className: "prpl-note-icon",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            viewBox: "0 0 24 24",
            fill: "currentColor",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("path", {
              fillRule: "evenodd",
              d: "M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z",
              clipRule: "evenodd"
            })
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("span", {
          className: "prpl-note-text",
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Are you sure you want to delete all completed tasks? This action cannot be undone.', 'progress-planner')
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsxs)("div", {
        className: "prpl-buttons-wrapper",
        style: STYLES.popoverButtons,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsxs)("button", {
          id: "todo-list-completed-delete-all-cancel",
          onClick: () => setShowDeletePopover(false),
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("strong", {
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('No', 'progress-planner')
          }), ', ', (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('keep this list', 'progress-planner')]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsxs)("button", {
          id: "todo-list-completed-delete-all-confirm",
          onClick: handleDeleteAllCompleted,
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("strong", {
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Yes', 'progress-planner')
          }), ', ', (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('delete all completed tasks', 'progress-planner')]
        })]
      })]
    }), showDeletePopover && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("div", {
      role: "button",
      tabIndex: 0,
      "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Close dialog', 'progress-planner'),
      style: STYLES.overlay,
      onClick: () => setShowDeletePopover(false),
      onKeyDown: e => {
        if (e.key === 'Enter' || e.key === ' ') {
          setShowDeletePopover(false);
        }
      }
    })]
  });
}

// Register widget via hook with metadata
(0,_wordpress_hooks__WEBPACK_IMPORTED_MODULE_2__.doAction)('prpl.dashboard.registerWidget', {
  id: 'todo',
  component: TodoWidget,
  priority: 3,
  width: 2,
  forceLastColumn: false,
  title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('My to-do list', 'progress-planner'),
  infoIconSvg: '' // Can be fetched from REST API if needed for branding
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (TodoWidget);

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
/******/ var __webpack_exports__ = (__webpack_exec__("./assets/src/widgets/TodoWidget/index.js"));
/******/ }
]);
//# sourceMappingURL=widget-todo.js.map