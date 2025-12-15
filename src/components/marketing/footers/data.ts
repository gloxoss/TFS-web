import { Facebook, Instagram, Linkedin, Mail } from "lucide-react";

export const footerNavigation = {
    services: [
        { name: "Camera Rentals", href: "/equipment/cameras" },
        { name: "Lighting Equipment", href: "/equipment/lighting" },
        { name: "Audio Gear", href: "/equipment/audio" },
        { name: "Grip & Support", href: "/equipment/grip" },
    ],
    supportOptions: [
        { name: "Rental Guide", href: "/guide" },
        { name: "Equipment Care", href: "/care" },
        { name: "Technical Support", href: "/support" },
        { name: "Contact Us", href: "/contact" },
    ],
    aboutUs: [
        { name: "Our Story", href: "/about" },
        { name: "Equipment Fleet", href: "/fleet" },
        { name: "Production Services", href: "/services" },
        { name: "Client Testimonials", href: "/testimonials" },
    ],
    legal: [
        { name: "Terms of Service", href: "/terms" },
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Rental Agreement", href: "/agreement" },
        { name: "Insurance Info", href: "/insurance" },
    ],
    social: [
        { name: "Facebook", href: "#", icon: Facebook },
        { name: "Instagram", href: "#", icon: Instagram },
        { name: "LinkedIn", href: "#", icon: Linkedin },
        { name: "Email", href: "mailto:info@tvfilmsolution.com", icon: Mail },
    ],
};
