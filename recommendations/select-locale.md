---
id: select-locale
title: Match the site language to its audience
category: configuration
points: 1
priority: 8
capability: install_languages
repeats: never
per_item: false
reversible: true
verified_by: owner_confirmation
needs_confirmation: true
---

## Why it matters

The site language drives more than the admin menus. It selects which
translation files load, which in turn sets the default date format, the
decimal and thousands separators, the sort order of alphabetical lists, and
every string a theme or plugin has translated. A Dutch site running on
`en_US` shows English plugin notices to Dutch editors and American date
formats to Dutch readers.

The install default is whatever the installer clicked past, which is very
often English regardless of who the site is for.

## Goal

The site language matches the language the site is actually written in and read
in.

Any one of these satisfies it:

- `WPLANG` (the "Site Language" setting) holds the locale of the site's
  content, with its translation files installed
- the site is genuinely English-language and the setting is an English locale
- a multilingual plugin owns language selection, the site language is set to
  the primary language, and the plugin handles the rest

Any one is enough.

## How to verify

This cannot be verified by inspection. The site language can be set correctly
or incorrectly and look identical either way.

The goal is that the owner has looked at the setting once and confirmed the
site is in the language they intend.

The original check compared the site locale against the visiting browser's
`Accept-Language` header. That signal is per-request and unavailable when
checking out of band, so do not attempt to reconstruct it. Whether the owner
has confirmed is the check.

## Hints

Show them what is set and what it affects. The site language governs the admin
interface, the date and time formats core falls back to, and the language
WordPress declares in the page markup for search engines.

If the site's published content is clearly in one language while the setting
says another, that is worth raising specifically, with an example: "your posts
are in Dutch but the site language is English (United States), so search
engines are told the wrong thing."

Do not change the language. Installing a language pack alters the admin
interface for everyone who logs in, and that is not a change to make on
someone's behalf.

## Out of bounds

Do not switch the site language without a human's agreement. It changes what
every editor sees in the admin and what every visitor reads, and on a site with
translated content it can leave strings mismatched against the content. Report
the mismatch and let a human confirm the target locale.

Do not translate existing content, and do not install a multilingual plugin as
part of this task.
