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
    <Box sx={{ minHeight: '100vh', p: { xs: 2, md: 3 }, background: 'linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%)' }}>
      {/* HEADER */}
      <Box sx={{ mb: 2, px: { xs: 2, sm: 3 }, py: { xs: 1.5, sm: 2 }, borderRadius: 2.5, border: '1px solid #e2e8f0', background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)', position: 'relative', overflow: 'hidden' }}>
        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, #2e7d32 0%, #6d4c41 33%, #e65100 66%, #00897b 100%)' }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: '#1e293b', width: 46, height: 46, borderRadius: 2 }}>
              <RestaurantMenuIcon sx={{ fontSize: 26 }} />
            </Avatar>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a' }}>Configurar Menú</Typography>
                <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, px: 0.75, py: 0.25, borderRadius: 1, bgcolor: '#fef3c7', color: '#92400e', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase' }}>
                  <RestaurantIcon sx={{ fontSize: 12 }} /> {nombrePension}
                </Box>
              </Box>
              <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.8rem' }}>
                Precio del combo y disponibilidad general
              </Typography>
            </Box>
          </Box>
          <Link href="/pos" style={{ textDecoration: 'none' }}>
            <Button variant="contained" startIcon={<PointOfSaleIcon />} sx={{ bgcolor: '#1e293b', fontWeight: 700, textTransform: 'none', '&:hover': { bgcolor: '#0f172a' } }}>
              Ir al POS
            </Button>
          </Link>
        </Box>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2, maxWidth: 800, mx: 'auto' }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2, maxWidth: 800, mx: 'auto' }}>{success}</Alert>}

      <Box sx={{ maxWidth: 800, mx: 'auto' }}>
        <MenuForm menu={menu} onGuardar={handleGuardar} />
      </Box>
    </Box>
  );
}