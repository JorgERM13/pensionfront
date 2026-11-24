// pos/components/GestionPlatos.tsx
import { useState, useEffect } from 'react';
import {
  Box, Card, Typography, Switch, TextField, Button, Grid, Tabs, Tab, Chip,
  CircularProgress, Divider, Dialog, DialogTitle, DialogContent, DialogActions,
  MenuItem, FormControlLabel, Checkbox, IconButton,
  Snackbar, Alert // 👈 Agregamos Snackbar y Alert para la notificación
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocalBarIcon from '@mui/icons-material/LocalBar';
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

  // Dialog Nuevo Plato
  const [openNuevo, setOpenNuevo] = useState(false);
  const [nuevoPlato, setNuevoPlato] = useState({
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

      // 1. Enviamos los cambios al backend
      await api.post('/platos/estado-dia', payload);

      // 2. 🚨 LA SOLUCIÓN: Recargamos los datos desde el backend
      // Esto garantiza que la pantalla muestre el estado REAL guardado en MySQL
      await cargarDatos(); 

      // 3. Limpiamos los cambios pendientes
      setCambios({});
      setMensaje({ tipo: 'success', texto: `✅ ${ids.length} plato(s) actualizados correctamente.` });
      setTimeout(() => setMensaje(null), 3000);
      
    } catch (error) {
      console.error("Error al guardar estado:", error);
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

  const handleGuardarNuevoPlato = async () => {
    if (!nuevoPlato.nombre.trim()) {
      setMensaje({ tipo: 'error', texto: 'El nombre es obligatorio.' });
      return;
    }
    if (!nuevoPlato.precio || Number(nuevoPlato.precio) <= 0) {
      setMensaje({ tipo: 'error', texto: 'El precio debe ser mayor a 0.' });
      return;
    }
    if (!nuevoPlato.categoria_id) {
      setMensaje({ tipo: 'error', texto: 'Selecciona una categoría.' });
      return;
    }

    setGuardando(true);
    try {
      const payload = {
        nombre: nuevoPlato.nombre.trim(),
        precio: Number(nuevoPlato.precio),
        stock: Number(nuevoPlato.stock) || 0,
        categoria_id: Number(nuevoPlato.categoria_id),
        disponible: nuevoPlato.disponible,
      };

      // 1. Enviamos el plato al backend
      const response = await api.post('/platos', payload);
      
      // 2. Evaluamos si el backend devolvió el plato con nombre
      const nombrePlato = response?.nombre || response?.data?.nombre || payload.nombre;

      // 3. Mostramos el mensaje de éxito
      setMensaje({ tipo: 'success', texto: `✅ ¡El plato "${nombrePlato}" se creó correctamente!` });
      
      // 4. Cerramos el modal y limpiamos el formulario
      setOpenNuevo(false);
      setNuevoPlato({ nombre: '', precio: '', stock: '', categoria_id: '', disponible: true });

      // 5. 🚨 LA SOLUCIÓN: Recargamos los datos para que el nuevo plato aparezca en la lista real
      await cargarDatos(); 

    } catch (error: any) {
      console.error('❌ Error al crear plato:', error);

      const mensajeBackend =
        error?.response?.data?.message ||
        error?.response?.data?.errors?.[Object.keys(error?.response?.data?.errors || {})[0]]?.[0] ||
        error?.message ||
        'Error al crear el plato.';

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
    return <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>;
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      
      {/* HEADER (Igual al tuyo) */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton
            onClick={() => router.push('/menu')}
            sx={{
              bgcolor: '#ffffff', border: '1px solid #e2e8f0', color: '#475569',
              width: 42, height: 42, boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)',
              '&:hover': { bgcolor: '#f8fafc', borderColor: '#cbd5e1', transform: 'translateX(-2px)' },
              transition: 'all 0.2s ease',
            }}
          >
            <ArrowBackIcon sx={{ fontSize: 20 }} />
          </IconButton>

          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>
              Menú del Día
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748b', mt: 0.5 }}>
              Activa los platos de hoy y ajusta el stock disponible.
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="outlined" startIcon={<RestartAltIcon />} onClick={handleResetearDia} disabled={guardando}
            sx={{ borderColor: '#f59e0b', color: '#f59e0b', fontWeight: 700, textTransform: 'none', '&:hover': { bgcolor: '#fffbeb', borderColor: '#d97706' } }}
          >
            🔄 Reiniciar Día
          </Button>
          <Button
            variant="contained" startIcon={<SaveIcon />} onClick={guardarEstadoDia} disabled={guardando || totalCambios === 0}
            sx={{ bgcolor: '#10b981', fontWeight: 700, textTransform: 'none', '&:hover': { bgcolor: '#059669' } }}
          >
            Guardar {totalCambios > 0 ? `(${totalCambios})` : ''}
          </Button>
          <Button
            variant="contained" startIcon={<AddIcon />} onClick={() => setOpenNuevo(true)}
            sx={{ bgcolor: '#1e293b', fontWeight: 700, textTransform: 'none', '&:hover': { bgcolor: '#0f172a' } }}
          >
            Nuevo Plato
          </Button>
        </Box>
      </Box>

      {/* TABS (Igual al tuyo) */}
      <Card elevation={0} sx={{ mb: 3, borderRadius: 2, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <Tabs
          value={filtro} onChange={(_, v) => setFiltro(v)} variant="scrollable" scrollButtons="auto"
          sx={{ '& .MuiTab-root': { fontWeight: 700, textTransform: 'none', py: 1.5, color: '#64748b', '&.Mui-selected': { color: '#0f172a' } }, '& .MuiTabs-indicator': { bgcolor: '#1e293b', height: 3 } }}
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

      {/* GRID DE PLATOS (Igual al tuyo) */}
      <Grid container spacing={2}>
        {platosFiltrados.map((plato) => {
          const stockActual = cambios[plato.id]?.stock ?? plato.stock;
          const disponibleActual = cambios[plato.id]?.disponible ?? plato.disponible;
          const modificado = !!cambios[plato.id];

          return (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={plato.id}>
              <Card elevation={0} sx={{
                border: '2px solid', borderColor: modificado ? '#3b82f6' : disponibleActual ? '#10b981' : '#e2e8f0',
                borderRadius: 2.5, p: 2.5, transition: 'all 0.2s', opacity: disponibleActual ? 1 : 0.7,
                '&:hover': { boxShadow: '0 8px 24px rgba(0,0,0,0.06)' },
              }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
                      {plato.nombre}
                    </Typography>
                    <Chip label={plato.categoria?.nombre || 'Sin categoría'} size="small" sx={{ mt: 1, bgcolor: '#f1f5f9', color: '#475569', fontWeight: 600, height: 22 }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e293b' }}>
                    Bs {plato.precio}
                  </Typography>
                </Box>

                <Divider sx={{ my: 1.5 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: '#64748b' }}>Stock:</Typography>
                    <TextField
                      type="number" size="small" value={stockActual}
                      onChange={(e) => marcarStock(plato, parseInt(e.target.value) || 0)}
                      slotProps={{ htmlInput: { min: 0, style: { width: '60px', textAlign: 'center', fontWeight: 700 } } }}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, bgcolor: modificado ? '#eff6ff' : '#f8fafc' } }}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: disponibleActual ? '#10b981' : '#94a3b8' }}>
                      {disponibleActual ? 'Activo' : 'Inactivo'}
                    </Typography>
                    <Switch
                      checked={disponibleActual} onChange={() => toggleDisponible(plato)}
                      sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#10b981' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#10b981' } }}
                    />
                  </Box>
                </Box>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* DIALOG NUEVO PLATO */}
      <Dialog open={openNuevo} onClose={() => !guardando && setOpenNuevo(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Nuevo Plato</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField label="Nombre" fullWidth value={nuevoPlato.nombre} onChange={(e) => setNuevoPlato({ ...nuevoPlato, nombre: e.target.value })} />
            <Grid container spacing={2}>
              <Grid size={{ xs: 6 }}>
                <TextField label="Precio (Bs)" type="number" fullWidth value={nuevoPlato.precio} onChange={(e) => setNuevoPlato({ ...nuevoPlato, precio: e.target.value })} slotProps={{ htmlInput: { min: 0, step: 0.5 } }} />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField label="Stock" type="number" fullWidth value={nuevoPlato.stock} onChange={(e) => setNuevoPlato({ ...nuevoPlato, stock: e.target.value })} slotProps={{ htmlInput: { min: 0 } }} />
              </Grid>
            </Grid>
            <TextField select label="Categoría" fullWidth value={nuevoPlato.categoria_id} onChange={(e) => setNuevoPlato({ ...nuevoPlato, categoria_id: e.target.value })}>
              {categorias.map((c) => (
                <MenuItem key={c.id} value={c.id}>{c.nombre}</MenuItem>
              ))}
            </TextField>
            <FormControlLabel
              control={<Checkbox checked={nuevoPlato.disponible} onChange={(e) => setNuevoPlato({ ...nuevoPlato, disponible: e.target.checked })} sx={{ color: '#10b981', '&.Mui-checked': { color: '#10b981' } }} />}
              label="Activar en el menú de hoy"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenNuevo(false)} disabled={guardando} sx={{ textTransform: 'none', fontWeight: 700 }}>
            Cancelar
          </Button>
          <Button
            variant="contained" startIcon={<SaveIcon />} onClick={handleGuardarNuevoPlato} disabled={guardando}
            sx={{ bgcolor: '#1e293b', fontWeight: 700, textTransform: 'none', '&:hover': { bgcolor: '#0f172a' } }}
          >
            {guardando ? 'Guardando...' : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* 👇 SNACKBAR: Aquí aparece el aviso de confirmación flotante */}
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
          {mensaje?.texto}ha
        </Alert>
      </Snackbar>
      
    </Box>
  );
}