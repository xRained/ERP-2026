import { NextResponse } from "next/server"
import { prisma } from "erp-db/prisma/client"
import { getServerSession } from "next-auth"
import { authOptions } from "erp-auth"
import { z } from "zod"

const createWorkOrderSchema = z.object({
  number: z.string().min(1),
  customerId: z.string().optional(),
  technicianId: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
  status: z.enum(["OPEN", "ASSIGNED", "IN_PROGRESS", "COMPLETED"]),
  scheduledDate: z.string().optional(),
})

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const workOrders = await prisma.serviceWorkOrder.findMany({
      include: {
        customer: true,
        technician: true,
        equipment: true,
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

    const workOrder = await prisma.serviceWorkOrder.create({
      data: {
        number: validatedData.number,
        customerId: validatedData.customerId || null,
        technicianId: validatedData.technicianId || null,
        priority: validatedData.priority,
        status: validatedData.status,
        scheduledDate: validatedData.scheduledDate ? new Date(validatedData.scheduledDate) : null,
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
