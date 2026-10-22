"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    Announcements,
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    DropAnimation,
    KeyboardSensor,
    MouseSensor,
    TouchSensor,
    closestCenter,
    defaultDropAnimationSideEffects,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    SortableContext,
    arrayMove,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis, restrictToWindowEdges } from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
    CheckIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    Edit3Icon,
    EyeIcon,
    GripVerticalIcon,
    Loader2Icon,
    Trash2Icon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTranslation } from "@/src/hooks/use-translation";
import { useListNavigation } from "@/src/hooks/use-list-navigation";
import { TProductCategory } from "@/src/types/category.type";
import { reorderProductCategoryReq } from "@/src/services/dashboard/categories/product-categories";
import { categoryIcons } from "./categoryIcons";

/**
 * The vendor's categories, in the order customers see them, dragged (or moved
 * with ↑ / ↓) straight into a new order.
 *
 * The whole list, unpaged: a move is sent as a place in the whole order
 * (1-based), which a page of it can't give. For the same reason dragging is
 * off while a search narrows the list.
 *
 * Each move is saved on its own, in turn: a second drag made while the first
 * is still saving waits for it, so the server applies them in the order they
 * were made. The list moves at once and takes the server's word afterwards.
 */

type Pulse = { id: string; kind: "saved" | "failed"; n: number };

type IProps = {
    categories: TProductCategory[];
    searchTerm: string;
    onView: (category: TProductCategory) => void;
    onEdit: (category: TProductCategory) => void;
    onDelete: (category: TProductCategory) => void;
};

const nameOf = (category: TProductCategory | undefined, lang: string) =>
    category?.name?.[lang as "en" | "pt"] || category?.name?.en || category?.name?.pt || "";

const fill = (text: string, values: Record<string, string | number>) =>
    Object.entries(values).reduce((out, [key, value]) => out.replace(`{${key}}`, String(value)), text);

/** A category's icon tile, fixed by its id so it keeps its colour when it moves. */
const iconFor = (id: string) =>
    categoryIcons[[...id].reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % categoryIcons.length];

