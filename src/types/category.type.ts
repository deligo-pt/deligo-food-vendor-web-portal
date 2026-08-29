import { TMeta } from ".";

export type TBusinessCategory = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  image?: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export type TProductCategory = {
  _id: string;
  name: {
    en?: string;
    pt?: string;
  };
  slug: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export type TProductCategoryResponse = {
  data: TProductCategory[];
  meta?: TMeta;
  success?: boolean;
  message?: string;
};
