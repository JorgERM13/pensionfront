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
        // 👇 Borde sutil del color oscuro de la paleta
        border: '2px solid #3D3B2A',
        borderRadius: 2.5,
        overflow: 'hidden',
        background: '#ffffff',
        boxShadow: '0 8px 24px rgba(61, 59, 42, 0.15)', // Sombra con tinte del color oscuro
      }}
    >
      <CardContent sx={{ p: 0 }}>
        
        {/* 👇 HEADER DEL CARRITO (Verde Oliva Oscuro) */}
        <Box
          sx={{
            background: '#3D3B2A', 
            color: '#D8C3A5', // Texto Beige
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
              bgcolor: '#C66B3D', // Avatar Terracota
              color: '#FFFFFF',
            }}
          >
            <ShoppingCartIcon sx={{ fontSize: 22 }} />
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1.05rem', lineHeight: 1.1, color: '#D8C3A5' }}>
              Pedido Actual
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(216, 195, 165, 0.8)', fontSize: '0.75rem' }}>
              {totalItems} {totalItems === 1 ? 'producto' : 'productos'}
            </Typography>
          </Box>
          {carrito.length > 0 && (
            <IconButton
              onClick={onVaciar}
              sx={{
                color: '#D8C3A5',
                bgcolor: 'rgba(216, 195, 165, 0.1)',
                '&:hover': { bgcolor: 'rgba(216, 195, 165, 0.2)' },
              }}
              size="small"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          )}
        </Box>

        {/* 👇 MODALIDAD (Comer aquí / Para llevar) */}
        <Box sx={{ p: 2, pb: 1.5 }}>
          <Typography variant="caption" sx={{ fontWeight: 800, color: '#3D3B2A', mb: 0.75, display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.7rem' }}>
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
                color: '#3D3B2A',
                border: '1px solid #D8C3A5',
                '&.Mui-selected': {
                  bgcolor: '#C66B3D', // Estado activo en Terracota
                  color: '#FFFFFF',
                  borderColor: '#C66B3D',
                  '&:hover': { bgcolor: '#A5552D' },
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
            <Box sx={{ textAlign: 'center', py: 4, color: '#A8A29E' }}>
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
                  borderBottom: '1px solid #F5F5F4',
                  '&:last-child': { borderBottom: 'none' },
                }}
              >
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      lineHeight: 1.2,
                      color: '#3D3B2A', // Texto oscuro
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {item.nombre}
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: '#78716C', fontWeight: 600 }}>
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
                      bgcolor: '#F9F6F2', // Fondo beige muy claro
                      color: '#3D3B2A',
                      '&:hover': { bgcolor: '#D8C3A5' },
                    }}
                  >
                    <RemoveIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', minWidth: 24, textAlign: 'center', color: '#3D3B2A' }}>
                    {item.cantidad}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => onCambiarCantidad(item, 1)}
                    sx={{
                      width: 28,
                      height: 28,
                      bgcolor: '#F9F6F2',
                      color: '#3D3B2A',
                      '&:hover': { bgcolor: '#D8C3A5' },
                    }}
                  >
                    <AddIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Box>
              </Box>
            ))
          )}
        </Box>

        <Divider sx={{ borderColor: '#F5F5F4' }} />

        {/* 👇 FORMA DE PAGO */}
        <Box sx={{ p: 2, pb: 1.5 }}>
          <Typography variant="caption" sx={{ fontWeight: 800, color: '#3D3B2A', mb: 0.75, display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.7rem' }}>
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
                color: '#3D3B2A',
                border: '1px solid #D8C3A5',
                '&.Mui-selected': {
                  bgcolor: '#C66B3D', // Estado activo en Terracota
                  color: '#FFFFFF',
                  borderColor: '#C66B3D',
                  '&:hover': { bgcolor: '#A5552D' },
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

        <Divider sx={{ borderColor: '#F5F5F4' }} />

        {/* 👇 TOTAL Y BOTÓN DE CONFIRMAR */}
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
            <Typography sx={{ fontWeight: 800, color: '#3D3B2A', fontSize: '1rem' }}>
              Total
            </Typography>
            <Typography sx={{ fontWeight: 900, color: '#C66B3D', fontSize: '1.6rem', lineHeight: 1 }}>
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
              py: 1,
              minHeight: 'auto',
              fontSize: '0.9rem',
              fontWeight: 700,
              borderRadius: 1.5,
              // 👇 Botón Confirmar en Terracota
              bgcolor: '#C66B3D',
              color: '#FFFFFF',
              textTransform: 'none',
              boxShadow: '0 4px 12px rgba(198, 107, 61, 0.3)',
              '& .MuiButton-startIcon': {
                mr: 0.5,
              },
              '&:hover': {
                bgcolor: '#A5552D',
                boxShadow: '0 6px 16px rgba(198, 107, 61, 0.4)',
              },
              '&:disabled': {
                bgcolor: '#E7E5E4',
                color: '#A8A29E',
              },
            }}
          >
            Confirmar Pedido
          </Button>

          {/* 👇 BOTÓN: Redirige al Resumen de Ventas */}
          <Divider sx={{ my: 2, borderColor: '#F5F5F4' }} />
          
          <Link href="/resumen" style={{ textDecoration: 'none', width: '100%' }}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<BarChartIcon sx={{ fontSize: 18 }} />}
              sx={{
                py: 1,
                fontSize: '0.85rem',
                fontWeight: 700,
                textTransform: 'none',
                borderRadius: 1.5,
                // 👇 Botón secundario con borde Oliva Oscuro
                borderColor: '#3D3B2A',
                color: '#3D3B2A',
                bgcolor: 'transparent',
                '&:hover': {
                  bgcolor: '#F9F6F2',
                  borderColor: '#3D3B2A',
                  color: '#3D3B2A',
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