const SortableCategoryList = ({ categories, searchTerm, onView, onEdit, onDelete }: IProps) => {
    const { t, lang } = useTranslation();
    const router = useRouter();
    const reducedMotion = useReducedMotion() ?? false;
    // True while a search change is loading the page again.
    const { isPending: updatingList } = useListNavigation();

    const [items, setItems] = useState<TProductCategory[]>(categories);
    const [source, setSource] = useState<TProductCategory[]>(categories);
    const [activeId, setActiveId] = useState<string | null>(null);
    // Layout animation is for the ↑ / ↓ buttons only. On a drag, dnd-kit
    // already moves the rows, and a second animation would replay the move.
    const [buttonMove, setButtonMove] = useState(false);
    const [pulse, setPulse] = useState<Pulse | null>(null);
    const [pending, setPending] = useState(0);
    const [savedTick, setSavedTick] = useState(0);

    const queue = useRef<Promise<void>>(Promise.resolve());
    const pendingRef = useRef(0);

    // A new list from the server (after a save, an edit or a delete) replaces
    // the one on screen, but not while moves are still saving: it would undo
    // the ones that haven't answered yet. It is taken once they have.
    if (categories !== source && pending === 0) {
        setSource(categories);
        setItems(categories);
    }

    // "Saved" shows for a moment after the last save.
    useEffect(() => {
        if (!savedTick) return;
        const timer = setTimeout(() => setSavedTick(0), 1500);
        return () => clearTimeout(timer);
    }, [savedTick]);

    const query = searchTerm.trim().toLowerCase();
    const shown = useMemo(
        () =>
            query
                ? items.filter((category) =>
                    [category.name?.en, category.name?.pt].some((name) => name?.toLowerCase().includes(query)),
                )
                : items,
        [items, query],
    );
    const canDrag = !query && items.length > 1;

    const flash = (id: string, kind: Pulse["kind"]) =>
        setPulse((previous) => ({ id, kind, n: (previous?.n ?? 0) + 1 }));

    const save = (category: TProductCategory, position: number, before: TProductCategory[]) => {
        pendingRef.current += 1;
        setPending(pendingRef.current);

        const run = async () => {
            // A request that never answers (the network dropped) throws rather
            // than failing; it must still count down.
            const result = await reorderProductCategoryReq(category._id, position).catch(() => null);
            let kind: Pulse["kind"] = "saved";

            if (!result?.success) {
                kind = "failed";
                toast.error(result?.message || t("arrange_order_failed"));
                // Back to the list as it was before this move; the server's own
                // list follows once nothing is saving.
                if (pendingRef.current === 1) setItems(before);
                router.refresh();
            } else {
                const placed = Number(result.data?.displayOrder);
                // The API caps a move at its count of active categories; the
                // server's list shows where the category really went.
                if (placed && placed !== position) {
                    toast.info(fill(t("arrange_order_capped"), { position: placed }));
                    router.refresh();
                }
            }

            pendingRef.current -= 1;
            setPending(pendingRef.current);
            flash(category._id, kind);
            if (kind === "saved" && pendingRef.current === 0) setSavedTick(Date.now());
        };

        queue.current = queue.current.then(run, run);
    };

    const move = (from: number, to: number) => {
        if (!canDrag || from === to || to < 0 || to >= items.length) return;
        const category = items[from];
        setItems((current) => arrayMove(current, from, to));
        save(category, to + 1, items);
    };

    const sensors = useSensors(
        useSensor(MouseSensor, { activationConstraint: { distance: 4 } }),
        // A short press first, so a finger can still scroll the page.
        useSensor(TouchSensor, { activationConstraint: { delay: 180, tolerance: 8 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
    );

    const ids = useMemo(() => items.map((category) => category._id), [items]);
    const indexOf = (id: string | number) => ids.indexOf(String(id));
    const byId = (id: string | number) => items.find((category) => category._id === String(id));

    const onDragStart = ({ active }: DragStartEvent) => {
        setButtonMove(false);
        setActiveId(String(active.id));
    };

    const onDragEnd = ({ active, over }: DragEndEvent) => {
        setActiveId(null);
        if (!over) return;
        move(indexOf(active.id), indexOf(over.id));
    };

    const announcements: Announcements = {
        onDragStart: ({ active }) =>
            fill(t("arrange_order_picked_up"), {
                name: nameOf(byId(active.id), lang),
                position: indexOf(active.id) + 1,
                total: items.length,
            }),
        onDragOver: ({ active, over }) =>
            over
                ? fill(t("arrange_order_moved_over"), {
                    name: nameOf(byId(active.id), lang),
                    position: indexOf(over.id) + 1,
                    total: items.length,
                })
                : undefined,
        onDragEnd: ({ active, over }) =>
            fill(t("arrange_order_dropped"), {
                name: nameOf(byId(active.id), lang),
                position: (over ? indexOf(over.id) : indexOf(active.id)) + 1,
                total: items.length,
            }),
        onDragCancel: ({ active }) =>
            fill(t("arrange_order_cancelled"), {
                name: nameOf(byId(active.id), lang),
                position: indexOf(active.id) + 1,
            }),
    };

    const dropAnimation: DropAnimation | null = reducedMotion
        ? null
        : {
            duration: 260,
            // A slight overshoot: the card settles into its slot.
            easing: "cubic-bezier(0.18, 0.89, 0.32, 1.18)",
            sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: "0" } } }),
        };

    const active = activeId ? byId(activeId) : undefined;

    if (items.length === 0 || shown.length === 0) {
        return <div className="py-10 text-center text-gray-500">{t("no_categories_found")}</div>;
    }

    return (
        <div className="space-y-4">
            {/* What dragging does, and how the last save went. */}
            <div className="flex min-h-7 flex-wrap items-center justify-between gap-x-4 gap-y-1 px-1">
                {updatingList ? (
                    <p role="status" aria-live="polite" className="flex items-center gap-2 text-sm text-slate-500">
                        <Loader2Icon className="h-4 w-4 shrink-0 animate-spin text-[#DC3173]" />
                        {t("updating_list")}
                    </p>
                ) : (
                    <p className="flex items-center gap-2 text-sm text-slate-500">
                        <GripVerticalIcon className="h-4 w-4 shrink-0 text-[#DC3173]" aria-hidden />
                        {query ? t("arrange_order_search_note") : t("arrange_order_help")}
                    </p>
                )}
                <span role="status" aria-live="polite" className="inline-flex h-7 items-center">
                    <AnimatePresence mode="wait" initial={false}>
                        {pending > 0 ? (
                            <motion.span
                                key="saving"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500"
                            >
                                <Loader2Icon className="h-3.5 w-3.5 animate-spin" />
                                {t("arrange_order_saving")}
                            </motion.span>
                        ) : savedTick ? (
                            <motion.span
                                key="saved"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800"
                            >
                                <CheckIcon className="h-3.5 w-3.5" />
                                {t("arrange_order_saved")}
                            </motion.span>
                        ) : null}
                    </AnimatePresence>
                </span>
            </div>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
                onDragCancel={() => setActiveId(null)}
                accessibility={{
                    announcements,
                    screenReaderInstructions: { draggable: t("arrange_order_instructions") },
                }}
            >
                <SortableContext items={ids} strategy={verticalListSortingStrategy}>
                    {/* While a search loads, the current list stays, dimmed. */}
                    <ul
                        aria-busy={updatingList}
                        className={`space-y-4 transition-opacity ${updatingList ? "pointer-events-none opacity-50" : ""}`}
                    >
                        {shown.map((category, i) => {
                            const index = indexOf(category._id);
                            return (
                                <SortableRow
                                    key={category._id}
                                    category={category}
                                    index={index}
                                    total={items.length}
                                    enterOrder={i}
                                    canDrag={canDrag}
                                    pulse={pulse?.id === category._id ? pulse : null}
                                    animateLayout={buttonMove}
                                    reducedMotion={reducedMotion}
                                    onMove={(to) => {
                                        setButtonMove(true);
                                        move(index, to);
                                    }}
                                    onView={() => onView(category)}
                                    onEdit={() => onEdit(category)}
                                    onDelete={() => onDelete(category)}
                                />
                            );
                        })}
                    </ul>
                </SortableContext>

                <DragOverlay dropAnimation={dropAnimation}>
                    {active ? (
                        <CategoryCard
                            category={active}
                            position={indexOf(active._id) + 1}
                            total={items.length}
                            lifted
                            reducedMotion={reducedMotion}
                        />
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
};

type SortableRowProps = {
    category: TProductCategory;
    index: number;
    total: number;
    enterOrder: number;
    canDrag: boolean;
    pulse: Pulse | null;
    animateLayout: boolean;
    reducedMotion: boolean;
    onMove: (to: number) => void;
    onView: () => void;
    onEdit: () => void;
    onDelete: () => void;
};

const SortableRow = ({
    category,
    index,
    total,
    enterOrder,
    canDrag,
    pulse,
    animateLayout,
    reducedMotion,
    onMove,
    onView,
    onEdit,
    onDelete,
}: SortableRowProps) => {
    const { t, lang } = useTranslation();
    const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } =
        useSortable({ id: category._id, disabled: !canDrag });
    const name = nameOf(category, lang);

    return (
        <li
            ref={setNodeRef}
            className="relative"
            style={{
                transform: CSS.Translate.toString(transform),
                transition: reducedMotion ? undefined : transition,
            }}
        >
            {/* The slot the lifted card will drop into. */}
            {isDragging && (
                <div
                    aria-hidden
                    className="absolute inset-0 rounded-3xl border-2 border-dashed border-[#DC3173]/40 bg-[#DC3173]/5"
                />
            )}
            <motion.div
                layout={animateLayout && !reducedMotion ? "position" : false}
                transition={{ type: "spring", stiffness: 520, damping: 38 }}
                className={isDragging ? "invisible" : undefined}
            >
                <CategoryCard
                    category={category}
                    position={index + 1}
                    total={total}
                    pulse={pulse}
                    reducedMotion={reducedMotion}
                    // Cards come in one after another when the page opens.
                    enterDelay={reducedMotion ? 0 : Math.min(enterOrder, 15) * 0.03}
                    handle={
                        <button
                            type="button"
                            ref={setActivatorNodeRef}
                            {...attributes}
                            {...listeners}
                            disabled={!canDrag}
                            aria-label={`${t("arrange_order_drag")}: ${name}`}
                            title={canDrag ? t("arrange_order_drag") : t("arrange_order_search_note")}
                            className="flex h-12 w-8 shrink-0 cursor-grab touch-manipulation items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-[#DC3173]/5 hover:text-[#DC3173] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DC3173]/40 active:cursor-grabbing disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400"
                        >
                            <GripVerticalIcon className="h-5 w-5" />
                        </button>
                    }
                    actions={
                        <>
                            <div className="flex items-center gap-1.5">
                                <IconButton
                                    label={`${t("arrange_order_move_up")}: ${name}`}
                                    title={t("arrange_order_move_up")}
                                    disabled={!canDrag || index === 0}
                                    onClick={() => onMove(index - 1)}
                                >
                                    <ChevronUpIcon className="h-4 w-4" />
                                </IconButton>
                                <IconButton
                                    label={`${t("arrange_order_move_down")}: ${name}`}
                                    title={t("arrange_order_move_down")}
                                    disabled={!canDrag || index === total - 1}
                                    onClick={() => onMove(index + 1)}
                                >
                                    <ChevronDownIcon className="h-4 w-4" />
                                </IconButton>
                            </div>
                            <span aria-hidden className="mx-1 hidden h-6 w-px bg-slate-200 sm:block" />
                            <div className="flex items-center gap-1.5">
                                <IconButton label={t("view_category")} title={t("view_category")} onClick={onView}>
                                    <EyeIcon className="h-4 w-4" />
                                </IconButton>
                                <IconButton label={t("edit_category")} title={t("edit_category")} onClick={onEdit}>
                                    <Edit3Icon className="h-4 w-4" />
                                </IconButton>
                                {/* To the vendor this is just "delete"; the call is a
                                    soft delete, so only an admin can restore or
                                    permanently delete it. */}
                                <IconButton label={t("delete")} title={t("delete")} onClick={onDelete} danger>
                                    <Trash2Icon className="h-4 w-4" />
                                </IconButton>
                            </div>
                        </>
                    }
                />
            </motion.div>
        </li>
    );
};

const IconButton = ({
    label,
    title,
    disabled = false,
    danger = false,
    onClick,
    children,
}: {
    label: string;
    title: string;
    disabled?: boolean;
    danger?: boolean;
    onClick: () => void;
    children: React.ReactNode;
}) => (
    <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        aria-label={label}
        title={title}
        className={`rounded-xl border border-slate-200 p-2.5 text-slate-600 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DC3173]/40 disabled:pointer-events-none disabled:opacity-30 ${danger
            ? "hover:border-red-200 hover:bg-red-50 hover:text-red-600"
            : "hover:border-[#DC3173]/30 hover:bg-[#DC3173]/5 hover:text-[#DC3173]"
            }`}
    >
        {children}
    </button>
);

type CategoryCardProps = {
    category: TProductCategory;
    position: number;
    total: number;
    reducedMotion: boolean;
    pulse?: Pulse | null;
    lifted?: boolean;
    enterDelay?: number;
    handle?: React.ReactNode;
    actions?: React.ReactNode;
};

/** One category, as it sits in the list or as it is lifted by a drag. */
const CategoryCard = ({
    category,
    position,
    total,
    reducedMotion,
    pulse,
    lifted,
    enterDelay = 0,
    handle,
    actions,
}: CategoryCardProps) => {
    const { t, lang } = useTranslation();
    const icon = iconFor(category._id);
    const positionLabel = fill(t("arrange_order_position"), { position, total });

    // Saved: a pale pink wash that fades out. Failed: a short shake.
    const pulseAnimation =
        pulse?.kind === "saved"
            ? { backgroundColor: ["#FFE1E9", "#FFFFFF"] }
            : pulse?.kind === "failed" && !reducedMotion
                ? { x: [0, -8, 8, -5, 5, 0] }
                : undefined;

    return (
        <motion.div
            key={pulse ? `${pulse.kind}-${pulse.n}` : "card"}
            initial={lifted ? { scale: 1 } : pulse ? false : { opacity: 0, y: 12 }}
            animate={
                lifted
                    ? { scale: reducedMotion ? 1 : 1.02 }
                    : { opacity: 1, y: 0, ...(pulseAnimation ?? {}) }
            }
            transition={
                pulse
                    ? { duration: pulse.kind === "saved" ? 1.1 : 0.4, ease: "easeOut" }
                    : { duration: reducedMotion ? 0 : 0.25, delay: enterDelay }
            }
            className={`flex flex-wrap items-center gap-x-3 gap-y-3 rounded-3xl border bg-white py-4 pl-2 pr-4 sm:py-5 sm:pr-5 ${lifted ? "cursor-grabbing border-[#DC3173] ring-2 ring-[#DC3173]/70" : ""
                }`}
            style={{
                boxShadow: lifted
                    ? "0px 18px 40px rgba(220,49,115,0.18), 0px 6px 14px rgba(0,0,0,0.08)"
                    : "0px 4px 20px rgba(0,0,0,0.06)",
            }}
        >
            {/* The name takes what's left (at least 12rem); below that the
                actions wrap under it instead of past the edge. */}
            <div className="flex min-w-0 flex-1 basis-56 items-center gap-2 sm:gap-3">
                {handle ?? (
                    <span className="flex h-12 w-8 shrink-0 items-center justify-center text-[#DC3173]">
                        <GripVerticalIcon className="h-5 w-5" />
                    </span>
                )}

                {/* Position: counts to its new value when the card moves. */}
                <span
                    className="relative flex h-8 min-w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#DC3173]/10 px-2 text-sm font-bold tabular-nums text-[#DC3173]"
                    title={positionLabel}
                >
                    <span className="sr-only">{positionLabel}</span>
                    <AnimatePresence mode="popLayout" initial={false}>
                        <motion.span
                            aria-hidden
                            key={position}
                            initial={reducedMotion ? false : { y: -14, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={reducedMotion ? undefined : { y: 14, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            {position}
                        </motion.span>
                    </AnimatePresence>
                </span>

                <div
                    className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl sm:flex"
                    style={{ background: icon.color, boxShadow: "inset 0px 0px 6px rgba(0,0,0,0.05)" }}
                    aria-hidden
                >
                    {icon.icon}
                </div>

                <div className="min-w-0 sm:ml-1">
                    <div className="text-lg font-semibold text-slate-900 wrap-anywhere sm:text-xl">
                        {nameOf(category, lang)}
                    </div>
                    <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${category.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}
                    >
                        {category.isActive ? t("active") : t("inactive")}
                    </span>
                </div>
            </div>

            {actions && <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">{actions}</div>}
        </motion.div>
    );
};

export default SortableCategoryList;
