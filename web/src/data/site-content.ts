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
        street: "N°55-57, Rue Souleimane El Farissi, Ain Borja",
        city: "Casablanca",
        postalCode: "20330",
        country: "Morocco",
        countryFr: "Maroc"
    },

    phone: {
        display: "+212 522 246 372",
        link: "+212522246372"
    },

    fax: {
        display: "+212 522 241 396",
        link: "+212522241396"
    },

    email: "contact@tfs.ma",
    website: "www.tfs.ma",

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
    // Main navigation items (Services is a dynamic dropdown, not listed here)
    links: [
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
    },

    // Expert Bento Grid component
    expertBento: {
        title: { en: "Global Expertise", fr: "Expertise Mondiale" },
        mainTitle: { en: "RECOGNIZED EXPERTISE", fr: "EXPERTISE RECONNUE" },
        mainDescription: {
            en: [
                "The expertise of our teams, combined with a high-tech equipment fleet, ensures our mastery of the entire audiovisual production chain.",
                "Our know-how is now recognized in Morocco, Africa, and the Middle East for major audiovisual events: sports, entertainment, live performances, and TV production.",
                "TFS has equipped a TV studio within its facilities that meets the highest requirements in terms of audiovisual equipment and soundproofing."
            ],
            fr: [
                "L'expertise de nos équipes, combinée à une flotte d'équipements de haute technologie, garantit notre maîtrise de toute la chaîne de production audiovisuelle.",
                "Notre savoir-faire est désormais reconnu au Maroc, en Afrique et au Moyen-Orient pour les grands événements audiovisuels : sport, divertissement, spectacles vivants et production TV.",
                "TFS a équipé un studio TV dans ses locaux répondant aux plus hautes exigences en matière d'équipement audiovisuel et d'insonorisation."
            ]
        },
        stats: {
            stat1: {
                title: { en: "21+ YEARS", fr: "21+ ANS" },
                desc: { en: "Leading the industry since 2003 with consistent excellence.", fr: "Leader du secteur depuis 2003 avec une excellence constante." }
            },
            stat2: {
                title: { en: "500+ PROJECTS", fr: "500+ PROJETS" },
                desc: { en: "Successfully delivered major events across the region.", fr: "Événements majeurs livrés avec succès dans la région." }
            },
            fact1: {
                title: { en: "INTERNATIONAL STANDARDS", fr: "NORMES INTERNATIONALES" },
                desc: { en: "Production quality meeting strict global broadcast requirements.", fr: "Qualité de production répondant aux exigences strictes de diffusion mondiale." }
            },
            fact2: {
                title: { en: "HIGH-TECH FLEET", fr: "FLOTTE HIGH-TECH" },
                desc: { en: "State-of-the-art OB Vans and cameras.", fr: "Cars OB et caméras à la pointe de la technologie." }
            },
            fact3: {
                title: { en: "EXPERT TEAMS", fr: "ÉQUIPES EXPERTES" },
                desc: { en: "Highly trained technical staff.", fr: "Personnel technique hautement qualifié." }
            }
        }
    }
}

// =============================================================================
// PAGE CONTENT - QUOTE
// =============================================================================

export const quotePage = {
    title: { en: "Request a Quote", fr: "Demander un Devis" },
    subtitle: { en: "Complete the form below and we'll get back to you with pricing and availability.", fr: "Remplissez le formulaire ci-dessous et nous vous contacterons avec les prix et la disponibilité." },
    steps: {
        dates: { en: "Rental Dates", fr: "Dates de Location" },
        contact: { en: "Contact Info", fr: "Coordonnées" },
        project: { en: "Project Details", fr: "Détails du Projet" },
        review: { en: "Review & Submit", fr: "Vérifier et Soumettre" }
    },
    datesStep: {
        title: { en: "Rental Period", fr: "Période de Location" },
        description: { en: "Select the start and end dates for your rental. We'll check availability for these dates.", fr: "Sélectionnez les dates de début et de fin de votre location. Nous vérifierons la disponibilité pour ces dates." },
        note: { en: "Note:", fr: "Note:" },
        noteText: { en: "Standard rental period is usually 1-3 days. Extended rentals may qualify for a discount, which will be applied in your formal quote.", fr: "La période de location standard est généralement de 1 à 3 jours. Les locations prolongées peuvent bénéficier d'une réduction, qui sera appliquée dans votre devis formel." },
        yourItems: { en: "Your Equipment", fr: "Votre Équipement" },
        itemsCount: { en: "items in your quote", fr: "articles dans votre devis" }
    },
    navigation: {
        back: { en: "Back", fr: "Retour" },
        backToCart: { en: "Back to Cart", fr: "Retour au Panier" },
        continue: { en: "Continue", fr: "Continuer" },
        submit: { en: "Submit Quote Request", fr: "Soumettre la Demande" },
        submitting: { en: "Submitting...", fr: "Envoi en cours..." }
    },
    success: {
        title: { en: "Quote Request Received!", fr: "Demande de Devis Reçue !" },
        subtitle: { en: "Thank you. We've received your request and will get back to you with a formal quote shortly.", fr: "Merci. Nous avons reçu votre demande et vous contacterons avec un devis formel sous peu." },
        reference: { en: "Reference", fr: "Référence" },
        status: { en: "Request Pending", fr: "Demande en Attente" },
        rentalPeriod: { en: "Rental Period", fr: "Période de Location" },
        equipment: { en: "Equipment", fr: "Équipement" },
        itemsRequested: { en: "items requested", fr: "articles demandés" },
        includingKits: { en: "Including kits & accessories", fr: "Kits et accessoires inclus" },
        step1Title: { en: "Review Process", fr: "Processus de Révision" },
        step1Desc: { en: "Our team checks availability for your dates within 24 hours.", fr: "Notre équipe vérifie la disponibilité pour vos dates sous 24 heures." },
        step2Title: { en: "Formal Quote", fr: "Devis Formel" },
        step2Desc: { en: "You'll receive a detailed PDF quote with final pricing via email.", fr: "Vous recevrez un devis PDF détaillé avec les prix finaux par email." },
        trackRequest: { en: "Track Request", fr: "Suivre la Demande" },
        backToHome: { en: "Back to Home", fr: "Retour à l'Accueil" }
    },
    emptyCart: {
        title: { en: "Your cart is empty", fr: "Votre panier est vide" },
        description: { en: "Add some equipment to request a quote.", fr: "Ajoutez des équipements pour demander un devis." },
        browseEquipment: { en: "Browse Equipment", fr: "Parcourir l'Équipement" }
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
        title: { en: "Morocco's Premier Cinema Equipment House", fr: "Premier Loueur de Matériel Cinéma au Maroc" },
        subtitle: { en: "Empowering visionary filmmakers with world-class cameras, lenses, and lighting since 2010.", fr: "Au service des cinéastes visionnaires avec des caméras, objectifs et éclairages de classe mondiale depuis 2010." }
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

