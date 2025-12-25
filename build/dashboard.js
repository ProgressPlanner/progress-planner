"use strict";
(globalThis["webpackChunkprogress_planner"] = globalThis["webpackChunkprogress_planner"] || []).push([["dashboard"],{

/***/ "./assets/src/components/Dashboard/DashboardHeader.js":
/*!************************************************************!*\
  !*** ./assets/src/components/Dashboard/DashboardHeader.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ DashboardHeader)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__);
/**
 * DashboardHeader Component
 *
 * Header component with logo, tour button, subscribe form, and range/frequency selectors.
 */




/**
 * DashboardHeader component.
 *
 * @param {Object} props        - Component props.
 * @param {Object} props.config - Dashboard configuration.
 * @return {JSX.Element} The DashboardHeader component.
 */

function DashboardHeader({
  config
}) {
  const {
    licenseKey,
    branding = {},
    rangeOptions = [],
    frequencyOptions = []
  } = config;
  const [range, setRange] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(config.currentRange || '-6 months');
  const [frequency, setFrequency] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(config.currentFrequency || 'monthly');

  /**
   * Handle range selector change.
   * @param {Event} e - Change event.
   */
  const handleRangeChange = e => {
    const newRange = e.target.value;
    setRange(newRange);
    const url = new URL(window.location.href);
    url.searchParams.set('range', newRange);
    window.location.href = url.href;
  };

  /**
   * Handle frequency selector change.
   * @param {Event} e - Change event.
   */
  const handleFrequencyChange = e => {
    const newFrequency = e.target.value;
    setFrequency(newFrequency);
    const url = new URL(window.location.href);
    url.searchParams.set('frequency', newFrequency);
    window.location.href = url.href;
  };

  // Tour button click is handled by tour.js script which is enqueued separately.
  // The button just needs to exist in the DOM with the correct ID.

  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
    className: "prpl-header",
    style: {
      marginBottom: '2rem',
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
      className: "prpl-header-logo",
      children: branding.logoHtml && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
        dangerouslySetInnerHTML: {
          __html: branding.logoHtml
        }
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
      className: "prpl-header-right",
      style: {
        display: 'flex',
        gap: 'var(--prpl-padding)',
        alignItems: 'center'
      },
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("button", {
        className: "prpl-info-icon",
        id: "prpl-start-tour-icon-button",
        type: "button",
        style: {
          width: '2rem',
          height: '2rem',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0.4em',
          color: 'var(--prpl-color-ui-icon)',
          cursor: 'pointer',
          backgroundColor: '#fff',
          border: '1px solid var(--prpl-color-ui-icon)',
          borderRadius: 'var(--prpl-border-radius)'
        },
        onMouseEnter: e => {
          e.target.style.color = 'var(--prpl-color-ui-icon-hover)';
          e.target.style.borderColor = 'var(--prpl-color-ui-icon-hover)';
          e.target.style.backgroundColor = 'var(--prpl-color-ui-icon-hover-fill)';
        },
        onMouseLeave: e => {
          e.target.style.color = 'var(--prpl-color-ui-icon)';
          e.target.style.borderColor = 'var(--prpl-color-ui-icon)';
          e.target.style.backgroundColor = '#fff';
        },
        children: [branding.tourIconHtml && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("span", {
          dangerouslySetInnerHTML: {
            __html: branding.tourIconHtml
          }
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("span", {
          className: "screen-reader-text",
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Start tour', 'progress-planner')
        })]
      }), licenseKey === 'no-license' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.Fragment, {
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("button", {
          className: "prpl-info-icon",
          type: "button",
          style: {
            width: '2rem',
            height: '2rem',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0.4em',
            color: 'var(--prpl-color-ui-icon)',
            cursor: 'pointer',
            backgroundColor: '#fff',
            border: '1px solid var(--prpl-color-ui-icon)',
            borderRadius: 'var(--prpl-border-radius)'
          },
          onMouseEnter: e => {
            e.target.style.color = 'var(--prpl-color-ui-icon-hover)';
            e.target.style.borderColor = 'var(--prpl-color-ui-icon-hover)';
            e.target.style.backgroundColor = 'var(--prpl-color-ui-icon-hover-fill)';
          },
          onMouseLeave: e => {
            e.target.style.color = 'var(--prpl-color-ui-icon)';
            e.target.style.borderColor = 'var(--prpl-color-ui-icon)';
            e.target.style.backgroundColor = '#fff';
          },
          onClick: () => {
            // Trigger React popover via WordPress hook.
            if (typeof wp !== 'undefined' && wp.hooks && wp.hooks.doAction) {
              const task = {
                id: 'subscribe-form',
                slug: 'subscribe-form',
                title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Subscribe to weekly emails', 'progress-planner')
              };
              wp.hooks.doAction('prpl.popover.open', 'subscribe-form', task);
            } else {
              // Fallback: try to show popover if it exists in DOM.
              const popover = document.getElementById('prpl-popover-subscribe-form');
              if (popover && typeof popover.showPopover === 'function') {
                popover.showPopover();
              }
            }
          },
          children: [branding.registerIconHtml && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("span", {
            dangerouslySetInnerHTML: {
              __html: branding.registerIconHtml
            }
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("span", {
            className: "screen-reader-text",
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Subscribe', 'progress-planner')
          })]
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
        className: "prpl-header-select-range",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("label", {
          htmlFor: "prpl-select-range",
          className: "screen-reader-text",
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Select range:', 'progress-planner')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("select", {
          id: "prpl-select-range",
          value: range,
          onChange: handleRangeChange,
          children: rangeOptions.map(option => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("option", {
            value: option.value,
            children: option.label
          }, option.value))
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("label", {
          htmlFor: "prpl-select-frequency",
          className: "screen-reader-text",
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Select frequency:', 'progress-planner')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("select", {
          id: "prpl-select-frequency",
          value: frequency,
          onChange: handleFrequencyChange,
          children: frequencyOptions.map(option => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("option", {
            value: option.value,
            children: option.label
          }, option.value))
        })]
      })]
    })]
  });
}

/***/ }),

/***/ "./assets/src/components/Dashboard/DashboardWidgets.js":
/*!*************************************************************!*\
  !*** ./assets/src/components/Dashboard/DashboardWidgets.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ DashboardWidgets)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/hooks */ "@wordpress/hooks");
/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_hooks__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _utils_widgetRegistry__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../utils/widgetRegistry */ "./assets/src/utils/widgetRegistry/index.js");
/* harmony import */ var _ErrorBoundary__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../ErrorBoundary */ "./assets/src/components/ErrorBoundary/index.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__);
/**
 * DashboardWidgets Component
 *
 * Renders all dashboard widgets in a grid layout.
 * Widgets are registered via WordPress hooks and collected from the registry.
 */






/**
 * Widget wrapper component.
 *
 * @param {Object}      props                 - Component props.
 * @param {string}      props.id              - Widget ID.
 * @param {number}      props.width           - Widget width (1 or 2).
 * @param {boolean}     props.forceLastColumn - Force to last column.
 * @param {JSX.Element} props.children        - Widget content.
 * @return {JSX.Element} The widget wrapper.
 */

function WidgetWrapper({
  id,
  width = 1,
  forceLastColumn = false,
  children
}) {
  // Widget-specific styles
  const widgetStyles = {};
  const innerContainerStyles = {};

  // Todo widget: padding-left: 0 on wrapper, padding-left on children
  if (id === 'todo') {
    widgetStyles.paddingLeft = 0;
    innerContainerStyles.paddingLeft = 'var(--prpl-padding)';
  }

  // Badge streak widgets: flex layout
  if (id === 'badge-streak' || id === 'badge-streak-content' || id === 'badge-streak-maintenance') {
    widgetStyles.display = 'flex';
    widgetStyles.flexDirection = 'column';
    widgetStyles.justifyContent = 'space-between';
  }

  // Monthly badges: grid positioning for large screens
  if (id === 'monthly-badges') {
    // Apply via media query would require CSS, but we can set base styles
    // The grid positioning is handled by CSS grid auto-flow
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
    className: `prpl-widget-wrapper prpl-${id} prpl-widget-width-${width}`,
    "data-force-last-column": forceLastColumn ? 1 : 0,
    style: widgetStyles,
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
      className: "widget-inner-container",
      style: innerContainerStyles,
      children: children
    })
  });
}

/**
 * DashboardWidgets component.
 *
 * @return {JSX.Element} The DashboardWidgets component.
 */
function DashboardWidgets() {
  const [registeredWidgets, setRegisteredWidgets] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)([]);

  // Listen for widget registrations and update state
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    // Get initial registered widgets (widgets may have registered before this component mounted)
    setRegisteredWidgets((0,_utils_widgetRegistry__WEBPACK_IMPORTED_MODULE_2__.getRegisteredWidgets)());

    // Listen for new widget registrations
    const handleWidgetRegistration = () => {
      setRegisteredWidgets((0,_utils_widgetRegistry__WEBPACK_IMPORTED_MODULE_2__.getRegisteredWidgets)());
    };
    (0,_wordpress_hooks__WEBPACK_IMPORTED_MODULE_1__.addAction)('prpl.dashboard.registerWidget', 'progress-planner/dashboard-widgets', handleWidgetRegistration);

    // Cleanup: This component doesn't need to remove the action listener
    // since it's just reading from the registry
  }, []);

  /**
   * Render a widget from registry.
   *
   * @param {Object} widget - Widget from registry.
   * @return {JSX.Element|null} The widget component.
   */
  const renderWidget = widget => {
    const WidgetComponent = widget.component;
    if (!WidgetComponent) {
      return null;
    }
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(WidgetWrapper, {
      id: widget.id,
      width: widget.width || 1,
      forceLastColumn: widget.forceLastColumn || false,
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ErrorBoundary__WEBPACK_IMPORTED_MODULE_3__["default"], {
        widgetName: widget.title,
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(WidgetComponent, {
          config: {
            title: widget.title,
            infoIconSvg: widget.infoIconSvg
          }
        })
      })
    }, widget.id);
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
    children: registeredWidgets.map(widget => renderWidget(widget))
  });
}

/***/ }),

/***/ "./assets/src/components/Dashboard/index.js":
/*!**************************************************!*\
  !*** ./assets/src/components/Dashboard/index.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Dashboard)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _stores_dashboardStore__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../stores/dashboardStore */ "./assets/src/stores/dashboardStore.js");
/* harmony import */ var _DashboardHeader__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./DashboardHeader */ "./assets/src/components/Dashboard/DashboardHeader.js");
/* harmony import */ var _DashboardWidgets__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./DashboardWidgets */ "./assets/src/components/Dashboard/DashboardWidgets.js");
/* harmony import */ var _OnboardingWizard__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../OnboardingWizard */ "./assets/src/components/OnboardingWizard/index.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__);
/**
 * Dashboard Component
 *
 * Main dashboard component that conditionally renders Welcome/Onboarding
 * or the main dashboard with header and widgets.
 */








/**
 * Style constants - extracted to prevent recreation on each render.
 */

const STYLES = {
  skipLink: {
    position: 'absolute',
    top: '-40px',
    left: 0,
    background: 'var(--prpl-color-button-primary)',
    color: 'var(--prpl-color-button-primary-text)',
    padding: '8px 16px',
    textDecoration: 'none',
    borderRadius: 'var(--prpl-border-radius)',
    zIndex: 100000
  },
  widgetsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(var(--prpl-column-min-width), 1fr))',
    columnGap: 'var(--prpl-gap)',
    gridAutoRows: 'var(--prpl-gap)',
    gridAutoFlow: 'dense'
  }
};

/**
 * Dashboard component.
 *
 * @param {Object} props        - Component props.
 * @param {Object} props.config - Dashboard configuration from PHP.
 * @return {JSX.Element} The Dashboard component.
 */
function Dashboard({
  config
}) {
  const {
    privacyPolicyAccepted = false
  } = config;
  const wizardRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const setShouldAutoStartWizard = (0,_stores_dashboardStore__WEBPACK_IMPORTED_MODULE_2__.useDashboardStore)(state => state.setShouldAutoStartWizard);

  // Set auto-start flag when privacy is not accepted (like develop branch)
  // Note: Saved progress check is now handled by the wizard component after it fetches config from REST API
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    // Auto-start if privacy not accepted (fresh install)
    // Saved progress check is handled by wizard component after it fetches config from REST API
    if (!privacyPolicyAccepted) {
      setShouldAutoStartWizard(true);
    }
  }, [privacyPolicyAccepted, setShouldAutoStartWizard]);

  /**
   * Handle start onboarding button click.
   */
  const handleStartOnboarding = () => {
    if (wizardRef.current && typeof wizardRef.current.startOnboarding === 'function') {
      wizardRef.current.startOnboarding();
    }
  };

  // Show start button when privacy not accepted (like develop branch)
  if (!privacyPolicyAccepted) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
        className: "prpl-start-onboarding-container",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
          className: "prpl-start-onboarding-graphic",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("img", {
            src: `${config.baseUrl || ''}/assets/images/onboarding/thumbs_up_ravi_rtl.svg`,
            alt: "",
            style: {
              maxWidth: '100%',
              height: 'auto'
            }
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("button", {
          className: "prpl-button-primary",
          id: "prpl-start-onboarding-button",
          onClick: handleStartOnboarding,
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Are you ready to work on your site?', 'progress-planner')
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_OnboardingWizard__WEBPACK_IMPORTED_MODULE_5__["default"], {
        config: config,
        ref: wizardRef
      })]
    });
  }

  // Show main dashboard (Zustand store provides cross-widget state)
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("a", {
      href: "#prpl-main-content",
      className: "screen-reader-text prpl-skip-link",
      style: STYLES.skipLink,
      onFocus: e => {
        e.target.style.top = '10px';
        e.target.style.left = '10px';
      },
      onBlur: e => {
        e.target.style.top = '-40px';
        e.target.style.left = '0';
      },
      children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Skip to main content', 'progress-planner')
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("h1", {
      className: "screen-reader-text",
      children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Progress Planner', 'progress-planner')
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_DashboardHeader__WEBPACK_IMPORTED_MODULE_3__["default"], {
      config: config
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
      id: "prpl-main-content",
      className: "prpl-widgets-container",
      style: STYLES.widgetsContainer,
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_DashboardWidgets__WEBPACK_IMPORTED_MODULE_4__["default"], {})
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_OnboardingWizard__WEBPACK_IMPORTED_MODULE_5__["default"], {
      config: config,
      ref: wizardRef
    })]
  });
}

