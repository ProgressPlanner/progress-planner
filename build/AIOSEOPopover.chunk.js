"use strict";
(globalThis["webpackChunkprogress_planner"] = globalThis["webpackChunkprogress_planner"] || []).push([["AIOSEOPopover"],{

/***/ "./assets/src/components/Popovers/AIOSEOPopover.js":
/*!*********************************************************!*\
  !*** ./assets/src/components/Popovers/AIOSEOPopover.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ AIOSEOPopover)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _InteractiveTaskPopover__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./InteractiveTaskPopover */ "./assets/src/components/Popovers/InteractiveTaskPopover.js");
/* harmony import */ var _hooks_usePopoverForms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../hooks/usePopoverForms */ "./assets/src/hooks/usePopoverForms/index.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__);
/**
 * AIOSEO Popover Component.
 *
 * Generic popover for AIOSEO settings.
 *
 * @param {Object}   props          Component props.
 * @param {Object}   props.task     The task object.
 * @param {Function} props.onSubmit Callback when form is submitted.
 * @param {Function} props.onClose  Callback when popover is closed.
 * @return {JSX.Element} The popover component.
 */






function AIOSEOPopover({
  task,
  onSubmit,
  onClose
}) {
  const [isLoading, setIsLoading] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [error, setError] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);

  /**
   * Handle form submission.
   */
  const handleSubmit = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(async e => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const popoverId = `prpl-popover-${task.slug || task.id}`;
      const taskId = task.slug || task.prpl_provider?.slug || task.id;

      // Get config from POPOVER_CONFIG
      const configs = {
        'aioseo-author-archive': {
          setting: 'aioseo_options',
          settingPath: JSON.stringify(['searchAppearance', 'archives', 'author', 'show']),
          settingCallbackValue: () => false
        },
        'aioseo-date-archive': {
          setting: 'aioseo_options',
          settingPath: JSON.stringify(['searchAppearance', 'archives', 'date', 'show']),
          settingCallbackValue: () => false
        },
        'aioseo-media-pages': {
          setting: 'aioseo_options_dynamic',
          settingPath: JSON.stringify(['searchAppearance', 'postTypes', 'attachment', 'redirectAttachmentUrls']),
          settingCallbackValue: () => 'attachment'
        },
        'aioseo-crawl-settings-feed-authors': {
          setting: 'aioseo_options',
          settingPath: JSON.stringify(['searchAppearance', 'advanced', 'crawlCleanup', 'feeds', 'authors']),
          settingCallbackValue: () => false
        },
        'aioseo-crawl-settings-feed-comments': {
          // This task needs to update TWO settings.
          multiUpdate: true,
          updates: [{
            setting: 'aioseo_options',
            settingPath: JSON.stringify(['searchAppearance', 'advanced', 'crawlCleanup', 'feeds', 'globalComments']),
            value: false
          }, {
            setting: 'aioseo_options',
            settingPath: JSON.stringify(['searchAppearance', 'advanced', 'crawlCleanup', 'feeds', 'postComments']),
            value: false
          }]
        }
      };
      const config = configs[taskId];
      if (config) {
        if (config.multiUpdate && config.updates) {
          // Handle multi-update case (e.g., Feed Comments).
          for (const update of config.updates) {
            await (0,_hooks_usePopoverForms__WEBPACK_IMPORTED_MODULE_3__.submitPluginSettings)({
              setting: update.setting,
              settingPath: update.settingPath,
              popoverId,
              value: update.value
            });
          }
        } else {
          await (0,_hooks_usePopoverForms__WEBPACK_IMPORTED_MODULE_3__.submitPluginSettings)({
            setting: config.setting,
            settingPath: config.settingPath,
            popoverId,
            settingCallbackValue: config.settingCallbackValue,
            value: config.settingCallbackValue()
          });
        }
      }
      if (onSubmit) {
        await onSubmit(task.id, task);
      }
    } catch (err) {
      setError((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Something went wrong. Please try again.', 'progress-planner'));
    } finally {
      setIsLoading(false);
    }
  }, [task, onSubmit]);
  const taskTitle = task.title?.rendered || task.title;
  const taskDescription = task.description?.rendered || task.description || '';
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_InteractiveTaskPopover__WEBPACK_IMPORTED_MODULE_2__["default"], {
    isOpen: true,
    taskId: task.slug || task.id,
    task: task,
    onClose: onClose,
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
      className: "prpl-column prpl-column-content",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("h2", {
        className: "prpl-popover-title",
        children: taskTitle
      }), taskDescription && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("p", {
        children: taskDescription
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
      className: "prpl-column",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("form", {
        onSubmit: handleSubmit,
        children: [error && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("p", {
          className: "prpl-note prpl-note-error prpl-interactive-task-error-message",
          children: error
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
          className: "prpl-steps-nav-wrapper prpl-steps-nav-wrapper-align-left",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("button", {
            type: "submit",
            className: "prpl-button prpl-button-primary",
            disabled: isLoading,
            children: isLoading ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("span", {
              className: "spinner",
              style: {
                visibility: 'visible'
              }
            }) : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Submit', 'progress-planner')
          })
        })]
      })
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
//# sourceMappingURL=AIOSEOPopover.chunk.js.map