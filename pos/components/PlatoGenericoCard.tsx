import { Card, Box, Typography, Button, Avatar, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FastfoodIcon from '@mui/icons-material/Fastfood';

export default function PlatoGenericoCard({ plato, stock, onAgregar }: any) {
  const agotado = stock === 0;
  // Si el plato tiene adicionales (ej. papas), mostramos el botón extra
  const tieneAdicionales = plato.adicionales && plato.adicionales.length > 0;

  return (
    <Card elevation={0} sx={{ display: 'flex', alignItems: 'center', p: 1.5, mb: 1, border: '1px solid #e2e8f0', borderRadius: 2, opacity: agotado ? 0.5 : 1 }}>
      <Avatar src={plato.img} variant="rounded" sx={{ width: 40, height: 40, mr: 1.5, bgcolor: '#f1f5f9' }}>
        {plato.nombre.charAt(0)}
      </Avatar>
      
      <Box sx={{ flex: 1 }}>
        <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', lineHeight: 1.2 }}>{plato.nombre}</Typography>
        <Typography sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.8rem', mt: 0.3 }}>Bs {plato.precio.toFixed(2)}</Typography>
      </Box>
      
      <Box sx={{ textAlign: 'right', mr: 1.5 }}>
        <Typography sx={{ fontSize: '0.7rem', color: agotado ? '#ef4444' : '#64748b', fontWeight: 600 }}>
          {agotado ? 'Agotado' : `${stock} disp.`}
        </Typography>
      </Box>

      {/* Botón de Adicional (Papas) */}
      {tieneAdicionales && (
        <Tooltip title={`Agregar con ${plato.adicionales[0].nombre} (+ Bs ${plato.adicionales[0].precio})`}>
          <Button 
            variant="outlined" 
            disabled={agotado}
            onClick={() => onAgregar(plato, plato.adicionales[0])} // 👈 Pasamos el adicional
            sx={{ minWidth: 32, height: 32, p: 0, borderRadius: 1.5, mr: 1, borderColor: '#eab308', color: '#ca8a04' }}
          >
            <FastfoodIcon fontSize="small" />
          </Button>
        </Tooltip>
      )}

      {/* Botón normal */}
      <Button 
        variant="contained" 
        disabled={agotado}
        onClick={() => onAgregar(plato, null)} // 👈 Sin adicional
        sx={{ minWidth: 32, height: 32, p: 0, borderRadius: 1.5, bgcolor: '#1e293b' }}
      >
        <AddIcon fontSize="small" />
      </Button>
    </Card>
  );
}