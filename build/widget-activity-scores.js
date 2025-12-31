"use strict";
(globalThis["webpackChunkprogress_planner"] = globalThis["webpackChunkprogress_planner"] || []).push([["widget-activity-scores"],{

/***/ "./assets/src/components/BarChart/BarChartSkeleton.js":
/*!************************************************************!*\
  !*** ./assets/src/components/BarChart/BarChartSkeleton.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ BarChartSkeleton)
/* harmony export */ });
/* harmony import */ var _Skeleton__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Skeleton */ "./assets/src/components/Skeleton/index.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);
/**
 * BarChart Skeleton Component
 *
 * Skeleton loading state for the BarChart component.
 */



/**
 * BarChartSkeleton component.
 *
 * @param {Object} props      - Component props.
 * @param {number} props.bars - Number of bars to show.
 * @return {JSX.Element} The BarChartSkeleton component.
 */

function BarChartSkeleton({
  bars = 6
}) {
  const containerStyle = {
    display: 'flex',
    maxWidth: '600px',
    height: '200px',
    width: '100%',
    alignItems: 'flex-end',
    gap: '5px',
    margin: '1rem 0'
  };
  const barContainerStyle = {
    flex: 'auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    height: '100%'
  };
  const labelContainerStyle = {
    height: '1rem',
    overflow: 'visible',
    textAlign: 'center',
    display: 'block',
    width: '100%',
    marginTop: '0.25rem'
  };

  // Generate random-ish heights for visual variety.
  const barHeights = Array.from({
    length: bars
  }).map((_, i) => 30 + i * 17 % 50);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
      style: containerStyle,
      children: barHeights.map((height, index) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
        style: barContainerStyle,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_Skeleton__WEBPACK_IMPORTED_MODULE_0__.SkeletonRect, {
          width: "100%",
          height: `${height}%`,
          style: {
            borderRadius: '4px 4px 0 0'
          }
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("span", {
          style: labelContainerStyle,
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_Skeleton__WEBPACK_IMPORTED_MODULE_0__.SkeletonRect, {
            width: "80%",
            height: "0.75em",
            style: {
              margin: '0 auto'
            }
          })
        })]
      }, index))
    })
  });
}

/***/ }),

/***/ "./assets/src/components/BarChart/index.js":
/*!*************************************************!*\
  !*** ./assets/src/components/BarChart/index.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ BarChart)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);
/**
 * BarChart Component
 *
 * Displays a bar chart with labels.
 */



/**
 * BarChart component.
 *
 * @param {Object} props      - Component props.
 * @param {Array}  props.data - Array of data points with label, score, and color.
 * @return {JSX.Element} The BarChart component.
 */

function BarChart({
  data = []
}) {
  const chartRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);

  // Calculate how many labels to show (max 6)
  const labelsDivider = data.length > 6 ? Math.floor(data.length / 6) : 1;

  /**
   * Adjust label positioning when there are many items.
   */
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!chartRef.current) {
      return;
    }
    const invisibleLabels = chartRef.current.querySelectorAll('.label.invisible');
    if (invisibleLabels.length === 0) {
      return;
    }
    const labelContainers = chartRef.current.querySelectorAll('.label-container');
    const chartBar = chartRef.current.querySelector('.chart-bar');
    labelContainers.forEach(container => {
      const labelElement = container.querySelector('.label');
      if (!labelElement) {
        return;
      }
      const labelWidth = labelElement.offsetWidth;
      labelElement.style.display = 'block';
      labelElement.style.width = '0';
      const marginLeft = (container.offsetWidth - labelWidth) / 2;
      if (labelElement.classList.contains('visible')) {
        labelElement.style.marginLeft = `${marginLeft}px`;
      }
    });

    // Reduce gap between items to avoid overflows
    const firstLabel = chartRef.current.querySelector('.label');
    if (firstLabel && chartBar) {
      const newGap = Math.max(firstLabel.offsetWidth / 4, 1);
      chartBar.style.gap = `${Math.floor(newGap)}px`;
    }
  }, [data]);
  const containerStyle = {
    display: 'flex',
    maxWidth: '600px',
    height: '200px',
    width: '100%',
    alignItems: 'flex-end',
    gap: '5px',
    margin: '1rem 0'
  };
  const barContainerStyle = {
    flex: 'auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    height: '100%'
  };
  const labelContainerStyle = {
    height: '1rem',
    overflow: 'visible',
    textAlign: 'center',
    display: 'block',
    width: '100%',
    fontSize: '0.75em'
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
    className: "prpl-bar-chart",
    ref: chartRef,
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
      className: "chart-bar",
      style: containerStyle,
      children: data.map((item, index) => {
        const barStyle = {
          display: 'block',
          width: '100%',
          height: `${item.score}%`,
          background: item.color
        };
        const isLabelVisible = index % labelsDivider === 0;
        const labelClass = isLabelVisible ? 'label visible' : 'label invisible';
        const labelStyle = isLabelVisible ? {} : {
          visibility: 'hidden'
        };
        return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
          className: "prpl-bar-chart__bar-container",
          style: barContainerStyle,
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
            className: "prpl-bar-chart__bar",
            style: barStyle,
            title: `${item.label} - ${item.score}%`
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("span", {
            className: "label-container",
            style: labelContainerStyle,
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("span", {
              className: labelClass,
              style: labelStyle,
              children: item.label
            })
          })]
        }, index);
      })
    })
  });
}

