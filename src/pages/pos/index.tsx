import { useState, useEffect } from "react";
import { Avatar, Box, Card, CardContent, Grid, Typography } from "@mui/material";
import MenuCompletoCard from "../../../pos/components/MenuCompleto";
import SoloSopaCard from "../../../pos/components/SoloSopaCard";
import SoloSegundoCard from "../../../pos/components/SoloSegundoCard";
import RefrescosCard from "../../../pos/components/RefrescoCard";
import CarritoResumen from "../../../pos/components/CarritoResumen";
import PageHeader from "../../../pos/components/Encabezado";
import TicketModal from "../../../pos/components/TicketModal";
import { cargarMenuDelDia, registrarVentaBackend } from "../../../pos/lib/apiAdapter";
import { api } from "@/lib/api";
import { ItemCarrito, Modalidad, FormaPago } from "../../../pos/types/posTypes";
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';

export default function POSPension() {
  const [menu, setMenu] = useState<any>(null);
  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);
  const [modalidad, setModalidad] = useState<Modalidad>("local");
  const [formaPago, setFormaPago] = useState<FormaPago>("efectivo");
  const [numeroPedido, setNumeroPedido] = useState<string>("...");
  
  // 👇 Nombre del negocio dinámico
  const [nombrePension, setNombrePension] = useState<string>('"OREGANOS"');

  const [stockSegundos, setStockSegundos] = useState<Record<string | number, number>>({});
  const [stockSopa, setStockSopa] = useState<number>(0); 
  const [stockRefrescos, setStockRefrescos] = useState<Record<string | number, number>>({});

  const [fechaFormateada, setFechaFormateada] = useState<string>("");
  const [horaActual, setHoraActual] = useState<string>("");

  const [ticketAbierto, setTicketAbierto] = useState(false);
  const [ticketData, setTicketData] = useState<any>(null);

  useEffect(() => {
    // 0. Leer el nombre del negocio para el ticket
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const u = JSON.parse(userStr);
      setNombrePension(`"${u.tenant_nombre || 'OREGANOS'}"`);
    }

    // 1. Cargar el menú (Adaptado a la nueva estructura de 'categorias')
    cargarMenuDelDia()
      .then((menuAPI) => {
        setMenu(menuAPI);
        
        const sopasArr = menuAPI.categorias?.['Sopas']?.platos || menuAPI.categorias?.['Sopa']?.platos || [];
        const segundosArr = menuAPI.categorias?.['Segundos']?.platos || menuAPI.categorias?.['Segundo']?.platos || [];
        const refrescosArr = menuAPI.categorias?.['Refrescos']?.platos || menuAPI.categorias?.['Bebidas']?.platos || [];

        const sopasDisponibles = sopasArr.filter((s: any) => s.disponible !== false);
        setStockSopa(sopasDisponibles.reduce((acc: number, curr: any) => acc + (curr.stock || 0), 0));
        
        const stockInicialSegundos: Record<string | number, number> = {};
        segundosArr.forEach((s: any) => { stockInicialSegundos[s.id] = s.stock; });
        setStockSegundos(stockInicialSegundos);
        
        const stockInicialRefrescos: Record<string | number, number> = {};
        refrescosArr.forEach((r: any) => { stockInicialRefrescos[r.id] = r.stock || 0; });
        setStockRefrescos(stockInicialRefrescos);
      })
      .catch((error) => console.error("Error cargando menú:", error));

    // 2. Obtener el último ticket de HOY
    const hoyStr = new Date().toISOString().split('T')[0];
    api.get('/ventas', { params: { fecha_inicio: hoyStr, fecha_fin: hoyStr } })
      .then((ventasHoy: any) => {
        if (ventasHoy && ventasHoy.length > 0) {
          const ultimoTicket = ventasHoy[0].numero_ticket; 
          const match = ultimoTicket.match(/T-(\d+)/);
          if (match && match[1]) {
            setNumeroPedido((parseInt(match[1], 10) + 1).toString().padStart(3, '0'));
          } else {
            setNumeroPedido("001");
          }
        } else {
          setNumeroPedido("001");
        }
      })
      .catch(() => setNumeroPedido("001"));

    // 3. Reloj
    const actualizarReloj = () => {
      const ahora = new Date();
      setFechaFormateada(ahora.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
      setHoraActual(ahora.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }));
    };
    actualizarReloj();
    const intervalo = setInterval(actualizarReloj, 60000);
    return () => clearInterval(intervalo);
  }, []);

  const actualizarStockSegundo = (segundoId: string | number, cantidad: number) => {
    setStockSegundos((prev) => ({ ...prev, [segundoId]: Math.max(0, (prev[segundoId] || 0) + cantidad) }));
  };

  const actualizarStockSopa = (cantidad: number) => {
    setStockSopa((prev) => Math.max(0, prev + cantidad));
  };

  const actualizarStockRefresco = (refrescoId: string | number, cantidad: number) => {
    setStockRefrescos((prev) => ({ ...prev, [refrescoId]: Math.max(0, (prev[refrescoId] || 0) + cantidad) }));
  };

  const agregarSoloSopa = (sopaElegida: any) => {
    if (!menu || (sopaElegida.stock || 0) <= 0) return;
    actualizarStockSopa(-1);
    setCarrito((prev) => {
      const idItem = `sopa-sola-${sopaElegida.id}`;
      const existe = prev.find((item) => item.id === idItem);
      if (existe) return prev.map((item) => (item.id === idItem ? { ...item, cantidad: item.cantidad + 1 } : item));
      return [...prev, { id: idItem, nombre: `Solo Sopa: ${sopaElegida.nombre}`, precio: sopaElegida.precio, cantidad: 1, esCombo: false, esSopa: true, sopaId: sopaElegida.id }];
    });
  };

  const agregarIndividual = (segundo: any) => {
    if (!menu || (stockSegundos[segundo.id] || 0) <= 0) return;
    actualizarStockSegundo(segundo.id, -1);
    setCarrito((prev) => {
      const existe = prev.find((item) => item.id === segundo.id);
      if (existe) return prev.map((item) => (item.id === segundo.id ? { ...item, cantidad: item.cantidad + 1 } : item));
      return [...prev, { ...segundo, cantidad: 1, esCombo: false }];
    });
  };

  const agregarCompleto = (segundo: any, sopaElegida?: any) => {
    if (!menu) return;
    const sopasArr = menu.categorias?.['Sopas']?.platos || menu.categorias?.['Sopa']?.platos || [];
    const sopa = sopaElegida || sopasArr.find((s: any) => s.disponible !== false && s.stock > 0);
    
    if (!sopa) { alert("No hay sopas disponibles para armar el almuerzo completo."); return; }
    if ((stockSegundos[segundo.id] || 0) <= 0 || (sopa.stock || 0) <= 0) return;
    
    actualizarStockSegundo(segundo.id, -1);
    actualizarStockSopa(-1);

    const idCombo = `combo-${segundo.id}-${sopa.id}`;
    const precioCombo = menu.precioCompleto || (segundo.precio + sopa.precio);

    setCarrito((prev) => {
      const existe = prev.find((item) => item.id === idCombo);
      if (existe) return prev.map((item) => (item.id === idCombo ? { ...item, cantidad: item.cantidad + 1 } : item));
      return [...prev, { id: idCombo, nombre: `Almuerzo: ${sopa.nombre} + ${segundo.nombre}`, precio: precioCombo, cantidad: 1, esCombo: true, segundoId: segundo.id, sopaId: sopa.id }];
    });
  };

  const agregarRefresco = (refresco: any) => {
    if (!menu || (stockRefrescos[refresco.id] || 0) <= 0) return;
    actualizarStockRefresco(refresco.id, -1);
    setCarrito((prev) => {
      const existe = prev.find((item) => item.id === `refresco-${refresco.id}`);
      if (existe) return prev.map((item) => (item.id === `refresco-${refresco.id}` ? { ...item, cantidad: item.cantidad + 1 } : item));
      return [...prev, { id: `refresco-${refresco.id}`, nombre: refresco.nombre, precio: refresco.precio, cantidad: 1, esCombo: false }];
    });
  };

  const cambiarCantidad = (item: ItemCarrito, delta: number) => {
    if (delta < 0 && item.cantidad === 1) {
      if (item.segundoId) actualizarStockSegundo(item.segundoId, 1);
      if (item.esSopa || item.esCombo) actualizarStockSopa(1);
      if (item.id.toString().startsWith("refresco-")) actualizarStockRefresco(parseInt(item.id.toString().replace("refresco-", "")), 1);
    }
    if (delta > 0) {
      if (item.segundoId && (stockSegundos[item.segundoId] || 0) > 0) actualizarStockSegundo(item.segundoId, -1);
      if (item.esSopa || item.esCombo) {
        if (stockSopa > 0) actualizarStockSopa(-1);
        else return;
      }
      if (item.id.toString().startsWith("refresco-")) {
        const refrescoId = parseInt(item.id.toString().replace("refresco-", ""));
        if ((stockRefrescos[refrescoId] || 0) > 0) actualizarStockRefresco(refrescoId, -1);
      }
    }
    setCarrito((prev) => prev.map((i) => (i.id === item.id ? { ...i, cantidad: i.cantidad + delta } : i)).filter((i) => i.cantidad > 0));
  };

  const total = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);

  const vaciarPedido = () => {
    carrito.forEach((item) => {
      if (item.segundoId) actualizarStockSegundo(item.segundoId, item.cantidad);
      if (item.esSopa || item.esCombo) actualizarStockSopa(item.cantidad);
      if (item.id.toString().startsWith("refresco-")) actualizarStockRefresco(parseInt(item.id.toString().replace("refresco-", "")), item.cantidad);
    });
    setCarrito([]);
  };

  const confirmarPedido = async () => {
    try {
      const ventaBackend = await registrarVentaBackend(carrito, modalidad, formaPago, total);
      const numeroTicketReal = ventaBackend.numero_ticket || `T-${Date.now().toString().slice(-6)}`;
      
      setTicketData({ numeroTicket: numeroTicketReal, fecha: new Date(), carrito: [...carrito], modalidad, formaPago, total });
      setTicketAbierto(true);
      
      vaciarPedido();

      const match = numeroTicketReal.match(/T-(\d+)/);
      if (match && match[1]) {
        setNumeroPedido((parseInt(match[1], 10) + 1).toString().padStart(3, '0'));
      }
    } catch (error) {
      console.error("Error registrando venta:", error);
      alert("Error al registrar la venta. Intenta de nuevo.");
    }
  };

  const cerrarTicket = () => {
    setTicketAbierto(false);
    setTicketData(null);
  };

  if (!menu) {
    return <Box sx={{ p: 4, textAlign: "center", fontSize: "1.2rem" }}>Cargando menú del día...</Box>;
  }

  // 👇 Extraemos las categorías de la nueva estructura
  const sopasDisponibles = menu.categorias?.['Sopas']?.platos?.filter((s: any) => s.disponible !== false) || menu.categorias?.['Sopa']?.platos?.filter((s: any) => s.disponible !== false) || [];
  const segundosDisponibles = menu.categorias?.['Segundos']?.platos?.filter((s: any) => s.disponible !== false) || menu.categorias?.['Segundo']?.platos?.filter((s: any) => s.disponible !== false) || [];
  const listaRefrescos = menu.categorias?.['Refrescos']?.platos || menu.categorias?.['Bebidas']?.platos || [];
  
  const totalPlatosDisponibles = stockSopa + Object.values(stockSegundos).reduce((a, b) => a + b, 0);
  const totalRefrescosDisponibles = Object.values(stockRefrescos).reduce((a, b) => a + b, 0);

  return (
    <Box sx={{
  minHeight: "100vh",
  px: { xs: 2, md: 3 },
  pb: { xs: 2, md: 3 },
  pt: 0,
  background: 'linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%)'
}}>
      
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
                stockSopa={stockSopa}
                sopasDisponibles={sopasDisponibles}
                precioCompleto={menu.precioCompleto || 15}
                onAgregarCompleto={agregarCompleto}
              />
            </Box>
          )}

          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card elevation={0} sx={{ height: '100%', border: '1px solid #d7ccc8', borderRadius: 2.5 }}>
                <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 2 }}>
                    <Avatar sx={{ width: 36, height: 36, bgcolor: '#fff', color: '#6d4c41' }}><RestaurantMenuIcon /></Avatar>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Segundos</Typography>
                  </Box>
                  {segundosDisponibles.map((segundo: any) => (
                    <Box key={`segundo-${segundo.id}`} sx={{ mb: 1 }}>
                      <SoloSegundoCard segundo={segundo} stockSegundo={stockSegundos[segundo.id] || 0} onAgregarSegundo={() => agregarIndividual(segundo)} />
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Card elevation={0} sx={{ height: '100%', border: '1px solid #fed7aa', borderRadius: 2.5 }}>
                <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 2 }}>
                    <Avatar sx={{ width: 36, height: 36, bgcolor: '#fff', color: '#ea580c' }}><LocalDiningIcon /></Avatar>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Sopas</Typography>
                  </Box>
                  {sopasDisponibles.map((sopa: any) => (
                    <Box key={`sopa-${sopa.id}`} sx={{ mb: 1 }}>
                      <SoloSopaCard sopa={sopa} stockSopa={sopa.stock || 0} onAgregarSoloSopa={() => agregarSoloSopa(sopa)} />
                    </Box>
                  ))}
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