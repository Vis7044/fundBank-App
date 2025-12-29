import { useState } from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const sliderFill = (value: number, min: number, max: number) => {
  return ((value - min) * 100) / (max - min);
};

export default function SIPCalculator() {
  const [amount, setAmount] = useState(25000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);

  const totalMonths = years * 12;
  const investedAmount = amount * totalMonths;

  function sipFutureValue(amount: number, annualRate: number, years: number) {
    const r = (annualRate / 100) / 12;
    const n = years * 12;
    return amount * (((1 + r) ** n - 1) / r) * (1 + r);
  }

  const totalValue = sipFutureValue(amount, rate, years);
  const estReturn = totalValue - investedAmount;

  const chartData = {
    labels: ["Invested amount", "Est. returns"],
    datasets: [
      {
        data: [investedAmount, estReturn],
        backgroundColor: [
          "rgba(200, 210, 255, 0.45)",
          "#2b7fff",
        ],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="max-w-full w-full mx-auto bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 transition">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* LEFT SECTION */}
        <div className="space-y-8">

          {/* Monthly Investment */}
          <div>
            <p className="text-gray-700 dark:text-gray-300 mb-2 font-medium">
              Monthly investment
            </p>
            <div className="flex items-center justify-between gap-4">
              <input
                type="range"
                min="100"
                max="1000000"
                step="500"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full custom-slider"
                style={{
                  background: `linear-gradient(to right, #2b7fff ${sliderFill(
                    amount,
                    100,
                    1000000
                  )}%, #CBD5E1 ${sliderFill(amount, 100, 1000000)}%)`,
                }}
              />
              <div className="relative">
                <input
                  value={amount}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (val >= 0 && val <= 1000000) setAmount(val);
                  }}
                  className="w-20 border rounded-lg pl-2 py-1
                             bg-gray-50 dark:bg-gray-800 
                             border-gray-300 dark:border-gray-700 
                             text-gray-800 dark:text-gray-200 text-center"
                />
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">₹</span>
              </div>
            </div>
          </div>

          {/* Expected return */}
          <div>
            <p className="text-gray-700 dark:text-gray-300 mb-2 font-medium">
              Expected return rate (p.a)
            </p>
            <div className="flex items-center justify-between gap-4">
              <input
                type="range"
                min="1"
                max="30"
                step={0.1}
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="w-full h-2 custom-slider"
                style={{
                  background: `linear-gradient(to right, #2B7FFF ${sliderFill(
                    rate,
                    1,
                    30
                  )}%, #CBD5E1 ${sliderFill(rate, 1, 30)}%)`,
                }}
              />
              <div className="relative">
                <input
                  value={rate}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (val >= 0 && val <= 30) setRate(val);
                  }}
                  className="w-20 border rounded-lg pr-6 py-1
                             bg-gray-50 dark:bg-gray-800 
                             border-gray-300 dark:border-gray-700 
                             text-gray-800 dark:text-gray-200 text-center"
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">%</span>
              </div>
            </div>
          </div>

          {/* Time Period */}
          <div>
            <p className="text-gray-700 dark:text-gray-300 mb-2 font-medium">
              Time period
            </p>
            <div className="flex items-center justify-between gap-4">
              <input
                type="range"
                min="1"
                max="30"
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="custom-slider w-full"
                style={{
                  background: `linear-gradient(to right, #2b7fff ${sliderFill(
                    years,
                    1,
                    30
                  )}%, #CBD5E1 ${sliderFill(years, 1, 30)}%)`,
                }}
              />
              <div className="relative">
                <input
                  value={years}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (val >= 0 && val <= 30) setYears(val);
                  }}
                  className="w-20 border rounded-lg pr-5 py-1
                             bg-gray-50 dark:bg-gray-800 
                             border-gray-300 dark:border-gray-700 
                             text-gray-800 dark:text-gray-200 text-center"
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">yr</span>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="pt-4 space-y-1">
            <p className="text-gray-600 dark:text-gray-400">
              Invested amount{" "}
              <span className="float-right font-semibold">
                ₹{investedAmount.toLocaleString()}
              </span>
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Est. returns{" "}
              <span className="float-right font-semibold">
                ₹{Math.round(estReturn).toLocaleString()}
              </span>
            </p>
            <p className="text-gray-900 dark:text-gray-200 text-lg font-bold">
              Total value{" "}
              <span className="float-right">
                ₹{Math.round(totalValue).toLocaleString()}
              </span>
            </p>
          </div>
        </div>

        {/* RIGHT CHART */}
        <div className="flex justify-center items-center">
          <div className="w-60 h-60 md:w-72 md:h-72">
            <Doughnut data={chartData} />
          </div>
        </div>
      </div>
    </div>
  );
}
