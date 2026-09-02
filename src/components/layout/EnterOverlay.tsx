"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

export default function EnterOverlay() {
  const [entered, setEntered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio element
    audioRef.current = new Audio("/assets/Music/bg-music.mp4"); // Will adjust path after moving assets
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3; // 30% volume

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleEnter = () => {
    if (audioRef.current) {
      audioRef.current.play().catch((e) => console.log("Audio play failed:", e));
      setIsPlaying(true);
    }
    setEntered(true);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  return (
    <>
      {/* Overlay Screen */}
      <div
        className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050505] transition-all duration-1000 ${
          entered ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <div className="text-center animate-in fade-in zoom-in duration-700">
          <div className="w-32 h-32 md:w-48 md:h-48 mx-auto mb-8 relative">
            {/* Fallback text if image not loaded yet, or we use the logo */}
            <div className="w-full h-full border border-accent/30 rounded-full flex items-center justify-center">
               <span className="font-heading font-bold text-2xl tracking-widest text-primary">DTLN</span>
            </div>
          </div>
          
          <h1 className="font-heading font-bold text-3xl md:text-5xl text-primary mb-2 uppercase tracking-widest">
            Dotlinetattu
          </h1>
          <p className="text-secondary text-sm md:text-base tracking-[0.2em] mb-12 uppercase">
            Traditional Handpoke Bali
          </p>

          <button
            onClick={handleEnter}
            className="px-8 py-4 bg-transparent border border-accent text-accent hover:bg-accent hover:text-white transition-all duration-500 font-heading font-bold tracking-widest uppercase text-sm md:text-base flex items-center gap-3 mx-auto"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
            Enter Studio
          </button>
          
          <p className="text-text-tertiary text-xs mt-6 tracking-widest uppercase">
            Turn on sound for the full experience
          </p>
        </div>
      </div>

      {/* Floating Music Player (Only visible after entering) */}
      <div 
        className={`fixed bottom-6 right-6 z-50 transition-all duration-1000 ${
          entered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
        }`}
      >
        <button
          onClick={toggleMute}
          className="w-12 h-12 rounded-full glass-panel flex items-center justify-center text-primary hover:text-accent transition-colors border border-border shadow-lg group"
          aria-label={isPlaying ? "Mute music" : "Play music"}
        >
          {isPlaying ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M12 19l-7-7H2V9h3l7-7v17z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
          )}
        </button>
      </div>
    </>
  );
}
