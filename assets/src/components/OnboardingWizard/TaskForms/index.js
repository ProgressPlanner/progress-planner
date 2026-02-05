/**
 * Task Forms Registry
 *
 * Maps task IDs to their React form components.
 * Used by OnboardTask and FirstTaskStep to render native React forms
 * instead of PHP-generated HTML via dangerouslySetInnerHTML.
 */

import BlogDescriptionForm from './BlogDescriptionForm';
import SiteIconForm from './SiteIconForm';
import LocaleForm from './LocaleForm';
import TimezoneForm from './TimezoneForm';

const TASK_FORMS = {
	'core-blogdescription': BlogDescriptionForm,
	'core-siteicon': SiteIconForm,
	'select-locale': LocaleForm,
	'select-timezone': TimezoneForm,
};

export default TASK_FORMS;
