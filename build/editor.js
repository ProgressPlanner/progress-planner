"use strict";
(globalThis["webpackChunkprogress_planner"] = globalThis["webpackChunkprogress_planner"] || []).push([["editor"],{

/***/ "./assets/src/editor/components/Checklist.js":
/*!***************************************************!*\
  !*** ./assets/src/editor/components/Checklist.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Checklist)
/* harmony export */ });
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _ChecklistItem__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ChecklistItem */ "./assets/src/editor/components/ChecklistItem.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__);
/**
 * Render the todo items.
 *
 * @param {Object} props               Component props.
 * @param {Object} props.lessonSection The lesson section.
 * @param {string} props.pageTodos     Comma-separated list of completed todo IDs.
 * @return {JSX.Element} Element to render.
 */



function Checklist({
  lessonSection,
  pageTodos
}) {
  if (!lessonSection.todos) {
    return null;
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.Fragment, {
    children: lessonSection.todos.map(toDoGroup => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.PanelBody, {
      title: toDoGroup.group_heading,
      initialOpen: false,
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
        children: toDoGroup.group_todos.map(item => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_ChecklistItem__WEBPACK_IMPORTED_MODULE_1__["default"], {
          item: item,
          pageTodos: pageTodos
        }, item.id))
      })
    }, `progress-planner-sidebar-lesson-section-${toDoGroup.group_heading}`))
  });
}

/***/ }),

/***/ "./assets/src/editor/components/ChecklistItem.js":
/*!*******************************************************!*\
  !*** ./assets/src/editor/components/ChecklistItem.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ChecklistItem)
/* harmony export */ });
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__);
/**
 * Render a single todo item with its checkbox.
 *
 * @param {Object} props           Component props.
 * @param {Object} props.item      The todo item.
 * @param {string} props.pageTodos Comma-separated list of completed todo IDs.
 * @return {JSX.Element} Element to render.
 */



function ChecklistItem({
  item,
  pageTodos
}) {
  const {
    editPost
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.useDispatch)('core/editor');
  const handleChange = checked => {
    const toDos = (pageTodos || '').split(',').filter(id => id); // Remove empty strings
    if (checked) {
      if (!toDos.includes(item.id)) {
        toDos.push(item.id);
      }
    } else {
      const index = toDos.indexOf(item.id);
      if (index > -1) {
        toDos.splice(index, 1);
      }
    }
    // Update the `progress_planner_page_todos` meta value.
    editPost({
      meta: {
        progress_planner_page_todos: toDos.join(',')
      }
    });
  };
  const isChecked = (pageTodos || '').split(',').filter(id => id).includes(item.id);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.CheckboxControl, {
      checked: isChecked,
      label: item.todo_name,
      className: item.todo_required ? 'progress-planner-todo-item required' : 'progress-planner-todo-item',
      help: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
        dangerouslySetInnerHTML: {
          __html: item.todo_description
        }
      }),
      onChange: handleChange
    })
  });
}

/***/ }),

/***/ "./assets/src/editor/components/LessonItems.js":
/*!*****************************************************!*\
  !*** ./assets/src/editor/components/LessonItems.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ LessonItems)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _utils_getPageTypeSlugFromId__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/getPageTypeSlugFromId */ "./assets/src/editor/utils/getPageTypeSlugFromId.js");
/* harmony import */ var _SectionHTML__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./SectionHTML */ "./assets/src/editor/components/SectionHTML.js");
/* harmony import */ var _SectionVideo__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./SectionVideo */ "./assets/src/editor/components/SectionVideo.js");
/* harmony import */ var _TodoProgress__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./TodoProgress */ "./assets/src/editor/components/TodoProgress.js");
/* harmony import */ var _Checklist__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./Checklist */ "./assets/src/editor/components/Checklist.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__);
/**
 * Render the lesson items.
 *
 * @param {Object} props                 Component props.
 * @param {Array}  props.lessons         Array of lesson objects.
 * @param {Array}  props.pageTypes       Array of page type objects.
 * @param {number} props.defaultPageType Default page type ID.
 * @return {JSX.Element} Element to render.
 */









