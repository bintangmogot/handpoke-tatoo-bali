export default function FAQ() {
  const faqs = [
    {
      question: "Do you only do Handpoke tattoos?",
      answer: "While we specialize in traditional Handpoke techniques (originating from Kalimantan and Mentawai traditions), we also offer modern Machine tattoos for specific styles or client preferences."
    },
    {
      question: "What is the minimum tattoo size?",
      answer: "We have a strict minimum size policy of 10cm. Traditional handpoke requires space for the ink to settle and breathe. Tattoos smaller than 10cm tend to blur over time and lose their artistic integrity."
    },
    {
      question: "How long can a single session last?",
      answer: "Based on medical advice, a single tattoo session cannot exceed 6 hours. Enduring pain for longer than 6 hours can cause the body to go into shock, leading to weakness, fainting, or fever. Your safety is our priority."
    },
    {
      question: "How does the payment and booking work?",
      answer: "All bookings require a 50% deposit via our website to secure your slot (we accept QRIS, E-Wallets, Local Bank Transfers, and International Credit Cards). The remaining 50% is paid in cash or transfer at the studio."
    },
    {
      question: "Can I bring a friend to the studio?",
      answer: "Our studio is a focused, intimate space designed for a meditative tattoo experience. While you may bring one person for support, we ask that you avoid bringing large groups so the artist can concentrate fully on your piece."
    }
  ];

  return (
    <div className="pt-32 pb-24 w-full flex flex-col items-center min-h-screen">
      <div className="container mx-auto px-4 md:px-8 max-w-4xl">
        
        {/* Header */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <h3 className="text-accent font-heading tracking-widest text-sm uppercase mb-4">Need to know</h3>
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-primary uppercase tracking-wider mb-6">
            FAQ & Info
          </h1>
          <p className="text-secondary font-light">
            Everything you need to know before stepping into Dotlinetattu.
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-6">
          {faqs.map((faq, idx) => (
            <div key={idx} className="glass-panel p-6 md:p-8 border border-border rounded-sm">
              <h3 className="font-heading font-bold text-primary text-xl mb-4 uppercase tracking-wide flex gap-4">
                <span className="text-accent">0{idx + 1}.</span>
                {faq.question}
              </h3>
              <p className="text-secondary font-light leading-relaxed pl-9">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}