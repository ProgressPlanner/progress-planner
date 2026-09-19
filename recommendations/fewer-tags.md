---
id: fewer-tags
title: Clean up the site's tags
category: content
points: 1
priority: 32
capability: manage_options
repeats: never
per_item: false
reversible: false
verified_by: site_state
needs_confirmation: true
applies_when:
  - more_tags_than_published_posts: true
---

## Why it matters

A tag is supposed to group posts. When a site has more tags than it has posts,
most of them are grouping one post each, which means most tag archives are a
page containing a single article -- thin content, duplicating the article it
links to, and indexed as a page in its own right.

This happens by accident rather than by decision. Tags get typed fresh into the
box on each post, so "wordpress", "WordPress" and "word-press" all exist;
imports bring their own vocabulary; and nobody ever sees the total, because the
tag list is somewhere nobody visits. The result is a taxonomy that costs the
site crawl budget and gives visitors no useful way to browse.

## Goal

The site's tags group content rather than label individual posts.

Any of these is a real outcome, and most sites need a mix:

- near-duplicate and singular/plural variants have been merged into one tag
- tags holding a single post have been removed, or absorbed into a broader tag
  that holds several
- tag archives that cannot usefully group anything are no longer indexable,
  while the ones that do group content remain

There is no target number. The useful test is whether an average tag archive
lists several related posts a reader would want next. If it lists one, the tag
was a label, not a grouping.

## How to verify

Count the tags and the published posts, and compare. Then look at the
distribution, which is the part that matters: how many tags hold one post, how
many hold two or three, and which handful hold most of the content.

Report those numbers along with the obvious duplicate clusters -- case
variants, plurals, near-synonyms. That list is what makes the problem
addressable; the count on its own does not.

Whether a specific merge is right is editorial and not mechanical. "Recipes"
and "recipe" are safely the same thing; "seo" and "search" may or may not be,
depending on what the site writes about. Treat the goal as undetermined and
propose the merges rather than deciding them, except for the exact-duplicate
cases where the only difference is capitalisation or whitespace.

Merging and deleting tags is not reversible -- WordPress has no trash for
taxonomy terms -- and it changes archive URLs.

## Hints

The Fewer Tags plugin exists for this: it hides tag archives that fall below a
threshold of posts, so thin archives stop being indexable without anything
being deleted. That is the gentlest version of the fix, and a reasonable first
step on a site with hundreds of one-post tags. Check whether it is already
installed, and check what else the site has -- some SEO plugins can noindex
low-count archives, and there are dedicated term-merge tools.

Sort the tag list by count, ascending, and read the bottom of it. The
duplicates and typos are all there.

Merging is usually better than deleting, because it keeps the posts labelled
and keeps one archive that now has several posts in it. Deleting a tag removes
the grouping entirely.

Changed or removed archive URLs may have incoming links. Whichever redirect or
SEO plugin is installed can handle that; some do it automatically on slug
change.

## Out of bounds

Do not merge or delete tags on your own judgement, beyond exact duplicates that
differ only in case or whitespace. The vocabulary is the owner's, and a merge
cannot be undone.

Do not install a plugin without asking.

Do not touch the posts themselves -- no retagging, no editing, no status
changes. This is about the taxonomy, not the content.

Do not unregister the tag taxonomy, and do not disable tag archives site-wide
as a shortcut. Some of those archives are working.

Do not touch categories or any custom taxonomy as part of this.
