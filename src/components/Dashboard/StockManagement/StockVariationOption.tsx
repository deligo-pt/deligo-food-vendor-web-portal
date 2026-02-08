"use client";

import { Button } from "@/components/ui/button";
import StockInput from "@/src/components/Dashboard/StockManagement/StockInput";
import { updateStockPriceReq } from "@/src/services/dashboard/products/products";
import { TVariations } from "@/src/types/product.type";
import { EditIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface IProps {
  productId: string;
  option: TVariations["options"][0];
}

export default function StockVariationOption({ productId, option }: IProps) {
  const router = useRouter();
  const [isEditClicked, setIsEditClicked] = useState(false);
  const [stockData, setStockData] = useState({
    newPrice: 0,
    addedQuantity: 0,
    reduceQuantity: 0,
  });

  const updateStock = async () => {
    const toastId = toast.loading("Updating stock...");

    const { newPrice, addedQuantity, reduceQuantity } = stockData;
    const updatedData = {
      variationSku: option.sku,
      ...(!!newPrice && { newPrice }),
      ...(!!addedQuantity && { addedQuantity }),
      ...(!!reduceQuantity && { reduceQuantity }),
    };

    const result = await updateStockPriceReq(productId, updatedData);

    if (result?.success) {
      toast.success("Stock updated successfully!", { id: toastId });
      router.refresh();
      setIsEditClicked(false);
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
    <div className="pb-4 border-b border-gray-50 last:border-0 last:pb-0">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
        <div className="flex items-center gap-3">
          <span className="font-medium text-gray-900">{option.label}</span>
          {option.isOutOfStock && (
            <span className="text-xs font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded">
              Out of Stock
            </span>
          )}
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-gray-500">
            Current: <strong className="text-gray-900">${option.price}</strong>
          </span>
          <span className="text-gray-500">
            Stock:{" "}
            <strong className="text-gray-900">{option.stockQuantity}</strong>
          </span>
          <div>
            <Button
              onClick={() => setIsEditClicked(true)}
              className="w-6 h-6 bg-[#DC3173]/10 hover:bg-[#DC3173] flex justify-center items-center p-0! cursor-pointer text-[#DC3173] hover:text-white"
            >
              <EditIcon size={14} />
            </Button>
          </div>
        </div>
      </div>

      {isEditClicked && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
                if (stockData.reduceQuantity && stockData.reduceQuantity > 0) {
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
                if (stockData.addedQuantity && stockData.addedQuantity > 0) {
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
          <div className="mt-3 flex justify-end gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditClicked(false)}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              size="sm"
              className="bg-[#DC3173] hover:bg-[#DC3173]/90"
              onClick={updateStock}
            >
              Save
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