/***/ }),

/***/ "./assets/src/components/ErrorBoundary/index.js":
/*!******************************************************!*\
  !*** ./assets/src/components/ErrorBoundary/index.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ErrorBoundary)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__);
/**
 * ErrorBoundary Component
 *
 * Catches JavaScript errors in child component tree and displays a fallback UI.
 * Prevents a single widget crash from breaking the entire dashboard.
 *
 * Note: Error boundaries must be class components as React doesn't provide
 * hook equivalents for componentDidCatch and getDerivedStateFromError.
 */




/**
 * Style constants for error display.
 */

const STYLES = {
  container: {
    padding: 'var(--prpl-padding, 1rem)',
    backgroundColor: 'var(--prpl-background-error, #fef2f2)',
    borderRadius: 'var(--prpl-border-radius, 8px)',
    border: '1px solid var(--prpl-color-error, #ef4444)'
  },
  heading: {
    margin: '0 0 0.5rem 0',
    fontSize: 'var(--prpl-font-size-medium, 1rem)',
    color: 'var(--prpl-color-error, #ef4444)'
  },
  message: {
    margin: 0,
    fontSize: 'var(--prpl-font-size-small, 0.875rem)',
    color: 'var(--prpl-color-text-secondary, #6b7280)'
  },
  button: {
    marginTop: '0.75rem',
    padding: '0.5rem 1rem',
    backgroundColor: 'var(--prpl-color-primary, #3b82f6)',
    color: 'white',
    border: 'none',
    borderRadius: 'var(--prpl-border-radius-small, 4px)',
    cursor: 'pointer',
    fontSize: 'var(--prpl-font-size-small, 0.875rem)'
  }
};

/**
 * ErrorBoundary class component.
 */
class ErrorBoundary extends _wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Component {
  /**
   * Constructor.
   *
   * @param {Object} props - Component props.
   */
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  /**
   * Update state when an error is caught.
   *
   * @param {Error} error - The error that was thrown.
   * @return {Object} New state.
   */
  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error
    };
  }

  /**
   * Log error information for debugging.
   *
   * @param {Error}  error     - The error that was thrown.
   * @param {Object} errorInfo - Component stack information.
   */
  componentDidCatch(error, errorInfo) {
    // Log error for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      errorInfo
    });

    // If an onError callback was provided, call it
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  /**
   * Reset error state to retry rendering.
   */
  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  /**
   * Render the component.
   *
   * @return {JSX.Element} The component.
   */
  render() {
    const {
      hasError
    } = this.state;
    const {
      children,
      fallback
    } = this.props;
    if (hasError) {
      // If a custom fallback was provided, use it
      if (fallback) {
        return fallback;
      }

      // Default error UI
      return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
        style: STYLES.container,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("h4", {
          style: STYLES.heading,
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Something went wrong', 'progress-planner')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("p", {
          style: STYLES.message,
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('This widget failed to load. Try refreshing the page.', 'progress-planner')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("button", {
          type: "button",
          style: STYLES.button,
          onClick: this.handleRetry,
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Retry', 'progress-planner')
        })]
      });
    }
    return children;
  }
}

/***/ }),

/***/ "./assets/src/components/FormInputs/CustomCheckbox.js":
/*!************************************************************!*\
  !*** ./assets/src/components/FormInputs/CustomCheckbox.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ CustomCheckbox)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);

/**
 * CustomCheckbox Component
 *
 * A styled checkbox component matching the onboarding wizard design.
 *
 * @package
 */

/**
 * CustomCheckbox component.
 *
 * @param {Object}             props           - Component props.
 * @param {string}             props.id        - Input ID.
 * @param {string}             props.name      - Input name.
 * @param {string}             props.value     - Input value.
 * @param {boolean}            props.checked   - Whether checked.
 * @param {Function}           props.onChange  - Change handler.
 * @param {string|JSX.Element} props.label     - Label text or JSX element.
 * @param {string}             props.className - Additional class names.
 * @return {JSX.Element} CustomCheckbox component.
 */
function CustomCheckbox({
  id,
  name,
  value,
  checked,
  onChange,
  label,
  className = ''
}) {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("label", {
    htmlFor: id,
    className: `prpl-custom-checkbox ${className}`.trim(),
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", {
      type: "checkbox",
      id: id,
      name: name,
      value: value,
      checked: checked,
      onChange: onChange
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", {
      className: "prpl-custom-control"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", {
      className: "prpl-custom-control-text",
      children: label
    })]
  });
}

/***/ }),

/***/ "./assets/src/components/FormInputs/CustomRadio.js":
/*!*********************************************************!*\
  !*** ./assets/src/components/FormInputs/CustomRadio.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ CustomRadio)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);

/**
 * CustomRadio Component
 *
 * A styled radio button component matching the onboarding wizard design.
 *
 * @package
 */

/**
 * CustomRadio component.
 *
 * @param {Object}   props           - Component props.
 * @param {string}   props.id        - Input ID.
 * @param {string}   props.name      - Input name (groups radios together).
 * @param {string}   props.value     - Input value.
 * @param {boolean}  props.checked   - Whether checked.
 * @param {Function} props.onChange  - Change handler.
 * @param {string}   props.label     - Label text.
 * @param {string}   props.className - Additional class names.
 * @return {JSX.Element} CustomRadio component.
 */
function CustomRadio({
  id,
  name,
  value,
  checked,
  onChange,
  label,
  className = ''
}) {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("label", {
    htmlFor: id,
    className: `prpl-custom-radio ${className}`.trim(),
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", {
      type: "radio",
      id: id,
      name: name,
      value: value,
      checked: checked,
      onChange: onChange
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", {
      className: "prpl-custom-control"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", {
      className: "prpl-custom-control-text",
      children: label
    })]
  });
}

/***/ }),

/***/ "./assets/src/components/FormInputs/FormInputs.css":
/*!*********************************************************!*\
  !*** ./assets/src/components/FormInputs/FormInputs.css ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./assets/src/components/FormInputs/ToggleSwitch.js":
/*!**********************************************************!*\
  !*** ./assets/src/components/FormInputs/ToggleSwitch.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ToggleSwitch)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);

/**
 * ToggleSwitch Component
 *
 * A styled toggle switch component matching the onboarding wizard design.
 * Used for post type selection and similar on/off toggles.
 *
 * @package
 */

/**
 * ToggleSwitch component.
 *
 * @param {Object}   props           - Component props.
 * @param {string}   props.id        - Input ID.
 * @param {string}   props.name      - Input name.
 * @param {string}   props.value     - Input value.
 * @param {boolean}  props.checked   - Whether checked.
 * @param {Function} props.onChange  - Change handler.
 * @param {string}   props.label     - Label text.
 * @param {string}   props.className - Additional class names.
 * @return {JSX.Element} ToggleSwitch component.
 */
function ToggleSwitch({
  id,
  name,
  value,
  checked,
  onChange,
  label,
  className = ''
}) {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
    className: `prpl-post-type-toggle-wrapper ${className}`.trim(),
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("label", {
      htmlFor: id,
      className: "prpl-post-type-toggle-label",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", {
        type: "checkbox",
        id: id,
        name: name,
        value: value,
        checked: checked,
        onChange: onChange,
        className: "prpl-post-type-toggle-input"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", {
        className: "prpl-post-type-toggle-switch",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("svg", {
          className: "prpl-toggle-icon-check",
          xmlns: "http://www.w3.org/2000/svg",
          viewBox: "0 0 20 20",
          fill: "currentColor",
          "aria-hidden": "true",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", {
            fillRule: "evenodd",
            d: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z",
            clipRule: "evenodd"
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("svg", {
          className: "prpl-toggle-icon-x",
          xmlns: "http://www.w3.org/2000/svg",
          viewBox: "0 0 20 20",
          fill: "currentColor",
          "aria-hidden": "true",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", {
            fillRule: "evenodd",
            d: "M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z",
            clipRule: "evenodd"
          })
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", {
        className: "prpl-post-type-toggle-text",
        children: label
      })]
    })
  });
}

/***/ }),

/***/ "./assets/src/components/FormInputs/index.js":
/*!***************************************************!*\
  !*** ./assets/src/components/FormInputs/index.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CustomCheckbox: () => (/* reexport safe */ _CustomCheckbox__WEBPACK_IMPORTED_MODULE_1__["default"]),
/* harmony export */   CustomRadio: () => (/* reexport safe */ _CustomRadio__WEBPACK_IMPORTED_MODULE_2__["default"]),
/* harmony export */   ToggleSwitch: () => (/* reexport safe */ _ToggleSwitch__WEBPACK_IMPORTED_MODULE_3__["default"])
/* harmony export */ });
/* harmony import */ var _FormInputs_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./FormInputs.css */ "./assets/src/components/FormInputs/FormInputs.css");
/* harmony import */ var _CustomCheckbox__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./CustomCheckbox */ "./assets/src/components/FormInputs/CustomCheckbox.js");
/* harmony import */ var _CustomRadio__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./CustomRadio */ "./assets/src/components/FormInputs/CustomRadio.js");
/* harmony import */ var _ToggleSwitch__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ToggleSwitch */ "./assets/src/components/FormInputs/ToggleSwitch.js");
/**
 * Form Input Components
 *
 * Reusable styled form input components.
 *
 * @package
 */






/***/ }),

/***/ "./assets/src/components/OnboardingWizard/OnboardTask.js":
/*!***************************************************************!*\
  !*** ./assets/src/components/OnboardingWizard/OnboardTask.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ OnboardTask)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _hooks_useTaskCompletion__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../hooks/useTaskCompletion */ "./assets/src/hooks/useTaskCompletion/index.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);
/**
 * OnboardTask Component
 *
 * Individual task component for MoreTasksStep.
 * Handles task form toggling, file uploads, and completion.
 *
 * @package
 */





/**
 * OnboardTask component.
 *
 * @param {Object}   props            - Component props.
 * @param {Object}   props.task       - Task data.
 * @param {Object}   props.config     - Wizard configuration.
 * @param {Function} props.onComplete - Callback when task is completed.
 * @return {JSX.Element} OnboardTask component.
 */

function OnboardTask({
  task,
  config,
  onComplete
}) {
  const {
    ajaxUrl,
    nonce
  } = config;
  const {
    completeTask,
    isCompleting
  } = (0,_hooks_useTaskCompletion__WEBPACK_IMPORTED_MODULE_2__.useTaskCompletion)({
    ajaxUrl,
    nonce
  });
  const [isOpen, setIsOpen] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [isCompleted, setIsCompleted] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [formValues, setFormValues] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)({});
  const taskContentRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);

  // Use template HTML from task data if available, otherwise fetch it.
  const [templateHtml, setTemplateHtml] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(task?.template_html || '');
  const [isLoadingTemplate, setIsLoadingTemplate] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);

  // Fetch template if not provided in task data.
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!task?.task_id || task?.template_html) {
      return;
    }
    const fetchTemplate = async () => {
      setIsLoadingTemplate(true);
      try {
        const formData = new FormData();
        formData.append('action', 'progress_planner_get_task_template');
        formData.append('nonce', nonce);
        formData.append('task_id', task.task_id);
        formData.append('task_data', JSON.stringify(task));
        const response = await fetch(ajaxUrl, {
          method: 'POST',
          body: formData
        }).then(res => res.json());
        if (response.success && response.data?.html) {
          setTemplateHtml(response.data.html);
        }
      } catch (error) {
        console.error('Failed to fetch task template:', error);
      } finally {
        setIsLoadingTemplate(false);
      }
    };
    fetchTemplate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task?.task_id, task?.template_html, ajaxUrl, nonce]);

  /**
   * Handle task completion.
   */
  const handleComplete = async () => {
    if (!task?.task_id) {
      return;
    }
    try {
      await completeTask(task.task_id, formValues);
      setIsCompleted(true);
      onComplete?.(task.task_id);
    } catch (error) {
      console.error('Failed to complete task:', error);
    }
  };

  /**
   * Handle open task.
   */
  const handleOpen = () => {
    setIsOpen(true);
  };

  /**
   * Handle close task.
   */
  const handleClose = () => {
    setIsOpen(false);
  };
  if (isOpen) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
      className: "prpl-task-content-active",
      ref: taskContentRef,
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
        className: "prpl-task-buttons",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("button", {
          type: "button",
          className: "prpl-btn prpl-task-close-btn",
          onClick: handleClose,
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("span", {
            className: "dashicons dashicons-arrow-left-alt2"
          }), config?.l10n?.backToRecommendations || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Back to recommendations', 'progress-planner')]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("button", {
          type: "button",
          className: "prpl-complete-task-btn",
          onClick: handleComplete,
          disabled: isCompleting,
          children: isCompleting ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Completing…', 'progress-planner') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Complete', 'progress-planner')
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
        className: "prpl-task-form",
        children: [isLoadingTemplate && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
          className: "prpl-spinner",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("span", {
            className: "spinner",
            style: {
              visibility: 'visible'
            }
          })
        }), !isLoadingTemplate && templateHtml && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
          dangerouslySetInnerHTML: {
            __html: templateHtml
          },
          role: "presentation",
          onClick: e => {
            // Handle form submission and file uploads.
            if (e.target.classList.contains('prpl-complete-task-btn')) {
              const form = e.target.closest('form');
              if (form) {
                const formData = new FormData(form);
                setFormValues(Object.fromEntries(formData.entries()));
                // Trigger completion after form values are set.
                setTimeout(() => handleComplete(), 0);
              }
            }
          },
          onKeyDown: e => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              const target = e.target;
              if (target.classList.contains('prpl-complete-task-btn')) {
                const form = target.closest('form');
                if (form) {
                  const formData = new FormData(form);
                  setFormValues(Object.fromEntries(formData.entries()));
                  setTimeout(() => handleComplete(), 0);
                }
              }
            }
          },
          tabIndex: -1,
          ref: el => {
            if (el && templateHtml) {
              // Re-initialize file upload handlers after template is rendered.
              const fileInputs = el.querySelectorAll('input[type="file"]');
              // File upload handling will be done by existing JavaScript if available.
              // eslint-disable-next-line no-unused-vars
              fileInputs.forEach(() => {
                // File inputs are handled by existing event listeners.
              });
            }
          }
        }), !isLoadingTemplate && !templateHtml && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.Fragment, {
          children: [task.title && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("h4", {
            children: task.title
          }), task.url && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("a", {
            href: task.url,
            target: "_blank",
            rel: "noopener noreferrer",
            className: "prpl-button-primary",
            children: task.action_label || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Do it', 'progress-planner')
          })]
        })]
      })]
    });
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
    className: "prpl-task-item",
    "data-task-id": task?.task_id,
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("button", {
      type: "button",
      className: "prpl-open-task-btn",
      onClick: handleOpen,
      disabled: isCompleted,
      children: [task?.title || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Task', 'progress-planner'), isCompleted && ' ✓']
    })
  });
}

