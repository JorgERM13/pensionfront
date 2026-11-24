import { Venta,FormaPago } from "../types/ventasTypes";
import { ItemCarrito, Modalidad } from "../../pos/types/posTypes";
import { SOPA,SEGUNDOS,PRECIO_COMPLETO } from '../../pos/data/mockData';

function mulberry32(semilla: number) {
  return () => {
    semilla |= 0;
    semilla = (semilla + 0x6d2b79f5) | 0;
    let t = Math.imul(semilla ^ (semilla >>> 15), 1 | semilla);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function generarVentasDemo(): Venta[] {
  const rand = mulberry32(20261113);
  const ventas: Venta[] = [];
  const hoy = new Date();

  for (let d = 60; d >= 0; d--) {
    const dia = new Date(hoy);
    dia.setDate(hoy.getDate() - d);
    if (dia.getDay() === 0) continue;

    const esHoy = d === 0;
    const cantidadTickets = esHoy ? 14 + Math.floor(rand() * 5) : 30 + Math.floor(rand() * 25);
    const fechaClave = `${dia.getFullYear()}${String(dia.getMonth() + 1).padStart(2, '0')}${String(dia.getDate()).padStart(2, '0')}`;

    for (let i = 0; i < cantidadTickets; i++) {
      const items: ItemCarrito[] = [];
      const lineas = 1 + Math.floor(rand() * 2);

      for (let l = 0; l < lineas; l++) {
        const tipo = rand();
        const segundo = SEGUNDOS[Math.floor(rand() * SEGUNDOS.length)];
        const cantidad = rand() > 0.8 ? 2 : 1;

        if (tipo < 0.62) {
          items.push({
            id: `combo-${segundo.id}`,
            nombre: `Menú Completo: Sopa + ${segundo.nombre}`,
            precio: PRECIO_COMPLETO,
            cantidad,
            esCombo: true,
            segundoId: segundo.id,
          });
        } else if (tipo < 0.87) {
          items.push({
            id: segundo.id,
            nombre: segundo.nombre,
            precio: segundo.precio,
            cantidad,
            esCombo: false,
            segundoId: segundo.id,
          });
        } else {
          items.push({
            id: 'sopa-sola',
            nombre: `Solo Sopa: ${SOPA.nombre}`,
            precio: SOPA.precio,
            cantidad,
            esCombo: false,
            esSopa: true,
          });
        }
      }

      const total = items.reduce((s, it) => s + it.precio * it.cantidad, 0);
      const fechaVenta = new Date(dia);
      fechaVenta.setHours(11 + Math.floor(rand() * 4), Math.floor(rand() * 60), 0, 0);

      const formaPago: FormaPago = rand() < 0.58 ? 'efectivo' : 'qr';
      const modalidad: Modalidad = rand() < 0.72 ? 'local' : 'llevar';

      ventas.push({
        id: `demo-${fechaClave}-${i}`,
        numeroTicket: `T-${fechaClave}-${String(i + 1).padStart(3, '0')}`,
        fecha: fechaVenta.toISOString(),
        items,
        modalidad,
        formaPago,
        total,
      });
    }
  }

  return ventas;
}