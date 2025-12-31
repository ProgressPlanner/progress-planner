"use strict";
(globalThis["webpackChunkprogress_planner"] = globalThis["webpackChunkprogress_planner"] || []).push([["widget-monthly-badges"],{

/***/ "./assets/src/components/Badge/BadgeSkeleton.js":
/*!******************************************************!*\
  !*** ./assets/src/components/Badge/BadgeSkeleton.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ BadgeSkeleton)
/* harmony export */ });
/* harmony import */ var _Skeleton__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Skeleton */ "./assets/src/components/Skeleton/index.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);
/**
 * Badge Skeleton Component
 *
 * Skeleton loading state for the Badge component.
 */



/**
 * BadgeSkeleton component.
 *
 * @param {Object} props      - Component props.
 * @param {string} props.size - Size of the badge (CSS value).
 * @return {JSX.Element} The BadgeSkeleton component.
 */

function BadgeSkeleton({
  size = '100%'
}) {
  const containerStyle = {
    maxWidth: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
    style: containerStyle,
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_Skeleton__WEBPACK_IMPORTED_MODULE_0__.SkeletonCircle, {
      size: size,
      style: {
        maxWidth: '100%',
        aspectRatio: '1 / 1',
        opacity: 0.5
      }
    })
  });
}

/***/ }),

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

/***/ "./assets/src/components/BadgeProgressBar/index.js":
/*!*********************************************************!*\
  !*** ./assets/src/components/BadgeProgressBar/index.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ BadgeProgressBar)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _Badge__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Badge */ "./assets/src/components/Badge/index.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);
/**
 * BadgeProgressBar Component
 *
 * Displays a progress bar with a badge icon for incomplete previous months.
 */





/**
 * Style constants - extracted to prevent recreation on each render.
 * Note: Some styles require computed values and are created in useMemo.
 */

const STYLES = {
  container: {
    padding: '1rem 0'
  },
  bar: {
    width: '100%',
    height: '1rem',
    backgroundColor: 'var(--prpl-color-gauge-remain)',
    borderRadius: '0.5rem',
    position: 'relative'
  },
  progressBase: {
    height: '100%',
    backgroundColor: 'var(--prpl-color-monthly)',
    borderRadius: '0.5rem',
    transition: 'width 0.4s ease'
  },
  badgeWrapperBase: {
    display: 'flex',
    width: '7.5rem',
    height: 'auto',
    position: 'absolute',
    top: '-2.5rem',
    transition: 'left 0.4s ease'
  },
  alertIndicator: {
    content: '"!"',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '20px',
    height: '20px',
    backgroundColor: 'var(--prpl-color-alert-error)',
    border: '2px solid #fff',
    borderRadius: '50%',
    position: 'absolute',
    top: '10%',
    right: '25%',
    color: '#fff',
    fontSize: '12px',
    fontWeight: 'bold'
  },
  pointsContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    gap: '1rem'
  },
  pointsNumber: {
    fontSize: 'var(--prpl-font-size-3xl)',
    fontWeight: 600
  },
  remainingText: {
    display: 'flex',
    alignItems: 'center'
  }
};

/**
 * BadgeProgressBar component.
 *
 * @param {Object} props                      - Component props.
 * @param {string} props.badgeId              - The badge ID.
 * @param {string} props.badgeName            - The badge name.
 * @param {number} props.points               - Current points.
 * @param {number} props.maxPoints            - Maximum points (default 10).
 * @param {number} props.accumulatedRemaining - Accumulated remaining points across all badges.
 * @param {number} props.daysRemaining        - Days remaining in current month.
 * @param {number} props.brandingId           - Branding ID.
 * @return {JSX.Element} The BadgeProgressBar component.
 */
function BadgeProgressBar({
  badgeId,
  badgeName,
  points = 0,
  maxPoints = 10,
  accumulatedRemaining = 0,
  daysRemaining = 0,
  brandingId = 0
}) {
  /**
   * Calculate progress percentage and derive dynamic styles.
   */
  const progressPercent = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    if (maxPoints === 0) {
      return 0;
    }
    return points / maxPoints * 100;
  }, [points, maxPoints]);

  // Dynamic styles that depend on progressPercent - memoized to prevent recreation.
  const progressStyle = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => ({
    ...STYLES.progressBase,
    width: `${progressPercent}%`
  }), [progressPercent]);
  const badgeWrapperStyle = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => ({
    ...STYLES.badgeWrapperBase,
    left: `calc(${progressPercent}% - 3.75rem)`
  }), [progressPercent]);
  const isComplete = points >= maxPoints;
  const className = `prpl-badge-progress-bar${isComplete ? ' prpl-badge-progress-bar--complete' : ''}`;
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
    className: className,
    style: STYLES.container,
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
      className: "prpl-badge-progress-bar__bar",
      style: STYLES.bar,
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
        className: "prpl-badge-progress-bar__progress",
        style: progressStyle
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
        className: "prpl-badge-progress-bar__badge-wrapper",
        style: badgeWrapperStyle,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_Badge__WEBPACK_IMPORTED_MODULE_2__["default"], {
          badgeId: badgeId,
          badgeName: badgeName,
          brandingId: brandingId
        }), !isComplete && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("span", {
          className: "prpl-badge-progress-bar__alert",
          style: STYLES.alertIndicator,
          children: "!"
        })]
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
      className: "prpl-widget-content-points",
      style: STYLES.pointsContainer,
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("span", {
        className: "prpl-widget-previous-ravi-points-number",
        style: STYLES.pointsNumber,
        children: [points, "pt"]
      }), accumulatedRemaining > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("span", {
        className: "prpl-previous-month-badge-progress-bar-remaining",
        style: STYLES.remainingText,
        dangerouslySetInnerHTML: {
          __html: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.sprintf)(/* translators: %1$s: The number of points. %2$d: The number of days. */
          (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__._n)('%1$s more points to go - %2$d day left', '%1$s more points to go - %2$d days left', daysRemaining, 'progress-planner'), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.sprintf)('<span class="number">%d</span>', accumulatedRemaining), daysRemaining)
        }
      })]
    })]
  });
}

/***/ }),

/***/ "./assets/src/components/Gauge/GaugeSkeleton.js":
/*!******************************************************!*\
  !*** ./assets/src/components/Gauge/GaugeSkeleton.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ GaugeSkeleton)
/* harmony export */ });
/* harmony import */ var _Skeleton__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Skeleton */ "./assets/src/components/Skeleton/index.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);
/**
 * Gauge Skeleton Component
 *
 * Skeleton loading state for the Gauge component.
 */



/**
 * GaugeSkeleton component.
 *
 * @param {Object} props                 - Component props.
 * @param {string} props.backgroundColor - Background color CSS variable.
 * @return {JSX.Element} The GaugeSkeleton component.
 */

