import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Button,
  Typography,
  IconButton,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PrintIcon from '@mui/icons-material/Print';
import { ResumenDia, bolivianos } from '../../ventas/lib/resumeUtils'; // 👈 Importamos bolivianos

interface CierreCajaModalProps {
  open: boolean;
  onClose: () => void;
  fecha: Date;
  resumen: ResumenDia;
  nombrePension: string;
}

export default function CierreCajaModal({
  open,
  onClose,
  fecha,
  resumen,
  nombrePension,
}: CierreCajaModalProps) {
  // 👇 Función helper para formatear sin que explote
  const fmt = (n: any) => bolivianos(Number(n) || 0);

  const linea = (label: string, valor: string, destacado = false) => (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.3 }}>
      <Typography sx={{ fontSize: destacado ? '11px' : '9px', fontWeight: destacado ? 'bold' : 400 }}>
        {label}
      </Typography>
      <Typography sx={{ fontSize: destacado ? '11px' : '9px', fontWeight: destacado ? 'bold' : 400 }}>
        {valor}
      </Typography>
    </Box>
  );

  const separador = <Divider sx={{ borderBottomWidth: 1, borderStyle: 'dashed', my: 0.5 }} />;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      slotProps={{ paper: { sx: { borderRadius: 3 } } }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          bgcolor: 'primary.main',
          color: 'white',
          py: 2,
          '@media print': { display: 'none' },
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Cierre de Caja
        </Typography>
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3, bgcolor: '#f5f5f5', '@media print': { p: 0, bgcolor: 'white' } }}>
        <Box
          className="cierre-print"
          sx={{
            width: '100%',
            maxWidth: '58mm',
            mx: 'auto',
            bgcolor: 'white',
            p: 1,
            fontFamily: '"Courier New", monospace',
            color: '#000',
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 0.5 }}>
            <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>
              {nombrePension.toUpperCase()}
            </Typography>
            <Typography sx={{ fontSize: '10px', fontWeight: 'bold' }}>CIERRE DE CAJA</Typography>
            <Typography sx={{ fontSize: '9px' }}>
              {/* 👇 Cambiado a es-BO */}
              {fecha.toLocaleDateString('es-BO', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
            </Typography>
            <Typography sx={{ fontSize: '8px' }}>
              Emitido: {new Date().toLocaleString('es-BO', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
            </Typography>
          </Box>

          {separador}
          {/* 👇 Usamos la función fmt() en vez de .toFixed() */}
          {linea('TOTAL VENDIDO', fmt(resumen.total), true)}
          {linea('Tickets emitidos', String(resumen.tickets))}
          {linea('Platos servidos', String(resumen.unidades))}
          {linea('Ticket promedio', fmt(resumen.ticketPromedio))}
          {separador}

          <Typography sx={{ fontSize: '9px', fontWeight: 'bold', mb: 0.3 }}>POR FORMA DE PAGO</Typography>
          {linea('Efectivo (caja)', fmt(resumen.efectivo))}
          {linea('QR', fmt(resumen.qr))}
          {separador}

          <Typography sx={{ fontSize: '9px', fontWeight: 'bold', mb: 0.3 }}>POR TIPO DE SERVICIO</Typography>
          {linea('En el lugar', fmt(resumen.local))}
          {linea('Para llevar', fmt(resumen.llevar))}
          {separador}

          <Typography sx={{ fontSize: '9px', fontWeight: 'bold', mb: 0.3 }}>PLATOS VENDIDOS</Typography>
          {resumen.platos?.map((p) => (
            <Box key={p.nombre} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.2 }}>
              <Typography sx={{ fontSize: '8px', flex: 1, pr: 0.5, lineHeight: 1.2 }}>{p.nombre}</Typography>
              <Typography sx={{ fontSize: '8px', fontWeight: 'bold' }}>{p.cantidad}</Typography>
            </Box>
          ))}
          {separador}

          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography sx={{ fontSize: '8px' }}>____________________________</Typography>
            <Typography sx={{ fontSize: '8px' }}>Firma del responsable</Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mt: 3, justifyContent: 'center', '@media print': { display: 'none' } }}>
          <Button variant="contained" startIcon={<PrintIcon />} onClick={() => window.print()} sx={{ fontWeight: 'bold' }}>
            Imprimir cierre
          </Button>
          <Button variant="outlined" onClick={onClose} sx={{ fontWeight: 'bold' }}>
            Cerrar
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}