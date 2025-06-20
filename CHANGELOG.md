= 1.6.0 =

Enhancements:

* Allow users to collect extra points for previous months' badges.

Under the hood:

* Ravi's Recommendations are now a custom post type.

= 1.5.0 =

Added these recommendations from Ravi:

* [Test if your website can send emails correctly](https://prpl.fyi/troubleshoot-smtp).

Bugs we fixed:

* Don't redirect user to Progress Planner dashboard if 'redirect_to' GET or POST parameter is set.
* Removed the Onboard tour steps for the Settings popover which was removed in 1.3.0.
* Fixed detecting creation of new valuable content posts.
* Don't award point for all Todo tasks, only for golden.
* Fix Todo task title not being editable.

= 1.4.2 =

Bugs we fixed:

* Fixed snoozing some of Yoast SEO Recommendations.

= 1.4.1 =

Bugs we fixed:

* Fixed a conflict with the premium version of Yoast SEO.

= 1.4.0 =

Enhancements:

* Review Content task takes into account Yoast SEO readibility score when suggesting posts to update.
* Change update frequency for articles which are not selected in "Your page" section or as Yoast SEO Cornerstone content to 12 months.
* Factor in Yoast SEO readibility score when suggesting which articles should be updated.

Bugs we fixed:

* Fixed a bug where dismissed review content tasks would reappear in the following week.

Added these recommendations from Ravi:

* [Remove terms](http://prpl.fyi/remove-empty-taxonomy) which have less than 2 posts.
* [Give description](http://prpl.fyi/taxonomy-terms-description) to terms which have more than 2 posts.
* Suggest to install [Fewer Tags plugin](https://prpl.fyi/install-fewer-tags).
* Yoast SEO: [do Yoast SEO's Cornerstone Content Workout](http://prpl.fyi/run-orphaned-content-workout).
* Yoast SEO: [do Yoast SEO's Orphaned Content Workout](https://prpl.fyi/run-cornerstone-content-workout).
* Yoast SEO: [add internal links](https://prpl.fyi/fix-orphaned-content) to articles which don't have them.

= 1.3.0 =

Enhancements:

* Improved checks when adding Ravi icon to the Yoast SEO settings page.
* Add "golden" tasks to weekly emails.
* Add text to clarify when the user has completed all tasks.
* Improve the content widget & stats to show more accurate data. It now shows content _activity_ instead of content _published_.
* Implemented "valuable post-types" and added settings for them.
* Changed the "create a post" task to "create valuable content".
* Renamed & migrated content badges.
* Added a link to the 'Create valuable content' task description.
* Improve accessibility of Recommendations (and other links) linking to external resources

Bugs we fixed:

* Fixed error during plugin uninstall.
* Archive_Format data collector hooks weren't registered early enough.
* Ensure fresh plugin list by clearing plugin cache before checking for inactive plugins after deletion.
* Clear plugin cache when checking for inactive plugins.
* Delete no-longer relevant pending tasks.
* Fixed timing issue for tasks added by 3rd-party plugins.

= 1.2.0 =

In this release we've [added an integration with the **Yoast SEO** plugin](https://prpl.fyi/v12), so you’ll now see personalized suggestions based on your current SEO configuration.

Added these recommendations from Ravi:

* Yoast SEO: [disable the author archive](https://prpl.fyi/yoast-author-archive)
* Yoast SEO: [disable the date archive](https://prpl.fyi/yoast-date-archive)
* Yoast SEO: [disable the format archives](https://prpl.fyi/yoast-format-archive)
* Yoast SEO: [Remove emoji scripts](https://prpl.fyi/yoast-crawl-optimization-emoji-scripts)
* Yoast SEO: [Remove post authors feeds](https://prpl.fyi/yoast-crawl-optimization-feed-authors)
* Yoast SEO: [Remove global comment feeds](https://prpl.fyi/yoast-crawl-optimization-feed-global-comments)
* Yoast SEO: [disable the media pages](https://prpl.fyi/yoast-media-pages)
* Yoast SEO: set your [organization](https://prpl.fyi/yoast-organization-logo) or [person](https://prpl.fyi/yoast-person-logo) logo

Under the hood:
* Changed how the titles and descriptions of one_time and repetitive tasks are defined to be compatible with WP 6.8.

= 1.1.1 =

Bugs we fixed:

* Fixed unnecessary display of the upgrade popover.
* Fixed saving license key from 'Subscribe to weekly' emails popover.
* Reduced number of database queries when checking for user activity scores.
* Fixed database queries when getting activities by type.

Enhancements:

* Simplified the Dashboard widget.
* Styling improvements.
* Improved some translation strings.
* Improved suggestions for writing new posts.
* UI improvements in the plugin settings page.
* TODO tasks can now award 1 point per week, counting toward the monthly badges.

Under the hood:

* Completely refactored the TODOs system.
* Refactored the suggested-tasks system.
* Refactored our AJAX calls.
* Performance & caching improvements.
* Refactored popovers implementation.
* Added implementation to migrate plugin data on updates.
* Improved debugging suite.
* Added new hooks for integration with 3rd-party plugins.
* Added a data collector system for tasks providers.
* Refactored the way tasks are saved in the database for consistency.
* Improved `one_time` and `repetitive` task type abstractions.
* Refactored the celebrations system.

= 1.1.0 =

In this release, we've added more recommendations from Ravi on how to improve your site. We've also made these recommendations more visible on your WordPress
settings pages, by showing on settings pages exactly which things we think you should change. Also, if you're just now starting to use Progress Planner,
we've made the onboarding experience a lot more fun: we show you immediately which of Ravi's recommended tasks you've already completed and we give
you points for those!

Added these recommendations from Ravi:

* Properly set your [permalink structure](https://progressplanner.com/recommendations/change-default-permalink-structure/).
* Fix it if your site is [set to not be shown in search engines](https://progressplanner.com/recommendations/blog-indexing-settings/).
* Rename and change the slug of your [Uncategorized category](https://progressplanner.com/recommendations/rename-uncategorized-category/).
* Remove [inactive plugins](https://progressplanner.com/recommendations/remove-inactive-plugins/).
* [Upgrade your PHP version](https://progressplanner.com/recommendations/update-php-version/) if needed.
* [Fully disable comments](https://progressplanner.com/recommendations/disable-comments/) if they're not needed on your site.

Bugs we fixed:

* If you had `WP_DEBUG` set to false, the plugin would still tell you to disable `WP_DEBUG_DISPLAY`. We think Ravi was a bit overzealous in his recommendation, so we've fixed that.

Under the hood:

* We've added our set of debug tools straight into the plugin. If you define `PRPL_DEBUG` as `true` in your `wp-config.php` file, you'll get a PRPL Debug admin bar menu item.
* Improved suggested tasks completion conditions so they don't trigger at the wrong moment.

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
