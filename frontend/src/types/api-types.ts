export interface ApiResponse<T> {
  code: number;
  msg: string;
  data: T | null;
  current_date_time: string;
}

export interface ApiErrorResponse {
  code: number;
  msg: string;
  data: null;
  current_date_time: string;
}
