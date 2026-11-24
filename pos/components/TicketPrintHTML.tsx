interface TicketPrintHTMLProps {
  numeroTicket: string;
  fecha: Date;
  carrito: {
    id: string | number;
    nombre: string;
    precio: number;
    cantidad: number;
  }[];
  modalidad: "local" | "llevar";
  formaPago: "efectivo" | "qr";
  total: number;
  nombrePension: string;
}

export function generarHTMLTicket({
  numeroTicket,
  fecha,
  carrito,
  modalidad,
  formaPago,
  total,
  nombrePension,
}: TicketPrintHTMLProps): string {
  const fechaFormateada = fecha.toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const horaFormateada = fecha.toLocaleTimeString("es-PE", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const productosHTML = carrito
    .map((item) => {
      const totalItem = (item.precio * item.cantidad).toFixed(2);

      // Acortar "Menú Completo: Sopa + Lomo Saltado" a "Completo: Lomo Saltado"
      let nombreCorto = item.nombre;
      if (nombreCorto.includes("Menú Completo:")) {
        nombreCorto = nombreCorto.replace("Menú Completo:", "Completo:");
      }

      return `
        <div style="font-size: 11px; margin-bottom: 2px; text-align: left;">
          <span style="font-weight: bold;">${item.cantidad}x</span> ${nombreCorto} - Bs. ${totalItem}
        </div>
      `;
    })
    .join("");

  const textoPago = formaPago === "qr" ? "QR" : "Efectivo";

  return `
        <!-- HEADER: NOMBRE + MODALIDAD EN LA MISMA LÍNEA -->
    <div style="text-align: left; margin-bottom: 4px;">
      <div style="display: inline-flex; align-items: center; gap: 8px; flex-wrap: wrap; justify-content: center;">
        <div style="font-weight: bold; font-size: 13px; letter-spacing: 0.5px;">
          ${nombrePension.toUpperCase()}
        </div>
        
        <div style="display: inline-block; border: 1px solid #000; border-radius: 4px; padding: 2px 8px;">
  <span style="font-size: 8px; font-weight: 900; letter-spacing: 1px; text-transform: uppercase;">
    ${modalidad === "local" ? "COMER AQUÍ" : "PARA LLEVAR"}
  </span>
</div>
      </div>
    </div>

    <div style="border-top: 1px dashed #000; margin: 3px 0;"></div>

    <!-- INFO BÁSICA (etiquetas en negrita) -->
    <div style="font-size: 10px; margin-bottom: 1px;"><span style="font-weight: bold;">Ticket:</span> ${numeroTicket}</div>
    <div style="font-size: 10px; margin-bottom: 1px;"><span style="font-weight: bold;">Fecha:</span> ${fechaFormateada} ${horaFormateada}</div>
    

    <div style="border-top: 1px dashed #000; margin: 3px 0;"></div>

    <!-- ENCABEZADO PRODUCTOS -->
    <div style="font-size: 10px; font-weight: bold; margin-bottom: 3px; text-align: left;">
      CANT - DESCRIPCIÓN - TOTAL
    </div>

    <!-- LISTA DE PRODUCTOS (cantidades en negrita) -->
    ${productosHTML}

    <div style="border-top: 1px dashed #000; margin: 3px 0;"></div>

    <!-- TOTALES -->
    <div style="font-size: 10px; margin-bottom: 1px; text-align: left;">Subtotal: Bs. ${total.toFixed(2)}</div>
    <div style="font-size: 13px; font-weight: bold; margin-bottom: 3px; text-align: left;">TOTAL: Bs. ${total.toFixed(2)}</div>

    <div style="border-top: 1px dashed #000; margin: 3px 0;"></div>

    <!-- FORMA DE PAGO -->
    <div style="border: 1px solid #000; padding: 3px; margin: 3px 0; text-align: left;">
      <div style="font-size: 10px; font-weight: bold;">Forma de pago: ${textoPago}</div>
    </div>

    <!-- FOOTER -->
    <div style="text-align: left; margin-top: 4px;">
      <div style="font-size: 10px; font-weight: bold;">¡Gracias por su preferencia!</div>
    </div>
  `;
}
