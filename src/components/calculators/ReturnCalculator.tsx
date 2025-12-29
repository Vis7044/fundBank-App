import { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface ReturnCalculatorProps {
  nav?: number;
  expectedCagr?: number;
}

const sliderFill = (value: number, min: number, max: number) =>
  ((value - min) * 100) / (max - min);

export default function ReturnCalculator({
  nav = 10,
  expectedCagr = 12,
}: ReturnCalculatorProps) {
  const [amount, setAmount] = useState(25000);
  const [rate, setRate] = useState(expectedCagr);
  const [years, setYears] = useState(10);

  useEffect(() => {
    setRate(expectedCagr);
  }, [expectedCagr]);

  const totalMonths = years * 12;
  const investedAmount = amount * totalMonths;

  const sipFutureValue = (
    amount: number,
    annualRate: number,
    years: number
  ) => {
    const r = annualRate / 100 / 12;
    const n = years * 12;
    return amount * (((1 + r) ** n - 1) / r) * (1 + r);
  };

  const totalValue = sipFutureValue(amount, rate, years);
  const estReturn = totalValue - investedAmount;

  const chartData = {
    labels: ["Invested", "Returns"],
    datasets: [
      {
        data: [investedAmount, estReturn],
        backgroundColor: ["rgba(200,210,255,0.45)", "#2b7fff"],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="bg-white border dark:bg-gray-900 dark:border-gray-600 rounded-3xl p-6 border-gray-200 space-y-6">
      <h2 className="text-lg font-bold">Return Calculator</h2>

      <p className="text-sm text-gray-500">
        NAV: ₹{nav} • Expected CAGR: {rate.toFixed(2)}%
      </p>

      {/* Amount */}
      <div>
        <p className="text-sm font-medium mb-2">Monthly Investment</p>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min={500}
            max={100000}
            step={500}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #2b7fff ${sliderFill(
                amount,
                500,
                100000
              )}%, #CBD5E1 ${sliderFill(amount, 500, 100000)}%)`,
            }}
          />
          <span className="min-w-[80px] text-right font-semibold">
            ₹{amount.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Years */}
      <div>
        <p className="text-sm font-medium mb-2">Time Period</p>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min={1}
            max={30}
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #2b7fff ${sliderFill(
                years,
                1,
                30
              )}%, #CBD5E1 ${sliderFill(years, 1, 30)}%)`,
            }}
          />
          <span className="min-w-[50px] text-right font-semibold">
            {years} yr
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="flex justify-center pt-4">
        <div className="w-56 h-56">
          <Doughnut data={chartData} />
        </div>
      </div>

      {/* Summary */}
      <div className="text-sm space-y-1">
        <p>
          Invested:{" "}
          <span className="font-semibold">
            ₹{investedAmount.toLocaleString()}
          </span>
        </p>
        <p>
          Returns:{" "}
          <span className="font-semibold">
            ₹{Math.round(estReturn).toLocaleString()}
          </span>
        </p>
        <p className="text-base font-bold">
          Total: ₹{Math.round(totalValue).toLocaleString()}
        </p>
      </div>
    </div>
  );
}
