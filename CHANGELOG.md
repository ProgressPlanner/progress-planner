= 1.0.4 =

Enhancements:

* Improvements to the REST-API endpoint for getting stats.
* Added a plugin-deactivation feedback form.
* Removed celebration for "Perform all updates" if it was done by WordPress' automatic update.
* Removed admin notices on the Progress Planner page.
* Added new suggested task for setting site icon.
* Added new suggested task for setting the tagline.
* Added new suggested task for deactivating the display of PHP debug messages
* Added new suggested task for removing the default WP "Hello world" post.
* Added new suggested task for removing the default WP "Sample page" page.

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
