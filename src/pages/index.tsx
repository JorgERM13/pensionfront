import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {
  const { token, cargando } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!cargando) router.replace(token ? "/pos" : "/login");
  }, [token, cargando, router]);
  return null;
}