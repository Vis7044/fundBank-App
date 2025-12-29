import { Link } from "react-router-dom";
import { Menu, X, Moon, Sun } from "lucide-react";
import { useState } from "react";
import { useTheme } from "../utils/ThemeProvider";

export const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* NAVBAR */}
      <header className="w-full sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

          {/* LOGO */}
          <Link to="/" className="text-2xl font-extrabold tracking-tight">
            <span className="bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              MF
            </span>
            <span className="text-gray-900 dark:text-gray-100">Tracker</span>
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-8 text-gray-700 dark:text-gray-300 text-[15px] font-medium">
            <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
              Home
            </Link>
            <Link to="/mutual-funds" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
              Mutual Funds
            </Link>
            <Link to="/calculators" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
              Calculators
            </Link>
            <Link to="/learn" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
              Learn
            </Link>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </nav>

          {/* Mobile Right Side */}
          <div className="flex items-center md:hidden gap-3 text-black dark:text-white">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <button onClick={() => setOpen(true)}>
              <Menu size={28} className="text-gray-800 dark:text-gray-200" />
            </button>
          </div>
        </div>
      </header>

      {/* OVERLAY */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      {/* MOBILE SLIDE-IN MENU */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 max-w-[80%]
        bg-white/90 dark:bg-gray-900/90
        backdrop-blur-xl shadow-2xl z-50
        border-r border-gray-200/60 dark:border-gray-800/60
        transform transition-transform duration-300 ease-out
        ${open ? "translate-x-0" : "-translate-x-full"}
        rounded-r-2xl`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200/60 dark:border-gray-800/60">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-gray-900 dark:text-gray-100 tracking-wide">
              Menu
            </span>
            <span className="text-[12px] text-gray-500 -mt-1">
              Quick Navigation
            </span>
          </div>

          <button
            onClick={() => setOpen(false)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <X size={22} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="px-6 py-6 flex flex-col gap-6">
          <Link
            to="/mutual-funds"
            onClick={() => setOpen(false)}
            className="group flex items-center gap-3 text-gray-700 dark:text-gray-300 text-[16px] font-medium"
          >
            <span className="h-2 w-2 rounded-full bg-green-500 opacity-0 group-hover:opacity-100 transition" />
            <span className="group-hover:text-green-600 dark:group-hover:text-green-400 transition">
              Mutual Funds
            </span>
          </Link>

          <Link
            to="/calculators"
            onClick={() => setOpen(false)}
            className="group flex items-center gap-3 text-gray-700 dark:text-gray-300 text-[16px] font-medium"
          >
            <span className="h-2 w-2 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition" />
            <span className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
              Calculators
            </span>
          </Link>

          <Link
            to="/learn"
            onClick={() => setOpen(false)}
            className="group flex items-center gap-3 text-gray-700 dark:text-gray-300 text-[16px] font-medium"
          >
            <span className="h-2 w-2 rounded-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition" />
            <span className="group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
              Learn
            </span>
          </Link>
        </nav>

        <div className="mx-6 border-t my-4" />

        <div className="px-6 text-sm text-gray-500">
          © {new Date().getFullYear()} MFTracker
        </div>
      </aside>
    </>
  );
};
