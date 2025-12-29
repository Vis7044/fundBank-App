import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, TrendingUp, Lightbulb } from "lucide-react";
import CategoryCard from "../components/CategoryCard";
import SubCategoryList from "../components/SubCategoryList";
import { categories} from "../data/categories";
import type { Category } from "../data/categories";

export default function LearnPage() {
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  const toggleCategory = (name: string) => {
    setOpenCategory(openCategory === name ? null : name);
  };

  return (
    <div className="min-h-screen px-6 md:px-10 py-10 bg-white dark:bg-gray-900">
      
      {/* Header */}
      <section className="max-w-3xl mx-auto text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Learn About Investing
        </h1>
        <p className="mt-3 text-gray-600 dark:text-gray-300 text-base">
          A simple and clean guide to mutual funds, SIPs, stocks, and long-term investing — for everyone.
        </p>

        <div className="flex justify-center gap-3 mt-5 text-sm">
          <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <BookOpen size={16} /> Basics
          </span>
          <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <Lightbulb size={16} /> Concepts
          </span>
          <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <TrendingUp size={16} /> Strategies
          </span>
        </div>
      </section>

      {/* Slim Categories */}
      <section className="max-w-3xl mx-auto flex flex-col gap-3">
        {categories.map((cat: Category, i) => (
          <motion.div
            key={cat.name}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <CategoryCard
              title={cat.name}
              subtitle={cat.subtitle}
              isOpen={openCategory === cat.name}
              onClick={() => toggleCategory(cat.name)}
              slim
            />

            <SubCategoryList
              isOpen={openCategory === cat.name}
              subcategories={cat.subcategories}
              categoryName={cat.name}
            />
          </motion.div>
        ))}
      </section>
    </div>
  );
}
