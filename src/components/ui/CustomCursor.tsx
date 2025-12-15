"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [hoverText, setHoverText] = useState("");

  // Motion values for raw mouse position
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring physics for smooth "lag" effect
  const springConfig = { damping: 20, stiffness: 200, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Only show custom cursor on non-touch devices
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setIsVisible(true);
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    // Logic to detect hoverable elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Check for interactive elements
      const isLink = target.tagName.toLowerCase() === "a" || target.closest("a");
      const isButton = target.tagName.toLowerCase() === "button" || target.closest("button");
      const isInput = target.tagName.toLowerCase() === "input" || target.tagName.toLowerCase() === "textarea";
      const isSelect = target.tagName.toLowerCase() === "select";
      const hasRole = target.getAttribute("role") === "button" || target.getAttribute("role") === "link";
      const isClickable = target.onclick !== null || target.classList.contains("cursor-scale");
      const hasPointerCursor = window.getComputedStyle(target).cursor === "pointer";
      const isNavItem = target.closest("[data-slot='nav-item']") || target.closest("nav");
      
      if (isLink || isButton || isInput || isSelect || hasRole || isClickable || hasPointerCursor || isNavItem) {
        setIsHovering(true);
        
        // Set custom text based on element type
        if (isLink) {
          setHoverText("VIEW");
        } else if (isButton) {
          setHoverText("CLICK");
        } else if (isInput || isSelect) {
          setHoverText("TYPE");
        } else {
          setHoverText("VIEW");
        }
      } else {
        setIsHovering(false);
        setHoverText("");
      }
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseenter", handleMouseEnter);
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseenter", handleMouseEnter);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className="fixed left-0 top-0 z-[9999] pointer-events-none mix-blend-difference hidden md:block"
      style={{
        x: cursorX,
        y: cursorY,
        translateX: "-50%",
        translateY: "-50%",
      }}
      animate={{
        opacity: isVisible ? 1 : 0,
      }}
      transition={{ duration: 0.15 }}
    >
      {/* The Cursor Visuals */}
      <motion.div
        className="bg-white rounded-full relative flex items-center justify-center"
        animate={{
          width: isHovering ? 80 : 12,
          height: isHovering ? 80 : 12,
        }}
        transition={{ 
          type: "spring", 
          stiffness: 400, 
          damping: 25,
          mass: 0.5
        }}
      >
        {/* Text inside when hovering */}
        <motion.span 
          className="text-[10px] font-bold text-black uppercase tracking-wider"
          animate={{ 
            opacity: isHovering ? 1 : 0,
            scale: isHovering ? 1 : 0.5
          }}
          transition={{ duration: 0.15, delay: isHovering ? 0.1 : 0 }}
        >
          {hoverText}
        </motion.span>
      </motion.div>
      
      {/* Outer ring for extra visual feedback */}
      <motion.div
        className="absolute inset-0 border-2 border-white rounded-full"
        style={{ translateX: "-50%", translateY: "-50%", left: "50%", top: "50%" }}
        animate={{
          width: isHovering ? 96 : 24,
          height: isHovering ? 96 : 24,
          opacity: isHovering ? 0.5 : 0.3,
        }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 20,
          mass: 0.8
        }}
      />
    </motion.div>
  );
}
