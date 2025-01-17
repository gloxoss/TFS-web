'use client';

import { logout } from "@/lib/actions/auth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "./pocketbase-provider";
import { ThemeToggle } from "./theme-toggle";
import { LanguageSwitcher } from "./language-switcher";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ClientWrapper } from './client-wrapper'


// interface NavbarProps {
//   lng: string;
// }

export function Navbar({ lng }: { lng: string }) {
  const user = useUser();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useTranslation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path: string) => {
    return pathname === `/${lng}${path}`;
  };

  const linkStyle = (path: string) => `
    px-4 py-2 rounded-md transition-colors
    ${isActive(path) 
      ? 'bg-primary text-primary-content hover:bg-primary-focus' 
      : 'hover:bg-base-200'
    }
  `;

  return (
    <ClientWrapper>
    <nav className="border-b shadow-sm bg-base-100">
      <div className="navbar mx-auto max-w-7xl px-4">
        <div className="navbar-start">
          <Link 
            href={`/${lng}`}
            className={`text-xl font-bold transition-colors ${
              isActive('/') ? 'text-primary' : 'hover:text-primary'
            }`}
          >
            PB-Next
          </Link>
        </div>

        <div className="navbar-end flex md:hidden">
          <ThemeToggle />
          <LanguageSwitcher lng={lng} />
          <button
            onClick={toggleMenu}
            className="btn btn-ghost btn-circle ml-2"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        <div className="navbar-end hidden md:flex items-center gap-2">
          <ThemeToggle />
          <LanguageSwitcher lng={lng} />
          <ul className="flex items-center space-x-2">
            {user ? (
              <>
                <li>
                  <Link 
                    href={`/${lng}/dashboard`}
                    className={linkStyle('/dashboard')}
                  >
                    {t('nav.dashboard')}
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => logout()}
                    className="px-4 py-2 rounded-md hover:bg-base-200 transition-colors"
                  >
                    {t('nav.logout')}
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link 
                    href={`/${lng}/login`}
                    className={linkStyle('/login')}
                  >
                    {t('nav.login')}
                  </Link>
                </li>
                <li>
                  <Link 
                    href={`/${lng}/register`}
                    className={linkStyle('/register')}
                  >
                    {t('nav.register')}
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`
        md:hidden transition-all duration-300 ease-in-out
        ${isMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}
        overflow-hidden bg-base-100
      `}>
        <div className="px-4 py-2 space-y-2">
          {user ? (
            <>
              <Link 
                href={`/${lng}/dashboard`}
                className={`block ${linkStyle('/dashboard')}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.dashboard')}
              </Link>
              <button
                onClick={() => {
                  logout();
                  setIsMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2 rounded-md hover:bg-base-200 transition-colors"
              >
                {t('nav.logout')}
              </button>
            </>
          ) : (
            <>
              <Link 
                href={`/${lng}/login`}
                className={`block ${linkStyle('/login')}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.login')}
              </Link>
              <Link 
                href={`/${lng}/register`}
                className={`block ${linkStyle('/register')}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.register')}
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
    </ClientWrapper>
  );
}