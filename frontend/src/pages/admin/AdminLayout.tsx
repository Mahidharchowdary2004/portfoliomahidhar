import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AdminPanel from '../Admin';

const AdminLayout: React.FC = () => {
  const { logout } = useAuth();

  return <AdminPanel onLogout={logout} />;
};

export default AdminLayout;

