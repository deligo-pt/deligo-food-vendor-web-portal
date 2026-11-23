/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp, CupSoda, PencilIcon, UtensilsCrossed, XIcon } from "lucide-react";

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
import {
  createAddOnsGroup,
  deleteOptionFromGroup,
  updateAddOnsGroup,
} from "@/src/services/dashboard/add-ons/add-ons";
import { TAddonGroup, TAddonOptionSdr } from "@/src/types/add-ons.type";
import { TTax } from "@/src/types/tax.type";
import { createAddonGroupValidationSchema } from "@/src/validations/addons/addOns.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  commonPrice,
  commonSdr,
  commonTax,
  kindOfOptions,
  sortByName,
  titleTaken,
  withKind,
  withPrice,
} from "@/src/utils/addonGroup";
import { KIND_SETTINGS, kindOfRate, taxIdForRate, type TProductKind } from "@/src/utils/productKind";
import PriceInput from "@/src/components/PriceInput/PriceInput";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { useStore } from "@/src/store/store";
import { translateObject } from "@/src/utils/translation/translationObject";
import AddonSdrControl, { DEFAULT_ADDON_SDR, toAddonSdr, useSdrDeposit } from "./AddonSdrControl";

const PRIMARY = "#DC3173";

type TAddonGroupForm = z.infer<typeof createAddonGroupValidationSchema>;

interface IProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prevValues?: TAddonGroup;
  taxes: TTax[];
  actionType?: "create" | "edit";
  t: (key: string) => string;
  /** Every group of the vendor, for the duplicate-title check. */
  allGroups?: TAddonGroup[];
}

const taxIdOf = (tax: TTax | string | undefined) => (typeof tax === "string" ? tax : tax?._id ?? "");

