= 1.0.5 =

Under the hood:

* Improved suggested tasks completion conditions.
* Improved checks for suggested 'review post' tasks.

We've added the following Recommendations from Ravi:

* [Update PHP version](TBD).
* [Disable comments on your site](TBD).

= 1.0.4 =

Enhancements:

* We've moved Ravi's recommendations to the top left of your Progress Planner dashboard. They're the most important thing on there, so we wanted to give it prime placement.
* We changed "Update post" to "Review post" / "Review page" and [wrote better instructions for reviewing old posts and pages](https://progressplanner.com/recommendations/review-post/). These tasks now prioritize the most important pages, like your About page, Privacy policy, Contact page and FAQ page.
* Added an option to redirect users to the Progress Planner dashboard after login. The WordPress dashboard isn't particularly useful in our eyes, this mind entice you to action more.
* Added a plugin-deactivation feedback form (we tell you, because you'll never see it, right? :) ).
* Removed the celebration for "Perform all updates" if it was done by WordPress's automatic update. We all love confetti, but when it comes all the time without you doing anything, it loses its value, right? Hence this fix.

We've added the following Recommendations from Ravi:

* [Setting site icon](https://progressplanner.com/recommendations/set-a-site-icon-aka-favicon/).
* [Setting the tagline](https://progressplanner.com/recommendations/set-tagline/).
* [Deactivating the display of PHP debug messages](https://progressplanner.com/recommendations/set-wp-debug/).
* [Removing the default WP "Hello world" post](https://progressplanner.com/recommendations/delete-the-default-wordpress-hello-world-post/).
* [Removing the default WP "Sample page" page](https://progressplanner.com/recommendations/delete-the-default-wordpress-sample-page-post/).

Under the hood:

* Improvements to the REST-API endpoint for getting stats.
* Removed admin notices on the Progress Planner page.

= 1.0.3 =

Fixed:

* Detection of page-types in the settings page.
* Properly resetting caches for monthly badges.

Enhancements:

* Added a new "Challenges" widget to the dashboard.

= 1.0.2 =

Fixed:

* Remove duplicated weekly suggested tasks.
* The REST API endpoint for getting stats was broken, causing the weekly emails not to work.
* Scrollable monthly badges widget was the wrong height on page load.
* 2026 monthly badges were showing up and shouldn't (yet).

Enhancements:

* Refocus the "add new task" input after a to-do item is added.

= 1.0.1 =

Fixed:

* Share buttons not working on localhost sites.
* Non-translatable names for monthly badges.
* Graphs appearance.
* Confetti being triggered on every page load.
* Assets versioning.
* Duplicate update-core tasks.
* Information icon for 'Create a long post' task was showing text of 'create a short post' task.
* Numerous other minor bugfixes.

Enhancements:

* Improved the onboarding experience.
* Internal refacture of local tasks.
* Privacy policy improvements.
* Removed "product" and "blog" page-types from the settings page.
* Auto-detecting page-types in the settings page.

= 1.0.0 =

We added Ravi's Recommendations: recommendations on what you should do next on your site!

We also fixed all previous bugs (most of them twice) and probably introduced new ones ;-)

= 0.9.6 =

Fixed:

* Accessibility of the to-do list.

= 0.9.5 =

Enhancements:

* Added functionality to make it easier to demo the plugin on the WordPress playground.
* Improved the onboarding and added a tour of the plugin.

Fixed:

* Post-type filters intruduced in v0.9.4 now also affect the graph results.

= 0.9.4 =

Enhancements:

* Added a setting to include post types, we default to `post` and `page` and you can add others as you wish.

Fixed:

* Completing the last badge wouldn't ever work, fixed.
* Fixed some bugs around detecting badges being "had".
* Replaced links to the site with shortlinks, so we can change them as needed without doing a release.

= 0.9.3 =

Security:

* Stricter sanitization & escaping of data in to-do items.  Props to [justakazh](https://github.com/justakazh) for reporting through our [PatchStack Vulnerability Disclosure Program](https://patchstack.com/database/vdp/progress-planner).
* Restrict access to the plugin's dashboard widgets to users with the `publish_posts` capability.

= 0.9.2 =

Security:

* Fixes a vulnerability in our REST API endpoint access validation to retrieve stats. Props to [Djennez](https://github.com/Djennez) for reporting through our [PatchStack Vulnerability Disclosure Program](https://patchstack.com/database/vdp/progress-planner).

= 0.9.1 =

Enhancements:

* Added an action link to the Dashboard to the plugin's action links on the plugins page.
* No longer show Elementor templates as a post type in the plugin's reports.
* Improved translatability (is that a word?) of some of our strings with singulars and plurals.

Bugfixes:

* Fixed the responsive styles of the dashboard widget. Thanks to [Aaron Jorbin](https://aaron.jorb.in/) for reporting.
* Fix the accessibility of the to-do list. Thanks to Steve Jones of [Accessibility checker](https://equalizedigital.com/accessibility-checker/) for the report and fix.
* The plugin would throw a fatal error on uninstall. Thanks to [Jose Varghese](https://github.com/josevarghese) for reporting.
* Deleting the last to do item on the to do list would not work. Thanks to [Jose Varghese](https://github.com/josevarghese) for reporting.
* Don't show the password reset link during onboarding of users as it leads to confusion. Thanks to [Jose Varghese](https://github.com/josevarghese) for reporting.

= 0.9 =

Initial release on GitHub and WordPress.org.
