import { useState } from "react";

export default function CapitalGainCalculator() {
  const [holdingPeriod, setHoldingPeriod] = useState("STCG");
  const [purchaseDate, setPurchaseDate] = useState("before");
  const [saleValue, setSaleValue] = useState(100000);
  const [purchaseValue, setPurchaseValue] = useState(20000);
  const [expenses, setExpenses] = useState(9000);

  const capitalGain = saleValue - purchaseValue - expenses;
  const exemption = holdingPeriod === "LTCG" ? Math.min(capitalGain, 100000) : 0;
  const taxableGain =
    holdingPeriod === "STCG"
      ? capitalGain
      : Math.max(capitalGain - exemption, 0);

  const taxRate = holdingPeriod === "STCG" ? 0.2 : 0.125;
  const tax = taxableGain * taxRate;

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
        {/* LEFT SIDE – INPUTS */}
        <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl border-gray-200 dark:border-gray-800">
          {/* Holding Period */}
          <div className="mb-4">
            <label className="block mb-1 text-gray-600 dark:text-gray-300">
              Holding Period (Years)
            </label>
            <select
              className="select-menu w-full p-3 rounded-lg border dark:bg-gray-800 dark:text-white"
              value={holdingPeriod}
              onChange={(e) => setHoldingPeriod(e.target.value)}
            >
              <option value="STCG">Less Than or Equal to 1 Year</option>
              <option value="LTCG">More Than 1 Year</option>
            </select>
          </div>

          {/* Purchase Date */}
          <div className="mb-4">
            <label className="block mb-1 text-gray-600 dark:text-gray-300">
              Purchase Date
            </label>
            <select
              className="select-menu w-full p-3 rounded-lg border dark:bg-gray-800 dark:text-white"
              value={purchaseDate}
              onChange={(e) => setPurchaseDate(e.target.value)}
            >
              <option value="before">Before 31 Jan 2018</option>
              <option value="after">On or After 31 Jan 2018</option>
            </select>
          </div>

          {/* Sale Value */}
          <div className="mb-4">
            <label className="block mb-1 text-gray-600 dark:text-gray-300">
              Sale Value (₹)
            </label>
            <input
              type="number"
              className="form-input w-full p-3 rounded-lg border dark:bg-gray-800 dark:text-white"
              value={saleValue}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (val >= 0 && val <= 1000000000) setSaleValue(val);
              }}
            />
          </div>

          {/* Purchase Value */}
          <div className="mb-4">
            <label className="block mb-1 text-gray-600 dark:text-gray-300">
              Purchase Value (₹)
            </label>
            <input
              type="number"
              className="form-input w-full p-3 rounded-lg border dark:bg-gray-800 dark:text-white"
              value={purchaseValue}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (val >= 0 && val <= 1000000000) setPurchaseValue(val);
              }}
            />
          </div>

          {/* Expenses */}
          <div className="mb-4">
            <label className="block mb-1 text-gray-600 dark:text-gray-300">
              Transfer Expenses (₹)
            </label>
            <input
              type="number"
              className="form-input w-full p-3 rounded-lg border dark:bg-gray-800 dark:text-white"
              value={expenses}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (val >= 0 && val <= 1000000000) setExpenses(val);
              }}
            />
          </div>
        </div>

        {/* RIGHT SIDE – RESULT */}
        <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 flex flex-col">
          <div className="p-5 bg-blue-50 dark:bg-blue-900/40 rounded-xl mb-6">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
              {holdingPeriod === "STCG"
                ? "Short Term Capital Gain"
                : "Long Term Capital Gain"}
            </h3>
            <p className="text-2xl font-bold mt-2 text-blue-600 dark:text-blue-300">
              ₹{capitalGain.toLocaleString()}
            </p>
          </div>

          <table className="w-full text-left border rounded-lg overflow-hidden">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-2 text-gray-700 dark:text-gray-300">
                  Particulars
                </th>
                <th className="px-4 py-2 text-gray-700 dark:text-gray-300">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="dark:text-gray-200">
              <tr className="border-b dark:border-gray-700">
                <td className="px-4 py-3">
                  {holdingPeriod === "STCG"
                    ? "Short Term Capital Gain"
                    : "Long Term Capital Gain"}
                </td>
                <td className="px-4 py-3">
                  ₹{capitalGain.toLocaleString()}
                </td>
              </tr>

              <tr className="border-b dark:border-gray-700">
                <td className="px-4 py-3">
                  Exemption {holdingPeriod === "LTCG" && "(Max ₹1,00,000)"}
                </td>
                <td className="px-4 py-3">
                  ₹{exemption.toLocaleString()}
                </td>
              </tr>

              <tr className="border-b dark:border-gray-700">
                <td className="px-4 py-3">Taxable Capital Gain</td>
                <td className="px-4 py-3">
                  ₹{taxableGain.toLocaleString()}
                </td>
              </tr>

              <tr>
                <td className="px-4 py-3">
                  {holdingPeriod === "STCG"
                    ? "Short Term Capital Gain Tax @ 20%"
                    : "Long Term Capital Gain Tax @ 12.5%"}
                </td>
                <td className="px-4 py-3">
                  ₹{tax.toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>

          <p className="mt-4 p-8 font-semibold text-gray-700 dark:text-gray-300">
            {holdingPeriod === "STCG" ? "Short Term" : "Long Term"} Capital Gain
            of{" "}
            <span className="font-bold text-blue-700">
              ₹{capitalGain.toLocaleString()}
            </span>{" "}
            is chargeable to tax @{" "}
            {holdingPeriod === "STCG" ? "20%" : "12.5%"} i.e{" "}
            <span className="font-bold text-blue-700">
              ₹{tax.toLocaleString()}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
