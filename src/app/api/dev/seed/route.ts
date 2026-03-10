import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not allowed" }, { status: 403 });
  }

  const product = await prisma.product.upsert({
    where: { slug: "crypto-starter-pack" },
    update: {},
    create: {
      slug: "crypto-starter-pack",
      name: "Crypto Starter Pack",
      priceUsd: 19,
      active: true,
    },
  });

  return NextResponse.json({ ok: true, product });
}
