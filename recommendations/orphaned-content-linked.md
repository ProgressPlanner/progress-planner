---
id: orphaned-content-linked
title: 'Link to the orphaned {post_type} "{post_title}"'
category: seo
points: 1
priority: 35
capability: edit_others_posts
repeats: weekly
reversible: true
verified_by: site_state
needs_confirmation: true

per_item: true
target:
  type: post
  identified_by: target_post_id
  max_open: 1
  find:
    - incoming_internal_links: 0
      post_status: publish
  order: oldest_published_first

applies_when:
  # Counting incoming internal links needs an index of them. The SEO plugins
  # that build one are the usual source; without any, the model has to work it
  # out by reading the site, which is slower but not impossible.
  - any_plugin_active: [wordpress-seo, all-in-one-seo-pack]
---

## Why it matters

A published page that nothing else on the site links to is hard to find and
hard to justify. Visitors only reach it from search or a direct link, and a
search engine reading the site's structure has no signal that the page matters,
because nothing on the site says it does.

Fixing it is usually a matter of noticing where a link belongs and did not get
added.

## Goal

At least one other published page on the site links to the target, from within
its content.

Navigation menus, footers, related-post widgets and sitemaps do not count. The
point is a contextual link, made from somewhere the subject genuinely comes up,
which is also the only kind that helps a reader.

## How to verify

Count incoming internal links to the target from the content of other published
posts and pages. One is enough.

Where an SEO plugin maintains a link index, read it -- that is what it is for.
Where none does, search the site's content for the target's URL and slug.
Searching is less reliable, so if it produces nothing, say the result is
undetermined rather than asserting the page is orphaned.

## Hints

Find where the link belongs rather than where it can be put. Look for existing
posts that discuss the same subject and mention it without linking anywhere --
that sentence is usually the right place, and the link reads naturally because
the context was already there.

Say which post, which sentence, and what the anchor text should be. Anchor text
that describes the destination is worth more than "click here" or a bare URL,
and more than an exact-match keyword jammed in.

If nothing on the site plausibly relates to the target, that is worth saying
directly. It may mean the page belongs in the navigation instead, or that it no
longer belongs on the site at all.

## Out of bounds

Do not edit other posts to insert links without being asked. You are changing
content the owner wrote, in a place they did not ask you to look.

Do not add the target to a menu, a footer or a widget as a way of satisfying
this. That changes the site's navigation to close a task, which is backwards,
and it does not achieve what the recommendation is for.
