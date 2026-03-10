import { prisma } from "@/lib/prisma";
import {
  calcAmountDue,
  getInvoiceTtlMinutes,
  getMockAddress,
  SUPPORTED_CURRENCIES,
  type SupportedCurrency,
} from "@/lib/payments";
import { NextResponse } from "next/server";
import { z } from "zod";

const createInvoiceSchema = z.object({
  productSlug: z.string().min(1),
  currency: z.enum([
    "BTC",
    "LTC",
    "ETH",
    "BNB",
    "USDC_ETH",
    "USDT_ETH",
    "USDC_BSC",
    "USDT_BSC",
  ]),
  email: z.string().email(),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = createInvoiceSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { productSlug, currency, email } = parsed.data;

  const product = await prisma.product.findUnique({ where: { slug: productSlug } });
  if (!product || !product.active) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const amountDue = calcAmountDue(Number(product.priceUsd), currency as SupportedCurrency);
  const network = SUPPORTED_CURRENCIES[currency as SupportedCurrency].network;
  const address = getMockAddress(currency as SupportedCurrency);
  const expiresAt = new Date(Date.now() + getInvoiceTtlMinutes() * 60_000);

  const invoice = await prisma.invoice.create({
    data: {
      productId: product.id,
      currencySelected: currency,
      amountDue,
      address,
      network,
      email,
      expiresAt,
    },
  });

  const symbol = SUPPORTED_CURRENCIES[currency as SupportedCurrency].symbol;

  return NextResponse.json({
    invoiceId: invoice.id,
    state: invoice.state,
    currency,
    network,
    address,
    amountDue,
    expiresAt: invoice.expiresAt,
    qrPayload: `${network}:${address}?amount=${amountDue}`,
    symbol,
  });
}
