#!/usr/bin/env node

/**
 * Import extracted translations to Supabase
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read env file
const envPath = path.join(__dirname, '../.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) {
    envVars[key.trim()] = value.trim();
  }
});

const supabaseUrl = envVars.VITE_SUPABASE_URL;
const supabaseKey = envVars.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Supabase credentials not found in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Read SQL file and parse translations
const sqlPath = path.join(__dirname, '../extracted-translations.sql');
const sql = fs.readFileSync(sqlPath, 'utf-8');

// Extract values from SQL
const valuesMatch = sql.match(/VALUES\s+([\s\S]+)ON CONFLICT/);
if (!valuesMatch) {
  console.error('Could not parse SQL file');
  process.exit(1);
}

const valuesText = valuesMatch[1].trim().replace(/;$/, '');

// Parse each value tuple
const translations = [];
const tupleRegex = /\('([^']+)',\s*'([^']+)',\s*'([^']*(?:''[^']*)*)',\s*'([^']+)'\)/g;

let match;
while ((match = tupleRegex.exec(valuesText)) !== null) {
  const [, contentKey, language, translatedText, contentHash] = match;

  translations.push({
    content_key: contentKey,
    language,
    translated_text: translatedText.replace(/''/g, "'"), // Unescape single quotes
    content_hash: contentHash,
  });
}

console.log(`\n📚 Found ${translations.length} translations to import\n`);

// Import in batches
const BATCH_SIZE = 100;
let imported = 0;
let errors = 0;

for (let i = 0; i < translations.length; i += BATCH_SIZE) {
  const batch = translations.slice(i, i + BATCH_SIZE);

  try {
    const { error } = await supabase
      .from('translations')
      .upsert(batch, { onConflict: 'content_key,language' });

    if (error) {
      console.error(`❌ Error importing batch ${i / BATCH_SIZE + 1}:`, error.message);
      errors += batch.length;
    } else {
      imported += batch.length;
      console.log(`✅ Imported batch ${i / BATCH_SIZE + 1}: ${imported}/${translations.length}`);
    }
  } catch (err) {
    console.error(`❌ Exception in batch ${i / BATCH_SIZE + 1}:`, err.message);
    errors += batch.length;
  }
}

console.log(`\n📊 Import Summary:`);
console.log(`   Total: ${translations.length}`);
console.log(`   Imported: ${imported}`);
console.log(`   Errors: ${errors}\n`);

if (imported > 0) {
  console.log('✨ Success! Now you can use "Retranslate All" in the admin panel.\n');
}
