import { Box, Card, CardMedia, Typography, Button, Chip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Plato } from '../types/posTypes';

interface SoloSegundoCardProps {
  segundo: Plato;
  stockSegundo: number;
  onAgregarSegundo: () => void;
}

export default function SoloSegundoCard({ segundo, stockSegundo, onAgregarSegundo }: SoloSegundoCardProps) {
  const agotado = stockSegundo === 0;

  return (
    <Card
      onClick={() => !agotado && onAgregarSegundo()}
      sx={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        p: 1.5, // 👈 Espaciado respirable y elegante
        borderRadius: 2, // 👈 Bordes suavemente redondeados (más moderno que 1.5)
        border: '1px solid',
        borderColor: agotado ? '#e2e8f0' : '#efebe9',
        bgcolor: agotado ? '#fafafa' : '#ffffff',
        opacity: agotado ? 0.6 : 1,
        cursor: agotado ? 'not-allowed' : 'pointer',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)', // 👈 Transición suave y premium
        boxShadow: agotado ? 'none' : '0 2px 8px rgba(109, 76, 65, 0.06)',
        '&:hover': {
          transform: agotado ? 'none' : 'translateY(-2px)',
          boxShadow: agotado ? 'none' : '0 8px 16px rgba(109, 76, 65, 0.12)',
          borderColor: agotado ? '#e2e8f0' : '#d7ccc8',
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
          border: '1px solid #efebe9',
          flexShrink: 0,
          bgcolor: '#f8f9fa',
        }}
        image={segundo.img || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=100&q=80'}
        alt={segundo.nombre}
      />

      {/* 2. Información centrada y limpia */}
      <Box sx={{ flex: 1, minWidth: 0, ml: 1.25 }}>
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: '0.9rem', // 👈 Ligeramente más legible
            lineHeight: 1.2,
            color: agotado ? '#94a3b8' : '#3e2723',
            mb: 0.5,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {segundo.nombre}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography
            sx={{
              fontWeight: 800,
              color: '#6d4c41',
              fontSize: '0.8rem', // 👈 Precio claramente más pequeño que el nombre
              lineHeight: 1,
            }}
          >
            Bs {segundo.precio.toFixed(2)}
          </Typography>
          
          <Chip
            label={agotado ? 'Agotado' : `${stockSegundo} disp.`}
            size="small"
            sx={{
              height: 20, // 👈 Un poco más de altura para que no se vea aplastado
              fontSize: '0.7rem',
              fontWeight: 700,
              borderRadius: 1, // 👈 Bordes del chip más rectos, más profesional
              bgcolor: agotado ? '#f1f5f9' : '#efebe9',
              color: agotado ? '#94a3b8' : '#5d4037',
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
          onAgregarSegundo();
        }}
        sx={{
          minWidth: 32,
          height: 32,
          borderRadius: 1.5,
          p: 0,
          ml: 1,
          bgcolor: agotado ? '#e2e8f0' : '#6d4c41',
          color: 'white',
          boxShadow: 'none',
          '&:hover': {
            bgcolor: agotado ? '#e2e8f0' : '#4e342e',
            boxShadow: '0 4px 8px rgba(109, 76, 65, 0.3)',
          },
          transition: 'all 0.2s ease',
        }}
      >
        <AddIcon sx={{ fontSize: 18 }} />
      </Button>
    </Card>
  );
}