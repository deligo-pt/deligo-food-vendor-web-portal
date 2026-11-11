import { USER_STATUS } from "@/src/consts/user.const";

/**
 * Weekly opening schedule (FRONTEND_VENDOR_SCHEDULE_GUIDE §3).
 *
 * Times are store-local wall-clock in `businessDetails.timezone`, never
 * converted to the device's zone. A weekday missing from the array is closed,
 * the same as `periods: []`. A period whose `close` is earlier than its `open`
 * runs past midnight; `"24:00"` is valid only as a `close` (end of day).
 */
export type TWeekday =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export type TClockPeriod = {
  /** "HH:mm", 24-hour. */
  open: string;
  /** "HH:mm", or "24:00" for end of day. */
  close: string;
};

export type TWeeklyDaySchedule = {
  day: TWeekday;
  /** `[]` means closed all day. At most 4. */
  periods: TClockPeriod[];
};

/**
 * Live open/closed state, computed by the backend (pauses, extensions, admin
 * suspensions and the cut-off before closing included). Never derive it from
 * the schedule on the client. Branch on `state`.
 *
 * Seen 10 Nov 2026: `GET /vendors/:userId` returned only `{ override: null }`
 * here; the customer endpoints return the full shape. Every field is optional.
 */
export type TStoreAvailability = {
  state?: "OPEN" | "CLOSED" | "PAUSED";
  isOpen?: boolean;
  reason?: string | null;
  overrideType?: string | null;
  /** ISO time a pause ends. */
  resumeAt?: string | null;
  /** ISO time the store next opens (e.g. the next shift during a break). */
  nextOpenAt?: string | null;
  override?: unknown;
};

export type TVendor = {
  _id?: string;
  userId: string;
  role: "VENDOR" | "SUB_VENDOR";
  email: string;
  password: string;
  status: keyof typeof USER_STATUS;
  isEmailVerified: boolean;
  isDeleted: boolean;

  // Rating & Activity
  rating?: {
    average: number;
    totalReviews: number;
  };
  totalOrders?: number;
  lastLoginAt?: Date | string;

  // fcm tokens
  fcmTokens?: string[];

  // OTP Details
  otp?: string;
  isOtpExpired?: Date | string;

  // Personal Details
  name?: {
    firstName?: string;
    lastName?: string;
  };
  contactNumber?: string;
  profilePhoto?: string;

  address?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };

  passwordChangedAt?: Date | string;

  // Business Details
  businessDetails?: {
    businessName: string;
    companyLegalName?: string;
    businessType: string;
    branchName?: string;
    isHalal?: boolean;
    preparationTimeMinutes?: string;
    isStoreOpen?: boolean;
    businessTypeSlug?: string;
    restaurantCuisineType?: string[];
    businessLicenseNumber?: string;
    NIF?: string;
    totalBranches: number;
    /**
     * The source of truth once present. Absent (not `[]`) on vendors that
     * never set one: treat absent and `[]` alike as "use the legacy fields".
     * Saved as a whole with `PATCH /vendors/:userId`; see `utils/weeklySchedule`.
     */
    weeklySchedule?: TWeeklyDaySchedule[];
    /** @deprecated Read-only, a lossy summary of `weeklySchedule` ("HH:mm"). */
    openingHours?: string;
    /** @deprecated Read-only, a lossy summary of `weeklySchedule` ("HH:mm"). */
    closingHours?: string;
    /** @deprecated Read-only, weekdays with no periods, Sunday first. */
    closingDays?: string[];
    timezone?: string;
    availability?: TStoreAvailability;
  };

  // Business Location
  businessLocation?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
    geoAccuracy?: number; // meters
  };

  // Bank & Payment Information
  bankDetails?: {
    bankName?: string;
    accountHolderName: string;
    iban: string;
    swiftCode?: string;
  };

  // Documents & Verification
  documents?: {
    myPhoto?: string[];
    businessLicenseDoc?: string[];
    taxDoc?: string[];
    idProofFront?: string[];
    idProofBack?: string[];
    storePhoto?: string[];
    menuUpload?: string[];
    agoserisHaccpCertificate?: string[];
    ibanProof: string[];
  };

  // Security & Access Control
  twoFactorEnabled?: boolean;
  loginDevices: {
    deviceId: string;
    deviceType: string;
    deviceName: string;
    userAgent: string;
    ip: string;
    isVerified: boolean;
    lastLogin: string;
  }[];

  /**
   * Set once a store is SUBMITTED or APPROVED: the profile can then only be
   * changed in fields an admin grants through a correction request (Postman
   * "Corrections Request"). Saving outside a grant answers
   * `VENDOR_UPDATE_LOCKED_CONTACT_SUPPORT` / `CORRECTION_FIELD_OUTSIDE_GRANT`.
   */
  isUpdateLocked?: boolean;
  /** The admin's grant; editable while `status` is `PENDING`, consumed on confirm. */
  correctionRequest?: {
    status?: "PENDING" | "FULFILLED" | string;
    fields?: string[];
    docTitles?: string[];
    remarks?: string;
    requestedAt?: string;
  } | null;

  // Admin & Audit Fields
  approvedBy?: string;
  rejectedBy?: string;
  remarks?: string;

  submittedForApprovalAt?: Date | string;
  approvedOrRejectedOrBlockedAt?: Date | string;
  parentVendorId?: string;

  createdAt: Date | string;
  updatedAt: Date | string;
};
