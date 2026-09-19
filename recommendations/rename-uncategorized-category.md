---
id: rename-uncategorized-category
title: Rename the "Uncategorized" category
category: content
points: 1
priority: 60
capability: manage_categories
repeats: never
per_item: false
reversible: true
verified_by: site_state
needs_confirmation: true
---

## Why it matters

WordPress needs a default category, and it ships with one called
"Uncategorized". Every post published without a category chosen lands there, so
on most sites it accumulates real content. Its archive is a live page at
`/category/uncategorized/`, linked from each of those posts, and it appears in
sitemaps.

The word itself is the problem. It tells a visitor nothing, tells a search
engine nothing, and reads as an admin default that leaked onto the front end.
The category cannot be deleted, because WordPress requires a default -- so the
fix is to give it a name that means something.

## Goal

The site's default category is not named or slugged "Uncategorized".

Both the name and the slug must change. Leaving the slug as `uncategorized`
keeps the word in the archive URL, which is the part that ends up in search
results and in links.

The new name should describe what the posts filed there actually have in
common. "General" is acceptable and honest; the site's main topic is better.

## How to verify

Find the default category -- the term ID stored in the `default_category`
option -- and read its name and slug.

The goal is met when neither the name nor the slug is the localised
"Uncategorized" string for this install. WordPress translates both, so on a
Dutch install the defaults are the Dutch forms, and comparing against the
English word alone would wrongly pass.

If the site's default category has already been pointed at a different term
altogether, and no term named "Uncategorized" remains, the goal is met.

If a term named "Uncategorized" exists but is not the default category, that is
a different situation -- report it rather than renaming, because an ordinary
empty term is covered by the goal about removing terms without posts.

## Hints

Core WordPress, under Posts then Categories. Editing the term updates both
fields on one screen.

Look at the posts actually in the category before choosing a name. On a site
that has been running for years these are usually early posts on the site's
main subject, and the right name is obvious from reading three of them.

Changing the slug changes the archive URL. If the old URL has incoming links or
appears in search results, a redirect from the old slug to the new one is worth
setting up -- whichever redirect or SEO plugin the site has will do it, and
some do it automatically on slug change. Check what is installed rather than
assuming.

Match the site's language. A site publishing in German needs a German name.

## Out of bounds

Do not pick the new name without the owner's agreement. It becomes a public
URL and a label on the front end of their site.

Do not delete the category, do not merge it into another, and do not move the
posts out of it. WordPress will refuse to delete the default category anyway,
and reassigning posts is a separate editorial decision.

Do not change which term is the site's default category.

Do not rename any other category as part of this.
