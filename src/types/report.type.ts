import { TMeta } from "@/src/types";
import { TCustomer } from "@/src/types/customer.type";
import { TOrder } from "@/src/types/order.type";

export type TSalesReport = {
  stats: {
    totalSales: number;
    totalOrders: number;
    avgOrderValue: number;
  };
  salesData: {
    name: string;
    sales: number;
    orders: number;
  }[];
  orders: TOrder[];
};

export type TTaxReport = {
  stats: {
    totalSales: number;
    totalTax: number;
    netRevenue: number;
  };
  taxContribution: {
    name: "Product" | "addon";
    value: number;
  }[];

  taxByCategory: {
    name: string;
    value: number;
    percentage: number;
  }[];

  revenueData: {
    name: string;
    revenue: number;
    tax: number;
  }[];

  addonTax: {
    name: string;
    tax: number;
  }[];
};

export type TCustomerReport = {
  stats: {
    totalCustomers: number;
    highestSpender: string;
    mostOrders: string;
  };

  monthlyCustomers: {
    name: string;
    customers: number;
  }[];

  customers: { data: TCustomer[]; meta: TMeta };
};