/***/ }),

/***/ "./assets/src/components/OnboardingWizard/OnboardingNavigation.js":
/*!************************************************************************!*\
  !*** ./assets/src/components/OnboardingWizard/OnboardingNavigation.js ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ OnboardingNavigation)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);

/**
 * OnboardingNavigation Component
 *
 * Left sidebar navigation showing wizard steps.
 * Steps are display-only indicators, not clickable buttons.
 *
 * @package
 */

/**
 * OnboardingNavigation component.
 *
 * @param {Object} props             - Component props.
 * @param {Array}  props.steps       - Array of step definitions.
 * @param {number} props.currentStep - Current step index.
 * @param {string} props.logoHtml    - Logo HTML from PHP.
 * @return {JSX.Element} Navigation component.
 */
function OnboardingNavigation({
  steps,
  currentStep,
  logoHtml
}) {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
    className: "prpl-onboarding-navigation",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
        id: "prpl-onboarding-mobile-step-label",
        children: steps[currentStep]?.title || ''
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("ol", {
        className: "prpl-step-list",
        children: steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          const stepNumber = index + 1;
          return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("li", {
            className: `prpl-nav-step-item ${isActive ? 'prpl-active' : ''} ${isCompleted ? 'prpl-completed' : ''}`,
            "data-step": index,
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", {
              className: "prpl-step-icon",
              children: isCompleted ? '✓' : stepNumber
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", {
              className: "prpl-step-label",
              children: step.title
            })]
          }, step.id);
        })
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
      className: "prpl-onboarding-logo",
      dangerouslySetInnerHTML: {
        __html: logoHtml || ''
      }
    })]
  });
}

/***/ }),

/***/ "./assets/src/components/OnboardingWizard/OnboardingStep.js":
/*!******************************************************************!*\
  !*** ./assets/src/components/OnboardingWizard/OnboardingStep.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ OnboardingStep)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__);
/**
 * OnboardingStep Base Component
 *
 * Base component for all onboarding wizard steps.
 * Provides common functionality like canProceed, updateNextButton, etc.
 *
 * @package
 */




/**
 * Base step component.
 *
 * This is a utility component that provides common step functionality.
 * Individual step components should use these utilities.
 *
 * @param {Object}   props             - Component props.
 * @param {Object}   props.wizardState - Current wizard state.
 * @param {Function} props.onNext      - Callback when next is clicked.
 * @param {Function} props.canProceed  - Function to check if step can proceed.
 * @param {string}   props.buttonText  - Custom button text (defaults to "Next").
 * @param {string}   props.buttonClass - Custom button class (defaults to "prpl-btn-primary").
 * @param {boolean}  props.isLoading   - Whether to show loading spinner.
 * @param {Object}   props.children    - Step content.
 * @return {JSX.Element} Step component.
 */

function OnboardingStep({
  wizardState,
  onNext,
  canProceed = () => true,
  buttonText,
  buttonClass = 'prpl-btn-primary',
  isLoading = false,
  children
}) {
  const nextButtonRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const footerRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);

  /**
   * Update next button state based on canProceed.
   * Note: We only use CSS class, not HTML disabled attribute,
   * so click events still fire and we can show error messages.
   */
  const updateNextButton = () => {
    if (!nextButtonRef.current) {
      return;
    }
    const canAdvance = canProceed(wizardState);
    if (canAdvance) {
      nextButtonRef.current.classList.remove('prpl-btn-disabled');
    } else {
      nextButtonRef.current.classList.add('prpl-btn-disabled');
    }
  };

  // Update button state when canProceed changes.
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    updateNextButton();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wizardState]);

  /**
   * Handle disabled button click (show error indicator).
   *
   * @param {Event} e - Click event.
   */
  const handleDisabledClick = e => {
    if (nextButtonRef.current?.classList.contains('prpl-btn-disabled')) {
      e.preventDefault();
      e.stopPropagation();
      // Show error indicator (used by WelcomeStep for privacy checkbox).
      const requiredIndicator = document.querySelector('.prpl-privacy-checkbox-wrapper .prpl-required-indicator');
      if (requiredIndicator) {
        requiredIndicator.classList.add('prpl-required-indicator-active');
      }
    }
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
    className: "onboarding-step",
    children: [children, /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
      ref: footerRef,
      className: "tour-footer",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
        className: "prpl-tour-next-wrapper",
        children: [isLoading && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("span", {
          className: "spinner",
          style: {
            visibility: 'visible'
          }
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("button", {
          ref: nextButtonRef,
          type: "button",
          className: `prpl-btn ${buttonClass} prpl-tour-next`,
          onClick: e => {
            handleDisabledClick(e);
            if (!nextButtonRef.current?.classList.contains('prpl-btn-disabled')) {
              onNext();
            }
          },
          disabled: isLoading,
          children: buttonText || /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.Fragment, {
            children: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Next', 'progress-planner'), " \u2192"]
          })
        })]
      })
    })]
  });
}

/***/ }),

/***/ "./assets/src/components/OnboardingWizard/QuitConfirmation.js":
/*!********************************************************************!*\
  !*** ./assets/src/components/OnboardingWizard/QuitConfirmation.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ QuitConfirmation)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);
/**
 * QuitConfirmation Component
 *
 * Confirmation dialog when user tries to close the wizard.
 *
 * @package
 */



/**
 * QuitConfirmation component.
 *
 * @param {Object}   props           - Component props.
 * @param {Function} props.onConfirm - Callback when user confirms quit.
 * @param {Function} props.onCancel  - Callback when user cancels quit.
 * @param {Object}   props.config    - Wizard configuration.
 * @return {JSX.Element} Quit confirmation dialog.
 */

function QuitConfirmation({
  onConfirm,
  onCancel,
  config
}) {
  const brandingName = config?.l10n?.brandingName || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Progress Planner', 'progress-planner');
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
    className: "prpl-columns-wrapper-flex prpl-columns-2-1",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
      className: "prpl-column",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
        className: "prpl-quit-confirmation",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
          className: "prpl-error-box",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("span", {
            className: "prpl-error-icon",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("svg", {
              width: "24",
              height: "24",
              viewBox: "0 0 24 24",
              fill: "none",
              xmlns: "http://www.w3.org/2000/svg",
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("path", {
                d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z",
                fill: "currentColor"
              })
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("h3", {
              id: "prpl-quit-confirmation-title",
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Are you sure you want to quit?', 'progress-planner')
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("p", {
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.sprintf)(/* translators: %s: Progress Planner name */
              (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('You need to finish the onboarding before you can work with the %s and start improving your site.', 'progress-planner'), brandingName)
            })]
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
          className: "prpl-quit-actions",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("button", {
            type: "button",
            id: "prpl-quit-yes",
            className: "prpl-quit-link",
            onClick: e => {
              e.preventDefault();
              if (typeof onConfirm === 'function') {
                onConfirm();
              }
            },
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Yes, quit the onboarding (for now)', 'progress-planner')
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("button", {
            type: "button",
            id: "prpl-quit-no",
            className: "prpl-quit-link prpl-quit-link-primary",
            onClick: e => {
              e.preventDefault();
              if (typeof onCancel === 'function') {
                onCancel();
              }
            },
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("No, let's finish the onboarding!", 'progress-planner')
          })]
        })]
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
      className: "prpl-column prpl-hide-on-mobile",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
        id: "prpl-quit-confirmation-graphic",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
          style: {
            width: '100%',
            height: '200px',
            backgroundColor: '#f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#999'
          },
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Graphic placeholder', 'progress-planner')
        })
      })
    })]
  });
}

/***/ }),

/***/ "./assets/src/components/OnboardingWizard/index.js":
/*!*********************************************************!*\
  !*** ./assets/src/components/OnboardingWizard/index.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/api-fetch */ "@wordpress/api-fetch");
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _stores_dashboardStore__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../stores/dashboardStore */ "./assets/src/stores/dashboardStore.js");
/* harmony import */ var _hooks_useOnboardingWizard__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../hooks/useOnboardingWizard */ "./assets/src/hooks/useOnboardingWizard/index.js");
/* harmony import */ var _hooks_useOnboardingProgress__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../hooks/useOnboardingProgress */ "./assets/src/hooks/useOnboardingProgress/index.js");
/* harmony import */ var _steps_WelcomeStep__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./steps/WelcomeStep */ "./assets/src/components/OnboardingWizard/steps/WelcomeStep.js");
/* harmony import */ var _steps_WhatsWhatStep__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./steps/WhatsWhatStep */ "./assets/src/components/OnboardingWizard/steps/WhatsWhatStep.js");
/* harmony import */ var _steps_FirstTaskStep__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./steps/FirstTaskStep */ "./assets/src/components/OnboardingWizard/steps/FirstTaskStep.js");
/* harmony import */ var _steps_BadgesStep__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./steps/BadgesStep */ "./assets/src/components/OnboardingWizard/steps/BadgesStep.js");
/* harmony import */ var _steps_EmailFrequencyStep__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./steps/EmailFrequencyStep */ "./assets/src/components/OnboardingWizard/steps/EmailFrequencyStep.js");
/* harmony import */ var _steps_SettingsStep__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./steps/SettingsStep */ "./assets/src/components/OnboardingWizard/steps/SettingsStep.js");
/* harmony import */ var _steps_MoreTasksStep__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./steps/MoreTasksStep */ "./assets/src/components/OnboardingWizard/steps/MoreTasksStep.js");
/* harmony import */ var _OnboardingNavigation__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./OnboardingNavigation */ "./assets/src/components/OnboardingWizard/OnboardingNavigation.js");
/* harmony import */ var _QuitConfirmation__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./QuitConfirmation */ "./assets/src/components/OnboardingWizard/QuitConfirmation.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__);
/**
 * OnboardingWizard Component
 *
 * Main onboarding wizard component that manages the multi-step wizard.
 *
 * @package
 */

















/**
 * OnboardingWizard component.
 *
 * @param {Object} props        - Component props.
 * @param {Object} props.config - Wizard configuration from PHP.
 * @param {Object} ref          - Ref to expose startOnboarding method.
 * @return {JSX.Element|null} The wizard component or null if not enabled.
 */

