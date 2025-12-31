"use strict";
(globalThis["webpackChunkprogress_planner"] = globalThis["webpackChunkprogress_planner"] || []).push([["widget-whats-new"],{

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

/***/ "./assets/src/widgets/WhatsNew/WhatsNewSkeleton.js":
/*!*********************************************************!*\
  !*** ./assets/src/widgets/WhatsNew/WhatsNewSkeleton.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ WhatsNewSkeleton)
/* harmony export */ });
/* harmony import */ var _components_Skeleton__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../components/Skeleton */ "./assets/src/components/Skeleton/index.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);
/**
 * WhatsNew Skeleton Component
 *
 * Skeleton loading state for the WhatsNew widget.
 */



/**
 * PostItemSkeleton component - skeleton for a single blog post.
 *
 * @param {Object}  props           - Component props.
 * @param {boolean} props.showImage - Whether to show image placeholder.
 * @return {JSX.Element} The PostItemSkeleton component.
 */

function PostItemSkeleton({
  showImage = true
}) {
  const titleStyle = {
    marginTop: 0,
    marginBottom: '6px'
  };
  const excerptStyle = {
    margin: 0
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("li", {
    children: [showImage && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components_Skeleton__WEBPACK_IMPORTED_MODULE_0__.SkeletonRect, {
      width: "100%",
      height: "120px",
      style: {
        aspectRatio: '3 / 2',
        marginBottom: '0.75rem',
        borderRadius: 'var(--prpl-border-radius-big)'
      }
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
      style: titleStyle,
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components_Skeleton__WEBPACK_IMPORTED_MODULE_0__.SkeletonRect, {
        width: "85%",
        height: "var(--prpl-font-size-lg)"
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
      style: excerptStyle,
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components_Skeleton__WEBPACK_IMPORTED_MODULE_0__.SkeletonText, {
        lines: 2
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("hr", {})]
  });
}

/**
 * WhatsNewSkeleton component.
 *
 * @param {Object} props       - Component props.
 * @param {number} props.posts - Number of post skeletons to show.
 * @return {JSX.Element} The WhatsNewSkeleton component.
 */
function WhatsNewSkeleton({
  posts = 2
}) {
  const listStyle = {
    listStyle: 'none',
    padding: 0,
    margin: 0
  };
  const footerStyle = {
    display: 'flex',
    justifyContent: 'flex-end'
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("ul", {
      style: listStyle,
      children: Array.from({
        length: posts
      }).map((_, i) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(PostItemSkeleton, {
        showImage: i === 0
      }, i))
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
      style: footerStyle,
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components_Skeleton__WEBPACK_IMPORTED_MODULE_0__.SkeletonRect, {
        width: "6rem",
        height: "1rem"
      })
    })]
  });
}

/***/ }),

/***/ "./assets/src/widgets/WhatsNew/index.js":
/*!**********************************************!*\
  !*** ./assets/src/widgets/WhatsNew/index.js ***!
  \**********************************************/
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
/* harmony import */ var _hooks_useApiData__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../hooks/useApiData */ "./assets/src/hooks/useApiData/index.js");
/* harmony import */ var _components_WidgetHeader__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../components/WidgetHeader */ "./assets/src/components/WidgetHeader/index.js");
/* harmony import */ var _WhatsNewSkeleton__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./WhatsNewSkeleton */ "./assets/src/widgets/WhatsNew/WhatsNewSkeleton.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__);
/**
 * What's New Widget Component.
 *
 * Displays blog posts from the Progress Planner blog RSS feed.
 */








/**
 * BlogPostImage component with hover state.
 *
 * @param {Object} props      - Component props.
 * @param {string} props.link - Link URL.
 * @param {string} props.url  - Image URL.
 * @return {JSX.Element} The blog post image.
 */

function BlogPostImage({
  link,
  url
}) {
  const [isHovered, setIsHovered] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const baseStyle = {
    width: '100%',
    minHeight: '120px',
    aspectRatio: '3 / 2',
    backgroundSize: 'cover',
    marginBottom: '0.75rem',
    borderRadius: 'var(--prpl-border-radius-big)',
    border: '1px solid var(--prpl-color-border)',
    backgroundColor: 'var(--prpl-color-gauge-remain)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    backgroundImage: `url(${url})`
  };
  const hoverStyle = isHovered ? {
    transform: 'scale(1.01)',
    boxShadow: '4px 4px 8px 0 rgba(0, 0, 0, 0.2)'
  } : {};
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("a", {
    href: link,
    target: "_blank",
    rel: "noopener noreferrer",
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
      className: "prpl-blog-post-image",
      style: {
        ...baseStyle,
        ...hoverStyle
      },
      onMouseEnter: () => setIsHovered(true),
      onMouseLeave: () => setIsHovered(false)
    })
  });
}

