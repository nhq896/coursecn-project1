import { RouterUrl } from "@/app/enums/router.enum";
import useAuth from "@/app/hooks/useAuth";
import { redirect } from "next/navigation";

interface ProtectedProps {
  children: React.ReactNode;
}

export default function Protected({ children }: ProtectedProps) {
  const isAuthenticated = useAuth();

  return isAuthenticated ? children : redirect(RouterUrl.Home);
}
