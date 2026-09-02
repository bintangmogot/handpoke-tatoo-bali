"use client";

import Image from "next/image";

interface TestimonialProps {
  name: string;
  country: string;
  countryCode: string; // e.g., 'US', 'DK', 'AU', 'DE'
  review: string;
  imageUrl: string;
  rating?: number;
}

export default function TestimonialCard({
  name,
  country,
  countryCode,
  review,
  imageUrl,
  rating = 5,
}: TestimonialProps) {
  return (
    <div className="flex flex-col bg-secondary rounded-lg overflow-hidden border border-border transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:border-border/80 group">
      {/* Top Image Area */}
      <div className="relative h-64 w-full overflow-hidden">
        <Image
          src={imageUrl}
          alt={`Tattoo done for ${name}`}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Verified Badge */}
        <div className="absolute top-4 right-4 bg-accent text-white text-[10px] font-bold px-3 py-1 rounded-full tracking-widest uppercase shadow-md">
          Verified
        </div>
      </div>

      {/* Content Area */}
      <div className="flex flex-col flex-grow p-6 sm:p-8 bg-surface/30">
        {/* Stars */}
        <div className="flex items-center justify-center gap-1 mb-6">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={`w-4 h-4 ${
                i < rating ? "text-accent" : "text-border"
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>

        {/* Review Text */}
        <p className="text-secondary italic text-center text-sm md:text-base leading-relaxed flex-grow mb-8 font-heading">
          "{review}"
        </p>

        {/* User Info */}
        <div className="flex flex-col items-center gap-2 mt-auto pt-6 border-t border-border">
          <h4 className="font-heading font-bold text-primary tracking-wide text-lg">
            {name}
          </h4>
          <div className="flex items-center gap-2">
            <span
              className={`fi fi-${countryCode.toLowerCase()} rounded-sm shadow-sm opacity-80`}
              style={{ fontSize: "12px" }}
            ></span>
            <span className="text-secondary font-sans text-xs tracking-widest uppercase">
              {country}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
