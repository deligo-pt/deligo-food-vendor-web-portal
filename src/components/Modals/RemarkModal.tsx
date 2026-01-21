/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { useState } from "react";

interface IProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  setIsSubmitting: (value: boolean) => void;
}

const RemarkModal = ({
  open,
  onOpenChange,
  userId,
  setIsSubmitting,
}: IProps) => {
  const [desc, setDesc] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await new Promise((res) => setTimeout(res, 2000));

      onOpenChange(false);
    } catch (err) {
      console.log(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <form>
        <DialogContent className="sm:max-w-[425px]">
          <DialogTitle>SOS Emergency Alert</DialogTitle>
          <DialogHeader>
            <DialogDescription>
              Instantly send an emergency alert with your live location to
              admins and emergency contacts for immediate assistance.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} id="remarksForm" className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="remarks">What’s going wrong?</Label>

              <Input
                id="remarks"
                name="remarks"
                onBlur={(e) => setDesc(e.target.value)}
              />
            </div>
          </form>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>

            <Button
              form="remarksForm"
              type="submit"
              className="bg-[#DC3173] hover:bg-[#DC3173]/90"
            >
              Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default RemarkModal;
