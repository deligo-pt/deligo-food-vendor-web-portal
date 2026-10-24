import { TTax } from "@/src/types/tax.type";
import { TVendor } from "@/src/types/vendor.type";

type LocalizedType = {
  en?: string;
  pt?: string;
}

// Container deposit (SDR) on one add-on option: charged per container, times
// `containerCount` (a 2-can option carries 2). The backend defaults a missing
// one to `{ applicable: false, containerCount: 1 }`.
export type TAddonOptionSdr = {
  applicable: boolean;
  containerCount: number;
};

export type TAddonOption = {
  _id?: string;
  name: LocalizedType;
  sku?: string;
  price: number;
  tax: TTax | string;
  isActive?: boolean;
  sdr?: TAddonOptionSdr;
};

export type TAddonGroup = {
  _id: string;
  vendorId: TVendor;
  title: LocalizedType;
  minSelectable: number;
  maxSelectable: number;
  options: TAddonOption[];
  isActive: boolean;
  isDeleted: boolean;
};
