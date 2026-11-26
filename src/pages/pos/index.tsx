import { useState, useEffect } from "react";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import MenuCompletoCard from "../../../pos/components/MenuCompleto";
import SoloSopaCard from "../../../pos/components/SoloSopaCard";
import SoloSegundoCard from "../../../pos/components/SoloSegundoCard";
import RefrescosCard from "../../../pos/components/RefrescoCard";
import CarritoResumen from "../../../pos/components/CarritoResumen";
import PageHeader from "../../../pos/components/Encabezado";
import TicketModal from "../../../pos/components/TicketModal";
import {
  cargarMenuDelDia,
  registrarVentaBackend,
} from "../../../pos/lib/apiAdapter";
import { api } from "@/lib/api";
import { ItemCarrito, Modalidad, FormaPago } from "../../../pos/types/posTypes";
import LocalDiningIcon from "@mui/icons-material/LocalDining";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";

export default function POSPension() {
  const [menu, setMenu] = useState<any>(null);
  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);
  const [modalidad, setModalidad] = useState<Modalidad>("local");
  const [formaPago, setFormaPago] = useState<FormaPago>("efectivo");
  const [numeroPedido, setNumeroPedido] = useState<string>("...");
  const [nombrePension, setNombrePension] = useState<string>('"OREGANOS"');

  const [stockSopas, setStockSopas] = useState<Record<string | number, number>>({});
  const [stockSegundos, setStockSegundos] = useState<Record<string | number, number>>({});
  const [stockRefrescos, setStockRefrescos] = useState<Record<string | number, number>>({});

  const [fechaFormateada, setFechaFormateada] = useState<string>("");
  const [horaActual, setHoraActual] = useState<string>("");
  const [ticketAbierto, setTicketAbierto] = useState(false);
  const [ticketData, setTicketData] = useState<any>(null);

  // ✅ CLAVES DE PERSISTENCIA: Cambian cada día automáticamente para reiniciar el stock
  const hoyStr = new Date().toISOString().split("T")[0];
  const storageKeySopas = `pos_stock_sopas_${hoyStr}`;
  const storageKeySegundos = `pos_stock_segundos_${hoyStr}`;
  const storageKeyRefrescos = `pos_stock_refrescos_${hoyStr}`;

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const u = JSON.parse(userStr);
      setNombrePension(`"${u.tenant_nombre || "OREGANOS"}"`);
    }

    cargarMenuDelDia()
      .then((menuAPI) => {
        setMenu(menuAPI);

        const sopasArr = menuAPI.categorias?.["Sopas"]?.platos || menuAPI.categorias?.["Sopa"]?.platos || [];
        const segundosArr = menuAPI.categorias?.["Segundos"]?.platos || menuAPI.categorias?.["Segundo"]?.platos || [];
        const refrescosArr = menuAPI.categorias?.["Refrescos"]?.platos || menuAPI.categorias?.["Bebidas"]?.platos || [];

        const stockInicialSopas: Record<string | number, number> = {};
        sopasArr.forEach((s: any) => { stockInicialSopas[String(s.id)] = s.stock || 0; });
        setStockSopas(stockInicialSopas);

        const stockInicialSegundos: Record<string | number, number> = {};
        segundosArr.forEach((s: any) => { stockInicialSegundos[String(s.id)] = s.stock || 0; });
        setStockSegundos(stockInicialSegundos);
        
        const stockInicialRefrescos: Record<string | number, number> = {};
        refrescosArr.forEach((r: any) => { stockInicialRefrescos[String(r.id)] = r.stock || 0; });
        setStockRefrescos(stockInicialRefrescos);
      })
      .catch((error) => console.error("Error cargando menú:", error));

    const hoyStrAPI = new Date().toISOString().split("T")[0];
    api
      .get("/ventas", { params: { fecha_inicio: hoyStrAPI, fecha_fin: hoyStrAPI } })
      .then((ventasHoy: any) => {
        if (ventasHoy && ventasHoy.length > 0) {
          const ultimoTicket = ventasHoy[0].numero_ticket;
          const match = ultimoTicket.match(/T-(\d+)/);
          setNumeroPedido(
            match && match[1]
              ? (parseInt(match[1], 10) + 1).toString().padStart(3, "0")
              : "001",
          );
        } else {
          setNumeroPedido("001");
        }
      })
      .catch(() => setNumeroPedido("001"));

    const actualizarReloj = () => {
      const ahora = new Date();
      setFechaFormateada(
        ahora.toLocaleDateString("es-ES", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      );
      setHoraActual(
        ahora.toLocaleTimeString("es-ES", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
    };
    actualizarReloj();
    const intervalo = setInterval(actualizarReloj, 60000);
    return () => clearInterval(intervalo);
  }, [storageKeySopas, storageKeySegundos, storageKeyRefrescos]);

  // ✅ CORRECCIÓN: Cada vez que se actualiza el stock, se guarda en localStorage
  const actualizarStockSegundo = (segundoId: string | number, cantidad: number) => {
    setStockSegundos((prev) => {
      const nuevoStock = {
        ...prev,
        [segundoId]: Math.max(0, (prev[segundoId] || 0) + cantidad),
      };
      localStorage.setItem(storageKeySegundos, JSON.stringify(nuevoStock));
      return nuevoStock;
    });
  };

  const actualizarStockSopa = (sopaId: string | number, cantidad: number) => {
    setStockSopas((prev) => {
      const nuevoStock = {
        ...prev,
        [sopaId]: Math.max(0, (prev[sopaId] || 0) + cantidad),
      };
      localStorage.setItem(storageKeySopas, JSON.stringify(nuevoStock));
      return nuevoStock;
    });
  };

  const actualizarStockRefresco = (refrescoId: string | number, cantidad: number) => {
    setStockRefrescos((prev) => {
      const nuevoStock = {
        ...prev,
        [refrescoId]: Math.max(0, (prev[refrescoId] || 0) + cantidad),
      };
      localStorage.setItem(storageKeyRefrescos, JSON.stringify(nuevoStock));
      return nuevoStock;
    });
  };

  const agregarIndividual = (segundo: any) => {
    const idSegundoStr = String(segundo.id);
    if (!menu || (stockSegundos[idSegundoStr] || 0) <= 0) return;
    
    actualizarStockSegundo(idSegundoStr, -1);
    setCarrito((prev) => {
      const existe = prev.find((item) => String(item.id) === idSegundoStr && !item.esCombo);
      if (existe) {
        return prev.map((item) =>
          String(item.id) === idSegundoStr && !item.esCombo
            ? { ...item, cantidad: item.cantidad + 1 }
            : item,
        );
      }
      return [...prev, { ...segundo, cantidad: 1, esCombo: false } as ItemCarrito];
    });
  };

  const agregarSoloSopa = (sopa: any) => {
    const idSopaStr = String(sopa.id);
    if (!menu || (stockSopas[idSopaStr] || 0) <= 0) return;
    
    actualizarStockSopa(idSopaStr, -1);
    setCarrito((prev) => {
      const existe = prev.find((item) => String(item.id) === idSopaStr && !item.esCombo);
      if (existe) {
        return prev.map((item) =>
          String(item.id) === idSopaStr && !item.esCombo
            ? { ...item, cantidad: item.cantidad + 1 }
            : item,
        );
      }
      return [...prev, { ...sopa, cantidad: 1, esCombo: false } as ItemCarrito];
    });
  };

  const agregarCompleto = (segundo: any, sopaElegida?: any) => {
    if (!menu) return;
    const sopasArr =
      menu.categorias?.["Sopas"]?.platos ||
      menu.categorias?.["Sopa"]?.platos ||
      [];

    const sopa =
      sopaElegida ||
      sopasArr.find(
        (s: any) => s.disponible !== false && (stockSopas[String(s.id)] || 0) > 0,
      );

    if (!sopa) {
      alert("No hay sopas disponibles para armar el almuerzo completo.");
      return;
    }

    const idSegundoStr = String(segundo.id);
    const idSopaStr = String(sopa.id);

    if ((stockSegundos[idSegundoStr] || 0) <= 0 || (stockSopas[idSopaStr] || 0) <= 0) {
      alert("No hay stock suficiente para este combo.");
      return;
    }

    actualizarStockSegundo(idSegundoStr, -1);
    actualizarStockSopa(idSopaStr, -1);

    const idCombo = `combo-${idSegundoStr}-${idSopaStr}`;
    const precioCombo = Number(menu.precioCompleto) || Number(segundo.precio) + Number(sopa.precio) || 0;

    setCarrito((prev) => {
      const existe = prev.find((item) => item.id === idCombo);
      if (existe) {
        return prev.map((item) =>
          item.id === idCombo ? { ...item, cantidad: item.cantidad + 1 } : item,
        );
      }
      return [
        ...prev,
        {
          id: idCombo,
          nombre: `Almuerzo: ${sopa.nombre} + ${segundo.nombre}`,
          precio: precioCombo,
          cantidad: 1,
          esCombo: true,
          segundoId: Number(segundo.id), 
          sopaId: Number(sopa.id),       
        } as ItemCarrito,
      ];
    });
  };

  const agregarRefresco = (refresco: any) => {
    const idRefrescoStr = String(refresco.id);
    if (!menu || (stockRefrescos[idRefrescoStr] || 0) <= 0) return;
    
    actualizarStockRefresco(idRefrescoStr, -1);
    setCarrito((prev) => {
      const idCarrito = `refresco-${idRefrescoStr}`;
      const existe = prev.find((item) => item.id === idCarrito);
      if (existe) {
        return prev.map((item) =>
          item.id === idCarrito ? { ...item, cantidad: item.cantidad + 1 } : item,
        );
      }
      return [
        ...prev,
        {
          id: idCarrito,
          nombre: refresco.nombre,
          precio: refresco.precio,
          cantidad: 1,
          esCombo: false,
        } as ItemCarrito,
      ];
    });
  };

  const cambiarCantidad = (item: ItemCarrito, delta: number) => {
    const nuevaCantidad = item.cantidad + delta;
    const idItemStr = String(item.id);

    if (nuevaCantidad <= 0) {
      if (item.segundoId) actualizarStockSegundo(String(item.segundoId), item.cantidad);
      if (item.sopaId) actualizarStockSopa(String(item.sopaId), item.cantidad);
      
      if (idItemStr.startsWith("refresco-")) {
        actualizarStockRefresco(idItemStr.replace("refresco-", ""), item.cantidad);
      } else if (!item.esCombo && stockSopas[idItemStr] !== undefined) {
        actualizarStockSopa(idItemStr, item.cantidad);
      } else if (!item.esCombo && stockSegundos[idItemStr] !== undefined) {
        actualizarStockSegundo(idItemStr, item.cantidad);
      }
      
      setCarrito((prev) => prev.filter((i) => i.id !== item.id));
      return;
    }

    if (delta > 0) {
      if (item.segundoId && (stockSegundos[String(item.segundoId)] || 0) <= 0) {
        alert("No hay stock suficiente de este segundo.");
        return;
      }
      if (item.sopaId && (stockSopas[String(item.sopaId)] || 0) <= 0) {
        alert("No hay stock suficiente de esta sopa.");
        return;
      }
      if (idItemStr.startsWith("refresco-")) {
        const refrescoId = idItemStr.replace("refresco-", "");
        if ((stockRefrescos[refrescoId] || 0) <= 0) {
          alert("No hay stock suficiente de este refresco.");
          return;
        }
      }
      if (!item.esCombo && !idItemStr.startsWith("refresco-") && stockSopas[idItemStr] !== undefined) {
        if ((stockSopas[idItemStr] || 0) <= 0) {
          alert("No hay stock suficiente de esta sopa.");
          return;
        }
      }
      if (!item.esCombo && !idItemStr.startsWith("refresco-") && stockSegundos[idItemStr] !== undefined) {
        if ((stockSegundos[idItemStr] || 0) <= 0) {
          alert("No hay stock suficiente de este segundo.");
          return;
        }
      }

      if (item.segundoId) actualizarStockSegundo(String(item.segundoId), -1);
      if (item.sopaId) actualizarStockSopa(String(item.sopaId), -1);
      
      if (idItemStr.startsWith("refresco-")) {
        actualizarStockRefresco(idItemStr.replace("refresco-", ""), -1);
      } else if (!item.esCombo && stockSopas[idItemStr] !== undefined) {
        actualizarStockSopa(idItemStr, -1);
      } else if (!item.esCombo && stockSegundos[idItemStr] !== undefined) {
        actualizarStockSegundo(idItemStr, -1);
      }
    } else if (delta < 0) {
      if (item.segundoId) actualizarStockSegundo(String(item.segundoId), 1);
      if (item.sopaId) actualizarStockSopa(String(item.sopaId), 1);
      
      if (idItemStr.startsWith("refresco-")) {
        actualizarStockRefresco(idItemStr.replace("refresco-", ""), 1);
      } else if (!item.esCombo && stockSopas[idItemStr] !== undefined) {
        actualizarStockSopa(idItemStr, 1);
      } else if (!item.esCombo && stockSegundos[idItemStr] !== undefined) {
        actualizarStockSegundo(idItemStr, 1);
      }
    }

    setCarrito((prev) =>
      prev.map((i) =>
        i.id === item.id ? { ...i, cantidad: nuevaCantidad } : i,
      ),
    );
  };

  const total = carrito.reduce((sum, item) => {
    const precio = Number(item.precio) || 0;
    const cantidad = Number(item.cantidad) || 0;
    return sum + precio * cantidad;
  }, 0);

  const vaciarPedido = () => {
    carrito.forEach((item) => {
      const idItemStr = String(item.id);
      if (item.segundoId) actualizarStockSegundo(String(item.segundoId), item.cantidad);
      if (item.sopaId) actualizarStockSopa(String(item.sopaId), item.cantidad);
      
      if (idItemStr.startsWith("refresco-")) {
        actualizarStockRefresco(idItemStr.replace("refresco-", ""), item.cantidad);
      } else if (!item.esCombo && stockSopas[idItemStr] !== undefined) {
        actualizarStockSopa(idItemStr, item.cantidad);
      } else if (!item.esCombo && stockSegundos[idItemStr] !== undefined) {
        actualizarStockSegundo(idItemStr, item.cantidad);
      }
    });
    setCarrito([]);
  };

    // ... (mantén todos los useState y funciones de actualizarStock como estaban) ...

  const confirmarPedido = async () => {
    try {
      // 1. Enviar la venta al backend (que ahora descuenta el stock en la BD correctamente)
      const ventaBackend = await registrarVentaBackend(
        carrito,
        modalidad,
        formaPago,
        total,
      );
      
      const numeroTicketReal =
        ventaBackend.numero_ticket || `T-${Date.now().toString().slice(-6)}`;

      setTicketData({
        numeroTicket: numeroTicketReal,
        fecha: new Date(),
        carrito: [...carrito],
        modalidad,
        formaPago,
        total,
      });
      setTicketAbierto(true);
      setCarrito([]);

      const match = numeroTicketReal.match(/T-(\d+)/);
      if (match && match[1]) {
        setNumeroPedido(
          (parseInt(match[1], 10) + 1).toString().padStart(3, "0"),
        );
      }

      // ✅ 2. CLAVE: Recargar el menú desde el backend para obtener el stock REAL actualizado
      const menuActualizado = await cargarMenuDelDia();
      setMenu(menuActualizado);

      // 3. Recalcular los estados de stock con los datos frescos de la BD
      const sopasArr = menuActualizado.categorias?.["Sopas"]?.platos || menuActualizado.categorias?.["Sopa"]?.platos || [];
      const segundosArr = menuActualizado.categorias?.["Segundos"]?.platos || menuActualizado.categorias?.["Segundo"]?.platos || [];
      const refrescosArr = menuActualizado.categorias?.["Refrescos"]?.platos || menuActualizado.categorias?.["Bebidas"]?.platos || [];

      const nuevoStockSopas: Record<string | number, number> = {};
      sopasArr.forEach((s: any) => { nuevoStockSopas[String(s.id)] = s.stock || 0; });
      setStockSopas(nuevoStockSopas);

      const nuevoStockSegundos: Record<string | number, number> = {};
      segundosArr.forEach((s: any) => { nuevoStockSegundos[String(s.id)] = s.stock || 0; });
      setStockSegundos(nuevoStockSegundos);

      const nuevoStockRefrescos: Record<string | number, number> = {};
      refrescosArr.forEach((r: any) => { nuevoStockRefrescos[String(r.id)] = r.stock || 0; });
      setStockRefrescos(nuevoStockRefrescos);

    } catch (error) {
      console.error("Error registrando venta:", error);
      alert("Error al registrar la venta. Intenta de nuevo.");
      vaciarPedido(); // Devuelve el stock al estado local si falló la red
    }
  };

  const cerrarTicket = () => {
    setTicketAbierto(false);
    setTicketData(null);
  };

  if (!menu) {
    return (
      <Box sx={{ p: 4, textAlign: "center", fontSize: "1.2rem" }}>
        Cargando menú del día...
      </Box>
    );
  }

  const sopasDisponibles =
    menu.categorias?.["Sopas"]?.platos?.filter((s: any) => s.disponible !== false) ||
    menu.categorias?.["Sopa"]?.platos?.filter((s: any) => s.disponible !== false) ||
    [];
    
  const segundosDisponibles =
    menu.categorias?.["Segundos"]?.platos?.filter((s: any) => s.disponible !== false) ||
    menu.categorias?.["Segundo"]?.platos?.filter((s: any) => s.disponible !== false) ||
    [];
    
  const listaRefrescos =
    menu.categorias?.["Refrescos"]?.platos ||
    menu.categorias?.["Bebidas"]?.platos ||
    [];

  const totalPlatosDisponibles =
    Object.values(stockSopas).reduce((a, b) => a + b, 0) +
    Object.values(stockSegundos).reduce((a, b) => a + b, 0);
  const totalRefrescosDisponibles = Object.values(stockRefrescos).reduce((a, b) => a + b, 0);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        px: { xs: 2, md: 3 },
        pb: { xs: 2, md: 3 },
        pt: 0,
        background: "linear-gradient(180deg, #F6F1E7 0%, #eef2f7 100%)",
      }}
    >
      <PageHeader
        totalPlatosDisponibles={totalPlatosDisponibles}
        numeroPedido={numeroPedido}
        fechaFormateada={fechaFormateada}
        horaActual={horaActual}
      />
      <Grid container spacing={2} sx={{ alignItems: "flex-start" }}>
        <Grid size={{ xs: 12, md: 7 }}>
          {segundosDisponibles.length > 0 && sopasDisponibles.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <MenuCompletoCard
                segundos={segundosDisponibles}
                stockSegundos={stockSegundos}
                stockSopas={stockSopas}
                sopasDisponibles={sopasDisponibles}
                precioCompleto={menu.precioCompleto || 15}
                onAgregarCompleto={agregarCompleto}
              />
            </Box>
          )}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card elevation={0} sx={{ height: "100%", border: "1px solid #d7ccc8", borderRadius: 2.5 }}>
                <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, mb: 2 }}>
                    <Avatar sx={{ width: 36, height: 36, bgcolor: "#fff", color: "#6d4c41" }}>
                      <RestaurantMenuIcon />
                    </Avatar>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                      Segundos
                    </Typography>
                  </Box>
                  {segundosDisponibles.map((segundo: any) => (
                    <Box key={`segundo-${segundo.id}`} sx={{ mb: 1 }}>
                      <SoloSegundoCard
                        segundo={segundo}
                        stockSegundo={stockSegundos[String(segundo.id)] || 0}
                        onAgregarSegundo={() => agregarIndividual(segundo)}
                      />
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card elevation={0} sx={{ height: "100%", border: "1px solid #fed7aa", borderRadius: 2.5 }}>
                <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, mb: 2 }}>
                    <Avatar sx={{ width: 36, height: 36, bgcolor: "#fff", color: "#ea580c" }}>
                      <LocalDiningIcon />
                    </Avatar>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                      Sopas
                    </Typography>
                  </Box>
                  {sopasDisponibles.map((sopa: any) => {
                    const idSopaStr = String(sopa.id);
                    return (
                      <Box key={`sopa-${idSopaStr}`} sx={{ mb: 1 }}>
                        <SoloSopaCard
                          sopa={sopa}
                          stockSopa={stockSopas[idSopaStr] ?? 0}
                          onAgregarSoloSopa={() => agregarSoloSopa(sopa)}
                        />
                      </Box>
                    );
                  })}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Box sx={{ mt: 2 }}>
            <RefrescosCard
              refrescos={listaRefrescos}
              stockRefrescos={stockRefrescos}
              onAgregarRefresco={agregarRefresco}
              totalDisponibles={totalRefrescosDisponibles}
            />
          </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 5 }} sx={{ position: "sticky", top: 110 }}>
          <CarritoResumen
            carrito={carrito}
            modalidad={modalidad}
            formaPago={formaPago}
            total={total}
            onCambiarModalidad={setModalidad}
            onCambiarFormaPago={setFormaPago}
            onCambiarCantidad={cambiarCantidad}
            onConfirmar={confirmarPedido}
            onVaciar={vaciarPedido}
          />
        </Grid>
      </Grid>
      {ticketData && (
        <TicketModal
          open={ticketAbierto}
          onClose={cerrarTicket}
          numeroTicket={ticketData.numeroTicket}
          fecha={ticketData.fecha}
          carrito={ticketData.carrito}
          modalidad={ticketData.modalidad}
          formaPago={ticketData.formaPago}
          total={ticketData.total}
          nombrePension={nombrePension}
        />
      )}
    </Box>
  );
}