/**
 * PostTitleLink component with hover state.
 *
 * @param {Object} props          - Component props.
 * @param {string} props.link     - Link URL.
 * @param {string} props.children - Link text.
 * @return {JSX.Element} The post title link.
 */
function PostTitleLink({
  link,
  children
}) {
  const [isHovered, setIsHovered] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const style = {
    color: isHovered ? 'var(--prpl-color-link)' : 'var(--prpl-color-headings)',
    textDecoration: isHovered ? 'underline' : 'none'
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("a", {
    href: link,
    target: "_blank",
    rel: "noopener noreferrer",
    style: style,
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
    children: children
  });
}

/**
 * FooterLink component with hover state.
 *
 * @param {Object} props          - Component props.
 * @param {string} props.link     - Link URL.
 * @param {string} props.children - Link text.
 * @return {JSX.Element} The footer link.
 */
function FooterLink({
  link,
  children
}) {
  const [isHovered, setIsHovered] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const style = {
    color: isHovered ? 'var(--prpl-color-link-hover)' : 'var(--prpl-color-link)',
    textDecoration: isHovered ? 'none' : 'underline'
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("a", {
    href: link,
    target: "_blank",
    rel: "noopener noreferrer",
    style: style,
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
    children: children
  });
}

/**
 * What's New widget component.
 *
 * @param {Object} props        - Component props.
 * @param {Object} props.config - Widget configuration.
 * @return {JSX.Element|null} The widget component or null if no posts.
 */
function WhatsNew({
  config = {}
}) {
  const {
    isLoading,
    data
  } = (0,_hooks_useApiData__WEBPACK_IMPORTED_MODULE_3__.useApiData)('/progress-planner/v1/widgets/whats-new');

  // Get title - will come from widget registry metadata
  const widgetTitle = config?.title || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("What's new on the Progress Planner blog", 'progress-planner');

  // Show loading state.
  if (isLoading) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_components_WidgetHeader__WEBPACK_IMPORTED_MODULE_4__["default"], {
        title: widgetTitle
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("hr", {}), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_WhatsNewSkeleton__WEBPACK_IMPORTED_MODULE_5__["default"], {
        posts: 2
      })]
    });
  }

  // Extract data
  const posts = data?.posts || [];
  const blogUrl = data?.blogUrl || '';

  // Return null if no posts (widget should not render content).
  if (posts.length === 0) {
    return null;
  }

  // Inline styles.
  const listStyle = {
    listStyle: 'none',
    padding: 0,
    margin: 0
  };
  const titleStyle = {
    marginTop: 0,
    fontSize: 'var(--prpl-font-size-lg)',
    lineHeight: 1.25,
    fontWeight: 600,
    marginBottom: '6px'
  };
  const excerptStyle = {
    margin: 0
  };
  const footerStyle = {
    display: 'flex',
    justifyContent: 'flex-end'
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_components_WidgetHeader__WEBPACK_IMPORTED_MODULE_4__["default"], {
      title: widgetTitle
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("hr", {}), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("ul", {
      style: listStyle,
      children: posts.map((post, index) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("li", {
        children: [post.imageUrl && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(BlogPostImage, {
          link: post.link,
          url: post.imageUrl
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("h3", {
          style: titleStyle,
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(PostTitleLink, {
            link: post.link,
            children: post.title
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("p", {
          style: excerptStyle,
          children: post.excerpt
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("hr", {})]
      }, index))
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
      className: "prpl-widget-footer",
      style: footerStyle,
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(FooterLink, {
        link: blogUrl,
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Read all posts', 'progress-planner')
      })
    })]
  });
}

// Register widget via hook with metadata
(0,_wordpress_hooks__WEBPACK_IMPORTED_MODULE_2__.doAction)('prpl.dashboard.registerWidget', {
  id: 'whats-new',
  component: WhatsNew,
  priority: 10,
  width: 1,
  forceLastColumn: false,
  title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("What's new on the Progress Planner blog", 'progress-planner'),
  infoIconSvg: '' // Can be fetched from REST API if needed for branding
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (WhatsNew);

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
/******/ var __webpack_exports__ = (__webpack_exec__("./assets/src/widgets/WhatsNew/index.js"));
/******/ }
]);
//# sourceMappingURL=widget-whats-new.js.map