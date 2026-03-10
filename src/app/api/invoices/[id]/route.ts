import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const invoice = await prisma.invoice.findUnique({
    where: { id },
    include: {
      product: true,
      payments: {
        orderBy: { firstSeenAt: "desc" },
      },
    },
  });

  if (!invoice) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    invoiceId: invoice.id,
    product: invoice.product.slug,
    state: invoice.state,
    currency: invoice.currencySelected,
    network: invoice.network,
    amountDue: invoice.amountDue,
    address: invoice.address,
    expiresAt: invoice.expiresAt,
    payments: invoice.payments.map((p) => ({
      txid: p.txid,
      amountReceived: p.amountReceived,
      confirmations: p.confirmations,
      firstSeenAt: p.firstSeenAt,
      lastSeenAt: p.lastSeenAt,
    })),
  });
}
