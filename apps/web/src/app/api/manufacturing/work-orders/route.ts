import { NextResponse } from "next/server"
import { prisma } from "erp-db/prisma/client"
import { getServerSession } from "next-auth"
import { authOptions } from "erp-auth"
import { z } from "zod"

const createWorkOrderSchema = z.object({
  number: z.string().min(1),
  productId: z.string().optional(),
  quantity: z.number().positive(),
  status: z.enum(["PLANNED", "RELEASED", "IN_PROGRESS", "COMPLETED"]),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
})

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const workOrders = await prisma.manufacturingWorkOrder.findMany({
      include: {
        bom: true,
        createdBy: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50,
    })

    return NextResponse.json(workOrders)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch work orders" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createWorkOrderSchema.parse(body)

    const workOrder = await prisma.manufacturingWorkOrder.create({
      data: {
        number: validatedData.number,
        bomId: validatedData.productId || undefined,
        quantity: validatedData.quantity,
        startDate: validatedData.startDate ? new Date(validatedData.startDate) : new Date(),
        dueDate: validatedData.endDate ? new Date(validatedData.endDate) : undefined,
        status: validatedData.status,
        createdById: session.user.id,
      },
    })

    return NextResponse.json(workOrder)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "Failed to create work order" }, { status: 500 })
  }
}
