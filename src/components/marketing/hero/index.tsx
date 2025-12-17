// src/components/marketing/hero/index.tsx
import HeroBackground from "./HeroBackground";
import HeroContent from "./HeroContent";
import HeroNavbar from "./HeroNavbar";

// TFS Cinema Rental Hero Images - Local optimized images
const HERO_IMAGES = [
  "/images/hero/localize-uu-YGo9YVDw-unsplash-1-scaled.webp", // Already optimized webp
  "/images/hero/20221115_124804.jpg", // Cinema gear shot
  "/images/hero/xrabat-wall-sl.jpg.pagespeed.ic.16lhC1-Jv2.jpg", // Rabat wall shot
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