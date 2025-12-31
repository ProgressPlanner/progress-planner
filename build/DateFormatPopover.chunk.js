"use strict";
(globalThis["webpackChunkprogress_planner"] = globalThis["webpackChunkprogress_planner"] || []).push([["DateFormatPopover"],{

/***/ "./assets/src/components/Popovers/DateFormatPopover.js":
/*!*************************************************************!*\
  !*** ./assets/src/components/Popovers/DateFormatPopover.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ DateFormatPopover)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/api-fetch */ "@wordpress/api-fetch");
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _InteractiveTaskPopover__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./InteractiveTaskPopover */ "./assets/src/components/Popovers/InteractiveTaskPopover.js");
/* harmony import */ var _hooks_usePopoverForms__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../hooks/usePopoverForms */ "./assets/src/hooks/usePopoverForms/index.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__);
/**
 * Date Format Popover Component.
 *
 * Allows users to select a date format with live preview.
 *
 * @param {Object}   props          Component props.
 * @param {Object}   props.task     The task object.
 * @param {Function} props.onSubmit Callback when form is submitted.
 * @param {Function} props.onClose  Callback when popover is closed.
 * @param {Object}   props.config   Widget configuration.
 * @return {JSX.Element} The popover component.
 */







function DateFormatPopover({
  task,
  onSubmit,
  onClose,
  config = {}
}) {
  const [selectedFormat, setSelectedFormat] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const [customFormat, setCustomFormat] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const [preview, setPreview] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const [dateFormats, setDateFormats] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const [isLoading, setIsLoading] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [isFetchingFormats, setIsFetchingFormats] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(true);
  const [error, setError] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const debounceTimeoutRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);

  /**
   * Load current date format and available formats on mount.
   */
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    // Fetch current settings
    _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_2___default()({
      path: '/wp/v2/settings'
    }).then(settings => {
      const currentFormat = settings.date_format || 'F j, Y';
      setSelectedFormat(currentFormat);
      setCustomFormat(currentFormat);
      updatePreview(currentFormat);
    }).catch(() => {
      // Ignore errors
    });

    // Fetch date formats via AJAX
    const ajaxUrl = config?.ajaxUrl || window.progressPlanner?.ajaxUrl || '/wp-admin/admin-ajax.php';
    const nonce = config?.nonce || window.progressPlanner?.nonce || '';
    fetch(`${ajaxUrl}?action=prpl_get_date_formats&_ajax_nonce=${nonce}`, {
      credentials: 'same-origin'
    }).then(response => response.json()).then(data => {
      if (data.success && data.data) {
        setDateFormats(data.data);
      } else {
        // Fallback formats
        setDateFormats(['F j, Y', 'Y-m-d', 'm/d/Y', 'd/m/Y', 'd.m.Y']);
      }
    }).catch(() => {
      // Fallback formats
      setDateFormats(['F j, Y', 'Y-m-d', 'm/d/Y', 'd/m/Y', 'd.m.Y']);
    }).finally(() => {
      setIsFetchingFormats(false);
    });
  }, [config, updatePreview]);

  /**
   * Update preview via AJAX.
   */
  const updatePreview = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(format => {
    if (!format) {
      return;
    }
    clearTimeout(debounceTimeoutRef.current);
    debounceTimeoutRef.current = setTimeout(async () => {
      const ajaxUrl = config?.ajaxUrl || window.progressPlanner?.ajaxUrl || '/wp-admin/admin-ajax.php';
      const nonce = config?.nonce || window.progressPlanner?.nonce || '';
      try {
        const response = await fetch(`${ajaxUrl}?action=prpl_date_format_preview&format=${encodeURIComponent(format)}&_ajax_nonce=${nonce}`, {
          credentials: 'same-origin'
        });
        const data = await response.json();
        if (data.success && data.data) {
          setPreview(data.data);
        }
      } catch {
        // Preview update failed, ignore
      }
    }, 300);
  }, [config]);

  /**
   * Handle radio button change.
   */
  const handleRadioChange = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(format => {
    if (format === 'custom') {
      setSelectedFormat('custom');
    } else {
      setSelectedFormat(format);
      updatePreview(format);
    }
  }, [updatePreview]);

  /**
   * Handle custom input change.
   */
  const handleCustomInputChange = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(e => {
    const value = e.target.value;
    setCustomFormat(value);
    if (selectedFormat === 'custom') {
      updatePreview(value);
    }
  }, [selectedFormat, updatePreview]);

  /**
   * Handle form submission.
   */
  const handleSubmit = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(async e => {
    e.preventDefault();
    const formatToSubmit = selectedFormat === 'custom' ? customFormat : selectedFormat;
    if (!formatToSubmit) {
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const popoverId = `prpl-popover-${task.slug || task.id}`;
      await (0,_hooks_usePopoverForms__WEBPACK_IMPORTED_MODULE_4__.submitSiteSettings)({
        settingAPIKey: 'date_format',
        setting: 'date_format',
        popoverId,
        settingCallbackValue: () => formatToSubmit,
        value: formatToSubmit
      });
      if (onSubmit) {
        await onSubmit(task.id, task);
      }
    } catch (err) {
      setError((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Something went wrong. Please try again.', 'progress-planner'));
    } finally {
      setIsLoading(false);
    }
  }, [selectedFormat, customFormat, task, onSubmit]);

  /**
   * Cleanup debounce timeout.
   */
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);
  const taskTitle = task.title?.rendered || task.title;
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(_InteractiveTaskPopover__WEBPACK_IMPORTED_MODULE_3__["default"], {
    isOpen: true,
    taskId: task.slug || task.id,
    task: task,
    onClose: onClose,
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
      className: "prpl-column prpl-column-content",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("h2", {
        className: "prpl-popover-title",
        children: taskTitle
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("p", {
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Choosing the right date format helps your visitors instantly understand when something was published without confusion or guessing. It also makes your site feel more familiar and trustworthy, especially if your audience is local.', 'progress-planner')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("p", {
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('By setting the correct format, you make sure dates show up clearly both in your dashboard and on your live site.', 'progress-planner')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("p", {
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Tip: Pick the format that matches what your audience expects.', 'progress-planner')
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
      className: "prpl-column",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("form", {
        onSubmit: handleSubmit,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
          className: "radios",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("fieldset", {
            children: isFetchingFormats ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("p", {
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Loading formats…', 'progress-planner')
            }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.Fragment, {
              children: [dateFormats.map(format => {
                const isChecked = selectedFormat === format;
                return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
                  className: "prpl-radio-wrapper",
                  children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("label", {
                    className: "prpl-custom-radio",
                    htmlFor: `date_format_${format}`,
                    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("input", {
                      type: "radio",
                      id: `date_format_${format}`,
                      name: "date_format",
                      value: format,
                      checked: isChecked,
                      onChange: () => handleRadioChange(format),
                      disabled: isLoading
                    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("span", {
                      className: "prpl-custom-control"
                    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("span", {
                      className: "date-time-text format-i18n",
                      children: preview || format
                    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("code", {
                      children: format
                    })]
                  })
                }, format);
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
                className: "prpl-radio-wrapper",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("label", {
                  className: "prpl-custom-radio",
                  htmlFor: "date_format_custom_radio",
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("input", {
                    type: "radio",
                    name: "date_format",
                    id: "date_format_custom_radio",
                    value: "custom",
                    checked: selectedFormat === 'custom',
                    onChange: () => handleRadioChange('custom'),
                    disabled: isLoading
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("span", {
                    className: "prpl-custom-control"
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("span", {
                    className: "date-time-text date-time-custom-text",
                    children: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Custom:', 'progress-planner'), ' ', /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("span", {
                      className: "screen-reader-text",
                      children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('enter a custom date format in the following field', 'progress-planner')
                    })]
                  })]
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("label", {
                  htmlFor: "date_format_custom",
                  className: "screen-reader-text",
                  children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Custom date format:', 'progress-planner')
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("input", {
                  type: "text",
                  name: "date_format_custom",
                  id: "date_format_custom",
                  value: customFormat,
                  onChange: handleCustomInputChange,
                  className: "small-text",
                  disabled: isLoading || selectedFormat !== 'custom'
                })]
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("label", {
                htmlFor: "date_format_custom",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("span", {
                  className: "screen-reader-text",
                  children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Custom date format:', 'progress-planner')
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("input", {
                  type: "text",
                  id: "date_format_custom",
                  name: "date_format_custom",
                  value: customFormat,
                  onChange: handleCustomInputChange,
                  className: "small-text",
                  disabled: isLoading || selectedFormat !== 'custom'
                })]
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("p", {
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("strong", {
                  children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Preview:', 'progress-planner')
                }), ' ', /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("span", {
                  className: "example",
                  children: preview
                }), isLoading && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("span", {
                  className: "spinner"
                })]
              })]
            })
          })
        }), error && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("p", {
          className: "prpl-note prpl-note-error prpl-interactive-task-error-message",
          children: error
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
          className: "prpl-steps-nav-wrapper prpl-steps-nav-wrapper-align-left",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("button", {
            type: "submit",
            className: "prpl-button prpl-button-primary",
            disabled: isLoading || !selectedFormat,
            children: isLoading ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("span", {
              className: "spinner",
              style: {
                visibility: 'visible'
              }
            }) : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Set date format', 'progress-planner')
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
//# sourceMappingURL=DateFormatPopover.chunk.js.map