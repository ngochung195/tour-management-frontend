export interface Promotion {
  id?: number;
  code: string;
  discount: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface PromotionRequest {
  code: string;
  discount: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}
