"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import EditOffer from "@/src/components/Dashboard/Offers/ActiveOffers/EditOffer";
import AllFilters from "@/src/components/Filtering/AllFilters";
import DeleteModal from "@/src/components/Modals/DeleteModal";
import { useTranslation } from "@/src/hooks/use-translation";
import {
  deleteOfferReq,
  toggleOfferStatusReq,
} from "@/src/services/dashboard/offers/offers";
import { TMeta } from "@/src/types";
import { TOffer } from "@/src/types/offer.type";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { CalendarClock, Flame, Percent, Plus, Tag } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const PRIMARY = "#DC3173";
const BG = "#FFF1F7";
const SHADOW = "0 6px 20px rgba(0,0,0,0.06)";

interface IProps {
  offersResult: {
    data: TOffer[];
    meta?: TMeta;
  };
  title: string;
}

export default function ActiveOffers({ offersResult, title }: IProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const [editOffer, setEditOffer] = useState<TOffer | null>(null);
  const [deleteId, setDeleteId] = useState<string>("");

  const sortOptions = [
    { label: t("newest_first"), value: "-createdAt" },
    { label: t("oldest_first"), value: "createdAt" },
  ];

  const toggleStatus = async (offerId: string) => {
    const toastId = toast.loading("Updating offer status...");

    const result = await toggleOfferStatusReq(offerId);
    if (result.success) {
      router.refresh();
      toast.success(result.message || "Offer status updated successfully!", {
        id: toastId,
      });
      return;
    }

    toast.error(result.message || "Offer status update failed", {
      id: toastId,
    });
    console.log(result);
  };

  const deleteOffer = async () => {
    const toastId = toast.loading("Deleting offer...");

    const result = await deleteOfferReq(deleteId);
    if (result.success) {
      router.refresh();
      toast.success(result.message || "Offer deleted successfully!", {
        id: toastId,
      });
      setDeleteId("");
      return;
    }

    toast.error(result.message || "Offer deletion failed", {
      id: toastId,
    });
    console.log(result);
  };

  const title_lowercase = title.toLowerCase();

  return (
    <div className="min-h-screen p-6 md:p-10" style={{ background: BG }}>
      <div className="max-w-[1100px] mx-auto space-y-12">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-extrabold" style={{ color: PRIMARY }}>
              {t(title_lowercase)} {t("offers")}
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              {t("boost_sales_special_discounts")}
            </p>
          </div>

          <Link href="/vendor/create-offer">
            <Button
              className="text-white flex items-center gap-2"
              style={{ background: PRIMARY }}
            >
              <Plus size={18} /> {t("create_offer")}
            </Button>
          </Link>
        </div>

        <AllFilters sortOptions={sortOptions} />

        {/* OFFER LIST */}
        <div className="space-y-6 pt-4">
          {offersResult?.data?.map((offer, idx) => (
            <motion.div
              key={offer?._id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
            >
              <Card
                className="rounded-3xl bg-white border shadow-md hover:shadow-xl transition-all"
                style={{ boxShadow: SHADOW }}
              >
                <CardContent className="px-6 py-3">
                  <div className="flex flex-col md:flex-row justify-between gap-6">
                    {/* LEFT */}
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-pink-100 flex items-center justify-center text-pink-600">
                        {offer.offerType === "PERCENT" && <Percent size={28} />}
                        {offer.offerType === "BOGO" && <Tag size={28} />}
                        {offer.offerType === "FLAT" && <Flame size={28} />}
                      </div>

                      <div>
                        <h2 className="text-2xl font-bold text-gray-800">
                          {offer.title}
                        </h2>

                        <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                          <Badge variant="outline">
                            {t("code")}: {offer.code || "N/A"}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-2 mt-2 text-gray-600 text-sm">
                          <CalendarClock size={14} /> {t("valid_till")}:{" "}
                          {offer.expiresAt
                            ? format(offer.expiresAt, "dd MMM, yyyy")
                            : "N/A"}
                        </div>
                        {/* {offer.offerType === "BOGO" && (
                          <p className="text-sm text-gray-500 mt-1 mb-2">
                            {offer?.bogo?.productId?.name}
                          </p>
                        )} */}
                      </div>
                    </div>

                    {/* RIGHT */}
                    <div className="text-right md:min-w-[200px]">
                      <p className="text-sm text-gray-500">{t("total_used")}</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {offer.usageCount}
                      </p>
                      <div>
                        <Badge
                          className={
                            offer.isActive
                              ? "bg-[#DC3173] text-white"
                              : "bg-yellow-500 text-white"
                          }
                        >
                          {offer.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {offer.offerType === "PERCENT"
                          ? `${offer.discountValue}% Off`
                          : offer.offerType === "FLAT"
                            ? `€ ${offer.discountValue} Off`
                            : offer.offerType === "BOGO"
                              ? `Buy ${offer.bogo?.buyQty} Get ${offer.bogo?.getQty}`
                              : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-4 mt-4">
                    <Button
                      className={
                        offer.isActive
                          ? "bg-yellow-500 hover:bg-yellow-500/90"
                          : "bg-blue-500 hover:bg-blue-500/90"
                      }
                      size="sm"
                      onClick={() => toggleStatus(offer._id)}
                    >
                      {offer.isActive ? "Deactivate" : "Activate"}
                    </Button>
                    <Button
                      className="bg-[#DC3173] hover:bg-[#DC3173]/90"
                      size="sm"
                      onClick={() => setEditOffer(offer)}
                    >
                      {t("edit")}
                    </Button>
                    {!offer.isActive && (
                      <Button
                        onClick={() => setDeleteId(offer._id)}
                        variant="destructive"
                        size="sm"
                      >
                        {t("delete")}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {offersResult?.meta?.total === 0 && (
            <p className="text-center text-gray-500 py-10">
              {t("no_offers_found")}
            </p>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        <DeleteModal
          open={!!deleteId}
          onOpenChange={(open) => !open && setDeleteId("")}
          onConfirm={() => deleteOffer()}
        />

        {/* Edit Offer Modal */}
        {offersResult.data?.length > 0 && (
          <EditOffer
            open={!!editOffer}
            onOpenChange={(open) => !open && setEditOffer(null)}
            offer={editOffer || offersResult.data?.[0]}
          />
        )}

        {/* AI INSIGHTS */}
        {/* <Card className="rounded-3xl bg-white border shadow-md">
          <CardContent className="p-6 space-y-3">
            <div className="flex items-center gap-2">
              <Flame className="text-gray-800" />
              <h2 className="font-bold text-lg">AI Insights</h2>
            </div>

            <Separator />

            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
              <li>
                Juice B1G1 offer has the highest engagement — keep it active on
                weekends.
              </li>
              <li>Flat €3 OFF drives good conversion for lunch hours.</li>
              <li>
                Burger 20% OFF boosted sales by 18% — consider extending the
                offer.
              </li>
              <li>Offers ending soon should be promoted with a banner push.</li>
            </ul>

            <div className="pt-2">
              <Button className="text-white" style={{ background: PRIMARY }}>
                Create New Promo
              </Button>
            </div>
          </CardContent>
        </Card> */}
      </div>
    </div>
  );
}
