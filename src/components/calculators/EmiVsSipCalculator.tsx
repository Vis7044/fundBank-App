
import { useState, useMemo } from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  ArcElement,
  Tooltip,
  Legend
);
const sliderFill = (value: number, min: number, max: number) => ((value - min) * 100) / (max - min);
export default function EmiVsSipCalculator() {
  const [loanAmount, setLoanAmount] = useState(1500000);
  const [interestRate, setInterestRate] = useState('9');
  const [years, setYears] = useState(15);
  const [sipAllocation, setSipAllocation] = useState(10000); // Amount to invest in SIP
  const [sipRate, setSipRate] = useState('12');

  // Calculate full EMI
  const n = years * 12;
  const r = parseFloat(interestRate) / 1200;
  const fullEMI =
    (loanAmount * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1);

  // Scenario 1: Pay full EMI (no SIP)
  const scenario1 = useMemo(() => {
    const totalPaid = fullEMI * n;
    const totalInterest = totalPaid - loanAmount;
    return {
      monthlyPayment: fullEMI,
      tenure: years,
      totalPaid,
      totalInterest,
      finalAmount: 0,
      netCost: totalPaid,
    };
  }, [fullEMI, n, loanAmount, years]);

  // Scenario 2: Pay reduced EMI + SIP investment
    const scenario2 = useMemo(() => {
    const reducedEMI = fullEMI - sipAllocation;
    
    // If reduced EMI is too low, return default
    if (reducedEMI <= 0 || sipAllocation <= 0) {
      return {
        monthlyPayment: reducedEMI,
        monthlyEMI: reducedEMI,
        monthlySIP: sipAllocation,
        tenure: years,
        totalPaidToLoan: 0,
        totalInterest: 0,
        totalInvestedInSIP: 0,
        sipValue: 0,
        remainingLoan: loanAmount,
        finalAmount: 0,
        netCost: 0,
        valid: false,
      };
    }

    // Fixed tenure: same as original loan (15 years)
    const fixedMonths = years * 12;

    // Calculate remaining loan balance after paying reduced EMI for 15 years
    // Using loan balance formula: B = P(1+r)^n - EMI * [((1+r)^n - 1) / r]
    const remainingLoan = loanAmount * Math.pow(1 + r, fixedMonths) - 
                          reducedEMI * ((Math.pow(1 + r, fixedMonths) - 1) / r);

    // Calculate interest paid during these 15 years
    const totalPaidToLoan = reducedEMI * fixedMonths;
    const principalPaid = loanAmount - remainingLoan;
    const interestPaidDuringTenure = totalPaidToLoan - principalPaid;

    // Calculate SIP future value after 15 years
    const sipR = parseFloat(sipRate) / 1200;
    const sipFutureValue = sipAllocation * 
      (((Math.pow(1 + sipR, fixedMonths) - 1) / sipR) * (1 + sipR));

    const totalInvestedInSIP = sipAllocation * fixedMonths;
    
    // After 15 years: Use SIP to pay remaining loan
    const amountLeftAfterPayingLoan = sipFutureValue - remainingLoan;
    
    // Total money spent = reduced EMI payments + invested in SIP
    const totalMoneySpent = totalPaidToLoan + totalInvestedInSIP;
    
    // Net cost = Total spent - Amount left after clearing loan
    const netCost = totalMoneySpent - amountLeftAfterPayingLoan;

    return {
      monthlyPayment: fullEMI,
      monthlyEMI: reducedEMI,
      monthlySIP: sipAllocation,
      tenure: years,
      tenureMonths: fixedMonths,
      totalPaidToLoan,
      totalInterest: interestPaidDuringTenure,
      sipValue: sipFutureValue,
      totalInvestedInSIP,
      remainingLoan: Math.max(0, remainingLoan),
      finalAmount: Math.max(0, amountLeftAfterPayingLoan),
      netCost,
      valid: remainingLoan > 0, // Valid only if there's actually a remaining loan to pay
    };
  }, [fullEMI, sipAllocation, loanAmount, r, sipRate, years]);

  // Line chart comparing both scenarios
   const lineData = {
    labels: Array.from({ length: Math.ceil(Math.max(scenario1.tenure, scenario2.tenure || 0)) + 1 }).map(
      (_, i) => `Year ${i}`
    ),
    datasets: [
      {
        label: "Scenario 1: Total Paid (Full EMI)",
        data: Array.from({ length: Math.ceil(scenario1.tenure) + 1 }).map((_, i) => 
          Math.min(fullEMI * i * 12, scenario1.totalPaid)
        ),
        borderWidth: 3,
        borderColor: "rgb(239, 68, 68)",
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        tension: 0.3,
      },
      {
        label: "Scenario 2: SIP Value",
        data: scenario2.valid ? Array.from({ length: Math.ceil(scenario2.tenure) + 1 }).map((_, i) => {
          const months = i * 12;
          const sipR = parseFloat(sipRate) / 1200;
          return sipAllocation * (((Math.pow(1 + sipR, months) - 1) / sipR) * (1 + sipR));
        }) : [],
        borderWidth: 3,
        borderColor: "rgb(34, 197, 94)",
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        tension: 0.3,
      },
      {
        label: "Scenario 2: Loan Paid",
        data: scenario2.valid ? Array.from({ length: Math.ceil(scenario2.tenure) + 1 }).map((_, i) => 
          Math.min(scenario2.monthlyEMI * i * 12, scenario2.totalPaidToLoan)
        ) : [],
        borderWidth: 3,
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.3,
        borderDash: [5, 5],
      },
    ],
  };

  // Doughnut chart for Scenario 2
  const doughnutData = {
    labels: ["Principal Paid", "Interest Paid", "Remaining Loan", "SIP Gains"],
    datasets: [
      {
        data: scenario2.valid ? [
          loanAmount - scenario2.remainingLoan,
          scenario2.totalInterest,
          scenario2.remainingLoan,
          scenario2.sipValue - scenario2.totalInvestedInSIP,
        ] : [100],
        backgroundColor: ["#60a5fa", "#f87171", "#fbbf24", "#34d399"],
        borderWidth: 0,
      },
    ],
  };

  const maxSipAllocation = Math.floor(fullEMI * 0.9); // Max 90% of EMI

  return (
    <div className="min-h-screen p-2">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-800 dark:text-white">
          EMI vs SIP Strategy Calculator
        </h1>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* LEFT SIDE — INPUTS */}
          <div className="space-y-6 w-[95%] mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 space-y-5">
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
                Loan Details
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                  Loan Amount (₹)
                </label>
                <input
                  value={loanAmount}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (val >= 0) setLoanAmount(val);
                  }}
                  type="number"
                  className="w-full p-3 border rounded-xl bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                  Loan Interest Rate (% per annum)
                </label>
                <input
                  value={interestRate}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === '') {
                      setInterestRate('');
                      return;
                    }
                    const num = parseFloat(val);
                    if (!isNaN(num) && num >= 0 && num <= 25) {
                      setInterestRate(num.toString());
                    }
                  }}
                  type="number"
                  className="w-full p-3 border rounded-xl bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                  Loan Tenure (Years)
                </label>
                <input
                  value={years}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (val >= 0 && val <= 30) setYears(val);
                  }}
                  type="number"
                  className="w-full p-3 border rounded-xl bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white"
                />
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">
                    Full Monthly EMI
                  </label>
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    ₹{Math.round(fullEMI).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 space-y-5">
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
                SIP Strategy
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                  Amount to Invest in SIP (₹)
                </label>
                <input
                  type="range"
                  min="0"
                  max={maxSipAllocation}
                  step="1"
                  value={sipAllocation}
                  onChange={(e) => setSipAllocation(Number(e.target.value))}
                  className="w-full custom-slider h-2 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #2B7FFF ${sliderFill(sipAllocation, 0, maxSipAllocation)}%, #CBD5E1 ${sliderFill(sipAllocation, 0, maxSipAllocation)}%)`,
              }}
                />
                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-1">
                  <span>₹0</span>

                  <input
                    type="text"
                    className="font-semibold text-lg text-gray-800 dark:text-gray-200 bg-transparent border-b-2 border-gray-300 dark:border-gray-600 focus:outline-none focus:border-gray-500 text-center w-32"
                    value={`₹${sipAllocation.toLocaleString()}`}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[₹,\s]/g, '');
                      if (val === '') {
                        setSipAllocation(0);
                        return;
                      }
                      const num = parseFloat(val);
                      if (!isNaN(num) && num >= 0 && num <= maxSipAllocation) {
                        setSipAllocation(Math.round(num));
                      }
                    }}
                    onBlur={(e) => {
                      const val = e.target.value.replace(/[₹,\s]/g, '');
                      const num = parseFloat(val);
                      if (isNaN(num) || num < 0) {
                        setSipAllocation(0);
                      } else if (num > maxSipAllocation) {
                        setSipAllocation(maxSipAllocation);
                      }
                    }}
                  />
                  <span>₹{maxSipAllocation.toLocaleString()}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                  Expected SIP Return (% per annum)
                </label>
                <input
                  value={sipRate}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === '') {
                      setSipRate('');
                      return;
                    }
                    const num = parseFloat(val);
                    if (!isNaN(num) && num >= 0 && num <= 30) {
                      setSipRate(num.toString());
                    }
                  }}
                  type="number"
                  step="0.1"
                  className="w-full p-3 border rounded-xl bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white"
                />
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">
                    Monthly EMI Payment:
                  </span>
                  <span className="font-semibold text-gray-800 dark:text-white">
                    ₹{Math.round(fullEMI - sipAllocation).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">
                    Monthly SIP Investment:
                  </span>
                  <span className="font-semibold text-gray-800 dark:text-white">
                    ₹{sipAllocation.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE — RESULTS */}
          <div className="flex flex-col w-[95%] mx-auto space-y-6">
            {/* Comparison Cards */}
            <div className="flex flex-col gap-4">
              {/* Scenario 1 */}
              <div className="bg-linear-to-br from-slate-50 to-slate-100 dark:from-gray-600/20 dark:to-gray-700/20 rounded-2xl shadow-xl p-6">
                <h3 className="text-lg font-semibold text-red-700 dark:text-red-300 mb-4">
                  Scenario 1: Pay Full EMI Only
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      Tenure:
                    </span>
                    <span className="font-semibold text-gray-800 dark:text-white">
                      {scenario1.tenure} years
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      Total Paid:
                    </span>
                    <span className="font-semibold text-gray-800 dark:text-white">
                      ₹{Math.round(scenario1.totalPaid).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      Interest Paid:
                    </span>
                    <span className="font-semibold text-gray-800 dark:text-white">
                      ₹{Math.round(scenario1.totalInterest).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-red-200 dark:border-red-700">
                    <span className="text-gray-700 dark:text-gray-200 font-medium">
                      Net Cost:
                    </span>
                    <span className="font-bold text-xl text-red-600 dark:text-red-400">
                      ₹{Math.round(scenario1.netCost).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Scenario 2 */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-2xl shadow-xl p-6">
                <h3 className="text-lg font-semibold text-green-700 dark:text-green-300 mb-4">
                  Scenario 2: Reduced EMI + SIP Investment
                </h3>
                {scenario2.valid ? (
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Tenure:</span>
                      <span className="font-semibold text-gray-800 dark:text-white">
                        {scenario2.tenure} years (same as loan tenure)
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Total Paid to Loan:</span>
                      <span className="font-semibold text-gray-800 dark:text-white">
                        ₹{Math.round(scenario2.totalPaidToLoan).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Total Invested in SIP:</span>
                      <span className="font-semibold text-gray-800 dark:text-white">
                        ₹{Math.round(scenario2.totalInvestedInSIP).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">SIP Final Value:</span>
                      <span className="font-semibold text-green-600 dark:text-green-400">
                        ₹{Math.round(scenario2.sipValue).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Remaining Loan (After {years} yrs):</span>
                      <span className="font-semibold text-orange-600 dark:text-orange-400">
                        ₹{Math.round(scenario2.remainingLoan).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Amount Left After Clearing Loan:</span>
                      <span className="font-semibold text-green-600 dark:text-green-400">
                        ₹{Math.round(scenario2.finalAmount).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between pt-3 border-t border-green-200 dark:border-green-700">
                      <span className="text-gray-700 dark:text-gray-200 font-medium">Net Cost:</span>
                      <span className="font-bold text-xl text-green-600 dark:text-green-400">
                        ₹{Math.round(scenario2.netCost).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-red-600 dark:text-red-400">
                    Please allocate some amount to SIP to compare scenarios.
                  </p>
                )}
              </div>

              {/* Savings Comparison */}
              {scenario2.valid && (
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl shadow-xl p-6">
                  <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-300 mb-4">
                    {scenario2.netCost < scenario1.netCost
                      ? '✅ Better Option'
                      : '⚠️ Comparison'}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">
                        Net Savings:
                      </span>
                      <span
                        className={`font-bold text-xl ${
                          scenario2.netCost < scenario1.netCost
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-red-600 dark:text-red-400'
                        }`}
                      >
                        ₹
                        {Math.abs(
                          Math.round(scenario1.netCost - scenario2.netCost)
                        ).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {scenario2.netCost < scenario1.netCost
                        ? '🎉 Scenario 2 (SIP + Reduced EMI) is better! You save money while building wealth.'
                        : '⚠️ Scenario 1 (Full EMI) results in lower net cost, but you have no savings at the end.'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Charts */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
                Growth Comparison Over Time
              </h3>
              <Line
                data={lineData}
                options={{ responsive: true, maintainAspectRatio: true }}
              />
            </div>

            {scenario2.valid && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
                  Scenario 2: Breakdown
                </h3>
                <Doughnut
                  data={doughnutData}
                  options={{ responsive: true, maintainAspectRatio: true }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