/***/ }),

/***/ "./assets/src/components/BigCounter/BigCounterSkeleton.js":
/*!****************************************************************!*\
  !*** ./assets/src/components/BigCounter/BigCounterSkeleton.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ BigCounterSkeleton)
/* harmony export */ });
/* harmony import */ var _Skeleton__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Skeleton */ "./assets/src/components/Skeleton/index.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);
/**
 * BigCounter Skeleton Component
 *
 * Skeleton loading state for the BigCounter component.
 */



/**
 * BigCounterSkeleton component.
 *
 * @param {Object} props                 - Component props.
 * @param {string} props.backgroundColor - Background color (CSS value).
 * @return {JSX.Element} The BigCounterSkeleton component.
 */

function BigCounterSkeleton({
  backgroundColor = 'var(--prpl-background-content)'
}) {
  const containerStyle = {
    backgroundColor,
    padding: 'var(--prpl-padding)',
    borderRadius: 'var(--prpl-border-radius-big)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    height: 'calc(var(--prpl-font-size-5xl) + var(--prpl-font-size-2xl) + var(--prpl-padding) * 2)',
    marginBottom: 'var(--prpl-padding)',
    gap: '0.5rem'
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
    style: containerStyle,
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_Skeleton__WEBPACK_IMPORTED_MODULE_0__.SkeletonRect, {
      width: "3rem",
      height: "var(--prpl-font-size-5xl)",
      style: {
        borderRadius: '8px'
      }
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_Skeleton__WEBPACK_IMPORTED_MODULE_0__.SkeletonRect, {
      width: "8rem",
      height: "var(--prpl-font-size-2xl)",
      style: {
        borderRadius: '4px'
      }
    })]
  });
}

/***/ }),

/***/ "./assets/src/components/BigCounter/index.js":
/*!***************************************************!*\
  !*** ./assets/src/components/BigCounter/index.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ BigCounter)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);
/**
 * BigCounter Component
 *
 * Displays a large counter with a label, with responsive text sizing.
 */



/**
 * BigCounter component.
 *
 * @param {Object} props                 - Component props.
 * @param {string} props.number          - The number to display.
 * @param {string} props.label           - The label text below the number.
 * @param {string} props.backgroundColor - Background color (CSS value).
 * @return {JSX.Element} The BigCounter component.
 */

