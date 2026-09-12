"use client";

import { useState } from "react";
import ZoomableImage from "@/components/ui/ZoomableImage";

// Simulated gallery data using the assets we have
const galleryData = [
  { id: 1, src: "https://res.cloudinary.com/workstation-/image/upload/v1788876442/dotlinetattu_handpoke_tattoo_bali-klrlhsspxtuwbozl-2c4Ad1N23eO5zoWg.jpg", category: "Handpoke", span: "tall" },
  { id: 2, src: "https://res.cloudinary.com/workstation-/image/upload/v1788876464/handpoke-tattoo-bali-dotlinetattu-10-r2el8hh0jzntmivg-YGG71UVQu8hnYG1f.jpg", category: "Handpoke", span: "normal" },
  { id: 3, src: "https://res.cloudinary.com/workstation-/image/upload/v1788876466/handpoke-tattoo-bali-dotlinetattu-17-JRkSSHut1wMPg4J1.webp", category: "Machine", span: "normal" },
  { id: 4, src: "https://res.cloudinary.com/workstation-/image/upload/v1788876467/handpoke-tattoo-bali-dotlinetattu-20-6B7LEVxri2IpWP3F.webp", category: "Handpoke", span: "tall" },
  { id: 5, src: "https://res.cloudinary.com/workstation-/image/upload/v1788876467/handpoke-tattoo-bali-dotlinetattu-21-yaHHOuqmCsS0hG1g.webp", category: "Machine", span: "normal" },
  { id: 6, src: "https://res.cloudinary.com/workstation-/image/upload/v1788876469/handpoke-tattoo-bali-dotlinetattu-pjqgb34z4ih1vbty-1-1GiQoHQnBSTZ2GRi.jpg", category: "Flash", span: "normal" },
  { id: 7, src: "https://res.cloudinary.com/workstation-/image/upload/v1788876470/handtapping-tattoo-bali-dotlinetattu-FuI3cCjPQQpIbAk2.webp", category: "Handpoke", span: "normal" },
  { id: 8, src: "https://res.cloudinary.com/workstation-/image/upload/v1788876467/handpoke-tattoo-bali-dotlinetattu-22-BUN8FOAbCUzf2GaG.webp", category: "Flash", span: "tall" },
  { id: 9, src: "https://res.cloudinary.com/workstation-/image/upload/v1788876433/dotlinetattu_handpoke_bali-2-Rkt9nssE7W3zqbvl.webp", category: "Machine", span: "normal" },
  { id: 10, src: "https://res.cloudinary.com/workstation-/image/upload/v1788876465/handpoke-tattoo-bali-dotlinetattu-11-boq69p6nyskdz2kd-XUPXBaXpD0GuXd67.jpg", category: "Handpoke", span: "normal" },
];

const categories = ["All", "Handpoke", "Machine", "Flash"];

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredGallery = activeCategory === "All" 
    ? galleryData 
    : galleryData.filter(item => item.category === activeCategory);

  return (
    <div className="pt-32 pb-24 w-full flex flex-col items-center min-h-screen">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        
        {/* Header */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-primary uppercase tracking-wider mb-6">
            Ink Gallery
          </h1>
          <p className="text-secondary font-light max-w-2xl mx-auto">
            A curated collection of our finest traditional handpoke and modern machine work.
          </p>
        </div>

        {/* Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-full font-heading tracking-widest uppercase text-xs transition-all duration-300 border ${
                activeCategory === cat 
                  ? "bg-accent border-accent text-white" 
                  : "bg-transparent border-border text-secondary hover:border-accent hover:text-primary"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 auto-rows-[200px] md:auto-rows-[280px]">
          {filteredGallery.map((item, index) => (
            <div 
              key={item.id} 
              className={`relative overflow-hidden group cursor-pointer rounded-sm border border-border/30
                ${item.span === "tall" ? "row-span-2" : "row-span-1"}
              `}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Image */}
              <ZoomableImage 
                src={item.src} 
                alt={`${item.category} Tattoo`} 
                useNativeImg
                className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-110 group-hover:brightness-110"
              />

              {/* Hover Overlay — cinematic reveal */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none">
                {/* Dark gradient from bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Accent line that slides in */}
                <div className="absolute bottom-0 left-0 w-0 group-hover:w-full h-[2px] bg-accent transition-all duration-700 ease-out" />
                
                {/* Category badge */}
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                  <span className="inline-block px-3 py-1 bg-accent/90 text-white font-heading tracking-widest uppercase text-[10px] md:text-xs font-bold rounded-sm backdrop-blur-sm">
                    {item.category}
                  </span>
                </div>

                {/* Zoom icon center */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-white/60 flex items-center justify-center scale-50 group-hover:scale-100 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100 backdrop-blur-sm bg-white/10">
                    <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}