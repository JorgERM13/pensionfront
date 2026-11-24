import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Typography,
  IconButton,
  Tooltip,
} from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Venta } from '../ventas/types/ventasTypes';
import { bolivianos } from '../ventas/lib/resumeUtils';

interface HistorialTablaProps {
  ventas: Venta[];
  onVerTicket: (venta: Venta) => void;
  onReimprimir: (venta: Venta) => void;
}

export default function HistorialTabla({ ventas, onVerTicket, onReimprimir }: HistorialTablaProps) {
  if (ventas.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8, bgcolor: 'white', borderRadius: 3, border: '1px solid #e6e8eb' }}>
        <Typography sx={{ color: 'text.secondary', fontSize: '1.1rem' }}>
          No hay ventas que coincidan con los filtros seleccionados.
        </Typography>
      </Box>
    );
  }

  return (
    <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid #e6e8eb', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              {['Fecha y hora', 'Ticket', 'Detalle', 'Servicio', 'Pago', 'Total', 'Acciones'].map((c) => (
                <TableCell key={c} sx={{ fontWeight: 700, bgcolor: '#f5f7f5' }}>
                  {c}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {ventas.map((v) => (
              <TableRow key={v.id} hover>
                <TableCell sx={{ fontSize: '0.85rem' }}>
                  {new Date(v.fecha).toLocaleString('es-PE', {
                    day: '2-digit',
                    month: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </TableCell>
                <TableCell sx={{ fontSize: '0.85rem', fontFamily: 'monospace', fontWeight: 600 }}>
                  {v.numeroTicket}
                </TableCell>
                <TableCell sx={{ fontSize: '0.8rem', maxWidth: 280 }}>
                  <Box sx={{ lineHeight: 1.4 }}>
                    {v.items.slice(0, 2).map((i) => (
                      <Box key={i.id} sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {i.cantidad}x {i.nombre}
                      </Box>
                    ))}
                    {v.items.length > 2 && (
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        +{v.items.length - 2} más
                      </Typography>
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    label={v.modalidad === 'local' ? 'En el lugar' : 'Para llevar'}
                    variant="outlined"
                    sx={{ fontSize: '0.7rem' }}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    label={v.formaPago === 'efectivo' ? '💵 Efectivo' : '💳 QR'}
                    sx={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      bgcolor: v.formaPago === 'efectivo' ? '#e8f5e9' : '#e3f2fd',
                      color: v.formaPago === 'efectivo' ? '#2e7d32' : '#1565c0',
                    }}
                  />
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.9rem' }}>{bolivianos(v.total)}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Tooltip title="Ver ticket">
                      <IconButton size="small" onClick={() => onVerTicket(v)} color="primary">
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Reimprimir ticket">
                      <IconButton size="small" onClick={() => onReimprimir(v)} color="default">
                        <PrintIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}