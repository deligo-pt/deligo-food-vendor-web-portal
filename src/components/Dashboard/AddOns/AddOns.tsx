"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { Copy, Edit, Plus, Trash2 } from "lucide-react";

import AddOptionsForm from "@/src/components/Dashboard/AddOns/AddOptionsForm";
import CreateOrEditAddOnsGroup from "@/src/components/Dashboard/AddOns/CreateOrEditAddOnsGroup";
import AllFilters from "@/src/components/Filtering/AllFilters";
import PaginationComponent from "@/src/components/Filtering/PaginationComponent";
import DeleteModal from "@/src/components/Modals/DeleteModal";
import TitleHeader from "@/src/components/TitleHeader/TitleHeader";
import { useTranslation } from "@/src/hooks/use-translation";
import { Switch } from "@/components/ui/switch";
import { deleteOptionFromGroup, toggleOptionStatus, updateAddOnsGroup } from "@/src/services/dashboard/add-ons/add-ons";
import { TMeta } from "@/src/types";
import { TAddonGroup } from "@/src/types/add-ons.type";
import { TTax } from "@/src/types/tax.type";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useStore } from "@/src/store/store";
import { groupLabel, presentText } from "@/src/utils/addonGroup";

const SHADOW =
  "0px 6px 24px rgba(0,0,0,0.06), inset 0px 0px 10px rgba(0,0,0,0.03)";

/** Option rows and their header: name · price · VAT · on/off · delete. */
const OPTION_GRID = "grid grid-cols-[minmax(0,1fr)_4.5rem_2.75rem_2.75rem_2rem] items-center gap-2 sm:grid-cols-[minmax(0,1fr)_6rem_4rem_3.5rem_2.5rem] sm:gap-3";

interface IProps {
  addOnsResult: { data: TAddonGroup[]; meta?: TMeta };
  taxes: TTax[];
  /** Every group of the vendor (all pages), for the duplicate-title check. */
  allGroups: TAddonGroup[];
}

