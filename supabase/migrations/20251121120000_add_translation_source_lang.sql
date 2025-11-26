-- Add source_lang to translations for better provenance tracking
ALTER TABLE translations
ADD COLUMN IF NOT EXISTS source_lang text CHECK (source_lang IN ('tr', 'en'));

UPDATE translations
SET source_lang = 'tr'
WHERE source_lang IS NULL;
