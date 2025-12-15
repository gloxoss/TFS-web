"use client";

import React from "react";
import BasicCookieConsent from "@/components/marketing/cookie-consents/BasicCookieConsent";
import CookieConsentBottomCenter from "@/components/marketing/cookie-consents/CookieConsentBottomCenter";
import CookieConsentBottomRightAnimated from "@/components/marketing/cookie-consents/CookieConsentBottomRightAnimated";
import CookieConsentBottomRightVertical from "@/components/marketing/cookie-consents/CookieConsentBottomRightVertical";
import CookieConsentFullWidth from "@/components/marketing/cookie-consents/CookieConsentFullWidth";
import FixedBottomMinimalCookieConsent from "@/components/marketing/cookie-consents/FixedBottomMinimalCookieConsent";
import FloatingBottomMinimalCookieConsent from "@/components/marketing/cookie-consents/FloatingBottomMinimalCookieConsent";
import BrandColorsCookieConsent from "@/components/marketing/cookie-consents/BrandColorsCookieConsent";
import { Button } from "@heroui/react";

export default function CookiePlayground() {
    const [activeComponent, setActiveComponent] = React.useState<string | null>(null);

    const components = {
        "Basic": BasicCookieConsent,
        "Bottom Center": CookieConsentBottomCenter,
        "Right Animated": CookieConsentBottomRightAnimated,
        "Right Vertical": CookieConsentBottomRightVertical,
        "Full Width": CookieConsentFullWidth,
        "Fixed Bottom Minimal": FixedBottomMinimalCookieConsent,
        "Floating Bottom Minimal": FloatingBottomMinimalCookieConsent,
        "Brand Colors": BrandColorsCookieConsent,
    };

    const ActiveComponent = activeComponent ? components[activeComponent as keyof typeof components] : null;

    return (
        <div className="min-h-screen p-8 pb-32">
            <h1 className="text-2xl font-bold mb-8">Cookie Consents Playground</h1>
            <p className="mb-8 text-default-500">
                Click a button below to mount the specific cookie consent component.
                Since they are fixed position, viewing one at a time is best.
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
                <Button
                    color={activeComponent === null ? "primary" : "default"}
                    onPress={() => setActiveComponent(null)}
                >
                    Hide All
                </Button>
                {Object.keys(components).map((name) => (
                    <Button
                        key={name}
                        variant={activeComponent === name ? "solid" : "bordered"}
                        color={activeComponent === name ? "primary" : "default"}
                        onPress={() => setActiveComponent(name)}
                    >
                        {name}
                    </Button>
                ))}
            </div>

            <div className="border border-dashed border-default-300 rounded-lg p-12 text-center text-default-400 min-h-[400px] flex items-center justify-center">
                {activeComponent ? `Showing: ${activeComponent}` : "Select a component to preview"}
            </div>

            {ActiveComponent && <ActiveComponent />}
        </div>
    );
}
