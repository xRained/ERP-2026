import { NextResponse } from "next/server"
import { prisma } from "erp-db/prisma/client"
import { getServerSession } from "next-auth"
import { authOptions } from "erp-auth"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const permissions = await prisma.permission.findMany({
      orderBy: {
        module: "asc",
      },
    })

    return NextResponse.json(permissions)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch permissions" }, { status: 500 })
  }
}
