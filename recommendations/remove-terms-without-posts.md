---
id: remove-terms-without-posts
title: 'Remove the barely used {taxonomy} "{term_name}"'
category: content
points: 1
priority: 60
capability: edit_others_posts
repeats: never
reversible: false
verified_by: site_state
needs_confirmation: true

# This rule is a template, not a single recommendation: it produces one task
# per unused term. Each task is identified by the term it targets, so removing
# one says nothing about the others.
per_item: true
target:
  type: term
  identified_by: target_term_id
  max_open: 1
  find:
    # Public taxonomies only -- an internal taxonomy with no posts has no
    # archive page and costs nothing. One post counts as barely used: a term
    # that groups a single item is not grouping anything. The default term of
    # each taxonomy is excluded: WordPress will not let it be deleted.
    - taxonomy_public: true
      max_post_count: 1
      is_default_term: false
---

## Why it matters

A category or tag with no posts still has an archive page. Requesting it
returns a page with a heading, no content, and often pagination controls for
nothing. A term with exactly one post is barely better: its archive duplicates
a single article and groups nothing. Search engines index both kinds, visitors
who follow a tag cloud land on them, and term listings in the admin fill with
labels nobody uses.

These accumulate without anyone deciding to create them: an import brings in a
taxonomy the site never populated, a term is created for a post that later
moves, a typo produces a near-duplicate that then sits unused forever.

## Goal

The target term no longer exists, or it now groups more than one post.

Both are real outcomes. A term created for content still being written should
get the content, not be deleted -- and if posts are assigned to it in the
meantime, the goal is met without anything being removed.

Deleting a term is not reversible. WordPress removes the term row outright;
there is no trash for taxonomy terms. That is why this one asks first.

## How to verify

Read the target term's post count, and re-read it at the moment of acting
rather than trusting a count gathered earlier. Terms gain posts between the
recommendation being raised and anyone looking at it.

The goal is met if the term is gone, or if its count is now above one.

Before treating a term as safe to remove, check two things and report
undetermined rather than acting if either holds:

- the term is the default term for its taxonomy, named in the
  `default_<taxonomy>` option -- WordPress will refuse to delete it
- the term has child terms, which would be reparented or orphaned by the
  deletion

The stored count does not always mean what it looks like. A term can be
attached to posts in a status the count ignores -- drafts, pending, private,
scheduled. Check for those before concluding the term is unused; if several
exist, the term is in use and the goal is moot.

If the term has exactly one post, deleting it also takes that post's only label
in this taxonomy away. Whether that matters is the owner's call, not a
mechanical test: say what the post is and let them decide.

## Hints

Core WordPress lists terms with their counts under Posts then Categories or
Tags, and under the matching menu for each custom taxonomy. Custom post types
often register their own taxonomies, so look beyond categories and tags at what
this site actually has registered.

Check the archive URL before deleting. If the term's archive has incoming links
or appears in search results, the owner may want a redirect, which whichever
redirect or SEO plugin is installed can provide.

Near-duplicate terms -- "recipe" and "recipes", or the same word with different
capitalisation -- are usually a merge rather than a deletion. Merging is not
this goal, but it is worth raising when you see it, and it is often the better
answer for a term holding one post.

## Out of bounds

Ask before deleting. Term deletion cannot be undone, so it is not a step to
take on your own judgement, however plainly unused the term looks.

Delete only the one term this task targets, identified by its term ID and
taxonomy. Do not sweep up every unused term you find while you are there --
each is its own decision, and its own task.

Do not delete the default term of any taxonomy.

Do not reassign posts between terms, do not rename or re-slug the term as an
alternative, and do not unregister the taxonomy.
