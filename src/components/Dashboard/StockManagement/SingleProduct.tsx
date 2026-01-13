import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useDebounce } from "@/src/hooks/use-debounce";
import { useTranslation } from "@/src/hooks/use-translation";
import { updateStock } from "@/src/services/products/manageStock";
import { TProduct } from "@/src/types/product.type";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  CheckCircle,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState, useTransition } from "react";

const PRIMARY = "#DC3173";

export default function SingleProduct({ p }: { p: TProduct }) {
  const { t } = useTranslation();

  const getStockStatus = (stock: number) => {
    if (stock === 0)
      return {
        text: t("out_of_stock"),
        color: "#DC2626",
        icon: <XCircle size={16} />,
      };
    if (stock < 10)
      return {
        text: t("limited"),
        color: "#EA580C",
        icon: <AlertTriangle size={16} />,
      };
    return {
      text: t("in_stock"),
      color: PRIMARY,
      icon: <CheckCircle size={16} />,
    };
  };
  const [stock, setStock] = useState(p?.stock?.quantity);
  const debouncedValue = useDebounce(String(stock), 1000);
  const [isPending, startTransition] = useTransition();
  const status = getStockStatus(stock);

  useEffect(() => {
    if (debouncedValue) {
      if (Number(debouncedValue) === p.stock.quantity) return;

      startTransition(async () => {
        try {
          await updateStock(p.productId, {
            quantity: Number(debouncedValue),
            availabilityStatus: status.text,
          });
        } catch (error) {
          console.log(error);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  return (
    <motion.div
      key={p._id}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      whileHover={{ scale: 1.015 }}
      transition={{ type: "spring", stiffness: 170, damping: 16 }}
    >
      <Card
        className="rounded-3xl overflow-hidden border bg-white"
        style={{
          boxShadow:
            "0px 6px 24px rgba(0,0,0,0.08), inset 0px 0px 12px rgba(0,0,0,0.03)",
        }}
      >
        <CardContent className="p-0 flex">
          {/* LEFT SIDE CONTENT */}
          <div className="flex items-start gap-5 p-5 flex-1">
            {/* PRODUCT IMAGE */}
            <Image
              src={p.images?.[0] || ""}
              alt={p.name}
              className="w-24 h-24 object-cover rounded-2xl shadow-md"
              width={500}
              height={500}
            />

            {/* PRODUCT INFO */}
            <div className="flex flex-col justify-between h-full">
              <div>
                <h2 className="text-xl font-semibold">{p.name}</h2>
                <p className="text-sm text-gray-500">{p.category}</p>

                {/* STATUS BADGE */}
                <span
                  className="mt-2 px-3 py-1 rounded-full inline-flex items-center gap-1 text-xs font-medium"
                  style={{
                    background: status.color + "15",
                    color: status.color,
                  }}
                >
                  {status.icon}
                  {status.text}
                </span>
              </div>

              {/* STOCK BAR */}
              <div className="mt-3 w-40 h-2 rounded-full bg-gray-200 overflow-hidden">
                <div
                  className="h-full"
                  style={{
                    width: `${Math.min((stock / 10) * 100, 100)}%`,
                    background: status.color,
                  }}
                />
              </div>
            </div>
          </div>

          {/* RIGHT SIDE STOCK CONTROLS */}
          <div className="p-5 border-l flex flex-col items-center justify-center gap-4 bg-white/40 backdrop-blur-sm">
            {/* STOCK NUMBER */}
            <div className="text-center">
              <div className="text-xs text-gray-500">{t("stock")}</div>
              <div className="text-4xl font-bold text-gray-800">{stock}</div>
            </div>

            {/* CONTROL BUTTONS */}
            <div className="flex gap-3">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setStock((prevStock) => prevStock + 1)}
                className="rounded-full p-3"
                disabled={isPending}
              >
                <ArrowUp size={16} />
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  setStock((prevStock) => (prevStock > 0 ? prevStock - 1 : 0))
                }
                className="rounded-full p-3"
                disabled={stock === 0 || isPending}
              >
                <ArrowDown size={16} />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
