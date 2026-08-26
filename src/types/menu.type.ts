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