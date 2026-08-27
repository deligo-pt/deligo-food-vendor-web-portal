"use client";

import { useTranslation } from "@/src/hooks/use-translation";
import { TVendor } from "@/src/types/vendor.type";
import { AnimatePresence, motion } from "framer-motion";
import {
    Banknote,
    BuildingIcon,
    CheckCircleIcon,
    ChevronLeftIcon,
    FileText,
    LocationEditIcon,
    UserIcon,
} from "lucide-react";
import { useState } from "react";
import PersonalDetails from "../../BecomeVendor/PersonalDetails";
import BusinessDetailsForm from "../../BecomeVendor/BusinessDetails";
import BusinessLocation from "../../BecomeVendor/BusinessLocation";
import BankDetails from "../../BecomeVendor/BankDetails";
import UploadDocuments from "../../BecomeVendor/UploadDocuments";
import { DocKey, FilePreview } from "@/src/types/documents.type";
import { TCuisine } from "@/src/types/cuisine.type";
import { TBusinessCategory } from "@/src/types/category.type";

interface IProps {
    branch: TVendor;
    cuisines: TCuisine[];
    businessCategories: TBusinessCategory[];
}

const EditBranch = ({ branch, cuisines, businessCategories }: IProps) => {
    const { t } = useTranslation();
    const [currentStep, setCurrentStep] = useState(0);
    const savedPreviews: Record<DocKey, FilePreview[] | null> = {} as Record<
        DocKey,
        FilePreview[] | null
    >;

    if (branch?.documents) {
        const docs = branch?.documents || {};
        (Object.keys(docs) as DocKey[]).forEach((key) => {
            const urls = docs[key];

            if (urls && Array.isArray(urls)) {
                savedPreviews[key] = urls.map((url) => ({
                    file: null,
                    url: url || "",
                    isImage: /\.(jpg|jpeg|png|gif|webp)$/i.test(url),
                }));
            }
        });
    }

    const formSteps = [
        {
            id: "personal",
            title: t("personalDetails"),
            icon: <UserIcon className="w-5 h-5" />,
        },
        {
            id: "business",
            title: t("businessDetails"),
            icon: <BuildingIcon className="w-5 h-5" />,
        },
        {
            id: "location",
            title: t("business_location"),
            icon: <LocationEditIcon className="w-5 h-5" />,
        },
        {
            id: "vehicle",
            title: t("bankDetails"),
            icon: <Banknote className="w-5 h-5" />,
        },
        {
            id: "documents",
            title: t("documents"),
            icon: <FileText className="w-5 h-5" />,
        },
    ];

    const handleNext = () => {
        if (currentStep < formSteps.length - 1) {
            setCurrentStep((prev) => prev + 1);
            window.scrollTo(0, 0);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep((prev) => prev - 1);
            window.scrollTo(0, 0);
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 0:
                return <PersonalDetails onNext={handleNext} vendor={branch} />;
            case 1:
                return <BusinessDetailsForm onNext={handleNext} businessCategories={businessCategories} cuisines={cuisines} vendor={branch} />;
            case 2:
                return <BusinessLocation onNext={handleNext} vendor={branch} />;
            case 3:
                return <BankDetails onNext={handleNext} vendor={branch} />;
            case 4:
                return <UploadDocuments savedPreviews={savedPreviews} vendor={branch} />;
            default:
                return null;
        }
    };

    return (
        <div className="w-full min-h-screen bg-linear-to-b from-white to-gray-50 px-4 md:px-6">
            <div className="">
                <motion.div
                    initial={{
                        opacity: 0,
                        y: -20,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    className="text-center mb-12"
                >
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                        {t("update")} <span className="text-[#DC3173]">{t("branch")}</span>{" "}
                        {t("details")}
                    </h1>
                    <p className="text-gray-600 text-lg">
                        {t("complete_the_form_below")}
                    </p>
                </motion.div>

                <div className="bg-white rounded-xl shadow-xl overflow-hidden mb-8">
                    {/* Progress Indicator */}
                    <div className="bg-[#DC3173]/10 px-6 py-4">
                        <div className="hidden xl:flex justify-between items-center">
                            {formSteps.map((step, index) => (
                                <div key={step.id} className="flex flex-col items-center">
                                    <div
                                        className={`flex items-center justify-center w-10 h-10 rounded-full ${index <= currentStep
                                            ? "bg-[#DC3173] text-white"
                                            : "bg-gray-200 text-gray-500"
                                            } transition-all duration-300`}
                                    >
                                        {index < currentStep ? (
                                            <CheckCircleIcon className="w-6 h-6" />
                                        ) : (
                                            step.icon
                                        )}
                                    </div>
                                    <span
                                        className={`text-sm mt-2 ${index <= currentStep
                                            ? "text-[#DC3173] font-medium"
                                            : "text-gray-500"
                                            }`}
                                    >
                                        {step.title}
                                    </span>
                                    {/* {index < formSteps.length - 1 && (
                    <div className="absolute h-0.5 bg-gray-200 w-[calc(100%/6-2rem)] left-[calc(50%+1rem)]">
                      <div
                        className="h-full bg-[#DC3173]"
                        style={{
                          width: index < currentStep ? "100%" : "0%",
                        }}
                      />
                    </div>
                  )} */}
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center xl:hidden">
                            <span className="text-[#DC3173] font-medium">
                                {t("step")} {currentStep + 1} {t("of")} {formSteps.length}:
                            </span>
                            <span className="ml-2 font-medium">
                                {formSteps[currentStep].title}
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 h-2 mt-4 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-[#DC3173]"
                                initial={{
                                    width: `${(currentStep / formSteps.length) * 100}%`,
                                }}
                                animate={{
                                    width: `${((currentStep + 1) / formSteps.length) * 100}%`,
                                }}
                                transition={{
                                    duration: 0.3,
                                }}
                            />
                        </div>
                    </div>
                    {/* Form Content */}
                    <div className="p-6 md:p-8">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentStep}
                                initial={{
                                    opacity: 0,
                                    x: 20,
                                }}
                                animate={{
                                    opacity: 1,
                                    x: 0,
                                }}
                                exit={{
                                    opacity: 0,
                                    x: -20,
                                }}
                                transition={{
                                    duration: 0.3,
                                }}
                            >
                                {renderStep()}
                            </motion.div>
                        </AnimatePresence>
                        {/* Navigation Buttons */}
                        <div className="flex justify-between mt-8">
                            <button
                                type="button"
                                onClick={handlePrevious}
                                disabled={currentStep === 0}
                                className={`flex items-center px-4 py-2 rounded-lg ${currentStep === 0
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    } transition-colors duration-200`}
                            >
                                <ChevronLeftIcon className="w-5 h-5 mr-1" />
                                {t("previous")}
                            </button>
                            <div className="flex-1" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default EditBranch;