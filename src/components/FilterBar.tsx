import { ChevronDown, ChevronRight, DropletIcon } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import {SearchInput} from './SearchInput';
import { SearchModal } from './SearchModal';

interface FilterBarProps {
  filters: any;
  setFilters: (filters: any) => void;
  applyFilters: () => void;
}

interface Categories {
  [key: string]: string[];
}

const categories: Categories = {
  Equity: [
    'Multi Cap Fund',
    'Large Cap Fund',
    'Large & Mid Cap Fund',
    'Mid Cap Fund',
    'Small Cap Fund',
    'ELSS',
    'Dividend Yield Fund',
    'Sectoral/Thematic',
    'Contra Fund',
    'Focused Fund',
    'Value Fund',
    'Flexi Cap Fund',
  ],

  Hybrid: [
    'Aggressive Hybrid Fund',
    'Conservative Hybrid Fund',
    'Arbitrage Fund',
    'Equity Savings',
    'Dynamic Asset Allocation or Balanced Advantage',
  ],

  Debt: [
    'Low Duration Fund',
    'Short Duration Fund',
    'Medium Duration Fund',
    'Medium to Long Duration Fund',
    'Long Duration Fund',
    'Dynamic Bond Fund',
    'Gilt Fund',
    'Gilt Fund with 10 year constant duration',
    'Corporate Bond Fund',
    'Credit Risk Fund',
    'Floater Fund',
    'Banking and PSU Fund',
    'Fixed Maturity Plans - Debt',
    'Interval Plans',
    'Ultra Short Duration Fund',
    'Liquid Fund',
    'Money Market Fund',
    'Overnight Fund',
    'Target Maturity Fund',
  ],

  'Solution Oriented': [
    'Childrens Fund',
    'Retirement Fund',
    'Investment cum Insurance',
  ],

  Others: ['Fund of Funds', 'Index Funds/ETFs'],
};

const fundhouses = [
  'Aditya Birla Sun Life Mutual Fund',
  'Angel One Mutual Fund',
  'Axis Mutual Fund',
  'Bajaj Finserv Mutual Fund',
  'Bandhan Mutual Fund',
  'Bank of India Mutual Fund',
  'Baroda BNP Paribas Mutual Fund',
  'Canara Robeco Mutual Fund',
  'Capitalmind Mutual Fund',
  'Choice Mutual Fund',
  'DSP Mutual Fund',
  'Edelweiss Mutual Fund',
  'Franklin Templeton Mutual Fund',
  'Groww Mutual Fund',
  'HDFC Mutual Fund',
  'HSBC Mutual Fund',
  'Helios Mutual Fund',
  'ICICI Prudential Mutual Fund',
  'IL&FS Mutual Fund (IDF)',
  'ITI Mutual Fund',
  'Invesco Mutual Fund',
  'JM Financial Mutual Fund',
  'Jio BlackRock Mutual Fund',
  'Kotak Mahindra Mutual Fund',
  'LIC Mutual Fund',
  'Mahindra Manulife Mutual Fund',
  'Mirae Asset Mutual Fund',
  'Motilal Oswal Mutual Fund',
  'NJ Mutual Fund',
  'Navi Mutual Fund',
  'Nippon India Mutual Fund',
  'Old Bridge Mutual Fund',
  'PGIM India Mutual Fund',
  'PPFAS Mutual Fund',
  'Quantum Mutual Fund',
  'SBI Mutual Fund',
  'Samco Mutual Fund',
  'Shriram Mutual Fund',
  'Sundaram Mutual Fund',
  'Tata Mutual Fund',
  'Taurus Mutual Fund',
  'The Wealth Company Mutual Fund',
  'Trust Mutual Fund',
  'UTI Mutual Fund',
  'Unifi Mutual Fund',
  'Union Mutual Fund',
  'WhiteOak Capital Mutual Fund',
  'Zerodha Mutual Fund',
  'quant Mutual Fund',
];

// ---- STYLES ----
const btnStyle =
  'cursor-pointer px-4 py-2 text-sm rounded-full border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition select-none';

const dropdownStyle =
  'absolute left-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg py-2 z-50';

const itemStyle =
  'px-4 py-2 text-sm flex  text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition';

