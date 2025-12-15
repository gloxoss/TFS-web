"use client";

import { useState } from "react";
import { useTranslation } from "@/app/i18n/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Send } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ContactFormProps {
    lng: string;
}

export default function ContactForm({ lng }: ContactFormProps) {
    const { t } = useTranslation(lng, "contact");
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            setIsSuccess(true);
            // Reset after a delay
            setTimeout(() => setIsSuccess(false), 3000);
        }, 1500);
    }

    return (
        <div className="relative p-1">
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-3xl blur-sm -z-10" />
            <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-xl rounded-3xl border border-white/10 -z-10" />

            <motion.form
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                onSubmit={onSubmit}
                className="p-8 md:p-10 space-y-6"
            >
                <div className="space-y-2">
                    <h3 className="text-2xl font-bold font-display uppercase text-white">{t("form.title")}</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-zinc-400">{t("form.name")}</Label>
                        <Input id="name" required className="bg-white/5 border-white/10 text-white focus:border-[#D00000] focus:ring-[#D00000]/20 min-h-[50px]" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-zinc-400">{t("form.email")}</Label>
                        <Input id="email" type="email" required className="bg-white/5 border-white/10 text-white focus:border-[#D00000] focus:ring-[#D00000]/20 min-h-[50px]" />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="subject" className="text-zinc-400">{t("form.subject")}</Label>
                    <Input id="subject" required className="bg-white/5 border-white/10 text-white focus:border-[#D00000] focus:ring-[#D00000]/20 min-h-[50px]" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="message" className="text-zinc-400">{t("form.message")}</Label>
                    <Textarea id="message" required className="bg-white/5 border-white/10 text-white focus:border-[#D00000] focus:ring-[#D00000]/20 min-h-[150px]" />
                </div>

                <Button
                    type="submit"
                    disabled={isLoading}
                    className={cn(
                        "w-full h-14 text-lg font-bold uppercase tracking-wider transition-all duration-300",
                        isSuccess ? "bg-green-600 hover:bg-green-700" : "bg-[#D00000] hover:bg-[#A00000]"
                    )}
                >
                    {isLoading ? (
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : isSuccess ? (
                        t("form.success")
                    ) : (
                        <>
                            {t("form.submit")}
                            <Send className="ml-2 h-5 w-5" />
                        </>
                    )}
                </Button>
            </motion.form>
        </div>
    );
}
