import { useState, useMemo } from "react";

export default function SIPNeedCalculator() {
  const [target, setTarget] = useState(10000000);
  const [period, setPeriod] = useState(10);
  const [returns, setReturns] = useState(12);
  const [inflation, setInflation] = useState(8);

  const sliderFill = (value: number, min: number, max: number) =>
    ((value - min) * 100) / (max - min);

  // CALCULATIONS
  const {
    inflationAdjustedTarget,
    sipRequired,
    totalInvestment,
    growthMultiple,
  } = useMemo(() => {
    const years = period;
    const r = returns / 100 / 12;
    const n = years * 12;
    const infl = inflation / 100;

    const futureValue = target * Math.pow(1 + infl, years);
    const sipFactor = (Math.pow(1 + r, n) - 1) / r;

    let sip = futureValue / sipFactor;
    if (!isFinite(sip)) sip = 0;

    const invested = sip * n;
    const multiple = invested > 0 ? futureValue / invested : 0;

    return {
      inflationAdjustedTarget: futureValue,
      sipRequired: sip,
      totalInvestment: invested,
      growthMultiple: multiple,
    };
  }, [target, period, returns, inflation]);

  const format = (num: number) =>
    num.toLocaleString("en-IN", { maximumFractionDigits: 0 });

  const format2 = (num: number) =>
    num.toLocaleString("en-IN", { maximumFractionDigits: 2 });

  return (
    <div
      className="rounded-2xl border border-gray-200 dark:border-gray-600 p-6 
                    bg-white dark:bg-gray-900
                    grid grid-cols-1 lg:grid-cols-2 gap-10 transition-all"
    >
      {/* LEFT SIDE */}
      <div className="space-y-8">
        <div className="space-y-6">
          {/* TARGET */}
          <div>
            <p className="text-gray-700 dark:text-gray-300 mb-1 font-medium">
              Target Amount
            </p>
            <div
              className="flex items-center gap-3 border rounded-xl px-4 py-2 
                            bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700"
            >
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

          {/* PERIOD */}
          <div>
            <p className="text-gray-700 dark:text-gray-300 mb-1 font-medium">
              Period (Years)
            </p>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="1"
                max="50"
                value={period}
                onChange={(e) => setPeriod(Number(e.target.value))}
                className="w-full h-2 custom-slider"
                style={{
                  background: `linear-gradient(to right, #2B7FFF ${sliderFill(
                    period,
                    1,
                    50
                  )}%, #CBD5E1 ${sliderFill(period, 1, 50)}%)`,
                }}
              />
              <input
                value={period}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (val >= 0 && val <= 50) setPeriod(val);
                }}
                className="w-20 border rounded-lg px-3 py-1 bg-gray-50 dark:bg-gray-800 
                           border-gray-300 dark:border-gray-700 
                           text-gray-800 dark:text-gray-200 text-center"
              />
            </div>
          </div>

          {/* RETURNS */}
          <div>
            <p className="text-gray-700 dark:text-gray-300 mb-1 font-medium">
              Expected Returns (%)
            </p>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="1"
                max="25"
                value={returns}
                onChange={(e) => setReturns(Number(e.target.value))}
                className="w-full h-2 custom-slider"
                style={{
                  background: `linear-gradient(to right, #2B7FFF ${sliderFill(
                    returns,
                    1,
                    25
                  )}%, #CBD5E1 ${sliderFill(returns, 1, 25)}%)`,
                }}
              />
              <div className="relative">
                <input
                  value={returns}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (val >= 0 && val <= 25) setReturns(val);
                  }}
                  className="w-20 border rounded-lg px-3 py-1 pr-6 
                             bg-gray-50 dark:bg-gray-800 
                             border-gray-300 dark:border-gray-700 
                             text-gray-800 dark:text-gray-200 text-center"
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                  %
                </span>
              </div>
            </div>
          </div>

          {/* INFLATION */}
          <div>
            <p className="text-gray-700 dark:text-gray-300 mb-1 font-medium">
              Expected Inflation (%)
            </p>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="15"
                value={inflation}
                onChange={(e) => setInflation(Number(e.target.value))}
                className="w-full h-2 custom-slider"
                style={{
                  background: `linear-gradient(to right, #2B7FFF ${sliderFill(
                    inflation,
                    0,
                    15
                  )}%, #CBD5E1 ${sliderFill(inflation, 0, 15)}%)`,
                }}
              />

              <div className="relative">
                <input
                  value={inflation}
                  min="0"
                  max="15"
                  step="0.01"
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (val >= 0 && val <= 15) setInflation(val);
                  }}
                  className="w-20 border rounded-lg px-3 py-1 pr-6 
                             bg-gray-50 dark:bg-gray-800 
                             border-gray-300 dark:border-gray-700 
                             text-gray-800 dark:text-gray-200 text-center"
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 
                                 text-gray-500 dark:text-gray-400">
                  %
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE SUMMARY */}
      <div
        className="rounded-xl border border-gray-200 dark:border-gray-600
                      bg-gray-50 dark:bg-gray-800 p-3
                      flex flex-col gap-6 transition-all"
      >
        <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400">
          SIP Need Summary
        </h2>

        <div className="space-y-4">
          <div className="text-center">
            <p className="text-gray-500 dark:text-gray-400 text-xs">
              Required Monthly SIP
            </p>
            <h3 className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              ₹{format(sipRequired)}
            </h3>
          </div>

          <div className="text-center">
            <p className="text-gray-500 dark:text-gray-400 text-xs">
              Inflation Adjusted Target
            </p>
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
              ₹{format(inflationAdjustedTarget)}
            </h3>
          </div>

          <div className="text-center">
            <p className="text-gray-500 dark:text-gray-400 text-xs">
              Total Investment
            </p>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              ₹{format(totalInvestment)}
            </h3>
          </div>

          <div className="text-center">
            <p className="text-gray-500 dark:text-gray-400 text-xs">
              Growth Multiple
            </p>
            <h3 className="text-lg font-semibold text-green-600">
              {format2(growthMultiple)} X
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}
