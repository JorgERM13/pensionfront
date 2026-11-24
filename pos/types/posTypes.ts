export interface Plato {
  id: number | string;       // 👈 Permitir string para IDs temporales "new-123"
  nombre: string;
  precio: number;
  img: string;
  stock: number;
  disponible?: boolean;
  categoria_id?: number;     // 👈 Agregado: necesario para saber la categoría al guardar
}

export interface Sopa {
  id: string;
  nombre: string;
  precio: number;
  img: string;
  stock: number;
  disponible?: boolean;
}

export interface Refresco {
  id: number | string;       // 👈 Permitir string para IDs temporales
  nombre: string;
  precio: number;
  img: string;
  stock: number;
  disponible?: boolean;
  categoria_id?: number;     // 👈 Agregado
}

export type Modalidad = 'local' | 'llevar';
export type FormaPago = 'efectivo' | 'qr';

export interface ItemCarrito {
  id: number | string;
  nombre: string;
  precio: number;
  cantidad: number;
  esCombo: boolean;
  segundoId?: number;
  esSopa?: boolean;
  sopaId?: number | string;
}