"use client";

import { useState } from "react";
import ZoomableImage from "@/components/ui/ZoomableImage";

// Simulated gallery data using the assets we have
const galleryData = [
  { id: 1, src: "/assets/Gallery/dotlinetattu_handpoke_tattoo_bali-klrlhsspxtuwbozl-2c4Ad1N23eO5zoWg.jpg", category: "Handpoke" },
  { id: 2, src: "/assets/Gallery/handpoke-tattoo-bali-dotlinetattu-10-r2el8hh0jzntmivg-YGG71UVQu8hnYG1f.jpg", category: "Handpoke" },
  { id: 3, src: "/assets/Gallery/handpoke-tattoo-bali-dotlinetattu-17-JRkSSHut1wMPg4J1.webp", category: "Machine" },
  { id: 4, src: "/assets/Gallery/handpoke-tattoo-bali-dotlinetattu-20-6B7LEVxri2IpWP3F.webp", category: "Handpoke" },
  { id: 5, src: "/assets/Gallery/handpoke-tattoo-bali-dotlinetattu-21-yaHHOuqmCsS0hG1g.webp", category: "Machine" },
  { id: 6, src: "/assets/Gallery/handpoke-tattoo-bali-dotlinetattu-pjqgb34z4ih1vbty-1-1GiQoHQnBSTZ2GRi.jpg", category: "Flash" },
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

        {/* Grid (Masonry) */}
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 md:gap-6 space-y-4 md:space-y-6">
          {filteredGallery.map((item) => (
            <div key={item.id} className="relative rounded-sm overflow-hidden group border border-border/50 break-inside-avoid">
              <ZoomableImage 
                src={item.src} 
                alt={`${item.category} Tattoo`} 
                useNativeImg
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 md:p-6 pointer-events-none">
                <span className="text-accent font-heading tracking-widest uppercase text-xs md:text-sm font-bold">
                  {item.category}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}