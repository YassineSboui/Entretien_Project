import React, { useEffect, useState } from 'react'
import { budgetAPI, franchiseAPI } from '../api'
import { useToast } from '../components/Toast'

interface Budget {
  id: number
  franchise_id: number
  branch_id: number | null
  period: string
  currency: string
  planned_amount: number
  approved_amount: number | null
  actual_amount: number
  status: string
}

interface Props {
  onNewClick: () => void
  onViewClick: (id: number) => void
}

export default function BudgetList({ onNewClick, onViewClick }: Props) {
  const { addToast } = useToast()
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [loading, setLoading] = useState(true)
  const [franchiseFilter, setFranchiseFilter] = useState<number | ''>('')
  const [periodFilter, setPeriodFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    fetchBudgets()
  }, [franchiseFilter, periodFilter, statusFilter])

  const fetchBudgets = async () => {
    try {
      setLoading(true)
      const params: any = {}
      if (franchiseFilter) params.franchise_id = franchiseFilter
      if (periodFilter) params.period = periodFilter
      const res = await budgetAPI.getAll(params)
      let filtered = res.data
      if (statusFilter) {
        filtered = filtered.filter((b: Budget) => b.status === statusFilter)
      }
      setBudgets(filtered)
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch budgets:', error)
      addToast('Failed to load budgets', 'error')
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this budget?')) return
    try {
      await budgetAPI.delete(id)
      addToast('Budget deleted successfully', 'success')
      fetchBudgets()
    } catch (error) {
      console.error('Failed to delete budget:', error)
      addToast('Failed to delete budget', 'error')
    }
  }

  const handleApprove = async (id: number) => {
    try {
      await budgetAPI.approve(id)
      addToast('Budget approved', 'success')
      fetchBudgets()
    } catch (error) {
      console.error('Failed to approve budget:', error)
      addToast('Failed to approve budget', 'error')
    }
  }

  const handleReject = async (id: number) => {
    try {
      await budgetAPI.reject(id)
      addToast('Budget rejected', 'success')
      fetchBudgets()
    } catch (error) {
      console.error('Failed to reject budget:', error)
      addToast('Failed to reject budget', 'error')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-50'
      case 'draft': return 'text-gray-600 bg-gray-50'
      case 'rejected': return 'text-red-600 bg-red-50'
      case 'closed': return 'text-blue-600 bg-blue-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>
  }

  const totalPlanned = budgets.reduce((sum, b) => sum + b.planned_amount, 0)
  const totalActual = budgets.reduce((sum, b) => sum + b.actual_amount, 0)
  const variance = totalActual - totalPlanned

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Budget Management</h1>
        <button
          onClick={onNewClick}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + New Budget
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">Total Planned</h3>
          <p className="text-2xl font-bold text-blue-600">₺{totalPlanned.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">Total Actual</h3>
          <p className="text-2xl font-bold text-green-600">₺{totalActual.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">Variance</h3>
          <p className={`text-2xl font-bold ${variance >= 0 ? 'text-red-600' : 'text-green-600'}`}>
            ₺{variance.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Period (YYYY-MM)
            </label>
            <input
              type="text"
              placeholder="2025-12"
              value={periodFilter}
              onChange={(e) => setPeriodFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">All</option>
              <option value="draft">Draft</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setPeriodFilter('')
                setStatusFilter('')
                setFranchiseFilter('')
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-900"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Budget Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Period
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Planned
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Approved
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actual
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {budgets.map((budget) => (
              <tr key={budget.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {budget.period}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ₺{budget.planned_amount.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {budget.approved_amount ? `₺${budget.approved_amount.toLocaleString()}` : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ₺{budget.actual_amount.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(budget.status)}`}>
                    {budget.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => onViewClick(budget.id)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    View
                  </button>
                  {budget.status === 'draft' && (
                    <>
                      <button
                        onClick={() => handleApprove(budget.id)}
                        className="text-green-600 hover:text-green-900"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(budget.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleDelete(budget.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
