import { Venta } from "../types/ventasTypes";

export const claveFecha = (fecha: Date): string =>
  `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}`;


export function bolivianos(monto: number | string | null | undefined): string {
  const num = Number(monto);
  if (isNaN(num)) return "Bs 0.00";
  return `Bs ${num.toLocaleString("es-BO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
export interface PlatoResumen {
  nombre: string;
  cantidad: number;
  importe: number;
}

export interface ResumenDia {
  total: number;
  tickets: number;
  ticketPromedio: number;
  unidades: number;
  efectivo: number;
  qr: number;
  local: number;
  llevar: number;
  platos: PlatoResumen[];
  ventas: Venta[];
}

export interface ResumenMes {
  total: number;
  tickets: number;
  ticketPromedio: number;
  efectivo: number;
  qr: number;
  local: number;
  llevar: number;
  diasConVenta: number;
  promedioDiario: number;
  mejorDia: { fecha: string; total: number } | null;
  serie: { label: string; valor: number; fecha: string }[];
  platos: PlatoResumen[];
  totalMesAnterior: number;
  variacionPct: number | null;
}

function acumularPlatos(ventas: Venta[]): PlatoResumen[] {
  const mapa = new Map<string, PlatoResumen>();
  ventas.forEach((v) =>
    v.items.forEach((it) => {
      const nombre = it.esCombo
        ? `Completo: ${it.nombre.replace('Menú Completo: Sopa + ', '')}`
        : it.nombre;
      const actual = mapa.get(nombre) ?? { nombre, cantidad: 0, importe: 0 };
      actual.cantidad += it.cantidad;
      actual.importe += it.cantidad * it.precio;
      mapa.set(nombre, actual);
    })
  );
  return Array.from(mapa.values()).sort((a, b) => b.cantidad - a.cantidad);
}

export function calcularResumenDia(ventas: Venta[], fecha: Date): ResumenDia {
  const clave = claveFecha(fecha);
  const delDia = ventas
    .filter((v) => claveFecha(new Date(v.fecha)) === clave)
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

  const total = delDia.reduce((s, v) => s + v.total, 0);
  const unidades = delDia.reduce((s, v) => s + v.items.reduce((a, i) => a + i.cantidad, 0), 0);

  return {
    total,
    tickets: delDia.length,
    ticketPromedio: delDia.length ? total / delDia.length : 0,
    unidades,
    efectivo: delDia.filter((v) => v.formaPago === 'efectivo').reduce((s, v) => s + v.total, 0),
    qr: delDia.filter((v) => v.formaPago === 'qr').reduce((s, v) => s + v.total, 0),
    local: delDia.filter((v) => v.modalidad === 'local').reduce((s, v) => s + v.total, 0),
    llevar: delDia.filter((v) => v.modalidad === 'llevar').reduce((s, v) => s + v.total, 0),
    platos: acumularPlatos(delDia),
    ventas: delDia,
  };
}

export function calcularResumenMes(ventas: Venta[], anio: number, mes: number): ResumenMes {
  const delMes = ventas.filter((v) => {
    const f = new Date(v.fecha);
    return f.getFullYear() === anio && f.getMonth() === mes;
  });

  const fechaAnterior = new Date(anio, mes - 1, 1);
  const mesAnterior = ventas.filter((v) => {
    const f = new Date(v.fecha);
    return f.getFullYear() === fechaAnterior.getFullYear() && f.getMonth() === fechaAnterior.getMonth();
  });

  const total = delMes.reduce((s, v) => s + v.total, 0);
  const totalMesAnterior = mesAnterior.reduce((s, v) => s + v.total, 0);

  const porDia = new Map<string, number>();
  delMes.forEach((v) => {
    const clave = claveFecha(new Date(v.fecha));
    porDia.set(clave, (porDia.get(clave) ?? 0) + v.total);
  });

  const serie = Array.from(porDia.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([fecha, valor]) => ({ fecha, valor, label: String(Number(fecha.slice(-2))) }));

  const mejor = serie.reduce<{ fecha: string; total: number } | null>(
    (max, s) => (!max || s.valor > max.total ? { fecha: s.fecha, total: s.valor } : max),
    null
  );

  return {
    total,
    tickets: delMes.length,
    ticketPromedio: delMes.length ? total / delMes.length : 0,
    efectivo: delMes.filter((v) => v.formaPago === 'efectivo').reduce((s, v) => s + v.total, 0),
    qr: delMes.filter((v) => v.formaPago === 'qr').reduce((s, v) => s + v.total, 0),
    local: delMes.filter((v) => v.modalidad === 'local').reduce((s, v) => s + v.total, 0),
    llevar: delMes.filter((v) => v.modalidad === 'llevar').reduce((s, v) => s + v.total, 0),
    diasConVenta: serie.length,
    promedioDiario: serie.length ? total / serie.length : 0,
    mejorDia: mejor,
    serie,
    platos: acumularPlatos(delMes),
    totalMesAnterior,
    variacionPct: totalMesAnterior > 0 ? ((total - totalMesAnterior) / totalMesAnterior) * 100 : null,
  };
}