"use client";

import DeleteProductDialog from "@/src/components/Dashboard/Products/DeleteProductDialog";
import EditProductDialog from "@/src/components/Dashboard/Products/EditProductDialog";
import ProductCard from "@/src/components/Dashboard/Products/ProductCard";
import AllFilters from "@/src/components/Filtering/AllFilters";
import { useListNavigation } from "@/src/hooks/use-list-navigation";
import { useTranslation } from "@/src/hooks/use-translation";
import { useStore } from "@/src/store/store";
import {
  deleteProductReq,
  getCategoryProductsPage,
  getOtherProducts,
} from "@/src/services/dashboard/products/products";
import { TProductCategory } from "@/src/types/category.type";
import { TProduct } from "@/src/types/product.type";
import { TVendor } from "@/src/types/vendor.type";
import CopyToBranchDialog from "@/src/components/Dashboard/Products/CopyToBranchDialog";
import { approvedBranches, productCode } from "@/src/utils/productCopy";
import { CheckSquare, LoaderCircle, Search, SquaresSubtract, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import {
  appendPage,
  hasMore,
  localizedText,
  OTHER_SECTION_ID,
  type TCatalogueFilters,
} from "@/src/utils/catalogueSections";
import { toast } from "sonner";
import TitleHeader from "../../TitleHeader/TitleHeader";

/** What the server hands over: the categories in order, and the first page. */
export type TCatalogue = {
  /** Every product the filters match, for "Select all products". */
  total: number;
  /** Every category, in display order (see `orderCategories`). */
  categoryIds: string[];
  first: { categoryId: string; data: TProduct[]; total: number } | null;
};

/** One category's section: its count, and what has been loaded of it so far. */
type TSection = {
  id: string;
  category: TProductCategory | null;
  /** Unknown (`null`, shown as "–") until the section's first page arrives. */
  total: number | null;
  items: TProduct[];
  /** Pages loaded; 0 until the section first comes into view. */
  page: number;
  loading: boolean;
  error: string | null;
};

function sectionsFrom(catalogue: TCatalogue, categories: TProductCategory[]): TSection[] {
  const byId = new Map(categories.map((category) => [category._id, category]));
  return catalogue.categoryIds.map((categoryId) => {
    const first = catalogue.first?.categoryId === categoryId ? catalogue.first : null;
    return {
      id: categoryId,
      category: byId.get(categoryId) ?? null,
      total: first ? first.total : null,
      items: first?.data ?? [],
      page: first ? 1 : 0,
      loading: false,
      error: null,
    };
  });
}

interface IProps {
  catalogue: TCatalogue;
  filters: TCatalogueFilters;
  businessTypeSlug: string;
  productCategories: TProductCategory[];
  /** Copy targets. Empty when the vendor has none, which hides the whole feature. */
  branches: TVendor[];
}

export default function Products({
  catalogue,
  filters,
  businessTypeSlug,
  productCategories,
  branches,
}: IProps) {
  const { t } = useTranslation();
  // Collation and the name half both follow the language the vendor is reading.
  const { lang } = useStore();
  const [sections, setSections] = useState<TSection[]>(() => sectionsFrom(catalogue, productCategories));
  // The trailing "Other" section: looked for once, after the last category.
  const [other, setOther] = useState<{ status: "idle" | "loading" | "done" | "error"; items: TProduct[] }>({
    status: "idle",
    items: [],
  });
  // Requests in flight, by section, so a sentinel seen twice loads once.
  const inFlight = useRef(new Set<string>());
  // While a jump from the category box is scrolling, only its target loads:
  // the sections it passes on the way would otherwise queue ahead of it.
  const [jumpTarget, setJumpTarget] = useState<string | null>(null);
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

  /**
   * The next page of a section. Sentinels at the bottom of each section call
   * this as they come into view; a section first seen empty loads its page 1
   * the same way, so a category only costs a request once it is reached.
   */
  // The latest sections, for the background loader, which runs outside render.
  const sectionsRef = useRef(sections);
  useEffect(() => {
    sectionsRef.current = sections;
  }, [sections]);

  const loadNext = useCallback(
    async (id: string): Promise<{ ok: boolean; busy: boolean } | null> => {
      const section = sectionsRef.current.find((s) => s.id === id);
      if (!section || inFlight.current.has(id) || !hasMore(section.items.length, section.total)) return null;
      inFlight.current.add(id);
      setSections((prev) => prev.map((s) => (s.id === id ? { ...s, loading: true, error: null } : s)));
      // Never left hanging: a server action that throws, or whose reply never
      // comes (Next can drop a queued action), becomes an error with Retry.
      // Before, the section stayed "loading" for good, and every category
      // after it waited behind it.
      const result = await settle(getCategoryProductsPage(id, section.page + 1, filters));
      inFlight.current.delete(id);
      setSections((prev) =>
        prev.map((s) => {
          if (s.id !== id) return s;
          if (!result.success) return { ...s, loading: false, error: result.message };
          const items = appendPage(s.items, result.data);
          // A page that adds nothing new ends the section, whatever the count
          // said: otherwise a stale total would ask for the same page forever.
          // The first page is where an unknown count becomes known.
          const total = items.length === s.items.length && s.page > 0 ? items.length : Math.max(result.total, items.length);
          return { ...s, items, total, page: s.page + 1, loading: false };
        }),
      );
      return result.success ? { ok: true, busy: false } : { ok: false, busy: "busy" in result && !!result.busy };
    },
    [filters],
  );

  /** Every remaining page of a section, for "Select all" in it. Returns its products. */
  const loadAll = async (id: string): Promise<TProduct[]> => {
    const section = sections.find((s) => s.id === id);
    if (!section) return [];
    let { items, page } = section;
    let total = section.total;
    while (hasMore(items.length, total)) {
      const result = await settle(getCategoryProductsPage(id, page + 1, filters));
      if (!result.success) break;
      const next = appendPage(items, result.data);
      total = Math.max(result.total, next.length);
      if (next.length === items.length) break;
      items = next;
      page += 1;
    }
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, items, page, total: total ?? items.length } : s)));
    return items;
  };

  const loadOther = useCallback(async () => {
    if (other.status !== "idle") return;
    setOther({ status: "loading", items: [] });
    const result = await settle(
      getOtherProducts(
        productCategories.map((category) => category._id),
        filters,
      ),
      60_000,
    );
    setOther(result.success ? { status: "done", items: result.data } : { status: "error", items: [] });
  }, [other.status, productCategories, filters]);

  /**
   * Background loading: from the moment the page opens, categories load by
   * themselves, one request at a time and in order, so the vendor rarely meets
   * a loader when they scroll (manager's review, 6 Oct 2026).
   *
   * - **Two passes.** The first page of every category first, so the category
   *   box fills with counts within seconds; then the remaining pages, in order.
   * - **What the vendor asked for goes first.** A category jumped to from the
   *   box is next in line, and scrolling still loads what comes into view (the
   *   `LoadMore` path), which is never blocked by this.
   * - **Gentle on the backend.** One request at a time with `BACKGROUND_GAP_MS`
   *   between them; a 429 waits and backs off instead of piling on. Every
   *   vendor reaches the API from the Next server's one IP.
   * - **Paused while the tab is hidden**, and resumed when it's back.
   * - **Capped.** Past `BACKGROUND_LIMIT` products the rest load on scroll, as
   *   before, so a huge catalogue doesn't load in full unasked.
   * - **Not above the vendor where the browser can't anchor the scroll**
   *   (Safari): content growing above them would push the page down.
   */
  const jumpTargetRef = useRef<string | null>(null);
  useEffect(() => {
    jumpTargetRef.current = jumpTarget;
  }, [jumpTarget]);
  const loadNextRef = useRef(loadNext);
  const loadOtherRef = useRef(loadOther);
  const otherStatusRef = useRef(other.status);
  useEffect(() => {
    loadNextRef.current = loadNext;
    loadOtherRef.current = loadOther;
    otherStatusRef.current = other.status;
  });

  useEffect(() => {
    let stopped = false;
    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    const whenVisible = () =>
      document.visibilityState === "visible"
        ? Promise.resolve()
        : new Promise<void>((resolve) => {
            const onChange = () => {
              if (document.visibilityState !== "visible") return;
              document.removeEventListener("visibilitychange", onChange);
              resolve();
            };
            document.addEventListener("visibilitychange", onChange);
          });

    // Above the visible area, in a browser that can't keep the page still
    // while it grows.
    const aboveView = (id: string) => {
      if (ANCHORS_SCROLL) return false;
      const el = sectionRefs.current[id];
      const root = activeScroller();
      if (!el) return false;
      const top = root ? root.getBoundingClientRect().top : 0;
      return el.getBoundingClientRect().bottom < top;
    };

    const next = (): string | null => {
      const all = sectionsRef.current;
      const open = (s: TSection) => !s.error && !s.loading && !inFlight.current.has(s.id) && !aboveView(s.id);
      const target = all.find((s) => s.id === jumpTargetRef.current);
      if (target && open(target) && hasMore(target.items.length, target.total)) return target.id;
      const unseen = all.find((s) => s.page === 0 && s.total !== 0 && open(s));
      if (unseen) return unseen.id;
      const rest = all.find((s) => open(s) && hasMore(s.items.length, s.total));
      return rest?.id ?? null;
    };

    (async () => {
      await sleep(BACKGROUND_START_MS);
      let backoff = 0;
      while (!stopped) {
        await whenVisible();
        if (stopped) return;
        const loaded = sectionsRef.current.reduce((sum, s) => sum + s.items.length, 0);
        if (loaded >= BACKGROUND_LIMIT) return;
        const id = next();
        if (!id) {
          // Every category done (or waiting on a Retry): look for "Other" once.
          const done = sectionsRef.current.every((s) => !hasMore(s.items.length, s.total));
          if (done && otherStatusRef.current === "idle") await loadOtherRef.current();
          // Something on screen may still be loading, or a jump may come; check again shortly.
          if (done && otherStatusRef.current !== "idle" && otherStatusRef.current !== "loading") return;
          await sleep(1000);
          continue;
        }
        const result = await loadNextRef.current(id);
        if (result && !result.ok && result.busy) {
          // Rate limited: wait, and let the next round retry this section.
          backoff = Math.min(backoff ? backoff * 2 : 2000, 30_000);
          setSections((prev) => prev.map((s) => (s.id === id ? { ...s, error: null } : s)));
          await sleep(backoff);
          continue;
        }
        backoff = 0;
        await sleep(BACKGROUND_GAP_MS);
      }
    })();

    return () => {
      stopped = true;
    };
    // Starts once per list (a new search, sort or filter remounts this
    // component); everything it reads is a ref.
  }, []);

  // After an edit, the dialog calls `router.refresh()` and the server sends a
  // fresh catalogue (same filters, so this component is kept). The counts are
  // taken from it, and every page already loaded is fetched again in the
  // background, so the edited product shows its new state without the list
  // jumping back to the top.
  const firstCatalogue = useRef(catalogue);
  useEffect(() => {
    if (firstCatalogue.current === catalogue) return;
    firstCatalogue.current = catalogue;
    let cancelled = false;
    (async () => {
      const fresh = sectionsFrom(catalogue, productCategories);
      const loaded = new Map(sections.map((s) => [s.id, s.page]));
      for (const section of fresh) {
        const pages = loaded.get(section.id) ?? 0;
        let items: TProduct[] = [];
        let total: number | null = section.total;
        for (let page = 1; page <= pages; page++) {
          const result = await settle(getCategoryProductsPage(section.id, page, filters));
          if (cancelled || !result.success) break;
          items = appendPage(items, result.data);
          total = result.total;
        }
        if (pages > 0) Object.assign(section, { items, page: pages, total });
      }
      if (!cancelled) {
        setSections(fresh);
        setOther((prev) => (prev.status === "done" ? { status: "idle", items: [] } : prev));
      }
    })();
    return () => {
      cancelled = true;
    };
    // Only a new catalogue from the server starts this; `sections` is read as
    // it was then.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [catalogue]);

  /** What the page draws: sections with products, then "Other" if it has any. */
  const groupedProducts = useMemo(() => {
    // A category that turned out empty drops out once checked; until then it
    // is listed, with "–" for its count.
    const groups: { id: string; category: TProductCategory | null; products: TProduct[]; total: number | null; section: TSection | null }[] =
      sections
        .filter((s) => s.total !== 0)
        .map((s) => ({ id: s.id, category: s.category, products: s.items, total: s.total, section: s }));
    if (other.items.length > 0) {
      groups.push({ id: OTHER_SECTION_ID, category: null, products: other.items, total: other.items.length, section: null });
    }
    return groups;
  }, [sections, other.items]);

  const allSectionsLoaded = sections.every((s) => !hasMore(s.items.length, s.total));
  // Every category checked and none had a match (a search, say): the empty state.
  const nothingFound = catalogue.total === 0 || (allSectionsLoaded && groupedProducts.length === 0 && other.status === "done");

  // Derived, not stored: "nothing picked yet" means the first group, and an
  // effect that wrote that default back into state was a cascading render for
  // a value already knowable during render.
  const activeCategoryId =
    pickedCategoryId ?? groupedProducts[0]?.id ?? OTHER_SECTION_ID;

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
        const lastId = groupedProducts[groupedProducts.length - 1]?.id ?? OTHER_SECTION_ID;
        setPickedCategoryId((prev) => (prev === lastId ? prev : lastId));
        return;
      }

      // Otherwise the heading nearest the top wins, so a half-scrolled section
      // does not light up before it is the one being read.
      let current = groupedProducts[0]?.id ?? OTHER_SECTION_ID;
      for (const group of groupedProducts) {
        const id = group.id;
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
        // Gone from every section it was listed in (main and additional), and
        // each of those counts one less.
        const gone = (product: TProduct) => product.productId === selectedProduct.id;
        setSections((prev) =>
          prev.map((s) => (s.items.some(gone) ? { ...s, items: s.items.filter((p) => !gone(p)), total: Math.max(0, (s.total ?? 1) - 1) } : s)),
        );
        setOther((prev) => ({ ...prev, items: prev.items.filter((p) => !gone(p)) }));
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
    // the whole catalogue, and this page holds only what has been scrolled to.
    // So a tap here leaves the mode rather than turning it into "these 19",
    // which would silently drop everything not loaded yet.
    if (copyAll) {
      setCopyAll(false);
      setSelectedIds([]);
      return;
    }
    setSelectedIds((prev) =>
      prev.includes(code) ? prev.filter((id) => id !== code) : [...prev, code]
    );
  };

  const [selectingId, setSelectingId] = useState<string | null>(null);

  /**
   * "Select all" in a category means all of it, not only what has scrolled
   * into view: the rest of its pages load first (the button shows a spinner).
   */
  const toggleCategory = async (group: { id: string; products: TProduct[]; section: TSection | null }) => {
    let categoryProducts = group.products;
    const fullySelected = isCategoryFullySelected(categoryProducts);
    if (!fullySelected && group.section && hasMore(group.section.items.length, group.section.total)) {
      setSelectingId(group.id);
      categoryProducts = await loadAll(group.id);
      setSelectingId(null);
    }
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

  const selectionCount = copyAll ? catalogue.total : selectedIds.length;

  const scrollToCategory = (id: string) => {
    setPickedCategoryId(id);
    setJumpTarget(id);
    // The smooth scroll has arrived (or given up) by now; the sections on
    // screen are then free to load.
    window.setTimeout(() => setJumpTarget((current) => (current === id ? null : current)), 1200);
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
        {copyTargets.length > 0 && catalogue.total > 0 && (
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
      {!nothingFound ? (
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
              const id = group.id;
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
                  {getCategoryName(group.category)}{" "}
                  <CategoryCount total={group.total} loading={!!group.section?.loading} t={t} />
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
                  const id = group.id;
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
                        <CategoryCount total={group.total} loading={!!group.section?.loading} t={t} />
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
                const id = group.id;
                const section = group.section;

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
                              onClick={() => toggleCategory(group)}
                              disabled={selectingId === group.id}
                              className="shrink-0 inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-60"
                            >
                              {selectingId === group.id ? (
                                <LoaderCircle className="h-3 w-3 animate-spin" />
                              ) : null}
                              {isCategoryFullySelected(group.products) && !(section && hasMore(section.items.length, section.total))
                                ? t("deselect_all")
                                : t("select_all")}
                            </button>
                          )}
                        </div>
                        <span className="text-sm text-gray-500">
                          {group.total === null ? null : (
                            <>
                              {group.total}{" "}
                              {group.total === 1 ? t("item") || "item" : t("items") || "items"}
                            </>
                          )}
                        </span>
                      </div>

                      {/* A plain grid, not `<motion.div layout>` in
                          `<AnimatePresence mode="popLayout">`: every time a
                          page loaded into this or any section above, framer
                          slid the cards from their old place to the new one
                          with transforms. The browser's scroll anchoring kept
                          the page still, but the cards visibly jumped by
                          300-700px with no input (measured 6 Oct 2026). */}
                      <div className="grid auto-rows-fr grid-cols-1 @xl:grid-cols-2 @min-[50rem]:grid-cols-3 gap-5">
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
                      </div>

                      {/* Not reached yet: placeholder cards of the real cards'
                          shape, so the page doesn't jump when they arrive. */}
                      {section && section.items.length === 0 && !section.error ? (
                        <SkeletonRow />
                      ) : null}

                      {/* The rest of this category loads as this comes into view. */}
                      {section && (hasMore(section.items.length, section.total) || section.error) ? (
                        <LoadMore
                          loading={section.loading}
                          error={section.error}
                          paused={jumpTarget !== null && jumpTarget !== section.id}
                          getRoot={activeScroller}
                          quiet={section.items.length === 0}
                          onVisible={() => loadNext(section.id)}
                          t={t}
                        />
                      ) : null}
                    </div>
                  </div>
                );
              })}

              {/* After the last category: products in none of the vendor's
                  own categories, looked for once. */}
              {allSectionsLoaded && other.status !== "done" ? (
                <LoadMore
                  getRoot={activeScroller}
                  loading={other.status === "loading"}
                  error={other.status === "error" ? t("page_load_failed_body") : null}
                  onVisible={() => {
                    if (other.status === "error") setOther({ status: "idle", items: [] });
                    else loadOther();
                  }}
                  t={t}
                />
              ) : null}
            </div>
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
        productCategories={productCategories}
      />
    </div>
  );
}

