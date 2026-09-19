---
id: set-page-contact
title: Record which page is the Contact page
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

The Contact page is where a visitor goes once they have decided to get in
touch, which makes it one of the few pages on a site with a direct commercial
consequence when it is wrong. Most sites have one. Few sites record which page
it is.

That record matters because other work depends on it. A page carrying a
declared role gets reviewed on a shorter cycle than an ordinary post, so a
phone number that changed or a form that stopped delivering gets caught. It can
also be treated as one of the pages that must keep working. None of that can
happen while the role is unknown.

This goal is only about the record. It does not ask for a page to be written,
improved, or moved.

## Goal

The site's Contact page role is resolved: either a specific existing page is
recorded as the Contact page, or the site is recorded as not needing one.

Both are real outcomes. A site whose contact details sit in the footer on every
page, or whose only call to action is a booking system elsewhere, genuinely has
no separate Contact page, and recording "not applicable" is the correct answer
rather than a way of dodging the question.

What does not satisfy it is the role being left unanswered, and neither does
recording a page that is not actually the Contact page.

## How to verify

Read the recorded page role and check it resolves to a published page that is
plausibly the Contact page, or to an explicit "not needed".

Deciding which page that is, is the actual work, and it is not a keyword match.
Searching a real site for "contact" returns every page whose content mentions
the word -- privacy policies, terms, service pages ending with "contact us to
find out more", the newsletter page. The real Contact page is frequently not
the top hit.

Weigh these together instead:

- the title, which may be "Contact", "Contact us", "Get in touch", "Book a
  call", "Find us", or "Enquiries"
- the slug, which is frequently `contact` or `contact-us` even when the title
  says something else, and which is better evidence than the title because it
  was chosen when the page was created for that purpose
- the site's navigation: the Contact link is usually the last item in the main
  menu, and very often also in the footer. A page in that position is a strong
  candidate; a page linked from nowhere is a weak one
- page hierarchy: if several candidates exist and one is the parent of the
  others, the parent is the page
- the content itself, read rather than searched: the Contact page carries the
  means of contact -- a form, an address, a phone number, a map -- rather than
  merely inviting the reader to get in touch

The site may not be in English. "Contact", "Kontakt", "Contacto", "Contatti",
"Contactez-nous", "联系我们" are all this page, and a site in German will have a
German slug to match. Do not conclude a site has no Contact page because the
English words are absent.

If two candidates are genuinely equal, or if the best candidate is only a weak
match, say so and ask rather than recording a guess.

If no candidate exists at all, the goal is undetermined, not met. Report that
the site appears not to have a Contact page and let the owner decide whether to
record it as not needed or to create one.

## Hints

List the published pages with their titles, slugs, parents and menu positions,
and read the three or four best candidates properly. That settles almost every
site.

Footer links are unusually informative here. Many sites put the Contact link in
the footer rather than the main menu, and a page linked from the footer of
every page is very likely the one.

A page consisting mainly of a contact form block or shortcode -- from whichever
form plugin the site has -- is a strong signal on its own, whatever its title.
Check what form plugin is actually installed rather than assuming a particular
one.

Watch for confusable pages: a "Support" or "Help" page on a product site may be
the real contact route, or may be a separate thing alongside it. Say which you
picked and why.

In WordPress, the role can be set from the sidebar on the page edit screen, or
from the plugin's own settings screen; it is stored as a taxonomy term on the
page rather than as an option, so a page can be given the role directly.

## Out of bounds

Do not create a page. This goal records which existing page serves the role. If
the site has no Contact page, that is a finding to report, not a gap to fill --
creating one means deciding what contact details to publish, which is not
yours to decide.

Do not guess when no good candidate exists, and do not record a marginal
candidate to close the task out. A wrong record is worse than no record,
because everything downstream then treats the wrong page as important.

Do not edit, rename, re-slug, reorder or republish any page while working this
out. Do not add or alter a contact form, do not publish or correct any contact
details, and do not change the navigation menu.

Do not assign the role to more than one page.
