import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Typography,
} from '@mui/material';
// import { Venta } from '../../ventas/types/ventasTypes'; // 👈 Ya no usamos el tipo local
import { bolivianos } from '../../ventas/lib/resumeUtils';

interface TablaTicketsProps {
  ventas: any[]; // 👈 Usamos any[] para aceptar los datos crudos del backend
}

export default function TablaTickets({ ventas }: TablaTicketsProps) {
  if (!ventas || ventas.length === 0) {
    return (
      <Typography sx={{ py: 4, textAlign: 'center', color: 'text.secondary' }}>
        Aún no hay ventas registradas en esta fecha.
      </Typography>
    );
  }

  return (
    <TableContainer sx={{ maxHeight: 420 }}>
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            {['Hora', 'Ticket', 'Detalle', 'Tipo', 'Pago', 'Total'].map((c) => (
              <TableCell key={c} sx={{ fontWeight: 700, bgcolor: '#f5f7f5' }}>
                {c}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {ventas.map((v) => (
            <TableRow key={v.id} hover>
              <TableCell sx={{ fontSize: '0.8rem' }}>
                {new Date(v.fecha).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}
              </TableCell>
              
              {/* 👇 Corregido: snake_case */}
              <TableCell sx={{ fontSize: '0.8rem', fontFamily: 'monospace' }}>
                {v.numero_ticket || 'S/N'}
              </TableCell>
              
              <TableCell sx={{ fontSize: '0.8rem', maxWidth: 260 }}>
                {v.items?.map((i: any) => `${i.cantidad}x ${i.nombre}`).join(' · ')}
              </TableCell>
              
              <TableCell>
                <Chip
                  size="small"
                  label={v.modalidad === 'local' ? 'En el lugar' : 'Para llevar'}
                  variant="outlined"
                  sx={{ fontSize: '0.7rem' }}
                />
              </TableCell>
              
              {/* 👇 Corregido: snake_case */}
              <TableCell>
                <Chip
                  size="small"
                  label={v.forma_pago === 'efectivo' ? 'Efectivo' : 'QR'}
                  sx={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    bgcolor: v.forma_pago === 'efectivo' ? '#e8f5e9' : '#e3f2fd',
                    color: v.forma_pago === 'efectivo' ? '#2e7d32' : '#1565c0',
                  }}
                />
              </TableCell>
              
              <TableCell sx={{ fontWeight: 700, fontSize: '0.85rem' }}>
                {bolivianos(v.total)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}