"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "erp-ui"
import { Clock, Play, Square, Calendar, DollarSign, Plus, X } from "lucide-react"
import { useEffect, useState } from "react"

export default function WFMPage() {
  const [timeEntries, setTimeEntries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isClockedIn, setIsClockedIn] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    employeeId: 'temp-id',
    date: new Date().toISOString().split('T')[0],
    clockIn: '',
    clockOut: '',
    breakMinutes: 0,
  })

  useEffect(() => {
    fetch("/api/wfm/time-entries")
      .then(res => res.json())
      .then(data => {
        setTimeEntries(data)
        setLoading(false)
        const todayEntry = data.find((entry: any) => 
          new Date(entry.date).toDateString() === new Date().toDateString() && !entry.clockOut
        )
        setIsClockedIn(!!todayEntry)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleClockIn = async () => {
    const response = await fetch("/api/wfm/time-entries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        employeeId: "temp-id",
        date: new Date().toISOString(),
        clockIn: new Date().toISOString(),
        breakMinutes: 0,
      }),
    })
    if (response.ok) {
      setIsClockedIn(true)
      const newEntry = await response.json()
      setTimeEntries([newEntry, ...timeEntries])
    }
  }

  const handleClockOut = async () => {
    const todayEntry = timeEntries.find((entry: any) =>
      new Date(entry.date).toDateString() === new Date().toDateString() && !entry.clockOut
    )
    if (todayEntry) {
      setIsClockedIn(false)
      const updatedEntry = { ...todayEntry, clockOut: new Date().toISOString() }
      setTimeEntries(timeEntries.map((e: any) => e.id === todayEntry.id ? updatedEntry : e))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/wfm/time-entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          clockIn: formData.clockIn || new Date().toISOString(),
        }),
      })
      const data = await response.json()
      if (response.ok) {
        setTimeEntries([data, ...timeEntries])
        setShowForm(false)
        setFormData({
          employeeId: 'temp-id',
          date: new Date().toISOString().split('T')[0],
          clockIn: '',
          clockOut: '',
          breakMinutes: 0,
        })
      } else {
        alert('Error: ' + (data.error || 'Failed to create time entry'))
      }
    } catch (error) {
      alert('Error: Failed to create time entry')
      console.error('Failed to create time entry:', error)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Workforce Management</h1>
          <p className="text-gray-600 mt-1">Timekeeping, attendance, payroll processing</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                Hours Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">0.0</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-green-600" />
                This Week
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">0.0</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-purple-600" />
                Overtime
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">0.0</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-600" />
                Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-2xl font-bold ${isClockedIn ? "text-green-600" : "text-gray-600"}`}>
                {isClockedIn ? "Clocked In" : "Clocked Out"}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Time Clock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              {!isClockedIn ? (
                <button
                  onClick={handleClockIn}
                  className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
                >
                  <Play className="h-5 w-5" />
                  Clock In
                </button>
              ) : (
                <button
                  onClick={handleClockOut}
                  className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700"
                >
                  <Square className="h-5 w-5" />
                  Clock Out
                </button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Recent Time Entries</span>
              <button onClick={() => setShowForm(true)} className="flex items-center gap-2 text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                <Plus className="h-4 w-4" />
                Add Entry
              </button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-gray-600">Loading...</p>
            ) : timeEntries.length === 0 ? (
              <p className="text-gray-600">No time entries found</p>
            ) : (
              <div className="space-y-3">
                {timeEntries.map((entry: any) => (
                  <div key={entry.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{new Date(entry.date).toLocaleDateString()}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(entry.clockIn).toLocaleTimeString()} - {entry.clockOut ? new Date(entry.clockOut).toLocaleTimeString() : "Active"}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      entry.status === "APPROVED" ? "bg-green-100 text-green-700" : 
                      entry.status === "PENDING" ? "bg-yellow-100 text-yellow-700" : 
                      "bg-red-100 text-red-700"
                    }`}>
                      {entry.status}
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
                  <span>Add Time Entry</span>
                  <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-700">
                    <X className="h-5 w-5" />
                  </button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Date</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Clock In</label>
                    <input
                      type="datetime-local"
                      value={formData.clockIn}
                      onChange={(e) => setFormData({...formData, clockIn: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Clock Out</label>
                    <input
                      type="datetime-local"
                      value={formData.clockOut}
                      onChange={(e) => setFormData({...formData, clockOut: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Break Minutes</label>
                    <input
                      type="number"
                      value={formData.breakMinutes}
                      onChange={(e) => setFormData({...formData, breakMinutes: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border rounded-lg"
                      min="0"
                    />
                  </div>
                  <div className="flex gap-2 pt-4">
                    <button type="button" onClick={() => setShowForm(false)} className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50">
                      Cancel
                    </button>
                    <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      Add Entry
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