export default function AddOns({ addOnsResult, taxes, allGroups }: IProps) {
  const { t } = useTranslation();
  const { lang } = useStore();
  const router = useRouter();

  const sortOptions = [
    { label: t("newest_first"), value: "-createdAt" },
    { label: t("oldest_first"), value: "createdAt" },
  ];
  const [deleteOptionInfo, setDeleteOptionInfo] = useState<{
    groupId: string;
    optionSku: string;
  }>({ groupId: "", optionSku: "" });

  const [selectedGroupForEdit, setSelectedGroupForEdit] = useState<
    TAddonGroup | undefined
  >(undefined);

  const [isDeleting, setIsDeleting] = useState(false);
  const [openCreateForm, setOpenCreateForm] = useState<boolean>(false);
  // Bumped on every "Add Group" so the sheet opens with an empty form.
  const [createKey, setCreateKey] = useState(0);
  const [groupToClone, setGroupToClone] = useState<TAddonGroup | undefined>(undefined);
  const [selectedGroupForAddOption, setSelectedGroupForAddOption] = useState<
    TAddonGroup | undefined
  >(undefined);

  // const deleteGroup = (id: string) => {};

  // Active / Inactive for a group (key: its id) or an option (key: its sku),
  // shown at once. What was chosen here wins until the page reloads, so a
  // list that comes back stale after the save can't flip the switch back.
  const [chosen, setChosen] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  /** Flip at once, save, and flip back with a message if saving fails. */
  const saveStatus = async (
    key: string,
    isActive: boolean,
    save: () => Promise<{ success: boolean; message?: string }>,
  ) => {
    setChosen((c) => ({ ...c, [key]: isActive }));
    setSaving((s) => ({ ...s, [key]: true }));
    try {
      const result = await save();
      if (!result.success) throw new Error(result.message);
      router.refresh();
    } catch (error) {
      setChosen((c) => ({ ...c, [key]: !isActive }));
      toast.error((error as Error)?.message || t("addon_status_failed"));
    } finally {
      setSaving((s) => ({ ...s, [key]: false }));
    }
  };
  const groupActive = (group: TAddonGroup) => chosen[group._id] ?? group.isActive !== false;
  const optionActive = (option: TAddonGroup["options"][number]) =>
    (option.sku ? chosen[option.sku] : undefined) ?? option.isActive !== false;

  const handleDeleteOption = async () => {
    const toastId = toast.loading("Deleting option...");
    setIsDeleting(true);

    const { groupId, optionSku } = deleteOptionInfo;
    const result = await deleteOptionFromGroup(groupId, optionSku);

    if (result.success) {
      toast.success(result.message || "Option deleted successfully!", {
        id: toastId,
      });
      router.refresh();
      setDeleteOptionInfo({ groupId: "", optionSku: "" });
      setIsDeleting(false);
      return;
    }

    toast.error(result.message || "Failed to delete option", { id: toastId });
    setIsDeleting(false);
    console.log(result);
  };

  return (
    <>
      <div className="min-h-screen space-y-8">
        {/* HEADER */}

        <TitleHeader
          title={t("add_ons_extras")}
          subtitle={t("manage_your_add_on_groups_options")}
          buttonInfo={{
            text: t("add_group"),
            icon: Plus,
            onClick: () => {
              setCreateKey((key) => key + 1);
              setOpenCreateForm(true);
            },
          }}
        />
        <CreateOrEditAddOnsGroup
          key={`create-${createKey}`}
          open={openCreateForm}
          onOpenChange={(open) => !open && setOpenCreateForm(false)}
          taxes={taxes}
          allGroups={allGroups}
          t={t}
        />

        {/* FILTERS */}
        <AllFilters sortOptions={sortOptions} />

        {/* GROUP LIST */}
        <div className="space-y-6 pt-2">
          <AnimatePresence>
            {addOnsResult?.data?.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-12 text-center text-gray-500"
              >
                {t("no_add_ons_found")}
              </motion.div>
            )}

            {addOnsResult?.data?.map((group) => (
              <motion.div
                key={group._id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ type: "spring", stiffness: 170, damping: 16 }}
              >
                <Card
                  className="gap-0 overflow-hidden rounded-3xl border bg-white py-0"
                  style={{ boxShadow: SHADOW }}
                >
                  <CardContent className="p-0">
                    {/* One left edge: the group's switch has its own column, and
                        the name, details, divider and options all start to its
                        right — it controls everything in that column. */}
                    <div className="flex gap-3 p-4 sm:gap-4 sm:p-5">
                      {/* ACTIVE / INACTIVE for the whole group. Off here turns every
                          option off for customers; each option keeps its own state. */}
                      <div className="flex h-7 shrink-0 items-center">
                        <Switch
                          checked={groupActive(group)}
                          disabled={!!saving[group._id]}
                          onCheckedChange={(checked) =>
                            saveStatus(group._id, checked, () => updateAddOnsGroup(group._id, { isActive: checked }))
                          }
                          aria-label={t("addon_group_status")}
                          data-testid="addon-group-switch"
                          className="data-[state=checked]:bg-[#DC3173]"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        {/* GROUP HEADER: name and details, buttons on the right
                            (under them on phones). */}
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0">
                            <h2 className="text-xl font-bold leading-7 text-gray-900 wrap-anywhere">
                              {/* The vendor's own name; the title when it has none. */}
                              {groupLabel(group, lang)}
                            </h2>
                            <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-gray-500">
                              {/* With a name as the heading, the title customers see. */}
                              {presentText(group.name) && (
                                <>
                                  <span className="wrap-anywhere" data-testid="addon-group-title">
                                    {t("addon_customers_see")}:{" "}
                                    <span className="text-gray-700">
                                      {group.title?.[lang] || group.title?.en || group.title?.pt}
                                    </span>
                                  </span>
                                  <span aria-hidden className="text-gray-300">·</span>
                                </>
                              )}
                              <span>
                                {t("min")} <span className="font-medium text-gray-700">{group.minSelectable}</span>
                              </span>
                              <span aria-hidden className="text-gray-300">·</span>
                              <span>
                                {t("max")} <span className="font-medium text-gray-700">{group.maxSelectable}</span>
                              </span>
                              <span aria-hidden className="text-gray-300">·</span>
                              <span
                                className={groupActive(group) ? "font-medium text-[#DC3173]" : "font-medium text-gray-500"}
                                data-testid="addon-group-status"
                              >
                                {groupActive(group) ? t("addon_active") : t("addon_inactive")}
                              </span>
                            </p>
                          </div>

                          <div className="flex shrink-0 flex-wrap items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 gap-1"
                              onClick={() => setSelectedGroupForAddOption(group)}
                            >
                              <Plus size={16} /> {t("add_addon")}
                            </Button>
                            <Button
                              onClick={() => setSelectedGroupForEdit(group)}
                              variant="outline"
                              size="sm"
                              className="h-8 gap-1"
                            >
                              <Edit size={16} /> {t("edit")}
                            </Button>
                            <Button
                              onClick={() => setGroupToClone(group)}
                              variant="outline"
                              size="sm"
                              className="h-8 gap-1"
                            >
                              <Copy size={16} /> {t("addon_clone")}
                            </Button>
                          </div>
                        </div>

                        <div className="my-4 border-t" />

                        {/* A group that is off hides all its options from customers.
                            Each option keeps its own saved on/off (the API doesn't
                            change it — checked 28 Nov 2026), so turning the group
                            back on brings back exactly the options that were on. */}
                        {!groupActive(group) && group.options.length > 0 && (
                          <p className="mb-3 rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-600" data-testid="addon-group-off-note">
                            {t("addon_group_off_note")}
                          </p>
                        )}

                        {/* OPTIONS: fixed columns so prices, VAT and switches line up. */}
                        <div className={groupActive(group) ? "space-y-2" : "space-y-2 opacity-60"}>
                          {group.options.length > 0 && (
                            <div className={`${OPTION_GRID} px-3 text-xs font-medium uppercase tracking-wide text-gray-400`}>
                              <span>{t("addon_col_option")}</span>
                              <span className="text-right">{t("addon_col_price")}</span>
                              <span className="text-right">{t("addon_col_vat")}</span>
                              <span className="sr-only">{t("addon_option_status")}</span>
                              <span className="sr-only">{t("remove")}</span>
                            </div>
                          )}
                          {group.options.map((option, idx) => {
                            const on = groupActive(group) && optionActive(option);
                            return (
                              <div
                                key={option.sku ?? idx}
                                className={`${OPTION_GRID} rounded-xl border bg-white px-3 py-2.5 transition-colors hover:bg-gray-50`}
                              >
                                <div className="flex min-w-0 items-center gap-2">
                                  <span
                                    className={
                                      on
                                        ? "font-medium text-gray-900 wrap-anywhere"
                                        : "font-medium text-gray-400 line-through wrap-anywhere"
                                    }
                                  >
                                    {option?.name?.[lang]}
                                  </span>
                                  {option.sdr?.applicable && (
                                    <span
                                      title={t("sdr_container_deposit")}
                                      className="shrink-0 rounded border border-[#DC3173]/20 bg-[#DC3173]/5 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-[#DC3173]"
                                    >
                                      SDR
                                    </span>
                                  )}
                                </div>
                                <span className="text-right font-semibold tabular-nums text-gray-900">
                                  {option.price.toFixed(2)}&nbsp;€
                                </span>
                                <span className="text-right text-sm tabular-nums text-gray-500">
                                  {option.tax ? `${(option.tax as TTax)?.taxRate}%` : "—"}
                                </span>
                                <div className="flex justify-center">
                                  {option.sku && (
                                    <Switch
                                      // Off and locked while the group is off; its own
                                      // state shows again when the group is back on.
                                      checked={on}
                                      disabled={!groupActive(group) || !!saving[option.sku]}
                                      title={groupActive(group) ? undefined : t("addon_group_off_hint")}
                                      onCheckedChange={(checked) =>
                                        saveStatus(option.sku as string, checked, () =>
                                          toggleOptionStatus(group._id, option.sku as string, checked),
                                        )
                                      }
                                      aria-label={t("addon_option_status")}
                                      data-testid="addon-option-switch"
                                      className="data-[state=checked]:bg-[#DC3173]"
                                    />
                                  )}
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-gray-400 hover:bg-red-50 hover:text-red-600"
                                  aria-label={t("remove")}
                                  onClick={() =>
                                    setDeleteOptionInfo({
                                      groupId: group._id,
                                      optionSku: option.sku as string,
                                    })
                                  }
                                >
                                  <Trash2 size={16} />
                                </Button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <DeleteModal
          open={!!deleteOptionInfo.optionSku && !!deleteOptionInfo.groupId}
          onOpenChange={(open) =>
            !open && setDeleteOptionInfo({ groupId: "", optionSku: "" })
          }
          onConfirm={() => handleDeleteOption()}
          isDeleting={isDeleting}
        />

        {/* PAGINATION */}
        {!!addOnsResult?.meta?.total && addOnsResult?.meta?.total > 0 && (
          <div className="px-4 pb-4">
            <PaginationComponent
              totalPages={addOnsResult?.meta?.totalPage || 0}
            />
          </div>
        )}
      </div>

      {/* ADD ADDON SHEET */}
      <AddOptionsForm
        open={!!selectedGroupForAddOption}
        onOpenChange={(open) =>
          !open && setSelectedGroupForAddOption(undefined)
        }
        selectedGroup={selectedGroupForAddOption}
        taxes={taxes}
        t={t}
      />

      {/* Edit AddOns Group */}
      <CreateOrEditAddOnsGroup
        key={`edit-${selectedGroupForEdit?._id ?? "none"}`}
        open={!!selectedGroupForEdit}
        onOpenChange={(open) => !open && setSelectedGroupForEdit(undefined)}
        prevValues={selectedGroupForEdit}
        taxes={taxes}
        allGroups={allGroups}
        actionType="edit"
        t={t}
      />

      {/* Clone a group: the create form, filled from it (plan.md §11) */}
      <CreateOrEditAddOnsGroup
        key={`clone-${groupToClone?._id ?? "none"}`}
        open={!!groupToClone}
        onOpenChange={(open) => !open && setGroupToClone(undefined)}
        prevValues={groupToClone}
        taxes={taxes}
        allGroups={allGroups}
        actionType="clone"
        t={t}
      />
    </>
  );
}
