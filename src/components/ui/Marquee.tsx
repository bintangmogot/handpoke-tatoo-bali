export default function Marquee() {
  const words = [
    "AUTHENTIC HANDPOKE",
    "•",
    "NO MACHINES",
    "•",
    "TRADITIONAL MENTAWAI",
    "•",
    "KALIMANTAN ROOTS",
    "•",
    "MEDITATIVE RITUAL",
    "•",
    "CUSTOM DESIGNS",
    "•"
  ];

  return (
    <div className="w-full bg-accent text-primary py-4 overflow-hidden flex whitespace-nowrap border-y border-border">
      <div className="animate-marquee inline-block font-heading tracking-widest text-sm uppercase">
        {/* Double the content for smooth infinite scrolling */}
        {[...Array(4)].map((_, i) => (
          <span key={i} className="mx-4 font-bold text-[#110f0e]">
            {words.map((word, j) => (
              <span key={j} className="mx-4">{word}</span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}
