"use client";

import { AnimatePresence } from "framer-motion";

import SingleProduct from "@/src/components/Dashboard/StockManagement/SingleProduct";
import AllFilters from "@/src/components/Filtering/AllFilters";
import { TMeta } from "@/src/types";
import { TProduct } from "@/src/types/product.type";

const PRIMARY = "#DC3173";
const BG = "#FFF2F8";

// Static product list
// const STATIC_STOCK = [
//   {
//     id: "P1",
//     name: "Chicken Burger",
//     category: "Burgers",
//     stock: 18,
//     minStock: 10,
//     image: "https://images.unsplash.com/photo-1550547660-d9450f859349",
//   },
//   {
//     id: "P2",
//     name: "Margherita Pizza",
//     category: "Pizza",
//     stock: 4,
//     minStock: 8,
//     image: "https://images.unsplash.com/photo-1548365328-5473d2bc4a37",
//   },
//   {
//     id: "P3",
//     name: "Fresh Orange Juice",
//     category: "Drinks",
//     stock: 0,
//     minStock: 5,
//     image: "https://images.unsplash.com/photo-1580555705450-989dcd28d23b",
//   },
//   {
//     id: "P4",
//     name: "Greek Salad",
//     category: "Salads",
//     stock: 21,
//     minStock: 12,
//     image: "https://images.unsplash.com/photo-1569058242253-92a9c755a30c",
//   },
//   {
//     id: "P5",
//     name: "Classic Coffee",
//     category: "Coffee",
//     stock: 7,
//     minStock: 5,
//     image: "https://images.unsplash.com/photo-1511920170033-f8396924c348",
//   },
// ];

interface IProps {
  productsResult: {
    data: TProduct[];
    meta?: TMeta;
  };
}

const sortOptions = [
  { label: "Newest First", value: "-createdAt" },
  { label: "Oldest First", value: "createdAt" },
  { label: "Name (A-Z)", value: "name" },
  { label: "Name (Z-A)", value: "-name" },
  { label: "Price (High to Low)", value: "-pricing.finalPrice" },
  { label: "Price (low to High)", value: "pricing.finalPrice" },
  { label: "Highest Rated", value: "-rating.average" },
  { label: "lowest Rated", value: "rating.average" },
];

export default function Stocks({ productsResult }: IProps) {
  return (
    <div className="min-h-screen p-6 md:p-10" style={{ background: BG }}>
      <div className="max-w-[900px] mx-auto space-y-8">
        {/* HEADER */}
        <header>
          <h1 className="text-4xl font-extrabold" style={{ color: PRIMARY }}>
            Stock Management
          </h1>
          <p className="text-gray-600 mt-1 text-sm">
            Update product stock in real-time —
          </p>
        </header>

        {/* SEARCH */}
        <AllFilters sortOptions={sortOptions} />

        {/* PRODUCT LIST */}
        <div className="space-y-6 pt-2">
          <AnimatePresence>
            {productsResult?.data?.map((p) => (
              <SingleProduct key={p._id} p={p} />
            ))}
          </AnimatePresence>
        </div>

        {/* NO RESULTS */}
        {productsResult?.data?.length === 0 && (
          <div className="text-center text-gray-500 py-12">
            No products found.
          </div>
        )}
      </div>
    </div>
  );
}
