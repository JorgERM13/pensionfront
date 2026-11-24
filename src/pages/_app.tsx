import type { AppProps } from "next/app";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { AuthProvider } from "@/contexts/AuthContext";
import AuthGuard from "@/components/AuthGuard";
import Layout from "../../components/Layout";
import { useRouter } from "next/router";

const theme = createTheme({
  palette: {
    primary: { main: "#16a34a" },   // verde OREGANOS
    secondary: { main: "#0ea5e9" },
  },
  shape: { borderRadius: 12 },
});

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  // 👇 Si estamos en el login, no mostramos el Layout
  const isLoginPage = router.pathname === "/login" || router.pathname === "/register";

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <AuthGuard>
          {isLoginPage ? (
            <Component {...pageProps} />
          ) : (
            <Layout>
              <Component {...pageProps} />
            </Layout>
          )}
        </AuthGuard>
      </AuthProvider>
    </ThemeProvider>
  );
}