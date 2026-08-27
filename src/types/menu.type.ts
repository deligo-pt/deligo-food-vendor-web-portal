export interface LocalizedString {
    en: string;
    pt: string;
}

export interface MenuAvailability {
    daysOfWeek: Array<'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN'>;
    startTime: string;
    endTime: string;
    _id: string;
}

export interface IMenu {
    _id: string;
    vendorId: string;
    name: LocalizedString;
    description: LocalizedString;
    availability: MenuAvailability;
    sortOrder: number;
    isActive: boolean;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface IProductItem {
    productId: {
        _id: string;
        name: {
            en: string;
            pt: string;
        };
        slug: string;
        images: string[];
        pricing: {
            price: number;
            discount: number;
            discountType: string;
            taxId: string;
            taxRate: number;
            currency: string;
            finalPrice: number;
            discountAmount: number;
            taxAmount: number;
            basePrice: number;
        };
        meta: {
            isFeatured: boolean;
            isAvailableForPreOrder: boolean;
            status: string;
            createdAt: string;
            updatedAt: string;
        };
    };
    sortOrder: number;
    isAvailable: boolean;
}

export interface IMenuSection {
    _id: string;
    menuId: string;
    vendorId: string;
    name: {
        en: string;
        pt: string;
    };
    description: {
        en: string;
        pt: string;
    };
    sortOrder: number;
    items: IProductItem[];
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
}