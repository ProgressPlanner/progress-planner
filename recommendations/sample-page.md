---
id: sample-page
title: Delete the default "Sample Page"
category: content
points: 1
priority: 14
capability: edit_pages
repeats: never
per_item: false
reversible: true
verified_by: site_state
needs_confirmation: true
---

## Why it matters

WordPress creates a page called "Sample Page" on install, carrying placeholder
text about being an example page and a fictional biography beginning "Hi
there!". It is published, so it appears in menus that list all pages, in
sitemaps, and in search results.

It is worse than the "Hello world!" post in one respect: pages are what
visitors browse deliberately. A site with a real About page and a "Sample Page"
sitting next to it looks half-built, and the placeholder biography reads as
though it belongs to the site's owner.

## Goal

The default "Sample Page" is no longer published.

Any one of these satisfies it:

- the page is in the trash
- the page has been permanently deleted
- the page is a draft or otherwise not publicly viewable

Some sites have reused the page rather than deleting it: same slug, entirely
rewritten content, perhaps a new title. If the page at that slug is no longer
the default page, the goal is moot -- report that and leave it.

## How to verify

Identify the page precisely first. The install default is a page with the slug
`sample-page`. If nothing has that slug, fall back to a page titled "Sample
Page" -- slug first, title second. Both are localised, so a non-English install
has the translated slug and title.

Then read the page's status. Anything other than `publish` meets the goal.

If neither matches, the page has already gone. Report that as met.

Check two things that would make deletion harmful, and report undetermined
rather than acting if either is true: the page is set as the site's front page
or posts page in the reading settings, or it has child pages. Either means
something is built on it.

## Hints

The default text is distinctive -- a paragraph beginning "This is an example
page" and a made-up bio. Compare against it before acting; a page can keep the
`sample-page` slug and have real content on it.

Trash rather than delete. WordPress keeps trashed pages for 30 days by default.

Check whether the page appears in a navigation menu. Trashing it leaves a
broken menu item on some themes, which is worth mentioning to the owner even
though fixing the menu is not part of this goal.

## Out of bounds

Move the page to the trash. Do not permanently delete it without asking --
trashing is reversible, permanent deletion is not.

Do not delete any other page. The target is the single page identified by the
slug `sample-page`, or failing that the exact title "Sample Page". A page named
"Sample", a sample post type entry, or anything a theme or plugin created from
a starter template is not the target.

Do not change the front page or posts page settings to make deletion possible.
If the page is in use that way, stop and report it.

Do not empty the trash, and do not touch the "Hello world!" post -- that is a
different goal.
