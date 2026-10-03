"use client";

import DeleteProductDialog from "@/src/components/Dashboard/Products/DeleteProductDialog";
import EditProductDialog from "@/src/components/Dashboard/Products/EditProductDialog";
import ProductCard from "@/src/components/Dashboard/Products/ProductCard";
import AllFilters from "@/src/components/Filtering/AllFilters";
import { useListNavigation } from "@/src/hooks/use-list-navigation";
import { useTranslation } from "@/src/hooks/use-translation";
import { useStore } from "@/src/store/store";
import { deleteProductReq } from "@/src/services/dashboard/products/products";
import { TMeta } from "@/src/types";
import { TProductCategory } from "@/src/types/category.type";
import { TProduct } from "@/src/types/product.type";
import { TVendor } from "@/src/types/vendor.type";
import CopyToBranchDialog from "@/src/components/Dashboard/Products/CopyToBranchDialog";
import { approvedBranches, productCode } from "@/src/utils/productCopy";
import { AnimatePresence, motion } from "framer-motion";
import { CheckSquare, LoaderCircle, Search, SquaresSubtract, X } from "lucide-react";
import { useEffect, useMemo, useState, useRef } from "react";
import { toast } from "sonner";
import TitleHeader from "../../TitleHeader/TitleHeader";

/**
 * A `{ en, pt }` field as the active language reads it.
 *
 * Tolerant of a plain string, because the product and category endpoints do not
 * agree: some responses resolve the name, others send the raw bag. A field with
 * nothing readable sorts as `""` rather than throwing the grid away.
 */
function localizedText(value: unknown, lang: string): string {
  if (typeof value === "string") return value.trim();
  if (!value || typeof value !== "object") return "";
  const bag = value as Record<string, unknown>;
  for (const key of [lang, "en", "pt"]) {
    const found = bag[key];
    if (typeof found === "string" && found.trim()) return found.trim();
  }
  return "";
}

interface IProps {
  productsData: { data: TProduct[]; meta?: TMeta };
  businessTypeSlug: string;
  productCategories: TProductCategory[];
  /** Copy targets. Empty when the vendor has none, which hides the whole feature. */
  branches: TVendor[];
}

