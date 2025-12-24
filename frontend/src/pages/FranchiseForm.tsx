import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { franchiseAPI } from "../api";
import { useToast } from "../components/Toast";

interface FranchiseFormData {
  name: string;
  tax_number: string;
  is_active: boolean;
}

interface FranchiseFormProps {
  onSuccess: () => void;
}

export default function FranchiseForm({ onSuccess }: FranchiseFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FranchiseFormData>();
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const onSubmit = async (data: FranchiseFormData) => {
    setLoading(true);
    try {
      await franchiseAPI.create(data);
      addToast("Franchise created successfully!", "success");
      onSuccess();
    } catch (error: any) {
      console.error("Failed to create franchise:", error);
      const message =
        error.response?.data?.detail || "Failed to create franchise";
      addToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md p-6 mx-auto bg-white rounded-lg shadow">
      <h2 className="mb-6 text-2xl font-bold">New Franchise</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Franchise Name
          </label>
          <input
            type="text"
            {...register("name", { required: "Name is required" })}
            className="block w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm"
          />
          {errors.name && (
            <p className="text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Tax Number
          </label>
          <input
            type="text"
            {...register("tax_number", { required: "Tax number is required" })}
            className="block w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm"
          />
          {errors.tax_number && (
            <p className="text-sm text-red-600">{errors.tax_number.message}</p>
          )}
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            {...register("is_active")}
            className="w-4 h-4 text-blue-600"
            defaultChecked={true}
          />
          <label className="ml-2 text-sm text-gray-700">Active</label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? "Creating..." : "Create Franchise"}
        </button>
      </form>
    </div>
  );
}
