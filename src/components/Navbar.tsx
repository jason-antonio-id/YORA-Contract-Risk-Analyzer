import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { T } from '../lib/translations';
import { Menu, X, Info, HelpCircle, Zap, Users } from 'lucide-react';

interface NavbarProps {
  lang: Language;
  setLang: (lang: Language) => void;
  onDemoClick: () => void;
  hasResult?: boolean;
}

export default function Navbar({ lang, setLang, onDemoClick, hasResult }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setMenuOpen(false);
    const element = document.querySelector(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    handleScroll();

    const sections = document.querySelectorAll('#introduction, #how-it-works, #features, #personas');
    const navLinks = document.querySelectorAll('.nav-link, .bottom-nav-link');
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            navLinks.forEach((link) => link.classList.remove('active'));
            const activeLinks = document.querySelectorAll(`.nav-link[href="#${entry.target.id}"], .bottom-nav-link[href="#${entry.target.id}"]`);
            activeLinks.forEach((link) => link.classList.add('active'));
          }
        });
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    );
    sections.forEach((section) => navObserver.observe(section));

    return () => {
      window.removeEventListener('scroll', handleScroll);
      navObserver.disconnect();
    };
  }, []);

  const handleDemoClick = () => {
    setMenuOpen(false);
    const featuresSection = document.querySelector('#features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => onDemoClick(), 800);
    }
  };

  return (
    <>
      <header className={`navbar fixed top-0 w-full z-50 h-16 transition-all duration-300 ${scrolled ? 'border-b border-[#E5E0D8] bg-white/95 backdrop-blur-[8px]' : 'bg-white border-b border-transparent'}`}>
        <div className="flex justify-between items-center h-16 px-4 md:px-12 max-w-[1240px] mx-auto">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 flex items-center justify-center shrink-0">
              <img src="https://i.ibb.co.com/GfDK38yS/Yora-logo.png" alt="Yora Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
            </div>
            <div className="flex flex-col">
              <span className="font-sans text-base md:text-lg font-black tracking-wide text-[#1A1A1A] leading-tight">YORA | 永睿</span>
              <span className="font-sans text-[11px] font-semibold text-[#6B7280] leading-none hidden sm:block mt-0.5">Contract Risk Analyzer</span>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            <a onClick={(e) => scrollToSection(e, '#introduction')} className="nav-link text-[#6B7280] hover:text-[#B91C1C] transition-colors text-[14px] font-semibold" href="#introduction">{T[lang].navIntro}</a>
            <a onClick={(e) => scrollToSection(e, '#how-it-works')} className="nav-link text-[#6B7280] hover:text-[#B91C1C] transition-colors text-[14px] font-semibold" href="#how-it-works">{T[lang].navHow}</a>
            <a onClick={(e) => scrollToSection(e, '#features')} className="nav-link text-[#6B7280] hover:text-[#B91C1C] transition-colors text-[14px] font-semibold" href="#features">{T[lang].navFeatures}</a>
            <a onClick={(e) => scrollToSection(e, '#personas')} className="nav-link text-[#6B7280] hover:text-[#B91C1C] transition-colors text-[14px] font-semibold" href="#personas">{T[lang].navPersonas}</a>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Language toggle */}
            <div className="language-toggle inline-flex border border-[#E5E0D8]/50 rounded-full bg-white overflow-hidden p-0.5 shrink-0">
              <button onClick={() => setLang('en')} className={`px-2.5 md:px-4 py-1.5 text-[10px] md:text-[11px] font-bold rounded-full transition-all cursor-pointer ${lang === 'en' ? 'bg-[#B91C1C] text-white shadow-sm' : 'text-[#6B7280] hover:bg-[#F9FAFB]'}`}>EN</button>
              <button onClick={() => setLang('cn')} className={`px-2.5 md:px-4 py-1.5 text-[10px] md:text-[11px] font-bold rounded-full transition-all cursor-pointer ${lang === 'cn' ? 'bg-[#B91C1C] text-white shadow-sm' : 'text-[#6B7280] hover:bg-[#F9FAFB]'}`}>中文</button>
              <button onClick={() => setLang('id')} className={`px-2.5 md:px-4 py-1.5 text-[10px] md:text-[11px] font-bold rounded-full transition-all cursor-pointer ${lang === 'id' ? 'bg-[#B91C1C] text-white shadow-sm' : 'text-[#6B7280] hover:bg-[#F9FAFB]'}`}>ID</button>
            </div>

            {/* Desktop Try Demo button */}
            <button onClick={handleDemoClick} className="hidden md:block bg-[#B91C1C] text-white px-5 py-2.5 rounded-lg font-bold text-[13px] hover:bg-[#A61A1A] shadow-[0_4px_14px_rgba(185,28,28,0.3)] hover:shadow-[0_6px_20px_rgba(185,28,28,0.45)] transition-all duration-200 cursor-pointer">
              {T[lang].tryDemo}
            </button>

            {/* Mobile bottom navigation bar replaces hamburger on smaller viewports */}
          </div>
        </div>

        <style>{`
          .nav-link { position: relative; transition: color 0.3s ease; }
          .nav-link::after { content: ""; position: absolute; left: 0; bottom: -4px; width: 0%; height: 2px; background: #B91C1C; transition: width 0.3s ease; }
          .nav-link:hover::after, .nav-link.active::after { width: 100%; }
          .nav-link.active { color: #B91C1C; font-weight: 700; }
          
          .bottom-nav-link { transition: all 0.2s ease; color: #6B7280; }
          .bottom-nav-link.active { color: #B91C1C; font-weight: 700; }
        `}</style>
      </header>

      {/* Modern Fixed Bottom Navigation Bar for Mobile View */}
      {!hasResult && (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-[12px] border-t border-[#E5E0D8] z-[100] py-2 px-3 pb-safe shadow-[0_-4px_16px_rgba(0,0,0,0.06)] flex justify-around items-center">
          <a 
            onClick={(e) => scrollToSection(e, '#introduction')} 
            href="#introduction" 
            className="bottom-nav-link flex flex-col items-center gap-0.5 text-center px-2 py-1 select-none cursor-pointer"
          >
            <Info size={18} className="transition-transform active:scale-90" />
            <span className="text-[10px] font-bold tracking-tight">{T[lang].navIntro}</span>
          </a>
          <a 
            onClick={(e) => scrollToSection(e, '#how-it-works')} 
            href="#how-it-works" 
            className="bottom-nav-link flex flex-col items-center gap-0.5 text-center px-2 py-1 select-none cursor-pointer"
          >
            <HelpCircle size={18} className="transition-transform active:scale-90" />
            <span className="text-[10px] font-bold tracking-tight">{T[lang].navHow}</span>
          </a>
          <a 
            onClick={(e) => scrollToSection(e, '#features')} 
            href="#features" 
            className="bottom-nav-link flex flex-col items-center gap-0.5 text-center px-2 py-1 select-none cursor-pointer"
          >
            <Zap size={18} className="transition-transform active:scale-90" />
            <span className="text-[10px] font-bold tracking-tight">{T[lang].navFeatures}</span>
          </a>
          <a 
            onClick={(e) => scrollToSection(e, '#personas')} 
            href="#personas" 
            className="bottom-nav-link flex flex-col items-center gap-0.5 text-center px-2 py-1 select-none cursor-pointer"
          >
            <Users size={18} className="transition-transform active:scale-90" />
            <span className="text-[10px] font-bold tracking-tight">{T[lang].navPersonas}</span>
          </a>
        </nav>
      )}
    </>
  );
}
