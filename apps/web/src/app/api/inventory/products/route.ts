import { NextResponse } from "next/server"
import { prisma } from "erp-db/prisma/client"
import { getServerSession } from "next-auth"
import { authOptions } from "erp-auth"
import { z } from "zod"

const createProductSchema = z.object({
  sku: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
  category: z.string().optional(),
  uomId: z.string().optional(),
  cost: z.number().nonnegative().default(0),
  price: z.number().nonnegative().default(0),
  organizationId: z.string().optional(),
})

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const products = await prisma.product.findMany({
      include: {
        uom: true,
        stockLevels: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50,
    })

    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createProductSchema.parse(body)

    const product = await prisma.product.create({
      data: {
        sku: validatedData.sku,
        name: validatedData.name,
        description: validatedData.description || null,
        category: validatedData.category || null,
        uomId: validatedData.uomId || "cmtu9mknf0001yl3x83nmk58a",
        cost: validatedData.cost,
        price: validatedData.price,
        organizationId: validatedData.organizationId || "cmtu9mkcf0000yl3x83nmk589",
        isActive: true,
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Product validation error:', error.errors)
      return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 })
    }
    console.error('Product creation error:', error)
    return NextResponse.json({ error: "Failed to create product", details: String(error) }, { status: 500 })
  }
}
