import { Sopa, Plato } from "../types/posTypes";

export const SOPA: Sopa = {
  id: 'sopa',
  nombre: 'Sopa Criolla',
  precio: 5.00,
  img: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=400&q=80',
  stock: 25,
};

export const SEGUNDOS: Plato[] = [
  { 
    id: 1, 
    nombre: 'Lomo Saltado', 
    precio: 10.00, 
    img: 'https://images.unsplash.com/photo-1594041680534-e8c8cdebd659?auto=format&fit=crop&w=400&q=80', 
    stock: 15 
  },
  { 
    id: 2, 
    nombre: 'Ají de Gallina', 
    precio: 10.00, 
    img: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=400&q=80', 
    stock: 8 
  },
  { 
    id: 3, 
    nombre: 'Tallarines Verdes', 
    precio: 9.00, 
    img: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=400&q=80', 
    stock: 3 
  },
];

export const PRECIO_COMPLETO = 12.00;

export interface Refresco {
  id: number;
  nombre: string;
  precio: number;
  img: string;
  stock: number;
}

export const REFRESCOS: Refresco[] = [
  { id: 1, nombre: 'Coca-Cola', precio: 5, img: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=200&q=80', stock: 20 },
  { id: 2, nombre: 'Inca Kola', precio: 5, img: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?auto=format&fit=crop&w=200&q=80', stock: 15 },
  { id: 3, nombre: 'Fanta', precio: 5, img: 'https://images.unsplash.com/photo-1624552184280-9e9631bbeee9?auto=format&fit=crop&w=200&q=80', stock: 18 },
  { id: 4, nombre: 'Sprite', precio: 5, img: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?auto=format&fit=crop&w=200&q=80', stock: 12 },
  { id: 5, nombre: 'Agua', precio: 3, img: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&w=200&q=80', stock: 25 },
  { id: 6, nombre: 'Jugo', precio: 4, img: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=200&q=80', stock: 10 },
];