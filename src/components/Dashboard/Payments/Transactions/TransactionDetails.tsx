"use client";

import TitleHeader from "@/src/components/TitleHeader/TitleHeader";
import { useTranslation } from "@/src/hooks/use-translation";
import { useStore } from "@/src/store/store";
import { TTransaction } from "@/src/types/transaction.type";
import {
  TONE_STYLES,
  customerName,
  euro,
  itemName,
  paymentMethodLabel,
  transactionAmountText,
  transactionStatusLabel,
  transactionTone,
  transactionTypeLabel,
} from "@/src/utils/transaction";
import { format } from "date-fns";
import { motion, Variants } from "framer-motion";
import {
  ArrowDownLeftIcon,
  ArrowLeftIcon,
  ArrowUpRightIcon,
  CheckCircle2Icon,
  ClockIcon,
  ReceiptIcon,
  SearchXIcon,
  ShoppingBagIcon,
  TagIcon,
  UserIcon,
  WalletIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface IProps {
  /** `null` when no transaction has this id. */
  transaction: TTransaction | null;
  /** The other transactions on the same order. */
  related: TTransaction[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 90, damping: 18 } },
} as Variants;

function ToneIcon({ tone, className }: { tone: ReturnType<typeof transactionTone>; className: string }) {
  if (tone === "payout") return <WalletIcon className={className} />;
  if (tone === "deduction") return <ArrowDownLeftIcon className={className} />;
  return <ArrowUpRightIcon className={className} />;
}

