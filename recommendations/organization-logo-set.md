---
id: organization-logo-set
title: Add a logo for your organization
category: seo
points: 1
priority: 20
capability: manage_options
repeats: never
per_item: false
reversible: true
verified_by: site_state

# An image has to be chosen, and only the site owner knows which one is the
# organization's logo. Nothing may be picked on their behalf.
needs_confirmation: true

# Two layers, both required. The rule is meaningless without an SEO plugin
# that publishes organization markup, and it is the wrong question on a site
# that represents a person rather than a company -- there the equivalent
# setting is a personal avatar, which is a different recommendation.
applies_when:
  - any_plugin_active: [yoast-seo, all-in-one-seo-pack]
  - represents: organization
---

## Why it matters

Search engines read a site's organization markup to work out who publishes it,
and use the logo in knowledge panels, in some result layouts, and wherever the
publisher is shown alongside the content. Without one, the site publishes
structured data that names an organization and then cannot show it.

## Goal

The active SEO plugin has an organization logo set, and the image it points at
still exists in the media library.

The second half matters: a logo whose attachment has since been deleted leaves
the setting populated and the markup broken, which looks fine in the settings
screen and fails everywhere else.

## How to verify

Read the organization logo setting from whichever SEO plugin is active, then
confirm the ID or URL it holds resolves to an attachment that is really there.

Do not treat a non-empty setting as sufficient on its own.

## Hints

Both major SEO plugins store this under their site-representation or knowledge-
graph settings, and the setting name usually contains "logo". Which one holds
it depends on whether the site is configured as a company or a person -- this
rule only applies to the company case.

A site logo may already be set in the WordPress customizer, and is often the
right image. Suggest it rather than assuming it: the organization logo and the
site's visual header logo are not always the same asset, and a wide header
lockup frequently fails the square-ish shape search engines expect.

## Out of bounds

Do not upload, generate, crop or otherwise invent a logo. If no suitable image
exists in the media library, say so and stop -- the answer is for the owner to
supply one, not for it to be produced.

Do not change whether the site represents a company or a person. That is a
decision about the site's identity, and changing it to make this rule apply
would be backwards.
