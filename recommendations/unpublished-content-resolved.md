---
id: unpublished-content-resolved
title: 'Finish or discard the draft "{post_title}"'
category: content
points: 1
priority: 55
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
    - post_status: [draft, auto-draft]
  order: oldest_modified_first
---

## Why it matters

Drafts accumulate. Some are half-finished pieces worth completing, some were
superseded weeks ago, and a few are auto-drafts WordPress created when someone
opened the editor and changed their mind. Left alone they make the content list
harder to read and hide the two or three things actually worth publishing.

The point is not to empty the drafts folder. It is to make each draft a
decision rather than a maybe.

## Goal

The target is no longer sitting in draft: it has been published, scheduled, or
deleted.

The task is satisfied by any status other than `draft` or `auto-draft` -- and
that deliberately includes the post being gone. Discarding a draft that is not
going anywhere is a legitimate outcome, not a failure to finish it.

## How to verify

Read the target's status. Anything other than `draft` or `auto-draft` satisfies
it, including the post no longer existing.

Do not treat an edit as sufficient. A draft that was touched and left as a
draft has not resolved anything.

## Hints

Read the draft before saying anything about it. Whether it is worth finishing
depends on what it says, how complete it is, and whether the site has since
published something covering the same ground.

An auto-draft with an empty title and no body is almost always an accident and
can be discarded without much thought. A 2,000-word piece that stops mid-
sentence is a different conversation.

If it looks publishable, say what is missing rather than publishing it: a
heading with no content under it, a placeholder left in, an unfinished list, no
featured image where the theme expects one.

## Out of bounds

Do not publish the target. Publishing is the owner's decision even when the
draft looks finished, because you cannot know whether it was being held back
deliberately -- for a launch date, for a review, for a fact still being checked.

Do not delete it either without being asked. Recommend one course or the other
and let them choose.
