import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface TranslationInput {
  contentKey: string;
  text: string;
  hash: string;
}

interface SyncRequest {
  translations: TranslationInput[];
}

interface SyncResult {
  success: boolean;
  found: number;
  existing: number;
  added: number;
  addedKeys: string[];
  errors?: string[];
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase environment variables");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { translations }: SyncRequest = await req.json();

    if (!translations || !Array.isArray(translations) || translations.length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "translations array is required and must not be empty"
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { data: existingTranslations, error: fetchError } = await supabase
      .from("translations")
      .select("content_key, language, content_hash")
      .eq("language", "tr");

    if (fetchError) {
      throw new Error(`Failed to fetch existing translations: ${fetchError.message}`);
    }

    const existingMap = new Map<string, string>();
    if (existingTranslations) {
      for (const trans of existingTranslations) {
        existingMap.set(trans.content_key, trans.content_hash || "");
      }
    }

    const newTranslations: TranslationInput[] = [];
    const addedKeys: string[] = [];

    for (const trans of translations) {
      const existingHash = existingMap.get(trans.contentKey);

      if (!existingHash || existingHash !== trans.hash) {
        newTranslations.push(trans);
      }
    }

    let addedCount = 0;
    const errors: string[] = [];

    if (newTranslations.length > 0) {
      const BATCH_SIZE = 100;

      for (let i = 0; i < newTranslations.length; i += BATCH_SIZE) {
        const batch = newTranslations.slice(i, i + BATCH_SIZE);

        const insertData = batch.map(trans => ({
          content_key: trans.contentKey,
          language: "tr",
          translated_text: trans.text,
          content_hash: trans.hash,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }));

        const { data, error: insertError } = await supabase
          .from("translations")
          .upsert(insertData, {
            onConflict: "content_key,language",
            ignoreDuplicates: false,
          })
          .select("content_key");

        if (insertError) {
          errors.push(`Batch ${i / BATCH_SIZE + 1}: ${insertError.message}`);
          console.error("Insert error:", insertError);
        } else {
          const batchAddedCount = data?.length || batch.length;
          addedCount += batchAddedCount;
          addedKeys.push(...batch.map(t => t.contentKey));
        }
      }
    }

    const result: SyncResult = {
      success: errors.length === 0,
      found: translations.length,
      existing: translations.length - newTranslations.length,
      added: addedCount,
      addedKeys: addedKeys.slice(0, 50),
      errors: errors.length > 0 ? errors : undefined,
    };

    return new Response(
      JSON.stringify(result),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Sync error:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "An error occurred during sync",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});