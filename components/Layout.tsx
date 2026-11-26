import { ReactNode, useState, useEffect } from 'react';
import {
  Box, Drawer, List, ListItem, ListItemButton, ListItemIcon,
  ListItemText, Typography, Avatar, IconButton, Tooltip
} from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import AssessmentIcon from '@mui/icons-material/Assessment';
import HistoryIcon from '@mui/icons-material/History';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { api } from '@/lib/api';

const drawerWidth = 260;
const collapsedWidth = 80;

interface MenuItem {
  text: string;
  icon: ReactNode;
  path: string;
}

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try { setUser(JSON.parse(userStr)); } catch (e) {}
    } else {
      router.push('/login');
    }
    
    const savedState = localStorage.getItem('sidebar_collapsed');
    if (savedState === 'true') setIsCollapsed(true);
  }, [router]);

  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('sidebar_collapsed', String(newState));
  };

   const handleLogout = async () => {
    try { await api.post('/logout'); } catch (error) {}
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const menuItems: MenuItem[] = [
    { text: 'Punto de Venta', icon: <PointOfSaleIcon />, path: '/pos' },
    { text: 'Menú del Día', icon: <RestaurantIcon />, path: '/menu' },
    { text: 'Resumen', icon: <AssessmentIcon />, path: '/resumen' },
  
  ];
     return (
    <Box sx={{ display: 'flex', bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: isCollapsed ? collapsedWidth : drawerWidth,
          flexShrink: 0,
          whiteSpace: 'nowrap',
          boxSizing: 'border-box',
          '& .MuiDrawer-paper': {
            width: isCollapsed ? collapsedWidth : drawerWidth,
            transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            overflowX: 'hidden',
            // 👇 FONDO VERDE OLIVA OSCURO (Elegante y natural)
            bgcolor: '#3D3B2A', 
            borderRight: '1px solid #4F4D3A',
            color: '#D8C3A5' 
          },
        }}
      >
        {/* HEADER DEL SIDEBAR */}
        <Box sx={{ 
          display: 'flex', alignItems: 'center', justifyContent: isCollapsed ? 'center' : 'space-between',
          p: 2, minHeight: 72, borderBottom: '1px solid rgba(216, 195, 165, 0.1)' // Borde beige sutil
        }}>
          {!isCollapsed && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
              {/* Logo con Terracota */}
              <Avatar sx={{ bgcolor: '#C66B3D', width: 38, height: 38, borderRadius: 2, boxShadow: '0 4px 8px rgba(198, 107, 61, 0.3)' }}>
                <RestaurantIcon sx={{ fontSize: 22, color: '#FFFFFF' }} />
              </Avatar>
              <Box sx={{ minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                <Typography noWrap sx={{ fontWeight: 800, color: '#D8C3A5', letterSpacing: '-0.3px', fontSize: '1rem', lineHeight: 1.1 }}>
                  {user?.tenant_nombre || 'Mi Negocio'}
                </Typography>
                {/* Subtítulo con Verde Oliva */}
                <Typography noWrap sx={{ color: '#6B7B3A', fontWeight: 800, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '1px', mt: 0.5 }}>
                  Kitchen POS
                </Typography>
              </Box>
            </Box>
          )}
          {isCollapsed && (
             <Avatar sx={{ bgcolor: '#C66B3D', width: 38, height: 38, borderRadius: 2, boxShadow: '0 4px 8px rgba(198, 107, 61, 0.3)' }}>
               <RestaurantIcon sx={{ fontSize: 22, color: '#FFFFFF' }} />
             </Avatar>
          )}
          {!isCollapsed && (
            <IconButton onClick={toggleCollapse} size="small" sx={{ color: '#D8C3A5', '&:hover': { color: '#FFFFFF', bgcolor: 'rgba(216, 195, 165, 0.1)' } }}>
              <ChevronLeftIcon />
            </IconButton>
          )}
        </Box>

        {/* BOTÓN PARA EXPANDIR (Replegado) */}
        {isCollapsed && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, mb: 1 }}>
            <IconButton onClick={toggleCollapse} size="small" sx={{ color: '#D8C3A5', bgcolor: 'rgba(216, 195, 165, 0.05)', '&:hover': { color: '#FFFFFF', bgcolor: 'rgba(216, 195, 165, 0.15)' } }}>
              <MenuIcon fontSize="small" />
            </IconButton>
          </Box>
        )}

        {/* MENÚ DE NAVEGACIÓN */}
        <List sx={{ px: isCollapsed ? 1 : 2, py: 2, flexGrow: 1 }}>
          {menuItems.map((item) => {
            const isActive = router.pathname === item.path || router.pathname.startsWith(item.path + '/');
            return (
              <ListItem disablePadding sx={{ mb: 0.5 }} key={item.text}>
                <Tooltip title={isCollapsed ? item.text : ''} placement="right" arrow>
                  <ListItemButton
                    onClick={(e) => {
                      e.preventDefault();
                      if (router.pathname !== item.path) router.push(item.path);
                    }}
                    sx={{
                      minHeight: 48, 
                      justifyContent: isCollapsed ? 'center' : 'initial',
                      px: isCollapsed ? 0 : 2,
                      borderRadius: '0 8px 8px 0', 
                      // 👇 ESTADO ACTIVO: Fondo Verde Oliva sutil, borde Terracota
                      bgcolor: isActive ? 'rgba(107, 123, 58, 0.25)' : 'transparent',
                      borderLeft: isActive ? '3px solid #C66B3D' : '3px solid transparent',
                      // 👇 Texto activo en Beige, inactivo un poco más apagado
                      color: isActive ? '#D8C3A5' : 'rgba(216, 195, 165, 0.6)',
                      '&:hover': {
                        bgcolor: isActive ? 'rgba(107, 123, 58, 0.3)' : 'rgba(216, 195, 165, 0.08)',
                        color: '#D8C3A5',
                        '& .MuiListItemIcon-root': { color: isActive ? '#C66B3D' : '#D8C3A5' },
                      },
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <ListItemIcon sx={{ 
                      minWidth: 0, mr: isCollapsed ? 0 : 2,
                      justifyContent: 'center',
                      // 👇 Icono activo en Terracota
                      color: isActive ? '#C66B3D' : 'rgba(216, 195, 165, 0.6)', 
                      transition: 'color 0.2s'
                    }}>
                      {item.icon}
                    </ListItemIcon>
                    {!isCollapsed && (
                      <ListItemText
                        primary={item.text}
                        slotProps={{ 
                          primary: { 
                            sx: { 
                              fontWeight: isActive ? 700 : 500, 
                              fontSize: '0.9rem', 
                              letterSpacing: '0.2px' 
                            } 
                          } 
                        }}
                      />
                    )}
                  </ListItemButton>
                </Tooltip>
              </ListItem>
            );
          })}
        </List>

        {/* PERFIL Y LOGOUT */}
        <Box sx={{ p: 2, borderTop: '1px solid rgba(216, 195, 165, 0.1)' }}>
          <Box sx={{ 
            display: 'flex', alignItems: 'center', gap: 1.5, mb: 2, 
            justifyContent: isCollapsed ? 'center' : 'flex-start'
          }}>
            <Tooltip title={isCollapsed ? user?.nombre || '' : ''} placement="right" arrow>
              {/* Avatar en beige con letra oliva */}
              <Avatar sx={{ bgcolor: '#D8C3A5', fontWeight: 800, width: 38, height: 38, fontSize: '0.95rem', color: '#3D3B2A' }}>
                {user?.nombre?.charAt(0).toUpperCase()}
              </Avatar>
            </Tooltip>
            {!isCollapsed && (
              <Box sx={{ minWidth: 0 }}>
                <Typography noWrap sx={{ fontWeight: 600, color: '#D8C3A5', lineHeight: 1.2, fontSize: '0.85rem' }}>
                  {user?.nombre}
                </Typography>
                {/* Rol en Terracota */}
                <Typography noWrap sx={{ color: '#C66B3D', fontWeight: 700, display: 'block', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.5px', mt: 0.3 }}>
                  {user?.tenant_tipo === 'pension' ? 'Administrador' : 'Cajero'}
                </Typography>
              </Box>
            )}
          </Box>
          
          <Tooltip title={isCollapsed ? "Cerrar Sesión" : ''} placement="right" arrow>
            <ListItemButton
              onClick={handleLogout}
              sx={{
                borderRadius: 1.5,
                justifyContent: isCollapsed ? 'center' : 'initial',
                px: isCollapsed ? 0 : 2,
                py: 1,
                color: '#C66B3D', 
                '&:hover': { bgcolor: 'rgba(198, 107, 61, 0.15)', color: '#E58A61' }
              }}
            >
              <ListItemIcon sx={{ minWidth: 0, mr: isCollapsed ? 0 : 2, justifyContent: 'center', color: 'inherit' }}>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              {!isCollapsed && (
                <ListItemText
                  primary="Cerrar Sesión"
                  slotProps={{ primary: { sx: { fontWeight: 600, fontSize: '0.85rem' } } }}
                />
              )}
            </ListItemButton>
          </Tooltip>
        </Box>
      </Drawer>

      {/* CONTENIDO PRINCIPAL */}
      <Box component="main" sx={{ 
        flexGrow: 1,
        px: { xs: 2, md: 4 },
        pb: { xs: 2, md: 4 },
        pt: 3, 
        bgcolor: '#f8fafc', 
        minHeight: '100vh',
        width: '100%',
        overflowX: 'hidden'
      }}>
        {children}
      </Box>
    </Box>
  );
  
  
}