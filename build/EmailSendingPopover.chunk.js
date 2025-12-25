"use strict";
(globalThis["webpackChunkprogress_planner"] = globalThis["webpackChunkprogress_planner"] || []).push([["EmailSendingPopover"],{

/***/ "./assets/src/components/Popovers/EmailSendingPopover.js":
/*!***************************************************************!*\
  !*** ./assets/src/components/Popovers/EmailSendingPopover.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ EmailSendingPopover)
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
 * Email Sending Popover Component.
 *
 * Multi-step popover for testing email sending functionality.
 *
 * @param {Object}   props          Component props.
 * @param {Object}   props.task     The task object.
 * @param {Function} props.onSubmit Callback when form is submitted.
 * @param {Function} props.onClose  Callback when popover is closed.
 * @return {JSX.Element} The popover component.
 */






const STEP_FORM = 'form';
const STEP_RESULT = 'result';
const STEP_ERROR = 'error';
const STEP_SUCCESS = 'success';
const STEP_TROUBLESHOOTING = 'troubleshooting';
function EmailSendingPopover({
  task,
  onSubmit,
  onClose
}) {
  const [currentStep, setCurrentStep] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(STEP_FORM);
  const [emailAddress, setEmailAddress] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const [isSending, setIsSending] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [emailError, setEmailError] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [emailSubject, setEmailSubject] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const [troubleshootingGuideUrl, setTroubleshootingGuideUrl] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const [hasEmailOverride, setHasEmailOverride] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);

  /**
   * Load initial data from REST API.
   * This effect runs once on mount to fetch configuration.
   */
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    // Track if component is still mounted
    let isMounted = true;

    // Fetch config from REST API (lazy-loaded when popover opens)
    _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_2___default()({
      path: '/progress-planner/v1/popover/email-sending-config'
    }).then(response => {
      if (!isMounted) {
        return;
      }
      if (response.email_subject) {
        setEmailSubject(response.email_subject);
      }
      if (response.troubleshooting_guide_url) {
        setTroubleshootingGuideUrl(response.troubleshooting_guide_url);
      }
      if (response.has_email_override !== undefined) {
        setHasEmailOverride(response.has_email_override);
      }
      if (response.default_email) {
        // Only set default email if not already set by WP data store
        setEmailAddress(prev => prev ? prev : response.default_email);
      }
    }).catch(() => {
      if (!isMounted) {
        return;
      }
      // Fallback to defaults on error
      setEmailSubject((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Your Progress Planner test message!', 'progress-planner'));
    });

    // Also try to get current user email from WordPress data store
    const currentUser = window.wp?.data?.select('core')?.getCurrentUser?.();
    if (currentUser?.email) {
      setEmailAddress(currentUser.email);
    }

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, []);

  /**
   * Send test email.
   */
  const sendTestEmail = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(async () => {
    if (!emailAddress) {
      return;
    }
    setIsSending(true);
    setEmailError(null);
    try {
      const taskId = task.slug || task.id || 'sending-email';

      // Use REST API instead of AJAX
      const response = await _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_2___default()({
        path: '/progress-planner/v1/popover/test-email',
        method: 'POST',
        data: {
          email_address: emailAddress,
          task_id: taskId
        }
      });
      if (response.success) {
        setCurrentStep(STEP_RESULT);
      } else {
        setEmailError(response.message || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Unknown error', 'progress-planner'));
        setCurrentStep(STEP_ERROR);
      }
    } catch (err) {
      // Handle WP_Error from REST API
      const errorMessage = err?.message || err?.data?.message || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Unknown error', 'progress-planner');
      setEmailError(errorMessage);
      setCurrentStep(STEP_ERROR);
    } finally {
      setIsSending(false);
    }
  }, [emailAddress, task]);

  /**
   * Handle form submission.
   */
  const handleFormSubmit = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(async e => {
    e.preventDefault();
    await sendTestEmail();
  }, [sendTestEmail]);

  /**
   * Handle result radio change.
   */
  const handleResultChange = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(e => {
    const action = e.target.getAttribute('data-action');
    if (action === 'showSuccess') {
      setCurrentStep(STEP_SUCCESS);
    } else if (action === 'showTroubleshooting') {
      setCurrentStep(STEP_TROUBLESHOOTING);
    }
  }, []);

  /**
   * Handle complete task.
   */
  const handleComplete = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(async () => {
    if (onSubmit) {
      await onSubmit(task.id, task);
    }
  }, [task, onSubmit]);

  /**
   * Open troubleshooting guide.
   */
  const handleOpenTroubleshootingGuide = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    if (troubleshootingGuideUrl) {
      window.open(troubleshootingGuideUrl, '_blank');
    }
    if (onClose) {
      onClose();
    }
  }, [troubleshootingGuideUrl, onClose]);

  // Render current step
  const renderStep = () => {
    switch (currentStep) {
      case STEP_FORM:
        return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.Fragment, {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
            className: "prpl-column prpl-column-content",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("h2", {
              className: "prpl-popover-title",
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Test if your site can send emails', 'progress-planner')
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("p", {
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Your WordPress site sometimes needs to send emails. For example, to reset a password, send a comment notification, or warn you when something breaks. Contact forms also use email.', 'progress-planner')
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("p", {
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('It is important to check if these emails are actually sent. Enter your email address on the right to get a test email.', 'progress-planner')
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
            className: "prpl-column",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("p", {
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Where should we send the test email?', 'progress-planner')
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
              className: "prpl-note",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("span", {
                className: "prpl-note-icon",
                children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("span", {
                  className: "dashicons dashicons-warning"
                })
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("span", {
                className: "prpl-note-text",
                children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('You should get the email in a few minutes. In rare cases, it might take a few hours.', 'progress-planner')
              })]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("form", {
              onSubmit: handleFormSubmit,
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("label", {
                htmlFor: "prpl-sending-email-address",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("span", {
                  className: "screen-reader-text",
                  children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Email address', 'progress-planner')
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("input", {
                  type: "email",
                  id: "prpl-sending-email-address",
                  placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Enter your e-mail address', 'progress-planner'),
                  value: emailAddress,
                  onChange: e => setEmailAddress(e.target.value),
                  disabled: isSending,
                  required: true
                })]
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
                className: "prpl-steps-nav-wrapper",
                children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("button", {
                  type: "submit",
                  className: "prpl-button prpl-button-step",
                  disabled: isSending || !emailAddress,
                  children: isSending ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.Fragment, {
                    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("span", {
                      className: "spinner",
                      style: {
                        visibility: 'visible'
                      }
                    }), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Sending…', 'progress-planner')]
                  }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.Fragment, {
                    children: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Next step', 'progress-planner'), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("span", {
                      className: "dashicons dashicons-arrow-right-alt2"
                    })]
                  })
                })
              })]
            })]
          })]
        });
      case STEP_ERROR:
        return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.Fragment, {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
            className: "prpl-column prpl-column-content",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("h2", {
              className: "prpl-popover-title",
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('We tried to send a test email', 'progress-planner')
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("p", {
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.sprintf)(
              // translators: %1$s is the email subject, %2$s is the email address.
              (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('We just tried to send the email "%1$s" to %2$s, but unfortunately it didn\'t work.', 'progress-planner'), emailSubject, emailAddress)
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
            className: "prpl-column",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
              className: "prpl-note prpl-note-error",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("span", {
                className: "prpl-note-icon",
                children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("span", {
                  className: "dashicons dashicons-warning"
                })
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("span", {
                className: "prpl-note-text",
                children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.sprintf)(
                // translators: %s is the error message.
                (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('The test email did not work. The error message was: %s', 'progress-planner'), emailError || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Unknown error', 'progress-planner'))
              })]
            }), troubleshootingGuideUrl && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("p", {
              children: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('There are a few common reasons why your email might not be sending. Check the', 'progress-planner'), ' ', /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("a", {
                href: troubleshootingGuideUrl,
                target: "_blank",
                rel: "noopener noreferrer",
                children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('troubleshooting guide', 'progress-planner')
              }), ' ', (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('to find out what is causing the issue and how to fix it.', 'progress-planner')]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
              className: "prpl-steps-nav-wrapper",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("button", {
                type: "button",
                className: "prpl-button prpl-button-step",
                onClick: () => setCurrentStep(STEP_FORM),
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("span", {
                  className: "dashicons dashicons-arrow-left-alt2"
                }), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Try again', 'progress-planner')]
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("button", {
                type: "button",
                className: "prpl-button prpl-button-step",
                onClick: onClose,
                children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Retry later', 'progress-planner')
              })]
            })]
          })]
        });
      case STEP_RESULT:
        return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.Fragment, {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
            className: "prpl-column prpl-column-content",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("h2", {
              className: "prpl-popover-title",
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('We sent a test email', 'progress-planner')
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("p", {
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.sprintf)(
              // translators: %1$s is the email subject, %2$s is the email address.
              (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('We just sent the email "%1$s" to %2$s.', 'progress-planner'), emailSubject, emailAddress)
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
            className: "prpl-column",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("p", {
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Did you get the test email?', 'progress-planner')
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
              className: "prpl-note",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("span", {
                className: "prpl-note-icon",
                children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("span", {
                  className: "dashicons dashicons-warning"
                })
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("span", {
                className: "prpl-note-text",
                children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('You should get the email in a few minutes. In rare cases, it might take a few hours.', 'progress-planner')
              })]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
              className: "radios",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
                className: "prpl-radio-wrapper",
                children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("label", {
                  htmlFor: "prpl-sending-email-result-yes",
                  className: "prpl-custom-radio",
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("input", {
                    type: "radio",
                    id: "prpl-sending-email-result-yes",
                    name: "prpl-sending-email-result",
                    "data-action": "showSuccess",
                    onChange: handleResultChange
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("span", {
                    className: "prpl-custom-control"
                  }), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Yes', 'progress-planner')]
                })
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
                className: "prpl-radio-wrapper",
                children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("label", {
                  htmlFor: "prpl-sending-email-result-no",
                  className: "prpl-custom-radio",
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("input", {
                    type: "radio",
                    id: "prpl-sending-email-result-no",
                    name: "prpl-sending-email-result",
                    "data-action": "showTroubleshooting",
                    onChange: handleResultChange
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("span", {
                    className: "prpl-custom-control"
                  }), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('No', 'progress-planner')]
                })
              })]
            })]
          })]
        });
      case STEP_SUCCESS:
        return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.Fragment, {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
            className: "prpl-column prpl-column-content",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("h2", {
              className: "prpl-popover-title",
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Your email is set up properly!', 'progress-planner')
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("p", {
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Great, you received the test email! This indicates email is set up properly on your website.', 'progress-planner')
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
      case STEP_TROUBLESHOOTING:
        return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.Fragment, {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
            className: "prpl-column prpl-column-content",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("h2", {
              className: "prpl-popover-title",
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Your email might not be working well', 'progress-planner')
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("p", {
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("We're sorry to hear you did not receive our confirmation email yet. On some websites, it make take up to a few hours to send email. That's why we strongly advise you to check back in a few hours from now.", 'progress-planner')
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("p", {
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("If you already waited a couple of hours and you still didn't get our email, your email might not be working well.", 'progress-planner')
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
            className: "prpl-column",
            children: [hasEmailOverride ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.Fragment, {
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("p", {
                children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('What can you do next? Well, it looks like you are already running an SMTP plugin on your website, but it might not be configured correctly.', 'progress-planner')
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("p", {
                children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('You can find more information about running an SMTP plugin in our troubleshooting guide.', 'progress-planner')
              })]
            }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.Fragment, {
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("p", {
                children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("What can you do next? If you haven't already, you may need to install a plugin to handle email for you (an SMTP plugin).", 'progress-planner')
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("p", {
                children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('You can find more information about installing an SMTP plugin in our troubleshooting guide.', 'progress-planner')
              })]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
              className: "prpl-steps-nav-wrapper",
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("button", {
                type: "button",
                className: "prpl-button prpl-button-step",
                onClick: handleOpenTroubleshootingGuide,
                children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Take me to your troubleshooting guide', 'progress-planner')
              })
            })]
          })]
        });
      default:
        return null;
    }
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_InteractiveTaskPopover__WEBPACK_IMPORTED_MODULE_3__["default"], {
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
//# sourceMappingURL=EmailSendingPopover.chunk.js.map