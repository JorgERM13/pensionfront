import { Box, Card, CardMedia, Typography, Button, Grid, Avatar, Chip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import LocalBarIcon from '@mui/icons-material/LocalBar';

interface Refresco {
  id: number | string;
  nombre: string;
  precio: number;
  stock: number;
  img?: string;
}

interface RefrescosCardProps {
  refrescos: Refresco[];
  stockRefrescos: Record<string | number, number>;
  onAgregarRefresco: (refresco: Refresco) => void;
  totalDisponibles?: number;   // 👈 NUEVA PROP
}

export default function RefrescosCard({
  refrescos,
  stockRefrescos,
  onAgregarRefresco,
  totalDisponibles = 0,        // 👈 NUEVA PROP con default
}: RefrescosCardProps) {
  if (!refrescos || refrescos.length === 0) return null;

  return (
    <Card
      elevation={0}
      sx={{
        width: '100%',
        border: '1px solid #94a89c',
        borderRadius: 2.5,
        overflow: 'visible',
        background: `linear-gradient(135deg, #f4f7f5 0%, #ffffff 50%, #f4f7f5 100%), radial-gradient(circle at 1px 1px, rgba(44, 95, 71, 0.05) 1px, transparent 0)`,
        backgroundSize: '100% 100%, 16px 16px',
        boxShadow: '0 4px 12px rgba(44, 95, 71, 0.06), 0 1px 3px rgba(44, 95, 71, 0.03)',
      }}
    >
      <Box sx={{ p: { xs: 1.5, sm: 2 }, pt: { xs: 2.5, sm: 3 } }}>
        
        {/* Header Compacto */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
          <Avatar sx={{ width: 32, height: 32, borderRadius: 1.5, bgcolor: '#ffffff', color: '#2c5f47', boxShadow: '0 2px 6px rgba(44, 95, 71, 0.15)' }}>
            <LocalBarIcon sx={{ fontSize: 18 }} />
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1a3a2a', fontSize: '0.9rem', lineHeight: 1.1 }}>
              Refrescos y Bebidas
            </Typography>
          </Box>

          {/* 👇 CHIP CON EL TOTAL DE REFRESCOS */}
          <Chip
            label={`${totalDisponibles} disponibles`}
            size="small"
            sx={{
              height: 24,
              fontSize: '0.7rem',
              fontWeight: 700,
              bgcolor: totalDisponibles > 0 ? '#e0f2fe' : '#f1f5f9',
              color: totalDisponibles > 0 ? '#0369a1' : '#64748b',
              border: `1px solid ${totalDisponibles > 0 ? '#bae6fd' : '#e2e8f0'}`,
              '& .MuiChip-label': { px: 1 },
            }}
          />
        </Box>

        <Grid container spacing={1.5}>
          {refrescos.map((refresco) => {
            const stockActual = stockRefrescos[refresco.id] || 0;
            const agotado = stockActual === 0;

            return (
              <Grid size={{ xs: 12, sm: 4, md: 4 }} key={refresco.id}>
                <Card
                  onClick={() => !agotado && onAgregarRefresco(refresco)}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    p: 1.25,
                    borderRadius: 1.5,
                    border: '1px solid',
                    borderColor: agotado ? '#e2e8f0' : '#cbd5d1',
                    bgcolor: agotado ? '#fafafa' : '#ffffff',
                    opacity: agotado ? 0.6 : 1,
                    cursor: agotado ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: agotado ? 'none' : '0 1px 4px rgba(44, 95, 71, 0.06)',
                    '&:hover': {
                      transform: agotado ? 'none' : 'translateY(-2px)',
                      boxShadow: agotado ? 'none' : '0 4px 10px rgba(44, 95, 71, 0.15)',
                      borderColor: '#2c5f47',
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: 1.5,
                      objectFit: 'cover',
                      border: '1px solid #e2e8e5',
                      flexShrink: 0,
                      bgcolor: '#f8faf9',
                    }}
                    image={refresco.img || 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?auto=format&fit=crop&w=100&q=80'}
                    alt={refresco.nombre}
                  />

                  <Box sx={{ flex: 1, minWidth: 0, ml: 1.25 }}>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        lineHeight: 1.2,
                        color: agotado ? '#94a3b8' : '#1a3a2a',
                        mb: 0.25,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {refresco.nombre}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography sx={{ fontWeight: 800, color: '#2c5f47', fontSize: '0.8rem' }}> 
                        Bs {refresco.precio.toFixed(2)}
                      </Typography>
                      
                      <Typography sx={{ fontSize: '0.7rem', color: agotado ? '#ef4444' : '#4a6b5a', fontWeight: 700 }}>
                        {agotado ? 'Agotado' : `${stockActual} disp.`}
                      </Typography>
                    </Box>
                  </Box>

                  <Button
                    variant="contained"
                    disableElevation
                    disabled={agotado}
                    onClick={(e) => {
                      e.stopPropagation();
                      onAgregarRefresco(refresco);
                    }}
                    sx={{
                      minWidth: 32,
                      height: 32,
                      borderRadius: 1.25,
                      p: 0,
                      ml: 0.75,
                      bgcolor: agotado ? '#e2e8f0' : '#2c5f47',
                      color: 'white',
                      boxShadow: 'none',
                      '&:hover': {
                        bgcolor: agotado ? '#e2e8f0' : '#1e4231',
                        boxShadow: '0 2px 6px rgba(44, 95, 71, 0.4)',
                      },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <AddIcon sx={{ fontSize: 18 }} />
                  </Button>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Card>
  );
}