function BigCounter({
  number,
  label,
  backgroundColor = 'var(--prpl-background-content)'
}) {
  const containerRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const labelRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const resizeFont = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    const labelElement = labelRef.current;
    const containerElement = containerRef.current;
    if (!labelElement || !containerElement) {
      return;
    }

    // Reset to 100% first
    labelElement.style.fontSize = '100%';
    labelElement.style.width = 'max-content';
    const containerWidth = containerElement.clientWidth;
    let size = 100;

    // Shrink the font until it fits or reaches minimum size
    while (labelElement.clientWidth > containerWidth && size > 80) {
      size -= 1;
      labelElement.style.fontSize = size + '%';
    }

    // If we hit minimum size, set width to 100% for wrapping
    if (size <= 80) {
      labelElement.style.fontSize = '80%';
      labelElement.style.width = '100%';
    }
  }, []);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    resizeFont();
    window.addEventListener('resize', resizeFont);
    return () => {
      window.removeEventListener('resize', resizeFont);
    };
  }, [resizeFont, label]);
  const containerStyle = {
    backgroundColor,
    padding: 'var(--prpl-padding)',
    borderRadius: 'var(--prpl-border-radius-big)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    height: 'calc(var(--prpl-font-size-5xl) + var(--prpl-font-size-2xl) + var(--prpl-padding) * 2)',
    marginBottom: 'var(--prpl-padding)'
  };
  const numberStyle = {
    fontSize: 'var(--prpl-font-size-5xl)',
    lineHeight: 1,
    fontWeight: 600
  };
  const labelWrapperStyle = {
    fontSize: 'var(--prpl-font-size-2xl)'
  };
  const labelStyle = {
    fontSize: '100%',
    display: 'inline-block',
    width: 'max-content'
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
    className: "prpl-big-counter",
    style: containerStyle,
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
      className: "prpl-big-counter__width-reference",
      ref: containerRef,
      style: {
        width: '100%'
      }
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("span", {
      className: "prpl-big-counter__number",
      style: numberStyle,
      children: number
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("span", {
      className: "prpl-big-counter__label-wrapper",
      style: labelWrapperStyle,
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("span", {
        className: "prpl-big-counter__label",
        ref: labelRef,
        style: labelStyle,
        children: label
      })
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

/***/ "./assets/src/hooks/useApiData/index.js":
/*!**********************************************!*\
  !*** ./assets/src/hooks/useApiData/index.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   clearApiCache: () => (/* binding */ clearApiCache),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   useApiData: () => (/* binding */ useApiData)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _services_apiFetchCache__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../services/apiFetchCache */ "./assets/src/services/apiFetchCache.js");
/**
 * useApiData Hook
 *
 * Shared hook for fetching data from the REST API with loading/error states.
 * Uses the centralized apiFetchCache service for caching and request deduplication.
 */




/**
 * Default cache TTL in milliseconds (5 minutes).
 */
const DEFAULT_CACHE_TTL = 5 * 60 * 1000;

/**
 * Clear cache for a specific path or all paths.
 * Delegates to the centralized cache service.
 *
 * @param {string|null} path - The API endpoint path to clear, or null for all.
 */
function clearApiCache(path = null) {
  if (path) {
    (0,_services_apiFetchCache__WEBPACK_IMPORTED_MODULE_1__.clearCacheFor)(path);
  } else {
    (0,_services_apiFetchCache__WEBPACK_IMPORTED_MODULE_1__.clearCache)();
  }
}

/**
 * Custom hook for fetching data from REST API.
 *
 * @param {string}        path              - The API endpoint path.
 * @param {Array}         dependencies      - Optional dependencies array for useEffect.
 * @param {string|Object} errorMessage      - Default error message or object with message property.
 * @param {Object}        options           - Additional options.
 * @param {boolean}       options.cache     - Whether to use caching (default: true).
 * @param {number}        options.cacheTtl  - Cache TTL in milliseconds (default: 5 minutes).
 * @param {boolean}       options.skipCache - Skip cache for this specific fetch.
 * @return {Object} Object containing isLoading, error, data, and refetch function.
 */
function useApiData(path, dependencies = [], errorMessage = 'Failed to load data', options = {}) {
  const {
    cache = true,
    cacheTtl = DEFAULT_CACHE_TTL,
    skipCache = false
  } = options;
  const [isLoading, setIsLoading] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(true);
  const [error, setError] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [data, setData] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);

  /**
   * Fetch data from API.
   *
   * @param {boolean} forceRefresh - Force refresh bypassing cache.
   */
  const fetchData = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(async (forceRefresh = false) => {
    // Skip fetch if path is empty.
    if (!path) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await (0,_services_apiFetchCache__WEBPACK_IMPORTED_MODULE_1__.cachedApiFetch)({
        path
      }, {
        skipCache: forceRefresh || skipCache || !cache,
        ttl: cacheTtl
      });
      setData(response);
    } catch (err) {
      const message = err.message || (typeof errorMessage === 'string' ? errorMessage : errorMessage.message || 'Failed to load data');
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [path, cache, cacheTtl, skipCache, errorMessage]);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, ...dependencies]);

  /**
   * Refetch data, optionally bypassing cache.
   *
   * @param {boolean} bypassCache - Whether to bypass cache.
   */
  const refetch = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)((bypassCache = true) => {
    fetchData(bypassCache);
  }, [fetchData]);
  return {
    isLoading,
    error,
    data,
    refetch
  };
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (useApiData);

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

/***/ "./assets/src/widgets/ActivityScores/ActivityScoresSkeleton.js":
/*!*********************************************************************!*\
  !*** ./assets/src/widgets/ActivityScores/ActivityScoresSkeleton.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ActivityScoresSkeleton)
/* harmony export */ });
/* harmony import */ var _components_Gauge_GaugeSkeleton__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../components/Gauge/GaugeSkeleton */ "./assets/src/components/Gauge/GaugeSkeleton.js");
/* harmony import */ var _components_BarChart_BarChartSkeleton__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../components/BarChart/BarChartSkeleton */ "./assets/src/components/BarChart/BarChartSkeleton.js");
/* harmony import */ var _components_BigCounter_BigCounterSkeleton__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../components/BigCounter/BigCounterSkeleton */ "./assets/src/components/BigCounter/BigCounterSkeleton.js");
/* harmony import */ var _components_Skeleton__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../components/Skeleton */ "./assets/src/components/Skeleton/index.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__);
/**
 * ActivityScores Skeleton Component
 *
 * Skeleton loading state for the ActivityScores widget.
 * Composes: GaugeSkeleton, BarChartSkeleton, BigCounterSkeleton
 */






