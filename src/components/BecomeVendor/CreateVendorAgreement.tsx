"use client";

import { motion } from "framer-motion";
import { ArrowLeftCircle, Briefcase, FileText, Save, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { useTranslation } from "@/src/hooks/use-translation";
import { TVendor } from "@/src/types/vendor.type";
import { TVendorAgreementForm, vendorAgreementSchema } from "@/src/validations/become-vendor/agreement.validation";
import { createAgreement } from "@/src/services/becomeVendor/become-vendor";


interface IProps {
    vendor: TVendor;
}

export default function CreateVendorAgreement({ vendor }: IProps) {
    const { t } = useTranslation();
    const router = useRouter();

    const form = useForm<TVendorAgreementForm>({
        resolver: zodResolver(vendorAgreementSchema),
        defaultValues: {
            signatoryType: "SELF",
            partyRepresentativeName: "",
            partyRepresentativeRole: "",
        },
    });

    const { formState: { isSubmitting } } = form;

    // Watch signatoryType to trigger conditional dynamic form fields
    const signatoryType = form.watch("signatoryType");

    const onSubmit = async (data: TVendorAgreementForm) => {
        const toastId = toast.loading("Creating vendor agreement...");

        const payload = {
            agreementType: "INITIAL_VENDOR_AGREEMENT",
            signatoryType: data.signatoryType,
            ...(data.signatoryType === "AUTHORIZED_REPRESENTATIVE" && {
                partyRepresentativeName: data.partyRepresentativeName,
                partyRepresentativeRole: data.partyRepresentativeRole,
            }),
        };

        const vendorId = vendor?.userId;
        const result = await createAgreement(vendorId, payload);

        if (result?.success) {
            toast.success(result?.message || "Agreement created successfully!", {
                id: toastId,
            });

            router.push(`/become-vendor/agreement-sign?agreementId=${encodeURIComponent(result?.data?._id)}`);
            return;
        }

        if (result?.data?.errorSources) {
            result?.data?.errorSources?.forEach((err: { path: string; message: string }) => (
                toast.error(err?.message, { id: toastId })
            ));
        } else {
            toast.error(result?.message || "Failed to create agreement", {
                id: toastId,
            });
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="min-h-screen bg-linear-to-b from-white via-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8"
        >
            <div className="max-w-3xl mx-auto">
                <Card className="rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
                    <div className="relative p-0">
                        <Button
                            onClick={() => router.back()}
                            variant="link"
                            className="inline-flex items-center px-4 text-sm gap-2 text-[#DC3173] p-0 h-4 absolute -top-2 z-10 cursor-pointer"
                        >
                            <ArrowLeftCircle className="w-4 h-4" /> {t("goBack")}
                        </Button>
                    </div>

                    <CardHeader className="bg-linear-to-r from-[#DC3173] to-pink-600 text-white p-6">
                        <div className="flex items-center gap-4">
                            <div className="rounded-xl bg-white/25 p-3 shadow-md">
                                <FileText className="w-7 h-7 text-white" />
                            </div>
                            <CardTitle className="text-xl font-semibold tracking-wide">
                                {t("create_vendor_agreement")}
                            </CardTitle>
                        </div>
                        <p className="mt-3 text-sm text-white/90 max-w-xl leading-relaxed">
                            {t("select_your_signatory_type")}
                        </p>
                    </CardHeader>

                    <CardContent className="p-6 sm:p-8 bg-white">
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-6"
                            >
                                <div className="grid grid-cols-1 gap-6">
                                    {/* Signatory Type - Dropdown */}
                                    <FormField
                                        control={form.control}
                                        name="signatoryType"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                                    <User className="w-4 h-4 text-[#DC3173]" />
                                                    {t("signatoryType")}
                                                </FormLabel>
                                                <FormControl>
                                                    <Select
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}
                                                    >
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder={t("selectSignatoryType")} />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="SELF">
                                                                {t("self")}
                                                            </SelectItem>
                                                            <SelectItem value="AUTHORIZED_REPRESENTATIVE">
                                                                {t("authorized_representative")}
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Dynamic Render: Displayed only when AUTHORIZED_REPRESENTATIVE is selected */}
                                    {signatoryType === "AUTHORIZED_REPRESENTATIVE" && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-100"
                                        >
                                            <FormField
                                                control={form.control}
                                                name="partyRepresentativeName"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                                            <User className="w-4 h-4 text-[#DC3173]" />
                                                            {t("partyRepresentativeName")}
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder={t("partyRepresentativeNamePH")}
                                                                className="mt-2 w-full"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="partyRepresentativeRole"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                                            <Briefcase className="w-4 h-4 text-[#DC3173]" />
                                                            {t("partyRepresentativeRole")}
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder={t("partyRepresentativeRolePH")}
                                                                className="mt-2 w-full"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </motion.div>
                                    )}
                                </div>

                                <div className="pt-4">
                                    <motion.button
                                        type="submit"
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        disabled={isSubmitting}
                                        className="w-full sm:w-auto inline-flex items-center gap-3 justify-center px-8 py-3 bg-[#DC3173] hover:bg-[#b72a63] text-white rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-60 cursor-pointer"
                                    >
                                        <Save className="w-5 h-5" />
                                        <span className="font-semibold tracking-wide">
                                            {t("saveContinue")}
                                        </span>
                                    </motion.button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </motion.div>
    );
}