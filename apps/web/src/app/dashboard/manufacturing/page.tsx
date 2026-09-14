"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "erp-ui"
import { Wrench, FileText, Calendar, Settings, Plus, X } from "lucide-react"
import { useEffect, useState } from "react"

export default function ManufacturingPage() {
  const [workOrders, setWorkOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    number: '',
    productId: '',
    quantity: 1,
    status: 'PLANNED',
    startDate: '',
    endDate: '',
    organizationId: 'cmtu9mkcf0000yl3x83nmk589',
  })

  useEffect(() => {
    fetch("/api/manufacturing/work-orders")
      .then(res => res.json())
      .then(data => {
        setWorkOrders(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/manufacturing/work-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await response.json()
      if (response.ok) {
        setWorkOrders([...workOrders, data])
        setShowForm(false)
        setFormData({
          number: '',
          productId: '',
          quantity: 1,
          status: 'PLANNED',
          startDate: '',
          endDate: '',
          organizationId: 'cmtu9mkcf0000yl3x83nmk589',
        })
      } else {
        alert('Error: ' + (data.error || 'Failed to create work order'))
      }
    } catch (error) {
      alert('Error: Failed to create work order')
      console.error('Failed to create work order:', error)
    }
  }

  const stats = {
    total: workOrders.length,
    planned: workOrders.filter((wo: any) => wo.status === "PLANNED").length,
    inProgress: workOrders.filter((wo: any) => wo.status === "IN_PROGRESS").length,
    completed: workOrders.filter((wo: any) => wo.status === "COMPLETED").length,
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PLANNED": return "bg-blue-100 text-blue-700"
      case "RELEASED": return "bg-purple-100 text-purple-700"
      case "IN_PROGRESS": return "bg-yellow-100 text-yellow-700"
      case "COMPLETED": return "bg-green-100 text-green-700"
      default: return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manufacturing (MRP)</h1>
          <p className="text-gray-600 mt-1">BOM, work orders, production scheduling</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Total Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{loading ? "..." : stats.total}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                Planned
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{loading ? "..." : stats.planned}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-yellow-600" />
                In Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{loading ? "..." : stats.inProgress}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5 text-green-600" />
                Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{loading ? "..." : stats.completed}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Work Orders</span>
              <button onClick={() => setShowForm(true)} className="flex items-center gap-2 text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                <Plus className="h-4 w-4" />
                Create Work Order
              </button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-gray-600">Loading...</p>
            ) : workOrders.length === 0 ? (
              <p className="text-gray-600">No work orders found</p>
            ) : (
              <div className="space-y-3">
                {workOrders.map((workOrder: any) => (
                  <div key={workOrder.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <Wrench className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{workOrder.number}</p>
                        <p className="text-sm text-gray-600">Qty: {workOrder.quantity}</p>
                        <p className="text-xs text-gray-500">{new Date(workOrder.dueDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${getStatusColor(workOrder.status)}`}>
                      {workOrder.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md mx-4">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Create Work Order</span>
                  <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-700">
                    <X className="h-5 w-5" />
                  </button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Work Order Number</label>
                    <input
                      type="text"
                      value={formData.number}
                      onChange={(e) => setFormData({...formData, number: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Product ID</label>
                    <input
                      type="text"
                      value={formData.productId}
                      onChange={(e) => setFormData({...formData, productId: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="Enter product ID"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Quantity</label>
                    <input
                      type="number"
                      value={formData.quantity}
                      onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border rounded-lg"
                      min="1"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Start Date</label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">End Date</label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div className="flex gap-2 pt-4">
                    <button type="button" onClick={() => setShowForm(false)} className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50">
                      Cancel
                    </button>
                    <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      Create Work Order
                    </button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
