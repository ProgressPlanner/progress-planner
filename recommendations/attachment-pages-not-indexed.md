---
id: attachment-pages-not-indexed
title: Turn off attachment pages
category: seo
points: 1
priority: 30
capability: manage_options
repeats: never
per_item: false
reversible: true
verified_by: site_state
needs_confirmation: false
applies_when:
  - option_not_empty: permalink_structure   # pretty permalinks, or there are no attachment URLs to speak of
---

## Why it matters

WordPress gives every uploaded file its own page. These pages carry almost no
content of their own -- usually just the image and its caption -- so a search
engine that indexes them ends up ranking a thin page instead of the article the
image belongs to. Visitors who land there see a picture and no way onward.

## Goal

Requesting an attachment URL must not return an indexable HTML page.

Any one of these satisfies it:

- the URL redirects anywhere (any 3xx), most commonly to the file itself
- the response carries a `noindex` directive, in a robots meta tag or an
  `X-Robots-Tag` header
- the URL returns 404 or 410

Any one is enough. Do not require a particular mechanism: sites reach this
outcome in different ways, and all of them are correct.

## How to verify

Find one attachment and request its permalink without following redirects, then
look at what came back. The response is the answer -- it reflects whatever the
site actually does, whichever plugin, theme or snippet is responsible.

If the request cannot be completed at all -- a certificate that does not
validate, a host that cannot resolve its own name -- that is not a failure of
this goal. Report it as undetermined and stop; do not fall back to guessing
from settings.

If the site has no attachments, the goal is moot. Say so rather than passing or
failing it.

## Hints

Most sites reach this through whichever SEO plugin is active, under a setting
named after attachments, media or archives. Some themes and a few standalone
plugins do it instead.

Look at what this site actually has before assuming. If two plugins both offer
the setting, change the one that is active and handling it, not both.

## Out of bounds

Do not delete attachments, and do not detach media from the posts they belong
to. The files and their relationships stay exactly as they are; only what the
*page* returns changes.