function GaugeSkeleton({
  backgroundColor = 'var(--prpl-background-monthly)'
}) {
  const containerStyle = {
    padding: 'var(--prpl-padding) var(--prpl-padding) calc(var(--prpl-padding) * 2) var(--prpl-padding)',
    background: backgroundColor,
    borderRadius: 'var(--prpl-border-radius-big)',
    aspectRatio: '2 / 1',
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 'var(--prpl-padding)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start'
  };
  const gaugeWrapperStyle = {
    width: '100%',
    aspectRatio: '1 / 1',
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  };
  const centerContentStyle = {
    position: 'absolute',
    top: '35%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5em'
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
    style: containerStyle,
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
      style: gaugeWrapperStyle,
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_Skeleton__WEBPACK_IMPORTED_MODULE_0__.SkeletonCircle, {
        size: "100%",
        style: {
          position: 'absolute',
          opacity: 0.3
        }
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
        style: centerContentStyle,
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_Skeleton__WEBPACK_IMPORTED_MODULE_0__.SkeletonRect, {
          width: "3em",
          height: "2.5em",
          style: {
            borderRadius: '8px'
          }
        })
      })]
    })
  });
}

/***/ }),

/***/ "./assets/src/components/Gauge/index.js":
/*!**********************************************!*\
  !*** ./assets/src/components/Gauge/index.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Gauge)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);
/**
 * Gauge Component
 *
 * Displays a semi-circular progress gauge using CSS conic-gradient.
 */



/**
 * Gauge component.
 *
 * @param {Object}      props                 - Component props.
 * @param {number}      props.value           - Current progress value.
 * @param {number}      props.max             - Maximum value (default 10).
 * @param {string}      props.backgroundColor - Background color CSS variable.
 * @param {string}      props.color           - Primary progress color CSS variable.
 * @param {string}      props.color2          - Secondary progress color CSS variable.
 * @param {string}      props.contentFontSize - Font size for the content inside the gauge.
 * @param {JSX.Element} props.children        - Content to display in the gauge center.
 * @return {JSX.Element} The Gauge component.
 */

function Gauge({
  value = 0,
  max = 10,
  backgroundColor = 'var(--prpl-background-monthly)',
  color = 'var(--prpl-color-monthly)',
  color2 = 'var(--prpl-color-monthly-2)',
  contentFontSize = 'var(--prpl-font-size-6xl)',
  children
}) {
  const maxDeg = '180deg';
  const start = '270deg';
  const cutout = '57%';

  /**
   * Calculate the conic gradient color transitions.
   */
  const colorTransitions = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    const progress = max > 0 ? value / max : 0;
    let transitions;

    // If progress is less than 50%, use single color (no gradient)
    if (progress <= 0.5) {
      transitions = `${color} calc(${maxDeg} * ${progress})`;
    } else {
      // Show first color for 0.5, then second color
      transitions = `${color} calc(${maxDeg} * 0.5)`;
      transitions += `, ${color2} calc(${maxDeg} * ${progress})`;
    }

    // Add remaining (unfilled) color
    transitions += `, var(--prpl-color-gauge-remain) calc(${maxDeg} * ${progress}) ${maxDeg}`;
    return transitions;
  }, [value, max, color, color2]);
  const containerStyle = {
    padding: 'var(--prpl-padding) var(--prpl-padding) calc(var(--prpl-padding) * 2) var(--prpl-padding)',
    background: backgroundColor,
    borderRadius: 'var(--prpl-border-radius-big)',
    aspectRatio: '2 / 1',
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 'var(--prpl-padding)'
  };
  const gaugeStyle = {
    width: '100%',
    aspectRatio: '1 / 1',
    borderRadius: '100%',
    position: 'relative',
    background: `radial-gradient(${backgroundColor} 0 ${cutout}, transparent ${cutout} 100%), conic-gradient(from ${start}, ${colorTransitions}, transparent ${maxDeg})`,
    textAlign: 'center'
  };
  const labelStyle = {
    fontSize: 'var(--prpl-font-size-small)',
    position: 'absolute',
    top: '50%',
    color: 'var(--prpl-color-text)',
    width: '10%',
    textAlign: 'center'
  };
  const leftLabelStyle = {
    ...labelStyle,
    left: 0
  };
  const rightLabelStyle = {
    ...labelStyle,
    right: 0
  };
  const contentStyle = {
    fontSize: contentFontSize,
    bottom: '50%',
    display: 'block',
    fontWeight: 600,
    textAlign: 'center',
    position: 'absolute',
    color: 'var(--prpl-color-text)',
    width: '100%',
    lineHeight: 1.2
  };
  const contentInnerStyle = {
    display: 'inline-block',
    width: '50%'
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
    className: "prpl-gauge",
    style: containerStyle,
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
      className: "prpl-gauge__ring",
      style: gaugeStyle,
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("span", {
        className: "prpl-gauge__label prpl-gauge__label--min",
        style: leftLabelStyle,
        children: "0"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("span", {
        className: "prpl-gauge__content",
        style: contentStyle,
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("span", {
          className: "prpl-gauge__content-inner",
          style: contentInnerStyle,
          children: children
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("span", {
        className: "prpl-gauge__label prpl-gauge__label--max",
        style: rightLabelStyle,
        children: max
      })]
    })
  });
}

/***/ }),

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

/***/ "./assets/src/components/WidgetStates/index.js":
/*!*****************************************************!*\
  !*** ./assets/src/components/WidgetStates/index.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   EmptyState: () => (/* binding */ EmptyState),
/* harmony export */   ErrorState: () => (/* binding */ ErrorState),
/* harmony export */   LoadingState: () => (/* binding */ LoadingState)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);
/**
 * Widget State Components
 *
 * Shared components for loading, error, and empty states across widgets.
 */



/**
 * Default loading style.
 */

const defaultLoadingStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '2em'
};

/**
 * Default error style.
 */
const defaultErrorStyle = {
  padding: '1em',
  backgroundColor: 'var(--prpl-color-error-background, #fee)',
  color: 'var(--prpl-color-error, #c00)',
  borderRadius: 'var(--prpl-border-radius)'
};

/**
 * LoadingState component.
 *
 * @param {Object}  props           - Component props.
 * @param {string}  props.message   - Loading message.
 * @param {string}  props.className - Optional CSS class.
 * @param {Object}  props.style     - Optional inline styles.
 * @param {boolean} props.simple    - If true, renders simple <p> tag.
 * @return {JSX.Element} The loading state component.
 */
function LoadingState({
  message = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Loading…', 'progress-planner'),
  className = '',
  style = {},
  simple = false
}) {
  if (simple) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("p", {
      className: className || undefined,
      children: message
    });
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
    className: `prpl-widget-loading${className ? ` ${className}` : ''}`,
    style: {
      ...defaultLoadingStyle,
      ...style
    },
    children: message
  });
}

