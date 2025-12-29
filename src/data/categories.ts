export type SubLesson = {
    id: string;
    title: string;
    summary: string;
    timeMinutes?: number;
    level?: "beginner" | "intermediate" | "advanced";
  };
  
  export type Category = {
    name: string;
    subtitle?: string;
    level?: "beginner" | "intermediate" | "advanced";
    subcategories: SubLesson[];
  };
  
  export const categories: Category[] = [
    {
      name: "Mutual Funds",
      subtitle: "Understand how pooled investment products work",
      level: "beginner",
      subcategories: [
        {
          id: "mf-1",
          title: "What is a Mutual Fund",
          summary:
            "A mutual fund collects money from many investors and invests it in stocks, bonds, or a mix of both. A professional fund manager handles all decisions for you.",
          timeMinutes: 4,
          level: "beginner",
        },
        {
          id: "mf-2",
          title: "Types of Mutual Funds",
          summary:
            "Equity funds invest in stocks, debt funds invest in bonds, hybrid funds mix both. Each type has a different level of risk and return potential.",
          timeMinutes: 6,
          level: "beginner",
        },
        {
          id: "mf-3",
          title: "What is NAV?",
          summary:
            "NAV means Net Asset Value — the per-unit price of a mutual fund. It changes daily based on the value of the underlying investments.",
          timeMinutes: 3,
          level: "beginner",
        },
        {
          id: "mf-4",
          title: "Expense Ratio Explained",
          summary:
            "It’s a small annual fee charged by the fund to manage your money. Lower expense ratios generally leave more returns for the investor.",
          timeMinutes: 4,
          level: "intermediate",
        },
      ],
    },
    {
      name: "SIP (Systematic Investment Plan)",
      subtitle: "Invest small amounts regularly and build wealth",
      level: "beginner",
      subcategories: [
        {
          id: "sip-1",
          title: "How SIP Works",
          summary:
            "SIP automates your investment every month. You buy mutual fund units consistently, regardless of the market’s ups and downs.",
          timeMinutes: 4,
          level: "beginner",
        },
        {
          id: "sip-2",
          title: "Rupee Cost Averaging",
          summary:
            "SIP buys more units when prices are low and fewer when prices are high. Over time, this averages out your purchase cost.",
          timeMinutes: 4,
          level: "beginner",
        },
        {
          id: "sip-3",
          title: "Power of Compounding",
          summary:
            "Your returns start earning returns over time. The earlier you start and the longer you stay invested, the bigger the compounding effect.",
          timeMinutes: 5,
          level: "beginner",
        },
        {
          id: "sip-4",
          title: "SIP vs Lump Sum",
          summary:
            "Lump-sum works well when markets are low. SIP works best for building long-term habits and reducing timing risk.",
          timeMinutes: 5,
          level: "intermediate",
        },
      ],
    },
    {
      name: "Stock Market Basics",
      subtitle: "Understand how shares and companies work",
      level: "beginner",
      subcategories: [
        {
          id: "stk-1",
          title: "What is a Stock?",
          summary:
            "A stock represents ownership in a company. When the company grows, its stock value generally increases, benefiting shareholders.",
          timeMinutes: 4,
          level: "beginner",
        },
        {
          id: "stk-2",
          title: "How Stock Prices Move",
          summary:
            "Prices rise when demand increases and fall when supply increases. News, earnings, sector growth, and investor sentiment all influence price.",
          timeMinutes: 6,
          level: "beginner",
        },
        {
          id: "stk-3",
          title: "Market vs Limit Orders",
          summary:
            "Market orders buy instantly at current price. Limit orders buy only at your chosen price. Both are tools to control your trades.",
          timeMinutes: 4,
          level: "intermediate",
        },
        {
          id: "stk-4",
          title: "Dividends Explained",
          summary:
            "Some companies share part of their profits with stockholders. This cash reward is called a dividend.",
          timeMinutes: 3,
          level: "beginner",
        },
      ],
    },
    {
      name: "Risk & Return",
      subtitle: "Learn how risk works and why it matters",
      level: "intermediate",
      subcategories: [
        {
          id: "risk-1",
          title: "Types of Investment Risks",
          summary:
            "Market risk, credit risk, interest-rate risk, inflation risk — each affects your investments differently.",
          timeMinutes: 5,
          level: "intermediate",
        },
        {
          id: "risk-2",
          title: "Volatility Explained",
          summary:
            "Volatility is how much prices go up and down. High volatility means bigger swings and more uncertainty.",
          timeMinutes: 4,
          level: "intermediate",
        },
        {
          id: "risk-3",
          title: "Matching Risk to Your Goals",
          summary:
            "Short-term goals prefer stable investments (debt funds), while long-term goals benefit from equity exposure.",
          timeMinutes: 5,
          level: "intermediate",
        },
      ],
    },
    {
      name: "Investing Strategies",
      subtitle: "Practical ways to grow wealth",
      level: "intermediate",
      subcategories: [
        {
          id: "str-1",
          title: "Asset Allocation",
          summary:
            "Divide your money between equity, debt, and gold based on your risk tolerance and time horizon. This balances growth and safety.",
          timeMinutes: 6,
          level: "intermediate",
        },
        {
          id: "str-2",
          title: "Diversification",
          summary:
            "Don’t put all your money into one asset. Spread it across sectors and instruments to reduce risk.",
          timeMinutes: 4,
          level: "beginner",
        },
        {
          id: "str-3",
          title: "Goal-Based Investing",
          summary:
            "Plan your investments based on life goals — education, retirement, buying a house. Choose assets matching each goal’s timeframe.",
          timeMinutes: 6,
          level: "intermediate",
        },
        {
          id: "str-4",
          title: "Long-Term vs Short-Term Investing",
          summary:
            "Short-term investing is more volatile. Long-term investing smooths out market fluctuations and increases the chances of better returns.",
          timeMinutes: 5,
          level: "beginner",
        },
      ],
    },
    {
      name: "Other Asset Classes",
      subtitle: "Gold, bonds, real estate & diversification",
      level: "beginner",
      subcategories: [
        {
          id: "oa-1",
          title: "Gold as an Investment",
          summary:
            "Gold protects wealth during inflation and market stress. It works best as a small part of a diversified portfolio.",
          timeMinutes: 4,
          level: "beginner",
        },
        {
          id: "oa-2",
          title: "Bonds & Fixed Income",
          summary:
            "Bonds offer stability and regular interest. Ideal for conservative investors or near-term goals.",
          timeMinutes: 5,
          level: "beginner",
        },
        {
          id: "oa-3",
          title: "Real Estate Basics",
          summary:
            "Property investing provides rental income and long-term growth but requires high capital and lower liquidity.",
          timeMinutes: 6,
          level: "intermediate",
        },
      ],
    },
  ];
  