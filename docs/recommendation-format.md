# Recommendation format

A proposal, derived by writing all 49 existing PHP providers out as markdown
and seeing which fields the set actually needed. The numbers below are counts
over those 42 files, not estimates.

49 providers became 42 rules: every Yoast recommendation has an All in One SEO
twin expressing the same goal, and once a rule states an outcome instead of a
setting, the pair collapses into one file. That collapse is the first evidence
the approach works.

---

## The shape

```yaml
---
id: attachment-pages-not-indexed      # stable; the completion key
title: Turn off attachment pages      # dashboard display; may interpolate
category: seo                         # seo | content | configuration | maintenance
points: 1
priority: 30                          # ordering, as menu_order today
capability: manage_options            # who may act on it
repeats: never                        # never | weekly
per_item: false                       # true = a template, one task per target
reversible: true
verified_by: site_state               # site_state | owner_confirmation
needs_confirmation: false             # must a person approve before acting
applies_when:
  - any_plugin_active: [yoast-seo, all-in-one-seo-pack]
---

## Why it matters
## Goal
## How to verify
## Hints
## Out of bounds
```

Five body sections, every file, same order. Nothing needed a sixth.

---

## The two findings that shaped it

### 1. `verified_by` is the load-bearing field

Two kinds of goal, and conflating them is what made earlier drafts awkward.

**`site_state`** (30 rules) -- the site can answer. Attachment pages, archives,
feeds, orphaned content, page roles. The check reads an option, queries
content, or fetches a URL.

**`owner_confirmation`** (12 rules) -- the site cannot answer, and should not
pretend to. Date format, timezone, locale, valuable content types.

The second group is the interesting one. `d/m/Y` and `m/d/Y` are both valid
date formats; which is right depends on who reads the site. There is no wrong
value to detect, so the existing PHP checks the activity log instead -- "has
the owner looked at this yet?" That is not a missing state check, it is the
correct check for the goal. Many new WordPress users do not know the setting
exists; the recommendation exists to make them look once.

So `verified_by: owner_confirmation` says plainly: do not mark this satisfied
because the value looks sensible.

For these, the model's contribution is **showing, not judging**. Render today's
date through the current format so they can see it. Say that a numeric format
is ambiguous to overseas readers. Say that a bare UTC offset will drift by an
hour twice a year. Then let them confirm.

### 2. Structured fields are read by the model, not by PHP

Writing 42 files produced 13 distinct `applies_when` predicates, 9 uses of
which were a single one (`any_plugin_active`). The six per-item rules produced
a further 10 keys under `target.find`, 7 used exactly once.

That looked like runaway DSL growth, and it would be -- **if PHP had to
implement each key**. A vocabulary of 23 keys means a compiler, a migration
path when a rule uses a key an older client does not know, and at least one
key (`incoming_internal_links`) that cannot be implemented generically at all,
because counting inbound links means reading an SEO plugin's link index.

It is not a problem when the **model** reads these fields.

`not_modified_for: 6 months` and `order: oldest_modified_first` are easier for
a model to act on than the same thing in a paragraph: unambiguous, and close to
the query arguments it will build. Prose invites interpretation; structure does
not. So the structured form earns its place as **precision for the model**,
not as instructions for an interpreter.

Consequences:

- **No query engine in the plugin.** Nothing parses `find:` or `applies_when:`
  to run a query.
- **New keys cost nothing.** A rule that needs `has_custom_field` just uses it.
  No plugin release, no version skew.
- **The vocabulary can stay loose.** It is a convention for authors and a hint
  for the model, not an interface PHP must satisfy.

This does mean server-defined recommendations require an AI connection to
produce their tasks. That is accepted: these are the AI-facing recommendations,
and the existing PHP providers continue to serve a site with no connection.

---

## Per-item rules

Six rules are templates rather than single recommendations. `review-stale-content`
produces up to ten tasks, one per stale post, each with its own title.

```yaml
per_item: true
title: 'Review {post_type} "{post_title}"'
target:
  type: post
  identified_by: target_post_id
  max_open: 10
  find:
    - post_type: any
      has_page_role: true
      not_modified_for: 6 months
    - post_type: [post, page]
      not_modified_for: 12 months
  order: oldest_modified_first
```

`title` interpolation is required here: a static string cannot express
`Review page "About Us"`.

`find:` is structured because that is the clearest way to tell a model what to
look for, not because anything parses it. The model reads the block and builds
the query itself with the abilities it already has.

---

## What this says about the product

**30 of 42 rules need human confirmation.** Not a limitation of the format; the
real shape of the work. Most site improvements are decisions, not settings.

**11 rules are fully autonomous** -- observable state, no confirmation needed:

- the six SEO indexability and feed rules
- `disable-comment-pagination`
- the three `set-page-*` role recordings
- `attachment-pages-not-indexed`

That bounds what "use the plugin entirely through AI" can mean. An agent can
find, diagnose, draft and explain across all 42. It can act alone on 11.

---

## Settled

1. **`target.find` and `applies_when` are read by the model** (option B of
   three: declarative-with-PHP-engine, declarative-with-model,
   prose-with-model). Structure without an interpreter.
2. **Transport** is the plugin's own implementation detail. Base64 inside
   whatever envelope is used is fine; the open part is only whether the server
   validates rules once at publish time or every client parses and fails
   independently.
3. **Semantic differences** introduced by collapsing Yoast/AIOSEO pairs are
   decisions for whoever authors a rule, not format questions.
4. **`select-locale`** losing its browser-header trigger is acceptable: the
   header was a heuristic for *when to ask*, and the goal is that the owner
   confirms.

Still to write: `core-permalink-structure` should read the current value and
weigh how much content exists, rather than firing only on the pristine default.
Changing permalinks on an established site breaks every inbound link and
WordPress creates no redirects, so the recommendation is sound on a new site
and bad advice on one with hundreds of posts. That judgement belongs in the
rule's Hints, and it is the kind of thing a model can weigh and a `strpos`
cannot.

---

## Noted, not changed

`remove-terms-without-posts` deletes terms with zero **or one** post
(`MIN_POSTS = 1`, `count <= MIN_POSTS`, in both the collector and the
provider). On a test site it matched four terms, two of which had a published
post. `wp_delete_term()` has no trash. The rule was written to match the code
rather than the name, and titled "barely used" rather than "without posts".
Left alone per instruction.

Two smaller inconsistencies, also unchanged: the `set-page-*` AJAX handler
checks `manage_options` while its script enqueue gates on `edit_others_posts`;
`sending-email`'s `should_add_task()` returns true unconditionally.
