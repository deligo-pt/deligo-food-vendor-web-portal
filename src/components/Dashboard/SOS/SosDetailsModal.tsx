'use client';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useTranslation } from "@/src/hooks/use-translation";
import { ISos } from "@/src/types/sos.type";
import { MapPin, User } from "lucide-react";
import { useState } from "react";

interface SosDetailsModalProps {
    open: boolean;
    onClose: () => void;
    sos: ISos | null;
}

export default function SosDetailsModal({
    open,
    onClose,
    sos,
}: SosDetailsModalProps) {
    const { t } = useTranslation();
    const [loadMap, setLoadMap] = useState(false);

    if (!sos) return null;

    const [lng, lat] = sos.location.coordinates;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-xl rounded-2xl">
                <DialogHeader>
                    <DialogTitle className="text-lg font-bold">
                        {t("alert_details")}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* WHO CREATED */}
                    <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl">
                        <User className="text-pink-600" />
                        <div>
                            <p className="text-xs text-gray-500">{t("triggered_by")}</p>
                            <p className="font-semibold">
                                {sos?.userId?.id?.name?.firstName} {" "} {sos?.userId?.id?.name?.lastName}
                            </p>
                        </div>
                    </div>

                    {/* LOCATION */}
                    <div>
                        <h4 className="text-xs text-gray-400 uppercase mb-2">
                            {t("location")}
                        </h4>

                        <div className="rounded-xl overflow-hidden border">
                            <div className="rounded-xl overflow-hidden border">
                                {!loadMap ? (
                                    <button
                                        onClick={() => setLoadMap(true)}
                                        className="w-full h-[220px] bg-gray-100 flex flex-col items-center justify-center text-gray-600 hover:bg-gray-200 transition"
                                    >
                                        <MapPin size={28} className="mb-2 text-pink-600" />
                                        <span className="font-medium">{t("load_map")}</span>
                                        <span className="text-xs">{t("click_to_view_location")}</span>
                                    </button>
                                ) : (
                                    <iframe
                                        width="100%"
                                        height="220"
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        src={`https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`}
                                    />
                                )}
                            </div>

                        </div>

                        <p className="mt-2 text-sm text-gray-600 flex items-center gap-2">
                            <MapPin size={14} />
                            {t("latitude")}: {lat}, {t("longitude")}: {lng}
                        </p>
                    </div>

                    {/* USER NOTE */}
                    {sos.userNote && (
                        <div>
                            <h4 className="text-xs text-gray-400 uppercase mb-2"> {t("incident_description")}
                            </h4>

                            <div className="border-l-4 border-red-500 bg-red-50 p-4 rounded-lg text-sm text-gray-700">
                                “{sos.userNote}”
                            </div>
                        </div>
                    )}

                    {/* FOOTER */}
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            onClick={onClose}
                            className="px-5 py-2 rounded-xl border font-medium hover:bg-gray-50"
                        >
                            {t("close")}
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