const OnboardingWizard = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.forwardRef)(function OnboardingWizard({
  config
}, ref) {
  // State for wizard config fetched from REST API.
  const [wizardConfig, setWizardConfig] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [isLoadingConfig, setIsLoadingConfig] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(true);
  const [configError, setConfigError] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);

  // Fallback to config.onboardingWizard if available (for backwards compatibility).
  const fallbackWizard = config.onboardingWizard;

  // Fetch wizard config from REST API on mount.
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const fetchWizardConfig = async () => {
      try {
        setIsLoadingConfig(true);
        setConfigError(null);
        const response = await _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_2___default()({
          path: '/progress-planner/v1/onboarding-wizard/config'
        });
        setWizardConfig(response);
      } catch (error) {
        // Fallback to config.onboardingWizard if available.
        if (fallbackWizard) {
          setWizardConfig(fallbackWizard);
        } else {
          setConfigError(error);
        }
      } finally {
        setIsLoadingConfig(false);
      }
    };
    fetchWizardConfig();
  }, [fallbackWizard]);

  // Use fetched config or fallback.
  const onboardingWizard = wizardConfig || fallbackWizard;

  // Initialize hooks before early return to comply with React hooks rules.
  const {
    steps,
    savedProgress,
    ajaxUrl,
    nonce
  } = onboardingWizard || {};
  const progressHooks = (0,_hooks_useOnboardingProgress__WEBPACK_IMPORTED_MODULE_5__.useOnboardingProgress)({
    ajaxUrl: ajaxUrl || '',
    nonce: nonce || ''
  });
  const {
    wizardState,
    updateState,
    nextStep,
    prevStep,
    currentStep,
    currentStepData
  } = (0,_hooks_useOnboardingWizard__WEBPACK_IMPORTED_MODULE_4__.useOnboardingWizard)(onboardingWizard || {}, progressHooks);
  const [showQuitConfirmation, setShowQuitConfirmation] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [isOpen, setIsOpen] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const popoverRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const hasManuallyQuitRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(false); // Track if user manually quit to prevent auto-restart
  const shouldAutoStartWizard = (0,_stores_dashboardStore__WEBPACK_IMPORTED_MODULE_3__.useDashboardStore)(state => state.shouldAutoStartWizard);
  const setShouldAutoStartWizard = (0,_stores_dashboardStore__WEBPACK_IMPORTED_MODULE_3__.useDashboardStore)(state => state.setShouldAutoStartWizard);

  // Expose startOnboarding method via ref (like develop's window.prplOnboardWizard.startOnboarding).
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useImperativeHandle)(ref, () => ({
    startOnboarding() {
      if (!wizardState.data.finished && onboardingWizard?.enabled && popoverRef.current) {
        // Show popover using native API (like develop)
        if (typeof popoverRef.current.showPopover === 'function') {
          popoverRef.current.showPopover();
        }
        setIsOpen(true);

        // Move focus to popover for keyboard accessibility
        setTimeout(() => {
          if (popoverRef.current) {
            popoverRef.current.focus();
          }
        }, 0);
      }
    }
  }));

  /**
   * Ref callback to detect when popover element is mounted.
   * Checks Zustand store for auto-start flag and handles auto-start.
   * Also sets up toggle event listener to sync isOpen state.
   *
   * @param {HTMLElement|null} element - The popover element or null when unmounted.
   * @return {void}
   */
  const popoverRefCallback = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(element => {
    // Store ref for imperative handle
    const previousElement = popoverRef.current;
    popoverRef.current = element;

    // Clean up toggle listener from previous element if it changed
    if (previousElement && previousElement !== element) {
      const previousToggleHandler = previousElement.__prplToggleHandler;
      if (previousToggleHandler) {
        previousElement.removeEventListener('toggle', previousToggleHandler);
        delete previousElement.__prplToggleHandler;
      }
    }

    // Only proceed if element is mounted and wizard is enabled
    if (!element) {
      return;
    }

    // Set up toggle event listener to sync isOpen state with popover's actual state
    if (!element.__prplToggleHandler) {
      /**
       * Handle popover toggle event to sync isOpen state.
       *
       * @param {Event} event - Toggle event.
       */
      const handleToggle = event => {
        setIsOpen(event.newState === 'open');
      };
      element.addEventListener('toggle', handleToggle);
      element.__prplToggleHandler = handleToggle;
    }
    if (!onboardingWizard?.enabled) {
      return;
    }

    // Don't auto-start if wizard is already finished
    if (wizardState.data.finished) {
      return;
    }

    // Don't auto-start if popover is already open
    if (element.matches(':popover-open')) {
      setIsOpen(true);
      return;
    }

    // Don't auto-start if user has manually quit (prevents re-opening after quit)
    if (hasManuallyQuitRef.current) {
      return;
    }

    // Check if we should auto-start (only when there's NO saved progress, like develop branch)
    const hasSavedProgress = savedProgress && Object.keys(savedProgress).length > 0;

    // Auto-start ONLY when there's NO saved progress (matches develop branch logic)
    // Develop branch: if ( ! $get_saved_progress ) { startOnboarding(); }
    // Conditions:
    // 1. Zustand flag is set (privacy not accepted - fresh install)
    // 2. There is NO saved progress (user hasn't quit before)
    // 3. User hasn't manually quit in this session
    if (shouldAutoStartWizard && !hasSavedProgress && !hasManuallyQuitRef.current) {
      // Popover element is now in DOM, safe to show
      if (typeof element.showPopover === 'function') {
        try {
          element.showPopover();
          setIsOpen(true);

          // Clear the Zustand flag after starting
          if (shouldAutoStartWizard) {
            setShouldAutoStartWizard(false);
          }

          // Move focus to popover for keyboard accessibility
          setTimeout(() => {
            if (element) {
              element.focus();
            }
          }, 0);
        } catch (error) {
          console.error('[OnboardingWizard] Ref callback: Error calling showPopover()', error);
        }
      }
    }
  }, [onboardingWizard?.enabled, wizardState.data.finished, savedProgress, shouldAutoStartWizard, setShouldAutoStartWizard]);

  // Handle keyboard navigation (Escape key to close).
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!isOpen) {
      return;
    }

    /**
     * Handle Escape key press.
     *
     * @param {KeyboardEvent} event - Keyboard event.
     */
    const handleKeyDown = event => {
      if (event.key === 'Escape' && !showQuitConfirmation) {
        setShowQuitConfirmation(true);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, showQuitConfirmation]);

  /**
   * Handle close button click.
   */
  const handleClose = () => {
    setShowQuitConfirmation(true);
  };

  /**
   * Handle quit confirmation.
   * Matches develop branch's closeTour() behavior: hide popover first, then save progress.
   */
  const handleQuit = () => {
    // Mark that user manually quit to prevent auto-restart
    hasManuallyQuitRef.current = true;

    // Hide quit confirmation UI
    setShowQuitConfirmation(false);

    // Hide popover first (like develop branch's closeTour)
    const element = popoverRef.current;
    if (element && typeof element.hidePopover === 'function') {
      element.hidePopover();
    }
    setIsOpen(false);

    // Save progress to server (like develop branch's saveProgressToServer)
    progressHooks.saveProgress(wizardState).catch(() => {
      // Silently fail - progress save shouldn't block closing
    });
  };

  /**
   * Handle cancel quit.
   */
  const handleCancelQuit = () => {
    setShowQuitConfirmation(false);
  };

  /**
   * Render current step component or quit confirmation.
   *
   * @return {JSX.Element} Current step component or quit confirmation.
   */
  const renderStep = () => {
    // Show quit confirmation if requested
    if (showQuitConfirmation) {
      return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)(_QuitConfirmation__WEBPACK_IMPORTED_MODULE_14__["default"], {
        onConfirm: handleQuit,
        onCancel: handleCancelQuit,
        config: onboardingWizard
      });
    }

    // Otherwise show current step
    if (!currentStepData) {
      return null;
    }
    const handleBack = currentStep > 0 ? prevStep : null;
    const stepProps = {
      wizardState,
      updateState,
      onNext: nextStep,
      onBack: handleBack,
      config: onboardingWizard,
      stepData: currentStepData
    };
    switch (currentStepData.id) {
      case 'onboarding-step-welcome':
        return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)(_steps_WelcomeStep__WEBPACK_IMPORTED_MODULE_6__["default"], {
          ...stepProps
        });
      case 'onboarding-step-whats-what':
        return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)(_steps_WhatsWhatStep__WEBPACK_IMPORTED_MODULE_7__["default"], {
          ...stepProps
        });
      case 'onboarding-step-first-task':
        return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)(_steps_FirstTaskStep__WEBPACK_IMPORTED_MODULE_8__["default"], {
          ...stepProps
        });
      case 'onboarding-step-badges':
        return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)(_steps_BadgesStep__WEBPACK_IMPORTED_MODULE_9__["default"], {
          ...stepProps
        });
      case 'onboarding-step-email-frequency':
        return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)(_steps_EmailFrequencyStep__WEBPACK_IMPORTED_MODULE_10__["default"], {
          ...stepProps
        });
      case 'onboarding-step-settings':
        return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)(_steps_SettingsStep__WEBPACK_IMPORTED_MODULE_11__["default"], {
          ...stepProps
        });
      case 'onboarding-step-more-tasks':
        return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)(_steps_MoreTasksStep__WEBPACK_IMPORTED_MODULE_12__["default"], {
          ...stepProps
        });
      default:
        return null;
    }
  };

  // Show loading state while fetching config.
  if (isLoadingConfig) {
    return null; // Don't render while loading.
  }

  // Show error state if config failed to load and no fallback.
  if (configError && !fallbackWizard) {
    return null; // Don't render on error.
  }

  // Always render wizard (like develop's add_popover), but control visibility via isOpen.
  // If wizard is not enabled, don't render at all.
  if (!onboardingWizard?.enabled) {
    return null;
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.Fragment, {
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsxs)("div", {
      ref: popoverRefCallback,
      id: "prpl-popover-onboarding",
      className: "prpl-popover-onboarding",
      popover: "manual",
      tabIndex: -1,
      "data-prpl-step": currentStep,
      role: "dialog",
      "aria-modal": "true",
      "aria-labelledby": "prpl-onboarding-title",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsxs)("div", {
        className: "prpl-onboarding-layout",
        children: [!showQuitConfirmation && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)(_OnboardingNavigation__WEBPACK_IMPORTED_MODULE_13__["default"], {
          steps: steps,
          currentStep: currentStep,
          logoHtml: onboardingWizard.logoHtml
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)("div", {
          className: "prpl-onboarding-content",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)("div", {
            className: "tour-content-wrapper",
            children: renderStep()
          })
        })]
      }), !showQuitConfirmation && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)("button", {
        id: "prpl-tour-close-btn",
        className: "prpl-popover-close",
        onClick: handleClose,
        "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Close', 'progress-planner'),
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)("span", {
          className: "dashicons dashicons-no-alt"
        })
      })]
    })
  });
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (OnboardingWizard);

/***/ }),

/***/ "./assets/src/components/OnboardingWizard/steps/BadgesStep.js":
/*!********************************************************************!*\
  !*** ./assets/src/components/OnboardingWizard/steps/BadgesStep.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ BadgesStep)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _OnboardingStep__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../OnboardingStep */ "./assets/src/components/OnboardingWizard/OnboardingStep.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);
/**
 * BadgesStep Component
 *
 * Step explaining the badge system.
 *
 * @package
 */





/**
 * BadgesStep component.
 *
 * @param {Object} props - Component props.
 * @return {JSX.Element} Badges step component.
 */

function BadgesStep(props) {
  const {
    wizardState,
    stepData
  } = props;
  const gaugeRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const badgeData = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => stepData?.data || {}, [stepData?.data]);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    // Initialize badge gauge component if available.
    if (gaugeRef.current && window.customElements?.get('prpl-gauge')) {
      const gauge = gaugeRef.current.querySelector('prpl-gauge');
      if (gauge && badgeData.badgeId && badgeData.badgeName) {
        // Increment badge points after first task completion.
        setTimeout(() => {
          if (gauge && wizardState.data.firstTaskCompleted) {
            gauge.setAttribute('data-value', (parseFloat(gauge.getAttribute('data-value')) || 0) + 1);
          }
        }, 1500);
      }
    }
  }, [wizardState.data.firstTaskCompleted, badgeData]);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_OnboardingStep__WEBPACK_IMPORTED_MODULE_2__["default"], {
    ...props,
    canProceed: () => true,
    buttonText: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Got it', 'progress-planner'),
    buttonClass: "prpl-btn-secondary",
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
      className: "tour-content",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
        className: "prpl-columns-wrapper-flex prpl-columns-2-1",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
          className: "prpl-column",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
            className: "prpl-background-content",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("h3", {
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Whoohoo, nice one! You just earned your first point!', 'progress-planner')
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("p", {
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Gather ten points this month to unlock your special badge.', 'progress-planner')
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("p", {
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("You're off to a great start!", 'progress-planner')
            })]
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
          className: "prpl-column",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
            className: "prpl-gauge-wrapper",
            ref: gaugeRef,
            children: [badgeData.badgeId && badgeData.badgeName && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("prpl-gauge", {
              id: "prpl-gauge-onboarding",
              background: "#fff",
              color: "var(--prpl-color-monthly)",
              contentFontSize: "3rem",
              contentPadding: "20px",
              marginBottom: "0",
              "data-max": badgeData.maxPoints || 10,
              "data-value": badgeData.currentValue || 0,
              "data-badge-id": badgeData.badgeId,
              "data-badge-name": badgeData.badgeName,
              "data-branding-id": badgeData.brandingId || ''
            }), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Monthly badge', 'progress-planner')]
          })
        })]
      })
    })
  });
}

/***/ }),

/***/ "./assets/src/components/OnboardingWizard/steps/EmailFrequencyStep.js":
/*!****************************************************************************!*\
  !*** ./assets/src/components/OnboardingWizard/steps/EmailFrequencyStep.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ EmailFrequencyStep)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/api-fetch */ "@wordpress/api-fetch");
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _OnboardingStep__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../OnboardingStep */ "./assets/src/components/OnboardingWizard/OnboardingStep.js");
/* harmony import */ var _FormInputs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../FormInputs */ "./assets/src/components/FormInputs/index.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__);
/**
 * EmailFrequencyStep Component
 *
 * Step for configuring email frequency preferences.
 *
 * @package
 */







/**
 * EmailFrequencyStep component.
 *
 * @param {Object} props - Component props.
 * @return {JSX.Element} EmailFrequency step component.
 */

