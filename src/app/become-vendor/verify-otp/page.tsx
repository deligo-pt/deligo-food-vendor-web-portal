import VerifyOtp from "@/src/components/BecomeVendor/VerifyOtp";

export default function VerifyOtpPage({
  searchParams,
}: {
  searchParams: { email: string };
}) {
  return <VerifyOtp email={searchParams.email || ""} />;
}
