import Image from "next/image";
import Link from "next/link";
import TestimonialCard from "@/components/ui/TestimonialCard";
import Marquee from "@/components/ui/Marquee";

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      
      {/* 1. CINEMATIC HERO SECTION */}
      <section className="relative h-screen min-h-[700px] w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-primary">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            className="object-cover w-full h-full opacity-50 mix-blend-luminosity"
          >
            <source src="/assets/Gallery/Handpoke-tattoo-Bali-Dotlinetattu 2 Dotlinetattu Handpoke bali.MP4" type="video/mp4" />
          </video>
          {/* Organic vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(17,15,14,0.9)_100%)]"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#110f0e]/60 via-transparent to-[#110f0e]"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 mt-20">
          <p className="text-accent font-sans tracking-[0.4em] text-xs uppercase mb-6 font-medium">
            Est. 2019 &bull; Bali, Indonesia
          </p>
          <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl text-primary uppercase tracking-wide mb-8 max-w-5xl leading-[1.1] glow-text">
            Authentic <span className="text-accent italic">Handpoke</span> <br/> & Tribal Tattoo
          </h1>
          <p className="text-secondary font-sans text-lg md:text-xl max-w-2xl mb-12 font-light leading-relaxed">
            Discover the inspiration, craftsmanship, and creative journey behind every handcrafted tattoo.
          </p>
          <div className="flex flex-col sm:flex-row gap-6">
            <Link 
              href="/booking" 
              className="px-10 py-4 bg-accent hover:bg-accent-hover text-white transition-all duration-300 font-sans font-semibold tracking-widest uppercase text-xs rounded-sm shadow-[0_0_25px_rgba(184,92,56,0.3)] hover:shadow-[0_0_35px_rgba(184,92,56,0.5)]"
            >
              Book a Session
            </Link>
          </div>
        </div>
      </section>

      {/* 2. THE MANTRA (Typography Break) */}
      <section className="py-24 md:py-32 bg-primary">
        <div className="container mx-auto px-4 md:px-8 text-center max-w-5xl">
          <h2 className="font-heading text-3xl md:text-5xl lg:text-6xl text-primary leading-tight font-medium">
            "We believe a tattoo is more than ink. <br className="hidden md:block" /> 
            <span className="text-accent italic">It is an ancestral rhythm, permanently etched.</span>"
          </h2>
        </div>
      </section>

      <Marquee />

      {/* 3. ARTIST SPOTLIGHT (Asymmetric Layout) */}
      <section className="py-24 bg-secondary relative border-y border-border">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-0 items-center">
            
            {/* Image Block */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-[3/4] w-full max-w-md mx-auto lg:mx-0 overflow-hidden border border-border">
                <Image 
                  src="/assets/Gallery/dotlinetattu_handpoke_tattoo_bali-klrlhsspxtuwbozl-2c4Ad1N23eO5zoWg (1).jpg" 
                  alt="Silver Jerry Handpoke Tattoo Artist" 
                  fill
                  className="object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                />
              </div>
              {/* Decorative Offset Image */}
              <div className="absolute -bottom-12 -right-6 md:-right-12 w-48 aspect-square border border-border hidden md:block overflow-hidden">
                <Image 
                  src="/assets/Gallery/handpoke-tattoo-artist-bali-dotlinetattu-3-BAzWVxZMHkNtGS4w.avif" 
                  alt="Tattoo Process" 
                  fill
                  className="object-cover grayscale opacity-80"
                />
              </div>
            </div>
            
            {/* Text Block */}
            <div className="lg:col-span-6 lg:col-start-7 flex flex-col pt-8 lg:pt-0">
              <h3 className="text-accent font-sans tracking-widest text-xs uppercase mb-4 font-semibold">The Artist</h3>
              <h2 className="font-heading text-4xl md:text-6xl text-primary mb-8 uppercase tracking-wide">
                Silver Jerry
              </h2>
              <div className="space-y-6 text-secondary font-sans leading-relaxed font-light mb-10 text-base md:text-lg">
                <p>
                  My journey began in 2010 out of a deep passion for art and culture. By 2015, I had fully immersed myself in mastering the ancient technique of handpoke tattooing. 
                </p>
                <p>
                  Dotlinetattu was born in 2019 as a physical sanctuary in Bali. It was created with a rebellious spirit against the modern commercialization of tattoo studios. We want to restore the "Real Bali"—a place where art, connection, and spirituality hold more value than quick profits.
                </p>
              </div>
              
              {/* Signature */}
              <div className="mb-10">
                <Image 
                  src="/assets/signature.png" 
                  alt="Jerry Signature" 
                  width={200} 
                  height={80} 
                  className="opacity-70 invert"
                />
              </div>

              <Link 
                href="/about" 
                className="self-start inline-flex items-center gap-3 text-primary hover:text-accent font-sans font-semibold tracking-widest uppercase text-xs transition-colors group pb-1 border-b border-accent"
              >
                Read Full Story
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SIGNATURE WORKS (Replaces standard Gallery teaser with narrative) */}
      <section className="py-24 bg-surface border-b border-border">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <h3 className="text-accent font-sans tracking-widest text-xs uppercase mb-4 font-semibold">Our Craft</h3>
              <h2 className="font-heading text-4xl md:text-5xl text-primary uppercase tracking-wide">
                Signature Works
              </h2>
            </div>
            <Link 
              href="/gallery" 
              className="inline-flex items-center gap-3 text-primary hover:text-accent font-sans font-semibold tracking-widest uppercase text-xs transition-colors pb-1 border-b border-border hover:border-accent"
            >
              View Full Gallery
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col group cursor-pointer">
              <div className="relative aspect-[4/5] border border-border overflow-hidden mb-6">
                <Image src="/assets/Gallery/handpoke-tattoo-bali-dotlinetattu-10-r2el8hh0jzntmivg-YGG71UVQu8hnYG1f.jpg" alt="Flowing Balance" fill className="object-cover group-hover:scale-105 transition-transform duration-1000 grayscale hover:grayscale-0" />
              </div>
              <h4 className="font-heading text-2xl text-primary mb-2">Flowing Balance</h4>
              <p className="text-secondary font-sans font-light text-sm">Traditional Handpoke &bull; Custom Design</p>
            </div>
            <div className="flex flex-col group cursor-pointer md:mt-12">
              <div className="relative aspect-[4/5] border border-border overflow-hidden mb-6">
                <Image src="/assets/Gallery/dotlinetattu_handpoke_tattoo_bali-klrlhsspxtuwbozl-2c4Ad1N23eO5zoWg (1).jpg" alt="Rooted Resilience" fill className="object-cover group-hover:scale-105 transition-transform duration-1000 grayscale hover:grayscale-0" />
              </div>
              <h4 className="font-heading text-2xl text-primary mb-2">Rooted Resilience</h4>
              <p className="text-secondary font-sans font-light text-sm">Tribal Mentawai &bull; Chest Piece</p>
            </div>
            <div className="flex flex-col group cursor-pointer">
              <div className="relative aspect-[4/5] border border-border overflow-hidden mb-6">
                <Image src="/assets/Gallery/handpoke-tattoo-bali-dotlinetattu-17-JRkSSHut1wMPg4J1.webp" alt="Sacred Geometry" fill className="object-cover group-hover:scale-105 transition-transform duration-1000 grayscale hover:grayscale-0" />
              </div>
              <h4 className="font-heading text-2xl text-primary mb-2">Sacred Geometry</h4>
              <p className="text-secondary font-sans font-light text-sm">Machine Fine Line &bull; Flash Art</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. THE RITUAL (Process) */}
      <section className="py-24 md:py-32 bg-primary">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-20">
            <h3 className="text-accent font-sans tracking-widest text-xs uppercase mb-4 font-semibold">The Ritual</h3>
            <h2 className="font-heading text-4xl md:text-5xl text-primary uppercase tracking-wide">
              How We Work
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-[1px] bg-border -translate-y-1/2 z-0"></div>

            {[
              { num: "01", title: "Consultation", desc: "We discuss your vision, sizing, and placement via WhatsApp to ensure a perfect fit." },
              { num: "02", title: "The Design", desc: "Custom pieces are meticulously sketched. Flash tattoos are selected from our exclusive tribal book." },
              { num: "03", title: "The Poke", desc: "A meditative, machine-free experience using traditional techniques and modern hygiene standards." }
            ].map((step, idx) => (
              <div key={idx} className="relative z-10 flex flex-col items-center text-center bg-primary p-6">
                <div className="w-16 h-16 rounded-full border border-accent bg-surface flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(184,92,56,0.2)]">
                  <span className="font-heading text-xl text-accent font-bold">{step.num}</span>
                </div>
                <h4 className="font-heading text-2xl text-primary mb-4">{step.title}</h4>
                <p className="text-secondary font-sans font-light text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. THE STUDIO VIBE (New Aesthetic Banner) */}
      <section className="relative py-32 bg-secondary border-y border-border overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/assets/Gallery/handpoke-tattoo-bali-dotlinetattu-5-es5GVh83VOalxXP9.webp" 
            alt="Studio Vibe" 
            fill
            className="object-cover opacity-20 grayscale"
          />
        </div>
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl md:text-5xl text-primary uppercase tracking-wide mb-8">
            An Intimate Sanctuary
          </h2>
          <p className="text-secondary font-sans font-light text-lg max-w-2xl mx-auto leading-relaxed mb-10">
            Located in the heart of Bali, our studio is designed for a meditative tattoo experience. We avoid large crowds, ensuring the artist concentrates fully on your piece.
          </p>
          <Link 
            href="/faq" 
            className="inline-flex items-center gap-3 text-accent hover:text-accent-hover font-sans font-semibold tracking-widest uppercase text-xs transition-colors group pb-1 border-b border-accent"
          >
            Read Our Studio Policies
          </Link>
        </div>
      </section>

      {/* 7. SERVICES PREVIEW */}
      <section className="py-24 md:py-32 bg-primary">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            
            {/* Flash Tattoo */}
            <div className="glass-panel p-10 md:p-14 flex flex-col items-center text-center group">
              <h4 className="font-heading text-3xl text-primary mb-4 uppercase tracking-wide">Flash Tattoos</h4>
              <div className="w-12 h-[1px] bg-accent mb-6"></div>
              <p className="text-secondary font-sans font-light leading-relaxed mb-10 flex-grow">
                Choose from Jerry's exclusive book of pre-designed authentic tribal flashes. Fixed price based on size. Direct booking and immediate deposit confirmation.
              </p>
              <Link href="/booking" className="px-8 py-3 border border-accent text-accent hover:bg-accent hover:text-white transition-all font-sans tracking-widest uppercase text-xs font-semibold rounded-sm">
                Book Flash
              </Link>
            </div>

            {/* Custom Session */}
            <div className="glass-panel p-10 md:p-14 flex flex-col items-center text-center group">
              <h4 className="font-heading text-3xl text-primary mb-4 uppercase tracking-wide">Custom Sessions</h4>
              <div className="w-12 h-[1px] bg-accent mb-6"></div>
              <p className="text-secondary font-sans font-light leading-relaxed mb-10 flex-grow">
                Work directly with Jerry to create a personalized design. We charge by session duration. Requires a WhatsApp consultation first.
              </p>
              <Link href="/services" className="px-8 py-3 border border-accent text-accent hover:bg-accent hover:text-white transition-all font-sans tracking-widest uppercase text-xs font-semibold rounded-sm">
                Consult Custom
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* 8. TESTIMONIALS */}
      <section className="py-24 bg-secondary border-t border-border">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h3 className="text-accent font-sans tracking-widest text-xs uppercase mb-4 font-semibold">Real Experiences</h3>
            <h2 className="font-heading text-4xl md:text-5xl text-primary uppercase tracking-wide mb-6">
              Trusted by Globetrotters
            </h2>
            <div className="w-16 h-[1px] bg-accent mx-auto"></div>
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
              review="My husband and I got a joint tattoo at the end of our trip, which has now become our tradition. The great reviews convinced us — and they were right."
              imageUrl="/assets/Gallery/handpoke-tattoo-bali-dotlinetattu-21-yaHHOuqmCsS0hG1g.webp"
              rating={5}
            />
          </div>
        </div>
      </section>

    </div>
  );
}