function EmailFrequencyStep(props) {
  const {
    wizardState,
    updateState,
    config,
    onNext
  } = props;
  const {
    userFirstName = '',
    userEmail = '',
    site,
    timezoneOffset
  } = config;
  const [emailFrequency, setEmailFrequency] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(() => {
    const saved = wizardState.data.emailFrequency;
    return {
      choice: saved?.choice || 'weekly',
      name: saved?.name || userFirstName,
      email: saved?.email || userEmail
    };
  });
  const [isSubscribing, setIsSubscribing] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [subscriptionError, setSubscriptionError] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);

  // Update wizard state when email frequency changes.
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    updateState({
      data: {
        ...wizardState.data,
        emailFrequency
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emailFrequency]);

  /**
   * Check if can proceed.
   *
   * @return {boolean} True if can proceed.
   */
  const canProceed = () => {
    // Disable button while subscribing.
    if (isSubscribing) {
      return false;
    }
    if (!emailFrequency.choice) {
      return false;
    }

    // If user chose "don't email", they can proceed immediately.
    if (emailFrequency.choice === 'none') {
      return true;
    }

    // If user chose "weekly", check that name and email are filled.
    if (emailFrequency.choice === 'weekly') {
      return !!(emailFrequency.name && emailFrequency.email);
    }
    return false;
  };

  /**
   * Handle next button click.
   * Subscribes user if they chose weekly emails, then proceeds to next step.
   */
  const handleNext = async () => {
    // If user chose "don't email", proceed immediately without API call.
    if (emailFrequency.choice === 'none') {
      onNext();
      return;
    }

    // If user chose "weekly", subscribe via REST API first.
    if (emailFrequency.choice === 'weekly') {
      setIsSubscribing(true);
      setSubscriptionError(null);
      try {
        const siteUrl = site || window.location.origin;
        const tzOffset = timezoneOffset !== undefined ? timezoneOffset : new Date().getTimezoneOffset() / -60; // Convert to hours

        const response = await _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_2___default()({
          path: '/progress-planner/v1/popover/subscribe',
          method: 'POST',
          data: {
            name: emailFrequency.name.trim(),
            email: emailFrequency.email.trim(),
            site: siteUrl,
            timezone_offset: tzOffset,
            with_email: 'yes'
          }
        });
        if (response.success) {
          // Subscription successful, proceed to next step.
          onNext();
        } else {
          throw new Error(response.message || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Failed to subscribe. Please try again.', 'progress-planner'));
        }
      } catch (error) {
        console.error('Failed to subscribe:', error);
        setSubscriptionError(error.message || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Failed to subscribe. Please try again.', 'progress-planner'));
      } finally {
        setIsSubscribing(false);
      }
    }
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_OnboardingStep__WEBPACK_IMPORTED_MODULE_3__["default"], {
    ...props,
    canProceed: canProceed,
    onNext: handleNext,
    buttonText: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Got it', 'progress-planner'),
    buttonClass: "prpl-btn-secondary",
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
      className: "tour-content",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
        className: "prpl-columns-wrapper-flex prpl-columns-1-2",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
          className: "prpl-column",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
            className: "prpl-background-content",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("p", {
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Stay on track with emails that include recommendations, updates and useful news.', 'progress-planner')
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("p", {
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Choose how often you want a little nudge to keep your site moving forward.', 'progress-planner')
            })]
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
          className: "prpl-column",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("h3", {
            className: "tour-title",
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Email Frequency', 'progress-planner')
          }), subscriptionError && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
            className: "prpl-error-message",
            style: {
              padding: '0.75rem',
              marginBottom: '1rem',
              backgroundColor: '#fee',
              border: '1px solid #fcc',
              borderRadius: '4px',
              color: '#c33'
            },
            children: subscriptionError
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
            className: "prpl-email-frequency-options",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_FormInputs__WEBPACK_IMPORTED_MODULE_4__.CustomRadio, {
              id: "prpl-email-weekly",
              name: "email-frequency",
              value: "weekly",
              checked: emailFrequency.choice === 'weekly',
              onChange: e => {
                setEmailFrequency({
                  ...emailFrequency,
                  choice: e.target.value
                });
                setSubscriptionError(null);
              },
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Email me weekly', 'progress-planner')
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_FormInputs__WEBPACK_IMPORTED_MODULE_4__.CustomRadio, {
              id: "prpl-dont-email",
              name: "email-frequency",
              value: "none",
              checked: emailFrequency.choice === 'none',
              onChange: e => {
                setEmailFrequency({
                  ...emailFrequency,
                  choice: e.target.value
                });
                setSubscriptionError(null);
              },
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Don't email me", 'progress-planner')
            })]
          }), emailFrequency.choice === 'weekly' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
            id: "prpl-email-form",
            style: {
              marginTop: '1rem'
            },
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("label", {
              htmlFor: "prpl-email-name",
              style: {
                display: 'grid',
                gridTemplateColumns: '1fr 3fr',
                marginBottom: '0.5em',
                gap: 'var(--prpl-padding)'
              },
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("span", {
                children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('First name', 'progress-planner')
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("input", {
                id: "prpl-email-name",
                type: "text",
                value: emailFrequency.name,
                onChange: e => setEmailFrequency({
                  ...emailFrequency,
                  name: e.target.value.trim()
                })
              })]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("label", {
              htmlFor: "prpl-email-address",
              style: {
                display: 'grid',
                gridTemplateColumns: '1fr 3fr',
                marginBottom: '0.5em',
                gap: 'var(--prpl-padding)'
              },
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("span", {
                children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Email', 'progress-planner')
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("input", {
                id: "prpl-email-address",
                type: "email",
                value: emailFrequency.email,
                onChange: e => setEmailFrequency({
                  ...emailFrequency,
                  email: e.target.value.trim()
                })
              })]
            })]
          })]
        })]
      })
    })
  });
}

/***/ }),

/***/ "./assets/src/components/OnboardingWizard/steps/FirstTaskStep.js":
/*!***********************************************************************!*\
  !*** ./assets/src/components/OnboardingWizard/steps/FirstTaskStep.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ FirstTaskStep)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _hooks_useTaskCompletion__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../hooks/useTaskCompletion */ "./assets/src/hooks/useTaskCompletion/index.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);
/**
 * FirstTaskStep Component
 *
 * Step for completing the first onboarding task.
 * The Next button is hidden - user advances by completing the task.
 *
 * @package
 */





/**
 * FirstTaskStep component.
 *
 * @param {Object} props - Component props.
 * @return {JSX.Element} FirstTask step component.
 */

function FirstTaskStep(props) {
  const {
    wizardState,
    updateState,
    onNext,
    stepData,
    config
  } = props;
  const {
    ajaxUrl,
    nonce
  } = config;
  const brandingName = config?.l10n?.brandingName || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Progress Planner', 'progress-planner');
  const {
    completeTask
  } = (0,_hooks_useTaskCompletion__WEBPACK_IMPORTED_MODULE_2__.useTaskCompletion)({
    ajaxUrl,
    nonce
  });
  const [isCompleting, setIsCompleting] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const taskContentRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const task = stepData?.data?.task;

  /**
   * Handle task completion.
   *
   * @param {string} taskId     - Task ID.
   * @param {Object} formValues - Form values from task.
   */
  const handleCompleteTask = async (taskId, formValues = {}) => {
    if (!taskId || isCompleting) {
      return;
    }
    setIsCompleting(true);
    try {
      await completeTask(taskId, formValues);
      updateState({
        data: {
          ...wizardState.data,
          firstTaskCompleted: true
        }
      });
      // Auto-advance to next step.
      onNext();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to complete task:', error);
      setIsCompleting(false);
    }
  };

  // Attach click handler to task button after render (for template_html).
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!taskContentRef.current) {
      return;
    }
    const btn = taskContentRef.current.querySelector('.prpl-complete-task-btn');
    if (!btn) {
      return;
    }
    const handleClick = e => {
      e.preventDefault();
      const button = e.target.closest('button');
      const taskId = button?.dataset?.taskId || task?.task_id;
      const form = button?.closest('form');
      let formValues = {};
      if (form) {
        const formData = new FormData(form);
        formValues = Object.fromEntries(formData.entries());
      }
      handleCompleteTask(taskId, formValues);
    };
    btn.addEventListener('click', handleClick);
    return () => {
      btn.removeEventListener('click', handleClick);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task]);

  // Skip step if no task available.
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!task) {
      onNext();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task]);
  if (!task) {
    return null;
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
    className: "onboarding-step",
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
      className: "tour-content",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
        className: "prpl-columns-wrapper-flex",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
          className: "prpl-column",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
            className: "prpl-background-content",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("h3", {
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Ready for your first task and your first point?', 'progress-planner')
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("p", {
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.sprintf)(/* translators: %s: Progress Planner name */
              (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("This is an example of a recommendation in %s. It's a task that helps improve your website. Most recommendations can be completed in under five minutes. Once you've completed a recommendation, we'll celebrate your success together and provide you with a new recommendation.", 'progress-planner'), brandingName)
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("p", {
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Let's give it a try!", 'progress-planner')
            })]
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
          className: "prpl-column",
          ref: taskContentRef,
          children: task.template_html ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
            dangerouslySetInnerHTML: {
              __html: task.template_html
            }
          }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
            className: "prpl-first-task-content",
            children: [task.title && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("h4", {
              children: task.title
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("button", {
              type: "button",
              className: "prpl-complete-task-btn prpl-btn prpl-btn-secondary",
              "data-task-id": task.task_id,
              disabled: isCompleting,
              children: isCompleting ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Completing…', 'progress-planner') : task.action_label || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Mark as complete', 'progress-planner')
            })]
          })
        })]
      })
    })
  });
}

/***/ }),

/***/ "./assets/src/components/OnboardingWizard/steps/MoreTasksStep.js":
/*!***********************************************************************!*\
  !*** ./assets/src/components/OnboardingWizard/steps/MoreTasksStep.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ MoreTasksStep)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _OnboardingStep__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../OnboardingStep */ "./assets/src/components/OnboardingWizard/OnboardingStep.js");
/* harmony import */ var _OnboardTask__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../OnboardTask */ "./assets/src/components/OnboardingWizard/OnboardTask.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__);
/**
 * MoreTasksStep Component
 *
 * Step for completing additional tasks with 2 sub-steps:
 * 1. Intro screen (can skip to finish)
 * 2. Task list screen (uses OnboardTask component)
 *
 * @package
 */






const SUB_STEPS = ['intro', 'tasks'];

/**
 * MoreTasksStep component.
 *
 * @param {Object} props - Component props.
 * @return {JSX.Element} MoreTasks step component.
 */
function MoreTasksStep(props) {
  const {
    wizardState,
    updateState,
    stepData,
    config
  } = props;
  const [currentSubStep, setCurrentSubStep] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(0);
  const [completedTasks, setCompletedTasks] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)({});
  const tasks = stepData?.data?.tasks || [];

  // Initialize completed tasks from wizard state.
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (wizardState.data.moreTasksCompleted) {
      setCompletedTasks(wizardState.data.moreTasksCompleted);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Handle task completion.
   *
   * @param {string} taskId - Completed task ID.
   */
  const handleTaskComplete = taskId => {
    setCompletedTasks(prev => ({
      ...prev,
      [taskId]: true
    }));
    updateState({
      data: {
        ...wizardState.data,
        moreTasksCompleted: {
          ...completedTasks,
          [taskId]: true
        }
      }
    });
  };

  /**
   * Handle continue from intro.
   */
  const handleContinue = () => {
    setCurrentSubStep(1);
  };

  /**
   * Handle finish onboarding.
   */
  const handleFinish = async () => {
    // Mark wizard as finished.
    updateState({
      data: {
        ...wizardState.data,
        finished: true
      }
    });

    // Save progress before redirecting.
    // Note: Progress saving is handled by the parent wizard component.
    // We just mark as finished and redirect.

    // Finish onboarding - redirect to dashboard.
    window.location.href = config?.lastStepRedirectUrl || '/wp-admin/admin.php?page=progress-planner';
  };

  /**
   * Render current sub-step.
   *
   * @return {JSX.Element} Current sub-step content.
   */
  const renderSubStep = () => {
    if (currentSubStep === 0) {
      // Intro sub-step.
      return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
        className: "prpl-more-tasks-substep",
        "data-substep": "more-tasks-intro",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
          className: "prpl-columns-wrapper-flex prpl-columns-2-1",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
            className: "prpl-column",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
              className: "prpl-background-content",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("p", {
                children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("strong", {
                  children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Well done! Great work so far!', 'progress-planner')
                })
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("p", {
                children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('You can take on a few more recommendations if you feel like it, or jump straight to your dashboard.', 'progress-planner')
              })]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
              className: "prpl-more-tasks-intro-buttons",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("a", {
                href: config?.lastStepRedirectUrl || '/wp-admin/admin.php?page=progress-planner',
                className: "prpl-finish-onboarding",
                onClick: e => {
                  e.preventDefault();
                  handleFinish();
                },
                children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Take me to the dashboard', 'progress-planner')
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("button", {
                type: "button",
                className: "prpl-btn prpl-btn-secondary prpl-more-tasks-continue",
                onClick: handleContinue,
                children: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Yes! Let's tackle more tasks", 'progress-planner'), ' ', "\u203A"]
              })]
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
            className: "prpl-column prpl-hide-on-mobile",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
              id: "prpl-success-graphic",
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
                style: {
                  width: '100%',
                  height: '200px',
                  backgroundColor: '#f0f0f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#999'
                },
                children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Graphic placeholder', 'progress-planner')
              })
            })
          })]
        })
      });
    }

    // Tasks sub-step.
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
      className: "prpl-more-tasks-substep",
      "data-substep": "tasks",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("h3", {
        className: "tour-title",
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Complete more tasks', 'progress-planner')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
        className: "prpl-task-list",
        children: tasks.map(task => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_OnboardTask__WEBPACK_IMPORTED_MODULE_3__["default"], {
          task: task,
          config: config,
          onComplete: handleTaskComplete
        }, task.task_id))
      })]
    });
  };

  /**
   * Handle next button click.
   */
  const handleNext = () => {
    // If on intro sub-step, continue to tasks.
    if (currentSubStep === 0) {
      handleContinue();
      return;
    }

    // If on tasks sub-step, finish onboarding.
    if (currentSubStep === SUB_STEPS.length - 1) {
      handleFinish();
    }
  };

  /**
   * Check if can proceed.
   *
   * @return {boolean} True if on tasks sub-step.
   */
  const canProceed = () => {
    return currentSubStep === SUB_STEPS.length - 1;
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_OnboardingStep__WEBPACK_IMPORTED_MODULE_2__["default"], {
    ...props,
    canProceed: canProceed,
    onNext: handleNext,
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
      className: "tour-content",
      children: renderSubStep()
    })
  });
}

/***/ }),

/***/ "./assets/src/components/OnboardingWizard/steps/SettingsStep.js":
/*!**********************************************************************!*\
  !*** ./assets/src/components/OnboardingWizard/steps/SettingsStep.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ SettingsStep)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _utils_ajaxRequest__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../utils/ajaxRequest */ "./assets/src/utils/ajaxRequest/index.js");
/* harmony import */ var _OnboardingStep__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../OnboardingStep */ "./assets/src/components/OnboardingWizard/OnboardingStep.js");
/* harmony import */ var _FormInputs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../FormInputs */ "./assets/src/components/FormInputs/index.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__);
/**
 * SettingsStep Component
 *
 * Step for configuring settings with 6 internal sub-steps:
 * homepage, about, contact, faq, post-types, login-destination
 *
 * @package
 */







