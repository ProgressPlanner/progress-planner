---
id: set-page-about
title: Record which page is the About page
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

An About page is what a visitor opens when they have decided the site might be
worth trusting and want to know who is behind it. Most sites have one. What
most sites do not have is anything recording *which* page it is.

That record matters because other work depends on it. A page carrying a
declared role gets reviewed on a shorter cycle than an ordinary blog post, its
content is checked against what the business currently does, and it can be
treated as one of the pages that must not quietly rot. None of that can happen
while the role is unknown.

This goal is only about the record. It does not ask for a page to be written,
improved, or moved.

## Goal

The site's About page role is resolved: either a specific existing page is
recorded as the About page, or the site is recorded as not needing one.

Both are real outcomes. A single-purpose landing page or a site whose whole
front page is the story genuinely has no separate About page, and recording
"not applicable" is the correct answer rather than a way of dodging the
question.

What does not satisfy it is the role being left unanswered, and neither does
recording a page that is not actually the About page.

## How to verify

Read the recorded page role and check it resolves to a published page that is
plausibly the About page, or to an explicit "not needed".

Deciding which page that is, is the actual work, and it is not a keyword match.
A full-text search for "about" on a real site returns everything whose content
happens to use the word -- on one site that is eleven pages, including a job
opening, with the real About page ranked ninth. Any method that takes the top
hit will be wrong, and wrong quietly.

Weigh these together instead:

- the title, which may be "About", "About us", "About Emilia", "Our story",
  "Who we are", or the founder's name
- the slug, which is frequently `about-us` or `about` even when the title is
  something else, and which is better evidence than the title because it was
  chosen when the page was created for that purpose
- the site's navigation: a page linked from the main menu in the position where
  an About link usually sits is a strong candidate, and one linked from
  nowhere is a weak one
- page hierarchy: if several candidates exist and one is the parent of the
  others -- "About" with children "Our team" and "Our history" -- the parent is
  the page
- the content itself, read rather than searched: the About page describes the
  organisation or person, not a service, a product or a vacancy

The site may not be in English. "Over ons", "Sobre nosotros", "Chi siamo",
"Über uns", "À propos", "关于我们" are all this page, and a site in Dutch will
have a Dutch slug to match. Do not conclude a site has no About page because
the English words are absent.

If two candidates are genuinely equal, or if the best candidate is only a weak
match, say so and ask rather than recording a guess.

If no candidate exists at all, the goal is undetermined, not met. Report that
the site appears not to have an About page and let the owner decide whether to
record it as not needed or to write one.

## Hints

List the published pages with their titles, slugs, parents and menu positions,
and read the three or four best candidates properly. That is a small amount of
reading and it settles almost every site.

The navigation menu is the most reliable single signal, because it reflects what
the owner thinks the site's important pages are. Look at the menu before
looking at search results.

Watch for a page whose title is the company or person's name. On small business
and personal sites that is very often the About page, and it matches no keyword
at all.

On some sites the front page carries the About content. If so, the honest answer
is usually to record the front page or to record the role as not needed, and to
say which you chose and why.

In WordPress, the role can be set from the sidebar on the page edit screen, or
from the plugin's own settings screen; it is stored as a taxonomy term on the
page rather than as an option, so a page can be given the role directly.

## Out of bounds

Do not create a page. This goal records which existing page serves the role. If
the site has no About page, that is a finding to report, not a gap to fill --
writing one is a separate decision about the site's content, and a page created
to satisfy a checklist is worse than an honest absence.

Do not guess when no good candidate exists, and do not record a marginal
candidate to close the task out. A wrong record is worse than no record,
because everything downstream then treats the wrong page as important.

Do not edit, rename, re-slug, reorder or republish any page while working this
out. Do not change the site's front page setting, and do not alter the
navigation menu.

Do not assign the role to more than one page.
