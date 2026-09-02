import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-secondary border-t border-border mt-auto pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <h2 className="font-heading font-bold text-2xl tracking-wider text-primary mb-4">
              DOTLINETATTU
            </h2>
            <p className="text-secondary text-sm leading-relaxed mb-6">
              Authentic Handpoke & Tribal Tattoo Experience in Bali. Specializing in traditional Kalimantan, Mentawai, and modern custom designs.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-semibold text-primary uppercase tracking-widest mb-4">Explore</h3>
            <ul className="flex flex-col gap-3">
              <li><Link href="/about" className="text-secondary hover:text-accent transition-colors text-sm">About Jerry</Link></li>
              <li><Link href="/services" className="text-secondary hover:text-accent transition-colors text-sm">Tattoo Services</Link></li>
              <li><Link href="/gallery" className="text-secondary hover:text-accent transition-colors text-sm">Gallery</Link></li>
              <li><Link href="/faq" className="text-secondary hover:text-accent transition-colors text-sm">FAQ & Info</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading font-semibold text-primary uppercase tracking-widest mb-4">Contact</h3>
            <ul className="flex flex-col gap-3 text-sm text-secondary">
              <li className="flex items-start gap-2">
                <span className="text-accent">📍</span>
                <span>Bali, Indonesia (By Appointment Only)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-accent">📱</span>
                <a href="https://wa.me/6282339760624" className="hover:text-accent transition-colors">+62 823-3976-0624</a>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-accent">✉️</span>
                <a href="mailto:info@dotlinetattu.com" className="hover:text-accent transition-colors">info@dotlinetattu.com</a>
              </li>
            </ul>
          </div>

          {/* CTA */}
          <div>
            <h3 className="font-heading font-semibold text-primary uppercase tracking-widest mb-4">Ready for Ink?</h3>
            <p className="text-secondary text-sm mb-4">Book your session or consult a custom design today.</p>
            <Link 
              href="/booking"
              className="inline-block px-6 py-2 border border-accent text-accent hover:bg-accent hover:text-white transition-all duration-300 text-sm font-medium tracking-widest uppercase rounded-sm"
            >
              Book Now
            </Link>
          </div>

        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-secondary text-xs">
            © {new Date().getFullYear()} Dotlinetattu. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-secondary hover:text-primary transition-colors text-sm">Instagram</a>
            <a href="#" className="text-secondary hover:text-primary transition-colors text-sm">Google Maps</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
