import React, { useState, useCallback } from 'react';
import { FileText, CloudUpload, Search, Loader2, ShieldCheck, CheckCircle2, Lock, Languages, Check } from 'lucide-react';
import { Language, ContractLanguage, OutputLanguage } from '../types';
import { T } from '../lib/translations';

interface ScannerProps {
  lang: Language;
  onAnalyze: () => void;
  loading: boolean;
  contractText: string;
  setContractText: (val: string) => void;
  setPdfInfo: (info: { name: string; pages: number } | null) => void;
  pdfInfo: { name: string; pages: number } | null;
  contractLang: ContractLanguage;
  setContractLang: (val: ContractLanguage) => void;
  outputLang: OutputLanguage;
  setOutputLang: (val: OutputLanguage) => void;
  userEmail: string;
  setUserEmail: (val: string) => void;
}

function validateContractText(text: string): { ok: boolean; errorKey: 'too_short' | 'no_keywords' | 'gibberish' | null } {
  const clean = text.replace(/\s+/g, ' ').trim();

  if (clean.length < 200) return { ok: false, errorKey: 'too_short' };

  const contractKeywords = [
    'pasal', 'perjanjian', 'kontrak', 'pihak pertama', 'pihak kedua',
    'menyetujui', 'menyatakan sepakat',
    '合同', '协议', '甲方', '乙方', '条款', '违约', '第', '条', '签署',
    'agreement', 'contract', 'party of the first part', 'party of the second part',
    'whereas', 'hereby agree', 'terms and conditions', 'governing law',
    'jurisdiction', 'termination clause', 'force majeure'
  ];
  const invoiceOnlyKeywords = [
    'invoice number', 'invoice no', 'faktur nomor', 'no. faktur', 'bill to',
    'ship to', 'packing list', 'purchase order no', 'po number',
    '发票号', '装箱单', '采购订单号', 'quantity', 'unit price', 'subtotal',
    'tax invoice', 'commercial invoice'
  ];
  const lower = clean.toLowerCase();
  const contractHits = contractKeywords.filter(kw => lower.includes(kw)).length;
  const invoiceHits = invoiceOnlyKeywords.filter(kw => lower.includes(kw)).length;
  if (invoiceHits >= 2 && contractHits < 2) return { ok: false, errorKey: 'no_keywords' };
  if (contractHits < 2) return { ok: false, errorKey: 'no_keywords' };

  const alphanumCount = (clean.match(/[a-zA-Z0-9\u4E00-\u9FFF]/g) || []).length;
  if (alphanumCount / clean.length < 0.35) return { ok: false, errorKey: 'gibberish' };

  return { ok: true, errorKey: null };
}

