// src/components/marketing/hero/HeroNavbar.tsx
"use client";

import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button } from "@heroui/react";
import { Search, ShoppingBag } from "lucide-react";

export default function HeroNavbar() {
  return (
    <Navbar
      shouldHideOnScroll
      maxWidth="xl"
      className="fixed top-0 bg-transparent data-[menu-open=true]:bg-black/90 border-b border-white/5 py-2"
      classNames={{
        item: "data-[active=true]:text-brand-500",
        wrapper: "px-4 sm:px-8 md:px-12 lg:px-24",
      }}
    >
      <NavbarBrand className="gap-4">
        {/* LOGO */}
        <div className="font-black text-xl sm:text-2xl tracking-tighter text-white">
          TFS <span className="text-brand-500 text-[10px] sm:text-xs font-normal align-top">PRO</span>
        </div>
      </NavbarBrand>
      
      {/* CENTER LINKS - Rental Specific */}
      <NavbarContent className="hidden md:flex gap-6 lg:gap-8" justify="center">
        {["Cameras", "Lenses", "Lighting", "Grip", "Supplies"].map((item) => (
          <NavbarItem key={item}>
            <Link className="text-white/70 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors" href="#">
              {item}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>
      
      {/* RIGHT ACTIONS - Search & Cart */}
      <NavbarContent justify="end" className="gap-4 sm:gap-6">
        <NavbarItem className="hidden sm:flex">
          <Search className="text-white/50 w-5 h-5 cursor-pointer hover:text-white transition-colors" />
        </NavbarItem>
        <NavbarItem>
          <div className="relative cursor-pointer group">
            <ShoppingBag className="text-white w-5 h-5 group-hover:text-brand-500 transition-colors" />
            <span className="absolute -top-2 -right-2 bg-brand-500 text-[10px] font-bold text-white w-4 h-4 flex items-center justify-center rounded-full">0</span>
          </div>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}