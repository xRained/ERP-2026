"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "erp-ui"
import { DollarSign, Users, ShoppingCart, Package, TrendingUp, AlertCircle, Clock, UserCheck, BarChart3 } from "lucide-react"
import { useSession } from "next-auth/react"

export default function DashboardPage() {
  const { data: session } = useSession()
  const role = session?.user?.role

  const getRoleSpecificContent = () => {
    switch (role) {
      case 'ADMIN':
        return {
          stats: [
            { title: "Total Revenue", value: "$124,563", change: "+12.5%", icon: DollarSign, color: "text-green-600" },
            { title: "Total Orders", value: "1,234", change: "+8.2%", icon: ShoppingCart, color: "text-blue-600" },
            { title: "Total Customers", value: "456", change: "+5.1%", icon: Users, color: "text-purple-600" },
            { title: "Total Products", value: "2,890", change: "+2.3%", icon: Package, color: "text-orange-600" },
          ],
          activity: [
            { id: 1, action: "New order received", time: "2 minutes ago", type: "order" },
            { id: 2, action: "Customer registered", time: "15 minutes ago", type: "customer" },
            { id: 3, action: "Payment received", time: "1 hour ago", type: "payment" },
            { id: 4, action: "Low stock alert", time: "2 hours ago", type: "alert" },
            { id: 5, action: "New lead assigned", time: "3 hours ago", type: "lead" },
          ],
          quickActions: [
            { icon: DollarSign, label: "Create Invoice", color: "blue" },
            { icon: ShoppingCart, label: "New Order", color: "green" },
            { icon: Users, label: "Add Customer", color: "purple" },
            { icon: Package, label: "Add Product", color: "orange" },
          ]
        }
      case 'MANAGER':
        return {
          stats: [
            { title: "Team Performance", value: "94%", change: "+3.2%", icon: TrendingUp, color: "text-green-600" },
            { title: "Pending Tasks", value: "23", change: "-5", icon: AlertCircle, color: "text-orange-600" },
            { title: "Team Members", value: "12", change: "+2", icon: Users, color: "text-blue-600" },
            { title: "This Week Revenue", value: "$45,231", change: "+8.5%", icon: DollarSign, color: "text-green-600" },
          ],
          activity: [
            { id: 1, action: "Task completed by John", time: "5 minutes ago", type: "task" },
            { id: 2, action: "New project started", time: "1 hour ago", type: "project" },
            { id: 3, action: "Meeting scheduled", time: "2 hours ago", type: "meeting" },
            { id: 4, action: "Report generated", time: "3 hours ago", type: "report" },
            { id: 5, action: "Team update posted", time: "4 hours ago", type: "update" },
          ],
          quickActions: [
            { icon: Users, label: "View Team", color: "blue" },
            { icon: BarChart3, label: "View Reports", color: "green" },
            { icon: Clock, label: "Schedule Meeting", color: "purple" },
            { icon: TrendingUp, label: "View Performance", color: "orange" },
          ]
        }
      case 'USER':
        return {
          stats: [
            { title: "My Tasks", value: "8", change: "-2", icon: AlertCircle, color: "text-orange-600" },
            { title: "Hours This Week", value: "38.5", change: "+2.5", icon: Clock, color: "text-blue-600" },
            { title: "Completed Tasks", value: "15", change: "+5", icon: UserCheck, color: "text-green-600" },
            { title: "Pending Approvals", value: "3", change: "0", icon: AlertCircle, color: "text-red-600" },
          ],
          activity: [
            { id: 1, action: "Task assigned: Review Q3 report", time: "10 minutes ago", type: "task" },
            { id: 2, action: "Meeting reminder: Team standup", time: "30 minutes ago", type: "meeting" },
            { id: 3, action: "Time entry approved", time: "1 hour ago", type: "approval" },
            { id: 4, action: "New project invitation", time: "2 hours ago", type: "project" },
            { id: 5, action: "Document shared with you", time: "3 hours ago", type: "document" },
          ],
          quickActions: [
            { icon: Clock, label: "Log Time", color: "blue" },
            { icon: AlertCircle, label: "View Tasks", color: "green" },
            { icon: Users, label: "Team Chat", color: "purple" },
            { icon: BarChart3, label: "My Reports", color: "orange" },
          ]
        }
      default:
        return {
          stats: [],
          activity: [],
          quickActions: []
        }
    }
  }

  const content = getRoleSpecificContent()

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {role === 'ADMIN' ? 'Executive Dashboard' : role === 'MANAGER' ? 'Team Dashboard' : 'My Dashboard'}
          </h1>
          <p className="text-gray-600 mt-1">
            Welcome back, {session?.user?.name || session?.user?.email}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {content.stats.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </CardTitle>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className={`text-xs ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'} mt-1`}>
                    {stat.change}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {content.activity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-blue-500" />
                      <span className="text-sm">{activity.action}</span>
                    </div>
                    <span className="text-xs text-gray-500">{activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {content.quickActions.map((action) => {
                  const Icon = action.icon
                  return (
                    <button
                      key={action.label}
                      className={`p-4 bg-${action.color}-50 hover:bg-${action.color}-100 rounded-lg transition-colors`}
                    >
                      <Icon className={`h-6 w-6 text-${action.color}-600 mb-2`} />
                      <span className="text-sm font-medium">{action.label}</span>
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