/**
 * ActivityScoresSkeleton component.
 *
 * @return {JSX.Element} The ActivityScoresSkeleton component.
 */

function ActivityScoresSkeleton() {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
      style: {
        '--background': 'var(--prpl-background-monthly)'
      },
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components_Gauge_GaugeSkeleton__WEBPACK_IMPORTED_MODULE_0__["default"], {
        backgroundColor: "var(--prpl-background-activity)"
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("hr", {}), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components_Skeleton__WEBPACK_IMPORTED_MODULE_3__.SkeletonText, {
      width: "80%",
      style: {
        marginBottom: '0.5rem'
      }
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
      className: "prpl-graph-wrapper",
      style: {
        maxHeight: '300px'
      },
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components_BarChart_BarChartSkeleton__WEBPACK_IMPORTED_MODULE_1__["default"], {
        bars: 6
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("hr", {}), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components_BigCounter_BigCounterSkeleton__WEBPACK_IMPORTED_MODULE_2__["default"], {
      backgroundColor: "var(--prpl-background-activity)"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
      className: "prpl-widget-content",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components_Skeleton__WEBPACK_IMPORTED_MODULE_3__.SkeletonText, {
        lines: 2
      })
    })]
  });
}

/***/ }),

/***/ "./assets/src/widgets/ActivityScores/index.js":
/*!****************************************************!*\
  !*** ./assets/src/widgets/ActivityScores/index.js ***!
  \****************************************************/
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
/* harmony import */ var _components_Gauge__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../components/Gauge */ "./assets/src/components/Gauge/index.js");
/* harmony import */ var _components_BarChart__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../components/BarChart */ "./assets/src/components/BarChart/index.js");
/* harmony import */ var _components_BigCounter__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../components/BigCounter */ "./assets/src/components/BigCounter/index.js");
/* harmony import */ var _components_WidgetHeader__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../components/WidgetHeader */ "./assets/src/components/WidgetHeader/index.js");
/* harmony import */ var _components_WidgetStates__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../components/WidgetStates */ "./assets/src/components/WidgetStates/index.js");
/* harmony import */ var _ActivityScoresSkeleton__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./ActivityScoresSkeleton */ "./assets/src/widgets/ActivityScores/ActivityScoresSkeleton.js");
/* harmony import */ var _hooks_useApiData__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../hooks/useApiData */ "./assets/src/hooks/useApiData/index.js");
/* harmony import */ var _stores_dashboardStore__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../stores/dashboardStore */ "./assets/src/stores/dashboardStore.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__);
/**
 * ActivityScores Widget
 *
 * Displays the website activity score widget with gauge, bar chart,
 * and personal record.
 */













