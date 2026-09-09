"use client";

import { useState } from "react";

interface AccordionItem {
  id: string;
  title: string;
  content: string;
}

export default function Accordion({ items, defaultOpen = true }: { items: AccordionItem[], defaultOpen?: boolean }) {
  const [openId, setOpenId] = useState<string | null>(defaultOpen ? (items[0]?.id || null) : null);

  return (
    <div className="w-full flex flex-col border-t border-border">
      {items.map((item) => (
        <div key={item.id} className="border-b border-border">
          <button
            onClick={() => setOpenId(openId === item.id ? null : item.id)}
            className="w-full flex justify-between items-center py-6 text-left group"
          >
            <span className={`font-sans font-medium text-lg transition-colors ${openId === item.id ? 'text-accent' : 'text-primary group-hover:text-accent'}`}>
              {item.title}
            </span>
            <span className={`text-secondary transition-transform duration-300 ${openId === item.id ? 'rotate-180' : ''}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </button>
          <div 
            className={`overflow-hidden transition-all duration-300 ease-in-out ${openId === item.id ? 'max-h-96 opacity-100 pb-6' : 'max-h-0 opacity-0'}`}
          >
            <p className="text-secondary font-sans font-light leading-relaxed text-sm md:text-base pr-8">
              {item.content}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