/**
 * ErrorState component.
 *
 * @param {Object}  props           - Component props.
 * @param {string}  props.message   - Error message.
 * @param {string}  props.className - Optional CSS class.
 * @param {Object}  props.style     - Optional inline styles.
 * @param {boolean} props.simple    - If true, renders simple <p> tag.
 * @return {JSX.Element} The error state component.
 */
function ErrorState({
  message = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('An error occurred.', 'progress-planner'),
  className = '',
  style = {},
  simple = false
}) {
  if (simple) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("p", {
      className: className || undefined,
      children: message
    });
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
    className: `prpl-widget-error${className ? ` ${className}` : ''}`,
    style: {
      ...defaultErrorStyle,
      ...style
    },
    children: message
  });
}

/**
 * EmptyState component.
 *
 * @param {Object} props           - Component props.
 * @param {string} props.message   - Empty state message.
 * @param {string} props.className - Optional CSS class.
 * @return {JSX.Element} The empty state component.
 */
function EmptyState({
  message = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('No data available.', 'progress-planner'),
  className = ''
}) {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("p", {
    className: className || undefined,
    children: message
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

/***/ }),

/***/ "./assets/src/hooks/useBadgeData/index.js":
/*!************************************************!*\
  !*** ./assets/src/hooks/useBadgeData/index.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useBadgeData: () => (/* binding */ useBadgeData)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _services_badgeService__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../services/badgeService */ "./assets/src/services/badgeService.js");
/**
 * useBadgeData Hook
 *
 * Custom hook for fetching badge data (activities, stats, config).
 * Used by badge widgets (ContentBadges, StreakBadges, etc.).
 */




/**
 * Custom hook for fetching badge data.
 *
 * @return {Object} { isLoading, error, data, refetch }
 */
function useBadgeData() {
  const [isLoading, setIsLoading] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(true);
  const [error, setError] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [data, setData] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const fetchData = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch activities and badge stats in parallel.
      // Config is included in activities response.
      const [activitiesResponse, statsResponse] = await Promise.all([(0,_services_badgeService__WEBPACK_IMPORTED_MODULE_1__.fetchActivities)(), (0,_services_badgeService__WEBPACK_IMPORTED_MODULE_1__.fetchBadgeStats)()]);
      setData({
        activities: activitiesResponse.activities || [],
        totalPostsCount: activitiesResponse.totalPostsCount || 0,
        activationDate: activitiesResponse.activationDate,
        savedStats: statsResponse,
        config: activitiesResponse.config || {
          brandingId: 0,
          remoteServerUrl: '',
          placeholderUrl: ''
        }
      });
    } catch (err) {
      setError(err.message || 'Failed to load badge data');
    } finally {
      setIsLoading(false);
    }
  }, []);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    fetchData();
  }, [fetchData]);
  return {
    isLoading,
    error,
    data,
    refetch: fetchData
  };
}

/***/ }),

/***/ "./assets/src/hooks/useBadgeProgress/index.js":
/*!****************************************************!*\
  !*** ./assets/src/hooks/useBadgeProgress/index.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useBadgeProgress: () => (/* binding */ useBadgeProgress)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utils_badgeCalculations__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utils/badgeCalculations */ "./assets/src/utils/badgeCalculations/index.js");
/* harmony import */ var _config_badges__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../config/badges */ "./assets/src/config/badges.js");
/**
 * useBadgeProgress Hook
 *
 * Custom hook for calculating badge progress from activities and saved stats.
 * Handles caching and progress calculation logic.
 */





/**
 * Custom hook for calculating badge progress.
 *
 * @param {Object}   params                          - Parameters.
 * @param {Array}    params.activities               - Array of activity objects.
 * @param {Object}   params.savedStats               - Saved badge progress stats from API.
 * @param {number}   params.totalPostsCount          - Total number of published posts/pages.
 * @param {Date}     params.activationDate           - Plugin activation date.
 * @param {Function} params.getMonthlyBadgeDateRange - Function to get date range for monthly badge.
 * @return {Object} Badge progress data.
 */
function useBadgeProgress({
  activities = [],
  savedStats = {},
  totalPostsCount = 0,
  activationDate = null,
  getMonthlyBadgeDateRange = null
}) {
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    if (!activationDate) {
      return {};
    }
    const badgeProgress = {};

    // Process content badges.
    const contentBadges = ['content-curator', 'revision-ranger', 'purposeful-publisher'];
    contentBadges.forEach(badgeId => {
      const badge = (0,_config_badges__WEBPACK_IMPORTED_MODULE_2__.getBadgeById)(badgeId);
      if (!badge) {
        return;
      }

      // Check if we have saved progress (and it's recent for content badges).
      const saved = savedStats[badgeId];
      if (saved && saved.progress && saved.remaining !== undefined) {
        // For content badges, if already complete, use saved value.
        if (saved.progress >= 100) {
          badgeProgress[badgeId] = {
            progress: saved.progress,
            remaining: saved.remaining
          };
          return;
        }
      }

      // Calculate progress.
      const progress = (0,_utils_badgeCalculations__WEBPACK_IMPORTED_MODULE_1__.calculateContentBadgeProgress)(badge, activities, totalPostsCount, activationDate);
      badgeProgress[badgeId] = progress;
    });

    // Process maintenance badges.
    const maintenanceBadges = ['progress-padawan', 'maintenance-maniac', 'super-site-specialist'];
    maintenanceBadges.forEach(badgeId => {
      const badge = (0,_config_badges__WEBPACK_IMPORTED_MODULE_2__.getBadgeById)(badgeId);
      if (!badge) {
        return;
      }

      // Check if we have saved progress.
      const saved = savedStats[badgeId];
      if (saved && saved.progress && saved.remaining !== undefined) {
        // For maintenance badges, if complete, use saved value.
        if (saved.progress >= 100) {
          badgeProgress[badgeId] = {
            progress: saved.progress,
            remaining: saved.remaining
          };
          return;
        }

        // Check if saved progress is recent (within 2 days).
        if (saved.date) {
          const savedDate = new Date(saved.date);
          const now = new Date();
          const diffDays = (now - savedDate) / (1000 * 60 * 60 * 24);
          if (diffDays <= 2) {
            badgeProgress[badgeId] = {
              progress: saved.progress,
              remaining: saved.remaining
            };
            return;
          }
        }
      }

      // Calculate progress.
      const progress = (0,_utils_badgeCalculations__WEBPACK_IMPORTED_MODULE_1__.calculateMaintenanceBadgeProgress)(badge, activities, activationDate);
      badgeProgress[badgeId] = progress;
    });

    // Process monthly badges if date range function is provided.
    if (getMonthlyBadgeDateRange) {
      // Get all monthly badge IDs from saved stats or generate for current/previous months.
      const monthlyBadgeIds = new Set();

      // Add badges from saved stats.
      Object.keys(savedStats).forEach(badgeId => {
        if (badgeId.startsWith('monthly-')) {
          monthlyBadgeIds.add(badgeId);
        }
      });

      // Add current month badge.
      const now = new Date();
      const currentMonthId = `monthly-${now.getFullYear()}-m${now.getMonth() + 1}`;
      monthlyBadgeIds.add(currentMonthId);

      // Add previous 2 months to check for incomplete badges (matches PHP overflow logic).
      for (let i = 1; i <= 2; i++) {
        const checkDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const badgeId = `monthly-${checkDate.getFullYear()}-m${checkDate.getMonth() + 1}`;
        monthlyBadgeIds.add(badgeId);
      }

      // Process each monthly badge.
      monthlyBadgeIds.forEach(badgeId => {
        const badge = (0,_config_badges__WEBPACK_IMPORTED_MODULE_2__.getBadgeById)(badgeId);
        if (!badge) {
          return;
        }
        const dateRange = getMonthlyBadgeDateRange(badgeId);
        if (!dateRange) {
          return;
        }
        const {
          startDate,
          endDate
        } = dateRange;

        // Check if we have saved progress and badge is complete.
        const saved = savedStats[badgeId];
        if (saved && saved.progress && saved.remaining !== undefined && saved.points !== undefined && saved.progress >= 100) {
          badgeProgress[badgeId] = {
            progress: saved.progress,
            remaining: saved.remaining,
            points: saved.points
          };
          return;
        }

        // Calculate progress.
        const progress = (0,_utils_badgeCalculations__WEBPACK_IMPORTED_MODULE_1__.calculateMonthlyBadgeProgress)(badge, activities, startDate, endDate, 10,
        // TARGET_POINTS
        {
          noNextBadgePoints: false
        });
        badgeProgress[badgeId] = progress;
      });
    }
    return badgeProgress;
  }, [activities, savedStats, totalPostsCount, activationDate, getMonthlyBadgeDateRange]);
}

