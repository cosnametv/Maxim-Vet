import { useState } from 'react';
import { FAQS } from '../data';
import { Plus, Minus, HelpCircle } from 'lucide-react';

interface FAQSectionProps {
  onWriteToExpert?: () => void;
}

export default function FAQSection({ onWriteToExpert }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleIndex = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq-section-wrapper" className="py-20 bg-emerald-950 text-white relative overflow-hidden">
      {/* Decorative background vectors */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(circle_at_right,rgba(16,185,129,0.1),transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[radial-gradient(circle_at_left,rgba(212,168,67,0.05),transparent_70%)] pointer-events-none" />

      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column Intro */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs md:text-sm font-bold tracking-widest text-emerald-400 uppercase">Support Desk</span>
            <h2 className="font-serif text-3xl md:text-5xl font-medium tracking-tight text-white leading-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-emerald-100/80 text-sm md:text-base leading-relaxed">
              Find instant answers to common farming inquiries regarding bulk order discounts, county shipping logistics, and PCPB quality certifications.
            </p>
            <div className="pt-4">
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <p className="text-xs text-emerald-300 font-bold">Have another specific agricultural question?</p>
                <p className="text-xs text-white/70">Our support desk is online from Mon – Sat, 8:00 AM – 6:00 PM EAT to answer complex veterinary or soil issues.</p>
                <button
                  id="faq-contact-link"
                  onClick={() => {
                    if (onWriteToExpert) {
                      onWriteToExpert();
                    }
                  }}
                  className="inline-flex items-center text-xs font-bold text-emerald-400 hover:text-emerald-300 transition cursor-pointer"
                >
                  Write to an expert →
                </button>
              </div>
            </div>
          </div>

          {/* Right Column Accordions */}
          <div className="lg:col-span-7 space-y-4">
            {FAQS.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? 'bg-white/10 border-emerald-500/30'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <button
                    id={`faq-toggle-btn-${idx}`}
                    onClick={() => toggleIndex(idx)}
                    className="w-full flex items-center justify-between p-6 text-left outline-none"
                  >
                    <span className="font-serif text-base md:text-lg font-medium text-white pr-4">
                      {faq.question}
                    </span>
                    <span className="shrink-0 p-1 bg-white/10 rounded-full text-emerald-400">
                      {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </span>
                  </button>

                  <div
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                      isOpen ? 'max-h-60 border-t border-white/5' : 'max-h-0'
                    }`}
                  >
                    <p className="p-6 text-emerald-100/85 text-xs md:text-sm leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
