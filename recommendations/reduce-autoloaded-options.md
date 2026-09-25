---
id: reduce-autoloaded-options
title: Reduce the number of autoloaded options
category: maintenance
points: 1
priority: 50
capability: manage_options
repeats: never
per_item: false
reversible: false
verified_by: site_state
needs_confirmation: true
applies_when:
  - autoloaded_option_count_above: 500
---

## Why it matters

WordPress loads every option marked for autoload on every single request,
including requests that will never look at any of them. That is one query, but
its result is unserialised into memory each time, so the cost is paid by the
front page, by every AJAX call, by every cron run.

The count grows without anyone adding to it deliberately. Plugins autoload
settings they only read on their own admin screen; plugins that have been
deleted leave their options behind, still autoloading, forever; caches and
transients get written as autoloaded options by code that should have known
better. A site with several thousand of them is loading a few hundred kilobytes
of data it never reads, on every request.

## Goal

The site's autoloaded options are within a sensible size -- as a working line,
fewer than about 500 entries, and not dominated by a handful of very large
values.

Any one of these is a real outcome:

- the offending options have been removed, because they belong to plugins that
  no longer exist
- options that are only read on specific screens have been switched from
  autoload to on-demand loading
- the owner has looked at what is autoloading, judged it necessary, and
  recorded that -- some sites legitimately have a lot

Count is the rough signal, not the real one. Two hundred options where one
holds a two-megabyte serialised array is a worse problem than eight hundred
small ones.

## How to verify

Read the options table for rows whose autoload value is one of the "yes"
variants WordPress recognises -- it has more than one, and counting only the
literal string `yes` undercounts on modern installs. Count them, and total
their sizes.

Report both numbers, plus the largest handful by size with their names. The
names are what make the result actionable: "1,400 autoloaded options" tells
nobody anything, whereas "620 of them are `wc_session_*` rows" points straight
at the cause.

Whether the result is acceptable is partly a judgement. A large WooCommerce
site sits higher than a brochure site and is not broken. Treat a count near the
threshold as a finding to report rather than a pass or fail, and say what is
driving it.

You cannot verify from the count alone that removing a given option is safe.
That requires knowing which plugin owns it and whether that plugin is still
installed.

## Hints

The AAA Option Optimizer plugin is built for exactly this: it records which
options are actually read during requests, so it can distinguish an option that
autoloads and is used from one that autoloads and is never touched. That
distinction is the whole difficulty, and it cannot be had from the database
alone. Check whether it is already installed before suggesting it, and check
whether the site has something else doing the same job -- several performance
plugins include an option inspector.

Orphaned options are the safest wins. Find the prefix, work out which plugin
used it, confirm the plugin is gone from the filesystem, and those rows are
dead weight.

Transients written as autoloaded options are the second easy case. They are
meant to expire; if they are autoloading, something wrote them wrongly.

Switching an option from autoload to on-demand is gentler than deleting it: the
value stays, WordPress just stops loading it unprompted. Prefer that where you
are not certain.

## Out of bounds

Do not delete options on your own judgement. An option name gives no reliable
indication of what depends on it, and a plugin that finds its settings missing
can silently revert to defaults -- which on a live site can mean a payment
gateway in test mode or a cache serving stale pages.

Do not write directly to the options table with SQL. Use the options API, so
caches invalidate and hooks fire.

Do not delete a plugin because its options are large. That is a different
decision.

Do not install a plugin to fix this without asking -- adding code to reduce
load is a trade the owner should agree to.