/***/ }),

/***/ "./assets/src/hooks/useBadgeProgressSave/index.js":
/*!********************************************************!*\
  !*** ./assets/src/hooks/useBadgeProgressSave/index.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useBadgeProgressSave: () => (/* binding */ useBadgeProgressSave)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _services_badgeService__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../services/badgeService */ "./assets/src/services/badgeService.js");
/**
 * useBadgeProgressSave Hook
 *
 * Automatically saves badge progress to the API when it changes.
 * Mirrors the PHP behavior where progress was saved after calculation.
 */




/**
 * Custom hook for automatically saving badge progress.
 *
 * @param {Object} badgeProgress - Calculated badge progress.
 * @param {Object} savedStats    - Previously saved badge stats.
 * @return {void}
 */
function useBadgeProgressSave(badgeProgress, savedStats) {
  const previousProgressRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)({});
  const isSavingRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(false);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    // Don't save if already saving or if progress hasn't changed.
    if (isSavingRef.current || !badgeProgress || Object.keys(badgeProgress).length === 0) {
      return;
    }

    // Check if progress has changed and needs to be saved.
    const progressToSave = {};
    let hasChanges = false;
    Object.keys(badgeProgress).forEach(badgeId => {
      var _saved$progress;
      const current = badgeProgress[badgeId];
      const previous = previousProgressRef.current[badgeId];
      const saved = savedStats[badgeId];

      // Save if:
      // 1. Progress changed from previous calculation
      // 2. Badge is newly completed (progress >= 100 and wasn't before)
      // 3. Progress is different from saved stats
      const progressChanged = !previous || previous.progress !== current.progress || previous.remaining !== current.remaining;
      const newlyCompleted = current.progress >= 100 && (!saved || ((_saved$progress = saved.progress) !== null && _saved$progress !== void 0 ? _saved$progress : 0) < 100);
      const differentFromSaved = !saved || saved.progress !== current.progress || saved.remaining !== current.remaining;
      if (progressChanged || newlyCompleted || differentFromSaved) {
        progressToSave[badgeId] = {
          progress: current.progress,
          remaining: current.remaining,
          ...(current.points !== undefined && {
            points: current.points
          })
        };

        // If badge is newly completed, the API will add the completion date.
        hasChanges = true;
      }
    });

    // Save if there are changes.
    if (hasChanges && Object.keys(progressToSave).length > 0) {
      isSavingRef.current = true;
      (0,_services_badgeService__WEBPACK_IMPORTED_MODULE_1__.saveBadgeStats)(progressToSave).catch(error => {
        // Silently fail - progress will be recalculated on next load.
        // eslint-disable-next-line no-console
        console.warn('Failed to save badge progress:', error);
      }).finally(() => {
        isSavingRef.current = false;
      });
    }

    // Update previous progress reference.
    previousProgressRef.current = {
      ...badgeProgress
    };
  }, [badgeProgress, savedStats]);
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

/***/ "./assets/src/services/badgeService.js":
/*!*********************************************!*\
  !*** ./assets/src/services/badgeService.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   clearBadgeServiceCache: () => (/* binding */ clearBadgeServiceCache),
/* harmony export */   fetchActivities: () => (/* binding */ fetchActivities),
/* harmony export */   fetchBadgeStats: () => (/* binding */ fetchBadgeStats),
/* harmony export */   saveBadgeStats: () => (/* binding */ saveBadgeStats)
/* harmony export */ });
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/api-fetch */ "@wordpress/api-fetch");
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _apiFetchCache__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./apiFetchCache */ "./assets/src/services/apiFetchCache.js");
/**
 * Badge Service
 *
 * Handles API calls for activities and badge stats.
 * Uses the centralized apiFetchCache for caching and request deduplication.
 */




/**
 * Clear badge service cache.
 * Delegates to the centralized cache service.
 */
function clearBadgeServiceCache() {
  (0,_apiFetchCache__WEBPACK_IMPORTED_MODULE_1__.clearCacheFor)('/progress-planner/v1/activities');
  (0,_apiFetchCache__WEBPACK_IMPORTED_MODULE_1__.clearCacheFor)('/progress-planner/v1/badge-stats');
}

/**
 * Fetch activities data from API.
 *
 * @param {boolean} bypassCache - Whether to bypass the cache.
 * @return {Promise<Object>} Activities data with activities array, totalPostsCount, and activationDate.
 */
async function fetchActivities(bypassCache = false) {
  try {
    const response = await (0,_apiFetchCache__WEBPACK_IMPORTED_MODULE_1__.cachedApiFetch)({
      path: '/progress-planner/v1/activities'
    }, {
      skipCache: bypassCache
    });

    // Transform the response data.
    return {
      activities: response.activities || [],
      totalPostsCount: response.totalPostsCount || 0,
      activationDate: response.activationDate ? new Date(response.activationDate) : new Date(),
      config: response.config || {
        brandingId: 0,
        remoteServerUrl: '',
        placeholderUrl: ''
      }
    };
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch activities');
  }
}