const SUB_STEPS = ['homepage', 'about', 'contact', 'faq', 'post-types'];

/**
 * SettingsStep component.
 *
 * @param {Object} props - Component props.
 * @return {JSX.Element} Settings step component.
 */
function SettingsStep(props) {
  const {
    wizardState,
    updateState,
    config
  } = props;
  const {
    ajaxUrl,
    nonce,
    pages = [],
    postTypes = [],
    pageTypes = {}
  } = config;
  const [currentSubStep, setCurrentSubStep] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(0);
  const [settings, setSettings] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(() => {
    // Default: hasPage: true means checkbox is unchecked (user has a page).
    // Default: all post types selected.
    const allPostTypeIds = postTypes.map(pt => pt.id);
    const defaults = {
      homepage: {
        hasPage: true,
        pageId: null
      },
      about: {
        hasPage: true,
        pageId: null
      },
      contact: {
        hasPage: true,
        pageId: null
      },
      faq: {
        hasPage: true,
        pageId: null
      },
      'post-types': {
        selectedTypes: allPostTypeIds
      }
    };
    // Merge with saved settings, but ensure hasPage defaults are respected.
    if (wizardState.data.settings) {
      return {
        ...defaults,
        ...wizardState.data.settings
      };
    }
    return defaults;
  });
  const [isSaving, setIsSaving] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);

  // Update wizard state when settings change.
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    updateState({
      data: {
        ...wizardState.data,
        settings
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings]);

  /**
   * Save current sub-step setting.
   *
   * @param {string} subStepName - Name of sub-step.
   * @param {Object} subStepData - Data for sub-step.
   */
  const saveSubStep = async (subStepName, subStepData) => {
    setIsSaving(true);
    try {
      // Save individual sub-step via AJAX if needed.
      // For now, we'll save all at once at the end.
      setSettings(prev => ({
        ...prev,
        [subStepName]: subStepData
      }));
    } catch (error) {
      console.error('Failed to save setting:', error);
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Save all settings at once.
   */
  const saveAllSettings = async () => {
    setIsSaving(true);
    try {
      const pagesData = {};
      ['homepage', 'about', 'contact', 'faq'].forEach(pageType => {
        if (settings[pageType]) {
          pagesData[pageType] = {
            id: settings[pageType].pageId || 0,
            have_page: settings[pageType].hasPage ? 'yes' : 'not-applicable'
          };
        }
      });
      await (0,_utils_ajaxRequest__WEBPACK_IMPORTED_MODULE_2__.ajaxRequest)({
        url: ajaxUrl,
        data: {
          action: 'prpl_save_all_onboarding_settings',
          nonce,
          pages: JSON.stringify(pagesData),
          'prpl-post-types-include': settings['post-types']?.selectedTypes || []
        }
      });
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Handle next sub-step.
   */
  const handleNextSubStep = async () => {
    const subStepName = SUB_STEPS[currentSubStep];
    const subStepData = settings[subStepName];

    // Save current sub-step.
    await saveSubStep(subStepName, subStepData);

    // If last sub-step, save all settings and advance to next step.
    if (currentSubStep === SUB_STEPS.length - 1) {
      await saveAllSettings();
      // Small delay to ensure settings are saved before advancing.
      setTimeout(() => {
        props.onNext();
      }, 100);
    } else {
      setCurrentSubStep(currentSubStep + 1);
    }
  };

  /**
   * Render current sub-step.
   *
   * @return {JSX.Element} Current sub-step content.
   */
  const renderSubStep = () => {
    const subStepName = SUB_STEPS[currentSubStep];
    const subStepData = settings[subStepName] || {};
    switch (subStepName) {
      case 'homepage':
      case 'about':
      case 'contact':
      case 'faq':
        {
          const pageType = pageTypes[subStepName] || {};
          let pageTitle = pageType.title;
          if (!pageTitle) {
            if (subStepName === 'homepage') {
              pageTitle = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Home page', 'progress-planner');
            } else if (subStepName === 'about') {
              pageTitle = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('About page', 'progress-planner');
            } else if (subStepName === 'contact') {
              pageTitle = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Contact page', 'progress-planner');
            } else if (subStepName === 'faq') {
              pageTitle = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('FAQ page', 'progress-planner');
            } else {
              pageTitle = subStepName;
            }
          }
          const pageDescription = pageType.description || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Select a page', 'progress-planner');
          return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
            className: "prpl-setting-item",
            "data-page": subStepName,
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
              className: "prpl-columns-wrapper-flex prpl-columns-1-2",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
                className: "prpl-column",
                children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
                  className: "prpl-background-content",
                  children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("p", {
                    children: pageDescription
                  })
                })
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
                className: "prpl-column",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
                  className: "prpl-setting-header",
                  children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("h3", {
                    className: "prpl-setting-title",
                    children: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Settings:', 'progress-planner'), ' ', pageTitle, /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("span", {
                      className: "prpl-settings-progress",
                      children: [currentSubStep + 1, "/", SUB_STEPS.length]
                    })]
                  })
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
                  className: "prpl-setting-content",
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
                    className: `prpl-select-page${!subStepData.hasPage ? ' prpl-disabled' : ''}`,
                    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("select", {
                      name: `pages[${subStepName}][id]`,
                      value: subStepData.pageId || '',
                      disabled: !subStepData.hasPage,
                      onChange: e => setSettings(prev => ({
                        ...prev,
                        [subStepName]: {
                          ...prev[subStepName],
                          pageId: parseInt(e.target.value, 10) || null
                        }
                      })),
                      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("option", {
                        value: "",
                        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('— Select page —', 'progress-planner')
                      }), pages.map(page => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("option", {
                        value: page.id,
                        children: page.title
                      }, page.id))]
                    })
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
                    className: "prpl-checkbox-wrapper",
                    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_FormInputs__WEBPACK_IMPORTED_MODULE_4__.CustomCheckbox, {
                      id: `prpl-no-${subStepName}-page`,
                      checked: !subStepData.hasPage,
                      onChange: e => {
                        const noPage = e.target.checked;
                        setSettings(prev => ({
                          ...prev,
                          [subStepName]: {
                            ...prev[subStepName],
                            hasPage: !noPage,
                            // Reset pageId when checkbox is checked.
                            pageId: noPage ? null : prev[subStepName]?.pageId
                          }
                        }));
                      },
                      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.sprintf)(/* translators: %s: page type title */
                      (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("I don't have a %s yet", 'progress-planner'), pageTitle)
                    })
                  }), !subStepData.hasPage && pageType.note && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
                    className: "prpl-setting-note",
                    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("span", {
                      className: "prpl-setting-note-icon",
                      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("svg", {
                        width: "20",
                        height: "20",
                        viewBox: "0 0 20 20",
                        fill: "currentColor",
                        xmlns: "http://www.w3.org/2000/svg",
                        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("path", {
                          d: "M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm1 15H9v-6h2v6zm0-8H9V5h2v2z"
                        })
                      })
                    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("p", {
                      children: pageType.note
                    })]
                  })]
                })]
              })]
            })
          });
        }
      case 'post-types':
        return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
          className: "prpl-setting-item",
          "data-page": "post-types",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("h3", {
            children: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Post Types', 'progress-planner'), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("span", {
              className: "prpl-settings-progress",
              children: [currentSubStep + 1, "/", SUB_STEPS.length]
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("p", {
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Select which post types to include in your activity tracking.', 'progress-planner')
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
            id: "prpl-post-types-include-wrapper",
            children: postTypes.map(postType => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_FormInputs__WEBPACK_IMPORTED_MODULE_4__.ToggleSwitch, {
              id: `prpl-post-type-${postType.id}`,
              name: "prpl-post-types-include[]",
              value: postType.id,
              checked: subStepData.selectedTypes?.includes(postType.id) || false,
              onChange: e => {
                const isChecked = e.target.checked;
                setSettings(prev => ({
                  ...prev,
                  'post-types': {
                    selectedTypes: isChecked ? [...(prev['post-types']?.selectedTypes || []), postType.id] : (prev['post-types']?.selectedTypes || []).filter(id => id !== postType.id)
                  }
                }));
              },
              label: postType.title
            }, postType.id))
          })]
        });
      default:
        return null;
    }
  };

  /**
   * Check if current sub-step can proceed.
   * Page sub-steps require either a page selection OR checkbox checked.
   * Post-types sub-step requires at least one post type selected.
   *
   * @return {boolean} True if can proceed.
   */
  const canProceed = () => {
    if (isSaving) {
      return false;
    }
    const subStepName = SUB_STEPS[currentSubStep];
    const subStepData = settings[subStepName] || {};

    // For page selection sub-steps.
    if (['homepage', 'about', 'contact', 'faq'].includes(subStepName)) {
      // Can proceed if checkbox is checked (no page) OR a page is selected.
      return !subStepData.hasPage || !!subStepData.pageId;
    }

    // For post-types, require at least one selected.
    if (subStepName === 'post-types') {
      return subStepData.selectedTypes && subStepData.selectedTypes.length > 0;
    }
    return true;
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_OnboardingStep__WEBPACK_IMPORTED_MODULE_3__["default"], {
    ...props,
    canProceed: canProceed,
    onNext: handleNextSubStep,
    isLoading: isSaving,
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
      className: "tour-content",
      children: renderSubStep()
    })
  });
}

/***/ }),

/***/ "./assets/src/components/OnboardingWizard/steps/WelcomeStep.js":
/*!*********************************************************************!*\
  !*** ./assets/src/components/OnboardingWizard/steps/WelcomeStep.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ WelcomeStep)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _OnboardingStep__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../OnboardingStep */ "./assets/src/components/OnboardingWizard/OnboardingStep.js");
/* harmony import */ var _hooks_useLicenseGenerator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../hooks/useLicenseGenerator */ "./assets/src/hooks/useLicenseGenerator/index.js");
/* harmony import */ var _FormInputs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../FormInputs */ "./assets/src/components/FormInputs/index.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__);
/**
 * WelcomeStep Component
 *
 * First step: Privacy policy acceptance and license generation.
 *
 * @package
 */







/**
 * WelcomeStep component.
 *
 * @param {Object} props - Component props.
 * @return {JSX.Element} Welcome step component.
 */

function WelcomeStep(props) {
  const {
    wizardState,
    updateState,
    config
  } = props;
  const {
    onboardNonceURL,
    onboardAPIUrl,
    ajaxUrl,
    nonce,
    site,
    timezoneOffset,
    hasLicense,
    l10n,
    baseUrl,
    privacyPolicyUrl
  } = config;
  const {
    generateLicense,
    isGenerating
  } = (0,_hooks_useLicenseGenerator__WEBPACK_IMPORTED_MODULE_3__.useLicenseGenerator)({
    onboardNonceURL,
    onboardAPIUrl,
    ajaxUrl,
    nonce,
    siteUrl: site,
    timezoneOffset
  });
  const [privacyAccepted, setPrivacyAccepted] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(wizardState.data.privacyAccepted || false);

  // Update wizard state when privacy acceptance changes.
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    updateState({
      data: {
        ...wizardState.data,
        privacyAccepted
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [privacyAccepted]);

  /**
   * Handle next button click.
   */
  const handleNext = async () => {
    // If no license and privacy accepted, generate license first.
    if (!hasLicense && privacyAccepted) {
      try {
        await generateLicense({
          'with-email': 'no' // Default for wizard
        });
        // Continue to next step (don't reload - matches develop branch behavior).
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to generate license:', error);
        return;
      }
    }
    props.onNext();
  };

  /**
   * Check if can proceed.
   *
   * @return {boolean} True if can proceed.
   */
  const canProceed = () => {
    // Sites with license can always proceed.
    if (hasLicense) {
      return true;
    }
    return privacyAccepted;
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_OnboardingStep__WEBPACK_IMPORTED_MODULE_2__["default"], {
    ...props,
    onNext: handleNext,
    canProceed: canProceed,
    isLoading: isGenerating,
    buttonText: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.Fragment, {
      children: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Start onboarding', 'progress-planner'), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("span", {
        className: "dashicons dashicons-arrow-right-alt2"
      })]
    }),
    buttonClass: "prpl-btn-secondary",
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
      className: "tour-content",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
        className: "prpl-columns-wrapper-flex prpl-columns-2-1",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
          className: "prpl-column",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
            className: "prpl-background-content",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("h3", {
              className: "tour-title",
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Hi there! Ready to push your website forward? Let's go!", 'progress-planner')
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("p", {
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.sprintf)(/* translators: %s: Progress Planner name */
              (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("%s helps you set clear, focused goals for your website. Let's go through a few simple steps to get everything set up.", 'progress-planner'), l10n?.brandingName || 'Progress Planner')
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("p", {
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('This will only take a few minutes.', 'progress-planner')
            })]
          }), !hasLicense && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
            className: "prpl-privacy-checkbox-wrapper",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_FormInputs__WEBPACK_IMPORTED_MODULE_4__.CustomCheckbox, {
              id: "prpl-privacy-checkbox",
              checked: privacyAccepted,
              onChange: e => {
                setPrivacyAccepted(e.target.checked);
                // Remove active class from required indicator (like develop).
                const requiredIndicator = document.querySelector('.prpl-privacy-checkbox-wrapper .prpl-required-indicator');
                if (requiredIndicator) {
                  requiredIndicator.classList.remove('prpl-required-indicator-active');
                }
              },
              label: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.Fragment, {
                children: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('I accept the', 'progress-planner'), ' ', /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("a", {
                  href: privacyPolicyUrl || 'https://progressplanner.com/privacy-policy/#h-plugin-privacy-policy',
                  target: "_blank",
                  rel: "noopener noreferrer",
                  children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('privacy policy', 'progress-planner')
                }), ' ', (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('and the essential data processing needed for the plugin.', 'progress-planner'), ' ', /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("span", {
                  className: "prpl-required-indicator",
                  children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Required', 'progress-planner')
                })]
              })
            })
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
          className: "prpl-column prpl-hide-on-mobile",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
            id: "prpl-welcome-graphic",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("img", {
              src: `${baseUrl || ''}/assets/images/onboarding/thumbs_up_ravi_rtl.svg`,
              alt: "",
              style: {
                maxWidth: '100%',
                height: 'auto'
              }
            })
          })
        })]
      })
    })
  });
}

