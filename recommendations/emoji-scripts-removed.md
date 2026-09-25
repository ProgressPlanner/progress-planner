---
id: emoji-scripts-removed
title: Stop loading the emoji fallback script
category: seo
points: 1
priority: 20
capability: manage_options
repeats: never
per_item: false
reversible: true
verified_by: site_state
needs_confirmation: false

# The rule needs an SEO plugin that can dequeue the core emoji assets. Every
# WordPress front end enqueues them by default, so there is no second
# condition.
applies_when:
  - any_plugin_active: [wordpress-seo, all-in-one-seo-pack]
---

## Why it matters

WordPress loads a small JavaScript file on every front-end page whose only job
is to replace emoji characters with images in browsers that cannot render them
natively. Every browser in current use renders them natively. The file, and the
inline detection script that goes with it, are a request and a parse on every
page load that buys nothing.

## Goal

A front-end page must not load the core emoji detection or replacement
assets.

In practice this means the rendered HTML contains neither the inline emoji
settings script nor a script tag for `wp-emoji-release.min.js`.

Any mechanism that achieves this is fine: a setting in an SEO plugin, a
`mu-plugin` that unhooks the relevant print and enqueue actions, a
performance plugin, or the theme. Do not require a particular one.

## How to verify

Request the site's home page as an anonymous visitor and search the returned
HTML for `wp-emoji` and for the inline emoji settings block. Absent from the
markup means the goal is met. Check a single post URL as well if the home page
is a static page, since a theme can enqueue differently per template.

Read the raw HTML rather than a rendered DOM: a page that loads the script and
then removes the tag with JavaScript has still paid for it.

If the request cannot be completed at all -- a certificate that does not
validate, a host that cannot resolve its own name, a firewall in front of the
site -- that is not a failure of this goal. Report it as undetermined and stop;
do not fall back to guessing from settings.

Full-page caching can serve markup generated before a change. If the setting is
in place and the markup disagrees, clear the cache and request the page again
before concluding anything.

## Hints

Yoast SEO groups this with its crawl optimisation settings, under a label
mentioning emoji scripts. All in One SEO and other SEO plugins have their own
equivalents, and performance and optimisation plugins very commonly remove
these assets too -- which means the goal may already be met by something other
than the SEO plugin.

Look at what this site actually has before assuming. If two plugins both offer
the setting, change the one that is active and affecting the output, not both.

## Out of bounds

Do not strip emoji characters from post content, titles or excerpts. Emoji in
the text keep working without this script; removing them is not what the goal
asks for.

Do not dequeue unrelated scripts or styles as part of the same change, and do
not switch SEO plugins, or activate a second one, to get access to a setting.
