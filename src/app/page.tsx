import Image from "next/image";
import Link from "next/link";
import TestimonialCard from "@/components/ui/TestimonialCard";

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      
      {/* HERO SECTION */}
      <section className="relative h-screen min-h-[600px] w-full flex items-center justify-center overflow-hidden">
        {/* Video Background Placeholder */}
        <div className="absolute inset-0 z-0 bg-secondary">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            className="object-cover w-full h-full opacity-40 grayscale"
          >
            {/* We will replace this src with a real stock video later */}
            <source src="/assets/Music/bg-music.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-primary/30 via-primary/50 to-primary"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
          <h2 className="text-accent font-heading tracking-[0.3em] text-sm uppercase mb-6">
            Welcome to Dotlinetattu
          </h2>
          <h1 className="font-heading font-bold text-4xl md:text-6xl lg:text-7xl text-primary uppercase tracking-wider mb-8 max-w-4xl leading-tight">
            Authentic Handpoke & <span className="text-accent">Tribal Tattoo</span> Experience in Bali
          </h1>
          <p className="text-secondary text-lg md:text-xl max-w-2xl mb-12 font-light">
            Specializing in traditional Kalimantan, Mentawai, and modern custom designs. A sanctuary for meaningful ink.
          </p>
          <div className="flex flex-col sm:flex-row gap-6">
            <Link 
              href="/booking" 
              className="px-8 py-4 bg-accent hover:bg-accent-hover text-white transition-all duration-300 font-heading font-bold tracking-widest uppercase text-sm rounded-sm shadow-[0_0_20px_rgba(234,88,12,0.4)] hover:shadow-[0_0_30px_rgba(234,88,12,0.6)]"
            >
              Book a Session
            </Link>
            <Link 
              href="/gallery" 
              className="px-8 py-4 bg-transparent border border-border text-primary hover:border-accent hover:text-accent transition-all duration-300 font-heading font-bold tracking-widest uppercase text-sm rounded-sm glass-panel"
            >
              View Gallery
            </Link>
          </div>
        </div>
      </section>

      {/* TEASER / ABOUT SECTION */}
      <section className="py-24 bg-primary relative border-t border-border/50">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative aspect-square md:aspect-[4/3] lg:aspect-square overflow-hidden rounded-sm border border-border group">
              <Image 
                src="/assets/Gallery/dotlinetattu_handpoke_tattoo_bali-klrlhsspxtuwbozl-2c4Ad1N23eO5zoWg (1).jpg" 
                alt="Silver Jerry Handpoke Tattoo Artist" 
                fill
                className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-white/10"></div>
            </div>
            
            <div className="flex flex-col">
              <h3 className="text-accent font-heading tracking-widest text-sm uppercase mb-4">The Artist</h3>
              <h2 className="font-heading font-bold text-3xl md:text-5xl text-primary mb-8 uppercase tracking-wide">
                Traditional Roots, Modern Standards.
              </h2>
              <div className="space-y-6 text-secondary leading-relaxed font-light mb-10">
                <p>
                  Started in 2010 out of a deep passion for art and culture, Silver Jerry has spent over a decade mastering the ancient technique of handpoke tattooing. 
                </p>
                <p>
                  We bring the authentic traditions of Kalimantan and Mentawai to the modern era, strictly adhering to international hygiene standards. No machines, no rush. Just you, the artist, and the rhythm of the needle.
                </p>
              </div>
              <Link 
                href="/about" 
                className="self-start inline-flex items-center gap-3 text-primary hover:text-accent font-heading font-bold tracking-widest uppercase text-sm transition-colors group"
              >
                Read Full Story
                <svg className="w-5 h-5 transform group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES PREVIEW */}
      <section className="py-24 bg-secondary border-y border-border">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <h3 className="text-accent font-heading tracking-widest text-sm uppercase mb-4">Our Services</h3>
          <h2 className="font-heading font-bold text-3xl md:text-5xl text-primary mb-16 uppercase tracking-wide">
            How We Work
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Flash Tattoo */}
            <div className="glass-panel p-10 md:p-16 flex flex-col items-center border border-border hover:border-accent/50 transition-colors group rounded-sm">
              <div className="w-16 h-16 rounded-full bg-surface border border-border flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="font-heading font-bold text-2xl text-primary mb-4 uppercase tracking-wider">Flash Tattoos</h4>
              <p className="text-secondary mb-8 font-light leading-relaxed">
                Choose from our pre-designed authentic tribal flashes. Fixed price based on size. Direct booking and immediate deposit confirmation.
              </p>
              <Link href="/booking" className="mt-auto px-6 py-2 border border-accent text-accent hover:bg-accent hover:text-white transition-all uppercase tracking-widest text-xs font-bold rounded-sm">
                Book Flash
              </Link>
            </div>

            {/* Custom Session */}
            <div className="glass-panel p-10 md:p-16 flex flex-col items-center border border-border hover:border-accent/50 transition-colors group rounded-sm">
              <div className="w-16 h-16 rounded-full bg-surface border border-border flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <h4 className="font-heading font-bold text-2xl text-primary mb-4 uppercase tracking-wider">Custom Sessions</h4>
              <p className="text-secondary mb-8 font-light leading-relaxed">
                Work directly with Jerry to create a personalized design. We charge by session duration. Requires a WhatsApp consultation first.
              </p>
              <Link href="/services" className="mt-auto px-6 py-2 border border-accent text-accent hover:bg-accent hover:text-white transition-all uppercase tracking-widest text-xs font-bold rounded-sm">
                Consult Custom
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 bg-primary relative">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h3 className="text-accent font-heading tracking-widest text-sm uppercase mb-4">Real Experiences</h3>
            <h2 className="font-heading font-bold text-3xl md:text-5xl text-primary uppercase tracking-wide">
              Trusted by Globetrotters
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TestimonialCard 
              name="Lasse Ritto"
              country="Denmark"
              countryCode="DK"
              review="Outstanding work and genuine passion for the art. The hygiene standards are impeccable and the artists truly care about delivering exactly what you want."
              imageUrl="/assets/Gallery/handpoke-tattoo-bali-dotlinetattu-2-fS9DIWrZZIctrOTQ.webp"
              rating={5}
            />
            <TestimonialCard 
              name="Suzanne Klavins"
              country="Australia"
              countryCode="AU"
              review="A very professional and friendly team. The artwork turned out even better than I expected. The communication and aftercare guidance were detailed, so I felt safe."
              imageUrl="/assets/Gallery/handpoke-tattoo-bali-dotlinetattu-5-es5GVh83VOalxXP9.webp"
              rating={5}
            />
            <TestimonialCard 
              name="Jessica Knobloch"
              country="Germany"
              countryCode="DE"
              review="My husband and I got a joint tattoo at the end of our trip, which has now become our tradition. The great reviews convinced us — and they were right. From the first chat to the ink."
              imageUrl="/assets/Gallery/handpoke-tattoo-bali-dotlinetattu-21-yaHHOuqmCsS0hG1g.webp"
              rating={5}
            />
          </div>
        </div>
      </section>

    </div>
  );
}
