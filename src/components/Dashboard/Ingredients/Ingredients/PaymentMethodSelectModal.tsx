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
      <form>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Payment Method</DialogTitle>
            <DialogDescription>
              Choose your preferred payment method to complete your order.
            </DialogDescription>
          </DialogHeader>
          <div id="paymentMethodSelectForm" className="grid grid-cols-2 gap-4">
            {paymentMethods.map((method) => (
              <label
                key={method}
                className="flex items-center space-x-3 mb-4 cursor-pointer"
                htmlFor={method}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method}
                  id={method}
                  className="cursor-pointer"
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
              form="paymentMethodSelectForm"
              onClick={handlePurchase}
              className="bg-[#DC3173] hover:bg-[#DC3173]/90"
              type="submit"
              disabled={isOrdering}
            >
              Purchase
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
