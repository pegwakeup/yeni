const TURKISH_CHARS_REGEX = /[ığüşöçĞÜŞİÖÇ]/;

export interface ScannedTranslation {
  contentKey: string;
  text: string;
  hash: string;
  context: string;
}

export function extractTurkishText(content: string): string[] {
  const texts: string[] = [];

  const patterns = [
    />([^<>{}]+)</g,
    /["']([^"']+)["']/g,
    /`([^`]+)`/g,
  ];

  patterns.forEach(pattern => {
    let match;
    const patternCopy = new RegExp(pattern.source, pattern.flags);

    while ((match = patternCopy.exec(content)) !== null) {
      const text = match[1].trim();

      if (
        TURKISH_CHARS_REGEX.test(text) &&
        text.length > 3 &&
        !text.includes('/') &&
        !text.includes('http') &&
        !text.includes('import') &&
        !text.includes('const') &&
        !text.includes('function') &&
        !text.includes('export') &&
        !text.includes('className') &&
        !text.includes('useState') &&
        !text.includes('useEffect')
      ) {
        texts.push(text);
      }
    }
  });

  return [...new Set(texts)];
}

export function generateContentKey(text: string, context: string): string {
  const contextPart = context.toLowerCase().replace(/[^a-z0-9]/g, '');

  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9ığüşöç\s]/g, '')
    .trim()
    .split(/\s+/)
    .slice(0, 3)
    .join('_');

  const key = `${contextPart}.${words}`;
  return key.substring(0, 50);
}

export function generateHash(text: string): string {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36).substring(0, 6);
}

export function scanComponentForTranslations(
  componentName: string,
  componentCode: string
): ScannedTranslation[] {
  const texts = extractTurkishText(componentCode);
  const translations: ScannedTranslation[] = [];

  for (const text of texts) {
    const contentKey = generateContentKey(text, componentName);
    const hash = generateHash(text);

    translations.push({
      contentKey,
      text,
      hash,
      context: componentName,
    });
  }

  return translations;
}

export function deduplicateTranslations(
  translations: ScannedTranslation[]
): ScannedTranslation[] {
  const uniqueMap = new Map<string, ScannedTranslation>();

  for (const trans of translations) {
    if (!uniqueMap.has(trans.contentKey)) {
      uniqueMap.set(trans.contentKey, trans);
    }
  }

  return Array.from(uniqueMap.values());
}
