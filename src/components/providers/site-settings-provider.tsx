"use client";

import React, { createContext, useContext, useMemo } from "react";
import { AppSettings } from "@/lib/actions/settings";
import { company as staticCompany, nav as staticNav, footer as staticFooter, LocalizedString } from "@/data/site-content";

// Define the shape of our combined content
export interface SiteContent {
    company: typeof staticCompany;
    nav: typeof staticNav;
    footer: typeof staticFooter;
    settings: AppSettings | null;
}

const SiteSettingsContext = createContext<SiteContent | null>(null);

interface SiteSettingsProviderProps {
    settings: AppSettings | null;
    children: React.ReactNode;
}

export function SiteSettingsProvider({ settings, children }: SiteSettingsProviderProps) {
    const value = useMemo(() => {
        // Merge dynamic settings with static content
        // If settings is null (fetch failed), we fall back entirely to static

        const mergedCompany = { ...staticCompany };
        if (settings) {
            if (settings.company_name) mergedCompany.name = settings.company_name;
            // fullName might not be in DB, keep static or strictly map if DB has it

            if (settings.contact_email) mergedCompany.email = settings.contact_email;

            if (settings.company_phone) {
                mergedCompany.phone = {
                    ...mergedCompany.phone,
                    display: settings.company_phone,
                    link: settings.company_phone.replace(/\s/g, '') // Simple format
                };
            }

            if (settings.company_address) {
                // Address in DB is a single string 'company_address'
                // Static has structured address. We'll update 'street' or 'city' roughly, 
                // or just keep static if the DB one is simple.
                // Let's assume DB address overrides the 'street' for simple display, 
                // or we might need to parse it. For now, let's just override display logic where possible.
                // The static content splits it. Let's put the full string in 'street' as a fallback?
                mergedCompany.address = {
                    ...mergedCompany.address,
                    street: settings.company_address,
                    // keep other fields distinct if needed, or assume DB has full address
                };
            }
        }

        return {
            company: mergedCompany,
            nav: staticNav, // Dynamic nav management not in V1 settings
            footer: staticFooter, // Dynamic footer links not in V1 settings
            settings: settings
        };
    }, [settings]);

    return (
        <SiteSettingsContext.Provider value={value}>
            {children}
        </SiteSettingsContext.Provider>
    );
}

export function useSiteSettings() {
    const context = useContext(SiteSettingsContext);
    if (!context) {
        // Fallback if provider is missing (e.g. isolated test or error)
        return {
            company: staticCompany,
            nav: staticNav,
            footer: staticFooter,
            settings: null
        };
    }
    return context;
}