/**
 * Get the streak message based on the current and max streak values.
 *
 * @param {number} maxStreak     - The maximum streak value.
 * @param {number} currentStreak - The current streak value.
 * @return {string} The streak message.
 */

function getStreakMessage(maxStreak, currentStreak) {
  if (maxStreak === 0) {
    return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('This is the start of your first streak! Add content to your site every week and set a personal record!', 'progress-planner');
  }
  if (maxStreak <= currentStreak) {
    return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.sprintf)(
    // translators: %s: number of weeks.
    (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__._n)("Congratulations! You're on a streak! You've consistently maintained your website for the past %s week! 🎉", "Congratulations! You're on a streak! You've consistently maintained your website for the past %s weeks! 🎉", currentStreak, 'progress-planner'), currentStreak);
  }
  if (currentStreak >= 1) {
    const weeksToGo = maxStreak - currentStreak;
    return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.sprintf)(
    // translators: %1$s: number of weeks for current streak. %2$s: number of weeks for max streak. %3$s: weeks to go.
    (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__._n)("Keep it up! You've consistently maintained your website for the past %1$s week. Your longest streak was %2$s weeks, %3$s more to go to break your record!", "Keep it up! You've consistently maintained your website for the past %1$s weeks. Your longest streak was %2$s weeks, %3$s more to go to break your record!", currentStreak, 'progress-planner'), currentStreak, maxStreak, weeksToGo);
  }
  return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.sprintf)(
  // translators: %s: number of weeks for max streak.
  (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__._n)('Get back to your streak! Your longest streak was %s week. Keep working on those website maintenance tasks every week and break your record!', 'Get back to your streak! Your longest streak was %s weeks. Keep working on those website maintenance tasks every week and break your record!', maxStreak, 'progress-planner'), maxStreak);
}

/**
 * Get the gauge color based on score.
 *
 * @param {number} score - The score value.
 * @return {string} The color CSS variable.
 */
function getGaugeColor(score) {
  if (score >= 75) {
    return 'var(--prpl-graph-color-3)';
  }
  if (score >= 50) {
    return 'var(--prpl-color-monthly)';
  }
  return 'var(--prpl-graph-color-1)';
}

/**
 * Get the color for a chart bar based on value and date label.
 *
 * @param {number} value     - The value for this period.
 * @param {string} label     - The label for this period (e.g., "Jan", "Feb" for monthly, or date string for weekly).
 * @param {string} frequency - The frequency ('monthly' or 'weekly').
 * @return {string} The color CSS variable.
 */
function getChartColor(value, label, frequency) {
  const now = new Date();

  // If monthly and the latest month, return gray (in progress).
  if (frequency === 'monthly') {
    // Chart labels are formatted as 'M' which gives month abbreviations like "Jan", "Feb"
    const currentMonth = now.toLocaleString('default', {
      month: 'short'
    });
    if (label === currentMonth) {
      return 'var(--prpl-color-border)';
    }
  }

  // If weekly and the current week, return gray (in progress).
  if (frequency === 'weekly') {
    // For weekly, labels might be in date format - we'll check if it's the current week
    // by checking if the label represents a date in the current week
    try {
      const labelDate = new Date(label);
      if (!isNaN(labelDate.getTime())) {
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay());
        weekStart.setHours(0, 0, 0, 0);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        weekEnd.setHours(23, 59, 59, 999);
        if (labelDate >= weekStart && labelDate <= weekEnd) {
          return 'var(--prpl-color-border)';
        }
      }
    } catch (e) {
      // If label parsing fails, continue with value-based colors
    }
  }

  // Value-based colors
  if (value > 90) {
    return 'var(--prpl-graph-color-3)';
  }
  if (value > 30) {
    return 'var(--prpl-color-monthly)';
  }
  return 'var(--prpl-graph-color-1)';
}

/**
 * ActivityScores component.
 *
 * @param {Object} props        - Component props.
 * @param {Object} props.config - Widget configuration.
 * @return {JSX.Element} The ActivityScores component.
 */
