import { NextResponse } from "next/server"
import { prisma } from "erp-db/prisma/client"
import { getServerSession } from "next-auth"
import { authOptions } from "erp-auth"
import { z } from "zod"

const createTimeEntrySchema = z.object({
  employeeId: z.string().optional(),
  date: z.string().optional(),
  clockIn: z.string().optional(),
  clockOut: z.string().optional(),
  breakMinutes: z.number().nonnegative().default(0),
})

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const timeEntries = await prisma.timeEntry.findMany({
      include: {
        employee: true,
        user: true,
      },
      orderBy: {
        date: "desc",
      },
      take: 50,
    })

    return NextResponse.json(timeEntries)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch time entries" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createTimeEntrySchema.parse(body)

    const timeEntry = await prisma.timeEntry.create({
      data: {
        employeeId: validatedData.employeeId || "temp-id",
        date: validatedData.date ? new Date(validatedData.date) : new Date(),
        clockIn: validatedData.clockIn ? new Date(validatedData.clockIn) : new Date(),
        clockOut: validatedData.clockOut ? new Date(validatedData.clockOut) : null,
        breakMinutes: validatedData.breakMinutes,
        status: "PENDING",
        userId: session.user.id,
      },
    })

    return NextResponse.json(timeEntry)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "Failed to create time entry" }, { status: 500 })
  }
}
