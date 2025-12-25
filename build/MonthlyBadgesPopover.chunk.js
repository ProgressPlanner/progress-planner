"use strict";
(globalThis["webpackChunkprogress_planner"] = globalThis["webpackChunkprogress_planner"] || []).push([["MonthlyBadgesPopover"],{

/***/ "./assets/src/components/Badge/index.js":
/*!**********************************************!*\
  !*** ./assets/src/components/Badge/index.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Badge)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);

/**
 * Badge Component
 *
 * Displays a badge image fetched from the remote SaaS server.
 * Replicates the exact behavior of the web component (prpl-badge).
 */

/**
 * Badge component.
 *
 * @param {Object}  props            - Component props.
 * @param {string}  props.badgeId    - The badge ID (e.g., "monthly-2025-m12").
 * @param {string}  props.badgeName  - The badge name for alt text.
 * @param {number}  props.brandingId - Optional branding ID.
 * @param {boolean} props.isComplete - Whether the badge is complete.
 * @return {JSX.Element} The Badge component.
 */
function Badge({
  badgeId,
  badgeName,
  brandingId = 0,
  isComplete = true
}) {
  // Get badge config from window.progressPlannerBadge (same as web component).
  // Fallback to default remote server URL if not available (matches PHP default).
  const badgeConfig = window.progressPlannerBadge || {};
  let remoteServerRootUrl = badgeConfig.remoteServerRootUrl || 'https://progressplanner.com';
  const placeholderImageUrl = badgeConfig.placeholderImageUrl || '';

  // If remote server URL points to localhost, use production URL instead.
  // The badge-svg endpoint only exists on the remote server, not locally.
  if (remoteServerRootUrl.includes('localhost') || remoteServerRootUrl.includes('127.0.0.1')) {
    remoteServerRootUrl = 'https://progressplanner.com';
  }

  // Build URL exactly like web component.
  let url = `${remoteServerRootUrl}/wp-json/progress-planner-saas/v1/badge-svg/?badge_id=${badgeId}`;
  if (brandingId) {
    url += `&branding_id=${brandingId}`;
  }

  // Use inline onerror handler (same as web component).
  // Note: React's onError expects a function, but we need to replicate the inline string behavior.
  // We'll use dangerouslySetInnerHTML approach or create the img element properly.
  const handleError = e => {
    if (placeholderImageUrl && e.target.src !== placeholderImageUrl) {
      e.target.onerror = null; // Prevent infinite loop.
      e.target.src = placeholderImageUrl;
    }
  };

  // Determine badge name (same logic as web component).
  const displayName = badgeName && 'null' !== badgeName ? badgeName : 'Badge';

  // Apply styles matching the web component CSS.
  // CSS handles opacity/grayscale for incomplete badges via prpl-badge[complete="false"] img,
  // but since we're not using the custom element, we apply styles directly.
  const imgStyle = {
    maxWidth: '100%',
    height: 'auto',
    verticalAlign: 'bottom',
    transition: 'opacity 0.3s ease-in-out, filter 0.3s ease-in-out',
    ...(!isComplete && {
      opacity: 0.25,
      filter: 'grayscale(1)'
    })
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("img", {
    src: url,
    alt: displayName,
    onError: handleError,
    style: imgStyle
  });
}

/***/ }),

/***/ "./assets/src/components/Popovers/InteractiveTaskPopover.js":
/*!******************************************************************!*\
  !*** ./assets/src/components/Popovers/InteractiveTaskPopover.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ InteractiveTaskPopover)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/hooks */ "@wordpress/hooks");
/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_hooks__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);
/**
 * Base Interactive Task Popover Component.
 *
 * Wraps all interactive task popovers with common functionality.
 *
 * @param {Object}   props          Component props.
 * @param {boolean}  props.isOpen   Whether the popover is open.
 * @param {string}   props.taskId   The task ID.
 * @param {Function} props.onClose  Callback when popover is closed.
 * @param {*}        props.children The popover content.
 * @return {JSX.Element} The popover component.
 */





