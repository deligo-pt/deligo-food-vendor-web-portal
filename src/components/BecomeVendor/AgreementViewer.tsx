/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useRef, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import SignatureCanvas from "react-signature-canvas";
// import { signAgreementReq } from "@/services/agreement.service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

import { useTranslation } from "@/src/hooks/use-translation";
import { uploadImagesReq } from "@/src/services/upload/upload.service";
import { signAgreement, submitForApprovalReq } from "@/src/services/becomeVendor/become-vendor";
import { AnimatePresence, motion } from "framer-motion";
import { FileUploadZone } from "./FileUploadZone";

interface AgreementViewerProps {
    agreement: any;
    vendorId?: string;
}

type SignatureMethod = "DRAWN" | "UPLOADED";
type PosPaymentOption = "THREE_INSTALLMENTS" | "MONTHLY_RENTAL";

export default function AgreementViewer({ agreement, vendorId }: AgreementViewerProps) {
    const { t } = useTranslation();
    const router = useRouter();
    const [, startTransition] = useTransition();

    // modal open state (auto-opened when all files selected)
    const [showModal, setShowModal] = useState(false);

    const partySigRef = useRef<SignatureCanvas | null>(null);
    const signatureFileRef = useRef<HTMLInputElement | null>(null);
    const stampFileRef = useRef<HTMLInputElement | null>(null);

    const [isPartyEmpty, setIsPartyEmpty] = useState(true);
    const [partySignatureMethod, setPartySignatureMethod] =
        useState<SignatureMethod>("DRAWN");
    const [uploadedSignatureUrl, setUploadedSignatureUrl] = useState<string | null>(
        null
    );
    const [partyStamp, setPartyStamp] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isUploadingStamp, setIsUploadingStamp] = useState(false);

    const [posPaymentOption, setPosPaymentOption] =
        useState<PosPaymentOption | null>(null);

    const [signedPdfUrl, setSignedPdfUrl] = useState<string | null>(
        agreement?.signedPdfPath || null
    );
    const [isSubmitting, setIsSubmitting] = useState(false);

    const pdfUrl = signedPdfUrl || agreement?.signedPdfPath || agreement?.draftPdfPath || "";

    const handleClearParty = () => {
        partySigRef.current?.clear();
        setIsPartyEmpty(true);
    };

    const handlePartyEnd = () => {
        setIsPartyEmpty(!!partySigRef.current?.isEmpty());
    };

    const handleSignatureMethodChange = (method: SignatureMethod) => {
        setPartySignatureMethod(method);
        setUploadedSignatureUrl(null);
        setIsPartyEmpty(true);
        if (partySigRef.current) {
            partySigRef.current.clear();
        }
        if (signatureFileRef.current) {
            signatureFileRef.current.value = "";
        }
    };

    const handleFileUpload = async (
        e: React.ChangeEvent<HTMLInputElement>,
        type: "signature" | "stamp"
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please upload an image file (PNG, JPG, etc.)");
            return;
        }

        const toastId = toast.loading(
            type === "signature" ? "Uploading signature..." : "Uploading stamp..."
        );

        if (type === "signature") setIsUploading(true);
        else setIsUploadingStamp(true);

        try {
            const uploadResult = await uploadImagesReq([file]);

            if (uploadResult.success && uploadResult.data?.[0]) {
                if (type === "signature") {
                    setUploadedSignatureUrl(uploadResult.data[0]);
                    setIsPartyEmpty(false);
                } else {
                    setPartyStamp(uploadResult.data[0]);
                }
                toast.success(
                    type === "signature"
                        ? "Signature uploaded successfully!"
                        : "Stamp uploaded successfully!",
                    { id: toastId }
                );
            } else {
                toast.error(uploadResult.message || "Upload failed", { id: toastId });
            }
        } catch (error: any) {
            console.error("Upload error:", error);
            toast.error(error?.message || "Failed to upload", { id: toastId });
        } finally {
            if (type === "signature") setIsUploading(false);
            else setIsUploadingStamp(false);
        }
    };

    const clearStamp = () => {
        setPartyStamp(null);
        if (stampFileRef.current) {
            stampFileRef.current.value = "";
        }
    };

    const handleSubmit = async () => {
        const toastId = toast.loading("Submitting your signature...");
        setIsSubmitting(true);

        if (partySignatureMethod === "DRAWN") {
            if (!partySigRef.current || partySigRef.current.isEmpty()) {
                toast.error("Please draw the signature first.", {
                    id: toastId,
                });
                setIsSubmitting(false);
                return;
            }
        } else {
            if (!uploadedSignatureUrl) {
                toast.error("Please upload the signature first.", {
                    id: toastId,
                });
                setIsSubmitting(false);
                return;
            }
        }

        if (!posPaymentOption) {
            toast.error("Please select a payment option.", { id: toastId });
            setIsSubmitting(false);
            return;
        }

        let partySignature: string;

        if (partySignatureMethod === "DRAWN") {
            partySignature = partySigRef.current!
                .getTrimmedCanvas()
                .toDataURL("image/png");
        } else {
            partySignature = uploadedSignatureUrl!;
        }

        const payload: any = {
            partySignatureMethod,
            partySignature,
            posPaymentOption,
        };

        // Only include stamp if uploaded (optional)
        if (partyStamp) {
            payload.partyStamp = partyStamp;
        }

        try {
            const res = await signAgreement(agreement?._id, payload);

            if (res?.success) {
                toast.success(res?.message || "Agreement signed successfully!", {
                    id: toastId,
                });
                setSignedPdfUrl(res?.data?.signedPdfPath);
                startTransition(() => {
                    router.refresh();
                });
                return;
            }

            if (res?.data?.errorSources) {
                res?.data?.errorSources?.map((err: { path: string, message: string }) => (
                    toast.error(err?.message, { id: toastId })
                ));
                setIsSubmitting(false);
                return;
            } else {
                toast.error(res.message || "Failed to sign the agreement. Please try again.", {
                    id: toastId,
                });
            }

        } catch (error: any) {
            console.error("Sign Agreement Error:", error);
            toast.error(
                error?.message || "An error occurred while signing. Please try again.",
                { id: toastId }
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleContinue = async () => {
        const toastId = toast.loading("Submitting...");
        setIsSubmitting(true);

        const result = await submitForApprovalReq(vendorId as string);

        if (result.success) {
            toast.success("Request submitted successfully!", {
                id: toastId,
            });
            setIsSubmitting(false);
            setShowModal(true);
            return;
        }

        toast.error(result.message || "Request submission failed", {
            id: toastId,
        });
        console.log(result);
        setIsSubmitting(false);
    };

    const isSubmitDisabled =
        isPartyEmpty ||
        !posPaymentOption ||
        isSubmitting ||
        isUploading ||
        isUploadingStamp;

    return (
        <div className="w-full max-w-4xl mx-auto p-4">
            <div className="space-y-4">
                <Card className="overflow-hidden border-none shadow-inner bg-slate-200 min-h-175 flex flex-col">
                    {/* PDF Viewer */}
                    <div className="grow relative">
                        <iframe
                            src={`${pdfUrl}`}
                            className="w-full h-full min-h-175 border-none"
                            title={t("agreement_pdf")}
                        />
                    </div>

                    {agreement?.signedPdfPath ? (
                        <div className="bg-slate-100 flex flex-col items-center gap-4 p-4">
                            <Button
                                onClick={handleContinue}
                                disabled={isSubmitDisabled}
                                className="bg-[#DC3173] hover:bg-[#c22b65] text-white px-12 py-7 text-md font-bold rounded-lg shadow-lg flex items-center gap-2 transition-transform active:scale-95"
                            >
                                <CheckCircle2 className="w-5 h-5" />
                                {t("completed_continue")}
                            </Button>
                        </div>
                    ) : (
                        <div className="bg-white p-6 border-t border-slate-200 space-y-6">
                            {/* Signature Method */}
                            <div className="space-y-2">
                                <Label className="text-sm font-bold text-slate-700">
                                    {t("signature_method")} <span className="text-[#DC3173]">*</span>
                                </Label>
                                <Select
                                    value={partySignatureMethod}
                                    onValueChange={(value) =>
                                        handleSignatureMethodChange(value as SignatureMethod)
                                    }
                                >
                                    <SelectTrigger className="w-full md:w-64">
                                        <SelectValue placeholder={t("select_method")} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="DRAWN">{t("draw_signature")}</SelectItem>
                                        <SelectItem value="UPLOADED">{t("upload_signature")}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Signature Area */}
                            <div className="space-y-2">
                                <Label className="text-sm font-bold text-slate-700">
                                    {t("party_signature")} <span className="text-[#DC3173]">*</span>
                                </Label>

                                {partySignatureMethod === "DRAWN" ? (
                                    <>
                                        <div className="border rounded-md bg-gray-50 relative">
                                            <SignatureCanvas
                                                ref={partySigRef}
                                                penColor="black"
                                                canvasProps={{
                                                    className: "w-full h-32",
                                                }}
                                                onEnd={handlePartyEnd}
                                            />
                                        </div>
                                        <div className="flex justify-end">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={handleClearParty}
                                                className="text-xs text-gray-500 hover:text-red-500"
                                            >
                                                {t("clear_signature")}
                                            </Button>
                                        </div>
                                    </>
                                ) : (
                                    <FileUploadZone
                                        inputRef={signatureFileRef}
                                        onChange={(e) => handleFileUpload(e, "signature")}
                                        isLoading={isUploading}
                                        previewUrl={uploadedSignatureUrl}
                                        onClear={() => {
                                            setUploadedSignatureUrl(null);
                                            setIsPartyEmpty(true);
                                            if (signatureFileRef.current) {
                                                signatureFileRef.current.value = "";
                                            }
                                        }}
                                        label={t("upload_signature")}
                                    />
                                )}
                            </div>

                            {/* Party Stamp (Optional) */}
                            <FileUploadZone
                                inputRef={stampFileRef}
                                onChange={(e) => handleFileUpload(e, "stamp")}
                                isLoading={isUploadingStamp}
                                previewUrl={partyStamp}
                                onClear={clearStamp}
                                label={t("party_stamp")}
                                optional
                            />

                            {/* Payment Option */}
                            <div className="space-y-3">
                                <Label className="text-sm font-bold text-slate-700">
                                    {t("payment_option")} <span className="text-[#DC3173]">*</span>
                                </Label>
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="three-installments"
                                            checked={posPaymentOption === "THREE_INSTALLMENTS"}
                                            onCheckedChange={(checked) => {
                                                setPosPaymentOption(
                                                    checked ? "THREE_INSTALLMENTS" : null
                                                );
                                            }}
                                        />
                                        <Label
                                            htmlFor="three-installments"
                                            className="text-sm font-normal cursor-pointer"
                                        >
                                            {t("three_installment_of_each")}
                                        </Label>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="monthly-rental"
                                            checked={posPaymentOption === "MONTHLY_RENTAL"}
                                            onCheckedChange={(checked) => {
                                                setPosPaymentOption(checked ? "MONTHLY_RENTAL" : null);
                                            }}
                                        />
                                        <Label
                                            htmlFor="monthly-rental"
                                            className="text-sm font-normal cursor-pointer"
                                        >
                                            {t("monthly_machine_rental_cost")}
                                        </Label>
                                    </div>
                                </div>
                            </div>

                            {/* Submit */}
                            <div className="w-full border-t border-slate-100 pt-4 flex flex-col items-center">
                                <Button
                                    onClick={handleSubmit}
                                    disabled={isSubmitDisabled}
                                    className="bg-[#DC3173] hover:bg-[#c22b65] text-white px-8 py-5 font-bold"
                                >
                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                    {isSubmitting ? t("submitting") : t("submit_agreement")}
                                </Button>

                                <p className="text-[10px] text-slate-400 text-center max-w-md mx-auto leading-normal mt-4">
                                    {t("by_clicking_submit_agreement_you_legally")}
                                </p>
                            </div>
                        </div>
                    )}
                </Card>
            </div>

            {/* Full-screen success modal + confetti */}
            <AnimatePresence>
                {showModal && (
                    <>
                        {/* dim layer */}
                        <motion.div
                            key="backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.55 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="fixed inset-0 bg-black z-40"
                        />
                        <motion.div
                            key="modal"
                            initial={{ opacity: 0, scale: 0.95, y: 12 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.35 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        >
                            <div className="max-w-lg w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
                                <div className="flex items-center justify-center mb-4">
                                    <div className="rounded-full bg-[#DC3173]/10 p-4">
                                        <CheckCircle2 className="w-12 h-12 text-[#DC3173]" />
                                    </div>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {t("registrationComplete")}
                                </h2>
                                <p className="mt-3 text-sm text-gray-600">
                                    {t("registrationCompleteDesc")}
                                </p>

                                <div className="mt-6 flex items-center justify-center gap-3">
                                    <Button
                                        onClick={() =>
                                            router.push("/become-vendor/registration-status")
                                        }
                                        className="bg-[#DC3173] hover:bg-[#b72a63] text-white px-6 py-3 rounded-xl shadow-lg"
                                    >
                                        {t("seeRegistrationStatus")}
                                    </Button>

                                    <button
                                        onClick={() => {
                                            setShowModal(false);
                                            router.push("/");
                                        }}
                                        className="px-4 py-3 rounded-xl border border-gray-200 text-sm"
                                    >
                                        {t("goHome")}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}