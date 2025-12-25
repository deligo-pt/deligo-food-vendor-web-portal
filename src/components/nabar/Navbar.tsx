"use client";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "@/src/hooks/use-translation";
import { useStore } from "@/src/store/store";
import { TVendor } from "@/src/types/vendor.type";
import { removeCookie } from "@/src/utils/cookies";
import { ChevronDown, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Navbar({ vendorData }: { vendorData: TVendor }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [productSubOpen, setProductSubOpen] = useState(false);
  const [toolsSubOpen, setToolsSubOpen] = useState(false);
  const { lang, setLang } = useStore();
  const { t } = useTranslation();
  const router = useRouter();

  const navItems = [
    { name: t("home"), href: "/" },
    {
      name: t("tools"),
      submenu: [
        { name: t("promotions"), href: "/tools/promotions" },
        { name: t("ads"), href: "/tools/ads" },
        { name: t("manageProducts"), href: "/tools/manage-products" },
      ],
    },
    { name: t("contactUs"), href: "/contact-us" },
  ];

  const logOut = () => {
    removeCookie("accessToken");
    removeCookie("refreshToken");
    router.refresh();
  };

  return (
    <nav className="bg-white shadow-md fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left: Logo */}
          <div className="shrink-0 flex items-center">
            {/* Logo Section */}
            <Link
              href="/"
              className="flex items-center gap-2 group transition-transform duration-300"
            >
              {/* Animated Logo Image */}
              <div className="w-9 h-9 overflow-hidden rounded-full transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
                <Image
                  src="/deligoLogo.png"
                  alt="DeliGo Logo"
                  width={50}
                  height={50}
                  className="object-cover"
                  unoptimized
                />
              </div>

              {/* Brand Text */}
              <span className="font-bold text-xl text-[#DC3173] group-hover:opacity-90 transition-opacity duration-300">
                DeliGo
              </span>
            </Link>
          </div>

          {/* Right: Nav Items */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <div key={item.name} className="relative group">
                {!item.submenu ? (
                  <Link
                    href={item.href}
                    className="text-gray-700 hover:text-[#DC3173] transition-all font-medium"
                  >
                    {item.name}
                  </Link>
                ) : (
                  <>
                    <div className="relative group">
                      {/* Button with arrow */}
                      <button className="flex items-center text-gray-700 hover:text-[#DC3173] transition-all font-medium">
                        {item.name}
                        <ChevronDown className="ml-1 w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
                      </button>

                      {/* Dropdown */}
                      <div className="absolute left-0 mt-2 w-48 bg-white shadow-xl rounded-lg opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 z-50">
                        {item.submenu.map((sub) => (
                          <Link
                            key={sub.name}
                            href={sub.href}
                            className="block px-4 py-2 text-gray-700 hover:bg-[#DC3173]/10 hover:text-[#DC3173] transition-all"
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}

            {/* language switcher */}
            <Select
              value={lang}
              onValueChange={(value: "en" | "pt") => {
                setLang(value);
                console.log("Selected language:", value);
              }}
            >
              <SelectTrigger className="w-[70px] hover:border hover:border-[#DC3173]">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">EN</SelectItem>
                <SelectItem value="pt">PT</SelectItem>
              </SelectContent>
            </Select>

            {vendorData?.email ? (
              <>
                {/* Dashboard Button */}
                <Link
                  href="/vendor/dashboard"
                  className="ml-4 px-5 py-2 bg-[#DC3173] text-white font-semibold rounded-lg hover:bg-[#a72b5c] transition-all"
                >
                  Dashboard
                </Link>
                {/* Logout Button */}
                <Button
                  onClick={logOut}
                  variant="outline"
                  className="ml-4 px-5 border-[#DC3173] text-[#DC3173] font-semibold rounded-lg shadow-md hover:bg-[#DC3173] hover:text-white hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                {/* Become a Partner Button */}
                <Link
                  href="/become-vendor"
                  className="ml-4 px-5 py-2 bg-[#DC3173] text-white font-semibold rounded-lg hover:bg-[#a72b5c] transition-all"
                >
                  {t("becomeVendor")}
                </Link>
                {/* Login Button */}
                <Link
                  href="/login"
                  className="ml-4 px-5 py-2 bg-linear-to-r from-[#DC3173] to-[#a72b5c] text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300"
                >
                  {t("login")}
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <div className="flex items-center gap-3 md:hidden">
            <Select
              value={lang}
              onValueChange={(value: "en" | "pt") => {
                setLang(value);
                console.log("Selected language:", value);
              }}
            >
              <SelectTrigger className="w-[70px] hover:border hover:border-[#DC3173]">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">EN</SelectItem>
                <SelectItem value="pt">PT</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => setDrawerOpen(true)}
              className="p-2 rounded-md text-gray-700 hover:text-[#DC3173] focus:outline-none"
            >
              <Menu className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black bg-opacity-30 transition-opacity"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="relative w-64 bg-white shadow-lg h-full transition-transform transform translate-x-0">
            <div className="flex justify-between items-center p-6">
              {/* Logo Section */}
              <Link
                href="/"
                className="flex items-center gap-2 group transition-transform duration-300"
              >
                {/* Animated Logo Image */}
                <div className="w-9 h-9 overflow-hidden rounded-full transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
                  <Image
                    src="/deligoLogo.png"
                    alt="DeliGo Logo"
                    width={50}
                    height={50}
                    className="object-cover"
                    unoptimized
                  />
                </div>

                {/* Brand Text */}
                <span className="font-bold text-xl text-[#DC3173] group-hover:opacity-90 transition-opacity duration-300">
                  DeliGo
                </span>
              </Link>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-2 rounded-md text-gray-700 hover:text-[#DC3173]"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="px-6 space-y-4">
              {navItems.map((item) => (
                <div key={item.name}>
                  {!item.submenu ? (
                    <Link
                      href={item.href}
                      className="block text-gray-700 hover:text-[#DC3173] font-medium"
                    >
                      {item.name}
                    </Link>
                  ) : (
                    <>
                      <button
                        onClick={() =>
                          item.name === "Product"
                            ? setProductSubOpen(!productSubOpen)
                            : setToolsSubOpen(!toolsSubOpen)
                        }
                        className="flex justify-between w-full text-gray-700 font-medium hover:text-[#DC3173]"
                      >
                        {item.name}
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${
                            (
                              item.name === "Product"
                                ? productSubOpen
                                : toolsSubOpen
                            )
                              ? "rotate-180"
                              : ""
                          }`}
                        />
                      </button>
                      <div
                        className={`mt-2 pl-4 space-y-2 ${
                          (
                            item.name === "Product"
                              ? productSubOpen
                              : toolsSubOpen
                          )
                            ? "block"
                            : "hidden"
                        }`}
                      >
                        {item.submenu.map((sub) => (
                          <Link
                            key={sub.name}
                            href={sub.href}
                            className="block text-gray-600 hover:text-[#DC3173] font-medium"
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ))}

              {vendorData?.email ? (
                <>
                  {/* Dashboard Button */}
                  <Link
                    className="block text-gray-700 hover:text-[#DC3173] font-medium"
                    href="/vendor/dashboard"
                  >
                    Dashboard
                  </Link>
                  {/* Logout Button */}
                  <Button
                    onClick={logOut}
                    variant="outline"
                    className="w-full mt-4 px-4 border-[#DC3173] text-[#DC3173] font-semibold rounded-lg shadow-md hover:bg-[#DC3173] hover:text-white hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <Link
                  href="/become-vendor"
                  className="block mt-4 px-4 py-2 bg-[#DC3173] text-white font-semibold rounded-lg text-center hover:bg-[#a72b5c]"
                >
                  {t("becomePartner")}
                </Link>
              )}
            </nav>
          </div>
        </div>
      )}
    </nav>
  );
}
