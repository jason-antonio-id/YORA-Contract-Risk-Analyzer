import React from 'react';
import { Upload, Cpu, FileText } from 'lucide-react';
import { Language } from '../types';
import { T } from '../lib/translations';

interface HowItWorksProps {
  lang: Language;
}

export default function HowItWorks({ lang }: HowItWorksProps) {
  const steps = [
    { icon: <Upload className="text-[#C0392B]" size={24} />, title: T[lang].stepUpload || T[lang].step1Title, desc: T[lang].step1Desc },
    { icon: <Cpu className="text-[#C0392B]" size={24} />, title: T[lang].stepAnalyze || T[lang].step2Title, desc: T[lang].step2Desc },
    { icon: <FileText className="text-[#C0392B]" size={24} />, title: T[lang].stepProtect || T[lang].step3Title, desc: T[lang].step3Desc },
  ];

  return (
    <section id="how-it-works" className="py-12 md:py-24 bg-[#FFFFFF] scroll-mt-20">
      <div className="max-w-[1200px] mx-auto px-4 md:px-12">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1A1A1A] text-center mb-10 md:mb-16">{T[lang].howTitleStep || T[lang].howTitle}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, i) => (
            <div 
              key={i} 
              className="reveal-on-scroll flex flex-col items-center text-center space-y-4"
              style={{ transitionDelay: `${i * 0.15}s` }}
            >
              <div className="w-12 h-12 rounded-full bg-[#F8F9FA] flex items-center justify-center mb-2 z-10 relative border border-[#E5E7EB]">
                {step.icon}
              </div>
              <h3 className="font-bold text-xl text-[#1A1A1A]">{step.title}</h3>
              <p className="text-sm text-[#6B7280] leading-relaxed max-w-[250px]">{step.desc}</p>
            </div>
          ))}
          <div className="hidden md:block absolute top-[24px] left-1/6 right-1/6 h-[2px] border-t-2 border-dotted border-[#E5E7EB] z-0 px-[100px]"></div>
        </div>
      </div>
    </section>
  );
}
