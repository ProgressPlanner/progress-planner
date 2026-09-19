---
id: date-archives-not-indexed
title: Keep date archives out of search results
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
# it is the wrong question on a site whose permalinks contain a date: there the
# date segments are part of every post URL, and the archives they imply are
# load-bearing navigation rather than stray duplicates.
applies_when:
  - any_plugin_active: [yoast-seo, all-in-one-seo-pack]
  - permalink_structure_excludes: ['%year%', '%monthnum%', '%day%']
---

## Why it matters

WordPress generates a listing for every year, every month and every day on
which something was published. On most sites nobody browses by month, so these
are dozens or hundreds of URLs that exist only to slice the same posts a
different way. Search engines crawl all of them, and each one competes with the
posts it lists.

Date archives earn their place on news sites and other genuinely time-indexed
publications. This recommendation is for the rest.

## Goal

Requesting a date archive URL must not return an indexable HTML listing.

Any one of these satisfies it:

- the URL redirects anywhere (any 3xx), commonly to the home page or the blog
  listing
- the response carries a `noindex` directive, in a robots meta tag or an
  `X-Robots-Tag` header
- the URL returns 404 or 410, because date archives are switched off entirely
  and no longer resolve

Any one is enough. Do not require a particular mechanism: sites reach this
outcome in different ways, and all of them are correct.

## How to verify

Take the publication date of any published post, build the year archive URL
from it, and request it without following redirects. Read the status line, the
response headers and the robots meta tag in the returned HTML. Checking the
month archive as well is cheap and catches a site that handles one level and
not the other.

The response is the answer -- it reflects what the site actually does,
whichever plugin, theme or snippet is responsible.

If the request cannot be completed at all -- a certificate that does not
validate, a host that cannot resolve its own name, a firewall in front of the
site -- that is not a failure of this goal. Report it as undetermined and stop;
do not fall back to guessing from settings.

If the site has nothing published, there are no date archives to speak of. Say
so rather than passing or failing the goal.

## Hints

Yoast SEO keeps this under its date-archive settings, and All in One SEO under
search appearance for archives. Other SEO plugins offer the same control under
their own names, and some themes and standalone snippets handle it instead.

Look at what this site actually has before assuming. If two plugins both offer
the setting, change the one that is active and handling the output, not both.

## Out of bounds

Do not change the permalink structure. Removing a date from post URLs would
break every existing link into the site, and doing it to make this rule apply
would be backwards.

Do not delete or unpublish posts, and do not edit publication dates. Do not
switch SEO plugins, or activate a second one, to get access to a setting.
