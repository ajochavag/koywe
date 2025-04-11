export interface QuoteRequest {
    amount: number;
    from: string;
    to: string;
  }
  
  export interface QuoteResponse {
    id: string;
    from: string;
    to: string;
    amount: number;
    rate: number;
    convertedAmount: number;
    timestamp: string;
    expiresAt: string;
  }
  