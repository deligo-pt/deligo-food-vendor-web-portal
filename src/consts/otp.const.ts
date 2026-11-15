/**
 * How many digits the email verification code has (become-vendor sign-up and
 * branch verification). The backend moved from 4 to 6 digits on 14 Nov 2026;
 * every OTP box row, paste and "complete?" check reads this one value.
 */
export const OTP_LENGTH = 6;

/** One empty slot per digit. */
export const emptyOtp = () => Array.from({ length: OTP_LENGTH }, () => "");