/**
 * Fetch badge stats from API.
 *
 * @param {boolean} bypassCache - Whether to bypass the cache.
 * @return {Promise<Object>} Badge stats object.
 */
async function fetchBadgeStats(bypassCache = false) {
  try {
    const response = await (0,_apiFetchCache__WEBPACK_IMPORTED_MODULE_1__.cachedApiFetch)({
      path: '/progress-planner/v1/badge-stats'
    }, {
      skipCache: bypassCache
    });
    return response.badges || {};
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch badge stats');
  }
}

/**
 * Save badge stats to API.
 * Also invalidates the badge stats cache.
 *
 * @param {Object} badges - Badge stats object to save.
 * @return {Promise<Object>} Updated badge stats.
 */
async function saveBadgeStats(badges) {
  try {
    const response = await _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_0___default()({
      path: '/progress-planner/v1/badge-stats',
      method: 'POST',
      data: {
        badges
      }
    });

    // Write-through cache: store the response for subsequent GET requests.
    (0,_apiFetchCache__WEBPACK_IMPORTED_MODULE_1__.setCacheFor)('/progress-planner/v1/badge-stats', response);
    return response.badges || {};
  } catch (error) {
    throw new Error(error.message || 'Failed to save badge stats');
  }
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

/***/ "./assets/src/utils/badgeCalculations/index.js":
/*!*****************************************************!*\
  !*** ./assets/src/utils/badgeCalculations/index.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   calculateContentBadgeProgress: () => (/* binding */ calculateContentBadgeProgress),
/* harmony export */   calculateMaintenanceBadgeProgress: () => (/* binding */ calculateMaintenanceBadgeProgress),
/* harmony export */   calculateMonthlyBadgeProgress: () => (/* binding */ calculateMonthlyBadgeProgress),
/* harmony export */   calculateWeeklyStreak: () => (/* binding */ calculateWeeklyStreak)
/* harmony export */ });
/**
 * Badge Calculation Utilities
 *
 * Port of PHP badge progress_callback logic to JavaScript.
 * Calculates badge progress based on activities and other data.
 */

/**
 * Calculate content badge progress.
 *
 * @param {Object} badge           - Badge definition.
 * @param {Array}  activities      - Array of activity objects.
 * @param {number} totalPostsCount - Total number of published posts/pages.
 * @param {Date}   activationDate  - Plugin activation date.
 * @return {Object} Progress object with progress and remaining.
 */
function calculateContentBadgeProgress(badge, activities, totalPostsCount, activationDate) {
  const {
    thresholds
  } = badge;

  // Content Curator has special logic: 20 existing OR 10 new.
  if (badge.id === 'content-curator') {
    const existingRemaining = Math.max(0, thresholds.existingPosts - Math.min(thresholds.existingPosts, totalPostsCount));
    if (existingRemaining === 0) {
      return {
        progress: 100,
        remaining: 0
      };
    }

    // Count new posts since activation.
    // Compare dates at day level (ignore time).
    const activationDateDay = new Date(activationDate);
    activationDateDay.setHours(0, 0, 0, 0);
    const newCount = activities.filter(activity => {
      if (activity.category !== 'content' || activity.type !== 'publish') {
        return false;
      }
      const activityDate = new Date(activity.date);
      activityDate.setHours(0, 0, 0, 0);
      return activityDate >= activationDateDay;
    }).length;
    const newRemaining = Math.max(0, thresholds.newPosts - Math.min(thresholds.newPosts, newCount));
    const finalPercent = Math.max(Math.min(100, Math.floor(totalPostsCount / 2)), Math.min(100, Math.floor(newCount * 10)));
    const finalRemaining = Math.min(existingRemaining, newRemaining);
    return {
      progress: finalPercent,
      remaining: finalRemaining
    };
  }

  // Other content badges: count new posts since activation.
  // Compare dates at day level (ignore time).
  const activationDateDay = new Date(activationDate);
  activationDateDay.setHours(0, 0, 0, 0);
  const newCount = activities.filter(activity => {
    if (activity.category !== 'content' || activity.type !== 'publish') {
      return false;
    }
    const activityDate = new Date(activity.date);
    activityDate.setHours(0, 0, 0, 0);
    return activityDate >= activationDateDay;
  }).length;
  const threshold = thresholds.newPosts;
  const percent = Math.min(100, Math.floor(newCount / threshold * 100));
  const remaining = Math.max(0, threshold - Math.min(threshold, newCount));
  return {
    progress: percent,
    remaining
  };
}

/**
 * Calculate weekly streak from activities.
 *
 * @param {Array}  activities   - Array of activity objects.
 * @param {Date}   startDate    - Start date for streak calculation.
 * @param {number} allowedBreak - Number of allowed breaks in streak.
 * @return {Object} Streak object with max_streak and current_streak.
 */