export default function FiltersBar({
  setFilters,
  applyFilters,
  filters,
}: FilterBarProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const wrapperRef = useRef<HTMLDivElement>(null);

  // ---- CLOSE ON OUTSIDE CLICK ----
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ---- UPDATE FILTER ----
  const updateFilter = (key: string, value: string) => {
    const updatedFilters = { ...filters, [key]: value };
    setFilters(updatedFilters);
    setOpenDropdown(null);
  };

  const isAllSelected = (parent: string) => {
    const subs = categories[parent];
    return subs.every((sub) => filters.category.includes(sub));
  };

  const toggleParent = (parent: string) => {
    const subs = categories[parent];
    const allSelected = isAllSelected(parent);

    let newList;

    if (allSelected) {
      // remove all subcategories
      newList = filters.category.filter((c: any) => !subs.includes(c));
    } else {
      // add missing subcategories
      const missing = subs.filter((c) => !filters.category.includes(c));
      newList = [...filters.category, ...missing];
    }

    const updated = { ...filters, category: newList };
    setFilters(updated);
  };

  const toggleSubCategory = (sub: string) => {
    const exists = filters.category.includes(sub);

    const updatedList = exists
      ? filters.category.filter((c: any) => c !== sub)
      : [...filters.category, sub];

    const updated = { ...filters, category: updatedList };
    setFilters(updated);
  };
  const [open, setOpen] = useState(false);

  return (
    <div ref={wrapperRef} className="mb-6 flex flex-wrap items-center gap-3">
      {/* ---------- CATEGORY ---------- */}
      <div className="relative w-full sm:w-auto">
        <div
          onClick={() =>
            setOpenDropdown(openDropdown === 'category' ? null : 'category')
          }
          className={`${btnStyle} w-full sm:w-auto flex justify-between items-center`}
        >
          <span>
            {filters.category.length > 0
              ? `${filters.category.length} Categories`
              : 'Categories'}
          </span>
          <ChevronDown className="w-4 h-4 ml-2" />
        </div>

        {openDropdown === 'category' && (
          <div
            className="absolute left-0 right-0 sm:right-auto mt-2 bg-white dark:bg-gray-900 
      rounded-xl border border-gray-300 dark:border-gray-700 shadow-lg z-50 
      w-full sm:w-auto max-h-[70vh] overflow-hidden sm:flex"
          >
            <div className="hidden sm:block w-56 border-r border-gray-200 dark:border-gray-700 py-2">
              {Object.keys(categories).map((parent) => {
                const checked = isAllSelected(parent);

                return (
                  <div
                    key={parent}
                    className="px-4 py-2 flex items-center justify-between text-sm cursor-pointer
                hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                    onClick={() => setActiveCategory(parent)}
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={checked}
                        onChange={() => toggleParent(parent)}
                      />
                      <span className="text-gray-700 dark:text-gray-300">
                        {parent}
                      </span>
                    </div>

                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                );
              })}

              {/* APPLY BUTTON */}
              <div className="border-t border-gray-200 dark:border-gray-700 p-3 flex gap-2">
                <button
                  className="flex-1 px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 
                dark:text-gray-300 rounded-md text-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                  onClick={() => setFilters({ ...filters, category: [] })}
                >
                  Clear All
                </button>

                <button
                  className="flex-1 px-3 py-2 bg-green-600 text-white rounded-md text-sm 
                hover:bg-green-700 transition"
                  onClick={() => {
                    applyFilters();
                    setOpenDropdown(null);
                  }}
                >
                  Apply
                </button>
              </div>
            </div>

            {/* RIGHT PANEL — Desktop */}
            {activeCategory && (
              <div
                className="hidden sm:block w-64 max-h-72 overflow-y-auto py-2
            [&::-webkit-scrollbar]:w-2
            [&::-webkit-scrollbar-track]:rounded-full
            [&::-webkit-scrollbar-track]:bg-gray-100
            [&::-webkit-scrollbar-thumb]:rounded-full
            [&::-webkit-scrollbar-thumb]:bg-gray-300
            dark:[&::-webkit-scrollbar-track]:bg-neutral-700
            dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
              >
                {categories[activeCategory].map((sub) => {
                  const checked = filters.category.includes(sub);

                  return (
                    <div
                      key={sub}
                      className="px-4 py-2 flex items-center gap-3 text-sm cursor-pointer 
                hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSubCategory(sub);
                      }}
                    >
                      <Checkbox
                        checked={checked}
                        onChange={() => toggleSubCategory(sub)}
                      />
                      <span className="text-gray-700 dark:text-gray-300">
                        {sub}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Parent Category Screen */}
            <div className="block sm:hidden w-full py-2">
              {!activeCategory && (
                <>
                  {Object.keys(categories).map((parent) => {
                    const checked = isAllSelected(parent);

                    return (
                      <div
                        key={parent}
                        className="px-4 py-2 flex items-center justify-between text-sm cursor-pointer
                      hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                        onClick={() => setActiveCategory(parent)}
                      >
                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={checked}
                            onChange={() => toggleParent(parent)}
                          />
                          <span className="text-gray-700 dark:text-gray-300">
                            {parent}
                          </span>
                        </div>

                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </div>
                    );
                  })}

                  <div className="border-t border-gray-200 dark:border-gray-700 p-3 flex gap-2">
                    <button
                      className="flex-1 px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 
                dark:text-gray-300 rounded-md text-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                      onClick={() => setFilters({ ...filters, category: [] })}
                    >
                      Clear All
                    </button>

                    <button
                      className="flex-1 px-3 py-2 bg-green-600 text-white rounded-md text-sm 
                hover:bg-green-700 transition"
                      onClick={() => {
                        applyFilters();
                        setOpenDropdown(null);
                      }}
                    >
                      Apply
                    </button>
                  </div>
                </>
              )}

              {/* Subcategory Screen */}
              {activeCategory && (
                <div className="w-full">
                  <div
                    className="px-4 py-2 flex items-center gap-3 cursor-pointer 
              hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                    onClick={() => setActiveCategory(null)}
                  >
                    <ChevronDown className="rotate-90 w-4 h-4 text-gray-600" />
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Back
                    </span>
                  </div>

                  <div className="max-h-60 overflow-y-auto mt-1">
                    {categories[activeCategory].map((sub) => {
                      const checked = filters.category.includes(sub);

                      return (
                        <div
                          key={sub}
                          className="px-4 py-2 flex items-center gap-3 text-sm cursor-pointer 
                    hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                          onClick={() => toggleSubCategory(sub)}
                        >
                          <Checkbox
                            checked={checked}
                            onChange={() => toggleSubCategory(sub)}
                          />
                          <span className="text-gray-700 dark:text-gray-300">
                            {sub}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700 p-3 flex gap-2">
                    <button
                      className="flex-1 px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 
                dark:text-gray-300 rounded-md text-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                      onClick={() => setFilters({ ...filters, category: [] })}
                    >
                      Clear All
                    </button>

                    <button
                      className="flex-1 px-3 py-2 bg-green-600 text-white rounded-md text-sm 
                hover:bg-green-700 transition"
                      onClick={() => {
                        applyFilters();
                        setOpenDropdown(null);
                      }}
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ---------- FUND HOUSE ---------- */}
      <div className="relative w-full sm:w-auto">
        <div
          onClick={() =>
            setOpenDropdown(openDropdown === 'fundhouse' ? null : 'fundhouse')
          }
          className={`${btnStyle} w-full sm:w-auto flex justify-between items-center`}
        >
          <span>
            {filters.fundhouse.length > 0
              ? `${filters.fundhouse.length} Fund Houses`
              : 'Fund House'}
          </span>
          <ChevronDown className="w-4 h-4 ml-2" />
        </div>

        {openDropdown === 'fundhouse' && (
          <div
            className="absolute left-0 right-0 sm:right-auto mt-2 bg-white dark:bg-gray-900 
          rounded-xl border border-gray-300 dark:border-gray-700 shadow-lg z-50 
          w-full sm:w-64"
          >
            {/* SCROLLABLE LIST */}
            <div
              className="max-h-[60vh] sm:max-h-64 overflow-y-auto
              [&::-webkit-scrollbar]:w-2
              [&::-webkit-scrollbar-track]:rounded-full
              [&::-webkit-scrollbar-track]:bg-gray-100
              [&::-webkit-scrollbar-thumb]:rounded-full
              [&::-webkit-scrollbar-thumb]:bg-gray-300
              dark:[&::-webkit-scrollbar-track]:bg-neutral-700
              dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
            >
              {fundhouses.map((house) => {
                const checked = filters.fundhouse.includes(house);

                return (
                  <div
                    key={house}
                    className="px-4 py-2 flex items-center gap-3 text-sm cursor-pointer 
                    hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                    onClick={() => {
                      const updated = checked
                        ? filters.fundhouse.filter((f: string) => f !== house)
                        : [...filters.fundhouse, house];

                      setFilters({ ...filters, fundhouse: updated });
                    }}
                  >
                    <Checkbox
                      checked={checked}
                      onChange={() => {
                        const updated = checked
                          ? filters.fundhouse.filter((f: string) => f !== house)
                          : [...filters.fundhouse, house];

                        setFilters({ ...filters, fundhouse: updated });
                      }}
                    />
                    <span className="text-gray-700 dark:text-gray-300">
                      {house}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* BUTTONS STICK TO BOTTOM */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-3 flex gap-2">
              <button
                className="flex-1 px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 
                dark:text-gray-300 rounded-md text-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                onClick={() => setFilters({ ...filters, fundhouse: [] })}
              >
                Clear All
              </button>

              <button
                className="flex-1 px-3 py-2 bg-green-600 text-white rounded-md text-sm 
                hover:bg-green-700 transition"
                onClick={() => {
                  applyFilters();
                  setOpenDropdown(null);
                }}
              >
                Apply
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="relative w-full sm:w-auto">
        <SearchInput
          onOpen={() => setOpen(true)}
          placeholder="Search..."
        />

      <SearchModal
        isOpen={open}
        onClose={() => setOpen(false)}
      />
    </div>

      {/* ---------- CLEAR ALL ---------- */}
      <button
        className="ml-auto text-sm text-gray-500 dark:text-gray-400 hover:underline"
        onClick={() => {
          setFilters({
            category: [],
            fundhouse: [],
            tag: '',
            sort: { sortBy: 'cagr_1y', order: 'desc' },
          });
          applyFilters();
          setOpenDropdown(null);
        }}
      >
        Clear All
      </button>
    </div>
  );
}

const Checkbox = ({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) => (
  <div
    onClick={(e) => {
      e.stopPropagation();
      onChange();
    }}
    className={`w-4 h-4 rounded border flex items-center justify-center cursor-pointer transition 
      ${
        checked
          ? 'bg-green-600 border-green-600'
          : 'border-gray-400 dark:border-gray-600'
      }`}
  >
    {checked && (
      <svg
        className="w-3 h-3 text-white"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        viewBox="0 0 24 24"
      >
        <path d="M5 13l4 4L19 7" />
      </svg>
    )}
  </div>
);
