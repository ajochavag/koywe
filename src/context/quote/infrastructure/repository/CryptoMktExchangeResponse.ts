export interface CryptoMktExchangeResponse {
  [key: string]: {
    currency: string;
    price: string;
    timestamp: string;
  };
}