/***/ }),

/***/ "./assets/src/components/OnboardingWizard/steps/WhatsWhatStep.js":
/*!***********************************************************************!*\
  !*** ./assets/src/components/OnboardingWizard/steps/WhatsWhatStep.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ WhatsWhatStep)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _OnboardingStep__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../OnboardingStep */ "./assets/src/components/OnboardingWizard/OnboardingStep.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__);
/**
 * WhatsWhatStep Component
 *
 * Step explaining what Progress Planner does.
 *
 * @package
 */




/**
 * WhatsWhatStep component.
 *
 * @param {Object} props - Component props.
 * @return {JSX.Element} WhatsWhat step component.
 */

function WhatsWhatStep(props) {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_OnboardingStep__WEBPACK_IMPORTED_MODULE_1__["default"], {
    ...props,
    canProceed: () => true,
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
      className: "tour-content",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
        className: "prpl-columns-wrapper-flex",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
          className: "prpl-column",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
            className: "prpl-background-content",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("h3", {
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Recommendations', 'progress-planner')
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("p", {
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Tasks that show you what to work on next.', 'progress-planner')
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("p", {
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('These actions help you improve your site step by step, without having to guess where to start.', 'progress-planner')
            })]
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
          className: "prpl-column",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
            className: "prpl-background-content",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("h3", {
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Badges', 'progress-planner')
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("p", {
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("span", {
                className: "prpl-suggested-task-points",
                children: "+1"
              }), ' ', (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('You earn points for every completed task.', 'progress-planner')]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("p", {
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Collect badges as you make progress, which keeps things fun and helps you stay motivated!', 'progress-planner')
            })]
          })
        })]
      })
    })
  });
}

/***/ }),

/***/ "./assets/src/dashboard.js":
/*!*********************************!*\
  !*** ./assets/src/dashboard.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/api-fetch */ "@wordpress/api-fetch");
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _components_Dashboard__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/Dashboard */ "./assets/src/components/Dashboard/index.js");
/* harmony import */ var _utils_prplSuggestedTask__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils/prplSuggestedTask */ "./assets/src/utils/prplSuggestedTask/index.js");
/* harmony import */ var _services_preloadingMiddleware__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./services/preloadingMiddleware */ "./assets/src/services/preloadingMiddleware.js");
/* harmony import */ var _utils_widgetRegistry__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./utils/widgetRegistry */ "./assets/src/utils/widgetRegistry/index.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__);
/**
 * Dashboard Entry Point
 *
 * Single entry point for the entire Progress Planner dashboard.
 * Mounts the Dashboard component to the DOM.
 */







// Register preloading middleware BEFORE any API calls are made.
// This intercepts apiFetch calls and returns preloaded data instantly.
if (window.prplPreloadedData) {
  _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_0___default().use((0,_services_preloadingMiddleware__WEBPACK_IMPORTED_MODULE_4__.createPreloadingMiddleware)(window.prplPreloadedData));
}
// Initialize widget registry (sets up hook listener for widget registrations)


// Attach to window immediately so inline onclick handlers can access it.
// This must be done before React renders to ensure it's available when
// PHP-generated HTML with inline handlers is parsed.

window.prplSuggestedTask = _utils_prplSuggestedTask__WEBPACK_IMPORTED_MODULE_3__["default"];

/**
 * Initialize the dashboard.
 */
function init() {
  const container = document.getElementById('prpl-dashboard-root');
  if (container) {
    const root = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createRoot)(container);
    const config = window.prplDashboardConfig || {};
    root.render(/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_components_Dashboard__WEBPACK_IMPORTED_MODULE_2__["default"], {
      config: config
    }));
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

/***/ }),

/***/ "./assets/src/hooks/useLicenseGenerator/index.js":
/*!*******************************************************!*\
  !*** ./assets/src/hooks/useLicenseGenerator/index.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useLicenseGenerator: () => (/* binding */ useLicenseGenerator)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utils_ajaxRequest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utils/ajaxRequest */ "./assets/src/utils/ajaxRequest/index.js");
/**
 * useLicenseGenerator Hook
 *
 * Handles license key generation during onboarding.
 *
 * @package
 */




/**
 * Hook for generating license keys during onboarding.
 *
 * @param {Object} config                 - Configuration object.
 * @param {string} config.onboardNonceURL - URL to get nonce.
 * @param {string} config.onboardAPIUrl   - URL to generate license.
 * @param {string} config.ajaxUrl         - AJAX URL for saving license.
 * @param {string} config.nonce           - Nonce for AJAX requests.
 * @param {string} config.siteUrl         - Site URL.
 * @param {number} config.timezoneOffset  - Timezone offset.
 * @return {Object} License generation functions.
 */
function useLicenseGenerator({
  onboardNonceURL,
  onboardAPIUrl,
  ajaxUrl,
  nonce,
  siteUrl,
  timezoneOffset
}) {
  const [isGenerating, setIsGenerating] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [error, setError] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);

  /**
   * Generate and save license key.
   *
   * @param {Object} data - Additional data for license generation.
   * @return {Promise<string>} Promise resolving to license key.
   */
  const generateLicense = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(async (data = {}) => {
    setIsGenerating(true);
    setError(null);
    try {
      // Step 1: Get nonce
      const nonceFormData = new FormData();
      nonceFormData.append('site', siteUrl);
      const nonceResponse = await fetch(onboardNonceURL, {
        method: 'POST',
        body: nonceFormData
      }).then(res => res.json());
      if (nonceResponse.status !== 'ok') {
        throw new Error('Failed to get nonce');
      }

      // Step 2: Generate license
      const formData = new FormData();
      formData.append('nonce', nonceResponse.nonce);
      formData.append('site', siteUrl);
      formData.append('timezone_offset', timezoneOffset.toString());
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });
      const licenseResponse = await fetch(onboardAPIUrl, {
        method: 'POST',
        body: formData
      }).then(res => res.json());
      if (!licenseResponse.license_key) {
        throw new Error('Failed to generate license');
      }

      // Step 3: Save license locally
      await (0,_utils_ajaxRequest__WEBPACK_IMPORTED_MODULE_1__.ajaxRequest)({
        url: ajaxUrl,
        data: {
          action: 'progress_planner_save_onboard_data',
          _ajax_nonce: nonce,
          key: licenseResponse.license_key
        }
      });
      return licenseResponse.license_key;
    } catch (err) {
      setError(err.message || 'Failed to generate license');
      throw err;
    } finally {
      setIsGenerating(false);
    }
  }, [onboardNonceURL, onboardAPIUrl, ajaxUrl, nonce, siteUrl, timezoneOffset]);
  return {
    generateLicense,
    isGenerating,
    error
  };
}

/***/ }),

/***/ "./assets/src/hooks/useOnboardingProgress/index.js":
/*!*********************************************************!*\
  !*** ./assets/src/hooks/useOnboardingProgress/index.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useOnboardingProgress: () => (/* binding */ useOnboardingProgress)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utils_ajaxRequest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utils/ajaxRequest */ "./assets/src/utils/ajaxRequest/index.js");
/**
 * useOnboardingProgress Hook
 *
 * Handles saving and restoring onboarding wizard progress via AJAX.
 *
 * @package
 */




/**
 * Hook for managing onboarding progress persistence.
 *
 * @param {Object} config         - Configuration object.
 * @param {string} config.ajaxUrl - AJAX URL for saving progress.
 * @param {string} config.nonce   - Nonce for AJAX requests.
 * @return {Object} Progress management functions.
 */
function useOnboardingProgress({
  ajaxUrl,
  nonce
}) {
  const [isSaving, setIsSaving] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [error, setError] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);

  /**
   * Save progress to server.
   *
   * @param {Object} state - Wizard state to save.
   * @return {Promise<Object>} Promise resolving to save result.
   */
  const saveProgress = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(async state => {
    setIsSaving(true);
    setError(null);
    try {
      const response = await (0,_utils_ajaxRequest__WEBPACK_IMPORTED_MODULE_1__.ajaxRequest)({
        url: ajaxUrl,
        data: {
          action: 'progress_planner_onboarding_save_progress',
          nonce,
          state: JSON.stringify(state)
        }
      });
      if (response.success) {
        return response;
      }
      throw new Error(response.data?.message || 'Failed to save progress');
    } catch (err) {
      setError(err.message || 'Failed to save progress');
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, [ajaxUrl, nonce]);
  return {
    saveProgress,
    isSaving,
    error
  };
}

/***/ }),

/***/ "./assets/src/hooks/useOnboardingWizard/index.js":
/*!*******************************************************!*\
  !*** ./assets/src/hooks/useOnboardingWizard/index.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useOnboardingWizard: () => (/* binding */ useOnboardingWizard)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/**
 * useOnboardingWizard Hook
 *
 * Manages onboarding wizard state and navigation.
 *
 * @package
 */



/**
 * Hook for managing onboarding wizard state.
 *
 * @param {Object} config               - Configuration object.
 * @param {Array}  config.steps         - Array of step definitions.
 * @param {Object} config.savedProgress - Saved progress from server.
 * @param {Object} progressHooks        - Progress management hooks.
 * @return {Object} Wizard state and navigation functions.
 */
function useOnboardingWizard(config, progressHooks) {
  const {
    steps = [],
    savedProgress = null
  } = config;
  const {
    saveProgress
  } = progressHooks;

  // Initialize state from saved progress or defaults.
  const [wizardState, setWizardState] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(() => {
    if (savedProgress) {
      return {
        currentStep: savedProgress.currentStep || 0,
        data: savedProgress.data || {
          privacyAccepted: false,
          firstTaskCompleted: false,
          moreTasksCompleted: {},
          finished: false,
          emailFrequency: {
            choice: null,
            name: '',
            email: ''
          },
          settings: {}
        }
      };
    }
    return {
      currentStep: 0,
      data: {
        privacyAccepted: false,
        firstTaskCompleted: false,
        moreTasksCompleted: {},
        finished: false,
        emailFrequency: {
          choice: null,
          name: '',
          email: ''
        },
        settings: {}
      }
    };
  });

  /**
   * Update wizard state.
   *
   * @param {Object} updates - State updates to apply.
   */
  const updateState = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(updates => {
    setWizardState(prev => ({
      ...prev,
      ...updates,
      data: {
        ...prev.data,
        ...(updates.data || {})
      }
    }));
  }, []);

  /**
   * Navigate to next step.
   */
  const nextStep = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    setWizardState(prev => {
      const next = Math.min(prev.currentStep + 1, steps.length - 1);
      return {
        ...prev,
        currentStep: next
      };
    });
  }, [steps.length]);

  /**
   * Navigate to previous step.
   */
  const prevStep = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    setWizardState(prev => {
      const previousStep = Math.max(prev.currentStep - 1, 0);
      return {
        ...prev,
        currentStep: previousStep
      };
    });
  }, []);

  /**
   * Navigate to specific step.
   *
   * @param {number} stepIndex - Step index to navigate to.
   */
  const goToStep = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(stepIndex => {
    setWizardState(prev => ({
      ...prev,
      currentStep: Math.max(0, Math.min(stepIndex, steps.length - 1))
    }));
  }, [steps.length]);

  /**
   * Auto-save progress after state changes.
   */
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const timeoutId = setTimeout(() => {
      saveProgress(wizardState).catch(() => {
        // Silently fail - progress saving is best effort.
      });
    }, 500); // Debounce saves.

    return () => clearTimeout(timeoutId);
  }, [wizardState, saveProgress]);
  return {
    wizardState,
    updateState,
    nextStep,
    prevStep,
    goToStep,
    currentStep: wizardState.currentStep,
    currentStepData: steps[wizardState.currentStep] || null,
    totalSteps: steps.length
  };
}

/***/ }),

/***/ "./assets/src/hooks/useTaskCompletion/index.js":
/*!*****************************************************!*\
  !*** ./assets/src/hooks/useTaskCompletion/index.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useTaskCompletion: () => (/* binding */ useTaskCompletion)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utils_ajaxRequest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utils/ajaxRequest */ "./assets/src/utils/ajaxRequest/index.js");
/**
 * useTaskCompletion Hook
 *
 * Handles task completion during onboarding.
 *
 * @package
 */




/**
 * Hook for completing tasks during onboarding.
 *
 * @param {Object} config         - Configuration object.
 * @param {string} config.ajaxUrl - AJAX URL for task completion.
 * @param {string} config.nonce   - Nonce for AJAX requests.
 * @return {Object} Task completion functions.
 */
function useTaskCompletion({
  ajaxUrl,
  nonce
}) {
  const [isCompleting, setIsCompleting] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [error, setError] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);

  /**
   * Complete a task.
   *
   * @param {string} taskId     - Task ID to complete.
   * @param {Object} formValues - Form values for task completion.
   * @return {Promise<Object>} Promise resolving to completion result.
   */
  const completeTask = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(async (taskId, formValues = {}) => {
    setIsCompleting(true);
    setError(null);
    try {
      const response = await (0,_utils_ajaxRequest__WEBPACK_IMPORTED_MODULE_1__.ajaxRequest)({
        url: ajaxUrl,
        data: {
          action: 'progress_planner_onboarding_complete_task',
          nonce,
          task_id: taskId,
          form_values: JSON.stringify(formValues)
        }
      });
      if (response.success) {
        return response;
      }
      throw new Error(response.data?.message || 'Failed to complete task');
    } catch (err) {
      setError(err.message || 'Failed to complete task');
      throw err;
    } finally {
      setIsCompleting(false);
    }
  }, [ajaxUrl, nonce]);
  return {
    completeTask,
    isCompleting,
    error
  };
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

