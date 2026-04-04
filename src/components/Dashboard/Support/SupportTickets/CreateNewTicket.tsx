"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useChatSocket } from "@/src/hooks/use-chat-socket";
import { getAllOrdersReq } from "@/src/services/dashboard/order/order.service";
import { TMeta } from "@/src/types";
import { TOrder } from "@/src/types/order.type";
import { getCookie } from "@/src/utils/cookies";
import { ticketValidation } from "@/src/validations/support-ticket/support-ticket.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import z from "zod";

interface IProps {
  onClose: () => void;
}

type TFormData = z.infer<typeof ticketValidation>;

export default function CreateNewTicket({ onClose }: IProps) {
  const router = useRouter();
  const [ordersData, setOrdersData] = useState<{
    data: TOrder[];
    meta?: TMeta;
  }>({
    data: [],
  });

  const form = useForm({
    resolver: zodResolver(ticketValidation),
    defaultValues: {
      category: "GENERAL",
      message: "",
      referenceOrderId: "",
    },
  });

  const watchCategory = useWatch({
    control: form.control,
    name: "category",
  });

  const { sendMessage } = useChatSocket({
    token: getCookie("accessToken") || "",
    onMessage: (msg) => {
      console.log(msg);
    },
    onError: (msg) => console.log(msg),
  });

  const handleCreateTicket = (data: TFormData) => {
    sendMessage({ ...data, messageType: "TEXT" });
    onClose();
    router.refresh();
  };

  const getOrders = async (limit = 100) => {
    const result = await getAllOrdersReq({ limit: String(limit) });
    setOrdersData(result);
  };

  useEffect(() => {
    if (watchCategory === "ORDER_ISSUE") {
      (() => getOrders())();
    }
  }, [watchCategory]);

  return (
    <>
      <motion.div
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        exit={{
          opacity: 0,
        }}
        onClick={onClose}
        className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-51"
      />
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.95,
          y: 20,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
        }}
        exit={{
          opacity: 0,
          scale: 0.95,
          y: 20,
        }}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-2xl shadow-xl z-52 overflow-hidden"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Create New Ticket</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:bg-gray-50 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleCreateTicket)}
            className="p-6 space-y-5"
          >
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#DC3173] focus:ring-2 focus:ring-[#DC3173]/20 outline-none transition-all bg-white">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="z-52">
                        <SelectItem value="GENERAL">General</SelectItem>
                        <SelectItem value="ORDER_ISSUE">Order Issue</SelectItem>
                        <SelectItem value="IVA_INVOICE">IVA Invoice</SelectItem>
                        <SelectItem value="PAYMENT">Payment</SelectItem>
                        <SelectItem value="TECHNICAL">Technical</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <textarea
                      {...field}
                      rows={4}
                      placeholder="Please provide the details of your issue or inquiry here..."
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#DC3173] focus:ring-2 focus:ring-[#DC3173]/20 outline-none transition-all resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {watchCategory === "ORDER_ISSUE" && (
              <FormField
                control={form.control}
                name="referenceOrderId"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Order</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#DC3173] focus:ring-2 focus:ring-[#DC3173]/20 outline-none transition-all bg-white">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent className="z-52">
                          {ordersData.data.map((o) => (
                            <SelectItem value={o._id} key={o._id}>
                              {o.orderId}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-50 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#DC3173] text-white font-bold rounded-xl hover:bg-[#DC3173]/90 transition-colors shadow-lg shadow-[#DC3173]/20"
              >
                Submit Ticket
              </button>
            </div>
          </form>
        </Form>
      </motion.div>
    </>
  );
}
