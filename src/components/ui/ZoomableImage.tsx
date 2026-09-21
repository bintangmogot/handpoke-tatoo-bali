"use client";

import { useEffect, useState } from "react";
import Image, { ImageProps } from "next/image";

type ZoomItem = { src: string; alt: string; title?: string };

interface ZoomableImageProps extends Omit<ImageProps, 'src'> {
  src: string;
  useNativeImg?: boolean;
  zoomTitle?: string;
  zoomItems?: ZoomItem[];
  zoomIndex?: number;
}

export default function ZoomableImage({ src, alt, useNativeImg, zoomTitle, zoomItems, zoomIndex = 0, ...props }: ZoomableImageProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(zoomIndex);
  const items = zoomItems?.length ? zoomItems : [{ src, alt: String(alt || ''), title: zoomTitle }];
  const activeItem = items[activeIndex] || items[0];

  const showItemWhenReady = (nextIndex: number) => {
    const nextItem = items[nextIndex];
    if (!nextItem) return;
    const preload = new window.Image();
    preload.onload = () => setActiveIndex(nextIndex);
    preload.src = nextItem.src;
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
      if (items.length < 2) return;
      if (event.key === 'ArrowRight') showItemWhenReady((activeIndex + 1) % items.length);
      if (event.key === 'ArrowLeft') showItemWhenReady((activeIndex - 1 + items.length) % items.length);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, items.length, activeIndex]);

  const openAt = () => {
    setActiveIndex(zoomIndex);
    setIsOpen(true);
  };

  return (
    <>
      {useNativeImg ? (
        <img
          src={src}
          alt={alt}
          onClick={(e) => {
            openAt();
            if (props.onClick) props.onClick(e as any);
          }}
          className={`${props.className || ""} cursor-zoom-in`}
        />
      ) : (
        <Image
          src={src}
          alt={alt}
          {...props}
          onClick={(e) => {
            openAt();
            if (props.onClick) props.onClick(e);
          }}
          className={`${props.className || ""} cursor-zoom-in`}
        />
      )}

      {isOpen && (
        <div 
          className="fixed inset-0 z-[100] flex cursor-zoom-out items-center justify-center bg-black/95 p-4 backdrop-blur-md md:p-12"
          onClick={() => setIsOpen(false)}
        >
          <div className="relative w-full h-full max-w-6xl max-h-[85vh]">
            <Image
              src={activeItem.src}
              alt={activeItem.alt}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
          <p className="absolute bottom-5 left-1/2 max-w-[calc(100%-5rem)] -translate-x-1/2 text-center font-heading text-lg text-white md:bottom-8 md:text-2xl">
            {activeItem.title || activeItem.alt}
          </p>
          {items.length > 1 && <>
            <button type="button" className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/60 px-4 py-3 text-2xl text-white hover:bg-accent md:left-8" onClick={(event) => { event.stopPropagation(); showItemWhenReady((activeIndex - 1 + items.length) % items.length); }} aria-label="Previous picture">‹</button>
            <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/60 px-4 py-3 text-2xl text-white hover:bg-accent md:right-8" onClick={(event) => { event.stopPropagation(); showItemWhenReady((activeIndex + 1) % items.length); }} aria-label="Next picture">›</button>
          </>}
          <button 
            className="absolute right-4 top-4 rounded-full bg-black/50 p-2 text-secondary hover:bg-accent hover:text-white md:right-8 md:top-8"
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