const TAXONOMY = 'progress_planner_page_types';
function LessonItems({
  lessons,
  pageTypes,
  defaultPageType
}) {
  const pageTypeID = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.useSelect)(select => select('core/editor').getEditedPostAttribute(TAXONOMY));
  const pageTodosMeta = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.useSelect)(select => {
    const meta = select('core/editor').getEditedPostAttribute('meta');
    return meta ? meta.progress_planner_page_todos : '';
  }, []);
  const pageTodos = pageTodosMeta || '';
  const pageType = (0,_utils_getPageTypeSlugFromId__WEBPACK_IMPORTED_MODULE_3__.getPageTypeSlugFromId)(pageTypeID, pageTypes, defaultPageType);

  // Bail early if the page type or lessons are not set.
  if (!pageType || !lessons || 0 === lessons.length) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("div", {});
  }
  const lesson = lessons.find(lessonItem => lessonItem.settings.id === pageType);
  if (!lesson) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("div", {});
  }

  // Create a copy of the lesson to avoid mutating the original
  const lessonCopy = {
    ...lesson
  };
  if (lessonCopy.content_update_cycle?.text) {
    lessonCopy.content_update_cycle.text = lessonCopy.content_update_cycle.text.replace(/\{page_type\}/g, lessonCopy.name).replace(/\{update_cycle\}/g, lessonCopy.content_update_cycle.update_cycle);
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_SectionHTML__WEBPACK_IMPORTED_MODULE_4__["default"], {
      lesson: lessonCopy,
      sectionId: "content_update_cycle",
      wrapperEl: "div"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_SectionHTML__WEBPACK_IMPORTED_MODULE_4__["default"], {
      lesson: lessonCopy,
      sectionId: "intro",
      wrapperEl: _wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody
    }), lessonCopy.checklist ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: lessonCopy.checklist.heading,
      initialOpen: false,
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("div", {
        children: [lessonCopy.checklist.video ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_SectionVideo__WEBPACK_IMPORTED_MODULE_5__["default"], {
          lessonSection: lessonCopy.checklist
        }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("div", {}), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_TodoProgress__WEBPACK_IMPORTED_MODULE_6__["default"], {
          lessonSection: lessonCopy.checklist,
          pageTodos: pageTodos
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_Checklist__WEBPACK_IMPORTED_MODULE_7__["default"], {
          lessonSection: lessonCopy.checklist,
          pageTodos: pageTodos
        })]
      })
    }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("div", {}), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_SectionHTML__WEBPACK_IMPORTED_MODULE_4__["default"], {
      lesson: lessonCopy,
      sectionId: "writers_block",
      wrapperEl: _wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody
    })]
  });
}

/***/ }),

/***/ "./assets/src/editor/components/PageTypeSelector.js":
/*!**********************************************************!*\
  !*** ./assets/src/editor/components/PageTypeSelector.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PageTypeSelector)
/* harmony export */ });
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);
/**
 * Render a dropdown to select the page-type.
 *
 * @param {Object} props                 Component props.
 * @param {Array}  props.pageTypes       Array of page type objects.
 * @param {number} props.defaultPageType Default page type ID.
 * @return {JSX.Element} Element to render.
 */




