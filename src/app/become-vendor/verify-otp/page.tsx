import VerifyOtp from "@/src/components/BecomeVendor/VerifyOtp";

export default async function VerifyOtpPage({
  searchParams,
}: {
  searchParams: Promise<{ email: string }>;
}) {
  return <VerifyOtp email={(await searchParams).email || ""} />;
}
