
import { Github, Mail, Globe } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 py-12">
        
        {/* Top Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Brand */}
          <div>
            <span className="text-3xl font-bold text-blue-700 bg-clip-text">
              MF
            </span>
            <span className="text-3xl font-bold text-gray-900 dark:text-white">Tracker</span>
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 max-w-xs">
              Track mutual funds, analyze returns, and make smarter investment decisions.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm text-black dark:text-gray-300">
              <li><a href="/calculators" className="hover:text-green-600 dark:hover:text-green-400 transition">Calculators</a></li>
              <li><a href="/funds" className="hover:text-green-600 dark:hover:text-green-400 transition">Explore Funds</a></li>
              <li><a href="/compare" className="hover:text-green-600 dark:hover:text-green-400 transition">Compare Funds</a></li>
              <li><a href="/about" className="hover:text-green-600 dark:hover:text-green-400 transition">About Us</a></li>
            </ul>
          </div>

          {/* Tools */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Tools
            </h3>
            <ul className="space-y-2 text-sm text-black dark:text-gray-300">
              <li><a href="/sip-calculator" className="hover:text-green-600 dark:hover:text-green-400 transition">SIP Calculator</a></li>
              <li><a href="/lumpsum" className="hover:text-green-600 dark:hover:text-green-400 transition">Lumpsum Calculator</a></li>
              <li><a href="/cagr" className="hover:text-green-600 dark:hover:text-green-400 transition">CAGR Calculator</a></li>
              <li><a href="/nav-chart" className="hover:text-green-600 dark:hover:text-green-400 transition">NAV Movement</a></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Connect
            </h3>
            <div className="flex items-center gap-4 mt-3">
              <a
                href="https://github.com/"
                target="_blank"
                className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              >
                <Github className="w-5 h-5 text-gray-800 dark:text-gray-200" />
              </a>
              <a
                href="mailto:contact@mftracker.com"
                className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              >
                <Mail className="w-5 h-5 text-gray-800 dark:text-gray-200" />
              </a>
              <a
                href="#"
                className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              >
                <Globe className="w-5 h-5 text-gray-800 dark:text-gray-200" />
              </a>
            </div>
          </div>

        </div>

        {/* Divider */}
        <div className="my-8 border-t border-gray-200 dark:border-gray-700" />

        {/* Bottom */}
        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          © {year} <span className="font-semibold">MFTracker</span>. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
