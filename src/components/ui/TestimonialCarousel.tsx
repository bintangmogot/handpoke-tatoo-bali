"use client";

import { useRef, useEffect, useState } from "react";
import TestimonialCard from "@/components/ui/TestimonialCard";

interface Testimonial {
  name: string;
  country: string;
  countryCode: string;
  review: string;
  imageUrl: string;
  rating: number;
}

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
}

export default function TestimonialCarousel({ testimonials }: TestimonialCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10); // 10px buffer
    }
  };

  useEffect(() => {
    updateScrollState();
    window.addEventListener("resize", updateScrollState);
    return () => window.removeEventListener("resize", updateScrollState);
  }, []);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -380, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 380, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative group">
      <div 
        ref={scrollRef}
        onScroll={updateScrollState}
        className="flex overflow-x-auto gap-6 pb-10 pt-4 px-4 -mx-4 snap-x snap-mandatory hide-scrollbar items-stretch"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {testimonials.map((t, idx) => (
          <div key={idx} className="w-[85vw] md:w-[350px] shrink-0 snap-center flex">
            <div className="w-full h-full">
              <TestimonialCard {...t} />
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button 
        onClick={scrollLeft}
        disabled={!canScrollLeft}
        className="absolute left-[-20px] top-1/2 -translate-y-1/2 bg-surface border border-border text-primary p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all disabled:opacity-0 hidden lg:flex items-center justify-center hover:text-accent hover:border-accent z-10 shadow-lg"
        aria-label="Previous"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
      </button>
      <button 
        onClick={scrollRight}
        disabled={!canScrollRight}
        className="absolute right-[-20px] top-1/2 -translate-y-1/2 bg-surface border border-border text-primary p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all disabled:opacity-0 hidden lg:flex items-center justify-center hover:text-accent hover:border-accent z-10 shadow-lg"
        aria-label="Next"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
      </button>

      {/* Hide scrollbar styles */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}} />
    </div>
  );
}
