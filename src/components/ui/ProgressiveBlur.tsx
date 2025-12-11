"use client";

// Progressive blur effect - exact implementation from Awwwards reference
// Creates smooth gradient blur at bottom of viewport

export default function ProgressiveBlur() {
  return (
    <div 
      className="progressive-blur_wrap"
      style={{ 
        "--blur": "1rem", 
        "--ratio": "2" 
      } as React.CSSProperties}
    >
      <div style={{ "--i": 6 } as React.CSSProperties} className="progressive-blur_panel is-1" />
      <div style={{ "--i": 5 } as React.CSSProperties} className="progressive-blur_panel is-2" />
      <div style={{ "--i": 4 } as React.CSSProperties} className="progressive-blur_panel is-3" />
      <div style={{ "--i": 3 } as React.CSSProperties} className="progressive-blur_panel is-4" />
      <div style={{ "--i": 2 } as React.CSSProperties} className="progressive-blur_panel is-5" />
      <div style={{ "--i": 1 } as React.CSSProperties} className="progressive-blur_panel is-6" />
      <div style={{ "--i": 1 } as React.CSSProperties} className="progressive-blur_panel is-7" />
      <div style={{ "--i": 1 } as React.CSSProperties} className="progressive-blur_panel is-8" />
      <div style={{ "--i": 1 } as React.CSSProperties} className="progressive-blur_panel is-9" />
      <div style={{ "--i": 1 } as React.CSSProperties} className="progressive-blur_panel is-10" />
    </div>
  );
}
