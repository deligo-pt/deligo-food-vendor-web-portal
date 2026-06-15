export const statusStyles: Record<string, string> = {
    ACTIVE: "bg-red-100 text-red-600",
    INVESTIGATING: "bg-blue-100 text-blue-600",
    RESOLVED: "bg-green-100 text-green-600",
    FALSE_ALARM: "bg-gray-100 text-gray-600",
};

export const issueStyles: Record<string, string> = {
    Accident: "bg-red-100 text-red-600",
    "Medical Emergency": "bg-orange-100 text-orange-600",
    Fire: "bg-yellow-100 text-yellow-700",
    Crime: "bg-purple-100 text-purple-600",
    "Natural Disaster": "bg-indigo-100 text-indigo-600",
    Other: "bg-gray-100 text-gray-600",
};

export const Badge = ({
    label,
    className,
}: {
    label: string;
    className: string;
}) => (
    <span
        className={`px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center ${className}`}
    >
        {label}
    </span>
);
