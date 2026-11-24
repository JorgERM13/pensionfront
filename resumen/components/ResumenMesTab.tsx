import { Box, Grid, Typography, Card, CardContent, IconButton, LinearProgress, Alert } from "@mui/material";
import PaymentsIcon from "@mui/icons-material/Payments";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import KpiCard from "./KpiCards";
import GraficoBarras from "./GraficoBarras";
import { ResumenMes } from "../../pos/lib/ventasApi";

interface ResumenMesTabProps {
  resumenMes: ResumenMes | null;
  mesOffset: number;
  setMesOffset: (offset: number) => void;
  nombreMes: string;
  loading: boolean;
  error: string;
  bolivianos: (n: number) => string;
}

export default function ResumenMesTab({
  resumenMes,
  mesOffset,
  setMesOffset,
  nombreMes,
  loading,
  error,
  bolivianos,
}: ResumenMesTabProps) {
  if (!resumenMes) return null;

  // 👇 Calculamos el total del mes sumando la serie
  const totalMes = resumenMes.serie.reduce((sum, d) => sum + Number(d.total), 0);

  return (
    <Box>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {loading && <LinearProgress sx={{ mb: 2 }} />}

      {/* Selector de mes */}
      <Card elevation={0} sx={{ mb: 2.5, border: "1px solid #e2e8f0", borderRadius: 2.5 }}>
        <CardContent sx={{ p: { xs: 1.5, sm: 2 }, display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
          <IconButton onClick={() => setMesOffset(mesOffset - 1)} sx={{ bgcolor: "#f1f5f9" }}>
            <ChevronLeftIcon />
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: 800, textTransform: "capitalize", minWidth: 220, textAlign: "center", color: "#0f172a" }}>
            {nombreMes}
          </Typography>
          <IconButton onClick={() => setMesOffset(Math.min(0, mesOffset + 1))} disabled={mesOffset >= 0} sx={{ bgcolor: "#f1f5f9" }}>
            <ChevronRightIcon />
          </IconButton>
        </CardContent>
      </Card>

      {/* KPIs del mes */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <Grid container spacing={2.5} sx={{ maxWidth: 1200, width: '95%' }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <KpiCard titulo="Ventas del mes" valor={bolivianos(resumenMes.total)} detalle={resumenMes.variacionPct !== null ? `${resumenMes.variacionPct >= 0 ? "▲" : "▼"} ${Math.abs(resumenMes.variacionPct).toFixed(1)}% vs mes anterior` : "Sin datos del mes anterior"} icono={<PaymentsIcon />} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <KpiCard titulo="Promedio por día" valor={bolivianos(resumenMes.promedioDiario)} detalle={`${resumenMes.diasConVenta} días con venta`} icono={<TrendingUpIcon />} color="#e65100" fondo="#fff3e0" />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <KpiCard titulo="Tickets del mes" valor={String(resumenMes.tickets)} detalle={`Ticket prom: ${bolivianos(resumenMes.ticketPromedio)}`} icono={<ReceiptLongIcon />} color="#1565c0" fondo="#e3f2fd" />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <KpiCard
              titulo="Mejor día"
              valor={resumenMes.mejorDia ? bolivianos(resumenMes.mejorDia.total) : "—"}
              detalle={resumenMes.mejorDia ? new Date(`${resumenMes.mejorDia.fecha}T12:00:00`).toLocaleDateString("es-BO", { day: "2-digit", month: "long" }) : ""}
              icono={<TrendingUpIcon />}
              color="#6a1b9a"
              fondo="#f3e5f5"
            />
          </Grid>
        </Grid>
      </Box>

      {/* Gráfico de Ventas por Día (Única tarjeta) */}
      <Card elevation={0} sx={{ borderRadius: 2.5, border: "1px solid #e2e8f0", mb: 2.5 }}>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a", fontSize: "1.05rem" }}>
                Ventas por día
              </Typography>
              <Typography variant="body2" sx={{ color: "#64748b", fontSize: "0.8rem" }}>
                Total acumulado en el gráfico: <strong>Bs {totalMes.toFixed(2)}</strong>
              </Typography>
            </Box>
          </Box>
          
          {resumenMes.serie && resumenMes.serie.length > 0 ? (
            <GraficoBarras datos={resumenMes.serie} />
          ) : (
            <Typography sx={{ color: "#94a3b8", py: 4, textAlign: "center", fontStyle: "italic" }}>
              Sin ventas en este mes.
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Ranking y Composición */}
      <Grid container spacing={2.5} sx={{ justifyContent: "center" }}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Card elevation={0} sx={{ borderRadius: 2.5, border: "1px solid #e2e8f0", height: "100%" }}>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, color: "#0f172a", fontSize: "1.05rem" }}>Ranking de platos</Typography>
              {resumenMes.platos.slice(0, 8).map((p, i) => {
                const maxCant = resumenMes.platos[0]?.cantidad ?? 1;
                return (
                  <Box key={p.nombre} sx={{ mb: 1.5 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.4 }}>
                      <Typography variant="body2" sx={{ fontWeight: i === 0 ? 700 : 400, color: "#334155" }}>{i + 1}. {p.nombre}</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: "#0f172a" }}>{p.cantidad} · {bolivianos(p.importe)}</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={(p.cantidad / maxCant) * 100} sx={{ height: 6, borderRadius: 3, bgcolor: "#f1f5f9", opacity: i === 0 ? 1 : 0.6, "& .MuiLinearProgress-bar": { bgcolor: i === 0 ? "#2e7d32" : "#6d4c41", borderRadius: 3 } }} />
                  </Box>
                );
              })}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Card elevation={0} sx={{ borderRadius: 2.5, border: "1px solid #e2e8f0", height: "100%" }}>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, color: "#0f172a", fontSize: "1.05rem" }}>Composición de ingresos</Typography>
              {[
                { label: "Efectivo", valor: resumenMes.efectivo, color: "#2e7d32" },
                { label: "QR", valor: resumenMes.qr, color: "#00897b" },
                { label: "En el lugar", valor: resumenMes.local, color: "#e65100" },
                { label: "Para llevar", valor: resumenMes.llevar, color: "#6d4c41" },
              ].map((row) => (
                <Box key={row.label} sx={{ mb: 2 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.4 }}>
                    <Typography variant="body2" sx={{ color: "#475569", fontWeight: 600 }}>{row.label}</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: "#0f172a" }}>{bolivianos(row.valor)}</Typography>
                  </Box>
                  <Box sx={{ height: 8, borderRadius: 4, bgcolor: "#f1f5f9" }}>
                    <Box sx={{ height: "100%", borderRadius: 4, bgcolor: row.color, width: `${resumenMes.total ? (row.valor / resumenMes.total) * 100 : 0}%`, transition: "width 0.3s ease" }} />
                  </Box>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}