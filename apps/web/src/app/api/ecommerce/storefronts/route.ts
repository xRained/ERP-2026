import { NextResponse } from "next/server"
import { prisma } from "erp-db/prisma/client"
import { getServerSession } from "next-auth"
import { authOptions } from "erp-auth"
import { z } from "zod"

const createStorefrontSchema = z.object({
  name: z.string().min(1),
  url: z.string().optional(),
  organizationId: z.string(),
})

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const storefronts = await prisma.storefront.findMany({
      include: {
        organization: true,
        products: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(storefronts)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch storefronts" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createStorefrontSchema.parse(body)

    const storefront = await prisma.storefront.create({
      data: {
        name: validatedData.name,
        domain: validatedData.url || "localhost",
        isActive: true,
        organizationId: validatedData.organizationId || "cmtu9mkcf0000yl3x83nmk589",
      },
    })

    return NextResponse.json(storefront)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "Failed to create storefront" }, { status: 500 })
  }
}
