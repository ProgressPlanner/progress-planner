---
id: hello-world
title: Delete the default "Hello world!" post
category: content
points: 1
priority: 15
capability: edit_posts
repeats: never
per_item: false
reversible: true
verified_by: site_state
needs_confirmation: true
---

## Why it matters

Every WordPress install ships with a post called "Hello world!" containing one
sentence about editing or deleting it. It exists to demonstrate what a post
looks like, and it is published, so it sits in the site's feed, in archives, in
sitemaps and in search results alongside real content.

Leaving it there is the most widely recognised signal that nobody finished
setting the site up. It is also the post that gets the site's first spam
comments, because it is the one every automated crawler knows the URL of.

## Goal

The default "Hello world!" post is no longer published.

Any one of these satisfies it:

- the post is in the trash
- the post has been permanently deleted
- the post is a draft or otherwise not publicly viewable

The post has already been replaced by real content on some sites -- rewritten
in place, retitled, given actual text. If the post at that ID is no longer the
default post, the goal is moot: say so and leave it alone.

## How to verify

Identify the post precisely before anything else. The install default is a
post of type `post` with the slug `hello-world`. If no post has that slug,
fall back to a post of type `post` titled "Hello world!" -- in that order, slug
first, title second. WordPress localises both, so on a non-English install the
slug and title are the translated forms.

Then read its status. Anything other than `publish` meets the goal.

If neither the slug nor the title matches anything, the post was already
removed. Report that as met rather than as undetermined.

If the slug matches but the content is clearly no longer the default text,
report it as undetermined and ask -- do not delete a post someone has written
into.

## Hints

The default content is short and recognisable: a single paragraph welcoming the
user to WordPress and telling them this is their first post. Compare against
that before acting, because the slug alone does not prove the post is still the
default.

Trashing is the normal move. WordPress keeps trashed posts for 30 days by
default, so the owner can restore it if something depended on the URL.

If the site has a redirect or SEO plugin, deleting a published post may prompt
it to offer a redirect. That is fine and unrelated to this goal.

## Out of bounds

Move the post to the trash. Do not permanently delete it without asking first
-- trashing is reversible and permanent deletion is not, so there is no reason
to skip the reversible step.

Do not delete any other post. The target is the one post identified by the
slug `hello-world`, or failing that the exact title "Hello world!". A post that
merely mentions "hello world", or a page with a similar name, is not the
target.

Do not delete the post's comments separately, do not empty the trash, and do
not touch the sample page -- that is a different goal.
