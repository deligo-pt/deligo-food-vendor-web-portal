import type { ReactNode } from "react";

/**
 * A table row as a card, for phones and tablets (7 Oct 2026). The shared
 * `ui/table.tsx` never wraps a cell, so a table on a phone was wider than the
 * screen and `<main>` cut it off; beside the sidebar a tablet leaves ~460px and
 * a 1024px laptop ~740px. Each table now renders its rows as these cards below
 * `lg` (or `xl`, for the wider tables) and itself from there up, calling the
 * same handlers in both.
 */

/** Where the table takes over from the cards: `lg` (1024px) or `xl` (1280px). */
type Until = "lg" | "xl";

/** The table's wrapper. Full class strings, so Tailwind sees them. */
export const TABLE_FROM: Record<Until, string> = {
  lg: "hidden lg:block print:block",
  xl: "hidden xl:block print:block",
};

const CARDS_UNTIL: Record<Until, string> = {
  lg: "lg:hidden print:hidden space-y-3",
  xl: "xl:hidden print:hidden space-y-3",
};

type Field = { label: string; value: ReactNode };

type CardProps = {
  /** Shown before the title: an avatar, usually. */
  leading?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  /** Top right: the status, usually. */
  aside?: ReactNode;
  fields: Field[];
  /** Under the fields: the row's buttons or menu. */
  actions?: ReactNode;
};

/** The card list. The table sits in `TABLE_FROM[until]`, with the same `until`. */
export function MobileRowCards({ children, until = "lg" }: { children: ReactNode; until?: Until }) {
  return <div className={CARDS_UNTIL[until]}>{children}</div>;
}

export function MobileRowCard({ leading, title, subtitle, aside, fields, actions }: CardProps) {
  return (
    <div className="rounded-xl border border-pink-100 p-4 text-sm">
      <div className="flex items-start gap-3">
        {leading && <div className="shrink-0">{leading}</div>}
        <div className="min-w-0 flex-1">
          <div className="font-semibold text-gray-900 wrap-anywhere">{title}</div>
          {subtitle && <div className="text-xs text-slate-500 wrap-anywhere">{subtitle}</div>}
        </div>
        {aside && <div className="shrink-0">{aside}</div>}
      </div>

      {fields.length > 0 && (
        <dl className="mt-3 space-y-1.5">
          {fields.map((field) => (
            <div key={field.label} className="flex items-start justify-between gap-3">
              <dt className="shrink-0 text-gray-500">{field.label}</dt>
              <dd className="min-w-0 text-right text-gray-800 wrap-anywhere">{field.value}</dd>
            </div>
          ))}
        </dl>
      )}

      {actions && <div className="mt-3 flex justify-end">{actions}</div>}
    </div>
  );
}

/** The empty message, in the same place the table shows its own. */
export function MobileRowEmpty({ children }: { children: ReactNode }) {
  return <p className="py-6 text-center text-lg text-[#DC3173]">{children}</p>;
}
