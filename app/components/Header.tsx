"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { MenuIcon, XIcon, GlobeIcon, User, LogOut } from "lucide-react";
import { useEffect, useState, useRef } from "react";

import { useRouter } from "next/navigation";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [language, setLanguage] = useState("en");
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const profileRef = useRef<HTMLDivElement | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      setIsLoggedIn(false);
      setIsProfileOpen(false);
      router.push("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    // Check authentication status
    const checkAuthStatus = async () => {
      try {
        const response = await fetch("/api/auth/status", {
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setIsLoggedIn(data.isAuthenticated);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Failed to check auth status:", error);
        setIsLoggedIn(false);
      }
    };
    checkAuthStatus();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "ar" : "en");
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  // Shared link definitions to avoid duplication between desktop and mobile
  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
  ];

  // Only profile link for mobile auth area; main nav contains dashboard already
  const authLinks = [{ label: "Profile", href: "/user" }];

  const primaryBtnClass =
    "bg-[#D4AF37] text-[#071A3A] px-4 py-2 rounded font-medium hover:bg-gold/90 transition-all duration-300 hover:shadow-lg hover:shadow-[#a5851d] hover:scale-105";

  if (pathname.startsWith("/auth")) {
    return (
      <header
        className={`sticky top-0 z-50 bg-[#071a3a] border-b transition-all duration-300 ${
          scrolled
            ? "border-gray-600 shadow-lg shadow-black/20"
            : "border-gray-800"
        }`}
      >
        <div className="container mx-auto px-4 py-4 flex justify-center items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center group">
              <img
                src="/Aorium.png"
                alt="Aorium Logo"
                className="h-10 w-auto transition-transform duration-300 group-hover:scale-105"
              />
              <span className="ml-2 text-[#D4AF37] font-montserrat font-semibold text-xl hidden sm:inline-block">
                AORIUM
              </span>
            </Link>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header
      className={`sticky top-0 z-50 bg-[#071a3a] border-b transition-all duration-300 ${
        scrolled
          ? "border-gray-600 shadow-lg shadow-black/20"
          : "border-gray-800"
      }`}
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="flex items-center group">
            <img
              src="/Aorium.png"
              alt="Aorium Logo"
              className="h-10 w-auto transition-transform duration-300 group-hover:scale-105"
            />
            <span className="ml-2 text-[#D4AF37] font-montserrat font-semibold text-xl hidden sm:inline-block">
              AORIUM
            </span>
          </Link>
        </div>
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-neutral-light hover:text-[#D4AF37] transition-colors relative py-1 ${
                isActive(link.href) ? "text-gold" : ""
              }`}
            >
              {link.label}
              {isActive(link.href) && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#D4AF37] rounded-full"></span>
              )}
            </Link>
          ))}
        </nav>
        <div className="hidden md:flex items-center space-x-4">
          <button
            onClick={toggleLanguage}
            className="flex items-center text-neutral-light hover:text-[#D4AF37] transition-all duration-300 hover:scale-105"
          >
            <GlobeIcon size={18} className="mr-1" />
            <span>{language === "en" ? "العربية" : "English"}</span>
          </button>
          {isLoggedIn ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen((s) => !s)}
                aria-haspopup="true"
                aria-expanded={isProfileOpen}
                className="flex items-center bg-[#D4AF37] text-[#071A3A] px-3 py-2 rounded-full font-medium hover:bg-gold/90 transition-all duration-300 hover:shadow-lg hover:shadow-[#a5851d] hover:scale-105"
                title="Account"
              >
                <span className="sr-only">Open profile menu</span>
                {/* simple avatar circle with initial */}
                <span className="w-6 h-6 rounded-full bg-[#071A3a] text-[#D4AF37] flex items-center justify-center font-semibold">
                  U
                </span>
              </button>

              {/* Dropdown */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#071a3a] backdrop-blur rounded-md shadow-lg border border-slate-700 z-50">
                  <div className="py-2">
                    <Link
                      href="/user"
                      className="flex items-center px-4 py-2 text-sm text-neutral-light hover:bg-slate-800"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-800"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link href="/auth/register" className={primaryBtnClass}>
              Get Started
            </Link>
          )}
        </div>
        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-neutral-light hover:text-[#D4AF37] transition-colors p-1"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
        </button>
      </div>
      {/* Mobile Navigation */}
      <div
        className={`md:hidden bg-primary-dark border-t border-gold/20 overflow-hidden transition-all duration-300 ${
          isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-neutral-light hover:text-[#D4AF37] transition-colors py-2 ${
                isActive(link.href) ? "text-gold" : ""
              }`}
              onClick={toggleMenu}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex items-center justify-between pt-4 border-t border-gold/20">
            <button
              onClick={toggleLanguage}
              className="flex items-center text-neutral-light hover:text-[#D4AF37] transition-colors"
            >
              <GlobeIcon size={18} className="mr-1" />
              <span>{language === "en" ? "العربية" : "English"}</span>
            </button>
            {isLoggedIn ? (
              <>
                {authLinks.map((a) => (
                  <Link
                    key={a.href}
                    href={a.href}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => {
                      toggleMenu();
                    }}
                  >
                    {a.label}
                  </Link>
                ))}
                <button
                  onClick={() => {
                    toggleMenu();
                    handleLogout();
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={toggleMenu}
                >
                  Login
                </Link>
                <Link
                  href="auth/register"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={toggleMenu}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
