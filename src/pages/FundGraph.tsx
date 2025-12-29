import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import fundService from "../services/fundService";
import IntradayChart from "../components/IntradayEChart";
import ReturnCalculator from "../components/calculators/ReturnCalculator";

const ranges = [
  { label: "1M", days: 30 },
  { label: "3M", days: 90 },
  { label: "6M", days: 180 },
  { label: "1Y", days: 365 },
  { label: "3Y", days: 1095 },
  { label: "5Y", days: 365 * 5 },
  { label: "All", days: 365 * 10 },
];

export interface FundMeta {
  y5_return: number;
  nav: number;
  fund_house: string;
  scheme_type: string;
  scheme_category: string;
  scheme_code: number;
  scheme_name: string;
  isin_growth: string;
  isin_div_reinvestment: string;
  amc_img: string;
}

export default function FundGraph() {
  const { schemeId } = useParams<{ schemeId: string }>();

  const [selectedRange, setSelectedRange] = useState("1M");
  const [allData, setAllData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [schemeName, setSchemeName] = useState("");
  const [fundMeta, setFundMeta] = useState<FundMeta | null>(null);
  const [expectedCagr, setExpectedCagr] = useState<number | null>(null);
  const [returnsByRange, setReturnsByRange] = useState<
    Record<string, number | null>
  >({});
  const [schemeImage, setSchemeImage] = useState("");

  const calculateReturn = (data: any[]) => {
    if (!data || data.length < 2) return null;
    const navEnd = data[0]?.nav;
    const navStart = data[data.length - 1]?.nav;
    if (!navStart || !navEnd) return null;
    return ((navEnd - navStart) / navStart) * 100;
  };

  const calculateExpectedCagr = (meta: FundMeta | null) => {
    if (!meta) return null;
    if (meta.y5_return && meta.y5_return > 0) return meta.y5_return;
    if (returnsByRange["3Y"]) return returnsByRange["3Y"]! / 3;
    if (returnsByRange["1Y"]) return returnsByRange["1Y"];
    return 12;
  };

  const fetchAllRanges = async () => {
    if (!schemeId) return;

    setLoading(true);

    try {
      const promises = ranges.map(async (range) => {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - range.days);

        const startStr = start.toISOString().split("T")[0];
        const endStr = end.toISOString().split("T")[0];

        const response = await fundService.getFundNAV(
          schemeId,
          startStr,
          endStr
        );

        if (!response.ok) {
          return { label: range.label, data: [] };
        }

        setSchemeName(response.data?.meta.scheme_name || "");
        setFundMeta(response.data?.meta || null);
        setSchemeImage(response.data?.amc_img || "");

        return { label: range.label, data: response.data.data || [] };
      });

      const results = await Promise.all(promises);

      const tempData: Record<string, any[]> = {};
      const tempReturns: Record<string, number | null> = {};

      results.forEach(({ label, data }) => {
        tempData[label] = data;
        tempReturns[label] = calculateReturn(data);
      });

      setAllData(tempData);
      setReturnsByRange(tempReturns);
    } catch (err) {
      console.error("Error fetching ranges:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllRanges();
  }, [schemeId]);

  useEffect(() => {
    if (!loading && fundMeta) {
      setExpectedCagr(calculateExpectedCagr(fundMeta));
    }
  }, [loading, fundMeta, returnsByRange]);

  if (!schemeId) return <p>Invalid Scheme</p>;

  const data = allData[selectedRange];
  const latestNav = data?.[data.length - 1]?.nav ?? null;

  return (
    <div className="min-h-screen dark:bg-gray-900 text-black dark:text-white pt-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="lg:col-span-2">
          <div className="mb-6 flex items-center gap-4">
            {schemeImage && (
              <img
                src={schemeImage}
                alt="Fund Logo"
                className="w-12 h-auto rounded-md object-contain"
              />
            )}
            <h1 className="text-md md:text-2xl font-bold">
              {schemeName || "Mutual Fund Scheme"}
            </h1>
          </div>

          <div className="relative w-full h-[350px] sm:h-[420px] lg:h-[450px] bg-white dark:bg-gray-900 rounded-xl">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                Loading...
              </div>
            ) : (
              <IntradayChart data={data} />
            )}
          </div>

          {/* Range Buttons */}
          <div className="w-fit mx-auto flex flex-wrap gap-2 px-2 mt-3">
            {ranges.map((r) => (
              <button
                key={r.label}
                onClick={() => setSelectedRange(r.label)}
                className={`px-3 py-1 text-sm rounded-2xl border ${
                  selectedRange === r.label
                    ? "bg-green-600 text-white"
                    : "bg-white dark:bg-gray-800"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="lg:col-span-1">
          <ReturnCalculator
            nav={latestNav ?? 10}
            expectedCagr={expectedCagr ?? 0}
          />
        </div>

        {/* EXPLORE MORE SECTION */}
        <div className="lg:col-span-3 space-y-8 mt-10">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
            Explore More
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 cursor-pointer">
              <h3 className="font-semibold text-lg mb-2 text-gray-800 dark:text-gray-200">
                Mutual Fund News
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Latest announcements, market updates, and fund house news.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 cursor-pointer">
              <h3 className="font-semibold text-lg mb-2 text-gray-800 dark:text-gray-200">
                Top Performing Funds
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Check out the top-performing mutual funds.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 cursor-pointer">
              <h3 className="font-semibold text-lg mb-2 text-gray-800 dark:text-gray-200">
                Sector Insights
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Learn how different sectors are performing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
