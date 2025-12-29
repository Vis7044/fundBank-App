import axiosInstance from "../utils/axiosInstance";   // <-- changed

export interface FundNAVResponse {
  amc_img: string;
  meta: any;
  data: { date: string; nav: number }[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface SchemeName {
  scheme_code: string;
  scheme_name: string;
}

// swp.types.ts
export interface IntervalNav {
  date: string;
  nav: string;
}

export interface SwpReportItem {
  units: number;
  cumulative_units: number;
  cash_flow: number;
  net_amount: number;
  capital_gains_loss: number;
  current_nav: number;
  current_value: number;
  current_date: string;
}

export interface SwpResponse {
  file_path: string;
  interval_nav: IntervalNav[];
  success: boolean;
  swp_report: SwpReportItem[];
}

export interface SwpPostData {
  scheme_code: string;
  swp_date: number;
  invest_date: string;
  start_date: string;
  end_date: string;
  total_invested_amount: number;
  withdrawal_amount: number;
  interval: string;
}

export interface MutualFundScheme {
  id: string;
  scheme_code: string;
  isin_growth: string;
  isin_reinvest: string;
  scheme_name: string;
  parent_name: string;
  parent_key: string;
  fund_house: string;
  fund_house_key: string;
  category_header: string;
  category: string;
  sub_category: string;
  y1_return: number;
  y3_return: number;
  y5_return: number;
  cagr_1y: number;
  cagr_3y: number;
  cagr_5y: number;
  plan_type: string;
  option_type: string;
  frequency: string;
  nav: number;
  nav_date: string;
  display_name: string;
  amc_img: string;
}

export interface FundDetails {
  scheme_code: string;
  scheme_name: string;
  fund_house: string;
  category: string;
  plan_type: string;
  parent_name: string;
  amc_img: string;
  cagr_3y: number;
  display_name: string;
}

export type SafeResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

class FundService {
  async getFundNAV(
    schemeCode: string,
    start?: string,
    end?: string
  ): Promise<SafeResult<FundNAVResponse>> {
    try {
      const res = await axiosInstance.get<FundNAVResponse>(
        `/funds/${schemeCode}`,
        { params: { startDate: start, endDate: end } }
      );

      if (!res.data?.data || !Array.isArray(res.data.data)) {
        return { ok: false, error: "Invalid NAV response" };
      }

      return { ok: true, data: res.data };
    } catch (err: any) {
      return { ok: false, error: err.message ?? "NAV fetch failed" };
    }
  }

  async getAllFunds(
    page: number,
    limit: number,
    category: string[],
    fundhouse: string[],
    sortBy?: string,
    order?: number
  ): Promise<SafeResult<MutualFundScheme[]>> {
    try {
      const res = await axiosInstance.get<ApiResponse<MutualFundScheme[]>>(
        "/funds/allfunds",
        {
          params: { page, limit, category, fundhouse, sortBy, order },
        }
      );

      if (!res.data?.success || !Array.isArray(res.data.data)) {
        return { ok: false, error: "Invalid fund list response" };
      }

      return { ok: true, data: res.data.data };
    } catch (err: any) {
      return { ok: false, error: err.message ?? "Fund fetch failed" };
    }
  }

  async getSchemeNames(amcName: string): Promise<SafeResult<SchemeName[]>> {
    try {
      const res = await axiosInstance.get<SchemeName[]>(
        `/funds/amc/${amcName}`
      );

      if (!Array.isArray(res.data)) {
        return { ok: false, error: "Invalid scheme name response" };
      }

      return { ok: true, data: res.data };
    } catch (err: any) {
      return { ok: false, error: err.message ?? "Scheme fetch failed" };
    }
  }

  async calculateSwp(
    postData: SwpPostData
  ): Promise<SafeResult<SwpResponse>> {
    try {
      const res = await axiosInstance.post<SwpResponse>(
        "/funds/swp",
        postData
      );

      if (!res.data?.success || !Array.isArray(res.data.swp_report)) {
        return { ok: false, error: "Invalid SWP response" };
      }

      return { ok: true, data: res.data };
    } catch (err: any) {
      return { ok: false, error: err.message ?? "SWP calculation failed" };
    }
  }

  async searchFunds(
    query: string,
    signal?: AbortSignal,
    pagination?: { page: number; limit: number }
  ): Promise<SafeResult<MutualFundScheme[]>> {
    try {
      const { page = 1, limit = 5 } = pagination ?? {};

      const res = await axiosInstance.get<ApiResponse<MutualFundScheme[]>>(
        "/funds/search",
        {
          signal,
          params: { query, page, limit },
        } as any
      );

      if (!res.data?.success || !Array.isArray(res.data.data)) {
        return { ok: false, error: "Invalid search response" };
      }

      return { ok: true, data: res.data.data };
    } catch (err: any) {
      return { ok: false, error: err.message ?? "Search failed" };
    }
  }

  async getCategories(): Promise<SafeResult<string[]>> {
    try {
      const res = await axiosInstance.get<ApiResponse<string[]>>(
        "/funds/categories/list"
      );

      if (!res.data?.success || !Array.isArray(res.data.data)) {
        return { ok: false, error: "Invalid category response" };
      }

      return { ok: true, data: res.data.data };
    } catch (error: any) {
      return { ok: false, error: error.message ?? "Category fetch failed" };
    }
  }

  async getTopFunds(category: string): Promise<SafeResult<FundDetails[]>> {
    try {
      const res = await axiosInstance.get<ApiResponse<FundDetails[]>>(
        `/funds/top/${category}`,
        { params: { limit: 3 } }
      );

      if (!res.data?.success || !Array.isArray(res.data.data)) {
        return { ok: false, error: "Invalid top funds response" };
      }

      return { ok: true, data: res.data.data };
    } catch (error: any) {
      return { ok: false, error: error.message ?? "Top funds fetch failed" };
    }
  }
}

export default new FundService();
