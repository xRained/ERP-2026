"use client"

import { useState } from "react"
import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "erp-ui"
import { MODULES } from "erp-types"
import {
  LayoutDashboard,
  Users,
  DollarSign,
  ShoppingCart,
  Package,
  Settings,
  LogOut,
  Menu,
  X,
  Clock,
  Shield,
  MessageSquare,
  Monitor,
  FileText,
  Globe,
  Megaphone,
  Truck,
  Warehouse,
  Route,
  Wrench,
  Kanban,
} from "lucide-react"

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const moduleGroups = [
    {
      name: "Core",
      modules: MODULES.slice(0, 4),
    },
    {
      name: "Sales & Commerce",
      modules: MODULES.slice(4, 10),
    },
    {
      name: "Supply Chain",
      modules: MODULES.slice(10, 14),
    },
    {
      name: "Operations",
      modules: MODULES.slice(14, 17),
    },
    {
      name: "Reports",
      modules: MODULES.slice(17),
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white border-r transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b">
            <h1 className="text-xl font-bold text-gray-900">ERP2026</h1>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-6">
              {moduleGroups.map((group) => {
                const accessibleModules = group.modules.filter(module => {
                  if (session?.user?.role === 'ADMIN') return true
                  if (session?.user?.role === 'MANAGER') return true
                  if (session?.user?.role === 'USER') {
                    return module.id === 'wfm' || module.id === 'reports'
                  }
                  return false
                })
                if (accessibleModules.length === 0) return null
                return (
                  <div key={group.name}>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                      {group.name}
                    </h3>
                    <ul className="space-y-1">
                      {accessibleModules.map((module) => {
                        const Icon = getIcon(module.icon)
                        const isActive = pathname === module.path
                        return (
                          <li key={module.id}>
                            <Link
                              href={module.path}
                              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                isActive
                                  ? "bg-blue-50 text-blue-700"
                                  : "text-gray-700 hover:bg-gray-100"
                              }`}
                              onClick={() => setSidebarOpen(false)}
                            >
                              <Icon className="h-4 w-4" />
                              {module.name}
                            </Link>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                )
              })}
            </div>
          </nav>

          {/* User menu */}
          <div className="border-t p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-sm font-medium text-blue-700">
                  {session?.user?.name?.[0] || session?.user?.email[0]}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {session?.user?.name || session?.user?.email}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {session?.user?.role}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => signOut()}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="bg-white border-b sticky top-0 z-30">
          <div className="flex items-center justify-between px-6 py-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {session?.user?.organizationId}
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}

function getIcon(iconName: string) {
  const icons: Record<string, any> = {
    DollarSign,
    Users,
    Clock,
    Shield,
    MessageSquare,
    ShoppingCart,
    Monitor,
    FileText,
    Globe,
    Megaphone,
    Package,
    Truck,
    Warehouse,
    Route,
    Wrench,
    Kanban,
  }
  return icons[iconName] || LayoutDashboard
}
