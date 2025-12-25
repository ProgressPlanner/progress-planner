"use strict";
(globalThis["webpackChunkprogress_planner"] = globalThis["webpackChunkprogress_planner"] || []).push([["ImprovePdfHandlingPopover"],{

/***/ "./assets/src/components/InstallPluginButton.js":
/*!******************************************************!*\
  !*** ./assets/src/components/InstallPluginButton.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ InstallPluginButton)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/api-fetch */ "@wordpress/api-fetch");
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);
/**
 * Install Plugin Button Component.
 *
 * Replaces the prpl-install-plugin web component.
 * Handles plugin installation and activation.
 *
 * @param {Object}  props              Component props.
 * @param {string}  props.pluginSlug   The plugin slug.
 * @param {string}  props.pluginName   The plugin name.
 * @param {string}  props.action       The action: 'install' or 'activate'.
 * @param {boolean} props.completeTask Whether to complete the task after activation.
 * @param {string}  props.providerId   The provider ID for task completion.
 * @param {string}  props.className    CSS class name for the button.
 * @return {JSX.Element} The install plugin button component.
 */





function InstallPluginButton({
  pluginSlug,
  pluginName,
  action = 'install',
  completeTask = true,
  providerId,
  className = 'prpl-button-link'
}) {
  const [currentAction, setCurrentAction] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(action);
  const [isLoading, setIsLoading] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [status, setStatus] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('idle'); // idle, installing, activating, activated

  /**
   * Install plugin.
   */
  const installPlugin = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(async () => {
    setIsLoading(true);
    setStatus('installing');
    try {
      await _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_2___default()({
        path: '/progress-planner/v1/plugins/install',
        method: 'POST',
        data: {
          plugin_slug: pluginSlug
        }
      });

      // After installation, activate the plugin
      await activatePlugin();
    } catch (err) {
      console.error('Error installing plugin:', err); // eslint-disable-line no-console
      setStatus('idle');
      setIsLoading(false);
    }
  }, [pluginSlug, activatePlugin]);

  /**
   * Activate plugin.
   */
  const activatePlugin = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(async () => {
    setStatus('activating');
    try {
      await _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_2___default()({
        path: '/progress-planner/v1/plugins/activate',
        method: 'POST',
        data: {
          plugin_slug: pluginSlug
        }
      });
      setStatus('activated');
      setCurrentAction('activated');

      // Complete task if needed
      if (completeTask && providerId) {
        // Trigger task completion via hook
        // This will be handled by the parent component or PopoverManager
        if (window.prplSuggestedTask?.maybeComplete) {
          // Find the task element and complete it
          const taskElement = document.querySelector(`#prpl-suggested-tasks-list .prpl-suggested-task[data-task-id="${providerId}"]`);
          if (taskElement) {
            const postId = parseInt(taskElement.dataset.postId);
            if (postId) {
              window.prplSuggestedTask.maybeComplete(postId);
            }
          }
        }
      }
    } catch (err) {
      console.error('Error activating plugin:', err); // eslint-disable-line no-console
      setStatus('idle');
    } finally {
      setIsLoading(false);
    }
  }, [pluginSlug, completeTask, providerId]);

  /**
   * Handle button click.
   */
  const handleClick = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    if (currentAction === 'install') {
      installPlugin();
    } else if (currentAction === 'activate') {
      activatePlugin();
    }
  }, [currentAction, installPlugin, activatePlugin]);

  // Get button text based on status
  const getButtonText = () => {
    if (status === 'activated') {
      return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Activated', 'progress-planner');
    }
    if (status === 'activating') {
      return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Activating…', 'progress-planner');
    }
    if (status === 'installing') {
      return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Installing…', 'progress-planner');
    }
    if (currentAction === 'install') {
      return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.sprintf)(
      // translators: %s is the plugin name.
      (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Install %s', 'progress-planner'), pluginName);
    }
    return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.sprintf)(
    // translators: %s is the plugin name.
    (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Activate %s', 'progress-planner'), pluginName);
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("button", {
    type: "button",
    className: className,
    onClick: handleClick,
    disabled: isLoading || status === 'activated',
    children: [(status === 'installing' || status === 'activating') && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("span", {
      className: "prpl-install-button-loader",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("span", {
        className: "spinner",
        style: {
          visibility: 'visible'
        }
      })
    }), getButtonText()]
  });
}

/***/ }),

