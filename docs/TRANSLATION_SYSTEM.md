# Translation Sync Feature - User Guide

## What This Feature Does

The **Sync Missing Translations** button automates the process of finding and adding Turkish translations to your database. No more manual SQL copying!

## How to Use

### Step 1: Add New Content to Your Site

When you add new Turkish text to any page or component:

```tsx
// Example: In any component
<h1>Yeni Bir Başlık</h1>
<p>Bu yeni bir paragraf</p>
```

### Step 2: Go to Admin Panel

1. Login to admin at: `/admin/login`
2. Navigate to: **Translation Management**
3. Click the **"Sync Missing"** button

### Step 3: Review Results

A modal will appear showing:
- **Found**: Total Turkish texts detected
- **Already in DB**: Existing translations
- **Newly Added**: New translations added

Example:
```
✅ Sync Results
━━━━━━━━━━━━━━━━━━
Found: 150
Already in DB: 100
Newly Added: 50

Newly Added Translations:
• home.yeni_bir_başlık
• about.bu_yeni_bir
• services.yeni_hizmet
...
```

### Step 4: Auto-Translate (Optional)

If new translations were added, click **"Auto-Translate Now"** to:
- Automatically translate all new Turkish texts to English using DeepL
- Update the database with English translations

## What Happens Behind the Scenes

1. **Scanner**: Checks all predefined translation sources
2. **Comparison**: Compares with existing database entries
3. **Detection**: Finds missing or changed translations
4. **Insertion**: Adds new translations to database in batches
5. **Translation** (optional): Sends to DeepL API for English translation

## Adding More Translation Sources

To include more pages/components in the scan, edit:

**File**: `src/data/translationSources.ts`

```typescript
export const staticTranslationTexts: Record<string, string[]> = {
  // Add your new page here
  NewPage: [
    "Turkish text 1",
    "Turkish text 2",
    "Turkish text 3",
  ],

  // Existing pages...
  Home: [...],
  About: [...],
};
```

## Troubleshooting

### Issue: No New Translations Found

**Solution**: Make sure your Turkish text is added to `translationSources.ts`

### Issue: Sync Failed

**Possible causes**:
1. Supabase connection issue
2. Edge function not deployed
3. Permission issue with database

**Solution**: Check browser console for errors

### Issue: Auto-Translate Failed

**Possible causes**:
1. DeepL API quota exceeded
2. Network timeout
3. Invalid Turkish characters

**Solution**:
- Check DeepL API status
- Try translating fewer items at once
- Check console for specific errors

## Benefits

### Before (Manual Process):
```bash
1. Edit code with Turkish text
2. Run: node scripts/extract-translations.js
3. Open extracted-translations.sql
4. Copy entire file contents
5. Go to Supabase SQL Editor
6. Paste and run SQL
7. Go to admin and click "Retranslate All"
⏱️ Time: 10-15 minutes
```

### Now (Automated):
```bash
1. Edit code with Turkish text
2. Click "Sync Missing" in admin
3. Click "Auto-Translate Now"
⏱️ Time: 10 seconds
```

## Advanced Features

### Content Hash Detection

The system uses content hashes to detect when text has changed:

- Same text → No update needed
- Changed text → New entry created
- This prevents duplicate translations

### Batch Processing

Large sync operations are processed in batches of 100 to avoid timeouts.

### Deduplication

If the same Turkish text appears in multiple places, only one translation is created.

## API Endpoints

### Sync Translations
```
POST ${SUPABASE_URL}/functions/v1/sync-translations
Authorization: Bearer ${ANON_KEY}

Body:
{
  "translations": [
    {
      "contentKey": "home.yeni_metin",
      "text": "Yeni Metin",
      "hash": "abc123"
    }
  ]
}
```

### Response:
```json
{
  "success": true,
  "found": 150,
  "existing": 100,
  "added": 50,
  "addedKeys": ["home.yeni_metin", "..."]
}
```

## Files Created

1. **Edge Function**: `supabase/functions/sync-translations/index.ts`
2. **Scanner Utility**: `src/utils/translationScanner.ts`
3. **Translation Sources**: `src/data/translationSources.ts`
4. **Updated Component**: `src/features/admin/translations/pages/TranslationManager.tsx`

## Maintenance

### Weekly Task

Check the Translation Management page and ensure:
- All pages have translations
- No missing English translations
- Content hashes are up to date

### When Deploying

Always run sync before deploying to production to ensure all translations are current.

---

## Need Help?

If you encounter any issues, check:
1. Browser console for JavaScript errors
2. Supabase logs for edge function errors
3. Database RLS policies for permission issues