export default function Scanner({ 

  lang, 
  onAnalyze, 
  loading, 
  contractText, 
  setContractText,
  setPdfInfo,
  pdfInfo,
  contractLang,
  setContractLang,
  outputLang,
  setOutputLang,
  userEmail,
  setUserEmail
}: ScannerProps) {
  const [tab, setTab] = useState<'upload' | 'text'>('upload');
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
  const [contentWarning, setContentWarning] = useState<string | null>(null);
  const [emailInput, setEmailInput] = useState('');
  const [emailError, setEmailError] = useState('');
  const [step, setStep] = useState<1 | 2>(1);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [otpError, setOtpError] = useState('');
  const [countdown, setCountdown] = useState(0);

  React.useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Persistent session check on mount
  React.useEffect(() => {
    const token = localStorage.getItem('yora_session_token');
    if (token) {
      fetch('/api/check-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionToken: token })
      })
      .then(res => res.json())
      .then(data => {
        if (data.valid && data.email) {
          setUserEmail(data.email);
        } else {
          localStorage.removeItem('yora_session_token');
        }
      })
      .catch(err => {
        console.error("Error checking session", err);
        localStorage.removeItem('yora_session_token');
      });
    }
  }, [setUserEmail]);

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanEmail = emailInput.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setEmailError(lang === 'cn' ? '请输入有效的电子邮件地址' : 'Masukkan alamat email yang valid.');
      return;
    }
    
    setEmailError('');
    setSendingOtp(true);

    try {
      const response = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Gagal mengirim kode OTP.');
      }

      setStep(2);
      setCountdown(60);
      setOtpError('');
    } catch (err: any) {
      setEmailError(err.message || 'Terjadi kesalahan saat mengirim kode.');
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyOtp = async (codeToVerify?: string) => {
    const code = codeToVerify || otpInput;
    if (code.length !== 6) {
      setOtpError(lang === 'cn' ? '请输入6位数的验证码' : 'Masukkan 6 digit kode verifikasi.');
      return;
    }

    setOtpError('');
    setVerifyingOtp(true);

    try {
      const response = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput.trim(), code })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Kode verifikasi salah.');
      }

      if (data.sessionToken) {
        localStorage.setItem('yora_session_token', data.sessionToken);
      }

      // Success! Set the verified userEmail globally
      setUserEmail(emailInput.trim());
    } catch (err: any) {
      setOtpError(err.message || 'Verifikasi gagal.');
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setOtpInput(val);
    if (otpError) setOtpError('');
    if (val.length === 6) {
      handleVerifyOtp(val);
    }
  };

  React.useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setLoadingMsgIdx(prev => (prev + 1) % T[lang].loadingMsgs.length);
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [loading, lang]);

  const extractTextFromPdf = async (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      alert(T[lang].errorSub + " (File > 10MB)");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const typedarray = new Uint8Array(e.target?.result as ArrayBuffer);
      try {
        // @ts-ignore
        const pdf = await window.pdfjsLib.getDocument(typedarray).promise;
        let fullText = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map((item: any) => item.str).join(" ");
          fullText += pageText + "\n";
        }
        
        if (fullText.trim().length < 50) {
           alert(lang === 'cn' ? "无法读取文本 — 此PDF可能是扫描件，请粘贴文本" : "This PDF may be scanned. Please paste the text instead.");
           return;
        }

        const validation = validateContractText(fullText);
        if (!validation.ok) {
          if (validation.errorKey === 'no_keywords') {
            alert(lang === 'cn'
              ? "此文件不像正式合同。YORA目前仅分析合同（不支持发票、采购订单或装箱单）。"
              : "This document doesn't appear to be a formal contract. YORA currently analyzes contracts only (not invoices, POs, or packing lists).");
          } else if (validation.errorKey === 'gibberish') {
            alert(lang === 'cn'
              ? "无法读取此PDF的文本内容。它可能是扫描件或图片PDF，请粘贴文本代替。"
              : "Could not read meaningful text from this PDF. It may be a scanned image — please paste the text instead.");
          }
          return;
        }

        if (fullText.length > 1000000) {
          fullText = fullText.substring(0, 1000000);
          alert(lang === 'cn' 
            ? "合同超过 1,000,000 字符，已截断进行分析。" 
            : "Contract exceeds 1,000,000 characters. Analysis will be performed on the first 1,000,000 characters.");
        }

        setContractText(fullText);
        setPdfInfo({ name: file.name, pages: pdf.numPages });
      } catch (err) {
        console.error(err);
        alert("Error reading PDF");
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) extractTextFromPdf(file);
  };

  const charCount = contractText.length;
  const wordCount = contractText.trim() === '' ? 0 : contractText.trim().split(/\s+/).length;
  const estTime = charCount < 1000 ? "10-15s" : charCount < 3000 ? "20-25s" : charCount < 7000 ? "30-40s" : "45-60s";

  const getConfidence = () => {
    if (charCount < 50) return 0;
    const chineseChars = (contractText.match(/[\u4E00-\u9FFF]/g) || []).length;
    const totalChars = contractText.replace(/\s/g, '').length;
    const chineseRatio = chineseChars / totalChars;

    if (contractLang === 'cn') return Math.min(99, Math.round(chineseRatio * 150 + 40));
    if (contractLang as any === 'en') return 94; 
    if (contractLang === 'id') return Math.min(99, Math.round((1 - chineseRatio) * 85 + 50));
    return 0;
  };

  const getPlaceholder = () => {
    if (contractLang === 'cn') return "请将中文合同文本粘贴到此处...\n\n例：甲方：深圳海川贸易有限公司\n乙方：PT Global Digital Indonesia\n\n第一条：甲方授予乙方在印度尼西亚区域的独家分销权...";
    if (contractLang === 'id') return "Tempel teks kontrak Bahasa Indonesia Anda di sini...\n\nContoh: Pihak Pertama: PT Maju Bersama Indonesia\nPihak Kedua: Budi Santoso\n\nPasal 1: Perusahaan dapat memutuskan hubungan kerja kapan saja...";
    if (contractLang as any === 'en') return "Paste your English contract text here...\n\nExample: This Distribution Agreement is entered into between:\nSupplier: Hong Kong Global Ltd.\nDistributor: PT Indo Commerce\n\nArticle 1: Supplier reserves the right to terminate...";
    return "Paste your contract text here...\n例：甲方有权随时变更项目需求...\nContoh: Pihak A berhak mengubah persyaratan...";
  };

  const getDetectionLabel = () => {
    if (contractLang === 'id') return "🇮🇩 Indonesian contract detected";
    if (contractLang === 'cn') return "🇨🇳 Chinese contract detected";
    if (contractLang as any === 'en') return "🇬🇧 English contract detected";
    return T[lang].detectMixed;
  };

  const [isDragOver, setIsDragOver] = useState(false);
  const [justDropped, setJustDropped] = useState(false);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type === "application/pdf") {
      extractTextFromPdf(file);
      setJustDropped(true);
      setTimeout(() => setJustDropped(false), 600);
    }
  }, []);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    let val = e.target.value;
    if (val.length > 1000000) {
      val = val.substring(0, 1000000);
      alert(lang === 'cn' 
        ? "合同超过 1,000,000 字符，已截断进行分析。" 
        : "Contract exceeds 1,000,000 characters. Analysis will be performed on the first 1,000,000 characters.");
    }
    setContractText(val);

    if (val.trim().length > 0) {
      const validation = validateContractText(val);
      if (!validation.ok) {
        if (validation.errorKey === 'too_short') {
          setContentWarning(lang === 'cn'
            ? "⚠️ 合同文本过短。建议上传至少200个字符的有效文件。"
            : "⚠️ Contract text is too short. Recommend pasting at least 200 characters.");
        } else if (validation.errorKey === 'no_keywords') {
          setContentWarning(lang === 'cn'
            ? "⚠️ 此文本不像合同或商业文件（缺乏关键条款词汇）。"
            : "⚠️ This text doesn't appear to be a contract or business document (missing key clauses keywords).");
        } else if (validation.errorKey === 'gibberish') {
          setContentWarning(lang === 'cn'
            ? "⚠️ 文本内含过多非字母数字字符，可能是乱码。"
            : "⚠️ Text contains too many non-alphanumeric characters. It might be gibberish.");
        }
      } else {
        setContentWarning(null);
      }
    } else {
      setContentWarning(null);
    }
  };

  return (
    <section className="py-12 md:py-24 bg-surface-container-low scroll-mt-[70px]" id="scanner">
      <div className="max-w-4xl mx-auto px-4 md:px-12 reveal-on-scroll">
        
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-on-surface mb-2">{T[lang].scannerTitle}</h2>
          <p className="text-sm md:text-base text-on-surface-variant font-medium">{T[lang].scannerSub}</p>
        </div>

        <div className="bg-white border border-outline-variant rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] overflow-hidden">
          {!userEmail ? (
            <div className="p-4 sm:p-6 md:p-12 flex flex-col items-center text-center max-w-lg mx-auto space-y-6">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-white border border-outline-variant p-1 shadow-md flex items-center justify-center">
                <img 
                  src="https://i.ibb.co.com/zhN8sKp4/RUI-PRESENTING-TABLET-BASICS.png" 
                  alt="Rui Mascot" 
                  className="w-full h-full object-cover rounded-full" 
                  referrerPolicy="no-referrer"
                />
              </div>

              {step === 1 ? (
                <>
                  <div className="space-y-2">
                    <h3 className="text-xl md:text-2xl font-bold text-on-surface leading-tight">
                      Masukkan email kamu untuk mulai analisis kontrak
                    </h3>
                    <p className="text-on-surface-variant text-sm font-medium leading-relaxed">
                      Kami akan kirim kode verifikasi ke email kamu.
                    </p>
                  </div>
                  <form onSubmit={handleSendOtp} className="w-full space-y-4">
                    <div className="relative">
                      <input 
                        type="email"
                        value={emailInput}
                        onChange={(e) => {
                          setEmailInput(e.target.value);
                          if (emailError) setEmailError('');
                        }}
                        placeholder="email@bisnis.com"
                        className={`w-full px-5 py-4 border rounded-lg bg-[#FAFAFA] outline-none text-base md:text-[15px] font-medium transition-all ${
                          emailError ? 'border-[#E30613] focus:ring-[#E30613]/20' : 'border-outline-variant focus:border-[#E30613] focus:ring-[#E30613]/20'
                        }`}
                      />
                      {emailError && (
                        <p className="text-left text-xs font-semibold text-[#E30613] mt-1.5 px-1">
                          {emailError}
                        </p>
                      )}
                    </div>
                    <button 
                      type="submit"
                      disabled={sendingOtp}
                      className="w-full bg-[#E30613] text-white py-4 px-6 rounded-lg font-bold text-base hover:brightness-110 shadow-[0_4px_14px_rgba(227,6,19,0.3)] hover:shadow-[0_6px_20px_rgba(227,6,19,0.45)] disabled:opacity-50 transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      {sendingOtp ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          Mengirim Kode...
                        </>
                      ) : (
                        "Kirim Kode →"
                      )}
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <h3 className="text-xl md:text-2xl font-bold text-on-surface leading-tight">
                      Cek email kamu
                    </h3>
                    <p className="text-on-surface-variant text-sm font-medium leading-relaxed">
                      Kami kirim kode 6 digit ke <span className="font-semibold text-on-surface">{emailInput}</span>. Masukkan di bawah.
                    </p>
                  </div>
                  <form onSubmit={(e) => { e.preventDefault(); handleVerifyOtp(); }} className="w-full space-y-4">
                    <div className="relative">
                      <input 
                        type="text"
                        maxLength={6}
                        pattern="[0-9]*"
                        inputMode="numeric"
                        value={otpInput}
                        onChange={handleOtpChange}
                        placeholder="000000"
                        className={`w-full text-center font-mono text-3xl tracking-[0.4em] pl-[0.4em] py-4 border rounded-lg bg-[#FAFAFA] outline-none font-extrabold transition-all ${
                          otpError ? 'border-[#E30613] focus:ring-[#E30613]/20' : 'border-outline-variant focus:border-[#E30613] focus:ring-[#E30613]/20'
                        }`}
                      />
                      {otpError && (
                        <p className="text-xs font-semibold text-[#E30613] mt-1.5 px-1 text-center">
                          {otpError}
                        </p>
                      )}
                    </div>
                    
                    <button 
                      type="submit"
                      disabled={verifyingOtp || otpInput.length < 6}
                      className="w-full bg-[#E30613] text-white py-4 px-6 rounded-lg font-bold text-base hover:brightness-110 shadow-[0_4px_14px_rgba(227,6,19,0.3)] hover:shadow-[0_6px_20px_rgba(227,6,19,0.45)] disabled:opacity-50 transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      {verifyingOtp ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          Memverifikasi...
                        </>
                      ) : (
                        "Verifikasi →"
                      )}
                    </button>

                    <div className="flex flex-col items-center space-y-2 pt-2 text-sm font-medium">
                      <button
                        type="button"
                        disabled={countdown > 0 || sendingOtp}
                        onClick={() => handleSendOtp()}
                        className="text-[#E30613] hover:underline disabled:text-on-surface-variant/40 disabled:no-underline cursor-pointer transition-colors"
                      >
                        {countdown > 0 ? `Kirim ulang kode (${countdown}s)` : "Kirim ulang kode"}
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => {
                          setStep(1);
                          setOtpInput('');
                          setOtpError('');
                        }}
                        className="text-on-surface-variant hover:text-on-surface hover:underline cursor-pointer transition-colors"
                      >
                        ← Ganti email
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          ) : (
            <>
              <div className="flex flex-wrap justify-between items-center border-b border-outline-variant px-4">
                <div className="flex">
                  <button 
                    onClick={() => setTab('upload')}
                    className={`px-6 py-4 font-bold flex items-center gap-2 transition-all cursor-pointer ${tab === 'upload' ? 'bg-white border-b-2 border-primary text-primary' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
                  >
                    <FileText size={20} />
                    {T[lang].uploadPdf}
                  </button>
                  <button 
                    onClick={() => setTab('text')}
                    className={`px-6 py-4 font-bold flex items-center gap-2 transition-all cursor-pointer ${tab === 'text' ? 'bg-white border-b-2 border-primary text-primary' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
                  >
                    <FileText size={20} className="rotate-90" />
                    {T[lang].pasteText}
                  </button>
                </div>
                
                <div className="py-2 px-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-on-surface-variant justify-end">
                  <span className="font-bold opacity-90 max-w-[140px] sm:max-w-none truncate inline-block align-middle">{userEmail}</span>
                  <span className="opacity-40 hidden sm:inline">|</span>
                  <button
                    onClick={() => {
                      localStorage.removeItem('yora_session_token');
                      setUserEmail('');
                      setStep(1);
                      setOtpInput('');
                    }}
                    className="text-[#E30613] hover:underline font-bold transition-all cursor-pointer shrink-0"
                  >
                    {lang === 'cn' ? '退出 / 更换邮箱' : lang === 'id' ? 'Bukan kamu? Ganti email' : 'Not you? Change email'}
                  </button>
                </div>
              </div>

              <div className="p-3 sm:p-6 md:p-12">
                {tab === 'upload' ? (
                  <div 
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onDrop={onDrop}
                    className={`flex flex-col items-center justify-center min-h-[200px] border-2 border-dashed p-4 sm:p-6 md:p-10 relative group transition-all duration-200 rounded-xl
                      ${isDragOver ? 'border-[#B91C1C] bg-[#FFF1F2] scale-[1.01]' : justDropped ? 'border-[#10B981] bg-[#ECFDF5]' : 'border-[#E5E7EB] bg-[#FAFAFA] hover:border-[#B91C1C] hover:bg-[#FDF2F2]'}`}
                  >
                    <input 
                        type="file" 
                        accept=".pdf" 
                        onChange={handleFileChange}
                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    />
                    <div className="max-w-xs mx-auto space-y-4 text-center">
                      <CloudUpload 
                        size={60} 
                        className={`mx-auto transition-colors ${!pdfInfo && !isDragOver ? 'upload-icon' : ''} ${isDragOver ? 'text-[#B91C1C]' : 'text-outline-variant group-hover:text-primary'}`} 
                      />
                      <p className={`text-lg font-bold transition-colors ${isDragOver ? 'text-[#B91C1C]' : 'text-on-surface'}`}>
                        {isDragOver ? "Drop to analyze · 释放以分析" : T[lang].dragDrop}
                      </p>
                      <p className="text-on-surface-variant text-sm font-medium">{T[lang].pdfSupport}</p>
                      <button className="bg-[#B91C1C] text-white px-6 py-2 rounded-lg font-bold hover:brightness-110 shadow-[0_4px_14px_rgba(185,28,28,0.3)] hover:shadow-[0_6px_20px_rgba(185,28,28,0.45)] transition-all cursor-pointer">
                        {T[lang].browseFiles}
                      </button>
                    </div>
                    
                    {pdfInfo && (
                        <div className="mt-6 pt-6 border-t border-outline-variant/20 flex flex-col items-center animate-bounce-short">
                            <div className="flex items-center gap-2 text-green-600 font-bold text-sm">
                                <Check size={16} strokeWidth={3} />
                                {pdfInfo.name}
                            </div>
                            <p className="text-xs text-on-surface-variant mt-1 font-medium">{pdfInfo.pages} {T[lang].pages}</p>
                        </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative group">
                      <textarea 
                        value={contractText}
                        onChange={handleTextareaChange}
                        className="w-full h-56 border border-outline-variant rounded-lg p-4 md:p-6 focus:ring-2 focus:ring-primary/20 focus:border-primary bg-[#FAFAFA] outline-none text-base md:text-[15px] font-medium leading-relaxed transition-all placeholder:text-[#9CA3AF]"
                        placeholder={getPlaceholder()}
                      ></textarea>
                      <div className="absolute top-4 right-4 bg-white/80 backdrop-blur px-2 py-1 rounded border border-[#E5E0D8] text-[9px] text-[#6B7280] font-bold tracking-tight opacity-0 group-hover:opacity-100 transition-opacity">
                        {lang === 'cn' ? '按下 / 键聚焦' : 'Press / to focus'}
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.2em] px-1">
                        <div className="flex gap-4">
                          <span className={`flex items-center gap-1.5 ${charCount >= 40000 ? 'text-[#B91C1C] animate-pulse font-extrabold' : ''}`}>
                            <FileText size={12} className="opacity-50" /> 
                            {charCount.toLocaleString()} / 50,000 Characters
                            {charCount >= 40000 && (lang === 'cn' ? '（接近上限）' : ' (Approaching Limit)')}
                          </span>
                          <span className="flex items-center gap-1.5"><Search size={12} className="opacity-50" /> {wordCount.toLocaleString()} Words</span>
                        </div>
                        <div className={`flex items-center gap-1.5 ${charCount > 0 ? 'text-[#B91C1C]' : ''}`}>
                          <Loader2 size={12} className={loading ? 'animate-spin' : ''} />
                          Est. {estTime} analysis
                        </div>
                    </div>
                    {contentWarning && (
                      <div className="text-xs text-[#B91C1C] font-semibold mt-3 px-1 animate-pulse">
                        {contentWarning}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Detection & Output Selection */}
              {contractText.length >= 50 && (
                <div className="px-6 md:px-12 pb-8 space-y-6 fade-in-up visible">
                  {/* Detection Badge */}
                  <div className="flex flex-col items-center">
                    <div className={`flex items-center gap-3 px-5 py-2.5 rounded-full font-bold text-[13px] tracking-tight border shadow-sm ${
                      contractLang === 'id' ? 'bg-[#FDF2F2] text-[#C0392B] border-[#FEE2E2]' : 
                      contractLang === 'cn' ? 'bg-[#F0F7FF] text-[#0066CC] border-[#E0EFFF]' : 
                      'bg-[#F2F2F2] text-[#333] border-[#E5E7EB]'
                    }`}>
                      <Languages size={15} />
                      <span>
                        {contractLang === 'id' && `🇮🇩 ${T[lang].detectIndonesian}`}
                        {contractLang === 'cn' && `🇨🇳 ${T[lang].detectChinese}`}
                        {contractLang as any === 'en' && `🇬🇧 English contract detected`}
                        {contractLang === 'mixed' && T[lang].detectMixed}
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-20"></span>
                      <span className="opacity-80 font-medium">{getConfidence()}% confidence</span>
                    </div>
                    
                    {contractLang === 'mixed' && (
                      <div className="flex gap-2 mt-3">
                        <button 
                          onClick={() => setContractLang('id')}
                          className="px-4 py-1.5 text-[10px] font-bold sharp-edge border border-outline-variant text-on-surface-variant hover:bg-surface-container-high transition-all cursor-pointer"
                        >
                          {T[lang].indonesian.split(' / ')[0]}
                        </button>
                        <button 
                          onClick={() => setContractLang('cn')}
                          className="px-4 py-1.5 text-[10px] font-bold sharp-edge border border-outline-variant text-on-surface-variant hover:bg-surface-container-high transition-all cursor-pointer"
                        >
                          {T[lang].chinese.split(' / ')[0]}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Output Selector */}
                  <div className="flex flex-col items-center space-y-3">
                    <div className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
                      <ShieldCheck size={14} className="text-secondary" />
                      {T[lang].outputLangLabel}
                    </div>
                    <div className="flex flex-wrap justify-center gap-2">
                      <button 
                        onClick={() => setOutputLang('cn')}
                        className={`flex items-center gap-2 px-6 py-2.5 font-bold text-sm transition-all border cursor-pointer ${outputLang === 'cn' ? 'bg-primary text-white border-primary shadow-md' : 'bg-white text-on-surface-variant border-outline-variant hover:bg-surface-container-high'}`}
                      >
                        {outputLang === 'cn' && <Check size={14} />}
                        {T[lang].mandarin}
                      </button>
                      <button 
                        onClick={() => setOutputLang('id')}
                        className={`flex items-center gap-2 px-6 py-2.5 font-bold text-sm transition-all border cursor-pointer ${outputLang === 'id' ? 'bg-primary text-white border-primary shadow-md' : 'bg-white text-on-surface-variant border-outline-variant hover:bg-surface-container-high'}`}
                      >
                        {outputLang === 'id' && <Check size={14} />}
                        {T[lang].indonesianOutput}
                      </button>
                      <button 
                        onClick={() => setOutputLang('en')}
                        className={`flex items-center gap-2 px-6 py-2.5 font-bold text-sm transition-all border cursor-pointer ${outputLang === 'en' ? 'bg-primary text-white border-primary shadow-md' : 'bg-white text-on-surface-variant border-outline-variant hover:bg-surface-container-high'}`}
                      >
                        {outputLang === 'en' && <Check size={14} />}
                        {T[lang].english}
                      </button>
                    </div>
                    
                    {/* Selected analysis helper text */}
                    <div className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider animate-pulse pt-1">
                      {lang === 'cn' ? '分析结果将以以下语言呈现：' : lang === 'id' ? 'Hasil analisis akan disajikan dalam: ' : 'Analysis will be delivered in: '}
                      <span className="text-primary ml-1">
                        {outputLang === 'cn' ? (lang === 'cn' ? '简体中文' : 'Simplified Mandarin') : 
                         outputLang === 'id' ? (lang === 'cn' ? '印度尼西亚语' : 'Bahasa Indonesia') : 
                         (lang === 'cn' ? '英语' : 'English')}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="px-8 pb-8 md:block">
                <button 
                  disabled={loading || contractText.length === 0}
                  onClick={onAnalyze}
                  className={`analyze-btn w-full py-4 font-bold text-2xl rounded-lg flex items-center justify-center gap-3 transition-all cursor-pointer shadow-[0_4px_14px_rgba(185,28,28,0.3)] hover:shadow-[0_6px_20px_rgba(185,28,28,0.45)] disabled:bg-[#E5E7EB] disabled:text-[#9CA3AF] disabled:shadow-none
                    ${loading ? 'bg-[#B91C1C] scale-[0.97]' : 'bg-primary text-white hover:bg-primary-variant'}`}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <span>Analyzing</span>
                      <div className="flex gap-1.5 ml-1">
                        <span className="w-2 h-2 bg-white rounded-full" style={{ animation: 'dotPulse 1s infinite' }}></span>
                        <span className="w-2 h-2 bg-white rounded-full" style={{ animation: 'dotPulse 1s infinite 0.16s' }}></span>
                        <span className="w-2 h-2 bg-white rounded-full" style={{ animation: 'dotPulse 1s infinite 0.32s' }}></span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Search />
                      {T[lang].analyzeBtn}
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>



        {loading && (
          <div className="flex flex-col items-center justify-center mt-12 space-y-6">
            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            <p className="font-bold text-primary animate-pulse text-lg tracking-wide uppercase">
                {T[lang].loadingMsgs[loadingMsgIdx]}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}