---
id: author-archives-not-indexed
title: Keep author archives out of search results
category: seo
points: 1
priority: 20
capability: manage_options
repeats: never
per_item: false
reversible: true
verified_by: site_state
needs_confirmation: false

# Two layers. The rule needs an SEO plugin that can control archive output, and
# it only makes sense on a single-author site: with two or more authors who
# publish, the author archive is a real, distinct listing and should stay.
applies_when:
  - any_plugin_active: [wordpress-seo, all-in-one-seo-pack]
  - author_with_posts_count_at_most: 1
---

## Why it matters

On a site where one person writes everything, the author archive lists exactly
the same posts as the blog listing, at a second set of URLs. Search engines
crawl both and have to decide which of two near-identical listings to show.
Neither is the page you want ranked, and the crawl budget spent on the
duplicate comes out of the budget for real content.

## Goal

Requesting the author archive URL must not return an indexable HTML listing.

Any one of these satisfies it:

- the URL redirects anywhere (any 3xx), commonly to the home page or the blog
  listing
- the response carries a `noindex` directive, in a robots meta tag or an
  `X-Robots-Tag` header
- the URL returns 404 or 410, because author archives are switched off
  entirely and no longer resolve

Any one is enough. Do not require a particular mechanism: sites reach this
outcome in different ways, and all of them are correct.

## How to verify

Find the author who has published posts, build their archive URL, and request
it without following redirects. Read the status line, the response headers and
the robots meta tag in the returned HTML. The response is the answer -- it
reflects what the site actually does, whichever plugin, theme or snippet is
responsible.

If the request cannot be completed at all -- a certificate that does not
validate, a host that cannot resolve its own name, a firewall in front of the
site -- that is not a failure of this goal. Report it as undetermined and stop;
do not fall back to guessing from settings.

If the site has more than one author who has published, the goal does not
apply. Say so rather than passing or failing it.

## Hints

Yoast SEO keeps this under its author-archive settings, and All in One SEO
under search appearance for archives. Other SEO plugins offer the same control
under their own names, and some themes and standalone snippets handle it
instead.

Look at what this site actually has before assuming. If two plugins both offer
the setting, change the one that is active and handling the output, not both.

Note that the archive may already be handled and still be reachable: a page
that returns 200 with a `noindex` header has met the goal.

## Out of bounds

Do not delete, merge or demote user accounts, and do not reassign posts to a
different author. The site's authorship stays exactly as it is; only what the
archive *URL* returns changes.

Do not switch SEO plugins, or activate a second one, to get access to a
setting.
