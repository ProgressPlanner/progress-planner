---
id: seo-plugin-installed
title: Use an SEO plugin
category: seo
points: 1
priority: 20
capability: manage_options
repeats: never
per_item: false
reversible: true
verified_by: site_state

# Installing and activating a plugin adds code to the site and is the owner's
# decision, not something to be done on their behalf while checking a box.
needs_confirmation: true

# No conditions. This is the rule the SEO-plugin-dependent recommendations
# depend on, so it has to apply to a site that has nothing installed yet.
applies_when: []
---

## Why it matters

WordPress on its own gives you very little control over what search engines
see. There is no way to set a title or description separately from the post
title, no sitemap beyond the bare core one, no per-page indexing control, and
no structured data describing who publishes the site. An SEO plugin supplies
all of that, and most of the other recommendations in this category are
settings that only exist once one is active.

## Goal

The site has an SEO plugin installed and active.

Any established SEO plugin satisfies this. Among the ones commonly seen on
WordPress sites: Yoast SEO, All in One SEO, Rank Math and SureRank. That list
is illustrative, not exhaustive -- another plugin that manages titles, meta
descriptions, sitemaps and robots directives counts too.

Exactly one is the right number. Two SEO plugins running together produce
duplicate meta tags and conflicting sitemaps, which is worse than having none.

## How to verify

List the site's active plugins and look for one whose job is SEO. Checking for
a plugin's defined constants or loaded main class is a reasonable secondary
signal, and catches a plugin installed somewhere the plugin list does not
report from, such as an `mu-plugin` directory.

Installed but deactivated does not count: an inactive plugin emits nothing.

If more than one is active, report that. The goal is technically met, but the
overlap is a real problem and worth surfacing.

## Hints

The site owner may have a preference, or their host may already bundle
something. Ask before choosing.

If the site is a multisite installation, or the current user cannot install
plugins, the install cannot be done from here. Say so and let the owner or
network administrator handle it rather than looking for a way around the
restriction.

Some themes and page builders ship partial SEO features, which can make it look
as though a plugin is present. Check the active plugin list rather than
inferring from the presence of a meta description in the markup.

## Out of bounds

Do not install or activate a plugin unless you have been asked to. Presenting
the recommendation, naming the usual options and stopping is the complete
action here.

Do not replace an SEO plugin that is already active with a different one, and
do not deactivate one to install another. Migrating between SEO plugins moves
stored metadata and can lose it; that is a deliberate project, not a step in
satisfying this goal.
