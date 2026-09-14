"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "erp-ui"
import { Truck, Route, Package, CheckCircle, Plus, X } from "lucide-react"
import { useEffect, useState } from "react"

export default function SCMPage() {
  const [shipments, setShipments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    number: '',
    carrier: '',
    originId: '',
    destinationId: '',
    status: 'PENDING',
    estimatedDelivery: '',
  })

  useEffect(() => {
    fetch("/api/scm/shipments")
      .then(res => res.json())
      .then(data => {
        setShipments(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/scm/shipments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await response.json()
      if (response.ok) {
        setShipments([...shipments, data])
        setShowForm(false)
        setFormData({
          number: '',
          carrier: '',
          originId: '',
          destinationId: '',
          status: 'PENDING',
          estimatedDelivery: '',
        })
      } else {
        alert('Error: ' + (data.error || 'Failed to create shipment'))
      }
    } catch (error) {
      alert('Error: Failed to create shipment')
      console.error('Failed to create shipment:', error)
    }
  }

  const stats = {
    total: shipments.length,
    pending: shipments.filter((s: any) => s.status === "PENDING").length,
    inTransit: shipments.filter((s: any) => s.status === "IN_TRANSIT").length,
    delivered: shipments.filter((s: any) => s.status === "DELIVERED").length,
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING": return "bg-gray-100 text-gray-700"
      case "PICKED_UP": return "bg-blue-100 text-blue-700"
      case "IN_TRANSIT": return "bg-yellow-100 text-yellow-700"
      case "DELIVERED": return "bg-green-100 text-green-700"
      case "DELAYED": return "bg-red-100 text-red-700"
      default: return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Supply Chain Management</h1>
          <p className="text-gray-600 mt-1">Logistics, routes, shipments, transfers</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-blue-600" />
                Total Shipments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{loading ? "..." : stats.total}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-gray-600" />
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
                <Route className="h-5 w-5 text-yellow-600" />
                In Transit
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{loading ? "..." : stats.inTransit}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Delivered
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{loading ? "..." : stats.delivered}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Shipments</span>
              <button onClick={() => setShowForm(true)} className="flex items-center gap-2 text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                <Plus className="h-4 w-4" />
                Create Shipment
              </button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-gray-600">Loading...</p>
            ) : shipments.length === 0 ? (
              <p className="text-gray-600">No shipments found</p>
            ) : (
              <div className="space-y-3">
                {shipments.map((shipment: any) => (
                  <div key={shipment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <Truck className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{shipment.trackingNumber || "No Tracking"}</p>
                        <p className="text-sm text-gray-600">{shipment.route?.name || "No Route"}</p>
                        <p className="text-xs text-gray-500">Carrier ID: {shipment.carrierId || "Unknown"}</p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${getStatusColor(shipment.status)}`}>
                      {shipment.status}
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
                  <span>Create Shipment</span>
                  <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-700">
                    <X className="h-5 w-5" />
                  </button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Shipment Number</label>
                    <input
                      type="text"
                      value={formData.number}
                      onChange={(e) => setFormData({...formData, number: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Carrier</label>
                    <input
                      type="text"
                      value={formData.carrier}
                      onChange={(e) => setFormData({...formData, carrier: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Origin ID</label>
                    <input
                      type="text"
                      value={formData.originId}
                      onChange={(e) => setFormData({...formData, originId: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="Enter origin location ID"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Destination ID</label>
                    <input
                      type="text"
                      value={formData.destinationId}
                      onChange={(e) => setFormData({...formData, destinationId: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="Enter destination location ID"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Estimated Delivery</label>
                    <input
                      type="date"
                      value={formData.estimatedDelivery}
                      onChange={(e) => setFormData({...formData, estimatedDelivery: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div className="flex gap-2 pt-4">
                    <button type="button" onClick={() => setShowForm(false)} className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50">
                      Cancel
                    </button>
                    <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      Create Shipment
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
