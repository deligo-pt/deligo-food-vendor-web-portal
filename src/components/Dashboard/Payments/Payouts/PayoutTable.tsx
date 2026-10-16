"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import {
  MobileRowCard,
  MobileRowCards,
  MobileRowEmpty,
  TABLE_FROM,
} from "@/src/components/MobileRowCard/MobileRowCard";
import { TPayout } from "@/src/types/payout.type";
import { formatPrice } from "@/src/utils/formatPrice";
import { generatePaymentPDF } from "@/src/utils/pdf/generatePaymentPDF";
import { format } from "date-fns";
import { motion } from "framer-motion";
import {
  CalendarIcon,
  CheckCircleIcon,
  Cog,
  CreditCardIcon,
  EuroIcon,
  HashIcon,
  MoreVertical,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface IProps {
  payouts: TPayout[];
  t: (key: string) => string;
}

export default function PayoutTable({ payouts, t }: IProps) {
  const router = useRouter();

  const handleDownloadInvoice = (p: TPayout) => {
    if (p.status === "PAID") {
      generatePaymentPDF(p)
    } else {
      toast.error(`Your payment status is ${p.status}. You cannot able to download the invoice.`)
    }
  }

  const handlePayoutProof = (p: TPayout) => {
    if (p.status === "PAID") {
      window.open(p.payoutProof, "_blank")
    } else {
      toast.error(`Your payment status is ${p.status}. You don't have anything to show as proof.`)
    }
  }

  const rowMenu = (p: TPayout) => (
    <DropdownMenu>
      <DropdownMenuTrigger aria-label={t("actions")}>
        <MoreVertical className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={() =>
            router.push(`/vendor/payouts/${p.payoutId}`)
          }
        >
          {t("view")}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handlePayoutProof(p)}
        >
          {t("payout_proof")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleDownloadInvoice(p)}>
          {t("download")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white shadow-md rounded-2xl p-4 md:p-6 mb-2 overflow-x-auto"
    >
      {/* Phones and tablets: a card per payout (the table's cells never wrap). */}
      <MobileRowCards until="lg">
        {payouts?.length === 0 && (
          <MobileRowEmpty>{t("no_payouts_found")}</MobileRowEmpty>
        )}
        {payouts?.map((p) => (
          <MobileRowCard
            key={p._id}
            title={`€${formatPrice(p.amount)}`}
            subtitle={
              (p.sdrAmount ?? 0) > 0
                ? `${p.payoutId} · ${t("sdr_incl_deposit")} €${formatPrice(p.sdrAmount ?? 0)}`
                : p.payoutId
            }
            aside={rowMenu(p)}
            fields={[
              { label: t("method"), value: p.paymentMethod },
              { label: t("status"), value: p.status },
              { label: t("date"), value: format(p.createdAt, "do MMM yyyy") },
            ]}
          />
        ))}
      </MobileRowCards>

      <div className={TABLE_FROM.lg}>
      <Table className="max-w-full">
        <TableHeader>
          <TableRow>
            <TableHead>
              <div className="text-[#DC3173] flex gap-2 items-center">
                <HashIcon className="w-4" />
                {t("payout_id")}
              </div>
            </TableHead>
            <TableHead>
              <div className="text-[#DC3173] flex gap-2 items-center">
                <CreditCardIcon className="w-4" />
                {t("method")}
              </div>
            </TableHead>
            <TableHead>
              <div className="text-[#DC3173] flex gap-2 items-center">
                <EuroIcon className="w-4" />
                {t("amount")}
              </div>
            </TableHead>
            <TableHead>
              <div className="text-[#DC3173] flex gap-2 items-center">
                <CheckCircleIcon className="w-4" />
                {t("status")}
              </div>
            </TableHead>
            <TableHead>
              <div className="text-[#DC3173] flex gap-2 items-center">
                <CalendarIcon className="w-4" />
                {t("date")}
              </div>
            </TableHead>
            <TableHead className="text-right">
              <div className="text-[#DC3173] flex gap-2 items-center justify-end">
                <Cog className="w-4" />
                {t("actions")}
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payouts?.length === 0 && (
            <TableRow>
              <TableCell
                className="text-[#DC3173] text-lg text-center"
                colSpan={6}
              >
                {t("no_payouts_found")}
              </TableCell>
            </TableRow>
          )}
          {payouts?.map((p) => (
            <TableRow key={p._id}>
              <TableCell>{p.payoutId}</TableCell>
              <TableCell className="whitespace-normal wrap-anywhere min-w-[8rem]">{p.paymentMethod}</TableCell>
              <TableCell>
                €{formatPrice(p.amount)}
                {/* The SDR container deposit paid out with this payout. */}
                {(p.sdrAmount ?? 0) > 0 && (
                  <span className="block text-xs text-sky-700">
                    {t("sdr_incl_deposit")} €{formatPrice(p.sdrAmount ?? 0)}
                  </span>
                )}
              </TableCell>
              <TableCell>{p.status}</TableCell>
              <TableCell>{format(p.createdAt, "do MMM yyyy")}</TableCell>
              <TableCell className="text-right">
                {rowMenu(p)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </div>
    </motion.div>
  );
}
