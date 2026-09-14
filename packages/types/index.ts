// Core Types
export interface User {
  id: string
  name: string | null
  email: string
  role: Role
  organizationId: string
}

export enum Role {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  USER = "USER",
  GUEST = "GUEST",
}

export interface Organization {
  id: string
  name: string
  domain: string | null
  settings: Record<string, any>
}

// Module Types
export interface Module {
  id: string
  name: string
  path: string
  icon: string
  permissions: string[]
}

export const MODULES: Module[] = [
  {
    id: "financial",
    name: "Financial Management",
    path: "/dashboard/financial",
    icon: "DollarSign",
    permissions: ["financial:read", "financial:write", "financial:delete"],
  },
  {
    id: "hrm",
    name: "Human Resources",
    path: "/dashboard/hrm",
    icon: "Users",
    permissions: ["hrm:read", "hrm:write", "hrm:delete"],
  },
  {
    id: "wfm",
    name: "Workforce Management",
    path: "/dashboard/wfm",
    icon: "Clock",
    permissions: ["wfm:read", "wfm:write", "wfm:delete"],
  },
  {
    id: "admin",
    name: "Administration",
    path: "/dashboard/admin",
    icon: "Shield",
    permissions: ["admin:read", "admin:write", "admin:delete"],
  },
  {
    id: "crm",
    name: "CRM",
    path: "/dashboard/crm",
    icon: "MessageSquare",
    permissions: ["crm:read", "crm:write", "crm:delete"],
  },
  {
    id: "orders",
    name: "Order Management",
    path: "/dashboard/orders",
    icon: "ShoppingCart",
    permissions: ["orders:read", "orders:write", "orders:delete"],
  },
  {
    id: "pos",
    name: "Point of Sale",
    path: "/dashboard/pos",
    icon: "Monitor",
    permissions: ["pos:read", "pos:write", "pos:delete"],
  },
  {
    id: "cpq",
    name: "CPQ",
    path: "/dashboard/cpq",
    icon: "FileText",
    permissions: ["cpq:read", "cpq:write", "cpq:delete"],
  },
  {
    id: "ecommerce",
    name: "Ecommerce",
    path: "/dashboard/ecommerce",
    icon: "Globe",
    permissions: ["ecommerce:read", "ecommerce:write", "ecommerce:delete"],
  },
  {
    id: "marketing",
    name: "Marketing",
    path: "/dashboard/marketing",
    icon: "Megaphone",
    permissions: ["marketing:read", "marketing:write", "marketing:delete"],
  },
  {
    id: "inventory",
    name: "Inventory",
    path: "/dashboard/inventory",
    icon: "Package",
    permissions: ["inventory:read", "inventory:write", "inventory:delete"],
  },
  {
    id: "procurement",
    name: "Procurement",
    path: "/dashboard/procurement",
    icon: "Truck",
    permissions: ["procurement:read", "procurement:write", "procurement:delete"],
  },
  {
    id: "wms",
    name: "Warehouse",
    path: "/dashboard/wms",
    icon: "Warehouse",
    permissions: ["wms:read", "wms:write", "wms:delete"],
  },
  {
    id: "scm",
    name: "Supply Chain",
    path: "/dashboard/scm",
    icon: "Route",
    permissions: ["scm:read", "scm:write", "scm:delete"],
  },
  {
    id: "manufacturing",
    name: "Manufacturing",
    path: "/dashboard/manufacturing",
    icon: "Wrench",
    permissions: ["manufacturing:read", "manufacturing:write", "manufacturing:delete"],
  },
  {
    id: "projects",
    name: "Project Management",
    path: "/dashboard/projects",
    icon: "Kanban",
    permissions: ["projects:read", "projects:write", "projects:delete"],
  },
  {
    id: "field-service",
    name: "Field Service",
    path: "/dashboard/field-service",
    icon: "Wrench",
    permissions: ["field-service:read", "field-service:write", "field-service:delete"],
  },
  {
    id: "reports",
    name: "Reports",
    path: "/dashboard/reports",
    icon: "BarChart3",
    permissions: ["reports:read", "reports:write"],
  },
]

// Dashboard Types
export interface DashboardStats {
  totalRevenue: number
  totalOrders: number
  totalCustomers: number
  totalProducts: number
  pendingTasks: number
  lowStockItems: number
}

export interface ChartData {
  name: string
  value: number
}

// Common UI Types
export interface TableColumn {
  key: string
  header: string
  sortable?: boolean
  render?: (value: any, row: any) => React.ReactNode
}

export interface TableAction {
  label: string
  icon?: string
  onClick: (row: any) => void
  variant?: "default" | "destructive"
}

export interface FilterOption {
  label: string
  value: string
}

export interface DateRange {
  from: Date
  to: Date
}

// Form Types
export interface FormField {
  name: string
  label: string
  type: "text" | "email" | "password" | "number" | "date" | "select" | "textarea"
  required?: boolean
  placeholder?: string
  options?: FilterOption[]
  validation?: any
}

export interface FormConfig {
  fields: FormField[]
  onSubmit: (data: any) => void | Promise<void>
  initialValues?: Record<string, any>
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// Search Types
export interface SearchFilters {
  query?: string
  filters?: Record<string, any>
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

// Notification Types
export interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  timestamp: Date
  read: boolean
  actionUrl?: string
}
