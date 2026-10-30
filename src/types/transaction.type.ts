/**
 * A vendor transaction as `GET /transactions` sends it (checked 26 Oct 2026 on
 * order ORD-Y9FYHY2TO3: a `VENDOR_EARNING` and an `SDR_DEPOSIT_PAYABLE`).
 *
 * Amounts are numbers in euros. The order the transaction belongs to comes
 * embedded in full under `order`; only the fields the pages read are typed.
 * `GET /transactions/:id` is refused to vendors ("Access denied"), so the
 * details page finds a transaction by searching its id.
 */

type LocalizedName = string | { en?: string; pt?: string };

export type TTransactionOrder = {
  _id?: string;
  orderId?: string;
  /** "DELIVERY" or "PICKUP". */
  fulfillmentType?: string;
  /** How the customer paid ("CARD", "GOOGLE_PAY", …). */
  paymentMethod?: string;
  orderStatus?: string;
  orderCalculation?: {
    totalOriginalPrice?: number;
    totalProductDiscount?: number;
    totalOfferDiscount?: number;
    /** Net; the customer paid it with `serviceChargeVatAmount` on top. */
    serviceCharge?: number;
    serviceChargeVatAmount?: number;
    sdr?: { total?: number; totalContainers?: number } | null;
  };
  /** What the customer paid for delivery (goes to the rider). */
  delivery?: { totalDeliveryCharge?: number } | null;
  payoutSummary?: {
    grandTotal?: number;
    deliGoCommission?: { rate?: number; amount?: number };
    vendor?: { vendorNetPayout?: number };
    sdr?: { amount?: number } | null;
  };
  payoutMetadata?: {
    vendor?: { isSettled?: boolean; payoutId?: string | null };
  };
};

export type TTransaction = {
  _id: string;
  transactionId: string;
  /** e.g. "VENDOR_EARNING", "SDR_DEPOSIT_PAYABLE". */
  type: string;
  /** e.g. "SUCCESS". */
  status?: string;
  description: string;
  amount: number;

  orderId?: string;
  orderGrandTotal?: number;
  platformFee?: number;
  vendorNetEarning?: number;

  customer?: { _id?: string; name?: { firstName?: string; lastName?: string } } | null;
  /** "N/A" on a pickup. */
  deliveryAddress?: string;
  items?: { name: LocalizedName; qty: number; price: string | number }[];
  /** Where the money moved ("WALLET"), not how the customer paid. */
  paymentMethod?: string;

  order?: TTransactionOrder | null;

  createdAt: string;
  updatedAt: string;
};
