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
        border: '1px solid #E7E5E4', 
        borderRadius: 3, 
        overflow: 'hidden', 
        background: '#FFFFFF', 
        boxShadow: '0 8px 30px rgba(61, 59, 42, 0.06)' 
      }}>
        
        {/* HEADER */}
        <Box sx={{ 
          p: 3, 
          borderBottom: '1px solid #F5F5F4', 
          bgcolor: '#FFFFFF', 
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
          gap: 2, flexWrap: 'wrap' 
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Icono con fondo Terracota tenue */}
            <Box sx={{ bgcolor: 'rgba(198, 107, 61, 0.1)', color: '#C66B3D', p: 1, borderRadius: 2, display: 'flex' }}>
              <RestaurantMenuIcon sx={{ fontSize: 28 }} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#3D3B2A', lineHeight: 1.2 }}>
                Configuración del Menú
              </Typography>
              <Typography variant="body2" sx={{ color: '#78716C', fontWeight: 500 }}>
                Define el precio y la disponibilidad general.
              </Typography>
            </Box>
          </Box>
          
          <Link href="/admin/platos" style={{ textDecoration: 'none' }}>
            {/* Botón de catálogo con borde Verde Oliva */}
            <Button 
              variant="outlined" 
              startIcon={<RestaurantMenuIcon sx={{ fontSize: 20 }} />}
              sx={{ 
                borderColor: '#6B7B3A', color: '#6B7B3A', fontWeight: 700, 
                textTransform: 'none', borderRadius: 2, px: 2, py: 1,
                '&:hover': { bgcolor: 'rgba(107, 123, 58, 0.05)', borderColor: '#57662E' }
              }}
            >
              Gestionar Catálogo de Platos
            </Button>
          </Link>
        </Box>

        <Box sx={{ p: { xs: 2, sm: 4 } }}>
          
          {/* Alert informativo en tonos Beige/Verde Oliva */}
          <Alert 
            severity="info" 
            sx={{ 
              mb: 4, 
              borderRadius: 2, 
              border: '1px solid #D8C3A5', 
              bgcolor: '#F6F1E7', 
              color: '#3D3B2A',
              '& .MuiAlert-icon': { color: '#6B7B3A' }
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 800, color: '#6B7B3A', mb: 0.5 }}>
              💡 ¿Cómo seleccionar los platos de hoy?
            </Typography>
            <Typography variant="body2" sx={{ color: '#78716C', fontWeight: 500 }}>
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
                '& .MuiOutlinedInput-root': { 
                  borderRadius: 2, 
                  bgcolor: '#F9F6F2', 
                  transition: 'all 0.2s',
                  '& fieldset': { borderColor: '#E7E5E4' },
                  '&:hover fieldset': { borderColor: '#C66B3D' },
                  '&.Mui-focused fieldset': { borderColor: '#C66B3D' },
                },
                '& .MuiInputLabel-root': { fontWeight: 600, color: '#78716C' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#C66B3D' },
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
                '& .MuiOutlinedInput-root': { 
                  borderRadius: 2, 
                  bgcolor: '#F9F6F2', 
                  transition: 'all 0.2s',
                  '& fieldset': { borderColor: '#E7E5E4' },
                  '&:hover fieldset': { borderColor: '#C66B3D' },
                  '&.Mui-focused fieldset': { borderColor: '#C66B3D' },
                },
                '& .MuiInputLabel-root': { fontWeight: 600, color: '#78716C' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#C66B3D' },
              }}
            />

            <Divider sx={{ my: 1, borderColor: '#F5F5F4' }} />

            {/* SWITCH CON ESTILO BISTRÓ */}
            <Box sx={{ 
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
              p: 2.5, 
              // Si está activo usa un beige/oliva sutil, si no, gris muy claro
              bgcolor: formData.activo ? '#F6F1E7' : '#F9F6F2', 
              borderRadius: 2, 
              border: '1px solid', 
              borderColor: formData.activo ? '#D8C3A5' : '#E7E5E4', 
              transition: 'all 0.3s' 
            }}>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: formData.activo ? '#6B7B3A' : '#78716C' }}>
                  {formData.activo ? '🟢 Menú Activo' : '🔴 Menú Inactivo'}
                </Typography>
                <Typography variant="caption" sx={{ color: '#A8A29E', display: 'block', mt: 0.5, fontWeight: 500 }}>
                  Si está desactivado, el POS no mostrará la opción de "Almuerzo Completo".
                </Typography>
              </Box>
              
              <Switch
                checked={!!formData.activo}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, activo: e.target.checked })}
                sx={{
                  // Switch en Verde Oliva cuando está activo
                  '& .MuiSwitch-switchBase.Mui-checked': { color: '#6B7B3A' },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#6B7B3A' },
                  '& .MuiSwitch-track': { bgcolor: '#D8C3A5' },
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
        {/* Botón Guardar en Terracota */}
        <Button 
          variant="contained" 
          startIcon={guardando ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />} 
          onClick={handleGuardar} 
          disabled={guardando} 
          sx={{
            py: 1.5, px: 4, fontSize: '1rem', fontWeight: 700, textTransform: 'none', borderRadius: 2, 
            bgcolor: '#C66B3D', 
            color: '#FFFFFF',
            boxShadow: '0 4px 14px rgba(198, 107, 61, 0.3)',
            '&:hover': { 
              bgcolor: '#A5552D', 
              boxShadow: '0 6px 20px rgba(198, 107, 61, 0.4)', 
              transform: guardando ? 'none' : 'translateY(-1px)' 
            }, 
            transition: 'all 0.2s ease', opacity: guardando ? 0.8 : 1
          }}
        >
          {guardando ? 'Guardando...' : 'Guardar Configuración'}
        </Button>
      </Box>
    </Box>
  );
}