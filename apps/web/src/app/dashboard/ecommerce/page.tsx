"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "erp-ui"
import { Globe, ShoppingCart, DollarSign, Package, Plus, X } from "lucide-react"
import { useEffect, useState } from "react"

export default function EcommercePage() {
  const [storefronts, setStorefronts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    organizationId: 'cmtu9mkcf0000yl3x83nmk589',
  })

  useEffect(() => {
    fetch("/api/ecommerce/storefronts")
      .then(res => res.json())
      .then(data => {
        setStorefronts(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/ecommerce/storefronts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await response.json()
      if (response.ok) {
        setStorefronts([...storefronts, data])
        setShowForm(false)
        setFormData({
          name: '',
          url: '',
          organizationId: 'cmtu9mkcf0000yl3x83nmk589',
        })
      } else {
        alert('Error: ' + (data.error || 'Failed to create storefront'))
      }
    } catch (error) {
      alert('Error: Failed to create storefront')
      console.error('Failed to create storefront:', error)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ecommerce</h1>
          <p className="text-gray-600 mt-1">Online storefront, cart, checkout</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-blue-600" />
                Storefronts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{loading ? "..." : storefronts.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-green-600" />
                Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">0</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-purple-600" />
                Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">$0</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-orange-600" />
                Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">0</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Storefronts</span>
              <button onClick={() => setShowForm(true)} className="flex items-center gap-2 text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                <Plus className="h-4 w-4" />
                Add Storefront
              </button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-gray-600">Loading...</p>
            ) : storefronts.length === 0 ? (
              <p className="text-gray-600">No storefronts found</p>
            ) : (
              <div className="space-y-3">
                {storefronts.map((storefront: any) => (
                  <div key={storefront.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <Globe className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{storefront.name}</p>
                        <p className="text-sm text-gray-600">{storefront.domain}</p>
                        <p className="text-xs text-gray-500">{storefront.products?.length || 0} products</p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${storefront.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
                      {storefront.isActive ? "Active" : "Inactive"}
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
                  <span>Add Storefront</span>
                  <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-700">
                    <X className="h-5 w-5" />
                  </button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Storefront Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">URL</label>
                    <input
                      type="url"
                      value={formData.url}
                      onChange={(e) => setFormData({...formData, url: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="https://store.example.com"
                    />
                  </div>
                  <div className="flex gap-2 pt-4">
                    <button type="button" onClick={() => setShowForm(false)} className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50">
                      Cancel
                    </button>
                    <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      Add Storefront
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
