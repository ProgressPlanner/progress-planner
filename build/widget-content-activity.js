"use strict";
(globalThis["webpackChunkprogress_planner"] = globalThis["webpackChunkprogress_planner"] || []).push([["widget-content-activity"],{

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

/***/ "./assets/src/components/LineChart/ChartFilters.js":
/*!*********************************************************!*\
  !*** ./assets/src/components/LineChart/ChartFilters.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ChartFilters)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);

/**
 * ChartFilters Component
 *
 * Displays filter checkboxes for toggling chart series visibility.
 */

/**
 * ChartFilters component.
 *
 * @param {Object}   props               - Component props.
 * @param {Object}   props.dataArgs      - Data arguments with color and label per series.
 * @param {string[]} props.visibleSeries - Array of visible series keys.
 * @param {string}   props.filtersLabel  - Optional label to show before filters.
 * @param {Function} props.onToggle      - Callback when a series is toggled.
 * @return {JSX.Element} The ChartFilters component.
 */
function ChartFilters({
  dataArgs,
  visibleSeries,
  filtersLabel,
  onToggle
}) {
  const containerStyle = {
    display: 'flex',
    gap: '1em',
    marginBottom: '1em',
    justifyContent: 'space-between',
    fontSize: '0.85rem'
  };
  const labelStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25em',
    cursor: 'pointer'
  };
  const getCheckboxColorStyle = key => ({
    backgroundColor: visibleSeries.includes(key) ? dataArgs[key].color : 'transparent',
    width: '1em',
    height: '1em',
    borderRadius: '0.25em',
    outline: `1px solid ${dataArgs[key].color}`,
    border: '1px solid #fff'
  });
  const hiddenInputStyle = {
    display: 'none'
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
    className: "prpl-line-chart__filters",
    style: containerStyle,
    children: [filtersLabel && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", {
      className: "prpl-line-chart__filters-label",
      dangerouslySetInnerHTML: {
        __html: filtersLabel
      }
    }), Object.keys(dataArgs).map(key => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("label", {
      htmlFor: `prpl-chart-filter-${key}`,
      className: `prpl-line-chart__filter prpl-line-chart__filter--${key}`,
      style: labelStyle,
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", {
        className: "prpl-line-chart__filter-color",
        style: getCheckboxColorStyle(key)
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", {
        type: "checkbox",
        id: `prpl-chart-filter-${key}`,
        name: key,
        value: key,
        checked: visibleSeries.includes(key),
        onChange: () => onToggle(key),
        style: hiddenInputStyle
      }), dataArgs[key].label]
    }, key))]
  });
}

/***/ }),

/***/ "./assets/src/components/LineChart/index.js":
/*!**************************************************!*\
  !*** ./assets/src/components/LineChart/index.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ LineChart)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _ChartFilters__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ChartFilters */ "./assets/src/components/LineChart/ChartFilters.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__);
/**
 * LineChart Component
 *
 * Displays an SVG line chart with multiple series and filter checkboxes.
 */




/**
 * Default options for the chart.
 */

const DEFAULT_OPTIONS = {
  aspectRatio: 2,
  height: 300,
  axisOffset: 16,
  strokeWidth: 4,
  dataArgs: {},
  axisColor: 'var(--prpl-color-border)',
  rulersColor: 'var(--prpl-color-border)',
  filtersLabel: ''
};

/**
 * LineChart component.
 *
 * @param {Object} props         - Component props.
 * @param {Object} props.data    - Chart data object with series keys.
 * @param {Object} props.options - Chart options.
 * @return {JSX.Element} The LineChart component.
 */
