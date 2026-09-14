import { NextResponse } from "next/server"
import { prisma } from "erp-db/prisma/client"
import { getServerSession } from "next-auth"
import { authOptions } from "erp-auth"
import { z } from "zod"

const orderLineSchema = z.object({
  productId: z.string().cuid(),
  quantity: z.number().positive(),
  unitPrice: z.number().nonnegative(),
  discount: z.number().nonnegative().default(0),
  tax: z.number().nonnegative().default(0),
  total: z.number().nonnegative(),
})

const createOrderSchema = z.object({
  number: z.string().min(1),
  contactId: z.string().optional(),
  subtotal: z.number().nonnegative(),
  tax: z.number().nonnegative(),
  total: z.number().nonnegative(),
  currencyId: z.string().optional(),
  lines: z.array(orderLineSchema).optional(),
})

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const orders = await prisma.salesOrder.findMany({
      include: {
        contact: true,
        lines: true,
        payments: true,
      },
      orderBy: {
        orderDate: "desc",
      },
      take: 50,
    })

    return NextResponse.json(orders)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createOrderSchema.parse(body)

    const order = await prisma.salesOrder.create({
      data: {
        number: validatedData.number,
        contactId: validatedData.contactId || null,
        orderDate: new Date(),
        status: "DRAFT",
        subtotal: validatedData.subtotal,
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
            tax: line.tax,
            total: line.total,
          })),
        } : undefined,
      },
    })

    return NextResponse.json(order)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
