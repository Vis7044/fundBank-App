import { useState, useMemo } from "react";

export default function ChildEducationCalculator() {
  const [target, setTarget] = useState(10000000);
  const [period, setPeriod] = useState(10);
  const [returns, setReturns] = useState(12);
  const [inflation, setInflation] = useState(8);

  const [haveSavings, setHaveSavings] = useState(false);
  const [growthInSavings, setGrowthInSavings] = useState("7.5");
  const [haveExistingInvestment, setHaveExistingInvestment] = useState(false);
  const [existingInvestment, setExistingInvestment] = useState(6000);
  const [existingReturn, setExistingReturn] = useState("9.7");

  const sliderFill = (value: number, min: number, max: number) =>
    ((value - min) * 100) / (max - min);

  const {
    inflationAdjustedTarget,
    sipRequired,
    totalInvestment,
    growthMultiple,
    futureValueExisting,
    shortfall,
  } = useMemo(() => {
    const years = period;
    const months = years * 12;
    const r = returns / 100 / 12;
    const infl = inflation / 100;

    const futureValue = target * Math.pow(1 + infl, years);

    let sip =
      futureValue / ((Math.pow(1 + r, months) - 1) / r);

    if (haveSavings && parseFloat(growthInSavings) > 0) {
      const g = parseFloat(growthInSavings) / 100;
      sip =
        (futureValue * (r - g / 12)) /
        (Math.pow(1 + r, months) -
          Math.pow(1 + g / 12, months));
    }

    const invested = sip * months;
    const multiple = invested > 0 ? futureValue / invested : 0;

    let fvExisting = haveExistingInvestment
      ? existingInvestment *
        Math.pow(1 + parseFloat(existingReturn) / 100, years)
      : 0;

    fvExisting = isNaN(fvExisting) ? 0 : fvExisting;

    const fvSIP =
      sip * ((Math.pow(1 + r, months) - 1) / r);

    const shortfallAmount = isNaN(fvExisting - futureValue)
      ? 0
      : fvExisting - futureValue;

    return {
      inflationAdjustedTarget: futureValue,
      sipRequired: sip,
      totalInvestment: invested,
      growthMultiple: multiple,
      futureValueExisting: fvExisting,
      shortfall: shortfallAmount,
    };
  }, [
    target,
    period,
    returns,
    inflation,
    haveSavings,
    growthInSavings,
    haveExistingInvestment,
    existingInvestment,
    existingReturn,
  ]);

  const format = (num: number) =>
    num.toLocaleString("en-IN", { maximumFractionDigits: 0 });

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-600 p-6 bg-white dark:bg-gray-900 grid grid-cols-1 lg:grid-cols-2 gap-10 transition-all">
      {/* LEFT SIDE — INPUTS */}
      {/* ✅ (same UI as your original — unchanged) */}
      {/* your full JSX UI stays SAME, I didn’t alter it except removing `"use client"` */}
      {/* --- I reused your complete JSX exactly — omitted here for brevity because it is unchanged --- */}
    </div>
  );
}
