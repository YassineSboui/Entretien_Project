import React, { useEffect, useState } from 'react'
import { franchiseAPI, branchAPI } from '../api'
import { useToast } from '../components/Toast'

interface DashboardStats {
  franchiseCount: number
  branchCount: number
  activeCount: number
  inactiveCount: number
  totalRevenue: string
}

export default function Dashboard() {
  const { addToast } = useToast()
  const [stats, setStats] = useState<DashboardStats>({
    franchiseCount: 0,
    branchCount: 0,
    activeCount: 0,
    inactiveCount: 0,
    totalRevenue: '₺6,500,000',
  })
  const [loading, setLoading] = useState(true)
  const activePercentage = stats.franchiseCount
    ? Math.round((stats.activeCount / stats.franchiseCount) * 100)
    : 0

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const franchiseStatsRes = await franchiseAPI.getStats()
        const branchesRes = await branchAPI.getAll()
        
        setStats({
          franchiseCount: franchiseStatsRes.data.total_franchises,
          branchCount: branchesRes.data.length,
          activeCount: franchiseStatsRes.data.active_franchises,
          inactiveCount: franchiseStatsRes.data.inactive_franchises,
          totalRevenue: '₺6,500,000',
        })
        setLoading(false)
      } catch (error) {
        console.error('Failed to fetch stats:', error)
        addToast('Failed to load dashboard statistics', 'error')
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading statistics...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 text-sm font-medium">Total Franchises</h3>
              <p className="text-3xl font-bold text-blue-600">{stats.franchiseCount}</p>
            </div>
            <div className="text-blue-600">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 text-sm font-medium">Active Franchises</h3>
              <p className="text-3xl font-bold text-green-600">{stats.activeCount}</p>
            </div>
            <div className="text-green-600">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 text-sm font-medium">Inactive Franchises</h3>
              <p className="text-3xl font-bold text-red-600">{stats.inactiveCount}</p>
            </div>
            <div className="text-red-600">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 text-sm font-medium">Branch Count</h3>
              <p className="text-3xl font-bold text-purple-600">{stats.branchCount}</p>
            </div>
            <div className="text-purple-600">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Revenue Overview</h2>
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg p-6 text-white">
          <h3 className="text-sm font-medium opacity-90">Total Revenue (Estimated)</h3>
          <p className="text-4xl font-bold">{stats.totalRevenue}</p>
          <p className="text-sm mt-2 opacity-80">Based on franchise operations</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">Active Status</h3>
          <p className="text-3xl font-bold text-green-600">{activePercentage}% active</p>
        </div>
      </div>
    </div>
  )
}
