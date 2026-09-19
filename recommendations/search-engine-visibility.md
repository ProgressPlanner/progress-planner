---
id: search-engine-visibility
title: Let search engines index the site
category: seo
points: 1
priority: 5
capability: manage_options
repeats: never
per_item: false
reversible: true
verified_by: site_state
needs_confirmation: true
applies_when:
  - option_equals:
      blog_public: "0"
---

## Why it matters

WordPress has a single checkbox that asks search engines to stay away. It is
the right setting while a site is being built, and it is the most common reason
a finished site gets no search traffic at all: somebody ticked it before
launch and nobody unticked it afterwards.

While it is on, WordPress serves a `noindex` directive on every page and a
`robots.txt` that disallows everything. No amount of content, SEO plugin
configuration or link building will help, because nothing is being indexed.
Sites have sat like this for months.

## Goal

The site is not asking search engines to stay away.

The `blog_public` option is `1`, and the site's pages carry no site-wide
`noindex` directive.

There is one legitimate exception: a site that is genuinely not meant to be
found -- a staging copy, an internal intranet, a client site not yet launched.
For those the current setting is correct and the goal does not apply. That is a
judgement about intent, not something readable from the database.

## How to verify

Read the `blog_public` option. `0` means discouragement is on.

Then confirm against what the site actually serves, because the option is not
the only thing that can produce a `noindex`. Fetch the front page and one
published post and look for a robots meta tag or an `X-Robots-Tag` header, and
fetch `/robots.txt`. A site with `blog_public` set to `1` can still be
blocked by an SEO plugin's own setting, a theme, or server-level rules, and
that is worth reporting even though this option is correct.

Before reporting a failure, look for signs that the site is deliberately
hidden: a hostname containing `staging`, `dev`, `test` or `local`, an
`.htpasswd` or maintenance-mode plugin in front of it, or no published content
at all. Any of those makes the result undetermined rather than a failure --
say what you found and let a human decide.

If the site cannot be fetched over HTTP at all, report undetermined for the
served-response half and note that only the option was checked.

## Hints

Core WordPress, under Settings then Reading, labelled "Search engine
visibility". Unticking the box writes `1` to `blog_public`.

Note that the checkbox is worded as the negative -- ticked means discouraged --
so the option value and the checkbox state read in opposite directions.

If the option is already correct and pages still carry a `noindex`, the source
is elsewhere. Look at whichever SEO plugin is active, then the theme, then
server configuration. Check what this site has rather than assuming.

## Out of bounds

Do not flip this on a staging or development site. Making a staging copy
indexable creates duplicate content competing with the real site, and getting
it back out of the index is slow and tedious. When there is any doubt about
which environment you are looking at, stop and ask.

Do not change any other reading setting: not the front page, not the posts
page, not how many posts show.
