"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { addOptionInGroup } from "@/src/services/dashboard/add-ons/add-ons";
import { TAddonGroup } from "@/src/types/add-ons.type";
import { TTax } from "@/src/types/tax.type";
import { createAddonOptionValidationSchema } from "@/src/validations/addons/addOns.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const PRIMARY = "#DC3173";

interface IProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedGroup?: TAddonGroup;
  taxes: TTax[];
}

type TAddonOptionForm = z.infer<typeof createAddonOptionValidationSchema>;

export default function AddOptionsForm({
  open,
  onOpenChange,
  selectedGroup,
  taxes,
}: IProps) {
  const router = useRouter();
  const form = useForm<TAddonOptionForm>({
    resolver: zodResolver(createAddonOptionValidationSchema),
    values: {
      name: "",
      price: 0,
      tax: "",
    },
  });

  const handleAddOption = async (data: TAddonOptionForm) => {
    const toastId = toast.loading("Creating add-on option...");

    const result = await addOptionInGroup(selectedGroup?._id as string, data);
    if (result.success) {
      form.reset();
      toast.success(result.message || "Add-on option created successfully!", {
        id: toastId,
      });
      router.refresh();
      onOpenChange(false);
      return;
    }

    toast.error(result.message || "Failed to create add-on option.", {
      id: toastId,
    });
    console.log(result);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="p-6">
        <SheetHeader className="px-0">
          <SheetTitle>Add Addon to {selectedGroup?.title}</SheetTitle>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleAddOption)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Drinks Upgrade" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price (€)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      placeholder="0.00"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tax"
              render={({ field, fieldState }) => (
                <FormItem className="gap-1">
                  <FormLabel>Option Tax</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        className={cn(
                          "w-full",
                          fieldState.invalid ? "border-destructive" : "",
                        )}
                      >
                        <SelectValue placeholder="Select Tax" />
                      </SelectTrigger>
                      <SelectContent>
                        {taxes?.map((tax) => (
                          <SelectItem key={tax._id} value={tax._id}>
                            {tax.taxName} ({tax.taxRate}%)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="mt-6">
              <Button className="w-full" style={{ background: PRIMARY }}>
                Add Option
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
