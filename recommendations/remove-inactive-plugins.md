---
id: remove-inactive-plugins
title: Remove the plugins that are installed but not active
category: maintenance
points: 1
priority: 60
capability: manage_options
repeats: never
per_item: false
reversible: false
verified_by: site_state
needs_confirmation: true
applies_when:
  - is_multisite: false   # on multisite, plugins may be inactive here and active on another site
---

## Why it matters

An inactive plugin does not run, but its files still sit in
`wp-content/plugins`, and they are still reachable over HTTP. When a
vulnerability is published for a plugin, the exploit usually targets a file
directly rather than going through WordPress, so an inactive plugin with a
known hole is as exposed as an active one -- and nobody is watching it, because
it is not in use and its updates get ignored.

They also make every real question harder to answer. A plugins screen with
thirty entries and eight of them dormant means nobody can say what the site
actually depends on, and "is this still needed?" turns into an archaeology
exercise with each passing year.

## Goal

Every plugin installed on the site is active, or has been deleted.

Deleting is the outcome, not deactivating: these plugins are already
deactivated, and that is the problem. A plugin that the owner wants to keep
around for a reason -- a licence they are mid-renewal on, a tool used once a
year -- is a legitimate exception, and the right answer there is to record the
reason rather than delete it.

Deletion is not reversible. WordPress removes the plugin's files, and many
plugins run an uninstall routine that drops their database tables and options
as well. Reinstalling gets the code back, not the data.

## How to verify

List the installed plugins with their active state and compare. The goal is met
when no installed plugin is inactive.

Two cases are not failures and should be reported as such rather than acted on:

- a plugin deactivated moments ago by an update or a troubleshooting session,
  which somebody is in the middle of
- a must-use or drop-in plugin, which has no active state to read

On multisite the whole check is unsafe and the goal does not apply. A plugin
inactive on this site may be active on another site in the network, or
network-activated, and deleting its files breaks those sites. This is why the
condition excludes multisite -- if you find yourself on a network install,
stop.

## Hints

Core WordPress, under Plugins, filtered to "Inactive". Deleting from there runs
the plugin's own uninstall hook, which is what you want: it cleans up after
itself rather than leaving orphaned tables.

Before deleting, look at what each one is. A plugin's own settings page or
readme usually makes clear whether it was a trial, a replaced alternative, or
something seasonal. Say what you found for each, so the owner is deciding on
facts rather than a list of slugs.

Check for a backup first. Not because deletion is likely to go wrong, but
because plugin uninstall routines vary in how much they take with them, and
some take their content -- a form plugin's submissions, a gallery plugin's
albums -- which does not come back with a reinstall.

## Out of bounds

Ask before deleting anything. Plugin deletion cannot be undone, and the data
loss is the part that surprises people.

Do not activate an inactive plugin to "resolve" the count. Activating untested
code on a live site is a larger change than the one being asked for, and the
goal is about what is installed, not what is running.

Do not touch active plugins, do not update anything as part of this, and do not
delete themes.

Do not delete plugin files directly over SFTP or the filesystem when the admin
route is available. Skipping the uninstall hook is what leaves the orphaned
tables behind.