function ActivityScores({
  config = {}
}) {
  // Get session points from Zustand store for real-time updates.
  const sessionPoints = (0,_stores_dashboardStore__WEBPACK_IMPORTED_MODULE_10__.useDashboardStore)(state => state.sessionPoints);
  const range = '-6 months';
  const frequency = 'monthly';
  const apiPath = `/progress-planner/v1/widgets/activity-scores?range=${encodeURIComponent(range)}&frequency=${encodeURIComponent(frequency)}`;
  const {
    isLoading,
    error,
    data
  } = (0,_hooks_useApiData__WEBPACK_IMPORTED_MODULE_9__.useApiData)(apiPath, [], 'Failed to load activity data');

  // Get title - defined early for use in loading state.
  const widgetTitle = config?.title || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Your website activity score', 'progress-planner');

  // Calculate effective score by adding session points to API score.
  const effectiveScore = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    if (!data?.score) {
      return 0;
    }
    // Cap at 100 since it's a percentage.
    return Math.min(100, data.score + sessionPoints);
  }, [data?.score, sessionPoints]);
  if (isLoading) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.Fragment, {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_components_WidgetHeader__WEBPACK_IMPORTED_MODULE_6__["default"], {
        title: widgetTitle
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_ActivityScoresSkeleton__WEBPACK_IMPORTED_MODULE_8__["default"], {})]
    });
  }
  if (error) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_components_WidgetStates__WEBPACK_IMPORTED_MODULE_7__.ErrorState, {
      message: error,
      simple: true
    });
  }
  if (!data) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_components_WidgetStates__WEBPACK_IMPORTED_MODULE_7__.EmptyState, {});
  }
  const {
    chartData,
    personalRecord
  } = data;
  const gaugeColor = getGaugeColor(effectiveScore);

  // Add colors to chart data (presentation logic in React).
  const chartDataWithColors = chartData.map(item => ({
    ...item,
    color: getChartColor(item.score, item.label, frequency)
  }));
  const streakMessage = getStreakMessage(personalRecord.maxStreak, personalRecord.currentStreak);

  // Get info icon SVG - will come from widget registry metadata.
  const infoIconSvg = config?.infoIconSvg || '';
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_components_WidgetHeader__WEBPACK_IMPORTED_MODULE_6__["default"], {
      title: widgetTitle,
      infoIconSvg: infoIconSvg,
      tooltipContent: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Your website activity score is based on the amount of website maintenance work you have done over the past 30 days.', 'progress-planner')
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("div", {
      style: {
        '--background': 'var(--prpl-background-monthly)'
      },
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_components_Gauge__WEBPACK_IMPORTED_MODULE_3__["default"], {
        value: effectiveScore,
        max: 100,
        backgroundColor: "var(--prpl-background-activity)",
        color: gaugeColor,
        color2: gaugeColor,
        contentFontSize: "var(--prpl-font-size-6xl)",
        children: effectiveScore
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("hr", {}), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("p", {
      children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Check out your website activity in the past months:', 'progress-planner')
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("div", {
      className: "prpl-graph-wrapper",
      style: {
        maxHeight: '300px'
      },
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_components_BarChart__WEBPACK_IMPORTED_MODULE_4__["default"], {
        data: chartDataWithColors
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("hr", {}), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_components_BigCounter__WEBPACK_IMPORTED_MODULE_5__["default"], {
      number: String(personalRecord.maxStreak),
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('personal record', 'progress-planner'),
      backgroundColor: "var(--prpl-background-activity)"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("div", {
      className: "prpl-widget-content",
      children: streakMessage
    })]
  });
}

// Register widget via hook with metadata
(0,_wordpress_hooks__WEBPACK_IMPORTED_MODULE_2__.doAction)('prpl.dashboard.registerWidget', {
  id: 'activity-scores',
  component: ActivityScores,
  priority: 4,
  width: 1,
  forceLastColumn: false,
  title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Your website activity score', 'progress-planner'),
  infoIconSvg: '' // Can be fetched from REST API if needed for branding
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ActivityScores);

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
/******/ var __webpack_exports__ = (__webpack_exec__("./assets/src/widgets/ActivityScores/index.js"));
/******/ }
]);
//# sourceMappingURL=widget-activity-scores.js.map