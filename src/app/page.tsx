import Image from "next/image";
import Link from "next/link";
import TestimonialCarousel from "@/components/ui/TestimonialCarousel";
import ZoomableImage from "@/components/ui/ZoomableImage";
import Marquee from "@/components/ui/Marquee";
import Accordion from "@/components/ui/Accordion";

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      
      {/* 1. CINEMATIC HERO SECTION (BOTTOM-LEFT ALIGNED) */}
      <section className="relative h-screen min-h-[700px] w-full flex flex-col justify-end items-start overflow-hidden pb-20">
        <div className="absolute inset-0 z-0 bg-primary">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            className="object-cover w-full h-full opacity-60 mix-blend-luminosity"
          >
            <source src="/assets/Gallery/Handpoke-tattoo-Bali-Dotlinetattu 2 Dotlinetattu Handpoke bali.MP4" type="video/mp4" />
          </video>
          {/* Gradients to ensure text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#070707] via-[#070707]/40 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#070707]/80 via-transparent to-transparent"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 md:px-8 w-full animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
          <div className="max-w-4xl text-left">
            <p className="text-accent font-sans tracking-[0.4em] text-xs uppercase mb-6 font-medium">
              Est. 2019 &bull; Bali, Indonesia
            </p>
            <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl text-primary uppercase tracking-wide mb-8 leading-[1.1]">
              Traditional <span className="text-accent italic lowercase">Handpoke</span> <br/> & Hand Tapping
            </h1>
            <p className="text-secondary font-sans text-lg md:text-xl max-w-2xl mb-10 font-light leading-relaxed">
              Experience the ancient mark. We preserve authentic handpoke and hand tapping tattoo techniques in Bali.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <Link 
                href="/booking" 
                className="inline-flex items-center justify-center px-10 py-4 bg-accent hover:bg-accent-hover text-white transition-all duration-300 font-sans font-semibold tracking-widest uppercase text-xs rounded-sm w-fit"
              >
                Book a Session
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE APPROACH (Inspired by User Screenshot) */}
      <section className="py-24 md:py-32 bg-gradient-earth relative">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl relative z-10">
          
          <div className="mb-20">
            <h3 className="text-accent font-sans tracking-widest text-[10px] md:text-xs uppercase mb-4 font-bold">
              THE APPROACH BEHIND DOTLINETATTU
            </h3>
            <h2 className="font-heading text-4xl md:text-5xl text-primary font-medium tracking-wide">
              Where the Rhythm Meets the Ancient Mark
            </h2>
          </div>

          <div className="flex flex-col gap-24">
            {/* Block 1: Handpoke */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="relative aspect-[4/3] w-full overflow-hidden border border-border">
                <Image 
                  src="/assets/Gallery/dotlinetattu_handpoke_tattoo_bali-klrlhsspxtuwbozl-2c4Ad1N23eO5zoWg (1).jpg" 
                  alt="Traditional Handpoke" 
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col">
                <h3 className="font-heading text-3xl md:text-4xl text-primary mb-6">Traditional Handpoke</h3>
                <p className="text-secondary font-sans font-light leading-relaxed text-sm md:text-base">
                  Discover handpoke in Bali, where geometric tribal fusion is shaped with intention. This ancient technique ensures unparalleled accuracy and a unique connection to the art at Dotlinetattu.
                </p>
              </div>
            </div>

            {/* Block 2: Music Collab */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="flex flex-col order-2 md:order-1">
                <h3 className="font-heading text-3xl md:text-4xl text-primary mb-6">Music Collaboration</h3>
                <p className="text-secondary font-sans font-light leading-relaxed text-sm md:text-base">
                  Exploring the connection between rhythm and creation, where sound influences process and flow. Each collaboration brings a unique rhythm vibe that shapes the experience beyond the visual. RA.VA.NA <span className="underline decoration-accent underline-offset-4">Multi-Instrumentalist</span> Musician.
                </p>
              </div>
              <div className="relative aspect-[4/3] w-full overflow-hidden border border-border order-1 md:order-2">
                <Image 
                  src="/assets/Gallery/multi-instrumentalist-musician-ravana-q1OwjWdzUgGueQiT.avif" 
                  alt="Music Collaboration" 
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>

        </div>
      </section>

      <Marquee />

      {/* 3. ARTIST SPOTLIGHT */}
      <section className="py-24 bg-gradient-earth-reverse relative border-y border-border">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-0 items-center">
            
            {/* Image Block */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-[3/4] w-full max-w-md mx-auto lg:mx-0 overflow-hidden border border-border">
                <Image 
                  src="/assets/Gallery/handpoke-tattoo-artist-bali-dotlinetattu-3-BAzWVxZMHkNtGS4w.avif" 
                  alt="Silver Jerry Handpoke Tattoo Artist" 
                  fill
                  className="object-cover"
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

      {/* 4. THE RITUAL (Simplified Flow) */}
      <section className="py-24 md:py-32 bg-gradient-earth relative">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl relative z-10">
          <div className="text-center mb-16">
            <h3 className="text-accent font-sans tracking-widest text-xs uppercase mb-4 font-semibold">The Ritual</h3>
            <h2 className="font-heading text-4xl md:text-5xl text-primary uppercase tracking-wide">
              How We Work
            </h2>
            <p className="text-secondary font-sans font-light mt-6 max-w-2xl mx-auto">
              We make the booking process transparent and simple. Choose your path below.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            
            {/* Custom Flow */}
            <div className="border border-border bg-surface p-8 md:p-10 rounded-sm">
              <h3 className="font-heading text-2xl text-primary mb-2 border-b border-border pb-4">
                Flow 1: Custom Tattoo (Per Session)
              </h3>
              <p className="text-secondary font-sans text-sm mb-8 font-light italic">For unique designs. We work per session, not per project.</p>
              
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <span className="text-accent font-heading font-bold text-xl">1.</span>
                  <div>
                    <h4 className="text-primary font-sans font-medium mb-1">Fill Form & 10% Initial Deposit</h4>
                    <p className="text-secondary text-sm font-light">Submit your placement and reference images. Pay a 10% deposit upfront to secure your offline consultation slot.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="text-accent font-heading font-bold text-xl">2.</span>
                  <div>
                    <h4 className="text-primary font-sans font-medium mb-1">Studio Consultation (3-4 Days Prior)</h4>
                    <p className="text-secondary text-sm font-light">Visit the studio to discuss your design thoroughly. Once locked in, pay the second 10% deposit to secure your tattoo date.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="text-accent font-heading font-bold text-xl">3.</span>
                  <div>
                    <h4 className="text-primary font-sans font-medium mb-1">Get Inked (Pay 80%)</h4>
                    <p className="text-secondary text-sm font-light">Come back for your session. Pay the remaining 80% after the tattoo is finished.</p>
                  </div>
                </li>
              </ul>
              
              <div className="mt-10">
                <Link href="/services" className="px-6 py-3 border border-accent text-accent hover:bg-accent hover:text-white transition-all font-sans tracking-widest uppercase text-xs font-semibold rounded-sm block text-center">
                  Start Custom Tattoo
                </Link>
              </div>
            </div>

            {/* Flash Flow */}
            <div className="border border-border bg-surface p-8 md:p-10 rounded-sm">
              <h3 className="font-heading text-2xl text-primary mb-2 border-b border-border pb-4">
                Flow 2: Flash Tattoo
              </h3>
              <p className="text-secondary font-sans text-sm mb-4 font-light italic">Available sizes: 5cm - 25cm (IDR 1M - 2.5M). 50% Deposit required.</p>
              <div className="bg-red-900/20 border border-red-500/30 p-3 mb-8 rounded-sm">
                <p className="text-red-400 text-xs font-sans">
                  <strong>Note:</strong> Hand tapping is raw and traditional. It is not suitable for overly complex or modern intricate shapes. If your chosen flash is 20-30cm, we may require a consultation first.
                </p>
              </div>
              
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <span className="text-accent font-heading font-bold text-xl">1.</span>
                  <div>
                    <h4 className="text-primary font-sans font-medium mb-1">Acknowledge Rules & Pick Flash</h4>
                    <p className="text-secondary text-sm font-light">Accept the hand tapping limitations pop-up, then choose your design (5cm - 25cm).</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="text-accent font-heading font-bold text-xl">2.</span>
                  <div>
                    <h4 className="text-primary font-sans font-medium mb-1">Fill Form, Pick Schedule & Pay 50%</h4>
                    <p className="text-secondary text-sm font-light">Fill out your details, pick an available time on the calendar, and pay the 50% deposit.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="text-accent font-heading font-bold text-xl">3.</span>
                  <div>
                    <h4 className="text-primary font-sans font-medium mb-1">Chat & Get Inked</h4>
                    <p className="text-secondary text-sm font-light">Connect via WhatsApp from the Thank You page. Show up at the studio and pay the remaining 50%.</p>
                  </div>
                </li>
              </ul>

              <div className="mt-10">
                <Link href="/booking" className="px-6 py-3 bg-accent hover:bg-accent-hover text-white transition-all font-sans tracking-widest uppercase text-xs font-semibold rounded-sm block text-center">
                  Book Flash Tattoo
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. SIGNATURE WORKS */}
      <section className="py-24 bg-gradient-earth-reverse relative border-y border-border">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 gap-6">
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

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
            <div className="flex flex-col group">
              <div className="relative aspect-[4/5] border border-border overflow-hidden mb-3 md:mb-6">
                <ZoomableImage src="/assets/Gallery/handpoke-tattoo-bali-dotlinetattu-10-r2el8hh0jzntmivg-YGG71UVQu8hnYG1f.jpg" alt="Flowing Balance" fill className="object-cover group-hover:scale-105 transition-transform duration-1000" />
              </div>
              <h4 className="font-heading text-lg md:text-2xl text-primary mb-1 md:mb-2">Flowing Balance</h4>
              <p className="text-secondary font-sans font-light text-xs md:text-sm">Traditional Handpoke &bull; Custom Design</p>
            </div>
            <div className="flex flex-col group md:mt-12">
              <div className="relative aspect-[4/5] border border-border overflow-hidden mb-3 md:mb-6">
                <ZoomableImage src="/assets/Gallery/handpoke-tattoo-bali-dotlinetattu-20-6B7LEVxri2IpWP3F.webp" alt="Rooted Resilience" fill className="object-cover group-hover:scale-105 transition-transform duration-1000" />
              </div>
              <h4 className="font-heading text-lg md:text-2xl text-primary mb-1 md:mb-2">Rooted Resilience</h4>
              <p className="text-secondary font-sans font-light text-xs md:text-sm">Tribal Mentawai &bull; Chest Piece</p>
            </div>
            <div className="flex flex-col group">
              <div className="relative aspect-[4/5] border border-border overflow-hidden mb-3 md:mb-6">
                <ZoomableImage src="/assets/Gallery/handpoke-tattoo-bali-dotlinetattu-17-JRkSSHut1wMPg4J1.webp" alt="Sacred Geometry" fill className="object-cover group-hover:scale-105 transition-transform duration-1000" />
              </div>
              <h4 className="font-heading text-lg md:text-2xl text-primary mb-1 md:mb-2">Sacred Geometry</h4>
              <p className="text-secondary font-sans font-light text-xs md:text-sm">Machine Fine Line &bull; Flash Art</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. TATTOO STYLES */}
      <section className="py-24 bg-primary relative">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
            <div className="md:w-1/2">
              <h3 className="text-accent font-sans tracking-widest text-xs uppercase mb-4 font-semibold">Techniques</h3>
              <h2 className="font-heading text-4xl md:text-5xl text-primary uppercase tracking-wide">
                Tattoo Styles
              </h2>
            </div>
            <div className="md:w-1/2">
              <p className="text-secondary font-sans font-light leading-relaxed text-sm md:text-base border-l border-border/50 pl-6">
                Your tattoos reflect your individuality. At Dotlinetattu, we offer a diverse array of styles, focusing primarily on ancient handpoke and hand tapping methods, complemented by precise modern machine techniques.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-12 items-start">
            <Accordion items={[
              { id: 'style-1', title: 'Traditional Handpoke', content: 'An ancient stick-and-poke method using a needle attached to a bamboo stick. This technique creates a distinct dotted texture, heals faster, and connects you to the roots of tattoo culture.' },
              { id: 'style-2', title: 'Machine Fine Line', content: 'For delicate, intricate, and micro-detailed designs. Using modern single-needle machines, we craft elegant script, micro-realism, and botanical illustrations with unmatched precision.' },
              { id: 'style-3', title: 'Mentawai Tribal', content: 'Authentic patterns from the Mentawai tribe. These ancient motifs represent nature, life balance, and spiritual protection, traditionally done via hand tapping but adaptable to your preferred method.' }
            ]} />
            <Accordion defaultOpen={false} items={[
              { id: 'style-4', title: 'Hand Tapping', content: 'A raw, rhythmic technique using two sticks—one holding the needle and the other tapping it. Best suited for bold tribal and geometric patterns. A deeply spiritual and authentic experience.' },
              { id: 'style-5', title: 'Mandala & Geometric', content: 'Symmetrical, spiritually grounded designs requiring meticulous precision. Whether done via handpoke or machine, these pieces symbolize the universe, balance, and inner peace.' },
              { id: 'style-6', title: 'Custom Flash Art', content: 'Pre-designed, exclusive flash pieces ready to be inked. Perfect for spontaneous sessions, these designs are created by our resident artists and are not repeated once claimed.' }
            ]} />
          </div>
        </div>
      </section>

      {/* 4. REVIEWS & TESTIMONIALS */}
      <section className="py-24 bg-gradient-earth relative">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl relative z-10">
          <div className="text-center mb-16">
            <h3 className="text-accent font-sans tracking-widest text-xs uppercase mb-4 font-semibold">Real Experiences</h3>
            <h2 className="font-heading text-4xl md:text-5xl text-primary uppercase tracking-wide mb-6">
              Verified Google Reviews
            </h2>
            <div className="w-16 h-[1px] bg-accent mx-auto"></div>
          </div>

          <TestimonialCarousel 
            testimonials={[
              {
                name: "Lasse Ritto",
                country: "Google Review",
                countryCode: "US",
                review: "Outstanding work and genuine passion for the art. The hygiene standards are impeccable and the artists truly care about delivering exactly what you want.",
                imageUrl: "/assets/Gallery/handpoke-tattoo-bali-dotlinetattu-17-JRkSSHut1wMPg4J1.webp",
                rating: 5
              },
              {
                name: "Suzanne Klavins",
                country: "Google Review",
                countryCode: "AU",
                review: "A very professional and friendly team. The artwork turned out even better than I expected. The communication and aftercare guidance were detailed, so I felt safe.",
                imageUrl: "/assets/Gallery/handpoke-tattoo-bali-dotlinetattu-10-r2el8hh0jzntmivg-YGG71UVQu8hnYG1f.jpg",
                rating: 5
              },
              {
                name: "Jessica Knobloch",
                country: "Google Review",
                countryCode: "DE",
                review: "My husband and I got a joint tattoo at the end of our trip, which has now become our tradition. The great reviews convinced us — and they were right.",
                imageUrl: "/assets/Gallery/handpoke-tattoo-bali-dotlinetattu-20-6B7LEVxri2IpWP3F.webp",
                rating: 5
              },
              {
                name: "Marco Silva",
                country: "Google Review",
                countryCode: "BR",
                review: "Jerry is an amazing artist. The dotwork is so precise and healed perfectly. I barely felt any pain compared to a machine tattoo. Highly recommend!",
                imageUrl: "/assets/Gallery/handpoke-tattoo-bali-dotlinetattu-21-yaHHOuqmCsS0hG1g.webp",
                rating: 5
              },
              {
                name: "Elena Rostova",
                country: "Google Review",
                countryCode: "RU",
                review: "I was super nervous as this was my first tattoo, but the studio vibe is so calming. Jerry explained everything and made sure I was comfortable the whole time.",
                imageUrl: "/assets/Gallery/handpoke-tattoo-bali-dotlinetattu-12-erkx86rwibxu98jy-ycU42f64kqU5yt5P.jpg",
                rating: 5
              },
              {
                name: "Thomas Wright",
                country: "Google Review",
                countryCode: "UK",
                review: "Best handpoke studio in Bali hands down. The attention to detail in the geometric patterns is mind-blowing. Will definitely be back next year.",
                imageUrl: "/assets/Gallery/handpoke-tattoo-bali-dotlinetattu-11-boq69p6nyskdz2kd-XUPXBaXpD0GuXd67.jpg",
                rating: 5
              },
              {
                name: "Claire Dubois",
                country: "Google Review",
                countryCode: "FR",
                review: "Such a beautiful experience! The lines are incredibly fine and delicate. It healed in less than a week with zero complications.",
                imageUrl: "/assets/Gallery/handpoke-tattoo-bali-dotlinetattu-22-BUN8FOAbCUzf2GaG.webp",
                rating: 5
              },
              {
                name: "David Chen",
                country: "Google Review",
                countryCode: "SG",
                review: "Professional setup, great music, and cold AC! But more importantly, the art is world-class. Very easy to book and communicate via WhatsApp.",
                imageUrl: "/assets/Gallery/handpoke-tattoo-bali-dotlinetattu-7-t03qnyd1qr9kdoys-z58WskwYIfi8uzmO.jpg",
                rating: 5
              },
              {
                name: "Sarah Jenkins",
                country: "Google Review",
                countryCode: "US",
                review: "I brought in a custom design and Jerry modified it perfectly to suit the handpoke style. It looks so organic and flows beautifully on my arm.",
                imageUrl: "/assets/Gallery/handpoke-tattoo-bali-dotlinetattu-5-es5GVh83VOalxXP9.webp",
                rating: 5
              },
              {
                name: "Liam O'Connor",
                country: "Google Review",
                countryCode: "IE",
                review: "A must-visit if you want an authentic, unhurried tattoo experience in Bali. The pricing is transparent and the quality is absolutely top-tier.",
                imageUrl: "/assets/Gallery/handpoke_tattoo_bali_dotlinetattu-2-iT9eQaZa9y0LQ6RN.webp",
                rating: 5
              }
            ]} 
          />
        </div>
      </section>

    </div>
  );
}
