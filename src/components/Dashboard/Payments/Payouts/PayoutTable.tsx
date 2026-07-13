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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white shadow-md rounded-2xl p-4 md:p-6 mb-2 overflow-x-auto"
    >
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
            <TableHead className="text-right text-[#DC3173] flex gap-2 items-center justify-end">
              <Cog className="w-4" />
              {t("actions")}
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
              <TableCell>{p.paymentMethod}</TableCell>
              <TableCell>€{formatPrice(p.amount)}</TableCell>
              <TableCell>{p.status}</TableCell>
              <TableCell>{format(p.createdAt, "do MMM yyyy")}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger>
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </motion.div>
  );
}
