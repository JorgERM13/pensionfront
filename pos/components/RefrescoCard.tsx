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
      border: '1px solid #D8C3A5',
      borderRadius: 2.5,
      overflow: 'visible',
      background: `linear-gradient(135deg, #F1E9DC 0%, #FAF8F3 50%, #FFFFFF 100%), radial-gradient(circle at 1px 1px, rgba(61, 59, 42, 0.05) 1px, transparent 0)`,
      backgroundSize: '100% 100%, 16px 16px',
      boxShadow: '0 4px 12px rgba(61, 59, 42, 0.07), 0 1px 3px rgba(61, 59, 42, 0.03)',
    }}
  >
    <Box sx={{ p: { xs: 1.5, sm: 2 }, pt: { xs: 2.5, sm: 3 } }}>

      {/* Header Compacto */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
        <Avatar
          sx={{
            width: 32,
            height: 32,
            borderRadius: 1.5,
            bgcolor: '#3D3B2A',
            color: '#D8C3A5',
            boxShadow: '0 2px 6px rgba(61, 59, 42, 0.15)',
          }}
        >
          <LocalBarIcon sx={{ fontSize: 18 }} />
        </Avatar>

        <Box sx={{ flex: 1 }}>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 800,
              color: '#3D3B2A',
              fontSize: '1rem',
              lineHeight: 1.2,
              letterSpacing: '0.1px',
            }}
          >
            Refrescos y Bebidas
          </Typography>
        </Box>

        {/* CHIP CON EL TOTAL DE REFRESCOS */}
        <Chip
          label={`${totalDisponibles} disponibles`}
          size="small"
          sx={{
            height: 24,
            fontSize: '0.7rem',
            fontWeight: 700,
            bgcolor: totalDisponibles > 0 ? '#EEF1E6' : '#f1f5f9',
            color: totalDisponibles > 0 ? '#6B7B3A' : '#64748b',
            border: `1px solid ${totalDisponibles > 0 ? '#D8C3A5' : '#e2e8f0'}`,
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
                  borderColor: agotado ? '#e2e8f0' : '#D8C3A5',
                  bgcolor: agotado ? '#fafafa' : '#FFFFFF',
                  opacity: agotado ? 0.6 : 1,
                  cursor: agotado ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: agotado ? 'none' : '0 1px 4px rgba(61, 59, 42, 0.06)',
                  '&:hover': {
                    transform: agotado ? 'none' : 'translateY(-2px)',
                    boxShadow: agotado ? 'none' : '0 4px 10px rgba(61, 59, 42, 0.12)',
                    borderColor: agotado ? '#e2e8f0' : '#6B7B3A',
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
                    border: '1px solid #D8C3A5',
                    flexShrink: 0,
                    bgcolor: '#F1E9DC',
                  }}
                  image={refresco.img || 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?auto=format&fit=crop&w=100&q=80'}
                  alt={refresco.nombre}
                />

                <Box sx={{ flex: 1, minWidth: 0, ml: 1.25 }}>
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
                    {refresco.nombre}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography
                      sx={{
                        fontWeight: 800,
                        color: agotado ? '#94a3b8' : '#C66B3D',
                        fontSize: '0.875rem',
                      }}
                    >
                      Bs {refresco.precio.toFixed(2)}
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: '0.7rem',
                        color: agotado ? '#94a3b8' : '#6B7B3A',
                        fontWeight: 700,
                      }}
                    >
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
                    bgcolor: agotado ? '#e2e8f0' : '#3D3B2A',
                    color: '#FFFFFF',
                    boxShadow: 'none',
                    '&:hover': {
                      bgcolor: agotado ? '#e2e8f0' : '#6B7B3A',
                      boxShadow: '0 2px 6px rgba(61, 59, 42, 0.3)',
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