/**
 * The bottom of a section that has more to load. Loads when it scrolls into
 * view, and again while it stays in view (a short page leaves it showing), so
 * the section fills until the vendor stops scrolling or it ends. A failed load
 * shows a Retry instead of trying again by itself, since retrying a 429 on its
 * own only adds to the load.
 */
/**
 * A server action's result, or a failure instead of a throw or a reply that
 * never comes.
 */
async function settle<R>(
  call: Promise<R>,
  ms = 20_000,
): Promise<R | { success: false; message: string; busy: boolean }> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<{ success: false; message: string; busy: boolean }>((resolve) => {
    timer = setTimeout(() => resolve({ success: false, message: "timeout", busy: false }), ms);
  });
  try {
    return await Promise.race([call, timeout]);
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : "Request failed", busy: false };
  } finally {
    clearTimeout(timer);
  }
}

/** How long a section's end must stay in view before it loads (see `LoadMore`). */
const DWELL_MS = 300;

/** Background loading (see the loader in `Products`): when it starts, the pause between requests, and where it stops. */
const BACKGROUND_START_MS = 400;
const BACKGROUND_GAP_MS = 150;
const BACKGROUND_LIMIT = 500;

/** Whether the browser does scroll anchoring (Chrome, Edge, Firefox; not Safari). */
const ANCHORS_SCROLL =
  typeof CSS !== "undefined" && typeof CSS.supports === "function" && CSS.supports("overflow-anchor", "auto");