function calculateWeeklyStreak(activities, startDate, allowedBreak = 1) {
  // Group activities by week.
  const weeks = new Map();
  activities.forEach(activity => {
    const activityDate = new Date(activity.date);
    activityDate.setHours(0, 0, 0, 0);
    const startDateDay = new Date(startDate);
    startDateDay.setHours(0, 0, 0, 0);
    if (activityDate < startDateDay) {
      return;
    }

    // Get week start (Monday).
    const weekStart = getWeekStart(activityDate);
    const weekKey = weekStart.toISOString().split('T')[0];
    if (!weeks.has(weekKey)) {
      weeks.set(weekKey, []);
    }
    weeks.get(weekKey).push(activity);
  });

  // Generate all weeks from start date to today.
  const allWeeks = [];
  const currentDate = new Date(startDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  while (currentDate <= today) {
    const weekStart = getWeekStart(currentDate);
    const weekKey = weekStart.toISOString().split('T')[0];
    allWeeks.push({
      weekKey,
      weekStart: new Date(weekStart),
      hasActivity: weeks.has(weekKey) && weeks.get(weekKey).length > 0
    });
    currentDate.setDate(currentDate.getDate() + 7);
  }

  // Calculate streak.
  let streakNr = 0;
  let maxStreak = 0;
  let remainingBreaks = allowedBreak;

  // Process weeks in chronological order.
  for (const week of allWeeks) {
    if (week.hasActivity) {
      streakNr++;
      maxStreak = Math.max(maxStreak, streakNr);
    } else {
      if (remainingBreaks > 0) {
        remainingBreaks--;
        continue;
      }
      streakNr = 0;
    }
  }
  return {
    max_streak: maxStreak,
    current_streak: streakNr
  };
}

/**
 * Get the start of the week (Monday) for a given date.
 *
 * @param {Date} date - The date.
 * @return {Date} Start of week (Monday).
 */
function getWeekStart(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday.
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Calculate maintenance badge progress.
 *
 * @param {Object} badge          - Badge definition.
 * @param {Array}  activities     - Array of activity objects.
 * @param {Date}   activationDate - Plugin activation date.
 * @return {Object} Progress object with progress and remaining.
 */
function calculateMaintenanceBadgeProgress(badge, activities, activationDate) {
  const {
    thresholds
  } = badge;
  const weeks = thresholds.weeks;

  // Filter maintenance activities.
  const maintenanceActivities = activities.filter(activity => activity.category === 'maintenance');
  const streak = calculateWeeklyStreak(maintenanceActivities, activationDate, 1 // Allowed break for maintenance badges.
  );
  const maxStreak = streak.max_streak;
  const percent = Math.min(100, Math.floor(maxStreak / weeks * 100));
  const remaining = Math.max(0, weeks - Math.min(weeks, maxStreak));
  return {
    progress: percent,
    remaining
  };
}

/**
 * Calculate monthly badge progress.
 *
 * @param {Object}  badge                     - Badge definition (monthly).
 * @param {Array}   activities                - Array of activity objects with points.
 * @param {Date}    monthStart                - Start date of the month.
 * @param {Date}    monthEnd                  - End date of the month.
 * @param {number}  targetPoints              - Target points for the month.
 * @param {Object}  options                   - Calculation options.
 * @param {boolean} options.noNextBadgePoints - If true, don't include excess from next badges.
 * @return {Object} Progress object with progress, remaining, and points.
 */
function calculateMonthlyBadgeProgress(badge, activities, monthStart, monthEnd, targetPoints = 10, options = {}) {
  // Filter activities for this month.
  // Normalize dates for comparison.
  const monthStartDay = new Date(monthStart);
  monthStartDay.setHours(0, 0, 0, 0);
  const monthEndDay = new Date(monthEnd);
  monthEndDay.setHours(23, 59, 59, 999);
  const monthActivities = activities.filter(activity => {
    const activityDate = new Date(activity.date);
    return activityDate >= monthStartDay && activityDate <= monthEndDay;
  });

  // Sum points from activities.
  let points = 0;
  monthActivities.forEach(activity => {
    if (activity.points && typeof activity.points === 'number') {
      points += activity.points;
    }
  });
  const progress = Math.max(0, Math.min(100, Math.floor(points / targetPoints * 100)));
  const remaining = Math.max(0, Math.min(targetPoints - points, targetPoints));
  const result = {
    progress,
    remaining,
    points
  };

  // If badge is complete or noNextBadgePoints is set, return as is.
  if (points >= targetPoints || options.noNextBadgePoints) {
    return result;
  }

  // Add excess points from next badges (up to 2 months forward).
  const excessPoints = getNextBadgesExcessPoints(activities, monthEnd, targetPoints, 2);
  if (excessPoints > 0) {
    const totalPoints = points + excessPoints;
    return {
      progress: Math.max(0, Math.min(100, Math.floor(totalPoints / targetPoints * 100))),
      remaining: Math.max(0, Math.min(targetPoints - totalPoints, targetPoints)),
      points: totalPoints
    };
  }
  return result;
}

/**
 * Get excess points from next badges (for monthly badge overflow).
 *
 * Port of PHP get_next_badges_excess_points() logic.
 * Looks forward up to 2 months and calculates excess points that can overflow
 * to the current month badge.
 *
 * @param {Array}  activities      - Array of activity objects.
 * @param {Date}   currentMonthEnd - End date of current month.
 * @param {number} targetPoints    - Target points per month.
 * @param {number} monthsForward   - Number of months to look forward (typically 2).
 * @return {number} Excess points.
 */
function getNextBadgesExcessPoints(activities, currentMonthEnd, targetPoints, monthsForward) {
  let next1BadgePoints = 0;
  let next2BadgePoints = 0;
  let badge1ExcessPoints = 0;
  let badge2ExcessPoints = 0;

  // Get next month (i=1).
  const next1MonthStart = new Date(currentMonthEnd);
  next1MonthStart.setMonth(next1MonthStart.getMonth() + 1);
  next1MonthStart.setDate(1);
  next1MonthStart.setHours(0, 0, 0, 0);
  const next1MonthEnd = new Date(next1MonthStart);
  next1MonthEnd.setMonth(next1MonthEnd.getMonth() + 1);
  next1MonthEnd.setDate(0);
  next1MonthEnd.setHours(23, 59, 59, 999);
  const next1Activities = activities.filter(activity => {
    const activityDate = new Date(activity.date);
    return activityDate >= next1MonthStart && activityDate <= next1MonthEnd;
  });
  next1Activities.forEach(activity => {
    if (activity.points && typeof activity.points === 'number') {
      next1BadgePoints += activity.points;
    }
  });

  // Get month after next (i=2).
  if (monthsForward >= 2) {
    const next2MonthStart = new Date(currentMonthEnd);
    next2MonthStart.setMonth(next2MonthStart.getMonth() + 2);
    next2MonthStart.setDate(1);
    next2MonthStart.setHours(0, 0, 0, 0);
    const next2MonthEnd = new Date(next2MonthStart);
    next2MonthEnd.setMonth(next2MonthEnd.getMonth() + 1);
    next2MonthEnd.setDate(0);
    next2MonthEnd.setHours(23, 59, 59, 999);
    const next2Activities = activities.filter(activity => {
      const activityDate = new Date(activity.date);
      return activityDate >= next2MonthStart && activityDate <= next2MonthEnd;
    });
    next2Activities.forEach(activity => {
      if (activity.points && typeof activity.points === 'number') {
        next2BadgePoints += activity.points;
      }
    });
  }

  // If next1 has more than target points, calculate excess.
  if (next1BadgePoints > targetPoints) {
    badge1ExcessPoints = Math.max(0, next1BadgePoints - targetPoints);
  }

  // If next2 has more than target points, calculate excess.
  if (next2BadgePoints > targetPoints) {
    badge2ExcessPoints = Math.max(0, next2BadgePoints - targetPoints);

    // Does next1 need more points to reach target?
    if (next1BadgePoints < targetPoints) {
      // Use next2 excess to fill next1 first, then calculate remaining excess.
      badge2ExcessPoints = Math.max(0, next1BadgePoints + badge2ExcessPoints - targetPoints);
    }
  }
  return badge1ExcessPoints + badge2ExcessPoints;
}

/***/ }),

/***/ "./assets/src/widgets/MonthlyBadges/MonthlyBadgesSkeleton.js":
/*!*******************************************************************!*\
  !*** ./assets/src/widgets/MonthlyBadges/MonthlyBadgesSkeleton.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ MonthlyBadgesSkeleton)
/* harmony export */ });
/* harmony import */ var _components_Gauge_GaugeSkeleton__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../components/Gauge/GaugeSkeleton */ "./assets/src/components/Gauge/GaugeSkeleton.js");
/* harmony import */ var _components_Badge_BadgeSkeleton__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../components/Badge/BadgeSkeleton */ "./assets/src/components/Badge/BadgeSkeleton.js");
/* harmony import */ var _components_Skeleton__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../components/Skeleton */ "./assets/src/components/Skeleton/index.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);
/**
 * MonthlyBadges Skeleton Component
 *
 * Skeleton loading state for the MonthlyBadges widget.
 * Composes: GaugeSkeleton, BadgeSkeleton
 */





