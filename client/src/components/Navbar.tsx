import { useState } from "react";
import { Link, useLocation } from "wouter";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/submit", label: "Submit Group" },
    { path: "/about", label: "About" },
  ];

  return (
    <nav className="bg-primary sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <svg className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.4 0 0 5.4 0 12c0 2.1.5 4.1 1.5 5.9L.1 24l6.2-1.4c1.8.9 3.7 1.4 5.7 1.4 6.6 0 12-5.4 12-12S18.6 0 12 0zm5.4 16.7c-.2.7-1.2 1.3-1.9 1.4-.6.1-1.2.1-1.8 0-.9-.1-1.8-.4-2.7-.8-1.5-.8-2.9-1.9-3.9-3.2-1-1.2-1.7-2.6-1.9-4.1-.1-.8.1-1.6.6-2.3.2-.2.3-.4.5-.5.2-.1.3-.2.5-.2h.6c.2 0 .4 0 .5.4.2.4.6 1.5.7 1.8.1.2 0 .4-.1.6l-.3.5c-.1.2-.1.2 0 .5.3.5.8 1 1.3 1.5.7.6 1.5 1 2.4 1.3.2.1.4.1.6 0 .2-.2.6-.7.8-.9.2-.2.3-.2.6-.1l1.7.8c.2.1.3.2.4.4.1.3.1.7-.1 1z"/>
              </svg>
              <span className="text-white text-xl font-bold">WhatsApp Group Hub</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link 
                key={item.path} 
                href={item.path}
                className={`${
                  location === item.path 
                    ? "text-white font-medium" 
                    : "text-white/80 hover:text-white"
                } transition-colors px-3 py-2 text-sm`}
              >
                {item.label}
              </Link>
            ))}
          </div>
          
          <div className="md:hidden">
            <button 
              onClick={toggleMobileMenu}
              className="text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={`${mobileMenuOpen ? "block" : "hidden"} md:hidden bg-[#075E54]`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              href={item.path}
              className={`${
                location === item.path 
                  ? "bg-primary/20 text-white" 
                  : "text-white/80 hover:bg-primary/10 hover:text-white"
              } block px-3 py-2 rounded-md text-base`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
