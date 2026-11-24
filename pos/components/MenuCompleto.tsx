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
  stockSopa: number;
  sopasDisponibles: any[];
  precioCompleto: number;
  onAgregarCompleto: (segundo: any, sopaElegida: any) => void;
}

export default function MenuCompletoCard({ 
  segundos, 
  stockSegundos, 
  sopasDisponibles, 
  precioCompleto,
  onAgregarCompleto 
}: MenuCompletoCardProps) {
  
  const [sopaComboId, setSopaComboId] = useState<string | number>(sopasDisponibles[0]?.id || '');
  const sopaSeleccionada = sopasDisponibles.find((s) => s.id === sopaComboId);

  const DEFAULT_COMBO_IMG = 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=100&q=80';

  if (segundos.length === 0 || sopasDisponibles.length === 0) return null;

  return (
    <Card
      elevation={0}
      sx={{
        mb: 2,
        border: '1px solid #c5d1a8', // Borde verde aceituna suave
        borderRadius: 2.5,
        overflow: 'hidden',
        position: 'relative',
        // 👇 FONDO VERDE ACEITUNA ELEGANTE: Gradiente cálido + patrón sutil
        background: `
          linear-gradient(135deg, #f5f7ef 0%, #ffffff 50%, #e8edd8 100%),
          radial-gradient(circle at 1px 1px, rgba(85, 107, 47, 0.1) 1px, transparent 0)
        `,
        backgroundSize: '100% 100%, 12px 12px',
        boxShadow: '0 4px 16px rgba(85, 107, 47, 0.1), 0 2px 6px rgba(85, 107, 47, 0.05)',
        transition: 'all 0.2s ease',
        '&:hover': {
          boxShadow: '0 8px 24px rgba(85, 107, 47, 0.15)',
        }
      }}
    >
      {/* 👇 LÍNEA DECORATIVA SUPERIOR VERDE ACEITUNA */}
      <Box sx={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 4,
        background: 'linear-gradient(90deg, #556B2F 0%, #6B7F3A 50%, #556B2F 100%)',
      }} />

      <CardContent sx={{ p: { xs: 2, sm: 2.5 }, pt: { xs: 3, sm: 3.5 } }}>
        
        {/* 👇 HEADER COMPACTO */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 2 }}>
          <Avatar sx={{ width: 36, height: 36, borderRadius: 1.5, bgcolor: '#ffffff', color: '#556B2F', boxShadow: '0 2px 8px rgba(85, 107, 47, 0.15)' }}>
            <RestaurantIcon sx={{ fontSize: 20 }} />
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#3D4A2A', fontSize: '0.95rem', lineHeight: 1.1 }}>
              Almuerzos Completos
            </Typography>
            <Typography variant="caption" sx={{ color: '#556B2F', fontSize: '0.7rem', fontWeight: 600 }}>
              Sopa + Segundo + Refresco (opcional)
            </Typography>
          </Box>
          <Chip 
            label={`Bs. ${precioCompleto}`} 
            sx={{ bgcolor: '#556B2F', color: '#ffffff', fontWeight: 800, fontSize: '0.85rem', height: 28 }} 
          />
        </Box>

        {/* 👇 SELECTOR DE SOPA (Elegante y compacto) */}
        {sopasDisponibles.length > 1 && sopaSeleccionada && (
          <Box sx={{ mb: 2, p: 1.5, bgcolor: '#ffffff', borderRadius: 2, border: '1px solid #c5d1a8' }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#556B2F', mb: 0.5, display: 'block' }}>
              🍲 Sopa seleccionada para el combo:
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                value={sopaComboId}
                onChange={(e) => setSopaComboId(e.target.value)}
                sx={{ 
                  bgcolor: '#f5f7ef', 
                  fontWeight: 600, 
                  color: '#3D4A2A',
                  '& .MuiSelect-select': { py: 0.75 }
                }}
              >
                {sopasDisponibles.map((sopa) => (
                  <MenuItem key={sopa.id} value={sopa.id}>
                    {sopa.nombre} <Box component="span" sx={{ color: '#556B2F', ml: 1 }}>(Stock: {sopa.stock})</Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        )}

        {/* 👇 GRID DE COMBOS (Mismo formato compacto que Sopas/Segundos) */}
        <Grid container spacing={1.5}>
          {segundos.map((segundo) => {
            const stockSegundo = stockSegundos[segundo.id] || 0;
            const stockSopaActual = sopaSeleccionada?.stock || 0;
            const agotado = stockSegundo <= 0 || stockSopaActual <= 0;

            return (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={`combo-${segundo.id}`}>
                <Card
                  onClick={() => !agotado && onAgregarCompleto(segundo, sopaSeleccionada)}
                  sx={{
                    height: '100%',
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: agotado ? '#e2e8f0' : '#c5d1a8',
                    bgcolor: agotado ? '#fafafa' : '#ffffff',
                    opacity: agotado ? 0.6 : 1,
                    cursor: agotado ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: agotado ? 'none' : 'translateY(-2px)',
                      boxShadow: agotado ? 'none' : '0 4px 12px rgba(85, 107, 47, 0.15)',
                      borderColor: agotado ? '#e2e8f0' : '#556B2F',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', p: 1.25 }}>
                    
                    {/* Imagen del segundo (representa el combo) */}
                    <CardMedia
                      component="img"
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: 1.5,
                        objectFit: 'cover',
                        mr: 1,
                        border: '2px solid #e8edd8',
                        flexShrink: 0,
                        bgcolor: '#f5f5f5',
                      }}
                      image={segundo.img || DEFAULT_COMBO_IMG}
                      alt={segundo.nombre}
                    />

                    {/* Información del Combo */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        sx={{
                          fontWeight: 700,
                          fontSize: '0.85rem',
                          lineHeight: 1.2,
                          color: agotado ? '#94a3b8' : '#3D4A2A',
                          mb: 0.25,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {segundo.nombre}
                      </Typography>
                      
                      {/* Muestra la sopa que se está combinando */}
                      <Typography
                        sx={{
                          fontSize: '0.7rem',
                          color: '#556B2F',
                          fontWeight: 600,
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
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            bgcolor: agotado ? '#f1f5f9' : '#e8edd8',
                            color: agotado ? '#94a3b8' : '#556B2F',
                            '& .MuiChip-label': { px: 0.5 },
                          }}
                        />
                      </Box>
                    </Box>

                    {/* Botón compacto de agregar */}
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
                        bgcolor: agotado ? '#e2e8f0' : '#556B2F',
                        color: 'white',
                        boxShadow: 'none',
                        '&:hover': {
                          bgcolor: agotado ? '#e2e8f0' : '#3D4A2A',
                          boxShadow: '0 4px 8px rgba(85, 107, 47, 0.3)',
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