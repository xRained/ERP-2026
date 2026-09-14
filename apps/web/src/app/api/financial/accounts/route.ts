import { NextResponse } from "next/server"
import { prisma } from "erp-db/prisma/client"
import { getServerSession } from "next-auth"
import { authOptions } from "erp-auth"
import { z } from "zod"

const createAccountSchema = z.object({
  code: z.string().min(1),
  name: z.string().min(1),
  type: z.enum(["ASSET", "LIABILITY", "EQUITY", "REVENUE", "EXPENSE"]).default("ASSET"),
  parentId: z.string().nullable().optional(),
  currencyId: z.string().default("cmtu9mknf0001yl3x83nmk58a"),
})

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const accounts = await prisma.financialAccount.findMany({
      include: {
        currency: true,
        parent: true,
      },
      orderBy: {
        code: "asc",
      },
    })

    return NextResponse.json(accounts)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch accounts" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createAccountSchema.parse(body)

    const account = await prisma.financialAccount.create({
      data: {
        code: validatedData.code,
        name: validatedData.name,
        type: validatedData.type,
        parentId: validatedData.parentId || undefined,
        currencyId: validatedData.currencyId || "cmtu9mknf0001yl3x83nmk58a",
        balance: 0,
        isActive: true,
      },
    })

    return NextResponse.json(account)
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Financial account validation error:', error.errors)
      return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 })
    }
    console.error('Account creation error:', error)
    return NextResponse.json({ error: "Failed to create account", details: String(error) }, { status: 500 })
  }
}