/** How long a section scrolled past waits before loading the rest of itself. */
const PASSED_DWELL_MS = 1500;

/** How far below the visible area a section starts loading. */
const PREFETCH_PX = 600;

/**
 * A category's count in the box: "–" until it is reached, a spinner while its
 * first page loads, then the number.
 */
function CategoryCount({ total, loading, t }: { total: number | null; loading: boolean; t: (key: string) => string }) {
  if (total !== null) return <>{total}</>;
  if (loading) {
    return (
      <LoaderCircle
        role="status"
        aria-label={t("loading_more_items")}
        className="inline h-3 w-3 animate-spin align-[-2px]"
      />
    );
  }
  return <span aria-label={t("count_not_loaded")}>–</span>;
}

/** Three cards' worth of placeholder, the grid's own columns and height. */
function SkeletonRow() {
  return (
    <div aria-hidden="true" className="grid grid-cols-1 @xl:grid-cols-2 @min-[50rem]:grid-cols-3 gap-5">
      {[0, 1, 2].map((i) => (
        <div key={i} className={`overflow-hidden rounded-2xl border border-gray-100 bg-white ${i > 0 ? "hidden @xl:block" : ""} ${i > 1 ? "@xl:hidden @min-[50rem]:block" : ""}`}>
          <div className="h-44 animate-pulse bg-gray-100" />
          <div className="space-y-3 p-4">
            <div className="h-4 w-2/3 animate-pulse rounded bg-gray-100" />
            <div className="h-3 w-full animate-pulse rounded bg-gray-100" />
            <div className="h-5 w-1/3 animate-pulse rounded bg-gray-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

function LoadMore({
  loading,
  error,
  paused = false,
  getRoot,
  quiet = false,
  onVisible,
  t,
}: {
  loading: boolean;
  error: string | null;
  /** Held back while a jump scrolls past (see `jumpTarget`); watched again after. */
  paused?: boolean;
  /**
   * The element doing the scrolling (the list's pane at `lg`, `<main>` below).
   * Watching inside it is what lets the margin below reach past its edge.
   */
  getRoot: () => HTMLElement | null;
  /** The section's skeleton is already showing; no second loader under it. */
  quiet?: boolean;
  onVisible: () => void;
  t: (key: string) => string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const onVisibleRef = useRef(onVisible);
  const getRootRef = useRef(getRoot);
  useEffect(() => {
    onVisibleRef.current = onVisible;
    getRootRef.current = getRoot;
  });

  useEffect(() => {
    const el = ref.current;
    if (!el || loading || error || paused) return;
    // Re-created after every load, so a sentinel still in view fires again.
    // It has to stay in view for `DWELL_MS` first: a jump from the category
    // box scrolls past every unloaded section on the way, and each would
    // otherwise queue a load ahead of the one the vendor asked for (server
    // actions run one at a time).
    let timer: ReturnType<typeof setTimeout> | null = null;
    // `PREFETCH_PX` below the visible area: the next products are asked for
    // about a screen before they're needed, so scrolling rarely meets a spinner.
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[entries.length - 1];
        // Scrolled past (above the visible area) still loads, just later: a
        // category the vendor scrolled through quickly would otherwise stop at
        // its first 12, with a loader that only works if they scroll back.
        // The delay keeps it behind whatever is on screen.
        const passed =
          !entry.isIntersecting && !!entry.rootBounds && entry.boundingClientRect.bottom <= entry.rootBounds.top;
        if (timer) clearTimeout(timer);
        // Only where the browser keeps the page still when content above it
        // grows (scroll anchoring; Safari has none): there, loading a section
        // above the vendor would push what they're reading down the screen.
        const delay = entry.isIntersecting ? DWELL_MS : passed && ANCHORS_SCROLL ? PASSED_DWELL_MS : null;
        timer = delay === null ? null : setTimeout(() => onVisibleRef.current(), delay);
      },
      { root: getRootRef.current(), rootMargin: `0px 0px ${PREFETCH_PX}px 0px` },
    );
    observer.observe(el);
    return () => {
      if (timer) clearTimeout(timer);
      observer.disconnect();
    };
  }, [loading, error, paused]);

  return (
    <div
      ref={ref}
      className={quiet && !error ? "h-px" : "flex min-h-16 items-center justify-center py-4"}
      aria-live="polite"
    >
      {error ? (
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <span>{t("page_load_failed")}</span>
          <button
            type="button"
            onClick={() => onVisibleRef.current()}
            className="rounded-lg border border-[#DC3173] px-3 py-1 text-xs font-medium text-[#DC3173] hover:bg-[#DC3173]/5"
          >
            {t("retry")}
          </button>
        </div>
      ) : quiet ? null : (
        <span role="status" className="inline-flex items-center gap-2 text-sm text-gray-500">
          <LoaderCircle className="h-4 w-4 animate-spin text-[#DC3173]" />
          {t("loading_more_items")}
        </span>
      )}
    </div>
  );
}
