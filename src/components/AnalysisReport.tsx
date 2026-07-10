import React, { useState, useEffect, useRef } from 'react';
import { 
  FileText, 
  Download, 
  Share2, 
  AlertCircle, 
  ShieldCheck, 
  Gavel, 
  CheckCircle2, 
  MessageSquare,
  Send,
  AlertTriangle,
  ChevronDown,
  Info,
  Copy,
  ChevronRight,
  Loader2,
  Languages,
  Flag,
  Scale,
  Calendar,
  FileDown,
  RefreshCw,
  Plus,
  BookOpen,
  Star,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { Language, OutputLanguage, AnalysisResult, Message } from '../types';
import { T } from '../lib/translations';

function getRiskLevelLabel(score: number, outputLang: OutputLanguage) {
  let level: 'high' | 'medium' | 'low';
  if (score >= 70) level = 'high';
  else if (score >= 40) level = 'medium';
  else level = 'low';

  const labels: Record<string, Record<'high' | 'medium' | 'low', string>> = {
    en: {
      high:   'HIGH RISK',
      medium: 'MEDIUM RISK',
      low:    'LOW RISK'
    },
    cn: {
      high:   '高风险',
      medium: '中等风险',
      low:    '低风险'
    },
    id: {
      high:   'RISIKO TINGGI',
      medium: 'RISIKO SEDANG',
      low:    'RISIKO RENDAH'
    }
  };

  return (labels[outputLang] || labels.en)[level];
}

function getRiskPillLabel(clauseRisk: string, outputLang: OutputLanguage) {
  // Normalize whatever value comes in to HIGH/MEDIUM/LOW
  const raw = String(clauseRisk)
    .toUpperCase()
    .trim();

  const normalize: Record<string, 'high' | 'medium' | 'low'> = {
    'HIGH':   'high',
    'MEDIUM': 'medium',
    'LOW':    'low',
    '高':     'high',
    '中':     'medium',
    '低':     'low',
    'TINGGI': 'high',
    'SEDANG': 'medium',
    'RENDAH': 'low',
    // Handle full phrases too
    'HIGH RISK':      'high',
    'MEDIUM RISK':    'medium',
    'LOW RISK':       'low',
    '高风险':          'high',
    '中等风险':        'medium',
    '低风险':          'low',
    'RISIKO TINGGI':  'high',
    'RISIKO SEDANG':  'medium',
    'RISIKO RENDAH':  'low'
  };

  const level = normalize[raw] || 'medium';

  const pills: Record<string, Record<'high' | 'medium' | 'low', string>> = {
    en: { high: 'HIGH',   medium: 'MEDIUM', low: 'LOW'    },
    cn: { high: '高',     medium: '中',     low: '低'     },
    id: { high: 'TINGGI', medium: 'SEDANG', low: 'RENDAH' }
  };

  return (pills[outputLang] || pills.en)[level];
}

function normalizeRisk(riskLevel: string): 'high' | 'medium' | 'low' {
  const val = String(riskLevel || '').toUpperCase().trim();
  if (['HIGH', '高', 'TINGGI', 'HIGH RISK', '高风险', 'RISIKO TINGGI'].includes(val)) return 'high';
  if (['MEDIUM', '中', 'SEDANG', 'MEDIUM RISK', '中等风险', 'RISIKO SEDANG'].includes(val)) return 'medium';
  return 'low';
}

function getPillClass(riskLevel: string) {
  return normalizeRisk(riskLevel);
}

function sortClausesByRisk(clauses: any[]) {
  if (!clauses || !Array.isArray(clauses)) return [];
  
  const riskOrder: Record<string, number> = {
    // English values
    'HIGH':   1,
    'MEDIUM': 2,
    'LOW':    3,
    // Mandarin values
    '高':     1,
    '中':     2,
    '低':     3,
    // Indonesian values
    'TINGGI': 1,
    'SEDANG': 2,
    'RENDAH': 3,
    // Full phrases
    'HIGH RISK':      1,
    'MEDIUM RISK':    2,
    'LOW RISK':       3,
    '高风险':          1,
    '中等风险':        2,
    '低风险':          3,
    'RISIKO TINGGI':  1,
    'RISIKO SEDANG':  2,
    'RISIKO RENDAH':  3
  };
  
  return [...clauses].sort((a, b) => {
    const levelA = String(a.risk_level || '').toUpperCase();
    const levelB = String(b.risk_level || '').toUpperCase();
    const orderA = riskOrder[levelA] || 99;
    const orderB = riskOrder[levelB] || 99;
    return orderA - orderB;
  });
}

function isTranslationComplete(text: string) {
  if (!text) return false;
  // If translation is extremely short, it's likely incomplete
  if (text.length < 100) return false;
  // If there are many article headers but very little body content, it's incomplete
  const headers = text.match(/(Pasal\s+\d+|第[^\s]+条|Article\s+\d+|Section\s+\d+|Clause\s+\d+)/gi) || [];
  if (headers.length > 3 && text.length / headers.length < 50) return false;
  return true;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatFullTranslation(text: string, _outputLang?: any): string {
  if (!text || text.trim().length === 0) {
    return `<div style="color:#9CA3AF;font-style:italic;font-family:Arial,sans-serif;font-size:11px;text-align:center;padding:24px;">No translation available.</div>`;
  }

  if (text.trim().length < 150) {
    return `<div style="background:#FEF3C7;border:1px solid #F59E0B;border-radius:6px;padding:12px 16px;font-size:11px;color:#78350F;font-family:Arial,sans-serif;">⚠️ Translation appears incomplete. Re-analyze to get full translation.</div>`;
  }

  // Normalize escaped newlines that survive JSON serialization
  const normalized = text
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '')
    .replace(/\r/g, '\n');

  const lines = normalized
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 0);

  // ── CLASSIFIERS ──
  const isArticleHeader = (l: string) =>
    /^(Pasal|Article|Section|Clause|Chapter)\s+\d+/i.test(l) ||
    /^第[一二三四五六七八九十百零\d]+条/.test(l) ||
    /^[一二三四五六七八九十]+、/.test(l) ||
    /^(WHEREAS|NOW THEREFORE|IN WITNESS|RECITALS|DEFINITIONS)/i.test(l) ||
    /^【.*】$/.test(l.trim());

  const isSubClause = (l: string) => /^\d+\.\d+(\.\d+)?\s+\S/.test(l);

  const isLettered = (l: string) =>
    /^[a-zA-Z]\.\s+\S/.test(l) ||
    /^\([a-zA-Z]\)\s+\S/.test(l) ||
    /^[a-zA-Z]\)\s+\S/.test(l);

  const isRoman = (l: string) =>
    /^(i{1,3}|iv|vi{0,3}|ix|x{1,3})\.\s+\S/i.test(l) && l.length < 100;

  function extractBadge(line: string): string {
    const m1 = line.match(/^(?:Pasal|Article|Section|Clause|Chapter)\s+(\d+)/i);
    if (m1) return m1[1];
    const m2 = line.match(/^第([一二三四五六七八九十百零\d]+)条/);
    if (m2) {
      const map: Record<string,string> = {'一':'1','二':'2','三':'3','四':'4','五':'5','六':'6','七':'7','八':'8','九':'9','十':'10','十一':'11','十二':'12','十三':'13','十四':'14','十五':'15','十六':'16','十七':'17','十八':'18','十九':'19','二十':'20'};
      return map[m2[1]] || m2[1];
    }
    const m3 = line.match(/^([一二三四五六七八九十]+)、/);
    if (m3) {
      const map: Record<string,string> = {'一':'1','二':'2','三':'3','四':'4','五':'5','六':'6','七':'7','八':'8','九':'9','十':'10'};
      return map[m3[1]] || '•';
    }
    const m4 = line.match(/^【(.{1,20})】/);
    if (m4) return m4[1];
    return '§';
  }

  // ── BUILD SECTIONS ──
  type LineType = 'article' | 'subclause' | 'lettered' | 'roman' | 'body';
  function classify(l: string): LineType {
    if (isArticleHeader(l)) return 'article';
    if (isSubClause(l)) return 'subclause';
    if (isLettered(l)) return 'lettered';
    if (isRoman(l)) return 'roman';
    return 'body';
  }

  type Section =
    | { type: 'preamble'; lines: string[] }
    | { type: 'article'; header: string; badge: string; body: Array<{ kind: LineType; text: string }> };

  const sections: Section[] = [];
  let current: Section | null = null;
  const preamble: string[] = [];
  let seenArticle = false;

  for (const line of lines) {
    const kind = classify(line);
    if (kind === 'article') {
      seenArticle = true;
      if (current) sections.push(current);
      else if (preamble.length > 0) { sections.push({ type: 'preamble', lines: [...preamble] }); preamble.length = 0; }
      current = { type: 'article', header: line, badge: extractBadge(line), body: [] };
    } else {
      if (!seenArticle) {
        preamble.push(line);
      } else if (current && current.type === 'article') {
        current.body.push({ kind, text: line });
      } else {
        const last = sections[sections.length - 1];
        if (last && last.type === 'article') last.body.push({ kind, text: line });
      }
    }
  }
  if (current) sections.push(current);
  if (preamble.length > 0 && sections.length === 0) sections.push({ type: 'preamble', lines: preamble });

  // ── RENDER BODY LINE ──
  function renderBodyLine(item: { kind: LineType; text: string }): string {
    const { kind, text } = item;

    if (kind === 'subclause') {
      const m = text.match(/^(\d+\.\d+(?:\.\d+)?)\s+([\s\S]*)/);
      const num = m ? m[1] : '';
      const content = m ? m[2] : text;
      return `<div style="display:flex;gap:8px;margin-bottom:8px;padding-left:4px;">
        <span style="flex-shrink:0;font-size:10px;font-weight:700;color:#B91C1C;min-width:28px;padding-top:2px;font-family:Arial,sans-serif;">${escapeHtml(num)}</span>
        <span style="font-size:11px;color:#374151;line-height:1.8;font-family:Arial,Helvetica,sans-serif;flex:1;">${escapeHtml(content)}</span>
      </div>`;
    }

    if (kind === 'lettered' || kind === 'roman') {
      const m = text.match(/^([a-zA-Z()\d]+[.)]\s*)([\s\S]*)/i);
      const prefix = m ? m[1].trim() : '';
      const content = m ? m[2] : text;
      return `<div style="display:flex;gap:6px;margin-bottom:6px;padding-left:20px;">
        <span style="flex-shrink:0;font-size:10px;font-weight:600;color:#6B7280;min-width:18px;font-family:Arial,sans-serif;">${escapeHtml(prefix)}</span>
        <span style="font-size:11px;color:#374151;line-height:1.7;font-family:Arial,Helvetica,sans-serif;flex:1;">${escapeHtml(content)}</span>
      </div>`;
    }

    return `<p style="font-size:11px;color:#374151;line-height:1.8;margin:0 0 6px 0;font-family:Arial,Helvetica,sans-serif;">${escapeHtml(text)}</p>`;
  }

  // ── RENDER SECTIONS ──
  if (sections.length === 0) {
    return `<div style="font-size:11px;color:#374151;line-height:1.9;font-family:Arial,Helvetica,sans-serif;white-space:pre-wrap;padding:4px 0;">${escapeHtml(normalized)}</div>`;
  }

  return sections.map(section => {
    if (section.type === 'preamble') {
      return `<div style="margin-bottom:20px;padding:12px 16px;background:#F9FAFB;border-radius:6px;border-left:3px solid #E5E0D8;font-size:11px;color:#374151;line-height:1.8;font-family:Arial,Helvetica,sans-serif;">
        ${section.lines.map(l => `<p style="margin:0 0 6px 0;">${escapeHtml(l)}</p>`).join('')}
      </div>`;
    }

    if (section.type === 'article') {
      return `<div style="margin-bottom:24px;padding-bottom:16px;border-bottom:1px solid #F3F4F6;page-break-inside:avoid;">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">
          <span style="display:inline-flex;align-items:center;justify-content:center;min-width:24px;height:24px;padding:0 8px;background:#B91C1C;color:white;font-size:11px;font-weight:700;border-radius:4px;flex-shrink:0;white-space:nowrap;font-family:Arial,sans-serif;">${escapeHtml(section.badge)}</span>
          <span style="font-size:13px;font-weight:700;color:#111827;font-family:Arial,Helvetica,sans-serif;line-height:1.3;flex:1;">${escapeHtml(section.header)}</span>
        </div>
        <div style="padding-left:8px;">
          ${section.body.length > 0
            ? section.body.map(renderBodyLine).join('')
            : `<p style="font-size:11px;color:#9CA3AF;font-style:italic;font-family:Arial,sans-serif;margin:0;">—</p>`
          }
        </div>
      </div>`;
    }

    return '';
  }).join('');
}

