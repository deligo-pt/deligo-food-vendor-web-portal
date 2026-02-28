import { TCustomer } from "@/src/types/customer.type";
import { TOrder } from "@/src/types/order.type";

export type TSalesReport = {
  stats: {
    totalSales: number;
    totalOrders: number;
    avgOrderValue: number;
  };
  salesData: {
    name: string; // sun
    sales: number; //225
    orders: number; //10
  }[]; //based on last 7 days
  orders: TOrder[];
};

export type TTaxReport = {
  stats: {
    totalSales: number;
    totalTax: number;
    netRevenue: number; // sales - tax
  };
  taxContribution: {
    name: string; // sun
    value: number;
  }[];
  // taxContribution is an array: [
  //     { name: "Product", value: 33.6 },
  //     { name: "Addon", value: 66.4 },
  // ] here 33.6 is product tax contribution and 66.4 is addon tax contribution in percentage

  taxByCategory: {
    name: string; // tax rate like 6%, 10%, 23%
    value: number; // tax amount
  }[];

  revenueData: {
    name: string; // Month name like Feb
    revenue: number; // revenue on that month like 3200
    tax: number; // tax amount on that month like 420
  }[]; // based on last 6 months

  addonTax: {
    name: string; // addon name like Extra Cheese
    tax: number; // addon tax amount like 245
  }[];
};

export type TCustomerReport = {
  stats: {
    totalCustomers: number; // total number of customers on this vendor
    highestSpender: string; // highest spender name
    mostOrders: string; // most order customer name
  };

  //   monthlyCustomers on this vendor
  monthlyCustomers: {
    name: string; // Jan
    customers: number; // 10
  }[]; // based on last 6 months

  //   All customers on this vendor
  customers: TCustomer[];
};
