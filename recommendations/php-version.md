---
id: php-version
title: Run a supported PHP version
category: maintenance
points: 1
priority: 25
capability: manage_options
repeats: never
per_item: false
reversible: true
verified_by: site_state
needs_confirmation: true
---

## Why it matters

PHP versions stop receiving security fixes on a published schedule. Once a
version is past its end of life, newly discovered vulnerabilities in the
interpreter itself are never patched for it, and the site is exposed by its
platform rather than by anything in its own code.

Old versions also cost performance -- each recent PHP release has been measurably
faster than the last on WordPress workloads -- and they run out of
compatibility. Plugins and themes raise their minimum requirements over time,
and a site on an old interpreter eventually cannot take updates, including
security updates. That is the trap: the version is too old to update, so it
stays too old.

## Goal

The site runs PHP 8.2 or newer.

## How to verify

Read the PHP version the site is running and compare it against 8.2, using a
version comparison rather than a string or numeric one -- "8.10" is newer than
"8.2" and a naive comparison gets that backwards.

Take the version from the running interpreter, not from a host's dashboard or a
documented plan, since a site can be on a different version from what its
control panel advertises. Where CLI and web access are both available, check
both: they are frequently different versions, and it is the web one that serves
visitors.

Report the exact version found, not just pass or fail, since the gap matters.
A site on 8.1 is a routine upgrade; a site on 7.4 or older is running an
interpreter that has been unsupported for years.

**This cannot be fixed from within WordPress.** PHP is chosen at the server or
host level, and no amount of plugin code can change which interpreter is
executing it. The outcome of this check is a report: the version in use,
whether it is still supported upstream, and the fact that the change is made in
the hosting control panel or by the host. Do not describe it as something the
site can do to itself.

If the version cannot be determined, report undetermined rather than assuming.

## Hints

Most hosts expose a PHP version selector in their control panel, often
per-domain, and switching is usually a matter of seconds with an immediate
effect. Some hosts require a support request instead.

Before recommending the switch, the relevant question is compatibility: an old
site may have plugins, themes or custom code that use syntax removed in newer
PHP. WordPress's own Site Health screen reports the version and flags known
issues, and a staging copy on the target version is the honest way to find out.
Check what tooling the site actually has for that rather than assuming a
staging environment exists.

Jumping several major versions at once -- 7.x straight to 8.2 -- is where
breakage lives, because PHP 8.0 removed a lot. Stepping through is sometimes
easier to debug.

## Out of bounds

Do not attempt to change the PHP version, and do not edit `.htaccess`,
`.user.ini`, `php.ini` or any server configuration to try. On many hosts those
edits are ignored; on some they break the site.

Do not deactivate or update plugins and themes speculatively to prepare for a
version you have not been asked to move to.

Do not report this as fixed. It is fixed when someone with host access changes
it and the site still works.
