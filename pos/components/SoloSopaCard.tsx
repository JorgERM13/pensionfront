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
      borderColor: agotado ? '#e2e8f0' : '#D8C3A5',
      background: `linear-gradient(135deg, #F1E9DC 0%, #FAF8F3 65%, #FFFFFF 100%), radial-gradient(circle at 1px 1px, rgba(198, 107, 61, 0.06) 1px, transparent 0)`,
      backgroundSize: '100% 100%, 16px 16px',
      bgcolor: agotado ? '#fafafa' : 'transparent',
      opacity: agotado ? 0.6 : 1,
      cursor: agotado ? 'not-allowed' : 'pointer',
      transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: agotado ? 'none' : '0 2px 8px rgba(61, 59, 42, 0.07)',
      '&:hover': {
        transform: agotado ? 'none' : 'translateY(-2px)',
        boxShadow: agotado ? 'none' : '0 8px 16px rgba(198, 107, 61, 0.12)',
        borderColor: agotado ? '#e2e8f0' : '#C66B3D',
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
        border: '1px solid #D8C3A5',
        flexShrink: 0,
        bgcolor: '#F1E9DC',
      }}
      image={sopa.img || 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=100&q=80'}
      alt={sopa.nombre}
    />

    {/* 2. Información centrada y limpia */}
    <Box sx={{ flex: 1, minWidth: 0, ml: 1.25 }}>
      <Typography
        sx={{
          fontWeight: 700,
          fontSize: '0.875rem',
          lineHeight: 1.2,
          color: agotado ? '#94a3b8' : '#3D3B2A',
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
            color: agotado ? '#94a3b8' : '#C66B3D',
            fontSize: '0.875rem',
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
            bgcolor: agotado ? '#f1f5f9' : '#EEF1E6',
            color: agotado ? '#94a3b8' : '#6B7B3A',
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
        bgcolor: agotado ? '#e2e8f0' : '#C66B3D',
        color: 'white',
        boxShadow: 'none',
        '&:hover': {
          bgcolor: agotado ? '#e2e8f0' : '#3D3B2A',
          boxShadow: '0 4px 8px rgba(198, 107, 61, 0.25)',
        },
        transition: 'all 0.2s ease',
      }}
    >
      <AddIcon sx={{ fontSize: 18 }} />
    </Button>
  </Card>
);
}