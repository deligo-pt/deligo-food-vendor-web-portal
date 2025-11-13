"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ProductCard from "@/src/components/Dashboard/Products/ProductCard";
import { Input } from "@/src/components/ui/input";
import { TMeta, TResponse } from "@/src/types";
import { TProduct, TProductsQueryParams } from "@/src/types/product.type";
import { getCookie } from "@/src/utils/cookies";
import { fetchData } from "@/src/utils/requests";
import { AnimatePresence, motion } from "framer-motion";
import {
  PlusCircle,
  RefreshCcw,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

export const mockProducts: TProduct[] = [
  {
    productId: "1",
    sku: "PIZZA-001",
    name: "Margherita Pizza",
    slug: "margherita-pizza",
    description:
      "Classic Italian pizza with tomato sauce, mozzarella cheese, and fresh basil.",
    isDeleted: false,
    isApproved: true,
    category: "Pizza",
    pricing: {
      price: 12.99,
      discount: 0,
      finalPrice: 12.99,
      currency: "$",
    },
    stock: {
      quantity: 100,
      unit: "piece",
      availabilityStatus: "In Stock",
    },
    images: [
      "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?q=80&w=1000&auto=format&fit=crop",
    ],
    vendor: {
      vendorId: "v1",
      vendorName: "Pizza Palace",
      vendorType: "Restaurant",
      rating: 4.8,
    },
    tags: ["Italian", "Vegetarian"],
    deliveryInfo: {
      deliveryType: "Instant",
      estimatedTime: "30-45 min",
      deliveryCharge: 2.5,
      freeDeliveryAbove: 25,
    },
    rating: {
      average: 4.7,
      totalReviews: 120,
    },
    meta: {
      isFeatured: true,
      status: "Active",
      createdAt: new Date("2023-01-15"),
      updatedAt: new Date("2023-04-20"),
    },
  },
  {
    productId: "2",
    sku: "BURGER-001",
    name: "Classic Cheeseburger",
    slug: "classic-cheeseburger",
    description:
      "Juicy beef patty with melted cheese, lettuce, tomato, and special sauce on a toasted bun.",
    isDeleted: false,
    isApproved: true,
    category: "Burger",
    pricing: {
      price: 9.99,
      discount: 1,
      finalPrice: 8.99,
      currency: "$",
    },
    stock: {
      quantity: 50,
      unit: "piece",
      availabilityStatus: "In Stock",
    },
    images: [
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1000&auto=format&fit=crop",
    ],
    vendor: {
      vendorId: "v2",
      vendorName: "Burger Bistro",
      vendorType: "Restaurant",
    },
    tags: ["American", "Fast Food"],
    deliveryInfo: {
      deliveryType: "Instant",
      estimatedTime: "20-35 min",
      deliveryCharge: 1.99,
    },
    rating: {
      average: 4.5,
      totalReviews: 85,
    },
    meta: {
      status: "Active",
      createdAt: new Date("2023-02-10"),
      updatedAt: new Date("2023-05-15"),
    },
  },
  {
    productId: "3",
    sku: "SUSHI-001",
    name: "California Roll Set",
    slug: "california-roll-set",
    description:
      "Fresh sushi rolls with crab, avocado, and cucumber. Served with wasabi and soy sauce.",
    isDeleted: false,
    isApproved: true,
    category: "Sushi",
    pricing: {
      price: 18.99,
      discount: 2,
      finalPrice: 16.99,
      currency: "$",
    },
    stock: {
      quantity: 30,
      unit: "set",
      availabilityStatus: "Limited",
    },
    images: [
      "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=1000&auto=format&fit=crop",
    ],
    vendor: {
      vendorId: "v3",
      vendorName: "Sushi Spot",
      vendorType: "Restaurant",
      rating: 4.9,
    },
    tags: ["Japanese", "Seafood"],
    deliveryInfo: {
      deliveryType: "Scheduled",
      estimatedTime: "40-60 min",
      deliveryCharge: 3.99,
      freeDeliveryAbove: 35,
    },
    rating: {
      average: 4.8,
      totalReviews: 65,
    },
    meta: {
      isFeatured: true,
      status: "Active",
      createdAt: new Date("2023-03-05"),
      updatedAt: new Date("2023-06-10"),
    },
  },
  {
    productId: "4",
    sku: "PASTA-001",
    name: "Spaghetti Carbonara",
    slug: "spaghetti-carbonara",
    description:
      "Traditional Italian pasta with creamy sauce, pancetta, eggs, and parmesan cheese.",
    isDeleted: false,
    isApproved: true,
    category: "Pasta",
    pricing: {
      price: 14.99,
      discount: 0,
      finalPrice: 14.99,
      currency: "$",
    },
    stock: {
      quantity: 45,
      unit: "plate",
      availabilityStatus: "In Stock",
    },
    images: [
      "https://images.unsplash.com/photo-1546549032-9571cd6b27df?q=80&w=1000&auto=format&fit=crop",
    ],
    vendor: {
      vendorId: "v4",
      vendorName: "Pasta Paradise",
      vendorType: "Restaurant",
    },
    tags: ["Italian", "Pasta"],
    deliveryInfo: {
      deliveryType: "Instant",
      estimatedTime: "35-50 min",
      deliveryCharge: 2.99,
    },
    rating: {
      average: 4.6,
      totalReviews: 92,
    },
    meta: {
      status: "Active",
      createdAt: new Date("2023-04-12"),
      updatedAt: new Date("2023-07-20"),
    },
  },
  {
    productId: "5",
    sku: "SALAD-001",
    name: "Caesar Salad",
    slug: "caesar-salad",
    description:
      "Fresh romaine lettuce with Caesar dressing, parmesan cheese, and crunchy croutons.",
    isDeleted: false,
    isApproved: true,
    category: "Salad",
    pricing: {
      price: 8.99,
      discount: 0,
      finalPrice: 8.99,
      currency: "$",
    },
    stock: {
      quantity: 25,
      unit: "bowl",
      availabilityStatus: "In Stock",
    },
    images: [
      "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?q=80&w=1000&auto=format&fit=crop",
    ],
    vendor: {
      vendorId: "v5",
      vendorName: "Green Eats",
      vendorType: "Restaurant",
      rating: 4.7,
    },
    tags: ["Healthy", "Vegetarian"],
    deliveryInfo: {
      deliveryType: "Instant",
      estimatedTime: "15-30 min",
      deliveryCharge: 1.5,
    },
    rating: {
      average: 4.3,
      totalReviews: 48,
    },
    meta: {
      status: "Active",
      createdAt: new Date("2023-05-18"),
      updatedAt: new Date("2023-08-05"),
    },
  },
  {
    productId: "6",
    sku: "DESSERT-001",
    name: "Chocolate Lava Cake",
    slug: "chocolate-lava-cake",
    description:
      "Warm chocolate cake with a molten chocolate center, served with vanilla ice cream.",
    isDeleted: false,
    isApproved: true,
    category: "Dessert",
    pricing: {
      price: 7.99,
      discount: 0,
      finalPrice: 7.99,
      currency: "$",
    },
    stock: {
      quantity: 15,
      unit: "piece",
      availabilityStatus: "Limited",
    },
    images: [
      "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=1000&auto=format&fit=crop",
    ],
    vendor: {
      vendorId: "v6",
      vendorName: "Sweet Treats",
      vendorType: "Bakery",
    },
    tags: ["Dessert", "Chocolate"],
    deliveryInfo: {
      deliveryType: "Instant",
      estimatedTime: "25-40 min",
      deliveryCharge: 2.49,
    },
    rating: {
      average: 4.9,
      totalReviews: 75,
    },
    meta: {
      isFeatured: true,
      status: "Active",
      createdAt: new Date("2023-06-22"),
      updatedAt: new Date("2023-09-15"),
    },
  },
  {
    productId: "7",
    sku: "DRINK-001",
    name: "Fresh Fruit Smoothie",
    slug: "fresh-fruit-smoothie",
    description:
      "Refreshing smoothie made with seasonal fruits, yogurt, and honey.",
    isDeleted: false,
    isApproved: true,
    category: "Beverage",
    pricing: {
      price: 5.99,
      discount: 0,
      finalPrice: 5.99,
      currency: "$",
    },
    stock: {
      quantity: 40,
      unit: "cup",
      availabilityStatus: "In Stock",
    },
    images: [
      "https://images.unsplash.com/photo-1553530666-ba11a7da3888?q=80&w=1000&auto=format&fit=crop",
    ],
    vendor: {
      vendorId: "v7",
      vendorName: "Juice Junction",
      vendorType: "Cafe",
    },
    tags: ["Healthy", "Drinks"],
    deliveryInfo: {
      deliveryType: "Instant",
      estimatedTime: "15-25 min",
      deliveryCharge: 1.99,
    },
    rating: {
      average: 4.4,
      totalReviews: 62,
    },
    meta: {
      status: "Active",
      createdAt: new Date("2023-07-08"),
      updatedAt: new Date("2023-10-12"),
    },
  },
  {
    productId: "8",
    sku: "BOWL-001",
    name: "Acai Bowl",
    slug: "acai-bowl",
    description:
      "Nutritious bowl with acai berries, granola, fresh fruits, and honey.",
    isDeleted: false,
    isApproved: true,
    category: "Healthy",
    pricing: {
      price: 11.99,
      discount: 1,
      finalPrice: 10.99,
      currency: "$",
    },
    stock: {
      quantity: 20,
      unit: "bowl",
      availabilityStatus: "In Stock",
    },
    images: [
      "https://images.unsplash.com/photo-1590301157890-4810ed352733?q=80&w=1000&auto=format&fit=crop",
    ],
    vendor: {
      vendorId: "v8",
      vendorName: "Health Haven",
      vendorType: "Cafe",
      rating: 4.6,
    },
    tags: ["Healthy", "Breakfast"],
    deliveryInfo: {
      deliveryType: "Scheduled",
      estimatedTime: "20-35 min",
      deliveryCharge: 2.49,
    },
    rating: {
      average: 4.7,
      totalReviews: 53,
    },
    meta: {
      status: "Active",
      createdAt: new Date("2023-08-14"),
      updatedAt: new Date("2023-11-05"),
    },
  },
  {
    productId: "9",
    sku: "CURRY-001",
    name: "Chicken Tikka Masala",
    slug: "chicken-tikka-masala",
    description:
      "Tender chicken in a rich, spiced tomato cream sauce, served with basmati rice.",
    isDeleted: false,
    isApproved: true,
    category: "Curry",
    pricing: {
      price: 16.99,
      discount: 2,
      finalPrice: 14.99,
      currency: "$",
    },
    stock: {
      quantity: 35,
      unit: "plate",
      availabilityStatus: "In Stock",
    },
    images: [
      "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=1000&auto=format&fit=crop",
    ],
    vendor: {
      vendorId: "v9",
      vendorName: "Spice Garden",
      vendorType: "Restaurant",
    },
    tags: ["Indian", "Spicy"],
    deliveryInfo: {
      deliveryType: "Instant",
      estimatedTime: "30-45 min",
      deliveryCharge: 2.99,
      freeDeliveryAbove: 30,
    },
    rating: {
      average: 4.8,
      totalReviews: 89,
    },
    meta: {
      isFeatured: true,
      status: "Active",
      createdAt: new Date("2023-09-20"),
      updatedAt: new Date("2023-12-10"),
    },
  },
  {
    productId: "10",
    sku: "TACO-001",
    name: "Street Tacos",
    slug: "street-tacos",
    description:
      "Authentic Mexican street tacos with choice of meat, onions, cilantro, and salsa.",
    isDeleted: false,
    isApproved: false,
    category: "Mexican",
    pricing: {
      price: 10.99,
      discount: 0,
      finalPrice: 10.99,
      currency: "$",
    },
    stock: {
      quantity: 0,
      unit: "set",
      availabilityStatus: "Out of Stock",
    },
    images: [
      "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=1000&auto=format&fit=crop",
    ],
    vendor: {
      vendorId: "v10",
      vendorName: "Taco Time",
      vendorType: "Restaurant",
    },
    tags: ["Mexican", "Spicy"],
    deliveryInfo: {
      deliveryType: "Instant",
      estimatedTime: "25-40 min",
      deliveryCharge: 2.49,
    },
    rating: {
      average: 4.6,
      totalReviews: 72,
    },
    meta: {
      status: "Inactive",
      createdAt: new Date("2023-10-25"),
      updatedAt: new Date("2024-01-15"),
    },
  },
  {
    productId: "11",
    sku: "NOODLE-001",
    name: "Pad Thai",
    slug: "pad-thai",
    description:
      "Traditional Thai stir-fried rice noodles with eggs, tofu, bean sprouts, and peanuts.",
    isDeleted: false,
    isApproved: true,
    category: "Thai",
    pricing: {
      price: 13.99,
      discount: 0,
      finalPrice: 13.99,
      currency: "$",
    },
    stock: {
      quantity: 25,
      unit: "plate",
      availabilityStatus: "In Stock",
    },
    images: [
      "https://images.unsplash.com/photo-1559314809-0d155014e29e?q=80&w=1000&auto=format&fit=crop",
    ],
    vendor: {
      vendorId: "v11",
      vendorName: "Thai Delight",
      vendorType: "Restaurant",
      rating: 4.5,
    },
    tags: ["Thai", "Noodles"],
    deliveryInfo: {
      deliveryType: "Instant",
      estimatedTime: "35-50 min",
      deliveryCharge: 2.99,
    },
    rating: {
      average: 4.5,
      totalReviews: 68,
    },
    meta: {
      status: "Active",
      createdAt: new Date("2023-11-12"),
      updatedAt: new Date("2024-02-20"),
    },
  },
  {
    productId: "12",
    sku: "WRAP-001",
    name: "Chicken Caesar Wrap",
    slug: "chicken-caesar-wrap",
    description:
      "Grilled chicken with Caesar salad, parmesan, and croutons wrapped in a soft tortilla.",
    isDeleted: false,
    isApproved: true,
    category: "Wrap",
    pricing: {
      price: 9.99,
      discount: 1,
      finalPrice: 8.99,
      currency: "$",
    },
    stock: {
      quantity: 18,
      unit: "piece",
      availabilityStatus: "Limited",
    },
    images: [
      "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?q=80&w=1000&auto=format&fit=crop",
    ],
    vendor: {
      vendorId: "v12",
      vendorName: "Wrap & Roll",
      vendorType: "Restaurant",
    },
    tags: ["Wraps", "Lunch"],
    deliveryInfo: {
      deliveryType: "Instant",
      estimatedTime: "20-35 min",
      deliveryCharge: 1.99,
    },
    rating: {
      average: 4.2,
      totalReviews: 45,
    },
    meta: {
      status: "Active",
      createdAt: new Date("2023-12-05"),
      updatedAt: new Date("2024-03-10"),
    },
  },
];

const sortOptions = {
  "createdAt-desc": {
    field: "-createdAt",
    label: "Newest First",
  },
  "createdAt-asc": {
    field: "createdAt",
    label: "Oldest First",
  },
  "name-asc": {
    field: "pricing.finalPrice",
    label: "Price (Low to High)",
  },
  "name-desc": {
    field: "-pricing.finalPrice",
    label: "Price (High to Low)",
  },
  "rating-desc": {
    field: "-rating.average",
    label: "Highest Rated",
  },
  "rating-asc": {
    field: "rating.average",
    label: "Lowest Rated",
  },
};

export default function Products() {
  const [productsResult, setProductsResult] = useState<{
    data: TProduct[];
    meta?: TMeta;
  }>({ data: mockProducts });
  const [queryParams, setQueryParams] = useState<TProductsQueryParams>({
    limit: 10,
    page: 1,
    searchTerm: "",
    sort: "-createdAt",
    "stock.availabilityStatus": "",
    category: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    "stock.availabilityStatus": "",
    category: "",
  });

  async function getProducts(params?: TProductsQueryParams) {
    try {
      const result = (await fetchData("/products", {
        params: params || queryParams,
        headers: {
          authorization: getCookie("accessToken"),
        },
      })) as unknown as TResponse<TProduct[]>;

      if (result.success) {
        setProductsResult({
          data: [...productsResult.data, ...result.data],
          meta: result.meta,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleSearch = (value: string) => {
    setQueryParams((prevQuery) => ({ ...prevQuery, searchTerm: value }));
    getProducts({
      ...queryParams,
      searchTerm: value,
    });
  };

  const handleSort = (value: string) => {
    setQueryParams((prevQuery) => ({ ...prevQuery, sort: value }));
    getProducts({
      ...queryParams,
      sort: value,
    });
  };

  const handleAddFilter = () => {
    if (activeFilters["stock.availabilityStatus"].length > 0) {
      setQueryParams((prevQuery) => ({
        ...prevQuery,
        status: queryParams["stock.availabilityStatus"],
      }));
    }
    if (activeFilters.category.length > 0) {
      setQueryParams((prevQuery) => ({
        ...prevQuery,
        category: queryParams.category,
      }));
    }
    getProducts({
      ...queryParams,
      "stock.availabilityStatus": queryParams["stock.availabilityStatus"],
      category: queryParams.category,
    });
    setShowFilters(false);
  };

  const removeFilter = (key: "stock.availabilityStatus" | "category") => {
    setActiveFilters((prevFilters) => ({
      ...prevFilters,
      [key]: "",
    }));
    setQueryParams((prevQuery) => ({
      ...prevQuery,
      [key]: "",
    }));
    getProducts({
      ...queryParams,
      [key]: "",
    });
  };

  const clearAllFilters = () => {
    setActiveFilters({
      "stock.availabilityStatus": "",
      category: "",
    });
    setQueryParams((prevQuery) => ({
      ...prevQuery,
      "stock.availabilityStatus": "",
      category: "",
    }));
    getProducts({
      ...queryParams,
      "stock.availabilityStatus": "",
      category: "",
    });
  };

  const handleProductDelete = (id: string) => {
    console.log(id);
  };

  const handleProductEdit = (id: string) => {
    console.log(id);
  };

  useEffect(() => {
    (() => getProducts())();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full p-8">
      <div className="bg-linear-to-r from-[#DC3173] to-[#FF6CAB] p-6 rounded-lg mb-6 shadow-lg">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Delivery Partners
            </h1>
            <p className="text-pink-100 mt-1">
              Manage your delivery partner network
            </p>
          </div>
          <motion.button
            whileHover={{
              scale: 1.05,
            }}
            whileTap={{
              scale: 0.95,
            }}
            className="mt-4 md:mt-0 bg-white text-[#DC3173] px-4 py-2 rounded-md font-medium flex items-center shadow-md"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Add New Product
          </motion.button>
        </div>
      </div>
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start md:items-center justify-between">
          <div className="relative w-full lg:w-72">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search partners..."
              value={queryParams.searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <div className="w-full lg:w-48">
              <Select
                value={queryParams.sort}
                onValueChange={(value) => handleSort(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a fruit" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(sortOptions).map(([key, option]) => (
                    <SelectItem key={key} value={key}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              variant="outline"
              className={`flex items-center ${
                showFilters ||
                (activeFilters.category.length > 0
                  ? 1
                  : 0 + activeFilters["stock.availabilityStatus"].length > 0
                  ? 1
                  : 0) > 0
                  ? "border-[#DC3173] text-[#DC3173]"
                  : ""
              }`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Filters{" "}
              {!!(activeFilters.category.length > 0
                ? 1
                : 0 + activeFilters["stock.availabilityStatus"].length > 0
                ? 1
                : 0) || ""}
            </Button>
          </div>
        </div>

        {(activeFilters.category ||
          activeFilters["stock.availabilityStatus"]) && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {activeFilters["stock.availabilityStatus"].length > 0 && (
              <Badge
                variant="outline"
                className="text-[#DC3173] border-[#DC3173]"
              >
                {activeFilters["stock.availabilityStatus"]}
                <X
                  className="ml-2 h-4 w-4"
                  onClick={() => removeFilter("stock.availabilityStatus")}
                />
              </Badge>
            )}
            {activeFilters.category.length > 0 && (
              <Badge
                variant="outline"
                className="text-[#DC3173] border-[#DC3173]"
              >
                {activeFilters.category}
                <X
                  className="ml-2 h-4 w-4"
                  onClick={() => removeFilter("category")}
                />
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-sm text-[#DC3173] hover:text-[#DC3173] hover:bg-pink-50"
            >
              <RefreshCcw className="h-3 w-3 mr-1" /> Clear All
            </Button>
          </div>
        )}

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{
                height: 0,
                opacity: 0,
              }}
              animate={{
                height: "auto",
                opacity: 1,
              }}
              exit={{
                height: 0,
                opacity: 0,
              }}
              transition={{
                duration: 0.2,
              }}
              className="overflow-hidden"
            >
              <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Availability Status
                    </label>
                    <Select
                      value={queryParams["stock.availabilityStatus"]}
                      onValueChange={(value) =>
                        setActiveFilters((prevFilters) => ({
                          ...prevFilters,
                          "stock.availabilityStatus": value,
                        }))
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                      <SelectContent>
                        {["In Stock", "Out of Stock", "Limited"].map(
                          (status) => (
                            <SelectItem key={status} value={status || "a"}>
                              {status}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Category
                    </label>
                    <Select
                      value={queryParams.category}
                      onValueChange={(value) =>
                        setActiveFilters((prevFilters) => ({
                          ...prevFilters,
                          isEmailVerified: value,
                        }))
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="verified">Verified</SelectItem>
                        <SelectItem value="not-verified">
                          Not Verified
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button
                    variant="ghost"
                    className="mr-2"
                    onClick={() => setShowFilters(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAddFilter}>Apply Filters</Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {productsResult.data?.length > 0 && (
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-gray-500">
            Showing{" "}
            {((productsResult.meta?.page || 1) - 1) *
              (productsResult.meta?.limit || 10) +
              1}
            -
            {(productsResult.meta?.page || 1) *
              (productsResult.meta?.limit || 10)}{" "}
            of {productsResult.meta?.total || 0} products
          </p>
        </div>
      )}

      {productsResult?.data?.length > 0 ? (
        <motion.div
          layout
          className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6"
        >
          <AnimatePresence>
            {productsResult?.data?.map((product) => (
              <ProductCard
                key={product.productId}
                product={product}
                onDelete={() => handleProductDelete(product.productId)}
                onEdit={() => handleProductEdit(product.productId)}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          className="flex flex-col items-center justify-center py-12 text-center"
        >
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-medium mb-2">No partners found</h3>
          <p className="text-gray-500 max-w-md">
            No delivery partners match your current filters. Try adjusting your
            search or filters to find what you&lsquo;re looking for.
          </p>
          <Button variant="outline" className="mt-4" onClick={clearAllFilters}>
            Clear All Filters
          </Button>
        </motion.div>
      )}
      {/* Pagination */}
      {productsResult?.data?.length > 0 && (
        <div className="mt-8 flex justify-center">
          <Pagination />
        </div>
      )}
    </div>
  );
}
