import { Box, Card, CardMedia, Typography, Button, Chip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Sopa } from '../types/posTypes';

interface SoloSopaCardProps {
  sopa: Sopa;
  stockSopa: number;
  onAgregarSoloSopa: () => void;
}

export default function SoloSopaCard({ sopa, stockSopa, onAgregarSoloSopa }: SoloSopaCardProps) {
  const agotado = stockSopa === 0;

  return (
    <Card
      onClick={() => !agotado && onAgregarSoloSopa()}
      sx={{
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  p: 1.5, 
  borderRadius: 2,
  border: '1px solid',
  borderColor: agotado ? '#e2e8f0' : '#ffedd5', // Borde naranja muy suave
  // 👇 FONDO NARANJA ULTRA SUAVE (Casi blanco con un toque cálido apenas perceptible)
  background: `linear-gradient(135deg, #fffbf5 0%, #ffffff 90%, #fffbf5 100%), radial-gradient(circle at 1px 1px, rgba(234, 88, 12, 0.03) 1px, transparent 0)`,
  backgroundSize: '100% 100%, 16px 16px',
  bgcolor: agotado ? '#fafafa' : 'transparent',
  opacity: agotado ? 0.6 : 1,
  cursor: agotado ? 'not-allowed' : 'pointer',
  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)', 
  boxShadow: agotado ? 'none' : '0 2px 8px rgba(234, 88, 12, 0.04)', // Sombra aún más sutil
  '&:hover': {
    transform: agotado ? 'none' : 'translateY(-2px)',
    boxShadow: agotado ? 'none' : '0 8px 16px rgba(234, 88, 12, 0.08)',
    borderColor: agotado ? '#e2e8f0' : '#fed7aa', // 👈 Borde hover naranja suave corregido
  },
}}
    >
      {/* 1. Imagen refinada */}
      <CardMedia
        component="img"
        sx={{
          width: 52,
          height: 52,
          borderRadius: 2,
          objectFit: 'cover',
          border: '1px solid #ffedd5',
          flexShrink: 0,
          bgcolor: '#f8f9fa',
        }}
        image={sopa.img || 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=100&q=80'}
        alt={sopa.nombre}
      />

      {/* 2. Información centrada y limpia */}
      <Box sx={{ flex: 1, minWidth: 0, ml: 1.25 }}>
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: '0.9rem',
            lineHeight: 1.2,
            color: agotado ? '#94a3b8' : '#9a3412', // Marrón anaranjado oscuro para el nombre
            mb: 0.5,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {sopa.nombre}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography
            sx={{
              fontWeight: 800,
              color: '#ea580c', // Naranja vibrante para el precio
              fontSize: '0.8rem', // 👈 Precio claramente más pequeño que el nombre
              lineHeight: 1,
            }}
          >
            Bs {sopa.precio.toFixed(2)}
          </Typography>
          
          <Chip
            label={agotado ? 'Agotado' : `${stockSopa} disp.`}
            size="small"
            sx={{
              height: 20,
              fontSize: '0.7rem',
              fontWeight: 700,
              borderRadius: 1,
              bgcolor: agotado ? '#f1f5f9' : '#fff7ed', // Fondo crema muy claro
              color: agotado ? '#94a3b8' : '#9a3412',
              '& .MuiChip-label': { px: 0.75 },
            }}
          />
        </Box>
      </Box>

      {/* 3. Botón de acción refinado */}
      <Button
        variant="contained"
        disableElevation
        disabled={agotado}
        onClick={(e) => {
          e.stopPropagation();
          onAgregarSoloSopa();
        }}
        sx={{
          minWidth: 32,
          height: 32,
          borderRadius: 1.5,
          p: 0,
          ml: 1,
          bgcolor: agotado ? '#e2e8f0' : '#ea580c',
          color: 'white',
          boxShadow: 'none',
          '&:hover': {
            bgcolor: agotado ? '#e2e8f0' : '#c2410c',
            boxShadow: '0 4px 8px rgba(234, 88, 12, 0.3)',
          },
          transition: 'all 0.2s ease',
        }}
      >
        <AddIcon sx={{ fontSize: 18 }} />
      </Button>
    </Card>
  );
}