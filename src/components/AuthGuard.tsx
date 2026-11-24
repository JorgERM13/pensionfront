import { ReactNode, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";
import { Box, CircularProgress } from "@mui/material";

const PUBLICAS = ["/login", "/register", "/"];

export default function AuthGuard({ children }: { children: ReactNode }) {
  const { token, cargando } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!cargando && !token && !PUBLICAS.includes(router.pathname)) {
      router.replace("/login");
    }
  }, [token, cargando, router]);

  if (cargando) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!token && !PUBLICAS.includes(router.pathname)) return null;

  return <>{children}</>;
}