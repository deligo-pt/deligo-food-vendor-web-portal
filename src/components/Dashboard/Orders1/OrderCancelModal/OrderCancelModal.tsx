"use client";

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ORDER_STATUS } from "@/src/consts/order.const";
import { useState } from "react";

interface IProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string;
  updateStatus: (
    id: string,
    status: keyof typeof ORDER_STATUS,
    reason?: string
  ) => void;
}

export default function CancelOrderModal({
  open,
  onOpenChange,
  orderId,
  updateStatus,
}: IProps) {
  const [reason, setReason] = useState<string>("");

  const cancelOrder = (e: React.FormEvent) => {
    e.preventDefault();
    updateStatus(orderId, "CANCELED", reason);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <form>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Cancel Order</DialogTitle>
            <DialogDescription>
              Please provide a reason for cancelling the order.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={cancelOrder} id="reasonForm" className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="reason">Reason</Label>
              <Input
                id="reason"
                name="reason"
                onBlur={(e) => setReason(e.target.value)}
              />
            </div>
          </form>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              form="reasonForm"
              type="submit"
              className="bg-[#DC3173] hover:bg-[#DC3173]/90"
            >
              Cancel Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
