import React, { useState, useEffect } from "react";
import "./index.css";
import Dashboard from "./pages/Dashboard";
import FranchiseForm from "./pages/FranchiseForm";
import FranchiseList from "./pages/FranchiseList";
import BranchManagement from "./pages/BranchManagement";
import BudgetList from "./pages/BudgetList";
import BudgetForm from "./pages/BudgetForm";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { ToastProvider, ToastContainer } from "./components/Toast";
import { setAuthToken } from "./api";

type PageType =
  | "dashboard"
  | "franchises"
  | "franchises-new"
  | "branches"
  | "budgets"
  | "budgets-new"
  | "budgets-view";

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>("dashboard");
  const [selectedBudgetId, setSelectedBudgetId] = useState<number | undefined>(
    undefined
  );
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem("access_token");
    const savedUsername = localStorage.getItem("username");

    if (token && savedUsername) {
      setAuthToken(token);
      setIsAuthenticated(true);
      setUsername(savedUsername);
    }
  }, []);

  const handleLoginSuccess = (user: string) => {
    setIsAuthenticated(true);
    setUsername(user);
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("username");
    setAuthToken("");
    setIsAuthenticated(false);
    setUsername(null);
    setCurrentPage("dashboard");
  };

  if (!isAuthenticated) {
    return (
      <ToastProvider>
        <ToastContainer />
        {authMode === "login" ? (
          <Login
            onLoginSuccess={handleLoginSuccess}
            onGoSignup={() => setAuthMode("signup")}
          />
        ) : (
          <Signup
            onSignupSuccess={handleLoginSuccess}
            onGoLogin={() => setAuthMode("login")}
          />
        )}
      </ToastProvider>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard />;
      case "franchises":
        return (
          <FranchiseList onNewClick={() => setCurrentPage("franchises-new")} />
        );
      case "franchises-new":
        return <FranchiseForm onSuccess={() => setCurrentPage("franchises")} />;
      case "branches":
        return <BranchManagement />;
      case "budgets":
        return (
          <BudgetList
            onNewClick={() => setCurrentPage("budgets-new")}
            onViewClick={(id) => {
              setSelectedBudgetId(id);
              setCurrentPage("budgets-view");
            }}
          />
        );
      case "budgets-new":
        return <BudgetForm onSuccess={() => setCurrentPage("budgets")} />;
      case "budgets-view":
        return (
          <BudgetForm
            budgetId={selectedBudgetId}
            onSuccess={() => setCurrentPage("budgets")}
          />
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <ToastProvider>
      <ToastContainer />
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow">
          <div className="container flex items-center justify-between px-4 py-4 mx-auto">
            <h1
              className="text-2xl font-bold text-blue-600 cursor-pointer"
              onClick={() => setCurrentPage("dashboard")}
            >
              Franchise CRM
            </h1>
            <div className="flex items-center space-x-6">
              <div className="space-x-4">
                <button
                  onClick={() => setCurrentPage("dashboard")}
                  className={`text-gray-700 hover:text-blue-600 ${
                    currentPage === "dashboard" ? "font-bold text-blue-600" : ""
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setCurrentPage("franchises")}
                  className={`text-gray-700 hover:text-blue-600 ${
                    currentPage.includes("franchises")
                      ? "font-bold text-blue-600"
                      : ""
                  }`}
                >
                  Franchises
                </button>
                <button
                  onClick={() => setCurrentPage("branches")}
                  className={`text-gray-700 hover:text-blue-600 ${
                    currentPage === "branches" ? "font-bold text-blue-600" : ""
                  }`}
                >
                  Branches
                </button>
                <button
                  onClick={() => setCurrentPage("budgets")}
                  className={`text-gray-700 hover:text-blue-600 ${
                    currentPage.includes("budgets")
                      ? "font-bold text-blue-600"
                      : ""
                  }`}
                >
                  Budgets
                </button>
              </div>

              <div className="flex items-center pl-6 space-x-3 border-l">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">👤</span>
                  <span className="text-sm font-medium text-gray-700">
                    {username}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-red-600 hover:text-red-700"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>

        <main className="container px-4 py-8 mx-auto">{renderPage()}</main>
      </div>
    </ToastProvider>
  );
}

export default App;
