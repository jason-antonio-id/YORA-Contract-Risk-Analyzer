import React, { useState } from 'react';
import { Mail, Globe, ClipboardList } from 'lucide-react';
import { Language } from '../types';
import Modal from './Modal';

interface FooterProps {
  lang: Language;
}

type ModalType = 'pricing' | 'api' | 'privacy' | 'terms' | 'disclaimer' | null;

export default function Footer({ lang }: FooterProps) {
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const translations = {
    cn: {
      description: 'YORA Contract Risk Analyzer 为印尼市场的跨国商业协议提供智能法律风险评估。',
      product: '产品',
      features: '产品功能',
      pricing: '定价方案',
      api: 'API 接入',
      legal: '合规',
      privacy: '隐私政策',
      terms: '服务条款',
      disclaimer: '法律免责',
      connect: '联系',
      feedbackForm: '在线反馈表单',
      rights: '© 2026 YORA CONTRACT RISK ANALYZER. 保留所有权利。',
      poweredBy: 'POWERED BY GOOGLE GEMINI AI',
      designedFor: '专为中印贸易打造'
    },
    en: {
      description: 'YORA Contract Risk Analyzer provides intelligent legal risk assessment for international commercial agreements in the Indonesian market.',
      product: 'Product',
      features: 'Features',
      pricing: 'Pricing',
      api: 'API Documentation',
      legal: 'Legal',
      privacy: 'Privacy',
      terms: 'Terms',
      disclaimer: 'Legal Disclaimer',
      connect: 'Connect',
      feedbackForm: 'Feedback Google Form',
      rights: '© 2026 YORA CONTRACT RISK ANALYZER. ALL RIGHTS RESERVED.',
      poweredBy: 'POWERED BY GOOGLE GEMINI AI',
      designedFor: 'DESIGNED FOR CHINA ↔ INDONESIA BUSINESSES'
    },
    id: {
      description: 'YORA Contract Risk Analyzer menyediakan penilaian risiko hukum cerdas untuk perjanjian komersial internasional di pasar Indonesia.',
      product: 'Produk',
      features: 'Fitur',
      pricing: 'Harga',
      api: 'Dokumentasi API',
      legal: 'Legal',
      privacy: 'Privasi',
      terms: 'Syarat & Ketentuan',
      disclaimer: 'Sanggahan Hukum',
      connect: 'Kontak',
      feedbackForm: 'Formulir Umpan Balik',
      rights: '© 2026 YORA CONTRACT RISK ANALYZER. SELURUH HAK CIPTA DILINDUNGI.',
      poweredBy: 'DIDUKUNG OLEH GOOGLE GEMINI AI',
      designedFor: 'DIRANCANG UNTUK BISNIS TIONGKOK ↔ INDONESIA'
    }
  };

  const t = translations[lang] || translations.en;

  const privacyData = {
    en: {
      lastUpdated: "Last updated: June 2026",
      intro: "YORA (\"we\", \"us\") is committed to protecting your privacy. This policy explains how we handle your data.",
      items: [
        { t: "1. Contract Data", c: "Contract text you upload or paste is sent directly to Google's Gemini API for analysis and returned to you in your browser. We do not store, log, or retain the content of your contract on our servers at any point." },
        { t: "2. Email & Verification", c: "To analyze a real contract, you verify your email via a one-time code (OTP). We store your email address and verification status to maintain your session and prevent abuse. Verified sessions remain active for 30 days via a secure session token, so you won't need to verify again during that period." },
        { t: "3. Analytics", c: "We log basic usage events (e.g. that an analysis occurred, the general contract type, and the resulting risk level) to understand how YORA is used and improve the product. This analytics data does not include your contract's text or AI-generated content." },
        { t: "4. Feedback", c: "If you submit feedback, we store your email, rating, and any comment you provide, to help us improve YORA." },
        { t: "5. Demo Mode", c: "The demo uses a sample contract and does not require email verification. No personal data is collected in demo mode." },
        { t: "6. Third-Party Services", c: "Contract analysis is powered by Google's Gemini API. Google's own privacy policy applies to data processed through their API: ai.google.dev/terms. Email and usage data is stored via Google Sheets under our account." },
        { t: "7. Data Retention", c: "Email and analytics records are retained to operate and improve the service. You may request deletion of your data at any time by contacting us." },
        { t: "8. Contact", c: "For privacy concerns: antoniojason212@gmail.com" }
      ],
      footerNote: "YORA Contract Risk Analyzer does not store your contract content. All analysis is directly processed via Google Gemini API, and the data does not pass through our servers."
    },
    cn: {
      lastUpdated: "最近更新：2026年6月",
      intro: "YORA（“我们”）致力于保护您的隐私。本政策说明我们如何处理您的数据。",
      items: [
        { t: "1. 合同数据", c: "您上传或粘贴的合同文本将直接发送至 Google 的 Gemini API 进行分析，并在您的浏览器中返回给您。我们不会在我们的服务器上存储、记录或保留您的合同内容。" },
        { t: "2. 邮箱与验证", c: "为了分析真实的合同，您需要通过一次性验证码（OTP）验证您的邮箱。我们存储您的邮箱地址和验证状态，以维护您的登录状态并防止滥用。已验证的会话将通过安全的会话令牌保持 30 天有效，在此期间您无需再次验证。" },
        { t: "3. 数据统计", c: "我们记录基本的分析使用事件（例如进行过分析、合同的常规类型以及产生的风险等级），以了解 YORA 的使用情况并改进产品。这些分析数据不包含您的合同文本或 AI 生成的内容。" },
        { t: "4. 用户反馈", c: "如果您提交反馈，我们将存储您的邮箱、评分以及您提供的任何评论，以帮助我们改进 YORA。" },
        { t: "5. 演示模式", c: "演示模式使用示例文档，无需邮箱验证。在演示模式下不会收集任何个人数据。" },
        { t: "6. 第三方服务", c: "合同分析由 Google Gemini API 提供支持。Google 自身的隐私政策适用于通过其 API 处理的数据：ai.google.dev/terms。电子邮箱和使用数据保存在我们账户下的 Google Sheets（谷歌表格）中。" },
        { t: "7. 数据保留", c: "保留邮箱和分析记录以运营和改进服务。您可以随时通过联系我们请求删除您的数据。" },
        { t: "8. 联系方式", c: "隐私相关问题请联系：antoniojason212@gmail.com" }
      ],
      footerNote: "YORA Contract Risk Analyzer 不存储您的合同内容。所有分析通过 Google Gemini API 直接处理，数据不经过我们的服务器。"
    },
    id: {
      lastUpdated: "Terakhir diperbarui: Juni 2026",
      intro: "YORA (\"kami\") berkomitmen untuk melindungi privasi Anda. Kebijakan ini menjelaskan bagaimana kami mengelola data Anda.",
      items: [
        { t: "1. Data Kontrak", c: "Teks kontrak yang Anda unggah atau tempel akan dikirimkan langsung ke Google Gemini API untuk dianalisis dan dikembalikan kepada Anda di peramban Anda. Kami tidak menyimpan, mencatat, atau menahan konten kontrak Anda di server kami pada titik mana pun." },
        { t: "2. Email & Verifikasi", c: "Untuk menganalisis kontrak asli, Anda perlu memverifikasi email Anda melalui kode sekali pakai (OTP). Kami menyimpan alamat email dan status verifikasi Anda untuk mempertahankan sesi Anda dan mencegah penyalahgunaan. Sesi yang telah terverifikasi akan tetap aktif selama 30 hari melalui token sesi yang aman, sehingga Anda tidak perlu melakukan verifikasi ulang selama periode tersebut." },
        { t: "3. Analisis Penggunaan", c: "Kami mencatat aktivitas penggunaan dasar (seperti analisis yang dilakukan, jenis umum kontrak, dan tingkat risiko yang dihasilkan) untuk memahami bagaimana YORA digunakan dan meningkatkan kualitas produk. Data analitik ini tidak menyertakan teks kontrak Anda atau konten yang dihasilkan oleh AI." },
        { t: "4. Umpan Balik", c: "Jika Anda mengirimkan umpan balik, kami akan menyimpan email, rating, dan komentar yang Anda berikan untuk membantu kami menyempurnakan YORA." },
        { t: "5. Mode Demo", c: "Demo menggunakan contoh kontrak dan tidak memerlukan verifikasi email. Tidak ada data pribadi yang dikumpulkan dalam mode demo." },
        { t: "6. Layanan Pihak Ketiga", c: "Analisis kontrak didukung oleh Google Gemini API. Kebijakan privasi Google sendiri berlaku untuk data yang diproses melalui API mereka: ai.google.dev/terms. Data email dan penggunaan disimpan melalui Google Sheets di bawah akun kami." },
        { t: "7. Retensi Data", c: "Catatan email dan analitik disimpan untuk mengoperasikan dan meningkatkan kualitas layanan. Anda dapat meminta penghapusan data Anda kapan saja dengan menghubungi kami." },
        { t: "8. Kontak", c: "Untuk pertanyaan seputar privasi: antoniojason212@gmail.com" }
      ],
      footerNote: "YORA Contract Risk Analyzer tidak menyimpan konten kontrak Anda. Semua analisis diproses langsung melalui Google Gemini API, dan data tidak melewati server kami."
    }
  };

  const p = privacyData[lang] || privacyData.en;

  const scrollToFeatures = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  const openModal = (type: ModalType) => (e: React.MouseEvent) => {
    e.preventDefault();
    setActiveModal(type);
  };

  const closeModal = () => setActiveModal(null);

  return (
    <footer className="w-full bg-[#FAFAFA] border-t border-[#E5E7EB]">
      <div className="max-w-[1200px] mx-auto px-4 md:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-10 justify-between items-start mb-12 gap-12">
          <div className="space-y-6 max-w-sm md:col-span-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 flex items-center justify-center shrink-0">
                <img src="https://i.ibb.co.com/GfDK38yS/Yora-logo.png" alt="Yora Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
              </div>
              <div className="flex flex-col">
                <span className="font-sans text-base md:text-lg font-black tracking-wide text-[#1A1A1A] leading-tight">YORA</span>
                <span className="font-sans text-[11px] font-semibold text-[#6B7280] leading-none">Contract Risk Analyzer</span>
              </div>
            </div>
            <p className="text-[#374151] text-sm leading-relaxed">
              {t.description}
            </p>
          </div>
          
          <div className="md:col-span-2 space-y-4">
            <p className="text-xs font-bold text-[#C0392B] uppercase tracking-widest">{t.product}</p>
            <ul className="space-y-2">
              <li><a className="text-sm text-[#374151] hover:text-[#C0392B] transition-colors" href="#features" onClick={scrollToFeatures}>{t.features}</a></li>
              <li><a className="text-sm text-[#374151] hover:text-[#C0392B] transition-colors" href="#" onClick={openModal('pricing')}>{t.pricing}</a></li>
              <li><a className="text-sm text-[#374151] hover:text-[#C0392B] transition-colors" href="#" onClick={openModal('api')}>{t.api}</a></li>
            </ul>
          </div>
          <div className="md:col-span-2 space-y-4">
            <p className="text-xs font-bold text-[#C0392B] uppercase tracking-widest">{t.legal}</p>
            <ul className="space-y-2">
              <li><a className="text-sm text-[#374151] hover:text-[#C0392B] transition-colors" href="#" onClick={openModal('privacy')}>{t.privacy}</a></li>
              <li><a className="text-sm text-[#374151] hover:text-[#C0392B] transition-colors" href="#" onClick={openModal('terms')}>{t.terms}</a></li>
              <li><a className="text-sm text-[#374151] hover:text-[#C0392B] transition-colors" href="#" onClick={openModal('disclaimer')}>{t.disclaimer}</a></li>
            </ul>
          </div>
          <div className="md:col-span-2 space-y-4 flex flex-col items-center">
            <p className="text-xs font-bold text-[#C0392B] uppercase tracking-widest text-center">{t.connect}</p>
            <div className="flex gap-4 justify-center">
              <button 
                className="text-[#6B7280] hover:text-[#B91C1C] cursor-pointer transition-colors duration-200"
                onClick={() => window.open('https://mail.google.com/mail/?view=cm&fs=1&to=antoniojason212@gmail.com', '_blank', 'noopener,noreferrer')}
                title="Contact Us"
              >
                <Mail size={20} />
              </button>
              <button 
                className="text-[#6B7280] hover:text-[#B91C1C] cursor-pointer transition-colors duration-200"
                onClick={() => window.open('https://www.instagram.com/yora.tech/', '_blank')}
                title="Instagram"
              >
                <Globe size={20} />
              </button>
              <button 
                className="text-[#6B7280] hover:text-[#B91C1C] cursor-pointer transition-colors duration-200"
                onClick={() => window.open('https://docs.google.com/forms/d/e/1FAIpQLSd_r7Gwfkvl30zQcNUsImbmuD-IXg2H46Dkrffhz1cVWW7wSg/viewform?usp=dialog', '_blank', 'noopener,noreferrer')}
                title={t.feedbackForm}
              >
                <ClipboardList size={20} />
              </button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-[#E5E7EB] pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 w-full">
            <p className="text-xs font-semibold text-[#6B7280] tracking-wider uppercase">
              {t.rights}
            </p>
            <span className="text-xs font-bold text-[#9CA3AF] tracking-widest uppercase">
              YORA 永睿 <span className="mx-1 font-normal text-[#D1D5DB]">|</span> <a href="https://www.instagram.com/yora.tech/" target="_blank" rel="noopener noreferrer" className="hover:text-[#C0392B] transition-colors normal-case">@yora.tech</a>
            </span>
            <span className="text-[10px] text-[#6B7280] tracking-widest uppercase font-bold">
              {t.designedFor}
            </span>
          </div>
        </div>
      </div>

      {/* Pricing Modal */}
      <Modal isOpen={activeModal === 'pricing'} onClose={closeModal} title="Pricing · 定价">
        <div className="space-y-6">
          <div>
            <p className="font-bold text-lg mb-1"> Currently Free During Beta</p>
            <p className="text-[#6B7280]">免费使用中 — 测试阶段完全免费</p>
          </div>
          <p>YORA Contract Risk Analyzer is currently free to use for all users during our public beta period.</p>
          
          <div className="space-y-2">
            <p className="font-bold">什么是免费的 / What's included for free:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Unlimited contract analysis · 无限合同分析</li>
              <li>Full Mandarin, Indonesian & English output · 完整三语输出</li>
              <li>Smart Q&A chat · 智能问答功能</li>
              <li>PDF upload & text paste · PDF上传与文字粘贴</li>
              <li>Downloadable reports · 分析报告下载</li>
            </ul>
          </div>

          <div className="space-y-2">
            <p className="font-bold">Future Plans · 未来计划:</p>
            <p>We plan to introduce a Pro tier for businesses needing bulk analysis, API access, and team collaboration features.</p>
          </div>

          <div className="pt-4 border-t border-[#E5E7EB]">
            <p className="font-bold mb-1">{lang === 'cn' ? '保持联系:' : 'To stay updated:'}</p>
            <a 
              href="https://mail.google.com/mail/?view=cm&fs=1&to=antoniojason212@gmail.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block hover:text-[#C0392B] transition-colors"
            >
              📧 antoniojason212@gmail.com
            </a>
            <p>📸 @yora.tech</p>
          </div>
        </div>
      </Modal>

      {/* API Modal */}
      <Modal isOpen={activeModal === 'api'} onClose={closeModal} title="API Setup · 接入指南">
        <div className="space-y-6">
          <p>YORA Contract Risk Analyzer is powered by Google Gemini AI. To run this app locally, you need a free Gemini API key.</p>
          
          <div className="space-y-2">
            <p className="font-bold">Step 1 — Get your free API key</p>
            <p>Go to: <a href="https://aistudio.google.com" target="_blank" rel="noopener noreferrer" className="text-[#C0392B] hover:underline">https://aistudio.google.com</a></p>
            <p>Click "Get API Key" → "Create API Key"</p>
            <p>Copy your key (starts with AIza...)</p>
          </div>

          <div className="space-y-2">
            <p className="font-bold">Step 2 — Set up your environment</p>
            <p>Create a file called <code className="bg-[#F5F5F5] px-1 rounded">.env</code> in the project root:</p>
            <pre className="bg-[#F5F5F5] p-3 rounded text-xs overflow-x-auto">VITE_GEMINI_API_KEY=AIza...your_key_here</pre>
          </div>

          <div className="space-y-2">
            <p className="font-bold">Step 3 — Start the app</p>
            <p className="bg-[#F5F5F5] p-3 rounded text-xs font-mono">npm install<br />npm run dev</p>
            <p>Open <code className="bg-[#F5F5F5] px-1 rounded">http://localhost:5173</code> in your browser.</p>
          </div>

          <div className="bg-[#FDF2F2] p-4 rounded-lg border-l-4 border-[#C0392B]">
            <p className="text-xs"><span className="font-bold">📌 Note:</span> Your API key is never stored or sent to any server other than Google's API directly.</p>
            <p className="text-xs mt-1">免费额度足够日常使用 — Free tier is sufficient for regular use.</p>
          </div>

          <p className="text-sm">Need help? Contact: @yora.tech</p>
        </div>
      </Modal>

      {/* Privacy Modal */}
      <Modal isOpen={activeModal === 'privacy'} onClose={closeModal} title={lang === 'cn' ? "Privacy Policy · 隐私政策" : lang === 'id' ? "Kebijakan Privasi · Privacy Policy" : "Privacy Policy"}>
        <div className="space-y-4">
          <p className="text-xs text-[#6B7280]">{p.lastUpdated}</p>
          <p>{p.intro}</p>
          
          {p.items.map((item, i) => (
            <div key={i}>
              <p className="font-bold mb-1">{item.t}</p>
              <p>{item.c}</p>
            </div>
          ))}

          <div className="pt-6 border-t border-[#E5E7EB]">
            <p className="text-[#6B7280] italic">
              {p.footerNote}
            </p>
          </div>
        </div>
      </Modal>

      {/* Terms Modal */}
      <Modal isOpen={activeModal === 'terms'} onClose={closeModal} title="Terms of Use · 使用条款">
        <div className="space-y-4">
          <p className="text-xs text-[#6B7280]">Last updated: May 2025</p>
          <p>By using YORA Contract Risk Analyzer you agree to these terms.</p>
          
          {[
            { t: "1. Acceptance", c: "Using this application means you accept these Terms of Use in full." },
            { t: "2. Permitted Use", c: "YORA Contract Risk Analyzer is provided for informational and educational purposes only. You may use this tool to assist in understanding contract language and identifying potential risks." },
            { t: "3. Prohibited Use", c: "You may not use YORA Contract Risk Analyzer to: \n- Provide legal advice to third parties for payment\n- Process contracts containing classified or government-restricted information\n- Attempt to reverse-engineer or scrape the application" },
            { t: "4. Your Content", c: "Contract text you submit is processed by Google Gemini AI. You retain full ownership of your contract content. We claim no rights over content you submit." },
            { t: "5. Service Availability", c: "YORA Contract Risk Analyzer is provided \"as is\" without warranties. We reserve the right to modify or discontinue the service at any time." },
            { t: "6. Governing Law", c: "These terms are governed by the laws of Indonesia." }
          ].map((item, i) => (
            <div key={i}>
              <p className="font-bold mb-1">{item.t}</p>
              <p className="whitespace-pre-line">{item.c}</p>
            </div>
          ))}

          <div className="pt-6 border-t border-[#E5E7EB]">
            <p className="text-[#6B7280] italic">使用本工具即表示您同意以上条款。</p>
          </div>
        </div>
      </Modal>

      {/* Disclaimer Modal */}
      <Modal isOpen={activeModal === 'disclaimer'} onClose={closeModal} title="Legal Disclaimer · 法律免责声明">
        <div className="space-y-6">
          <div className="bg-[#FFF9F9] p-4 rounded-lg border border-[#B91C1C]/10 flex gap-4 items-start">
            <span className="text-xl">⚠️</span>
            <div>
              <p className="font-bold text-[#B91C1C]">Important Notice · 重要声明</p>
              <p className="text-xs text-[#B91C1C]/70 mt-1 uppercase tracking-wider font-bold">NOT LEGAL ADVICE</p>
            </div>
          </div>

          <p>YORA Contract Risk Analyzer is an AI-powered tool designed to help users understand and identify potential risks in contracts. The analysis provided is for informational purposes only.</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="space-y-2">
              <p className="font-bold text-[#B91C1C] uppercase text-[11px] tracking-widest mb-3">YORA DOES NOT:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Provide legally binding legal advice</li>
                <li>Replace consultation with a qualified lawyer</li>
                <li>Guarantee the accuracy of contract analysis</li>
                <li>Cover all possible legal risks in a contract</li>
              </ul>
            </div>
            <div className="space-y-2">
              <p className="font-bold text-[#10B981] uppercase text-[11px] tracking-widest mb-3">YORA DOES:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Help you understand contract language</li>
                <li>Flag potentially risky clauses for review</li>
                <li>Translate contracts between languages</li>
                <li>Suggest areas to discuss with your lawyer</li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-[#E5E7EB] space-y-4">
            <p className="font-bold uppercase text-[11px] tracking-widest">RECOMMENDATION</p>
            <p>Always consult a qualified Indonesian lawyer (Advokat) before signing any important contract. For contracts involving significant sums or business risk, professional legal review is strongly recommended.</p>
          </div>

          <div className="p-4 bg-[#F8F9FA] rounded space-y-1">
            <p className="text-[#6B7280] font-medium">本工具仅供参考，不构成法律建议。</p>
            <p className="text-[#6B7280] font-medium">签署重要合同前，请务必咨询持牌律师。</p>
          </div>

          <p className="text-xs text-[#9CA3AF] italic">
            AI analysis may contain errors or omissions. YORA Contract Risk Analyzer and its creators accept no liability for decisions made based on this tool's output.
          </p>
        </div>
      </Modal>
    </footer>
  );
}