function LineChart({
  data,
  options: propOptions
}) {
  const options = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => ({
    ...DEFAULT_OPTIONS,
    ...propOptions
  }), [propOptions]);
  const [visibleSeries, setVisibleSeries] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(() => Object.keys(options.dataArgs));

  /**
   * Toggle series visibility.
   *
   * @param {string} key - The series key to toggle.
   */
  const toggleSeries = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(key => {
    setVisibleSeries(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
  }, []);

  /**
   * Get the maximum value from visible series data.
   *
   * @return {number} The maximum value.
   */
  const getMaxValue = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    return Object.keys(data).reduce((max, key) => {
      if (visibleSeries.includes(key)) {
        return Math.max(max, data[key].reduce((_max, item) => Math.max(_max, item.score), 0));
      }
      return max;
    }, 0);
  }, [data, visibleSeries]);

  /**
   * Get padded maximum value for axis scaling.
   *
   * @return {number} The padded maximum value.
   */
  const getMaxValuePadded = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    const max = getMaxValue();
    const maxValue = 100 > max && 70 < max ? 100 : max;
    return Math.max(100 === maxValue ? 100 : parseInt(maxValue * 1.1, 10), 1);
  }, [getMaxValue]);

  /**
   * Get the optimal Y-axis step divider (3, 4, or 5).
   *
   * @return {number} The step divider.
   */
  const getYLabelsStepsDivider = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    const maxValuePadded = getMaxValuePadded();
    const stepsRemainders = {
      4: maxValuePadded % 4,
      5: maxValuePadded % 5,
      3: maxValuePadded % 3
    };
    const smallestRemainder = Math.min(...Object.values(stepsRemainders));
    return parseInt(Object.keys(stepsRemainders).find(key => stepsRemainders[key] === smallestRemainder), 10);
  }, [getMaxValuePadded]);

  /**
   * Get Y-axis labels.
   *
   * @return {number[]} Array of Y-axis label values.
   */
  const getYLabels = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    const maxValuePadded = getMaxValuePadded();
    const yLabelsStepsDivider = getYLabelsStepsDivider();
    const yLabelsStep = maxValuePadded / yLabelsStepsDivider;
    const yLabels = [];
    if (100 === maxValuePadded || 15 > maxValuePadded) {
      for (let i = 0; i <= yLabelsStepsDivider; i++) {
        yLabels.push(parseInt(yLabelsStep * i, 10));
      }
    } else {
      for (let i = 0; i <= yLabelsStepsDivider; i++) {
        yLabels.push(Math.min(maxValuePadded, Math.round(yLabelsStep * i)));
      }
    }
    return yLabels;
  }, [getMaxValuePadded, getYLabelsStepsDivider]);

  /**
   * Calculate Y coordinate for a value.
   *
   * @param {number} value - The data value.
   * @return {number} The Y coordinate.
   */
  const calcYCoordinate = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(value => {
    const maxValuePadded = getMaxValuePadded();
    const multiplier = (options.height - options.axisOffset * 2) / options.height;
    const yCoordinate = (maxValuePadded - value * multiplier) * (options.height / maxValuePadded) - options.axisOffset;
    return yCoordinate - options.strokeWidth / 2;
  }, [getMaxValuePadded, options.height, options.axisOffset, options.strokeWidth]);

  /**
   * Get distance between X-axis points.
   *
   * @return {number} The distance.
   */
  const getXDistanceBetweenPoints = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    const firstKey = Object.keys(data)[0];
    if (!firstKey || !data[firstKey]) {
      return 0;
    }
    return Math.round((options.height * options.aspectRatio - 3 * options.axisOffset) / (data[firstKey].length - 1));
  }, [data, options.height, options.aspectRatio, options.axisOffset]);

  // Calculate SVG viewBox dimensions
  const svgWidth = parseInt(options.height * options.aspectRatio + options.axisOffset * 2, 10);
  const svgHeight = parseInt(options.height + options.axisOffset * 2, 10);

  // Get X-axis labels data
  const firstSeriesKey = Object.keys(data)[0];
  const firstSeriesData = firstSeriesKey ? data[firstSeriesKey] : [];
  const dataLength = firstSeriesData.length;
  const labelsXDivider = Math.max(1, Math.round(dataLength / 6));
  const containerStyle = {
    width: '100%'
  };
  const svgContainerStyle = {
    width: '100%'
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
    className: "prpl-line-chart",
    style: containerStyle,
    children: [Object.keys(options.dataArgs).length > 1 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_ChartFilters__WEBPACK_IMPORTED_MODULE_1__["default"], {
      dataArgs: options.dataArgs,
      visibleSeries: visibleSeries,
      filtersLabel: options.filtersLabel,
      onToggle: toggleSeries
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
      className: "prpl-line-chart__svg-container",
      style: svgContainerStyle,
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("svg", {
        className: "prpl-line-chart__svg",
        viewBox: `0 0 ${svgWidth} ${svgHeight}`,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("g", {
          className: "prpl-line-chart__x-axis",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("line", {
            x1: options.axisOffset * 3,
            x2: options.aspectRatio * options.height,
            y1: options.height - options.axisOffset,
            y2: options.height - options.axisOffset,
            stroke: options.axisColor,
            strokeWidth: "1"
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("g", {
          className: "prpl-line-chart__y-axis",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("line", {
            x1: options.axisOffset * 3,
            x2: options.axisOffset * 3,
            y1: options.axisOffset,
            y2: options.height - options.axisOffset,
            stroke: options.axisColor,
            strokeWidth: "1"
          })
        }), firstSeriesData.map((item, index) => {
          const labelXCoordinate = getXDistanceBetweenPoints() * index + options.axisOffset * 2;

          // Only show up to 6 labels
          if (dataLength > 6 && index !== 0 && index % labelsXDivider !== 0) {
            return null;
          }
          return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("g", {
            className: "prpl-line-chart__x-label",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("text", {
              x: labelXCoordinate,
              y: options.height + options.axisOffset,
              children: item.label
            }), index !== 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("line", {
              x1: labelXCoordinate + options.axisOffset,
              x2: labelXCoordinate + options.axisOffset,
              y1: options.axisOffset,
              y2: options.height - options.axisOffset,
              stroke: options.rulersColor,
              strokeWidth: "1"
            })]
          }, `x-label-${index}`);
        }), getYLabels().map((yLabel, index) => {
          const yLabelCoordinate = calcYCoordinate(yLabel);
          return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("g", {
            className: "prpl-line-chart__y-label",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("text", {
              x: "0",
              y: yLabelCoordinate + options.axisOffset / 2,
              children: yLabel
            }), index !== 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("line", {
              x1: options.axisOffset * 3,
              x2: options.aspectRatio * options.height,
              y1: yLabelCoordinate,
              y2: yLabelCoordinate,
              stroke: options.rulersColor,
              strokeWidth: "1"
            })]
          }, `y-label-${index}`);
        }), Object.keys(data).map(key => {
          if (!visibleSeries.includes(key)) {
            return null;
          }
          const points = data[key].map((item, index) => {
            const xCoordinate = options.axisOffset * 3 + getXDistanceBetweenPoints() * index;
            const yCoordinate = calcYCoordinate(item.score);
            return `${xCoordinate},${yCoordinate}`;
          }).join(' ');
          return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("g", {
            className: `prpl-line-chart__series prpl-line-chart__series--${key}`,
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("polyline", {
              fill: "none",
              stroke: options.dataArgs[key]?.color,
              strokeWidth: options.strokeWidth,
              points: points
            })
          }, `series-${key}`);
        })]
      })
    })]
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

/***/ "./assets/src/widgets/ContentActivity/ActivityTable.js":
/*!*************************************************************!*\
  !*** ./assets/src/widgets/ContentActivity/ActivityTable.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ActivityTable)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);
/**
 * ActivityTable Component
 *
 * Displays a table with weekly activity breakdown.
 */



/**
 * ActivityTable component.
 *
 * @param {Object} props                - Component props.
 * @param {Object} props.activityTypes  - Activity types with labels.
 * @param {Object} props.weeklyActivity - Weekly activity counts per type.
 * @param {number} props.totalCount     - Total count of all activities.
 * @return {JSX.Element} The ActivityTable component.
 */

function ActivityTable({
  activityTypes,
  weeklyActivity,
  totalCount
}) {
  const tableStyle = {
    width: '100%',
    marginBottom: '1em',
    borderSpacing: '6px 0'
  };
  const cellStyle = {
    border: 'none',
    padding: '0.5em'
  };
  const bodyCellStyle = {
    ...cellStyle,
    fontWeight: 400
  };
  const centeredCellStyle = {
    ...cellStyle,
    textAlign: 'center'
  };
  const footerCellStyle = {
    ...cellStyle,
    borderTop: '1px solid var(--prpl-color-border)'
  };
  const footerCenteredCellStyle = {
    ...centeredCellStyle,
    borderTop: '1px solid var(--prpl-color-border)'
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("table", {
    className: "prpl-content-activity__table",
    style: tableStyle,
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("thead", {
      className: "prpl-content-activity__table-head",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("tr", {
        className: "prpl-content-activity__table-row",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("th", {
          className: "prpl-content-activity__table-header",
          style: cellStyle,
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Content managed', 'progress-planner')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("th", {
          className: "prpl-content-activity__table-header",
          style: centeredCellStyle,
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Last week', 'progress-planner')
        })]
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("tbody", {
      className: "prpl-content-activity__table-body",
      children: Object.keys(activityTypes).map((key, index) => {
        const rowStyle = {
          backgroundColor: index % 2 === 0 ? 'var(--prpl-background-table)' : 'transparent'
        };
        return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("tr", {
          className: `prpl-content-activity__table-row prpl-content-activity__table-row--${key}`,
          style: rowStyle,
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("th", {
            className: "prpl-content-activity__table-cell",
            style: bodyCellStyle,
            children: activityTypes[key].label
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("td", {
            className: "prpl-content-activity__table-cell",
            style: centeredCellStyle,
            children: weeklyActivity[key] || 0
          })]
        }, key);
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("tfoot", {
      className: "prpl-content-activity__table-foot",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("tr", {
        className: "prpl-content-activity__table-row prpl-content-activity__table-row--total",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("th", {
          className: "prpl-content-activity__table-cell",
          style: footerCellStyle,
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Total', 'progress-planner')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("td", {
          className: "prpl-content-activity__table-cell",
          style: footerCenteredCellStyle,
          children: totalCount
        })]
      })
    })]
  });
}

/***/ }),

/***/ "./assets/src/widgets/ContentActivity/ContentActivitySkeleton.js":
/*!***********************************************************************!*\
  !*** ./assets/src/widgets/ContentActivity/ContentActivitySkeleton.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ContentActivitySkeleton)
/* harmony export */ });
/* harmony import */ var _components_Skeleton__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../components/Skeleton */ "./assets/src/components/Skeleton/index.js");
/* harmony import */ var _components_BigCounter_BigCounterSkeleton__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../components/BigCounter/BigCounterSkeleton */ "./assets/src/components/BigCounter/BigCounterSkeleton.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__);
/**
 * ContentActivity Skeleton Component
 *
 * Skeleton loading state for the ContentActivity widget.
 * Composes: BigCounterSkeleton, chart skeleton, table skeleton
 */




/**
 * LineChartSkeleton component.
 *
 * @return {JSX.Element} The LineChartSkeleton component.
 */

function LineChartSkeleton() {
  const containerStyle = {
    width: '100%',
    height: '200px',
    marginBottom: 'var(--prpl-padding)',
    position: 'relative'
  };

  // Create a simple wavy line using multiple skeleton rects at different heights.
  const points = [40, 60, 45, 75, 50, 80];
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
    style: containerStyle,
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_components_Skeleton__WEBPACK_IMPORTED_MODULE_0__.SkeletonRect, {
      width: "100%",
      height: "100%",
      style: {
        opacity: 0.3,
        borderRadius: 'var(--prpl-border-radius)'
      }
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
      style: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: '20px',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-around',
        padding: '10px'
      },
      children: points.map((height, index) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_components_Skeleton__WEBPACK_IMPORTED_MODULE_0__.SkeletonRect, {
        width: "4px",
        height: `${height}%`,
        style: {
          borderRadius: '2px'
        }
      }, index))
    })]
  });
}

