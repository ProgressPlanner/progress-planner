"use strict";
(globalThis["webpackChunkprogress_planner"] = globalThis["webpackChunkprogress_planner"] || []).push([["SubscribeFormPopover"],{

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

/***/ "./assets/src/components/Popovers/SubscribeFormPopover.js":
/*!****************************************************************!*\
  !*** ./assets/src/components/Popovers/SubscribeFormPopover.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ SubscribeFormPopover)
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
 * Subscribe Form Popover Component.
 *
 * Handles subscription form for weekly emails.
 *
 * @param {Object}   props          Component props.
 * @param {Object}   props.task     The task object.
 * @param {Function} props.onSubmit Callback when form is submitted.
 * @param {Function} props.onClose  Callback when popover is closed.
 * @return {JSX.Element} The popover component.
 */







function SubscribeFormPopover({
  task,
  onSubmit,
  onClose
}) {
  const [name, setName] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const [email, setEmail] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const [isLoading, setIsLoading] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [error, setError] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [success, setSuccess] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);

  /**
   * Load initial data from current user.
   */
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    // Get current user data from WordPress
    const currentUser = window.wp?.data?.select('core')?.getCurrentUser?.();
    if (currentUser) {
      if (currentUser.first_name) {
        setName(currentUser.first_name);
      }
      if (currentUser.email) {
        setEmail(currentUser.email);
      }
    }
  }, []);

  /**
   * Handle form submission.
   */
  const handleSubmit = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(async e => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Please fill in all fields.', 'progress-planner'));
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      // Get site URL and timezone offset
      const siteUrl = window.location.origin;
      const timezoneOffset = new Date().getTimezoneOffset() / -60; // Convert to hours

      const response = await _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_2___default()({
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
      if (response.success) {
        setSuccess(true);
        // Call onSubmit after a short delay to show success message
        setTimeout(() => {
          if (onSubmit) {
            onSubmit(task.id, task);
          }
        }, 1500);
      } else {
        throw new Error(response.message || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Failed to submit subscription.', 'progress-planner'));
      }
    } catch (err) {
      setError(err.message || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Something went wrong. Please try again.', 'progress-planner'));
    } finally {
      setIsLoading(false);
    }
  }, [name, email, task, onSubmit]);
  const taskTitle = task.title?.rendered || task.title || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Subscribe to weekly emails', 'progress-planner');
  const taskId = (0,_utils_taskIdResolver__WEBPACK_IMPORTED_MODULE_4__.resolveTaskId)(task, 'subscribe-form');
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(_InteractiveTaskPopover__WEBPACK_IMPORTED_MODULE_3__["default"], {
    isOpen: true,
    taskId: taskId || 'subscribe-form',
    task: task,
    onClose: onClose,
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
      className: "prpl-column prpl-column-content",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("h2", {
        className: "prpl-popover-title",
        children: taskTitle
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("p", {
        dangerouslySetInnerHTML: {
          __html: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.sprintf)(/* translators: %s: progressplanner.com link */
          (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("We can send you weekly emails with your own to-dos, your activity stats and nudges to keep you working on your site. To do this, we'll create an account for you on %s.", 'progress-planner'), '<a href="https://prpl.fyi/home" target="_blank">progressplanner.com</a>')
        }
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
      className: "prpl-column",
      children: success ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
        className: "prpl-note prpl-note-success",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("p", {
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Subscription successful! You will receive weekly emails.', 'progress-planner')
        })
      }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("form", {
        id: "prpl-settings-license-form",
        onSubmit: handleSubmit,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
          className: "prpl-form-fields",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("label", {
            htmlFor: "prpl-subscribe-name",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("span", {
              className: "prpl-label-content",
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('First name', 'progress-planner')
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("input", {
              id: "prpl-subscribe-name",
              type: "text",
              name: "name",
              className: "prpl-input",
              value: name,
              onChange: e => setName(e.target.value),
              disabled: isLoading,
              required: true
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("label", {
            htmlFor: "prpl-subscribe-email",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("span", {
              className: "prpl-label-content",
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Email', 'progress-planner')
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("input", {
              id: "prpl-subscribe-email",
              type: "email",
              name: "email",
              className: "prpl-input",
              value: email,
              onChange: e => setEmail(e.target.value),
              disabled: isLoading,
              required: true
            })]
          })]
        }), error && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("p", {
          className: "prpl-note prpl-note-error prpl-interactive-task-error-message",
          children: error
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("button", {
          id: "submit-license-key",
          type: "submit",
          className: "prpl-button prpl-button-primary",
          disabled: isLoading || !name.trim() || !email.trim(),
          children: isLoading ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("span", {
            className: "spinner",
            style: {
              visibility: 'visible'
            }
          }) : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Subscribe', 'progress-planner')
        })]
      })
    })]
  });
}

/***/ })

}]);
//# sourceMappingURL=SubscribeFormPopover.chunk.js.map