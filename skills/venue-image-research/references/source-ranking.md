# Source Ranking

## Fast Query Patterns

- `<venue> <locality>`
- `<venue> instagram`
- `<venue> facebook`
- `<venue> google maps`
- `<venue> telefono`
- `<venue> direccion`
- `<locality> padel club`

## What To Capture

- exact venue name
- locality
- street address
- phone
- website
- instagram
- best image candidate
- source URL for every fact

## When Sources Conflict

1. Keep the official source
2. Prefer the most recent source
3. Prefer the source with matching phone + address
4. Drop the field if conflict remains

## Recommended Final Notes

Use short notes like:

- `Official Instagram has recent court photos`
- `Address confirmed by directory and social bio`
- `Phone found only in one aggregator; keep as medium confidence`
- `Image source weak; better use placeholder`