/**
 * ActivityTableSkeleton component.
 *
 * @param {Object} props      - Component props.
 * @param {number} props.rows - Number of rows to show.
 * @return {JSX.Element} The ActivityTableSkeleton component.
 */
function ActivityTableSkeleton({
  rows = 3
}) {
  const tableStyle = {
    width: '100%',
    marginBottom: '1em',
    borderSpacing: '6px 0'
  };
  const cellStyle = {
    border: 'none',
    padding: '0.5em'
  };
  const centeredCellStyle = {
    ...cellStyle,
    textAlign: 'center'
  };
  const footerCellStyle = {
    ...cellStyle,
    borderTop: '1px solid var(--prpl-color-border)'
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("table", {
    style: tableStyle,
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("thead", {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("tr", {
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("th", {
          style: cellStyle,
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_components_Skeleton__WEBPACK_IMPORTED_MODULE_0__.SkeletonRect, {
            width: "8rem",
            height: "1em"
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("th", {
          style: centeredCellStyle,
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_components_Skeleton__WEBPACK_IMPORTED_MODULE_0__.SkeletonRect, {
            width: "5rem",
            height: "1em",
            style: {
              marginLeft: 'auto'
            }
          })
        })]
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("tbody", {
      children: Array.from({
        length: rows
      }).map((_, index) => {
        const rowStyle = {
          backgroundColor: index % 2 === 0 ? 'var(--prpl-background-table)' : 'transparent'
        };
        return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("tr", {
          style: rowStyle,
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("th", {
            style: cellStyle,
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_components_Skeleton__WEBPACK_IMPORTED_MODULE_0__.SkeletonRect, {
              width: `${60 + index * 10 % 30}%`,
              height: "1em"
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("td", {
            style: centeredCellStyle,
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_components_Skeleton__WEBPACK_IMPORTED_MODULE_0__.SkeletonRect, {
              width: "2rem",
              height: "1em",
              style: {
                marginLeft: 'auto'
              }
            })
          })]
        }, index);
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("tfoot", {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("tr", {
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("th", {
          style: footerCellStyle,
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_components_Skeleton__WEBPACK_IMPORTED_MODULE_0__.SkeletonRect, {
            width: "3rem",
            height: "1em"
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("td", {
          style: {
            ...centeredCellStyle,
            borderTop: '1px solid var(--prpl-color-border)'
          },
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_components_Skeleton__WEBPACK_IMPORTED_MODULE_0__.SkeletonRect, {
            width: "2rem",
            height: "1em",
            style: {
              marginLeft: 'auto'
            }
          })
        })]
      })
    })]
  });
}

/**
 * ContentActivitySkeleton component.
 *
 * @return {JSX.Element} The ContentActivitySkeleton component.
 */
function ContentActivitySkeleton() {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
    className: "prpl-content-activity",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
      style: {
        marginBottom: '1rem'
      },
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_components_Skeleton__WEBPACK_IMPORTED_MODULE_0__.SkeletonText, {
        lines: 3
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_components_BigCounter_BigCounterSkeleton__WEBPACK_IMPORTED_MODULE_1__["default"], {
      backgroundColor: "var(--prpl-background-content)"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
      style: {
        marginBottom: 'var(--prpl-padding)'
      },
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(LineChartSkeleton, {})
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(ActivityTableSkeleton, {
      rows: 3
    })]
  });
}

/***/ }),

/***/ "./assets/src/widgets/ContentActivity/index.js":
/*!*****************************************************!*\
  !*** ./assets/src/widgets/ContentActivity/index.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/hooks */ "@wordpress/hooks");
/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_hooks__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _components_BigCounter__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../components/BigCounter */ "./assets/src/components/BigCounter/index.js");
/* harmony import */ var _components_LineChart__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../components/LineChart */ "./assets/src/components/LineChart/index.js");
/* harmony import */ var _ActivityTable__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./ActivityTable */ "./assets/src/widgets/ContentActivity/ActivityTable.js");
/* harmony import */ var _components_WidgetStates__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../components/WidgetStates */ "./assets/src/components/WidgetStates/index.js");
/* harmony import */ var _hooks_useApiData__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../hooks/useApiData */ "./assets/src/hooks/useApiData/index.js");
/* harmony import */ var _components_WidgetHeader__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../components/WidgetHeader */ "./assets/src/components/WidgetHeader/index.js");
/* harmony import */ var _ContentActivitySkeleton__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./ContentActivitySkeleton */ "./assets/src/widgets/ContentActivity/ContentActivitySkeleton.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__);
/**
 * ContentActivity Widget
 *
 * Main widget component for displaying content activity statistics.
 */











/**
 * ContentActivity widget component.
 *
 * @param {Object} props        - Component props.
 * @param {Object} props.config - Widget configuration.
 * @return {JSX.Element} The ContentActivity widget.
 */

function ContentActivity({
  config = {}
}) {
  const range = '-6 months';
  const frequency = 'monthly';
  const apiPath = `/progress-planner/v1/widgets/content-activity?range=${encodeURIComponent(range)}&frequency=${encodeURIComponent(frequency)}`;
  const {
    isLoading,
    error,
    data
  } = (0,_hooks_useApiData__WEBPACK_IMPORTED_MODULE_6__.useApiData)(apiPath, [], (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Failed to load content activity data.', 'progress-planner'));

  // Get title - defined early for use in loading state.
  const widgetTitle = config?.title || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Content activity', 'progress-planner');
  if (isLoading) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.Fragment, {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_components_WidgetHeader__WEBPACK_IMPORTED_MODULE_7__["default"], {
        title: widgetTitle
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_ContentActivitySkeleton__WEBPACK_IMPORTED_MODULE_8__["default"], {})]
    });
  }
  if (error) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_components_WidgetStates__WEBPACK_IMPORTED_MODULE_5__.ErrorState, {
      message: error,
      className: "prpl-content-activity__error"
    });
  }
  if (!data) {
    return null;
  }
  const graphWrapperStyle = {
    marginBottom: 'var(--prpl-padding)'
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("div", {
    className: "prpl-content-activity",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_components_WidgetHeader__WEBPACK_IMPORTED_MODULE_7__["default"], {
      title: widgetTitle
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("p", {
      children: data.i18n?.description || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Here are the updates you made to your content last week. Whether you published something new, updated an existing post, or removed outdated content, it all helps you stay on top of your site!', 'progress-planner')
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_components_BigCounter__WEBPACK_IMPORTED_MODULE_2__["default"], {
      number: data.totalCount,
      label: data.i18n?.piecesOfContentManaged || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('pieces of content managed', 'progress-planner'),
      backgroundColor: "var(--prpl-background-content)"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("div", {
      className: "prpl-graph-wrapper",
      style: graphWrapperStyle,
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_components_LineChart__WEBPACK_IMPORTED_MODULE_3__["default"], {
        data: data.chartData,
        options: data.chartOptions
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_ActivityTable__WEBPACK_IMPORTED_MODULE_4__["default"], {
      activityTypes: data.activityTypes,
      weeklyActivity: data.weeklyActivity,
      totalCount: data.weeklyTotalCount
    })]
  });
}

// Register widget via hook with metadata
(0,_wordpress_hooks__WEBPACK_IMPORTED_MODULE_1__.doAction)('prpl.dashboard.registerWidget', {
  id: 'content-activity',
  component: ContentActivity,
  priority: 5,
  width: 1,
  forceLastColumn: false,
  title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Content activity', 'progress-planner'),
  infoIconSvg: '' // Can be fetched from REST API if needed for branding
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ContentActivity);

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
/******/ var __webpack_exports__ = (__webpack_exec__("./assets/src/widgets/ContentActivity/index.js"));
/******/ }
]);
//# sourceMappingURL=widget-content-activity.js.map