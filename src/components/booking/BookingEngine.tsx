"use client";

import { useState } from "react";
import Link from "next/link";

type FlowType = "flash" | "custom";
type Step = "warning" | "form" | "calendar" | "checkout" | "success";

interface BookingEngineProps {
  initialType: FlowType;
}

export default function BookingEngine({ initialType }: BookingEngineProps) {
  const [type, setType] = useState<FlowType>(initialType);
  const [step, setStep] = useState<Step>(initialType === "flash" ? "warning" : "form");

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
    placement: "",
    size: "medium", // small, medium, large
    reference: null as File | null,
  });

  // Calendar State (Mock)
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Pricing Logic (Mock)
  const calculatePrice = () => {
    if (type === "flash") {
      if (formData.size === "small") return { total: 1000000, deposit: 500000, depositPercent: "50%" };
      if (formData.size === "medium") return { total: 1750000, deposit: 875000, depositPercent: "50%" };
      if (formData.size === "large") return { total: 2500000, deposit: 1250000, depositPercent: "50%" };
    }
    // Custom Tattoo -> 10% Consultation Fee (Mock Base 5M)
    return { total: 0, deposit: 500000, depositPercent: "10%" }; 
  };

  const priceInfo = calculatePrice();

  return (
    <div className="bg-surface/50 border border-border rounded-lg overflow-hidden relative">
      
      {/* Type Selector (Only if not in success state) */}
      {step !== "success" && (
        <div className="flex border-b border-border">
          <button
            onClick={() => { setType("flash"); setStep("warning"); }}
            className={\`flex-1 py-4 text-sm font-sans tracking-widest uppercase font-semibold transition-colors \${type === "flash" ? "bg-accent text-white" : "text-secondary hover:text-primary"}\`}
          >
            Flash Tattoo
          </button>
          <button
            onClick={() => { setType("custom"); setStep("form"); }}
            className={\`flex-1 py-4 text-sm font-sans tracking-widest uppercase font-semibold transition-colors \${type === "custom" ? "bg-accent text-white" : "text-secondary hover:text-primary"}\`}
          >
            Custom Tattoo
          </button>
        </div>
      )}

      <div className="p-6 md:p-10">
        {/* STEP 1: WARNING (Flash Only) */}
        {step === "warning" && type === "flash" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-red-900/20 text-red-500 rounded-full flex items-center justify-center mb-6 border border-red-500/30">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="font-heading text-3xl text-primary mb-4">Important Acknowledgment</h2>
            <p className="text-secondary font-sans leading-relaxed mb-6 max-w-lg">
              <strong>Hand tapping</strong> is a raw, ancient, and traditional technique. Because of the nature of the tool, it is <strong>not suitable for overly complex, intricate, or modern minimalist shapes</strong>. 
            </p>
            <p className="text-secondary font-sans leading-relaxed mb-8 max-w-lg text-sm italic">
              *If your chosen flash design is very detailed or above 20cm, we may contact you to require an offline consultation first.
            </p>
            <button 
              onClick={() => setStep("form")}
              className="px-8 py-4 bg-accent hover:bg-accent-hover text-white font-sans tracking-widest uppercase text-xs font-bold rounded-sm transition-all"
            >
              I Understand, Continue
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
                  <label className="block text-secondary font-sans text-xs tracking-widest uppercase mb-2">Full Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full bg-primary border border-border px-4 py-3 text-primary focus:border-accent outline-none font-sans" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-secondary font-sans text-xs tracking-widest uppercase mb-2">WhatsApp Number</label>
                  <input type="tel" name="whatsapp" value={formData.whatsapp} onChange={handleInputChange} className="w-full bg-primary border border-border px-4 py-3 text-primary focus:border-accent outline-none font-sans" placeholder="+1 234 567 890" />
                </div>
              </div>
              
              <div>
                <label className="block text-secondary font-sans text-xs tracking-widest uppercase mb-2">Email Address</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full bg-primary border border-border px-4 py-3 text-primary focus:border-accent outline-none font-sans" placeholder="john@example.com" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-secondary font-sans text-xs tracking-widest uppercase mb-2">Body Placement</label>
                  <input type="text" name="placement" value={formData.placement} onChange={handleInputChange} className="w-full bg-primary border border-border px-4 py-3 text-primary focus:border-accent outline-none font-sans" placeholder="e.g. Left Forearm" />
                </div>
                <div>
                  <label className="block text-secondary font-sans text-xs tracking-widest uppercase mb-2">Approximate Size</label>
                  <select name="size" value={formData.size} onChange={handleInputChange} className="w-full bg-primary border border-border px-4 py-3 text-primary focus:border-accent outline-none font-sans">
                    <option value="small">Small (5cm - 10cm)</option>
                    <option value="medium">Medium (11cm - 15cm)</option>
                    <option value="large">Large (16cm - 25cm+)</option>
                  </select>
                </div>
              </div>

              {type === "custom" && (
                <div>
                  <label className="block text-secondary font-sans text-xs tracking-widest uppercase mb-2">Reference Image (Optional)</label>
                  <div className="w-full border-2 border-dashed border-border p-8 text-center flex flex-col items-center justify-center text-secondary hover:border-accent transition-colors cursor-pointer bg-primary/50">
                    <svg className="w-8 h-8 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="font-sans text-sm">Click to upload or drag & drop</span>
                  </div>
                </div>
              )}

              <div className="pt-6 flex justify-end">
                <button 
                  onClick={() => setStep("calendar")}
                  className="px-8 py-4 bg-accent hover:bg-accent-hover text-white font-sans tracking-widest uppercase text-xs font-bold rounded-sm transition-all"
                >
                  Continue to Calendar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: CALENDAR (Mock) */}
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
              {/* Mock Calendar */}
              <div className="bg-primary border border-border p-6 rounded-sm">
                <div className="flex justify-between items-center mb-6">
                  <button className="text-secondary hover:text-accent">&larr;</button>
                  <span className="font-heading text-xl text-primary">October 2026</span>
                  <button className="text-secondary hover:text-accent">&rarr;</button>
                </div>
                <div className="grid grid-cols-7 gap-2 text-center mb-2">
                  {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
                    <div key={d} className="text-secondary text-xs font-sans uppercase tracking-widest">{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {/* Mock Days */}
                  {Array.from({length: 31}).map((_, i) => {
                    const day = i + 1;
                    const isBooked = day % 4 === 0; // Mock some booked days
                    const isSelected = selectedDate === \`2026-10-\${day}\`;
                    return (
                      <button
                        key={day}
                        disabled={isBooked}
                        onClick={() => setSelectedDate(\`2026-10-\${day}\`)}
                        className={\`
                          aspect-square flex items-center justify-center font-sans text-sm transition-all rounded-sm
                          \${isBooked ? 'text-secondary/20 cursor-not-allowed bg-surface/50' : 'text-primary hover:bg-accent hover:text-white bg-surface cursor-pointer'}
                          \${isSelected ? 'bg-accent text-white border-none' : 'border border-transparent'}
                        \`}
                      >
                        {day}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Time Slots */}
              <div>
                <h4 className="font-heading text-xl text-primary mb-4">Available Times</h4>
                {selectedDate ? (
                  <div className="grid grid-cols-2 gap-3">
                    {["10:00 AM", "01:00 PM", "04:00 PM"].map(time => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={\`
                          py-3 border text-sm font-sans transition-all rounded-sm
                          \${selectedTime === time ? 'border-accent bg-accent/10 text-accent' : 'border-border bg-primary text-secondary hover:border-accent hover:text-primary'}
                        \`}
                      >
                        {time}
                      </button>
                    ))}
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
                &larr; Back
              </button>
              <button 
                onClick={() => setStep("checkout")}
                disabled={!selectedDate || !selectedTime}
                className={\`px-8 py-4 font-sans tracking-widest uppercase text-xs font-bold rounded-sm transition-all \${(!selectedDate || !selectedTime) ? 'bg-surface text-secondary/50 cursor-not-allowed' : 'bg-accent hover:bg-accent-hover text-white'}\`}
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
                onClick={() => setStep("success")}
                className="w-full py-4 bg-accent hover:bg-accent-hover text-white font-sans tracking-widest uppercase text-xs font-bold rounded-sm transition-all shadow-[0_0_20px_rgba(234,88,12,0.3)]"
              >
                Pay via Xendit (Mock)
              </button>
              <button 
                onClick={() => setStep("calendar")}
                className="w-full py-4 text-secondary hover:text-primary font-sans tracking-widest uppercase text-xs font-bold transition-all"
              >
                Go Back
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: SUCCESS */}
        {step === "success" && (
          <div className="animate-in zoom-in-95 duration-500 flex flex-col items-center text-center py-10">
            <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-8 border border-green-500/30 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="font-heading text-4xl text-primary mb-4">Booking Confirmed!</h2>
            <p className="text-secondary font-sans leading-relaxed mb-8 max-w-lg">
              Your deposit has been received and your slot on <strong>{selectedDate} at {selectedTime}</strong> is securely locked. We have sent a receipt to your email.
            </p>
            
            <div className="bg-surface border border-border p-6 rounded-sm w-full max-w-md mb-10">
              <h3 className="text-primary font-heading text-xl mb-2">Next Step</h3>
              <p className="text-secondary font-sans text-sm mb-6">
                Please chat with Jerry on WhatsApp to confirm your design details and say hi!
              </p>
              <a 
                href={\`https://wa.me/6282339760624?text=\${encodeURIComponent("Hello Jerry! I just booked a " + type + " slot on " + selectedDate + " at " + selectedTime + ". My name is " + formData.name + ".")}\`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-3 w-full py-4 bg-[#25D366] hover:bg-[#20b858] text-white font-sans tracking-widest uppercase text-xs font-bold rounded-sm transition-all"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Chat on WhatsApp
              </a>
            </div>

            <Link href="/" className="text-secondary hover:text-accent font-sans text-xs tracking-widest uppercase font-semibold transition-colors">
              Return to Homepage
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
