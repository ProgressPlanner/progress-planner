---
id: set-page-faq
title: Record which page is the FAQ page
category: content
points: 1
priority: 10
capability: manage_options
repeats: never
per_item: false
reversible: true
verified_by: site_state
needs_confirmation: false
---

## Why it matters

An FAQ page answers the questions people ask before they buy or sign up:
delivery times, returns, what is included, whether it works with what they
already have. On a shop it does measurable work, because each unanswered
question is a reason not to complete the order.

Unlike About and Contact, plenty of sites legitimately do not have one. That
makes recording the answer more useful rather than less: without it, nobody can
tell whether the site has an FAQ page that nobody is maintaining, or has
deliberately decided it does not need one.

The record matters because other work depends on it. A page carrying a declared
role gets reviewed on a shorter cycle, which is exactly what an FAQ page needs
-- its answers go stale faster than most content on the site.

This goal is only about the record. It does not ask for a page to be written,
improved, or moved.

## Goal

The site's FAQ page role is resolved: either a specific existing page is
recorded as the FAQ page, or the site is recorded as not needing one.

Both are real outcomes, and for this role "not needed" is a common and
perfectly good answer. A personal blog, a portfolio, or a site whose questions
are answered on each product page does not need a separate FAQ page.

What does not satisfy it is the role being left unanswered, and neither does
recording a page that is not actually the FAQ page.

## How to verify

Read the recorded page role and check it resolves to a published page that is
plausibly the FAQ page, or to an explicit "not needed".

Deciding which page that is, is the actual work, and it is not a keyword match.
Searching for "FAQ" finds every page that links to the FAQ, plus product pages
with a questions section, plus support articles -- and may miss the real page
entirely, because plenty of FAQ pages never use the abbreviation.

Weigh these together instead:

- the title, which may be "FAQ", "FAQs", "Frequently asked questions",
  "Questions", "Help", or "Good to know"
- the slug, which is frequently `faq` or `faqs` even when the title says
  something else, and which is better evidence than the title because it was
  chosen when the page was created for that purpose
- the site's navigation, including the footer, where FAQ links commonly sit
  alongside shipping and returns
- page hierarchy: if a "Help" or "Support" parent has FAQ children, work out
  whether the parent or one child is the page
- the content itself, read rather than searched: the FAQ page is structurally a
  list of questions with answers, often as an accordion. That structure is the
  clearest signal there is, and it does not depend on any particular wording

The site may not be in English. "Veelgestelde vragen", "Häufige Fragen",
"Preguntas frecuentes", "Domande frequenti", "常见问题" are all this page. Do not
conclude a site has no FAQ page because the letters F, A and Q are absent.

Be careful of two near-misses: a knowledge base or support section with many
articles is not an FAQ page, and neither is a questions block that appears on
every product page. Both answer questions; neither is a single page serving
this role. If that is what the site has, "not needed" is the more honest
record.

If two candidates are genuinely equal, or if the best candidate is only a weak
match, say so and ask rather than recording a guess.

If no candidate exists at all, the goal is undetermined, not met. Report that
the site appears not to have an FAQ page and let the owner decide whether to
record it as not needed or to write one.

## Hints

List the published pages with their titles, slugs, parents and menu positions,
and read the best candidates properly. Look at page structure as well as words
-- a page built from repeated question-and-answer blocks is recognisable
without reading a line of it.

Shops are where this page most often exists and most often has an unexpected
title. Check for pages about shipping, returns and payment; sometimes they are
separate pages and there is no combined FAQ, which is again a "not needed".

If the site uses an FAQ or accordion block or plugin, the pages where that
block appears are the shortlist. Check which plugin the site actually has
rather than assuming.

In WordPress, the role can be set from the sidebar on the page edit screen, or
from the plugin's own settings screen; it is stored as a taxonomy term on the
page rather than as an option, so a page can be given the role directly.

## Out of bounds

Do not create a page. This goal records which existing page serves the role. If
the site has no FAQ page, that is a finding to report, not a gap to fill --
writing one means knowing what customers actually ask, which is the owner's
knowledge and not yours.

Do not guess when no good candidate exists, and do not record a marginal
candidate to close the task out. A wrong record is worse than no record,
because everything downstream then treats the wrong page as important.

Do not edit, rename, re-slug, reorder or republish any page while working this
out. Do not add questions or answers to any page, and do not change the
navigation menu.

Do not assign the role to more than one page.
