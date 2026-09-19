---
id: wp-debug-display
title: Stop showing PHP errors to visitors
category: maintenance
points: 1
priority: 10
capability: manage_options
repeats: never
per_item: false
reversible: true
verified_by: site_state
needs_confirmation: true
applies_when:
  - constant_true: WP_DEBUG
  - constant_true: WP_DEBUG_DISPLAY
---

## Why it matters

With `WP_DEBUG` and `WP_DEBUG_DISPLAY` both on, PHP notices, warnings and
fatal errors are printed into the page where anyone can read them. Those
messages carry absolute filesystem paths, plugin and theme names with their
directory layout, function and class names, and sometimes fragments of queries
or arguments. That is a map of the installation handed to whoever asks for a
page.

It also breaks things that are supposed to be invisible. Output printed before
headers are sent produces "headers already sent" failures, and a notice
emitted during an AJAX or REST response corrupts the JSON, so features fail
for reasons that have nothing to do with the feature.

The combination is a development setting left on in production.

## Goal

PHP errors are not printed into the site's output.

Any one of these satisfies it:

- `WP_DEBUG` is off, which is the normal production state
- `WP_DEBUG` is on for logging but `WP_DEBUG_DISPLAY` is off, with
  `WP_DEBUG_LOG` writing to a file outside the web root -- the right setup
  when errors genuinely need capturing on a live site
- PHP's own `display_errors` is off at the server level, so nothing is printed
  regardless of the WordPress constants

Any one is enough. Keeping the log is fine; printing to the page is not.

## How to verify

Read the values of `WP_DEBUG`, `WP_DEBUG_DISPLAY` and `WP_DEBUG_LOG` as
defined, and PHP's `display_errors` setting. The problem state is `WP_DEBUG`
true together with `WP_DEBUG_DISPLAY` true and `display_errors` on.

Note that `WP_DEBUG_DISPLAY` defaults to true when it is not defined at all,
so an undefined constant alongside `WP_DEBUG` true is the problem state, not an
absence of one.

**This cannot be fixed from within WordPress.** The constants are defined in
`wp-config.php`, which is read before any plugin code runs, and
`display_errors` is a server setting. Writing to the option table, calling
`define()` at runtime or using `ini_set()` later in the request will not change
what already happened.

So the outcome here is a report, not a change: state which constants are set to
what, where they are defined, and what a human needs to edit. Say plainly that
the fix is a manual edit to `wp-config.php` or a change to the PHP
configuration.

If the constants cannot be read -- no filesystem access, no way to run code in
the WordPress context -- report undetermined. Do not infer the setting from
whether a fetched page happens to contain an error message; a site with no
current errors prints nothing whatever the setting says.

## Hints

The constants live in `wp-config.php`, normally near the "That's all, stop
editing" line. The production-safe pattern is `WP_DEBUG` true with
`WP_DEBUG_DISPLAY` false and `WP_DEBUG_LOG` pointed at a path outside the
document root, or `WP_DEBUG` false outright.

Some managed hosts define these constants themselves, above or instead of the
file's own values, and a redefinition in `wp-config.php` will then have no
effect or emit a notice of its own. Check where the value is actually coming
from before telling anyone which line to edit -- a host control panel toggle or
an `.user.ini` may be the real source.

Debugging plugins can also define these, in which case deactivating the plugin
is the change.

## Out of bounds

Do not edit `wp-config.php` yourself. It is the file that makes the site boot,
a syntax error in it takes the whole site down with a blank page, and it is not
recoverable from inside WordPress. Report what needs changing and let a human
with filesystem access and a backup make the edit.

Do not delete or truncate an existing debug log. It may be the record somebody
is actively reading.

Do not change database credentials, salts, table prefix or any other constant
in the file.
