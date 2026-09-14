import { PrismaClient } from '@prisma/client'
import { prisma } from './client'

async function main() {
  console.log('Starting seed...')

  // Create organization
  const organization = await prisma.organization.upsert({
    where: { domain: 'demo.erp2026.com' },
    update: {},
    create: {
      name: 'Demo Organization',
      domain: 'demo.erp2026.com',
      settings: {
        timezone: 'UTC',
        currency: 'USD',
      },
    },
  })

  console.log('Created organization:', organization.name)

  // Create demo user
  const user = await prisma.user.upsert({
    where: { email: 'admin@erp2026.com' },
    update: {},
    create: {
      email: 'admin@erp2026.com',
      name: 'Admin User',
      password: 'admin123', // In production, use bcrypt
      role: 'ADMIN',
      organizationId: organization.id,
    },
  })

  console.log('Created user:', user.email)

  // Create department-specific users
  const departmentUsers = [
    {
      email: 'hr@erp2026.com',
      name: 'HR Manager',
      password: 'hr123',
      role: 'MANAGER',
      department: 'HR',
    },
    {
      email: 'finance@erp2026.com',
      name: 'Finance Manager',
      password: 'finance123',
      role: 'MANAGER',
      department: 'Finance',
    },
    {
      email: 'sales@erp2026.com',
      name: 'Sales Manager',
      password: 'sales123',
      role: 'MANAGER',
      department: 'Sales',
    },
    {
      email: 'operations@erp2026.com',
      name: 'Operations Manager',
      password: 'ops123',
      role: 'MANAGER',
      department: 'Operations',
    },
    {
      email: 'warehouse@erp2026.com',
      name: 'Warehouse Manager',
      password: 'warehouse123',
      role: 'USER',
      department: 'Warehouse',
    },
    {
      email: 'employee@erp2026.com',
      name: 'Regular Employee',
      password: 'employee123',
      role: 'USER',
      department: 'General',
    },
  ]

  for (const deptUser of departmentUsers) {
    await prisma.user.upsert({
      where: { email: deptUser.email },
      update: {},
      create: {
        email: deptUser.email,
        name: deptUser.name,
        password: deptUser.password,
        role: deptUser.role as any,
        organizationId: organization.id,
      },
    })
    console.log(`Created ${deptUser.department} user:`, deptUser.email)
  }

  // Create permissions
  const permissions = [
    { name: 'financial:read', module: 'financial' },
    { name: 'financial:write', module: 'financial' },
    { name: 'financial:delete', module: 'financial' },
    { name: 'hrm:read', module: 'hrm' },
    { name: 'hrm:write', module: 'hrm' },
    { name: 'hrm:delete', module: 'hrm' },
    { name: 'wfm:read', module: 'wfm' },
    { name: 'wfm:write', module: 'wfm' },
    { name: 'wfm:delete', module: 'wfm' },
    { name: 'admin:read', module: 'admin' },
    { name: 'admin:write', module: 'admin' },
    { name: 'admin:delete', module: 'admin' },
    { name: 'crm:read', module: 'crm' },
    { name: 'crm:write', module: 'crm' },
    { name: 'crm:delete', module: 'crm' },
    { name: 'orders:read', module: 'orders' },
    { name: 'orders:write', module: 'orders' },
    { name: 'orders:delete', module: 'orders' },
    { name: 'pos:read', module: 'pos' },
    { name: 'pos:write', module: 'pos' },
    { name: 'pos:delete', module: 'pos' },
    { name: 'cpq:read', module: 'cpq' },
    { name: 'cpq:write', module: 'cpq' },
    { name: 'cpq:delete', module: 'cpq' },
    { name: 'ecommerce:read', module: 'ecommerce' },
    { name: 'ecommerce:write', module: 'ecommerce' },
    { name: 'ecommerce:delete', module: 'ecommerce' },
    { name: 'marketing:read', module: 'marketing' },
    { name: 'marketing:write', module: 'marketing' },
    { name: 'marketing:delete', module: 'marketing' },
    { name: 'inventory:read', module: 'inventory' },
    { name: 'inventory:write', module: 'inventory' },
    { name: 'inventory:delete', module: 'inventory' },
    { name: 'procurement:read', module: 'procurement' },
    { name: 'procurement:write', module: 'procurement' },
    { name: 'procurement:delete', module: 'procurement' },
    { name: 'wms:read', module: 'wms' },
    { name: 'wms:write', module: 'wms' },
    { name: 'wms:delete', module: 'wms' },
    { name: 'scm:read', module: 'scm' },
    { name: 'scm:write', module: 'scm' },
    { name: 'scm:delete', module: 'scm' },
    { name: 'manufacturing:read', module: 'manufacturing' },
    { name: 'manufacturing:write', module: 'manufacturing' },
    { name: 'manufacturing:delete', module: 'manufacturing' },
    { name: 'projects:read', module: 'projects' },
    { name: 'projects:write', module: 'projects' },
    { name: 'projects:delete', module: 'projects' },
    { name: 'field-service:read', module: 'field-service' },
    { name: 'field-service:write', module: 'field-service' },
    { name: 'field-service:delete', module: 'field-service' },
  ]

  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: { name: permission.name },
      update: {},
      create: permission,
    })
  }

  console.log('Created permissions')

  // Create roles with permissions
  const rolePermissions = {
    ADMIN: permissions.map(p => p.name),
    MANAGER: permissions.filter(p => !p.name.includes('delete')).map(p => p.name),
    USER: permissions.filter(p => p.name.includes('read')).map(p => p.name),
  }

  for (const [roleName, permNames] of Object.entries(rolePermissions)) {
    for (const permName of permNames) {
      const permission = await prisma.permission.findUnique({
        where: { name: permName },
      })
      if (permission) {
        await prisma.rolePermission.upsert({
          where: {
            roleId_permissionId: {
              roleId: roleName,
              permissionId: permission.id,
            },
          },
          update: {},
          create: {
            roleId: roleName,
            permissionId: permission.id,
          },
        })
      }
    }
  }

  console.log('Created role permissions')

  // Create departments
  const departments = [
    { name: 'Engineering' },
    { name: 'Marketing' },
    { name: 'Sales' },
    { name: 'Finance' },
    { name: 'HR' },
    { name: 'Operations' },
  ]

  for (const dept of departments) {
    await prisma.department.upsert({
      where: { name: dept.name },
      update: {},
      create: {
        name: dept.name,
        organizationId: organization.id,
      },
    })
  }

  console.log('Created departments')

  // Create job roles
  const jobRoles = [
    { name: 'Software Engineer', department: 'Engineering' },
    { name: 'Marketing Manager', department: 'Marketing' },
    { name: 'Sales Representative', department: 'Sales' },
    { name: 'Accountant', department: 'Finance' },
    { name: 'HR Specialist', department: 'HR' },
    { name: 'Operations Manager', department: 'Operations' },
  ]

  for (const jobRole of jobRoles) {
    const dept = await prisma.department.findFirst({
      where: { name: jobRole.department },
    })
    if (dept) {
      await prisma.jobRole.upsert({
        where: { name: jobRole.name },
        update: {},
        create: {
          name: jobRole.name,
          departmentId: dept.id,
          organizationId: organization.id,
        },
      })
    }
  }

  console.log('Created job roles')

  // Create currency
  const currency = await prisma.currency.upsert({
    where: { code: 'USD' },
    update: {},
    create: {
      code: 'USD',
      name: 'US Dollar',
      symbol: '$',
      rate: 1.0,
    },
  })

  console.log('Created currency:', currency.code)

  // Create UOM
  const uoms = [
    { code: 'EA', name: 'Each', category: 'unit' },
    { code: 'KG', name: 'Kilogram', category: 'weight' },
    { code: 'L', name: 'Liter', category: 'volume' },
    { code: 'HR', name: 'Hour', category: 'time' },
  ]

  for (const uom of uoms) {
    await prisma.uOM.upsert({
      where: { code: uom.code },
      update: {},
      create: uom,
    })
  }

  console.log('Created UOMs')

  console.log('Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