interface AnalysisReportProps {
  lang: Language;
  data: AnalysisResult;
  masterData?: AnalysisResult | null;
  isDemo?: boolean;
  translating?: boolean;
  loading?: boolean;
  analysisStep?: number;
  reportId: string;
  setOutputLang: (lang: OutputLanguage) => void;
  onReset?: () => void;
  contractText: string;
  outputLang: OutputLanguage;
  userEmail?: string;
}

const Skeleton = ({ className }: { className?: string }) => (
  <div className={`bg-slate-200 animate-pulse rounded ${className}`}></div>
);

const SkeletonLoader = ({ step }: { step: number }) => {
  const steps = [
    { id: 1, en: "Reading Contract...", idn: "Membaca Kontrak...", cn: "正在读取合同..." },
    { id: 2, en: "Identifying Parties...", idn: "Mengidentifikasi Pihak...", cn: "正在识别签署方..." },
    { id: 3, en: "Detecting Risk Clauses...", idn: "Mendeteksi Klausul Berisiko...", cn: "正在检测风险条款..." },
    { id: 4, en: "Consulting Labor Laws...", idn: "Konsultasi UU Hukum...", cn: "正在调取法律数据库..." },
    { id: 5, en: "Finalizing Report...", idn: "Menyelesaikan Laporan...", cn: "报告生成中..." }
  ];

  return (
    <div className="max-w-[1240px] mx-auto px-4 md:px-12 py-12 space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-4 w-full md:w-auto">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Skeleton className="h-10 w-24 rounded-lg" />
          <Skeleton className="h-10 w-24 rounded-lg" />
        </div>
      </div>

      <div className="bg-white border border-outline-variant rounded-2xl p-4 sm:p-8 mb-6 md:mb-8 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 relative">
          <div className="hidden md:block absolute top-[18px] left-[10%] right-[10%] h-[2px] bg-slate-100 -z-0"></div>
          {steps.map((s) => (
            <div key={s.id} className="flex flex-col items-center gap-3 relative z-10 bg-white px-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 ${
                step >= s.id ? 'bg-[#B91C1C] text-white shadow-lg' : 'bg-slate-100 text-slate-400'
              }`}>
                {step > s.id ? <CheckCircle2 size={18} /> : s.id}
              </div>
              <p className={`text-[11px] font-bold uppercase tracking-tight transition-colors duration-500 ${
                step === s.id ? 'text-[#B91C1C]' : 'text-slate-400'
              }`}>
                {s.en}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-10">
          <div className="bg-white border border-outline-variant rounded-2xl p-5 sm:p-10 h-64 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="animate-spin text-primary" size={40} />
              <p className="text-primary font-bold animate-pulse text-lg tracking-widest uppercase">
                {steps[step - 1]?.cn || "Processing..."}
              </p>
            </div>
          </div>
          <div className="space-y-6">
            <Skeleton className="h-40 w-full rounded-2xl" />
            <Skeleton className="h-40 w-full rounded-2xl" />
            <Skeleton className="h-40 w-full rounded-2xl" />
          </div>
        </div>
        <div className="lg:col-span-4 h-[600px]">
           <Skeleton className="h-full w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
};

export default function AnalysisReport({ 
  lang, 
  data: rawData, 
  masterData, 
  isDemo, 
  contractText, 
  outputLang, 
  translating,
  loading,
  analysisStep,
  reportId,
  setOutputLang,
  onReset,
  userEmail
}: AnalysisReportProps) {
  const currentLabels = T[lang];

  // Safeguards for missing properties on data to prevent runtime TypeErrors
  const data = {
    contract_type: rawData?.contract_type || '',
    contract_type_en: rawData?.contract_type_en || '',
    party_a: rawData?.party_a || '',
    party_b: rawData?.party_b || '',
    duration: rawData?.duration || '',
    summary_mandarin: rawData?.summary_mandarin || '',
    summary_english: rawData?.summary_english || '',
    full_translation_mandarin: rawData?.full_translation_mandarin || '',
    risk_score: rawData?.risk_score ?? 0,
    risk_level: rawData?.risk_level || 'LOW',
    risk_verdict: rawData?.risk_verdict || '',
    red_flags: Array.isArray(rawData?.red_flags) ? rawData.red_flags.map(flag => ({
      title_cn: flag?.title_cn || '',
      title_en: flag?.title_en || '',
      original_text: flag?.original_text || '',
      translation_cn: flag?.translation_cn || '',
      explanation_cn: flag?.explanation_cn || '',
      explanation_en: flag?.explanation_en || '',
      suggested_fix_cn: flag?.suggested_fix_cn || '',
      law_reference: flag?.law_reference || '',
    })) : [],
    risky_clauses: Array.isArray(rawData?.risky_clauses) ? rawData.risky_clauses.map(clause => ({
      topic_cn: clause?.topic_cn || '',
      topic_en: clause?.topic_en || '',
      risk_level: clause?.risk_level || 'LOW',
      original_text: clause?.original_text || '',
      translation_cn: clause?.translation_cn || '',
      explanation_cn: clause?.explanation_cn || '',
      explanation_en: clause?.explanation_en || '',
      suggested_fix_cn: clause?.suggested_fix_cn || '',
      suggested_fix_en: clause?.suggested_fix_en || '',
    })) : [],
    missing_clauses: Array.isArray(rawData?.missing_clauses) ? rawData.missing_clauses.map(item => ({
      name_cn: item?.name_cn || '',
      name_id: item?.name_id || '',
      importance_cn: item?.importance_cn || '',
      importance_en: item?.importance_en || '',
    })) : [],
    cultural_legal_notes: Array.isArray(rawData?.cultural_legal_notes) ? rawData.cultural_legal_notes.map(note => String(note || '')) : [],
    conclusion: rawData?.conclusion || '',
  };

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [isTranslationExpanded, setIsTranslationExpanded] = useState(false);
  const [translationText, setTranslationText] = useState('');
  const [translationLoading, setTranslationLoading] = useState(false);
  const [openClauseIdx, setOpenClauseIdx] = useState<number | null>(null);
  const [chatLoading, setChatLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [gaugeScore, setGaugeScore] = useState(0);

  // Feedback states
  const [feedbackRating, setFeedbackRating] = useState<number | null>(null);
  const [feedbackComment, setFeedbackComment] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);
  const [showFeedbackWidget, setShowFeedbackWidget] = useState(true);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const highRiskCount = data.red_flags.length + data.risky_clauses.filter(c => 
    ['高', 'TINGGI', 'HIGH'].includes(c.risk_level)
  ).length;

  const riskSummaryCard = () => (
    <div style={{
      background: 'white',
      border: '1px solid #E5E0D8',
      borderRadius: '10px',
      padding: '16px 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
      flexWrap: 'wrap',
      gap: '12px'
    }}>
      <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
        <span style={{
          fontSize: '28px',
          fontWeight: 700,
          color: '#B91C1C'
        }}>{data.risk_score}</span>
        <span style={{fontSize:'11px', color:'#9CA3AF'}}>/100</span>
        <span style={{
          background: '#B91C1C',
          color: 'white',
          fontSize: '10px',
          fontWeight: 700,
          padding: '3px 10px',
          borderRadius: '20px'
        }}>{getRiskLevelText(data.risk_score, outputLang)}</span>
      </div>
      <div style={{display:'flex', gap:'16px'}}>
        <div style={{textAlign:'center'}}>
          <div style={{fontSize:'18px', fontWeight:700, color:'#B91C1C'}}>
            {data.red_flags.length}
          </div>
          <div style={{fontSize:'10px', color:'#9CA3AF'}}>Red Flags</div>
        </div>
        <div style={{textAlign:'center'}}>
          <div style={{fontSize:'18px', fontWeight:700, color:'#D97706'}}>
            {data.risky_clauses.length}
          </div>
          <div style={{fontSize:'10px', color:'#9CA3AF'}}>Risky Clauses</div>
        </div>
        <div style={{textAlign:'center'}}>
          <div style={{fontSize:'18px', fontWeight:700, color:'#6B7280'}}>
            {data.missing_clauses.length}
          </div>
          <div style={{fontSize:'10px', color: '#9CA3AF' }}>Missing</div>
        </div>
      </div>
    </div>
  );

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animate gauge score
    const duration = 1500;
    const startTime = Date.now();
    const endValue = data.risk_score;

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setGaugeScore(Math.floor(eased * endValue));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    animate();
  }, [data.risk_score]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [timeAgo, setTimeAgo] = useState('');

  useEffect(() => {
    if (!data) return;
    const updateTime = () => {
        const labels: any = {
            en: 'Analyzed just now',
            cn: '刚刚已分析',
            id: 'Baru saja dianalisis'
        };
        setTimeAgo(labels[outputLang] || labels.en);
    };
    updateTime();
    const interval = setInterval(() => {
      const labels: any = {
          en: 'Analyzed 1m ago',
          cn: '1分钟前已分析',
          id: 'Dianalisis 1 menit lalu'
      };
      setTimeAgo(labels[outputLang] || labels.en);
    }, 60000);
    return () => clearInterval(interval);
  }, [data, outputLang]);

  const getGaugeColor = (score: number) => {
    if (score <= 30) return '#15803D'; // Green
    if (score <= 60) return '#D97706'; // Amber
    return '#B91C1C';
  };

  const ringCircumference = 2 * Math.PI * 65;
  const ringOffset = ringCircumference - (data?.risk_score / 100) * ringCircumference;

  const RESULT_UI_LABELS: Record<OutputLanguage, any> = {
    en: {
      exportPDF:    'Export PDF',
      shareReport:  'Share Report',
      analyzedAgo:  'ago',
      analyzedJust: 'Analyzed just now',
      analyzedMin:  '1 minute ago',
      analyzedMins: 'minutes ago',
      reportBadge:  'REPORT',
      analysisComplete: 'Analysis Complete'
    },
    cn: {
      exportPDF:    '导出PDF',
      shareReport:  '分享报告',
      analyzedAgo:  '前已分析',
      analyzedJust: '刚刚已分析',
      analyzedMin:  '1分钟前已分析',
      analyzedMins: '分钟前已分析',
      reportBadge:  '分析报告',
      analysisComplete: '分析完成'
    },
    id: {
      exportPDF:    'Ekspor PDF',
      shareReport:  'Bagikan',
      analyzedAgo:  'yang lalu',
      analyzedJust: 'Baru saja dianalisis',
      analyzedMin:  '1 menit yang lalu',
      analyzedMins: 'menit yang lalu',
      reportBadge:  'LAPORAN',
      analysisComplete: 'Analisis Selesai'
    }
  };

  const UI = RESULT_UI_LABELS[outputLang] || RESULT_UI_LABELS.en;

  function getAnalyzedAgoText(res: AnalysisResult, oL: OutputLanguage) {
    const labels = RESULT_UI_LABELS[oL] || RESULT_UI_LABELS.en;
    // For demo purposes, we can simulate time, 
    // but usually report has a timestamp.
    // If not, we just show "Just now"
    return labels.analyzedJust;
  }

  const getRiskLevelText = (score: number, oLang: OutputLanguage) => {
    let level: 'high' | 'medium' | 'low';
    if (score >= 70) level = 'high';
    else if (score >= 40) level = 'medium';
    else level = 'low';
    
    const labels = {
      en: { high: 'High Risk', medium: 'Medium Risk', low: 'Low Risk' },
      cn: { high: '高风险', medium: '中等风险', low: '低风险' },
      id: { high: 'Risiko Tinggi', medium: 'Risiko Sedang', low: 'Risiko Rendah' }
    };
    
    return labels[oLang][level];
  };

  const getRiskPillText = (clauseRisk: string, oLang: OutputLanguage) => {
    const map: { [key: string]: { [key: string]: string } } = {
      en: { '高': 'HIGH', '中': 'MEDIUM', '低': 'LOW', 'HIGH': 'HIGH', 'MEDIUM': 'MEDIUM', 'LOW': 'LOW', 'TINGGI': 'HIGH', 'SEDANG': 'MEDIUM', 'RENDAH': 'LOW' },
      cn: { 'HIGH': '高', 'MEDIUM': '中', 'LOW': '低', '高': '高', '中': '中', '低': '低', 'TINGGI': '高', 'SEDANG': '中', 'RENDAH': '低' },
      id: { 'HIGH': 'TINGGI', 'MEDIUM': 'SEDANG', 'LOW': 'RENDAH', '高': 'TINGGI', '中': 'SEDANG', '低': 'RENDAH', 'TINGGI': 'TINGGI', 'SEDANG': 'SEDANG', 'RENDAH': 'RENDAH' }
    };
    const key = String(clauseRisk).toUpperCase();
    return map[oLang][key] || clauseRisk;
  };

  const getFormattedDate = () => {
    const now = new Date();
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const day = now.getDate();
    const month = months[now.getMonth()];
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${month} ${day}, ${year} at ${hours}:${minutes}`;
  };

  const handleSendMessage = async (msgOverride?: string) => {
    const messageText = msgOverride || inputValue;
    if (!messageText.trim() || chatLoading) return;
    
    const userMsg: Message = { 
        role: 'user', 
        content: messageText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    if (!msgOverride) setInputValue('');
    setChatLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messageText,
          contractText,
          data,
          outputLang,
          isDemo,
          userEmail,
          sessionToken: localStorage.getItem('yora_session_token')
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server responded with status ${response.status}`);
      }

      const resJson = await response.json();

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: resJson.text || "I'm sorry, I couldn't generate a response.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } catch (err) {
      console.error(err);
      if (isDemo) {
        setTimeout(() => {
          setMessages(prev => [...prev, { 
            role: 'assistant', 
            content: "根据演示合同的内容，该风险点确实存在。印尼法律对此有严格限定。",
            contentEn: "Based on the demo contract, this risk point indeed exists. Indonesian law has strict limitations on this.",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }]);
        }, 1000);
      } else {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: "抱歉，由于 API 配置问题，我暂时无法回答。请检查您的 GEMINI_API_KEY 配置。",
          contentEn: "Sorry, I cannot answer right now due to API configuration issues. Please check your GEMINI_API_KEY configuration.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }
    } finally {
      setChatLoading(false);
    }
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (feedbackRating === null || feedbackSubmitting) return;

    setFeedbackSubmitting(true);
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail || 'anonymous',
          rating: feedbackRating,
          comment: feedbackComment,
          sessionToken: localStorage.getItem('yora_session_token')
        })
      });

      if (response.ok) {
        setFeedbackSubmitted(true);
        setTimeout(() => {
          setShowFeedbackWidget(false);
        }, 4000);
      } else {
        showToast("Gagal mengirim feedback, silakan coba lagi.", "error");
      }
    } catch (err) {
      console.error("Error submitting feedback:", err);
      showToast("Gagal mengirim feedback, silakan coba lagi.", "error");
    } finally {
      setFeedbackSubmitting(false);
    }
  };

  const handleDownloadReport = () => {
    // Build date string here — in the main window context
    const now = new Date();
    const months = [
      'January','February','March','April','May','June',
      'July','August','September','October','November','December'
    ];
    const formattedDate = 
      months[now.getMonth()] + ' ' + 
      now.getDate() + ', ' + 
      now.getFullYear() + ' · ' +
      String(now.getHours()).padStart(2,'0') + ':' +
      String(now.getMinutes()).padStart(2,'0');

    console.log('Exporting PDF with lang:', outputLang);
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert(
        outputLang === 'cn' 
          ? '❌ 弹出窗口被浏览器拦截。请允许此网站的弹出窗口后重试。\n\n方法：点击地址栏右侧的弹出窗口图标，选择"始终允许"。'
          : outputLang === 'id'
          ? '❌ Pop-up diblokir oleh browser. Izinkan pop-up untuk situs ini lalu coba lagi.\n\nCara: Klik ikon pop-up di pojok kanan address bar, pilih "Selalu izinkan".'
          : '❌ Pop-up blocked by your browser. Please allow pop-ups for this site and try again.\n\nHow: Click the pop-up icon in your address bar and select "Always allow".'
      );
      return;
    }

    const reportHTML = generateReportHTML(data, reportId, outputLang, formattedDate);
    
    printWindow.document.open();
    printWindow.document.write(reportHTML);
    printWindow.document.close();

    // Wait for all resources (fonts, images) to load before printing
    let printed = false;
    const tryPrint = () => {
      if (printed) return;
      printed = true;
      printWindow.focus();
      printWindow.print();
    };

    // Trigger print after images load OR after 2.5s timeout, whichever comes first
    printWindow.onload = () => setTimeout(tryPrint, 300);
    setTimeout(tryPrint, 2500);
  };

  const generateReportHTML = (analysisResult: AnalysisResult, reportId: string, oLang: OutputLanguage, formattedDate: string) => {
    const L = {
      en: {
        overview:    'Contract Overview',
        partyA:      'PARTY A',
        partyB:      'PARTY B',
        duration:    'DURATION',
        summary:     'EXECUTIVE SUMMARY',
        riskScore:   'Risk Score',
        riskLevel:   'Risk Level',
        verdict:     'Verdict',
        redFlags:    'Red Flag Alerts',
        original:    'ORIGINAL CLAUSE TEXT',
        translation: 'TRANSLATION',
        whyRisky:    'WHY IT\'S RISKY',
        suggested:   'SUGGESTED REVISION',
        lawRef:      'LAW REFERENCE',
        clauses:     'Clause Breakdown',
        clauseCol1:  'Clause',
        clauseCol2:  'Risk',
        clauseCol3:  'Explanation',
        missing:     'Missing Protections',
        cultural:    'Cultural & Legal Context',
        disclaimer:  'Legal Disclaimer',
        disclaimerTxt: 'This report is for informational purposes only and does not constitute legal advice. Consult a qualified lawyer before signing.',
        credit:      'YORA 永睿 · Contract Risk Analyzer · Powered by Google Gemini AI',
        generatedBy: 'Generated by YORA Contract Risk Analyzer',
        fullTranslation: 'Full Contract Translation',
        fullTranslationNote: 'Complete word-for-word translation of the original contract. Original clause text is preserved in each article.',
        conclusion: 'Conclusion & Recommendations',
        conclusionAdvice: 'Always consult a qualified lawyer before signing any contract. This analysis is AI-generated and for informational purposes only.'
      },
      cn: {
        overview:    '合同概览',
        partyA:      '甲方',
        partyB:      '乙方',
        duration:    '合同期限',
        summary:     '执行摘要',
        riskScore:   '风险评分',
        riskLevel:   '风险等级',
        verdict:     '分析结论',
        redFlags:    '核心风险预警',
        original:    '原始条款文本',
        translation: '翻译',
        whyRisky:    '风险原因',
        suggested:   '修改建议',
        lawRef:      '法律依据',
        clauses:     '条款明细',
        clauseCol1:  '条款',
        clauseCol2:  '风险',
        clauseCol3:  '说明',
        missing:     '缺失关键条款',
        cultural:    '文化与法律背景',
        disclaimer:  '免责声明',
        disclaimerTxt: '本报告由 YORA Contract Risk Analyzer 生成，仅供参考，不构成法律建议。签署任何合同前请咨询持牌律师。',
        credit:      'YORA 永睿 · Contract Risk Analyzer · 由 Google Gemini AI 驱动',
        generatedBy: '由 YORA Contract Risk Analyzer 生成',
        fullTranslation: '合同全文翻译',
        fullTranslationNote: '原合同的完整逐字翻译。每条原始条款文本均予以保留。',
        conclusion: '结论与建议',
        conclusionAdvice: '签署任何合同前，请务必咨询持牌律师。本分析由 AI 生成，仅供参考。'
      },
      id: {
        overview:    'Ringkasan Kontrak',
        partyA:      'PIHAK A',
        partyB:      'PIHAK B',
        duration:    'DURASI',
        summary:     'RINGKASAN EKSEKUTIF',
        riskScore:   'Skor Risiko',
        riskLevel:   'Tingkat Risiko',
        verdict:     'Kesimpulan',
        redFlags:    'Peringatan Bahaya',
        original:    'TEKS KLAUSUL ASLI',
        translation: 'TERJEMAHAN',
        whyRisky:    'MENGAPA BERISIKO',
        suggested:   'SARAN REVISI',
        lawRef:      'REFERENSI HUKUM',
        clauses:     'Analisis Klausul',
        clauseCol1:  'Klausul',
        clauseCol2:  'Risiko',
        clauseCol3:  'Penjelasan',
        missing:     'Perlindungan yang Hilang',
        cultural:    'Konteks Hukum & Budaya',
        disclaimer:  'Penafian Hukum',
        disclaimerTxt: 'Laporan ini hanya untuk tujuan informasi dan bukan merupakan nasihat hukum. Konsultasikan dengan pengacara sebelum menandatangani kontrak.',
        credit:      'YORA 永睿 · Contract Risk Analyzer · Didukung Google Gemini AI',
        generatedBy: 'Dibuat oleh YORA Contract Risk Analyzer',
        fullTranslation: 'Terjemahan Kontrak Lengkap',
        fullTranslationNote: 'Terjemahan kata demi kata lengkap dari kontrak asli. Teks klausul asli disimpan di setiap pasal.',
        conclusion: 'Kesimpulan & Rekomendasi',
        conclusionAdvice: 'Selalu konsultasikan dengan pengacara sebelum menandatangani kontrak apapun. Analisis ini dibuat oleh AI dan hanya untuk tujuan informasi.'
      }
    };

    const labels = L[oLang] || L['en'];
    
  const sortedRiskyClauses = sortClausesByRisk(analysisResult.risky_clauses);
  const formattedFullTranslation = formatFullTranslation('', oLang);
  
  // Dynamic Section Counter for PDF
  let pdfSectionIndex = 0;
  const getNextSectionNum = () => {
    pdfSectionIndex++;
    return pdfSectionIndex;
  };

  // BUILD CLEAN PAGE TITLE
  const contractName = analysisResult.contract_type || analysisResult.contract_type_en || 'Contract Analysis';

    const safeTitle = contractName
      .replace(/[<>"'&]/g, '')
      .trim()
      .substring(0, 60);

    const docTitle = safeTitle + ' — YORA Contract Risk Analyzer';

    const riskClass = analysisResult.risk_score >= 70 ? 'high' : analysisResult.risk_score >= 40 ? 'medium' : 'low';
    
    function getRiskBadgeForPDF(score: number, lang: OutputLanguage) {
      const level = score >= 70 ? 'high' : score >= 40 ? 'medium' : 'low';
      const map: any = {
        en: { high:'HIGH RISK', medium:'MEDIUM RISK', low:'LOW RISK' },
        cn: { high:'高风险', medium:'中等风险', low:'低风险' },
        id: { high:'RISIKO TINGGI', medium:'RISIKO SEDANG', low:'RISIKO RENDAH' }
      };
      return (map[lang] || map.en)[level];
    }

    const riskBadgeText = getRiskBadgeForPDF(analysisResult.risk_score, oLang);

    return `<!DOCTYPE html>
<html lang="${oLang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width">
<title>${docTitle}</title>
<script>
  window.onload = function() {
    document.title = "${docTitle}";
  };
</script>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, Helvetica, sans-serif;
    font-size: 11px;
    color: #1A1A1A;
    line-height: 1.5;
    background: white;
    padding: 30px 40px;
  }

  @media print {
    @page { size: A4; margin: 15mm 15mm 20mm 15mm; }
    body { margin: 0; padding: 0; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    .section-break { border-top: 1px solid #E5E0D8; margin: 24px 0; page-break-after: always; }
    .page-break { page-break-before: always; }
    .no-break { page-break-inside: avoid; }
    .pdf-custom-footer {
      position: fixed; bottom: 0; left: 0; right: 0; width: 100%;
      height: 40px; display: flex !important; align-items: center;
      background: white; z-index: 9999; padding: 0 40px;
      border-top: 1px solid #B91C1C;
    }
    .pdf-footer-section { flex: 1; display: flex; align-items: center; font-family: Arial, sans-serif; font-size: 10px; white-space: nowrap; }
    .pdf-footer-center { justify-content: center; text-align: center; font-size: 9px; color: #6B7280; }
    .pdf-footer-right { justify-content: flex-end; font-family: 'Courier New', Courier, monospace; font-size: 11px; font-weight: 700; color: #374151; }
    .pdf-disclaimer { page-break-inside: avoid; }
  }

  .report-top-header {
    display: flex; justify-content: space-between; align-items: flex-start;
    padding-bottom: 14px; margin-bottom: 20px;
    border-bottom: 2px solid #B91C1C;
  }

  .pdf-section {
    margin-top: 0; margin-bottom: 0;
    padding-top: 30px; padding-bottom: 30px;
    border-bottom: 1.5px solid #E5E7EB;
    page-break-inside: avoid;
    background: white;
  }
  .pdf-section:last-of-type { border-bottom: none; }

  .pdf-section-title {
    display: flex; align-items: center; gap: 10px;
    font-size: 14px; font-weight: 700; color: #1A1A1A;
    margin-bottom: 16px;
  }

  .pdf-section.red-flags { page-break-before: auto; }
  .pdf-section.clause-breakdown { page-break-before: auto; }
  .flag-card, .clause-table tr, .missing-item { page-break-inside: avoid; }

  .report-logo-sub { font-size: 10px; color: #9CA3AF; margin-top: 3px; letter-spacing: 0.04em; }
  .report-meta { text-align: right; }
  .report-meta-date { font-size: 11px; font-weight: 600; color: #1A1A1A; }
  .report-meta-id { font-size: 9px; color: #9CA3AF; margin-top: 3px; }
  .report-meta-powered { font-size: 9px; color: #B91C1C; margin-top: 4px; letter-spacing: 0.04em; }

  .risk-score-block { background: white; border: 1px solid #E5E7EB; border-radius: 8px; padding: 16px; margin: 10px 0; }
  .risk-score-row { display: flex; align-items: center; gap: 12px; }
  .risk-score-number { font-size: 40px; font-weight: 700; color: #B91C1C; }
  .risk-score-badge { font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: 12px; text-transform: uppercase; color: white; }
  .risk-score-badge.HIGH { background: #B91C1C; }
  .risk-score-badge.MEDIUM { background: #D97706; }
  .risk-score-badge.LOW { background: #15803D; }

  .flag-card { border: 1px solid #E5E7EB; border-left: 3px solid #B91C1C; padding: 12px; margin-bottom: 12px; background: white; }
  .flag-title { font-size: 12px; font-weight: 700; color: #B91C1C; margin-bottom: 8px; border-bottom: 1px solid #E5E7EB; padding-bottom: 4px; }
  .flag-label { font-size: 8px; font-weight: 700; color: #9CA3AF; text-transform: uppercase; margin-top: 8px; }
  .flag-text { font-size: 10px; margin-bottom: 4px; }
  .flag-suggest { background: #F0FDF4; border: 1px solid #BBF7D0; padding: 6px; border-radius: 4px; color: #065F46; font-weight: 500; font-style: italic; }

  .clause-table { width: 100%; border-collapse: collapse; margin-top: 8px; }
  .clause-table th { background: #F3F4F6; text-align: left; padding: 6px 10px; font-size: 9px; text-transform: uppercase; color: #6B7280; }
  .clause-table td { padding: 8px 10px; border-bottom: 1px solid #F3F4F6; vertical-align: top; }
  .risk-pill { font-size: 8px; font-weight: 800; padding: 2px 6px; border-radius: 3px; text-transform: uppercase; }
  .risk-pill.high { background: #FEE2E2; color: #7F1D1D; }
  .risk-pill.medium { background: #FEF3C7; color: #78350F; }
  .risk-pill.low { background: #D1FAE5; color: #065F46; }

  .missing-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .missing-item { background: #FFFBEB; border: 1px solid #FDE68A; padding: 10px; border-radius: 6px; }
  .missing-name { font-weight: 700; font-size: 11px; color: #78350F; }
  .missing-importance { font-size: 9px; color: #92400E; margin-top: 4px; }

  .disclaimer-block { margin-top: 30px; padding: 12px; background: #F9FAFB; border-top: 2px solid #B91C1C; font-size: 9px; color: #6B7280; }

  .pdf-custom-footer {
    width: 100%; height: 30px; background: white;
    border-top: 2px solid #B91C1C;
    display: flex; justify-content: space-between; align-items: center;
    padding: 0 40px;
    font-family: Arial, Helvetica, sans-serif; font-size: 9px; color: #9CA3AF;
  }
  .pdf-footer-section { flex: 1; display: flex; align-items: center; font-family: Arial, sans-serif; font-size: 10px; white-space: nowrap; }
  .pdf-footer-center { justify-content: center; text-align: center; font-size: 9px; color: #6B7280; }
  .pdf-footer-right { justify-content: flex-end; font-family: 'Courier New', Courier, monospace; font-size: 11px; font-weight: 700; color: #374151; }

  .pdf-disclaimer {
    margin-top: 32px; padding: 16px 18px;
    background: #F9FAFB; border: 1px solid #E5E0D8;
    border-top: 3px solid #B91C1C; border-radius: 0 0 8px 8px;
    page-break-inside: avoid; font-family: Arial, Helvetica, sans-serif;
  }
</style>
</head>
<body>
  <div class="pdf-custom-footer">
    <div class="pdf-footer-section" style="font-weight:700;font-size:11px;display:flex;align-items:center;gap:8px;">
      <img src="https://i.ibb.co.com/GfDK38yS/Yora-logo.png" style="width:24px;height:24px;object-fit:contain;" referrerpolicy="no-referrer" />
      <span style="color:#1A1A1A;font-weight:900;">YORA</span> <span style="color:#000000;font-weight:900;font-size:11px;">永睿</span>
    </div>
    <div class="pdf-footer-section pdf-footer-center" style="font-size:8.5px;">
      YORA Contract Risk Analyzer &nbsp;·&nbsp; Powered by Google Gemini AI
    </div>
    <div class="pdf-footer-section pdf-footer-right" style="font-size:10px;">
      ${reportId}
    </div>
  </div>


  <div class="report-top-header">
    <div style="display:flex;align-items:center;gap:16px;">
      <img src="https://i.ibb.co.com/GfDK38yS/Yora-logo.png" style="width:60px;height:60px;object-fit:contain;" referrerpolicy="no-referrer" />
      <div>
        <div style="font-size:20px;font-weight:900;color:#1A1A1A;letter-spacing:-0.5px;">YORA <span style="color:#D1D5DB;font-weight:400;font-size:18px;">|</span> <span style="color:#000000;font-weight:900;font-size:18px;">永睿</span></div>
        <div class="report-logo-sub">Contract Risk Analyzer</div>
      </div>
    </div>
    <div class="report-meta">
      <div class="report-meta-date">${formattedDate}</div>
      <div class="report-meta-id">ID: ${reportId}</div>
      <div class="report-meta-powered">Powered by Google Gemini AI</div>
    </div>
  </div>


  <div class="pdf-section">
    <div class="pdf-section-title">
      <span style="background:#B91C1C;color:white;font-size:10px;font-weight:700;min-width:20px;height:20px;padding:0 4px;border-radius:10px;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;"> ${getNextSectionNum()}</span>
      ${labels.overview}
    </div>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 10px;">
      <div>
        <div class="flag-label">${labels.partyA}</div>
        <div style="font-size: 13px; font-weight: 700;">${analysisResult.party_a}</div>
      </div>
      <div>
        <div class="flag-label">${labels.partyB}</div>
        <div style="font-size: 13px; font-weight: 700;">${analysisResult.party_b}</div>
      </div>
    </div>
    <div class="flag-label">${labels.duration}</div>
    <div style="font-size: 11px;">${analysisResult.duration}</div>
    <div style="background: #F8F9FA; padding: 12px; border-radius: 6px; margin-top: 10px;">
      <div class="flag-label" style="margin-top:0">${labels.summary}</div>
      <p style="font-size: 10px; line-height: 1.6;">${analysisResult.summary_mandarin}</p>
    </div>
  </div>

  <div class="pdf-section no-break">
    <div class="pdf-section-title">
      <span style="background:#B91C1C;color:white;font-size:10px;font-weight:700;min-width:20px;height:20px;padding:0 4px;border-radius:10px;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;"> ${getNextSectionNum()}</span>
      ${labels.riskScore}
    </div>
    <div class="risk-score-block">
      <div class="risk-score-row">
        <div class="risk-score-number">${analysisResult.risk_score}</div>
        <div>
          <div style="color: #9CA3AF; margin-bottom: 2px;">/ 100</div>
          <div class="risk-score-badge ${riskClass.toUpperCase()}">${riskBadgeText}</div>
        </div>
      </div>
      <div style="margin-top: 10px; padding-top: 8px; border-top: 1px solid #E5E7EB; font-size: 10px; color: #374151;">
        ${analysisResult.risk_verdict}
      </div>
    </div>
  </div>

    <div class="pdf-section red-flags">
      <div class="pdf-section-title">
        <span style="background:#B91C1C;color:white;font-size:10px;font-weight:700;min-width:20px;height:20px;padding:0 4px;border-radius:10px;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;"> ${getNextSectionNum()}</span>
        ${labels.redFlags}
      </div>
      ${analysisResult.red_flags.map(f => `
        <div class="flag-card">
          <div class="flag-title">${f.title_cn}</div>
          
          <!-- Original text label -->
          <div style="
            font-size: 8px;
            font-weight: 700;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            color: #9CA3AF;
            margin-bottom: 3px;
          ">${labels.original}:</div>

          <!-- Original text — full, no truncation -->
          <div style="
            font-size: 10px;
            font-style: italic;
            color: #6B7280;
            background: rgba(0,0,0,0.03);
            padding: 6px 10px;
            border-radius: 4px;
            margin-bottom: 6px;
            line-height: 1.6;
            font-family: Arial, Helvetica, sans-serif;
            white-space: normal;
            word-break: break-word;
            overflow: visible;
          ">
            ${f.original_text}
          </div>
          
          <!-- Translation block -->
          <div style="margin-top: 10px;">
            <div style="font-size: 8px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #9CA3AF; margin-bottom: 4px; font-family: Arial, sans-serif;">
              ${labels.translation}:
            </div>
            <div style="font-size: 11px; color: #1A1A1A; line-height: 1.6; padding: 10px 14px; border-left: 3px solid #B91C1C; background: #FFF; border-radius: 0 4px 4px 0; font-family: Arial, sans-serif; font-style: normal; font-weight: 500; border: 1px solid #F3F4F6; border-left-width: 4px;">
              ${f.translation_cn || f.original_text}
            </div>
          </div>

          <div class="flag-label" style="margin-top:12px;">${labels.whyRisky}:</div>
          <div class="flag-text">${f.explanation_cn}</div>
          <div class="flag-label">${labels.suggested}:</div>
          <div class="flag-suggest">${f.suggested_fix_cn}</div>
          <div class="flag-label">${labels.lawRef}:</div>
          <div class="flag-text">${f.law_reference}</div>
        </div>
      `).join('')}
    </div>

    <div class="pdf-section clause-breakdown">
      <div class="pdf-section-title">
        <span style="background:#B91C1C;color:white;font-size:10px;font-weight:700;min-width:20px;height:20px;padding:0 4px;border-radius:10px;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;"> ${getNextSectionNum()}</span>
        ${labels.clauses}
      </div>
      
      <table style="
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 16px;
        font-family: Arial, Helvetica, sans-serif;
        table-layout: fixed;
      ">
        <!-- Column widths -->
        <colgroup>
          <col style="width: 45%">  <!-- Clause + original + translation -->
          <col style="width: 12%">  <!-- Risk pill -->
          <col style="width: 43%">  <!-- Explanation -->
        </colgroup>

        <!-- Header row -->
        <tr style="
          background: #F9FAFB;
          border-bottom: 2px solid #E5E0D8;
        ">
          <th style="
            padding: 10px 12px;
            font-size: 9px;
            font-weight: 700;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            color: #6B7280;
            text-align: left;
            font-family: Arial, Helvetica, sans-serif;
          ">${labels.clauseCol1}</th>
          <th style="
            padding: 10px 12px;
            font-size: 9px;
            font-weight: 700;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            color: #6B7280;
            text-align: center;
            font-family: Arial, Helvetica, sans-serif;
          ">${labels.clauseCol2}</th>
          <th style="
            padding: 10px 12px;
            font-size: 9px;
            font-weight: 700;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            color: #6B7280;
            text-align: left;
            font-family: Arial, Helvetica, sans-serif;
          ">${labels.clauseCol3}</th>
        </tr>

        <!-- Data rows -->
        ${(() => {
          let lastRiskLevel: string | null = null;
          return sortedRiskyClauses.map((clause, index) => {
            const normalizedRisk = normalizeRisk(clause.risk_level);
            let groupHeader = '';
            
            if (normalizedRisk !== lastRiskLevel) {
              lastRiskLevel = normalizedRisk;
              
              const groupLabel = {
                high:   { en:'🔴 HIGH RISK CLAUSES', cn:'🔴 高风险条款', id:'🔴 KLAUSUL RISIKO TINGGI' },
                medium: { en:'🟡 MEDIUM RISK CLAUSES', cn:'🟡 中等风险条款', id:'🟡 KLAUSUL RISIKO SEDANG' },
                low:    { en:'🟢 LOW RISK CLAUSES', cn:'🟢 低风险条款', id:'🟢 KLAUSUL RISIKO RENDAH' }
              }[normalizedRisk]?.[oLang === 'cn' ? 'cn' : oLang === 'id' ? 'id' : 'en'];
              
              groupHeader = `
                <tr>
                  <td colspan="3" style="
                    background: ${normalizedRisk === 'high' ? '#FEE2E2' : normalizedRisk === 'medium' ? '#FEF3C7' : '#D1FAE5'};
                    padding: 8px 12px;
                    font-size: 10px;
                    font-weight: 700;
                    color: ${normalizedRisk === 'high' ? '#7F1D1D' : normalizedRisk === 'medium' ? '#78350F' : '#064E3B'};
                    letter-spacing: 0.06em;
                    border-bottom: 1px solid #E5E0D8;
                  ">
                    ${groupLabel}
                  </td>
                </tr>
              `;
            }
            
            return `
              ${groupHeader}
              <tr style="
                border-bottom: 1px solid #F3F4F6;
                background: ${index % 2 === 0 ? 'white' : '#FAFAF8'};
                page-break-inside: avoid;
              ">
                <!-- Clause column -->
                <td style="
                  padding: 12px;
                  vertical-align: top;
                ">
                  <!-- Topic title -->
                  <div style="
                    font-size: 11px;
                    font-weight: 700;
                    color: #1A1A1A;
                    margin-bottom: 8px;
                    line-height: 1.4;
                  ">${clause.topic_cn}</div>
                  
                  <!-- Original text label -->
                  <div style="
                    font-size: 8px;
                    font-weight: 700;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    color: #9CA3AF;
                    margin-bottom: 3px;
                  ">${labels.original}:</div>
                  
                  <!-- Original text full content -->
                  <div style="
                    font-size: 10px;
                    font-style: italic;
                    color: #6B7280;
                    background: #F9FAFB;
                    padding: 6px 8px;
                    border-radius: 4px;
                    margin-bottom: 6px;
                    line-height: 1.6;
                    white-space: normal;
                    word-break: break-word;
                  ">${clause.original_text}</div>
                  
                  <!-- Translation label -->
                  <div style="
                    font-size: 8px;
                    font-weight: 700;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    color: #9CA3AF;
                    margin-bottom: 3px;
                  ">${labels.translation}:</div>
                  
                  <!-- Translation content -->
                  <div style="
                    font-size: 10px;
                    color: #374151;
                    padding: 6px 8px;
                    border-left: 2px solid #B91C1C;
                    line-height: 1.6;
                    word-break: break-word;
                  ">${clause.translation_cn || clause.original_text}</div>
                </td>
                
                <!-- Risk column -->
                <td style="
                  padding: 12px;
                  vertical-align: top;
                  text-align: center;
                ">
                  <span style="
                    display: inline-block;
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 9px;
                    font-weight: 700;
                    letter-spacing: 0.06em;
                    white-space: nowrap;
                    background: ${normalizedRisk === 'high' 
                      ? '#FEE2E2' 
                      : normalizedRisk === 'medium' 
                        ? '#FEF3C7' 
                        : '#D1FAE5'};
                    color: ${normalizedRisk === 'high' 
                      ? '#7F1D1D' 
                      : normalizedRisk === 'medium' 
                        ? '#78350F' 
                        : '#064E3B'};
                  ">
                    ${getRiskPillLabel(clause.risk_level, oLang)}
                  </span>
                </td>
                
                <!-- Explanation column -->
                <td style="
                  padding: 12px;
                  vertical-align: top;
                  font-size: 11px;
                  color: #374151;
                  line-height: 1.7;
                  word-break: break-word;
                ">
                  ${clause.explanation_cn}
                </td>
              </tr>
            `;
          }).join('');
        })()}
      </table>
    </div>

    <div class="pdf-section">
      <div class="pdf-section-title">
        <span style="background:#B91C1C;color:white;font-size:10px;font-weight:700;min-width:20px;height:20px;padding:0 4px;border-radius:10px;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;"> ${getNextSectionNum()}</span>
        ${labels.missing}
      </div>
      <div class="missing-grid">
        ${analysisResult.missing_clauses.map(item => `
          <div class="missing-item">
            <div class="missing-name">${item.name_cn}</div>
            <p class="missing-importance">${item.importance_cn}</p>
          </div>
        `).join('')}
      </div>
    </div>

    <div class="pdf-section">
      <div class="pdf-section-title">
        <span style="background:#D97706;color:white;font-size:10px;font-weight:700;min-width:20px;height:20px;padding:0 4px;border-radius:10px;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;"> ${getNextSectionNum()}</span>
        ${labels.cultural}
      </div>
      ${analysisResult.cultural_legal_notes.map(note => `<div style="margin-bottom:8px;">• ${note}</div>`).join('')}
    </div>

  <div class="pdf-section">
    <div class="pdf-section-title">
      <span style="background:#B91C1C;color:white;font-size:10px;font-weight:700;min-width:20px;height:20px;padding:0 4px;border-radius:10px;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;"> ${getNextSectionNum()}</span>
      ${labels.fullTranslation}
    </div>
    <div style="background:#F9FAFB;border:1px solid #E5E0D8;border-left:3px solid #B91C1C;padding:14px 16px;border-radius:0 6px 6px 0;font-size:10px;color:#6B7280;font-family:Arial,sans-serif;">
      ${oLang === 'cn' ? ' 完整翻译可在网页版中按需加载。请返回 YORA Contract Risk Analyzer 查看完整翻译。' : oLang === 'id' ? ' Terjemahan lengkap dapat dimuat di versi web. Kembali ke YORA Contract Risk Analyzer untuk melihat terjemahan lengkap.' : ' Full translation is available on-demand in the web version. Return to YORA Contract Risk Analyzer to load the full translation.'}
    </div>
  </div>

  <div class="pdf-section conclusion-section" style="
    page-break-inside: avoid;
  ">
    <div class="pdf-section-title">
      <span style="background:#B91C1C;color:white;font-size:10px;font-weight:700;min-width:20px;height:20px;padding:0 4px;border-radius:10px;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;"> ${getNextSectionNum()}</span>
      ${labels.conclusion}
    </div>
    
    <div style="
      background: white;
      border: 1px solid #E5E7EB;
      border-left: 4px solid #B91C1C;
      border-radius: 0 8px 8px 0;
      padding: 20px 24px;
      font-size: 12px;
      line-height: 1.8;
      color: #1A1A1A;
      font-family: Arial, Helvetica, sans-serif;
    ">
      ${analysisResult.conclusion || `
        ${analysisResult.risk_verdict || (oLang === 'cn' ? '基于本次分析，该合同具有一定风险。' : oLang === 'id' ? 'Berdasarkan analisis ini, kontrak memiliki risiko tertentu.' : 'Based on this analysis, the contract has certain risks.')}
        <br><br>
        <strong>${oLang === 'cn' ? '建议' : oLang === 'id' ? 'Saran' : 'Recommendations'}:</strong><br>
        1. ${oLang === 'cn' ? '优先处理高风险条款' : oLang === 'id' ? 'Prioritaskan penanganan klausul risiko tinggi' : 'Prioritize handling high-risk clauses'}<br>
        2. ${oLang === 'cn' ? '在签署前咨询专业律师' : oLang === 'id' ? 'Konsultasikan dengan pengacara sebelum tanda tangan' : 'Consult a professional lawyer before signing'}<br>
        3. ${oLang === 'cn' ? '与对方协商修改不公平条款' : oLang === 'id' ? 'Negosiasikan perubahan pasal yang tidak adil' : 'Negotiate changes to unfair terms'}
      `}
    </div>
    
    <div style="
      margin-top: 16px;
      padding: 12px 16px;
      background: #F0FDF4;
      border: 1px solid #BBF7D0;
      border-radius: 6px;
      font-size: 10px;
      color: #065F46;
      font-family: Arial, Helvetica, sans-serif;
    ">
      ${labels.conclusionAdvice}
    </div>
  </div>

  <div class="pdf-disclaimer">
    <div style="
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #B91C1C;
      margin-bottom: 8px;
    ">
      ⚠️ ${labels.disclaimer}
    </div>

    <div style="
      font-size: 11px;
      color: #6B7280;
      line-height: 1.7;
      margin-bottom: 6px;
    ">
      ${labels.disclaimerTxt}
    </div>
  </div>

  </div>
</body>
</html>`;
  };
  const handleShare = async () => {
    const shareText = buildShareText(data, outputLang);
    const shareTitle = "YORA Contract Risk Analyzer — Contract Risk Analysis";
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: window.location.href
        });
        return;
      } catch (err) {
        // User cancelled or error
      }
    }
    
    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(
        shareTitle + '\n\n' + shareText + 
        '\n\n' + window.location.href
      );
      showToast('✓ Link copied to clipboard!', 'success');
    } catch (err) {
      showToast('Could not copy automatically.', 'error');
    }
  };

  const handleLoadTranslation = async () => {
    if (translationText) return; // already loaded
    setTranslationLoading(true);
    try {
      const response = await fetch('/api/translate-contract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contractText, outputLang })
      });
      if (!response.ok) throw new Error('Translation failed');
      const result = await response.json();
      setTranslationText(result.translation || '');
    } catch (err) {
      console.error(err);
      setTranslationText('Translation failed. Please try again.');
    } finally {
      setTranslationLoading(false);
    }
  };

  const getShareLink = (res: AnalysisResult) => {
      const text = buildShareText(res, outputLang);
      const url = window.location.href;
      return `https://wa.me/?text=${encodeURIComponent(text + '\n\n' + url)}`;
  };

  const buildShareText = (res: AnalysisResult, oLang: OutputLanguage) => {
    if (oLang === 'en') {
      return [
        '📋 Contract Analysis by YORA Contract Risk Analyzer',
        '',
        `Contract Type: ${res.contract_type_en}`,
        `Risk Score: ${res.risk_score}/100 — ${res.risk_level}`,
        `Verdict: ${res.risk_verdict}`,
        '',
        '🚨 Top Red Flags:',
        res.red_flags.map((f,i) => `${i+1}. ${f.title_cn}`).join('\n'),
        '',
        'Analyzed with YORA Contract Risk Analyzer',
        'For China ↔ Indonesia ↔ International Business'
      ].join('\n');
    }
    
    if (oLang === 'id') {
      return [
        '📋 Analisis Kontrak oleh YORA Contract Risk Analyzer',
        '',
        `Jenis Kontrak: ${res.contract_type}`,
        `Skor Risiko: ${res.risk_score}/100 — ${res.risk_level}`,
        `Kesimpulan: ${res.risk_verdict}`,
        '',
        '🚨 Peringatan Utama:',
        res.red_flags.map((f,i) => `${i+1}. ${f.title_cn}`).join('\n'),
        '',
        'Dianalisis dengan YORA Contract Risk Analyzer',
        'Untuk bisnis China ↔ Indonesia'
      ].join('\n');
    }
    
    return [
      '📋 YORA Contract Risk Analyzer 合同分析报告',
      '',
      `合同类型：${res.contract_type}`,
      `风险评分：${res.risk_score}/100 — ${res.risk_level}`,
      `分析结论：${res.risk_verdict}`,
      '',
      '🚨 主要风险：',
      res.red_flags.map((f,i) => `${i+1}. ${f.title_cn}`).join('\n'),
      '',
      '由 YORA Contract Risk Analyzer 分析 — 中印跨境合同风险分析工具'
    ].join('\n');
  };

  const suggestedQuestions = [
    lang === 'cn' ? "这个合同符合印尼劳动法吗？" : lang === 'id' ? "Apakah kontrak ini sesuai dengan UU Ketenagakerjaan?" : "Is this contract compliant with Indonesian Labor Law?",
    lang === 'cn' ? "如何修改解约条款？" : lang === 'id' ? "Bagaimana cara mengubah pasal terminasi?" : "How to modify the termination clause?",
    lang === 'cn' ? "什么是印尼劳动法第156条？" : lang === 'id' ? "Apa itu Pasal 156 UU Ketenagakerjaan?" : "What is Article 156 of the Labor Law?",
  ];

  if (loading) {
    return <SkeletonLoader step={analysisStep || 1} />;
  }

  if (translating) {
    const targetLangFull = outputLang === 'cn' ? 'Simplified Mandarin' : outputLang === 'id' ? 'Bahasa Indonesia' : 'English';
    const targetLangNative = outputLang === 'cn' ? '简体中文' : outputLang === 'id' ? 'Bahasa Indonesia' : 'English';
    
    return (
      <div className="max-w-[1240px] mx-auto px-4 md:px-12 py-12 space-y-12" id="analysis">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
           <div className="flex items-center gap-4 text-primary font-bold animate-pulse">
             <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-sm">
                <RefreshCw size={18} className="animate-spin" />
                <span>
                  {lang === 'cn' ? `正在翻译分析结果到 ${targetLangNative}...` : 
                   lang === 'id' ? `Menerjemahkan analisis ke ${targetLangFull}...` : 
                   `Translating analysis to ${targetLangFull}...`}
                </span>
             </div>
           </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="h-64 bg-slate-100 animate-pulse rounded-2xl shadow-sm"></div>
            <div className="h-96 bg-slate-100 animate-pulse rounded-2xl shadow-sm"></div>
          </div>
          <div className="h-[600px] bg-slate-100 animate-pulse rounded-2xl shadow-lg"></div>
        </div>
      </div>
    );
  }

  const reportDate = getFormattedDate();

  return (
    <div className="max-w-[1240px] mx-auto px-4 md:px-12 py-12" id="analysis">
      {/* Risk Summary */}
      {riskSummaryCard()}

      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 fade-in-up">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className="bg-[#B91C1C] p-2 text-white font-bold text-xs rounded uppercase tracking-widest">{UI.reportBadge}</div>
             <div className="text-on-surface-variant font-mono text-xs font-bold">ID: {reportId}</div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-on-surface font-serif">
            {outputLang === 'cn' 
              ? data.contract_type 
              : outputLang === 'id' 
                ? (data.contract_type || data.contract_type_en)
                : (data.contract_type_en || data.contract_type)}
          </h1>
          <div className="flex flex-wrap items-center gap-4">
            <p className="text-on-surface-variant font-medium flex items-center gap-2 text-sm">
              <Calendar size={14} /> {reportDate}
            </p>
            <div className="h-4 w-[1px] bg-outline-variant"></div>
            <p className="text-[#C0392B] font-bold flex items-center gap-2 text-sm bg-[#B91C1C]/5 px-2 py-0.5 rounded">
              <RefreshCw size={14} className="animate-spin" /> {getAnalyzedAgoText(data, outputLang)}
            </p>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
          <button 
            onClick={handleDownloadReport}
            disabled={isExporting}
            className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#B91C1C] text-white font-semibold text-[13px] hover:bg-[#991B1B] transition-all cursor-pointer disabled:opacity-50 shadow-[0_2px_8px_rgba(185,28,28,0.25)] hover:shadow-[0_4px_12px_rgba(185,28,28,0.35)] hover:-translate-y-0.5"
          >
            {isExporting ? <Loader2 className="animate-spin" size={16} /> : <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">↓</div>}
            {UI.exportPDF}
          </button>
          <button 
            onClick={handleShare}
            className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-white text-[#B91C1C] border-1.5 border-[#B91C1C] font-semibold text-[13px] hover:bg-[#FFF1F2] transition-all cursor-pointer hover:border-[#991B1B]"
          >
            <div className="w-5 h-5 flex items-center justify-center">↗</div>
            {UI.shareReport}
          </button>
        </div>
      </div>
      
      {/* Mobile Sticky Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E0D8] p-3 grid grid-cols-2 gap-2 z-[100] shadow-[0_-4px_12px_rgba(0,0,0,0.08)]">
        <button onClick={handleDownloadReport} className="flex items-center justify-center gap-2 bg-[#B91C1C] text-white py-3 rounded-xl font-bold text-[13px] active:scale-95 transition-transform">
          <Download size={16} /> {outputLang === 'cn' ? '导出' : outputLang === 'id' ? 'Ekspor' : 'Export'}
        </button>
        <a href={getShareLink(data)} target="_blank" className="flex items-center justify-center gap-2 bg-[#25D366] text-white py-3 rounded-xl font-bold text-[13px] text-center active:scale-95 transition-transform">
            <MessageSquare size={16} /> WhatsApp
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Analysis Results */}
        <div className="lg:col-span-8 space-y-12">
          {(() => {
            let sectionIdx = 0;
            const nextIdx = () => { sectionIdx++; return sectionIdx; };
            
            return (
              <>
                {/* 1. Executive Summary */}
                <section className="bg-white border border-outline-variant rounded-2xl p-4 sm:p-8 md:p-10 shadow-sm fade-in-up">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="bg-secondary p-2 rounded-lg flex items-center justify-center text-white font-bold text-sm min-w-[32px] h-8 px-2">
                      {nextIdx()}
                    </div>
                    <h2 className="text-xl font-bold text-on-surface uppercase tracking-tight">{T[outputLang].contractOverview || 'CONTRACT OVERVIEW'}</h2>
                    <div className="h-[1px] flex-1 bg-outline-variant/30"></div>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-[0.2em] mb-4">
                        {T[outputLang].executiveSummary || 'EXECUTIVE SUMMARY'}
                      </h3>
                      <p className="text-[15px] text-on-surface leading-[1.8] font-medium">
                        {data.summary_mandarin}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-outline-variant/30">
                       <div>
                         <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">{T[outputLang].partyA || 'PARTY A'}</p>
                         <p className="text-sm font-bold text-on-surface break-words">{data.party_a}</p>
                       </div>
                       <div>
                         <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">{T[outputLang].partyB || 'PARTY B'}</p>
                         <p className="text-sm font-bold text-on-surface break-words">{data.party_b}</p>
                       </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">{T[outputLang].duration || 'DURATION'}</p>
                      <p className="text-sm font-medium text-on-surface">{data.duration}</p>
                    </div>
                  </div>
                </section>

                {/* 2. Risk Score Block */}
                <section className="bg-white border border-outline-variant rounded-2xl p-4 sm:p-8 md:p-10 shadow-sm fade-in-up">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="bg-[#B91C1C] p-2 rounded-lg flex items-center justify-center text-white font-bold text-sm min-w-[32px] h-8 px-2">
                      {nextIdx()}
                    </div>
                    <h2 className="text-xl font-bold text-on-surface uppercase tracking-tight">{T[outputLang].riskScore}</h2>
                    <div className="h-[1px] flex-1 bg-outline-variant/30"></div>
                  </div>
                  
                  <div className="flex flex-col md:flex-row items-center gap-10">
                    <div className="relative w-40 h-40">
                      <svg className="w-40 h-40 rotate-[-90deg]" viewBox="0 0 160 160">
                        <circle
                          cx="80"
                          cy="80"
                          r="65"
                          fill="none"
                          stroke="#E5E0D8"
                          strokeWidth="12"
                        />
                        <circle 
                          cx="80" cy="80" r="65" 
                          className="risk-ring transition-[stroke-dashoffset] duration-[1500ms] ease-in-out"
                          strokeWidth="12" 
                          fill="none"
                          strokeLinecap="round"
                          stroke={getGaugeColor(data.risk_score)}
                          strokeDasharray={ringCircumference}
                          strokeDashoffset={ringCircumference}
                          ref={(el) => {
                              if (el) {
                                  setTimeout(() => el.style.strokeDashoffset = String(ringOffset), 100);
                              }
                          }}
                        />
                      </svg>
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                          <div className="text-5xl font-bold font-serif text-[#1A1A1A] leading-none">{gaugeScore}</div>
                      </div>
                    </div>

                    <div className="flex-1 space-y-4 text-center md:text-left">
                      <div 
                        className="inline-block px-6 py-1.5 rounded-full text-[11px] font-bold tracking-[0.1em] uppercase text-white shadow-sm"
                        style={{ backgroundColor: getGaugeColor(data.risk_score) }}
                      >
                        {getRiskLevelLabel(data.risk_score, outputLang)}
                      </div>
                      <p className="text-[16px] text-[#1A1A1A] leading-relaxed font-semibold">
                        {data.risk_verdict}
                      </p>
                    </div>
                  </div>
                </section>

                {/* 3. Red Flags */}
                <section className="space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-[#B91C1C] p-2 rounded-lg flex items-center justify-center text-white font-bold text-sm min-w-[32px] h-8 px-2">
                      {nextIdx()}
                    </div>
                    <h2 className="text-xl font-bold text-on-surface uppercase tracking-tight">{T[outputLang].redFlags || 'RED FLAGS'} ({data.red_flags.length})</h2>
                    <div className="h-[1px] flex-1 bg-outline-variant/30"></div>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    {data.red_flags.map((flag, idx) => (
                      <motion.div 
                        key={idx}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        viewport={{ once: true }}
                        className="bg-white border border-outline-variant rounded-2xl overflow-hidden shadow-sm"
                      >
                        <div className="flex flex-col md:flex-row">
                          <div className="md:w-16 bg-[#FDF2F2] flex items-center justify-center border-b md:border-b-0 md:border-r border-outline-variant/30 py-4 md:py-0">
                            <span className="text-[#B91C1C] font-black text-xl italic opacity-40">0{idx + 1}</span>
                          </div>
                          <div className="flex-1 p-6 md:p-8 space-y-6">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <h4 className="text-lg font-bold text-[#B91C1C]">{flag.title_cn}</h4>
                              <div className="flex items-center gap-2">
                                <button 
                                  onClick={async () => {
                                    const textToCopy = `${flag.title_cn}\n\n${T[outputLang].originalClause}: ${flag.original_text}\n\n${T[outputLang].whyRisky}: ${flag.explanation_cn}\n\n${T[outputLang].suggestedRevision}: ${flag.suggested_fix_cn}`;
                                    try {
                                      await navigator.clipboard.writeText(textToCopy);
                                      showToast('✓ Copied to clipboard!', 'success');
                                    } catch (err) {
                                      showToast('Failed to copy', 'error');
                                    }
                                  }}
                                  className="p-1.5 rounded-full border border-outline-variant hover:bg-[#FFF1F2] hover:border-[#B91C1C] transition-all group"
                                  title="Copy Clause Info"
                                >
                                  <Copy size={14} className="text-on-surface-variant group-hover:text-[#B91C1C]" />
                                </button>
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container-low rounded border border-outline-variant/50 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest leading-none">
                                  <Gavel size={12} /> {flag.law_reference}
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-outline-variant/10">
                              <div className="space-y-3">
                                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{T[outputLang].originalClause || 'ORIGINAL TEXT'}</p>
                                <p className="text-[13px] text-on-surface font-mono bg-surface-container-lowest p-4 rounded-lg border border-outline-variant/30 leading-[1.6]">"{flag.original_text}"</p>
                              </div>
                              <div className="space-y-3">
                                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{T[outputLang].translation || 'CORE TRANSLATION'}</p>
                                <p className="text-[14px] text-on-surface font-bold leading-relaxed">{flag.translation_cn}</p>
                                <div className="bg-[#FFFBEB] border-l-2 border-amber-500 p-4 rounded-r-lg space-y-2">
                                   <p className="text-[10px] font-bold text-amber-900 uppercase tracking-widest">{T[outputLang].whyRisky || 'WHY IT IS RISKY'}</p>
                                   <p className="text-[13px] text-amber-900 leading-[1.6] font-medium">{flag.explanation_cn}</p>
                                </div>
                              </div>
                            </div>

                            <div className="bg-green-50/50 border border-green-200/50 p-6 rounded-xl space-y-2">
                              <p className="text-[10px] font-bold text-green-800 uppercase tracking-widest flex items-center gap-2">
                                 <ShieldCheck size={14} /> {T[outputLang].suggestedRevision || 'SUGGESTED REVISION'}
                              </p>
                              <p className="text-[13px] text-green-900 font-bold italic leading-relaxed">"{flag.suggested_fix_cn}"</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </section>

                {/* 4. Risky Clauses Table */}
                <section className="space-y-6 fade-in-up">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-[#D97706] p-2 rounded-lg flex items-center justify-center text-white font-bold text-sm min-w-[32px] h-8 px-2">
                      {nextIdx()}
                    </div>
                    <h2 className="text-xl font-bold text-on-surface uppercase tracking-tight">{T[outputLang].riskyClauses || T[outputLang].clauseBreakdown || 'RISKY CLAUSES'} ({data.risky_clauses.length})</h2>
                    <div className="h-[1px] flex-1 bg-outline-variant/30"></div>
                  </div>

                  <div className="bg-white border border-outline-variant rounded-2xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-surface-container-low border-b border-outline-variant/50">
                            <th className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">{T[outputLang].topic}</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">{T[outputLang].risk}</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">{T[outputLang].details}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(() => {
                            const sorted = sortClausesByRisk(data.risky_clauses);
                            return sorted.map((item, idx) => {
                              const currentRisk = normalizeRisk(item.risk_level);
                              const prevRisk = idx > 0 ? normalizeRisk(sorted[idx - 1].risk_level) : null;
                              const showHeader = currentRisk !== prevRisk;
                              const isOpen = openClauseIdx === idx;
                              
                              return (
                                <React.Fragment key={idx}>
                                  {showHeader && (
                                    <tr className="bg-surface-container-low/30">
                                      <td colSpan={3} className="px-6 py-3 border-b border-outline-variant/30">
                                        <div className="flex items-center gap-2">
                                          <div className={`w-2 h-2 rounded-full ${
                                            currentRisk === 'high' ? 'bg-error' : 
                                            currentRisk === 'medium' ? 'bg-amber-500' : 'bg-green-500'
                                          }`} />
                                          <span className="text-[10px] font-extrabold text-on-surface-variant uppercase tracking-[0.15em]">
                                            {getRiskPillLabel(item.risk_level, outputLang)} {T[outputLang].clauseBreakdown || 'CLAUSE ANALYSIS'}
                                          </span>
                                        </div>
                                      </td>
                                    </tr>
                                  )}
                                  <tr 
                                    className={`border-b border-outline-variant/20 hover:bg-[#FAFAFA] transition-colors cursor-pointer ${isOpen ? 'bg-[#FAFAFA]' : ''}`}
                                    onClick={() => setOpenClauseIdx(isOpen ? null : idx)}
                                  >
                                    <td className="px-6 py-5 align-top">
                                      <div className="flex items-center gap-3">
                                        <ChevronRight size={16} className={`text-on-surface-variant transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`} />
                                        <div>
                                          <p className="font-bold text-on-surface text-[14px]">{item.topic_cn}</p>
                                          {!isOpen && (
                                            <p className="text-[11px] text-on-surface-variant line-clamp-1 mt-1 font-medium italic">
                                              {item.original_text.substring(0, 80)}{item.original_text.length > 80 ? '...' : ''}
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                    </td>
                                    <td className="px-6 py-5 align-top">
                                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${
                                        currentRisk === 'high' ? 'bg-error/10 text-error' : 
                                        currentRisk === 'medium' ? 'bg-amber-100 text-amber-700' : 
                                        'bg-green-100 text-green-700'
                                      }`}>
                                        {getRiskPillLabel(item.risk_level, outputLang)}
                                      </span>
                                    </td>
                                    <td className="px-6 py-5 align-top">
                                       <div className="space-y-4">
                                          {!isOpen ? (
                                            <p className="text-[13px] text-on-surface font-medium line-clamp-2">{item.explanation_cn}</p>
                                          ) : (
                                            <motion.div 
                                              initial={{ opacity: 0, y: -10 }}
                                              animate={{ opacity: 1, y: 0 }}
                                              className="space-y-4"
                                            >
                                               <div>
                                                 <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">{T[outputLang].originalClause}:</p>
                                                 <div className="bg-[#F9FAFB] rounded p-4 border border-outline-variant/30">
                                                    <p className="text-[10px] text-on-surface-variant leading-relaxed font-medium italic">
                                                        {item.original_text}
                                                    </p>
                                                 </div>
                                               </div>
                                               <div>
                                                 <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">{T[outputLang].translation || 'CORE TRANSLATION'}:</p>
                                                 <div className="bg-white rounded p-4 border border-primary/20 border-l-2 border-l-primary shadow-sm">
                                                    <p className="text-[10px] text-on-surface leading-relaxed">
                                                        {item.translation_cn || item.original_text}
                                                    </p>
                                                 </div>
                                               </div>
                                               <div>
                                                 <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">{T[outputLang].details || 'EXPLANATION'}:</p>
                                                 <p className="text-[13px] text-on-surface font-medium leading-[1.6]">{item.explanation_cn}</p>
                                               </div>
                                            </motion.div>
                                          )}
                                       </div>
                                    </td>
                                  </tr>
                                </React.Fragment>
                              );
                            });
                          })()}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </section>

                {/* 5. Missing Clauses */}
                <section className="space-y-6 fade-in-up">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-primary p-2 rounded-lg flex items-center justify-center text-white font-bold text-sm min-w-[32px] h-8 px-2">
                      {nextIdx()}
                    </div>
                    <h2 className="text-xl font-bold text-on-surface uppercase tracking-tight">{T[outputLang].missingClauses || 'MISSING CLAUSES'} ({data.missing_clauses.length})</h2>
                    <div className="h-[1px] flex-1 bg-outline-variant/30"></div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {data.missing_clauses.map((item, idx) => (
                      <motion.div 
                        key={idx}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        viewport={{ once: true }}
                        className="p-6 bg-surface-container-lowest border border-outline-variant/50 rounded-2xl space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-on-surface">{item.name_cn}</h4>
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <Plus size={16} />
                          </div>
                        </div>
                        <p className="text-[11px] text-on-surface-variant font-mono uppercase tracking-[0.1em]">{item.name_id}</p>
                        <p className="text-[13px] text-on-surface-variant leading-relaxed font-medium">{item.importance_cn}</p>
                      </motion.div>
                    ))}
                  </div>
                </section>

                {/* 6. Cultural & Legal Background */}
                <section className="bg-surface-container-low border border-outline-variant/50 rounded-2xl p-4 sm:p-8 md:p-10 space-y-6 fade-in-up">
                  <div className="flex items-center gap-3">
                    <div className="bg-[#D97706] p-2 rounded-lg flex items-center justify-center text-white font-bold text-sm min-w-[32px] h-8 px-2">
                      {nextIdx()}
                    </div>
                    <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-[0.3em]">{T[outputLang].culturalLegalContext} ({data.cultural_legal_notes.length})</h3>
                  </div>
                  <div className="space-y-4">
                    {data.cultural_legal_notes.map((note, idx) => (
                      <div key={idx} className="flex gap-4">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#B91C1C] mt-2 shrink-0"></div>
                        <p className="text-[14px] text-on-surface leading-relaxed font-medium">{note}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* 7. Full Translation */}
                <div className="border border-outline-variant bg-white rounded-xl overflow-hidden shadow-sm fade-in-up">
                  <button 
                      onClick={() => setIsTranslationExpanded(!isTranslationExpanded)}
                      className="w-full flex items-center justify-between p-6 hover:bg-[#FAFAFA] transition-all font-bold text-[#1A1A1A] uppercase tracking-widest text-[11px] cursor-pointer"
                  >
                      <div className="flex items-center gap-4">
                          <div className="bg-[#C0392B] p-2 rounded-lg flex items-center justify-center text-white font-bold text-sm min-w-[32px] h-8 px-2">
                            {nextIdx()}
                          </div>
                          <div className="flex items-center gap-2">
                              <Languages size={18} className="text-[#C0392B]" />
                              {T[outputLang].fullTranslation || 'FULL TRANSLATION'}
                          </div>
                      </div>
                      <ChevronDown className={`text-[#6B7280] transition-transform duration-300 ${isTranslationExpanded ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                      {isTranslationExpanded && (
                          <motion.div 
                              initial={{ height: 0 }}
                              animate={{ height: 'auto' }}
                              exit={{ height: 0 }}
                              className="overflow-hidden border-t border-outline-variant/50"
                          >
                              <div className="p-8 bg-[#FAFAFA] overflow-y-auto max-h-[800px]">
                                  <div className="mb-8 p-6 bg-white border border-outline-variant/50 rounded-2xl">
                                      <h4 className="text-sm font-bold text-on-surface flex items-center gap-2 mb-2 uppercase tracking-widest">
                                          <Languages size={18} className="text-primary" />
                                          {T[outputLang].fullTranslation}
                                      </h4>
                                      <p className="text-xs text-on-surface-variant italic leading-relaxed">
                                          {T[outputLang].fullTranslationNote}
                                      </p>
                                  </div>
                                  {!translationText ? (
                                    <button
                                      onClick={handleLoadTranslation}
                                      disabled={translationLoading}
                                      className="w-full py-5 border-2 border-dashed border-[#B91C1C]/30 rounded-xl text-[#B91C1C] font-bold text-sm hover:border-[#B91C1C] hover:bg-[#FFF1F2] transition-all disabled:opacity-50"
                                    >
                                      {translationLoading
                                        ? (outputLang === 'cn' ? ' 翻译中...' : outputLang === 'id' ? ' Menerjemahkan...' : ' Translating...')
                                        : (outputLang === 'cn' ? ' Muat Terjemahan Lengkap' : outputLang === 'id' ? ' Muat Terjemahan Lengkap' : ' Load Full Translation')}
                                    </button>
                                  ) : (
                                    <div
                                      dangerouslySetInnerHTML={{
                                        __html: formatFullTranslation(translationText, outputLang)
                                      }}
                                      style={{
                                        fontSize: '13px',
                                        lineHeight: '1.8',
                                        color: '#374151',
                                        maxHeight: '500px',
                                        overflowY: 'auto',
                                        padding: '16px',
                                        background: '#FAFAF8',
                                        borderRadius: '8px',
                                        border: '1px solid #E5E0D8'
                                      }}
                                    />
                                  )}
                              </div>
                          </motion.div>
                      )}
                  </AnimatePresence>
                </div>

                {/* 8. Conclusion Section */}
                <section className="bg-[#FFF1F2] border border-[#FECACA] border-l-4 border-l-[#B91C1C] rounded-r-2xl p-4 sm:p-8 md:p-10 space-y-6 fade-in-up">
                  <div className="flex items-center gap-3">
                    <div className="bg-[#B91C1C] p-2 rounded-lg flex items-center justify-center text-white font-bold text-sm min-w-[32px] h-8 px-2">
                      {nextIdx()}
                    </div>
                    <h2 className="text-xl font-bold text-[#1A1A1A] uppercase tracking-tight">
                      {outputLang === 'cn' ? '结论与建议' : outputLang === 'id' ? 'KESIMPULAN & REKOMENDASI' : 'CONCLUSION & RECOMMENDATIONS'}
                    </h2>
                  </div>
                  
                  <div className="text-[15px] text-[#1A1A1A] leading-[1.8] font-medium whitespace-pre-wrap">
                    {data.conclusion || (
                      <>
                        {data.risk_verdict || (outputLang === 'cn' ? '基于本次分析，该合同具有一定风险。' : outputLang === 'id' ? 'Berdasarkan analisis ini, kontrak memiliki risiko tertentu.' : 'Based on this analysis, the contract has certain risks.')}
                        <br /><br />
                        <span className="font-bold">{outputLang === 'cn' ? '建议' : outputLang === 'id' ? 'Saran' : 'Recommendations'}:</span><br />
                        1. {outputLang === 'cn' ? '优先处理高风险条款' : outputLang === 'id' ? 'Prioritaskan penanganan klausul risiko tinggi' : 'Prioritize handling high-risk clauses'}<br />
                        2. {outputLang === 'cn' ? '在签署前咨询专业律师' : outputLang === 'id' ? 'Konsultasikan dengan pengacara sebelum tanda tangan' : 'Consult a professional lawyer before signing'}<br />
                        3. {outputLang === 'cn' ? '与对方协商修改不公平条款' : outputLang === 'id' ? 'Negosiasikan perubahan pasal yang tidak adil' : 'Negotiate changes to unfair terms'}
                      </>
                    )}
                  </div>

                  <div className="bg-green-50 border border-green-200 p-4 rounded-xl flex gap-3 items-start">
                     <p className="text-xs text-green-800 font-medium leading-relaxed">
                       {outputLang === 'cn' ? '签署任何合同前，请务必咨询持牌律师。本分析由 AI 生成，仅供参考。' : 
                        outputLang === 'id' ? 'Selalu konsultasikan dengan pengacara sebelum menandatangani kontrak apapun. Analisis ini dibuat oleh AI dan hanya untuk tujuan informasi.' : 
                        'Always consult a qualified lawyer before signing any contract. This analysis is AI-generated and for informational purposes only.'}
                     </p>
                  </div>
                </section>

                {/* Feedback Widget */}
                {showFeedbackWidget && (
                  <section className="bg-white border border-outline-variant rounded-2xl p-6 md:p-8 space-y-4 shadow-sm fade-in-up relative overflow-hidden">
                    <button 
                      onClick={() => setShowFeedbackWidget(false)}
                      className="absolute top-4 right-4 p-1 rounded-full text-on-surface-variant/60 hover:text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
                      title="Dismiss"
                      type="button"
                    >
                      <X size={18} />
                    </button>

                    {feedbackSubmitted ? (
                      <div className="flex flex-col items-center justify-center py-6 text-center space-y-2 animate-in fade-in duration-300">
                        <span className="text-4xl">🙏</span>
                        <h3 className="text-lg font-bold text-on-surface">
                          {outputLang === 'cn' ? '感谢您的反馈！' : outputLang === 'id' ? 'Terima kasih atas feedbacknya! 🙏' : 'Thank you for your feedback!'}
                        </h3>
                        <p className="text-xs text-on-surface-variant">
                          {outputLang === 'cn' ? '您的意见将帮助我们不断改进服务。' : outputLang === 'id' ? 'Masukan Anda sangat berharga untuk terus meningkatkan layanan kami.' : 'Your input is highly valuable in helping us improve our service.'}
                        </p>
                      </div>
                    ) : (
                      <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                        <div className="space-y-1">
                          <h3 className="text-base font-bold text-on-surface">
                            {outputLang === 'cn' ? '您对本次分析结果满意吗？' : outputLang === 'id' ? 'Gimana hasil analisisnya?' : 'How was the analysis result?'}
                          </h3>
                          <p className="text-xs text-on-surface-variant">
                            {outputLang === 'cn' ? '请选择评分以帮助我们改进。' : outputLang === 'id' ? 'Bantu kami meningkatkan kualitas dengan memberikan rating.' : 'Help us improve by selecting a rating.'}
                          </p>
                        </div>

                        {/* Interactive Star Selection */}
                        <div className="flex items-center gap-2">
                          {[1, 2, 3, 4, 5].map((star) => {
                            const isSelected = feedbackRating !== null && star <= feedbackRating;
                            return (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setFeedbackRating(star)}
                                className="p-1 rounded-md transition-transform active:scale-90 cursor-pointer"
                                title={`${star} / 5`}
                              >
                                <Star 
                                  size={28} 
                                  className={`transition-all ${isSelected ? 'fill-[#E30613] text-[#E30613]' : 'text-gray-300 hover:text-[#E30613]/50'}`} 
                                />
                              </button>
                            );
                          })}
                        </div>

                        {feedbackRating !== null && (
                          <div className="space-y-3 animate-in fade-in duration-300">
                            <div className="space-y-1">
                              <label htmlFor="feedback-comment" className="text-xs font-bold text-on-surface-variant block">
                                {outputLang === 'cn' ? '有什么我们可以改进的地方吗？（可选）' : outputLang === 'id' ? 'Ada yang bisa kami perbaiki? (opsional)' : 'Anything we can improve? (optional)'}
                              </label>
                              <textarea
                                id="feedback-comment"
                                rows={3}
                                maxLength={500}
                                value={feedbackComment}
                                onChange={(e) => setFeedbackComment(e.target.value)}
                                placeholder={outputLang === 'cn' ? '请输入您的改进建议...' : outputLang === 'id' ? 'Tulis saran atau komentar Anda di sini...' : 'Enter your feedback or suggestions...'}
                                className="w-full text-base md:text-[13px] p-3 border border-outline-variant rounded-xl bg-surface-container-low outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none text-on-surface"
                              />
                              <div className="text-right text-[10px] text-on-surface-variant/60">
                                {feedbackComment.length} / 500
                              </div>
                            </div>

                            <button
                              type="submit"
                              disabled={feedbackSubmitting}
                              className="w-full sm:w-auto px-6 py-2.5 bg-[#E30613] hover:bg-[#c10510] text-white font-bold text-sm rounded-full flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md active:scale-95 disabled:opacity-50"
                            >
                              {feedbackSubmitting ? <Loader2 className="animate-spin" size={16} /> : null}
                              {outputLang === 'cn' ? '提交反馈' : outputLang === 'id' ? 'Kirim Feedback' : 'Submit Feedback'}
                            </button>
                          </div>
                        )}
                      </form>
                    )}

                    {/* Secondary Link */}
                    <div className="pt-2 border-t border-outline-variant/30 text-xs flex items-center justify-between flex-wrap gap-2">
                      <a 
                        href="https://forms.gle/hx29SABG7JipaSXT9" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-on-surface-variant hover:text-[#E30613] hover:underline font-semibold flex items-center gap-1 transition-all"
                      >
                        {outputLang === 'cn' ? '想进一步帮助我们？填写简短用户画像 →' : outputLang === 'id' ? 'Mau bantu kami lebih jauh? Isi profil pengguna singkat →' : 'Want to help us further? Fill a short user profile →'}
                      </a>
                    </div>
                  </section>
                )}
              </>
            );
          })()}
        </div>

        {/* Right Column: Q&A Chat */}
        <div className="lg:col-span-4 lg:sticky lg:top-24 h-fit fade-in-up">
          <div className={`bg-white border border-outline-variant rounded-2xl flex flex-col h-[650px] shadow-lg overflow-hidden md:relative fixed bottom-0 left-0 w-full z-[60] md:z-0 transition-transform duration-500 ease-in-out ${isChatOpen ? 'translate-y-0' : 'translate-y-full md:translate-y-0'}`} id="chat-widget">
            <div className="bg-[#B91C1C] p-5 flex justify-between items-center shrink-0 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-white border border-[#E5E0D8]/40 p-0.5 shadow-md flex items-center justify-center">
                  <img 
                    src="https://i.ibb.co.com/zhN8sKp4/RUI-PRESENTING-TABLET-BASICS.png" 
                    alt="Rui Profile" 
                    className="w-full h-full object-cover rounded-full" 
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-[13px] uppercase tracking-[0.08em] leading-none" style={{ color: '#FFFFFF' }}>
                    {outputLang === 'cn' ? '智能问答' : outputLang === 'id' ? 'Asisten AI' : 'SMART Q&A'}
                  </h3>
                  <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-tight mt-1.5" style={{ color: '#FFFFFF', opacity: 0.85 }}>
                    <div className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] animate-pulse shadow-[0_0_0_2px_rgba(255,255,255,0.3)]"></div>
                    {outputLang === 'cn' ? '专家助手在线' : outputLang === 'id' ? 'ASISTEN AHLI ONLINE' : 'EXPERT ASSISTANT ONLINE'}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setMessages([])}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors opacity-80 hover:opacity-100"
                  style={{ color: '#FFFFFF' }}
                  title="Clear Chat"
                >
                  <RefreshCw size={16} />
                </button>
                <button 
                  onClick={() => setIsChatOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-lg md:hidden"
                  style={{ color: '#FFFFFF' }}
                >
                  <ChevronDown size={20} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-6 scroll-smooth bg-surface-container-lowest">
               {messages.length === 0 && (
                 <div className="space-y-6">
                    <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant/30 text-center space-y-3">
                       <ShieldCheck className="mx-auto text-primary" size={32} />
                       <p className="text-[13px] text-on-surface font-bold">{T[outputLang].legalNotice || 'LEGAL NOTICE'}</p>
                       <p className="text-[11px] text-on-surface-variant font-medium leading-relaxed">
                          {outputLang === 'cn' ? 'YORA Contract Risk Analyzer 的结果仅供参考，不作为正式法律建议。签署前请咨询专业律师。' : outputLang === 'id' ? 'Hasil YORA Contract Risk Analyzer bersifat informatif. Ini bukan nasihat hukum. Konsultasikan dengan pengacara sebelum tanda tangan.' : 'YORA Contract Risk Analyzer outputs are for informational purposes. This is not legal advice. Always consult a qualified lawyer for official signing.'}
                       </p>
                    </div>

                    <div className="space-y-3">
                      <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.2em] px-2">{lang === 'cn' ? '您可以问我：' : 'SUGGESTED QUESTIONS'}</p>
                      <div className="flex flex-wrap gap-2">
                         {suggestedQuestions.map((q, i) => (
                           <button 
                               key={i}
                               onClick={() => { handleSendMessage(q); }}
                               className="text-left py-2.5 px-4 bg-white border border-outline-variant/50 rounded-xl text-[12px] text-on-surface font-semibold hover:border-primary hover:bg-primary/5 transition-all w-full shadow-sm"
                           >
                             {q}
                           </button>
                         ))}
                      </div>
                    </div>
                 </div>
               )}

              {messages.map((m, i) => (
                <div key={i} className={`flex gap-3 items-start ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
                  {m.role !== 'user' && (
                    <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 bg-white border border-[#E5E0D8]/40 p-0.5 shadow-sm flex items-center justify-center">
                      <img 
                        src="https://i.ibb.co.com/zhN8sKp4/RUI-PRESENTING-TABLET-BASICS.png" 
                        alt="Rui Profile" 
                        className="w-full h-full object-cover rounded-full" 
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}
                  <div className={`max-w-[80%] p-4 rounded-2xl text-[13px] font-medium leading-[1.6] ${m.role === 'user' ? 'bg-[#B91C1C] text-white shadow-md' : 'bg-white border border-outline-variant/50 text-on-surface shadow-sm'}`}>
                    <div className="markdown-body">
                      <Markdown>{m.content}</Markdown>
                    </div>
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="bg-surface-container-low p-4 rounded-2xl text-on-surface-variant">
                    <Loader2 className="animate-spin" size={16} />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="p-4 bg-white border-t border-outline-variant/50 shrink-0 mb-safe">
              <div className="relative flex items-center gap-2">
                <input 
                  type="text" 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={lang === 'cn' ? '输入您的问题...' : lang === 'id' ? 'Ketik pertanyaan...' : 'Type a question...'}
                  className="flex-1 bg-surface-container-low border border-outline-variant/50 rounded-xl px-4 py-3 text-[13px] font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all pr-12"
                />
                <button 
                  type="submit"
                  disabled={chatLoading || !inputValue.trim()}
                  className="absolute right-2 top-1.5 p-2 bg-[#B91C1C] text-white rounded-lg hover:bg-[#A61A1A] transition-all disabled:opacity-50 disabled:bg-gray-400"
                >
                  <Send size={16} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Mobile Chat Toggle Button */}
      <button 
        onClick={() => setIsChatOpen(true)}
        className={`fixed bottom-20 right-6 w-14 h-14 bg-[#B91C1C] text-white rounded-full shadow-2xl flex items-center justify-center z-[110] md:hidden transition-transform duration-300 ${isChatOpen ? 'scale-0' : 'scale-100'}`}
      >
        <MessageSquare size={24} />
      </button>

      {/* Overlay for mobile chat */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsChatOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[55] md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Footer Disclaimer */}
      <div className="mt-12 text-center text-on-surface-variant/40 py-8 border-t border-outline-variant/10 space-y-6">
          <button 
            onClick={onReset}
            className="bg-white border-2 border-[#B91C1C] text-[#B91C1C] px-8 py-3 rounded-full font-bold text-sm hover:bg-[#FFF1F2] transition-colors cursor-pointer"
          >
            {lang === 'cn' ? '再次分析其他合同' : lang === 'id' ? 'Analisis Kontrak Lain' : 'Analyze Another Contract'}
          </button>
          <p className="text-[10px] uppercase font-bold tracking-[0.2em]">
              {T[lang].verified}
          </p>
      </div>

    </div>
  );
}
