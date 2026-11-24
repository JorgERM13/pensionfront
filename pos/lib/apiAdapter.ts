import { api } from "@/lib/api";

export interface PlatoPOS {
  id: number;
  nombre: string;
  precio: number;
  img?: string;
  stock: number;
  disponible?: boolean;
  categoria_id?: number;
  // 👇 NUEVO: Arreglo para guardar los adicionales (ej. papas, queso extra)
  adicionales?: { id: string | number; nombre: string; precio: number; }[];
}

export interface MenuPOS {
  id: string;
  fecha: string;
  categorias: Record<string, { id: number; platos: PlatoPOS[] }>;
  precioCompleto: number;
}

export async function cargarMenuDelDia(): Promise<MenuPOS> {
  console.log("🔄 Iniciando carga de datos desde la API...");

  const safeGet = async (url: string, params: any = {}) => {
    try {
      const data = await api.get(url, { params });
      return data;
    } catch (e) {
      console.warn(`⚠️ Error en GET ${url}:`, e);
      return null;
    }
  };

  try {
    const menuBackend = await safeGet("/menu/hoy");
    const platosBackend = (await safeGet("/platos")) || [];
    const categoriasBackend = (await safeGet("/categorias")) || [];

    // Mapa para saber el nombre de la categoría por su ID
    const categoriaMap: Record<number, string> = {};
    categoriasBackend.forEach((cat: any) => {
      categoriaMap[cat.id] = cat.nombre;
    });

    // Agrupar platos dinámicamente por categoría
    const categoriasDinamicas: Record<string, { id: number; platos: PlatoPOS[] }> = {};

    platosBackend.forEach((p: any) => {
      const nombreCat = p.categoria?.nombre || categoriaMap[p.categoria_id] || "Otros";
      
      if (!categoriasDinamicas[nombreCat]) {
        categoriasDinamicas[nombreCat] = { id: p.categoria_id, platos: [] };
      }

      // 👇 LÓGICA DE ADICIONALES (Simulada por ahora)
      // Si el plato es una hamburguesa, le agregamos papas como adicional
      let listaAdicionales = [];
      if (p.nombre.toLowerCase().includes("hamburguesa")) {
        listaAdicionales.push({ id: "papas", nombre: "Papas Fritas", precio: 7 });
      }

      categoriasDinamicas[nombreCat].platos.push({
        id: p.id,
        nombre: p.nombre,
        precio: Number(p.precio) || 0,
        img: p.imagen ? `http://127.0.0.1:8000/storage/${p.imagen}` : undefined,
        stock: Number(p.stock) || 0,
        disponible: p.disponible !== false,
        categoria_id: p.categoria_id,
        adicionales: listaAdicionales // 👈 Se guardan los adicionales
      });
    });

    console.log("✅ CATEGORÍAS CARGADAS:", Object.keys(categoriasDinamicas));

    return {
      id: menuBackend?.id?.toString() || "menu-hoy",
      fecha: menuBackend?.fecha || new Date().toISOString().split("T")[0],
      categorias: categoriasDinamicas,
      precioCompleto: menuBackend?.precio_completo ? Number(menuBackend.precio_completo) : 0,
    };
  } catch (error) {
    console.error("💥 Error fatal en adaptador:", error);
    throw error;
  }
}

export async function registrarVentaBackend(
  carrito: any[],
  modalidad: string,
  formaPago: string,
  total: number
) {
  const items = carrito
    .filter((item) => item.cantidad > 0)
    .map((item) => {
      const baseItem: any = {
        nombre: String(item.nombre).slice(0, 100),
        precio_unitario: Number(item.precio) || 0,
        cantidad: Number(item.cantidad) || 1,
        es_combo: Boolean(item.esCombo),
        es_sopa: Boolean(item.esSopa),
      };

      const itemId = String(item.id || "");
      let platoId: number | null = null;

      // 👇 NUEVA LÓGICA PARA EXTRAER EL PLATO_ID
      if (item.platoId) {
        // Si el POS ya nos dio el ID base (ej. al agregar con papas)
        platoId = Number(item.platoId);
      } else if (itemId.startsWith("combo-")) {
        // Es un combo, no lleva plato_id simple
      } else if (itemId.startsWith("sopa-sola-")) {
        platoId = parseInt(itemId.replace("sopa-sola-", ""), 10);
      } else if (itemId.startsWith("refresco-")) {
        platoId = parseInt(itemId.replace("refresco-", ""), 10);
      } else if (itemId.startsWith("plato-")) {
        // Formato: plato-12 o plato-12-papas
        const parts = itemId.split("-");
        if (parts.length >= 2) {
          platoId = parseInt(parts[1], 10);
        }
      } else {
        // Por si viene el ID numérico directo
        const numId = Number(item.id);
        if (!isNaN(numId) && numId > 0) platoId = numId;
      }

      if (platoId !== null && !isNaN(platoId)) {
        baseItem.plato_id = platoId;
      }

      return baseItem;
    });

  if (items.length === 0) {
    throw new Error("El carrito está vacío.");
  }

  console.log("🔴 PAYLOAD A ENVIAR:", JSON.stringify({ modalidad, forma_pago: formaPago, items }, null, 2));

  const response = await api.post("/ventas", { modalidad, forma_pago: formaPago, items });
  return response;
}