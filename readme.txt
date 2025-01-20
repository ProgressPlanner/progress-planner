=== Progress Planner ===
Contributors: joostdevalk, aristath, mariekerakt, irisguelen, samalderson
Tags: planning, maintenance, writing, blogging
Requires at least: 6.3
Tested up to: 6.7
Requires PHP: 7.4
Stable tag: 1.0.3
License: GPL3+
License URI: https://www.gnu.org/licenses/gpl-3.0.en.html

Powering your website’s progress! Track, motivate, and enhance your website management with daily activity tracking and weekly progress reports.

== Description ==

Welcome to Progress Planner! This transformative WordPress plugin will empower website owners to keep up the good work on their site. Progress Planner introduces an exciting, interactive approach to website management with badges and achievements to collect. Our mission is to tackle the all-too-common challenge of procrastination. With Progress Planner, the upkeep of your website is a rewarding experience! We’ll encourage you to contribute to the success of your site consistently.

=== Problem We Solve ===
We understand many website owners' dilemma — knowing the necessity of regular updates, content creation, and maintenance, yet often postponing these tasks —. Progress Planner seeks to address this procrastination head-on. A successful website demands regular attention, whether writing engaging content, adding internal links, updating plugins, resolving 404 errors, or optimizing site speed. These tasks are pivotal for a website to rank well and convert visitors effectively. Progress Planner ensures you stay on track, providing the tools and motivation to maintain and enhance your site's success.

=== Features ===

* **Activity Tracking**: Monitor your actions on your website, from publishing posts to updating pages, and see how they contribute to your overall site health.
* **Gamification**: Unlock achievements, earn badges, and track your progress in a fun and motivating way.
* **Progress Reports**: Receive detailed reports on your website's performance and progress.
* **To-do list**: Keep all those content and maintenance tasks in one place.
* **More to come**: We are creating a Pro version and extra features for the Free version of Progress Planner. Stay tuned for updates!

=== Getting Started ===
* **Install Progress Planner**: Download and activate the plugin from the WordPress plugin repository on your WordPress site.
* **Define your goals**: Set specific, realistic goals for your website's improvement and growth.
* **Engage in daily tasks**: Regularly update your website, with Progress Planner tracking each step and providing motivational feedback.
* **Earn and celebrate**: Achieve your milestones and celebrate your success with rewards and recognitions from Progress Planner.
* **Strive for continuous Improvement**: Utilize our guides and analytics to refine your site perpetually, ensuring its ongoing success.

== Frequently Asked Questions ==

= Is Progress Planner suitable for WordPress beginners? =

Absolutely! Progress Planner is designed to assist users of all skill levels, providing guided tutorials and actionable feedback to help beginners navigate through the process of website management.

= Can I track the progress of multiple websites with Progress Planner? =

Currently, Progress Planner supports tracking for one website per WordPress installation. We are exploring multi-site support for future updates.

= Is there a Pro version of Progress Planner? =

We are currently creating a Pro version of Progress Planner. The Pro version will include guided tutorials, goal settings, and reminders.

= Where do I file bugs? =

If you've found a bug, please follow the following steps:

1. If it's a security report, please report it through our [PatchStack Vulnerability Disclosure Program](https://patchstack.com/database/vdp/progress-planner).
2. If it's not a security report, search through the open issues on [our GitHub repository](https://github.com/emilia-Capital/progress-planner/issues/) to see if there's already an issue for this problem.
3. If if doesn't exist yet, file a [bug report on GitHub](https://github.com/Emilia-Capital/progress-planner/issues/new/choose).

== Installation ==

This video shows you how to install the plugin:

https://youtu.be/e1bmxZYyXFY

1. Search for Progress Planner on the "Add new plugins" screen in your WordPress plugin.
2. Install the plugin.
3. Activate the plugin.
4. Go to the Progress Planner admin screen and complete our onboarding.
5. You're done.

== Screenshots ==

1. Collect badges as you work on your site.
2. Get a dashboard with good stats about your site's maintenance and content growth.
3. See your longterm activity score and try to stay on track!
4. Get a quick overview of the most important stats on your dashboard and add to-do's straight from there!
5. Maintain a simple to-do list per site on your dashboard or your Progress Planner page.
6. See your Website activity score.
7. Get a weekly email with stats on how well you're doing on your site!

== Changelog ==

= 1.0.3 =

Fixed:

* Detection of page-types in the settings page.

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
