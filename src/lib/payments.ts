export type SupportedCurrency =
  | "BTC"
  | "LTC"
  | "ETH"
  | "BNB"
  | "USDC_ETH"
  | "USDT_ETH"
  | "USDC_BSC"
  | "USDT_BSC";

export const SUPPORTED_CURRENCIES: Record<
  SupportedCurrency,
  { network: string; symbol: string; mockUsdPrice: number }
> = {
  BTC: { network: "bitcoin", symbol: "BTC", mockUsdPrice: 68000 },
  LTC: { network: "litecoin", symbol: "LTC", mockUsdPrice: 85 },
  ETH: { network: "ethereum", symbol: "ETH", mockUsdPrice: 3500 },
  BNB: { network: "bsc", symbol: "BNB", mockUsdPrice: 580 },
  USDC_ETH: { network: "ethereum", symbol: "USDC", mockUsdPrice: 1 },
  USDT_ETH: { network: "ethereum", symbol: "USDT", mockUsdPrice: 1 },
  USDC_BSC: { network: "bsc", symbol: "USDC", mockUsdPrice: 1 },
  USDT_BSC: { network: "bsc", symbol: "USDT", mockUsdPrice: 1 },
};

export function getInvoiceTtlMinutes(): number {
  const raw = Number(process.env.INVOICE_TTL_MINUTES ?? 30);
  return Number.isFinite(raw) && raw > 0 ? raw : 30;
}

export function calcAmountDue(usd: number, currency: SupportedCurrency): string {
  const rate = SUPPORTED_CURRENCIES[currency].mockUsdPrice;
  const amount = usd / rate;
  return amount.toFixed(8);
}

export function getMockAddress(currency: SupportedCurrency): string {
  const prefix = currency.toLowerCase();
  return `${prefix}_addr_replace_with_real_derivation`;
}