export default function TransactionDetails({ transaction, related }: IProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const { lang } = useStore();

  const back = (
    <motion.div variants={itemVariants}>
      <button
        onClick={() => router.push("/vendor/transactions")}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors text-sm font-medium"
      >
        <ArrowLeftIcon className="w-4 h-4" />
        {t("tx_back")}
      </button>
    </motion.div>
  );

  if (!transaction) {
    return (
      <motion.div className="min-h-screen p-6 space-y-6" variants={containerVariants} initial="hidden" animate="visible">
        {back}
        <TitleHeader title={t("tx_transaction_details")} subtitle={t("tx_transaction_details_sub")} />
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8 flex flex-col items-center text-center gap-3"
        >
          <div className="w-16 h-16 rounded-2xl bg-[#DC3173]/10 flex items-center justify-center">
            <SearchXIcon className="w-8 h-8 text-[#DC3173]" />
          </div>
          <p className="text-xl font-bold text-gray-900">{t("tx_not_found")}</p>
          <p className="text-sm text-gray-500">{t("tx_not_found_body")}</p>
        </motion.div>
      </motion.div>
    );
  }

  const tone = transactionTone(transaction);
  const styles = TONE_STYLES[tone];
  const order = transaction.order ?? null;
  const orderId = transaction.orderId || order?.orderId;
  const isPickup = order?.fulfillmentType === "PICKUP";
  const settled = order?.payoutMetadata?.vendor?.isSettled === true;
  const method = paymentMethodLabel(order?.paymentMethod || transaction.paymentMethod, t);
  const name = customerName(transaction.customer);

  // Every deduction the backend applied, so the rows add up to "Your Earning".
  const orderTotal = transaction.orderGrandTotal ?? order?.payoutSummary?.grandTotal ?? 0;
  const commission = order?.payoutSummary?.deliGoCommission;
  const platformFee = transaction.platformFee ?? commission?.amount ?? 0;
  const serviceFee =
    (order?.orderCalculation?.serviceCharge ?? 0) + (order?.orderCalculation?.serviceChargeVatAmount ?? 0);
  const deliveryFee = order?.delivery?.totalDeliveryCharge ?? 0;
  const sdrDeposit = order?.payoutSummary?.sdr?.amount ?? order?.orderCalculation?.sdr?.total ?? 0;
  const yourEarning = transaction.vendorNetEarning ?? order?.payoutSummary?.vendor?.vendorNetPayout ?? 0;

  const breakdown: { label: string; value: string; negative?: boolean }[] = [
    { label: t("tx_order_total"), value: euro(orderTotal) },
    {
      label:
        typeof commission?.rate === "number"
          ? `${t("tx_platform_fee")} (${commission.rate}%)`
          : t("tx_platform_fee"),
      value: `−${euro(platformFee)}`,
      negative: true,
    },
    ...(serviceFee > 0 ? [{ label: t("tx_service_fee"), value: `−${euro(serviceFee)}`, negative: true }] : []),
    ...(deliveryFee > 0 ? [{ label: t("tx_delivery_fee"), value: `−${euro(deliveryFee)}`, negative: true }] : []),
    ...(sdrDeposit > 0 ? [{ label: t("tx_sdr_separate"), value: `−${euro(sdrDeposit)}`, negative: true }] : []),
  ];

  const orderRows = [
    { label: t("order_id"), value: orderId ? `#${orderId}` : "—", mono: true },
    { label: t("tx_order_total"), value: euro(orderTotal) },
    { label: t("tx_fulfilment"), value: isPickup ? t("tx_pickup") : t("tx_delivery") },
    ...(!isPickup && transaction.deliveryAddress && transaction.deliveryAddress !== "N/A"
      ? [{ label: t("delivery_address"), value: transaction.deliveryAddress }]
      : []),
  ];

  return (
    <motion.div className="min-h-screen p-6 space-y-6" variants={containerVariants} initial="hidden" animate="visible">
      {back}

      <TitleHeader title={t("tx_transaction_details")} subtitle={t("tx_transaction_details_sub")} />

      {/* Hero */}
      <motion.div variants={itemVariants} className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex min-w-0 items-center gap-5">
            <div className={`w-16 h-16 shrink-0 rounded-2xl flex items-center justify-center ${styles.iconBg}`}>
              <ToneIcon tone={tone} className={`w-8 h-8 ${styles.icon}`} />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${styles.badge}`}>
                  {transactionTypeLabel(transaction.type, t)}
                </span>
                <span className="text-gray-400 text-xs font-mono break-all">ID: {transaction.transactionId}</span>
              </div>
              <p className="text-xl font-bold text-gray-900 wrap-anywhere">{transaction.description}</p>
              <p className="text-gray-400 text-sm mt-0.5">{format(transaction.createdAt, "do MMM yyyy, h:mm a")}</p>
            </div>
          </div>
          <div className="md:text-right">
            <p className={`text-lg md:text-2xl font-bold ${styles.amount}`}>{transactionAmountText(transaction)}</p>
            {transaction.status && (
              <div className="flex items-center md:justify-end gap-1.5 mt-2">
                <CheckCircle2Icon className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-600 font-medium">
                  {transactionStatusLabel(transaction.status, t)}
                </span>
              </div>
            )}
            {order && (
              <div className="flex items-center md:justify-end gap-1.5 mt-1">
                {settled ? (
                  <CheckCircle2Icon className="w-4 h-4 text-green-500" />
                ) : (
                  <ClockIcon className="w-4 h-4 text-amber-500" />
                )}
                <span className={`text-sm font-medium ${settled ? "text-green-600" : "text-amber-600"}`}>
                  {settled ? t("tx_settled") : t("tx_not_settled")}
                </span>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Two-column */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h3 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
            <ShoppingBagIcon className="w-4 h-4 text-[#DC3173]" />
            {t("order_details")}
          </h3>
          <div className="space-y-3">
            {orderRows.map((item) => (
              <div
                key={item.label}
                className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:items-start sm:gap-4 py-2 border-b border-gray-50 last:border-0"
              >
                <span className="text-xs text-gray-400 uppercase tracking-wide font-semibold sm:max-w-[45%]">
                  {item.label}
                </span>
                <span
                  className={`min-w-0 text-sm text-gray-900 font-medium sm:text-right ${item.mono ? "font-mono break-all" : "wrap-anywhere"}`}
                >
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h3 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
            <UserIcon className="w-4 h-4 text-[#DC3173]" />
            {t("customer")}
          </h3>
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl mb-4">
            <div className="w-12 h-12 shrink-0 bg-[#DC3173]/10 rounded-full flex items-center justify-center">
              <UserIcon className="w-6 h-6 text-[#DC3173]" />
            </div>
            <p className="min-w-0 font-bold text-gray-900 wrap-anywhere">{name || "—"}</p>
          </div>
          {method && (
            <div className="flex justify-between items-center gap-4 py-2">
              <span className="text-xs text-gray-400 uppercase tracking-wide font-semibold">
                {t("payment_method")}
              </span>
              <span className="min-w-0 text-right text-sm text-gray-900 font-medium wrap-anywhere">{method}</span>
            </div>
          )}
        </motion.div>
      </div>

      {/* Items Ordered + earnings breakdown */}
      <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <h3 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
          <TagIcon className="w-4 h-4 text-[#DC3173]" />
          {t("items_ordered")}
        </h3>
        {(transaction.items?.length ?? 0) > 0 && (
          <div className="space-y-2 mb-4">
            {transaction.items?.map((item, i) => (
              <div key={i} className="flex items-center justify-between gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="w-6 h-6 shrink-0 bg-[#DC3173]/10 text-[#DC3173] rounded-lg flex items-center justify-center text-xs font-bold">
                    {item.qty}
                  </span>
                  <span className="min-w-0 text-sm font-medium text-gray-900 wrap-anywhere">
                    {itemName(item.name, lang)}
                  </span>
                </div>
                <span className="shrink-0 text-sm font-bold text-gray-900">{euro(item.price)}</span>
              </div>
            ))}
          </div>
        )}
        <div className="border-t border-gray-100 pt-4 space-y-2">
          {breakdown.map((row) => (
            <div key={row.label} className="flex justify-between gap-4 text-sm">
              <span className="text-gray-500">{row.label}</span>
              <span className={`shrink-0 font-medium ${row.negative ? "text-red-500" : "text-gray-900"}`}>
                {row.value}
              </span>
            </div>
          ))}
          <div className="flex justify-between text-sm font-bold border-t border-gray-100 pt-2 mt-2">
            <span className="text-[#DC3173]">{t("tx_your_earning")}</span>
            <span className="text-[#DC3173] text-base">+{euro(yourEarning)}</span>
          </div>
        </div>
      </motion.div>

      {/* Related Transactions */}
      <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <h3 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
          <ReceiptIcon className="w-4 h-4 text-[#DC3173]" />
          {t("tx_related")}
        </h3>
        {related.length === 0 ? (
          <p className="text-sm text-gray-500">{t("tx_no_related")}</p>
        ) : (
          <div className="space-y-3">
            {related.map((rel, i) => {
              const relTone = transactionTone(rel);
              const relStyles = TONE_STYLES[relTone];
              return (
                <motion.button
                  type="button"
                  key={rel._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.08 }}
                  onClick={() => router.push(`/vendor/transactions/${encodeURIComponent(rel.transactionId)}`)}
                  className="w-full text-left flex items-center justify-between gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className={`w-8 h-8 shrink-0 rounded-lg flex items-center justify-center ${relStyles.iconBg}`}>
                      <ToneIcon tone={relTone} className={`w-4 h-4 ${relStyles.icon}`} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 wrap-anywhere">{rel.description}</p>
                      <p className="text-xs text-gray-400 break-all">
                        {format(rel.createdAt, "do MMM yyyy")} · {rel.transactionId}
                      </p>
                    </div>
                  </div>
                  <span className={`shrink-0 font-bold text-sm ${relStyles.amount}`}>{transactionAmountText(rel)}</span>
                </motion.button>
              );
            })}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
