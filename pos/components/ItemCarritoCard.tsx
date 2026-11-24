import {
  Box,
  Typography,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { ItemCarrito } from '../types/posTypes';

interface ItemCarritoCardProps {
  item: ItemCarrito;
  onCambiarCantidad: (item: ItemCarrito, delta: number) => void;
}

export default function ItemCarritoCard({ item, onCambiarCantidad }: ItemCarritoCardProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 2,
        p: 2,
        bgcolor: item.esCombo ? '#f1f8e9' : item.esSopa ? '#fff3e0' : '#ffffff',
        borderRadius: 2,
        border: item.esCombo ? '1px solid #c8e6c9' : item.esSopa ? '1px solid #ffe0b2' : '1px solid #f0f0f0',
      }}
    >
      <Box sx={{ flex: 1 }}>
        <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', lineHeight: 1.3 }}>
          {item.nombre}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          S/ {item.precio.toFixed(2)} c/u
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: '#f5f5f5', borderRadius: 2, p: 0.5 }}>
        <IconButton 
          color="error" 
          onClick={() => onCambiarCantidad(item, -1)} 
          size="small"
          sx={{ bgcolor: 'white', boxShadow: 1, width: 32, height: 32 }}
        >
          <RemoveIcon fontSize="small" />
        </IconButton>
        <Typography variant="body1" sx={{ minWidth: 32, textAlign: 'center', fontWeight: 800 }}>
          {item.cantidad}
        </Typography>
        <IconButton 
          color="primary" 
          onClick={() => onCambiarCantidad(item, 1)} 
          size="small"
          sx={{ bgcolor: 'white', boxShadow: 1, width: 32, height: 32 }}
        >
          <AddIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
}