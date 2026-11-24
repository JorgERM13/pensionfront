import { useEffect, useState } from "react";
import { Box, Typography, Card, Tabs, Tab, Button, Avatar } from "@mui/material";
import Link from "next/link";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import RestaurantIcon from "@mui/icons-material/Restaurant";

// Importamos los nuevos componentes
import ResumenDiaTab from "../../../resumen/components/ResumenDiaTab";
import ResumenMesTab from "../../../resumen/components/ResumenMesTab";

// Importamos la API
import {
  obtenerResumenDia,
  obtenerResumenMes,
  obtenerVentasDia,
  ResumenDia,
  ResumenMes,
} from "../../../pos/lib/ventasApi";

import { useUser } from "@/hooks/useUser";

const bolivianos = (n: number) =>
  `Bs ${(n || 0).toLocaleString("es-BO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const claveFecha = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export default function ResumenPage() {
  const { nombrePension } = useUser();
  // Mantiene el formato con comillas que usaba el componente de cierre
  const NOMBRE_PENSION = `"${nombrePension}"`;

  const [tab, setTab] = useState(0);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(claveFecha(new Date()));
  const [mesOffset, setMesOffset] = useState(0);
  const [cierreAbierto, setCierreAbierto] = useState(false);

  const [resumenDia, setResumenDia] = useState<ResumenDia | null>(null);
  const [resumenMes, setResumenMes] = useState<ResumenMes | null>(null);
  const [ventasDia, setVentasDia] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fecha = new Date(fechaSeleccionada + "T12:00:00");
  const hoy = new Date();
  const mesFecha = new Date(hoy.getFullYear(), hoy.getMonth() + mesOffset, 1);
  const nombreMes = mesFecha.toLocaleDateString("es-BO", { month: "long", year: "numeric" });

  // Cargar Día
  useEffect(() => {
    if (tab !== 0) return;
    setLoading(true);
    setError("");

    (async () => {
      try {
        const resumen = await obtenerResumenDia(fechaSeleccionada);
        setResumenDia(resumen);

        const ventas = await obtenerVentasDia(fechaSeleccionada);
        setVentasDia(ventas);
      } catch (err) {
        setError("No se pudo cargar el resumen del día.");
      } finally {
        setLoading(false);
      }
    })();
  }, [fechaSeleccionada, tab]);

  // Cargar Mes
  useEffect(() => {
    if (tab !== 1) return;
    setLoading(true);
    setError("");

    (async () => {
      try {
        const resumen = await obtenerResumenMes(mesFecha.getFullYear(), mesFecha.getMonth() + 1);
        setResumenMes(resumen);
      } catch (err) {
        setError("No se pudo cargar el resumen del mes.");
      } finally {
        setLoading(false);
      }
    })();
  }, [mesOffset, tab]);

  return (
    <Box sx={{ minHeight: "100vh", p: { xs: 2, md: 3 }, background: "linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%)" }}>

      {/* HEADER */}
      <Box sx={{ mb: 2.5, px: { xs: 2, sm: 3 }, py: { xs: 1.5, sm: 2 }, borderRadius: 2.5, border: "1px solid #e2e8f0", background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)", position: "relative", overflow: "hidden" }}>
        <Box sx={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, #2e7d32 0%, #6d4c41 33%, #e65100 66%, #00897b 100%)" }} />
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar sx={{ bgcolor: "#1e293b", width: 46, height: 46, borderRadius: 2 }}>
              <RestaurantMenuIcon sx={{ fontSize: 26 }} />
            </Avatar>
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="h5" sx={{ fontWeight: 800, color: "#0f172a" }}>Resumen de Ventas</Typography>
                <Box component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, px: 0.75, py: 0.25, borderRadius: 1, bgcolor: "#fef3c7", color: "#92400e", fontSize: "0.65rem", fontWeight: 800, textTransform: "uppercase" }}>
                  <RestaurantIcon sx={{ fontSize: 12 }} /> {nombrePension}
                </Box>
              </Box>
              <Typography variant="body2" sx={{ color: "#64748b", fontSize: "0.8rem" }}>Control diario y mensual de ingresos</Typography>
            </Box>
          </Box>
          <Link href="/pos" style={{ textDecoration: "none" }}>
            <Button variant="contained" startIcon={<PointOfSaleIcon />} sx={{ bgcolor: "#1e293b", fontWeight: 700, textTransform: "none", "&:hover": { bgcolor: "#0f172a" } }}>
              Ir al POS
            </Button>
          </Link>
        </Box>
      </Box>

      {/* TABS */}
      <Card elevation={0} sx={{ mb: 2.5, border: "1px solid #e2e8f0", borderRadius: 2.5, overflow: "hidden" }}>
        <Tabs value={tab} onChange={(_e, v) => setTab(v)} variant="fullWidth" sx={{ "& .MuiTab-root": { fontWeight: 700, textTransform: "none", py: 1.75, color: "#64748b", "&.Mui-selected": { color: "#0f172a" } }, "& .MuiTabs-indicator": { bgcolor: "#1e293b", height: 3 } }}>
          <Tab label="Cierre del día" />
          <Tab label="Resumen mensual" />
        </Tabs>
      </Card>

      {/* CONTENIDO SEGÚN TAB */}
      {tab === 0 ? (
        <ResumenDiaTab
          fechaSeleccionada={fechaSeleccionada}
          onFechaChange={setFechaSeleccionada}
          resumenDia={resumenDia}
          ventasDia={ventasDia}
          fecha={fecha}
          cierreAbierto={cierreAbierto}
          setCierreAbierto={setCierreAbierto}
          loading={loading}
          error={error}
          bolivianos={bolivianos}
          NOMBRE_PENSION={NOMBRE_PENSION}
        />
      ) : (
        <ResumenMesTab
          resumenMes={resumenMes}
          mesOffset={mesOffset}
          setMesOffset={setMesOffset}
          nombreMes={nombreMes}
          loading={loading}
          error={error}
          bolivianos={bolivianos}
        />
      )}
    </Box>
  );
}