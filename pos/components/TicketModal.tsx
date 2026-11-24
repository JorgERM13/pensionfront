import {
  Dialog,
  DialogContent,
  DialogTitle,
  Box,
  Button,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PrintIcon from "@mui/icons-material/Print";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import TicketPrint from "./TicketPrint";
import { generarHTMLTicket } from "./TicketPrintHTML";
import { ItemCarrito, Modalidad } from "../types/posTypes";

export type FormaPago = "efectivo" | "qr";

interface TicketModalProps {
  open: boolean;
  onClose: () => void;
  numeroTicket: string;
  fecha: Date;
  carrito: ItemCarrito[];
  modalidad: Modalidad;
  formaPago: FormaPago;
  total: number;
  nombrePension: string;
}

export default function TicketModal({
  open,
  onClose,
  numeroTicket,
  fecha,
  carrito,
  modalidad,
  formaPago,
  total,
  nombrePension,
}: TicketModalProps) {
  const handlePrint = () => {
    const ticketHTML = generarHTMLTicket({
      numeroTicket,
      fecha,
      carrito,
      modalidad,
      formaPago,
      total,
      nombrePension,
    });

    const printWindow = window.open("", "_blank", "width=400,height=600");

    if (!printWindow) {
      alert("Por favor permite las ventanas emergentes para imprimir");
      return;
    }

    printWindow.document.write(`
  <!DOCTYPE html>
  <html>
    <head>
      <title>Ticket - ${numeroTicket}</title>
      <style>
  @page {
    size: 58mm auto;
    margin: 0;
  }
  
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    width: 58mm;
    max-width: 58mm;
    margin: 0;
    padding: 0 1mm;
    font-family: 'Courier New', monospace;
    font-size: 11px;
    color: #000;
    background: white;
    overflow: hidden;
  }

  span, div, p {
    color: #000 !important;
  }
</style>
    </head>
    <body>
      ${ticketHTML}
      <script>
        window.onload = function() {
          setTimeout(function() {
            window.print();
            setTimeout(function() {
              window.close();
            }, 500);
          }, 300);
        }
      </script>
    </body>
  </html>
`);

    printWindow.document.close();
  };

 return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: { xs: 2, sm: 3 },
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          bgcolor: "primary.main",
          color: "white",
          py: { xs: 1.5, sm: 2 },
          px: { xs: 2, sm: 3 },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <CheckCircleIcon sx={{ fontSize: { xs: 22, sm: 24 } }} />
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: "bold",
              fontSize: { xs: '1rem', sm: '1.25rem' }
            }}
          >
            ¡Pedido Registrado!
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: "white" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: { xs: 2, sm: 3 }, bgcolor: "#f5f5f5" }}>
        {/* Vista previa en pantalla (con MUI) */}
        <TicketPrint
          numeroTicket={numeroTicket}
          fecha={fecha}
          carrito={carrito}
          modalidad={modalidad}
          formaPago={formaPago}
          total={total}
          nombrePension={nombrePension}
        />

        <Box
  sx={{
    display: "flex",
    flexDirection: { xs: "column", sm: "row" },
    gap: { xs: 1.5, sm: 2 },
    mt: { xs: 2, sm: 3 },
    alignItems: "center",
  }}
>
  <Button
    variant="contained"
    startIcon={<PrintIcon />}
    onClick={handlePrint}
    sx={{ 
      px: 3, 
      py: 1, 
      fontWeight: "bold",
      fontSize: '0.9rem',
      minWidth: { xs: 220, sm: 'auto' }
    }}
  >
    Imprimir Ticket
  </Button>
  <Button
    variant="outlined"
    onClick={onClose}
    sx={{ 
      px: 3, 
      py: 1, 
      fontWeight: "bold",
      fontSize: '0.9rem',
      minWidth: { xs: 220, sm: 'auto' }
    }}
  >
    Nuevo Pedido
  </Button>
</Box>
      </DialogContent>
    </Dialog>
  );
}
