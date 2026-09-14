"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "erp-ui"
import { ShoppingCart, Package, DollarSign, Truck, Plus, X } from "lucide-react"
import { useEffect, useState } from "react"

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    number: '',
    contactId: '',
    subtotal: 0,
    tax: 0,
    total: 0,
    currencyId: '',
    lines: [],
  })

  useEffect(() => {
    fetch("/api/orders")
      .then(res => res.json())
      .then(data => {
        setOrders(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await response.json()
      if (response.ok) {
        setOrders([...orders, data])
        setShowForm(false)
        setFormData({
          number: '',
          contactId: '',
          subtotal: 0,
          tax: 0,
          total: 0,
          currencyId: '',
          lines: [],
        })
      } else {
        alert('Error: ' + (data.error || 'Failed to create order'))
      }
    } catch (error) {
      alert('Error: Failed to create order')
      console.error('Failed to create order:', error)
    }
  }

  const stats = {
    total: orders.length,
    pending: orders.filter((o: any) => o.status === "PENDING").length,
    processing: orders.filter((o: any) => o.status === "PROCESSING").length,
    shipped: orders.filter((o: any) => o.status === "SHIPPED").length,
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DRAFT": return "bg-gray-100 text-gray-700"
      case "PENDING": return "bg-yellow-100 text-yellow-700"
      case "CONFIRMED": return "bg-blue-100 text-blue-700"
      case "PROCESSING": return "bg-purple-100 text-purple-700"
      case "SHIPPED": return "bg-green-100 text-green-700"
      case "DELIVERED": return "bg-emerald-100 text-emerald-700"
      default: return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-600 mt-1">Sales orders, payments, fulfillment</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-blue-600" />
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
                <Package className="h-5 w-5 text-yellow-600" />
                Pending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{loading ? "..." : stats.pending}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-purple-600" />
                Processing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{loading ? "..." : stats.processing}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                Shipped
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{loading ? "..." : stats.shipped}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Recent Orders</span>
              <button onClick={() => setShowForm(true)} className="flex items-center gap-2 text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                <Plus className="h-4 w-4" />
                New Order
              </button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-gray-600">Loading...</p>
            ) : orders.length === 0 ? (
              <p className="text-gray-600">No orders found</p>
            ) : (
              <div className="space-y-3">
                {orders.map((order: any) => (
                  <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <ShoppingCart className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{order.number}</p>
                        <p className="text-sm text-gray-600">{order.contact?.name || "Unknown"}</p>
                        <p className="text-xs text-gray-500">{new Date(order.orderDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${order.total.toLocaleString()}</p>
                      <span className={`text-xs px-2 py-1 rounded ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
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
                  <span>New Order</span>
                  <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-700">
                    <X className="h-5 w-5" />
                  </button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Order Number</label>
                    <input
                      type="text"
                      value={formData.number}
                      onChange={(e) => setFormData({...formData, number: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Customer ID</label>
                    <input
                      type="text"
                      value={formData.contactId}
                      onChange={(e) => setFormData({...formData, contactId: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="Enter customer ID"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Subtotal</label>
                    <input
                      type="number"
                      value={formData.subtotal}
                      onChange={(e) => setFormData({...formData, subtotal: parseFloat(e.target.value)})}
                      className="w-full px-3 py-2 border rounded-lg"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Tax</label>
                    <input
                      type="number"
                      value={formData.tax}
                      onChange={(e) => setFormData({...formData, tax: parseFloat(e.target.value)})}
                      className="w-full px-3 py-2 border rounded-lg"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Total</label>
                    <input
                      type="number"
                      value={formData.total}
                      onChange={(e) => setFormData({...formData, total: parseFloat(e.target.value)})}
                      className="w-full px-3 py-2 border rounded-lg"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Currency ID</label>
                    <input
                      type="text"
                      value={formData.currencyId}
                      onChange={(e) => setFormData({...formData, currencyId: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="Enter currency ID"
                    />
                  </div>
                  <div className="flex gap-2 pt-4">
                    <button type="button" onClick={() => setShowForm(false)} className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50">
                      Cancel
                    </button>
                    <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      Create Order
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
