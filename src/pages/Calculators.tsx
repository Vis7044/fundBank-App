import { useState, useEffect } from "react";
import type { FC } from "react";
import { BarChart3, Scale } from "lucide-react";
// import SPICalculator from "../components/calculators/SIPCalculator";
// import SwpCalculator from "../components/calculators/SWPCalculator";
// import LumpsumCalculator from "../components/calculators/LumpsumCalculator";
// import RetirementCalculator from "../components/calculators/RetirementCalculator";
// import SIPNeedCalculator from "../components/calculators/SIPNeedCalculator";
// import EmiVsSipCalculator from "../components/calculators/EmiVsSipCalculator";
// import ChildEducationCalculator from "../components/calculators/ChildEducationCalculator";
// import ChildMarraigeCalculator from "../components/calculators/ChildMarraigeCalculator";
// import SIPCalculator from "../components/calculators/SIPCalculator";
// import CapitalGainCalculator from "../components/calculators/CapitalGainCalculator";

const tabs: string[] = [
  "Mutual Funds SIP",
  "Retirement Calculator",
  "⁠SWP Calculator",
  "EMI vs SIP Calculator",
  "Child Marriage Calculator",
  "Lumpsum Calculator",
  "SIP Need Calculator",
  "⁠Children Education",
  "⁠Capital Gain Calculator",
];

// --- Content Switcher ---
// const CalculatorContent: FC<{ selectedTab: string }> = ({ selectedTab }) => {
//   switch (selectedTab) {
//     case "Mutual Funds SIP":
//       return <SPICalculator />;
//     case "⁠SWP Calculator":
//       return <SwpCalculator />;
//     case "Lumpsum Calculator":
//       return <LumpsumCalculator />;
//     case "Retirement Calculator":
//       return <RetirementCalculator />
//     case "SIP Need Calculator":
//       return <SIPNeedCalculator />;
//     case "EMI vs SIP Calculator":
//       return <EmiVsSipCalculator />;
//     case "⁠Children Education":
//       return <ChildEducationCalculator />;
//     case "Child Marriage Calculator":
//       return <ChildMarraigeCalculator />;
//     case "⁠Capital Gain Calculator":
//       return <CapitalGainCalculator />;
//     default:
//       return <SIPCalculator />;
//   }
// };

const Calculators: FC = () => {
  const [selectedTab, setSelectedTab] = useState<string>("Mutual Funds SIP");
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  
  useEffect(() => {
    // Load saved tab from localStorage on client side
    const savedTab = localStorage.getItem("selectedCalculatorTab");
    if (savedTab) setSelectedTab(savedTab);
  }, []);
  
  useEffect(() => {
    localStorage.setItem("selectedCalculatorTab", selectedTab);
  }, [selectedTab]);
  

  return (
    <div className="min-h-screen dark:bg-gray-900 text-black dark:text-white font-inter">
      <div className="flex flex-col md:flex-row max-w-7xl mx-auto py-4 md:py-8 px-4 md:px-0 gap-6">

        {/* ------------------ HEADER (MOBILE & DESKTOP) ------------------ */}
        <div className="w-full md:hidden flex flex-col items-center text-center mb-4">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Financial Calculators
          </h1>
          <p className="mt-2 text-base opacity-90 text-gray-600 dark:text-gray-300 max-w-xl">
            Explore a wide range of tools to help you plan your investments, analyze returns, and make smarter financial decisions.
          </p>
        </div>

        {/* ------------------ MOBILE TAB (Accordion Style) ------------------ */}
        <div className="md:hidden w-full mb-6">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="w-full py-3 px-4 rounded-xl border border-blue-400 dark:border-blue-700 
              bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 shadow-md 
              flex justify-between items-center font-bold text-lg transition duration-200 hover:shadow-lg"
          >
            <span className="font-medium">{selectedTab} Calculator</span>
            <BarChart3 className={`w-5 h-5 transition-transform ${mobileOpen ? "rotate-90" : "rotate-0"}`} />
          </button>

          <div className={`transition-all duration-300 ease-in-out overflow-hidden ${mobileOpen ? "max-h-[600px] mt-2" : "max-h-0"}`}>
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setSelectedTab(tab);
                    setMobileOpen(false);
                  }}
                  className={`w-full px-4 py-3 text-left text-sm border-b last:border-none rounded-lg
                    border-gray-100 dark:border-gray-700 transition duration-150
                    ${
                      selectedTab === tab
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 font-semibold"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ------------------ DESKTOP SIDEBAR ------------------ */}
        <div className="hidden md:block w-72 shrink-0">
          <div className="sticky top-20 space-y-2 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-bold mb-2 text-gray-800 dark:text-white">Calculators</h2>
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`w-full text-left px-4 py-2 rounded-lg text-sm transition duration-150
                  ${
                    selectedTab === tab
                      ? "bg-blue-500 text-white shadow-md font-semibold"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* ------------------ RIGHT CALCULATOR PANEL ------------------ */}
        <main className="flex-1 flex flex-col">
          {/* Desktop header */}
          <div className="hidden md:flex flex-col mb-4">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              {selectedTab}
            </h1>
          </div>
            <CalculatorContent selectedTab={selectedTab} />         
        </main>
      </div>
    </div>
  );
};

export default Calculators;