export default function CreateOrEditAddOnsGroup({
  open,
  onOpenChange,
  prevValues,
  taxes,
  t,
  actionType = "create",
  allGroups = [],
}: IProps) {
  const { lang } = useStore();
  const form = useForm<TAddonGroupForm>({
    resolver: zodResolver(createAddonGroupValidationSchema),
    values: {
      title: {
        en: prevValues?.title?.en || "",
        pt: prevValues?.title?.pt || ""
      },
      minSelectable: prevValues?.minSelectable || 0,
      maxSelectable: prevValues?.maxSelectable || 1,
      options:
        prevValues?.options?.map((option) => ({
          name: {
            en: option?.name?.en || "",
            pt: option?.name?.pt || ""
          },
          price: option.price,
          tax: (option.tax as TTax)?._id,
          // Kept so saving updates this option instead of adding a copy.
          sku: option.sku,
          sdr: toAddonSdr(!!option.sdr?.applicable),
        })) || [],

      currentLang: lang
    },
  });
  const { formState: { isSubmitting } } = form;

  // What the saved options share, so Edit opens with the group price, the
  // kind and the "new option" box already filled. The parent remounts this
  // sheet per group (`key`), so these start fresh each time.
  const prevOptions = (prevValues?.options ?? []).map((option) => ({
    price: Number(option.price),
    tax: taxIdOf(option.tax),
    sdr: option.sdr,
  }));
  const startPrice = commonPrice(prevOptions);
  const startSdr = commonSdr(prevOptions);

  // The price for the whole group (plan.md §11): typing it sets every option.
  const [groupPrice, setGroupPrice] = useState<number | undefined>(startPrice);
  const [sortAz, setSortAz] = useState(false);

  const [optionName, setOptionName] = useState("");
  // `undefined` until something is typed; 0 is a real price (a free option).
  const [optionPrice, setOptionPrice] = useState<number | undefined>(startPrice);
  const [optionTax, setOptionTax] = useState(commonTax(prevOptions));
  const [optionSdr, setOptionSdr] = useState<TAddonOptionSdr>(
    startSdr === undefined ? DEFAULT_ADDON_SDR : toAddonSdr(startSdr),
  );
  const deposit = useSdrDeposit(open);

  const router = useRouter();

  const { fields: optionsFields, append, remove, update, replace, move } = useFieldArray({
    control: form.control,
    name: "options",
  })

  const watchedOptions = useWatch({ control: form.control, name: "options" }) ?? [];
  const watchedTitle = useWatch({ control: form.control, name: `title.${lang}` }) ?? "";
  const titleIsTaken = titleTaken(allGroups, watchedTitle, prevValues?._id);

  // Food | Drinks: lit when every option has that kind's VAT; with no
  // options yet, from the "new option" box.
  const optionTaxRate = taxes.find((tax) => tax._id === optionTax)?.taxRate;
  const currentKind = watchedOptions.length
    ? kindOfOptions(watchedOptions, taxes)
    : kindOfRate(optionTaxRate === undefined ? null : Number(optionTaxRate));
  const missingRate = (kind: TProductKind) => !taxIdForRate(taxes, KIND_SETTINGS[kind].rate);

  const pickKind = (kind: TProductKind) => {
    const taxId = taxIdForRate(taxes, KIND_SETTINGS[kind].rate);
    if (!taxId) return;
    setEditingIndex(null);
    replace(withKind(form.getValues("options"), kind, taxes));
    setOptionTax(taxId);
    setOptionSdr(toAddonSdr(KIND_SETTINGS[kind].sdr));
  };

  const changeGroupPrice = (price: number | undefined) => {
    setGroupPrice(price);
    if (price === undefined) return;
    setEditingIndex(null);
    replace(withPrice(form.getValues("options"), price));
    setOptionPrice(price);
  };

  const toggleSort = (checked: boolean) => {
    setSortAz(checked);
    if (!checked) return;
    setEditingIndex(null);
    replace(sortByName(form.getValues("options"), lang));
  };

  // The option being edited in place, by position, and its draft. Saving the
  // group sends it with its `sku`, which the API updates rather than copies.
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState<number | undefined>(undefined);
  const [editTax, setEditTax] = useState("");

  const startEdit = (index: number) => {
    const option = form.getValues(`options.${index}`);
    setEditingIndex(index);
    setEditName(option.name?.[lang] ?? "");
    setEditPrice(option.price);
    setEditTax(option.tax);
  };

  const editValid =
    editName.trim() !== "" && editPrice !== undefined && editPrice >= 0 && editTax !== "";

  const saveEdit = () => {
    if (editingIndex === null || !editValid) return;
    const option = form.getValues(`options.${editingIndex}`);
    const name = editName.trim();
    const otherLang = lang === "en" ? "pt" : "en";
    update(editingIndex, {
      ...option,
      name: {
        ...option.name,
        [lang]: name,
        // A renamed option is translated again on save: the translator keeps a
        // filled other language, which would leave the old name there.
        [otherLang]: name === option.name?.[lang] ? option.name?.[otherLang] ?? "" : "",
      },
      price: Number(editPrice),
      tax: editTax,
    });
    setEditingIndex(null);
  };

  const addOption = () => {
    if (
      optionName.trim() !== "" &&
      optionPrice !== undefined &&
      optionPrice >= 0 &&
      optionTax !== ""
    ) {
      const added = {
        name: {
          en: lang === "en" ? optionName.trim() : "",
          pt: lang === "pt" ? optionName.trim() : "",
        },
        price: Number(optionPrice),
        tax: optionTax,
        sdr: optionSdr,
      };
      if (sortAz) {
        setEditingIndex(null);
        replace(sortByName([...form.getValues("options"), added], lang));
      } else {
        append(added);
      }

      // The next option starts like this one: usually every extra in a group
      // has the same price, VAT and SDR.
      setOptionName("");
      setOptionPrice(groupPrice);
    }
  };


  const handleAddOrEditGroup = async (data: TAddonGroupForm) => {
    if (isSubmitting) return;
    if (titleTaken(allGroups, data.title?.[lang] ?? "", prevValues?._id)) {
      toast.error(t("addon_title_taken"));
      return;
    }
    const payload = {
      title: data.title,
      // A→Z when asked. Only a new group keeps this order: the API doesn't
      // reorder an existing one (plan.md §11.1).
      options: sortAz ? sortByName(data.options, lang) : data.options,
      maxSelectable: data.maxSelectable,
      minSelectable: data.minSelectable
    };

    try {
      if (actionType === "create") {
        const toastId = toast.loading("Creating add-on group...");
        const translated = await translateObject(payload, lang);

        if (!translated) {
          // Cancelled in the translation dialog: back to the form, nothing saved.
          toast.dismiss(toastId);
          return;
        }

        const addonsPayload = {
          ...payload,
          title: translated.title,
          options: translated.options
        };

        const result = await createAddOnsGroup(addonsPayload);

        if (result.success) {
          form.reset();
          toast.success(
            result.message || "Add-on group created successfully!",
            { id: toastId }
          );
          router.refresh();
          onOpenChange(false);
          return;
        }

        const errorSources = result?.data?.errorSources;
        if (errorSources?.length > 0) {
          toast.error(errorSources?.map((err: { path: string, message: string }) => err?.message), { id: toastId })
        } else {
          toast.error(
            result.message || "Failed to update add-on group.",
            { id: toastId }
          );
        }
      } else {
        const toastId = toast.loading("Updating add-on group...");
        const translated = await translateObject(payload, lang);

        if (!translated) {
          // Cancelled in the translation dialog: back to the form, nothing saved.
          toast.dismiss(toastId);
          return;
        }

        const addonsPayload = {
          ...payload,
          title: translated.title,
          options: translated.options
        };

        const result = await updateAddOnsGroup(
          prevValues?._id as string,
          addonsPayload
        );

        if (result.success) {
          // `PATCH /add-ons/:id` only updates and adds; an option left out
          // stays on the server. Remove the ones taken off with ✕ here.
          const kept = new Set(data.options.map((option) => option.sku));
          const removed = (prevValues?.options ?? [])
            .map((option) => option.sku)
            .filter((sku): sku is string => !!sku && !kept.has(sku));
          const removals = await Promise.all(
            removed.map((sku) => deleteOptionFromGroup(prevValues?._id as string, sku))
          );
          if (removals.some((removal) => !removal?.success)) {
            toast.error(t("addon_remove_failed"), { id: toastId });
            router.refresh();
            return;
          }

          form.reset();
          toast.success(
            result.message || "Add-on group updated successfully!",
            { id: toastId }
          );
          router.refresh();
          onOpenChange(false);
          return;
        }

        const errorSources = result?.data?.errorSources;
        if (errorSources?.length > 0) {
          errorSources?.map((err: any) => {
            toast.error(err?.message, { id: toastId })
          })
        } else {
          toast.error(
            result.message || "Failed to update add-on group.",
            { id: toastId }
          );
        }
      }
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
      console.error(error);
    }
  };

  return (
    <Sheet
      open={open}
      onOpenChange={(next) => {
        if (!next) setEditingIndex(null);
        onOpenChange(next);
      }}
    >
      <SheetContent
        className="p-6 overflow-auto"
        // Escape while an option is open for editing cancels that edit only.
        onEscapeKeyDown={(e) => {
          if (editingIndex === null) return;
          e.preventDefault();
          setEditingIndex(null);
        }}
      >
        <SheetHeader className="px-0">
          <SheetTitle>
            {actionType === "create" ? t("create") : t("edit")} {t("addon_group")}
          </SheetTitle>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleAddOrEditGroup)}
            className="space-y-4 mt-4"
            id="creatAddOnsForm"
          >
            {lang === 'en' && <FormField
              control={form.control}
              name="title.en"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("group_title")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("drinks_upgrade")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />}
            {lang === 'pt' && <FormField
              control={form.control}
              name="title.pt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("group_title")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("drinks_upgrade")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />}
            {titleIsTaken && (
              <p role="alert" className="-mt-2 text-sm text-destructive" data-testid="addon-title-taken">
                {t("addon_title_taken")}
              </p>
            )}

            <FormField
              control={form.control}
              name="minSelectable"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("min_select")}</FormLabel>
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
                  <FormLabel>{t("max_select")}</FormLabel>
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

            {/* One price for the whole group (0 = all free). */}
            <div className="space-y-1">
              <label htmlFor="addon-group-price" className="text-sm font-medium">
                {t("addon_group_price")}
              </label>
              <PriceInput
                id="addon-group-price"
                value={groupPrice}
                onValueChange={changeGroupPrice}
                placeholder="0.00"
              />
              <p className="text-xs text-gray-500">{t("addon_group_price_help")}</p>
            </div>

            {/* Food | Drinks: VAT and SDR for every option. */}
            <fieldset className="space-y-2">
              <legend className="mb-2 text-sm font-medium">{t("product_kind_label")}</legend>
              <div className="inline-flex rounded-xl border border-gray-200 bg-white p-1" role="radiogroup" aria-label={t("product_kind_label")}>
                {(["FOOD", "DRINK"] as const).map((kind) => {
                  const Icon = kind === "FOOD" ? UtensilsCrossed : CupSoda;
                  const selected = currentKind === kind;
                  return (
                    <button
                      key={kind}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      disabled={missingRate(kind)}
                      onClick={() => pickKind(kind)}
                      className={cn(
                        "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40",
                        selected ? "bg-[#DC3173] text-white" : "text-gray-600 hover:bg-gray-50",
                      )}
                    >
                      <Icon className="h-4 w-4" aria-hidden />
                      {t(kind === "FOOD" ? "product_kind_food" : "product_kind_drink")}
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-gray-500">{t("addon_kind_help")}</p>
              {(["FOOD", "DRINK"] as const).filter(missingRate).map((kind) => (
                <p key={kind} className="text-xs text-amber-700">
                  {t("product_kind_missing_rate").replace("{rate}", String(KIND_SETTINGS[kind].rate))}
                </p>
              ))}
            </fieldset>

            <div className="space-y-2 ">
              {/* The title stays in view while scrolling a long list of
                  options — the sheet itself is what scrolls (p-6). */}
              <div
                className="sticky -top-6 z-10 -mx-6 border-y border-gray-100 bg-white/95 px-6 py-2 backdrop-blur"
                data-testid="addon-options-for"
              >
                <p className="text-xs text-gray-500">{t("addon_options_for")}</p>
                <p className="truncate font-semibold text-gray-900">
                  {watchedTitle.trim() || <span className="font-normal italic text-gray-400">{t("addon_no_title_yet")}</span>}
                  <span className="ml-1 font-normal text-gray-400">({optionsFields.length})</span>
                </p>
              </div>
              <label className="flex cursor-pointer items-start gap-2 py-1">
                <Checkbox
                  checked={sortAz}
                  onCheckedChange={(checked) => toggleSort(checked === true)}
                  className="mt-0.5 data-[state=checked]:border-[#DC3173] data-[state=checked]:bg-[#DC3173]"
                />
                <span className="space-y-0.5">
                  <span className="block text-sm font-medium">{t("addon_sort_az")}</span>
                  <span className="block text-xs text-gray-500">
                    {t(actionType === "create" ? "addon_sort_az_help_create" : "addon_sort_az_help_edit")}
                  </span>
                </span>
              </label>
              {optionsFields?.length > 0 && (
                <div className="space-y-2 mb-1">
                  {optionsFields?.map((option, index) => {
                    const taxRate = taxes.find((tax) => tax._id === option.tax)?.taxRate;
                    return (
                      <div
                        // The field array's own id: names repeat across
                        // languages and can be empty in one of them.
                        key={option.id}
                        className="space-y-2 rounded-lg border border-[#DC3173]/20 bg-[#DC3173]/5 px-3 py-2"
                      >
                        {editingIndex === index ? (
                          <div className="space-y-3 py-1">
                            <div className="space-y-1">
                              <label htmlFor={`edit-option-name-${option.id}`} className="text-sm font-medium">
                                {t("option_name")}
                              </label>
                              <Input
                                id={`edit-option-name-${option.id}`}
                                autoFocus
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault();
                                    saveEdit();
                                  }
                                }}
                                className="bg-white"
                              />
                            </div>
                            <div className="space-y-1">
                              <span className="text-sm font-medium">{t("option_price")}</span>
                              <PriceInput
                                value={editPrice}
                                onValueChange={setEditPrice}
                                placeholder={t("option_price")}
                              />
                            </div>
                            <div className="space-y-1">
                              <span className="text-sm font-medium">{t("option_tax")}</span>
                              <Select value={editTax} onValueChange={setEditTax}>
                                <SelectTrigger className="w-full bg-white">
                                  <SelectValue placeholder={t("select_tax")} />
                                </SelectTrigger>
                                <SelectContent>
                                  {taxes?.map((tax) => (
                                    <SelectItem key={tax._id} value={tax._id}>
                                      {tax.taxName} ({tax.taxRate}%)
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="flex justify-end gap-2">
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingIndex(null)}
                              >
                                {t("cancel")}
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                onClick={saveEdit}
                                disabled={!editValid}
                                className="bg-[#DC3173] text-white hover:bg-[#B02458]"
                              >
                                {t("save")}
                              </Button>
                            </div>
                          </div>
                        ) : (
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-800 wrap-anywhere">
                              {option.name?.[lang]}
                            </p>
                            <p className="text-xs text-gray-500">
                              {t("price")}: {Number(option.price).toFixed(2)}&nbsp;€
                              {taxRate !== undefined ? ` · incl. Tax: ${taxRate}%` : ""}
                            </p>
                          </div>
                          <div className="flex shrink-0 items-center gap-1">
                          {/* Arrange by hand — only when creating: the API keeps
                              the order sent on create, but an update doesn't
                              reorder (plan.md §11.7). Moving one turns A→Z off. */}
                          {actionType === "create" && (
                            <>
                              <button
                                type="button"
                                disabled={index === 0}
                                onClick={() => {
                                  setEditingIndex(null);
                                  setSortAz(false);
                                  move(index, index - 1);
                                }}
                                aria-label={`${t("addon_order_up")}: ${option.name?.[lang] ?? ""}`}
                                title={t("addon_order_up")}
                                className="rounded p-0.5 text-gray-400 hover:bg-[#DC3173]/10 hover:text-[#DC3173] disabled:pointer-events-none disabled:opacity-30"
                              >
                                <ArrowUp className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                disabled={index === optionsFields.length - 1}
                                onClick={() => {
                                  setEditingIndex(null);
                                  setSortAz(false);
                                  move(index, index + 1);
                                }}
                                aria-label={`${t("addon_order_down")}: ${option.name?.[lang] ?? ""}`}
                                title={t("addon_order_down")}
                                className="rounded p-0.5 text-gray-400 hover:bg-[#DC3173]/10 hover:text-[#DC3173] disabled:pointer-events-none disabled:opacity-30"
                              >
                                <ArrowDown className="h-4 w-4" />
                              </button>
                            </>
                          )}
                          <button
                            type="button"
                            onClick={() => startEdit(index)}
                            aria-label={`${t("edit")} ${option.name?.[lang] ?? ""}`.trim()}
                            className="rounded p-0.5 text-gray-400 hover:bg-[#DC3173]/10 hover:text-[#DC3173]"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            // By position, through the field array. When editing,
                            // saving deletes the removed options on the server
                            // (see `handleAddOrEditGroup`).
                            onClick={() => {
                              setEditingIndex(null);
                              remove(index);
                            }}
                            aria-label={`${t("remove")} ${option.name?.[lang] ?? ""}`.trim()}
                            className="rounded p-0.5 text-gray-400 hover:bg-[#DC3173]/10 hover:text-[#DC3173]"
                          >
                            <XIcon className="h-4 w-4" />
                          </button>
                          </div>
                        </div>
                        )}
                        <FormField
                          control={form.control}
                          name={`options.${index}.sdr`}
                          render={({ field }) => (
                            <AddonSdrControl
                              compact
                              id={`option-sdr-${option.id}`}
                              value={field.value}
                              onChange={field.onChange}
                              deposit={deposit}
                              t={t}
                            />
                          )}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
              <div className="border rounded-md p-4 bg-gray-50 space-y-3">
                <FormField
                  control={form.control}
                  name="optionName"
                  render={() => (
                    <FormItem className="gap-1">
                      <FormLabel>{t("option_name")}</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          value={optionName}
                          onChange={(e) => setOptionName(e.target.value)}
                          placeholder={t("add_an_option_name")}
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
                      <FormLabel>{t("option_price")}</FormLabel>
                      <FormControl>
                        <PriceInput
                          value={optionPrice}
                          onValueChange={setOptionPrice}
                          placeholder={t("option_price")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="optionTax"
                  render={() => (
                    <FormItem className="gap-1">
                      <FormLabel>{t("option_tax")}</FormLabel>
                      <FormControl>
                        <Select
                          value={optionTax}
                          onValueChange={(val) => setOptionTax(val)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder={t("select_tax")} />
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
                <div className="border-t pt-3">
                  <AddonSdrControl
                    id="new-option-sdr"
                    value={optionSdr}
                    onChange={setOptionSdr}
                    deposit={deposit}
                    t={t}
                  />
                </div>
                <div className="text-right">
                  <Button
                    size="sm"
                    type="button"
                    onClick={addOption}
                    className="bg-[#DC3173] text-white px-4 py-2 rounded-md hover:bg-[#B02458] transition-colors"
                  >
                    {t("add_option")}
                  </Button>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <Button
                className="w-full"
                style={{ background: PRIMARY }}
                form="creatAddOnsForm"
                // An option still open for editing must be saved or cancelled
                // first, or its changes would be silently left out.
                disabled={isSubmitting || editingIndex !== null || titleIsTaken}
              >
                {actionType === "create" ? t("create") : t("update")}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
