---
id: set-valuable-post-types
title: Choose which content types count as valuable
category: configuration
points: 1
priority: 70
capability: manage_options
repeats: never
per_item: false
reversible: true
verified_by: owner_confirmation
needs_confirmation: true
---

## Why it matters

Progress Planner tracks and rewards publishing activity, and it has to know
which content types to count. A site's public post types are rarely all
equivalent: a shop has products, an agency has case studies, a site with a
slider plugin has a `slide` post type that exists purely to hold images. Count
everything and the numbers become meaningless -- a burst of twenty slides
reads as twenty pieces of work. Count too little and real publishing goes
unrecorded.

The selection also needs revisiting over time. Installing a plugin can add a
new public post type, and that type has never been ruled in or out.

## Goal

The set of content types that count as valuable has been chosen explicitly,
and covers every public post type currently registered on the site.

Any one of these satisfies it:

- the selection is stored and includes a decision for each public post type,
  whether in or out
- the site has a single public post type and it is selected

An empty selection does not satisfy it, and neither does a selection made
before post types were added that does not account for the new ones.

## How to verify

This cannot be verified by inspection. Which content types count as valuable is
a statement about what the site is for, and no inspection of the site can
settle it.

The goal is that the owner has looked at the list once and said which types
matter. The check is whether that choice has been recorded.

A recorded choice satisfies this even if it looks surprising. A site that
excludes posts and counts only a portfolio type has made a deliberate decision.

## Hints

Show them what the site actually has before asking. List the public content
types with how much is published in each, so the question is concrete rather
than abstract -- a type with 200 items and a type with two are different
conversations.

Say what the setting drives: these are the types counted towards content
activity, the score, and the writing streak. Without that context the question
reads as arbitrary.

If a new content type has appeared since the last time this was set -- a plugin
that registered one -- name it, because that is usually why the question has
come back.

Do not choose on their behalf. Posts and pages is a reasonable default to
suggest; it is not an answer you can record for them.

## Out of bounds

Do not choose the selection on the owner's behalf. Which content types
represent real work is a judgement about how the site is run, and getting it
wrong distorts every score and streak the plugin reports from then on -- quietly,
and in a way nobody will trace back to this setting. Present the registered
types with what each one is used for and let a human tick the boxes.

Do not register, unregister or change the visibility of any post type.

Do not delete or modify content of any type, and do not touch the site's other
Progress Planner settings.
