import { NextResponse } from "next/server"
import { prisma } from "erp-db/prisma/client"
import { getServerSession } from "next-auth"
import { authOptions } from "erp-auth"
import { z } from "zod"

const quoteLineSchema = z.object({
  productId: z.string().cuid(),
  quantity: z.number().positive(),
  unitPrice: z.number().nonnegative(),
  discount: z.number().nonnegative().default(0),
  total: z.number().nonnegative(),
})

const createQuoteSchema = z.object({
  number: z.string().min(1),
  contactId: z.string().optional(),
  validUntil: z.string().optional(),
  subtotal: z.number().nonnegative(),
  discount: z.number().nonnegative().default(0),
  tax: z.number().nonnegative().default(0),
  total: z.number().nonnegative(),
  currencyId: z.string().optional(),
  lines: z.array(quoteLineSchema).optional(),
})

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const quotes = await prisma.quote.findMany({
      include: {
        contact: true,
        lines: true,
        currency: true,
        createdBy: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50,
    })

    return NextResponse.json(quotes)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch quotes" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createQuoteSchema.parse(body)

    const quote = await prisma.quote.create({
      data: {
        number: validatedData.number,
        contactId: validatedData.contactId,
        validUntil: validatedData.validUntil ? new Date(validatedData.validUntil) : undefined,
        status: "DRAFT",
        subtotal: validatedData.subtotal,
        discount: validatedData.discount,
        tax: validatedData.tax,
        total: validatedData.total,
        currencyId: validatedData.currencyId || "cmtu9mknf0001yl3x83nmk58a",
        createdById: session.user.id,
        lines: validatedData.lines && validatedData.lines.length > 0 ? {
          create: validatedData.lines.map((line) => ({
            productId: line.productId,
            quantity: line.quantity,
            unitPrice: line.unitPrice,
            discount: line.discount,
            total: line.total,
          })),
        } : undefined,
      },
    })

    return NextResponse.json(quote)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "Failed to create quote" }, { status: 500 })
  }
}
