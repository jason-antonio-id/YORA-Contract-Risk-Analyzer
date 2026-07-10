import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AnalysisResult, Message, Language, ContractLanguage, OutputLanguage } from './types';
import { ID_DEMO_CONTRACT_TEXT, CN_DEMO_CONTRACT_TEXT, ENG_DEMO_CONTRACT_TEXT, DEMO_RESULTS } from './constants';
import { getOfflineDemoFallback } from './offlineDemoFallbacks';


// Components
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Introduction from './components/Introduction';
import HowItWorks from './components/HowItWorks';
import Scanner from './components/Scanner';
import AnalysisReport from './components/AnalysisReport';
import Personas from './components/Personas';
import Footer from './components/Footer';

const LOADING_STEPS = {
  en: [
    { icon: '📄', text: 'Reading contract structure...' },
    { icon: '🔍', text: 'Identifying parties and terms...' },
    { icon: '⚖️', text: 'Checking against applicable laws...' },
    { icon: '🚨', text: 'Detecting high-risk clauses...' },
    { icon: '📝', text: 'Generating risk analysis...' },
    { icon: '🌐', text: 'Preparing your report...' }
  ],
  cn: [
    { icon: '📄', text: '正在读取合同结构...' },
    { icon: '🔍', text: '正在识别当事方和条款...' },
    { icon: '⚖️', text: '正在对照适用法律审查...' },
    { icon: '🚨', text: '正在检测高风险条款...' },
    { icon: '📝', text: '正在生成风险分析...' },
    { icon: '🌐', text: '正在准备您的报告...' }
  ],
  id: [
    { icon: '📄', text: 'Membaca struktur kontrak...' },
    { icon: '🔍', text: 'Mengidentifikasi pihak dan ketentuan...' },
    { icon: '⚖️', text: 'Memeriksa terhadap hukum yang berlaku...' },
    { icon: '🚨', text: 'Mendeteksi klausul berisiko tinggi...' },
    { icon: '📝', text: 'Membuat analisis risiko...' },
    { icon: '🌐', text: 'Menyiapkan laporan Anda...' }
  ]
};



