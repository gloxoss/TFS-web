"use client";

import { logout } from "@/lib/actions/auth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "./pocketbase-provider";
import { ThemeToggle } from "./theme-toggle";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const user = useUser();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  // Common link style with active state
  const linkStyle = (path: string) => `
    px-4 py-2 rounded-md transition-colors
    ${isActive(path) 
      ? 'bg-primary text-primary-content hover:bg-primary-focus' 
      : 'hover:bg-base-200'
    }
  `;

  return (
    <nav className="border-b shadow-sm bg-base-100">
      <div className="navbar mx-auto max-w-7xl px-4">
        {/* Logo/Brand - Always visible */}
        <div className="navbar-start">
          <Link 
            href="/" 
            className={`text-xl font-bold transition-colors ${
              isActive('/') ? 'text-primary' : 'hover:text-primary'
            }`}
          >
            PB-Next
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="navbar-end flex md:hidden">
          <ThemeToggle />
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

        {/* Desktop menu - Hidden on mobile */}
        <div className="navbar-end hidden md:flex items-center gap-2">
          <ThemeToggle />
          <ul className="flex items-center space-x-2">
            {user ? (
              <>
                <li>
                  <Link 
                    href="/dashboard" 
                    className={linkStyle('/dashboard')}
                  >
                    {user.email}
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => logout()}
                    className="px-4 py-2 rounded-md hover:bg-base-200 transition-colors"
                  >
                    Log out
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link 
                    href="/login"
                    className={linkStyle('/login')}
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/register"
                    className={linkStyle('/register')}
                  >
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>

      {/* Mobile menu - Slides down when open */}
      <div className={`
        md:hidden transition-all duration-300 ease-in-out
        ${isMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}
        overflow-hidden bg-base-100
      `}>
        <div className="px-4 py-2 space-y-2">
          {user ? (
            <>
              <Link 
                href="/dashboard" 
                className={`block ${linkStyle('/dashboard')}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {user.email}
              </Link>
              <button
                onClick={() => {
                  logout();
                  setIsMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2 rounded-md hover:bg-base-200 transition-colors"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link 
                href="/login"
                className={`block ${linkStyle('/login')}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <Link 
                href="/register"
                className={`block ${linkStyle('/register')}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}