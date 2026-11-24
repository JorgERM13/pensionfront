import { MenuDia } from '../types/menuTypes';
import { SOPA, SEGUNDOS, REFRESCOS } from '../../pos/data/mockData';

const MENU_KEY = 'pension_menu_v1';

export function obtenerMenu(): MenuDia {
  const menuStr = localStorage.getItem(MENU_KEY);
  
  if (!menuStr) {
    return crearMenuDemo();
  }

  try {
    const menu = JSON.parse(menuStr);
    // Asegurar que tenga refrescos (compatibilidad con versiones anteriores)
    if (!menu.refrescos) {
      menu.refrescos = REFRESCOS;
    }
    return menu;
  } catch {
    return crearMenuDemo();
  }
}

export function guardarMenu(menu: MenuDia): void {
  localStorage.setItem(MENU_KEY, JSON.stringify(menu));
}

export function resetearMenu(): MenuDia {
  const menuDemo = crearMenuDemo();
  guardarMenu(menuDemo);
  return menuDemo;
}

function crearMenuDemo(): MenuDia {
  return {
    id: 'menu-hoy',
    fecha: new Date().toISOString().split('T')[0],
    sopa: SOPA,
    segundos: SEGUNDOS,
    refrescos: REFRESCOS, // 👈 Incluir refrescos en el menú demo
  };
}