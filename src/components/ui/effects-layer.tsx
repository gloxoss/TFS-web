"use client";

/**
 * ==========================================
 * EFFECTS LAYER
 * ==========================================
 * Global cinematic texture overlay (TV Noise / Film Grain).
 * Styles defined in globals.css (.noise-wrapper)
 */

export function EffectsLayer() {
    return (
        <>
            <div className="noise-wrapper" aria-hidden="true" />
            {/* Dust particles can also go here later */}
        </>
    );
}
