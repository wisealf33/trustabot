"use client";

import { useState } from "react";

const currencies = [
  "BTC",
  "LTC",
  "ETH",
  "BNB",
  "USDC_ETH",
  "USDT_ETH",
  "USDC_BSC",
  "USDT_BSC",
] as const;

type InvoiceResponse = {
  invoiceId: string;
  state: string;
  currency: string;
  network: string;
  address: string;
  amountDue: string;
  expiresAt: string;
  qrPayload: string;
  symbol: string;
};

export default function Home() {
  const [currency, setCurrency] = useState<(typeof currencies)[number]>("BTC");
  const [email, setEmail] = useState("");
  const [invoice, setInvoice] = useState<InvoiceResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function createInvoice() {
    setLoading(true);
    setError(null);
    setInvoice(null);

    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productSlug: "crypto-starter-pack",
          currency,
          email,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create invoice");
      }
      setInvoice(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-3xl font-bold">TrustaBot Checkout MVP</h1>
      <p className="mt-2 text-sm text-gray-600">
        Product: Crypto Starter Pack ($19). Self-custody payment flow prototype.
      </p>

      <div className="mt-6 space-y-4 rounded-lg border p-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Email for delivery</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded border px-3 py-2"
            placeholder="buyer@example.com"
            type="email"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Pay with</label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as (typeof currencies)[number])}
            className="w-full rounded border px-3 py-2"
          >
            {currencies.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={createInvoice}
          disabled={loading || !email}
          className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Invoice"}
        </button>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}
      </div>

      {invoice ? (
        <div className="mt-6 space-y-2 rounded-lg border p-4 text-sm">
          <h2 className="text-lg font-semibold">Payment Instructions</h2>
          <p>
            Send <strong>{invoice.amountDue}</strong> {invoice.symbol} on {invoice.network}
          </p>
          <p className="break-all">Address: {invoice.address}</p>
          <p>Invoice ID: {invoice.invoiceId}</p>
          <p>Status: {invoice.state}</p>
          <p>Expires: {new Date(invoice.expiresAt).toLocaleString()}</p>
        </div>
      ) : null}
    </main>
  );
}
