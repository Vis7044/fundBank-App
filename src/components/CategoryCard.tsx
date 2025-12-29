"use client";

import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

export default function CategoryCard({ title, subtitle, isOpen, onClick, slim }: any) {
  return (
    <div
      className={`rounded-xl cursor-pointer transition shadow-sm bg-white dark:bg-gray-800 
      ${slim ? "p-4" : "p-5"} hover:shadow-md`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {subtitle}
            </p>
          )}
        </div>

        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
          <ChevronDown size={18} className="text-gray-600 dark:text-gray-300" />
        </motion.div>
      </div>
    </div>
  );
}
