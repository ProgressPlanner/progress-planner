---
id: author-feeds-disabled
title: Remove the per-author RSS feeds
category: seo
points: 1
priority: 20
capability: manage_options
repeats: never
per_item: false
reversible: true
verified_by: site_state
needs_confirmation: false

# Two layers. The rule needs an SEO plugin that can suppress core feed routes,
# and it only makes sense on a single-author site: on a multi-author blog,
# readers may legitimately want to follow one writer.
applies_when:
  - any_plugin_active: [wordpress-seo, all-in-one-seo-pack]
  - author_with_posts_count_at_most: 1
---

## Why it matters

WordPress publishes an RSS feed for every author, alongside the site's main
feed. Where one person writes everything, that feed carries the same items as
the main feed at a different URL. Nobody subscribes to it, and crawlers fetch it
anyway.

The cost is crawl noise and duplicate syndication rather than page weight:
feeds are not loaded by visitors' browsers.

## Goal

Requesting an author feed URL must not return a working feed.

Any one of these satisfies it:

- the URL returns 404 or 410
- the URL redirects anywhere (any 3xx), commonly to the site's main feed or the
  author archive
- the response carries a `noindex` directive in an `X-Robots-Tag` header, and
  no feed document

Any one is enough. Do not require a particular mechanism: sites reach this
outcome in different ways, and all of them are correct.

## How to verify

Find the author who has published posts, append the feed segment to their
archive URL, and request it without following redirects. Read the status line,
the content type and the first part of the body. A 200 response whose body is
an RSS or Atom document means the feed is still being served, and the goal is
not met.

The response is the answer -- it reflects what the site actually does,
whichever plugin, theme or snippet is responsible.

If the request cannot be completed at all -- a certificate that does not
validate, a host that cannot resolve its own name, a firewall in front of the
site -- that is not a failure of this goal. Report it as undetermined and stop;
do not fall back to guessing from settings.

If the site has more than one author who has published, the goal does not
apply. Say so rather than passing or failing it.

## Hints

Yoast SEO groups this with its crawl optimisation settings, and All in One SEO
under the advanced search-appearance settings, in a crawl cleanup section for
feeds. Other SEO plugins offer equivalent controls, and a small `mu-plugin` or
a theme's functions file can remove the same feed routes directly.

Look at what this site actually has before assuming. If two plugins both offer
the setting, change the one that is active and handling the routes, not both.

## Out of bounds

Do not disable the site's main feed, the post comment feeds or any other feed
while doing this. Only the per-author feeds are in scope.

Do not delete or merge user accounts, and do not reassign posts. Do not switch
SEO plugins, or activate a second one, to get access to a setting.
