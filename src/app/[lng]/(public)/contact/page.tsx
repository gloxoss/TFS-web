import { ContactClient } from "./contact-client";

export default async function ContactPage({
    params,
}: {
    params: Promise<{ lng: string }>;
}) {
    const { lng } = await params;
    return <ContactClient lng={lng} />;
}
