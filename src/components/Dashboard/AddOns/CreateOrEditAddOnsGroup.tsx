"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { PlusIcon, XIcon } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  createAddOnsGroup,
  updateAddOnsGroup,
} from "@/src/services/dashboard/add-ons/add-ons";
import { TAddonGroup } from "@/src/types/add-ons.type";
import { createAddonGroupValidationSchema } from "@/src/validations/addons/addOns.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const PRIMARY = "#DC3173";

type TAddonGroupForm = z.infer<typeof createAddonGroupValidationSchema>;

interface IProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prevValues?: TAddonGroup;
  actionType?: "create" | "edit";
}

export default function CreateOrEditAddOnsGroup({
  open,
  onOpenChange,
  prevValues,
  actionType = "create",
}: IProps) {
  const form = useForm<TAddonGroupForm>({
    resolver: zodResolver(createAddonGroupValidationSchema),
    values: {
      title: prevValues?.title || "",
      minSelectable: prevValues?.minSelectable || 0,
      maxSelectable: prevValues?.maxSelectable || 1,
      options: prevValues?.options || [],
    },
  });
  const [optionName, setOptionName] = useState("");
  const [optionPrice, setOptionPrice] = useState(0);

  const router = useRouter();

  const [watchOptions] = useWatch({
    control: form.control,
    name: ["options"],
  });

  const addOption = () => {
    if (optionPrice && optionPrice >= 0 && optionName.trim() !== "") {
      const newOptions = [
        ...form?.getValues("options"),
        { name: optionName, price: optionPrice },
      ];
      form.setValue("options", newOptions);
    }
    setOptionName("");
    setOptionPrice(0);
  };

  const removeOption = (optionToRemove: string) => {
    const newOptions = form
      ?.getValues("options")
      ?.filter((o) => o.name !== optionToRemove);
    form.setValue("options", newOptions);
  };

  const handleAddOrEditGroup = async (data: TAddonGroupForm) => {
    if (actionType === "create") {
      const toastId = toast.loading("Creating add-on group...");

      const result = await createAddOnsGroup(data);
      if (result.success) {
        form.reset();
        toast.success(result.message || "Add-on group created successfully!", {
          id: toastId,
        });
        router.refresh();
        onOpenChange(false);
        return;
      }

      toast.error(result.message || "Failed to create add-on group.", {
        id: toastId,
      });
      console.log(result);
    } else if (actionType === "edit") {
      const toastId = toast.loading("Updating add-on group...");

      const result = await updateAddOnsGroup(prevValues?._id as string, data);
      if (result.success) {
        form.reset();
        toast.success(result.message || "Add-on group updated successfully!", {
          id: toastId,
        });
        router.refresh();
        onOpenChange(false);
        return;
      }

      toast.error(result.message || "Failed to update add-on group.", {
        id: toastId,
      });
      console.log(result);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="p-6">
        <SheetHeader className="px-0">
          <SheetTitle>
            {actionType === "create" ? "Create" : "Edit"} Addon Group
          </SheetTitle>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleAddOrEditGroup)}
            className="space-y-4 mt-4"
            id="creatAddOnsForm"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Group Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Drinks Upgrade" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="minSelectable"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Min Select</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      {...field}
                      value={field.value}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="maxSelectable"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Select</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      {...field}
                      value={field.value}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2 ">
              <label className="block mb-1">Options</label>
              {watchOptions?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-1">
                  {watchOptions?.map((option) => (
                    <div
                      key={option.name}
                      className="flex items-center bg-[#DC3173] bg-opacity-10 text-white px-3 py-1 rounded-full"
                    >
                      <span>{option.name}</span>
                      <span className="ml-2">(€{option.price})</span>
                      <button
                        type="button"
                        onClick={() => removeOption(option.name)}
                        className="ml-2 text-white hover:text-[#CCC]"
                      >
                        <XIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="border rounded-md p-4 bg-gray-50 space-y-2">
                <FormField
                  control={form.control}
                  name="optionName"
                  render={() => (
                    <FormItem className="gap-1">
                      <FormLabel>Option Name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          value={optionName}
                          onChange={(e) => setOptionName(e.target.value)}
                          placeholder="Add an option name"
                          onKeyUp={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addOption();
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="optionPrice"
                  render={() => (
                    <FormItem className="gap-1">
                      <FormLabel>Option Price</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="number"
                            min="0"
                            value={optionPrice}
                            onChange={(e) =>
                              setOptionPrice(Number(e.target.value))
                            }
                            placeholder="Option Price"
                            onKeyUp={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                addOption();
                              }
                            }}
                          />
                          <button
                            type="button"
                            onClick={addOption}
                            className="bg-[#DC3173] text-white px-4 py-2 rounded-r-md hover:bg-[#B02458] transition-colors absolute top-0 right-0 h-full"
                          >
                            <PlusIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="mt-6">
              <Button
                className="w-full"
                style={{ background: PRIMARY }}
                form="creatAddOnsForm"
              >
                {actionType === "create" ? "Create" : "Update"}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
