import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { franchiseAPI } from '../api'
import { useToast } from '../components/Toast'

interface FranchiseFormData {
  name: string
  tax_number: string
  is_active: boolean
}

interface FranchiseFormProps {
  onSuccess: () => void
}

export default function FranchiseForm({ onSuccess }: FranchiseFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<FranchiseFormData>()
  const [loading, setLoading] = useState(false)
  const { addToast } = useToast()

  const onSubmit = async (data: FranchiseFormData) => {
    setLoading(true)
    try {
      await franchiseAPI.create(data)
      addToast('Franchise created successfully!', 'success')
      onSuccess()
    } catch (error: any) {
      console.error('Failed to create franchise:', error)
      const message = error.response?.data?.detail || 'Failed to create franchise'
      addToast(message, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6">New Franchise</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Franchise Name</label>
          <input
            type="text"
            {...register('name', { required: 'Name is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 border shadow-sm p-2"
          />
          {errors.name && <p className="text-red-600 text-sm">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Tax Number</label>
          <input
            type="text"
            {...register('tax_number', { required: 'Tax number is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 border shadow-sm p-2"
          />
          {errors.tax_number && <p className="text-red-600 text-sm">{errors.tax_number.message}</p>}
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            {...register('is_active')}
            className="h-4 w-4 text-blue-600"
            defaultChecked={true}
          />
          <label className="ml-2 text-sm text-gray-700">Active</label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Creating...' : 'Create Franchise'}
        </button>
      </form>
    </div>
  )
}
