import { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";
import {
  Box, Paper, Typography, TextField, Button, Alert, Link,
} from "@mui/material";

export default function LoginPage() {
  const [email, setEmail] = useState("admin@oreganos.com");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");
  setLoading(true);
  try {
    await login(email, password);
    
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      const destination = user.tenant_tipo === 'pension' ? "/pos/pension" : "/pos/simple";
      
      // 👇 LA SOLUCIÓN: Solo redirigir si no estamos ya en esa ruta
      if (router.pathname !== destination) {
        router.push(destination);
      }
    } else {
      router.push("/pos"); 
    }
  } catch (err: any) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "grey.100", p: 2 }}>
      <Paper sx={{ p: 4, width: "100%", maxWidth: 400 }}>
        <Typography variant="h4" align="center" gutterBottom color="primary" sx={{ fontWeight: "700" }}>
          KPIemprende
        </Typography>
        <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 3 }}>
          Inicia sesión en tu negocio
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Email" type="email" fullWidth margin="normal"
            value={email} onChange={(e) => setEmail(e.target.value)} required
          />
          <TextField
            label="Contraseña" type="password" fullWidth margin="normal"
            value={password} onChange={(e) => setPassword(e.target.value)} required
          />
          <Button type="submit" variant="contained" fullWidth size="large" disabled={loading} sx={{ mt: 2 }}>
            {loading ? "Ingresando..." : "Iniciar Sesión"}
          </Button>
        </form>

        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Typography variant="body2">
            ¿No tienes cuenta?{" "}
            <Link href="/register" underline="hover" color="primary">Regístrate</Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}