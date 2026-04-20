import LoginForm from "@/src/components/Login/LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect: string; sessionExpired: "true" | "false" }>;
}) {
  const { redirect, sessionExpired } = await searchParams;

  return (
    <LoginForm redirect={redirect} sessionExpired={sessionExpired === "true"} />
  );
}