export default function App() {
  const [uiLang, setUiLang] = useState<Language>('en');
  const lang = uiLang;
  const toggleLang = () => setUiLang(prev => prev === 'cn' ? 'en' : prev === 'en' ? 'id' : 'cn');
  const [contractText, setContractText] = useState('');
  const [isDemo, setIsDemo] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [translating, setTranslating] = useState(false);
  
  // ─── STATE VARIABLES ───────────────────────────────────
  // Currently displayed result (changes on language switch)
  const [displayResult, setDisplayResult] = useState<AnalysisResult | null>(null);
  
  // Store original analysis result — set ONCE, never changed
  const [masterResult, setMasterResult] = useState<AnalysisResult | null>(null);

  // Store translated versions keyed by language
  const [translationCache, setTranslationCache] = useState<{ [key: string]: AnalysisResult | null }>({
    cn: null,
    id: null, 
    en: null
  });

  // OUTPUT LANGUAGE — only changed by user pill click
  // NEVER auto-set from contract detection
  const [outputLang, setOutputLang] = useState<OutputLanguage>('cn');

  const [reportId, setReportId] = useState<string | null>(null);
  const [chatHistory, setMessages] = useState<Message[]>([]);
  const [pdfInfo, setPdfInfo] = useState<{ name: string; pages: number } | null>(null);

  // CONTRACT LANGUAGE — detected from input, display only
  // NEVER used to set outputLang
  const [contractLang, setContractLang] = useState<ContractLanguage>('id');
  const [error, setError] = useState<string | null>(null);
  const [demoType, setDemoType] = useState<'id' | 'cn' | 'en' | null>(null);
  const [view, setView] = useState('home');
  const [userEmail, setUserEmail] = useState<string>('');

  const generateReportId = () => {
    const date = new Date();
    const dateStr = 
      date.getFullYear().toString().substr(2) +
      String(date.getMonth() + 1).padStart(2, '0') +
      String(date.getDate()).padStart(2, '0');
    const random = Math.random().toString(36).substr(2, 6).toUpperCase();
    return `QY-${dateStr}-${random}`;
  };
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      // Scroll Progress
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(progress);

      // Back to Top
      setShowBackToTop(window.scrollY > 400);

      // Navbar Scroll Logic (threshold: 20px as per request)
      const navbar = document.querySelector('.navbar');
      if (navbar) {
        if (window.scrollY > 20) {
          navbar.classList.add('scrolled-premium');
        } else {
          navbar.classList.remove('scrolled-premium');
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Global Scroll Reveal Observer
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    const observeElements = () => {
      document.querySelectorAll('.reveal-on-scroll').forEach((el) => {
        revealObserver.observe(el);
      });
      
      document.querySelectorAll('.fade-in-up').forEach((el) => {
        if (!el.classList.contains('visible')) {
          const entryObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                entryObserver.unobserve(entry.target);
              }
            });
          }, { threshold: 0.15 });
          entryObserver.observe(el);
        }
      });
    };

    observeElements();
    
    const mutationObserver = new MutationObserver(observeElements);
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      revealObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  const [isFading, setIsFading] = useState(false);

  const changeLanguageWithFade = (newLang: Language) => {
    setIsFading(true);
    setTimeout(() => {
      setUiLang(newLang);
      setIsFading(false);
    }, 150);
  };
  
    const safeJsonParse = (str: string) => {
    try {
      // 1. Remove markdown code blocks
      let cleaned = str.replace(/^```json\s*/ig, '').replace(/\s*```$/g, '').trim();
      
      // 2. Handle common trailing commas in arrays and objects
      // This regex matches a comma followed by white space and then a closing brace or bracket
      cleaned = cleaned.replace(/,\s*([}\]])/g, '$1');
      
      // 3. Attempt to handle truncated JSON (very basic)
      if (!cleaned.endsWith('}') && !cleaned.endsWith(']')) {
        // If it's heavily truncated, we can't really fix it easily, 
        // but maybe we can just close the most obvious one if it's close.
        console.warn('JSON appears truncated');
      }

      return JSON.parse(cleaned);
    } catch (e) {
      console.error('Initial JSON parse failed. Original string length:', str.length);
      console.error('Error position:', e instanceof Error ? e.message : String(e));
      
      // Fallback for more aggressive cleaning if needed
      try {
        // Find first { and last }
        const firstBrace = str.indexOf('{');
        const lastBrace = str.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
          const aggressiveClean = str.substring(firstBrace, lastBrace + 1)
            .replace(/,\s*([}\]])/g, '$1'); // Still handle trailing commas
          return JSON.parse(aggressiveClean);
        }
      } catch (innerE) {
        console.error('Aggressive JSON parse fallback also failed');
      }
      
      throw e;
    }
  };

  const handleOutputLangChange = async (newLang: OutputLanguage) => {
    // Update pill selection immediately
    setOutputLang(newLang);

    // Skip if no analysis done yet
    if (!masterResult) return;

    // Check cache first
    if (translationCache[newLang]) {
      setDisplayResult(translationCache[newLang]);
      return;
    }

    if (isDemo) {
      // Offline fallback safeguard if cached translation is missing
      const fallbackResult = newLang === 'cn' 
        ? (demoType === 'id' ? DEMO_RESULTS.id : DEMO_RESULTS.cn)
        : newLang === 'en' 
          ? DEMO_RESULTS.en 
          : getOfflineDemoFallback(demoType === 'en' ? 'en' : 'cn');
      setDisplayResult(fallbackResult);
      setTranslationCache(prev => ({ ...prev, [newLang]: fallbackResult }));
      return;
    }

    // Show loading
    setTranslating(true);

    try {
      // Build text-only payload — NEVER send contractText
      const payload = {
        contract_type: masterResult.contract_type,
        duration: masterResult.duration,
        summary_mandarin: masterResult.summary_mandarin,
        conclusion: masterResult.conclusion,
        full_translation_mandarin: masterResult.full_translation_mandarin,
        risk_level: masterResult.risk_level,
        risk_verdict: masterResult.risk_verdict,
        red_flags: masterResult.red_flags.map(f => ({
          title_cn: f.title_cn,
          translation_cn: f.translation_cn,
          explanation_cn: f.explanation_cn,
          suggested_fix_cn: f.suggested_fix_cn,
          law_reference: f.law_reference || ''
        })),
        risky_clauses: masterResult.risky_clauses.map(c => ({
          topic_cn: c.topic_cn,
          translation_cn: c.translation_cn,
          explanation_cn: c.explanation_cn
        })),
        missing_clauses: masterResult.missing_clauses.map(m => ({
          name_cn: m.name_cn,
          name_id: m.name_id,
          importance_cn: m.importance_cn
        })),
        cultural_legal_notes: masterResult.cultural_legal_notes
      };

      const { full_translation_mandarin: _removed, ...payloadWithoutTranslation } = payload;
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payload: payloadWithoutTranslation, targetLang: newLang })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server responded with status ${response.status}`);
      }

      const translated = await response.json();

      // Safety: preserve fields that must never change
      const finalResult: AnalysisResult = {
        // Never translate these:
        party_a: masterResult.party_a,
        party_b: masterResult.party_b,
        risk_score: masterResult.risk_score,
        contract_type_en: masterResult.contract_type_en,
        
        // Use translated version of full translation
        full_translation_mandarin: '',

        // Use translated versions:
        contract_type: translated.contract_type || masterResult.contract_type,
        duration: translated.duration || masterResult.duration,
        summary_mandarin: translated.summary_mandarin || masterResult.summary_mandarin,
        conclusion: translated.conclusion || masterResult.conclusion,
        risk_level: translated.risk_level || masterResult.risk_level,
        risk_verdict: translated.risk_verdict || masterResult.risk_verdict,
        cultural_legal_notes: translated.cultural_legal_notes || masterResult.cultural_legal_notes,

        // Merge arrays keeping original_text
        red_flags: masterResult.red_flags.map((orig, i) => ({
          original_text: orig.original_text, // never translate
          title_cn: translated.red_flags?.[i]?.title_cn || orig.title_cn,
          translation_cn: translated.red_flags?.[i]?.translation_cn || orig.translation_cn,
          explanation_cn: translated.red_flags?.[i]?.explanation_cn || orig.explanation_cn,
          suggested_fix_cn: translated.red_flags?.[i]?.suggested_fix_cn || orig.suggested_fix_cn,
          law_reference: translated.red_flags?.[i]?.law_reference || orig.law_reference
        })),

        risky_clauses: masterResult.risky_clauses.map((orig, i) => ({
          original_text: orig.original_text, // never translate
          risk_level: orig.risk_level, 
          topic_cn: translated.risky_clauses?.[i]?.topic_cn || orig.topic_cn,
          translation_cn: translated.risky_clauses?.[i]?.translation_cn || orig.translation_cn,
          explanation_cn: translated.risky_clauses?.[i]?.explanation_cn || orig.explanation_cn
        })),

        missing_clauses: masterResult.missing_clauses.map((orig, i) => ({
          name_cn: translated.missing_clauses?.[i]?.name_cn || orig.name_cn,
          name_id: translated.missing_clauses?.[i]?.name_id || orig.name_id,
          importance_cn: translated.missing_clauses?.[i]?.importance_cn || orig.importance_cn
        }))
      };

      // Cache and display
      setTranslationCache(prev => ({ ...prev, [newLang]: finalResult }));
      setDisplayResult(finalResult);

    } catch (err) {
      console.error('Translation failed:', err);
      // Keep current language on error would mean doing nothing to outputLang
      // but we already updated it. To be safe, we could revert it, but typically 
      // we just show an error or silent failure.
    } finally {
      setTranslating(false);
    }
  };

  useEffect(() => {
    if (contractText.length > 50) {
      const text = contractText.slice(0, 5000);
      const chineseChars = (text.match(/[\u4E00-\u9FFF]/g) || []).length;
      const totalChars = text.replace(/\s/g, '').length;
      const chineseRatio = chineseChars / totalChars;

      // English legal keywords
      const englishLegalWords = [
        'agreement', 'contract', 'party', 'parties', 'whereas',
        'herein', 'clause', 'article', 'terms', 'conditions',
        'liability', 'termination', 'governing', 'arbitration',
        'distributor', 'supplier', 'payment', 'warranty'
      ];
      
      const lowerText = text.toLowerCase();
      const englishLegalCount = englishLegalWords.filter(
        word => lowerText.includes(word)
      ).length;

      if (chineseRatio > 0.3) {
        setContractLang('cn');
      } else if (chineseRatio < 0.05 && englishLegalCount >= 3) {
        setContractLang('en');
      } else if (chineseRatio < 0.1) {
        setContractLang('id');
      } else {
        setContractLang('mixed');
      }
    }
  }, [contractText]);


  const handleReset = () => {
    setMasterResult(null);
    setDisplayResult(null);
    setTranslationCache({ cn: null, id: null, en: null });
    setReportId(null);
    setContractText('');
    setOutputLang('cn'); // Default to cn as per project preference or stick to id if cn contract detected
    setMessages([]);
    setIsDemo(false);
    setContractLang('id');
    setPdfInfo(null);
    setError(null);
  };

  const analyzeContract = async (text: string, oLang: OutputLanguage) => {
    if (!text || text.length === 0) return;

    setAnalyzing(true);
    setIsDemo(false);
    setMasterResult(null);
    setDisplayResult(null);
    setTranslationCache({ cn: null, id: null, en: null });
    setError(null);
    setMessages([]);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          contractText: text, 
          outputLang: oLang, 
          userEmail,
          sessionToken: localStorage.getItem('yora_session_token')
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server error: ${response.status}`);
      }

      const parsed = await response.json();
      
      const genId = generateReportId();
      setMasterResult(parsed);
      setDisplayResult(parsed);
      setTranslationCache({ [oLang]: parsed });
      setReportId(genId);
      setError(null);
      setAnalyzing(false);
      
      setTimeout(() => {
        document.getElementById('analysis')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    } catch (err) {
      console.error(err);
      setAnalyzing(false);
      setError(err instanceof Error ? err.message : "Analysis failed");
    }
  };

  const handleTryDemo = (type?: string) => {
    const demoType = (type || 'id') as 'id' | 'cn' | 'en';
    
    // Determine contract text, target output language, and response template based on requested demo
    let textToSet = '';
    let targetLang: OutputLanguage = 'id';
    let selectedDemoResult: AnalysisResult;

    if (demoType === 'id') {
      textToSet = ID_DEMO_CONTRACT_TEXT;
      targetLang = 'cn';
      selectedDemoResult = DEMO_RESULTS.id;
    } else if (demoType === 'cn') {
      textToSet = CN_DEMO_CONTRACT_TEXT;
      targetLang = 'id';
      selectedDemoResult = DEMO_RESULTS.cn;
    } else {
      textToSet = ENG_DEMO_CONTRACT_TEXT;
      targetLang = 'id';
      selectedDemoResult = DEMO_RESULTS.en;
    }

    setContractText(textToSet);
    setError(null);
    setMasterResult(null);
    setDisplayResult(null);
    setTranslationCache({ cn: null, id: null, en: null });
    setOutputLang(targetLang);

    // Scroll to the features/scanner section immediately so they see the analysis starting
    setTimeout(() => {
      document.getElementById('scanner')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 50);

    // Turn on the loading states
    setAnalyzing(true);

    const initialCache: Record<string, AnalysisResult | null> = {
      cn: null,
      id: null,
      en: null
    };

    let resultToDisplay: AnalysisResult;

    if (demoType === 'id') {
      initialCache.cn = DEMO_RESULTS.id;
      initialCache.id = getOfflineDemoFallback('cn');
      initialCache.en = DEMO_RESULTS.en;
      resultToDisplay = DEMO_RESULTS.id;
    } else if (demoType === 'cn') {
      initialCache.cn = DEMO_RESULTS.cn;
      initialCache.id = getOfflineDemoFallback('cn');
      initialCache.en = DEMO_RESULTS.en;
      resultToDisplay = getOfflineDemoFallback('cn');
    } else {
      initialCache.cn = DEMO_RESULTS.cn;
      initialCache.id = getOfflineDemoFallback('en');
      initialCache.en = DEMO_RESULTS.en;
      resultToDisplay = getOfflineDemoFallback('en');
    }

    // Stay in loading state for 4 seconds to simulate premium AI multi-agent scanning
    setTimeout(() => {
      setAnalyzing(false);
      setIsDemo(true);
      const generatedDemoId = `QY-DEMO-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      setReportId(generatedDemoId);

      setMasterResult(selectedDemoResult);
      setDisplayResult(resultToDisplay);
      setTranslationCache(initialCache);
      setView('result');

      // Scroll to result view
      setTimeout(() => {
        document.getElementById('analysis')?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
    }, 4000);
  };

  return (
    <div className={`min-h-screen bg-surface ${isFading ? 'fading' : ''} lang-transition`}>
      <div 
        className="scroll-progress fixed top-0 left-0 h-[3px] bg-[#B91C1C] z-[9999] transition-all duration-100" 
        style={{ width: `${scrollProgress}%` }}
      />
      
      <Navbar lang={uiLang} setLang={changeLanguageWithFade} onDemoClick={() => handleTryDemo('cn')} hasResult={!!displayResult} />
      
      <main className="pt-16">
        <Hero 
          lang={lang} 
          onStartClick={() => document.getElementById('scanner')?.scrollIntoView({ behavior: 'smooth' })} 
          onDemoId={() => handleTryDemo('id')}
          onDemoCn={() => handleTryDemo('cn')}
          onDemoEn={() => handleTryDemo('en')}
        />

        {/* Stats bar can be added here if needed, but hero has icons */}
        
        <Introduction lang={lang} />
        
        <HowItWorks lang={lang} />
        
        <div id="features" className="scroll-mt-[70px]">
          <Scanner 
            lang={lang}
            onAnalyze={() => analyzeContract(contractText, outputLang)} 
            loading={analyzing}
            contractText={contractText}
            setContractText={setContractText}
            setPdfInfo={setPdfInfo}
            pdfInfo={pdfInfo}
            contractLang={contractLang}
            setContractLang={setContractLang}
            outputLang={outputLang}
            setOutputLang={handleOutputLangChange}
            userEmail={userEmail}
            setUserEmail={setUserEmail}
          />
        </div>

        <div id="analysis" ref={reportRef} className="scroll-mt-[70px]">
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-4xl mx-auto px-4 py-12"
              >
                <div className="bg-error-container/10 border border-error/20 p-12 text-center space-y-6 fade-in-up visible">
                  <div className="w-20 h-20 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-error uppercase tracking-tight">{lang === 'cn' ? '分析失败' : 'Analysis Failed'}</h3>
                    <p className="text-on-surface-variant max-w-md mx-auto">{lang === 'cn' ? '无法完成合同分析。请检查您的 API Key 或重试。' : 'We could not complete the contract analysis. Please check your API Key or try again.'}</p>
                    {error && <p className="text-xs font-mono text-error/60 mt-2 italic bg-surface p-2 border border-error/10">{error}</p>}
                  </div>
                  <button 
                    onClick={() => document.getElementById('scanner')?.scrollIntoView({ behavior: 'smooth' })}
                    className="bg-primary text-white px-8 py-3 font-bold uppercase tracking-widest text-sm sharp-edge hover:brightness-110 transition-all cursor-pointer"
                  >
                    {lang === 'cn' ? '返回重试' : 'Back to Scanner'}
                  </button>
                </div>
              </motion.div>
            )}

            {displayResult && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                key="analysis-report"
              >
                <AnalysisReport 
                  lang={lang}
                  data={displayResult} 
                  masterData={masterResult}
                  isDemo={isDemo}
                  contractText={contractText}
                  outputLang={outputLang}
                  translating={translating}
                  reportId={reportId || ''}
                  setOutputLang={handleOutputLangChange}
                  onReset={handleReset}
                  userEmail={userEmail}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div id="personas" className="scroll-mt-[70px]">
           <Personas lang={lang} />
        </div>
      </main>
      
      <Footer lang={lang} />

      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-20 right-6 md:right-10 w-12 h-12 bg-[#B91C1C] text-white rounded-full flex items-center justify-center shadow-xl z-[45] cursor-pointer hover:bg-[#A61A1A] transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
