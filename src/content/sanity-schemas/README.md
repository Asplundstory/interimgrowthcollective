# Sanity Schema Definitions

Copy these schemas to your Sanity Studio project in the `schemas/` folder.

## Setup Instructions

1. In your Sanity Studio project, copy the schema files to `schemas/`
2. Import them in `schemas/index.ts`:

```typescript
import insight from './insight'
import page from './page'

export const schemaTypes = [insight, page]
```

3. Update `SANITY_PROJECT_ID` in `src/content/sanityAdapter.ts`
4. Set `USE_SANITY = true` in `src/content/adapter.ts`
5. Create documents in Sanity Studio matching the `pageId` values:
   - `home`
   - `forCompanies`
   - `forCreators`
   - `about`
   - `contact`
