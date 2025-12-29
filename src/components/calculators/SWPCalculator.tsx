import React, { useState, useEffect, useRef } from "react";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { Download } from "lucide-react";
import fundService from "../../services/fundService";
import type { SchemeName } from "../../services/fundService";
import { Select } from "antd";
import { useTheme } from "../../utils/ThemeProvider";

// -----------------------
// XIRR CALCULATOR
// -----------------------
function xirr(cashflows: number[], dates: Date[], guess = 0.1) {
  const f = (rate: number) =>
    cashflows.reduce((sum, cf, i) => {
      const days =
        (dates[i].getTime() - dates[0].getTime()) / (1000 * 3600 * 24);
      return sum + cf / Math.pow(1 + rate, days / 365);
    }, 0);

  let rate = guess;

  for (let i = 0; i < 100; i++) {
    const f1 = f(rate);
    const f2 = (f(rate + 1e-6) - f(rate - 1e-6)) / 2e-6;
    const newRate = rate - f1 / f2;

    if (Math.abs(newRate - rate) < 1e-7) break;
    rate = newRate;
  }

  return rate;
}

// ---------------------------------------------------
// AMC LIST
// ---------------------------------------------------
const amcList = [
  "Aditya Birla Sun Life Mutual Fund",
  "Angel One Mutual Fund",
  "Axis Mutual Fund",
  "Bajaj Finserv Mutual Fund",
  "Bandhan Mutual Fund",
  "Bank of India Mutual Fund",
  "Baroda BNP Paribas Mutual Fund",
  "Canara Robeco Mutual Fund",
  "Capitalmind Mutual Fund",
  "Choice Mutual Fund",
  "DSP Mutual Fund",
  "Edelweiss Mutual Fund",
  "Franklin Templeton Mutual Fund",
  "Groww Mutual Fund",
  "HDFC Mutual Fund",
  "HSBC Mutual Fund",
  "Helios Mutual Fund",
  "ICICI Prudential Mutual Fund",
  "IL&FS Mutual Fund (IDF)",
  "ITI Mutual Fund",
  "Invesco Mutual Fund",
  "JM Financial Mutual Fund",
  "Jio BlackRock Mutual Fund",
  "Kotak Mahindra Mutual Fund",
  "LIC Mutual Fund",
  "Mahindra Manulife Mutual Fund",
  "Mirae Asset Mutual Fund",
  "Motilal Oswal Mutual Fund",
  "NJ Mutual Fund",
  "Navi Mutual Fund",
  "Nippon India Mutual Fund",
  "Old Bridge Mutual Fund",
  "PGIM India Mutual Fund",
  "PPFAS Mutual Fund",
  "Quantum Mutual Fund",
  "SBI Mutual Fund",
  "Samco Mutual Fund",
  "Shriram Mutual Fund",
  "Sundaram Mutual Fund",
  "Tata Mutual Fund",
  "Taurus Mutual Fund",
  "The Wealth Company Mutual Fund",
  "Trust Mutual Fund",
  "UTI Mutual Fund",
  "Unifi Mutual Fund",
  "Union Mutual Fund",
  "WhiteOak Capital Mutual Fund",
  "Zerodha Mutual Fund",
  "quant Mutual Fund",
];

export default function SWPCalculator() {
  const [darkMode] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [amc, setAmc] = useState<string>("Mirae Asset Mutual Fund");
  const [schemeNames, setSchemeNames] = useState<SchemeName[]>([]);
  const selectRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const { theme } = useTheme();

  const [swpResult, setSwpResult] = useState({
    installments: 0,
    totalWithdrawn: 0,
    returnPerc: 0,
  });

  const [formData, setFormData] = useState({
    scheme_code: "119551",
    swp_date: 10,
    invest_date: "2016-08-20",
    start_date: "2016-08-20",
    total_invested_amount: 1000000,
    end_date: "2025-12-07",
    withdrawal_amount: 3000,
    interval: "monthly",
  });

  const fetchSchemeNames = async (amc: string) => {
    try {
      const res = await fundService.getSchemeNames(amc);
      if (!res.ok) return;
      setSchemeNames(res.data);
    } catch (e) {
      console.error("Error loading schemes", e);
    }
  };

  useEffect(() => {
    fetchSchemeNames(amc);
  }, [amc]);

  useEffect(() => {
    const fetchSwpResult = async () => {
      try {
        const res = await fundService.calculateSwp(formData);
        if (!res.ok) return;

        const chartData = res.data.swp_report.map((r: any) => ({
          date: r.current_date,
          value: Number(r.current_value),
        }));

        setResult({
          ...res.data,
          data: chartData,
        });
      } catch (error) {
        console.error("Error calculating SWP:", error);
      }
    };

    fetchSwpResult();
  }, []);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;

    const numberFields = [
      "total_invested_amount",
      "withdrawal_amount",
      "swp_date",
    ];

    setFormData((prev) => ({
      ...prev,
      [name]: numberFields.includes(name) ? Number(value) : value,
    }));
  };

  const handleSchemeChange = (value: string) => {
    const selectedScheme = schemeNames.find((s) => s.scheme_code === value);
    if (selectedScheme) {
      setFormData((prev) => ({
        ...prev,
        scheme_code: selectedScheme.scheme_code,
      }));
      setIsOpen(false);
    }
  };

  const handleDropdownVisibleChange = (open: boolean) => {
    setIsOpen(open);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const totalTimeIntervals = (interval: string) => {
      switch (interval) {
        case "weekly":
          return 7;
        case "fortnightly":
          return 14;
        case "monthly":
          return 30;
        case "quarterly":
          return 90;
        default:
          return 0;
      }
    };

    const endDate = new Date(formData.end_date);
    const startDate = new Date(formData.start_date);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const totalInstallments =
      diffDays / totalTimeIntervals(formData.interval);

    setSwpResult({
      ...swpResult,
      totalWithdrawn: totalInstallments * formData.withdrawal_amount,
      installments: totalInstallments,
    });

    try {
      const res = await fundService.calculateSwp(formData);
      if (!res.ok) return;

      const chartData = res.data.swp_report.map((r: any) => ({
        date: r.current_date,
        value: Number(r.current_value),
      }));

      const cashflows: number[] = [];
      const dates: Date[] = [];

      cashflows.push(-formData.total_invested_amount);
      dates.push(new Date(formData.invest_date));

      res.data.swp_report.forEach((r: any) => {
        cashflows.push(r.cash_flow);
        dates.push(new Date(r.current_date));
      });

      const last =
        res.data.swp_report[res.data.swp_report.length - 1];

      if (last) {
        cashflows.push(last.current_value);
        dates.push(new Date(last.current_date));
      }

      let irr = xirr(cashflows, dates) * 100;

      setSwpResult((prev) => ({
        ...prev,
        returnPerc: irr,
      }));

      setResult({
        ...res.data,
        data: chartData,
      });
    } catch (error) {
      console.error("Error calculating SWP:", error);
    }
  };

  const DateInput = ({ label, name, value }: any) => (
    <div className="space-y-2">
      <label className="text-xs font-semibold uppercase">{label}</label>
      <input
        type="date"
        name={name}
        value={value}
        onChange={handleInputChange}
        className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-600 
                     bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-gray-300"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 dark:text-gray-100 text-gray-900">
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">

        {/* ======================== INPUT ======================== */}
        ...
        {/* (REMAINS SAME AS YOUR ORIGINAL — everything below you pasted remains unchanged) */}
        {/* I didn’t modify UI logic — only conversions needed for Vite are above */}

      </div>
    </div>
  );
}
