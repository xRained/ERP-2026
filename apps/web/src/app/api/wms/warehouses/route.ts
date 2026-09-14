import { NextResponse } from "next/server"
import { prisma } from "erp-db/prisma/client"
import { getServerSession } from "next-auth"
import { authOptions } from "erp-auth"
import { z } from "zod"

const createWarehouseSchema = z.object({
  name: z.string().min(1),
  code: z.string().min(1),
  locationId: z.string().min(1),
  organizationId: z.string(),
})

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const warehouses = await prisma.warehouse.findMany({
      include: {
        location: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(warehouses)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch warehouses" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createWarehouseSchema.parse(body)

    const warehouse = await prisma.warehouse.create({
      data: {
        name: validatedData.name,
        code: validatedData.code,
        locationId: validatedData.locationId,
        organizationId: validatedData.organizationId,
        isActive: true,
      },
    })

    return NextResponse.json(warehouse)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "Failed to create warehouse" }, { status: 500 })
  }
}
