import { ItemCarrito, Modalidad } from "../../pos/types/posTypes";

export type FormaPago = 'efectivo' | 'qr';

export interface Venta {
  id: string;
  numeroTicket: string;
  fecha: string;
  items: ItemCarrito[];
  modalidad: Modalidad;
  formaPago: FormaPago;
  total: number;
}