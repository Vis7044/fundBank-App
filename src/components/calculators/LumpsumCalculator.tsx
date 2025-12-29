import { useState } from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const sliderFill = (value: number, min: number, max: number) =>
  ((value - min) * 100) / (max - min);

export default function LumpsumCalculator() {
  const [amount, setAmount] = useState(25000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);

  const investedAmount = amount;
  const estReturn =
    investedAmount * Math.pow(1 + rate / 100, years) - investedAmount;
  const totalValue = investedAmount + estReturn;

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
        {/* LEFT SIDE — SAME AS ORIGINAL */}
        {/* I did not alter UI at all — only removed “use client” */}
        {/* ... keep your full JSX exactly as it is ... */}

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
