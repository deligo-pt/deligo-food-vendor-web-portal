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
import { TTransaction } from "@/src/types/transaction.type";
import {
  TONE_STYLES,
  transactionAmountText,
  transactionTone,
  transactionTypeLabel,
} from "@/src/utils/transaction";
import { format } from "date-fns";
import { motion } from "framer-motion";
import {
  CalendarIcon,
  EyeIcon,
  Cog,
  EuroIcon,
  HashIcon,
  InfoIcon,
  MoreVertical,
  ShapesIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface IProps {
  transactions: TTransaction[];
  t: (key: string) => string;
}

export default function TransactionTable({ transactions, t }: IProps) {
  const router = useRouter();
  const open = (p: TTransaction) =>
    router.push(`/vendor/transactions/${encodeURIComponent(p.transactionId)}`);

  const typeBadge = (p: TTransaction) => (
    <span
      className={`inline-block whitespace-nowrap text-xs font-semibold px-2.5 py-1 rounded-full ${TONE_STYLES[transactionTone(p)].badge}`}
    >
      {transactionTypeLabel(p.type, t)}
    </span>
  );
  const amount = (p: TTransaction) => (
    <span className={`whitespace-nowrap font-semibold ${TONE_STYLES[transactionTone(p)].amount}`}>
      {transactionAmountText(p)}
    </span>
  );

  const rowMenu = (p: TTransaction) => (
    <DropdownMenu>
      <DropdownMenuTrigger aria-label={t("actions")}>
        <MoreVertical className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => open(p)}>
          {t("view")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white shadow-md rounded-2xl p-4 md:p-6 mb-2 overflow-x-auto print:border border-[#DC3173]/30"
    >
      {/* Phones and tablets: a card per transaction (the table's cells never wrap). */}
      <MobileRowCards until="xl">
        {transactions?.length === 0 && (
          <MobileRowEmpty>{t("no_transactions_found")}</MobileRowEmpty>
        )}
        {transactions?.map((p) => (
          <MobileRowCard
            key={p._id}
            title={p.description}
            subtitle={p.transactionId}
            aside={rowMenu(p)}
            fields={[
              { label: t("type"), value: typeBadge(p) },
              { label: t("amount"), value: amount(p) },
              { label: t("date"), value: format(p.createdAt, "do MMM yyyy") },
            ]}
            actions={
              <Button
                onClick={() => open(p)}
                size="sm"
                className="bg-[#DC3173] flex items-center gap-2 hover:bg-[#DC3173]/90"
              >
                <EyeIcon className="w-4 h-4" />
                {t("view")}
              </Button>
            }
          />
        ))}
      </MobileRowCards>

      <div className={TABLE_FROM.xl}>
      <Table className="max-w-full">
        <TableHeader>
          <TableRow>
            <TableHead>
              <div className="text-[#DC3173] flex gap-2 items-center">
                <HashIcon className="w-4" />
                {t("transaction_id")}
              </div>
            </TableHead>
            <TableHead>
              <div className="text-[#DC3173] flex gap-2 items-center">
                <InfoIcon className="w-4" />
                {t("description")}
              </div>
            </TableHead>
            <TableHead>
              <div className="text-[#DC3173] flex gap-2 items-center">
                <ShapesIcon className="w-4" />
                {t("type")}
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
                <CalendarIcon className="w-4" />
                {t("date")}
              </div>
            </TableHead>
            <TableHead className="text-right print:hidden">
              <div className="text-[#DC3173] flex gap-2 items-center justify-end">
                <Cog className="w-4" />
                {t("actions")}
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions?.length === 0 && (
            <TableRow>
              <TableCell
                className="text-[#DC3173] text-lg text-center"
                colSpan={6}
              >
                {t("no_transactions_found")}
              </TableCell>
            </TableRow>
          )}
          {transactions?.map((p) => (
            <TableRow
              key={p._id}
              onClick={() => open(p)}
              className="cursor-pointer hover:bg-[#DC3173]/5"
            >
              <TableCell className="font-mono text-xs">{p.transactionId}</TableCell>
              <TableCell className="whitespace-normal wrap-anywhere min-w-[12rem]">{p.description}</TableCell>
              <TableCell>{typeBadge(p)}</TableCell>
              <TableCell>{amount(p)}</TableCell>
              <TableCell>{format(p.createdAt, "do MMM yyyy")}</TableCell>
              <TableCell
                className="text-right print:hidden"
                // The menu has its own click; the row's would open the page twice.
                onClick={(e) => e.stopPropagation()}
              >
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
