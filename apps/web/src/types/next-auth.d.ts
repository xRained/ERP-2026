import NextAuth from "next-auth"
import { Role } from "erp-types"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      role: Role
      organizationId: string
    }
  }

  interface User {
    id: string
    email: string
    name?: string | null
    role: Role
    organizationId: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    sub: string
    role: Role
    organizationId: string
  }
}
