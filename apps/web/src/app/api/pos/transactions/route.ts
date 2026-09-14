import { NextResponse } from "next/server"
import { prisma } from "erp-db/prisma/client"
import { getServerSession } from "next-auth"
import { authOptions } from "erp-auth"
import { z } from "zod"

const posLineSchema = z.object({
  productId: z.string().cuid(),
  quantity: z.number().positive(),
  unitPrice: z.number().nonnegative(),
  discount: z.number().nonnegative().default(0),
  total: z.number().nonnegative(),
})

const createTransactionSchema = z.object({
  number: z.string().min(1),
  tillId: z.string().optional(),
  shiftId: z.string().optional(),
  amount: z.number().nonnegative(),
  tax: z.number().nonnegative().default(0),
  total: z.number().nonnegative(),
  paymentMethod: z.enum(["CASH", "BANK_TRANSFER", "CREDIT_CARD", "DEBIT_CARD", "CHECK"]),
  lines: z.array(posLineSchema).optional(),
})

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const transactions = await prisma.pOSTransaction.findMany({
      include: {
        lines: true,
        shift: true,
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50,
    })

    return NextResponse.json(transactions)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createTransactionSchema.parse(body)

    const transaction = await prisma.pOSTransaction.create({
      data: {
        number: validatedData.number,
        tillId: validatedData.tillId,
        shiftId: validatedData.shiftId,
        userId: session.user.id,
        amount: validatedData.amount,
        tax: validatedData.tax,
        total: validatedData.total,
        paymentMethod: validatedData.paymentMethod,
        status: "COMPLETED",
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

    return NextResponse.json(transaction)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "Failed to create transaction" }, { status: 500 })
  }
}
