

import { useState, useMemo } from "react";

export default function ChildEducationCalculator() {
  const [target, setTarget] = useState(10000000);
  const [period, setPeriod] = useState(10);
  const [returns, setReturns] = useState(12);
  const [inflation, setInflation] = useState(8);

  // Conditional Fields
  const [haveSavings, setHaveSavings] = useState(false);
  const [growthInSavings, setGrowthInSavings] = useState("7.5"); // %
  const [haveExistingInvestment, setHaveExistingInvestment] = useState(false);
  const [existingInvestment, setExistingInvestment] = useState(6000); // ₹
  const [existingReturn, setExistingReturn] = useState("9.7"); // %

  const sliderFill = (value: number, min: number, max: number) => ((value - min) * 100) / (max - min);

  // CALCULATIONS
  const { inflationAdjustedTarget, sipRequired, totalInvestment, growthMultiple, futureValueExisting, shortfall } =
  useMemo(() => {
    const years = period;
    const months = years * 12;
    const r = returns / 100 / 12;
    const infl = inflation / 100;

    // 1. Inflation-adjusted target
    const futureValue = target * Math.pow(1 + infl, years);

    // 2. SIP calculation
    let sip = futureValue / ((Math.pow(1 + r, months) - 1) / r);
    if (haveSavings && parseFloat(growthInSavings) > 0) {
      const g = parseFloat(growthInSavings) / 100;
      sip = futureValue * (r - g / 12) / (Math.pow(1 + r, months) - Math.pow(1 + g / 12, months));
    }

    const invested = sip * months;
    const multiple = invested > 0 ? futureValue / invested : 0;

    // 3. Future value of existing investments
    let fvExisting = haveExistingInvestment
      ? existingInvestment * Math.pow(1 + parseFloat(existingReturn) / 100, years)
      : 0;
    fvExisting = isNaN(fvExisting) ? 0 : fvExisting;


    // 4. Future value of SIP
    const fvSIP = sip * ((Math.pow(1 + r, months) - 1) / r);

    // 5. Shortfall / Surplus
    const shortfallAmount = isNaN((fvExisting)- futureValue)? 0 : (fvExisting)- futureValue;

    console.log("shortfall: ",shortfallAmount);

    return {
      inflationAdjustedTarget: futureValue,
      sipRequired: sip,
      totalInvestment: invested,
      growthMultiple: multiple,
      futureValueExisting: fvExisting,
      shortfall: shortfallAmount,
    };
  }, [target, period, returns, inflation, haveSavings, growthInSavings, haveExistingInvestment, existingInvestment, existingReturn]);


  // FORMATTING
  const format = (num: number) => num.toLocaleString("en-IN", { maximumFractionDigits: 0 });
  const format2 = (num: number) => num.toLocaleString("en-IN", { maximumFractionDigits: 2 });

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-600 p-6 
                    bg-white dark:bg-gray-900
                    grid grid-cols-1 lg:grid-cols-2 gap-10 transition-all">

      {/* LEFT SIDE — INPUTS */}
      <div className="space-y-8">

        {/* Cost Today */}
        <div>
          <p className="text-gray-700 dark:text-gray-300 mb-1 font-medium">Cost today</p>
          <div className="flex items-center gap-3 border rounded-xl px-4 py-2 bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700">
            <span className="text-gray-500 dark:text-gray-400">₹</span>
            <input
              type="text"
              className="w-full bg-transparent outline-none dark:text-white"
              value={target.toLocaleString()}
              onChange={(e) =>
                setTarget(Number(e.target.value.replace(/,/g, "")) || 0)
              }
            />
          </div>
        </div>

        {/* Years Remaining */}
        <div>
          <p className="text-gray-700 dark:text-gray-300 mb-1 font-medium">Years Remaining</p>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="1"
              max="50"
              value={period}
              onChange={(e) => setPeriod(Number(e.target.value))}
              className="w-full custom-slider h-2 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #2B7FFF ${sliderFill(period, 1, 50)}%, #CBD5E1 ${sliderFill(period, 1, 50)}%)`,
              }}
            />
            <input
              value={period}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (val >= 0 && val <= 50) setPeriod(val);
              }}
              className="w-20 border rounded-lg px-3 py-1 bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 text-center"
            />
          </div>
        </div>

        {/* Expected Inflation */}
        <div>
          <p className="text-gray-700 dark:text-gray-300 mb-1 font-medium">Expected Inflation (%)</p>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="1"
              max="25"
              value={inflation}
              onChange={(e) => setInflation(Number(e.target.value))}
              className="w-full custom-slider h-2 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #2B7FFF ${sliderFill(inflation, 1, 25)}%, #CBD5E1 ${sliderFill(inflation, 1, 25)}%)`,
              }}
            />
            <div className="relative">
              <input
                value={inflation}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (val >= 0 && val <= 25) setInflation(val);
                }}
                className="w-20 border rounded-lg px-3 py-1 pr-6 bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 text-center"
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">%</span>
            </div>
          </div>
        </div>

        {/* Expected Returns */}
        <div>
          <p className="text-gray-700 dark:text-gray-300 mb-1 font-medium">Expected Returns (%)</p>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="0"
              max="15"
              value={returns}
              onChange={(e) => setReturns(Number(e.target.value))}
              className="w-full custom-slider h-2 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #2B7FFF ${sliderFill(returns, 0, 15)}%, #CBD5E1 ${sliderFill(returns, 0, 15)}%)`,
              }}
            />
            <div className="relative">
              <input
                value={returns}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (val >= 0 && val <= 15) setReturns(val);
                }}
                className="w-20 border rounded-lg px-3 py-1 pr-6 bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 text-center"
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">%</span>
            </div>
          </div>
        </div>

        {/* --- Have Savings? --- */}
        <div>
          <label className="text-gray-700 dark:text-gray-300 font-medium">Do you have Savings?</label>
          <select
            value={haveSavings ? "yes" : "no"}
            onChange={(e) => setHaveSavings(e.target.value === "yes")}
            className="w-full select-menu p-2 border rounded-lg bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200"
          >
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>

          {haveSavings && (
            <div className="mt-2">
              <p className="text-gray-700 dark:text-gray-300 mb-1 font-medium">Expected Growth in Savings (% per year)</p>
              <input 
                value={growthInSavings}
                onChange={(e) => {
                  const val = e.target.value;

                  // allow empty input during typing
                  if (val === "") {
                    setGrowthInSavings("");
                    return;
                  }

                  // allow decimals
                  const num: number = parseFloat(val);

                  if (!isNaN(num) && num >= 0 && num <= 100) {
                    setGrowthInSavings(num.toString());
                  }
                }}
                type="number"
                step="0.01"   // <-- allows decimals smoothly
                className="w-full p-1 border border-gray-300 outline-none rounded-lg"
              />

            </div>
          )}
        </div>

        {/* --- Existing Investments --- */}
        <div>
          <label className="text-gray-700 dark:text-gray-300 font-medium">Do you have Existing Investments?</label>
          <select
            value={haveExistingInvestment ? "yes" : "no"}
            onChange={(e) => setHaveExistingInvestment(e.target.value === "yes")}
            className="w-full select-menu p-2 border rounded-lg bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200"
          >
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>

          {haveExistingInvestment && (
            <div className="mt-2 space-y-2">
              <div className="relative">
              
                <input
                  type="text"
                  value={existingInvestment.toLocaleString()}
                  onChange={(e) =>
                    setExistingInvestment(Number(e.target.value.replace(/,/g, "")) || 0)
                  }
                  className="w-full py-1 px-6 border rounded-lg bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200"
                />
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">₹</span>
                
              </div>

              <div>
                <p className="text-gray-700 dark:text-gray-300 mb-1 font-medium">Returns (%)</p>
                <input
                  value={existingReturn}
                  onChange={(e) => {
                    const val = e.target.value;

                    // allow empty input during typing
                    if (val === "") {
                      setExistingReturn("");
                      return;
                    }

                    // allow decimals
                    const num: number = parseFloat(val);

                    if (!isNaN(num) && num >= 0 && num <= 100) {
                      setExistingReturn(num.toString());
                    }
                  }}
                  type="number"
                  step="0.01"   // <-- allows decimals smoothly
                  className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200"
                />
              </div>
            </div>
          )}
        </div>

      </div>

      {/* RIGHT SIDE — RESULTS */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-600 
                        bg-gray-50 dark:bg-gray-800 p-6 my-auto flex flex-col gap-6 transition-all">

        <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400">Child Education Plan</h2>

        <div className="space-y-4">

            {/* Recommended Target Amount */}
            <div className="flex justify-between">
            <p className="text-gray-500 dark:text-gray-400">Recommended Target Amount</p>
            <h3 className="font-semibold text-gray-800 dark:text-gray-100">₹{format(inflationAdjustedTarget)}</h3>
            </div>

            {/* Required Investment Amount */}
            <div>
            <p className="text-gray-500 dark:text-gray-400 mb-2">Required Investment Amount</p>
            <div className="flex flex-col sm:flex-row justify-between gap-2">
                <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-2 text-center">
                <p className="text-gray-500 dark:text-gray-300 text-xs">Monthly</p>
                <h3 className="font-semibold text-gray-800 dark:text-gray-100">₹{format(sipRequired)}</h3>
                </div>
                <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-2 text-center">
                <p className="text-gray-500 dark:text-gray-300 text-xs">Yearly</p>
                <h3 className="font-semibold text-gray-800 dark:text-gray-100">₹{format(sipRequired * 12)}</h3>
                </div>
                <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-2 text-center">
                <p className="text-gray-500 dark:text-gray-300 text-xs">One Time</p>
                <h3 className="font-semibold text-gray-800 dark:text-gray-100">₹{format(totalInvestment)}</h3>
                </div>
            </div>
            </div>

            {/* Future Value of Existing Investment */}
            {haveExistingInvestment && (
            <div className="flex justify-between">
                <p className="text-gray-500 dark:text-gray-400">Future Value of Existing Investment</p>
                <h3 className="font-semibold text-gray-800 dark:text-gray-100">₹{format(futureValueExisting)}</h3>
            </div>
            )}

            {/* Shortfall / Surplus */}
            <div className="flex justify-between">
            <p className="text-gray-500 dark:text-gray-400">Shortfall / Surplus to Target Amount</p>
            <h3 className={`font-semibold ${shortfall < 0 ? 'text-red-600' : 'text-green-600'}`}>
                ₹{shortfall<0? inflationAdjustedTarget.toFixed(2) : format(shortfall)}
            </h3>
            </div>


        </div>
        </div>


    </div>
  );
}