function InteractiveTaskPopover({
  isOpen,
  taskId,
  onClose,
  children
}) {
  const popoverRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const popoverId = `prpl-popover-${taskId}`;

  /**
   * Handle popover visibility changes.
   */
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!popoverRef.current) {
      return;
    }
    const popover = popoverRef.current;
    if (isOpen) {
      if (typeof popover.showPopover === 'function') {
        popover.showPopover();
      }
    } else if (typeof popover.hidePopover === 'function') {
      popover.hidePopover();
    }
  }, [isOpen]);

  /**
   * Handle close button click.
   */
  const handleClose = () => {
    (0,_wordpress_hooks__WEBPACK_IMPORTED_MODULE_2__.doAction)('prpl.popover.close', taskId);
    if (onClose) {
      onClose();
    }
  };

  /**
   * Handle backdrop click (when popover is dismissed).
   *
   * @param {Event} event The toggle event.
   */
  const handleToggle = event => {
    if (event.newState === 'closed') {
      (0,_wordpress_hooks__WEBPACK_IMPORTED_MODULE_2__.doAction)('prpl.popover.close', taskId);
      if (onClose) {
        onClose();
      }
    }
  };
  if (!isOpen) {
    return null;
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
    id: popoverId,
    ref: popoverRef,
    className: "prpl-popover prpl-popover-interactive",
    popover: "auto",
    onToggle: handleToggle,
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
      className: "prpl-columns-wrapper-flex",
      children: children
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("button", {
      className: "prpl-popover-close",
      type: "button",
      onClick: handleClose,
      "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Close', 'progress-planner'),
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("span", {
        className: "dashicons dashicons-no-alt"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("span", {
        className: "screen-reader-text",
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Close', 'progress-planner')
      })]
    })]
  });
}

/***/ }),

/***/ "./assets/src/components/Popovers/MonthlyBadgesPopover.js":
/*!****************************************************************!*\
  !*** ./assets/src/components/Popovers/MonthlyBadgesPopover.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ MonthlyBadgesPopover)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/api-fetch */ "@wordpress/api-fetch");
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _InteractiveTaskPopover__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./InteractiveTaskPopover */ "./assets/src/components/Popovers/InteractiveTaskPopover.js");
/* harmony import */ var _Badge__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../Badge */ "./assets/src/components/Badge/index.js");
/* harmony import */ var _utils_taskIdResolver__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../utils/taskIdResolver */ "./assets/src/utils/taskIdResolver/index.js");
/* harmony import */ var _config_badges__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../config/badges */ "./assets/src/config/badges.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__);
/**
 * Monthly Badges Popover Component.
 *
 * Displays all badges including monthly, writing (content), and streak (maintenance) badges.
 *
 * @param {Object}   props         Component props.
 * @param {Object}   props.task    The task object.
 * @param {Function} props.onClose Callback when popover is closed.
 * @return {JSX.Element} The popover component.
 */









