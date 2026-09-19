---
id: term-descriptions-written
title: 'Describe the {taxonomy} "{term_name}"'
category: content
points: 1
priority: 80
capability: edit_others_posts
repeats: weekly
reversible: true
verified_by: site_state
needs_confirmation: true

per_item: true
target:
  type: term
  identified_by: target_term_id
  max_open: 1
  find:
    - has_description: false
      has_posts: true
  order: most_posts_first
---

## Why it matters

An archive page for a category or tag with no description is a list of post
titles and nothing else. There is no sentence explaining what the grouping is
for, which means nothing for a search engine to summarise and nothing for a
visitor who landed there to orient themselves with.

Terms with the most posts behind them matter most: those archives are the ones
people actually reach.

## Goal

The target term has a description that says what the term covers.

A description that merely repeats the term name does not satisfy this. "Recipes"
as the description of a category called Recipes tells a reader nothing they did
not already have from the heading.

## How to verify

Read the term's description field. It should be non-empty and should say
something beyond the name itself.

Judging "says something beyond the name" is not mechanical. If the description
is a single word matching the term, treat the goal as unmet and say why.

## Hints

Look at the posts actually filed under the term before writing anything. The
description should describe what is there, not what the name suggests might be
there -- those diverge surprisingly often on sites that have been running a
while.

Two or three sentences is usually right. Say what the grouping covers and who
it is for. A description that reads like it was written to fill a field will be
obvious to everyone who sees it.

Match the site's existing voice, and its language: a site writing in Dutch
needs a Dutch description.

## Out of bounds

Do not rename the term, change its slug, or merge it into another. Those change
URLs and reassign content, which is a different decision entirely.

Do not write the description without showing it first. You can draft it -- that
is the useful part -- but the words end up on the site under the owner's name,
so they approve them.
