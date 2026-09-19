---
id: update-core
title: Perform all pending updates
category: maintenance
points: 1
priority: 20
capability: update_core
repeats: weekly
per_item: false
reversible: false
verified_by: site_state
needs_confirmation: true
---

## Why it matters

WordPress, its plugins and its themes all publish security fixes as ordinary
updates, and the fix is public the moment it ships. The changelog and the diff
tell anyone who is interested exactly what was wrong, which is why exploitation
of a known plugin vulnerability typically begins within days of the release,
against sites that have not applied it.

Delay compounds in a second way. A site three versions behind updates in one
jump across three sets of breaking changes, so the update that was routine in
week one becomes a project in month six. Keeping current is the cheapest way to
keep it routine.

## Goal

The site has no pending updates: core, plugins, themes and translations are all
at the versions available to it.

A deliberate exception is a legitimate end state, but only when it is recorded.
A plugin pinned because its next version breaks the site, or core held back
during a migration window, is a decision -- it needs to be a stated decision
rather than a forgotten one.

Updates are not reversible in any simple sense. A plugin update can run a
database migration that the previous version cannot read, so rolling back means
restoring a backup, not reinstalling the old version.

## How to verify

Ask WordPress what it thinks is pending, rather than comparing version numbers
by hand. Core keeps the answer in its update transients and exposes it as a
count, refreshed by a scheduled check; that count is the same one the admin
screens show.

The count can be stale. If it has not been refreshed recently, force the check
before reading it -- an answer of zero from a week-old transient means nothing.

The goal is met when the total is zero.

If the site is under managed hosting or version control that handles updates
outside WordPress, the count may be correct and the goal still not yours to
act on. Report it as undetermined and ask, rather than updating and finding
your change reverted on the next deploy.

You may decide all of the reading on your own: refresh the check, read the
counts, report exactly which components are behind and by how much, and read
their changelogs to say what each update contains. You must ask before applying
anything. A major version bump of core or of a plugin the front end depends on
can break the site, and whether now is the moment -- mid-campaign, mid-sale,
Friday afternoon -- is the owner's call and not visible from inside the code.

## Hints

Core WordPress, under Dashboard then Updates, does all four kinds from one
screen.

Order matters when several are pending: core first, then plugins, then themes.
Plugins commonly declare a minimum core version, and updating them against old
core is how a site ends up with a fatal error on a page nobody visits often.

Check for a working backup before starting, and check that you can restore it
-- an untested backup is a hope, not a rollback plan.

Some sites have automatic updates configured for minor core releases, or a host
that applies security releases for you. Look at what is already happening
before doing it manually.

## Out of bounds

Do not apply updates without agreement, and do not apply them one at a time
while nobody is watching the front end.

Do not enable automatic updates as a way of closing this out. That changes the
site's update policy, which is a bigger decision than the pending queue.

Do not update PHP, the database server, or anything outside WordPress.

Do not install anything new, and do not delete a plugin because its update
looks risky.
