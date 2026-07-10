import React from 'react';
import { AlertTriangle, ShieldCheck, Quote } from 'lucide-react';
import { motion } from 'motion/react';
import { T } from '../lib/translations';
import { Language } from '../types';

interface IntroductionProps {
  lang: Language;
}

export default function Introduction({ lang }: IntroductionProps) {
  const current = T[lang];

  return (
    <section id="introduction" className="py-12 md:py-24 bg-[#FAFAF8] scroll-mt-[70px]">
      <div className="max-w-7xl mx-auto px-4 md:px-12">
        <div className="text-center mb-10 md:mb-16 px-4">
          <p className="text-[10px] font-bold text-[#B91C1C] uppercase tracking-[0.15em] mb-3">
             {current.introLabel}
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-[#1A1A1A] font-serif mb-4 leading-tight">
            {current.introTitle}
          </h2>
          <p className="text-base md:text-lg text-[#6B6B6B] max-w-2xl mx-auto font-medium">
            {current.introSub}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-12 md:mb-16">
          {/* Left Column - The Problem */}
          <div 
            className="reveal-on-scroll bg-white border border-[#E5E0D8] border-l-[3px] border-l-[#D97706] rounded-xl p-6 md:p-10 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <div className="p-2 bg-[#FFF7ED] rounded-lg">
                <AlertTriangle size={20} className="text-[#D97706]" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-[#1A1A1A]">{current.probTitle}</h3>
            </div>
            <div className="space-y-4 text-sm md:text-[14px] text-[#3D3D3D] leading-[1.8] font-medium">
              <p>{current.probBody1}</p>
              <p>{current.probBody2}</p>
              <p>{current.probBody3}</p>
              <p>{current.probBody4}</p>
            </div>
          </div>

          {/* Right Column - Our Solution */}
          <div 
            className="reveal-on-scroll bg-white border border-[#E5E0D8] border-l-[3px] border-l-[#15803D] rounded-xl p-6 md:p-10 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <div className="p-2 bg-[#F0FDF4] rounded-lg">
                <ShieldCheck size={20} className="text-[#15803D]" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-[#1A1A1A]">{current.solTitle}</h3>
            </div>
            <div className="space-y-4 text-sm md:text-[14px] text-[#3D3D3D] leading-[1.8] font-medium">
              <p>{current.solBody1}</p>
              <p>{current.solBody2}</p>
              <ul className="space-y-2">
                <li className="flex gap-2"><span>•</span> {current.solItem1}</li>
                <li className="flex gap-2"><span>•</span> {current.solItem2}</li>
                <li className="flex gap-2"><span>•</span> {current.solItem3}</li>
                <li className="flex gap-2"><span>•</span> {current.solItem4}</li>
                <li className="flex gap-2"><span>•</span> {current.solItem5}</li>
              </ul>
              <p>{current.solBody3}</p>
            </div>
          </div>
        </div>

        <div 
          className="reveal-on-scroll max-w-xl mx-auto"
        >
          <div className="bg-[#FFF1F2] p-6 md:p-8 rounded-2xl relative">
            <Quote className="absolute top-4 left-4 opacity-5 text-[#B91C1C]" size={40} />
            <p className="text-center italic text-[#B91C1C] font-serif text-base md:text-lg leading-relaxed relative z-10">
              "{current.quote}"
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
