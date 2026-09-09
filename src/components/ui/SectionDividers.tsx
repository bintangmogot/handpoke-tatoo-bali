"use client";

export function ChevronDivider({ color = "var(--bg-dark)", className = "" }: { color?: string; className?: string }) {
  return (
    <div className={`relative z-20 pointer-events-none ${className}`}>
      <div className="absolute left-1/2 -translate-x-1/2 w-[50px] h-[25px] overflow-hidden -top-[1px]">
        <div 
          className="w-[50px] h-[50px] rotate-45 mx-auto" 
          style={{ backgroundColor: color, marginTop: '-25px' }}
        />
      </div>
    </div>
  );
}

export function WaveDivider({ fillColor = "#ffffff", flip = false, className = "" }: { fillColor?: string; flip?: boolean; className?: string }) {
  return (
    <div className={`w-full overflow-hidden leading-none ${flip ? 'rotate-180' : ''} ${className}`} style={{ marginTop: '-1px', marginBottom: '-1px' }}>
      <svg className="relative block w-full h-[40px] md:h-[60px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill={fillColor} />
      </svg>
    </div>
  );
}
