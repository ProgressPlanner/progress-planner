"use strict";
(globalThis["webpackChunkprogress_planner"] = globalThis["webpackChunkprogress_planner"] || []).push([["BadgeStreakPopover"],{

/***/ "./assets/src/components/Popovers/BadgeStreakPopover.js":
/*!**************************************************************!*\
  !*** ./assets/src/components/Popovers/BadgeStreakPopover.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ BadgeStreakPopover)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/api-fetch */ "@wordpress/api-fetch");
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _InteractiveTaskPopover__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./InteractiveTaskPopover */ "./assets/src/components/Popovers/InteractiveTaskPopover.js");
/* harmony import */ var _utils_taskIdResolver__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../utils/taskIdResolver */ "./assets/src/utils/taskIdResolver/index.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__);
/**
 * Badge Streak Popover Component.
 *
 * Displays badge streak information with progress bars.
 *
 * @param {Object}   props          Component props.
 * @param {Object}   props.task     The task object.
 * @param {Function} props.onSubmit Callback when form is submitted.
 * @param {Function} props.onClose  Callback when popover is closed.
 * @return {JSX.Element} The popover component.
 */







function BadgeStreakPopover({
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
   * Get badge progress for a category.
   *
   * @param {string} category The badge category (maintenance or content).
   * @return {Object} Badge progress data.
   */
  const getBadgeProgress = category => {
    if (!badgeStats) {
      return null;
    }

    // Find badges for this category
    const categoryBadges = Object.keys(badgeStats).filter(badgeId => badgeId.startsWith(category + '-')).map(badgeId => ({
      id: badgeId,
      ...badgeStats[badgeId]
    })).sort((a, b) => {
      // Sort by level (extract number from badge ID)
      const aLevel = parseInt(a.id.match(/\d+/)?.[0] || '0');
      const bLevel = parseInt(b.id.match(/\d+/)?.[0] || '0');
      return aLevel - bLevel;
    });
    if (categoryBadges.length === 0) {
      return null;
    }

    // Get the last badge (highest level)
    const lastBadge = categoryBadges[categoryBadges.length - 1];
    const progress = lastBadge.progress || 0;
    const remaining = lastBadge.remaining || 0;
    return {
      badges: categoryBadges,
      progress,
      remaining
    };
  };

  /**
   * Render badge indicator.
   *
   * @param {Object} badge   Badge data.
   * @param {string} context Context (maintenance or content).
   * @return {JSX.Element} Badge indicator.
   */
  const renderBadgeIndicator = (badge, context) => {
    const remaining = badge.remaining || 0;
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
      className: "indicator",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("span", {
        className: "indicator-label",
        children: remaining === 0 ? '✔️' : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("span", {
          dangerouslySetInnerHTML: {
            __html: (() => {
              let formatStr;
              if (context === 'content') {
                formatStr = remaining === 1 ? /* translators: %s: number of posts remaining */
                '%s post to go' : /* translators: %s: number of posts remaining */
                '%s posts to go';
              } else {
                formatStr = remaining === 1 ? /* translators: %s: number of weeks remaining */
                '%s week to go' : /* translators: %s: number of weeks remaining */
                '%s weeks to go';
              }
              return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.sprintf)(formatStr, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.sprintf)('<span class="number">%s</span>', remaining));
            })()
          }
        })
      })
    }, badge.id);
  };

  /**
   * Render progress bar for a category.
   *
   * @param {string} category The badge category.
   * @return {JSX.Element} Progress bar component.
   */
  const renderProgressBar = category => {
    const badgeProgress = getBadgeProgress(category);
    if (!badgeProgress) {
      return null;
    }
    const {
      progress,
      badges
    } = badgeProgress;
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
      className: "progress-badges",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("span", {
        className: "badges-popover-progress-total",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("span", {
          style: {
            width: `${progress}%`
          }
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
        className: "indicators",
        children: badges.map(badge => renderBadgeIndicator(badge, category))
      })]
    });
  };
  const maintenanceProgress = getBadgeProgress('maintenance');
  const contentProgress = getBadgeProgress('content');
  const taskId = (0,_utils_taskIdResolver__WEBPACK_IMPORTED_MODULE_4__.resolveTaskId)(task, 'badge-streak');
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(_InteractiveTaskPopover__WEBPACK_IMPORTED_MODULE_3__["default"], {
    isOpen: true,
    taskId: taskId || 'badge-streak',
    task: task,
    onClose: onClose,
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
      className: "prpl-column prpl-column-content",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("h2", {
        className: "prpl-popover-title",
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('You are on the right track!', 'progress-planner')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("p", {
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Find out which badges to unlock next and become a Progress Planner Professional!', 'progress-planner')
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
      className: "prpl-column",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
        className: "prpl-widgets-container in-popover",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
          className: "prpl-widget-wrapper in-popover",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("h3", {
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Don't break your streak and stay active every week!", 'progress-planner')
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("p", {
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Execute at least one website maintenance task every week. That could be publishing content, adding content, updating a post, or updating a plugin.', 'progress-planner')
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("p", {
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Not able to work on your site for a week? Use your streak freeze!', 'progress-planner')
          }), isLoading ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("p", {
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Loading…', 'progress-planner')
          }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
            id: "popover-badge-streak-content",
            children: maintenanceProgress && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
              className: "badge-display",
              children: renderProgressBar('maintenance')
            })
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
          className: "prpl-widget-wrapper in-popover",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("h3", {
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Keep adding posts and pages', 'progress-planner')
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("p", {
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('The more you write, the sooner you unlock new badges. You can earn level 1 of this badge immediately after installing the plugin if you have written 20 or more blog posts.', 'progress-planner')
          }), isLoading ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("p", {
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Loading…', 'progress-planner')
          }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
            id: "popover-badge-streak-maintenance",
            children: contentProgress && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
              className: "badge-display",
              children: renderProgressBar('content')
            })
          })]
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
        className: "footer",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
          className: "string-freeze-explain",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("h2", {
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Streak freeze', 'progress-planner')
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("p", {
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Going on a holiday? Or don't have any time this week? You can skip your website maintenance for a maximum of one week. Your streak will continue afterward.", 'progress-planner')
          })]
        })
      })]
    })]
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

/***/ })

}]);
//# sourceMappingURL=BadgeStreakPopover.chunk.js.map