import { TVendor } from "@/src/types/vendor.type";

export type TAddonOption = {
  _id?: string;
  name: string;
  price: number;
  isActive?: boolean;
};

export type TAddonGroup = {
  _id: string;
  vendorId: TVendor;
  title: string;
  minSelectable: number;
  maxSelectable: number;
  options: TAddonOption[];
  isActive: boolean;
  isDeleted: boolean;
};
