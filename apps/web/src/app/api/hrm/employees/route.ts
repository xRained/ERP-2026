import { NextResponse } from "next/server"
import { prisma } from "erp-db/prisma/client"
import { getServerSession } from "next-auth"
import { authOptions } from "erp-auth"
import { z } from "zod"

const createEmployeeSchema = z.object({
  employeeNumber: z.string().min(1),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  departmentId: z.string().optional(),
  jobRoleId: z.string().optional(),
  hireDate: z.string(),
  organizationId: z.string(),
})

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const employees = await prisma.employee.findMany({
      include: {
        department: true,
        jobRole: true,
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(employees)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch employees" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createEmployeeSchema.parse(body)

    const employee = await prisma.employee.create({
      data: {
        employeeNumber: validatedData.employeeNumber,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        email: validatedData.email,
        phone: validatedData.phone,
        departmentId: validatedData.departmentId,
        jobRoleId: validatedData.jobRoleId,
        hireDate: new Date(validatedData.hireDate),
        status: "ACTIVE",
        organizationId: validatedData.organizationId || "cmtu9mkcf0000yl3x83nmk589",
      },
    })

    return NextResponse.json(employee)
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Employee validation error:', error.errors)
      return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 })
    }
    console.error('Employee creation error:', error)
    return NextResponse.json({ error: "Failed to create employee", details: String(error) }, { status: 500 })
  }
}
