import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-[#075E54] text-white mt-8">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link href="/" className="flex items-center">
              <svg className="h-6 w-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.4 0 0 5.4 0 12c0 2.1.5 4.1 1.5 5.9L.1 24l6.2-1.4c1.8.9 3.7 1.4 5.7 1.4 6.6 0 12-5.4 12-12S18.6 0 12 0zm5.4 16.7c-.2.7-1.2 1.3-1.9 1.4-.6.1-1.2.1-1.8 0-.9-.1-1.8-.4-2.7-.8-1.5-.8-2.9-1.9-3.9-3.2-1-1.2-1.7-2.6-1.9-4.1-.1-.8.1-1.6.6-2.3.2-.2.3-.4.5-.5.2-.1.3-.2.5-.2h.6c.2 0 .4 0 .5.4.2.4.6 1.5.7 1.8.1.2 0 .4-.1.6l-.3.5c-.1.2-.1.2 0 .5.3.5.8 1 1.3 1.5.7.6 1.5 1 2.4 1.3.2.1.4.1.6 0 .2-.2.6-.7.8-.9.2-.2.3-.2.6-.1l1.7.8c.2.1.3.2.4.4.1.3.1.7-.1 1z"/>
              </svg>
              <span className="text-lg font-bold">WhatsApp Group Hub</span>
            </Link>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 mb-4 md:mb-0">
            <Link href="/" className="hover:text-primary/80 transition-colors">Home</Link>
            <Link href="/submit" className="hover:text-primary/80 transition-colors">Submit Group</Link>
            <Link href="/about" className="hover:text-primary/80 transition-colors">About</Link>
            <Link href="/about" className="hover:text-primary/80 transition-colors">Privacy Policy</Link>
            <Link href="/about" className="hover:text-primary/80 transition-colors">Terms</Link>
          </div>
          
          <div className="text-sm">
            &copy; {new Date().getFullYear()} WhatsApp Group Hub. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
