"use strict";
(globalThis["webpackChunkprogress_planner"] = globalThis["webpackChunkprogress_planner"] || []).push([["PermalinkStructurePopover"],{

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

/***/ "./assets/src/components/Popovers/PermalinkStructurePopover.js":
/*!*********************************************************************!*\
  !*** ./assets/src/components/Popovers/PermalinkStructurePopover.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PermalinkStructurePopover)
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
 * Permalink Structure Popover Component.
 *
 * Allows users to select a permalink structure.
 *
 * @param {Object}   props          Component props.
 * @param {Object}   props.task     The task object.
 * @param {Function} props.onSubmit Callback when form is submitted.
 * @param {Function} props.onClose  Callback when popover is closed.
 * @return {JSX.Element} The popover component.
 */







function PermalinkStructurePopover({
  task,
  onSubmit,
  onClose
}) {
  const [selectedStructure, setSelectedStructure] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const [customStructure, setCustomStructure] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const [structures, setStructures] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const [isLoading, setIsLoading] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [isFetchingStructures, setIsFetchingStructures] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(true);
  const [error, setError] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);

  /**
   * Load current permalink structure and available structures on mount.
   */
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    // Fetch current settings
    _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_2___default()({
      path: '/wp/v2/settings'
    }).then(settings => {
      const currentStructure = settings.permalink_structure || '';
      setSelectedStructure(currentStructure);
      setCustomStructure(currentStructure);
    }).catch(() => {
      // Ignore errors
    });

    // Fetch structures via AJAX
    const ajaxUrl = window.progressPlanner?.ajaxUrl || '/wp-admin/admin-ajax.php';
    const nonce = window.progressPlanner?.nonce || '';
    fetch(`${ajaxUrl}?action=prpl_get_permalink_structures&_ajax_nonce=${nonce}`, {
      credentials: 'same-origin'
    }).then(response => response.json()).then(data => {
      if (data.success && data.data) {
        setStructures(data.data);
      }
    }).catch(() => {
      // Fallback structures
      setStructures([]);
    }).finally(() => {
      setIsFetchingStructures(false);
    });
  }, []);

  /**
   * Handle radio button change.
   */
  const handleRadioChange = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(structure => {
    if (structure === 'custom') {
      setSelectedStructure('custom');
    } else {
      setSelectedStructure(structure);
    }
  }, []);

  /**
   * Handle form submission.
   */
  const handleSubmit = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(async e => {
    e.preventDefault();
    const structureToSubmit = selectedStructure === 'custom' ? customStructure : selectedStructure;
    if (!structureToSubmit) {
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const popoverId = `prpl-popover-${task.slug || task.id}`;
      await (0,_hooks_usePopoverForms__WEBPACK_IMPORTED_MODULE_4__.submitSiteSettings)({
        settingAPIKey: 'permalink_structure',
        setting: 'permalink_structure',
        popoverId,
        settingCallbackValue: () => structureToSubmit,
        value: structureToSubmit
      });
      if (onSubmit) {
        await onSubmit(task.id, task);
      }
    } catch (err) {
      setError((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Something went wrong. Please try again.', 'progress-planner'));
    } finally {
      setIsLoading(false);
    }
  }, [selectedStructure, customStructure, task, onSubmit]);
  const taskTitle = task.title?.rendered || task.title;
  const defaultStructures = structures.length > 0 ? structures : [{
    id: 'day-name',
    value: '/%year%/%monthnum%/%day%/%postname%/',
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Day and name', 'progress-planner')
  }, {
    id: 'month-name',
    value: '/%year%/%monthnum%/%postname%/',
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Month and name', 'progress-planner')
  }, {
    id: 'numeric',
    value: '/archives/%post_id%',
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Numeric', 'progress-planner')
  }, {
    id: 'post-name',
    value: '/%postname%/',
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Post name', 'progress-planner')
  }];
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(_InteractiveTaskPopover__WEBPACK_IMPORTED_MODULE_3__["default"], {
    isOpen: true,
    taskId: task.slug || task.id,
    task: task,
    onClose: onClose,
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
      className: "prpl-column prpl-column-content",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("h2", {
        className: "prpl-popover-title",
        children: taskTitle
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
      className: "prpl-column",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("form", {
        onSubmit: handleSubmit,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
          className: "radios",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("fieldset", {
            className: "prpl-structure-selection",
            children: isFetchingStructures ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("p", {
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Loading structures…', 'progress-planner')
            }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.Fragment, {
              children: [defaultStructures.map(structure => {
                const isChecked = selectedStructure === structure.value;
                return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
                  className: "prpl-radio-wrapper",
                  children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("label", {
                    className: "prpl-custom-radio",
                    htmlFor: `prpl-permalink-input-${structure.id}`,
                    "aria-label": structure.label,
                    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("input", {
                      id: `prpl-permalink-input-${structure.id}`,
                      name: "prpl_permalink_structure",
                      type: "radio",
                      value: structure.value,
                      checked: isChecked,
                      onChange: () => handleRadioChange(structure.value),
                      disabled: isLoading
                    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("span", {
                      className: "prpl-custom-control"
                    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
                      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("span", {
                        children: structure.label
                      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("code", {
                        style: {
                          display: 'block'
                        },
                        children: structure.value
                      })]
                    })]
                  })
                }, structure.id);
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
                className: "prpl-radio-wrapper",
                children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("label", {
                  className: "prpl-custom-radio",
                  htmlFor: "prpl_permalink_structure_custom_radio",
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("input", {
                    id: "prpl_permalink_structure_custom_radio",
                    name: "prpl_permalink_structure",
                    type: "radio",
                    value: "custom",
                    checked: selectedStructure === 'custom',
                    onChange: () => handleRadioChange('custom'),
                    disabled: isLoading
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("span", {
                    className: "prpl-custom-control"
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("span", {
                    children: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Custom:', 'progress-planner'), ' ', /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("span", {
                      className: "screen-reader-text",
                      children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('enter a custom permalink structure in the following field', 'progress-planner')
                    })]
                  })]
                })
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("label", {
                htmlFor: "prpl_custom_permalink_structure",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("span", {
                  className: "screen-reader-text",
                  children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Custom permalink structure:', 'progress-planner')
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
                  style: {
                    display: 'flex',
                    gap: '0.5rem',
                    alignItems: 'center'
                  },
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("code", {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      height: '1.25rem'
                    },
                    children: window.location.origin
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("input", {
                    type: "text",
                    name: "prpl_custom_permalink_structure",
                    id: "prpl_custom_permalink_structure",
                    value: customStructure,
                    onChange: e => setCustomStructure(e.target.value),
                    className: "small-text",
                    disabled: isLoading || selectedStructure !== 'custom'
                  })]
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
            disabled: isLoading || !selectedStructure,
            children: isLoading ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("span", {
              className: "spinner",
              style: {
                visibility: 'visible'
              }
            }) : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Set permalink structure', 'progress-planner')
          })
        })]
      })
    })]
  });
}

/***/ })

}]);
//# sourceMappingURL=PermalinkStructurePopover.chunk.js.map