const TAXONOMY = 'progress_planner_page_types';
function PageTypeSelector({
  pageTypes,
  defaultPageType
}) {
  // Hooks must be called before any early returns.
  const currentPageType = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.useSelect)(select => {
    const pageTypeArr = select('core/editor').getEditedPostAttribute(TAXONOMY);
    return pageTypeArr && 0 < pageTypeArr.length ? parseInt(pageTypeArr[0]) : parseInt(defaultPageType);
  }, [defaultPageType]);
  const {
    editPost
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.useDispatch)('core/editor');

  // Bail early if the page types are not set.
  if (!pageTypes || 0 === pageTypes.length) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {});
  }

  // Build the page types array, to be used in the dropdown.
  const pageTypeOptions = pageTypes.map(term => ({
    label: term.title,
    value: term.id
  }));
  const handleChange = value => {
    // Update the TAXONOMY term value.
    const data = {};
    data[TAXONOMY] = value;
    editPost(data);
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.SelectControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Page type', 'progress-planner'),
    value: currentPageType,
    options: pageTypeOptions,
    onChange: handleChange
  });
}

/***/ }),

/***/ "./assets/src/editor/components/PostStatus.js":
/*!****************************************************!*\
  !*** ./assets/src/editor/components/PostStatus.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PostStatus)
/* harmony export */ });
/* harmony import */ var _wordpress_edit_post__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/edit-post */ "@wordpress/edit-post");
/* harmony import */ var _wordpress_edit_post__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_edit_post__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _ProgressPlannerIcon__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./ProgressPlannerIcon */ "./assets/src/editor/components/ProgressPlannerIcon.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__);
/**
 * Render the Progress Planner post status.
 *
 * @return {JSX.Element} Element to render.
 */






function PostStatus() {
  const {
    openGeneralSidebar
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_2__.useDispatch)('core/edit-post');
  const handleClick = () => {
    openGeneralSidebar('progress-planner-sidebar/progress-planner-sidebar');
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_edit_post__WEBPACK_IMPORTED_MODULE_0__.PluginPostStatusInfo, {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
        icon: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_ProgressPlannerIcon__WEBPACK_IMPORTED_MODULE_4__["default"], {}),
        style: {
          width: '100%',
          margin: '15px 0',
          color: '#38296D',
          boxShadow: 'inset 0 0 0 1px #38296D',
          fontWeight: 'bold'
        },
        variant: "secondary",
        href: "#",
        onClick: handleClick,
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Progress Planner', 'progress-planner')
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_edit_post__WEBPACK_IMPORTED_MODULE_0__.PluginPostStatusInfo, {})]
  });
}

/***/ }),

/***/ "./assets/src/editor/components/ProgressPlannerIcon.js":
/*!*************************************************************!*\
  !*** ./assets/src/editor/components/ProgressPlannerIcon.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ProgressPlannerIcon)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);

/**
 * SVG Icon Component.
 *
 * @return {JSX.Element} The icon element.
 */
