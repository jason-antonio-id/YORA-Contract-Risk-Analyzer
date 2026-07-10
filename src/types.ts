export interface AnalysisResult {
  contract_type: string;
  contract_type_en: string;
  party_a: string;
  party_b: string;
  duration: string;
  summary_mandarin: string;
  summary_english?: string;
  full_translation_mandarin: string;
  risk_score: number;
  risk_level: string;
  risk_verdict: string;
  red_flags: {
    title_cn: string;
    title_en?: string;
    original_text: string;
    translation_cn: string;
    explanation_cn: string;
    explanation_en?: string;
    suggested_fix_cn: string;
    law_reference: string;
  }[];
  risky_clauses: {
    topic_cn: string;
    topic_en?: string;
    risk_level: string;
    original_text: string;
    translation_cn: string;
    explanation_cn: string;
    explanation_en?: string;
    suggested_fix_cn?: string;
    suggested_fix_en?: string;
  }[];
  missing_clauses: {
    name_cn: string;
    name_id: string;
    importance_cn: string;
    importance_en?: string;
  }[];
  cultural_legal_notes: string[];
  conclusion?: string;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  contentEn?: string;
  timestamp?: string;
}

export type Language = 'cn' | 'en' | 'id';
export type ContractLanguage = 'id' | 'cn' | 'en' | 'mixed';
export type OutputLanguage = 'cn' | 'id' | 'en';
