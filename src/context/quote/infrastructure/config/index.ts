import config from "src/app/config"

export default {
  CRYPTO_MKT_PRICE_RATE_URL: (from: string, to: string) => {
    return `${config.CRYPTO_MKT.EXCHANGE_BASE_URL}/api/3/public/price/rate?from=${from}&to=${to}`
  }
}
