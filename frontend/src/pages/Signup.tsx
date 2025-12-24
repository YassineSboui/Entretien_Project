import React, { useState } from "react";
import { authAPI, setAuthToken } from "../api";
import { useToast } from "../components/Toast";

interface SignupProps {
  onSignupSuccess: (username: string) => void;
  onGoLogin: () => void;
}

export default function Signup({ onSignupSuccess, onGoLogin }: SignupProps) {
  const { addToast } = useToast();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      addToast("Username and password are required", "warning");
      return;
    }
    if (password !== confirm) {
      addToast("Passwords do not match", "error");
      return;
    }

    setLoading(true);
    try {
      const res = await authAPI.signup({
        username,
        password,
        email: email || undefined,
      });
      const token = res.data.access_token;
      localStorage.setItem("access_token", token);
      localStorage.setItem("username", username);
      setAuthToken(token);
      addToast("Account created successfully!", "success");
      onSignupSuccess(username);
    } catch (err: any) {
      addToast(err.response?.data?.detail || "Signup failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-2xl">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            Create Account
          </h1>
          <p className="text-gray-600">Join Franchise Manager</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              placeholder="Enter your username"
              title="Username"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Email (optional)
            </label>
            <input
              type="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              placeholder="Enter your email (optional)"
              title="Email"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              placeholder="Enter your password"
              title="Password"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              disabled={loading}
              placeholder="Confirm your password"
              title="Confirm Password"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 font-semibold text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={onGoLogin}
            className="text-sm text-blue-600 hover:underline"
          >
            Already have an account? Sign in
          </button>
        </div>
      </div>
    </div>
  );
}