function ProgressPlannerIcon() {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("svg", {
    role: "img",
    className: "progress-planner-icon",
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 500 500",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", {
      id: "path1",
      stroke: "none",
      d: "M 283.460022 172.899994 C 286.670013 173.02002 289.429993 174.640015 291.190002 177.049988 C 289.320007 166.809998 280.550018 158.880005 269.710022 158.48999 C 257.190002 158.039978 246.679993 167.820007 246.229996 180.339996 C 245.779999 192.859985 255.559998 203.369995 268.080017 203.820007 C 277.480011 204.160004 285.75 198.720001 289.480011 190.690002 C 287.649994 192.200012 285.300018 193.109985 282.740021 193.02002 C 277.190002 192.820007 272.850006 188.160004 273.050018 182.609985 C 273.25 177.059998 277.910004 172.720001 283.460022 172.919983 Z M 307.51001 305.839996 C 308.089996 307.76001 308.640015 309.700012 309.240021 311.609985 C 323.279999 356.579987 343.179993 400.359985 365.660004 435.880005 L 433.410004 305.839996 L 307.51001 305.839996 Z M 363.959991 205.970001 C 376.079987 201.470001 387.5 198.789978 397.600006 197.01001 C 375.089996 174.73999 336.359985 169.950012 336.130005 169.919983 C 337.399994 176.089996 336.709991 185.720001 333.690002 196.380005 C 330.390015 208.039978 324.309998 220.919983 314.990021 231.859985 C 311.540009 235.919983 307.630005 239.690002 303.26001 243.049988 L 303.330017 243.049988 L 303.330017 243.039978 C 303.490021 243.660004 303.710022 244.240005 303.910004 244.830002 C 306.649994 253.100006 312.52002 258.570007 318.839996 261.970001 C 325.320007 265.459991 332.209991 266.799988 336.519989 266.799988 C 342.920013 266.799988 348.399994 263.01001 350.950012 257.579987 C 351.920013 255.520004 352.5 253.25 352.5 250.820007 C 352.5 246.970001 351.079987 243.47998 348.809998 240.720001 C 346.890015 238.390015 344.350006 236.640015 341.420013 235.690002 L 386.23999 227.039978 C 379.609985 220.919983 371.519989 215.450012 363.51001 210.809998 C 361.540009 209.669983 361.820007 206.76001 363.959991 205.970001 Z"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", {
      id: "path2",
      stroke: "none",
      d: "M 347.369995 458.369995 C 321.579987 419.529999 298.690002 370.329987 282.919983 319.829987 C 281.470001 315.200012 280.089996 310.519989 278.75 305.839996 C 277.630005 301.899994 276.529999 297.959991 275.5 294.040009 C 273.410004 286.119995 266.220001 280.579987 258.019989 280.579987 L 230.070007 280.579987 C 221.869995 280.579987 214.679993 286.109985 212.589996 294.029999 C 210.309998 302.679993 207.809998 311.350006 205.169998 319.820007 C 189.399994 370.320007 166.519989 419.519989 140.720001 458.359985 C 136.709991 464.390015 138.940002 469.98999 140.080002 472.119995 C 142.479996 476.589996 146.940002 479.26001 152.019989 479.26001 L 218.029999 479.26001 L 222 486.179993 C 226.539993 494.079987 234.990005 498.98999 244.050003 498.98999 C 253.110001 498.98999 261.559998 494.079987 266.109985 486.179993 L 270.089996 479.26001 L 336.089996 479.26001 C 339.309998 479.26001 342.279999 478.179993 344.640015 476.23999 C 345.98999 475.130005 347.149994 473.75 348.019989 472.109985 C 348.589996 471.040009 349.440002 469.089996 349.630005 466.649994 C 349.820007 464.23999 349.369995 461.339996 347.380005 458.339996 Z"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", {
      id: "path3",
      stroke: "none",
      d: "M 361.700012 76.059998 C 354.160004 64.01001 329.320007 77.059998 302.160004 78.919983 C 287.119995 79.950012 265.110016 -31.710022 230.389999 21.929993 C 190.830002 83.029999 151.270004 -22.75 141.730011 6.100006 C 120.620003 49.369995 166.880005 90.709991 166.880005 90.709991 C 166.880005 90.709991 154.040009 98.630005 146.25 104.640015 C 140.779999 108.809998 135.430008 113.290009 130.220001 118.149994 C 109.770004 137.179993 94.18 158.470001 83.450005 182.01001 C 72.720001 205.549988 67.110001 229.589996 66.620003 254.149994 C 66.129997 278.709991 70.629997 303.25 80.160004 327.779999 C 89.68 352.309998 104.330002 375.200012 124.110001 396.459991 C 128.130005 400.779999 132.230011 404.869995 136.419998 408.76001 C 140.520004 402.450012 144.389999 396.019989 148.059998 389.5 C 152.449997 381.700012 156.559998 373.779999 160.309998 365.720001 C 159.980011 365.369995 159.650009 365.029999 159.320007 364.690002 C 159.150009 364.51001 158.980011 364.339996 158.809998 364.160004 C 143.279999 347.470001 131.639999 329.570007 123.880005 310.440002 C 116.110001 291.309998 112.380005 272.190002 112.68 253.080002 C 112.970001 233.97998 117.150002 215.399994 125.209999 197.359985 C 133.270004 179.309998 145.230011 162.910004 161.110001 148.140015 C 175.100006 135.119995 189.949997 125.309998 205.660004 118.730011 C 221.360001 112.140015 237.289993 108.75 253.419998 108.549988 C 262.470001 108.440002 272.529999 109.700012 282.929993 113.049988 C 293.25 117.320007 302.149994 122.48999 309.559998 128.399994 C 319.75 136.529999 327.170013 146.049988 331.779999 156.5 C 333.690002 160.820007 335.149994 165.299988 336.100006 169.910004 C 352.369995 141.640015 372.850006 93.950012 361.670013 76.080017 Z"
    })]
  });
}

