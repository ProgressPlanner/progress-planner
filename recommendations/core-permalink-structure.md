---
id: core-permalink-structure
title: Drop the day from post URLs
category: seo
points: 1
priority: 3
capability: manage_options
repeats: never
per_item: false
reversible: false
verified_by: site_state
needs_confirmation: true
applies_when:
  - option_equals:
      permalink_structure: "/%year%/%monthnum%/%day%/%postname%/"
---

## Why it matters

WordPress's "Day and name" permalink option puts the full publication date in
every post URL, so an article lives at `/2019/03/14/how-to-prune-roses/`.
Readers and search engines both read that as a dated document. An evergreen
guide looks stale from the URL alone, before anybody has read a word of it, and
the URL keeps saying 2019 however often the article is revised.

The date buys nothing in return. It does not disambiguate -- WordPress already
enforces unique slugs -- and it makes every link longer and harder to quote.

## Goal

Post URLs are readable and contain the post name, without the day of
publication.

Any one of these satisfies it:

- `/%postname%/` -- just the slug, the usual answer for evergreen content
- `/%year%/%monthnum%/%postname%/` -- year and month, reasonable for a news
  site where the date is part of the story
- any custom structure containing `%postname%` and no `%day%` token
- the same, prefixed with `/index.php` on servers without URL rewriting

The plain `?p=123` default and numeric structures such as `/archives/123` do
not satisfy this. They contain no day, but they are unreadable, and they are
the case where changing is most valuable and most costly at once.

## How to verify

Read `permalink_structure` and judge it against the list above. An empty value
means the plain `?p=123` default.

Then read how much is published, because that changes the answer. WordPress
creates no redirects when this setting changes: every existing URL breaks at
once, including links other people have made, bookmarks, and anything already
indexed.

- A new or nearly empty site: recommend the change plainly. Nothing is lost.
- An established site with a poor structure: report the situation and the
  benefit, say clearly what breaks, and treat a redirect plan as part of the
  work rather than an afterthought. Do not present it as a quick setting fix.
- An established site with an acceptable structure: leave it alone. Switching
  from year-and-month to post-name on a site with hundreds of posts trades a
  small gain for a large cost.

Report this as met, not met, or not worth changing. The third is a real outcome
here and should not be reported as a failure.

## Hints

Core WordPress, under Settings then Permalinks. Saving there rewrites the
option and regenerates the rewrite rules.

This is where the caution belongs: changing permalinks changes the URL of every
existing post. Old URLs will 404 unless something redirects them. Before
changing anything, establish what will handle the redirects -- most SEO
plugins can, some hosts do it at the edge, and on a small site a redirect
plugin or server rules are the alternative. Check what this site actually has
rather than assuming the SEO plugin you know best is installed and configured
to do it.

On a site with existing traffic or inbound links, the redirect plan is the task
and the setting change is the easy part.

## Out of bounds

Do not change permalinks on a site with published content until redirects for
the old URLs are in place and a human has agreed to the switch. This is not
reversible in any useful sense: reverting the setting restores the old URLs but
not the links, shares and rankings broken in between.

Do not touch the category or tag URL prefixes, and do not rename existing post
slugs.
