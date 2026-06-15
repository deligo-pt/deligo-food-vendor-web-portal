import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { paymentMethods } from "@/src/consts/payment.const";
import { useState } from "react";

interface IProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPurchase: (paymentMethod: (typeof paymentMethods)[number]) => void;
  isOrdering: boolean;
}

export default function PaymentMethodSelectModal({
  open,
  onOpenChange,
  onPurchase,
  isOrdering,
}: IProps) {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    (typeof paymentMethods)[number] | null
  >(null);
  const [error, setError] = useState<string | null>(null);

  const handlePurchase = () => {
    if (!selectedPaymentMethod) {
      setError("Please select a payment method.");
      return;
    }

    setError(null);
    onPurchase(selectedPaymentMethod);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <form onSubmit={(e) => e.preventDefault()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Payment Method</DialogTitle>
            <DialogDescription>
              Choose your preferred payment method to complete your order.
            </DialogDescription>

            <div className="mt-3 p-3 rounded-lg border border-[#DC3173]/60 bg-[#DC3173]/20 text-xs text-black space-y-1">
              <h4 className="font-semibold text-sm">Delivery Charges Notification</h4>
              <p>
                • If your location is under <span className="text-[#DC3173] font-medium">Lisbon</span>, the delivery charge will be <span className="font-medium text-[#DC3173]">20€</span>.
              </p>
              <p>
                • If your location is <span className="text-[#DC3173] font-medium">outside of Lisbon</span>, the delivery charge will be <span className="font-medium text-[#DC3173]">30€</span>.
              </p>
            </div>
          </DialogHeader>

          <div id="paymentMethodSelectForm" className="grid grid-cols-2 gap-4 pt-2">
            {paymentMethods.map((method) => (
              <label
                key={method}
                className="flex items-center space-x-3 cursor-pointer p-2 rounded-md transition-colors"
                htmlFor={method}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method}
                  id={method}
                  className="cursor-pointer accent-[#DC3173]"
                  onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                  checked={selectedPaymentMethod === method}
                />
                <span className="text-sm">
                  {method
                    ?.split("_")
                    ?.map(
                      (word) => word?.charAt(0) + word?.slice(1)?.toLowerCase(),
                    )
                    ?.join(" ")}
                </span>
              </label>
            ))}
          </div>

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button
              onClick={handlePurchase}
              className="bg-[#DC3173] hover:bg-[#DC3173]/90 text-white"
              type="button"
              disabled={isOrdering}
            >
              {isOrdering ? "Processing..." : "Purchase"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}