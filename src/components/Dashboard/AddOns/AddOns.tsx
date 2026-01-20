"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { CheckCircle, Dot, Edit, Plus, Trash2 } from "lucide-react";

import AddOptionsForm from "@/src/components/Dashboard/AddOns/AddOptionsForm";
import CreateOrEditAddOnsGroup from "@/src/components/Dashboard/AddOns/CreateOrEditAddOnsGroup";
import AllFilters from "@/src/components/Filtering/AllFilters";
import PaginationComponent from "@/src/components/Filtering/PaginationComponent";
import DeleteModal from "@/src/components/Modals/DeleteModal";
import { useTranslation } from "@/src/hooks/use-translation";
import { deleteOptionFromGroup } from "@/src/services/dashboard/add-ons/add-ons";
import { TMeta } from "@/src/types";
import { TAddonGroup } from "@/src/types/add-ons.type";
import { TTax } from "@/src/types/tax.type";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const PRIMARY = "#DC3173";
const BG = "#FFF2F8";
const SHADOW =
  "0px 6px 24px rgba(0,0,0,0.06), inset 0px 0px 10px rgba(0,0,0,0.03)";

interface IProps {
  addOnsResult: { data: TAddonGroup[]; meta?: TMeta };
  taxes: TTax[];
}

export default function AddOns({ addOnsResult, taxes }: IProps) {
  const { t } = useTranslation();
  const router = useRouter();

  const sortOptions = [
    { label: t("newest_first"), value: "-createdAt" },
    { label: t("oldest_first"), value: "createdAt" },
  ];
  const [deleteOptionInfo, setDeleteOptionInfo] = useState<{
    groupId: string;
    optionId: string;
  }>({ groupId: "", optionId: "" });
  const [selectedGroupForEdit, setSelectedGroupForEdit] = useState<
    TAddonGroup | undefined
  >(undefined);
  const [openCreateForm, setOpenCreateForm] = useState<boolean>(false);
  const [selectedGroupForAddOption, setSelectedGroupForAddOption] = useState<
    TAddonGroup | undefined
  >(undefined);

  // const deleteGroup = (id: string) => {};

  const handleDeleteOption = async () => {
    const toastId = toast.loading("Deleting option...");

    const { groupId, optionId } = deleteOptionInfo;
    const result = await deleteOptionFromGroup(groupId, optionId);

    if (result.success) {
      toast.success(result.message || "Option deleted successfully!", {
        id: toastId,
      });
      router.refresh();
      setDeleteOptionInfo({ groupId: "", optionId: "" });
      return;
    }

    toast.error(result.message || "Failed to delete option", { id: toastId });
    console.log(result);
  };

  return (
    <div className="min-h-screen p-6 md:p-10" style={{ background: BG }}>
      <div className="max-w-[900px] mx-auto space-y-8">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1
              className="text-4xl font-extrabold tracking-tight"
              style={{ color: PRIMARY }}
            >
              {t("add_ons_extras")}
            </h1>
          </div>

          {/* Create AddOns Group */}
          <Button
            onClick={() => setOpenCreateForm(true)}
            className="flex items-center gap-2"
            style={{ background: PRIMARY }}
          >
            <Plus size={18} /> {t("add_group")}
          </Button>
          <CreateOrEditAddOnsGroup
            open={openCreateForm}
            onOpenChange={(open) => !open && setOpenCreateForm(false)}
            taxes={taxes}
          />
        </div>

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
                {t("no_orders_match_query")}
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
                    {/* GROUP HEADER */}
                    <div className="flex items-center justify-between p-5 border-b">
                      <div>
                        <h2 className="text-xl font-bold">{group.title}</h2>

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

                      <div className="flex items-center gap-2">
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
                          className="flex items-center justify-between p-4 rounded-2xl border bg-white"
                          style={{
                            boxShadow:
                              "inset 0px 0px 8px rgba(0,0,0,0.03), 0px 4px 12px rgba(0,0,0,0.04)",
                          }}
                        >
                          <div className="flex items-center gap-2 text-gray-800">
                            <Dot size={24} className="text-gray-400" />
                            <span className="text-base font-medium">
                              {option.name}
                            </span>
                          </div>

                          <div className="flex items-center gap-8">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-gray-900">
                                €{option.price.toFixed(2)}
                              </span>
                              {option.tax && (
                                <span className="text-xs text-slate-800">
                                  (tax: {(option.tax as TTax)?.taxRate}%)
                                </span>
                              )}
                              <CheckCircle
                                size={18}
                                className="text-green-500 opacity-70"
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                className="p-0! h-fit text-destructive"
                                onClick={() =>
                                  setDeleteOptionInfo({
                                    groupId: group._id,
                                    optionId: option._id as string,
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
          open={!!deleteOptionInfo.optionId && !!deleteOptionInfo.groupId}
          onOpenChange={(open) =>
            !open && setDeleteOptionInfo({ groupId: "", optionId: "" })
          }
          onConfirm={() => handleDeleteOption()}
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
      />

      {/* Edit AddOns Group */}
      <CreateOrEditAddOnsGroup
        open={!!selectedGroupForEdit}
        onOpenChange={(open) => !open && setSelectedGroupForEdit(undefined)}
        prevValues={selectedGroupForEdit}
        taxes={taxes}
        actionType="edit"
      />
    </div>
  );
}
