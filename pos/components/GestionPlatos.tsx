// pos/components/GestionPlatos.tsx
import { useState, useEffect } from 'react';
import {
  Box, Card, Typography, Switch, TextField, Button, Grid, Tabs, Tab, Chip,
  CircularProgress, Divider, Dialog, DialogTitle, DialogContent, DialogActions,
  MenuItem, FormControlLabel, Checkbox, IconButton,
  Snackbar, Alert
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import EditIcon from '@mui/icons-material/Edit'; // 👈 Icono para editar
import { api } from '@/lib/api';
import { useRouter } from 'next/router';

interface Plato {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
  disponible: boolean;
  categoria_id: number;
  imagen?: string;
  categoria?: { id: number; nombre: string };
}

interface Categoria {
  id: number;
  nombre: string;
}

export default function GestionPlatos() {
  const router = useRouter();
  const [platos, setPlatos] = useState<Plato[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [filtro, setFiltro] = useState(0);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState<{ tipo: 'success' | 'error' | 'info'; texto: string } | null>(null);

  // Cambios pendientes (bulk save)
  const [cambios, setCambios] = useState<Record<number, { stock?: number; disponible?: boolean }>>({});

  // Dialog Nuevo/Editar Plato
  const [openModal, setOpenModal] = useState(false);
  const [platoEditando, setPlatoEditando] = useState<Plato | null>(null);
  const [formPlato, setFormPlato] = useState({
    nombre: '', precio: '', stock: '', categoria_id: '', disponible: true,
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [platosData, catsData] = await Promise.all([
        api.get('/platos'),
        api.get('/categorias'),
      ]);
      setPlatos(platosData);
      setCategorias(catsData);
    } catch {
      setMensaje({ tipo: 'error', texto: 'Error al cargar los datos.' });
    } finally {
      setLoading(false);
    }
  };

  const marcarStock = (plato: Plato, stock: number) => {
    setCambios((prev) => ({ ...prev, [plato.id]: { ...prev[plato.id], stock } }));
  };

  const toggleDisponible = (plato: Plato) => {
    const nuevo = cambios[plato.id]?.disponible ?? plato.disponible;
    setCambios((prev) => ({ ...prev, [plato.id]: { ...prev[plato.id], disponible: !nuevo } }));
  };

  const guardarEstadoDia = async () => {
    const ids = Object.keys(cambios).map(Number);
    if (ids.length === 0) {
      setMensaje({ tipo: 'info', texto: 'No hay cambios pendientes.' });
      return;
    }

    setGuardando(true);
    try {
      const payload = {
        platos: ids.map((id) => {
          const plato = platos.find((p) => p.id === id)!;
          return {
            id,
            stock: cambios[id]?.stock ?? plato.stock,
            disponible: cambios[id]?.disponible ?? plato.disponible,
          };
        }),
      };

      await api.post('/platos/estado-dia', payload);
      await cargarDatos(); 
      setCambios({});
      setMensaje({ tipo: 'success', texto: `✅ ${ids.length} plato(s) actualizados.` });
    } catch (error) {
      setMensaje({ tipo: 'error', texto: 'Error al guardar los cambios.' });
    } finally {
      setGuardando(false);
    }
  };

  const handleResetearDia = async () => {
    if (!window.confirm('⚠️ ¿Reiniciar el día? Todos los platos quedarán con stock 0 e inactivos.')) return;

    setGuardando(true);
    try {
      await api.post('/platos/resetear-dia');
      setPlatos((prev) => prev.map((p) => ({ ...p, stock: 0, disponible: false })));
      setCambios({});
      setMensaje({ tipo: 'info', texto: '🔄 Menú reiniciado. Activa los platos de hoy.' });
    } catch {
      setMensaje({ tipo: 'error', texto: 'Error al reiniciar el día.' });
    } finally {
      setGuardando(false);
    }
  };

  // 👇 Abrir modal para NUEVO
  const handleAbrirNuevo = () => {
    setPlatoEditando(null);
    setFormPlato({ nombre: '', precio: '', stock: '', categoria_id: '', disponible: true });
    setOpenModal(true);
  };

  // 👇 Abrir modal para EDITAR
  const handleAbrirEditar = (plato: Plato) => {
    setPlatoEditando(plato);
    setFormPlato({
      nombre: plato.nombre,
      precio: String(plato.precio),
      stock: String(plato.stock),
      categoria_id: String(plato.categoria_id),
      disponible: plato.disponible,
    });
    setOpenModal(true);
  };

  const handleGuardarPlato = async () => {
    if (!formPlato.nombre.trim() || !formPlato.precio || !formPlato.categoria_id) {
      setMensaje({ tipo: 'error', texto: 'Completa nombre, precio y categoría.' });
      return;
    }

    setGuardando(true);
    try {
      const payload = {
        nombre: formPlato.nombre.trim(),
        precio: Number(formPlato.precio),
        stock: Number(formPlato.stock) || 0,
        categoria_id: Number(formPlato.categoria_id),
        disponible: formPlato.disponible,
      };

      if (platoEditando) {
        // Modo Edición
        await api.put(`/platos/${platoEditando.id}`, payload);
        setMensaje({ tipo: 'success', texto: `✅ El plato "${payload.nombre}" se actualizó correctamente.` });
      } else {
        // Modo Creación
        await api.post('/platos', payload);
        setMensaje({ tipo: 'success', texto: `✅ El plato "${payload.nombre}" se creó correctamente.` });
      }
      
      setOpenModal(false);
      await cargarDatos(); 

    } catch (error: any) {
      const mensajeBackend = error?.response?.data?.message || 'Error al guardar el plato.';
      setMensaje({ tipo: 'error', texto: `❌ ${mensajeBackend}` });
    } finally {
      setGuardando(false);
    }
  };

  const platosFiltrados = platos.filter((p) => {
    if (filtro === 0) return true;
    const cat = categorias[filtro - 1];
    return cat && p.categoria_id === cat.id;
  });

  const totalCambios = Object.keys(cambios).length;

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress sx={{ color: '#C66B3D' }} /></Box>;
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#F6F1E7', minHeight: '100vh' }}>
      
      {/* HEADER */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton
            onClick={() => router.push('/menu')}
            sx={{
              bgcolor: '#FFFFFF', border: '1px solid #D8C3A5', color: '#3D3B2A',
              width: 42, height: 42, boxShadow: '0 1px 3px rgba(61, 59, 42, 0.08)',
              '&:hover': { bgcolor: '#F9F6F2', borderColor: '#C66B3D' },
              transition: 'all 0.2s ease',
            }}
          >
            <ArrowBackIcon sx={{ fontSize: 20 }} />
          </IconButton>

          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#3D3B2A', letterSpacing: '-0.5px' }}>
              Menú del Día
            </Typography>
            <Typography variant="body1" sx={{ color: '#6B7B3A', mt: 0.5, fontWeight: 500 }}>
              Activa los platos de hoy y ajusta el stock disponible.
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="outlined" startIcon={<RestartAltIcon />} onClick={handleResetearDia} disabled={guardando}
            sx={{ borderColor: '#C66B3D', color: '#C66B3D', fontWeight: 700, textTransform: 'none', '&:hover': { bgcolor: 'rgba(198, 107, 61, 0.05)', borderColor: '#A5552D' } }}
          >
            🔄 Reiniciar Día
          </Button>
          <Button
            variant="contained" startIcon={<SaveIcon />} onClick={guardarEstadoDia} disabled={guardando || totalCambios === 0}
            sx={{ bgcolor: '#6B7B3A', fontWeight: 700, textTransform: 'none', color: '#FFFFFF', '&:hover': { bgcolor: '#57662E' } }}
          >
            Guardar {totalCambios > 0 ? `(${totalCambios})` : ''}
          </Button>
          <Button
            variant="contained" startIcon={<AddIcon />} onClick={handleAbrirNuevo}
            sx={{ bgcolor: '#3D3B2A', fontWeight: 700, textTransform: 'none', '&:hover': { bgcolor: '#2A281D' } }}
          >
            Nuevo Plato
          </Button>
        </Box>
      </Box>

      {/* TABS */}
      <Card elevation={0} sx={{ mb: 3, borderRadius: 2, border: '1px solid #E7E5E4', overflow: 'hidden', bgcolor: '#FFFFFF' }}>
        <Tabs
          value={filtro} onChange={(_, v) => setFiltro(v)} variant="scrollable" scrollButtons="auto"
          sx={{ '& .MuiTab-root': { fontWeight: 700, textTransform: 'none', py: 1.5, color: '#78716C', '&.Mui-selected': { color: '#3D3B2A' } }, '& .MuiTabs-indicator': { bgcolor: '#C66B3D', height: 3 } }}
        >
          <Tab label={`Todos (${platos.length})`} />
          {categorias.map((c, idx) => (
            <Tab
              key={c.id} label={c.nombre}
              icon={idx === 0 ? <LocalDiningIcon sx={{ fontSize: 18 }} /> : idx === 1 ? <RestaurantMenuIcon sx={{ fontSize: 18 }} /> : <LocalBarIcon sx={{ fontSize: 18 }} />}
              iconPosition="start"
            />
          ))}
        </Tabs>
      </Card>

      {/* GRID DE PLATOS */}
      <Grid container spacing={2}>
        {platosFiltrados.map((plato) => {
          const stockActual = cambios[plato.id]?.stock ?? plato.stock;
          const disponibleActual = cambios[plato.id]?.disponible ?? plato.disponible;
          const modificado = !!cambios[plato.id];

          return (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={plato.id}>
              <Card elevation={0} sx={{
                border: '2px solid', borderColor: modificado ? '#6B7B3A' : disponibleActual ? '#D8C3A5' : '#E7E5E4',
                borderRadius: 2.5, p: 2.5, transition: 'all 0.2s', opacity: disponibleActual ? 1 : 0.7,
                bgcolor: '#FFFFFF',
                '&:hover': { boxShadow: '0 8px 24px rgba(61, 59, 42, 0.08)' },
              }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="subtitle1" noWrap sx={{ fontWeight: 800, color: '#3D3B2A', lineHeight: 1.2 }}>
                      {plato.nombre}
                    </Typography>
                    <Chip label={plato.categoria?.nombre || 'Sin categoría'} size="small" sx={{ mt: 1, bgcolor: '#F6F1E7', color: '#6B7B3A', fontWeight: 700, height: 22 }} />
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#C66B3D' }}>
                      Bs {plato.precio}
                    </Typography>
                    {/* 👇 BOTÓN DE EDITAR */}
                    <IconButton size="small" onClick={() => handleAbrirEditar(plato)} sx={{ mt: 0.5, color: '#A8A29E', '&:hover': { color: '#C66B3D', bgcolor: 'rgba(198, 107, 61, 0.08)' } }}>
                      <EditIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  </Box>
                </Box>

                <Divider sx={{ my: 1.5, borderColor: '#F5F5F4' }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: '#78716C' }}>Stock:</Typography>
                    <TextField
                      type="number" size="small" value={stockActual}
                      onChange={(e) => marcarStock(plato, parseInt(e.target.value) || 0)}
                      slotProps={{ htmlInput: { min: 0, style: { width: '60px', textAlign: 'center', fontWeight: 700, color: '#3D3B2A' } } }}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, bgcolor: modificado ? '#FFF0E6' : '#F9F6F2', '& fieldset': { borderColor: modificado ? '#C66B3D' : '#E7E5E4' } } }}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: disponibleActual ? '#6B7B3A' : '#A8A29E' }}>
                      {disponibleActual ? 'Activo' : 'Inactivo'}
                    </Typography>
                    <Switch
                      checked={disponibleActual} onChange={() => toggleDisponible(plato)}
                      sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#6B7B3A' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#6B7B3A' } }}
                    />
                  </Box>
                </Box>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* DIALOG NUEVO / EDITAR PLATO */}
      <Dialog open={openModal} onClose={() => !guardando && setOpenModal(false)} maxWidth="sm" fullWidth slotProps={{ paper: { sx: { borderRadius: 3 } } }}>
        <DialogTitle sx={{ fontWeight: 800, color: '#3D3B2A', pb: 1 }}>
          {platoEditando ? 'Editar Plato' : 'Nuevo Plato'}
        </DialogTitle>
        <DialogContent dividers sx={{ borderColor: '#F5F5F4' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField 
              label="Nombre" fullWidth 
              value={formPlato.nombre} onChange={(e) => setFormPlato({ ...formPlato, nombre: e.target.value })} 
              sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#F9F6F2' } }}
            />
            <Grid container spacing={2}>
              <Grid size={{ xs: 6 }}>
                <TextField label="Precio (Bs)" type="number" fullWidth value={formPlato.precio} onChange={(e) => setFormPlato({ ...formPlato, precio: e.target.value })} slotProps={{ htmlInput: { min: 0, step: 0.5 } }} sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#F9F6F2' } }} />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField label="Stock" type="number" fullWidth value={formPlato.stock} onChange={(e) => setFormPlato({ ...formPlato, stock: e.target.value })} slotProps={{ htmlInput: { min: 0 } }} sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#F9F6F2' } }} />
              </Grid>
            </Grid>
            <TextField select label="Categoría" fullWidth value={formPlato.categoria_id} onChange={(e) => setFormPlato({ ...formPlato, categoria_id: e.target.value })} sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#F9F6F2' } }}>
              {categorias.map((c) => (
                <MenuItem key={c.id} value={c.id}>{c.nombre}</MenuItem>
              ))}
            </TextField>
            <FormControlLabel
              control={<Checkbox checked={formPlato.disponible} onChange={(e) => setFormPlato({ ...formPlato, disponible: e.target.checked })} sx={{ color: '#C66B3D', '&.Mui-checked': { color: '#C66B3D' } }} />}
              label={<Typography sx={{ fontWeight: 600, color: '#3D3B2A' }}>Activar en el menú de hoy</Typography>}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, bgcolor: '#F9F6F2' }}>
          <Button onClick={() => setOpenModal(false)} disabled={guardando} sx={{ textTransform: 'none', fontWeight: 700, color: '#78716C' }}>
            Cancelar
          </Button>
          <Button
            variant="contained" startIcon={<SaveIcon />} onClick={handleGuardarPlato} disabled={guardando}
            sx={{ bgcolor: '#C66B3D', fontWeight: 700, textTransform: 'none', color: '#FFFFFF', '&:hover': { bgcolor: '#A5552D' } }}
          >
            {guardando ? 'Guardando...' : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* SNACKBAR DE NOTIFICACIÓN */}
      <Snackbar
        open={!!mensaje}
        autoHideDuration={4000}
        onClose={() => setMensaje(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setMensaje(null)} 
          severity={mensaje?.tipo || 'info'} 
          sx={{ width: '100%', fontWeight: 700, boxShadow: '0 4px 12px rgba(0,0,0,0.15)', borderRadius: 2 }}
        >
          {mensaje?.texto}
        </Alert>
      </Snackbar>
      
    </Box>
  );
}