/***/ }),

/***/ "./assets/src/editor/components/ProgressPlannerSidebar.js":
/*!****************************************************************!*\
  !*** ./assets/src/editor/components/ProgressPlannerSidebar.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ProgressPlannerSidebar)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_edit_post__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/edit-post */ "@wordpress/edit-post");
/* harmony import */ var _wordpress_edit_post__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_edit_post__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _ProgressPlannerIcon__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ProgressPlannerIcon */ "./assets/src/editor/components/ProgressPlannerIcon.js");
/* harmony import */ var _PageTypeSelector__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./PageTypeSelector */ "./assets/src/editor/components/PageTypeSelector.js");
/* harmony import */ var _LessonItems__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./LessonItems */ "./assets/src/editor/components/LessonItems.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__);
/**
 * Render the Progress Planner sidebar.
 * This sidebar will display the lessons and videos for the current page.
 *
 * @param {Object} props                 Component props.
 * @param {Array}  props.lessons         Array of lesson objects.
 * @param {Array}  props.pageTypes       Array of page type objects.
 * @param {number} props.defaultPageType Default page type ID.
 * @return {JSX.Element} Element to render.
 */







function ProgressPlannerSidebar({
  lessons,
  pageTypes,
  defaultPageType
}) {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_edit_post__WEBPACK_IMPORTED_MODULE_1__.PluginSidebarMoreMenuItem, {
      target: "progress-planner-sidebar",
      children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Progress Planner Sidebar', 'progress-planner')
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_edit_post__WEBPACK_IMPORTED_MODULE_1__.PluginSidebar, {
      name: "progress-planner-sidebar",
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Progress Planner Sidebar', 'progress-planner'),
      icon: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_ProgressPlannerIcon__WEBPACK_IMPORTED_MODULE_3__["default"], {}),
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
        style: {
          padding: '15px',
          borderBottom: '1px solid #ddd'
        },
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_PageTypeSelector__WEBPACK_IMPORTED_MODULE_4__["default"], {
          pageTypes: pageTypes,
          defaultPageType: defaultPageType
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_LessonItems__WEBPACK_IMPORTED_MODULE_5__["default"], {
          lessons: lessons,
          pageTypes: pageTypes,
          defaultPageType: defaultPageType
        })]
      })
    })]
  });
}

/***/ }),

/***/ "./assets/src/editor/components/SectionHTML.js":
/*!*****************************************************!*\
  !*** ./assets/src/editor/components/SectionHTML.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ SectionHTML)
/* harmony export */ });
/* harmony import */ var _SectionVideo__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SectionVideo */ "./assets/src/editor/components/SectionVideo.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);
/**
 * Render HTML content sections.
 *
 * @param {Object}          props           Component props.
 * @param {Object}          props.lesson    The lesson object.
 * @param {string}          props.sectionId The section ID to render.
 * @param {string|Function} props.wrapperEl The wrapper element (default: 'div').
 * @return {JSX.Element} Element to render.
 */


