"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getBookedSlots, createBooking } from "@/app/actions/bookingActions";
import ZoomableImage from "@/components/ui/ZoomableImage";

type FlowType = "flash" | "custom";
type Step = "warning" | "form" | "calendar" | "checkout" | "success";

const STORAGE_KEY = "dotlinetattu_booking_draft";

interface BookingEngineProps {
  initialType: FlowType;
}

export default function BookingEngine({ initialType }: BookingEngineProps) {
  const now = new Date();

  // All state starts with defaults — localStorage will hydrate them after mount
  const [hydrated, setHydrated] = useState(false);
  const [type, setType] = useState<FlowType>(initialType);
  const [step, setStep] = useState<Step>(initialType === "flash" ? "warning" : "form");
  const [isLoading, setIsLoading] = useState(false);
  const [bookedSlots, setBookedSlots] = useState<any[]>([]);
  const [bookingId, setBookingId] = useState<string>("");

  const [calMonth, setCalMonth] = useState<number>(now.getMonth());
  const [calYear, setCalYear] = useState<number>(now.getFullYear());

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
    placementText: "",
    placementImage: null as File | null,
    size: "medium",
    referenceImage: null as File | null,
  });

  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");

  // HYDRATE from localStorage after mount (runs only in browser, after SSR)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const draft = JSON.parse(raw);
        if (draft.type) setType(draft.type);
        if (draft.step) setStep(draft.step);
        if (draft.calMonth != null) setCalMonth(draft.calMonth);
        if (draft.calYear != null) setCalYear(draft.calYear);
        if (draft.selectedDate) setSelectedDate(draft.selectedDate);
        if (draft.selectedTime) setSelectedTime(draft.selectedTime);
        if (draft.form) {
          setFormData(prev => ({
            ...prev,
            name: draft.form.name ?? "",
            email: draft.form.email ?? "",
            whatsapp: draft.form.whatsapp ?? "",
            placementText: draft.form.placementText ?? "",
            size: draft.form.size ?? "medium",
          }));
        }
      }
    } catch {}
    setHydrated(true);
  }, []); // runs once on mount

  // PERSIST to localStorage on every state change (after hydration)
  useEffect(() => {
    if (!hydrated) return; // don't overwrite with empty values before hydration
    if (step === "success") {
      localStorage.removeItem(STORAGE_KEY);
      return;
    }
    const draft = {
      type, step, calMonth, calYear, selectedDate, selectedTime,
      form: {
        name: formData.name,
        email: formData.email,
        whatsapp: formData.whatsapp,
        placementText: formData.placementText,
        size: formData.size,
      },
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  }, [hydrated, type, step, calMonth, calYear, selectedDate, selectedTime, formData]);

  // Fetch booked slots
  useEffect(() => {
    async function fetchSlots() {
      const slots = await getBookedSlots();
      setBookedSlots(slots);
    }
    fetchSlots();
  }, []);

  // Sync default size when type changes
  useEffect(() => {
    if (type === "custom" && ["small", "medium", "large"].includes(formData.size)) {
      setFormData(prev => ({ ...prev, size: "passing" }));
    } else if (type === "flash" && !["small", "medium", "large"].includes(formData.size)) {
      setFormData(prev => ({ ...prev, size: "medium" }));
    }
  }, [type]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: "placementImage" | "referenceImage") => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, [fieldName]: e.target.files[0] });
    }
  };

  const isEmailFormatValid = formData.email === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
  const whatsappDigits = formData.whatsapp.replace(/\D/g, '');
  const isWhatsappFormatValid = formData.whatsapp === "" || (whatsappDigits.length >= 8 && whatsappDigits.length <= 15);

  const isFormValid = 
    formData.name.trim().length >= 2 && 
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && 
    whatsappDigits.length >= 8 && whatsappDigits.length <= 15 &&
    formData.placementText.trim().length >= 2 && 
    formData.placementImage !== null && 
    formData.referenceImage !== null;

  // Pricing Logic
  const calculatePrice = () => {
    if (type === "flash") {
      if (formData.size === "small") return { total: 1000000, deposit: 500000, depositPercent: "50%" };
      if (formData.size === "medium") return { total: 1750000, deposit: 875000, depositPercent: "50%" };
      if (formData.size === "large") return { total: 2500000, deposit: 1250000, depositPercent: "50%" };
    } else {
      // Custom session pricing
      if (formData.size === "passing") return { total: 1500000, deposit: 150000, depositPercent: "10%" };
      if (formData.size === "medium_session") return { total: 5500000, deposit: 550000, depositPercent: "10%" };
      if (formData.size === "1day") return { total: 8500000, deposit: 850000, depositPercent: "10%" };
      if (formData.size === "2days") return { total: 17000000, deposit: 1700000, depositPercent: "10%" };
    }
    return { total: 0, deposit: 0, depositPercent: "0%" };
  };

  const priceInfo = calculatePrice();

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      const result = await createBooking({
        name: formData.name,
        email: formData.email,
        whatsapp: formData.whatsapp,
        date: selectedDate,
        time: selectedTime,
        type: type,
        totalPrice: priceInfo.total,
        deposit: priceInfo.deposit
      });
      setBookingId(result.id);
      setStep("success");
      localStorage.removeItem(STORAGE_KEY); // clear draft on success
    } catch (err) {
      alert("Failed to create booking. Please check database permissions (RLS).");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-surface/50 border border-border rounded-lg overflow-hidden relative">
      
      {/* Type Selector (Only if not in success state) */}
      {step !== "success" && (
        <div className="flex border-b border-border">
          <button
            onClick={() => { setType("flash"); setStep("warning"); }}
            className={`flex-1 py-4 text-sm font-sans tracking-widest uppercase font-semibold transition-colors ${type === "flash" ? "bg-accent text-white" : "text-secondary hover:text-primary"}`}
          >
            Flash Tattoo
          </button>
          <button
            onClick={() => { setType("custom"); setStep("form"); }}
            className={`flex-1 py-4 text-sm font-sans tracking-widest uppercase font-semibold transition-colors ${type === "custom" ? "bg-accent text-white" : "text-secondary hover:text-primary"}`}
          >
            Custom Tattoo
          </button>
        </div>
      )}

      <div className="p-6 md:p-10">
        {/* STEP 1: WARNING (Flash Only) */}
        {step === "warning" && type === "flash" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 flex flex-col items-center text-center">

            {/* Minimal divider line instead of neon icon */}
            <div className="w-12 h-px bg-accent/60 mb-8" />

            <h2 className="font-heading text-3xl text-primary mb-4">Before You Continue</h2>
            <p className="text-secondary font-sans leading-relaxed mb-10 max-w-xl">
              Hand tapping is a raw, ancient technique — rooted in tradition, not precision machinery. 
              It carries its own character. Please read carefully before proceeding.
            </p>

            {/* Comparison — earthy, no neon */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px w-full max-w-4xl mb-10 text-left border border-border/50 bg-border/30">
              
              {/* CAN DO — with real photos */}
              <div className="bg-surface p-7">
                <p className="font-sans text-xs tracking-[0.2em] uppercase text-accent mb-5">Works well for</p>
                
                {/* Photo grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 mb-6">
                  {[
                    "/assets/Gallery/handtapping-tattoo-bali-dotlinetattu-FuI3cCjPQQpIbAk2.webp",
                    "/assets/Gallery/handpoke-tattoo-bali-dotlinetattu-22-BUN8FOAbCUzf2GaG.webp",
                    "/assets/Gallery/handpoke-tattoo-bali-dotlinetattu-23-foY3o9o4aQcNgnE3.webp",
                    "/assets/Gallery/dotlinetattu_handpoke_bali-2-Rkt9nssE7W3zqbvl.webp",
                    "/assets/Gallery/handpoke-tattoo-bali-dotlinetattu-21-yaHHOuqmCsS0hG1g.webp",
                    "/assets/Gallery/handpoke_tattoo_bali_dotlinetattu-2-iT9eQaZa9y0LQ6RN.webp",
                  ].map((src, i) => (
                    <div key={i} className="aspect-square overflow-hidden relative group">
                      <ZoomableImage
                        src={src}
                        alt="Hand tapping tattoo example"
                        fill
                        sizes="(max-width: 768px) 33vw, 15vw"
                        className="object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
                      />
                    </div>
                  ))}
                </div>

                <ul className="space-y-3 text-secondary font-sans text-sm leading-relaxed">
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 w-1 h-1 rounded-full bg-accent/70 shrink-0 block" />
                    Tribal & traditional patterns
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 w-1 h-1 rounded-full bg-accent/70 shrink-0 block" />
                    Bold, raw, organic linework
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 w-1 h-1 rounded-full bg-accent/70 shrink-0 block" />
                    Simple geometric shapes
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 w-1 h-1 rounded-full bg-accent/70 shrink-0 block" />
                    Ancient symbols and motifs
                  </li>
                </ul>
              </div>
              
              {/* CANNOT DO — no photos, illustrated with texture */}
              <div className="bg-[#0d0d0d] p-7 border-l border-border/40">
                <p className="font-sans text-xs tracking-[0.2em] uppercase text-[#7a6a5a] mb-5">Not suitable for</p>
                <div className="bg-accent/10 border border-accent/20 p-5 mb-6 rounded-sm relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent/50"></div>
                  <p className="text-accent/90 font-sans text-sm leading-relaxed italic relative z-10">
                    "Modern design styles cannot be achieved with traditional hand tapping."
                  </p>
                </div>

                <ul className="space-y-3 text-secondary/60 font-sans text-sm leading-relaxed">
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#7a6a5a] shrink-0 block" />
                    Hyper-realistic portraits
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#7a6a5a] shrink-0 block" />
                    Fine-line or micro-realism
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#7a6a5a] shrink-0 block" />
                    Perfectly straight machine-like lines
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#7a6a5a] shrink-0 block" />
                    Overly intricate or crowded details
                  </li>
                </ul>
              </div>
            </div>

            <p className="text-secondary/40 font-sans text-xs leading-relaxed mb-8 max-w-lg italic">
              Designs above 20cm or with high complexity may require an offline consultation first.
            </p>
            <button 
              onClick={() => setStep("form")}
              className="px-10 py-4 bg-accent hover:bg-accent-hover text-white font-sans tracking-widest uppercase text-xs font-bold transition-all"
            >
              I Understand — Continue
            </button>
          </div>
        )}

        {/* STEP 2: FORM */}
        {step === "form" && (
          <div className="animate-in fade-in slide-in-from-bottom-4">
            <h2 className="font-heading text-3xl text-primary mb-6">
              {type === "flash" ? "Your Details" : "Tattoo Idea & Placement"}
            </h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-secondary font-sans text-xs tracking-widest uppercase mb-2">Full Name <span className="text-red-500">*</span></label>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} className={`w-full bg-primary border px-4 py-3 text-primary focus:border-accent outline-none font-sans ${formData.name !== "" && formData.name.trim().length < 2 ? 'border-red-500/50' : 'border-border'}`} placeholder="John Doe" />
                  {formData.name !== "" && formData.name.trim().length < 2 && <p className="text-red-400/80 text-xs mt-1">Name is too short.</p>}
                </div>
                <div>
                  <label className="block text-secondary font-sans text-xs tracking-widest uppercase mb-2">WhatsApp Number <span className="text-red-500">*</span></label>
                  <input type="tel" name="whatsapp" value={formData.whatsapp} onChange={handleInputChange} className={`w-full bg-primary border px-4 py-3 text-primary focus:border-accent outline-none font-sans ${!isWhatsappFormatValid ? 'border-red-500/50' : 'border-border'}`} placeholder="+1 234 567 890" />
                  {!isWhatsappFormatValid && <p className="text-red-400/80 text-xs mt-1">Enter a valid phone number (min. 8 digits).</p>}
                </div>
              </div>
              
              <div>
                <label className="block text-secondary font-sans text-xs tracking-widest uppercase mb-2">Email Address <span className="text-red-500">*</span></label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} className={`w-full bg-primary border px-4 py-3 text-primary focus:border-accent outline-none font-sans ${!isEmailFormatValid ? 'border-red-500/50' : 'border-border'}`} placeholder="john@example.com" />
                {!isEmailFormatValid && <p className="text-red-400/80 text-xs mt-1">Enter a valid email address.</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-secondary font-sans text-xs tracking-widest uppercase mb-2">Body Placement Area <span className="text-red-500">*</span></label>
                  <input type="text" name="placementText" value={formData.placementText} onChange={handleInputChange} className={`w-full bg-primary border px-4 py-3 text-primary focus:border-accent outline-none font-sans ${formData.placementText !== "" && formData.placementText.trim().length < 2 ? 'border-red-500/50' : 'border-border'}`} placeholder="e.g. Left Forearm" />
                  {formData.placementText !== "" && formData.placementText.trim().length < 2 && <p className="text-red-400/80 text-xs mt-1">Please specify the placement area.</p>}
                </div>
                <div>
                  <label className="block text-secondary font-sans text-xs tracking-widest uppercase mb-2">
                    {type === "flash" ? "Approximate Size" : "Session Duration"} <span className="text-red-500">*</span>
                  </label>
                  
                  {type === "flash" ? (
                    <select name="size" value={formData.size} onChange={handleInputChange} className="w-full bg-primary border border-border px-4 py-3 text-primary focus:border-accent outline-none font-sans">
                      <option value="small">
                        Small (5cm - 10cm) • {String("IDR 1.000.000").split('').map(c => c + '\u0336').join('')} IDR 500.000 (DP)
                      </option>
                      <option value="medium">
                        Medium (11cm - 15cm) • {String("IDR 1.750.000").split('').map(c => c + '\u0336').join('')} IDR 875.000 (DP)
                      </option>
                      <option value="large">
                        Large (16cm - 25cm+) • {String("IDR 2.500.000").split('').map(c => c + '\u0336').join('')} IDR 1.250.000 (DP)
                      </option>
                    </select>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {[
                        { id: "passing", title: "Passing Session", desc: "1-2 hours • Small, quick tattoos under 10cm.", price: "IDR 1.500.000", tag: "Same-day consultation" },
                        { id: "medium_session", title: "Medium Session", desc: "6 hours • Detailed work or multiple small pieces.", price: "IDR 5.500.000", tag: "Prior consultation required" },
                        { id: "1day", title: "1 Day Session", desc: "8 hours • Extensive custom work, half sleeves.", price: "IDR 8.500.000", tag: "Prior consultation required" },
                        { id: "2days", title: "2 Days Session", desc: "2 × 8 hours • Full sleeves, large scale tribal.", price: "IDR 17.000.000", tag: "Prior consultation required" },
                      ].map(session => (
                        <label 
                          key={session.id} 
                          className={`flex items-start gap-4 p-4 border rounded-sm cursor-pointer transition-colors ${formData.size === session.id ? 'border-accent bg-accent/5' : 'border-border bg-primary/30 hover:border-accent/50'}`}
                          onClick={() => setFormData({ ...formData, size: session.id })}
                        >
                          <div className={`mt-1 w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${formData.size === session.id ? 'border-accent' : 'border-secondary/50'}`}>
                            {formData.size === session.id && <div className="w-2 h-2 bg-accent rounded-full" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start gap-4 mb-1">
                              <span className="font-heading text-primary font-bold">{session.title}</span>
                              <span className="font-sans text-accent text-xs font-bold whitespace-nowrap">{session.price}</span>
                            </div>
                            <span className="text-secondary/70 font-sans text-xs">{session.desc}</span>
                            <span className={`block mt-1.5 font-sans text-[10px] tracking-wider uppercase ${session.id === 'passing' ? 'text-green-400/80' : 'text-amber-400/80'}`}>
                              ● {session.tag}
                            </span>
                          </div>
                        </label>
                      ))}

                      {/* Consultation notice */}
                      <div className="bg-accent/10 border border-accent/20 p-4 rounded-sm relative overflow-hidden mt-1">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent/50"></div>
                        <p className="text-accent/90 font-sans text-xs leading-relaxed pl-3">
                          <strong>📋 Note:</strong> Starting from <strong>Medium Session</strong> and above, prior consultation is highly recommended before booking. For <strong>Passing Session</strong>, consultation can be done on the same day (similar to Flash Tattoo).
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border mt-4">
                {/* Reference Image */}
                <div>
                  <label className="block text-secondary font-sans text-xs tracking-widest uppercase mb-2">
                    Reference Image <span className="text-red-500">*</span>
                  </label>
                  <p className="text-secondary/60 text-xs font-sans mb-3">Upload a screenshot of the flash or your custom idea.</p>
                  <label className={`w-full border-2 border-dashed p-6 text-center flex flex-col items-center justify-center transition-colors cursor-pointer rounded-sm ${formData.referenceImage ? 'border-accent bg-accent/5 text-accent' : 'border-border text-secondary hover:border-accent bg-primary/50'}`}>
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, "referenceImage")} />
                    <svg className="w-8 h-8 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    <span className="font-sans text-sm">{formData.referenceImage ? formData.referenceImage.name : "Click to upload"}</span>
                  </label>
                </div>

                {/* Placement Image */}
                <div>
                  <label className="block text-secondary font-sans text-xs tracking-widest uppercase mb-2">
                    Body Placement Photo <span className="text-red-500">*</span>
                  </label>
                  <p className="text-secondary/60 text-xs font-sans mb-3">Upload a photo of the body part where you want the tattoo.</p>
                  <label className={`w-full border-2 border-dashed p-6 text-center flex flex-col items-center justify-center transition-colors cursor-pointer rounded-sm ${formData.placementImage ? 'border-accent bg-accent/5 text-accent' : 'border-border text-secondary hover:border-accent bg-primary/50'}`}>
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, "placementImage")} />
                    <svg className="w-8 h-8 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    <span className="font-sans text-sm">{formData.placementImage ? formData.placementImage.name : "Click to upload"}</span>
                  </label>
                </div>
              </div>

              <div className="mt-8 p-6 border-t border-border flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                  <h4 className="font-sans tracking-[0.2em] uppercase text-xs font-semibold text-accent mb-2">Summary</h4>
                  {type === "flash" ? (
                    <p className="text-secondary font-sans text-sm">
                      Estimated Total: <span className="line-through decoration-primary/50 text-primary/70">IDR {priceInfo.total.toLocaleString("id-ID")}</span>
                      <span className="mx-3 text-border hidden md:inline">|</span>
                      <span className="block md:inline mt-1 md:mt-0 text-primary">Deposit to pay today: <strong>IDR {priceInfo.deposit.toLocaleString("id-ID")}</strong></span>
                    </p>
                  ) : (
                    <p className="text-secondary font-sans text-sm">
                      Session Total: <span className="text-primary">IDR {priceInfo.total.toLocaleString("id-ID")}</span>
                      <span className="mx-3 text-border hidden md:inline">|</span>
                      <span className="block md:inline mt-1 md:mt-0 text-primary">Deposit to pay today: <strong>IDR {priceInfo.deposit.toLocaleString("id-ID")} (10%)</strong></span>
                    </p>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row w-full md:w-auto gap-4 shrink-0">
                  {type === "custom" && (
                    <button 
                      onClick={() => {
                        const text = `Hi, I'm interested in a custom tattoo.\n\nName: ${formData.name}\nEmail: ${formData.email}\nPlacement: ${formData.placementText}\nSession: ${formData.size}\n\nI have some questions before booking.`;
                        window.open(`https://wa.me/6282339760624?text=${encodeURIComponent(text)}`, '_blank');
                      }}
                      disabled={!isFormValid}
                      className={`w-full sm:w-auto px-6 py-4 font-sans tracking-widest uppercase text-xs font-bold rounded-sm transition-all border ${isFormValid ? 'border-accent text-accent hover:bg-accent hover:text-white' : 'border-border text-secondary/50 cursor-not-allowed'}`}
                    >
                      Ask on WhatsApp
                    </button>
                  )}
                  <button 
                    onClick={() => setStep("calendar")}
                    disabled={!isFormValid}
                    className={`w-full sm:w-auto px-6 py-4 font-sans tracking-widest uppercase text-xs font-bold rounded-sm transition-all ${isFormValid ? 'bg-accent hover:bg-accent-hover text-white' : 'bg-surface border border-border text-secondary/50 cursor-not-allowed'}`}
                  >
                    Pay Deposit & Book
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: CALENDAR */}
        {step === "calendar" && (
          <div className="animate-in fade-in slide-in-from-right-4">
            <h2 className="font-heading text-3xl text-primary mb-2">
              {type === "flash" ? "Pick Tattoo Date" : "Pick Consultation Date"}
            </h2>
            <p className="text-secondary font-sans text-sm mb-8">
              {type === "flash" 
                ? "Select an available slot for your tattoo session." 
                : "Select an offline consultation date (Must be 3-4 days before your desired tattoo day)."}
            </p>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Dynamic Calendar */}
              <div className="bg-primary border border-border p-6 rounded-sm">
                {/* Month navigation */}
                <div className="flex justify-between items-center mb-6">
                  <button
                    onClick={() => {
                      const d = new Date(calYear, calMonth - 1, 1);
                      setCalMonth(d.getMonth());
                      setCalYear(d.getFullYear());
                      setSelectedDate("");
                      setSelectedTime("");
                    }}
                    className="text-secondary hover:text-accent px-2 py-1 text-lg transition-colors"
                  >
                    ←
                  </button>
                  <span className="font-heading text-xl text-primary">
                    {new Date(calYear, calMonth).toLocaleString("en-US", { month: "long", year: "numeric" })}
                  </span>
                  <button
                    onClick={() => {
                      const d = new Date(calYear, calMonth + 1, 1);
                      setCalMonth(d.getMonth());
                      setCalYear(d.getFullYear());
                      setSelectedDate("");
                      setSelectedTime("");
                    }}
                    className="text-secondary hover:text-accent px-2 py-1 text-lg transition-colors"
                  >
                    →
                  </button>
                </div>

                {/* Day headers */}
                <div className="grid grid-cols-7 gap-1 text-center mb-2">
                  {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d => (
                    <div key={d} className="text-secondary/50 text-xs font-sans uppercase tracking-widest py-1">{d}</div>
                  ))}
                </div>

                {/* Day grid — with correct start offset */}
                <div className="grid grid-cols-7 gap-1">
                  {/* Empty cells for days before 1st */}
                  {Array.from({ length: new Date(calYear, calMonth, 1).getDay() }).map((_, i) => (
                    <div key={`empty-${i}`} />
                  ))}

                  {/* Actual days */}
                  {Array.from({ length: new Date(calYear, calMonth + 1, 0).getDate() }).map((_, i) => {
                    const day = i + 1;
                    const mm = String(calMonth + 1).padStart(2, "0");
                    const dd = String(day).padStart(2, "0");
                    const dateStr = `${calYear}-${mm}-${dd}`;

                    const today = new Date();
                    today.setHours(0,0,0,0);
                    const thisDay = new Date(calYear, calMonth, day);
                    const isPast = thisDay < today;

                    const slotsForDay = bookedSlots.filter(s => s.booking_date === dateStr);
                    const isFullyBooked = slotsForDay.length >= 3;
                    const isDisabled = isPast || isFullyBooked;
                    const isSelected = selectedDate === dateStr;

                    return (
                      <button
                        key={dateStr}
                        disabled={isDisabled}
                        onClick={() => { setSelectedDate(dateStr); setSelectedTime(""); }}
                        className={`
                          aspect-square flex items-center justify-center font-sans text-sm transition-all
                          ${isDisabled
                            ? "text-secondary/20 cursor-not-allowed"
                            : isSelected
                              ? "bg-accent text-white"
                              : "text-primary hover:bg-accent/20 hover:text-white cursor-pointer"
                          }
                        `}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Slots */}
              <div>
                <h4 className="font-heading text-xl text-primary mb-4">Available Times</h4>
                {selectedDate ? (
                  <div className="grid grid-cols-2 gap-3">
                    {["10:00:00", "13:00:00", "16:00:00"].map(time => {
                      const isTimeBooked = bookedSlots.some(s => s.booking_date === selectedDate && s.booking_time === time);
                      const displayTime = time.startsWith("10") ? "10:00 AM" : time.startsWith("13") ? "01:00 PM" : "04:00 PM";
                      
                      return (
                        <button
                          key={time}
                          disabled={isTimeBooked}
                          onClick={() => setSelectedTime(time)}
                          className={`
                            py-3 border text-sm font-sans transition-all rounded-sm
                            ${isTimeBooked
                              ? "border-border bg-surface text-secondary/30 cursor-not-allowed"
                              : selectedTime === time
                                ? "border-accent bg-accent/10 text-accent"
                                : "border-border bg-primary text-secondary hover:border-accent hover:text-primary"
                            }
                          `}
                        >
                          {displayTime} {isTimeBooked && "(Booked)"}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center border border-dashed border-border bg-primary/50 text-secondary font-sans text-sm p-8 text-center rounded-sm">
                    Select a date first to see available time slots.
                  </div>
                )}
              </div>
            </div>

            <div className="pt-10 flex justify-between">
              <button 
                onClick={() => setStep("form")}
                className="px-6 py-4 text-secondary hover:text-primary font-sans tracking-widest uppercase text-xs font-bold transition-all"
              >
                ← Back
              </button>
              <button 
                onClick={() => setStep("checkout")}
                disabled={!selectedDate || !selectedTime}
                className={`px-8 py-4 font-sans tracking-widest uppercase text-xs font-bold rounded-sm transition-all ${(!selectedDate || !selectedTime) ? "bg-surface text-secondary/50 cursor-not-allowed" : "bg-accent hover:bg-accent-hover text-white"}`}
              >
                Proceed to Deposit
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: CHECKOUT (Mock) */}
        {step === "checkout" && (
          <div className="animate-in fade-in slide-in-from-right-4 max-w-xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="font-heading text-3xl text-primary mb-2">Deposit Summary</h2>
              <p className="text-secondary font-sans text-sm">Review your booking details before paying.</p>
            </div>

            <div className="bg-primary border border-border p-8 rounded-sm mb-8 space-y-4">
              <div className="flex justify-between border-b border-border pb-4">
                <span className="text-secondary font-sans">Type</span>
                <span className="text-primary font-heading uppercase">{type} Tattoo</span>
              </div>
              <div className="flex justify-between border-b border-border pb-4">
                <span className="text-secondary font-sans">Date & Time</span>
                <span className="text-primary font-heading">{selectedDate} @ {selectedTime}</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-secondary font-sans font-bold">Deposit Due ({priceInfo.depositPercent})</span>
                <span className="text-accent font-heading font-bold text-xl">IDR {priceInfo.deposit.toLocaleString()}</span>
              </div>
              {type === "flash" && (
                <p className="text-secondary/60 text-xs text-right italic">
                  Remaining 50% payable at studio.
                </p>
              )}
              {type === "custom" && (
                <p className="text-secondary/60 text-xs text-right italic">
                  Remaining 90% (Second Deposit & Final Payment) payable later.
                </p>
              )}
            </div>

            <div className="flex flex-col gap-4">
              <button 
                onClick={handleCheckout}
                disabled={isLoading}
                className={`w-full py-4 font-sans tracking-widest uppercase text-xs font-bold transition-all ${isLoading ? 'bg-surface text-secondary cursor-not-allowed' : 'bg-accent hover:bg-accent-hover text-white'}`}
              >
                {isLoading ? "Processing..." : "Pay via Xendit (Mock)"}
              </button>
              <button 
                onClick={() => setStep("calendar")}
                disabled={isLoading}
                className="w-full py-4 text-secondary hover:text-primary font-sans tracking-widest uppercase text-xs font-bold transition-all"
              >
                Go Back
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: SUCCESS */}
        {step === "success" && (
          <div className="animate-in fade-in duration-500 flex flex-col items-center text-center py-10">

            {/* Minimal accent line instead of neon circle */}
            <div className="w-12 h-px bg-accent mb-8" />

            <h2 className="font-heading text-4xl text-primary mb-4">Booking Confirmed</h2>
            <p className="text-secondary font-sans leading-relaxed mb-10 max-w-lg">
              Your slot on <strong className="text-primary">{selectedDate} at {selectedTime}</strong> is secured.
              We will be in touch shortly.
            </p>
            
            <div className="border border-border/50 bg-surface p-8 w-full max-w-md mb-10 text-left">
              <p className="font-sans text-xs tracking-[0.2em] uppercase text-accent mb-3">Next Step</p>
              <p className="text-secondary font-sans text-sm leading-relaxed mb-6">
                Drop Jerry a message on WhatsApp to confirm your design details.
              </p>
              <a 
                href={`https://wa.me/6282339760624?text=${encodeURIComponent(`Hello Jerry! I just booked a ${type} tattoo slot on ${selectedDate} at ${selectedTime}. My name is ${formData.name}. Booking ID: ${bookingId}`)}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-3 w-full py-4 bg-accent hover:bg-accent-hover text-white font-sans tracking-widest uppercase text-xs font-bold transition-all"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Message Jerry on WhatsApp
              </a>
            </div>

            <Link href="/" className="text-secondary/50 hover:text-secondary font-sans text-xs tracking-widest uppercase transition-colors">
              Return to Homepage
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
