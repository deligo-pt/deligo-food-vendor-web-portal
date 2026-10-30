import { TTransaction } from "@/src/types/transaction.type";

type Translate = (key: string) => string;

export type TransactionTone = "earning" | "deposit" | "payout" | "deduction" | "neutral";

/**
 * Codes the backend has sent so far, with their label key and tone. Anything
 * else is classified by its wording, so a new type still reads sensibly:
 * money in is green "+", money out red "−", a payout blue.
 */
const KNOWN: Record<string, { labelKey: string; tone: TransactionTone }> = {
  VENDOR_EARNING: { labelKey: "tx_type_vendor_earning", tone: "earning" },
  SDR_DEPOSIT_PAYABLE: { labelKey: "tx_type_sdr_deposit_payable", tone: "deposit" },
};

/** "VENDOR_PAYOUT" → "Vendor payout". */
export function humanize(code: string | null | undefined): string {
  const text = (code ?? "").toLowerCase().replace(/[_-]+/g, " ").trim();
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : "";
}

function toneOf(type: string): TransactionTone {
  const known = KNOWN[type];
  if (known) return known.tone;
  if (/PAYOUT|SETTLEMENT|WITHDRAW/.test(type)) return "payout";
  if (/FEE|REFUND|DEDUCT|REVERS|DEBIT|CHARGEBACK|PENALTY/.test(type)) return "deduction";
  if (/EARNING|CREDIT|BONUS|TIP|PAYABLE|DEPOSIT/.test(type)) return "earning";
  return "neutral";
}

export function transactionTypeLabel(type: string, t: Translate): string {
  const key = KNOWN[type]?.labelKey;
  return key ? t(key) : humanize(type);
}

/** The amount with its sign: "+€7.57", "−€2.50", or "€84.50" for a payout. */
export function transactionAmountText(tx: Pick<TTransaction, "type" | "amount">): string {
  const value = Number(tx.amount) || 0;
  const tone = toneOf(tx.type);
  const abs = `${Math.abs(value).toFixed(2)}\u00A0€`;
  if (value < 0 || tone === "deduction") return `−${abs}`;
  if (tone === "earning" || tone === "deposit") return `+${abs}`;
  return abs;
}

export function transactionTone(tx: Pick<TTransaction, "type" | "amount">): TransactionTone {
  return (Number(tx.amount) || 0) < 0 ? "deduction" : toneOf(tx.type);
}

/** Badge and amount colours per tone, in the panel's palette. */
export const TONE_STYLES: Record<TransactionTone, { badge: string; amount: string; iconBg: string; icon: string }> = {
  earning: { badge: "bg-green-100 text-green-700", amount: "text-green-600", iconBg: "bg-green-50", icon: "text-green-500" },
  deposit: { badge: "bg-[#DC3173]/10 text-[#DC3173]", amount: "text-[#DC3173]", iconBg: "bg-[#DC3173]/10", icon: "text-[#DC3173]" },
  payout: { badge: "bg-blue-100 text-blue-700", amount: "text-blue-600", iconBg: "bg-blue-50", icon: "text-blue-500" },
  deduction: { badge: "bg-red-100 text-red-700", amount: "text-red-500", iconBg: "bg-red-50", icon: "text-red-500" },
  neutral: { badge: "bg-gray-100 text-gray-700", amount: "text-gray-900", iconBg: "bg-gray-50", icon: "text-gray-500" },
};

export function transactionStatusLabel(status: string | undefined, t: Translate): string {
  if (!status) return "";
  const key = `tx_status_${status.toLowerCase()}`;
  const translated = t(key);
  return translated === key ? humanize(status) : translated;
}

export function customerName(customer: TTransaction["customer"]): string {
  const first = customer?.name?.firstName ?? "";
  const last = customer?.name?.lastName ?? "";
  return `${first} ${last}`.trim();
}

const METHOD_LABELS: Record<string, string> = {
  CARD: "Card",
  GOOGLE_PAY: "Google Pay",
  APPLE_PAY: "Apple Pay",
  MB_WAY: "MB WAY",
  MBWAY: "MB WAY",
  MULTIBANCO: "Multibanco",
  WALLET: "Wallet",
};

/** How the customer paid — the order's method, not the transaction's "WALLET". */
export function paymentMethodLabel(method: string | undefined, t: Translate): string {
  if (!method) return "";
  const translated = t(`tx_method_${method.toLowerCase()}`);
  if (translated !== `tx_method_${method.toLowerCase()}`) return translated;
  return METHOD_LABELS[method] ?? humanize(method);
}

export function itemName(name: string | { en?: string; pt?: string }, lang: "en" | "pt"): string {
  return typeof name === "string" ? name : name?.[lang] || name?.en || name?.pt || "";
}

export function euro(value: number | string | undefined | null): string {
  const n = Number(value);
  return `${(Number.isFinite(n) ? n : 0).toFixed(2)}\u00A0€`;
}
