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
import {
  MobileRowCard,
  MobileRowCards,
  MobileRowEmpty,
  TABLE_FROM,
} from "@/src/components/MobileRowCard/MobileRowCard";
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
  t: (key: string) => string;
}

export default function CustomerReportTable({ customers, t }: IProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white mb-2 overflow-x-auto"
    >
      {/* Phones and tablets: a card per customer (the table's cells never wrap). */}
      <MobileRowCards until="lg">
        {customers?.length === 0 && (
          <MobileRowEmpty>{t("no_customer_found")}</MobileRowEmpty>
        )}
        {customers?.map((c) => (
          <MobileRowCard
            key={c._id}
            leading={
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
            }
            title={
              c.name?.firstName || c.name?.lastName
                ? `${c.name?.firstName || ""} ${c.name?.lastName || ""}`
                : "N/A"
            }
            subtitle={c.email}
            fields={[
              { label: t("orders"), value: c.orders?.totalOrders || 0 },
              { label: t("total_spent"), value: `${c.orders?.totalSpent || 0}\u00A0€` },
              {
                label: t("last_ordered"),
                value: c.orders?.lastOrderDate
                  ? format(c.orders?.lastOrderDate, "do MMM yyyy")
                  : "N/A",
              },
              {
                label: t("status"),
                value: `${c.status?.charAt(0) ?? ""}${c.status?.slice(1)?.toLowerCase() ?? ""}`,
              },
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
                <ContactRoundIcon className="w-4" />
                {t("customer")}
              </div>
            </TableHead>
            <TableHead>
              <div className="text-[#DC3173] flex gap-2 items-center">
                <ShoppingBagIcon className="w-4" />
                {t("orders")}
              </div>
            </TableHead>
            <TableHead>
              <div className="text-[#DC3173] flex gap-2 items-center">
                <EuroIcon className="w-4" />
                {t("total_spent")}
              </div>
            </TableHead>
            <TableHead>
              <div className="text-[#DC3173] flex gap-2 items-center">
                <CalendarIcon className="w-4" />
                {t("last_ordered")}
              </div>
            </TableHead>
            <TableHead>
              <div className="text-[#DC3173] flex gap-2 items-center">
                <CheckCheckIcon className="w-4" />
                {t("status")}
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
                {t("no_customer_found")}
              </TableCell>
            </TableRow>
          )}
          {customers?.map((c) => (
            <TableRow key={c._id}>
              <TableCell className="flex items-center gap-3 whitespace-normal min-w-[12rem]">
                <div className="shrink-0">
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
                <div className="min-w-0 wrap-anywhere">
                  <h3 className="font-medium">
                    {c.name?.firstName} {c.name?.lastName}
                    {!c.name?.firstName && !c.name?.lastName && "N/A"}
                  </h3>
                  <p className="text-sm text-gray-700">{c.email}</p>
                </div>
              </TableCell>
              <TableCell>{c.orders?.totalOrders || 0}</TableCell>
              <TableCell>{c.orders?.totalSpent || 0}&nbsp;€</TableCell>
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
      </div>
    </motion.div>
  );
}
