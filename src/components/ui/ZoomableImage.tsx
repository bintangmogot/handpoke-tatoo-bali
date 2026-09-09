"use client";

import { useState } from "react";
import Image, { ImageProps } from "next/image";

export default function ZoomableImage({ src, alt, ...props }: ImageProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Image
        src={src}
        alt={alt}
        {...props}
        onClick={(e) => {
          setIsOpen(true);
          if (props.onClick) props.onClick(e);
        }}
        className={`${props.className || ""} cursor-zoom-in`}
      />

      {isOpen && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 md:p-12 animate-in fade-in zoom-in-95 duration-200 cursor-zoom-out"
          onClick={() => setIsOpen(false)}
        >
          <div className="relative w-full h-full max-w-6xl max-h-[85vh]">
            <Image
              src={src}
              alt={alt}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
          <button 
            className="absolute top-4 right-4 md:top-8 md:right-8 text-secondary hover:text-white bg-black/50 hover:bg-accent rounded-full p-2 transition-all"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
            }}
            aria-label="Close modal"
          >
            <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      )}
    </>
  );
}
