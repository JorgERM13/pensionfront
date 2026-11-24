import { Venta } from '../types/ventasTypes';
import { generarVentasDemo } from './mockVentas';

const KEY = 'pension_ventas_v1';

export function obtenerVentas(): Venta[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) {
      const demo = generarVentasDemo();
      window.localStorage.setItem(KEY, JSON.stringify(demo));
      return demo;
    }
    return JSON.parse(raw) as Venta[];
  } catch {
    return [];
  }
}

export function guardarVenta(venta: Venta): void {
  const ventas = obtenerVentas();
  ventas.push(venta);
  window.localStorage.setItem(KEY, JSON.stringify(ventas));
}

export function reiniciarDemo(): Venta[] {
  const demo = generarVentasDemo();
  window.localStorage.setItem(KEY, JSON.stringify(demo));
  return demo;
}