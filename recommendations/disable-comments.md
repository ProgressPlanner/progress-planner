---
id: disable-comments
title: Stop opening comments on new content
category: maintenance
points: 1
priority: 9
capability: manage_options
repeats: never
per_item: false
reversible: true
verified_by: site_state
needs_confirmation: true
applies_when:
  - option_equals:
      default_comment_status: open
  - comment_count_below: 10
  - plugin_not_active: comment-free-zone
---

## Why it matters

WordPress opens comments on new posts by default. On a site where nobody
comments, that default produces no discussion and a steady trickle of spam
instead. Every post carries an empty comment form, moderation queues fill with
rubbish that somebody has to clear, and the markup and requests the comment
form brings with it are loaded on every page for nothing.

The evidence for whether a site needs comments is the site's own history. A
site with a handful of approved comments across its whole archive is not
hosting a conversation.

## Goal

New posts and pages are not created with comments open.

The default comment status for new content is `closed`.

Any one of these satisfies it:

- WordPress's own default is set to closed
- a plugin whose job is to switch comments off is active and doing so

Either is enough. The mechanism does not matter; what matters is that the next
post published does not arrive with an open comment form.

This goal is about the default for *new* content. Existing posts with comments
already open are out of scope, and existing approved comments stay published.

## How to verify

Read the default comment status as WordPress reports it. `closed` means the
goal is met.

Before deciding whether the goal even applies, count the site's approved
comments. A site with real discussion -- say ten or more approved comments --
has answered this question for itself, and the recommendation should not fire.
Report it as not applicable rather than as a pass or a fail.

Also check whether a comment-disabling plugin is already active. If one is, the
core option may still read `open` while comments are in fact off everywhere.
Confirm by fetching a published post and looking for a comment form in the
markup; the served page is the better answer.

If the comment count cannot be read, report undetermined -- without it there is
no way to tell an unwanted default from a deliberate choice.

## Hints

The core setting is under Settings then Discussion, the first checkbox:
"Allow people to submit comments on new posts". Unticking it writes `closed` to
`default_comment_status`.

For a site that wants comments gone entirely rather than just defaulted off,
the Comment-Free Zone plugin does that in one step, and several other plugins
in that space do the same. Look at what the site already has before installing
anything -- a site may already have such a plugin installed but deactivated, or
have a theme that handles it.

Multisite installations and sites where the current user cannot install plugins
are limited to the core setting.

## Out of bounds

Do not delete, trash or unapprove existing comments. A site's comment history
is content, and the fact that there is little of it is the reason for this
recommendation, not a licence to remove it.

Do not close comments on existing published posts in bulk. That is a separate,
larger decision.

Do not touch pingback and trackback settings, comment moderation rules, or the
comment blocklist.

Do not install a plugin without asking first.