/***/ "./assets/src/components/Popovers/ImprovePdfHandlingPopover.js":
/*!*********************************************************************!*\
  !*** ./assets/src/components/Popovers/ImprovePdfHandlingPopover.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ImprovePdfHandlingPopover)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _InteractiveTaskPopover__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./InteractiveTaskPopover */ "./assets/src/components/Popovers/InteractiveTaskPopover.js");
/* harmony import */ var _InstallPluginButton__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../InstallPluginButton */ "./assets/src/components/InstallPluginButton.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__);
/**
 * Improve PDF Handling Popover Component.
 *
 * Multi-step popover for improving PDF handling with plugin installation.
 *
 * @param {Object}   props          Component props.
 * @param {Object}   props.task     The task object.
 * @param {Function} props.onSubmit Callback when form is submitted.
 * @param {Function} props.onClose  Callback when popover is closed.
 * @return {JSX.Element} The popover component.
 */






const STEP_FIRST = 'first';
const STEP_PDF_XML_SITEMAP = 'pdf-xml-sitemap';
const STEP_SUCCESS = 'success';
function ImprovePdfHandlingPopover({
  task,
  onSubmit,
  onClose
}) {
  const [currentStep, setCurrentStep] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(STEP_FIRST);
  const [canShowPdfSitemapStep, setCanShowPdfSitemapStep] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [isPdfSitemapInstalled, setIsPdfSitemapInstalled] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);

  /**
   * Check plugin status on mount.
   *
   * Note: This should ideally check plugin status via AJAX or from task data.
   * The old PHP template checked:
   * - ! is_multisite() && current_user_can( 'install_plugins' )
   * - is_plugin_activated( 'wordpress-seo' )
   * - ! is_plugin_activated( 'pdf-library' )
   * - is_plugin_installed( 'pdf-sitemap' )
   */
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    // Check if we can show the PDF sitemap step
    // This requires: not multisite, user can install plugins, Yoast SEO is active, PDF Library is not active
    const checkPluginStatus = async () => {
      try {
        // Check if we're on multisite
        const isMultisite = window.prplDashboardConfig?.isMultisite || false;
        const canInstallPlugins = window.prplDashboardConfig?.canInstallPlugins !== false;
        if (isMultisite || !canInstallPlugins) {
          setCanShowPdfSitemapStep(false);
          return;
        }

        // TODO: Fetch plugin status via AJAX endpoint
        // For now, check from localized data if available
        // The Improve_Pdf_Handling provider should localize this data or
        // we should create an AJAX endpoint to check plugin status
        const yoastActive = window.prplDashboardConfig?.plugins?.yoast || task.prpl_task_data?.plugins?.yoast || false;
        const pdfLibraryActive = window.prplDashboardConfig?.plugins?.pdfLibrary || task.prpl_task_data?.plugins?.pdfLibrary || false;
        setCanShowPdfSitemapStep(yoastActive && !pdfLibraryActive);

        // Check if PDF sitemap is installed
        const pdfSitemapInstalled = window.prplDashboardConfig?.plugins?.pdfSitemap || task.prpl_task_data?.plugins?.pdfSitemap || false;
        setIsPdfSitemapInstalled(pdfSitemapInstalled);
      } catch (err) {
        // If we can't check, default to not showing the step
        setCanShowPdfSitemapStep(false);
      }
    };
    checkPluginStatus();
  }, [task]);

  /**
   * Handle complete task.
   */
  const handleComplete = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(async () => {
    if (onSubmit) {
      await onSubmit(task.id, task);
    }
  }, [task, onSubmit]);

  // Render current step
  const renderStep = () => {
    switch (currentStep) {
      case STEP_FIRST:
        return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.Fragment, {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
            className: "prpl-column prpl-column-content",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("h2", {
              className: "prpl-popover-title",
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Improve your site's PDF handling", 'progress-planner')
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("p", {
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('We have detected that your site has quite a few PDF files.', 'progress-planner')
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("p", {
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('It would be great if you could improve the way your site handles them.', 'progress-planner')
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
            className: "prpl-column",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("p", {
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Do you need to show a folder structure with the files to make them more discoverable?', 'progress-planner')
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("p", {
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('If so, you can improve the way your site handles them by adding a folder structure.', 'progress-planner')
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("p", {
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("a", {
                href: "https://barn2.com/blog/wordpress-pdf-library-plugin/",
                target: "_blank",
                rel: "noopener noreferrer",
                children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Learn more about the PDF Library plugin', 'progress-planner')
              })
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
              className: "prpl-steps-nav-wrapper",
              children: canShowPdfSitemapStep ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("button", {
                type: "button",
                className: "prpl-button prpl-button-step",
                onClick: () => setCurrentStep(STEP_PDF_XML_SITEMAP),
                children: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Next step', 'progress-planner'), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("span", {
                  className: "dashicons dashicons-arrow-right-alt2"
                })]
              }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("button", {
                type: "button",
                className: "prpl-button prpl-button-step",
                onClick: handleComplete,
                children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Collect your point!', 'progress-planner')
              })
            })]
          })]
        });
      case STEP_PDF_XML_SITEMAP:
        return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.Fragment, {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
            className: "prpl-column prpl-column-content",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("h2", {
              className: "prpl-popover-title",
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Do you want these PDFs to be found in search engines better?', 'progress-planner')
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("p", {
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Adding an XML sitemap for your PDF files helps search engines discover and index them more effectively. This can improve visibility in search results and drive more organic traffic to your valuable PDF content.', 'progress-planner')
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
            className: "prpl-column",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("p", {
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('XML Sitemap for PDFs for Yoast SEO', 'progress-planner')
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("p", {
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('This plugin adds an XML sitemap for PDFs. It adds this XML sitemap to the sitemap_index.xml that Yoast SEO generates.', 'progress-planner')
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_InstallPluginButton__WEBPACK_IMPORTED_MODULE_3__["default"], {
                pluginSlug: "pdf-sitemap",
                pluginName: "XML Sitemap for PDFs for Yoast SEO",
                action: isPdfSitemapInstalled ? 'activate' : 'install',
                completeTask: false,
                providerId: task.prpl_provider?.slug || task.slug || task.id
              })
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
              className: "prpl-steps-nav-wrapper",
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("button", {
                type: "button",
                className: "prpl-button prpl-button-step",
                onClick: () => setCurrentStep(STEP_SUCCESS),
                children: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Next step', 'progress-planner'), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("span", {
                  className: "dashicons dashicons-arrow-right-alt2"
                })]
              })
            })]
          })]
        });
      case STEP_SUCCESS:
        return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.Fragment, {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
            className: "prpl-column prpl-column-content",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("h2", {
              className: "prpl-popover-title",
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Your PDF handling is improved!', 'progress-planner')
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("p", {
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Great, you improved the way your site handles PDFs! This indicates PDF handling is set up properly on your website.', 'progress-planner')
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
            className: "prpl-column",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("p", {
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Celebrate this achievement!', 'progress-planner')
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
              className: "prpl-steps-nav-wrapper",
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("button", {
                type: "button",
                className: "prpl-button prpl-button-step",
                onClick: handleComplete,
                children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Collect your point!', 'progress-planner')
              })
            })]
          })]
        });
      default:
        return null;
    }
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_InteractiveTaskPopover__WEBPACK_IMPORTED_MODULE_2__["default"], {
    isOpen: true,
    taskId: task.slug || task.id,
    task: task,
    onClose: onClose,
    children: renderStep()
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
//# sourceMappingURL=ImprovePdfHandlingPopover.chunk.js.map