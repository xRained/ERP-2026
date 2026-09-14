import { NextResponse } from "next/server"
import { prisma } from "erp-db/prisma/client"
import { getServerSession } from "next-auth"
import { authOptions } from "erp-auth"
import { z } from "zod"

const createCampaignSchema = z.object({
  name: z.string().min(1),
  type: z.enum(["EMAIL", "SMS", "SOCIAL", "ADS", "DIRECT_MAIL", "EVENT"]),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  budget: z.number().nonnegative().optional(),
  organizationId: z.string(),
})

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const campaigns = await prisma.campaign.findMany({
      include: {
        organization: true,
        items: true,
        leadCaptures: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50,
    })

    return NextResponse.json(campaigns)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch campaigns" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createCampaignSchema.parse(body)

    const campaign = await prisma.campaign.create({
      data: {
        name: validatedData.name,
        type: validatedData.type as any,
        startDate: validatedData.startDate ? new Date(validatedData.startDate) : new Date(),
        endDate: validatedData.endDate ? new Date(validatedData.endDate) : null,
        budget: validatedData.budget,
        status: "DRAFT",
        organizationId: validatedData.organizationId,
      },
    })

    return NextResponse.json(campaign)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "Failed to create campaign" }, { status: 500 })
  }
}
