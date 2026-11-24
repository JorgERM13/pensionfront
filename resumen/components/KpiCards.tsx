import { Card, CardContent, Box, Typography, Avatar } from '@mui/material';
import { ReactNode } from 'react';

interface KpiCardProps {
  titulo: string;
  valor: string;
  detalle?: string;
  icono?: ReactNode;
  color?: string;
  fondo?: string;
}

export default function KpiCard({
  titulo,
  valor,
  detalle,
  icono,
  color = '#0f172a',
  fondo = '#f8fafc'
}: KpiCardProps) {
  return (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        minHeight: 115,
        borderRadius: 3,
        border: '1px solid #e2e8f0',
        background: '#ffffff',
        position: 'relative', // 👈 Necesario para el detalle de arriba
        overflow: 'hidden',
        transition: 'all 0.2s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 24px rgba(15, 23, 42, 0.06)',
          borderColor: '#cbd5e1',
        },
      }}
    >
      {/* 👇 Línea superior de color para darle un look más premium */}
      <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, bgcolor: color }} />

      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 }, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {titulo}
          </Typography>
          {icono && (
            <Avatar sx={{ bgcolor: fondo, color: color, width: 30, height: 30, borderRadius: 1.5 }}>
              {icono}
            </Avatar>
          )}
        </Box>

        <Box>
          <Typography variant="h5" sx={{ fontWeight: 900, color: '#0f172a', letterSpacing: '-0.5px', lineHeight: 1.2 }}>
            {valor}
          </Typography>
          {detalle && (
            <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600, display: 'block', mt: 0.5 }}>
              {detalle}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}