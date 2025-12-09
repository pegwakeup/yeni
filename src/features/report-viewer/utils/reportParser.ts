// Report Parser Utility
// Parses the text-based report format into structured data

import type { AnalysisResult, CategoryScores, Recommendation, ReportData, ReportSection } from '../types';

interface ParsedReport {
  companyName: string;
  reportDate: string;
  overallScore: number;
  sections: ParsedSection[];
  recommendations: Recommendation[];
}

interface ParsedSection {
  title: string;
  score: number;
  maxScore: number;
  items: ParsedItem[];
  status: 'good' | 'warning' | 'critical';
}

interface ParsedItem {
  label: string;
  value: string;
  status: 'good' | 'warning' | 'critical';
}

/**
 * Parses a text-based report into structured data
 */
export function parseReportText(reportText: string): ParsedReport {
  const lines = reportText.split('\n').map(line => line.trim()).filter(Boolean);
  
  const report: ParsedReport = {
    companyName: '',
    reportDate: '',
    overallScore: 0,
    sections: [],
    recommendations: [],
  };

  let currentSection: ParsedSection | null = null;
  let inRecommendations = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Parse company name
    if (line.includes('DİJİTAL VARLIK ANALİZ RAPORU')) {
      // Next line might have company name
      if (i + 1 < lines.length && lines[i + 1].includes('Şirket:')) {
        report.companyName = lines[i + 1].replace('Şirket:', '').trim();
      }
      continue;
    }

    // Parse date
    if (line.startsWith('Tarih:') || line.startsWith('Rapor Tarihi:')) {
      report.reportDate = line.replace(/Tarih:|Rapor Tarihi:/, '').trim();
      continue;
    }

    // Parse overall score
    if (line.includes('GENEL DİJİTAL SKOR') || line.includes('Genel Skor:')) {
      const scoreMatch = line.match(/(\d+)\/100/);
      if (scoreMatch) {
        report.overallScore = parseInt(scoreMatch[1], 10);
      }
      continue;
    }

    // Check for section headers
    const sectionMatch = parseSectionHeader(line);
    if (sectionMatch) {
      if (currentSection) {
        report.sections.push(currentSection);
      }
      currentSection = {
        title: sectionMatch.title,
        score: sectionMatch.score,
        maxScore: sectionMatch.maxScore,
        items: [],
        status: getScoreStatus(sectionMatch.score, sectionMatch.maxScore),
      };
      continue;
    }

    // Check for recommendations section
    if (line.includes('ÖNCELİKLİ ÖNERİLER') || line.includes('ÖNERILER')) {
      if (currentSection) {
        report.sections.push(currentSection);
        currentSection = null;
      }
      inRecommendations = true;
      continue;
    }

    // Parse items within sections
    if (currentSection && !inRecommendations) {
      const itemMatch = parseItemLine(line);
      if (itemMatch) {
        currentSection.items.push(itemMatch);
      }
    }

    // Parse recommendations
    if (inRecommendations) {
      const recMatch = parseRecommendation(line, i);
      if (recMatch) {
        report.recommendations.push(recMatch);
      }
    }
  }

  // Add last section if exists
  if (currentSection) {
    report.sections.push(currentSection);
  }

  return report;
}

/**
 * Parses a section header like "1. WEB SİTESİ ANALİZİ (12/20)"
 */
function parseSectionHeader(line: string): { title: string; score: number; maxScore: number } | null {
  const patterns = [
    /^\d+\.\s*(.+?)\s*\((\d+)\/(\d+)\)/,
    /^[A-Z\sİĞÜŞÖÇ]+\s*\((\d+)\/(\d+)\)/,
    /^#+\s*(.+?)\s*-\s*(\d+)\/(\d+)/,
  ];

  for (const pattern of patterns) {
    const match = line.match(pattern);
    if (match) {
      return {
        title: match[1]?.trim() || line.split('(')[0].replace(/^\d+\.\s*/, '').trim(),
        score: parseInt(match[2] || match[1], 10),
        maxScore: parseInt(match[3] || match[2], 10),
      };
    }
  }

  return null;
}

/**
 * Parses an item line like "✓ SSL Sertifikası: Aktif"
 */
function parseItemLine(line: string): ParsedItem | null {
  // Skip empty or header-like lines
  if (line.length < 3 || line.startsWith('#') || line.startsWith('---')) {
    return null;
  }

  let status: 'good' | 'warning' | 'critical' = 'good';
  let cleanLine = line;

  // Check for status indicators
  if (line.includes('✓') || line.includes('✅') || line.includes('[+]')) {
    status = 'good';
    cleanLine = line.replace(/[✓✅\[\+\]]/g, '').trim();
  } else if (line.includes('⚠') || line.includes('⚡') || line.includes('[!]')) {
    status = 'warning';
    cleanLine = line.replace(/[⚠⚡\[!\]]/g, '').trim();
  } else if (line.includes('✗') || line.includes('❌') || line.includes('[-]')) {
    status = 'critical';
    cleanLine = line.replace(/[✗❌\[\-\]]/g, '').trim();
  } else if (line.startsWith('-') || line.startsWith('•')) {
    cleanLine = line.replace(/^[-•]\s*/, '').trim();
  }

  // Parse label:value format
  const colonIndex = cleanLine.indexOf(':');
  if (colonIndex > 0) {
    return {
      label: cleanLine.substring(0, colonIndex).trim(),
      value: cleanLine.substring(colonIndex + 1).trim(),
      status,
    };
  }

  // If no colon, use the whole line as label
  if (cleanLine.length > 3) {
    return {
      label: cleanLine,
      value: '',
      status,
    };
  }

  return null;
}

/**
 * Parses a recommendation line
 */
