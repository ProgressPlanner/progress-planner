---
id: set-date-format
title: Set a date format that suits the audience
category: configuration
points: 1
priority: 7
capability: manage_options
repeats: never
per_item: false
reversible: true
verified_by: owner_confirmation
needs_confirmation: true
---

## Why it matters

Dates appear on posts, in archives, in comment threads and in the admin lists.
WordPress ships with the American long form, "F j, Y", which renders as
"September 18, 2026". For a site whose readers are British, Dutch or German,
that reads as foreign, and the numeric variants are worse: 09/18/2026 and
18/09/2026 are indistinguishable on the first twelve days of any month.
Visitors cannot tell how recent an article is if they have to work out which
number is the day.

## Goal

The `date_format` option is a deliberate choice rather than the untouched
WordPress default.

Any one of these satisfies it:

- the format differs from WordPress's built-in default for the site locale
- the format matches the locale default and a human has confirmed that is what
  they want

Both are legitimate end states. A site whose locale default is already right
does not need to change anything -- it needs somebody to look once and say so.

## How to verify

This cannot be verified by inspection, because there is no wrong value to
detect. `d/m/Y` and `m/d/Y` are both valid; which is right depends on who reads
the site, and only the owner knows that.

The goal is that the owner has looked at the setting once and said it is what
they want. So the check is whether that confirmation has happened, not what the
option contains.

Do not mark this satisfied because the value looks sensible.

## Hints

The useful contribution is showing them what the setting currently does, in
terms they can judge. Read `date_format` and render today's date through it, so
they see the actual output rather than a format string.

Then say what is worth knowing about it. Whether it matches the site's locale.
Whether it is still core's shipped default, which means nobody has chosen. And,
where the format is numeric and ambiguous -- `2026.09.18` reads as three
different dates depending on the reader -- that a written-out month removes the
ambiguity.

Offer the alternatives as rendered examples, not as format strings. "18
September 2026" is a choice someone can make; `j F Y` is not.

## Out of bounds

Do not choose a format on the owner's behalf. Regional date conventions are a
judgement about the audience, not a fact discoverable from the database.
Present the options with rendered examples and let a human pick.

Do not edit existing post dates, and do not touch the time format or the
timezone.
