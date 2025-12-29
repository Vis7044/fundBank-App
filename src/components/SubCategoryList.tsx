"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Play, Clock } from "lucide-react";
import {Link} from "react-router-dom";

type Sub = {
  id: string;
  title: string;
  summary: string;
  timeMinutes?: number;
  level?: "beginner" | "intermediate" | "advanced";
  href?: string;
};

type Props = {
  isOpen?: boolean;
  categoryName?: string;
  subcategories?: Sub[];
};

export default function SubCategoryList({ isOpen = false, subcategories = [], categoryName }: Props) {
  return (
    <AnimatePresence initial={false}>
      {isOpen && subcategories.length > 0 && (
        <motion.ul
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ ease: "easeInOut", duration: 0.28 }}
          className="mt-3 space-y-3 md:mt-4 md:space-y-4"
        >
          {subcategories.map((s) => (
            <motion.li
              key={s.id}
              initial={{ y: 6, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm flex items-start gap-4"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600">
                <Play size={16} />
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">{s.title}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{s.summary}</div>
                  </div>

                  <div className="text-right text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1 justify-end">
                      <Clock size={12} />
                      <span>{s.timeMinutes ?? 5}m</span>
                    </div>
                    <Link
                      to={s.href || `/learn/${s.id}`}
                      className="inline-flex items-center gap-2 mt-2 px-3 py-1 rounded-md bg-indigo-600 text-white text-xs"
                    >
                      Start
                    </Link>
                  </div>
                </div>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      )}

      {isOpen && subcategories.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-3 text-sm text-gray-500 dark:text-gray-400"
        >
          No lessons found.
        </motion.div>
      )}
    </AnimatePresence>
  );
}
