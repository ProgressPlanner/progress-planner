---
id: sending-email
title: Confirm the site can send email that arrives
category: configuration
points: 1
priority: 4
capability: manage_options
repeats: never
per_item: false
reversible: true
verified_by: owner_confirmation
needs_confirmation: true
---

## Why it matters

A WordPress site sends email it assumes will arrive: password resets, new user
notifications, order confirmations, contact form submissions, plugin and core
update warnings. Nothing tells the site when those fail.

They fail often. A default install hands the message to the server's local mail
program, which sends it from an address at the site's domain with no SPF or
DKIM signature, from an IP with no sending reputation. Providers drop that
silently. The site's own log says the message was sent, because PHP accepted it
-- delivery happens somewhere the site cannot see.

The failure mode is quiet and expensive. A customer who cannot reset their
password does not report a broken email system; they leave. A form submission
that never arrives looks like no one enquired.

## Goal

A test message sent by the site has been received in a real mailbox, and the
person who received it has confirmed it.

That confirmation is the goal, not the sending. The site can report that
`wp_mail()` returned success and still have had the message dropped by the
recipient's provider ten seconds later.

If the message does not arrive, the goal is not met and the real work begins:
routing the site's email through a service that authenticates properly, usually
via SMTP or a transactional email API.

## How to verify

This one cannot be verified from inside the site, and no amount of reading the
configuration substitutes. That is the whole point of it.

The procedure is:

1. Trigger a test send to an address the person can actually read. The message
   the site sends carries two pieces of evidence: a link that marks this
   complete when clicked, and a short confirmation code. Neither value exists
   anywhere the recipient could obtain without receiving the message.
2. Then get the evidence back. If you have access to the mailbox, read the
   message and take the code from it. If you do not, ask the person to check
   their inbox -- and their spam folder -- and to read you the code.
3. Only the code or the clicked link settles it.

Do not mark this complete on your own belief. A successful return value from
the send, a plausible-looking SMTP configuration, a mail log line, an active
mail plugin: none of these is evidence of delivery, and treating them as
evidence is exactly the mistake that leaves a site silently unable to email its
customers.

If the person cannot find the message, that is a result, not an inconclusive
one: the goal is not met. Report it that way.

If you cannot reach a mailbox and the person is not available to check, report
the goal as undetermined and say what is needed to settle it. Waiting is the
correct behaviour here.

## Hints

Check whether the site is already routing mail somewhere before testing.
Something hooking `pre_wp_mail` or `phpmailer_init`, or a replaced `wp_mail()`
in a drop-in, means a plugin or host is handling delivery -- worth knowing,
because it changes where to look when the message does not arrive.

If it does not arrive, an SMTP plugin pointed at a transactional provider is
the usual fix. WP Mail SMTP, Post SMTP and FluentSMTP are common; providers
include Postmark, Mailgun, SendGrid and Amazon SES. Look at what the site and
the host already offer -- many hosts include a transactional service, and
configuring the one they provide is less work than adding another.

The spam folder is where the answer usually is, and it is diagnostic: arriving
in spam means delivery works and authentication does not, which is a different
fix from nothing arriving at all.

Send to an address at a different domain from the site's. Mail to an address on
the same server often never leaves the machine, so it arrives regardless of
whether real delivery works.

## Out of bounds

Do not mark this goal met without the confirmation code or the clicked link. No
inference from configuration counts.

Do not send the test message to an address the person did not give you, and do
not send it repeatedly -- a burst of identical test mails from a new sender is
itself a deliverability problem.

Do not change the site's email configuration as part of testing. Establish
whether delivery works first; fixing it is the next step, and it needs the
owner's agreement because it usually means an account with a third party.

Do not read the mailbox unless you have been given access to it.
