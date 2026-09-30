---
status: review
title: "Your mobile MVP scope needs a user journey, not a screen count"
excerpt: "A booking screen can hide payments, provider permissions and cancellation rules. Define the complete first journey before estimating an app."
date: "2026-10-01"
reviewed: true
tags: ["Mobile", "Flutter", "Product", "Startup"]
---

“Ten screens” sounds like a bounded app. It does not say what happens when a payment fails, a provider cancels, or a user loses their connection halfway through a booking.

The useful unit of scope is a completed user journey. A screen is part of that journey; it is not a reliable description of the work behind it.

## Start with one complete action

For a marketplace, a first journey might be: a traveler finds an experience, selects an available time, requests a booking, pays, and receives confirmation. A provider needs to see and respond to the request. Those two roles are connected even if the first release has a small number of screens.

A focused scope should say which parts of that journey are in the release and which are not. It should also explain whether a booking is confirmed instantly, needs approval, or stays pending until another system responds.

## Specify the states that can change the estimate

Use a short decision record for each integration:

- **Payments:** what creates the charge, what confirms it, and what happens if the confirmation arrives late?
- **Permissions:** which role can view or change each record?
- **Notifications:** which events need a message, and what happens if delivery fails?
- **Changes:** can a user cancel or edit a request, and who can approve that change?
- **Connectivity:** what can the app show when a connection disappears?

These questions expose implementation work that a screen count misses. They also make the scope reviewable by a founder who does not need to read the code.

## Write acceptance criteria around the flow

“Build a booking screen” leaves room for different interpretations. A more useful criterion describes an observable result:

> When an available booking is submitted and the payment provider confirms success, the traveler sees a confirmed booking and the provider can view the request. A failed payment does not create a confirmed booking.

This is an illustrative criterion, not a universal booking policy. The actual product must define its payment and confirmation rules. The point is to make both the happy path and an important failure state explicit.

## Keep the first release small without making it incomplete

Remove journeys that are not needed to validate the product. Avoid cutting essential states from the journey you retain. A simple complete flow is more useful than several impressive screens that leave an operator repairing records manually.

The [Muslifie project overview](/work/muslifie) illustrates the kinds of connected marketplace workflows in the BuildZn portfolio. It is a product reference, not a promise that another marketplace has the same implementation scope.

## Use the scope to compare proposals

Ask each proposal to identify deliverables, dependencies, acceptance criteria, operating costs and handover. Comparing those details is more informative than comparing two prices attached to different assumptions.

If you are planning a first release, [share the user journey and constraints](/#contact). That is enough to begin a useful scope discussion.
