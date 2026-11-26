import { useState } from 'react';
import {
  Box, Card, CardContent, CardMedia, Typography, Button, Grid, 
  Select, MenuItem, FormControl, Chip, Avatar
} from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import AddIcon from '@mui/icons-material/Add';

interface MenuCompletoCardProps {
  segundos: any[];
  stockSegundos: Record<string | number, number>;
  stockSopas: Record<string | number, number>;
  sopasDisponibles: any[];
  precioCompleto: number;
  onAgregarCompleto: (segundo: any, sopaElegida: any) => void;
}

export default function MenuCompletoCard({ 
  segundos, 
  stockSopas,
  stockSegundos, 
  sopasDisponibles, 
  precioCompleto,
  onAgregarCompleto 
}: MenuCompletoCardProps) {
  
  const [sopaComboId, setSopaComboId] = useState<string | number>(sopasDisponibles[0]?.id || '');
  const sopaSeleccionada = sopasDisponibles.find((s) => String(s.id) === String(sopaComboId));

  const DEFAULT_COMBO_IMG = 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=100&q=80';

  if (segundos.length === 0 || sopasDisponibles.length === 0) return null;

  // 🛡️ FUNCIÓN BLINDADA: Encuentra el stock sin importar si el ID es número o texto
  const obtenerStockSopa = (id: string | number) => {
    return stockSopas[id] ?? stockSopas[String(id)] ?? stockSopas[Number(id)] ?? 0;
  };

  const obtenerStockSegundo = (id: string | number) => {
    return stockSegundos[id] ?? stockSegundos[String(id)] ?? stockSegundos[Number(id)] ?? 0;
  };

  return (
    <Card
      elevation={0}
      sx={{
        mb: 2,
        border: '1px solid #D8C3A5',
        borderRadius: 2.5,
        overflow: 'hidden',
        position: 'relative',
        background: `
          linear-gradient(135deg, #FAF8F3 0%, #FFFFFF 55%, #F1E9DC 100%),
          radial-gradient(circle at 1px 1px, rgba(107, 123, 58, 0.08) 1px, transparent 0)
        `,
        backgroundSize: '100% 100%, 12px 12px',
        boxShadow: '0 4px 16px rgba(61, 59, 42, 0.07), 0 2px 6px rgba(61, 59, 42, 0.04)',
        transition: 'all 0.2s ease',
        '&:hover': {
          boxShadow: '0 8px 24px rgba(61, 59, 42, 0.12)',
        }
      }}
    >
      {/* LINEA DECORATIVA SUPERIOR */}
      <Box sx={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 4,
        background: 'linear-gradient(90deg, #6B7B3A 0%, #89965D 50%, #6B7B3A 100%)',
      }} />

      <CardContent sx={{ p: { xs: 2, sm: 2.5 }, pt: { xs: 3, sm: 3.5 } }}>

        {/* HEADER COMPACTO */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 2 }}>
          <Avatar sx={{
            width: 36,
            height: 36,
            borderRadius: 1.5,
            bgcolor: '#F1E9DC',
            color: '#6B7B3A',
            boxShadow: '0 2px 8px rgba(107, 123, 58, 0.12)'
          }}>
            <RestaurantIcon sx={{ fontSize: 20 }} />
          </Avatar>

          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" sx={{
              fontWeight: 800,
              color: '#3D3B2A',
              fontSize: '1rem',
              lineHeight: 1.2,
              letterSpacing: '0.1px'
            }}>
              Almuerzos Completos
            </Typography>

            <Typography variant="caption" sx={{
              color: '#6B7B3A',
              fontSize: '0.75rem',
              fontWeight: 500,
              lineHeight: 1.4
            }}>
              Sopa + Segundo + Refresco (opcional)
            </Typography>
          </Box>

          <Chip
            label={`Bs. ${precioCompleto}`}
            sx={{
              bgcolor: '#C66B3D',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: '0.875rem',
              height: 28
            }}
          />
        </Box>

        {/* SELECTOR DE SOPA */}
        {sopasDisponibles.length > 1 && sopaSeleccionada && (
          <Box sx={{
            mb: 2,
            p: 1.5,
            bgcolor: '#FFFFFF',
            borderRadius: 2,
            border: '1px solid #D8C3A5'
          }}>
            <Typography variant="caption" sx={{
              fontWeight: 700,
              fontSize: '0.75rem',
              color: '#6B7B3A',
              mb: 0.5,
              display: 'block'
            }}>
              🍲 Sopa seleccionada para el combo:
            </Typography>

            <FormControl fullWidth size="small">
              <Select
                value={sopaComboId}
                onChange={(e) => setSopaComboId(e.target.value)}
                sx={{
                  bgcolor: '#FAF8F3',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  color: '#3D3B2A',
                  '& .MuiSelect-select': { py: 0.75 }
                }}
              >
                {sopasDisponibles.map((sopa) => {
                  // 🛡️ Usamos la función blindada para obtener el stock en tiempo real
                  const stockEnVivo = obtenerStockSopa(sopa.id); 
                  
                  return (
                    <MenuItem key={sopa.id} value={sopa.id}>
                      <Typography component="span" sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#3D3B2A' }}>
                        {sopa.nombre}
                      </Typography>
                      <Box component="span" sx={{ color: '#6B7B3A', ml: 1, fontSize: '0.75rem', fontWeight: 500 }}>
                        (Stock: {stockEnVivo})
                      </Box>
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Box>
        )}

        {/* GRID DE COMBOS */}
        <Grid container spacing={1.5}>
          {segundos.map((segundo) => {
            // 🛡️ Usamos las funciones blindadas para evitar fallos de tipo "1" vs "1"
            const stockSegundo = obtenerStockSegundo(segundo.id);
            const stockSopaActual = sopaSeleccionada ? obtenerStockSopa(sopaSeleccionada.id) : 0;
            const agotado = stockSegundo <= 0 || stockSopaActual <= 0;

            return (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={`combo-${segundo.id}`}>
                <Card
                  onClick={() => !agotado && onAgregarCompleto(segundo, sopaSeleccionada)}
                  sx={{
                    height: '100%',
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: agotado ? '#e2e8f0' : '#D8C3A5',
                    bgcolor: agotado ? '#fafafa' : '#FFFFFF',
                    opacity: agotado ? 0.6 : 1,
                    cursor: agotado ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: agotado ? 'none' : 'translateY(-2px)',
                      boxShadow: agotado ? 'none' : '0 4px 12px rgba(107, 123, 58, 0.14)',
                      borderColor: agotado ? '#e2e8f0' : '#6B7B3A',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', p: 1.25 }}>

                    {/* IMAGEN DEL SEGUNDO */}
                    <CardMedia
                      component="img"
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: 1.5,
                        objectFit: 'cover',
                        mr: 1,
                        border: '2px solid #F1E9DC',
                        flexShrink: 0,
                        bgcolor: '#f5f5f5',
                      }}
                      image={segundo.img || DEFAULT_COMBO_IMG}
                      alt={segundo.nombre}
                    />

                    {/* INFORMACION DEL COMBO */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        sx={{
                          fontWeight: 700,
                          fontSize: '0.875rem',
                          lineHeight: 1.2,
                          color: agotado ? '#94a3b8' : '#3D3B2A',
                          mb: 0.25,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {segundo.nombre}
                      </Typography>

                      <Typography
                        sx={{
                          fontSize: '0.75rem',
                          color: '#6B7B3A',
                          fontWeight: 500,
                          lineHeight: 1.4,
                          mb: 0.5,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        + {sopaSeleccionada?.nombre || 'Sopa del día'}
                      </Typography>

                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Chip
                          label={agotado ? 'Agotado' : `${Math.min(stockSegundo, stockSopaActual)} disp.`}
                          size="small"
                          sx={{
                            height: 18,
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            bgcolor: agotado ? '#f1f5f9' : '#EEF1E6',
                            color: agotado ? '#94a3b8' : '#6B7B3A',
                            '& .MuiChip-label': { px: 0.5 },
                          }}
                        />
                      </Box>
                    </Box>

                    {/* BOTON AGREGAR */}
                    <Button
                      variant="contained"
                      disableElevation
                      disabled={agotado}
                      onClick={(e) => {
                        e.stopPropagation();
                        onAgregarCompleto(segundo, sopaSeleccionada);
                      }}
                      sx={{
                        minWidth: 34,
                        height: 34,
                        borderRadius: 1.5,
                        p: 0,
                        ml: 0.5,
                        bgcolor: agotado ? '#e2e8f0' : '#6B7B3A',
                        color: '#FFFFFF',
                        boxShadow: 'none',
                        '&:hover': {
                          bgcolor: agotado ? '#e2e8f0' : '#3D3B2A',
                          boxShadow: '0 4px 8px rgba(61, 59, 42, 0.2)',
                        },
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <AddIcon sx={{ fontSize: 20 }} />
                    </Button>
                  </Box>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </CardContent>
    </Card>
  );
}