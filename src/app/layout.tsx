import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import AppChrome from "@/components/layout/AppChrome";

const sans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const serif = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Dotlinetattu | Authentic Handpoke & Tribal Tattoo Experience in Bali",
  description: "Traditional handpoke tattoo studio in Bali by Silver Jerry. Specializing in authentic tribal, custom, and flash tattoos with modern hygiene standards.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${serif.variable} h-full antialiased dark scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-primary text-primary">
        <div className="noise-overlay"></div>
        <AppChrome>{children}</AppChrome>
      </body>
    </html>
  );
}