/***/ "./assets/src/services/preloadingMiddleware.js":
/*!*****************************************************!*\
  !*** ./assets/src/services/preloadingMiddleware.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createPreloadingMiddleware: () => (/* binding */ createPreloadingMiddleware),
/* harmony export */   normalizePath: () => (/* binding */ normalizePath)
/* harmony export */ });
/**
 * Preloading Middleware for apiFetch.
 *
 * Creates a middleware that intercepts apiFetch calls and returns
 * preloaded data instantly, bypassing network requests for matched paths.
 * Modeled after WordPress/Gutenberg's createPreloadingMiddleware.
 */

/**
 * Normalize a path for consistent comparison.
 * Sorts query parameters and removes trailing slashes.
 *
 * @param {string} path The path to normalize.
 * @return {string} The normalized path.
 */
function normalizePath(path) {
  if (!path) {
    return '';
  }
  try {
    const url = new URL(path, 'http://example.com');
    url.searchParams.sort();
    let normalized = url.pathname + url.search;
    // Remove trailing slash unless it's the root
    if (normalized.length > 1 && normalized.endsWith('/')) {
      normalized = normalized.slice(0, -1);
    }
    return normalized;
  } catch (e) {
    // If URL parsing fails, return the path as-is
    return path;
  }
}

/**
 * Creates a preloading middleware for apiFetch.
 * Returns preloaded data instantly, bypassing network for matched paths.
 *
 * @param {Object} preloadedData Object with paths as keys and { body, headers } as values.
 * @return {Function} Middleware function for apiFetch.use().
 */
function createPreloadingMiddleware(preloadedData) {
  const cache = new Map();

  // Normalize and populate cache from preloaded data
  if (preloadedData && typeof preloadedData === 'object') {
    Object.entries(preloadedData).forEach(([path, data]) => {
      cache.set(normalizePath(path), data);
    });
  }
  return (options, next) => {
    // Only intercept GET requests (or requests with no method, which default to GET)
    if (options.method && options.method.toUpperCase() !== 'GET') {
      return next(options);
    }

    // Don't intercept requests that use parse: false (need full Response object)
    if (options.parse === false) {
      return next(options);
    }
    const path = normalizePath(options.path || options.url);
    if (cache.has(path)) {
      const data = cache.get(path);
      // Remove from cache (one-time use, like Gutenberg)
      cache.delete(path);
      // Return the body directly as a resolved promise
      return Promise.resolve(data.body);
    }

    // Fall through to next middleware / actual fetch
    return next(options);
  };
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

/***/ "./assets/src/utils/ajaxRequest/index.js":
/*!***********************************************!*\
  !*** ./assets/src/utils/ajaxRequest/index.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ajaxRequest: () => (/* binding */ ajaxRequest)
/* harmony export */ });
/**
 * AJAX Request Utility
 *
 * Standalone utility function for making AJAX requests using FormData.
 * This is a modern replacement for progressPlannerAjaxRequest that uses the fetch API
 * instead of XMLHttpRequest. Can be used in both React and non-React contexts.
 *
 * @example
 * ```js
 * import { ajaxRequest } from '../utils/ajaxRequest';
 *
 * // In a React component or vanilla JS
 * const response = await ajaxRequest({
 *   url: '/wp-admin/admin-ajax.php',
 *   data: {
 *     action: 'my_action',
 *     nonce: '...',
 *     // ... other data
 *   }
 * });
 * ```
 *
 * @example
 * ```js
 * // Migration from progressPlannerAjaxRequest
 * // Before:
 * progressPlannerAjaxRequest({ url, data })
 *   .then(response => console.log(response))
 *   .catch(error => console.error(error));
 *
 * // After:
 * import { ajaxRequest } from './utils/ajaxRequest';
 * ajaxRequest({ url, data })
 *   .then(response => console.log(response))
 *   .catch(error => console.error(error));
 * ```
 */

/**
 * Make an AJAX request using FormData.
 *
 * This function provides the same API as progressPlannerAjaxRequest but uses
 * the modern fetch API instead of XMLHttpRequest. It's designed to work with
 * WordPress admin-ajax.php endpoints that require FormData.
 *
 * @param {Object} params      Request parameters.
 * @param {string} params.url  The URL to send the request to.
 * @param {Object} params.data The data to send with the request.
 * @return {Promise<Object>} Promise resolving to the parsed JSON response.
 * @throws {Error} Rejects with the response object if status is not 200.
 *
 * @example
 * ```js
 * try {
 *   const response = await ajaxRequest({
 *     url: progressPlanner.ajaxUrl,
 *     data: {
 *       action: 'progress_planner_save_onboard_data',
 *       _ajax_nonce: progressPlanner.nonce,
 *       key: licenseKey,
 *     },
 *   });
 *   console.log('Success:', response);
 * } catch (error) {
 *   console.error('Error:', error);
 * }
 * ```
 */
async function ajaxRequest({
  url,
  data
}) {
  // Create FormData from the data object.
  const formData = new FormData();
  for (const [key, value] of Object.entries(data)) {
    formData.append(key, value);
  }

  // Make the request using fetch API.
  const response = await fetch(url, {
    method: 'POST',
    body: formData,
    credentials: 'same-origin'
  });

  // Parse JSON response.
  // Read as text first so we can use it for error messages if parsing fails.
  const responseText = await response.text();
  let parsedResponse;
  try {
    parsedResponse = JSON.parse(responseText);
  } catch (parseError) {
    // If JSON parsing fails and status is not 200, log warning.
    if (!response.ok) {
      console.warn('Failed to parse response:', response, parseError);
      // Throw error with raw response text for non-200 status.
      throw new Error(responseText || 'Request failed');
    }
    // If status is 200 but JSON parsing fails, rethrow.
    throw parseError;
  }

  // Check if response is successful.
  if (response.ok) {
    return parsedResponse;
  }

  // Request completed but status is not 200.
  // Reject with the parsed response (matching original behavior).
  throw parsedResponse;
}

/***/ }),

/***/ "./assets/src/utils/prplSuggestedTask/index.js":
/*!*****************************************************!*\
  !*** ./assets/src/utils/prplSuggestedTask/index.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   maybeComplete: () => (/* binding */ maybeComplete),
/* harmony export */   snooze: () => (/* binding */ snooze)
/* harmony export */ });
/**
 * Global prplSuggestedTask object for backward compatibility.
 *
 * Provides methods that work with React components while maintaining
 * compatibility with inline onclick handlers in PHP-generated HTML.
 *
 * This object bridges the gap between legacy inline handlers and the
 * new React-based implementation.
 */

/**
 * Maybe complete a task.
 *
 * Finds the task element and triggers the complete button click,
 * which will be handled by React's event listener in TaskActions.js.
 *
 * @param {number} postId The post ID.
 * @return {Promise} A promise that resolves when the action is triggered.
 */
function maybeComplete(postId) {
  return new Promise((resolve, reject) => {
    try {
      // Find the task element by post ID.
      const taskElement = document.querySelector(`.prpl-suggested-task[data-post-id="${postId}"]`);
      if (!taskElement) {
        console.warn(`prplSuggestedTask.maybeComplete: Task element not found for post ID ${postId}`);
        reject(new Error(`Task element not found for post ID ${postId}`));
        return;
      }

      // Find the complete button within this task element.
      const completeButton = taskElement.querySelector('[data-action="complete"]');
      if (completeButton) {
        // Remove the inline onclick handler to prevent infinite loop.
        const originalOnclick = completeButton.getAttribute('onclick');
        completeButton.removeAttribute('onclick');

        // Use setTimeout to ensure React's event listeners are set up
        // (they're added in useEffect which runs after render).
        setTimeout(() => {
          // Trigger a click event which will be handled by React's event listener.
          completeButton.click();
          // Restore onclick if it existed (though React's listener handles it now).
          if (originalOnclick) {
            completeButton.setAttribute('onclick', originalOnclick);
          }
          resolve({
            postId
          });
        }, 0);
      } else {
        console.warn(`prplSuggestedTask.maybeComplete: Complete button not found for post ID ${postId}`);
        reject(new Error(`Complete button not found for post ID ${postId}`));
      }
    } catch (error) {
      console.error('prplSuggestedTask.maybeComplete: Error completing task', error);
      reject(error);
    }
  });
}

/**
 * Snooze a task.
 *
 * Finds the task element and triggers the snooze radio button change,
 * which will be handled by React's event listener in TaskActions.js.
 *
 * @param {number} postId         The post ID.
 * @param {string} snoozeDuration The snooze duration key.
 * @return {Promise} A promise that resolves when the action is triggered.
 */
function snooze(postId, snoozeDuration) {
  return new Promise((resolve, reject) => {
    try {
      // Find the task element by post ID.
      const taskElement = document.querySelector(`.prpl-suggested-task[data-post-id="${postId}"]`);
      if (!taskElement) {
        console.warn(`prplSuggestedTask.snooze: Task element not found for post ID ${postId}`);
        reject(new Error(`Task element not found for post ID ${postId}`));
        return;
      }

      // Find the snooze radio button with the matching duration value.
      const snoozeRadio = taskElement.querySelector(`.prpl-snooze-duration-radio-group input[type="radio"][value="${snoozeDuration}"]`);
      if (snoozeRadio) {
        // Remove the inline onchange handler to prevent infinite loop.
        const originalOnchange = snoozeRadio.getAttribute('onchange');
        snoozeRadio.removeAttribute('onchange');

        // Use setTimeout to ensure React's event listeners are set up
        // (they're added in useEffect which runs after render).
        setTimeout(() => {
          // Set the value and trigger a change event which will be
          // handled by React's event listener.
          snoozeRadio.checked = true;
          snoozeRadio.dispatchEvent(new Event('change', {
            bubbles: true
          }));
          // Restore onchange if it existed (though React's listener handles it now).
          if (originalOnchange) {
            snoozeRadio.setAttribute('onchange', originalOnchange);
          }
          resolve({
            postId,
            snoozeDuration
          });
        }, 0);
      } else {
        console.warn(`prplSuggestedTask.snooze: Snooze radio button not found for post ID ${postId} with duration ${snoozeDuration}`);
        reject(new Error(`Snooze radio button not found for post ID ${postId} with duration ${snoozeDuration}`));
      }
    } catch (error) {
      console.error('prplSuggestedTask.snooze: Error snoozing task', error);
      reject(error);
    }
  });
}

/**
 * Create the global prplSuggestedTask object.
 *
 * @return {Object} The prplSuggestedTask object.
 */
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  maybeComplete,
  snooze
});

/***/ }),

/***/ "./assets/src/utils/widgetRegistry/index.js":
/*!**************************************************!*\
  !*** ./assets/src/utils/widgetRegistry/index.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getRegisteredWidgets: () => (/* binding */ getRegisteredWidgets),
/* harmony export */   getWidget: () => (/* binding */ getWidget)
/* harmony export */ });
/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/hooks */ "@wordpress/hooks");
/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_hooks__WEBPACK_IMPORTED_MODULE_0__);
/**
 * Widget Registry
 *
 * Shared registry for dashboard widgets. Widgets register themselves via
 * WordPress hooks, and DashboardWidgets reads from this registry.
 */



/**
 * Registry storage for widgets.
 *
 * @type {Array<{id: string, component: Function, priority: number, width: number, forceLastColumn: boolean, title: string, infoIconSvg: string}>}
 */
const widgetRegistry = [];

/**
 * Register a widget.
 *
 * @param {Object}   widgetData                 - Widget registration data.
 * @param {string}   widgetData.id              - Unique widget ID.
 * @param {Function} widgetData.component       - React component.
 * @param {number}   widgetData.priority        - Display priority (lower = earlier, default: 10).
 * @param {number}   widgetData.width           - Widget width (1 or 2, default: 1).
 * @param {boolean}  widgetData.forceLastColumn - Force to last column (default: false).
 * @param {string}   widgetData.title           - Widget title (default: '').
 * @param {string}   widgetData.infoIconSvg     - Info icon SVG content (default: '').
 */
function registerWidget(widgetData) {
  const {
    id,
    component,
    priority = 10,
    width = 1,
    forceLastColumn = false,
    title = '',
    infoIconSvg = ''
  } = widgetData;
  if (!id || !component) {
    // eslint-disable-next-line no-console
    console.warn('Widget registration failed: id and component are required', widgetData);
    return;
  }

  // Check if widget already registered
  const existingIndex = widgetRegistry.findIndex(w => w.id === id);
  const widgetEntry = {
    id,
    component,
    priority,
    width,
    forceLastColumn,
    title,
    infoIconSvg
  };
  if (existingIndex >= 0) {
    // Update existing registration
    widgetRegistry[existingIndex] = widgetEntry;
  } else {
    // Add new registration
    widgetRegistry.push(widgetEntry);
  }
}

/**
 * Get all registered widgets, sorted by priority.
 *
 * @return {Array<{id: string, component: Function, priority: number, width: number, forceLastColumn: boolean, title: string, infoIconSvg: string}>} Sorted widgets.
 */
function getRegisteredWidgets() {
  return [...widgetRegistry].sort((a, b) => a.priority - b.priority);
}

/**
 * Get a widget by ID.
 *
 * @param {string} widgetId - Widget ID.
 * @return {{id: string, component: Function, priority: number, width: number, forceLastColumn: boolean, title: string, infoIconSvg: string}|undefined} Widget or undefined.
 */
function getWidget(widgetId) {
  return widgetRegistry.find(w => w.id === widgetId);
}

// Listen for widget registrations via WordPress hooks
(0,_wordpress_hooks__WEBPACK_IMPORTED_MODULE_0__.addAction)('prpl.dashboard.registerWidget', 'progress-planner/widget-registry', registerWidget);

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
/******/ var __webpack_exports__ = (__webpack_exec__("./assets/src/dashboard.js"));
/******/ }
]);
//# sourceMappingURL=dashboard.js.map