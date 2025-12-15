import { redirect } from 'next/navigation';
import { fallbackLng } from './i18n/settings';

// Root page logic: Redirect to the default locale
// This serves as a fallback if middleware fails to handle the root path
export default function RootPage() {
    redirect(`/${fallbackLng}`);
}
