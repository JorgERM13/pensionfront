import { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";
import {
  Box, Paper, Typography, TextField, Button, Alert, Link, Avatar
} from "@mui/material";
import StorefrontIcon from '@mui/icons-material/Storefront';

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
        const destination = "/pos"; // Por ahora solo el POS de pensión
        
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
    <Box sx={{ 
      minHeight: "100vh", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center", 
      // 👇 Fondo Crema Muy Suave (F6F1E7)
      bgcolor: '#F6F1E7',
      p: 2 
    }}>
      
      <Paper elevation={0} sx={{ 
        p: { xs: 3, sm: 5 }, 
        width: "100%", 
        maxWidth: 420, 
        bgcolor: '#FFFFFF', 
        borderRadius: 4,
        border: '1px solid #E7E5E4',
        boxShadow: '0 12px 40px -10px rgba(61, 59, 42, 0.15)', // Sombra con tinte verde oliva
        position: 'relative',
        overflow: 'hidden'
      }}>
        
        {/* Línea decorativa superior en Terracota */}
        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 5, background: '#C66B3D' }} />

        {/* Logo / Icono */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <Avatar sx={{ 
            bgcolor: 'rgba(198, 107, 61, 0.1)', // Fondo terracota muy tenue
            color: '#C66B3D', 
            width: 64, 
            height: 64 
          }}>
            <StorefrontIcon sx={{ fontSize: 36 }} />
          </Avatar>
        </Box>

        <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 800, color: '#3D3B2A', letterSpacing: '-0.5px' }}>
          KPIemprende
        </Typography>
        
        <Typography variant="body2" align="center" sx={{ mb: 4, color: '#6B7B3A', fontWeight: 600 }}>
          Ingresa tus credenciales para administrar tu negocio
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Correo Electrónico" 
            type="email" 
            fullWidth 
            margin="normal"
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: '#F9F6F2', // Fondo beige cálido para el input
                color: '#3D3B2A',
                '& fieldset': { borderColor: '#D8C3A5' }, // Borde Beige
                '&:hover fieldset': { borderColor: '#C66B3D' },
                '&.Mui-focused fieldset': { borderColor: '#C66B3D' }, // Focus Terracota
              },
              '& .MuiInputLabel-root': { color: '#6B7B3A' }, // Label Verde Oliva
              '& .MuiInputLabel-root.Mui-focused': { color: '#C66B3D' },
            }}
          />
          
          <TextField
            label="Contraseña" 
            type="password" 
            fullWidth 
            margin="normal"
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: '#F9F6F2',
                color: '#3D3B2A',
                '& fieldset': { borderColor: '#D8C3A5' },
                '&:hover fieldset': { borderColor: '#C66B3D' },
                '&.Mui-focused fieldset': { borderColor: '#C66B3D' },
              },
              '& .MuiInputLabel-root': { color: '#6B7B3A' },
              '& .MuiInputLabel-root.Mui-focused': { color: '#C66B3D' },
            }}
          />

          <Button 
            type="submit" 
            variant="contained" 
            fullWidth 
            size="large" 
            disabled={loading} 
            sx={{ 
              mt: 4, 
              py: 1.5,
              fontSize: "1rem",
              fontWeight: 700,
              textTransform: 'none',
              borderRadius: 2,
              bgcolor: '#C66B3D', // Terracota
              color: '#FFFFFF',
              boxShadow: '0 4px 14px rgba(198, 107, 61, 0.3)',
              transition: 'all 0.2s ease',
              '&:hover': { 
                bgcolor: '#A5552D', // Terracota más oscuro al hover
                boxShadow: '0 6px 20px rgba(198, 107, 61, 0.5)',
                transform: 'translateY(-1px)'
              } 
            }}
          >
            {loading ? "Ingresando..." : "Iniciar Sesión"}
          </Button>
        </form>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: '#6B7B3A' }}>
            ¿No tienes cuenta?{" "}
            <Link href="/register" underline="hover" sx={{ color: '#C66B3D', fontWeight: 700, '&:hover': { color: '#A5552D' } }}>
              Regístrate
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );

}