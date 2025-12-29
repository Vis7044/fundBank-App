"use client";

import fundService from "../services/fundService";
import type { FundDetails } from "../services/fundService";
import { useEffect, useState } from "react";

const TopFundsByCategory = () => {
  const categories = [
    "Equity Scheme",
    "Debt Scheme",
    "Hybrid Scheme",
    "Income",
    "Solution Oriented Scheme",
    "ELSS",
    "Money Market",
    "Other Scheme",
  ];

  const [topFunds, setTopFunds] = useState<FundDetails[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getTopFunds = async (category: string) => {
    try {
      setActiveCategory(category);
      setLoading(true);
      const resp = await fundService.getTopFunds(category);
      if (resp.ok) setTopFunds(resp.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTopFunds(categories[0]);
  }, []);

  return (
    <section className="w-full max-w-7xl mx-auto mt-30 px-4 py-14">
      {/* HEADER */}
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
          Top Funds by Category
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
          Discover the best performing mutual funds across different categories
        </p>
      </div>

      {/* CATEGORY PILLS */}
      <div className="mb-12 flex gap-3 overflow-x-auto px-2 pb-2 sm:flex-wrap sm:justify-center sm:overflow-visible">
        {categories.map((category) => {
          const isActive = activeCategory === category;

          return (
            <button
              key={category}
              onClick={() => getTopFunds(category)}
              disabled={loading}
              className={
                "shrink-0 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border backdrop-blur " +
                (isActive
                  ? "bg-blue-600 text-white border-blue-600 shadow-blue-600/30 "
                  : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 ") +
                (loading ? "opacity-50 cursor-not-allowed" : "")
              }
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* FUNDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* LOADING SKELETON */}
        {loading &&
          Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl p-6 bg-gray-100 dark:bg-gray-800 animate-pulse"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gray-300 dark:bg-gray-700 rounded-md" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded" />
                  <div className="h-3 w-2/3 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
              </div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/3 ml-auto" />
            </div>
          ))}

        {/* FUND CARDS */}
        {!loading &&
          topFunds.map((fund) => (
            <div
              key={fund.display_name}
              className="relative group rounded-2xl p-6 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-5">
                <img
                  src={fund.amc_img}
                  alt={fund.fund_house}
                  className="w-12 h-12 rounded-md object-contain bg-gray-50 dark:bg-gray-800 p-1"
                />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white leading-tight line-clamp-2">
                    {fund.display_name}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {fund.fund_house}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  3Y Returns
                </span>
                <span
                  className={
                    "text-lg font-semibold " +
                    (fund.cagr_3y >= 0 ? "text-emerald-600" : "text-red-500")
                  }
                >
                  {fund.cagr_3y.toFixed(2)}%
                </span>
              </div>

              <div className="absolute inset-x-0 bottom-0 h-1 rounded-2xl bg-linear-to-r from-blue-500 to-indigo-500 scale-x-0 group-hover:scale-x-90 transition-transform origin-left" />
            </div>
          ))}
      </div>

      {/* EMPTY STATE */}
      {!loading && activeCategory && topFunds.length === 0 && (
        <p className="text-center mt-12 text-gray-500 dark:text-gray-400">
          No funds found for this category.
        </p>
      )}
    </section>
  );
};

export default TopFundsByCategory;
