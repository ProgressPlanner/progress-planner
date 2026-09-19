---
id: review-stale-content
title: 'Review {post_type} "{post_title}"'
category: content
points: 1
priority: 40
capability: edit_others_posts
repeats: weekly
reversible: true
verified_by: owner_confirmation
needs_confirmation: false

# This rule is a template, not a single recommendation: it produces one task
# per stale item. Each task is identified by its target, so completing the
# review of one post says nothing about the others.
per_item: true
target:
  type: post
  identified_by: target_post_id
  max_open: 10
  find:
    # Pages carrying a declared role are reviewed sooner: an out-of-date
    # About or Contact page costs more than an old blog post.
    - post_type: any
      has_page_role: true
      not_modified_for: 6 months
    - post_type: [post, page]
      not_modified_for: 12 months
  order: oldest_modified_first
---

## Why it matters

Content goes quietly out of date. Prices change, links rot, screenshots show a
version of the product nobody uses any more, and the advice that was right two
years ago is now subtly wrong. None of that produces an error -- the page keeps
serving, and keeps being found, while slowly becoming a liability.

Reviewing on a rhythm keeps the site honest without anyone having to remember
which pages are getting old.

## Goal

The target has been read by a person who decided what it needed, and either
updated it or concluded it was still correct.

This is deliberately not "the post was modified". A timestamp bump is not a
review, and a review that concludes "this is still accurate" is a real outcome
that leaves no trace in the content.

## How to verify

This one cannot be verified from the site. Nothing observable distinguishes a
reviewed page from an unreviewed one, and nothing should: the work is
judgement, and the record of it is the person's decision.

So do not mark this complete on your own. You may do the reading and propose
what should change -- that is genuinely useful -- but the person confirms the
review happened. If they say they have reviewed it, that is the evidence.

## Hints

Read the target and say what is actually wrong with it, specifically. Dates and
years that have passed, links that no longer resolve, prices or figures,
product or feature names that have since changed, screenshots described in
alt text that no longer match, and claims that were time-bound when written.

"This page could be refreshed" is not worth reading. "The pricing section says
€29, the site now charges €39, and the 2024 roadmap link 404s" is.

If the content is genuinely still accurate, say that plainly. An unnecessary
edit is worse than none.

## Out of bounds

Do not rewrite the target without being asked. Do not change its status, its
slug, or its publication date -- a URL change costs incoming links, and a date
change misrepresents when the work was done.
