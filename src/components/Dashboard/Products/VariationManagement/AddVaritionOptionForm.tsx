"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { addVariationReq } from "@/src/services/dashboard/products/variation";
import { variationOptionValidation } from "@/src/validations/product/product.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

interface IProps {
  productId: string;
  variationName: string;
  onCancel: () => void;
}

type TOptionForm = z.infer<typeof variationOptionValidation>;

export default function AddVaritionOptionForm({
  productId,
  variationName,
  onCancel,
}: IProps) {
  const router = useRouter();

  const form = useForm<TOptionForm>({
    resolver: zodResolver(variationOptionValidation),
    defaultValues: {
      label: "",
      price: 0,
      stockQuantity: 0,
    },
  });

  const onSubmit = async (data: TOptionForm) => {
    const toastId = toast.loading("Adding option...");

    const result = await addVariationReq(productId, {
      name: variationName,
      options: [data],
    });

    onCancel();

    if (result.success) {
      toast.success(result.message || "Option added successfully!", {
        id: toastId,
      });
      form.reset();
      router.refresh();
      return;
    }

    toast.error(result.message || "Failed to add option.", { id: toastId });
    console.log(result);
  };

  return (
    <motion.div
      initial={{
        opacity: 0,
        height: 0,
      }}
      animate={{
        opacity: 1,
        height: "auto",
      }}
      exit={{
        opacity: 0,
        height: 0,
      }}
      className="overflow-hidden"
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-wrap items-start gap-3 p-3 rounded-xl border border-[#DC3173]/10 mt-3"
        >
          <div className="flex-1 min-w-[120px]">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-xs font-medium text-gray-500 mb-1">
                    Option Label
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g. Medium" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="w-28">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-xs font-medium text-gray-500 mb-1">
                    Price (€)
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      type="number"
                      placeholder="0.00"
                      min={0}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="w-24">
            <FormField
              control={form.control}
              name="stockQuantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-xs font-medium text-gray-500 mb-1">
                    Stock
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      type="number"
                      placeholder="0"
                      min={0}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="px-4 py-1.5 bg-[#DC3173] text-white rounded-lg text-sm font-bold hover:bg-[#DC3173]/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
              Add
            </button>
            <button
              type="submit"
              onClick={onCancel}
              className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </Form>
    </motion.div>
  );
}