/**
 * PointsCounterSkeleton component - skeleton for points counter.
 *
 * @return {JSX.Element} The PointsCounterSkeleton component.
 */

function PointsCounterSkeleton() {
  const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    justifyContent: 'center'
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
    style: containerStyle,
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_components_Skeleton__WEBPACK_IMPORTED_MODULE_2__.SkeletonRect, {
      width: "2rem",
      height: "1.5rem",
      style: {
        borderRadius: '4px'
      }
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_components_Skeleton__WEBPACK_IMPORTED_MODULE_2__.SkeletonRect, {
      width: "8rem",
      height: "1rem"
    })]
  });
}

/**
 * MonthlyBadgesSkeleton component.
 *
 * @return {JSX.Element} The MonthlyBadgesSkeleton component.
 */
function MonthlyBadgesSkeleton() {
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
    style: containerStyle,
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
      style: {
        position: 'relative'
      },
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_components_Gauge_GaugeSkeleton__WEBPACK_IMPORTED_MODULE_0__["default"], {}), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
        style: {
          position: 'absolute',
          top: '25%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '40%'
        },
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_components_Badge_BadgeSkeleton__WEBPACK_IMPORTED_MODULE_1__["default"], {})
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(PointsCounterSkeleton, {})]
  });
}

/***/ }),

/***/ "./assets/src/widgets/MonthlyBadges/PointsCounter.js":
/*!***********************************************************!*\
  !*** ./assets/src/widgets/MonthlyBadges/PointsCounter.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PointsCounter)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);
/**
 * PointsCounter Component
 *
 * Displays the current points and remaining points needed.
 */



/**
 * PointsCounter component.
 *
 * @param {Object}  props          - Component props.
 * @param {number}  props.points   - Current points.
 * @param {string}  props.label    - Label text.
 * @param {boolean} props.showUnit - Whether to show "pt" unit.
 * @return {JSX.Element} The PointsCounter component.
 */

function PointsCounter({
  points,
  label = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Progress monthly badge', 'progress-planner'),
  showUnit = true
}) {
  const containerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };
  const numberStyle = {
    fontSize: 'var(--prpl-font-size-3xl)',
    fontWeight: 600
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
    className: "prpl-monthly-badges__points-counter",
    style: containerStyle,
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("span", {
      className: "prpl-monthly-badges__points-label",
      children: label
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("span", {
      className: "prpl-monthly-badges__points-number",
      style: numberStyle,
      children: [points, showUnit && 'pt']
    })]
  });
}

/***/ }),

/***/ "./assets/src/widgets/MonthlyBadges/index.js":
/*!***************************************************!*\
  !*** ./assets/src/widgets/MonthlyBadges/index.js ***!
  \***************************************************/
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
/* harmony import */ var _hooks_useBadgeData__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../hooks/useBadgeData */ "./assets/src/hooks/useBadgeData/index.js");
/* harmony import */ var _hooks_useBadgeProgress__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../hooks/useBadgeProgress */ "./assets/src/hooks/useBadgeProgress/index.js");
/* harmony import */ var _hooks_useBadgeProgressSave__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../hooks/useBadgeProgressSave */ "./assets/src/hooks/useBadgeProgressSave/index.js");
/* harmony import */ var _config_badges__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../config/badges */ "./assets/src/config/badges.js");
/* harmony import */ var _components_Gauge__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../components/Gauge */ "./assets/src/components/Gauge/index.js");
/* harmony import */ var _components_Badge__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../components/Badge */ "./assets/src/components/Badge/index.js");
/* harmony import */ var _components_BadgeProgressBar__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../components/BadgeProgressBar */ "./assets/src/components/BadgeProgressBar/index.js");
/* harmony import */ var _PointsCounter__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./PointsCounter */ "./assets/src/widgets/MonthlyBadges/PointsCounter.js");
/* harmony import */ var _components_WidgetStates__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../components/WidgetStates */ "./assets/src/components/WidgetStates/index.js");
/* harmony import */ var _MonthlyBadgesSkeleton__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./MonthlyBadgesSkeleton */ "./assets/src/widgets/MonthlyBadges/MonthlyBadgesSkeleton.js");
/* harmony import */ var _components_WidgetHeader__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../components/WidgetHeader */ "./assets/src/components/WidgetHeader/index.js");
/* harmony import */ var _stores_dashboardStore__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../stores/dashboardStore */ "./assets/src/stores/dashboardStore.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__);
/**
 * MonthlyBadges Widget
 *
 * Main widget component that displays the monthly badge gauge
 * with real-time updates on task completion.
 */

















/**
 * MonthlyBadges widget component.
 *
 * @param {Object} props        - Component props.
 * @param {Object} props.config - Widget configuration.
 * @return {JSX.Element} The MonthlyBadges widget.
 */

