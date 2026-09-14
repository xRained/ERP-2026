"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "erp-ui"
import { FileText, DollarSign, Clock, CheckCircle, Plus, X } from "lucide-react"
import { useEffect, useState } from "react"

export default function CPQPage() {
  const [quotes, setQuotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    number: '',
    opportunityId: '',
    customerId: '',
    subtotal: 0,
    tax: 0,
    total: 0,
    validUntil: '',
    currencyId: '',
    lines: [],
  })

  useEffect(() => {
    fetch("/api/cpq/quotes")
      .then(res => res.json())
      .then(data => {
        setQuotes(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/cpq/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await response.json()
      if (response.ok) {
        setQuotes([...quotes, data])
        setShowForm(false)
        setFormData({
          number: '',
          opportunityId: '',
          customerId: '',
          subtotal: 0,
          tax: 0,
          total: 0,
          validUntil: '',
          currencyId: '',
          lines: [],
        })
      } else {
        alert('Error: ' + (data.error || 'Failed to create quote'))
      }
    } catch (error) {
      alert('Error: Failed to create quote')
      console.error('Failed to create quote:', error)
    }
  }

  const stats = {
    total: quotes.length,
    draft: quotes.filter((q: any) => q.status === "DRAFT").length,
    sent: quotes.filter((q: any) => q.status === "SENT").length,
    accepted: quotes.filter((q: any) => q.status === "ACCEPTED").length,
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DRAFT": return "bg-gray-100 text-gray-700"
      case "SENT": return "bg-blue-100 text-blue-700"
      case "ACCEPTED": return "bg-green-100 text-green-700"
      case "REJECTED": return "bg-red-100 text-red-700"
      case "EXPIRED": return "bg-orange-100 text-orange-700"
      default: return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Configure, Price, Quote</h1>
          <p className="text-gray-600 mt-1">Pricing rules, product configuration, quotes</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Total Quotes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{loading ? "..." : stats.total}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-gray-600" />
                Draft
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{loading ? "..." : stats.draft}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                Sent
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{loading ? "..." : stats.sent}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Accepted
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{loading ? "..." : stats.accepted}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Quotes</span>
              <button onClick={() => setShowForm(true)} className="flex items-center gap-2 text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                <Plus className="h-4 w-4" />
                Create Quote
              </button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-gray-600">Loading...</p>
            ) : quotes.length === 0 ? (
              <p className="text-gray-600">No quotes found</p>
            ) : (
              <div className="space-y-3">
                {quotes.map((quote: any) => (
                  <div key={quote.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{quote.number}</p>
                        <p className="text-sm text-gray-600">{quote.contact?.name || "Unknown"}</p>
                        <p className="text-xs text-gray-500">Valid until: {new Date(quote.validUntil).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${quote.total.toLocaleString()}</p>
                      <span className={`text-xs px-2 py-1 rounded ${getStatusColor(quote.status)}`}>
                        {quote.status}
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
                  <span>Create Quote</span>
                  <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-700">
                    <X className="h-5 w-5" />
                  </button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Quote Number</label>
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
                      value={formData.customerId}
                      onChange={(e) => setFormData({...formData, customerId: e.target.value})}
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
                    <label className="block text-sm font-medium mb-1">Valid Until</label>
                    <input
                      type="date"
                      value={formData.validUntil}
                      onChange={(e) => setFormData({...formData, validUntil: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg"
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
                      Create Quote
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