export default function Products({
  productsData,
  businessTypeSlug,
  productCategories,
  branches,
}: IProps) {
  const { t } = useTranslation();
  // Collation and the name half both follow the language the vendor is reading.
  const { lang } = useStore();
  const [products, setProducts] = useState(productsData.data);
  // True while a search, filter or sort change is loading its new results.
  // The current list stays on screen, dimmed, until they arrive.
  const { isPending: updatingList } = useListNavigation();
  const [pickedCategoryId, setPickedCategoryId] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<{
    id: string | null;
    action: "edit" | "delete" | null;
    product?: TProduct | null;
  }>({ id: null, action: null });

  // Selecting is a mode rather than a permanent control on every card: the card
  // already carries View / Edit / Delete, and a fourth button on each of them
  // would cost more than it gives.
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  // "All products" is the API's own `copyAllProducts`, not this page's list —
  // the catalogue is paginated, so a list would silently mean "this page only".
  const [copyAll, setCopyAll] = useState(false);
  const [isCopyOpen, setIsCopyOpen] = useState(false);

  const copyTargets = useMemo(() => approvedBranches(branches), [branches]);

  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  /**
   * Where a heading counts as "at the top", in viewport pixels.
   *
   * The same number `scroll-mt-24` gives the sections, so the heading a jump
   * lands on is the heading the highlight then picks. Two numbers here drifted
   * apart and a click lit up the category above the one it scrolled to.
   */
  const HEADING_LINE = 96;
  /** The pill a click chose, held until the smooth scroll reaches it. */
  const clickedRef = useRef<string | null>(null);

  const sortOptions = [
    { label: t("newest_first"), value: "-createdAt" },
    { label: t("oldest_first"), value: "createdAt" },
    { label: t("name_a_to_z"), value: "name" },
    { label: t("name_z_to_a"), value: "-name" },
    { label: t("price_high_to_low"), value: "-pricing.finalPrice" },
    { label: t("price_low_to_high"), value: "pricing.finalPrice" },
    { label: t("highest_rated"), value: "-rating.average" },
    { label: t("lowest_rated"), value: "rating.average" },
  ];

  const filterOptions = [
    {
      label: t("availability_status"),
      key: "status",
      placeholder: "Select a status",
      type: "select",
      items: [
        { label: t("in_stock"), value: t("in_stock") },
        { label: t("out_of_stock"), value: t("out_of_stock") },
        { label: t("limited"), value: t("limited") },
      ],
    },
  ];

  const groupedProducts = useMemo(() => {
    const groups: Record<
      string,
      { category: TProductCategory | null; products: TProduct[] }
    > = {};

    productCategories.forEach((cat) => {
      groups[cat._id] = { category: cat, products: [] };
    });

    products.forEach((product) => {
      const categoryId = product.category?._id;
      if (categoryId && groups[categoryId]) {
        groups[categoryId].products.push(product);
      } else {
        if (!groups["uncategorized"]) {
          groups["uncategorized"] = { category: null, products: [] };
        }
        groups["uncategorized"].products.push(product);
      }

      // A product also belongs under each of its additional categories. The
      // API already counts them: `GET /products?category=<DESSERT>` returns
      // Faluda, whose main category is DINNER MENU. This page grouped by main
      // only, so the vendor never saw it there. Each category lists a product
      // once. An additional category the vendor no longer has is skipped,
      // since the main one already places the product. Selection is by
      // product code, so a product shown twice is still picked once.
      product.additionalCategories?.forEach((extra) => {
        const group = extra?._id ? groups[extra._id] : undefined;
        if (group && !group.products.includes(product)) group.products.push(product);
      });
    });

    // One comparator for both levels, so a heading and the cards under it are
    // never ordered by different rules. `localeCompare` rather than `<`: the
    // Portuguese catalogue has names like `Chá` and `Açorda`, and comparing
    // code points files accented letters after `Z`.
    const byName = (a: string, b: string) =>
      a.localeCompare(b, lang, { sensitivity: "base", numeric: true });

    const rendered = Object.values(groups).filter(
      (group) => group.products.length > 0,
    );

    rendered.forEach((group) => {
      group.products.sort((a, b) =>
        byName(localizedText(a.name, lang), localizedText(b.name, lang)),
      );
    });

    // "Uncategorized" is pinned last rather than sorted in: it is not one of
    // the vendor's own categories, and in PT ("Sem categoria") it would land
    // mid-list reading like one.
    const own = rendered.filter((group) => group.category);
    const uncategorized = rendered.filter((group) => !group.category);
    own.sort((a, b) =>
      byName(
        localizedText(a.category?.name, lang),
        localizedText(b.category?.name, lang),
      ),
    );

    return [...own, ...uncategorized];
  }, [products, productCategories, lang]);

  // Derived, not stored: "nothing picked yet" means the first group, and an
  // effect that wrote that default back into state was a cascading render for
  // a value already knowable during render.
  const activeCategoryId =
    pickedCategoryId ?? groupedProducts[0]?.category?._id ?? "uncategorized";

  /**
   * A section's distance from the top of the window.
   *
   * Viewport coordinates, so it does not matter which element is doing the
   * scrolling — `<main>` on this page today, the window on a layout that drops
   * it tomorrow. The old version had to find the scroller first and measure
   * against it, which is the kind of question that only had an answer while
   * there were two of them.
   */
  const distanceFromTop = (el: HTMLElement) => el.getBoundingClientRect().top;

  /**
   * The element the list is actually scrolling inside.
   *
   * The list's own pane at `lg`; below that the pane is not a scroller and the
   * enclosing `<main>` is — note **`main`**, not the window, which is why this
   * walks the ancestors instead of assuming `document.scrollingElement`.
   * Wanted only for the "am I at the bottom" test, which is the one question
   * viewport coordinates cannot answer.
   */
  const activeScroller = (): HTMLElement | null => {
    const pane = scrollContainerRef.current;
    if (pane && pane.scrollHeight > pane.clientHeight + 4) return pane;

    let node = pane?.parentElement ?? null;
    while (node) {
      const { overflowY } = getComputedStyle(node);
      const scrolls = overflowY === "auto" || overflowY === "scroll";
      if (scrolls && node.scrollHeight > node.clientHeight + 4) return node;
      node = node.parentElement;
    }
    return null;
  };

  // The highlight follows the scroll. Listened for in the **capture** phase on
  // `document`: scroll events do not bubble, and the element that scrolls here
  // is `<main>`, not the window — a listener on `window` alone would never fire.
  useEffect(() => {
    if (groupedProducts.length === 0) return;

    const onScroll = () => {
      // A click owns the highlight until its animation arrives; the first
      // scroll event after that hands control back.
      if (clickedRef.current) {
        const target = sectionRefs.current[clickedRef.current];
        if (target && Math.abs(distanceFromTop(target) - HEADING_LINE) < 100) {
          clickedRef.current = null;
        }
        return;
      }

      // At the very bottom the last section wins outright: it is often shorter
      // than the viewport, so its heading never reaches the top line and the
      // chip could otherwise never light up however far the vendor scrolls.
      const scroller = activeScroller();
      const atBottom = scroller
        ? scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 4
        : window.scrollY + window.innerHeight >=
          document.documentElement.scrollHeight - 4;
      if (atBottom) {
        const last = groupedProducts[groupedProducts.length - 1];
        const lastId = last?.category?._id || "uncategorized";
        setPickedCategoryId((prev) => (prev === lastId ? prev : lastId));
        return;
      }

      // Otherwise the heading nearest the top wins, so a half-scrolled section
      // does not light up before it is the one being read.
      let current = groupedProducts[0]?.category?._id || "uncategorized";
      for (const group of groupedProducts) {
        const id = group.category?._id || "uncategorized";
        const el = sectionRefs.current[id];
        if (!el) continue;
        if (distanceFromTop(el) <= HEADING_LINE) current = id;
      }
      setPickedCategoryId((prev) => (prev === current ? prev : current));
    };

    // The first sync runs after paint rather than in the effect body: setState
    // there is a cascading render, and this one only needs to measure a layout
    // that does not exist until the browser has drawn it.
    const first = requestAnimationFrame(onScroll);
    document.addEventListener("scroll", onScroll, { capture: true, passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(first);
      document.removeEventListener("scroll", onScroll, { capture: true });
      window.removeEventListener("resize", onScroll);
    };
  }, [groupedProducts]);

  const getCategoryName = (category: TProductCategory | null) => {
    if (!category) return t("uncategorized") || "Uncategorized";
    // Reads the active language first. It used to prefer `en` outright, so a
    // Portuguese vendor saw English headings — and, now that the list is
    // sorted, would have seen them in an order their own names do not explain.
    return localizedText(category.name, lang) || "Unnamed";
  };

  const openDeleteDialog = (id: string) =>
    setSelectedProduct({ id, action: "delete" });

  const onEditClick = (product: TProduct) =>
    setSelectedProduct({
      id: product._id as string,
      action: "edit",
      product,
    });

  const handleDeleteProduct = async () => {
    const toastId = toast.loading("Deleting product...");
    if (selectedProduct.id && selectedProduct.action === "delete") {
      const result = await deleteProductReq(selectedProduct.id);
      if (result.success) {
        setProducts((prev) =>
          prev.filter((product) => product.productId !== selectedProduct.id)
        );
        toast.success("Product deleted successfully", { id: toastId });
        setSelectedProduct({ id: null, action: null });
        return;
      }
      toast.error(result.message || "Product deletion failed", { id: toastId });
    }
  };

  const toggleProduct = (product: TProduct) => {
    const code = productCode(product);
    if (!code) return;
    // The ticks are a display of "all products", not a list — the mode covers
    // the whole catalogue, and this page holds only the first 20 of it. So a
    // tap here leaves the mode rather than turning it into "these 19", which
    // would silently drop everything on the pages the vendor cannot see.
    if (copyAll) {
      setCopyAll(false);
      setSelectedIds([]);
      return;
    }
    setSelectedIds((prev) =>
      prev.includes(code) ? prev.filter((id) => id !== code) : [...prev, code]
    );
  };

  const toggleCategory = (categoryProducts: TProduct[]) => {
    const codes = categoryProducts.map(productCode).filter(Boolean);
    const allSelected = codes.every((code) => selectedIds.includes(code));
    setCopyAll(false);
    setSelectedIds((prev) =>
      allSelected
        ? prev.filter((id) => !codes.includes(id))
        : Array.from(new Set([...prev, ...codes]))
    );
  };

  const isCategoryFullySelected = (categoryProducts: TProduct[]) => {
    const codes = categoryProducts.map(productCode).filter(Boolean);
    return codes.length > 0 && codes.every((code) => selectedIds.includes(code));
  };

  const clearSelection = () => {
    setSelectedIds([]);
    setCopyAll(false);
  };

  const exitSelectMode = () => {
    clearSelection();
    setSelectMode(false);
  };

  const selectionCount = copyAll ? productsData.meta?.total ?? products.length : selectedIds.length;

  const scrollToCategory = (id: string) => {
    setPickedCategoryId(id);
    const target = sectionRefs.current[id];
    if (!target) return;
    // `clickedRef` holds the pill the vendor chose until the animation lands,
    // so the listener above cannot overwrite it with every heading the scroll
    // passes on the way.
    clickedRef.current = id;

    // `scrollIntoView` moves every scrollable ancestor, which was wrong while
    // this page had two of them — the page and the list both moved. With one
    // it is exactly right, and `scroll-mt-24` on the section keeps the heading
    // clear of the topbar without arithmetic that has to be kept in sync with
    // a header height. The old `window.scrollTo` fallback was aimed at the
    // wrong element anyway: below `lg` the scroller is `<main>`, not the
    // window, so that branch scrolled nothing at all.
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    /* 🔴 `6rem`, and the whole bug lived in that number.

       This was `lg:h-[calc(100dvh-1rem)]` — the whole viewport — while the
       block sits inside `<main>`, which already begins below the 64px topbar
       and adds `p-4`. It was therefore ~96px taller than its slot, and `main`
       scrolled to make up the difference. That gave the page two scrollers
       under one wheel: the browser moved whichever sat under the pointer and
       only handed over at its end, so the last row stayed half off-screen
       until the pointer moved elsewhere. Worse, the two kept independent
       offsets and nothing reset the inner one, so the page could sit at the
       top, banner and all, while the grid was still scrolled — a category's
       prices and buttons stacked straight onto the next heading with their
       images cut off above.

       `100dvh - 6rem` is that slot exactly: 64px of topbar (fixed in
       `Topbar.tsx`, which also renders a spacer of the same height) plus
       `main`'s 16px of padding top and bottom. The block now fits, `main` has
       nothing left to scroll on this page, and the list's own scroller is the
       only one — which is what makes it safe to have at all.

       `lg:` only. On a phone the banner, search, Sort By and the selection bar
       stack and ate nearly all of `100dvh`, leaving the scroller a sliver;
       below `lg` the page scrolls like a page and the grid flows down it. */
    <div className="w-full flex flex-col lg:h-[calc(100dvh-6rem)] lg:max-h-[calc(100dvh-6rem)] lg:overflow-hidden">
      {/* Header – fixed height */}
      <TitleHeader
        title={t("food_items")}
        subtitle={t("manage_your_restaurants_food_delivery_items")}
      />

      {/* Filters – fixed height */}
      <div className="shrink-0 mb-4 flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <AllFilters
            sortOptions={sortOptions}
            {...(businessTypeSlug !== "restaurant" ? { filterOptions } : {})}
          />
        </div>

        {/* Hidden entirely when there is nowhere to copy to. */}
        {copyTargets.length > 0 && products.length > 0 && (
          <button
            type="button"
            onClick={() => (selectMode ? exitSelectMode() : setSelectMode(true))}
            className={`shrink-0 inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${selectMode
              ? "border-[#DC3173] bg-[#DC3173]/5 text-[#DC3173]"
              : "border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
          >
            {selectMode ? (
              <>
                <X className="h-4 w-4" />
                {t("cancel")}
              </>
            ) : (
              <>
                <CheckSquare className="h-4 w-4" />
                {t("select")}
              </>
            )}
          </button>
        )}
      </div>

      {updatingList && (
        <div role="status" aria-live="polite" className="shrink-0 -mt-2 mb-3 flex items-center gap-2 text-sm text-gray-500">
          <LoaderCircle className="h-4 w-4 animate-spin text-[#DC3173]" />
          {t("updating_list")}
        </div>
      )}

      {/* The selection bar. Sticky above the grid rather than floating over it,
          so it never covers the last row of cards. */}
      {selectMode && (
        <div className="shrink-0 mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#DC3173]/30 bg-[#DC3173]/5 px-4 py-3">
          <div className="text-sm text-gray-700">
            {selectionCount > 0 ? (
              <span className="font-medium">
                {selectionCount} {t("selected")}
                {copyAll && (
                  <span className="font-normal text-muted-foreground">
                    {" "}
                    — {t("all_products_in_catalogue")}
                  </span>
                )}
              </span>
            ) : (
              <span className="text-muted-foreground">
                {t("select_items_to_copy")}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setSelectedIds([]);
                setCopyAll((prev) => !prev);
              }}
              className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${copyAll
                ? "border-[#DC3173] bg-[#DC3173]/10 text-[#DC3173]"
                : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                }`}
            >
              {t("select_all_products")}
            </button>

            {selectionCount > 0 && (
              <button
                type="button"
                onClick={clearSelection}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                {t("clear")}
              </button>
            )}

            <button
              type="button"
              disabled={selectionCount === 0}
              onClick={() => setIsCopyOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-[#DC3173] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#c71d62] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <SquaresSubtract className="h-4 w-4" />
              {t("copy_to_branch")}
            </button>
          </div>
        </div>
      )}

      {/* Main content area – takes remaining height */}
      {groupedProducts.length > 0 ? (
        <div
          aria-busy={updatingList}
          className={`flex flex-col lg:flex-row flex-1 min-h-0 gap-6 lg:overflow-hidden transition-opacity ${updatingList ? "opacity-50 pointer-events-none" : ""}`}
        >
          {/* LEFT SIDEBAR – fixed, scrolls independently if needed */}
          {/* Below `lg` the sidebar is hidden and nothing replaced it, so a
              phone had no way to jump between categories at all. Same groups,
              same scroll target — laid out as a scrollable strip because a
              vertical list would push the products off the screen again. */}
          <div className="lg:hidden -mx-1 flex gap-2 overflow-x-auto px-1 pb-1 no-scrollbar">
            {groupedProducts.map((group) => {
              const id = group.category?._id || "uncategorized";
              const isActive = activeCategoryId === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => scrollToCategory(id)}
                  className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium uppercase tracking-wide transition-colors ${isActive
                    ? "bg-[#DC3173]/10 text-[#DC3173]"
                    : "bg-gray-100 text-gray-600"
                    }`}
                >
                  {getCategoryName(group.category)} ({group.products.length})
                </button>
              );
            })}
          </div>

          <div className="hidden lg:block w-64 shrink-0 h-full overflow-y-auto deligo-scroll">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sticky top-0">
              <h3 className="text-sm font-semibold text-gray-800 mb-3">
                {t("product_categories") || "Product categories"}
              </h3>

              <div className="space-y-1">
                {groupedProducts.map((group) => {
                  const id = group.category?._id || "uncategorized";
                  const isActive = activeCategoryId === id;

                  return (
                    <button
                      key={id}
                      onClick={() => {
                        setPickedCategoryId(id);
                        scrollToCategory(id)
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive
                        ? "bg-[#DC3173]/10 text-[#DC3173]"
                        : "text-gray-600 hover:bg-gray-50"
                        }`}
                    >
                      <span className="truncate uppercase tracking-wide">
                        {getCategoryName(group.category)}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${isActive
                          ? "bg-[#DC3173]/15 text-[#DC3173]"
                          : "bg-gray-100 text-gray-500"
                          }`}
                      >
                        {group.products.length}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT CONTENT – the one scroller.
              There used to be two, nested, with identical classes: the wheel
              handed off between them and `scrollIntoView` moved whichever one
              it found first, which is what made this list feel like it fought
              back. `scroll-smooth` replaces the per-call behaviour so a click
              and a drag agree. */}
          {/* The list's own scroller, with the portal's pink scrollbar. Safe to
              be a scroller now only because the block above fits its slot, so
              `main` is not competing for the same wheel. */}
          <div
            ref={scrollContainerRef}
            className="flex-1 min-w-0 lg:h-full lg:overflow-y-auto scroll-smooth space-y-10 pr-1 deligo-scroll"
          >
            {/* 🔴 Columns are counted from *this* box, and they stop at three.

                They used to be `sm:grid-cols-2 xl:grid-cols-3` — viewport
                widths — while the cards live in a pane whose width also depends
                on the sidebar, 20% of the screen expanded and 5rem collapsed. A
                window past `xl` therefore committed to three columns while the
                pane was only ~1000px. `@container` asks the pane instead, so
                collapsing the sidebar is a change the grid can see.

                The thresholds come from what a card actually needs, which is
                less than it looks: the widest row in it is the buttons (tick,
                View, Edit, Delete) at ~200px, plus `p-4`. Three columns from
                50rem therefore leaves ~253px per card and two from 36rem leaves
                ~278px — both comfortable, and the price no longer fights for
                the line since the VAT moved onto its own.

                Capped at three on purpose. An intrinsic `auto-fill` grid would
                keep adding columns on a wide monitor; three is the layout this
                page is designed around, so beyond 50rem the cards get roomier
                rather than more numerous. */}
            <div className="@container space-y-10">
              {groupedProducts.map((group) => {
                const id = group.category?._id || "uncategorized";

                return (
                  <div
                    key={id}
                    id={`category-${id}`}
                    ref={(el) => {
                      sectionRefs.current[id] = el;
                    }}
                    /* Clearance under the fixed topbar when the *page* is what
                       scrolls. At `lg` the list has its own pane, whose top is
                       already below the topbar, so a margin there would land
                       every jump 96px short of the heading. */
                    className="scroll-mt-24 lg:scroll-mt-0 rounded-xl"
                  >
                    <div className="p-2">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <h2 className="text-xl font-bold text-gray-800 uppercase tracking-wide truncate">
                            {getCategoryName(group.category)}
                          </h2>
                          {selectMode && !copyAll && ( // every card is already ticked in "all products"
                            <button
                              type="button"
                              onClick={() => toggleCategory(group.products)}
                              className="shrink-0 rounded-lg border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50"
                            >
                              {isCategoryFullySelected(group.products)
                                ? t("deselect_all")
                                : t("select_all")}
                            </button>
                          )}
                        </div>
                        <span className="text-sm text-gray-500">
                          {group.products.length}{" "}
                          {group.products.length === 1
                            ? t("item") || "item"
                            : t("items") || "items"}
                        </span>
                      </div>

                      <motion.div
                        layout
                        className="grid auto-rows-fr grid-cols-1 @xl:grid-cols-2 @min-[50rem]:grid-cols-3 gap-5"
                      >
                        <AnimatePresence mode="popLayout">
                          {group.products.map((product) => (
                            <ProductCard
                              key={product._id}
                              product={product}
                              onDelete={openDeleteDialog}
                              onEdit={onEditClick}
                              t={t}
                              selectable={selectMode}
                              // "All products" ticks every card: the bar says the
                              // whole catalogue is going, and cards showing no tick
                              // underneath it read as nothing being selected.
                              selected={copyAll || selectedIds.includes(productCode(product))}
                              onToggleSelect={toggleProduct}
                            />
                          ))}
                        </AnimatePresence>
                      </motion.div>
                    </div>
                  </div>
                );
              })}
            </div>
            {/* {groupedProducts.map((group) => {
              const id = group.category?._id || "uncategorized";

              return (
                <div key={id} id={`category-${id}`} className="rounded-xl">
                  <div className="p-2">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-bold text-gray-800 uppercase tracking-wide">
                        {getCategoryName(group.category)}
                      </h2>
                      <span className="text-sm text-gray-500">
                        {group.products.length}{" "}
                        {group.products.length === 1
                          ? t("item") || "item"
                          : t("items") || "items"}
                      </span>
                    </div>

                    <motion.div
                      layout
                      className="grid auto-rows-fr grid-cols-1 @xl:grid-cols-2 @min-[50rem]:grid-cols-3 gap-5"
                    >
                      <AnimatePresence mode="popLayout">
                        {group.products.map((product) => (
                          <ProductCard
                            key={product._id}
                            product={product}
                            onDelete={openDeleteDialog}
                            onEdit={onEditClick}
                            t={t}
                          />
                        ))}
                      </AnimatePresence>
                    </motion.div>
                  </div>
                </div>
              );
            })} */}
          </div>
        </div>
      ) : (
        <div
          aria-busy={updatingList}
          className={`flex-1 flex flex-col items-center justify-center py-16 text-center transition-opacity ${updatingList ? "opacity-50" : ""}`}
        >
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-medium mb-2">{t("no_items_found")}</h3>
          <p className="text-gray-500 max-w-md">
            {t("no_items_match_current_filters")}
          </p>
        </div>
      )}

      {/* Dialogs */}
      <DeleteProductDialog
        open={!!selectedProduct.id && selectedProduct.action === "delete"}
        onOpenChange={() =>
          setSelectedProduct({ id: null, action: null, product: null })
        }
        onConfirm={handleDeleteProduct}
        t={t}
      />
      <CopyToBranchDialog
        open={isCopyOpen}
        onOpenChange={setIsCopyOpen}
        productIds={copyAll ? [] : selectedIds}
        copyAllProducts={copyAll}
        branches={branches}
        t={t}
        onCopied={exitSelectMode}
      />
      <EditProductDialog
        open={!!selectedProduct.id && selectedProduct.action === "edit"}
        onOpenChange={() =>
          setSelectedProduct({ id: null, action: null, product: null })
        }
        prevData={selectedProduct?.product as TProduct}
        businessTypeSlug={businessTypeSlug}
      />
    </div>
  );
}