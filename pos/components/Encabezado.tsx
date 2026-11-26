import { Box, Typography, Avatar, Chip, Button } from '@mui/material';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import EditNoteIcon from '@mui/icons-material/EditNote';
import Link from 'next/link';
import { useUser } from '@/hooks/useUser';

interface PageHeaderProps {
  totalPlatosDisponibles: number;
  numeroPedido: string;
  fechaFormateada: string;
  horaActual: string;
}

export default function PageHeader({
  totalPlatosDisponibles,
  numeroPedido,
  fechaFormateada,
  horaActual,
}: PageHeaderProps) {
  const { nombrePension } = useUser();

    return (
    <Box
      sx={{
        mb: 3,
        px: { xs: 2, sm: 3 },
        py: { xs: 1.5, sm: 2 },
        borderRadius: 3,
        // 👇 FONDO VERDE OLIVA OSCURO
        background: '#3D3B2A',
        border: '1px solid rgba(216, 195, 165, 0.15)',
        boxShadow: '0 8px 24px rgba(61, 59, 42, 0.15)',
        overflow: 'hidden',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      {/* Línea decorativa superior en Terracota */}
      <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: '#C66B3D' }} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: { xs: 2, sm: 3 } }}>

        {/* SECCIÓN IZQUIERDA */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, minWidth: 0 }}>
          {/* Avatar con fondo Terracota sutil */}
          <Avatar sx={{
            background: 'rgba(198, 107, 61, 0.15)',
            border: '1px solid rgba(198, 107, 61, 0.3)',
            width: 48, height: 48, borderRadius: 2.5,
            flexShrink: 0,
          }}>
            <RestaurantMenuIcon sx={{ fontSize: 26, color: '#C66B3D' }} />
          </Avatar>

          <Box sx={{ minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, flexWrap: 'wrap' }}>
              <Typography variant="h5" sx={{
                fontWeight: 800, color: '#D8C3A5', letterSpacing: '-0.5px', lineHeight: 1.1,
                fontSize: { xs: '1.1rem', sm: '1.3rem' },
              }}>
                Menú del Día
              </Typography>
              
              {/* Badge del negocio en Verde Oliva */}
              <Box component="span" sx={{
                display: 'inline-flex', alignItems: 'center', gap: 0.4,
                px: 0.75, py: 0.25, borderRadius: 1,
                bgcolor: 'rgba(107, 123, 58, 0.3)', color: '#D8C3A5',
                fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.5px', textTransform: 'uppercase',
              }}>
                <RestaurantIcon sx={{ fontSize: 12 }} />
                {nombrePension}
              </Box>
            </Box>

            {/* Fecha y hora */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'nowrap' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <CalendarTodayIcon sx={{ fontSize: 14, color: '#6B7B3A', flexShrink: 0 }} />
                <Typography
                  variant="body2"
                  sx={{
                    color: 'rgba(216, 195, 165, 0.8)',
                    fontWeight: 500,
                    fontSize: { xs: '0.7rem', sm: '0.8rem' },
                    textTransform: 'capitalize',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {fechaFormateada}
                </Typography>
              </Box>

              <Box sx={{ width: 1, height: 14, bgcolor: 'rgba(216, 195, 165, 0.2)', borderRadius: 1, flexShrink: 0 }} />

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <AccessTimeIcon sx={{ fontSize: 14, color: '#6B7B3A', flexShrink: 0 }} />
                <Typography
                  variant="body2"
                  sx={{
                    color: 'rgba(216, 195, 165, 0.8)',
                    fontWeight: 600,
                    fontSize: { xs: '0.7rem', sm: '0.8rem' },
                    fontFamily: 'monospace',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {horaActual}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* SECCIÓN DERECHA */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
          {numeroPedido && (
            <Box sx={{
              display: 'flex', alignItems: 'center', gap: 1,
              px: 1.5, py: 1,
              bgcolor: 'rgba(216, 195, 165, 0.05)',
              borderRadius: 2,
              border: '1px dashed rgba(216, 195, 165, 0.2)',
            }}>
              <ReceiptLongIcon sx={{ fontSize: 20, color: '#C66B3D', flexShrink: 0 }} />
              <Box sx={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
                <Typography sx={{ color: 'rgba(216, 195, 165, 0.6)', fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Pedido
                </Typography>
                <Typography sx={{ color: '#D8C3A5', fontWeight: 800, fontSize: '1.1rem', fontFamily: 'ui-monospace, monospace' }}>
                  #{numeroPedido}
                </Typography>
              </Box>
            </Box>
          )}

          {/* Chip de Disponibles en Verde Oliva */}
          <Chip
            icon={<RestaurantIcon sx={{ fontSize: 16, color: '#D8C3A5' }} />}
            label={`${totalPlatosDisponibles} disponibles`}
            sx={{
              fontWeight: 700, fontSize: '0.8rem', height: 40, px: 1.5,
              bgcolor: '#6B7B3A', 
              color: '#D8C3A5', 
              border: 'none',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              '& .MuiChip-label': { px: 1.5, fontWeight: 700 },
              '& .MuiChip-icon': { ml: 0.75 },
              flexShrink: 0,
            }}
          />

          <Link href="/menu" style={{ textDecoration: 'none' }}>
            {/* Botón en Terracota */}
            <Button
              variant="contained"
              startIcon={<EditNoteIcon sx={{ fontSize: 18, color: '#FFFFFF' }} />}
              sx={{
                height: 40, px: 2.5, fontSize: '0.85rem', fontWeight: 700, textTransform: 'none', borderRadius: 2,
                bgcolor: '#C66B3D', color: '#FFFFFF',
                boxShadow: '0 4px 12px rgba(198, 107, 61, 0.3)',
                '&:hover': { bgcolor: '#A5552D', boxShadow: '0 6px 16px rgba(198, 107, 61, 0.4)', transform: 'translateY(-1px)' },
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                flexShrink: 0,
              }}
            >
              Editar Menú
            </Button>
          </Link>
        </Box>
      </Box>
    </Box>
  );
}