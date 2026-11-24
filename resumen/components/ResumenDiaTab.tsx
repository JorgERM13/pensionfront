import {
  Box, Grid, Typography, Card, CardContent, Button, TextField,
  Chip, Divider, LinearProgress, Alert
} from "@mui/material";
import PaymentsIcon from "@mui/icons-material/Payments";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import QrCodeIcon from "@mui/icons-material/QrCode";
import PrintIcon from "@mui/icons-material/Print";
import KpiCard from "./KpiCards";
import TablaTickets from "./TablaTickets";
import CierreCajaModal from "./CierreCajaModal";
import { ResumenDia } from "../../pos/lib/ventasApi";

interface ResumenDiaTabProps {
  fechaSeleccionada: string;
  onFechaChange: (fecha: string) => void;
  resumenDia: ResumenDia | null;
  ventasDia: any[];
  fecha: Date;
  cierreAbierto: boolean;
  setCierreAbierto: (open: boolean) => void;
  loading: boolean;
  error: string;
  bolivianos: (n: number) => string;
  NOMBRE_PENSION: string;
}

export default function ResumenDiaTab({
  fechaSeleccionada,
  onFechaChange,
  resumenDia,
  ventasDia,
  fecha,
  cierreAbierto,
  setCierreAbierto,
  loading,
  error,
  bolivianos,
  NOMBRE_PENSION,
}: ResumenDiaTabProps) {
  
  if (!resumenDia) return null;

  // Calcular porcentaje de efectivo de forma segura
  const pctEfectivoDia = Number(resumenDia.total) 
    ? (Number(resumenDia.efectivo) / Number(resumenDia.total)) * 100 
    : 0;

  return (
    <Box>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {loading && <LinearProgress sx={{ mb: 2 }} />}

      {/* Barra de fecha y botón imprimir */}
      <Card elevation={0} sx={{ mb: 2.5, border: "1px solid #e2e8f0", borderRadius: 2.5 }}>
        <CardContent sx={{ p: { xs: 1.5, sm: 2 }, display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
          <TextField
            type="date"
            size="small"
            label="Fecha"
            value={fechaSeleccionada}
            onChange={(e) => onFechaChange(e.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
            sx={{ minWidth: 180 }}
          />
          <Button
            variant="contained"
            startIcon={<PrintIcon />}
            onClick={() => setCierreAbierto(true)}
            disabled={Number(resumenDia.tickets) === 0}
            sx={{ py: 0.875, fontSize: "0.85rem", fontWeight: 700, textTransform: "none", borderRadius: 1.5, bgcolor: "#1e293b" }}
          >
            Imprimir cierre de caja
          </Button>
        </CardContent>
      </Card>

      {/* KPIs del día */}
      <Grid container spacing={2} sx={{ mb: 2.5 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard titulo="Total vendido" valor={bolivianos(resumenDia.total)} detalle={`${resumenDia.unidades} platos servidos`} icono={<PaymentsIcon />} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard titulo="Tickets emitidos" valor={String(resumenDia.tickets)} detalle="Pedidos cobrados" icono={<ReceiptLongIcon />} color="#1565c0" fondo="#e3f2fd" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard titulo="Ticket promedio" valor={bolivianos(resumenDia.ticketPromedio)} detalle="Gasto por cliente" icono={<TrendingUpIcon />} color="#e65100" fondo="#fff3e0" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard titulo="Cobrado por QR" valor={bolivianos(resumenDia.qr)} detalle={`Efectivo: ${bolivianos(resumenDia.efectivo)}`} icono={<QrCodeIcon />} color="#6a1b9a" fondo="#f3e5f5" />
        </Grid>
      </Grid>

      {/* Tablas y Cuadre */}
      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card elevation={0} sx={{ borderRadius: 2.5, border: "1px solid #e2e8f0" }}>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, color: "#0f172a", fontSize: "1.05rem" }}>
                Detalle de tickets
              </Typography>
              <TablaTickets ventas={ventasDia as any} />
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card elevation={0} sx={{ borderRadius: 2.5, border: "1px solid #e2e8f0", mb: 2.5 }}>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, color: "#0f172a", fontSize: "1.05rem" }}>
                Cuadre de caja
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                <Typography variant="body2" sx={{ color: "#475569", fontWeight: 600 }}>Efectivo</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: "#0f172a" }}>{bolivianos(resumenDia.efectivo)}</Typography>
              </Box>
              <LinearProgress variant="determinate" value={pctEfectivoDia} sx={{ height: 8, borderRadius: 4, mb: 2, bgcolor: "#f1f5f9", "& .MuiLinearProgress-bar": { bgcolor: "#2e7d32" } }} />
              
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                <Typography variant="body2" sx={{ color: "#475569", fontWeight: 600 }}>QR</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: "#0f172a" }}>{bolivianos(resumenDia.qr)}</Typography>
              </Box>
              <LinearProgress variant="determinate" value={100 - pctEfectivoDia} sx={{ height: 8, borderRadius: 4, mb: 2, bgcolor: "#f1f5f9", "& .MuiLinearProgress-bar": { bgcolor: "#00897b" } }} />
              
              <Divider sx={{ my: 2, borderColor: "#e2e8f0" }} />
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography sx={{ fontWeight: 700, color: "#475569" }}>TOTAL</Typography>
                <Typography sx={{ fontWeight: 900, color: "#0f172a", fontSize: "1.1rem" }}>{bolivianos(resumenDia.total)}</Typography>
              </Box>
            </CardContent>
          </Card>

          <Card elevation={0} sx={{ borderRadius: 2.5, border: "1px solid #e2e8f0" }}>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, color: "#0f172a", fontSize: "1.05rem" }}>
                Platos vendidos hoy
              </Typography>
              {resumenDia.platos.length === 0 && (
                <Typography variant="body2" sx={{ color: "#94a3b8", fontStyle: "italic" }}>Sin ventas aún.</Typography>
              )}
              {resumenDia.platos.map((p, i) => (
                <Box key={p.nombre} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.2 }}>
                  <Typography variant="body2" sx={{ flex: 1, pr: 1, color: "#334155", fontWeight: 500 }}>{p.nombre}</Typography>
                  <Chip label={p.cantidad} size="small" sx={{ fontWeight: 700, bgcolor: i === 0 ? "#dcfce7" : "#f1f5f9", color: i === 0 ? "#166534" : "#475569" }} />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <CierreCajaModal
        open={cierreAbierto}
        onClose={() => setCierreAbierto(false)}
        fecha={fecha}
        resumen={resumenDia as any}
        nombrePension={NOMBRE_PENSION}
      />
    </Box>
  );
}