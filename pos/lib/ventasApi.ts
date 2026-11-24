import { api } from "@/lib/api";

export interface PlatoResumen {
  nombre: string;
  cantidad: number;
  importe: number;
}

export interface ResumenDia {
  fecha: string;
  total: number;
  tickets: number;
  unidades: number;
  ticketPromedio: number;
  efectivo: number;
  qr: number;
  local: number;
  llevar: number;
  platos: PlatoResumen[];
}

export interface SerieDia {
  fecha: string;
  total: number;
  tickets: number;
}

export interface ResumenMes {
  total: number;
  tickets: number;
  promedioDiario: number;
  diasConVenta: number;
  ticketPromedio: number;
  variacionPct: number | null;
  mejorDia: SerieDia | null;
  serie: SerieDia[];
  platos: PlatoResumen[];
  efectivo: number;
  qr: number;
  local: number;
  llevar: number;
}

const resumenVacio = (fecha: string): ResumenDia => ({
  fecha,
  total: 0,
  tickets: 0,
  unidades: 0,
  ticketPromedio: 0,
  efectivo: 0,
  qr: 0,
  local: 0,
  llevar: 0,
  platos: [],
});

// ============ DÍA ============
export async function obtenerResumenDia(fecha: string): Promise<ResumenDia> {
  try {
    // 👇 api.get devuelve el JSON directo (NO .data)
    const resumen: any = await api.get("/reportes/resumen", {
      params: { fecha_inicio: fecha, fecha_fin: fecha },
    });

    console.log("📦 Resumen recibido:", resumen);

    // Salvavidas: si no llega la estructura esperada
    if (!resumen || typeof resumen !== "object" || !("ingresos_totales" in resumen)) {
      console.warn("⚠️ Estructura inesperada, devolviendo resumen vacío");
      return resumenVacio(fecha);
    }

    let productos: any[] = [];
    try {
      const prod: any = await api.get("/reportes/productos-mas-vendidos", {
        params: { dias: 1 },
      });
      productos = Array.isArray(prod) ? prod : [];
    } catch (e) {
      console.warn("⚠️ Error cargando productos:", e);
    }

    return {
      fecha,
      total: Number(resumen.ingresos_totales) || 0,
      tickets: Number(resumen.total_ventas) || 0,
      unidades: productos.reduce(
        (s: number, p: any) => s + Number(p.total_vendido || 0),
        0
      ),
      ticketPromedio: Number(resumen.ticket_promedio) || 0,
      efectivo: Number(resumen.ventas_por_pago?.efectivo) || 0,
      qr: Number(resumen.ventas_por_pago?.qr) || 0,
      local: Number(resumen.ventas_por_modalidad?.local) || 0,
      llevar: Number(resumen.ventas_por_modalidad?.llevar) || 0,
      platos: productos.map((p: any) => ({
        nombre: p.nombre || "",
        cantidad: Number(p.total_vendido) || 0,
        importe: Number(p.total_ingresos) || 0,
      })),
    };
  } catch (err) {
    console.error("❌ Error obtenerResumenDia:", err);
    return resumenVacio(fecha);
  }
}

// ============ MES ============
export async function obtenerResumenMes(
  year: number,
  month: number
): Promise<ResumenMes> {
  const inicio = `${year}-${String(month).padStart(2, "0")}-01`;
  const ultimoDia = new Date(year, month, 0).getDate();
  const fin = `${year}-${String(month).padStart(2, "0")}-${String(ultimoDia).padStart(2, "0")}`;

  const hoy = new Date();
  const dias =
    hoy.getFullYear() === year && hoy.getMonth() + 1 === month
      ? hoy.getDate()
      : ultimoDia;

  let resumen: any = {};
  let serieRaw: any[] = [];
  let productos: any[] = [];

  // 👇 Cada llamada en try/catch propio para no romper si una falla
  try {
    resumen = await api.get("/reportes/resumen", {
      params: { fecha_inicio: inicio, fecha_fin: fin },
    });
    console.log("📦 Resumen mes:", resumen);
  } catch (e) {
    console.error("❌ Error resumen mes:", e);
  }

  try {
    const serieRes: any = await api.get("/reportes/ventas-por-dia", {
      params: { dias },
    });
    serieRaw = Array.isArray(serieRes) ? serieRes : [];
  } catch (e) {
    console.error("❌ Error serie mes:", e);
  }

  try {
    const prodRes: any = await api.get("/reportes/productos-mas-vendidos", {
      params: { dias },
    });
    productos = Array.isArray(prodRes) ? prodRes : [];
  } catch (e) {
    console.error("❌ Error productos mes:", e);
  }

  const serie: SerieDia[] = serieRaw.map((d: any) => ({
    fecha: d.dia || d.fecha || "",
    total: Number(d.ingresos) || 0,
    tickets: Number(d.total_ventas) || 0,
  }));

  const total = Number(resumen?.ingresos_totales) || 0;
  const tickets = Number(resumen?.total_ventas) || 0;
  const diasConVenta = serie.length;

  const mejorDia =
    serie.length > 0
      ? serie.reduce((best, d) => (d.total > best.total ? d : best))
      : null;

  return {
    total,
    tickets,
    promedioDiario: diasConVenta > 0 ? total / diasConVenta : 0,
    diasConVenta,
    ticketPromedio: Number(resumen?.ticket_promedio) || 0,
    variacionPct: null,
    mejorDia,
    serie,
    platos: productos.map((p: any) => ({
      nombre: p.nombre || "",
      cantidad: Number(p.total_vendido) || 0,
      importe: Number(p.total_ingresos) || 0,
    })),
    efectivo: Number(resumen?.ventas_por_pago?.efectivo) || 0,
    qr: Number(resumen?.ventas_por_pago?.qr) || 0,
    local: Number(resumen?.ventas_por_modalidad?.local) || 0,
    llevar: Number(resumen?.ventas_por_modalidad?.llevar) || 0,
  };
}

// ============ VENTAS DEL DÍA ============
export async function obtenerVentasDia(fecha: string) {
  try {
    const ventas: any = await api.get("/ventas", {
      params: {
        fecha_inicio: fecha,
        fecha_fin: fecha,
        estado: "completada",
      },
    });
    return Array.isArray(ventas) ? ventas : [];
  } catch (err) {
    console.error("❌ Error obtenerVentasDia:", err);
    return [];
  }
}