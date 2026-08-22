import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { FAQ } from '@/data/faqs';

export function FAQAccordion({ faqs }: { faqs: FAQ[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="flex flex-col gap-3">
      {faqs.map((faq, i) => {
        const isOpen = open === i;
        return (
          <div
            key={faq.q}
            className={`card overflow-hidden transition-all duration-300 ${
              isOpen ? 'border-orange-200 shadow-lift' : 'hover:border-navy-200'
            }`}
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
              aria-expanded={isOpen}
            >
              <span className="text-base font-semibold text-navy-900 sm:text-lg">
                {faq.q}
              </span>
              <span
                className={`shrink-0 rounded-full p-1.5 transition-all duration-300 ${
                  isOpen ? 'rotate-180 bg-orange-500 text-white' : 'bg-navy-50 text-navy-700'
                }`}
              >
                <ChevronDown className="h-5 w-5" />
              </span>
            </button>
            <div
              className="grid transition-all duration-300 ease-out"
              style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
            >
              <div className="overflow-hidden">
                <p className="px-6 pb-5 text-sm leading-relaxed text-navy-600 sm:text-base">
                  {faq.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
