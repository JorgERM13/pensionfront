import { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";
import {
  Box, Paper, Typography, TextField, Button, Alert, Link, MenuItem,
} from "@mui/material";

const TIPOS = [
  { value: "pension", label: "Pensión" },
  { value: "salteñeria", label: "Salteñería" },
  { value: "foodtruck", label: "Food Truck" },
  { value: "hamburgueseria", label: "Hamburguesería" },
  { value: "otro", label: "Otro" },
];

export default function RegisterPage() {
  const [form, setForm] = useState({
    nombre_negocio: "", tipo: "pension", propietario: "", email: "",
    telefono: "", direccion: "", email_usuario: "", password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleChange = (e: any) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form);
      router.push("/pos");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "grey.100", p: 2 }}>
      <Paper sx={{ p: 4, width: "100%", maxWidth: 480 }}>
        <Typography variant="h5" align="center" gutterBottom color="primary" sx={{fontWeight:"700"}} >
          Registrar Negocio
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField label="Nombre del Negocio" name="nombre_negocio" fullWidth margin="dense" value={form.nombre_negocio} onChange={handleChange} required />
          <TextField select label="Tipo de Negocio" name="tipo" fullWidth margin="dense" value={form.tipo} onChange={handleChange}>
            {TIPOS.map((t) => <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>)}
          </TextField>
          <TextField label="Nombre del Propietario" name="propietario" fullWidth margin="dense" value={form.propietario} onChange={handleChange} required />
          <TextField label="Email del Negocio" name="email" type="email" fullWidth margin="dense" value={form.email} onChange={handleChange} required />
          <TextField label="Teléfono" name="telefono" fullWidth margin="dense" value={form.telefono} onChange={handleChange} />
          <TextField label="Dirección" name="direccion" fullWidth margin="dense" value={form.direccion} onChange={handleChange} />
          <TextField label="Email de Login" name="email_usuario" type="email" fullWidth margin="dense" value={form.email_usuario} onChange={handleChange} required />
          <TextField 
  label="Contraseña" 
  name="password" 
  type="password" 
  fullWidth 
  margin="dense" 
  value={form.password} 
  onChange={handleChange} 
  required 
  helperText="Mínimo 6 caracteres"
/>
          <Button type="submit" variant="contained" fullWidth size="large" disabled={loading} sx={{ mt: 2 }}>
            {loading ? "Registrando..." : "Crear mi Negocio"}
          </Button>
        </form>

        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Typography variant="body2">
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" underline="hover" color="primary">Inicia sesión</Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}