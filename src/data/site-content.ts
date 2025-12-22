/**
 * TFS Site Content - Centralized Content Management
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 * EDIT THIS FILE TO UPDATE ALL STATIC CONTENT ON THE WEBSITE
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * This is your SINGLE SOURCE OF TRUTH for:
 * - Company information (name, address, phone, email)
 * - Navigation labels
 * - Footer content
 * - Page-specific SEO and content
 */

// =============================================================================
// TYPES
// =============================================================================

export interface LocalizedString {
    en: string
    fr: string
}

// =============================================================================
// COMPANY INFORMATION
// =============================================================================

export const company = {
    name: "TFS",
    fullName: "TV Film Solutions",

    // Tagline shown in various places
    tagline: {
        en: "Professional Cinema Equipment Rental",
        fr: "Location de Matériel Cinéma Professionnel"
    },

    // Contact details
    address: {
        street: "55-57, Rue Souleimane el Farissi",
        city: "Casablanca",
        postalCode: "20330",
        country: "Morocco",
        countryFr: "Maroc"
    },

    phone: {
        display: "0522 246 372",
        link: "+212522246372"
    },

    email: "contact@tfs.ma",

    // Social media links (leave empty string if not used)
    social: {
        facebook: "",
        instagram: "",
        linkedin: "",
        youtube: ""
    },

    // Copyright year - dynamically generated
    get copyrightYear() {
        return new Date().getFullYear().toString()
    }
}

// =============================================================================
// NAVIGATION
// =============================================================================

export const nav = {
    // Main navigation items
    links: [
        { href: "/equipment", label: { en: "Equipment", fr: "Équipement" } },
        { href: "/about", label: { en: "About", fr: "À Propos" } },
        { href: "/contact", label: { en: "Contact", fr: "Contact" } }
    ],

    // CTA button
    cta: {
        href: "/quote",
        label: { en: "Request Quote", fr: "Demander un Devis" }
    }
}

// =============================================================================
// FOOTER
// =============================================================================

export const footer = {
    // Description below logo
    description: {
        en: "Professional cinema equipment rental for filmmakers, production companies, and content creators in Morocco.",
        fr: "Location de matériel cinéma professionnel pour cinéastes, sociétés de production et créateurs de contenu au Maroc."
    },

    // Section titles
    sections: {
        services: { en: "Services", fr: "Services" },
        support: { en: "Support", fr: "Support" },
        company: { en: "Company", fr: "Entreprise" },
        legal: { en: "Legal", fr: "Légal" }
    },

    // Navigation links
    services: [
        { href: "/equipment?category=cameras", label: { en: "Camera Rentals", fr: "Location Caméras" } },
        { href: "/equipment?category=lighting", label: { en: "Lighting Equipment", fr: "Équipement Éclairage" } },
        { href: "/equipment?category=audio", label: { en: "Audio Gear", fr: "Matériel Audio" } },
        { href: "/equipment?category=grip", label: { en: "Grip & Support", fr: "Grip & Support" } }
    ],

    support: [
        { href: "/guide", label: { en: "Rental Guide", fr: "Guide de Location" } },
        { href: "/contact", label: { en: "Contact Us", fr: "Nous Contacter" } }
    ],

    companyLinks: [
        { href: "/about", label: { en: "Our Story", fr: "Notre Histoire" } },
        { href: "/equipment", label: { en: "Our Equipment", fr: "Notre Équipement" } }
    ],

    legal: [
        { href: "/terms", label: { en: "Terms of Service", fr: "Conditions d'Utilisation" } },
        { href: "/privacy", label: { en: "Privacy Policy", fr: "Politique de Confidentialité" } }
    ],

    // Copyright text
    copyright: {
        en: `© ${company.copyrightYear} TFS - TV Film Solutions. All rights reserved.`,
        fr: `© ${company.copyrightYear} TFS - TV Film Solutions. Tous droits réservés.`
    }
}

// =============================================================================
// PAGE CONTENT - HOME
// =============================================================================

export const homePage = {
    seo: {
        title: {
            en: "Cinema Equipment Rental Morocco | TFS - TV Film Solutions",
            fr: "Location Matériel Cinéma Maroc | TFS - TV Film Solutions"
        },
        description: {
            en: "Professional cinema cameras, lenses, lighting, and audio equipment rental in Casablanca, Morocco. Trusted by film productions.",
            fr: "Location de caméras cinéma, objectifs, éclairages et équipements audio professionnels à Casablanca, Maroc."
        },
        keywords: ["camera rental Morocco", "film equipment Casablanca", "location matériel cinéma Maroc"]
    },

    hero: {
        title: { en: "Equip Your Vision", fr: "Équipez Votre Vision" },
        subtitle: {
            en: "Professional cinema equipment for filmmakers who demand excellence.",
            fr: "Équipement cinéma professionnel pour les cinéastes exigeants."
        }
    },

    // Hero Impact component - main homepage banner
    heroImpact: {
        // Large split text at bottom
        megaText: {
            line1: { en: "TV FILM", fr: "TV FILM" },
            line2: { en: "SOLUTIONS", fr: "SOLUTIONS" }
        },
        // Top-right headline
        headline: {
            line1: { en: "Equip", fr: "Équipez" },
            line2: { en: "Your Vision", fr: "Votre Vision" }
        },
        // Description text
        description: {
            en: "Professional cinema equipment for filmmakers who demand excellence. From RED cameras to ARRI lighting.",
            fr: "Équipement cinéma professionnel pour les cinéastes exigeants. Des caméras RED à l'éclairage ARRI."
        },
        // CTA button
        cta: {
            text: { en: "Let's Talk", fr: "Parlons" },
            href: "/contact"
        }
    }
}

