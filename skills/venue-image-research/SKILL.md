---
name: venue-image-research
description: Research local venues, clubs, courts, and businesses to find reliable images, addresses, phones, map links, websites, and social profiles. Use when building "Donde jugar" sections, local venue listings, contact cards, or curated recommendations where multiple sources conflict and each image or fact needs a confidence-rated source.
---

# Venue Image Research

Research venues in a way that is useful for production content, not just for rough notes.

## Workflow

1. Start with the venue name plus locality.
2. Look for the strongest sources first.
3. Extract only facts you can tie to a source.
4. Rank confidence before suggesting an image or phone number.
5. Leave fields blank when confidence is weak instead of guessing.

## Source Order

Use this ranking unless the user asks otherwise:

1. Official website or booking page
2. Official Instagram or Facebook page
3. Official Google Maps / business listing data if directly accessible
4. Padel or sports directories with clear venue pages
5. Generic local directories or aggregators

Prefer sources that expose at least two of these together: name, exact address, phone, map pin, recent photos.

## Image Rules

- Prefer images from official venue-controlled sources.
- Prefer exterior, courts, or reception photos over generic lifestyle imagery.
- Do not treat random stock photos as venue images.
- Do not claim an image is official unless the source is clearly official.
- If image ownership or source confidence is unclear, recommend using a generic placeholder instead.

## Verification Rules

- Address: accept only when at least one strong source gives an exact street address.
- Phone: accept only when it appears on an official profile or a high-confidence venue listing.
- Maps URL: generate from the exact address when needed.
- Social handle: only include clearly official profiles.
- Features: keep them simple and literal, like `Padel`, `Bella Vista`, `Reservas`, `Club`.

## Output Format

Return venue research in a production-ready structure:

```txt
name:
location:
address:
phone:
maps_url:
website:
instagram:
image_url:
image_source:
confidence:
notes:
```

When researching several venues, add a short table first:

```txt
| venue | locality | best source | image confidence | data confidence |
```

## Confidence Rubric

- `high`: official site/social plus one confirming source
- `medium`: one strong source or two weaker sources that agree
- `low`: only generic directories or partial matches

## Good Defaults For This Project

- Favor `San Miguel`, `Muniz`, `Bella Vista`, `Jose C. Paz`, `Los Polvorines`.
- Keep copy short and factual because the final destination is `src/data/courts.ts`.
- If real venue images are weak or dubious, keep the real data and use generic imagery in the app.

## References

- For query patterns and source ranking details, read `references/source-ranking.md`.
