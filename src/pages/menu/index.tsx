// pages/admin/menu.tsx
import { useEffect, useState } from 'react';
import { Box, Button, Typography, Avatar, Alert } from '@mui/material';
import Link from 'next/link';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import MenuForm from '../../../menu/components/MenuForm';
import { MenuDia } from '../../../menu/types/menuTypes';
import { api } from '@/lib/api';
import { useUser } from '@/hooks/useUser';

export default function MenuPage() {
  const { nombrePension } = useUser();
  const [menu, setMenu] = useState<MenuDia | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const cargar = async () => {
      try {
        const response = await api
          .get('/menu/hoy', { params: {} })
          .catch(() => null);

        const menuBackend = response?.data ?? null;

        setMenu({
          id: menuBackend?.id?.toString() || 'menu-hoy',
          fecha: menuBackend?.fecha || new Date().toISOString().split('T')[0],
          precio_completo: menuBackend?.precio_completo ? parseFloat(menuBackend.precio_completo) : 15,
          activo: true,
          sopas: [],
          segundos: [],
          refrescos: [],
        });
      } catch (err) {
        setError('No se pudo cargar la configuración del menú.');
        console.error(err);
      }
    };
    cargar();
  }, []);

  const handleGuardar = async (nuevoMenu: MenuDia) => {
    setError('');
    setSuccess('');

    try {
      await api.post('/menu', {
        fecha: nuevoMenu.fecha,
        precio_completo: nuevoMenu.precio_completo,
        activo: nuevoMenu.activo,
      });

      setMenu(nuevoMenu);
      setSuccess('✅ Configuración del menú guardada correctamente.');
      setTimeout(() => setSuccess(''), 4000);
    } catch (err: any) {
      setError(err.message || 'Error al guardar la configuración.');
    }
  };

  if (!menu) {
    return (
      <Box sx={{ p: 4, textAlign: 'center', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography>Cargando...</Typography>
      </Box>
    );
  }

   return (
    <Box sx={{ 
      minHeight: '100vh', 
      p: { xs: 2, md: 3 }, 
      // 👇 Fondo Crema Cálido (Igual que el Login y Gestión de Platos)
      bgcolor: '#F6F1E7' 
    }}>
      
      {/* HEADER */}
      <Box sx={{ 
        mb: 2, 
        px: { xs: 2, sm: 3 }, 
        py: { xs: 1.5, sm: 2 }, 
        borderRadius: 3, 
        border: '1px solid #E7E5E4', 
        // 👇 Fondo blanco para contrastar con el crema
        bgcolor: '#FFFFFF', 
        position: 'relative', 
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(61, 59, 42, 0.05)' // Sombra sutil
      }}>
        
        {/* Línea decorativa superior en Terracota */}
        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: '#C66B3D' }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Avatar con fondo terracota tenue y logo oscuro */}
            <Avatar sx={{ bgcolor: 'rgba(198, 107, 61, 0.1)', color: '#C66B3D', width: 46, height: 46, borderRadius: 2 }}>
              <RestaurantMenuIcon sx={{ fontSize: 26 }} />
            </Avatar>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#3D3B2A', letterSpacing: '-0.5px' }}>
                  Configurar Menú
                </Typography>
                {/* Badge del negocio en Verde Oliva */}
                <Box component="span" sx={{ 
                  display: 'inline-flex', alignItems: 'center', gap: 0.5, 
                  px: 0.75, py: 0.25, borderRadius: 1, 
                  bgcolor: '#F6F1E7', color: '#6B7B3A', 
                  fontSize: '0.65rem', fontWeight: 800, 
                  textTransform: 'uppercase', border: '1px solid #D8C3A5'
                }}>
                  <RestaurantIcon sx={{ fontSize: 12 }} /> {nombrePension}
                </Box>
              </Box>
              <Typography variant="body2" sx={{ color: '#78716C', fontSize: '0.8rem', fontWeight: 500, mt: 0.5 }}>
                Precio del combo y disponibilidad general
              </Typography>
            </Box>
          </Box>
          
          <Link href="/pos" style={{ textDecoration: 'none' }}>
            {/* Botón en Verde Oliva Oscuro */}
            <Button 
              variant="contained" 
              startIcon={<PointOfSaleIcon />} 
              sx={{ 
                bgcolor: '#3D3B2A', 
                color: '#D8C3A5',
                fontWeight: 700, 
                textTransform: 'none', 
                borderRadius: 2,
                px: 2.5,
                py: 1,
                boxShadow: '0 4px 12px rgba(61, 59, 42, 0.2)',
                '&:hover': { 
                  bgcolor: '#2A281D', 
                  boxShadow: '0 6px 16px rgba(61, 59, 42, 0.3)' 
                } 
              }}
            >
              Ir al POS
            </Button>
          </Link>
        </Box>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2, maxWidth: 800, mx: 'auto', borderRadius: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2, maxWidth: 800, mx: 'auto', borderRadius: 2 }}>{success}</Alert>}

      <Box sx={{ maxWidth: 800, mx: 'auto' }}>
        <MenuForm menu={menu} onGuardar={handleGuardar} />
      </Box>
    </Box>
  );
}