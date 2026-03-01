---
title: "How I Reduced Firebase Loading Time from 5 Seconds to Under 100ms"
excerpt: "Our app was slow. Users complained. Here's exactly how I used Cloud Functions caching to fix a real production problem in Muslifie."
date: "2026-03-01"
tags: ["Flutter", "Firebase", "Performance"]
readTime: "6 min read"
coverGradient: "from-blue-500 to-cyan-400"
---

## The Problem

When Muslifie launched, tour listing pages were taking 2–5 seconds to load. Users on slower connections in Pakistan, Egypt, and Indonesia were bouncing before the data even appeared.

The culprit? Every time a user opened the app, Firebase was running fresh Firestore queries — no caching, no batching, just raw reads on every open.

At 200+ guide profiles and growing, this was getting expensive and slow.

## What I Tried First (That Failed)

My first instinct was client-side caching with Flutter's built-in Firestore persistence. It helped a little, but:

- First load was still slow
- Data was stale on reinstall
- No control over cache invalidation

Not good enough for a marketplace where guide availability changes daily.

## The Real Fix — Cloud Functions Caching

The solution was moving the heavy lifting to Firebase Cloud Functions with in-memory caching.

Here's the pattern:

```javascript
let cachedData = null;
let cacheTime = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

exports.getTours = functions.https.onCall(async (data, context) => {
  const now = Date.now();

  // Return cache if still fresh
  if (cachedData && (now - cacheTime) < CACHE_TTL) {
    return cachedData;
  }

  // Fetch fresh data
  const snapshot = await db.collection('tours')
    .where('status', '==', 'active')
    .limit(50)
    .get();

  cachedData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  cacheTime = now;

  return cachedData;
});
```

The key insight: Cloud Function instances stay warm between calls. So the cache lives in memory as long as the instance is alive — usually 15–30 minutes.

## Results

| Metric | Before | After |
|--------|--------|-------|
| Initial load | 2–5 seconds | Under 100ms |
| Firestore reads/day | 40,000+ | ~800 |
| Firebase bill | Rising fast | Flat |

The first user to hit the function after a cold start waits ~400ms. Every user after that gets cached data in under 100ms.

## Flutter Side — Skeleton Loaders

The performance fix only works if users don't stare at a blank screen during that first cold start. I paired it with skeleton loaders in Flutter:

```dart
Widget build(BuildContext context) {
  return FutureBuilder<List<Tour>>(
    future: fetchTours(),
    builder: (context, snapshot) {
      if (!snapshot.hasData) {
        return TourSkeletonList(); // Show skeleton while loading
      }
      return TourList(tours: snapshot.data!);
    },
  );
}
```

Perceived performance matters as much as actual performance. Users tolerate loading if they can see *something* happening.

## What I'd Do Differently

If I were building Muslifie today, I'd add:

1. **Redis caching** via Firebase Extensions for multi-instance cache sharing
2. **Incremental loading** — show top 10 tours instantly, load the rest in background
3. **Prefetch on app launch** — start fetching data the moment the app opens, before the user even navigates

## Key Takeaway

Don't optimize early — but do profile before you assume. Our bottleneck wasn't the Flutter widgets or network speed. It was unnecessary Firestore reads that a 20-line caching function completely solved.

If your app feels slow, add logging to every data fetch and look at where time is actually being spent. The answer is usually simpler than you think.

---

*Building a Flutter app and hitting performance walls? [Drop me a message](https://devumair.vercel.app/#contact) — I've probably hit the same wall.*
