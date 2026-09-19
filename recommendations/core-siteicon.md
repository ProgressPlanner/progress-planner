---
id: core-siteicon
title: Set a site icon
category: configuration
points: 1
priority: 1
capability: manage_options
repeats: never
per_item: false
reversible: true
verified_by: site_state
needs_confirmation: true
applies_when:
  - option_empty: site_icon
---

## Why it matters

The site icon is the small image in a browser tab, in a bookmark list, on a
phone home screen and in the WordPress mobile apps. Without one, the browser
shows a generic document glyph, and a reader with a dozen tabs open cannot find
this site among them. Somebody who saves the site to their home screen gets an
unlabelled blank square.

WordPress generates the whole set of sizes from one upload, so this is a single
decision that covers favicon, Apple touch icon and app icon.

## Goal

The site serves an icon of its own.

Any one of these satisfies it:

- the `site_icon` option holds the ID of an existing attachment
- the theme or a plugin supplies the icon instead, and a request for the front
  page shows icon links in the head pointing at a real image

Any one is enough.

## How to verify

Read the `site_icon` option. An empty string or `0` means no icon is set --
note that core stores an absent icon as `0`, not as an empty value, so both
must be treated as unset.

If the option holds an ID, confirm that the attachment still exists. A site
that has had its media library pruned can hold a stale ID pointing at nothing,
which reads as configured and renders as nothing.

Then check what the site serves: fetch the front page and look in the head for
`icon`, `shortcut icon` and `apple-touch-icon` links, and confirm one of them
resolves. That catches both the stale-ID case and the case where a theme
supplies the icon while the option is empty.

If the front page cannot be fetched, the option check alone is a partial
answer -- say so rather than reporting a clean pass.

## Hints

Core WordPress, under Settings then General, in the "Site Icon" section. The
same control also appears in the Site Editor and in the Customizer on older
themes. It expects a square image of at least 512 by 512 pixels, and crops
anything else.

The image must exist in the media library before the option can point at it, so
uploading is part of the job.

Some themes and SEO plugins add their own favicon field. If icon links are
already being served from somewhere other than the core option, find out which
component is doing it before adding a second source -- two icon declarations
fighting each other is a worse state than one missing icon.

## Out of bounds

Do not choose or generate an image on the owner's behalf. The site icon is
branding: it appears next to the site's name everywhere, and an
auto-generated placeholder or a stock image picked by guesswork misrepresents
the site to everyone who sees a tab. A human supplies the image, or approves a
specific candidate already in the media library.

Do not upload anything to the media library as part of verifying this.

Do not crop, resize or replace an existing icon, and do not change the site
title or tagline while on this screen.
