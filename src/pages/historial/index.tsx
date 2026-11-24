import { useEffect, useMemo, useState } from 'react';
import { Box, Typography, Button, Card, CardContent, Grid } from '@mui/material';
import Link from 'next/link';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import HistorialFilters from '../../../historial/HistorialFilters';
import HistorialTabla from '../../../historial/HistorialTabla';
import TicketModal from '../../../pos/components/TicketModal';
import { obtenerVentas } from '../../../ventas/lib/ventasStorage';
import { Venta } from '../../../ventas/types/ventasTypes';
import { bolivianos,claveFecha } from '../../../ventas/lib/resumeUtils';

type FormaPago = 'efectivo' | 'qr' | 'todas';
type Modalidad = 'local' | 'llevar' | 'todas';

const NOMBRE_PENSION = 'La Casa de la Abuela';

export default function HistorialPage() {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [fechaDesde, setFechaDesde] = useState(() => {
    const hoy = new Date();
    hoy.setDate(hoy.getDate() - 7);
    return claveFecha(hoy);
  });
  const [fechaHasta, setFechaHasta] = useState(claveFecha(new Date()));
  const [formaPago, setFormaPago] = useState<FormaPago>('todas');
  const [modalidad, setModalidad] = useState<Modalidad>('todas');
  const [busqueda, setBusqueda] = useState('');
  const [ticketAbierto, setTicketAbierto] = useState(false);
  const [ventaSeleccionada, setVentaSeleccionada] = useState<Venta | null>(null);

  useEffect(() => {
    setVentas(obtenerVentas());
  }, []);

  const ventasFiltradas = useMemo(() => {
    return ventas
      .filter((v) => {
        const fechaVenta = claveFecha(new Date(v.fecha));
        if (fechaVenta < fechaDesde || fechaVenta > fechaHasta) return false;
        if (formaPago !== 'todas' && v.formaPago !== formaPago) return false;
        if (modalidad !== 'todas' && v.modalidad !== modalidad) return false;
        if (busqueda && !v.numeroTicket.toLowerCase().includes(busqueda.toLowerCase())) return false;
        return true;
      })
      .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
  }, [ventas, fechaDesde, fechaHasta, formaPago, modalidad, busqueda]);

  const totales = useMemo(() => {
    const total = ventasFiltradas.reduce((s, v) => s + v.total, 0);
    const efectivo = ventasFiltradas.filter((v) => v.formaPago === 'efectivo').reduce((s, v) => s + v.total, 0);
    const qr = ventasFiltradas.filter((v) => v.formaPago === 'qr').reduce((s, v) => s + v.total, 0);
    return { total, efectivo, qr, tickets: ventasFiltradas.length };
  }, [ventasFiltradas]);

  const limpiarFiltros = () => {
    const hoy = new Date();
    const hace7 = new Date();
    hace7.setDate(hoy.getDate() - 7);
    setFechaDesde(claveFecha(hace7));
    setFechaHasta(claveFecha(hoy));
    setFormaPago('todas');
    setModalidad('todas');
    setBusqueda('');
  };

  const abrirTicket = (venta: Venta) => {
    setVentaSeleccionada(venta);
    setTicketAbierto(true);
  };

  const reimprimirTicket = (venta: Venta) => {
    setVentaSeleccionada(venta);
    setTicketAbierto(true);
    setTimeout(() => window.print(), 300);
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, minHeight: '100vh', bgcolor: '#f8f9fa' }}>
      {/* HEADER */}
      <Box sx={{ mb: 4, pb: 3, borderBottom: '1px solid', borderColor: 'divider', position: 'relative' }}>
        <Box
          sx={{
            position: 'absolute',
            top: -16,
            left: 0,
            right: 0,
            height: 4,
            borderRadius: 2,
            background: 'linear-gradient(90deg, #1565c0 0%, #42a5f5 50%, #90caf9 100%)',
          }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 800, letterSpacing: '-0.5px' }}>
              Historial de Ventas
            </Typography>
            <Typography variant="subtitle1" sx={{ color: 'text.secondary', fontWeight: 500 }}>
              Consulta, busca y reimprime cualquier ticket emitido
            </Typography>
          </Box>
          <Button component={Link} href="/pos" variant="outlined" startIcon={<PointOfSaleIcon />} sx={{ fontWeight: 'bold' }}>
            Ir al POS
          </Button>
        </Box>
      </Box>

      {/* KPIs DEL PERÍODO FILTRADO */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e6e8eb' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                Total del período
              </Typography>
              <Typography sx={{ fontWeight: 800, fontSize: '1.75rem', color: 'primary.main', mt: 1 }}>
                {bolivianos(totales.total)}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {totales.tickets} tickets encontrados
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e6e8eb' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                💵 Cobrado en efectivo
              </Typography>
              <Typography sx={{ fontWeight: 800, fontSize: '1.75rem', color: '#2e7d32', mt: 1 }}>
                {bolivianos(totales.efectivo)}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Dinero en caja
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e6e8eb' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                💳 Cobrado por QR
              </Typography>
              <Typography sx={{ fontWeight: 800, fontSize: '1.75rem', color: '#1565c0', mt: 1 }}>
                {bolivianos(totales.qr)}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Yape / Plin
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e6e8eb' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                Ticket promedio
              </Typography>
              <Typography sx={{ fontWeight: 800, fontSize: '1.75rem', color: '#e65100', mt: 1 }}>
                {bolivianos(totales.tickets ? totales.total / totales.tickets : 0)}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Gasto por cliente
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* FILTROS */}
      <HistorialFilters
        fechaDesde={fechaDesde}
        fechaHasta={fechaHasta}
        formaPago={formaPago}
        modalidad={modalidad}
        busqueda={busqueda}
        onFechaDesdeChange={setFechaDesde}
        onFechaHastaChange={setFechaHasta}
        onFormaPagoChange={setFormaPago}
        onModalidadChange={setModalidad}
        onBusquedaChange={setBusqueda}
        onLimpiar={limpiarFiltros}
      />

      {/* TABLA */}
      <HistorialTabla
        ventas={ventasFiltradas}
        onVerTicket={abrirTicket}
        onReimprimir={reimprimirTicket}
      />

      {/* MODAL DE TICKET */}
      {ventaSeleccionada && (
        <TicketModal
          open={ticketAbierto}
          onClose={() => {
            setTicketAbierto(false);
            setVentaSeleccionada(null);
          }}
          numeroTicket={ventaSeleccionada.numeroTicket}
          fecha={new Date(ventaSeleccionada.fecha)}
          carrito={ventaSeleccionada.items}
          modalidad={ventaSeleccionada.modalidad}
          formaPago={ventaSeleccionada.formaPago}
          total={ventaSeleccionada.total}
          nombrePension={NOMBRE_PENSION}
        />
      )}
    </Box>
  );
}