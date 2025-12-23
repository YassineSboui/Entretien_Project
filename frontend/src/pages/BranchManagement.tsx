import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { branchAPI, franchiseAPI } from '../api'
import { useToast } from '../components/Toast'

interface BranchFormData {
  name: string
  city: string
  franchise_id: number
}

interface Branch {
  id: number
  name: string
  city: string
  franchise_id: number
}

interface Franchise {
  id: number
  name: string
}

export default function BranchManagement() {
  const { addToast } = useToast()
  const { register, handleSubmit, reset, formState: { errors } } = useForm<BranchFormData>()
  const [branches, setBranches] = useState<Branch[]>([])
  const [franchises, setFranchises] = useState<Franchise[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const branchesRes = await branchAPI.getAll()
      const franchisesRes = await franchiseAPI.getAll()
      setBranches(branchesRes.data)
      setFranchises(franchisesRes.data)
    } catch (error) {
      console.error('Failed to fetch data:', error)
      addToast('Failed to load branches and franchises', 'error')
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: BranchFormData) => {
    try {
      await branchAPI.create(data)
      reset()
      fetchData()
      addToast('Branch created successfully!', 'success')
    } catch (error: any) {
      console.error('Failed to create branch:', error)
      addToast(error.response?.data?.detail || 'Failed to create branch', 'error')
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this branch?')) {
      try {
        await branchAPI.delete(id)
        setBranches(branches.filter(b => b.id !== id))
        addToast('Branch deleted successfully', 'success')
      } catch (error: any) {
        console.error('Failed to delete branch:', error)
        addToast(error.response?.data?.detail || 'Failed to delete branch', 'error')
      }
    }
  }

  if (loading) return <p>Loading...</p>

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold mb-4">Add Branch</h3>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Franchise</label>
            <select
              {...register('franchise_id', { required: 'Franchise is required' })}
              className="mt-1 block w-full rounded-md border-gray-300 border shadow-sm p-2"
            >
              <option value="">Select Franchise</option>
              {franchises.map(f => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
            {errors.franchise_id && <p className="text-red-600 text-sm">{errors.franchise_id.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Branch Name</label>
            <input
              type="text"
              {...register('name', { required: 'Name is required' })}
              className="mt-1 block w-full rounded-md border-gray-300 border shadow-sm p-2"
            />
            {errors.name && <p className="text-red-600 text-sm">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">City</label>
            <input
              type="text"
              {...register('city', { required: 'City is required' })}
              className="mt-1 block w-full rounded-md border-gray-300 border shadow-sm p-2"
            />
            {errors.city && <p className="text-red-600 text-sm">{errors.city.message}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
          >
            Add Branch
          </button>
        </form>
      </div>

      <div className="lg:col-span-2 bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b">
          <h3 className="text-xl font-bold">Branches</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Name</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">City</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Franchise</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {branches.map(branch => (
                <tr key={branch.id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4">{branch.name}</td>
                  <td className="px-6 py-4">{branch.city}</td>
                  <td className="px-6 py-4">
                    {franchises.find(f => f.id === branch.franchise_id)?.name}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDelete(branch.id)}
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
    </div>
  )
}
