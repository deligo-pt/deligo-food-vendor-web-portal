import BecomeVendor from "@/src/components/BecomeVendor/BecomeVendor";

type IProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

// `?ref=CODE` comes from a vendor's "Refer & earn" invite link and fills the
// referral code field.
export default async function BecomeVendorPage({ searchParams }: IProps) {
  const ref = (await searchParams)?.ref;
  const code = (Array.isArray(ref) ? ref[0] : ref)?.trim().toUpperCase().slice(0, 32) ?? "";
  return <BecomeVendor initialReferralCode={code} />;
}
