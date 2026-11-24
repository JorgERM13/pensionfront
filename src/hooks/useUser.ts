import { useState, useEffect } from 'react';

export interface User {
  nombre?: string;
  tenant_id?: number;
  tenant_nombre?: string;
  tenant_tipo?: string;
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) setUser(JSON.parse(userStr));
    } catch (e) {}
  }, []);

  return {
    user,
    nombrePension: user?.tenant_nombre || 'Mi Negocio',
  };
}