function MonthlyBadges({
  config = {}
}) {
  // Get session points from Zustand store for real-time updates.
  const sessionPoints = (0,_stores_dashboardStore__WEBPACK_IMPORTED_MODULE_14__.useDashboardStore)(state => state.sessionPoints);
  const {
    isLoading,
    error,
    data
  } = (0,_hooks_useBadgeData__WEBPACK_IMPORTED_MODULE_3__.useBadgeData)();

  // Get monthly badge date range function.
  const getMonthlyBadgeDateRange = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(badgeId => {
    if (!badgeId.startsWith('monthly-')) {
      return null;
    }
    const parts = badgeId.split('-');
    if (parts.length !== 3) {
      return null;
    }
    const year = parseInt(parts[1], 10);
    const monthStr = parts[2].replace('m', '');
    const month = parseInt(monthStr, 10);
    if (!year || month < 1 || month > 12) {
      return null;
    }
    const startDate = new Date(year, month - 1, 1);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(year, month, 0);
    endDate.setHours(23, 59, 59, 999);
    return {
      startDate,
      endDate
    };
  }, []);

  // Calculate badge progress.
  const badgeProgress = (0,_hooks_useBadgeProgress__WEBPACK_IMPORTED_MODULE_4__.useBadgeProgress)({
    activities: data?.activities || [],
    savedStats: data?.savedStats || {},
    totalPostsCount: data?.totalPostsCount || 0,
    activationDate: data?.activationDate ? new Date(data.activationDate) : null,
    getMonthlyBadgeDateRange
  });

  // Automatically save progress when it changes.
  (0,_hooks_useBadgeProgressSave__WEBPACK_IMPORTED_MODULE_5__.useBadgeProgressSave)(badgeProgress, data?.savedStats || {});

  // Get current month badge.
  const currentBadge = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    const now = new Date();
    const badgeId = (0,_config_badges__WEBPACK_IMPORTED_MODULE_6__.getMonthlyBadgeIdFromDate)(now);
    const badgeName = (0,_config_badges__WEBPACK_IMPORTED_MODULE_6__.getMonthlyBadgeNameFromDate)(now);
    const progress = badgeProgress[badgeId] || {
      progress: 0,
      remaining: 10,
      points: 0
    };
    return {
      id: badgeId,
      name: badgeName,
      progress
    };
  }, [badgeProgress]);

  // Get previous incomplete badges.
  const previousBadges = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const incomplete = [];

    // Check previous 2 months (matches PHP overflow logic).
    for (let i = 1; i <= 2; i++) {
      const checkDate = new Date(currentYear, currentMonth - i, 1);
      const badgeId = (0,_config_badges__WEBPACK_IMPORTED_MODULE_6__.getMonthlyBadgeIdFromDate)(checkDate);
      const progress = badgeProgress[badgeId];
      if (progress && progress.progress < 100) {
        const badgeName = (0,_config_badges__WEBPACK_IMPORTED_MODULE_6__.getMonthlyBadgeNameFromDate)(checkDate);
        incomplete.push({
          id: badgeId,
          name: badgeName,
          points: progress.points || 0,
          maxPoints: _config_badges__WEBPACK_IMPORTED_MODULE_6__.MONTHLY_BADGE_CONFIG.targetPoints
        });
      }
    }
    return incomplete;
  }, [badgeProgress]);

  // Calculate effective gauge value by adding session points.
  const baseGaugeValue = currentBadge?.progress?.points || 0;
  const gaugeValue = baseGaugeValue + sessionPoints;
  const maxPoints = _config_badges__WEBPACK_IMPORTED_MODULE_6__.MONTHLY_BADGE_CONFIG.targetPoints;
  const widgetConfig = data?.config || {
    brandingId: config?.brandingId || 0
  };

  /**
   * Calculate if the current badge is complete (including session points).
   */
  const isComplete = gaugeValue >= maxPoints;

  /**
   * Calculate remaining points and days remaining for previous badges.
   */
  const previousBadgesData = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    if (previousBadges.length === 0) {
      return [];
    }

    // Calculate current month remaining points
    const currentMonthRemaining = Math.max(0, maxPoints - gaugeValue);

    // Calculate accumulated remaining points
    let accumulatedRemaining = currentMonthRemaining;
    const badgesWithRemaining = previousBadges.map(badge => {
      const badgeRemaining = Math.max(0, (badge.maxPoints || 10) - badge.points);
      accumulatedRemaining += badgeRemaining;
      return {
        ...badge,
        remaining: badgeRemaining,
        accumulatedRemaining
      };
    });

    // Calculate days remaining in current month
    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const daysRemaining = daysInMonth - now.getDate();
    return badgesWithRemaining.map(badge => ({
      ...badge,
      daysRemaining
    }));
  }, [previousBadges, maxPoints, gaugeValue]);
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  };

  // Get title from config or use default.
  const widgetTitle = config?.title || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Your monthly badge', 'progress-planner');
  if (isLoading) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.Fragment, {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)(_components_WidgetHeader__WEBPACK_IMPORTED_MODULE_13__["default"], {
        title: widgetTitle
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)(_MonthlyBadgesSkeleton__WEBPACK_IMPORTED_MODULE_12__["default"], {})]
    });
  }
  if (error) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.Fragment, {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)(_components_WidgetHeader__WEBPACK_IMPORTED_MODULE_13__["default"], {
        title: widgetTitle
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)(_components_WidgetStates__WEBPACK_IMPORTED_MODULE_11__.ErrorState, {
        message: error,
        className: "prpl-monthly-badges prpl-monthly-badges--error",
        style: {
          minHeight: '200px',
          backgroundColor: 'transparent',
          color: 'var(--prpl-color-alert-error)'
        }
      })]
    });
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)(_components_WidgetHeader__WEBPACK_IMPORTED_MODULE_13__["default"], {
      title: widgetTitle
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsxs)("div", {
      className: "prpl-monthly-badges",
      style: containerStyle,
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)(_components_Gauge__WEBPACK_IMPORTED_MODULE_7__["default"], {
        value: gaugeValue,
        max: maxPoints,
        children: currentBadge && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)(_components_Badge__WEBPACK_IMPORTED_MODULE_8__["default"], {
          badgeId: currentBadge.id,
          badgeName: currentBadge.name,
          brandingId: widgetConfig.brandingId,
          isComplete: isComplete
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)(_PointsCounter__WEBPACK_IMPORTED_MODULE_10__["default"], {
        points: gaugeValue,
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Progress monthly badge', 'progress-planner')
      }), previousBadges.length > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.Fragment, {
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)("hr", {}), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsxs)("div", {
          className: "prpl-previous-month-badge-progress-bars-wrapper",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)("h3", {
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Oh no! You missed the previous monthly badge!', 'progress-planner')
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)("p", {
            className: "prpl-previous-month-badge-progress-bars-wrapper-description",
            dangerouslySetInnerHTML: {
              __html: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('No worries though! <strong>Collect the surplus of points</strong> you earn, and get your badge!', 'progress-planner')
            }
          }), previousBadgesData.map(badge => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)("div", {
            className: "prpl-previous-month-badge-progress-bar-wrapper",
            style: {
              borderRadius: '0.5rem',
              padding: '0.75rem 1rem 1.25rem 1rem'
            },
            "data-badge-id": badge.id,
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)(_components_BadgeProgressBar__WEBPACK_IMPORTED_MODULE_9__["default"], {
              badgeId: badge.id,
              badgeName: badge.name,
              points: badge.points,
              maxPoints: badge.maxPoints || 10,
              remaining: badge.remaining,
              accumulatedRemaining: badge.accumulatedRemaining,
              daysRemaining: badge.daysRemaining,
              brandingId: widgetConfig.brandingId
            })
          }, badge.id))]
        })]
      })]
    })]
  });
}

// Register widget via hook with metadata
(0,_wordpress_hooks__WEBPACK_IMPORTED_MODULE_2__.doAction)('prpl.dashboard.registerWidget', {
  id: 'monthly-badges',
  component: MonthlyBadges,
  priority: 2,
  width: 1,
  forceLastColumn: false,
  title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Your monthly badge', 'progress-planner'),
  infoIconSvg: '' // Can be fetched from REST API if needed for branding
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MonthlyBadges);

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
/******/ var __webpack_exports__ = (__webpack_exec__("./assets/src/widgets/MonthlyBadges/index.js"));
/******/ }
]);
//# sourceMappingURL=widget-monthly-badges.js.map