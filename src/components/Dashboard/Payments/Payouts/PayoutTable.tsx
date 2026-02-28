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

interface IProps {
  payouts: TPayout[];
}

export default function PayoutTable({ payouts }: IProps) {
  const router = useRouter();

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
                Payout ID
              </div>
            </TableHead>
            <TableHead>
              <div className="text-[#DC3173] flex gap-2 items-center">
                <CreditCardIcon className="w-4" />
                Method
              </div>
            </TableHead>
            <TableHead>
              <div className="text-[#DC3173] flex gap-2 items-center">
                <EuroIcon className="w-4" />
                Amount
              </div>
            </TableHead>
            <TableHead>
              <div className="text-[#DC3173] flex gap-2 items-center">
                <CheckCircleIcon className="w-4" />
                Status
              </div>
            </TableHead>
            <TableHead>
              <div className="text-[#DC3173] flex gap-2 items-center">
                <CalendarIcon className="w-4" />
                Date
              </div>
            </TableHead>
            <TableHead className="text-right text-[#DC3173] flex gap-2 items-center justify-end">
              <Cog className="w-4" />
              Actions
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
                No payouts found
              </TableCell>
            </TableRow>
          )}
          {payouts?.map((p) => (
            <TableRow key={p._id}>
              <TableCell>{p.payoutId}</TableCell>
              <TableCell>{p.paymentMethod}</TableCell>
              <TableCell>€{p.amount}</TableCell>
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
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => window.open(p.payoutProof, "_blank")}
                    >
                      Payout Proof
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
