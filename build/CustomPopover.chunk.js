"use strict";
(globalThis["webpackChunkprogress_planner"] = globalThis["webpackChunkprogress_planner"] || []).push([["CustomPopover"],{

/***/ "./assets/src/components/Popovers/CustomPopover.js":
/*!*********************************************************!*\
  !*** ./assets/src/components/Popovers/CustomPopover.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ CustomPopover)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/api-fetch */ "@wordpress/api-fetch");
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _InteractiveTaskPopover__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./InteractiveTaskPopover */ "./assets/src/components/Popovers/InteractiveTaskPopover.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__);
/**
 * Custom Popover Component.
 *
 * Handles complex custom submit handlers with form inputs when needed.
 *
 * @param {Object}   props                Component props.
 * @param {Object}   props.task           The task object.
 * @param {Function} props.onSubmit       Callback when form is submitted.
 * @param {Function} props.onClose        Callback when popover is closed.
 * @param {Function} props.onCustomSubmit Custom submit handler from PopoverManager.
 * @return {JSX.Element} The popover component.
 */






function CustomPopover({
  task,
  onSubmit,
  onClose,
  onCustomSubmit
}) {
  const taskId = task.slug || task.prpl_provider?.slug || task.id;
  const [isLoading, setIsLoading] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [error, setError] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);

  // Form state for rename-uncategorized-category
  const [categoryName, setCategoryName] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const [categorySlug, setCategorySlug] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('');

  // Form state for update-term-description
  const [termDescription, setTermDescription] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const [termId, setTermId] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [taxonomy, setTaxonomy] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('');

  /**
   * Load initial data for specific tasks.
   */
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (taskId === 'update-term-description') {
      // Get term data from task
      const targetTermId = task.target_term_id || task.prpl_task_data?.target_term_id;
      const targetTaxonomy = task.target_taxonomy || task.prpl_task_data?.target_taxonomy;
      if (targetTermId && targetTaxonomy) {
        setTermId(targetTermId);
        setTaxonomy(targetTaxonomy);

        // Fetch current term description
        const endpoint = targetTaxonomy === 'category' ? 'categories' : targetTaxonomy;
        _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_2___default()({
          path: `/wp/v2/${endpoint}/${targetTermId}`
        }).then(term => {
          setTermDescription(term.description || '');
        }).catch(() => {
          // Ignore errors
        });
      }
    } else if (taskId === 'rename-uncategorized-category') {
      // Fetch current category name
      const categoryId = task.prpl_task_data?.category_id || task.category_id;
      if (categoryId) {
        _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_2___default()({
          path: `/wp/v2/categories/${categoryId}`
        }).then(category => {
          setCategoryName(category.name || '');
          setCategorySlug(category.slug || '');
        }).catch(() => {
          // Ignore errors, use defaults
          setCategoryName((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Uncategorized', 'progress-planner'));
        });
      }
    }
  }, [taskId, task]);

  /**
   * Handle form submission.
   */
  const handleSubmit = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(async e => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const popoverId = `prpl-popover-${taskId}`;
      if (taskId === 'rename-uncategorized-category') {
        // Submit category rename via AJAX
        const ajaxUrl = window.prplDashboardConfig?.ajaxUrl || window.progressPlanner?.ajaxUrl || '/wp-admin/admin-ajax.php';
        const nonce = window.prplDashboardConfig?.nonce || window.progressPlanner?.nonce || '';
        const body = new URLSearchParams({
          action: 'prpl_interactive_task_submit_rename-uncategorized-category',
          _ajax_nonce: nonce,
          uncategorized_category_name: categoryName.trim(),
          uncategorized_category_slug: categorySlug.trim()
        });
        const response = await fetch(ajaxUrl, {
          method: 'POST',
          body,
          credentials: 'same-origin'
        });
        const data = await response.json();
        if (!data.success) {
          throw new Error(data.data?.message || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Failed to update category.', 'progress-planner'));
        }
      } else if (taskId === 'update-term-description') {
        // Submit term description via AJAX
        const ajaxUrl = window.prplDashboardConfig?.ajaxUrl || window.progressPlanner?.ajaxUrl || '/wp-admin/admin-ajax.php';
        const nonce = window.prplDashboardConfig?.nonce || window.progressPlanner?.nonce || '';
        const body = new URLSearchParams({
          action: 'prpl_interactive_task_submit_update-term-description',
          _ajax_nonce: nonce,
          term_id: termId,
          taxonomy,
          description: termDescription
        });
        const response = await fetch(ajaxUrl, {
          method: 'POST',
          body,
          credentials: 'same-origin'
        });
        const data = await response.json();
        if (!data.success) {
          throw new Error(data.data?.message || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Failed to update term description.', 'progress-planner'));
        }
      } else if (onCustomSubmit) {
        // For other tasks, use the custom submit handler
        await onCustomSubmit(taskId, popoverId);
      }
      if (onSubmit) {
        await onSubmit(task.id, task);
      }
    } catch (err) {
      setError(err.message || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Something went wrong. Please try again.', 'progress-planner'));
    } finally {
      setIsLoading(false);
    }
  }, [taskId, task, onSubmit, onCustomSubmit, categoryName, categorySlug, termId, taxonomy, termDescription]);
  const taskTitle = task.title?.rendered || task.title;
  const taskDescription = task.description?.rendered || task.description || '';

  // Render form inputs based on task type
  const renderFormInputs = () => {
    if (taskId === 'rename-uncategorized-category') {
      return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.Fragment, {
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("label", {
          htmlFor: "uncategorized_category_name",
          children: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Category Name', 'progress-planner'), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("input", {
            type: "text",
            id: "uncategorized_category_name",
            name: "uncategorized_category_name",
            value: categoryName,
            onChange: e => {
              setCategoryName(e.target.value);
              // Auto-generate slug from name
              const slug = e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
              setCategorySlug(slug);
            },
            disabled: isLoading,
            required: true
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("label", {
          htmlFor: "uncategorized_category_slug",
          children: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Category Slug', 'progress-planner'), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("input", {
            type: "text",
            id: "uncategorized_category_slug",
            name: "uncategorized_category_slug",
            value: categorySlug,
            onChange: e => setCategorySlug(e.target.value),
            disabled: isLoading,
            required: true
          })]
        })]
      });
    }
    if (taskId === 'update-term-description') {
      const termName = task.target_term_name || task.prpl_task_data?.target_term_name || '';
      return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.Fragment, {
        children: [termName && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("p", {
          children: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Term:', 'progress-planner'), ' ', /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("strong", {
            children: termName
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("label", {
          htmlFor: "term_description",
          children: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Description', 'progress-planner'), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("textarea", {
            id: "term_description",
            name: "description",
            value: termDescription,
            onChange: e => setTermDescription(e.target.value),
            disabled: isLoading,
            rows: 5
          })]
        })]
      });
    }

    // Default: no form inputs, just submit button
    return null;
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_InteractiveTaskPopover__WEBPACK_IMPORTED_MODULE_3__["default"], {
    isOpen: true,
    taskId: taskId,
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
        children: [renderFormInputs(), error && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("p", {
          className: "prpl-note prpl-note-error prpl-interactive-task-error-message",
          children: error
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
          className: "prpl-steps-nav-wrapper prpl-steps-nav-wrapper-align-left",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("button", {
            type: "submit",
            className: "prpl-button prpl-button-primary",
            disabled: isLoading || taskId === 'rename-uncategorized-category' && (!categoryName.trim() || !categorySlug.trim()),
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
//# sourceMappingURL=CustomPopover.chunk.js.map