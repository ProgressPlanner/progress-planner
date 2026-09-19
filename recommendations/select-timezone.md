---
id: select-timezone
title: Set the site timezone to a named city
category: configuration
points: 1
priority: 6
capability: manage_options
repeats: never
per_item: false
reversible: true
verified_by: owner_confirmation
needs_confirmation: true
---

## Why it matters

Everything time-related on a WordPress site is derived from the site timezone:
post publish times, scheduled posts, cron runs, comment timestamps, backup and
report windows. A site left on the install default reports times that are hours
away from the times its owner works in, so scheduled posts appear at the wrong
hour and nobody can tell whether a log entry is recent.

A fixed UTC offset is worse than it looks. It does not move with daylight
saving, so a site set to UTC+1 for Amsterdam is correct in winter and an hour
wrong all summer, twice a year without warning.

## Goal

The site timezone is a named region and city from the IANA database, matching
where the site's audience or business actually is.

Any one of these satisfies it:

- the `timezone_string` option holds a valid IANA identifier such as
  `Europe/Amsterdam`, `America/New_York` or `Asia/Tokyo`
- the site is genuinely UTC-based and `timezone_string` is set to `UTC`

A bare numeric offset stored in `gmt_offset` with an empty `timezone_string`
does not satisfy it, and neither do the legacy `Etc/GMT+N` entries -- both
freeze the site outside daylight saving.

## How to verify

This cannot be verified by inspection. A site can hold a perfectly valid
timezone that is the wrong one, and nothing observable distinguishes the two.

The goal is that the owner has looked at the setting once and confirmed it. The
check is whether that has happened.

One thing is worth reporting as genuinely wrong rather than unconfirmed: a site
running on a numeric UTC offset instead of a named zone. An offset does not
follow daylight saving, so scheduled posts drift by an hour twice a year.

## Hints

Show them what the setting means in practice. What time the site currently
thinks it is, and what the setting is -- a named zone such as
`Europe/Amsterdam`, or a bare offset.

If it is an offset, say why that matters: posts scheduled for 09:00 will
publish at 10:00 for half the year. That is concrete and worth acting on.

If it is a named zone, say which one and let them confirm. Do not guess the
right zone from the site's language or content -- a Dutch-language site may be
run from anywhere, and guessing produces a confident wrong answer.

## Out of bounds

Do not pick a timezone on the owner's behalf. Guessing from the server's own
timezone, the admin's browser, or the site's language will be wrong often
enough to matter, and a confidently wrong timezone silently misfires every
scheduled post from then on. Offer the likely candidates and let a human
choose.

Do not change the date format, the time format, or the week start day as part
of this -- they sit on the same settings screen and are separate decisions.

Do not shift existing post dates to "correct" them for the new zone.