function SectionHTML({
  lesson,
  sectionId,
  wrapperEl = 'div'
}) {
  if (!lesson || !lesson[sectionId]) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {});
  }
  const section = lesson[sectionId];
  const Wrapper = typeof wrapperEl === 'string' ? wrapperEl : wrapperEl;
  const wrapperProps = typeof wrapperEl === 'string' ? {} : {
    title: section.heading,
    initialOpen: false
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(Wrapper, {
    ...wrapperProps,
    children: [section.video ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_SectionVideo__WEBPACK_IMPORTED_MODULE_0__["default"], {
      lessonSection: section
    }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {}), section.text ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
      dangerouslySetInnerHTML: {
        __html: section.text
      }
    }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {})]
  });
}

/***/ }),

/***/ "./assets/src/editor/components/SectionVideo.js":
/*!******************************************************!*\
  !*** ./assets/src/editor/components/SectionVideo.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ SectionVideo)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);
/**
 * Render the video section.
 * This will display a button to open a modal with the video.
 *
 * @param {Object} props               Component props.
 * @param {Object} props.lessonSection The lesson section.
 * @return {JSX.Element} Element to render.
 */




function SectionVideo({
  lessonSection
}) {
  const [isOpen, setOpen] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Video', 'progress-planner'),
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
        onClick: openModal,
        icon: "video-alt3",
        variant: "secondary",
        style: {
          width: '100%',
          margin: '15px 0',
          color: '#38296D',
          boxShadow: 'inset 0 0 0 1px #38296D'
        },
        children: lessonSection.video_button_label ? lessonSection.video_button_text : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Watch video', 'progress-planner')
      }), isOpen && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Modal, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Video', 'progress-planner'),
        onRequestClose: closeModal,
        shouldCloseOnClickOutside: true,
        shouldCloseOnEsc: true,
        size: "large",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
            dangerouslySetInnerHTML: {
              __html: lessonSection.video
            }
          })
        })
      })]
    })
  });
}

/***/ }),

/***/ "./assets/src/editor/components/TodoProgress.js":
/*!******************************************************!*\
  !*** ./assets/src/editor/components/TodoProgress.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TodoProgress)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);

/**
 * Render the todo items progressbar.
 *
 * @param {Object} props               Component props.
 * @param {Object} props.lessonSection The lesson section.
 * @param {string} props.pageTodos     Comma-separated list of completed todo IDs.
 * @return {JSX.Element} Element to render.
 */
function TodoProgress({
  lessonSection,
  pageTodos
}) {
  // Get an array of required todo items.
  const requiredToDos = [];
  if (lessonSection.todos) {
    lessonSection.todos.forEach(toDoGroup => {
      toDoGroup.group_todos.forEach(item => {
        if (item.todo_required) {
          requiredToDos.push(item.id);
        }
      });
    });
  }

  // Get an array of completed todo items.
  const completedToDos = (pageTodos || '').split(',').filter(item => item && requiredToDos.includes(item));

  // Get the percentage of completed todo items.
  const percentageComplete = requiredToDos.length > 0 ? Math.round(completedToDos.length / requiredToDos.length * 100) : 0;
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
      style: {
        width: '100%',
        display: 'flex',
        alignItems: 'center'
      },
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
        style: {
          width: '100%',
          backgroundColor: '#e1e3e7',
          height: '15px',
          borderRadius: '5px'
        },
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
          style: {
            width: `${percentageComplete}%`,
            backgroundColor: '#14b8a6',
            height: '15px',
            borderRadius: '5px'
          }
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
        style: {
          margin: '0 5px',
          fontSize: '12px',
          color: '#38296D'
        },
        children: `${percentageComplete}%`
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
      dangerouslySetInnerHTML: {
        __html: window.prplL10nStrings?.checklistProgressDescription || ''
      }
    })]
  });
}

/***/ }),

/***/ "./assets/src/editor/index.js":
/*!************************************!*\
  !*** ./assets/src/editor/index.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_plugins__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/plugins */ "@wordpress/plugins");
