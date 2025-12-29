import FilterBar from "../components/FilterBar";
import fundService from "../services/fundService";
import type { MutualFundScheme } from "../services/fundService";
import { ChevronsDown, ChevronsUpDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const sortOptions = [
  { label: "1Y", sortBy: "cagr_1y", order: "desc" },
  { label: "3Y", sortBy: "cagr_3y", order: "desc" },
  { label: "5Y", sortBy: "cagr_5y", order: "desc" },
];

export default function MutualFunds() {
  const [appliedFilters, setAppliedFilters] = useState({
    category: [] as string[],
    fundhouse: [] as string[],
    tag: "",
    sort: { sortBy: "cagr_1y", order: "desc" },
  });
  const [pendingFilters, setPendingFilters] = useState({
    category: [] as string[],
    fundhouse: [] as string[],
    tag: "",
    sort: { sortBy: "cagr_1y", order: "desc" },
  });
  const [funds, setFunds] = useState<MutualFundScheme[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);
  const [noResults, setNoResults] = useState(false);
  // track sort changes on small screens
  const [trackActiveSort, setTrackActiveSort] = useState(0);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const prevScrollTopRef = useRef(0);

  // Fetch 50 funds at a time
  const fetchFunds = async (reset: boolean, filtersOverride?: any) => {
    if (loading) return;

    const usedFilters = filtersOverride ?? appliedFilters;
    const categoryFilter = usedFilters.category;
    const fundhouseFilter = usedFilters.fundhouse;
    const sort = usedFilters.sort;
    if (reset) {
      setPage(1);
      setHasMore(true);
      setFunds([]);
      setNoResults(false);
    }

    const currentPage = reset ? 1 : page;
    if (!reset && scrollContainerRef.current) {
      prevScrollTopRef.current = scrollContainerRef.current.scrollTop;
    }

    setLoading(true);
    try {
      const res = await fundService.getAllFunds(
        currentPage,
        15,
        categoryFilter,
        fundhouseFilter,
        sort.sortBy,
        sort.order
      );
      if (!res.ok) return;

      // 🛡️ SAFETY CHECK 2: If page=1 and no results
      if (reset && res.data.length === 0) {
        setFunds([]);
        setNoResults(true);
        setLoading(false);
        setHasMore(false);
        return;
      }

      // 🛡️ SAFETY CHECK 3: Append or replace
      if (reset) {
        setFunds(res.data);
      } else {
        setFunds((prev) =>
          Array.isArray(prev) ? [...prev, ...res.data] : res.data
        );
      }

      console.log("Fetched funds:", res.data);
      // 🛡️ SAFETY CHECK 4: pagination
      if (res.data.length < 15) {
        setHasMore(false);
      } else {
        setPage(currentPage + 1);
      }
    } catch (err) {
      console.error("FETCH ERROR:", err);
      setNoResults(true);
      setHasMore(false);
    }

    setLoading(false);
  };

  // Load first page
  useEffect(() => {
    fetchFunds(false);
  }, []);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchFunds(false);
        }
      },
      { root: scrollContainerRef.current, threshold: 0.2 }
    );

    const target = observerTarget.current;
    if (target) observer.observe(target);

    return () => {
      if (target) observer.unobserve(target);
    };
  }, [hasMore, loading]);

  const getReturnColor = (value?: number) => {
    if (value === undefined || value === null || value == 0)
      return "text-gray-400";
    return value < 0
      ? "text-red-600 dark:text-red-400"
      : "text-green-600 dark:text-green-400";
  };

  return (
    <div className="min-h-screen px-4 md:px-16 py-10 container mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        All Mutual Funds
      </h1>

      <div className="mb-6">
        <FilterBar
          filters={pendingFilters}
          setFilters={setPendingFilters}
          applyFilters={() => {
            setAppliedFilters(pendingFilters);
            fetchFunds(true, pendingFilters);
          }}
        />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden w-full">
        <div
          ref={scrollContainerRef}
          className="md:block h-[calc(100vh-250px)] overflow-y-auto overflow-x-auto [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:rounded-full
  [&::-webkit-scrollbar-track]:bg-gray-100
  [&::-webkit-scrollbar-thumb]:rounded-full
  [&::-webkit-scrollbar-thumb]:bg-gray-300
  dark:[&::-webkit-scrollbar-track]:bg-neutral-700
  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
        >
          <table className="w-full">
            <thead className="sticky top-0 bg-gray-100 dark:bg-gray-700 z-20 border-b-2 border-gray-200 dark:border-gray-600">
              <tr className="text-gray-700 dark:text-gray-300 text-md">
                <th className="px-6 py-3 text-left font-semibold w-[260px]">
                  Funds
                </th>

                <th className="px-6 py-3 hidden md:table-cell text-left font-semibold w-[200px]">
                  Category
                </th>

                <th
                  onClick={() => {
                    const updated = {
                      ...appliedFilters,
                      sort: {
                        sortBy: "cagr_1y",
                        order: appliedFilters.sort.order,
                      },
                    };

                    setPendingFilters(updated);
                    setAppliedFilters(updated);
                    fetchFunds(true, updated);
                  }}
                  className={`px-3 py-3 hidden lg:table-cell text-center font-semibold w-20 ${
                    appliedFilters.sort.sortBy === "cagr_1y"
                      ? "cursor-pointer text-gray-500"
                      : ""
                  }`}
                >
                  1Y
                  <ChevronsDown className="w-3 h-3 text-gray-400 inline-block transition" />
                </th>

                <th
                  onClick={() => {
                    const updated = {
                      ...appliedFilters,
                      sort: {
                        sortBy:
                          appliedFilters.sort.sortBy === "cagr_3y"
                            ? "cagr_1y"
                            : "cagr_3y",
                        order: appliedFilters.sort.order,
                      },
                    };
                    setPendingFilters(updated);
                    setAppliedFilters(updated);
                    fetchFunds(true, updated);
                  }}
                  className={`px-3 py-3 hidden lg:table-cell text-center font-semibold w-20 ${
                    appliedFilters.sort.sortBy === "cagr_3y"
                      ? "cursor-pointer text-gray-500"
                      : ""
                  }`}
                >
                  3Y
                  <ChevronsDown className="w-3 h-3 text-gray-400 inline-block transition" />
                </th>

                <th
                  onClick={() => {
                    const updated = {
                      ...appliedFilters,
                      sort: {
                        sortBy:
                          appliedFilters.sort.sortBy === "cagr_5y"
                            ? "cagr_1y"
                            : "cagr_5y",
                        order: appliedFilters.sort.order,
                      },
                    };

                    setPendingFilters(updated);
                    setAppliedFilters(updated);
                    fetchFunds(true, updated);
                  }}
                  className={`px-3 py-3 hidden lg:table-cell text-center font-semibold w-20 ${
                    appliedFilters.sort.sortBy === "cagr_5y"
                      ? "cursor-pointer text-gray-500"
                      : ""
                  }`}
                >
                  5Y
                  <ChevronsDown className="w-3 h-3 text-gray-400 inline-block transition" />
                </th>
                <th
                  onClick={() => {
                    setTrackActiveSort(
                      (trackActiveSort + 1) % sortOptions.length
                    );
                    const updated = {
                      ...appliedFilters,
                      sort: {
                        sortBy:
                          sortOptions[
                            (trackActiveSort + 1) % sortOptions.length
                          ].sortBy,
                        order:
                          sortOptions[
                            (trackActiveSort + 1) % sortOptions.length
                          ].order,
                      },
                    };

                    setPendingFilters(updated);
                    setAppliedFilters(updated);
                    fetchFunds(true, updated);
                  }}
                  className={`px-3 py-3 table-cell lg:hidden text-center font-semibold w-20`}
                >
                  {sortOptions[trackActiveSort].label}
                  <ChevronsUpDown className="w-3 h-3 text-gray-400 inline-block transition" />
                </th>

                <th className="px-3 py-3 hidden lg:table-cell text-center font-semibold w-[100px]">
                  NAV
                </th>

                <th className="px-3 py-3 hidden lg:table-cell text-center font-semibold w-[120px]">
                  Frequency
                </th>
              </tr>
            </thead>

            <tbody className="text-gray-900 dark:text-gray-200 text-[16px]">
              {funds &&
                Array.isArray(funds) &&
                funds.length > 0 &&
                funds.map((fund, i) => (
                  <tr
                    key={`${fund.scheme_code}-${i}`}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700/40 transition"
                  >
                    <td className="px-6 py-3 flex items-center gap-3 max-w-64 md:max-w-full">
                      <img
                        src={fund.amc_img}
                        alt={fund.display_name}
                        onError={(e) => (e.currentTarget.src = "/mf.png")}
                        className="w-8 h-8 rounded object-contain"
                      />
                      <a
                        href={`/mutual-funds/${fund.scheme_code}`}
                        className="text-blue-600 dark:text-blue-400 hover:underline text-sm line-clamp-1 md:line-clamp-2"
                      >
                        {fund?.display_name || "—"}
                      </a>
                    </td>
                    <td className="px-6 py-3 hidden md:table-cell whitespace-nowrap text-sm max-w-48 md:max-w-full">
                      {fund?.sub_category || "—"}
                    </td>

                    <td
                      className={`px-3 hidden py-3 lg:table-cell text-center ${getReturnColor(
                        fund.cagr_1y
                      )}`}
                    >
                      {fund?.cagr_1y == 0
                        ? "-"
                        : `${fund.cagr_1y?.toFixed(2)}%`}
                    </td>

                    <td
                      className={`px-3 hidden py-3 lg:table-cell text-center ${getReturnColor(
                        fund.cagr_3y
                      )}`}
                    >
                      {fund?.cagr_3y == 0
                        ? "-"
                        : `${fund.cagr_3y?.toFixed(2)}%`}
                    </td>

                    <td
                      className={`px-3 py-3 text-center hidden lg:table-cell ${getReturnColor(
                        fund.cagr_5y
                      )}`}
                    >
                      {fund?.cagr_5y == 0
                        ? "-"
                        : `${fund.cagr_5y?.toFixed(2)}%`}
                    </td>

                    <td
                      className={`px-3 py-3 text-center table-cell lg:hidden ${getReturnColor(
                        sortOptions[trackActiveSort].sortBy === "cagr_1y"
                          ? fund.cagr_1y
                          : sortOptions[trackActiveSort].sortBy === "cagr_3y"
                          ? fund.cagr_3y
                          : fund.cagr_5y
                      )}`}
                    >
                      {sortOptions[trackActiveSort].sortBy === "cagr_1y"
                        ? fund.cagr_1y == 0
                          ? "-"
                          : `${fund.cagr_1y?.toFixed(2)}%`
                        : sortOptions[trackActiveSort].sortBy === "cagr_3y"
                        ? fund.cagr_3y == 0
                          ? "-"
                          : `${fund.cagr_3y?.toFixed(2)}%`
                        : fund.cagr_5y == 0
                        ? "-"
                        : `${fund.cagr_5y?.toFixed(2)}%`}
                    </td>

                    <td className="px-3 py-3 hidden lg:table-cell text-center">
                      ₹{fund.nav}
                    </td>
                    <td className="px-3 py-3 hidden lg:table-cell text-center">
                      {fund.frequency}
                    </td>
                  </tr>
                ))}

              {/* Loading */}
              {loading && (
                <tr>
                  <td colSpan={7} className="px-6 py-6 text-center">
                    <div className="flex justify-center items-center gap-2">
                      <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-gray-600 dark:text-gray-400">
                        Loading more...
                      </span>
                    </div>
                  </td>
                </tr>
              )}

              {/* End */}
              {!hasMore ||
                (Array.isArray(funds) && funds.length == 0 && !loading && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-6 text-center text-gray-500 dark:text-gray-400"
                    >
                      No more funds to load
                    </td>
                  </tr>
                ))}
            </tbody>
            {loading && (
              <tbody>
                {Array.from({ length: 15 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-gray-100 dark:bg-gray-700" />
                        <div className="h-4 w-32 bg-gray-100 dark:bg-gray-700 rounded" />
                      </div>
                    </td>

                    {/* Category column */}
                    <td className="px-6 py-3 hidden md:table-cell">
                      <div className="h-4 w-24 bg-gray-100 dark:bg-gray-700 rounded" />
                    </td>

                    {/* 1Y */}
                    <td className="px-3 py-3 hidden lg:table-cell text-center">
                      <div className="mx-auto h-4 w-10 bg-gray-100 dark:bg-gray-700 rounded" />
                    </td>

                    {/* 3Y */}
                    <td className="px-3 py-3 hidden lg:table-cell text-center">
                      <div className="mx-auto h-4 w-10 bg-gray-100 dark:bg-gray-700 rounded" />
                    </td>

                    {/* 5Y */}
                    <td className="px-3 py-3 text-center">
                      <div className="mx-auto h-4 w-10 bg-gray-100 dark:bg-gray-700 rounded" />
                    </td>

                    {/* NAV */}
                    <td className="px-3 py-3 hidden lg:table-cell text-center">
                      <div className="mx-auto h-4 w-14 bg-gray-100 dark:bg-gray-700 rounded" />
                    </td>

                    {/* Frequency */}
                    <td className="px-3 py-3 hidden lg:table-cell text-center">
                      <div className="mx-auto h-4 w-20 bg-gray-100 dark:bg-gray-700 rounded" />
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>

          <div ref={observerTarget} className="h-6" />
        </div>
      </div>
    </div>
  );
}
