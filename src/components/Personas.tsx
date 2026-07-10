import React from 'react';
import { Building2, Users, Scale } from 'lucide-react';
import { Language } from '../types';
import { T } from '../lib/translations';

interface PersonasProps {
  lang: Language;
}

export default function Personas({ lang }: PersonasProps) {
  return (
    <section className="py-12 md:py-24 bg-surface-container-lowest" id="personas">
      <div className="max-w-[1200px] mx-auto px-4 md:px-12">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-3xl font-bold text-[#1A1A1A]">{lang === 'cn' ? "专为跨国业务打造" : "Tailored for Global Business"}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <PersonaCard 
            icon={<img src="https://i.ibb.co.com/b9sjKdB/RUI-CARRYING-BRIEFCASE-BUSINESS.png" alt="Chinese Owner" className="w-24 h-24 object-contain" referrerPolicy="no-referrer" />}
            title={T[lang].personaChineseOwnerTitle}
            desc={T[lang].personaChineseOwnerDesc}
            index={0}
          />
          <PersonaCard 
            icon={<img src="https://i.ibb.co.com/3yzPDFLQ/RUI-HANDSHAKE-BUSINESS.png" alt="Joint Ventures" className="w-24 h-24 object-contain" referrerPolicy="no-referrer" />}
            title={T[lang].personaJointVenturesTitle}
            desc={T[lang].personaJointVenturesDesc}
            index={1}
          />
          <PersonaCard 
            icon={<img src="https://i.ibb.co.com/HDT7NmNS/RUI-ON-THE-PHONE-BUSINESS.png" alt="Indonesian Suppliers" className="w-24 h-24 object-contain" referrerPolicy="no-referrer" />}
            title={T[lang].personaSuppliersTitle}
            desc={T[lang].personaSuppliersDesc}
            index={2}
          />
          <PersonaCard 
            icon={<img src="https://i.ibb.co.com/FqN05B3k/RUI-HOLDING-SCALE-OF-JUSTICE-BUSINESS.png" alt="Cross Border Trade" className="w-24 h-24 object-contain" referrerPolicy="no-referrer" />}
            title={T[lang].personaCrossBorderTitle}
            desc={T[lang].personaCrossBorderDesc}
            index={3}
          />
        </div>
      </div>
    </section>
  );
}

function PersonaCard({ icon, title, desc, index }: { icon: React.ReactNode, title: string, desc: string, index: number }) {
  return (
    <div 
      className="reveal-on-scroll bg-[#FFFFFF] border border-[#E5E7EB] rounded-xl p-6 flex flex-col items-center text-center space-y-4 hover:border-[#C0392B] hover:-translate-y-1 hover:shadow-md transition-all group"
      style={{ transitionDelay: `${index * 0.15}s` }}
    >
      <div className="inline-flex transition-transform group-hover:scale-105">
        {icon}
      </div>
      <div>
        <h4 className="font-bold text-lg text-[#1A1A1A] leading-tight">{title}</h4>
      </div>
      <p className="text-sm text-[#6B7280] leading-relaxed">{desc}</p>
    </div>
  );
}
