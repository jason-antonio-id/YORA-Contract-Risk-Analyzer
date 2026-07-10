import React, { useEffect, useRef } from 'react';
import { ShieldCheck, Upload } from 'lucide-react';
import { motion } from 'motion/react';
import { Language } from '../types';
import { T } from '../lib/translations';

interface HeroProps {
  lang: Language;
  onStartClick: () => void;
  onDemoId: () => void;
  onDemoCn: () => void;
  onDemoEn: () => void;
}

export default function Hero({ lang, onStartClick, onDemoId, onDemoCn, onDemoEn }: HeroProps) {
  const statsRef = useRef<HTMLDivElement>(null);
  const langCountRef = useRef<HTMLSpanElement>(null);
  const timeCountRef = useRef<HTMLSpanElement>(null);
  const catCountRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const animateCounter = (element: HTMLSpanElement, target: number, duration: number, suffix: string = '') => {
      let start = 0;
      const step = duration / target;
      const timer = setInterval(() => {
        start++;
        if (element) element.textContent = start + suffix;
        if (start >= target) {
          if (element) element.textContent = target + suffix;
          clearInterval(timer);
        }
      }, step);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (langCountRef.current) animateCounter(langCountRef.current, 3, 600);
          if (timeCountRef.current) animateCounter(timeCountRef.current, 30, 800, 's');
          if (catCountRef.current) animateCounter(catCountRef.current, 7, 600);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <section className="relative overflow-hidden py-12 md:py-24 bg-[#FFFFFF] border-b border-[#E5E0D8]">
        <div className="max-w-[1240px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 items-center gap-8 lg:gap-16">
          <div className="space-y-6 lg:col-span-7">
            <div className="space-y-4">
              <div 
                className="hero-animate inline-block border border-[#F1C40F] bg-[#FEF9E7] text-[#B7791F] px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] rounded-full"
                style={{ animation: 'fadeUp 0.5s forwards 0.1s' }}
              >
                {T[lang].heroInfo}
              </div>
              <h1 
                className="hero-animate text-3xl sm:text-4xl md:text-5xl lg:text-[68px] text-[#B91C1C] font-extrabold tracking-tight leading-[1.1] whitespace-pre-line"
                style={{ animation: 'fadeUp 0.6s forwards 0.2s' }}
              >
                {T[lang].heroTagline || T[lang].heroTitle}
              </h1>
            </div>
            
            <div className="space-y-6">
              <p 
                className="hero-animate text-sm md:text-[15px] text-[#3D3D3D] max-w-[520px] leading-[1.75] font-normal border-l-2 border-[#B91C1C] pl-[14px]"
                style={{ animation: 'fadeUp 0.6s forwards 0.5s' }}
              >
                {T[lang].heroSubtext || T[lang].heroDesc}
              </p>
            </div>

            <div 
              className="hero-animate flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2"
              style={{ animation: 'fadeUp 0.5s forwards 0.65s' }}
            >
              <button 
                onClick={onStartClick}
                className="w-full sm:w-auto bg-[#B91C1C] hover:bg-[#A61A1A] text-white px-[28px] py-[12px] font-semibold text-[15px] rounded-[10px] flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(185,28,28,0.3)] hover:shadow-[0_6px_20px_rgba(185,28,28,0.45)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-[0_2px_8px_rgba(185,28,28,0.25)] transition-all duration-200 cursor-pointer"
              >
                <Upload size={18} />
                {T[lang].startAnalysis}
              </button>
              
              <div className="flex flex-wrap items-center gap-[8px] w-full sm:w-auto">
                {[
                  { id: 'id', label: T[lang].demoId },
                  { id: 'cn', label: T[lang].demoCn },
                  { id: 'en', label: T[lang].demoEn || "TRY DEMO (ENG CONTRACT)" }
                ].map((demo) => (
                  <button 
                    key={demo.id}
                    onClick={() => {
                      if (demo.id === 'id') onDemoId();
                      else if (demo.id === 'cn') onDemoCn();
                      else onDemoEn();
                    }}
                    className="flex-1 sm:flex-initial group border-[1.5px] border-[#B91C1C] text-[#B91C1C] px-3 py-1.5 font-bold text-[11px] rounded-[6px] uppercase tracking-[0.08em] hover:bg-[#B91C1C] hover:text-white hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-wait min-w-[110px] flex items-center justify-center h-[36px]"
                  >
                    {demo.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Trust Badges - User didn't specify what they are in original code, but I'll add a placeholder if needed or just skip since they weren't explicitly in the code structure except in instructions */}
          </div>

          <div 
            className="hero-animate relative lg:col-span-5 h-[260px] sm:h-[340px] lg:h-[420px] mt-4 lg:mt-0"
            style={{ animation: 'slideInRight 0.7s forwards 0.3s' }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 sm:w-80 sm:h-80 bg-[#B91C1C]/5 rounded-full blur-3xl opacity-60"></div>
            <motion.div 
              className="relative w-full h-full flex items-center justify-center z-10"
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <img 
                alt="Rui Pointing at Growth Chart" 
                className="w-full h-full object-contain max-h-[240px] sm:max-h-[320px] lg:max-h-full"
                src="https://i.ibb.co.com/S4d22fGZ/RUI-POINTING-AT-GROWTH-CHART-BUSINESS.png" 
                referrerPolicy="no-referrer"
              />
            </motion.div>
            <div 
              className="hero-animate absolute -bottom-2 sm:-bottom-4 left-1/2 -translate-x-1/2 sm:translate-x-0 sm:left-auto sm:right-2 bg-white border border-[#E5E0D8] rounded-[12px] p-3 shadow-[0_8px_24px_rgba(0,0,0,0.10)] flex items-center gap-3 z-20 min-w-[240px] sm:min-w-[260px]"
              style={{ animation: 'fadeIn 0.5s forwards 1.0s' }}
            >
              <div className="w-8 h-8 rounded-full bg-[#FDF2F2] flex items-center justify-center text-[#B91C1C] shrink-0">
                <ShieldCheck size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#1A1A1A] tracking-wider uppercase mb-0.5">AES-256 ENCRYPTION</p>
                <p className="text-[#6B6B6B] text-[10px] m-0">Your data is safe / 数据安全保护</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <div ref={statsRef} className="reveal-on-scroll bg-white border-b border-[#E5E0D8] py-[20px]">
        <div className="max-w-[1240px] mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-0">
            <div className="flex-1 flex flex-col items-center text-center">
              <span ref={langCountRef} className="font-playfair text-[28px] font-bold text-[#B91C1C]">0</span>
              <span className="font-dm-sans text-[11px] text-[#6B6B6B] tracking-[0.05em] uppercase mt-1">{T[lang].statsLang}</span>
            </div>
            
            <div className="hidden md:block w-[1px] h-10 bg-[#E5E0D8]" />
            
            <div className="flex-1 flex flex-col items-center text-center">
              <span ref={timeCountRef} className="font-playfair text-[28px] font-bold text-[#B91C1C]">0s</span>
              <span className="font-dm-sans text-[11px] text-[#6B6B6B] tracking-[0.05em] uppercase mt-1">{T[lang].statsTime}</span>
            </div>
            
            <div className="hidden md:block w-[1px] h-10 bg-[#E5E0D8]" />
            
            <div className="flex-1 flex flex-col items-center text-center">
              <span ref={catCountRef} className="font-playfair text-[28px] font-bold text-[#B91C1C]">0</span>
              <span className="font-dm-sans text-[11px] text-[#6B6B6B] tracking-[0.05em] uppercase mt-1">{T[lang].statsCat}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
