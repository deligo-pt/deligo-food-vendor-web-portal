"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { Copy, Dot, Edit, Plus, Trash2 } from "lucide-react";

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

const SHADOW =
  "0px 6px 24px rgba(0,0,0,0.06), inset 0px 0px 10px rgba(0,0,0,0.03)";

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
                whileHover={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 170, damping: 16 }}
              >
                <Card
                  className="border bg-white rounded-3xl overflow-hidden"
                  style={{ boxShadow: SHADOW }}
                >
                  <CardContent className="p-0">
                    {/* GROUP HEADER: title above the buttons on phones,
                        side by side from sm. */}
                    <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:justify-between sm:p-5 border-b">
                      <div className="min-w-0">
                        <h2 className="flex flex-wrap items-center gap-2 text-xl font-bold wrap-anywhere">
                          {group.title?.[lang]}
                          {!groupActive(group) && (
                            <span
                              className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-semibold text-gray-600"
                              data-testid="addon-group-inactive"
                            >
                              {t("addon_inactive")}
                            </span>
                          )}
                        </h2>
                        {/* The optional name, when the group has one. */}
                        {(group.name?.[lang] || group.name?.en || group.name?.pt) && (
                          <p className="text-sm font-medium text-gray-500 wrap-anywhere" data-testid="addon-group-name">
                            {group.name?.[lang] || group.name?.en || group.name?.pt}
                          </p>
                        )}

                        <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                          <span>{t("min")}:</span>
                          <span className="font-medium text-gray-800">
                            {group.minSelectable}
                          </span>{" "}
                          ● <span>{t("max")}:</span>
                          <span className="font-medium text-gray-800">
                            {group.maxSelectable}
                          </span>
                          {/* {group.required ? (
                            <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-600">
                              Required
                            </span>
                          ) : (
                            <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
                              Optional
                            </span>
                          )} */}
                        </div>
                      </div>

                      <div className="flex shrink-0 flex-wrap items-center gap-2">
                        {/* ACTIVE / INACTIVE for the whole group, as tall as the buttons */}
                        <label className="flex h-8 cursor-pointer items-center gap-2 rounded-md border px-3 text-sm font-medium text-gray-700">
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
                          {/* fixed width: the buttons beside it don't move when the word changes */}
                          <span className="w-14">{groupActive(group) ? t("addon_active") : t("addon_inactive")}</span>
                        </label>

                        {/* ADD ADDON BUTTON */}
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1"
                          onClick={() => setSelectedGroupForAddOption(group)}
                        >
                          <Plus size={16} /> {t("add_addon")}
                        </Button>

                        {/* EDIT */}
                        <Button
                          onClick={() => setSelectedGroupForEdit(group)}
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1"
                        >
                          <Edit size={16} /> {t("edit")}
                        </Button>

                        {/* CLONE */}
                        <Button
                          onClick={() => setGroupToClone(group)}
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1"
                        >
                          <Copy size={16} /> {t("addon_clone")}
                        </Button>

                        {/* DELETE */}
                        {/* <Button
                          variant="destructive"
                          size="sm"
                          className="flex items-center gap-1"
                          onClick={() => deleteGroup(group._id)}
                        >
                          <Trash2 size={16} /> Delete
                        </Button> */}
                      </div>
                    </div>

                    {/* ADDONS LIST */}
                    <div className="p-5 space-y-3">
                      {group.options.map((option, idx) => (
                        <div
                          key={idx}
                          className="flex flex-wrap items-center justify-between gap-3 p-3 sm:p-4 rounded-2xl border bg-white"
                          style={{
                            boxShadow:
                              "inset 0px 0px 8px rgba(0,0,0,0.03), 0px 4px 12px rgba(0,0,0,0.04)",
                          }}
                        >
                          {/* The name keeps at least 8rem; below that the
                              price and delete move under it. */}
                          <div className="flex min-w-0 flex-1 basis-32 items-center gap-2 text-gray-800">
                            <Dot size={24} className="shrink-0 text-gray-400" />
                            <span
                              className={
                                optionActive(option)
                                  ? "text-base font-medium wrap-anywhere"
                                  : "text-base font-medium wrap-anywhere text-gray-400 line-through"
                              }
                            >
                              {option?.name?.[lang]}
                            </span>
                            {option.sdr?.applicable && (
                              <span
                                title={t("sdr_container_deposit")}
                                className="shrink-0 rounded-full bg-[#DC3173]/10 px-2 py-0.5 text-xs font-semibold text-[#DC3173]"
                              >
                                SDR
                              </span>
                            )}
                          </div>

                          <div className="ml-auto flex shrink-0 items-center gap-4 sm:gap-6">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-gray-900">
                                {option.price.toFixed(2)}&nbsp;€
                              </span>
                              {option.tax && (
                                <span className="text-xs text-slate-800">
                                  {t("tax")}: {(option.tax as TTax)?.taxRate}%
                                </span>
                              )}
                            </div>
                            {/* ACTIVE / INACTIVE for this option */}
                            {option.sku && (
                              <Switch
                                checked={optionActive(option)}
                                disabled={!!saving[option.sku]}
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
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                className="p-0! h-fit text-destructive"
                                onClick={() =>
                                  setDeleteOptionInfo({
                                    groupId: group._id,
                                    optionSku: option.sku as string,
                                  })
                                }
                              >
                                <Trash2 size={20} />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
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
