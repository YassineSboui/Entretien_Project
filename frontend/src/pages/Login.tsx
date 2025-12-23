import React, { useState } from 'react'
import { authAPI, setAuthToken } from '../api'
import { useToast } from '../components/Toast'

interface LoginProps {
  onLoginSuccess: (username: string) => void
  onGoSignup?: () => void
}

export default function Login({ onLoginSuccess, onGoSignup }: LoginProps) {
  const { addToast } = useToast()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!username || !password) {
      addToast('Please enter both username and password', 'warning')
      return
    }

    setLoading(true)
    try {
      const response = await authAPI.login(username, password)
      const token = response.data.access_token
      
      // Store token
      localStorage.setItem('access_token', token)
      localStorage.setItem('username', username)
      
      // Set token in API client
      setAuthToken(token)
      
      addToast(`Welcome back, ${username}!`, 'success')
      onLoginSuccess(username)
    } catch (error: any) {
      console.error('Login failed:', error)
      addToast(
        error.response?.data?.detail || 'Invalid credentials. Try admin/secret',
        'error'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🏢 Franchise Manager
          </h1>
          <p className="text-gray-600">Sign in to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter username"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter password"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 text-center mb-2">
            <strong>Demo Credentials:</strong>
          </p>
          <div className="text-center">
            <p className="text-sm font-mono bg-white px-3 py-1 rounded inline-block">
              Username: <span className="text-blue-600 font-bold">admin</span>
            </p>
            <br />
            <p className="text-sm font-mono bg-white px-3 py-1 rounded inline-block mt-2">
              Password: <span className="text-blue-600 font-bold">secret</span>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            🔒 Secured with JWT Authentication
          </p>
          {onGoSignup && (
            <div className="mt-3">
              <button onClick={onGoSignup} className="text-sm text-blue-600 hover:underline">Create an account</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
