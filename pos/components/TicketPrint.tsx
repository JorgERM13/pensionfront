import { Box, Typography, Divider } from '@mui/material';
import { ItemCarrito,Modalidad } from '../types/posTypes';

type FormaPago = 'efectivo' | 'qr';

interface TicketPrintProps {
  numeroTicket: string;
  fecha: Date;
  carrito: ItemCarrito[];
  modalidad: Modalidad;
  formaPago: FormaPago;
  total: number;
  nombrePension: string;
}

export default function TicketPrint({
  numeroTicket,
  fecha,
  carrito,
  modalidad,
  formaPago,
  total,
  nombrePension,
}: TicketPrintProps) {
  const fechaFormateada = fecha.toLocaleDateString('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  const horaFormateada = fecha.toLocaleTimeString('es-PE', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Box
      className="ticket-print"
    sx={{
    width: '100%', // 👈 Clave: ocupa todo el ancho disponible (58mm)
    maxWidth: '58mm',
    mx: 'auto', // 👈 Clave: centrado horizontal
    p: 1, // Padding mínimo interno
    fontFamily: '"Courier New", monospace',
    fontSize: '10px',
    color: '#000',
    textAlign: 'center', // 👈 Clave: centra el texto por defecto (encabezados, totales)
  }}
      
    >
      {/* HEADER */}
            {/* HEADER: NOMBRE + MODALIDAD EN LA MISMA LÍNEA */}
      <Box sx={{ textAlign: 'center', mb: 0.5 }}>
        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Typography sx={{ fontWeight: 'bold', fontSize: '13px', letterSpacing: 0.5 }}>
            {nombrePension.toUpperCase()}
          </Typography>
          
          <Box
            sx={{
              border: '2px solid #000',
              borderRadius: 1,
              px: 1.5,
              py: 0.25,
              bgcolor: modalidad === 'local' ? '#000000' : '#ffffff',
              color: modalidad === 'local' ? '#ffffff' : '#000000',
            }}
          >
            <Typography sx={{ fontSize: '11px', fontWeight: '900', letterSpacing: 1, textTransform: 'uppercase' }}>
              {modalidad === 'local' ? '🍽️ COMER AQUÍ' : '📦 PARA LLEVAR'}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ borderBottomWidth: 2, borderStyle: 'dashed', my: 0.5 }} />

      {/* INFO DEL TICKET */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.3 }}>
        <Typography sx={{ fontSize: '9px' }}>Ticket:</Typography>
        <Typography sx={{ fontSize: '9px', fontWeight: 'bold' }}>{numeroTicket}</Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.3 }}>
        <Typography sx={{ fontSize: '9px' }}>Fecha:</Typography>
        <Typography sx={{ fontSize: '9px' }}>{fechaFormateada}</Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.3 }}>
        <Typography sx={{ fontSize: '9px' }}>Hora:</Typography>
        <Typography sx={{ fontSize: '9px' }}>{horaFormateada}</Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.3 }}>
        <Typography sx={{ fontSize: '9px' }}>Tipo:</Typography>
        <Typography sx={{ fontSize: '9px', fontWeight: 'bold' }}>
          {modalidad === 'local' ? 'COMER AQUÍ' : 'PARA LLEVAR'}
        </Typography>
      </Box>

      <Divider sx={{ borderBottomWidth: 1, borderStyle: 'dashed', my: 0.5 }} />

      {/* PRODUCTOS */}
      <Box sx={{ mb: 0.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.3, fontWeight: 'bold' }}>
          <Typography sx={{ fontSize: '9px', width: 18 }}>CANT</Typography>
          <Typography sx={{ fontSize: '9px', flex: 1, ml: 0.5 }}>DESCRIPCIÓN</Typography>
          <Typography sx={{ fontSize: '9px' }}>TOTAL</Typography>
        </Box>
        <Divider sx={{ borderBottomWidth: 1, borderStyle: 'dashed', mb: 0.3 }} />
        
        {carrito.map((item) => (
          <Box key={item.id} sx={{ mb: 0.3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Typography sx={{ fontSize: '9px', width: 18 }}>{item.cantidad}</Typography>
              <Typography sx={{ fontSize: '9px', flex: 1, ml: 0.5, lineHeight: 1.2 }}>
                {item.nombre}
              </Typography>
              <Typography sx={{ fontSize: '9px', fontWeight: 'bold', ml: 0.5 }}>
                {(item.precio * item.cantidad).toFixed(2)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', ml: 0.5 }}>
              <Typography sx={{ fontSize: '8px', color: '#666' }}>
                ({item.precio.toFixed(2)} c/u)
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>

      <Divider sx={{ borderBottomWidth: 2, borderStyle: 'dashed', my: 0.5 }} />

      {/* TOTALES */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.3 }}>
        <Typography sx={{ fontSize: '10px' }}>SUBTOTAL:</Typography>
        <Typography sx={{ fontSize: '10px' }}>Bs {total.toFixed(2)}</Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
        <Typography sx={{ fontSize: '14px', fontWeight: 'bold' }}>TOTAL:</Typography>
        <Typography sx={{ fontSize: '14px', fontWeight: 'bold' }}>Bs {total.toFixed(2)}</Typography>
      </Box>

      <Divider sx={{ borderBottomWidth: 1, borderStyle: 'dashed', my: 0.5 }} />

      {/* FORMA DE PAGO - DESTACADA */}
      <Box
        sx={{
          border: '2px solid',
          borderColor: formaPago === 'qr' ? '#1976d2' : '#2e7d32',
          borderRadius: 1,
          p: 0.5,
          mb: 0.5,
          bgcolor: formaPago === 'qr' ? '#e3f2fd' : '#e8f5e9',
          textAlign: 'center',
        }}
      >
        <Typography sx={{ fontSize: '8px', color: '#555', mb: 0.3 }}>FORMA DE PAGO</Typography>
        <Typography
          sx={{
            fontSize: '11px',
            fontWeight: 'bold',
            color: formaPago === 'qr' ? '#1976d2' : '#2e7d32',
          }}
        >
          {formaPago === 'qr' ? '💳 ' : '💵 EFECTIVO'}
        </Typography>
      </Box>

      <Divider sx={{ borderBottomWidth: 1, borderStyle: 'dashed', my: 0.5 }} />

      {/* FOOTER */}
      <Box sx={{ textAlign: 'center', mt: 0.5 }}>
        <Typography sx={{ fontSize: '9px', fontWeight: 'bold' }}>
          ¡Gracias por su preferencia!
        </Typography>
        <Typography sx={{ fontSize: '8px', color: '#555', mt: 0.3 }}>
          Conserve este ticket
        </Typography>
      </Box>
    </Box>
  );
}