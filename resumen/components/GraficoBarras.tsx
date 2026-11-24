import { Box, Typography } from '@mui/material';

interface Dato {
  label: string; // 👈 Usaremos 'label' para la fecha
  valor: number; // 👈 Usaremos 'valor' para el monto
}

interface GraficoBarrasProps {
  datos: any[]; // Recibimos los datos crudos del backend
  altura?: number;
  color?: string;
}

export default function GraficoBarras({ datos, altura = 220, color = '#0f172a' }: GraficoBarrasProps) {
  
  // 👇 Normalizamos los datos por si vienen como 'fecha'/'total' o como 'dia'/'ingresos'
  const datosNormalizados: Dato[] = datos.map((d) => {
    // Formatear fecha de "2026-11-23" a "23/11"
    let etiqueta = d.fecha || d.dia || d.label || '';
    if (etiqueta.includes('-')) {
      const [, mes, dia] = etiqueta.split('-');
      etiqueta = `${dia}/${mes}`;
    }
    
    return {
      label: etiqueta,
      valor: Number(d.total || d.ingresos || d.valor) || 0,
    };
  });

  if (!datosNormalizados || datosNormalizados.length === 0) return null;

  const max = Math.max(...datosNormalizados.map((d) => d.valor), 1);
  const totalMes = datosNormalizados.reduce((acc, curr) => acc + curr.valor, 0);

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: { xs: 0.5, sm: 1.5 }, height: altura, pb: 1, borderBottom: '1px solid #e2e8f0' }}>
        {datosNormalizados.map((d, i) => {
          const alturaBarra = (d.valor / max) * 100;
          
          return (
            <Box
              key={`${d.label}-${i}`}
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                height: '100%',
                position: 'relative',
                '&:hover .bar-label': { opacity: 1, transform: 'translateY(0)' },
                '&:hover .barra': { bgcolor: '#2e7d32', opacity: 1 }
              }}
            >
              {/* Monto flotante arriba de la barra */}
              <Box className="bar-label" sx={{
                position: 'absolute',
                top: `${100 - alturaBarra}%`,
                mb: 0.5,
                width: '100%',
                textAlign: 'center',
                opacity: 0,
                transform: 'translateY(5px)',
                transition: 'all 0.2s ease',
                zIndex: 10,
                pointerEvents: 'none'
              }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 800, color: '#fff', bgcolor: '#1e293b', py: 0.2, px: 0.5, borderRadius: 1, display: 'inline-block', whiteSpace: 'nowrap' }}>
                  Bs {d.valor.toFixed(0)}
                </Typography>
              </Box>

              {/* La barra */}
              <Box
                className="barra"
                title={`${d.label}: Bs ${d.valor.toFixed(2)}`}
                sx={{
                  width: '100%',
                  height: `${Math.max(alturaBarra, 2)}%`,
                  bgcolor: color,
                  borderRadius: '6px 6px 0 0',
                  opacity: 0.85,
                  transition: 'all .2s ease',
                  cursor: 'pointer',
                }}
              />
            </Box>
          );
        })}
      </Box>
      
      {/* Etiquetas de abajo (Fechas) */}
      <Box sx={{ display: 'flex', gap: { xs: 0.5, sm: 1.5 }, mt: 1 }}>
        {datosNormalizados.map((d, i) => (
          <Typography
            key={`lbl-${d.label}-${i}`}
            sx={{ flex: 1, textAlign: 'center', fontSize: '0.7rem', fontWeight: 600, color: '#64748b' }}
          >
            {datosNormalizados.length > 16 ? (i % 2 === 0 ? d.label : '') : d.label}
          </Typography>
        ))}
      </Box>
    </Box>
  );
}