// =============================================================================
// PAGE CONTENT - ABOUT
// =============================================================================

export const aboutPage = {
    seo: {
        title: {
            en: "About TFS | Morocco's Premier Film Equipment Rental",
            fr: "À Propos de TFS | Location Matériel Cinéma Maroc"
        },
        description: {
            en: "TFS has been equipping Morocco's film industry since 2010.",
            fr: "TFS équipe l'industrie cinématographique marocaine depuis 2010."
        }
    },

    hero: {
        title: { en: "Our Story", fr: "Notre Histoire" },
        subtitle: { en: "Empowering filmmakers across Morocco since 2010", fr: "Au service des cinéastes au Maroc depuis 2010" }
    },

    story: [
        {
            en: "TFS - TV Film Solutions was founded in Casablanca with a simple mission: to provide filmmakers in Morocco with access to world-class cinema equipment.",
            fr: "TFS - TV Film Solutions a été fondée à Casablanca avec une mission simple : offrir aux cinéastes du Maroc un accès à un équipement cinéma de classe mondiale."
        },
        {
            en: "We understand that great stories deserve great tools. That's why we've invested in premium equipment from RED, ARRI, Sony, and other industry leaders.",
            fr: "Nous comprenons que les grandes histoires méritent de grands outils. C'est pourquoi nous avons investi dans des équipements premium de RED, ARRI, Sony."
        }
    ],

    mission: {
        title: { en: "Our Mission", fr: "Notre Mission" },
        text: {
            en: "To empower visual storytellers with professional-grade equipment and expert support.",
            fr: "Donner aux conteurs visuels les moyens de créer avec un équipement professionnel et un support expert."
        }
    }
}

// =============================================================================
// PAGE CONTENT - CONTACT
// =============================================================================

export const contactPage = {
    seo: {
        title: {
            en: "Contact TFS | Cinema Equipment Rental Casablanca",
            fr: "Contactez TFS | Location Matériel Cinéma Casablanca"
        },
        description: {
            en: "Get in touch for equipment rental inquiries and quotes.",
            fr: "Contactez-nous pour vos demandes de location et devis."
        }
    },

    hero: {
        title: { en: "Get In Touch", fr: "Contactez-Nous" },
        subtitle: { en: "Ready to equip your next production?", fr: "Prêt à équiper votre prochaine production ?" }
    },

    form: {
        name: { en: "Your Name", fr: "Votre Nom" },
        email: { en: "Email Address", fr: "Adresse Email" },
        phone: { en: "Phone Number", fr: "Numéro de Téléphone" },
        message: { en: "Your Message", fr: "Votre Message" },
        submit: { en: "Send Message", fr: "Envoyer" }
    },

    hours: {
        title: { en: "Opening Hours", fr: "Heures d'Ouverture" },
        weekdays: { en: "Mon - Fri: 9:00 - 18:00", fr: "Lun - Ven: 9h00 - 18h00" },
        saturday: { en: "Saturday: 10:00 - 14:00", fr: "Samedi: 10h00 - 14h00" },
        sunday: { en: "Sunday: Closed", fr: "Dimanche: Fermé" }
    }
}

// =============================================================================
// GLOBAL OPERATIONS GRID (About page)
// =============================================================================

export const globalOperations = {
    title: {
        en: "Our Equipment Services",
        fr: "Nos Services d'Équipement"
    },
    subtitle: {
        en: "Professional equipment solutions for productions of all sizes.",
        fr: "Solutions d'équipement professionnelles pour productions de toutes tailles."
    },
    features: [
        {
            title: { en: "Premium Equipment", fr: "Équipement Premium" },
            description: {
                en: "Access RED, ARRI, Sony and other industry-leading cameras and accessories.",
                fr: "Accédez aux caméras RED, ARRI, Sony et autres équipements professionnels."
            }
        },
        {
            title: { en: "Quality Tested", fr: "Qualité Vérifiée" },
            description: {
                en: "Every piece of gear is tested and verified before it leaves our warehouse.",
                fr: "Chaque équipement est testé et vérifié avant de quitter notre entrepôt."
            }
        },
        {
            title: { en: "Expert Support", fr: "Support Expert" },
            description: {
                en: "Our team of film professionals is available to help with any technical questions.",
                fr: "Notre équipe de professionnels du cinéma est disponible pour toute question technique."
            }
        },
        {
            title: { en: "Morocco Coverage", fr: "Couverture au Maroc" },
            description: {
                en: "We deliver to productions across Morocco, from Casablanca to the desert.",
                fr: "Nous livrons aux productions dans tout le Maroc, de Casablanca au désert."
            }
        }
    ]
}

// =============================================================================
// NAVBAR - Search Suggestions
// =============================================================================

export const searchConfig = {
    categories: [
        { key: "camera", label: { en: "Cameras", fr: "Caméras" }, query: "camera" },
        { key: "lens", label: { en: "Lenses", fr: "Objectifs" }, query: "lens" },
        { key: "lighting", label: { en: "Lighting", fr: "Éclairages" }, query: "lighting" },
        { key: "audio", label: { en: "Audio", fr: "Audio" }, query: "audio" }
    ],
    popular: [
        "RED Komodo",
        "ARRI Alexa",
        "Sony FX6",
        "Aputure 600d",
        "Zeiss CP.3",
        "DJI Ronin"
    ]
}

// =============================================================================
// HELPER FUNCTION
// =============================================================================

/**
 * Get localized string based on current language
 * Usage: t(content.hero.title, 'fr') => "Équipez Votre Vision"
 */
export function t(content: LocalizedString, lng: string = 'en'): string {
    return content[lng as keyof LocalizedString] || content.en
}

