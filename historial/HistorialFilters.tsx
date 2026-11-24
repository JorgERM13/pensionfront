import { Box, TextField, Button, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';

type FormaPago = 'efectivo' | 'qr' | 'todas';
type Modalidad = 'local' | 'llevar' | 'todas';

interface HistorialFiltersProps {
  fechaDesde: string;
  fechaHasta: string;
  formaPago: FormaPago;
  modalidad: Modalidad;
  busqueda: string;
  onFechaDesdeChange: (v: string) => void;
  onFechaHastaChange: (v: string) => void;
  onFormaPagoChange: (v: FormaPago) => void;
  onModalidadChange: (v: Modalidad) => void;
  onBusquedaChange: (v: string) => void;
  onLimpiar: () => void;
}

export default function HistorialFilters({
  fechaDesde,
  fechaHasta,
  formaPago,
  modalidad,
  busqueda,
  onFechaDesdeChange,
  onFechaHastaChange,
  onFormaPagoChange,
  onModalidadChange,
  onBusquedaChange,
  onLimpiar,
}: HistorialFiltersProps) {
  return (
    <Box sx={{ mb: 3, p: 3, bgcolor: 'white', borderRadius: 3, border: '1px solid #e6e8eb' }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
        🔍 Filtros de búsqueda
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
        <TextField
          label="Desde"
          type="date"
          size="small"
          value={fechaDesde}
          onChange={(e) => onFechaDesdeChange(e.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
          sx={{ minWidth: 160 }}
        />
        <TextField
          label="Hasta"
          type="date"
          size="small"
          value={fechaHasta}
          onChange={(e) => onFechaHastaChange(e.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
          sx={{ minWidth: 160 }}
        />
        <TextField
          label="Buscar por ticket"
          size="small"
          value={busqueda}
          onChange={(e) => onBusquedaChange(e.target.value)}
          placeholder="Ej: T-123456"
          sx={{ minWidth: 200, flex: 1 }}
        />
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, alignItems: 'center' }}>
        <Box>
          <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', display: 'block', mb: 0.5 }}>
            Forma de pago
          </Typography>
          <ToggleButtonGroup
            value={formaPago}
            exclusive
            onChange={(_e, v) => v && onFormaPagoChange(v)}
            size="small"
          >
            <ToggleButton value="todas">Todas</ToggleButton>
            <ToggleButton value="efectivo">💵 Efectivo</ToggleButton>
            <ToggleButton value="qr">💳 QR</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Box>
          <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', display: 'block', mb: 0.5 }}>
            Tipo de servicio
          </Typography>
          <ToggleButtonGroup
            value={modalidad}
            exclusive
            onChange={(_e, v) => v && onModalidadChange(v)}
            size="small"
          >
            <ToggleButton value="todas">Todas</ToggleButton>
            <ToggleButton value="local">🍽️ En el lugar</ToggleButton>
            <ToggleButton value="llevar">🥡 Para llevar</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Button
          variant="text"
          startIcon={<ClearIcon />}
          onClick={onLimpiar}
          sx={{ ml: 'auto', fontWeight: 'bold' }}
        >
          Limpiar filtros
        </Button>
      </Box>
    </Box>
  );
}