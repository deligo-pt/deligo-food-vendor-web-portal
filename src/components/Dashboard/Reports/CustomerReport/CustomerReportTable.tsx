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
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import { TCustomer } from "@/src/types/customer.type";
import { format } from "date-fns";
import { motion } from "framer-motion";
import {
  CalendarIcon,
  CheckCheckIcon,
  ContactRoundIcon,
  EuroIcon,
  ShoppingBagIcon,
} from "lucide-react";

interface IProps {
  customers: TCustomer[];
}

export default function CustomerReportTable({ customers }: IProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white mb-2 overflow-x-auto"
    >
      <Table className="max-w-full">
        <TableHeader>
          <TableRow>
            <TableHead>
              <div className="text-[#DC3173] flex gap-2 items-center">
                <ContactRoundIcon className="w-4" />
                Customer
              </div>
            </TableHead>
            <TableHead>
              <div className="text-[#DC3173] flex gap-2 items-center">
                <ShoppingBagIcon className="w-4" />
                Orders
              </div>
            </TableHead>
            <TableHead>
              <div className="text-[#DC3173] flex gap-2 items-center">
                <EuroIcon className="w-4" />
                Total Spent
              </div>
            </TableHead>
            <TableHead>
              <div className="text-[#DC3173] flex gap-2 items-center">
                <CalendarIcon className="w-4" />
                Last Ordered
              </div>
            </TableHead>
            <TableHead>
              <div className="text-[#DC3173] flex gap-2 items-center">
                <CheckCheckIcon className="w-4" />
                Status
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers?.length === 0 && (
            <TableRow>
              <TableCell
                className="text-[#DC3173] text-lg text-center"
                colSpan={5}
              >
                No delivery partner found
              </TableCell>
            </TableRow>
          )}
          {customers?.map((c) => (
            <TableRow key={c._id}>
              <TableCell className="flex items-center gap-3">
                <div>
                  <Avatar>
                    <AvatarImage
                      src={c.profilePhoto}
                      alt={`${c.name?.firstName} ${c.name?.lastName}`}
                    />
                    <AvatarFallback>
                      {c.name?.firstName?.charAt(0)}
                      {c.name?.lastName?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div>
                  <h3 className="font-medium">
                    {c.name?.firstName} {c.name?.lastName}
                    {!c.name?.firstName && !c.name?.lastName && "N/A"}
                  </h3>
                  <p className="text-sm text-gray-700">{c.email}</p>
                </div>
              </TableCell>
              <TableCell>{c.orders?.totalOrders || 0}</TableCell>
              <TableCell>€{c.orders?.totalSpent || 0}</TableCell>
              <TableCell>
                {c.orders?.lastOrderDate
                  ? format(c.orders?.lastOrderDate, "do MMM yyyy")
                  : "N/A"}
              </TableCell>
              <TableCell>
                {c.status?.charAt(0)}
                {c.status?.slice(1)?.toLowerCase()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </motion.div>
  );
}
