import LoginForm from "@/src/components/Login/LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect: string }>;
}) {
  return <LoginForm redirect={(await searchParams).redirect || ""} />;
}
