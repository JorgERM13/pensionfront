import { useState, useEffect, ChangeEvent } from 'react';
import Link from 'next/link';
import {
  Box, Card, TextField, Button, Typography, Switch, Alert, CircularProgress, Divider
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import { MenuDia } from '../types/menuTypes'; 

interface MenuFormProps {
  menu: MenuDia;
  onGuardar: (menu: MenuDia) => Promise<void>;
}

export default function MenuForm({ menu, onGuardar }: MenuFormProps) {
  // 1. Estado inicial
  const [formData, setFormData] = useState<MenuDia>({
    ...menu,
    fecha: menu?.fecha || new Date().toISOString().split('T')[0],
    precio_completo: menu?.precio_completo || 15,
    activo: menu?.activo !== undefined ? menu.activo : true,
  });

  // 2. 👇 EL FIX CLAVE: Sincronizar si el padre actualiza el menú desde el backend
  useEffect(() => {
    setFormData({
      ...menu,
      fecha: menu?.fecha || new Date().toISOString().split('T')[0],
      precio_completo: menu?.precio_completo || 15,
      activo: menu?.activo !== undefined ? menu.activo : true,
    });
  }, [menu]);

  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState<{ tipo: 'success' | 'error'; texto: string } | null>(null);

 // En MenuForm.tsx (dentro de handleGuardar)
const handleGuardar = async () => {
  setGuardando(true);
  setMensaje(null);
  try {
    // Forzamos que siempre esté activo al guardar
    const dataAGuardar = { ...formData, activo: true };
    await onGuardar(dataAGuardar);
    
    setMensaje({ tipo: 'success', texto: '¡Configuración del menú guardada exitosamente!' });
    setTimeout(() => setMensaje(null), 4000);
  } catch (error: any) {
    setMensaje({ tipo: 'error', texto: error.message || 'Error al guardar. Verifica los datos.' });
  } finally {
    setGuardando(false);
  }
};

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Card elevation={0} sx={{ 
        border: '1px solid #e2e8f0', 
        borderRadius: 3, 
        overflow: 'hidden', 
        background: '#ffffff', 
        boxShadow: '0 4px 20px rgba(15, 23, 42, 0.06)' 
      }}>
        
        {/* HEADER */}
        <Box sx={{ 
          p: 3, borderBottom: '1px solid #e2e8f0', bgcolor: '#f8fafc', 
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
          gap: 2, flexWrap: 'wrap' 
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ bgcolor: '#1e293b', color: '#ffffff', p: 1, borderRadius: 2, display: 'flex' }}>
              <RestaurantMenuIcon sx={{ fontSize: 28 }} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
                Configuración del Menú del Día
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
                Define el precio y la disponibilidad general del almuerzo.
              </Typography>
            </Box>
          </Box>
          
          <Link href="/admin/platos" style={{ textDecoration: 'none' }}>
            <Button 
              variant="outlined" 
              startIcon={<RestaurantMenuIcon sx={{ fontSize: 20 }} />}
              sx={{ 
                borderColor: '#1e293b', color: '#1e293b', fontWeight: 700, 
                textTransform: 'none', borderRadius: 2, px: 2, py: 1,
                '&:hover': { bgcolor: '#f1f5f9', borderColor: '#0f172a' }
              }}
            >
              Gestionar Catálogo de Platos
            </Button>
          </Link>
        </Box>

        <Box sx={{ p: { xs: 2, sm: 4 } }}>
          
          <Alert severity="info" sx={{ mb: 4, borderRadius: 2, border: '1px solid #bae6fd', bgcolor: '#f0f9ff' }}>
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#0369a1', mb: 0.5 }}>
              💡 ¿Cómo seleccionar los platos de hoy?
            </Typography>
            <Typography variant="body2" sx={{ color: '#0284c7' }}>
              No necesitas agregarlos aquí. Ve a la sección <strong>"Gestión de Platos"</strong>, asigna el stock y activa el switch "Disponible".
            </Typography>
          </Alert>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            
            <TextField
              label="Fecha del Menú"
              type="date"
              variant="outlined" 
              fullWidth
              value={formData.fecha}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, fecha: e.target.value })}
              slotProps={{ inputLabel: { shrink: true } }}
              sx={{ 
                '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: '#f8fafc', transition: 'all 0.2s' },
                '& .MuiOutlinedInput-root:hover': { bgcolor: '#ffffff' },
                '& .MuiInputLabel-root': { fontWeight: 600, color: '#475569' }
              }}
            />

            <TextField
              label="Precio del Almuerzo Completo (Bs)"
              type="number"
              variant="outlined"
              fullWidth
              value={formData.precio_completo}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, precio_completo: parseFloat(e.target.value) || 0 })}
              slotProps={{ htmlInput: { min: 0, step: 0.5 } }}
              sx={{ 
                '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: '#f8fafc', transition: 'all 0.2s' },
                '& .MuiOutlinedInput-root:hover': { bgcolor: '#ffffff' },
                '& .MuiInputLabel-root': { fontWeight: 600, color: '#475569' }
              }}
            />

            <Divider sx={{ my: 1 }} />

            {/* 👇 SWITCH CORREGIDO (Sin FormControlLabel) */}
            <Box sx={{ 
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
              p: 2.5, bgcolor: formData.activo ? '#f0fdf4' : '#f8fafc', 
              borderRadius: 2, border: `1px solid ${formData.activo ? '#bbf7d0' : '#e2e8f0'}`, 
              transition: 'all 0.3s' 
            }}>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: formData.activo ? '#166534' : '#0f172a' }}>
                  {formData.activo ? '🟢 Menú Activo' : '🔴 Menú Inactivo'}
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mt: 0.5 }}>
                  Si está desactivado, el POS no mostrará la opción de "Almuerzo Completo".
                </Typography>
              </Box>
              
              <Switch
                checked={!!formData.activo}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, activo: e.target.checked })}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': { color: '#10b981' },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#10b981' },
                  '& .MuiSwitch-track': { bgcolor: '#cbd5e1' },
                }}
              />
            </Box>

          </Box>
        </Box>
      </Card>

      {mensaje && (
        <Alert 
          severity={mensaje.tipo} 
          icon={mensaje.tipo === 'success' ? <CheckCircleIcon /> : <ErrorIcon />} 
          sx={{ mt: 2, borderRadius: 2, fontWeight: 600, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
        >
          {mensaje.texto}
        </Alert>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <Button 
          variant="contained" 
          startIcon={guardando ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />} 
          onClick={handleGuardar} 
          disabled={guardando} 
          sx={{
            py: 1.5, px: 4, fontSize: '1rem', fontWeight: 700, textTransform: 'none', borderRadius: 2, 
            bgcolor: '#1e293b', boxShadow: '0 4px 12px rgba(15, 23, 42, 0.2)',
            '&:hover': { bgcolor: '#0f172a', boxShadow: '0 6px 16px rgba(15, 23, 42, 0.3)', transform: guardando ? 'none' : 'translateY(-1px)' }, 
            transition: 'all 0.2s ease', opacity: guardando ? 0.8 : 1
          }}
        >
          {guardando ? 'Guardando...' : 'Guardar Configuración'}
        </Button>
      </Box>
    </Box>
  );
}