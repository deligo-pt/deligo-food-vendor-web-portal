"use client";

import { TIngredient } from "@/src/types/ingredient.type";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Info,
  Minus,
  Package,
  Plus,
  ShoppingCart,
  Truck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

interface IProps {
  ingredient: TIngredient;
}

export default function IngredientDetail({ ingredient }: IProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);
    const toastId = toast.loading("Buying...");

    await new Promise((resolve) => setTimeout(resolve, 800));

    toast.success("Successfully bought", { id: toastId });
    setIsAdding(false);
  };

  const increment = () => setQuantity((q) => Math.min(ingredient.stock, q + 1));
  const decrement = () => setQuantity((q) => Math.max(0, q - 1));

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="mb-4">
        <Link
          href="/vendor/ingredients"
          className="inline-flex items-center gap-2 text-[#DC3173] hover:underline mb-4 transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Ingredients
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image */}
        <motion.div
          initial={{
            opacity: 0,
            x: -20,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
        >
          <div className="aspect-square rounded-3xl bg-white border border-gray-100 flex items-center justify-center text-9xl shadow-sm overflow-hidden">
            <Image
              src={ingredient.image}
              alt={ingredient.name}
              width={300}
              height={300}
              className="object-cover w-full h-full"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{
            opacity: 0,
            x: 20,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          className="space-y-8"
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#DC3173]/10 text-[#DC3173]">
                {ingredient.category}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 flex items-center gap-1">
                <Package size={12} /> In Stock
              </span>
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
              {ingredient.name}
            </h1>
            <p className="text-gray-500 text-lg leading-relaxed mb-6">
              {ingredient.description}
            </p>
            <div className="flex items-baseline gap-2 mb-8">
              <span className="text-3xl font-bold text-gray-900">
                €{ingredient.price.toFixed(2)}
              </span>
              <span className="text-gray-500">/ unit</span>
            </div>
          </div>

          {/* Order Card */}
          <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-lg shadow-gray-100/50">
            <div className="flex items-center justify-between mb-6">
              <span className="font-medium text-gray-700">Quantity</span>
              <div className="flex items-center gap-4 bg-gray-50 rounded-xl p-1">
                <button
                  onClick={decrement}
                  className="p-2 hover:bg-white rounded-lg text-gray-600 shadow-sm transition-all disabled:opacity-50"
                  disabled={quantity <= 0}
                >
                  <Minus size={18} />
                </button>
                <span className="font-bold text-xl text-gray-900 w-12 text-center">
                  {quantity}
                </span>
                <button
                  onClick={increment}
                  className="p-2 bg-white rounded-lg text-[#DC3173] shadow-sm transition-all hover:scale-105"
                  disabled={quantity >= ingredient.stock}
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 p-3 rounded-xl mb-6">
              <Info size={16} />
              <span>Maximum order quantity is {ingredient.stock} units</span>
            </div>

            <div className="flex justify-between items-center mb-8 pt-6 border-t border-gray-100">
              <span className="text-lg font-medium text-gray-600">
                Total Price
              </span>
              <span className="text-3xl font-bold text-[#DC3173]">
                €{(quantity * ingredient.price).toFixed(2)}
              </span>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className={`w-full py-4 bg-[#DC3173] text-white rounded-xl font-bold text-lg shadow-lg shadow-[#DC3173]/20 hover:bg-[#DC3173]/90 transition-all flex items-center justify-center gap-2 ${isAdding ? "opacity-70 cursor-wait" : ""}`}
            >
              {isAdding ? (
                "Adding..."
              ) : (
                <>
                  <ShoppingCart size={22} />
                  Buy Now
                </>
              )}
            </button>
          </div>

          {/* Delivery Info */}
          <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl text-blue-700">
            <Truck size={24} className="shrink-0 mt-1" />
            <div>
              <h4 className="font-bold mb-1">Fast Delivery</h4>
              <p className="text-sm text-blue-600/80">
                Orders placed before 2 PM are processed same-day. Standard
                delivery takes 2-3 business days.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
