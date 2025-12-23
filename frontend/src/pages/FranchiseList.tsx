import React, { useEffect, useState } from 'react'
import { franchiseAPI } from '../api'
import { useToast } from '../components/Toast'

interface Franchise {
  id: number
  name: string
  tax_number: string
  is_active: boolean
  created_at: string
}

interface FranchiseListProps {
  onNewClick: () => void
}

export default function FranchiseList({ onNewClick }: FranchiseListProps) {
  const [franchises, setFranchises] = useState<Franchise[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterActive, setFilterActive] = useState<boolean | undefined>(undefined)
  const { addToast } = useToast()

  useEffect(() => {
    fetchFranchises()
  }, [search, filterActive])

  const fetchFranchises = async () => {
    try {
      const response = await franchiseAPI.getAll({ 
        search: search || undefined, 
        is_active: filterActive,
        limit: 50
      })
      setFranchises(response.data)
    } catch (error) {
      console.error('Failed to fetch franchises:', error)
      addToast('Failed to fetch franchises', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure?')) {
      try {
        await franchiseAPI.delete(id)
        setFranchises(franchises.filter(f => f.id !== id))
        addToast('Franchise deleted successfully', 'success')
      } catch (error) {
        console.error('Failed to delete franchise:', error)
        addToast('Failed to delete franchise', 'error')
      }
    }
  }

  if (loading) return <p>Loading...</p>

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Franchises</h2>
        <button onClick={onNewClick} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          + New Franchise
        </button>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow p-4 flex gap-4">
        <input
          type="text"
          placeholder="Search franchises..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={filterActive === undefined ? '' : filterActive.toString()}
          onChange={(e) => setFilterActive(e.target.value === '' ? undefined : e.target.value === 'true')}
          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Status</option>
          <option value="true">Active Only</option>
          <option value="false">Inactive Only</option>
        </select>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Name</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Tax Number</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Status</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Created</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {franchises.map(franchise => (
              <tr key={franchise.id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4">{franchise.name}</td>
                <td className="px-6 py-4">{franchise.tax_number}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-sm ${franchise.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {franchise.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{new Date(franchise.created_at).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleDelete(franchise.id)}
                    className="text-red-600 hover:text-red-900 text-sm"
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
