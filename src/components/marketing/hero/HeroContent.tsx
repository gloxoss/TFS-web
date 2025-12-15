// src/components/marketing/hero/HeroContent.tsx
"use client";

import { Button } from "@heroui/react";
import { motion, type Variants } from "framer-motion";
import { Camera, Zap, CheckCircle2 } from "lucide-react";

export default function HeroContent() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative z-10 flex h-full flex-col justify-end pb-16 px-4 pt-20 text-white sm:pb-24 sm:px-8 md:px-12 lg:px-24"
    >
      <div className="max-w-4xl">
        {/* BRAND LABEL */}
        <motion.div variants={itemVariants} className="flex items-center gap-2 mb-4 sm:mb-6">
          <span className="h-0.5 w-8 sm:w-12 bg-brand-500 inline-block"></span>
          <span className="text-brand-500 font-mono text-xs sm:text-sm tracking-[0.2em] uppercase">
            TV • Film • Solutions
          </span>
        </motion.div>

        {/* HEADLINE: Huge, Industrial, Tight Leading */}
        <motion.h1
          variants={itemVariants}
          className="text-3xl font-black uppercase leading-[0.9] tracking-tighter xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[7rem]"
        >
          Equipping Your <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">
            Cinematic Vision
          </span>
        </motion.h1>

        {/* SUB-CONTENT GRID */}
        <motion.div variants={itemVariants} className="mt-6 sm:mt-8 grid max-w-xl gap-6 sm:gap-8">
          <p className="text-sm sm:text-base md:text-lg text-gray-300 leading-relaxed border-l-2 border-white/20 pl-4 sm:pl-6">
            The premier equipment rental house for professional filmmakers. 
            Featuring the latest <strong>ARRI, RED, and Sony</strong> ecosystems paired with 
            bespoke optical engineering.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Button
              size="lg"
              radius="sm"
              className="bg-brand-500 text-white font-bold px-6 sm:px-10 h-12 sm:h-14 text-sm sm:text-base"
            >
              EXPLORE CATALOG
            </Button>
            <Button
              size="lg"
              variant="bordered"
              radius="sm"
              className="border-white/30 text-white font-semibold h-12 sm:h-14 text-sm sm:text-base"
            >
              BUILD A KIT
            </Button>
          </div>
        </motion.div>
      </div>

      {/* FLOATING SPECS (Right Side - Desktop Only) */}
      <motion.div
        variants={itemVariants}
        className="hidden lg:flex absolute bottom-24 right-24 flex-col gap-2 items-end text-right"
      >
        <SpecItem icon={Camera} label="8K Certified" sub="Red & Arri Ecosystems" />
        <SpecItem icon={Zap} label="Prepped & Ready" sub="QC Checked 2x" />
        <SpecItem icon={CheckCircle2} label="24/7 Support" sub="On-Set Assistance" />
      </motion.div>
    </motion.div>
  );
}

function SpecItem({ icon: Icon, label, sub }: { icon: any; label: string; sub: string }) {
  return (
    <div className="group flex items-center gap-4 bg-black/40 px-6 py-4 backdrop-blur-md border-r-2 border-brand-500 w-64 justify-end hover:bg-black/60 transition-colors">
      <div className="flex flex-col items-end">
        <span className="font-bold text-white tracking-wide text-sm">{label}</span>
        <span className="text-xs text-gray-400 font-mono">{sub}</span>
      </div>
      <Icon className="h-6 w-6 text-brand-500 group-hover:text-white transition-colors" />
    </div>
  );
}