function MonthlyBadgesPopover({
  task,
  onClose
}) {
  const [badgeStats, setBadgeStats] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [isLoading, setIsLoading] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(true);

  /**
   * Load badge stats from REST API.
   */
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_2___default()({
      path: '/progress-planner/v1/badge-stats'
    }).then(response => {
      setBadgeStats(response.badges || {});
    }).catch(() => {
      setBadgeStats({});
    }).finally(() => {
      setIsLoading(false);
    });
  }, []);

  /**
   * Get branding ID and remote server URL from config.
   */
  const brandingId = window.prplDashboardConfig?.brandingId || window.progressPlannerAdmin?.brandingId || 0;
  const remoteServerUrl = window.prplDashboardConfig?.remoteServerUrl || window.progressPlannerAdmin?.remoteServerUrl || 'https://progressplanner.com';

  /**
   * Get monthly badges grouped by year.
   *
   * @return {Object} Badges grouped by year.
   */
  const monthlyBadgesByYear = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    if (!badgeStats) {
      return {};
    }
    const grouped = {};
    const currentYear = new Date().getFullYear();

    // Get monthly badges from stats
    Object.keys(badgeStats).filter(id => id.startsWith('monthly-')).forEach(badgeId => {
      const parts = badgeId.split('-');
      if (parts.length === 3) {
        const year = parts[1];
        if (!grouped[year]) {
          grouped[year] = [];
        }
        grouped[year].push({
          id: badgeId,
          ...badgeStats[badgeId]
        });
      }
    });

    // Ensure current year exists with current month badge
    if (!grouped[currentYear]) {
      grouped[currentYear] = [];
    }
    const currentBadgeId = (0,_config_badges__WEBPACK_IMPORTED_MODULE_6__.getMonthlyBadgeIdFromDate)(new Date());
    if (!grouped[currentYear].find(b => b.id === currentBadgeId)) {
      grouped[currentYear].push({
        id: currentBadgeId,
        progress: badgeStats[currentBadgeId]?.progress || 0,
        remaining: badgeStats[currentBadgeId]?.remaining || 0
      });
    }

    // Sort years descending and badges by month
    const sorted = {};
    Object.keys(grouped).sort((a, b) => parseInt(b) - parseInt(a)).forEach(year => {
      sorted[year] = grouped[year].sort((a, b) => {
        const aMonth = parseInt(a.id.split('-')[2].replace('m', ''));
        const bMonth = parseInt(b.id.split('-')[2].replace('m', ''));
        return aMonth - bMonth;
      });
    });
    return sorted;
  }, [badgeStats]);

  /**
   * Get badges by category (content or maintenance).
   *
   * @param {Array} badgeList Array of badge definitions.
   * @return {Array} Badges with progress data.
   */
  const getBadgesWithProgress = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(badgeList => {
    if (!badgeStats) {
      return [];
    }
    return badgeList.map(badge => ({
      id: badge.id,
      name: badge.name,
      progress: badgeStats[badge.id]?.progress || 0,
      remaining: badgeStats[badge.id]?.remaining || 0
    }));
  }, [badgeStats]);
  const contentBadges = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => getBadgesWithProgress(_config_badges__WEBPACK_IMPORTED_MODULE_6__.CONTENT_BADGES), [getBadgesWithProgress]);
  const maintenanceBadges = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => getBadgesWithProgress(_config_badges__WEBPACK_IMPORTED_MODULE_6__.MAINTENANCE_BADGES), [getBadgesWithProgress]);

  /**
   * Render a badge item.
   *
   * @param {Object} badge Badge data.
   * @return {JSX.Element} Badge item.
   */
  const renderBadge = badge => {
    const isComplete = badge.progress >= 100;
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("span", {
      className: "prpl-badge",
      "data-value": badge.progress,
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_Badge__WEBPACK_IMPORTED_MODULE_4__["default"], {
        id: badge.id,
        name: badge.name || badge.id,
        isComplete: isComplete,
        brandingId: brandingId,
        remoteServerUrl: remoteServerUrl
      }), badge.name && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("p", {
        children: badge.name
      })]
    }, badge.id);
  };
  const taskId = (0,_utils_taskIdResolver__WEBPACK_IMPORTED_MODULE_5__.resolveTaskId)(task, 'monthly-badges');
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(_InteractiveTaskPopover__WEBPACK_IMPORTED_MODULE_3__["default"], {
    isOpen: true,
    taskId: taskId || 'monthly-badges',
    task: task,
    onClose: onClose,
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
      className: "prpl-column prpl-column-content",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("h2", {
        className: "prpl-popover-title",
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Your badges', 'progress-planner')
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
      className: "prpl-column",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
        className: "prpl-widgets-container in-popover",
        children: isLoading ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("p", {
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Loading…', 'progress-planner')
        }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.Fragment, {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
            className: "prpl-popover-column",
            children: Object.keys(monthlyBadgesByYear).map(year => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
              className: "prpl-monthly-badges-year",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("h3", {
                children: year
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
                className: "progress-wrapper badge-group-monthly",
                children: monthlyBadgesByYear[year].map(badge => renderBadge(badge))
              })]
            }, year))
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
            className: "prpl-popover-column",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
              className: "prpl-widget-wrapper prpl-widget-wrapper-content in-popover prpl-badge-streak",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("h3", {
                className: "prpl-widget-title",
                children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Writing badges', 'progress-planner')
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
                className: "prpl-badges-container-achievements",
                children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
                  className: "progress-wrapper badge-group-content",
                  children: contentBadges.map(badge => renderBadge(badge))
                })
              })]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
              className: "prpl-widget-wrapper prpl-widget-wrapper-maintenance in-popover prpl-badge-streak",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("h3", {
                className: "prpl-widget-title",
                children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Streak badges', 'progress-planner')
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
                className: "prpl-badges-container-achievements",
                children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
                  className: "progress-wrapper badge-group-maintenance",
                  children: maintenanceBadges.map(badge => renderBadge(badge))
                })
              })]
            })]
          })]
        })
      })
    })]
  });
}

/***/ }),

/***/ "./assets/src/config/badges.js":
/*!*************************************!*\
  !*** ./assets/src/config/badges.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CONTENT_BADGES: () => (/* binding */ CONTENT_BADGES),
/* harmony export */   MAINTENANCE_BADGES: () => (/* binding */ MAINTENANCE_BADGES),
/* harmony export */   MONTHLY_BADGE_CONFIG: () => (/* binding */ MONTHLY_BADGE_CONFIG),
/* harmony export */   getAllBadges: () => (/* binding */ getAllBadges),
/* harmony export */   getBadgeById: () => (/* binding */ getBadgeById),
/* harmony export */   getMonthlyBadgeIdFromDate: () => (/* binding */ getMonthlyBadgeIdFromDate),
/* harmony export */   getMonthlyBadgeNameFromDate: () => (/* binding */ getMonthlyBadgeNameFromDate)
/* harmony export */ });
/**
 * Badge Definitions
 *
 * Configuration for all badge types: content, maintenance, and monthly badges.
 * This replaces the PHP badge classes with JavaScript configuration.
 */

