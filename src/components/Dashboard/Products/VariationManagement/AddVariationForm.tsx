"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/src/hooks/use-translation";
import { addVariationReq } from "@/src/services/dashboard/products/variation";
import { variationValidation } from "@/src/validations/product/product.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

interface IProps {
  productId: string;
  onCancel: () => void;
}

interface IOption {
  label: string;
  price: number;
  stockQuantity: number;
}

type TVariationForm = z.infer<typeof variationValidation>;

export default function AddVariationForm({ productId, onCancel }: IProps) {
  const { t } = useTranslation();
  const router = useRouter();

  const [option, setOption] = useState<IOption>({
    label: "",
    price: 0,
    stockQuantity: 0,
  });

  const form = useForm<TVariationForm>({
    resolver: zodResolver(variationValidation),
    defaultValues: {
      name: "",
      options: [],
    },
  });

  const watchOptions = useWatch({
    control: form.control,
    name: "options",
  });

  const addOption = () => {
    if (option.label && option.label.length > 1) {
      if (!watchOptions.find((opt) => opt.label === option.label)) {
        form.setValue("options", [...watchOptions, option]);
        setOption({ label: "", price: 0, stockQuantity: 0 });
      }
    } else {
      toast.error("Option label is required and must be at least 3 characters");
    }
  };

  const removeOption = (optionToRemove: string) => {
    form.setValue(
      "options",
      watchOptions.filter((opt) => opt.label !== optionToRemove),
    );
  };

  const onSubmit = async (data: TVariationForm) => {
    const toastId = toast.loading("Adding variation...");

    const result = await addVariationReq(productId, data);

    onCancel();
    if (result.success) {
      toast.success(result.message || "Variation added successfully!", {
        id: toastId,
      });
      form.reset();
      router.refresh();
      setOption({ label: "", price: 0, stockQuantity: 0 });
      return;
    }

    toast.error(result.message || "Failed to add variation.", { id: toastId });
    console.log(result);
  };

  return (
    <Form {...form}>
      <motion.form
        onSubmit={form.handleSubmit(onSubmit)}
        initial={{
          opacity: 0,
          y: -10,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        exit={{
          opacity: 0,
          y: -10,
        }}
        className="p-4 rounded-xl border border-dashed border-[#DC3173]/20 space-y-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("name")}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Variation name (e.g. Size, Color, Flavor)"
                  className=""
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Label className="text-gray-700">{t("options")}</Label>
        {watchOptions?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-1">
            {watchOptions?.map((option) => (
              <div
                key={option.label}
                className="flex items-center bg-[#DC3173] bg-opacity-10 text-white px-3 py-1 rounded-full"
              >
                <span>{option.label}</span>
                <span className="ml-2">(€{option.price})</span>
                <button
                  type="button"
                  onClick={() => removeOption(option.label)}
                  className="ml-2 text-white hover:text-[#CCC]"
                >
                  <XIcon className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
        <div
          className={cn(
            "border border-dashed rounded-md p-4 space-y-2",
            form.formState.errors.options && "border-destructive bg-red-200",
          )}
        >
          <div>
            <Label className="text-gray-700 mb-1">{t("label")}</Label>
            <Input
              type="text"
              value={option.label}
              onChange={(e) => setOption({ ...option, label: e.target.value })}
              placeholder="Add an option label"
            />
          </div>
          <div>
            <Label className="text-gray-700 mb-1">{t("price")}</Label>
            <Input
              type="number"
              min={0}
              value={option.price}
              onChange={(e) =>
                setOption({ ...option, price: Number(e.target.value) })
              }
              placeholder="Add an option price"
            />
          </div>
          <div>
            <Label className="text-gray-700 mb-1">Stock Quantity</Label>
            <Input
              type="number"
              min={0}
              value={option.stockQuantity}
              onChange={(e) =>
                setOption({
                  ...option,
                  stockQuantity: Number(e.target.value),
                })
              }
              placeholder="Add stock quantity"
            />
          </div>
          {form.formState.errors.options && (
            <p className="text-destructive text-sm">
              {form.formState.errors.options.message}
            </p>
          )}
          <div className="text-right">
            <Button
              onClick={addOption}
              type="button"
              size="sm"
              className="bg-[#DC3173] hover:bg-[#DC3173]/90"
            >
              {t("add_option")}
            </Button>
          </div>
        </div>
        <div>
          <Button className="bg-[#DC3173] text-sm font-bold hover:bg-[#DC3173]/90 transition-colors mr-2">
            Create
          </Button>
          <Button
            onClick={onCancel}
            className="bg-gray-100 text-gray-600 text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            Cancel
          </Button>
        </div>
      </motion.form>
    </Form>
  );
}
