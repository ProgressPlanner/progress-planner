---
id: disable-comment-pagination
title: Turn off comment pagination
category: seo
points: 1
priority: 10
capability: manage_options
repeats: never
per_item: false
reversible: true
verified_by: site_state
needs_confirmation: false
applies_when:
  - option_not_empty: page_comments
---

## Why it matters

With comment pagination on, WordPress splits a post's comments across separate
URLs once they pass a threshold -- fifty by default. A post with 120 comments
becomes three URLs, each holding a slice of the same discussion.

That hurts twice. A reader following a thread has to click through pages to
read a conversation that was written as one, and replies get separated from
what they replied to. And a search engine now sees several near-identical URLs
for one article, with the article's own content repeated on each, which splits
whatever authority the page had earned across pages nobody wanted.

## Goal

A post's comments are served on the post's own URL, not split across paginated
comment URLs.

The `page_comments` option is off.

## How to verify

Read the `page_comments` option. A falsy value -- empty string, `0`, absent --
means pagination is off and the goal is met.

Confirm on the front end where you can: find the post with the most comments,
fetch it, and check that the comments are all present and that there is no
comment pagination navigation and no `?cpage=` or `/comment-page-2/` links in
the markup.

If the site has no posts with enough comments to trigger pagination, the option
is still worth turning off -- it will bite later -- but say that nothing is
currently paginated rather than reporting a live problem.

If the option cannot be read, report undetermined rather than inferring from a
page that simply has few comments.

## Hints

Core WordPress, under Settings then Discussion: "Break comments into pages with
N top level comments per page". Unticking it writes the empty value to
`page_comments`. The `comments_per_page` value next to it becomes irrelevant
once pagination is off, and can be left alone.

A very small number of themes paginate comments themselves regardless of this
option. If the option is off and the front end still shows comment pages, look
at the active theme's comments template rather than assuming the option was not
saved.

If a site genuinely has threads of many hundreds of comments and turning
pagination off makes those pages very heavy, that is a real trade-off worth
raising -- but it is rare, and the paginated version was not better for
readers.

## Out of bounds

Do not delete or trash comments to make pages shorter. The comments are
content.

Do not change the comment nesting depth, the comment ordering, or the default
comment status while you are here.