/**
 * Content badge definitions.
 */
const CONTENT_BADGES = [{
  id: 'content-curator',
  name: 'Content Curator',
  description: '20 existing posts/pages, or 10 new posts/pages',
  type: 'content',
  background: 'var(--prpl-background-content-badge)',
  thresholds: {
    existingPosts: 20,
    newPosts: 10
  }
}, {
  id: 'revision-ranger',
  name: 'Revision Ranger',
  description: 'Write 30 new posts or pages',
  type: 'content',
  background: 'var(--prpl-background-content-badge)',
  thresholds: {
    newPosts: 30
  }
}, {
  id: 'purposeful-publisher',
  name: 'Purposeful Publisher',
  description: 'Write 50 new posts or pages',
  type: 'content',
  background: 'var(--prpl-background-content-badge)',
  thresholds: {
    newPosts: 50
  }
}];

/**
 * Maintenance badge definitions.
 */
const MAINTENANCE_BADGES = [{
  id: 'progress-padawan',
  name: 'Progress Padawan',
  description: '6 weeks streak',
  type: 'maintenance',
  background: 'var(--prpl-background-streak)',
  thresholds: {
    weeks: 6
  }
}, {
  id: 'maintenance-maniac',
  name: 'Maintenance Maniac',
  description: '26 weeks streak',
  type: 'maintenance',
  background: 'var(--prpl-background-streak)',
  thresholds: {
    weeks: 26
  }
}, {
  id: 'super-site-specialist',
  name: 'Super Site Specialist',
  description: '52 weeks streak',
  type: 'maintenance',
  background: 'var(--prpl-background-streak)',
  thresholds: {
    weeks: 52
  }
}];

/**
 * Monthly badge configuration.
 */
const MONTHLY_BADGE_CONFIG = {
  targetPoints: 10,
  months: {
    m1: 'Jack January',
    m2: 'Felix February',
    m3: 'Mary March',
    m4: 'Avery April',
    m5: 'Matteo May',
    m6: 'Jasmine June',
    m7: 'Joey July',
    m8: 'Abed August',
    m9: 'Sam September',
    m10: 'Oksana October',
    m11: 'Noah November',
    m12: 'Daisy December'
  }
};

/**
 * Generate monthly badge ID from date.
 *
 * @param {Date} date - The date.
 * @return {string} Badge ID.
 */
function getMonthlyBadgeIdFromDate(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  return `monthly-${year}-m${month}`;
}

/**
 * Generate monthly badge name from date.
 *
 * @param {Date} date - The date.
 * @return {string} Badge name.
 */
function getMonthlyBadgeNameFromDate(date) {
  const month = date.getMonth() + 1;
  const monthKey = `m${month}`;
  return MONTHLY_BADGE_CONFIG.months[monthKey] || '';
}

/**
 * Get all badge definitions.
 *
 * @return {Array} All badge definitions.
 */
function getAllBadges() {
  return [...CONTENT_BADGES, ...MAINTENANCE_BADGES];
}

/**
 * Get badge by ID.
 *
 * @param {string} badgeId - The badge ID.
 * @return {Object|null} Badge definition or null.
 */
function getBadgeById(badgeId) {
  // Check content badges.
  const contentBadge = CONTENT_BADGES.find(badge => badge.id === badgeId);
  if (contentBadge) {
    return contentBadge;
  }

  // Check maintenance badges.
  const maintenanceBadge = MAINTENANCE_BADGES.find(badge => badge.id === badgeId);
  if (maintenanceBadge) {
    return maintenanceBadge;
  }

  // Check if it's a monthly badge.
  if (badgeId.startsWith('monthly-')) {
    const parts = badgeId.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[1], 10);
      const monthStr = parts[2].replace('m', '');
      const month = parseInt(monthStr, 10);
      if (year && month >= 1 && month <= 12) {
        const date = new Date(year, month - 1, 1);
        return {
          id: badgeId,
          name: getMonthlyBadgeNameFromDate(date),
          description: '',
          type: 'monthly',
          background: 'var(--prpl-background-content-badge)',
          thresholds: {
            points: MONTHLY_BADGE_CONFIG.targetPoints
          }
        };
      }
    }
  }
  return null;
}

/***/ })

}]);
//# sourceMappingURL=MonthlyBadgesPopover.chunk.js.map