
import { TVendor } from "@/src/types/vendor.type";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

export const BranchSection = ({
    title,
    icon,
    children,
    defaultOpen = false,
}: {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    defaultOpen?: boolean;
}) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <motion.div
            initial={{
                opacity: 0,
                y: 20,
            }}
            animate={{
                opacity: 1,
                y: 0,
            }}
            transition={{
                duration: 0.3,
            }}
            className="mb-4 bg-white rounded-lg shadow-sm overflow-hidden"
        >
            <div
                className="p-4 flex items-center justify-between cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center space-x-2 text-gray-700">
                    <div className="text-[#DC3173]">{icon}</div>
                    <h3 className="font-medium">{title}</h3>
                </div>
                <div>
                    {isOpen ? (
                        <ChevronUp className="text-gray-500 w-5 h-5" />
                    ) : (
                        <ChevronDown className="text-gray-500 w-5 h-5" />
                    )}
                </div>
            </div>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{
                            height: 0,
                            opacity: 0,
                        }}
                        animate={{
                            height: "auto",
                            opacity: 1,
                        }}
                        exit={{
                            height: 0,
                            opacity: 0,
                        }}
                        transition={{
                            duration: 0.3,
                        }}
                        className="px-4 pb-4"
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export const InfoRow = ({
    label,
    value,
}: {
    label: string;
    value: string | number | React.ReactNode;
}) => {
    return (
        <div className="grid grid-cols-2 gap-4 mb-2">
            <div className="text-gray-500 text-sm">{label}</div>
            <div className="text-gray-800 text-sm font-medium">{value}</div>
        </div>
    );
}

export const BranchStatusBadge = ({
    status,
}: {
    status: TVendor["status"];
}) => {
    const statusStyles = {
        PENDING: "bg-yellow-100 text-yellow-800",
        APPROVED: "bg-green-100 text-green-800",
        REJECTED: "bg-red-100 text-red-800",
        BLOCKED: "bg-gray-100 text-gray-800",
        SUBMITTED: "bg-blue-100 text-blue-800",
    };
    return (
        <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[status]}`}
        >
            {status}
        </span>
    );
}

