"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "erp-ui"
import { DollarSign, TrendingUp, TrendingDown, Wallet, Plus, X } from "lucide-react"
import { useEffect, useState } from "react"

export default function FinancialPage() {
  const [accounts, setAccounts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    type: 'ASSET',
    currencyId: '',
  })

  useEffect(() => {
    fetch("/api/financial/accounts")
      .then(res => res.json())
      .then(data => {
        setAccounts(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/financial/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: formData.code,
          name: formData.name,
          type: formData.type,
          parentId: formData.parentId || null,
          currencyId: formData.currencyId || null,
        }),
      })
      const data = await response.json()
      if (response.ok) {
        setAccounts([...accounts, data])
        setShowForm(false)
        setFormData({
          code: '',
          name: '',
          type: 'ASSET',
          currencyId: '',
        })
      } else {
        alert('Error: ' + (data.error || 'Failed to create account'))
      }
    } catch (error) {
      alert('Error: Failed to create account')
      console.error('Failed to create account:', error)
    }
  }

  const calculateTotals = () => {
    const assets = accounts.filter((a: any) => a.type === "ASSET").reduce((sum: number, a: any) => sum + a.balance, 0)
    const liabilities = accounts.filter((a: any) => a.type === "LIABILITY").reduce((sum: number, a: any) => sum + a.balance, 0)
    const revenue = accounts.filter((a: any) => a.type === "REVENUE").reduce((sum: number, a: any) => sum + a.balance, 0)
    const expenses = accounts.filter((a: any) => a.type === "EXPENSE").reduce((sum: number, a: any) => sum + a.balance, 0)
    return { assets, liabilities, revenue, expenses }
  }

  const totals = calculateTotals()

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Financial Management</h1>
          <p className="text-gray-600 mt-1">General Ledger, AP, AR, Cash Flow</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-blue-600" />
                Total Assets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">${loading ? "..." : totals.assets.toLocaleString()}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-red-600" />
                Liabilities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">${loading ? "..." : totals.liabilities.toLocaleString()}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">${loading ? "..." : totals.revenue.toLocaleString()}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-orange-600" />
                Expenses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">${loading ? "..." : totals.expenses.toLocaleString()}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Chart of Accounts</span>
              <button onClick={() => setShowForm(true)} className="flex items-center gap-2 text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                <Plus className="h-4 w-4" />
                Add Account
              </button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-gray-600">Loading...</p>
            ) : accounts.length === 0 ? (
              <p className="text-gray-600">No accounts found</p>
            ) : (
              <div className="space-y-3">
                {accounts.map((account: any) => (
                  <div key={account.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        account.type === "ASSET" ? "bg-blue-100" :
                        account.type === "LIABILITY" ? "bg-red-100" :
                        account.type === "REVENUE" ? "bg-green-100" : "bg-orange-100"
                      }`}>
                        <Wallet className={`h-5 w-5 ${
                          account.type === "ASSET" ? "text-blue-600" :
                          account.type === "LIABILITY" ? "text-red-600" :
                          account.type === "REVENUE" ? "text-green-600" : "text-orange-600"
                        }`} />
                      </div>
                      <div>
                        <p className="font-medium">{account.code} - {account.name}</p>
                        <p className="text-sm text-gray-600">{account.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${account.balance.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">{account.currency?.code || "USD"}</p>
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
                  <span>Add Account</span>
                  <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-700">
                    <X className="h-5 w-5" />
                  </button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Account Code</label>
                    <input
                      type="text"
                      value={formData.code}
                      onChange={(e) => setFormData({...formData, code: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Account Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Account Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                      className="w-full px-3 py-2 border rounded-lg"
                      required
                    >
                      <option value="ASSET">Asset</option>
                      <option value="LIABILITY">Liability</option>
                      <option value="EQUITY">Equity</option>
                      <option value="REVENUE">Revenue</option>
                      <option value="EXPENSE">Expense</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Currency ID</label>
                    <input
                      type="text"
                      value={formData.currencyId}
                      onChange={(e) => setFormData({...formData, currencyId: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="Enter currency ID"
                      required
                    />
                  </div>
                  <div className="flex gap-2 pt-4">
                    <button type="button" onClick={() => setShowForm(false)} className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50">
                      Cancel
                    </button>
                    <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      Add Account
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
