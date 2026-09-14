"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "erp-ui"
import { Monitor, DollarSign, ShoppingCart, CreditCard, Plus, X } from "lucide-react"
import { useEffect, useState } from "react"

export default function POSPage() {
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    number: '',
    tillId: '',
    shiftId: '',
    amount: 0,
    tax: 0,
    total: 0,
    paymentMethod: 'CASH',
    lines: [],
  })

  useEffect(() => {
    fetch("/api/pos/transactions")
      .then(res => res.json())
      .then(data => {
        setTransactions(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/pos/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await response.json()
      if (response.ok) {
        setTransactions([...transactions, data])
        setShowForm(false)
        setFormData({
          number: '',
          tillId: '',
          shiftId: '',
          amount: 0,
          tax: 0,
          total: 0,
          paymentMethod: 'CASH',
          lines: [],
        })
      } else {
        alert('Error: ' + (data.error || 'Failed to create transaction'))
      }
    } catch (error) {
      alert('Error: Failed to create transaction')
      console.error('Failed to create transaction:', error)
    }
  }

  const stats = {
    total: transactions.length,
    today: transactions.filter((t: any) => new Date(t.createdAt).toDateString() === new Date().toDateString()).length,
    revenue: transactions.reduce((sum: number, t: any) => sum + t.total, 0),
    cash: transactions.filter((t: any) => t.paymentMethod === "CASH").length,
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Point of Sale</h1>
          <p className="text-gray-600 mt-1">Checkout transactions, till management</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-blue-600" />
                Today's Sales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{loading ? "..." : stats.today}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">${loading ? "..." : stats.revenue.toLocaleString()}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-purple-600" />
                Card Payments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{loading ? "..." : transactions.filter((t: any) => t.paymentMethod === "CREDIT_CARD").length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-orange-600" />
                Cash Payments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{loading ? "..." : stats.cash}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Recent Transactions</span>
              <button onClick={() => setShowForm(true)} className="flex items-center gap-2 text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                <Plus className="h-4 w-4" />
                New Transaction
              </button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-gray-600">Loading...</p>
            ) : transactions.length === 0 ? (
              <p className="text-gray-600">No transactions found</p>
            ) : (
              <div className="space-y-3">
                {transactions.map((transaction: any) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                        <DollarSign className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">{transaction.number}</p>
                        <p className="text-sm text-gray-600">{new Date(transaction.createdAt).toLocaleString()}</p>
                        <p className="text-xs text-gray-500">{transaction.user?.name || "Unknown"}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${transaction.total.toLocaleString()}</p>
                      <span className="text-xs text-gray-500">{transaction.paymentMethod}</span>
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
                  <span>New Transaction</span>
                  <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-700">
                    <X className="h-5 w-5" />
                  </button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Transaction Number</label>
                    <input
                      type="text"
                      value={formData.number}
                      onChange={(e) => setFormData({...formData, number: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Till ID</label>
                    <input
                      type="text"
                      value={formData.tillId}
                      onChange={(e) => setFormData({...formData, tillId: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="Enter till ID"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Shift ID</label>
                    <input
                      type="text"
                      value={formData.shiftId}
                      onChange={(e) => setFormData({...formData, shiftId: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="Enter shift ID"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Amount</label>
                    <input
                      type="number"
                      value={formData.amount}
                      onChange={(e) => setFormData({...formData, amount: parseFloat(e.target.value)})}
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
                    <label className="block text-sm font-medium mb-1">Payment Method</label>
                    <select
                      value={formData.paymentMethod}
                      onChange={(e) => setFormData({...formData, paymentMethod: e.target.value as any})}
                      className="w-full px-3 py-2 border rounded-lg"
                      required
                    >
                      <option value="CASH">Cash</option>
                      <option value="BANK_TRANSFER">Bank Transfer</option>
                      <option value="CREDIT_CARD">Credit Card</option>
                      <option value="DEBIT_CARD">Debit Card</option>
                      <option value="CHECK">Check</option>
                    </select>
                  </div>
                  <div className="flex gap-2 pt-4">
                    <button type="button" onClick={() => setShowForm(false)} className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50">
                      Cancel
                    </button>
                    <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      Create Transaction
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
