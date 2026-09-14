import { NextResponse } from "next/server"
import { prisma } from "erp-db/prisma/client"
import { getServerSession } from "next-auth"
import { authOptions } from "erp-auth"
import { z } from "zod"

const createShipmentSchema = z.object({
  number: z.string().min(1),
  carrier: z.string().min(1),
  originId: z.string().optional(),
  destinationId: z.string().optional(),
  status: z.enum(["PENDING", "PICKED_UP", "IN_TRANSIT", "DELIVERED", "DELAYED"]),
  estimatedDelivery: z.string().optional(),
  organizationId: z.string(),
})

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const shipments = await prisma.shipment.findMany({
      include: {
        route: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50,
    })

    return NextResponse.json(shipments)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch shipments" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createShipmentSchema.parse(body)

    const shipment = await prisma.shipment.create({
      data: {
        trackingNumber: validatedData.number,
        carrierId: validatedData.carrier,
        status: validatedData.status,
        estimatedDelivery: validatedData.estimatedDelivery ? new Date(validatedData.estimatedDelivery) : null,
        organizationId: validatedData.organizationId || "cmtu9mkcf0000yl3x83nmk589",
      },
    })

    return NextResponse.json(shipment)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "Failed to create shipment" }, { status: 500 })
  }
}
