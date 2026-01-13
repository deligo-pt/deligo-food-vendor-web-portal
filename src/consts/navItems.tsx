import {
    Home,
    LayoutDashboard,
    ShoppingBag,
    Layers,
    EuroIcon,
    BarChart2,
    Star,
    Box,
    Gift,
    Users,
    FileText,
    Settings,
    MessageCircle,
    AlertCircle,
} from "lucide-react";

type TFunction = (key: string) => string;

export const getNavItems = (t: TFunction) => {
    return [
        {
            id: "home",
            title: t("home"),
            icon: <Home size={18} />,
            path: "/",
        },
        {
            id: "dashboard",
            title: t("dashboard"),
            icon: <LayoutDashboard size={18} />,
            path: "/vendor/dashboard",
        },
        {
            id: "orders",
            title: t("orders"),
            icon: <ShoppingBag size={18} />,
            items: [
                { name: t("new_orders"), path: "/vendor/new-orders" },
                { name: t("preparing"), path: "/vendor/preparing" },
                { name: t("ready_for_pickup"), path: "/vendor/ready-for-pickup" },
                { name: t("ongoing_deliveries"), path: "/vendor/ongoing-deliveries" },
                { name: t("completed"), path: "/vendor/completed" },
                { name: t("cancelled"), path: "/vendor/cancelled" },
            ],
        },
        {
            id: "menu",
            title: t("menu_items"),
            icon: <Layers size={18} />,
            items: [
                { name: t("all_items"), path: "/vendor/all-items" },
                { name: t("categories"), path: "/vendor/categories" },
                { name: t("add_new_item"), path: "/vendor/add-item" },
                { name: t("stock_management"), path: "/vendor/stock" },
                { name: t("add_ons"), path: "/vendor/addons" },
            ],
        },
        {
            id: "payments",
            title: t("payments_earnings"),
            icon: <EuroIcon size={18} />,
            items: [
                { name: t("payouts"), path: "/vendor/payouts" },
                { name: t("earnings_summary"), path: "/vendor/earnings" },
                { name: t("payment_settings"), path: "/vendor/payment-settings" },
                { name: t("transaction_history"), path: "/vendor/transactions" },
            ],
        },
        {
            id: "analytics",
            title: t("analytics_insights"),
            icon: <BarChart2 size={18} />,
            items: [
                { name: t("sales_analytics"), path: "/vendor/sales-analytics" },
                { name: t("customer_insights"), path: "/vendor/customer-insights" },
                { name: t("order_trends"), path: "/vendor/order-trends" },
                { name: t("top_performing_items"), path: "/vendor/top-items" },
            ],
        },
        {
            id: "reviews",
            title: t("reviews_ratings"),
            icon: <Star size={18} />,
            items: [
                { name: t("customer_reviews"), path: "/vendor/reviews" },
                { name: t("rating_summary"), path: "/vendor/rating-summary" },
            ],
        },
        {
            id: "inventory",
            title: t("inventory"),
            icon: <Box size={18} />,
            items: [
                { name: t("ingredients"), path: "/vendor/ingredients" },
                { name: t("stock_alerts"), path: "/vendor/stock-alerts" },
                { name: t("suppliers"), path: "/vendor/suppliers" },
            ],
        },
        {
            id: "offers",
            title: t("offers_coupons"),
            icon: <Gift size={18} />,
            items: [
                { name: t("all_offers"), path: "/vendor/offers" },
                { name: t("active_offers"), path: "/vendor/active-offers" },
                { name: t("inactive_offers"), path: "/vendor/inactive-offers" },
                { name: t("create_new_offer"), path: "/vendor/create-offer" },
                { name: t("coupon_analytics"), path: "/vendor/coupon-analytics" },
            ],
        },
        {
            id: "staff",
            title: t("staff_management"),
            icon: <Users size={18} />,
            items: [
                { name: t("all_staff"), path: "/vendor/all-staff" },
                { name: t("roles_permissions"), path: "/vendor/roles" },
                { name: t("add_new_staff"), path: "/vendor/add-staff" },
            ],
        },
        {
            id: "reports",
            title: t("reports"),
            icon: <FileText size={18} />,
            items: [
                { name: t("sales_report"), path: "/vendor/sales-report" },
                { name: t("tax_report"), path: "/vendor/tax-report" },
                { name: t("customer_report"), path: "/vendor/customer-report" },
            ],
        },
        {
            id: "settings",
            title: t("settings"),
            icon: <Settings size={18} />,
            items: [
                { name: t("business_info"), path: "/vendor/business-info" },
                { name: t("notifications"), path: "/vendor/notifications" },
                { name: t("change_password"), path: "/vendor/change-password" },
                { name: t("theme_branding"), path: "/vendor/theme" },
            ],
        },
        {
            id: "support",
            title: t("support_center"),
            icon: <MessageCircle size={18} />,
            items: [
                { name: t("chat_with_support"), path: "/vendor/chat-support" },
                { name: t("help_articles"), path: "/vendor/help" },
                { name: t("live_chat"), path: "/vendor/live-chat" },
                { name: t("report_an_issue"), path: "/vendor/report" },
            ],
        },
        {
            id: "sos",
            title: t("sos_emergency"),
            icon: <AlertCircle size={18} />,
            items: [
                { name: t("contact_support"), path: "/vendor/contact-support" },
                { name: t("safety_guidelines"), path: "/vendor/safety" },
            ],
        },
    ];
};