function parseRecommendation(line: string, index: number): Recommendation | null {
  // Check for numbered recommendations
  const numberedMatch = line.match(/^(\d+)\.\s*(.+)/);
  if (numberedMatch) {
    const priority = index < 3 ? 'high' : index < 6 ? 'medium' : 'low';
    return {
      id: `rec-${index}`,
      category: 'general',
      priority,
      title: numberedMatch[2],
      description: '',
      impact: priority === 'high' ? 'Yüksek' : priority === 'medium' ? 'Orta' : 'Düşük',
      effort: 'medium',
    };
  }

  // Check for bullet point recommendations
  if (line.startsWith('-') || line.startsWith('•') || line.startsWith('*')) {
    const content = line.replace(/^[-•*]\s*/, '').trim();
    if (content.length > 10) {
      return {
        id: `rec-${index}`,
        category: 'general',
        priority: 'medium',
        title: content,
        description: '',
        impact: 'Orta',
        effort: 'medium',
      };
    }
  }

  return null;
}

/**
 * Determines status based on score percentage
 */
function getScoreStatus(score: number, maxScore: number): 'good' | 'warning' | 'critical' {
  const percentage = (score / maxScore) * 100;
  if (percentage >= 70) return 'good';
  if (percentage >= 40) return 'warning';
  return 'critical';
}

/**
 * Converts parsed report to AnalysisResult format
 */
export function convertToAnalysisResult(parsed: ParsedReport): AnalysisResult {
  const categoryMapping: Record<string, keyof CategoryScores> = {
    'web sitesi': 'website',
    'seo': 'seo',
    'sosyal medya': 'social_media',
    'içerik': 'content',
    'marka': 'branding',
    'analitik': 'analytics',
  };

  const scores: CategoryScores = {
    website: { score: 0, maxScore: 20, label: 'Web Sitesi', description: '' },
    seo: { score: 0, maxScore: 20, label: 'SEO', description: '' },
    social_media: { score: 0, maxScore: 20, label: 'Sosyal Medya', description: '' },
    content: { score: 0, maxScore: 15, label: 'İçerik', description: '' },
    branding: { score: 0, maxScore: 15, label: 'Marka', description: '' },
    analytics: { score: 0, maxScore: 10, label: 'Analitik', description: '' },
  };

  // Map parsed sections to category scores
  for (const section of parsed.sections) {
    const sectionLower = section.title.toLowerCase();
    for (const [keyword, categoryKey] of Object.entries(categoryMapping)) {
      if (sectionLower.includes(keyword)) {
        scores[categoryKey] = {
          score: section.score,
          maxScore: section.maxScore,
          label: section.title,
          description: `${section.items.length} madde analiz edildi`,
          details: section.items.map(item => 
            item.value ? `${item.label}: ${item.value}` : item.label
          ),
        };
        break;
      }
    }
  }

  // Identify strengths and weaknesses from sections
  const strengths: string[] = [];
  const weaknesses: string[] = [];

  for (const section of parsed.sections) {
    for (const item of section.items) {
      if (item.status === 'good' && strengths.length < 5) {
        strengths.push(item.value ? `${item.label}: ${item.value}` : item.label);
      } else if (item.status === 'critical' && weaknesses.length < 5) {
        weaknesses.push(item.value ? `${item.label}: ${item.value}` : item.label);
      }
    }
  }

  return {
    summary: `${parsed.companyName} için hazırlanan dijital analiz raporunda genel skor ${parsed.overallScore}/100 olarak belirlendi.`,
    scores,
    recommendations: parsed.recommendations,
    strengths,
    weaknesses,
    opportunities: [],
  };
}

/**
 * Converts parsed report to ReportData format for storage
 */
export function convertToReportData(parsed: ParsedReport): ReportData {
  const sections: ReportSection[] = parsed.sections.map((section, index) => ({
    id: `section-${index}`,
    title: section.title,
    score: section.score,
    status: section.status,
    content: section.items.map(item => 
      item.value ? `${item.label}: ${item.value}` : item.label
    ).join('\n'),
    items: section.items.map(item => ({
      label: item.label,
      value: item.value,
      status: item.status,
    })),
  }));

  return {
    generatedAt: parsed.reportDate || new Date().toISOString(),
    version: '1.0',
    sections,
  };
}

/**
 * Generates a text summary of the report for AI context
 */
export function generateReportContext(report: {
  company_name: string;
  digital_score?: number;
  analysis_result?: AnalysisResult;
}): string {
  const parts: string[] = [];

  parts.push(`Şirket: ${report.company_name}`);
  
  if (report.digital_score) {
    parts.push(`Genel Dijital Skor: ${report.digital_score}/100`);
  }

  if (report.analysis_result) {
    const result = report.analysis_result;
    
    parts.push('\nKategori Skorları:');
    if (result.scores) {
      for (const [_key, value] of Object.entries(result.scores)) {
        if (value && typeof value === 'object') {
          parts.push(`- ${value.label}: ${value.score}/${value.maxScore}`);
        }
      }
    }

    if (result.strengths && result.strengths.length > 0) {
      parts.push('\nGüçlü Yönler:');
      result.strengths.forEach(s => parts.push(`- ${s}`));
    }

    if (result.weaknesses && result.weaknesses.length > 0) {
      parts.push('\nGeliştirme Alanları:');
      result.weaknesses.forEach(w => parts.push(`- ${w}`));
    }

    if (result.recommendations && result.recommendations.length > 0) {
      parts.push('\nÖncelikli Öneriler:');
      result.recommendations.slice(0, 5).forEach(r => {
        parts.push(`- [${r.priority.toUpperCase()}] ${r.title}`);
      });
    }
  }

  return parts.join('\n');
}
