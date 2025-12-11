// src/components/marketing/hero/index.tsx
import HeroBackground from "./HeroBackground";
import HeroContent from "./HeroContent";
import HeroNavbar from "./HeroNavbar";

// TFS Cinema Rental Images - Replace with actual high-contrast cinema gear photos
// Ideal: Dark studio shots with rim lighting on camera rigs, lens close-ups, BTS film sets
const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1585634917202-6f4f4e3c4c8a?w=1920&q=80", // Cinema camera
  "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1920&q=80", // Film production
  "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1920&q=80", // Camera gear
];

export default function HeroSection() {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      {/* LAYER 1: The Interactive Background */}
      <HeroBackground images={HERO_IMAGES} />

      {/* LAYER 2: The Navigation Overlay */}
      <HeroNavbar />

      {/* LAYER 3: The Main Content */}
      <HeroContent />
    </section>
  );
}