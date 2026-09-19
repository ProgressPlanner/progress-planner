---
id: improve-pdf-handling
title: Improve how the site handles its PDF files
category: configuration
points: 1
priority: 1
capability: manage_options
repeats: never
per_item: false
reversible: true
verified_by: site_state
needs_confirmation: true
applies_when:
  - pdf_attachment_count_above: 10
---

## Why it matters

Search engines index PDFs and rank them alongside HTML pages, so on a site with
a real document library the PDFs are entry points whether anyone planned for
them or not. That produces several problems at once.

A visitor who arrives at a PDF from search has no navigation, no way back into
the site, and no indication of which site they are on beyond whatever is in the
document. The file's title in results is whatever metadata the authoring tool
wrote, often a filename or the name of the person who last saved it. And a PDF
competing with the page that should have ranked splits the site's own results.

There is a maintenance cost too: a PDF is a dead end for editing. Correcting a
price or a date means a new file, a new URL, and the old one still served.

## Goal

The site's PDFs are handled deliberately rather than by default.

There is no single satisfying state here, because the right answer depends on
what the documents are. Any of these is a legitimate outcome, as long as it was
chosen:

- the PDFs that should be found are indexable and have sensible titles, and the
  ones that should not be -- old price lists, superseded forms, internal
  documents -- are excluded from indexing
- each PDF that matters has an HTML page that introduces it and links to it, so
  the page ranks and the file is the download
- PDFs whose content belongs on the site as content have been converted to
  pages, and the files redirect

What does not satisfy it is the default: dozens of files uploaded over the
years, indexed or not by accident, with no one knowing which are current.

## How to verify

Start by listing what is actually there: the PDF attachments, their sizes,
their upload dates, and whether each is linked from any published content. A
PDF linked from nothing is the clearest case of all, and the list usually
contains more of them than anyone expects.

Then check what search engines are told about them. A PDF's indexing is
controlled by an `X-Robots-Tag` HTTP header, not by a meta tag -- there is no
HTML to put one in. Request a few of the files and read the headers.

This goal cannot be reduced to a pass or fail. Whether a given document should
be findable, replaced by a page, or removed is a question about the site's
purpose. Report what you found -- how many files, which are orphaned, which are
indexable, which look superseded -- and treat the goal as undetermined until
the owner has decided.

## Hints

Whichever SEO plugin the site has will usually have the `X-Robots-Tag` control
for media, and some already apply a site-wide rule you may not know about.
Check what is installed and what it is currently doing before changing
anything.

Sort by upload date and look at the oldest. Documents with a year in the
filename, or several versions of the same name, answer the "is this current?"
question without anyone having to open them.

Orphaned files are worth listing separately. They are not necessarily
deletable -- someone may link to them from an email campaign or a printed QR
code -- but they are the ones to ask about first.

If a file is large, say so. A 40MB brochure served to phone users is a real
cost, and compressing it is a smaller change than any of the above.

## Out of bounds

Do not delete PDF files, and do not detach them from the posts they are
attached to. A file that looks orphaned may be linked from somewhere you cannot
see, and its URL may be in print.

Do not apply a blanket noindex to every PDF on the site. On a site whose
documents are the reason people visit, that removes it from the results it
should be winning.

Do not rewrite or re-export the documents themselves.

Do not install a plugin for this without asking.
