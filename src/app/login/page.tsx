// VendorLoginPage.tsx
"use client";

import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

type FormData = {
  email: string;
  password: string;
};

export default function VendorLoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = (data: FormData) => {
    console.log("Login data:", data);
    // TODO: Add actual login API call
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FF7EB3]/20 to-[#DC3173]/20 p-6">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-gray-900 rounded-3xl shadow-2xl w-full max-w-md p-10"
      >
        <h1 className="text-4xl font-extrabold text-white text-center mb-8">
          Vendor Login
        </h1>
        <p className="text-gray-300 text-center mb-8">
          Access your vendor dashboard and manage your products, orders, and earnings.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email */}
          <div>
            <label className="text-gray-300 font-medium mb-1 block">Email</label>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              placeholder="yourname@deligo.pt"
              className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
            />
            {errors.email && <p className="text-red-500 mt-1 text-sm">{errors.email.message}</p>}
          </div>

          {/* Password */}
       <div className="relative">
  <label className="text-gray-300 font-medium mb-1 block">Password</label>
  <div className="relative flex items-center">
    <input
      type={showPassword ? "text" : "password"}
      {...register("password", { required: "Password is required" })}
      placeholder="********"
      className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400 transition pr-12"
    />
    <button
      type="button"
      className="absolute right-3 flex items-center justify-center h-full text-gray-400 hover:text-pink-400 transition"
      onClick={() => setShowPassword(!showPassword)}
    >
      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
    </button>
  </div>
  {errors.password && (
    <p className="text-red-500 mt-1 text-sm">{errors.password.message}</p>
  )}
</div>







          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-full bg-gradient-to-r from-[#FF7EB3] to-[#DC3173] text-white font-bold text-lg hover:scale-105 hover:shadow-lg transition"
          >
            Login
          </button>
        </form>

        {/* Forgot Password */}
        <p className="text-gray-400 text-center mt-4">
          Forgot your password?{" "}
          <a href="/vendor/forgot-password" className="text-pink-400 font-medium hover:underline">
            Reset here
          </a>
        </p>

        {/* Signup CTA */}
        <p className="text-gray-400 text-center mt-6">
          New to Deligo?{" "}
          <a href="/vendor/register" className="text-pink-400 font-medium hover:underline">
            Create an account
          </a>
        </p>
      </motion.div>
    </div>
  );
}
