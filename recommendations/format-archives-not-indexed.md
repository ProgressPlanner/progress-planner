---
id: format-archives-not-indexed
title: Keep post format archives out of search results
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
# it only makes sense where post formats are barely used: a site that really
# organises content by format has archives worth keeping.
applies_when:
  - any_plugin_active: [wordpress-seo, all-in-one-seo-pack]
  - posts_with_post_format_count_at_most: 3
---

## Why it matters

WordPress gives every post format -- aside, gallery, quote, video and the rest
-- its own archive. Almost no site uses formats as a real organising principle,
so these archives end up empty, or holding two posts that also appear
everywhere else. They are URLs a crawler has to fetch to discover that there is
nothing on them.

## Goal

Requesting a post format archive URL must not return an indexable HTML
listing.

Any one of these satisfies it:

- the URL redirects anywhere (any 3xx), commonly to the home page or the blog
  listing
- the response carries a `noindex` directive, in a robots meta tag or an
  `X-Robots-Tag` header
- the URL returns 404 or 410, because format archives are switched off
  entirely and no longer resolve

Any one is enough. Do not require a particular mechanism: sites reach this
outcome in different ways, and all of them are correct.

## How to verify

Build a format archive URL for a format the site actually uses, and request it
without following redirects. If no post carries a format at all, any format
archive URL will do, since the question is what the site does with the URL
pattern rather than what is listed on it. Read the status line, the response
headers and the robots meta tag in the returned HTML.

The response is the answer -- it reflects what the site actually does,
whichever plugin, theme or snippet is responsible.

If the request cannot be completed at all -- a certificate that does not
validate, a host that cannot resolve its own name, a firewall in front of the
site -- that is not a failure of this goal. Report it as undetermined and stop;
do not fall back to guessing from settings.

If more than a handful of posts are organised by format, the goal does not
apply. Say so rather than passing or failing it.

## Hints

Yoast SEO keeps this under its format-archive settings. All in One SEO and
other SEO plugins expose the same control under their own names, and the active
theme may declare or withhold format support in a way that decides whether
these URLs exist at all.

Look at what this site actually has before assuming. If two plugins both offer
the setting, change the one that is active and handling the output, not both.

## Out of bounds

Do not strip formats from posts, and do not remove format support from the
theme. Emptying the archives is not the same as keeping them out of search
results, and it edits content to satisfy a settings goal.

Do not switch SEO plugins, or activate a second one, to get access to a
setting.
