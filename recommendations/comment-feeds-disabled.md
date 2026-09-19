---
id: comment-feeds-disabled
title: Remove the comment RSS feeds
category: seo
points: 1
priority: 20
capability: manage_options
repeats: never
per_item: false
reversible: true
verified_by: site_state
needs_confirmation: false

# The rule needs an SEO plugin that can suppress core feed routes. There is no
# second condition: unlike the author feeds, comment feeds are no more useful
# on a busy site than on a quiet one.
applies_when:
  - any_plugin_active: [yoast-seo, all-in-one-seo-pack]
---

## Why it matters

WordPress publishes a site-wide feed of recent comments, and a separate feed of
comments for every single post. On a site with a few hundred posts that is a
few hundred extra URLs, each one a document of fragments with no context.
Almost nobody subscribes to them; crawlers fetch them all.

## Goal

Requesting a comment feed URL must not return a working feed. This covers both
the site-wide recent-comments feed and the per-post comment feeds.

Any one of these satisfies it, per URL:

- the URL returns 404 or 410
- the URL redirects anywhere (any 3xx)
- the response carries a `noindex` directive in an `X-Robots-Tag` header, and
  no feed document

Any one is enough. Do not require a particular mechanism: sites reach this
outcome in different ways, and all of them are correct.

Both kinds of comment feed have to be dealt with. A site that has removed the
site-wide feed and still serves one per post has not met the goal.

## How to verify

Request the site-wide comments feed URL without following redirects, then take
any published post and request its comment feed URL the same way. For each one,
read the status line, the content type and the first part of the body. A 200
response whose body is an RSS or Atom document means that feed is still being
served.

The response is the answer -- it reflects what the site actually does,
whichever plugin, theme or snippet is responsible.

If a request cannot be completed at all -- a certificate that does not
validate, a host that cannot resolve its own name, a firewall in front of the
site -- that is not a failure of this goal. Report it as undetermined and stop;
do not fall back to guessing from settings.

## Hints

Yoast SEO groups this with its crawl optimisation settings. All in One SEO puts
it under the advanced search-appearance settings, in a crawl cleanup section
for feeds, where the site-wide comments feed and the per-post comment feeds are
two separate switches -- both need attention. Other SEO plugins offer
equivalent controls, and a small `mu-plugin` or a theme's functions file can
remove the same feed routes directly.

Look at what this site actually has before assuming. If two plugins both offer
the setting, change the one that is active and handling the routes, not both.

## Out of bounds

Do not turn off commenting, close comments on posts, or delete comments.
Whether the site accepts discussion is a separate decision, and this goal is
only about the feed URLs.

Do not disable the site's main content feed or the per-author feeds while doing
this. Do not switch SEO plugins, or activate a second one, to get access to a
setting.
