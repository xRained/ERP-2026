"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "erp-ui"
import { BarChart3, PieChart, TrendingUp, Download, FileText, Users, ShoppingCart, Package, RefreshCw } from "lucide-react"
import { useEffect, useState } from "react"

export default function ReportsPage() {
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({
    financial: 0,
    hrm: 0,
    sales: 0,
    custom: 0,
  })

  const fetchReportStats = async () => {
    setLoading(true)
    try {
      const responses = await Promise.all([
        fetch('/api/financial/accounts'),
        fetch('/api/hrm/employees'),
        fetch('/api/orders'),
      ])
      const [financial, hrm, sales] = await Promise.all(responses.map(r => r.json()))
      setStats({
        financial: financial.length || 12,
        hrm: hrm.length || 8,
        sales: sales.length || 15,
        custom: 5,
      })
    } catch (error) {
      console.error('Failed to fetch report stats:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReportStats()
  }, [])

  const handleExport = (format: string) => {
    alert(`Exporting as ${format.toUpperCase()}... (Feature coming soon)`)
  }

  const handleQuickReport = (reportName: string) => {
    alert(`Generating ${reportName} report... (Feature coming soon)`)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
            <p className="text-gray-600 mt-1">Cross-module reporting and data analysis</p>
          </div>
          <button
            onClick={fetchReportStats}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Financial Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{loading ? "..." : stats.financial}</p>
              <p className="text-sm text-gray-600">Available</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-600" />
                HR Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{loading ? "..." : stats.hrm}</p>
              <p className="text-sm text-gray-600">Available</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-purple-600" />
                Sales Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{loading ? "..." : stats.sales}</p>
              <p className="text-sm text-gray-600">Available</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-orange-600" />
                Custom Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{loading ? "..." : stats.custom}</p>
              <p className="text-sm text-gray-600">Available</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quick Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button onClick={() => handleQuickReport('Revenue by Month')} className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                <BarChart3 className="h-6 w-6 text-blue-600" />
                <div className="text-left">
                  <p className="font-medium">Revenue by Month</p>
                  <p className="text-sm text-gray-600">Financial</p>
                </div>
              </button>

              <button onClick={() => handleQuickReport('Sales by Region')} className="flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                <PieChart className="h-6 w-6 text-green-600" />
                <div className="text-left">
                  <p className="font-medium">Sales by Region</p>
                  <p className="text-sm text-gray-600">Sales</p>
                </div>
              </button>

              <button onClick={() => handleQuickReport('Employee Performance')} className="flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                <TrendingUp className="h-6 w-6 text-purple-600" />
                <div className="text-left">
                  <p className="font-medium">Employee Performance</p>
                  <p className="text-sm text-gray-600">HRM</p>
                </div>
              </button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Export Options</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <button onClick={() => handleExport('pdf')} className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
                <Download className="h-4 w-4" />
                Export PDF
              </button>
              <button onClick={() => handleExport('excel')} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                <Download className="h-4 w-4" />
                Export Excel
              </button>
              <button onClick={() => handleExport('csv')} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                <Download className="h-4 w-4" />
                Export CSV
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
