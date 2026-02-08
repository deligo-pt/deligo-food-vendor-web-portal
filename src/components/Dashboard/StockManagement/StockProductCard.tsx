"use client";

import { Button } from "@/components/ui/button";
import StockInput from "@/src/components/Dashboard/StockManagement/StockInput";
import StockStatusBadge from "@/src/components/Dashboard/StockManagement/StockStatusBadge";
import StockVariationOption from "@/src/components/Dashboard/StockManagement/StockVariationOption";
import { updateStockPriceReq } from "@/src/services/dashboard/products/products";
import { TProduct } from "@/src/types/product.type";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronUp, Layers } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface IProps {
  product: TProduct;
}

export default function StockProductCard({ product }: IProps) {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const [stockData, setStockData] = useState<{
    newPrice?: number;
    addedQuantity?: number;
    reduceQuantity?: number;
  }>({
    newPrice: 0,
    addedQuantity: 0,
    reduceQuantity: 0,
  });

  const stockPercentage = Math.min((product.stock.quantity / 500) * 100, 100);

  const updateStock = async () => {
    const toastId = toast.loading("Updating stock...");

    const { newPrice, addedQuantity, reduceQuantity } = stockData;
    const updatedData = {
      ...(!!newPrice && { newPrice }),
      ...(!!addedQuantity && { addedQuantity }),
      ...(!!reduceQuantity && { reduceQuantity }),
    };

    const result = await updateStockPriceReq(product.productId, updatedData);

    if (result?.success) {
      toast.success("Stock updated successfully!", { id: toastId });
      router.refresh();
      setStockData({
        newPrice: 0,
        addedQuantity: 0,
        reduceQuantity: 0,
      });
      return;
    }

    toast.error(result.message || "Stock update failed", { id: toastId });
    console.log(result);
  };

  return (
    <motion.div
      layout
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
    >
      {/* Card Header */}
      <div className="p-6 flex flex-col md:flex-row items-center gap-6">
        {/* Image */}
        <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-50 shrink-0 border border-gray-100">
          <Image
            src={product.images?.[0]}
            alt={product.name}
            className="w-full h-full object-cover"
            width={80}
            height={80}
          />
        </div>

        {/* Info */}
        <div className="flex-1 w-full text-center md:text-left">
          <h3 className="text-lg font-bold text-gray-900">{product.name}</h3>
          <div>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
              {product.category.name}
            </span>
          </div>

          <div className="mb-3">
            <StockStatusBadge
              status={product.stock.availabilityStatus}
              hasVariations={product.stock.hasVariations}
            />
          </div>

          {/* Progress Bar */}
          <div className="w-full max-w-md h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{
                width: 0,
              }}
              animate={{
                width: `${stockPercentage}%`,
              }}
              transition={{
                duration: 1,
                ease: "easeOut",
              }}
              className="h-full bg-[#DC3173] rounded-full"
            />
          </div>
        </div>

        {/* Stock & Actions */}
        <div className="flex flex-col items-center gap-2 min-w-[100px]">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
            Stock
          </span>
          <span className="text-3xl font-extrabold text-gray-900">
            {product.stock.quantity}
          </span>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-2 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-[#DC3173] transition-colors"
          >
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
      </div>

      {/* Expanded Section */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{
              height: 0,
              opacity: 0,
            }}
            animate={{
              height: "auto",
              opacity: 1,
            }}
            exit={{
              height: 0,
              opacity: 0,
            }}
            className="border-t border-gray-100 bg-pink-50/30"
          >
            <div className="p-6">
              {product.stock.hasVariations ? (
                // Variations Layout
                <div className="space-y-6">
                  {product.variations.map((group, gIdx) => (
                    <div
                      key={gIdx}
                      className="bg-white rounded-xl border border-gray-100 p-4"
                    >
                      <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Layers size={14} className="text-[#DC3173]" />
                        {group.name} Variations
                      </h4>

                      <div className="space-y-4">
                        {group.options.map((option, oIdx) => (
                          <StockVariationOption
                            key={oIdx}
                            option={option}
                            productId={product.productId}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // Simple Product Layout
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">
                        Current Price
                      </label>
                      <div className="text-xl font-bold text-gray-900">
                        ${product.pricing.price}
                      </div>
                    </div>

                    <StockInput
                      label="New Price"
                      type="number"
                      placeholder="0.00"
                      suffix="$"
                      min={0}
                      value={stockData.newPrice}
                      onChange={(e) =>
                        setStockData((prev) => ({
                          ...prev,
                          newPrice: parseFloat(e.target.value),
                        }))
                      }
                    />

                    <StockInput
                      label="Add Quantity"
                      type="number"
                      placeholder="0"
                      suffix="+"
                      min={0}
                      value={stockData.addedQuantity}
                      onChange={(e) => {
                        if (
                          stockData.reduceQuantity &&
                          stockData.reduceQuantity > 0
                        ) {
                          toast.error(
                            "You can not change both added and reduced quantity at the same time.",
                          );
                        }
                        setStockData((prev) => ({
                          ...prev,
                          addedQuantity: parseInt(e.target.value),
                        }));
                      }}
                    />

                    <StockInput
                      label="Reduce Quantity"
                      type="number"
                      placeholder="0"
                      min={0}
                      value={stockData.reduceQuantity}
                      suffix="-"
                      onChange={(e) => {
                        if (
                          stockData.addedQuantity &&
                          stockData.addedQuantity > 0
                        ) {
                          toast.error(
                            "You can not change both added and reduced quantity at the same time.",
                          );
                        }
                        setStockData((prev) => ({
                          ...prev,
                          reduceQuantity: parseInt(e.target.value),
                        }));
                      }}
                    />
                  </div>

                  <div className="mt-6 flex justify-end">
                    <Button
                      onClick={updateStock}
                      className="bg-[#DC3173] hover:bg-[#DC3173]/90"
                    >
                      Save
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
