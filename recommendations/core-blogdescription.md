---
id: core-blogdescription
title: Set the site tagline
category: configuration
points: 1
priority: 2
capability: manage_options
repeats: never
per_item: false
reversible: true
verified_by: site_state
needs_confirmation: true
---

## Why it matters

The tagline is the site's one-line description of itself. WordPress puts it in
the RSS feed, in the site's schema output, and many themes print it under the
site title or in the footer. Left empty, those places either fall silent or
show nothing where a sentence was expected. Left at the WordPress install
default -- "Just another WordPress site" -- it actively says the site was never
configured.

## Goal

The site has a tagline that describes what this particular site is about.

Any one of these satisfies it:

- the `blogdescription` option holds a non-empty string that is not the
  WordPress install default
- the site uses a theme or plugin that supplies the description from somewhere
  else, and a request for the front page shows a real description in the
  markup and the feed

Any one is enough. What matters is that something meaningful is there, not
where it is stored.

## How to verify

Read the site description as WordPress reports it, then compare. Empty string
is a fail. "Just another WordPress site", or its translated equivalent for the
site locale, is also a fail -- it is the untouched default, not a choice.

Anything else passes. Do not judge the wording's quality; a short, odd or
unfashionable tagline is still a tagline the owner chose.

If the site description cannot be read at all, report undetermined rather than
guessing from the page title or the theme's output.

## Hints

This is core WordPress. The value lives under Settings then General, labelled
"Tagline", and is stored in the `blogdescription` option.

A few themes and multilingual plugins override what is shown on the front end
while leaving the option itself empty. Check what the site actually renders
before concluding the option is the only thing that counts, and if a
translation plugin owns the string, set it where that plugin expects it rather
than fighting it.

## Out of bounds

Do not invent a tagline and save it. This is the owner's description of their
own site, in their own words, and a plausible-sounding guess is worse than a
blank field because nobody will notice it needs fixing. Propose wording if
asked, but a human chooses the final text.

Do not touch the site title, the site URL, or the admin email while you are on
this screen.
