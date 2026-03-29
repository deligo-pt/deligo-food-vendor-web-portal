"use client";

import { TIngredient } from "@/src/types/ingredient.type";
import { motion } from "framer-motion";
import { EyeIcon, MinusIcon, PlusIcon, ShoppingBag, XIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface IProps {
  item: TIngredient;
}

export default function SingleIngredientCard({ item }: IProps) {
  const router = useRouter();

  const [isBuying, setIsBuying] = useState(false);
  const [isOrdering, setIsOrdering] = useState(false);
  const [quantity, setQuantity] = useState(item.minOrder || 1);

  const increment = () => setQuantity((q) => Math.min(item.stock, q + 1));

  const decrement = () =>
    setQuantity((q) => Math.max(item.minOrder || 1, q - 1));

  const handlePlaceOrder = async () => {
    setIsOrdering(true);
    const toastId = toast.loading("Placing order...");
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsOrdering(false);
    toast.success("Order placed successfully!", { id: toastId });
    setQuantity(item.minOrder || 1);
    setIsBuying(false);
  };

  return (
    <motion.div
      key={item._id}
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center text-3xl">
            <Image
              src={item.image}
              alt={item.name}
              width={64}
              height={64}
              className="object-cover w-full h-full"
            />
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#DC3173]/10 text-[#DC3173]">
            €{item.price?.toFixed(2)}
          </span>
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-1">{item.name}</h3>
        <p className="text-sm text-gray-500 mb-4 h-10 line-clamp-2">
          {item.description}
        </p>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
          <span className="text-xs font-medium text-gray-400">
            {item.category}
          </span>

          {isBuying ? (
            <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
              <button
                onClick={decrement}
                className="p-1.5 bg-white rounded-md text-[#DC3173] shadow-sm transition-all cursor-pointer hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                disabled={quantity <= (item.minOrder || 1)}
              >
                <MinusIcon size={14} />
              </button>
              <span className="font-bold text-gray-900 w-4 text-center">
                {quantity}
              </span>
              <button
                onClick={increment}
                className="p-1.5 bg-white rounded-md text-[#DC3173] shadow-sm transition-all cursor-pointer hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                disabled={quantity >= item.stock}
              >
                <PlusIcon size={14} />
              </button>
              <button
                onClick={handlePlaceOrder}
                className="flex items-center gap-2 px-4 py-2 text-white rounded-lg text-sm font-bold bg-[#DC3173] hover:bg-[#DC3173]/90 transition-colors"
                disabled={isOrdering}
              >
                Order
              </button>
              <button
                onClick={() => setIsBuying(false)}
                className="p-1.5 bg-white rounded-md text-[#DC3173] shadow-sm transition-all"
              >
                <XIcon size={14} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
              <button
                onClick={() => router.push(`/vendor/ingredients/${item._id}`)}
                className="flex items-center gap-2 px-4 py-2 text-white rounded-lg text-sm font-bold bg-[#DC3173] transition-colors"
              >
                <EyeIcon size={16} />
                View
              </button>
              <button
                onClick={() => setIsBuying(true)}
                className="flex items-center gap-2 px-4 py-2 text-white rounded-lg text-sm font-bold bg-[#DC3173] transition-colors"
              >
                <ShoppingBag size={16} />
                Buy
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
