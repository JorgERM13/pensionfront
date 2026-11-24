import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Chip,
  Divider,
  Avatar,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import BarChartIcon from '@mui/icons-material/BarChart';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import TakeoutDiningIcon from '@mui/icons-material/TakeoutDining';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import QrCodeIcon from '@mui/icons-material/QrCode';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { ItemCarrito, Modalidad } from '../types/posTypes';
import Link from 'next/link'; // 

export type FormaPago = 'efectivo' | 'qr';

interface CarritoResumenProps {
  carrito: ItemCarrito[];
  modalidad: Modalidad;
  formaPago: FormaPago;
  total: number;
  onCambiarModalidad: (modalidad: Modalidad) => void;
  onCambiarFormaPago: (formaPago: FormaPago) => void;
  onCambiarCantidad: (item: ItemCarrito, delta: number) => void;
  onConfirmar: () => void;
  onVaciar: () => void;
}

export default function CarritoResumen({
  carrito,
  modalidad,
  formaPago,
  total,
  onCambiarModalidad,
  onCambiarFormaPago,
  onCambiarCantidad,
  onConfirmar,
  onVaciar,
}: CarritoResumenProps) {
  const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);

  return (
    <Card
      elevation={0}
      sx={{
        border: '1px solid #cbd5e1',
        borderRadius: 2.5,
        overflow: 'hidden',
        background: '#ffffff',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
      }}
    >
      <CardContent sx={{ p: 0 }}>
        
        {/* 👇 HEADER PROFESIONAL */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #475569 0%, #334155 100%)',
            color: 'white',
            p: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
          }}
        >
          <Avatar
            sx={{
              width: 40,
              height: 40,
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <ShoppingCartIcon sx={{ fontSize: 22 }} />
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1.05rem', lineHeight: 1.1 }}>
              Pedido Actual
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.9, fontSize: '0.75rem' }}>
              {totalItems} {totalItems === 1 ? 'producto' : 'productos'}
            </Typography>
          </Box>
          {carrito.length > 0 && (
            <IconButton
              onClick={onVaciar}
              sx={{
                color: 'white',
                bgcolor: 'rgba(255, 255, 255, 0.15)',
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.25)' },
              }}
              size="small"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          )}
        </Box>

        {/* 👇 MODALIDAD (Comer aquí / Para llevar) */}
        <Box sx={{ p: 2, pb: 1.5 }}>
          <Typography variant="caption" sx={{ fontWeight: 700, color: '#475569', mb: 0.75, display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.7rem' }}>
            Modalidad
          </Typography>
          <ToggleButtonGroup
            value={modalidad}
            exclusive
            onChange={(_, newModalidad) => newModalidad && onCambiarModalidad(newModalidad)}
            fullWidth
            size="small"
            sx={{
              '& .MuiToggleButton-root': {
                py: 0.75,
                fontSize: '0.8rem',
                fontWeight: 600,
                textTransform: 'none',
                border: '1px solid #cbd5e1',
                '&.Mui-selected': {
                  bgcolor: '#475569',
                  color: 'white',
                  '&:hover': { bgcolor: '#334155' },
                },
              },
            }}
          >
            <ToggleButton value="local">
              <LocalDiningIcon sx={{ fontSize: 16, mr: 0.5 }} />
              Mesa
            </ToggleButton>
            <ToggleButton value="llevar">
              <TakeoutDiningIcon sx={{ fontSize: 16, mr: 0.5 }} />
              Para llevar
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* 👇 LISTA DE PRODUCTOS */}
        <Box sx={{ px: 2, pb: 1.5, maxHeight: 280, overflowY: 'auto' }}>
          {carrito.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
              <ShoppingCartIcon sx={{ fontSize: 48, opacity: 0.3, mb: 1 }} />
              <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                Tu pedido está vacío
              </Typography>
            </Box>
          ) : (
            carrito.map((item) => (
              <Box
                key={item.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  py: 1,
                  borderBottom: '1px solid #f1f5f9',
                  '&:last-child': { borderBottom: 'none' },
                }}
              >
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      lineHeight: 1.2,
                      color: '#1e293b',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {item.nombre}
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
                    Bs {(item.precio * item.cantidad).toFixed(2)}
                  </Typography>
                </Box>

                {/* Controles de cantidad compactos */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <IconButton
                    size="small"
                    onClick={() => onCambiarCantidad(item, -1)}
                    sx={{
                      width: 28,
                      height: 28,
                      bgcolor: '#f1f5f9',
                      '&:hover': { bgcolor: '#e2e8f0' },
                    }}
                  >
                    <RemoveIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', minWidth: 24, textAlign: 'center' }}>
                    {item.cantidad}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => onCambiarCantidad(item, 1)}
                    sx={{
                      width: 28,
                      height: 28,
                      bgcolor: '#f1f5f9',
                      '&:hover': { bgcolor: '#e2e8f0' },
                    }}
                  >
                    <AddIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Box>
              </Box>
            ))
          )}
        </Box>

        <Divider sx={{ borderColor: '#e2e8f0' }} />

        {/* 👇 FORMA DE PAGO */}
        <Box sx={{ p: 2, pb: 1.5 }}>
          <Typography variant="caption" sx={{ fontWeight: 700, color: '#475569', mb: 0.75, display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.7rem' }}>
            Forma de pago
          </Typography>
          <ToggleButtonGroup
            value={formaPago}
            exclusive
            onChange={(_, newForma) => newForma && onCambiarFormaPago(newForma)}
            fullWidth
            size="small"
            sx={{
              '& .MuiToggleButton-root': {
                py: 0.75,
                fontSize: '0.8rem',
                fontWeight: 600,
                textTransform: 'none',
                border: '1px solid #cbd5e1',
                '&.Mui-selected': {
                  bgcolor: '#475569',
                  color: 'white',
                  '&:hover': { bgcolor: '#334155' },
                },
              },
            }}
          >
            <ToggleButton value="efectivo">
              <AccountBalanceWalletIcon sx={{ fontSize: 16, mr: 0.5 }} />
              Efectivo
            </ToggleButton>
            <ToggleButton value="qr">
              <QrCodeIcon sx={{ fontSize: 16, mr: 0.5 }} />
              QR
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Divider sx={{ borderColor: '#e2e8f0' }} />

        {/* 👇 TOTAL Y BOTÓN DE CONFIRMAR */}
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
            <Typography sx={{ fontWeight: 700, color: '#475569', fontSize: '0.9rem' }}>
              Total
            </Typography>
            <Typography sx={{ fontWeight: 900, color: '#1e293b', fontSize: '1.5rem', lineHeight: 1 }}>
              Bs {total.toFixed(2)}
            </Typography>
          </Box>

                     <Button
            variant="contained"
            fullWidth
            onClick={onConfirmar}
            disabled={carrito.length === 0}
            startIcon={<CheckCircleIcon sx={{ fontSize: 18 }} />}
            sx={{
              py: 0.5,
              minHeight: 'auto',
              fontSize: '0.85rem',
              fontWeight: 700,
              borderRadius: 1.5,
              bgcolor: '#10b981',
              textTransform: 'none',
              boxShadow: '0 2px 6px rgba(16, 185, 129, 0.2)',
              '& .MuiButton-startIcon': {
                mr: 0.5,
              },
              '&:hover': {
                bgcolor: '#059669',
                boxShadow: '0 3px 10px rgba(16, 185, 129, 0.3)',
              },
              '&:disabled': {
                bgcolor: '#cbd5e1',
                color: '#94a3b8',
              },
            }}
          >
            Confirmar Pedido
          </Button>

                    {/* 👇 NUEVO BOTÓN: Redirige al Resumen de Ventas */}
          <Divider sx={{ my: 2, borderColor: '#f1f5f9' }} />
          
          <Link href="/resumen" style={{ textDecoration: 'none', width: '100%' }}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<BarChartIcon sx={{ fontSize: 18 }} />}
              sx={{
                py: 1,
                fontSize: '0.85rem',
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: 1.5,
                borderColor: '#cbd5e1',
                color: '#475569',
                bgcolor: 'transparent',
                '&:hover': {
                  bgcolor: '#f8fafc',
                  borderColor: '#94a3b8',
                  color: '#0f172a',
                },
                transition: 'all 0.2s ease',
              }}
            >
              Ver Resumen de Ventas
            </Button>
          </Link>
        </Box>
      </CardContent>
    </Card>
  );
}