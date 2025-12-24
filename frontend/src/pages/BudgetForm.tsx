import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { budgetAPI, franchiseAPI, branchAPI } from "../api";
import { useToast } from "../components/Toast";

interface BudgetFormData {
  franchise_id: number;
  branch_id: number | null;
  period: string;
  currency: string;
  planned_amount: number;
}

interface Props {
  budgetId?: number;
  onSuccess: () => void;
}

export default function BudgetForm({ budgetId, onSuccess }: Props) {
  const { addToast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<BudgetFormData>();
  const [loading, setLoading] = useState(false);
  const [franchises, setFranchises] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [selectedFranchise, setSelectedFranchise] = useState<number | "">("");

  useEffect(() => {
    fetchFranchises();
    if (budgetId) {
      fetchBudget();
    }
  }, [budgetId]);

  useEffect(() => {
    if (selectedFranchise) {
      fetchBranches(selectedFranchise as number);
    }
  }, [selectedFranchise]);

  const fetchFranchises = async () => {
    try {
      const res = await franchiseAPI.getAll();
      setFranchises(res.data);
    } catch (error) {
      console.error("Failed to fetch franchises:", error);
    }
  };

  const fetchBranches = async (franchiseId: number) => {
    try {
      const res = await branchAPI.getAll(franchiseId);
      setBranches(res.data);
    } catch (error) {
      console.error("Failed to fetch branches:", error);
    }
  };

  const fetchBudget = async () => {
    if (!budgetId) return;
    try {
      const res = await budgetAPI.getById(budgetId);
      const budget = res.data;
      setValue("franchise_id", budget.franchise_id);
      setValue("branch_id", budget.branch_id);
      setValue("period", budget.period);
      setValue("currency", budget.currency);
      setValue("planned_amount", budget.planned_amount);
      setSelectedFranchise(budget.franchise_id);
    } catch (error) {
      console.error("Failed to fetch budget:", error);
      addToast("Failed to load budget", "error");
    }
  };

  const onSubmit = async (data: BudgetFormData) => {
    try {
      setLoading(true);
      if (budgetId) {
        await budgetAPI.update(budgetId, data);
        addToast("Budget updated successfully", "success");
      } else {
        await budgetAPI.create(data);
        addToast("Budget created successfully", "success");
      }
      onSuccess();
    } catch (error: any) {
      console.error("Failed to save budget:", error);
      addToast(
        error.response?.data?.detail || "Failed to save budget",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="mb-6 text-3xl font-bold text-gray-900">
        {budgetId ? "Edit Budget" : "Create New Budget"}
      </h1>

      <div className="p-6 bg-white rounded-lg shadow">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Franchise *
            </label>
            <select
              {...register("franchise_id", {
                required: "Franchise is required",
              })}
              onChange={(e) => {
                setValue("franchise_id", Number(e.target.value));
                setSelectedFranchise(Number(e.target.value));
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Franchise</option>
              {franchises.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
            {errors.franchise_id && (
              <p className="mt-1 text-sm text-red-500">
                {errors.franchise_id.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Branch (Optional)
            </label>
            <select
              {...register("branch_id")}
              disabled={!selectedFranchise}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
            >
              <option value="">Franchise-level (No Branch)</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Period (YYYY-MM) *
            </label>
            <input
              type="text"
              placeholder="2025-12"
              {...register("period", {
                required: "Period is required",
                pattern: {
                  value: /^\d{4}-\d{2}$/,
                  message: "Format: YYYY-MM",
                },
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.period && (
              <p className="mt-1 text-sm text-red-500">
                {errors.period.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Currency *
            </label>
            <input
              type="text"
              placeholder="TRY"
              defaultValue="TRY"
              {...register("currency", {
                required: "Currency is required",
                minLength: { value: 3, message: "Min 3 characters" },
                maxLength: { value: 3, message: "Max 3 characters" },
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.currency && (
              <p className="mt-1 text-sm text-red-500">
                {errors.currency.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Planned Amount *
            </label>
            <input
              type="number"
              step="0.01"
              {...register("planned_amount", {
                required: "Planned amount is required",
                min: { value: 0, message: "Must be positive" },
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.planned_amount && (
              <p className="mt-1 text-sm text-red-500">
                {errors.planned_amount.message}
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? "Saving..." : "Save Budget"}
            </button>
            <button
              type="button"
              onClick={onSuccess}
              className="px-4 py-2 text-gray-600 hover:text-gray-900"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