/* harmony import */ var _wordpress_plugins__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_plugins__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _components_ProgressPlannerSidebar__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/ProgressPlannerSidebar */ "./assets/src/editor/components/ProgressPlannerSidebar.js");
/* harmony import */ var _components_PostStatus__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/PostStatus */ "./assets/src/editor/components/PostStatus.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);
/**
 * Editor script entry point.
 *
 * Registers WordPress editor plugins for Progress Planner sidebar and post status.
 */




// Get editor configuration from global variable.

const editorConfig = window.progressPlannerEditor || {
  lessons: [],
  pageTypes: [],
  defaultPageType: 0
};

// Register the sidebar plugin.
(0,_wordpress_plugins__WEBPACK_IMPORTED_MODULE_0__.registerPlugin)('progress-planner-sidebar', {
  render: () => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_components_ProgressPlannerSidebar__WEBPACK_IMPORTED_MODULE_1__["default"], {
    lessons: editorConfig.lessons,
    pageTypes: editorConfig.pageTypes,
    defaultPageType: editorConfig.defaultPageType
  })
});

// Register the post status plugin.
(0,_wordpress_plugins__WEBPACK_IMPORTED_MODULE_0__.registerPlugin)('progress-planner-post-status', {
  render: _components_PostStatus__WEBPACK_IMPORTED_MODULE_2__["default"]
});

/***/ }),

/***/ "./assets/src/editor/utils/getPageTypeSlugFromId.js":
/*!**********************************************************!*\
  !*** ./assets/src/editor/utils/getPageTypeSlugFromId.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getPageTypeSlugFromId: () => (/* binding */ getPageTypeSlugFromId)
/* harmony export */ });
/**
 * Get the page type slug from the page type ID.
 *
 * @param {number|string|Array} id              The page type ID.
 * @param {Array}               pageTypes       Array of page type objects.
 * @param {number}              defaultPageType Default page type ID.
 * @return {string|undefined} The page type slug.
 */
function getPageTypeSlugFromId(id, pageTypes, defaultPageType) {
  // Check if `id` is an array.
  if (Array.isArray(id)) {
    id = id.length > 0 ? id[0] : 0;
  } else if (!id) {
    id = 0;
  } else if (typeof id === 'string') {
    id = parseInt(id);
  } else if (typeof id !== 'number') {
    id = 0;
  }
  if (!id) {
    id = parseInt(defaultPageType);
  }
  return pageTypes.find(pageTypeItem => parseInt(pageTypeItem.id) === parseInt(id))?.slug;
}

/***/ }),

/***/ "@wordpress/components":
/*!************************************!*\
  !*** external ["wp","components"] ***!
  \************************************/
/***/ ((module) => {

module.exports = window["wp"]["components"];

/***/ }),

/***/ "@wordpress/data":
/*!******************************!*\
  !*** external ["wp","data"] ***!
  \******************************/
/***/ ((module) => {

module.exports = window["wp"]["data"];

/***/ }),

/***/ "@wordpress/edit-post":
/*!**********************************!*\
  !*** external ["wp","editPost"] ***!
  \**********************************/
/***/ ((module) => {

module.exports = window["wp"]["editPost"];

/***/ }),

/***/ "@wordpress/element":
/*!*********************************!*\
  !*** external ["wp","element"] ***!
  \*********************************/
/***/ ((module) => {

module.exports = window["wp"]["element"];

/***/ }),

/***/ "@wordpress/i18n":
/*!******************************!*\
  !*** external ["wp","i18n"] ***!
  \******************************/
/***/ ((module) => {

module.exports = window["wp"]["i18n"];

/***/ }),

/***/ "@wordpress/plugins":
/*!*********************************!*\
  !*** external ["wp","plugins"] ***!
  \*********************************/
/***/ ((module) => {

module.exports = window["wp"]["plugins"];

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
/******/ var __webpack_exports__ = (__webpack_exec__("./assets/src/editor/index.js"));
/******/ }
]);
//# sourceMappingURL=editor.js.map