import React, { useState } from "react";
import { authAPI, setAuthToken } from "../api";
import { useToast } from "../components/Toast";

interface LoginProps {
  onLoginSuccess: (username: string) => void;
  onGoSignup?: () => void;
}

export default function Login({ onLoginSuccess, onGoSignup }: LoginProps) {
  const { addToast } = useToast();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      addToast("Please enter both username and password", "warning");
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.login(username, password);
      const token = response.data.access_token;

      // Store token
      localStorage.setItem("access_token", token);
      localStorage.setItem("username", username);

      // Set token in API client
      setAuthToken(token);

      addToast(`Welcome back, ${username}!`, "success");
      onLoginSuccess(username);
    } catch (error: any) {
      console.error("Login failed:", error);
      addToast(
        error.response?.data?.detail || "Invalid credentials. Try admin/secret",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-2xl">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            🏢 Franchise Manager
          </h1>
          <p className="text-gray-600">Sign in to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
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
            <label className="block mb-2 text-sm font-medium text-gray-700">
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
            className="w-full py-3 font-semibold text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="p-4 mt-6 rounded-lg bg-gray-50">
          <p className="mb-2 text-sm text-center text-gray-600">
            <strong>Demo Credentials:</strong>
          </p>
          <div className="text-center">
            <p className="inline-block px-3 py-1 font-mono text-sm bg-white rounded">
              Username: <span className="font-bold text-blue-600">admin</span>
            </p>
            <br />
            <p className="inline-block px-3 py-1 mt-2 font-mono text-sm bg-white rounded">
              Password: <span className="font-bold text-blue-600">secret</span>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            🔒 Secured with JWT Authentication
          </p>
          {onGoSignup && (
            <div className="mt-3">
              <button
                onClick={onGoSignup}
                className="text-sm text-blue-600 hover:underline"
              >
                Create an account
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
