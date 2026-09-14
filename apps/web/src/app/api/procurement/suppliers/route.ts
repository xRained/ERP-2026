import { NextResponse } from "next/server"
import { prisma } from "erp-db/prisma/client"
import { getServerSession } from "next-auth"
import { authOptions } from "erp-auth"
import { z } from "zod"

const createSupplierSchema = z.object({
  name: z.string().min(1),
  code: z.string().min(1),
  contactName: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  organizationId: z.string(),
})

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const suppliers = await prisma.supplier.findMany({
      include: {
        contacts: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(suppliers)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch suppliers" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createSupplierSchema.parse(body)

    const supplier = await prisma.supplier.create({
      data: {
        ...validatedData,
        isActive: true,
      },
    })

    return NextResponse.json(supplier)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "Failed to create supplier" }, { status: 500 })
  }
}
