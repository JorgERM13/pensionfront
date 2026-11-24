import { Plato, Sopa, Refresco } from '../../pos/types/posTypes';

export interface MenuDia {
  id?: string;
  fecha: string;
  sopas: Sopa[];       // 👈 CAMBIO CLAVE: Ahora es una lista (array)
  segundos: Plato[];
  refrescos: Refresco[];
   precio_completo: number; 
  activo?: boolean;
}