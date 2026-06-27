import { ForecastMonth } from "./forecast-month";

export interface PipelineForecast {
  by_month: ForecastMonth[];
  totals: {
    total_value: number;
    weighted_value: number;
    deal_count: number;
  };
}
